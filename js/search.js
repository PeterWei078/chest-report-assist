// ChestScope Helper — Full-Text Search Engine

(function() {
  'use strict';

  var searchIndex = [];

  // Build search index from merged templates
  function buildIndex(templates) {
    searchIndex = [];
    templates.categories.forEach(function(cat) {
      cat.subcategories.forEach(function(sub) {
        var text = [
          sub.nameEn,
          sub.nameZh,
          sub.findings || '',
          sub.impression || '',
          sub.interventional || '',
          (sub.tags || []).join(' '),
          cat.nameEn,
          cat.nameZh
        ].join(' ').toLowerCase();

        searchIndex.push({
          id: sub.id,
          categoryId: cat.id,
          text: text,
          subcategory: sub,
          category: cat
        });
      });
    });
  }

  // Search with text query + optional filters
  function search(query, filters) {
    filters = filters || {};
    var results = searchIndex;

    // Category filter
    if (filters.categoryId) {
      results = results.filter(function(entry) {
        return entry.categoryId === filters.categoryId;
      });
    }

    // Tag filter
    if (filters.tag) {
      results = results.filter(function(entry) {
        return entry.subcategory.tags && entry.subcategory.tags.indexOf(filters.tag) !== -1;
      });
    }

    // Text search
    if (query && query.trim()) {
      var tokens = query.toLowerCase().trim().split(/\s+/);
      results = results.filter(function(entry) {
        return tokens.every(function(token) {
          return entry.text.indexOf(token) !== -1;
        });
      });
    }

    return results;
  }

  // Get matching subcategory IDs
  function searchIds(query, filters) {
    return search(query, filters).map(function(r) { return r.id; });
  }

  // Debounce helper
  function debounce(fn, delay) {
    var timer = null;
    return function() {
      var args = arguments;
      var ctx = this;
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn.apply(ctx, args);
      }, delay);
    };
  }

  // Export
  window.ChestScope = window.ChestScope || {};
  window.ChestScope.Search = {
    buildIndex: buildIndex,
    search: search,
    searchIds: searchIds,
    debounce: debounce
  };
})();
