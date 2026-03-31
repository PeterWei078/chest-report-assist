// ChestScope Helper — LocalStorage Abstraction Layer

(function() {
  'use strict';

  var KEYS = {
    PREFERENCES: 'chestscope_preferences',
    CUSTOM_TEMPLATES: 'chestscope_custom_templates',
    USAGE_HISTORY: 'chestscope_usage_history',
    DRAFT: 'chestscope_draft',
    VERSION: 'chestscope_version'
  };

  var DEFAULT_PREFERENCES = {
    physicianName: '',
    autoFillDate: true
  };

  function read(key) {
    try {
      var data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Storage read error for key:', key, e);
      return null;
    }
  }

  function write(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn('Storage write error for key:', key, e);
      return false;
    }
  }

  function remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('Storage remove error for key:', key, e);
    }
  }

  // Preferences
  function getPreferences() {
    var prefs = read(KEYS.PREFERENCES);
    if (!prefs) return Object.assign({}, DEFAULT_PREFERENCES);
    return Object.assign({}, DEFAULT_PREFERENCES, prefs);
  }

  function savePreferences(prefs) {
    return write(KEYS.PREFERENCES, prefs);
  }

  // Custom Templates (overlay pattern)
  function getCustomTemplates() {
    var custom = read(KEYS.CUSTOM_TEMPLATES);
    if (!custom) return { overrides: {}, additions: [], deletions: [] };
    return custom;
  }

  function saveCustomTemplates(custom) {
    return write(KEYS.CUSTOM_TEMPLATES, custom);
  }

  // Usage History
  function getUsageHistory() {
    var history = read(KEYS.USAGE_HISTORY);
    if (!history) return { counts: {}, lastUsed: {} };
    return history;
  }

  function recordUsage(subcategoryId) {
    var history = getUsageHistory();
    history.counts[subcategoryId] = (history.counts[subcategoryId] || 0) + 1;
    history.lastUsed[subcategoryId] = new Date().toISOString();
    write(KEYS.USAGE_HISTORY, history);
  }

  // Draft
  function saveDraft(draft) {
    return write(KEYS.DRAFT, draft);
  }

  function getDraft() {
    return read(KEYS.DRAFT);
  }

  function clearDraft() {
    remove(KEYS.DRAFT);
  }

  // Merge templates with customizations
  function getMergedTemplates() {
    var defaults = window.TEMPLATE_DATA;
    var custom = getCustomTemplates();

    var merged = JSON.parse(JSON.stringify(defaults));

    // Apply overrides
    merged.categories.forEach(function(cat) {
      cat.subcategories.forEach(function(sub) {
        if (custom.overrides[sub.id]) {
          Object.assign(sub, custom.overrides[sub.id]);
        }
      });
    });

    // Apply deletions
    if (custom.deletions && custom.deletions.length > 0) {
      merged.categories.forEach(function(cat) {
        cat.subcategories = cat.subcategories.filter(function(sub) {
          return custom.deletions.indexOf(sub.id) === -1;
        });
      });
    }

    // Apply additions
    if (custom.additions && custom.additions.length > 0) {
      custom.additions.forEach(function(addition) {
        var cat = merged.categories.find(function(c) { return c.id === addition.categoryId; });
        if (cat) {
          cat.subcategories.push(addition);
        }
      });
    }

    return merged;
  }

  // Backup & Restore
  function exportData() {
    var custom = getCustomTemplates();
    return {
      version: 1,
      custom_templates: custom
    };
  }

  function importData(jsonData) {
    try {
      if (!jsonData || typeof jsonData !== 'object') {
        throw new Error('Invalid backup file format');
      }
      
      // If the jsonData has custom_templates (our new format)
      if (jsonData.custom_templates) {
        saveCustomTemplates(jsonData.custom_templates);
      } else if (jsonData.overrides || jsonData.additions || jsonData.deletions) {
        // Fallback for older direct backups if any
        saveCustomTemplates(jsonData);
      } else {
        throw new Error('Unrecognized data format');
      }
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }

  // Export public API
  window.ChestScope = window.ChestScope || {};
  window.ChestScope.Storage = {
    getPreferences: getPreferences,
    savePreferences: savePreferences,
    getCustomTemplates: getCustomTemplates,
    saveCustomTemplates: saveCustomTemplates,
    getUsageHistory: getUsageHistory,
    recordUsage: recordUsage,
    getMergedTemplates: getMergedTemplates,
    saveDraft: saveDraft,
    clearDraft: clearDraft,
    exportData: exportData,
    importData: importData
  };
})();
