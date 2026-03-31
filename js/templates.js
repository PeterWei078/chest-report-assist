// ChestScope Helper — Template Engine: Parsing, Rendering, Resolving

(function() {
  'use strict';

  var PLACEHOLDER_RE = /\[([^\]]+)\]/g;

  // Date patterns to detect date placeholders
  var DATE_PATTERNS = ['YYYY/MM/DD', 'YYYY-MM-DD', 'MM/DD/YYYY', 'date'];

  // Global counter for unique placeholder IDs across all parseTemplate calls
  var globalIdCounter = 0;

  // Classify a placeholder's content
  function classifyPlaceholder(content) {
    // Check for date
    for (var i = 0; i < DATE_PATTERNS.length; i++) {
      if (content.toUpperCase() === DATE_PATTERNS[i].toUpperCase()) {
        return { type: 'date', hint: content };
      }
    }

    // Check for dropdown: contains "/" and segments are short
    if (content.indexOf('/') !== -1) {
      var segments = content.split('/');
      var allShort = segments.every(function(s) {
        return s.trim().split(/\s+/).length <= 5;
      });
      if (allShort && segments.length >= 2) {
        return {
          type: 'dropdown',
          options: segments.map(function(s) { return s.trim(); })
        };
      }
    }

    // Check for numeric input (single letter like "x" or short hint)
    if (content.length <= 3 && /^[a-z0-9]+$/i.test(content)) {
      return { type: 'number', hint: content };
    }

    // Default: free text input
    return { type: 'text', hint: content };
  }

  // Parse a template string into segments
  function parseTemplate(text) {
    var segments = [];
    var lastIndex = 0;
    var match;

    // Reset regex
    PLACEHOLDER_RE.lastIndex = 0;

    while ((match = PLACEHOLDER_RE.exec(text)) !== null) {
      // Text before this placeholder
      if (match.index > lastIndex) {
        segments.push({
          type: 'text',
          value: text.substring(lastIndex, match.index)
        });
      }

      var content = match[1];
      var classification = classifyPlaceholder(content);
      var segment = {
        id: 'ph-' + (globalIdCounter++),
        value: null,
        raw: match[0]
      };

      if (classification.type === 'dropdown') {
        segment.type = 'dropdown';
        segment.options = classification.options;
      } else if (classification.type === 'date') {
        segment.type = 'date';
        segment.hint = classification.hint;
      } else if (classification.type === 'number') {
        segment.type = 'number';
        segment.hint = classification.hint;
      } else {
        segment.type = 'input';
        segment.hint = classification.hint;
      }

      segments.push(segment);
      lastIndex = match.index + match[0].length;
    }

    // Remaining text after last placeholder
    if (lastIndex < text.length) {
      segments.push({
        type: 'text',
        value: text.substring(lastIndex)
      });
    }

    return segments;
  }

  // Render parsed segments into a DOM container
  function renderTemplate(segments, container) {
    container.innerHTML = '';
    container.classList.add('finding-template-text');

    segments.forEach(function(seg) {
      if (seg.type === 'text') {
        var span = document.createElement('span');
        span.textContent = seg.value;
        container.appendChild(span);

      } else if (seg.type === 'dropdown') {
        var chip = document.createElement('span');
        chip.className = 'placeholder placeholder-dropdown';
        chip.dataset.id = seg.id;
        chip.dataset.type = 'dropdown';
        chip.dataset.options = JSON.stringify(seg.options);
        chip.textContent = seg.options.join('/');
        chip.title = 'Click to select';
        chip.tabIndex = 0;

        if (seg.value !== null) {
          chip.textContent = seg.value;
          chip.classList.add('filled');
        }

        container.appendChild(chip);

      } else if (seg.type === 'date') {
        var dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.className = 'placeholder-date';
        dateInput.dataset.id = seg.id;
        dateInput.dataset.type = 'date';
        if (seg.value) {
          dateInput.value = seg.value;
        }
        container.appendChild(dateInput);

      } else if (seg.type === 'number') {
        var numInput = document.createElement('input');
        numInput.type = 'text';
        numInput.inputMode = 'numeric';
        numInput.className = 'placeholder-input';
        numInput.dataset.id = seg.id;
        numInput.dataset.type = 'number';
        numInput.placeholder = seg.hint;
        numInput.style.width = '50px';
        if (seg.value) {
          numInput.value = seg.value;
          numInput.classList.add('filled');
        }
        container.appendChild(numInput);

      } else if (seg.type === 'input') {
        var textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.className = 'placeholder-input';
        textInput.dataset.id = seg.id;
        textInput.dataset.type = 'text';
        textInput.placeholder = seg.hint;
        // Auto-size based on hint length
        textInput.style.width = Math.max(60, Math.min(300, seg.hint.length * 9)) + 'px';
        if (seg.value) {
          textInput.value = seg.value;
          textInput.classList.add('filled');
        }
        container.appendChild(textInput);
      }
    });

    return container;
  }

  // Resolve segments to plain text
  function resolveSegments(segments) {
    return segments.map(function(seg) {
      if (seg.type === 'text') {
        return seg.value;
      }
      if (seg.value !== null && seg.value !== '') {
        return seg.value;
      }
      // Unfilled placeholder
      return seg.raw || '[___]';
    }).join('');
  }

  // Read current values from DOM back into segments
  function syncSegmentsFromDOM(segments, container) {
    segments.forEach(function(seg) {
      if (seg.type === 'text') return;

      if (seg.type === 'dropdown') {
        var chip = container.querySelector('[data-id="' + seg.id + '"]');
        if (chip && chip.classList.contains('filled')) {
          seg.value = chip.textContent;
        }
      } else if (seg.type === 'date') {
        var dateEl = container.querySelector('[data-id="' + seg.id + '"]');
        if (dateEl && dateEl.value) {
          seg.value = dateEl.value;
        }
      } else {
        var inputEl = container.querySelector('[data-id="' + seg.id + '"]');
        if (inputEl && inputEl.value) {
          seg.value = inputEl.value;
        }
      }
    });
    return segments;
  }

  // Export
  window.ChestScope = window.ChestScope || {};
  window.ChestScope.Templates = {
    parseTemplate: parseTemplate,
    renderTemplate: renderTemplate,
    resolveSegments: resolveSegments,
    syncSegmentsFromDOM: syncSegmentsFromDOM,
    classifyPlaceholder: classifyPlaceholder
  };
})();
