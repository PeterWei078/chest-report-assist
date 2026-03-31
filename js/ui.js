// ChestScope Helper — UI Helpers: Modals, Toasts, Dropdowns

(function() {
  'use strict';

  // ===== Floating Dropdown =====
  var activeDropdown = null;

  function showDropdown(anchorEl, options, onSelect, selectedValue) {
    closeDropdown();

    var menu = document.createElement('div');
    menu.className = 'dropdown-menu';

    options.forEach(function(opt) {
      var item = document.createElement('div');
      item.className = 'dropdown-option';
      if (opt === selectedValue) {
        item.classList.add('selected');
      }
      item.textContent = opt;
      item.addEventListener('click', function(e) {
        e.stopPropagation();
        onSelect(opt);
        closeDropdown();
      });
      menu.appendChild(item);
    });

    document.body.appendChild(menu);
    activeDropdown = menu;

    // Position
    var rect = anchorEl.getBoundingClientRect();
    var menuHeight = menu.offsetHeight;
    var menuWidth = menu.offsetWidth;

    var top = rect.bottom + 4;
    var left = rect.left;

    // Flip up if near bottom
    if (top + menuHeight > window.innerHeight - 10) {
      top = rect.top - menuHeight - 4;
    }
    // Prevent overflow right
    if (left + menuWidth > window.innerWidth - 10) {
      left = window.innerWidth - menuWidth - 10;
    }

    menu.style.top = top + 'px';
    menu.style.left = left + 'px';

    // Close on click outside
    setTimeout(function() {
      document.addEventListener('click', onClickOutsideDropdown);
      document.addEventListener('keydown', onEscapeDropdown);
    }, 0);
  }

  function closeDropdown() {
    if (activeDropdown) {
      activeDropdown.remove();
      activeDropdown = null;
      document.removeEventListener('click', onClickOutsideDropdown);
      document.removeEventListener('keydown', onEscapeDropdown);
    }
  }

  function onClickOutsideDropdown(e) {
    if (activeDropdown && !activeDropdown.contains(e.target)) {
      closeDropdown();
    }
  }

  function onEscapeDropdown(e) {
    if (e.key === 'Escape') {
      closeDropdown();
    }
  }

  // ===== Modals =====
  function openModal(modalEl) {
    modalEl.classList.remove('hidden');
    // Focus first input if exists
    var firstInput = modalEl.querySelector('input, textarea, select');
    if (firstInput) {
      setTimeout(function() { firstInput.focus(); }, 100);
    }
  }

  function closeModal(modalEl) {
    modalEl.classList.add('hidden');
  }

  // Setup modal close buttons
  function initModals() {
    document.querySelectorAll('[data-modal-close]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var modal = btn.closest('.modal-overlay');
        if (modal) closeModal(modal);
      });
    });

    // Close on overlay click
    document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
          closeModal(overlay);
        }
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(function(modal) {
          closeModal(modal);
        });
      }
    });
  }

  // ===== Toast Notifications =====
  function showToast(message, type) {
    type = type || 'success';
    var container = document.getElementById('toast-container');

    var toast = document.createElement('div');
    toast.className = 'toast ' + type;

    var icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
    toast.innerHTML = '<span>' + icon + '</span><span>' + message + '</span>';

    container.appendChild(toast);

    // Auto-remove after 2.5s
    setTimeout(function() {
      toast.style.animation = 'toastSlideOut 0.2s ease-in forwards';
      setTimeout(function() {
        if (toast.parentNode) toast.remove();
      }, 200);
    }, 2500);
  }

  // ===== Template Library UI =====
  function renderTemplateLibrary(templates, onEdit) {
    var container = document.getElementById('template-library-content');
    container.innerHTML = '';

    templates.categories.forEach(function(cat) {
      var catTitle = document.createElement('h3');
      catTitle.textContent = cat.icon + ' ' + cat.nameEn + ' ' + cat.nameZh;
      catTitle.style.color = 'var(--accent-primary)';
      catTitle.style.marginTop = '16px';
      catTitle.style.marginBottom = '8px';
      container.appendChild(catTitle);

      var list = document.createElement('div');
      list.className = 'template-editor-list';

      cat.subcategories.forEach(function(sub) {
        var item = document.createElement('div');
        item.className = 'template-editor-item';
        item.innerHTML = '<div class="item-name">' + sub.nameEn + ' ' + sub.nameZh + '</div>' +
                         '<div class="item-category">' + cat.nameEn + '</div>';
        item.addEventListener('click', function() {
          onEdit(sub, cat);
        });
        list.appendChild(item);
      });

      container.appendChild(list);
    });
  }

  function renderTemplateEditForm(sub, cat, container, onSave) {
    container.innerHTML = '';

    var backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.textContent = '← Back to list';
    backBtn.style.marginBottom = '16px';
    backBtn.addEventListener('click', function() {
      var templates = window.ChestScope.Storage.getMergedTemplates();
      renderTemplateLibrary(templates, function(s, c) {
        renderTemplateEditForm(s, c, container, onSave);
      });
    });
    container.appendChild(backBtn);

    var title = document.createElement('h3');
    title.textContent = sub.nameEn + ' ' + sub.nameZh;
    title.style.color = 'var(--accent-primary)';
    title.style.marginBottom = '12px';
    container.appendChild(title);

    var form = document.createElement('div');
    form.className = 'template-edit-form';

    // Findings
    var findingsLabel = document.createElement('label');
    findingsLabel.textContent = 'Findings Template';
    form.appendChild(findingsLabel);
    var findingsTA = document.createElement('textarea');
    findingsTA.value = sub.findings || '';
    findingsTA.rows = 8;
    form.appendChild(findingsTA);

    // Impression
    var impLabel = document.createElement('label');
    impLabel.textContent = 'Impression Template';
    form.appendChild(impLabel);
    var impTA = document.createElement('textarea');
    impTA.value = sub.impression || '';
    impTA.rows = 4;
    form.appendChild(impTA);

    // Interventional
    if (sub.interventional !== undefined) {
      var intLabel = document.createElement('label');
      intLabel.textContent = 'Interventional Procedure Template';
      form.appendChild(intLabel);
      var intTA = document.createElement('textarea');
      intTA.value = sub.interventional || '';
      intTA.rows = 6;
      form.appendChild(intTA);
    }

    container.appendChild(form);

    // Save & Reset buttons
    var actions = document.createElement('div');
    actions.style.marginTop = '16px';
    actions.style.display = 'flex';
    actions.style.gap = '8px';

    var saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-primary';
    saveBtn.textContent = 'Save Changes';
    saveBtn.style.padding = '10px 24px';
    saveBtn.style.fontSize = '16px';
    saveBtn.addEventListener('click', function() {
      var custom = window.ChestScope.Storage.getCustomTemplates();
      custom.overrides[sub.id] = custom.overrides[sub.id] || {};
      custom.overrides[sub.id].findings = findingsTA.value;
      custom.overrides[sub.id].impression = impTA.value;
      if (intTA) {
        custom.overrides[sub.id].interventional = intTA.value;
      }
      window.ChestScope.Storage.saveCustomTemplates(custom);
      window.ChestScope.UI.showToast('Template saved!', 'success');
      if (onSave) onSave();
    });
    actions.appendChild(saveBtn);

    var resetBtn = document.createElement('button');
    resetBtn.className = 'btn btn-secondary';
    resetBtn.textContent = 'Reset to Default';
    resetBtn.addEventListener('click', function() {
      var custom = window.ChestScope.Storage.getCustomTemplates();
      delete custom.overrides[sub.id];
      window.ChestScope.Storage.saveCustomTemplates(custom);
      // Reload original
      var original = null;
      window.TEMPLATE_DATA.categories.forEach(function(c) {
        c.subcategories.forEach(function(s) {
          if (s.id === sub.id) original = s;
        });
      });
      if (original) {
        findingsTA.value = original.findings || '';
        impTA.value = original.impression || '';
        if (intTA) intTA.value = original.interventional || '';
      }
      window.ChestScope.UI.showToast('Reset to default', 'success');
      if (onSave) onSave();
    });
    actions.appendChild(resetBtn);

    container.appendChild(actions);
  }

  // Export
  window.ChestScope = window.ChestScope || {};
  window.ChestScope.UI = {
    showDropdown: showDropdown,
    closeDropdown: closeDropdown,
    openModal: openModal,
    closeModal: closeModal,
    initModals: initModals,
    showToast: showToast,
    renderTemplateLibrary: renderTemplateLibrary,
    renderTemplateEditForm: renderTemplateEditForm
  };
})();
