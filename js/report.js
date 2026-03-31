// ChestScope Helper — Report Assembly & Clipboard

(function() {
  'use strict';

  // Assemble full plain-text report from current state
  function assembleReport(state) {
    var lines = [];

    // Title
    lines.push(state.reportTitle || 'Report');
    lines.push('');

    // Header
    if (state.examDate) {
      lines.push('Examination Date: ' + state.examDate);
    }
    if (state.physician) {
      lines.push('Physician: ' + state.physician);
    }
    if (state.patientId) {
      lines.push('Patient ID: ' + state.patientId);
    }
    if (state.examDate || state.physician || state.patientId) {
      lines.push('');
    }

    // Indication
    if (state.indication && state.indication.trim()) {
      lines.push('Indication:');
      lines.push(state.indication.trim());
      lines.push('');
    }

    // Technique
    if (state.technique && state.technique.trim()) {
      lines.push('Technique:');
      lines.push(state.technique.trim());
      lines.push('');
    }

    // Findings
    if (state.findings && state.findings.length > 0) {
      lines.push('Findings:');
      if (state.findings.length === 1) {
        lines.push(state.findings[0].text);
      } else {
        state.findings.forEach(function(f, i) {
          lines.push('');
          lines.push((i + 1) + '. ' + f.title + ':');
          lines.push(f.text);
        });
      }
      lines.push('');
    }

    // Interventional
    if (state.interventional && state.interventional.length > 0) {
      lines.push('Interventional Procedure:');
      state.interventional.forEach(function(intv) {
        lines.push(intv.text);
        lines.push('');
      });
    }

    // Impression
    if (state.impressions && state.impressions.length > 0) {
      lines.push('Impression:');
      if (state.impressions.length === 1) {
        lines.push(state.impressions[0].text);
      } else {
        state.impressions.forEach(function(imp, i) {
          lines.push((i + 1) + '. ' + imp.text);
        });
      }
      lines.push('');
    }

    return lines.join('\n').trim();
  }

  // Copy text to clipboard
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function() {
        return true;
      }).catch(function() {
        return fallbackCopy(text);
      });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    var success = false;
    try {
      success = document.execCommand('copy');
    } catch (e) {
      success = false;
    }
    document.body.removeChild(textarea);
    return success;
  }

  // Export
  window.ChestScope = window.ChestScope || {};
  window.ChestScope.Report = {
    assembleReport: assembleReport,
    copyToClipboard: copyToClipboard
  };
})();
