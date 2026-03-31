// ChestScope Helper — Main App Controller

(function() {
  'use strict';

  var Storage = window.ChestScope.Storage;
  var Templates = window.ChestScope.Templates;
  var Report = window.ChestScope.Report;
  var UI = window.ChestScope.UI;
  var Search = window.ChestScope.Search;

  // App state
  var state = {
    templates: null,
    activeCategory: null,
    selectedSubcategories: [],   // array of subcategory ids
    parsedFindings: {},          // subcategoryId -> parsed segments array
    parsedTechnique: null,       // parsed segments for technique
    parsedImpressions: {},       // subcategoryId -> parsed segments array
    parsedInterventional: {},    // subcategoryId -> parsed segments array
    searchQuery: '',
    activeTag: null
  };

  // ===== Initialization =====
  function init() {
    state.templates = Storage.getMergedTemplates();
    Search.buildIndex(state.templates);

    // We just set date to today for convenience, without tying to preferences
    document.getElementById('field-date').value = getTodayStr();

    renderCategories();
    renderTags();
    UI.initModals();
    bindEvents();
  }

  function getTodayStr() {
    var d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  // ===== Render Categories =====
  function renderCategories() {
    var container = document.getElementById('category-list');
    container.innerHTML = '';

    state.templates.categories.forEach(function(cat) {
      var btn = document.createElement('button');
      btn.className = 'category-btn';
      btn.dataset.categoryId = cat.id;
      btn.innerHTML =
        '<span class="cat-icon">' + cat.icon + '</span>' +
        '<span><strong>' + cat.nameEn + '</strong>' +
        '<span class="cat-name-zh">' + cat.nameZh + '</span></span>';

      btn.addEventListener('click', function() {
        selectCategory(cat.id);
      });

      container.appendChild(btn);
    });
  }

  // ===== Select Category =====
  function selectCategory(categoryId) {
    state.activeCategory = categoryId;
    state.selectedSubcategories = [];
    state.parsedFindings = {};
    state.parsedTechnique = null;
    state.parsedImpressions = {};
    state.parsedInterventional = {};

    // Update active button
    document.querySelectorAll('.category-btn').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.categoryId === categoryId);
    });

    // Show report content
    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('report-content').classList.remove('hidden');

    // Set report title
    var cat = getCategory(categoryId);
    document.getElementById('report-title').textContent = cat.reportTitle;

    // Render technique
    renderTechnique(cat);

    // Render subcategories
    renderSubcategories();

    // Clear findings
    clearFindings();

    // Update preview
    updatePreview();
  }

  function getCategory(id) {
    return state.templates.categories.find(function(c) { return c.id === id; });
  }

  function getSubcategory(categoryId, subId) {
    var cat = getCategory(categoryId);
    if (!cat) return null;
    return cat.subcategories.find(function(s) { return s.id === subId; });
  }

  // ===== Render Technique =====
  function renderTechnique(cat) {
    var container = document.getElementById('technique-content');
    state.parsedTechnique = Templates.parseTemplate(cat.defaultTechnique);
    Templates.renderTemplate(state.parsedTechnique, container);
    bindPlaceholderEvents(container);
  }

  // ===== Render Subcategories =====
  function renderSubcategories() {
    var container = document.getElementById('subcategory-list');
    container.innerHTML = '';

    var cat = getCategory(state.activeCategory);
    if (!cat) return;

    var visibleIds = null;
    if (state.searchQuery || state.activeTag) {
      visibleIds = Search.searchIds(state.searchQuery, {
        categoryId: state.activeCategory,
        tag: state.activeTag
      });
    }

    var shown = 0;
    cat.subcategories.forEach(function(sub) {
      // Filter by search/tag
      if (visibleIds !== null && visibleIds.indexOf(sub.id) === -1) {
        return;
      }

      shown++;
      var item = document.createElement('label');
      item.className = 'subcategory-item';
      if (state.selectedSubcategories.indexOf(sub.id) !== -1) {
        item.classList.add('checked');
      }

      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = state.selectedSubcategories.indexOf(sub.id) !== -1;
      checkbox.dataset.subId = sub.id;

      checkbox.addEventListener('change', function() {
        toggleSubcategory(sub.id, checkbox.checked);
        item.classList.toggle('checked', checkbox.checked);
      });

      var label = document.createElement('span');
      label.className = 'subcategory-label';
      label.innerHTML =
        '<span class="name-en">' + sub.nameEn + '</span>' +
        '<span class="name-zh">' + sub.nameZh + '</span>';

      item.appendChild(checkbox);
      item.appendChild(label);
      container.appendChild(item);
    });

    if (shown === 0) {
      container.innerHTML = '<div class="no-results">No matching subcategories</div>';
    }
  }

  // ===== Toggle Subcategory =====
  function toggleSubcategory(subId, checked) {
    if (checked) {
      if (state.selectedSubcategories.indexOf(subId) === -1) {
        state.selectedSubcategories.push(subId);
      }
      addFindingBlock(subId);
    } else {
      state.selectedSubcategories = state.selectedSubcategories.filter(function(id) {
        return id !== subId;
      });
      removeFindingBlock(subId);
    }

    // Show/hide findings empty state
    var emptyState = document.getElementById('findings-empty');
    if (emptyState) {
      emptyState.classList.toggle('hidden', state.selectedSubcategories.length > 0);
    }

    // Show/hide impression empty state
    var impEmpty = document.getElementById('impression-empty');
    if (impEmpty) {
      impEmpty.classList.toggle('hidden', state.selectedSubcategories.length > 0);
    }

    updateInterventionalVisibility();
    updatePreview();
  }

  // ===== Add Finding Block =====
  function addFindingBlock(subId) {
    var sub = getSubcategory(state.activeCategory, subId);
    if (!sub) return;

    var container = document.getElementById('findings-container');

    // Parse & render findings
    var findingsSegments = Templates.parseTemplate(sub.findings || '');
    state.parsedFindings[subId] = findingsSegments;

    var block = document.createElement('div');
    block.className = 'finding-block';
    block.dataset.subId = subId;

    // Header
    var header = document.createElement('div');
    header.className = 'finding-block-header';

    var title = document.createElement('span');
    title.className = 'finding-block-title';
    title.textContent = sub.nameEn;

    var removeBtn = document.createElement('button');
    removeBtn.className = 'finding-block-remove';
    removeBtn.innerHTML = '&times;';
    removeBtn.title = 'Remove';
    removeBtn.addEventListener('click', function() {
      // Uncheck checkbox
      var cb = document.querySelector('input[data-sub-id="' + subId + '"]');
      if (cb) {
        cb.checked = false;
        cb.closest('.subcategory-item').classList.remove('checked');
      }
      toggleSubcategory(subId, false);
    });

    header.appendChild(title);
    header.appendChild(removeBtn);
    block.appendChild(header);

    // Template content
    var content = document.createElement('div');
    content.className = 'finding-template-text';
    Templates.renderTemplate(findingsSegments, content);
    bindPlaceholderEvents(content);
    block.appendChild(content);

    container.appendChild(block);

    // Parse impression
    if (sub.impression) {
      state.parsedImpressions[subId] = Templates.parseTemplate(sub.impression);
      renderImpressionBlock(subId, sub);
    }

    // Parse interventional
    if (sub.interventional) {
      state.parsedInterventional[subId] = Templates.parseTemplate(sub.interventional);
    }
  }

  // ===== Render Impression Block =====
  function renderImpressionBlock(subId, sub) {
    var container = document.getElementById('impression-container');

    var block = document.createElement('div');
    block.className = 'finding-block';
    block.dataset.impSubId = subId;
    block.style.padding = '10px 14px';

    var title = document.createElement('div');
    title.className = 'section-subtitle';
    title.textContent = sub.nameEn;
    block.appendChild(title);

    var content = document.createElement('div');
    content.className = 'finding-template-text';
    Templates.renderTemplate(state.parsedImpressions[subId], content);
    bindPlaceholderEvents(content);
    block.appendChild(content);

    container.appendChild(block);
  }

  // ===== Remove Finding Block =====
  function removeFindingBlock(subId) {
    // Remove findings block
    var block = document.querySelector('.finding-block[data-sub-id="' + subId + '"]');
    if (block) block.remove();

    // Remove impression block
    var impBlock = document.querySelector('[data-imp-sub-id="' + subId + '"]');
    if (impBlock) impBlock.remove();

    // Remove interventional block
    var intBlock = document.querySelector('[data-int-sub-id="' + subId + '"]');
    if (intBlock) intBlock.remove();

    delete state.parsedFindings[subId];
    delete state.parsedImpressions[subId];
    delete state.parsedInterventional[subId];
  }

  // ===== Interventional Visibility =====
  function updateInterventionalVisibility() {
    var section = document.getElementById('interventional-section');
    var container = document.getElementById('interventional-container');

    var hasInterventional = false;
    state.selectedSubcategories.forEach(function(subId) {
      var sub = getSubcategory(state.activeCategory, subId);
      if (sub && sub.interventional) {
        hasInterventional = true;
      }
    });

    if (hasInterventional) {
      section.classList.remove('hidden');
      container.innerHTML = '';

      state.selectedSubcategories.forEach(function(subId) {
        var sub = getSubcategory(state.activeCategory, subId);
        if (sub && sub.interventional) {
          if (!state.parsedInterventional[subId]) {
            state.parsedInterventional[subId] = Templates.parseTemplate(sub.interventional);
          }

          var block = document.createElement('div');
          block.className = 'finding-block';
          block.dataset.intSubId = subId;

          var title = document.createElement('div');
          title.className = 'section-subtitle';
          title.textContent = sub.nameEn;
          block.appendChild(title);

          var content = document.createElement('div');
          content.className = 'finding-template-text';
          Templates.renderTemplate(state.parsedInterventional[subId], content);
          bindPlaceholderEvents(content);
          block.appendChild(content);

          container.appendChild(block);
        }
      });
    } else {
      section.classList.add('hidden');
    }
  }

  // ===== Clear Findings =====
  function clearFindings() {
    document.getElementById('findings-container').innerHTML =
      '<div class="empty-state" id="findings-empty" style="padding: 20px;">' +
      '<span class="empty-hint">Select subcategories from the left panel to add findings</span></div>';

    document.getElementById('impression-container').innerHTML =
      '<div class="empty-state" id="impression-empty" style="padding: 10px;">' +
      '<span class="empty-hint">Impression will auto-populate from selected findings</span></div>';

    document.getElementById('interventional-container').innerHTML = '';
    document.getElementById('interventional-section').classList.add('hidden');
  }

  // ===== Render Tags =====
  function renderTags() {
    var container = document.getElementById('tag-list');
    container.innerHTML = '';

    state.templates.tags.forEach(function(tag) {
      var chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.textContent = tag.label;
      chip.dataset.tagId = tag.id;

      chip.addEventListener('click', function() {
        if (state.activeTag === tag.id) {
          state.activeTag = null;
          chip.classList.remove('active');
        } else {
          state.activeTag = tag.id;
          document.querySelectorAll('.tag-chip').forEach(function(c) {
            c.classList.remove('active');
          });
          chip.classList.add('active');
        }
        renderSubcategories();
      });

      container.appendChild(chip);
    });
  }

  // ===== Placeholder Events (Event Delegation) =====
  function bindPlaceholderEvents(container) {
    // Dropdown clicks
    container.addEventListener('click', function(e) {
      var target = e.target.closest('.placeholder-dropdown');
      if (!target) return;

      e.stopPropagation();
      var options = JSON.parse(target.dataset.options);
      var currentValue = target.classList.contains('filled') ? target.textContent : null;

      UI.showDropdown(target, options, function(selected) {
        target.textContent = selected;
        target.classList.add('filled');
        // Update segment value
        updateSegmentValue(target.dataset.id, selected, container);
        updatePreview();
      }, currentValue);
    });

    // Keyboard support for dropdowns
    container.addEventListener('keydown', function(e) {
      var target = e.target.closest('.placeholder-dropdown');
      if (!target) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        target.click();
      }
    });

    // Input change events
    container.addEventListener('input', function(e) {
      var target = e.target;
      if (target.classList.contains('placeholder-input') || target.classList.contains('placeholder-date')) {
        if (target.value) {
          target.classList.add('filled');
        } else {
          target.classList.remove('filled');
        }
        updateSegmentValue(target.dataset.id, target.value, container);
        debouncedPreview();
      }
    });
  }

  function updateSegmentValue(segId, value, container) {
    // Find which segment array this belongs to
    // Check technique
    if (state.parsedTechnique) {
      var techSeg = state.parsedTechnique.find(function(s) { return s.id === segId; });
      if (techSeg) { techSeg.value = value; return; }
    }

    // Check findings
    for (var subId in state.parsedFindings) {
      var seg = state.parsedFindings[subId].find(function(s) { return s.id === segId; });
      if (seg) { seg.value = value; return; }
    }

    // Check impressions
    for (var impId in state.parsedImpressions) {
      var impSeg = state.parsedImpressions[impId].find(function(s) { return s.id === segId; });
      if (impSeg) { impSeg.value = value; return; }
    }

    // Check interventional
    for (var intId in state.parsedInterventional) {
      var intSeg = state.parsedInterventional[intId].find(function(s) { return s.id === segId; });
      if (intSeg) { intSeg.value = value; return; }
    }
  }

  // ===== Update Report Preview =====
  var debouncedPreview = Search.debounce(updatePreview, 300);

  function updatePreview() {
    // Sync all segment values from DOM
    syncAllSegments();

    var reportState = {
      reportTitle: document.getElementById('report-title').textContent,
      examDate: document.getElementById('field-date').value,
      physician: document.getElementById('field-physician').value,
      patientId: document.getElementById('field-patient-id').value,
      indication: document.getElementById('field-indication').value,
      technique: state.parsedTechnique ? Templates.resolveSegments(state.parsedTechnique) : '',
      findings: [],
      interventional: [],
      impressions: []
    };

    // Build findings
    state.selectedSubcategories.forEach(function(subId) {
      var sub = getSubcategory(state.activeCategory, subId);
      if (!sub) return;

      if (state.parsedFindings[subId]) {
        reportState.findings.push({
          title: sub.nameEn,
          text: Templates.resolveSegments(state.parsedFindings[subId])
        });
      }

      if (state.parsedImpressions[subId]) {
        reportState.impressions.push({
          title: sub.nameEn,
          text: Templates.resolveSegments(state.parsedImpressions[subId])
        });
      }

      if (state.parsedInterventional[subId] && sub.interventional) {
        reportState.interventional.push({
          title: sub.nameEn,
          text: Templates.resolveSegments(state.parsedInterventional[subId])
        });
      }
    });

    var reportText = Report.assembleReport(reportState);
    document.getElementById('report-preview').value = reportText;
  }

  function syncAllSegments() {
    // Sync technique
    if (state.parsedTechnique) {
      var techContainer = document.getElementById('technique-content');
      Templates.syncSegmentsFromDOM(state.parsedTechnique, techContainer);
    }

    // Sync findings
    state.selectedSubcategories.forEach(function(subId) {
      if (state.parsedFindings[subId]) {
        var block = document.querySelector('.finding-block[data-sub-id="' + subId + '"]');
        if (block) {
          var content = block.querySelector('.finding-template-text');
          if (content) {
            Templates.syncSegmentsFromDOM(state.parsedFindings[subId], content);
          }
        }
      }

      if (state.parsedImpressions[subId]) {
        var impBlock = document.querySelector('[data-imp-sub-id="' + subId + '"]');
        if (impBlock) {
          var impContent = impBlock.querySelector('.finding-template-text');
          if (impContent) {
            Templates.syncSegmentsFromDOM(state.parsedImpressions[subId], impContent);
          }
        }
      }

      if (state.parsedInterventional[subId]) {
        var intBlock = document.querySelector('[data-int-sub-id="' + subId + '"]');
        if (intBlock) {
          var intContent = intBlock.querySelector('.finding-template-text');
          if (intContent) {
            Templates.syncSegmentsFromDOM(state.parsedInterventional[subId], intContent);
          }
        }
      }
    });
  }

  // ===== Bind Global Events =====
  function bindEvents() {
    // Copy button
    document.getElementById('btn-copy').addEventListener('click', function() {
      var preview = document.getElementById('report-preview');
      var text = preview.value;
      if (!text.trim()) {
        UI.showToast('No report to copy', 'warning');
        return;
      }

      Report.copyToClipboard(text).then(function() {
        var btn = document.getElementById('btn-copy');
        btn.classList.add('copied');
        btn.textContent = '✅ Copied!';
        setTimeout(function() {
          btn.classList.remove('copied');
          btn.textContent = '📋 Copy Report';
        }, 2000);
        UI.showToast('Report copied to clipboard!', 'success');

        // Record usage for selected subcategories
        state.selectedSubcategories.forEach(function(subId) {
          Storage.recordUsage(subId);
        });
      });
    });

    // Reset button
    document.getElementById('btn-reset').addEventListener('click', function() {
      if (state.selectedSubcategories.length > 0) {
        state.selectedSubcategories = [];
        state.parsedFindings = {};
        state.parsedImpressions = {};
        state.parsedInterventional = {};
        clearFindings();
        renderSubcategories();

        // Re-render technique
        var cat = getCategory(state.activeCategory);
        if (cat) renderTechnique(cat);
      }

      document.getElementById('field-indication').value = '';
      document.getElementById('field-patient-id').value = '';
      document.getElementById('report-preview').value = '';

      // Re-fill date
      document.getElementById('field-date').value = getTodayStr();

      UI.showToast('Report reset', 'success');
    });

    // Search
    var searchInput = document.getElementById('search-input');
    var debouncedSearch = Search.debounce(function() {
      state.searchQuery = searchInput.value;
      renderSubcategories();
    }, 150);
    searchInput.addEventListener('input', debouncedSearch);

    // Data Backup & Restore Modal
    document.getElementById('btn-settings').addEventListener('click', function() {
      UI.openModal(document.getElementById('settings-modal'));
    });

    // Sub-tabs in Backup modal
    var tabBtns = document.querySelectorAll('.tab-btn');
    var tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        tabBtns.forEach(function(b) { b.classList.remove('active'); });
        tabContents.forEach(function(c) { c.classList.remove('active'); });
        
        btn.classList.add('active');
        var tabId = 'tab-' + btn.dataset.tab;
        document.getElementById(tabId).classList.add('active');
      });
    });

    // Export Functionality
    function getBackupDataString() {
      var data = Storage.exportData();
      return JSON.stringify(data, null, 2);
    }
    
    document.getElementById('btn-export-json').addEventListener('click', function() {
      var jsonStr = getBackupDataString();
      var blob = new Blob([jsonStr], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'chestscope_backup_' + getTodayStr() + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      UI.showToast('Backup file downloaded', 'success');
    });

    document.getElementById('btn-copy-json').addEventListener('click', function() {
      var jsonStr = getBackupDataString();
      navigator.clipboard.writeText(jsonStr).then(function() {
        UI.showToast('Data copied to clipboard!', 'success');
      }).catch(function(err) {
        console.error('Copy failed', err);
        UI.showToast('Failed to copy', 'danger');
      });
    });

    // Import Functionality
    var importFileInput = document.getElementById('import-file-input');
    
    document.getElementById('btn-import-trigger').addEventListener('click', function() {
      importFileInput.click();
    });

    importFileInput.addEventListener('change', function(e) {
      var file = e.target.files[0];
      if (!file) return;
      
      var reader = new FileReader();
      reader.onload = function(evt) {
        try {
          var jsonData = JSON.parse(evt.target.result);
          var success = Storage.importData(jsonData);
          
          if (success) {
            UI.showToast('Data restored successfully! Applying...', 'success');
            // Reload templates and re-render
            state.templates = Storage.getMergedTemplates();
            Search.buildIndex(state.templates);
            if (state.activeCategory) {
              renderSubcategories();
            }
            UI.closeModal(document.getElementById('settings-modal'));
          } else {
            UI.showToast('Failed to restore data (Invalid format)', 'warning');
          }
        } catch (err) {
          console.error('Import parse error', err);
          UI.showToast('Failed to restore data (JSON parsing error)', 'warning');
        }
      };
      reader.readAsText(file);
      // Reset input value to allow selecting same file again
      importFileInput.value = '';
    });

    // Template Library
    document.getElementById('btn-template-library').addEventListener('click', function() {
      var templates = Storage.getMergedTemplates();
      var content = document.getElementById('template-library-content');
      UI.renderTemplateLibrary(templates, function(sub, cat) {
        UI.renderTemplateEditForm(sub, cat, content, function() {
          // Reload templates after save
          state.templates = Storage.getMergedTemplates();
          Search.buildIndex(state.templates);
          if (state.activeCategory) {
            renderSubcategories();
          }
        });
      });
      UI.openModal(document.getElementById('template-modal'));
    });

    // Report header field changes trigger preview update
    ['field-date', 'field-physician', 'field-patient-id', 'field-indication'].forEach(function(id) {
      document.getElementById(id).addEventListener('input', debouncedPreview);
    });

    // Manual edits in preview textarea
    document.getElementById('report-preview').addEventListener('focus', function() {
      // When user manually edits preview, it's their final edit
    });
  }

  // ===== Start =====
  document.addEventListener('DOMContentLoaded', init);
})();
