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
  function renderTemplateLibrary(templates, onEdit, onNew) {
    var container = document.getElementById('template-library-content');
    container.innerHTML = '';

    if (onNew) {
      var newBtn = document.createElement('button');
      newBtn.className = 'btn btn-primary';
      newBtn.textContent = '+ New Template 新增模板';
      newBtn.style.marginBottom = '16px';
      newBtn.addEventListener('click', function() {
        onNew(templates.categories);
      });
      container.appendChild(newBtn);
    }

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

  function renderTemplateEditForm(sub, _cat, container, onSave, onNew) {
    container.innerHTML = '';

    // Detect if this is a user-added custom template
    var isCustomAddition = (function() {
      var custom = window.ChestScope.Storage.getCustomTemplates();
      for (var i = 0; i < custom.additions.length; i++) {
        if (custom.additions[i].id === sub.id) return true;
      }
      return false;
    })();

    var backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.textContent = '← Back to list';
    backBtn.style.marginBottom = '16px';
    backBtn.addEventListener('click', function() {
      var templates = window.ChestScope.Storage.getMergedTemplates();
      renderTemplateLibrary(templates, function(s, c) {
        renderTemplateEditForm(s, c, container, onSave, onNew);
      }, onNew);
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
    var intTA;
    if (sub.interventional !== undefined) {
      var intLabel = document.createElement('label');
      intLabel.textContent = 'Interventional Procedure Template';
      form.appendChild(intLabel);
      intTA = document.createElement('textarea');
      intTA.value = sub.interventional || '';
      intTA.rows = 6;
      form.appendChild(intTA);
    }

    container.appendChild(form);

    // Buttons
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
      if (isCustomAddition) {
        for (var i = 0; i < custom.additions.length; i++) {
          if (custom.additions[i].id === sub.id) {
            custom.additions[i].findings = findingsTA.value;
            custom.additions[i].impression = impTA.value;
            if (intTA) custom.additions[i].interventional = intTA.value;
            break;
          }
        }
      } else {
        custom.overrides[sub.id] = custom.overrides[sub.id] || {};
        custom.overrides[sub.id].findings = findingsTA.value;
        custom.overrides[sub.id].impression = impTA.value;
        if (intTA) custom.overrides[sub.id].interventional = intTA.value;
      }
      window.ChestScope.Storage.saveCustomTemplates(custom);
      window.ChestScope.UI.showToast('Template saved!', 'success');
      if (onSave) onSave();
    });
    actions.appendChild(saveBtn);

    var resetBtn = document.createElement('button');
    resetBtn.className = 'btn btn-secondary';
    if (isCustomAddition) {
      resetBtn.textContent = 'Delete Custom Template';
      resetBtn.addEventListener('click', function() {
        if (!confirm('Delete this custom template? This cannot be undone.')) return;
        var custom = window.ChestScope.Storage.getCustomTemplates();
        custom.additions = custom.additions.filter(function(a) { return a.id !== sub.id; });
        window.ChestScope.Storage.saveCustomTemplates(custom);
        window.ChestScope.UI.showToast('Custom template deleted', 'success');
        if (onSave) onSave();
        var templates = window.ChestScope.Storage.getMergedTemplates();
        renderTemplateLibrary(templates, function(s, c) {
          renderTemplateEditForm(s, c, container, onSave, onNew);
        }, onNew);
      });
    } else {
      resetBtn.textContent = 'Reset to Default';
      resetBtn.addEventListener('click', function() {
        var custom = window.ChestScope.Storage.getCustomTemplates();
        delete custom.overrides[sub.id];
        window.ChestScope.Storage.saveCustomTemplates(custom);
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
    }
    actions.appendChild(resetBtn);

    container.appendChild(actions);
  }

  function renderNewTemplateForm(categories, container, onSave, onNew) {
    container.innerHTML = '';

    function goBack() {
      var templates = window.ChestScope.Storage.getMergedTemplates();
      renderTemplateLibrary(templates, function(s, c) {
        renderTemplateEditForm(s, c, container, onSave, onNew);
      }, onNew);
    }

    var backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.textContent = '← Back to list';
    backBtn.style.marginBottom = '16px';
    backBtn.addEventListener('click', goBack);
    container.appendChild(backBtn);

    var title = document.createElement('h3');
    title.textContent = 'New Template 新增模板';
    title.style.color = 'var(--accent-primary)';
    title.style.marginBottom = '12px';
    container.appendChild(title);

    var form = document.createElement('div');
    form.className = 'template-edit-form';

    // Category selector
    var catLabel = document.createElement('label');
    catLabel.textContent = 'Category 類別';
    form.appendChild(catLabel);
    var catSelect = document.createElement('select');
    categories.forEach(function(cat) {
      var opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.icon + ' ' + cat.nameEn + ' ' + cat.nameZh;
      catSelect.appendChild(opt);
    });
    form.appendChild(catSelect);

    // Name English
    var nameEnLabel = document.createElement('label');
    nameEnLabel.textContent = 'Name (English)';
    form.appendChild(nameEnLabel);
    var nameEnInput = document.createElement('input');
    nameEnInput.type = 'text';
    nameEnInput.placeholder = 'e.g. Bilateral Pleural Effusion';
    form.appendChild(nameEnInput);

    // Name Chinese
    var nameZhLabel = document.createElement('label');
    nameZhLabel.textContent = 'Name (Chinese) 中文名稱（選填）';
    form.appendChild(nameZhLabel);
    var nameZhInput = document.createElement('input');
    nameZhInput.type = 'text';
    nameZhInput.placeholder = 'e.g. 雙側肋膜積液';
    form.appendChild(nameZhInput);

    // Findings
    var findingsLabel = document.createElement('label');
    findingsLabel.textContent = 'Findings Template';
    form.appendChild(findingsLabel);
    var findingsTA = document.createElement('textarea');
    findingsTA.rows = 8;
    findingsTA.placeholder = 'Use [option1/option2] for dropdowns, [x] for numbers, [free text] for text inputs.';
    form.appendChild(findingsTA);

    // Impression
    var impLabel = document.createElement('label');
    impLabel.textContent = 'Impression Template';
    form.appendChild(impLabel);
    var impTA = document.createElement('textarea');
    impTA.rows = 4;
    form.appendChild(impTA);

    // Interventional toggle
    var intRow = document.createElement('div');
    intRow.style.cssText = 'display:flex;align-items:center;gap:8px;margin-top:12px;margin-bottom:4px;';
    var intCheck = document.createElement('input');
    intCheck.type = 'checkbox';
    intCheck.id = 'new-tpl-int-check';
    var intCheckLabel = document.createElement('label');
    intCheckLabel.htmlFor = 'new-tpl-int-check';
    intCheckLabel.textContent = 'Include Interventional Procedure section';
    intCheckLabel.style.cssText = 'margin:0;font-weight:normal;';
    intRow.appendChild(intCheck);
    intRow.appendChild(intCheckLabel);
    form.appendChild(intRow);

    var intSection = document.createElement('div');
    intSection.style.display = 'none';
    var intLabel = document.createElement('label');
    intLabel.textContent = 'Interventional Procedure Template';
    intSection.appendChild(intLabel);
    var intTA = document.createElement('textarea');
    intTA.rows = 6;
    intSection.appendChild(intTA);
    form.appendChild(intSection);

    intCheck.addEventListener('change', function() {
      intSection.style.display = intCheck.checked ? 'block' : 'none';
    });

    container.appendChild(form);

    // Save & Cancel
    var actions = document.createElement('div');
    actions.style.marginTop = '16px';
    actions.style.display = 'flex';
    actions.style.gap = '8px';

    var saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-primary';
    saveBtn.textContent = 'Save Template 儲存模板';
    saveBtn.style.padding = '10px 24px';
    saveBtn.style.fontSize = '16px';
    saveBtn.addEventListener('click', function() {
      var nameEn = nameEnInput.value.trim();
      if (!nameEn) {
        window.ChestScope.UI.showToast('Please enter a template name', 'warning');
        nameEnInput.focus();
        return;
      }
      if (!findingsTA.value.trim()) {
        window.ChestScope.UI.showToast('Findings template cannot be empty', 'warning');
        findingsTA.focus();
        return;
      }
      var newAddition = {
        categoryId: catSelect.value,
        id: 'custom-' + Date.now(),
        nameEn: nameEn,
        nameZh: nameZhInput.value.trim() || nameEn,
        findings: findingsTA.value,
        impression: impTA.value
      };
      if (intCheck.checked) {
        newAddition.interventional = intTA.value;
      }
      var custom = window.ChestScope.Storage.getCustomTemplates();
      custom.additions.push(newAddition);
      window.ChestScope.Storage.saveCustomTemplates(custom);
      window.ChestScope.UI.showToast('Template saved! 模板已儲存', 'success');
      if (onSave) onSave();
      goBack();
    });
    actions.appendChild(saveBtn);

    var cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.textContent = 'Cancel 取消';
    cancelBtn.addEventListener('click', goBack);
    actions.appendChild(cancelBtn);

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
    renderTemplateEditForm: renderTemplateEditForm,
    renderNewTemplateForm: renderNewTemplateForm
  };
})();
