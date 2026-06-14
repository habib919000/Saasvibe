/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./views/assets/src/components/ColorCustomizer.jsx"
/*!*********************************************************!*\
  !*** ./views/assets/src/components/ColorCustomizer.jsx ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ColorCustomizer: () => (/* binding */ ColorCustomizer),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/refresh-cw.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/shield-alert.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/upload.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/x.js");




const ColorCustomizer = ({
  settings,
  onChange,
  activeTemplate
}) => {
  const [contrastRatio, setContrastRatio] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1);
  const [contrastPass, setContrastPass] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);

  // WCAG Contrast Math
  const getLuminance = hex => {
    const cleanHex = hex.replace('#', '');
    let rgb = [];
    if (cleanHex.length === 3) {
      rgb = [parseInt(cleanHex[0] + cleanHex[0], 16) / 255, parseInt(cleanHex[1] + cleanHex[1], 16) / 255, parseInt(cleanHex[2] + cleanHex[2], 16) / 255];
    } else if (cleanHex.length === 6) {
      rgb = [parseInt(cleanHex.substring(0, 2), 16) / 255, parseInt(cleanHex.substring(2, 4), 16) / 255, parseInt(cleanHex.substring(4, 6), 16) / 255];
    } else {
      return 0; // fallback
    }
    const sRGB = rgb.map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };
  const calculateContrast = (c1, c2) => {
    const l1 = getLuminance(c1);
    const l2 = getLuminance(c2);
    return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!activeTemplate || !settings.brandColor) {
      return;
    }
    const textColor = activeTemplate.defaultColors.text || '#FFFFFF';
    const ratio = calculateContrast(settings.brandColor, textColor);
    setContrastRatio(ratio.toFixed(2));
    setContrastPass(ratio >= 4.5);
  }, [settings.brandColor, activeTemplate]);
  const handleResetColors = () => {
    if (activeTemplate) {
      onChange('brandColor', activeTemplate.defaultColors.accent);
    }
  };
  const handleUploadLogo = e => {
    e.preventDefault();
    if (typeof wp !== 'undefined' && wp.media) {
      const mediaFrame = wp.media({
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select Custom Logo', 'saasvibe'),
        button: {
          text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Use Logo', 'saasvibe')
        },
        multiple: false,
        library: {
          type: 'image'
        }
      });
      mediaFrame.on('select', () => {
        const attachment = mediaFrame.state().get('selection').first().toJSON();
        onChange('customLogo', attachment.url);
      });
      mediaFrame.open();
    } else {
      const url = prompt((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enter Logo Image URL:', 'saasvibe'));
      if (url !== null) {
        onChange('customLogo', url);
      }
    }
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "saasmenu-color-customizer p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "space-y-6"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
    className: "text-xl font-semibold text-slate-800 m-0"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Branding & Sizing', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "text-sm text-slate-500 mt-1"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Configure brand identity colors, sizing parameters, and logo settings.', 'saasvibe'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "space-y-2 border-b border-slate-100 pb-5"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "block text-sm font-semibold text-slate-700"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Primary Brand Color', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex items-center gap-3"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "relative w-12 h-10 rounded border border-slate-200 overflow-hidden cursor-pointer focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-1"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "color",
    value: settings.brandColor,
    onChange: e => onChange('brandColor', e.target.value),
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Choose Primary Brand Color', 'saasvibe'),
    className: "absolute inset-0 w-full h-full p-0 border-0 cursor-pointer opacity-0"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      backgroundColor: settings.brandColor
    },
    className: "w-full h-full"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    value: settings.brandColor,
    onChange: e => onChange('brandColor', e.target.value),
    className: "border border-slate-200 rounded px-3 py-1.5 text-sm w-32 font-mono uppercase"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    onClick: handleResetColors,
    className: "flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 transition-colors"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], {
    className: "h-3.5 w-3.5"
  }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Reset to Default', 'saasvibe'))), !contrastPass && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-amber-800 text-xs"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], {
    className: "h-4 w-4 text-amber-600 shrink-0 mt-0.5"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "font-semibold"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('WCAG Contrast Warning: ', 'saasvibe')), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Selected brand color contrast ratio is %s:1 against default template text, which fails WCAG 2.1 AA requirements (4.5:1). Text visibility may be limited.', 'saasvibe'), contrastRatio)))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "space-y-2 border-b border-slate-100 pb-5"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "block text-sm font-semibold text-slate-700"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Custom Site Logo', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "space-y-3"
  }, settings.customLogo ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "relative border border-slate-200 rounded-lg p-3 w-64 bg-slate-50 flex items-center justify-between"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: settings.customLogo,
    alt: "Logo preview",
    className: "max-h-12 max-w-[180px] object-contain"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    onClick: () => onChange('customLogo', ''),
    className: "p-1 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], {
    className: "h-4 w-4"
  }))) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    onClick: handleUploadLogo,
    className: "flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 border-dashed rounded-lg p-5 w-64 justify-center transition-colors group"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], {
    className: "h-4 w-4 text-slate-400 group-hover:text-indigo-600"
  }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Upload Logo (PNG/SVG)', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "text-[11px] text-slate-400"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Max recommended size: 200px wide by 60px high. SVG or transparent PNG preferred.', 'saasvibe')))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "space-y-4 border-b border-slate-100 pb-5"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
    className: "text-sm font-semibold text-slate-700 m-0"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Sidebar Settings', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "space-y-1"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex justify-between text-xs font-medium text-slate-500"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Expanded Sidebar Width', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "font-mono text-slate-700"
  }, settings.sidebarWidth, "px")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "range",
    min: "200",
    max: "320",
    step: "5",
    value: settings.sidebarWidth,
    onChange: e => onChange('sidebarWidth', parseInt(e.target.value)),
    className: "w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "space-y-1"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "text-xs font-medium text-slate-500"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Menu Spacing Density', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "grid grid-cols-3 gap-2 mt-1.5"
  }, [{
    value: 'compact',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Compact', 'saasvibe')
  }, {
    value: 'normal',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Normal', 'saasvibe')
  }, {
    value: 'relaxed',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Relaxed', 'saasvibe')
  }].map(d => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    key: d.value,
    type: "button",
    onClick: () => onChange('density', d.value),
    className: `text-xs py-2 border rounded-lg transition-all ${settings.density === d.value ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`
  }, d.label))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "space-y-4"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
    className: "text-sm font-semibold text-slate-700 m-0"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Top Bar Settings', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "space-y-1"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex justify-between text-xs font-medium text-slate-500"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Top Bar Height', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "font-mono text-slate-700"
  }, settings.topBarHeight, "px")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "range",
    min: "32",
    max: "52",
    step: "1",
    value: settings.topBarHeight,
    onChange: e => onChange('topBarHeight', parseInt(e.target.value)),
    className: "w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
  })))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "border border-slate-100 bg-slate-50/50 p-6 rounded-xl space-y-4"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
    className: "text-sm font-semibold text-slate-800 m-0"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Design Guidelines & Tips', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: "text-xs text-slate-600 space-y-3 pl-4 list-disc leading-relaxed"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", {
    className: "text-slate-700"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Contrast Compliance: ', 'saasvibe')), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Ensure your brand color passes contrast compliance with the text color of your active design template. This secures compliance under WCAG 2.1 AA requirements, preventing readability barriers.', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", {
    className: "text-slate-700"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Dynamic Custom Properties: ', 'saasvibe')), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Once saved, your color specifications generate root CSS custom properties in the WordPress header. Changing templates retains color specifications.', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", {
    className: "text-slate-700"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Width Adjustment: ', 'saasvibe')), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Set sidebar widths between 200px and 320px depending on the depth of your site menu titles to avoid truncation.', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("strong", {
    className: "text-slate-700"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Collapsing state: ', 'saasvibe')), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Folding the sidebar reduces layout spacing into a clean, icon-only 60px panel automatically.', 'saasvibe')))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ColorCustomizer);

/***/ },

/***/ "./views/assets/src/components/ExportModal.jsx"
/*!*****************************************************!*\
  !*** ./views/assets/src/components/ExportModal.jsx ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExportModal: () => (/* binding */ ExportModal),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/download.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/shield-alert.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/upload.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/x.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/circle-check-big.js");
/* harmony import */ var _hooks_useApi__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @hooks/useApi */ "./views/assets/src/hooks/useApi.js");





const ExportModal = ({
  isOpen,
  onClose,
  onImportSuccess
}) => {
  const isPro = window.SaasMenu_Vars?.is_pro || false;
  // For local evaluation, check if agency tier is active
  const licenseTier = window.SaasMenu_Vars?.settings?.license_tier || (isPro ? 'agency' : 'free');
  const isAgency = true; // All features available in free version
  const [isImporting, setIsImporting] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [importStatus, setImportStatus] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null); // 'success' | 'error'
  const [errorMessage, setErrorMessage] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const fileInputRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const modalRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const api = (0,_hooks_useApi__WEBPACK_IMPORTED_MODULE_7__["default"])();

  // Focus Trap & Escape Key Listener
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isOpen) {
      return;
    }

    // Close on Escape key press
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Focus Trap
    const modalElement = modalRef.current;
    if (!modalElement) {
      return;
    }
    const focusableElements = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first focusable element (usually the close button or first action)
    firstElement?.focus();
    const trapFocus = e => {
      if (e.key !== 'Tab') {
        return;
      }
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };
    modalElement.addEventListener('keydown', trapFocus);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      modalElement.removeEventListener('keydown', trapFocus);
    };
  }, [isOpen, onClose]);
  if (!isOpen) {
    return null;
  }
  const handleExport = () => {
    if (!isAgency) {
      alert((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Export is available for all users.', 'saasvibe'));
      return;
    }
    const restUrl = window.SaasMenu_Vars?.rest_url || '';
    const permission = window.SaasMenu_Vars?.permission || '';

    // Trigger a direct browser file download by redirecting to our REST export route
    window.location.href = `${restUrl}settings/export?is_admin=true&_wpnonce=${permission}`;
  };
  const handleImportClick = () => {
    if (!isAgency) {
      alert((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Import is available for all users.', 'saasvibe'));
      return;
    }
    fileInputRef.current?.click();
  };
  const handleFileChange = async e => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setIsImporting(true);
    setImportStatus(null);
    setErrorMessage('');
    const reader = new FileReader();
    reader.onload = async event => {
      try {
        const jsonContent = JSON.parse(event.target?.result);

        // Call standard REST API importer
        const response = await api.post('settings/import', jsonContent);
        if (response.success) {
          setImportStatus('success');
          if (onImportSuccess) {
            onImportSuccess(response.data);
          }
        } else {
          setImportStatus('error');
          setErrorMessage(response.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Import failed. Unknown error.', 'saasvibe'));
        }
      } catch (err) {
        setImportStatus('error');
        setErrorMessage((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Invalid JSON file content.', 'saasvibe'));
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsText(file);
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ref: modalRef,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "export-modal-title",
    className: "fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[600] p-4"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "px-6 py-4 border-b border-slate-100 flex items-center justify-between"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
    id: "export-modal-title",
    className: "text-base font-semibold text-slate-800 m-0"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Import / Export Settings', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: onClose,
    className: "text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 transition-colors"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], {
    className: "h-4 w-4"
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "p-6 space-y-6"
  }, !isAgency && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-2.5 text-indigo-950 text-xs"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], {
    className: "h-4 w-4 text-indigo-600 shrink-0 mt-0.5"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "font-semibold block text-indigo-900 mb-0.5"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Import & Export Settings', 'saasvibe')), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Export your settings as JSON or import a configuration from another site.', 'saasvibe'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "grid grid-cols-2 gap-4"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    onClick: handleExport,
    disabled: !isAgency,
    className: `flex flex-col items-center justify-center p-6 border rounded-xl gap-2 transition-all ${isAgency ? 'border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/20 text-slate-700 hover:text-indigo-700 cursor-pointer' : 'border-slate-100 bg-slate-50/50 text-slate-400 cursor-not-allowed'}`
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], {
    className: `h-6 w-6 ${isAgency ? 'text-indigo-600' : 'text-slate-300'}`
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "text-xs font-semibold"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Export JSON', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "text-[10px] text-slate-400 text-center leading-normal"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Download current configurations.', 'saasvibe'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    onClick: handleImportClick,
    disabled: !isAgency || isImporting,
    className: `flex flex-col items-center justify-center p-6 border rounded-xl gap-2 transition-all ${isAgency ? 'border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/20 text-slate-700 hover:text-indigo-700 cursor-pointer' : 'border-slate-100 bg-slate-50/50 text-slate-400 cursor-not-allowed'}`
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], {
    className: `h-6 w-6 ${isAgency ? 'text-indigo-600' : 'text-slate-300'}`
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "text-xs font-semibold"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Import JSON', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "text-[10px] text-slate-400 text-center leading-normal"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Upload saasmenu-settings.json file.', 'saasvibe'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    ref: fileInputRef,
    type: "file",
    accept: ".json",
    onChange: handleFileChange,
    className: "hidden"
  })), isImporting && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex items-center justify-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin block"
  }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Uploading and writing configurations…', 'saasvibe')), importStatus === 'success' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800 text-xs"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], {
    className: "h-4 w-4 text-green-600 shrink-0"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Settings imported successfully! Reloading variables…', 'saasvibe'))), importStatus === 'error' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800 text-xs"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], {
    className: "h-4 w-4 text-red-600 shrink-0"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, errorMessage))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    onClick: onClose,
    className: "bg-white border border-slate-200 hover:border-slate-300 text-slate-600 text-xs px-4 py-2 rounded-lg font-medium transition-colors"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Close Window', 'saasvibe')))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ExportModal);

/***/ },

/***/ "./views/assets/src/components/MenuPreview.jsx"
/*!*****************************************************!*\
  !*** ./views/assets/src/components/MenuPreview.jsx ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MenuPreview: () => (/* binding */ MenuPreview),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/external-link.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/file-text.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/layers.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/settings.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/users.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/house.js");



const MenuPreview = ({
  settings,
  activeTemplate
}) => {
  if (!activeTemplate) {
    return null;
  }
  const brandColor = settings.brandColor || '#5E6AD2';
  const sidebarWidth = settings.sidebarWidth || 240;
  const topBarHeight = settings.topBarHeight || 46;
  const customLogo = settings.customLogo || '';
  const density = settings.density || 'normal';

  // CSS RGB parser for brand opacity
  const getRgbFromHex = hex => {
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      return {
        r: parseInt(cleanHex[0] + cleanHex[0], 16),
        g: parseInt(cleanHex[1] + cleanHex[1], 16),
        b: parseInt(cleanHex[2] + cleanHex[2], 16)
      };
    }
    return {
      r: parseInt(cleanHex.substring(0, 2), 16),
      g: parseInt(cleanHex.substring(2, 4), 16),
      b: parseInt(cleanHex.substring(4, 6), 16)
    };
  };
  const rgb = getRgbFromHex(brandColor);
  const brandHover = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.10)`;

  // Calculate spacing based on density
  let itemPadding = 'py-2 px-3.5';
  if (density === 'compact') {
    itemPadding = 'py-1 px-3';
  } else if (density === 'relaxed') {
    itemPadding = 'py-3.5 px-4';
  }

  // Determine default mockup color values based on selected template
  const previewStyles = {
    sidebarBg: activeTemplate.id === 'classic-elevated' ? brandColor : activeTemplate.defaultColors.background,
    sidebarText: activeTemplate.defaultColors.text,
    topBarBg: activeTemplate.id === 'classic-elevated' ? brandColor : activeTemplate.style === 'both' ? activeTemplate.defaultColors.background : '#FFFFFF',
    topBarBorder: activeTemplate.id === 'vercel-minimal' || activeTemplate.id === 'wppm-purple' ? '1px solid #E5E7EB' : activeTemplate.id === 'linear-dark' ? '1px solid rgba(255,255,255,0.08)' : 'none'
  };

  // Calculate contrast text color for brand color
  const getIdealTextColor = (r, g, b) => {
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };
  const brandTextColor = getIdealTextColor(rgb.r, rgb.g, rgb.b);
  const mockMenuItems = [{
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], {
      className: "h-4 w-4 shrink-0"
    }),
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Dashboard', 'saasvibe'),
    active: true
  }, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], {
      className: "h-4 w-4 shrink-0"
    }),
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Posts & Pages', 'saasvibe')
  }, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], {
      className: "h-4 w-4 shrink-0"
    }),
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Appearance', 'saasvibe')
  }, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], {
      className: "h-4 w-4 shrink-0"
    }),
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Users & Profiles', 'saasvibe')
  }, {
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], {
      className: "h-4 w-4 shrink-0"
    }),
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Settings', 'saasvibe')
  }];
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "saasmenu-menu-preview p-6 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col justify-between"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
    className: "text-xl font-semibold text-slate-800 m-0"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Live Interface Preview', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "text-sm text-slate-500 mt-1"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Visual simulation of how the WordPress backend navigation layout will render.', 'saasvibe'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "my-8 border border-slate-200 rounded-xl overflow-hidden shadow-lg bg-white flex flex-col h-[400px]"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 select-none shrink-0"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "w-2.5 h-2.5 rounded-full bg-red-400 block"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "w-2.5 h-2.5 rounded-full bg-yellow-400 block"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "w-2.5 h-2.5 rounded-full bg-green-400 block"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bg-white px-3 py-0.5 rounded border border-slate-200 text-[10px] text-slate-400 w-1/3 text-center mx-auto truncate"
  }, "wp-admin/index.php")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex-1 flex overflow-hidden"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      backgroundColor: previewStyles.sidebarBg,
      color: previewStyles.sidebarText,
      width: `${sidebarWidth * 0.75}px`,
      // Scale width slightly to fit preview viewport
      transition: 'all 200ms ease-in-out'
    },
    className: "h-full border-r border-slate-200 flex flex-col shrink-0 overflow-hidden"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      height: `${topBarHeight}px`,
      borderBottom: activeTemplate.id === 'vercel-minimal' ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.08)'
    },
    className: "flex items-center justify-center p-3 select-none"
  }, customLogo ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: customLogo,
    alt: "Mock logo",
    className: "max-h-6 max-w-full object-contain"
  }) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "text-xs font-bold truncate opacity-80 uppercase tracking-wider"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('WordPress Title', 'saasvibe'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex-1 py-4 space-y-1 select-none overflow-y-auto"
  }, mockMenuItems.map((item, i) => {
    const isSelected = item.active;
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: i,
      style: {
        backgroundColor: isSelected ? brandHover : 'transparent',
        color: isSelected ? activeTemplate.id === 'vercel-minimal' ? '#000000' : activeTemplate.id === 'wppm-purple' ? brandColor : '#FFFFFF' : previewStyles.sidebarText,
        borderLeft: isSelected ? `3px solid ${brandColor}` : '3px solid transparent'
      },
      className: `flex items-center gap-2.5 text-xs font-medium cursor-pointer transition-all ${itemPadding} ${isSelected ? '' : 'opacity-70 hover:opacity-100 hover:bg-slate-200/20'}`
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      style: {
        color: isSelected ? brandColor : 'inherit'
      }
    }, item.icon), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "truncate"
    }, item.label));
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex-1 flex flex-col overflow-hidden bg-slate-50"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      height: `${topBarHeight}px`,
      backgroundColor: previewStyles.topBarBg,
      borderBottom: previewStyles.topBarBorder
    },
    className: "flex items-center justify-between px-4 select-none shrink-0"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex items-center gap-3"
  }, !settings.hideTopBarItems?.siteName && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "text-xs font-medium truncate opacity-70"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Visit Site', 'saasvibe')), settings.environmentBadge?.enabled && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    style: {
      backgroundColor: settings.environmentBadge.color || brandColor,
      color: '#ffffff'
    },
    className: "text-[9px] font-semibold px-2 py-0.5 rounded-full block tracking-wide truncate"
  }, settings.environmentBadge.label || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('DEV', 'saasvibe'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex items-center gap-2 text-xs"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "opacity-70 truncate hidden md:inline"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Howdy, Admin', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    style: {
      backgroundColor: brandColor,
      color: brandTextColor
    },
    className: "w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]"
  }, "AD"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex-1 p-6 space-y-4 overflow-y-auto"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "h-6 w-1/3 bg-slate-200 rounded"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "grid grid-cols-3 gap-4"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "h-24 bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "h-3 w-1/2 bg-slate-200 rounded"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "h-6 w-1/3 bg-indigo-100 rounded"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "h-24 bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "h-3 w-1/2 bg-slate-200 rounded"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "h-6 w-1/3 bg-slate-200 rounded"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "h-24 bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "h-3 w-1/2 bg-slate-200 rounded"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "h-6 w-1/3 bg-slate-200 rounded"
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "h-32 bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-2"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "h-3.5 w-1/4 bg-slate-200 rounded"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "h-2.5 w-full bg-slate-100 rounded"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "h-2.5 w-full bg-slate-100 rounded"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "h-2.5 w-3/4 bg-slate-100 rounded"
  })))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "text-center"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: window.location.pathname,
    className: "inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium select-none",
    onClick: e => {
      e.preventDefault();
      alert((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Changes will apply to the live admin dashboard when you click "Save Settings" below.', 'saasvibe'));
    }
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Simulated View. Click "Save Settings" to apply changes.', 'saasvibe'), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], {
    className: "h-3 w-3"
  }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MenuPreview);

/***/ },

/***/ "./views/assets/src/components/TemplateSelector.jsx"
/*!**********************************************************!*\
  !*** ./views/assets/src/components/TemplateSelector.jsx ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TemplateSelector: () => (/* binding */ TemplateSelector),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/check.js");



const TemplateSelector = ({
  currentTemplate,
  onSelect
}) => {
  const templates = window.SaasMenu_Vars?.templates || [];
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "saasmenu-template-selector p-6"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-6"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
    className: "text-xl font-semibold text-slate-800 m-0"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select a Design Template', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "text-sm text-slate-500 mt-1"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Choose from modern SaaS templates to transform your WordPress dashboard.', 'saasvibe'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
  }, templates.map(template => {
    const isSelected = currentTemplate === template.id;
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: template.id,
      role: "button",
      tabIndex: 0,
      "aria-pressed": isSelected,
      onClick: () => onSelect(template.id),
      onKeyDown: e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(template.id);
        }
      },
      className: `relative border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 bg-white group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 ${isSelected ? 'border-indigo-600 ring-2 ring-indigo-100 shadow-md' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'}`
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "h-32 bg-slate-50 flex items-center justify-center relative border-b border-slate-100"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "w-4/5 h-20 bg-white border border-slate-200 rounded shadow-sm flex overflow-hidden"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        backgroundColor: template.defaultColors.background,
        width: '24%',
        borderRight: '1px solid rgba(0, 0, 0, 0.05)'
      },
      className: "h-full p-1.5 flex flex-col justify-between"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "space-y-1"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "h-2 w-8 bg-slate-300 rounded-sm opacity-50"
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "h-1.5 w-10 bg-slate-300 rounded-sm opacity-30"
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "h-1.5 w-6 bg-slate-300 rounded-sm opacity-30"
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        backgroundColor: template.defaultColors.accent
      },
      className: "h-2 w-full rounded-sm opacity-70"
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "flex-1 bg-slate-50 flex flex-col"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "h-4 bg-white border-b border-slate-200 flex items-center px-1"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "h-1.5 w-6 bg-slate-300 rounded-sm opacity-50"
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "p-2 space-y-1"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "h-2 w-16 bg-slate-200 rounded-sm"
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "h-1.5 w-full bg-slate-100 rounded-sm"
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "h-1.5 w-4/5 bg-slate-100 rounded-sm"
    })))), isSelected && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-1 shadow-sm"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], {
      className: "h-4 w-4"
    }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "p-4"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "flex items-center justify-between"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
      className: "font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors"
    }, template.name), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono"
    }, template.designRef)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "flex items-center justify-between mt-3 pt-3 border-t border-slate-100"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "flex items-center gap-1"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "text-[10px] text-slate-400 mr-1"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Palette:', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      style: {
        backgroundColor: template.defaultColors.background
      },
      className: "w-3.5 h-3.5 rounded-full border border-slate-200 block",
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Background', 'saasvibe')
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      style: {
        backgroundColor: template.defaultColors.accent
      },
      className: "w-3.5 h-3.5 rounded-full border border-slate-200 block",
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Accent', 'saasvibe')
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      style: {
        backgroundColor: template.defaultColors.hover
      },
      className: "w-3.5 h-3.5 rounded-full border border-slate-200 block",
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hover', 'saasvibe')
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "text-xs text-slate-400 capitalize"
    }, template.style === 'both' ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Full Theme', 'saasvibe') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Sidebar Only', 'saasvibe')))));
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TemplateSelector);

/***/ },

/***/ "./views/assets/src/hooks/useApi.js"
/*!******************************************!*\
  !*** ./views/assets/src/hooks/useApi.js ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   useApi: () => (/* binding */ useApi)
/* harmony export */ });
/**
 * Custom hook for REST API requests.
 * Leverages SaasMenu_Vars injected via wp_localize_script.
 */

const buildQueryString = params => {
  return Object.keys(params).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])).join('&');
};
const useApi = () => {
  const get = (path, params = {}) => {
    const restUrl = window.SaasMenu_Vars?.rest_url || '';
    const permission = window.SaasMenu_Vars?.permission || '';
    const isAdmin = window.SaasMenu_Vars?.is_admin || false;
    const queryParams = {
      ...params,
      is_admin: isAdmin
    };
    return fetch(`${restUrl}${path}?${buildQueryString(queryParams)}`, {
      headers: {
        'X-WP-Nonce': permission
      }
    }).then(r => {
      if (!r.ok) {
        return r.json().then(err => {
          throw err;
        });
      }
      return r.json();
    });
  };
  const post = (path, body = {}) => {
    const restUrl = window.SaasMenu_Vars?.rest_url || '';
    const permission = window.SaasMenu_Vars?.permission || '';
    const isAdmin = window.SaasMenu_Vars?.is_admin || false;
    const bodyData = {
      ...body,
      is_admin: isAdmin
    };
    return fetch(`${restUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': permission
      },
      body: JSON.stringify(bodyData)
    }).then(r => {
      if (!r.ok) {
        return r.json().then(err => {
          throw err;
        });
      }
      return r.json();
    });
  };
  return {
    get,
    post
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useApi);

/***/ },

/***/ "./node_modules/lucide-react/dist/esm/Icon.js"
/*!****************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/Icon.js ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Icon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _defaultAttributes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./defaultAttributes.js */ "./node_modules/lucide-react/dist/esm/defaultAttributes.js");
/* harmony import */ var _shared_src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared/src/utils.js */ "./node_modules/lucide-react/dist/esm/shared/src/utils.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */





const Icon = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(
      "svg",
      {
        ref,
        ..._defaultAttributes_js__WEBPACK_IMPORTED_MODULE_1__["default"],
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: (0,_shared_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.mergeClasses)("lucide", className),
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);


//# sourceMappingURL=Icon.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/createLucideIcon.js"
/*!****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/createLucideIcon.js ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createLucideIcon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _shared_src_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shared/src/utils.js */ "./node_modules/lucide-react/dist/esm/shared/src/utils.js");
/* harmony import */ var _Icon_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Icon.js */ "./node_modules/lucide-react/dist/esm/Icon.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */





const createLucideIcon = (iconName, iconNode) => {
  const Component = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(
    ({ className, ...props }, ref) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Icon_js__WEBPACK_IMPORTED_MODULE_2__["default"], {
      ref,
      iconNode,
      className: (0,_shared_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.mergeClasses)(`lucide-${(0,_shared_src_utils_js__WEBPACK_IMPORTED_MODULE_1__.toKebabCase)(iconName)}`, className),
      ...props
    })
  );
  Component.displayName = `${iconName}`;
  return Component;
};


//# sourceMappingURL=createLucideIcon.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/defaultAttributes.js"
/*!*****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/defaultAttributes.js ***!
  \*****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ defaultAttributes)
/* harmony export */ });
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};


//# sourceMappingURL=defaultAttributes.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/check.js"
/*!***********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/check.js ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Check)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Check = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);


//# sourceMappingURL=check.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/chevron-right.js"
/*!*******************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/chevron-right.js ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ChevronRight)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const ChevronRight = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);


//# sourceMappingURL=chevron-right.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/circle-check-big.js"
/*!**********************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/circle-check-big.js ***!
  \**********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CircleCheckBig)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const CircleCheckBig = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("CircleCheckBig", [
  ["path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14", key: "g774vq" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
]);


//# sourceMappingURL=circle-check-big.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/download.js"
/*!**************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/download.js ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Download)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Download = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Download", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "7 10 12 15 17 10", key: "2ggqvy" }],
  ["line", { x1: "12", x2: "12", y1: "15", y2: "3", key: "1vk2je" }]
]);


//# sourceMappingURL=download.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/external-link.js"
/*!*******************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/external-link.js ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ExternalLink)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const ExternalLink = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("ExternalLink", [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
]);


//# sourceMappingURL=external-link.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/file-json.js"
/*!***************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/file-json.js ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FileJson)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const FileJson = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("FileJson", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  [
    "path",
    { d: "M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1", key: "1oajmo" }
  ],
  [
    "path",
    { d: "M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1", key: "mpwhp6" }
  ]
]);


//# sourceMappingURL=file-json.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/file-text.js"
/*!***************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/file-text.js ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FileText)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const FileText = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("FileText", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
]);


//# sourceMappingURL=file-text.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/house.js"
/*!***********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/house.js ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ House)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const House = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("House", [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
]);


//# sourceMappingURL=house.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/layers.js"
/*!************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/layers.js ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Layers)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Layers = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Layers", [
  [
    "path",
    {
      d: "m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",
      key: "8b97xw"
    }
  ],
  ["path", { d: "m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65", key: "dd6zsq" }],
  ["path", { d: "m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65", key: "ep9fru" }]
]);


//# sourceMappingURL=layers.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/loader-circle.js"
/*!*******************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/loader-circle.js ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LoaderCircle)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const LoaderCircle = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);


//# sourceMappingURL=loader-circle.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/palette.js"
/*!*************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/palette.js ***!
  \*************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Palette)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Palette = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Palette", [
  ["circle", { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor", key: "1okk4w" }],
  ["circle", { cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor", key: "f64h9f" }],
  ["circle", { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor", key: "fotxhn" }],
  ["circle", { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor", key: "qy21gx" }],
  [
    "path",
    {
      d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",
      key: "12rzf8"
    }
  ]
]);


//# sourceMappingURL=palette.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/refresh-cw.js"
/*!****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/refresh-cw.js ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RefreshCw)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const RefreshCw = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("RefreshCw", [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
]);


//# sourceMappingURL=refresh-cw.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/settings.js"
/*!**************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/settings.js ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Settings)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Settings = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Settings", [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);


//# sourceMappingURL=settings.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/shield-alert.js"
/*!******************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/shield-alert.js ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ShieldAlert)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const ShieldAlert = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("ShieldAlert", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
]);


//# sourceMappingURL=shield-alert.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/sliders-vertical.js"
/*!**********************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/sliders-vertical.js ***!
  \**********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SlidersVertical)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const SlidersVertical = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("SlidersVertical", [
  ["line", { x1: "4", x2: "4", y1: "21", y2: "14", key: "1p332r" }],
  ["line", { x1: "4", x2: "4", y1: "10", y2: "3", key: "gb41h5" }],
  ["line", { x1: "12", x2: "12", y1: "21", y2: "12", key: "hf2csr" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "3", key: "1kfi7u" }],
  ["line", { x1: "20", x2: "20", y1: "21", y2: "16", key: "1lhrwl" }],
  ["line", { x1: "20", x2: "20", y1: "12", y2: "3", key: "16vvfq" }],
  ["line", { x1: "2", x2: "6", y1: "14", y2: "14", key: "1uebub" }],
  ["line", { x1: "10", x2: "14", y1: "8", y2: "8", key: "1yglbp" }],
  ["line", { x1: "18", x2: "22", y1: "16", y2: "16", key: "1jxqpz" }]
]);


//# sourceMappingURL=sliders-vertical.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/sparkles.js"
/*!**************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/sparkles.js ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Sparkles)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Sparkles = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Sparkles", [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
]);


//# sourceMappingURL=sparkles.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/upload.js"
/*!************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/upload.js ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Upload)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Upload = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Upload", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "17 8 12 3 7 8", key: "t8dd8p" }],
  ["line", { x1: "12", x2: "12", y1: "3", y2: "15", key: "widbto" }]
]);


//# sourceMappingURL=upload.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/user-check.js"
/*!****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/user-check.js ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UserCheck)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const UserCheck = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("UserCheck", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["polyline", { points: "16 11 18 13 22 9", key: "1pwet4" }]
]);


//# sourceMappingURL=user-check.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/users.js"
/*!***********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/users.js ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Users)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Users = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75", key: "1da9ce" }]
]);


//# sourceMappingURL=users.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/x.js"
/*!*******************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/x.js ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ X)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const X = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);


//# sourceMappingURL=x.js.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/shared/src/utils.js"
/*!****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/shared/src/utils.js ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mergeClasses: () => (/* binding */ mergeClasses),
/* harmony export */   toKebabCase: () => (/* binding */ toKebabCase)
/* harmony export */ });
/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && array.indexOf(className) === index;
}).join(" ");


//# sourceMappingURL=utils.js.map


/***/ },

/***/ "./views/assets/src/index.css"
/*!************************************!*\
  !*** ./views/assets/src/index.css ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "react"
/*!************************!*\
  !*** external "React" ***!
  \************************/
(module) {

module.exports = window["React"];

/***/ },

/***/ "react-dom"
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
(module) {

module.exports = window["ReactDOM"];

/***/ },

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["element"];

/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["i18n"];

/***/ },

/***/ "./node_modules/sonner/dist/index.mjs"
/*!********************************************!*\
  !*** ./node_modules/sonner/dist/index.mjs ***!
  \********************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Toaster: () => (/* binding */ $e),
/* harmony export */   toast: () => (/* binding */ ue),
/* harmony export */   useSonner: () => (/* binding */ Oe)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
"use client";var jt=n=>{switch(n){case"success":return ee;case"info":return ae;case"warning":return oe;case"error":return se;default:return null}},te=Array(12).fill(0),Yt=({visible:n,className:e})=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:["sonner-loading-wrapper",e].filter(Boolean).join(" "),"data-visible":n},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"sonner-spinner"},te.map((t,a)=>react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"sonner-loading-bar",key:`spinner-bar-${a}`})))),ee=react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",height:"20",width:"20"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",clipRule:"evenodd"})),oe=react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",height:"20",width:"20"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fillRule:"evenodd",d:"M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",clipRule:"evenodd"})),ae=react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",height:"20",width:"20"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",clipRule:"evenodd"})),se=react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",height:"20",width:"20"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",clipRule:"evenodd"})),Ot=react__WEBPACK_IMPORTED_MODULE_0__.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("line",{x1:"6",y1:"6",x2:"18",y2:"18"}));var Ft=()=>{let[n,e]=react__WEBPACK_IMPORTED_MODULE_0__.useState(document.hidden);return react__WEBPACK_IMPORTED_MODULE_0__.useEffect(()=>{let t=()=>{e(document.hidden)};return document.addEventListener("visibilitychange",t),()=>window.removeEventListener("visibilitychange",t)},[]),n};var bt=1,yt=class{constructor(){this.subscribe=e=>(this.subscribers.push(e),()=>{let t=this.subscribers.indexOf(e);this.subscribers.splice(t,1)});this.publish=e=>{this.subscribers.forEach(t=>t(e))};this.addToast=e=>{this.publish(e),this.toasts=[...this.toasts,e]};this.create=e=>{var S;let{message:t,...a}=e,u=typeof(e==null?void 0:e.id)=="number"||((S=e.id)==null?void 0:S.length)>0?e.id:bt++,f=this.toasts.find(g=>g.id===u),w=e.dismissible===void 0?!0:e.dismissible;return this.dismissedToasts.has(u)&&this.dismissedToasts.delete(u),f?this.toasts=this.toasts.map(g=>g.id===u?(this.publish({...g,...e,id:u,title:t}),{...g,...e,id:u,dismissible:w,title:t}):g):this.addToast({title:t,...a,dismissible:w,id:u}),u};this.dismiss=e=>(this.dismissedToasts.add(e),e||this.toasts.forEach(t=>{this.subscribers.forEach(a=>a({id:t.id,dismiss:!0}))}),this.subscribers.forEach(t=>t({id:e,dismiss:!0})),e);this.message=(e,t)=>this.create({...t,message:e});this.error=(e,t)=>this.create({...t,message:e,type:"error"});this.success=(e,t)=>this.create({...t,type:"success",message:e});this.info=(e,t)=>this.create({...t,type:"info",message:e});this.warning=(e,t)=>this.create({...t,type:"warning",message:e});this.loading=(e,t)=>this.create({...t,type:"loading",message:e});this.promise=(e,t)=>{if(!t)return;let a;t.loading!==void 0&&(a=this.create({...t,promise:e,type:"loading",message:t.loading,description:typeof t.description!="function"?t.description:void 0}));let u=e instanceof Promise?e:e(),f=a!==void 0,w,S=u.then(async i=>{if(w=["resolve",i],react__WEBPACK_IMPORTED_MODULE_0__.isValidElement(i))f=!1,this.create({id:a,type:"default",message:i});else if(ie(i)&&!i.ok){f=!1;let T=typeof t.error=="function"?await t.error(`HTTP error! status: ${i.status}`):t.error,F=typeof t.description=="function"?await t.description(`HTTP error! status: ${i.status}`):t.description;this.create({id:a,type:"error",message:T,description:F})}else if(t.success!==void 0){f=!1;let T=typeof t.success=="function"?await t.success(i):t.success,F=typeof t.description=="function"?await t.description(i):t.description;this.create({id:a,type:"success",message:T,description:F})}}).catch(async i=>{if(w=["reject",i],t.error!==void 0){f=!1;let D=typeof t.error=="function"?await t.error(i):t.error,T=typeof t.description=="function"?await t.description(i):t.description;this.create({id:a,type:"error",message:D,description:T})}}).finally(()=>{var i;f&&(this.dismiss(a),a=void 0),(i=t.finally)==null||i.call(t)}),g=()=>new Promise((i,D)=>S.then(()=>w[0]==="reject"?D(w[1]):i(w[1])).catch(D));return typeof a!="string"&&typeof a!="number"?{unwrap:g}:Object.assign(a,{unwrap:g})};this.custom=(e,t)=>{let a=(t==null?void 0:t.id)||bt++;return this.create({jsx:e(a),id:a,...t}),a};this.getActiveToasts=()=>this.toasts.filter(e=>!this.dismissedToasts.has(e.id));this.subscribers=[],this.toasts=[],this.dismissedToasts=new Set}},v=new yt,ne=(n,e)=>{let t=(e==null?void 0:e.id)||bt++;return v.addToast({title:n,...e,id:t}),t},ie=n=>n&&typeof n=="object"&&"ok"in n&&typeof n.ok=="boolean"&&"status"in n&&typeof n.status=="number",le=ne,ce=()=>v.toasts,de=()=>v.getActiveToasts(),ue=Object.assign(le,{success:v.success,info:v.info,warning:v.warning,error:v.error,custom:v.custom,message:v.message,promise:v.promise,dismiss:v.dismiss,loading:v.loading},{getHistory:ce,getToasts:de});function wt(n,{insertAt:e}={}){if(!n||typeof document=="undefined")return;let t=document.head||document.getElementsByTagName("head")[0],a=document.createElement("style");a.type="text/css",e==="top"&&t.firstChild?t.insertBefore(a,t.firstChild):t.appendChild(a),a.styleSheet?a.styleSheet.cssText=n:a.appendChild(document.createTextNode(n))}wt(`:where(html[dir="ltr"]),:where([data-sonner-toaster][dir="ltr"]){--toast-icon-margin-start: -3px;--toast-icon-margin-end: 4px;--toast-svg-margin-start: -1px;--toast-svg-margin-end: 0px;--toast-button-margin-start: auto;--toast-button-margin-end: 0;--toast-close-button-start: 0;--toast-close-button-end: unset;--toast-close-button-transform: translate(-35%, -35%)}:where(html[dir="rtl"]),:where([data-sonner-toaster][dir="rtl"]){--toast-icon-margin-start: 4px;--toast-icon-margin-end: -3px;--toast-svg-margin-start: 0px;--toast-svg-margin-end: -1px;--toast-button-margin-start: 0;--toast-button-margin-end: auto;--toast-close-button-start: unset;--toast-close-button-end: 0;--toast-close-button-transform: translate(35%, -35%)}:where([data-sonner-toaster]){position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1: hsl(0, 0%, 99%);--gray2: hsl(0, 0%, 97.3%);--gray3: hsl(0, 0%, 95.1%);--gray4: hsl(0, 0%, 93%);--gray5: hsl(0, 0%, 90.9%);--gray6: hsl(0, 0%, 88.7%);--gray7: hsl(0, 0%, 85.8%);--gray8: hsl(0, 0%, 78%);--gray9: hsl(0, 0%, 56.1%);--gray10: hsl(0, 0%, 52.3%);--gray11: hsl(0, 0%, 43.5%);--gray12: hsl(0, 0%, 9%);--border-radius: 8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:none;z-index:999999999;transition:transform .4s ease}:where([data-sonner-toaster][data-lifted="true"]){transform:translateY(-10px)}@media (hover: none) and (pointer: coarse){:where([data-sonner-toaster][data-lifted="true"]){transform:none}}:where([data-sonner-toaster][data-x-position="right"]){right:var(--offset-right)}:where([data-sonner-toaster][data-x-position="left"]){left:var(--offset-left)}:where([data-sonner-toaster][data-x-position="center"]){left:50%;transform:translate(-50%)}:where([data-sonner-toaster][data-y-position="top"]){top:var(--offset-top)}:where([data-sonner-toaster][data-y-position="bottom"]){bottom:var(--offset-bottom)}:where([data-sonner-toast]){--y: translateY(100%);--lift-amount: calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);filter:blur(0);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:none;overflow-wrap:anywhere}:where([data-sonner-toast][data-styled="true"]){padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px #0000001a;width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}:where([data-sonner-toast]:focus-visible){box-shadow:0 4px 12px #0000001a,0 0 0 2px #0003}:where([data-sonner-toast][data-y-position="top"]){top:0;--y: translateY(-100%);--lift: 1;--lift-amount: calc(1 * var(--gap))}:where([data-sonner-toast][data-y-position="bottom"]){bottom:0;--y: translateY(100%);--lift: -1;--lift-amount: calc(var(--lift) * var(--gap))}:where([data-sonner-toast]) :where([data-description]){font-weight:400;line-height:1.4;color:inherit}:where([data-sonner-toast]) :where([data-title]){font-weight:500;line-height:1.5;color:inherit}:where([data-sonner-toast]) :where([data-icon]){display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}:where([data-sonner-toast][data-promise="true"]) :where([data-icon])>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}:where([data-sonner-toast]) :where([data-icon])>*{flex-shrink:0}:where([data-sonner-toast]) :where([data-icon]) svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}:where([data-sonner-toast]) :where([data-content]){display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;cursor:pointer;outline:none;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}:where([data-sonner-toast]) :where([data-button]):focus-visible{box-shadow:0 0 0 2px #0006}:where([data-sonner-toast]) :where([data-button]):first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}:where([data-sonner-toast]) :where([data-cancel]){color:var(--normal-text);background:rgba(0,0,0,.08)}:where([data-sonner-toast][data-theme="dark"]) :where([data-cancel]){background:rgba(255,255,255,.3)}:where([data-sonner-toast]) :where([data-close-button]){position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast] [data-close-button]{background:var(--gray1)}:where([data-sonner-toast]) :where([data-close-button]):focus-visible{box-shadow:0 4px 12px #0000001a,0 0 0 2px #0003}:where([data-sonner-toast]) :where([data-disabled="true"]){cursor:not-allowed}:where([data-sonner-toast]):hover :where([data-close-button]):hover{background:var(--gray2);border-color:var(--gray5)}:where([data-sonner-toast][data-swiping="true"]):before{content:"";position:absolute;left:-50%;right:-50%;height:100%;z-index:-1}:where([data-sonner-toast][data-y-position="top"][data-swiping="true"]):before{bottom:50%;transform:scaleY(3) translateY(50%)}:where([data-sonner-toast][data-y-position="bottom"][data-swiping="true"]):before{top:50%;transform:scaleY(3) translateY(-50%)}:where([data-sonner-toast][data-swiping="false"][data-removed="true"]):before{content:"";position:absolute;inset:0;transform:scaleY(2)}:where([data-sonner-toast]):after{content:"";position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}:where([data-sonner-toast][data-mounted="true"]){--y: translateY(0);opacity:1}:where([data-sonner-toast][data-expanded="false"][data-front="false"]){--scale: var(--toasts-before) * .05 + 1;--y: translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}:where([data-sonner-toast])>*{transition:opacity .4s}:where([data-sonner-toast][data-expanded="false"][data-front="false"][data-styled="true"])>*{opacity:0}:where([data-sonner-toast][data-visible="false"]){opacity:0;pointer-events:none}:where([data-sonner-toast][data-mounted="true"][data-expanded="true"]){--y: translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}:where([data-sonner-toast][data-removed="true"][data-front="true"][data-swipe-out="false"]){--y: translateY(calc(var(--lift) * -100%));opacity:0}:where([data-sonner-toast][data-removed="true"][data-front="false"][data-swipe-out="false"][data-expanded="true"]){--y: translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}:where([data-sonner-toast][data-removed="true"][data-front="false"][data-swipe-out="false"][data-expanded="false"]){--y: translateY(40%);opacity:0;transition:transform .5s,opacity .2s}:where([data-sonner-toast][data-removed="true"][data-front="false"]):before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y, 0px)) translate(var(--swipe-amount-x, 0px));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{0%{transform:var(--y) translate(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translate(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{0%{transform:var(--y) translate(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translate(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{0%{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{0%{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width: 600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-theme=light]{--normal-bg: #fff;--normal-border: var(--gray4);--normal-text: var(--gray12);--success-bg: hsl(143, 85%, 96%);--success-border: hsl(145, 92%, 91%);--success-text: hsl(140, 100%, 27%);--info-bg: hsl(208, 100%, 97%);--info-border: hsl(221, 91%, 91%);--info-text: hsl(210, 92%, 45%);--warning-bg: hsl(49, 100%, 97%);--warning-border: hsl(49, 91%, 91%);--warning-text: hsl(31, 92%, 45%);--error-bg: hsl(359, 100%, 97%);--error-border: hsl(359, 100%, 94%);--error-text: hsl(360, 100%, 45%)}[data-sonner-toaster][data-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg: #000;--normal-border: hsl(0, 0%, 20%);--normal-text: var(--gray1)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg: #fff;--normal-border: var(--gray3);--normal-text: var(--gray12)}[data-sonner-toaster][data-theme=dark]{--normal-bg: #000;--normal-bg-hover: hsl(0, 0%, 12%);--normal-border: hsl(0, 0%, 20%);--normal-border-hover: hsl(0, 0%, 25%);--normal-text: var(--gray1);--success-bg: hsl(150, 100%, 6%);--success-border: hsl(147, 100%, 12%);--success-text: hsl(150, 86%, 65%);--info-bg: hsl(215, 100%, 6%);--info-border: hsl(223, 100%, 12%);--info-text: hsl(216, 87%, 65%);--warning-bg: hsl(64, 100%, 6%);--warning-border: hsl(60, 100%, 12%);--warning-text: hsl(46, 87%, 65%);--error-bg: hsl(358, 76%, 10%);--error-border: hsl(357, 89%, 16%);--error-text: hsl(358, 100%, 81%)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success],[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info],[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning],[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error],[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size: 16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:nth-child(1){animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}to{opacity:.15}}@media (prefers-reduced-motion){[data-sonner-toast],[data-sonner-toast]>*,.sonner-loading-bar{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}
`);function tt(n){return n.label!==void 0}var pe=3,me="32px",ge="16px",Wt=4e3,he=356,be=14,ye=20,we=200;function M(...n){return n.filter(Boolean).join(" ")}function xe(n){let[e,t]=n.split("-"),a=[];return e&&a.push(e),t&&a.push(t),a}var ve=n=>{var Dt,Pt,Nt,Bt,Ct,kt,It,Mt,Ht,At,Lt;let{invert:e,toast:t,unstyled:a,interacting:u,setHeights:f,visibleToasts:w,heights:S,index:g,toasts:i,expanded:D,removeToast:T,defaultRichColors:F,closeButton:et,style:ut,cancelButtonStyle:ft,actionButtonStyle:l,className:ot="",descriptionClassName:at="",duration:X,position:st,gap:pt,loadingIcon:rt,expandByDefault:B,classNames:s,icons:P,closeButtonAriaLabel:nt="Close toast",pauseWhenPageIsHidden:it}=n,[Y,C]=react__WEBPACK_IMPORTED_MODULE_0__.useState(null),[lt,J]=react__WEBPACK_IMPORTED_MODULE_0__.useState(null),[W,H]=react__WEBPACK_IMPORTED_MODULE_0__.useState(!1),[A,mt]=react__WEBPACK_IMPORTED_MODULE_0__.useState(!1),[L,z]=react__WEBPACK_IMPORTED_MODULE_0__.useState(!1),[ct,d]=react__WEBPACK_IMPORTED_MODULE_0__.useState(!1),[h,y]=react__WEBPACK_IMPORTED_MODULE_0__.useState(!1),[R,j]=react__WEBPACK_IMPORTED_MODULE_0__.useState(0),[p,_]=react__WEBPACK_IMPORTED_MODULE_0__.useState(0),O=react__WEBPACK_IMPORTED_MODULE_0__.useRef(t.duration||X||Wt),G=react__WEBPACK_IMPORTED_MODULE_0__.useRef(null),k=react__WEBPACK_IMPORTED_MODULE_0__.useRef(null),Vt=g===0,Ut=g+1<=w,N=t.type,V=t.dismissible!==!1,Kt=t.className||"",Xt=t.descriptionClassName||"",dt=react__WEBPACK_IMPORTED_MODULE_0__.useMemo(()=>S.findIndex(r=>r.toastId===t.id)||0,[S,t.id]),Jt=react__WEBPACK_IMPORTED_MODULE_0__.useMemo(()=>{var r;return(r=t.closeButton)!=null?r:et},[t.closeButton,et]),Tt=react__WEBPACK_IMPORTED_MODULE_0__.useMemo(()=>t.duration||X||Wt,[t.duration,X]),gt=react__WEBPACK_IMPORTED_MODULE_0__.useRef(0),U=react__WEBPACK_IMPORTED_MODULE_0__.useRef(0),St=react__WEBPACK_IMPORTED_MODULE_0__.useRef(0),K=react__WEBPACK_IMPORTED_MODULE_0__.useRef(null),[Gt,Qt]=st.split("-"),Rt=react__WEBPACK_IMPORTED_MODULE_0__.useMemo(()=>S.reduce((r,m,c)=>c>=dt?r:r+m.height,0),[S,dt]),Et=Ft(),qt=t.invert||e,ht=N==="loading";U.current=react__WEBPACK_IMPORTED_MODULE_0__.useMemo(()=>dt*pt+Rt,[dt,Rt]),react__WEBPACK_IMPORTED_MODULE_0__.useEffect(()=>{O.current=Tt},[Tt]),react__WEBPACK_IMPORTED_MODULE_0__.useEffect(()=>{H(!0)},[]),react__WEBPACK_IMPORTED_MODULE_0__.useEffect(()=>{let r=k.current;if(r){let m=r.getBoundingClientRect().height;return _(m),f(c=>[{toastId:t.id,height:m,position:t.position},...c]),()=>f(c=>c.filter(b=>b.toastId!==t.id))}},[f,t.id]),react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect(()=>{if(!W)return;let r=k.current,m=r.style.height;r.style.height="auto";let c=r.getBoundingClientRect().height;r.style.height=m,_(c),f(b=>b.find(x=>x.toastId===t.id)?b.map(x=>x.toastId===t.id?{...x,height:c}:x):[{toastId:t.id,height:c,position:t.position},...b])},[W,t.title,t.description,f,t.id]);let $=react__WEBPACK_IMPORTED_MODULE_0__.useCallback(()=>{mt(!0),j(U.current),f(r=>r.filter(m=>m.toastId!==t.id)),setTimeout(()=>{T(t)},we)},[t,T,f,U]);react__WEBPACK_IMPORTED_MODULE_0__.useEffect(()=>{if(t.promise&&N==="loading"||t.duration===1/0||t.type==="loading")return;let r;return D||u||it&&Et?(()=>{if(St.current<gt.current){let b=new Date().getTime()-gt.current;O.current=O.current-b}St.current=new Date().getTime()})():(()=>{O.current!==1/0&&(gt.current=new Date().getTime(),r=setTimeout(()=>{var b;(b=t.onAutoClose)==null||b.call(t,t),$()},O.current))})(),()=>clearTimeout(r)},[D,u,t,N,it,Et,$]),react__WEBPACK_IMPORTED_MODULE_0__.useEffect(()=>{t.delete&&$()},[$,t.delete]);function Zt(){var r,m,c;return P!=null&&P.loading?react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:M(s==null?void 0:s.loader,(r=t==null?void 0:t.classNames)==null?void 0:r.loader,"sonner-loader"),"data-visible":N==="loading"},P.loading):rt?react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:M(s==null?void 0:s.loader,(m=t==null?void 0:t.classNames)==null?void 0:m.loader,"sonner-loader"),"data-visible":N==="loading"},rt):react__WEBPACK_IMPORTED_MODULE_0__.createElement(Yt,{className:M(s==null?void 0:s.loader,(c=t==null?void 0:t.classNames)==null?void 0:c.loader),visible:N==="loading"})}return react__WEBPACK_IMPORTED_MODULE_0__.createElement("li",{tabIndex:0,ref:k,className:M(ot,Kt,s==null?void 0:s.toast,(Dt=t==null?void 0:t.classNames)==null?void 0:Dt.toast,s==null?void 0:s.default,s==null?void 0:s[N],(Pt=t==null?void 0:t.classNames)==null?void 0:Pt[N]),"data-sonner-toast":"","data-rich-colors":(Nt=t.richColors)!=null?Nt:F,"data-styled":!(t.jsx||t.unstyled||a),"data-mounted":W,"data-promise":!!t.promise,"data-swiped":h,"data-removed":A,"data-visible":Ut,"data-y-position":Gt,"data-x-position":Qt,"data-index":g,"data-front":Vt,"data-swiping":L,"data-dismissible":V,"data-type":N,"data-invert":qt,"data-swipe-out":ct,"data-swipe-direction":lt,"data-expanded":!!(D||B&&W),style:{"--index":g,"--toasts-before":g,"--z-index":i.length-g,"--offset":`${A?R:U.current}px`,"--initial-height":B?"auto":`${p}px`,...ut,...t.style},onDragEnd:()=>{z(!1),C(null),K.current=null},onPointerDown:r=>{ht||!V||(G.current=new Date,j(U.current),r.target.setPointerCapture(r.pointerId),r.target.tagName!=="BUTTON"&&(z(!0),K.current={x:r.clientX,y:r.clientY}))},onPointerUp:()=>{var x,Q,q,Z;if(ct||!V)return;K.current=null;let r=Number(((x=k.current)==null?void 0:x.style.getPropertyValue("--swipe-amount-x").replace("px",""))||0),m=Number(((Q=k.current)==null?void 0:Q.style.getPropertyValue("--swipe-amount-y").replace("px",""))||0),c=new Date().getTime()-((q=G.current)==null?void 0:q.getTime()),b=Y==="x"?r:m,I=Math.abs(b)/c;if(Math.abs(b)>=ye||I>.11){j(U.current),(Z=t.onDismiss)==null||Z.call(t,t),J(Y==="x"?r>0?"right":"left":m>0?"down":"up"),$(),d(!0),y(!1);return}z(!1),C(null)},onPointerMove:r=>{var Q,q,Z,zt;if(!K.current||!V||((Q=window.getSelection())==null?void 0:Q.toString().length)>0)return;let c=r.clientY-K.current.y,b=r.clientX-K.current.x,I=(q=n.swipeDirections)!=null?q:xe(st);!Y&&(Math.abs(b)>1||Math.abs(c)>1)&&C(Math.abs(b)>Math.abs(c)?"x":"y");let x={x:0,y:0};Y==="y"?(I.includes("top")||I.includes("bottom"))&&(I.includes("top")&&c<0||I.includes("bottom")&&c>0)&&(x.y=c):Y==="x"&&(I.includes("left")||I.includes("right"))&&(I.includes("left")&&b<0||I.includes("right")&&b>0)&&(x.x=b),(Math.abs(x.x)>0||Math.abs(x.y)>0)&&y(!0),(Z=k.current)==null||Z.style.setProperty("--swipe-amount-x",`${x.x}px`),(zt=k.current)==null||zt.style.setProperty("--swipe-amount-y",`${x.y}px`)}},Jt&&!t.jsx?react__WEBPACK_IMPORTED_MODULE_0__.createElement("button",{"aria-label":nt,"data-disabled":ht,"data-close-button":!0,onClick:ht||!V?()=>{}:()=>{var r;$(),(r=t.onDismiss)==null||r.call(t,t)},className:M(s==null?void 0:s.closeButton,(Bt=t==null?void 0:t.classNames)==null?void 0:Bt.closeButton)},(Ct=P==null?void 0:P.close)!=null?Ct:Ot):null,t.jsx||(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(t.title)?t.jsx?t.jsx:typeof t.title=="function"?t.title():t.title:react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,N||t.icon||t.promise?react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{"data-icon":"",className:M(s==null?void 0:s.icon,(kt=t==null?void 0:t.classNames)==null?void 0:kt.icon)},t.promise||t.type==="loading"&&!t.icon?t.icon||Zt():null,t.type!=="loading"?t.icon||(P==null?void 0:P[N])||jt(N):null):null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{"data-content":"",className:M(s==null?void 0:s.content,(It=t==null?void 0:t.classNames)==null?void 0:It.content)},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{"data-title":"",className:M(s==null?void 0:s.title,(Mt=t==null?void 0:t.classNames)==null?void 0:Mt.title)},typeof t.title=="function"?t.title():t.title),t.description?react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{"data-description":"",className:M(at,Xt,s==null?void 0:s.description,(Ht=t==null?void 0:t.classNames)==null?void 0:Ht.description)},typeof t.description=="function"?t.description():t.description):null),(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(t.cancel)?t.cancel:t.cancel&&tt(t.cancel)?react__WEBPACK_IMPORTED_MODULE_0__.createElement("button",{"data-button":!0,"data-cancel":!0,style:t.cancelButtonStyle||ft,onClick:r=>{var m,c;tt(t.cancel)&&V&&((c=(m=t.cancel).onClick)==null||c.call(m,r),$())},className:M(s==null?void 0:s.cancelButton,(At=t==null?void 0:t.classNames)==null?void 0:At.cancelButton)},t.cancel.label):null,(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(t.action)?t.action:t.action&&tt(t.action)?react__WEBPACK_IMPORTED_MODULE_0__.createElement("button",{"data-button":!0,"data-action":!0,style:t.actionButtonStyle||l,onClick:r=>{var m,c;tt(t.action)&&((c=(m=t.action).onClick)==null||c.call(m,r),!r.defaultPrevented&&$())},className:M(s==null?void 0:s.actionButton,(Lt=t==null?void 0:t.classNames)==null?void 0:Lt.actionButton)},t.action.label):null))};function _t(){if(typeof window=="undefined"||typeof document=="undefined")return"ltr";let n=document.documentElement.getAttribute("dir");return n==="auto"||!n?window.getComputedStyle(document.documentElement).direction:n}function Te(n,e){let t={};return[n,e].forEach((a,u)=>{let f=u===1,w=f?"--mobile-offset":"--offset",S=f?ge:me;function g(i){["top","right","bottom","left"].forEach(D=>{t[`${w}-${D}`]=typeof i=="number"?`${i}px`:i})}typeof a=="number"||typeof a=="string"?g(a):typeof a=="object"?["top","right","bottom","left"].forEach(i=>{a[i]===void 0?t[`${w}-${i}`]=S:t[`${w}-${i}`]=typeof a[i]=="number"?`${a[i]}px`:a[i]}):g(S)}),t}function Oe(){let[n,e]=react__WEBPACK_IMPORTED_MODULE_0__.useState([]);return react__WEBPACK_IMPORTED_MODULE_0__.useEffect(()=>v.subscribe(t=>{if(t.dismiss){setTimeout(()=>{react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync(()=>{e(a=>a.filter(u=>u.id!==t.id))})});return}setTimeout(()=>{react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync(()=>{e(a=>{let u=a.findIndex(f=>f.id===t.id);return u!==-1?[...a.slice(0,u),{...a[u],...t},...a.slice(u+1)]:[t,...a]})})})}),[]),{toasts:n}}var $e=(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(function(e,t){let{invert:a,position:u="bottom-right",hotkey:f=["altKey","KeyT"],expand:w,closeButton:S,className:g,offset:i,mobileOffset:D,theme:T="light",richColors:F,duration:et,style:ut,visibleToasts:ft=pe,toastOptions:l,dir:ot=_t(),gap:at=be,loadingIcon:X,icons:st,containerAriaLabel:pt="Notifications",pauseWhenPageIsHidden:rt}=e,[B,s]=react__WEBPACK_IMPORTED_MODULE_0__.useState([]),P=react__WEBPACK_IMPORTED_MODULE_0__.useMemo(()=>Array.from(new Set([u].concat(B.filter(d=>d.position).map(d=>d.position)))),[B,u]),[nt,it]=react__WEBPACK_IMPORTED_MODULE_0__.useState([]),[Y,C]=react__WEBPACK_IMPORTED_MODULE_0__.useState(!1),[lt,J]=react__WEBPACK_IMPORTED_MODULE_0__.useState(!1),[W,H]=react__WEBPACK_IMPORTED_MODULE_0__.useState(T!=="system"?T:typeof window!="undefined"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"),A=react__WEBPACK_IMPORTED_MODULE_0__.useRef(null),mt=f.join("+").replace(/Key/g,"").replace(/Digit/g,""),L=react__WEBPACK_IMPORTED_MODULE_0__.useRef(null),z=react__WEBPACK_IMPORTED_MODULE_0__.useRef(!1),ct=react__WEBPACK_IMPORTED_MODULE_0__.useCallback(d=>{s(h=>{var y;return(y=h.find(R=>R.id===d.id))!=null&&y.delete||v.dismiss(d.id),h.filter(({id:R})=>R!==d.id)})},[]);return react__WEBPACK_IMPORTED_MODULE_0__.useEffect(()=>v.subscribe(d=>{if(d.dismiss){s(h=>h.map(y=>y.id===d.id?{...y,delete:!0}:y));return}setTimeout(()=>{react_dom__WEBPACK_IMPORTED_MODULE_1__.flushSync(()=>{s(h=>{let y=h.findIndex(R=>R.id===d.id);return y!==-1?[...h.slice(0,y),{...h[y],...d},...h.slice(y+1)]:[d,...h]})})})}),[]),react__WEBPACK_IMPORTED_MODULE_0__.useEffect(()=>{if(T!=="system"){H(T);return}if(T==="system"&&(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?H("dark"):H("light")),typeof window=="undefined")return;let d=window.matchMedia("(prefers-color-scheme: dark)");try{d.addEventListener("change",({matches:h})=>{H(h?"dark":"light")})}catch(h){d.addListener(({matches:y})=>{try{H(y?"dark":"light")}catch(R){console.error(R)}})}},[T]),react__WEBPACK_IMPORTED_MODULE_0__.useEffect(()=>{B.length<=1&&C(!1)},[B]),react__WEBPACK_IMPORTED_MODULE_0__.useEffect(()=>{let d=h=>{var R,j;f.every(p=>h[p]||h.code===p)&&(C(!0),(R=A.current)==null||R.focus()),h.code==="Escape"&&(document.activeElement===A.current||(j=A.current)!=null&&j.contains(document.activeElement))&&C(!1)};return document.addEventListener("keydown",d),()=>document.removeEventListener("keydown",d)},[f]),react__WEBPACK_IMPORTED_MODULE_0__.useEffect(()=>{if(A.current)return()=>{L.current&&(L.current.focus({preventScroll:!0}),L.current=null,z.current=!1)}},[A.current]),react__WEBPACK_IMPORTED_MODULE_0__.createElement("section",{ref:t,"aria-label":`${pt} ${mt}`,tabIndex:-1,"aria-live":"polite","aria-relevant":"additions text","aria-atomic":"false",suppressHydrationWarning:!0},P.map((d,h)=>{var j;let[y,R]=d.split("-");return B.length?react__WEBPACK_IMPORTED_MODULE_0__.createElement("ol",{key:d,dir:ot==="auto"?_t():ot,tabIndex:-1,ref:A,className:g,"data-sonner-toaster":!0,"data-theme":W,"data-y-position":y,"data-lifted":Y&&B.length>1&&!w,"data-x-position":R,style:{"--front-toast-height":`${((j=nt[0])==null?void 0:j.height)||0}px`,"--width":`${he}px`,"--gap":`${at}px`,...ut,...Te(i,D)},onBlur:p=>{z.current&&!p.currentTarget.contains(p.relatedTarget)&&(z.current=!1,L.current&&(L.current.focus({preventScroll:!0}),L.current=null))},onFocus:p=>{p.target instanceof HTMLElement&&p.target.dataset.dismissible==="false"||z.current||(z.current=!0,L.current=p.relatedTarget)},onMouseEnter:()=>C(!0),onMouseMove:()=>C(!0),onMouseLeave:()=>{lt||C(!1)},onDragEnd:()=>C(!1),onPointerDown:p=>{p.target instanceof HTMLElement&&p.target.dataset.dismissible==="false"||J(!0)},onPointerUp:()=>J(!1)},B.filter(p=>!p.position&&h===0||p.position===d).map((p,_)=>{var O,G;return react__WEBPACK_IMPORTED_MODULE_0__.createElement(ve,{key:p.id,icons:st,index:_,toast:p,defaultRichColors:F,duration:(O=l==null?void 0:l.duration)!=null?O:et,className:l==null?void 0:l.className,descriptionClassName:l==null?void 0:l.descriptionClassName,invert:a,visibleToasts:ft,closeButton:(G=l==null?void 0:l.closeButton)!=null?G:S,interacting:lt,position:d,style:l==null?void 0:l.style,unstyled:l==null?void 0:l.unstyled,classNames:l==null?void 0:l.classNames,cancelButtonStyle:l==null?void 0:l.cancelButtonStyle,actionButtonStyle:l==null?void 0:l.actionButtonStyle,removeToast:ct,toasts:B.filter(k=>k.position==p.position),heights:nt.filter(k=>k.position==p.position),setHeights:it,expandByDefault:w,gap:at,loadingIcon:X,expanded:Y,pauseWhenPageIsHidden:rt,swipeDirections:e.swipeDirections})})):null}))});
//# sourceMappingURL=index.mjs.map

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!************************************!*\
  !*** ./views/assets/src/index.jsx ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var sonner__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! sonner */ "./node_modules/sonner/dist/index.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/check.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/chevron-right.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/file-json.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/layers.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/palette.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/user-check.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/loader-circle.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/sliders-vertical.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/sparkles.js");
/* harmony import */ var _hooks_useApi__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @hooks/useApi */ "./views/assets/src/hooks/useApi.js");
/* harmony import */ var _components_TemplateSelector__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/TemplateSelector */ "./views/assets/src/components/TemplateSelector.jsx");
/* harmony import */ var _components_ColorCustomizer__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/ColorCustomizer */ "./views/assets/src/components/ColorCustomizer.jsx");
/* harmony import */ var _components_MenuPreview__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/MenuPreview */ "./views/assets/src/components/MenuPreview.jsx");
/* harmony import */ var _components_ExportModal__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/ExportModal */ "./views/assets/src/components/ExportModal.jsx");
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./index.css */ "./views/assets/src/index.css");













// Simple sanitization helper
const sanitize = html => {
  if (typeof html !== 'string') {
    return '';
  }
  return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
};

// Expose public bridge
window.Saasvibe = {
  components: {
    TemplateSelector: _components_TemplateSelector__WEBPACK_IMPORTED_MODULE_14__["default"],
    ColorCustomizer: _components_ColorCustomizer__WEBPACK_IMPORTED_MODULE_15__["default"],
    MenuPreview: _components_MenuPreview__WEBPACK_IMPORTED_MODULE_16__["default"]
  },
  utils: {
    sanitize
  }
};
const App = () => {
  const api = (0,_hooks_useApi__WEBPACK_IMPORTED_MODULE_13__["default"])();

  // Configuration states loaded from localized variable
  const initialSettings = window.SaasMenu_Vars?.settings || {};
  const [settings, setSettings] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    templateId: 'linear-dark',
    brandColor: '#5E6AD2',
    density: 'normal',
    customLogo: '',
    topBarHeight: 46,
    sidebarWidth: 240,
    environmentBadge: {
      enabled: true,
      label: 'Development',
      color: '#5E6AD2'
    },
    hideTopBarItems: {
      wpLogo: true,
      siteName: false,
      search: false,
      notifications: false,
      howdy: false
    },
    roleVisibility: {},
    wizard_completed: false,
    ...initialSettings
  });
  const [activeTab, setActiveTab] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('templates');
  const [isSaving, setIsSaving] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [showExportModal, setShowExportModal] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [showWizard, setShowWizard] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!settings.wizard_completed);
  const [wizardStep, setWizardStep] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1);

  // Get active template info
  const templates = window.SaasMenu_Vars?.templates || [];
  const activeTemplate = templates.find(t => t.id === settings.templateId) || templates[0];

  // Apply theme class based on active template
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const isDarkTemplate = ['linear-dark'].includes(settings.templateId);
    if (isDarkTemplate) {
      document.body.classList.add('saasvibe-dark-theme');
    } else {
      document.body.classList.remove('saasvibe-dark-theme');
    }
  }, [settings.templateId]);
  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const handleNestedChange = (parentKey, childKey, value) => {
    setSettings(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value
      }
    }));
  };
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await api.post('settings', settings);
      if (response.success) {
        sonner__WEBPACK_IMPORTED_MODULE_3__.toast.success((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Settings saved successfully!', 'saasvibe'));
        // Sync global var so page reloads have it
        if (window.SaasMenu_Vars) {
          window.SaasMenu_Vars.settings = response.data;
        }
      } else {
        sonner__WEBPACK_IMPORTED_MODULE_3__.toast.error(response.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Failed to save settings.', 'saasvibe'));
      }
    } catch (err) {
      // Handle WP_Error responses from validation failures
      const errorMessage = err.message || err.data?.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Connection error. Please try again.', 'saasvibe');
      sonner__WEBPACK_IMPORTED_MODULE_3__.toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };
  const handleWizardComplete = async () => {
    setIsSaving(true);
    const updatedSettings = {
      ...settings,
      wizard_completed: true
    };
    try {
      const response = await api.post('settings', updatedSettings);
      if (response.success) {
        setSettings(updatedSettings);
        setShowWizard(false);
        sonner__WEBPACK_IMPORTED_MODULE_3__.toast.success((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Wizard completed! Welcome to your new admin panel.', 'saasvibe'));
      }
    } catch (err) {
      sonner__WEBPACK_IMPORTED_MODULE_3__.toast.error((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Error saving wizard progress.', 'saasvibe'));
    } finally {
      setIsSaving(false);
    }
  };

  // Render Wizard View
  if (showWizard) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "fixed inset-0 flex items-center justify-center p-4 z-[9999] bg-slate-100/80 backdrop-blur-md select-none text-slate-800"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col md:flex-row min-h-[500px]"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "bg-slate-50 p-8 md:w-1/3 flex flex-col justify-between border-r border-slate-200"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "space-y-4"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "flex items-center gap-2 text-indigo-600"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_12__["default"], {
      className: "h-6 w-6 animate-pulse"
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "font-bold text-sm tracking-wider uppercase"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('WP Nav Designer', 'saasvibe'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
      className: "text-2xl font-bold leading-tight text-slate-800"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Transform your admin backend.', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "text-xs text-slate-500 leading-relaxed"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Get set up in less than 60 seconds. Customize templates, match brand elements, and assign clean workspaces.', 'saasvibe'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "space-y-3 mt-8"
    }, [{
      step: 1,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Design Theme', 'saasvibe')
    }, {
      step: 2,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Brand Identity', 'saasvibe')
    }, {
      step: 3,
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('All Done', 'saasvibe')
    }].map(s => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: s.step,
      className: "flex items-center gap-2.5"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: `w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${wizardStep === s.step ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : wizardStep > s.step ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-400'}`
    }, wizardStep > s.step ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], {
      className: "h-3 w-3"
    }) : s.step), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: `text-xs font-semibold ${wizardStep === s.step ? 'text-slate-800' : 'text-slate-400'}`
    }, s.label))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "flex-1 p-8 flex flex-col justify-between bg-white"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "flex-1"
    }, wizardStep === 1 && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "space-y-6"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "text-xs text-indigo-600 font-bold uppercase tracking-wider"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Step 1 of 3', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
      className: "text-xl font-bold mt-1 text-slate-800"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Choose a visual layout', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "text-xs text-slate-500 mt-1"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select the layout theme that matches your brand style.', 'saasvibe'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2"
    }, templates.slice(0, 3).map(t => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: t.id,
      onClick: () => handleSettingChange('templateId', t.id),
      className: `border rounded-xl p-4 cursor-pointer transition-all ${settings.templateId === t.id ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:shadow-xs'}`
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "flex items-center justify-between"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "text-xs font-bold"
    }, t.name), settings.templateId === t.id && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "bg-indigo-600 text-white rounded-full p-0.5"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], {
      className: "h-3 w-3"
    }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "text-[10px] text-slate-400 mt-1 block font-mono"
    }, t.designRef))))), wizardStep === 2 && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "space-y-6"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
      className: "text-xs text-indigo-600 font-bold uppercase tracking-wider"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Step 2 of 3', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
      className: "text-xl font-bold mt-1 text-slate-800"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Establish brand color & logo', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "text-xs text-slate-500 mt-1"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Inject your identity directly into the sidebar highlights and top accent.', 'saasvibe'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "space-y-4"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "space-y-2"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
      className: "text-xs font-medium text-slate-500 block"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Brand color (HEX)', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "flex items-center gap-3"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
      type: "color",
      value: settings.brandColor,
      onChange: e => handleSettingChange('brandColor', e.target.value),
      className: "w-10 h-10 p-0 border border-slate-200 rounded cursor-pointer bg-transparent"
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
      type: "text",
      value: settings.brandColor,
      onChange: e => handleSettingChange('brandColor', e.target.value),
      className: "border border-slate-300 rounded px-3 py-1.5 text-xs font-mono uppercase text-slate-800 w-32"
    }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "space-y-2"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
      className: "text-xs font-medium text-slate-500 block"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Custom Logo URL (Optional)', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
      type: "text",
      placeholder: "https://yoursite.com/logo.png",
      value: settings.customLogo,
      onChange: e => handleSettingChange('customLogo', e.target.value),
      className: "border border-slate-300 rounded px-3 py-2 text-xs w-full focus:outline-none focus:border-indigo-600 text-slate-800 bg-white"
    })))), wizardStep === 3 && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "space-y-6"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "text-center py-6 space-y-3"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-200"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], {
      className: "h-6 w-6"
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
      className: "text-xl font-bold text-slate-800"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Setup Complete!', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      className: "text-xs text-slate-500 max-w-sm mx-auto leading-relaxed"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Your configuration defaults have been set. Saving changes will transform your WordPress dashboard experience.', 'saasvibe'))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "flex justify-between items-center mt-8 pt-4 border-t border-slate-100 shrink-0"
    }, wizardStep > 1 ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
      onClick: () => setWizardStep(prev => prev - 1),
      className: "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 px-4 py-2 rounded-lg text-xs font-medium transition-colors"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Back', 'saasvibe')) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
      onClick: () => {
        // Skip entire wizard
        handleWizardComplete();
      },
      className: "text-slate-400 hover:text-slate-600 text-xs font-medium"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Skip Setup', 'saasvibe')), wizardStep < 3 ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
      onClick: () => setWizardStep(prev => prev + 1),
      className: "bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Continue', 'saasvibe'), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], {
      className: "h-3.5 w-3.5"
    })) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
      onClick: handleWizardComplete,
      disabled: isSaving,
      className: "bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
    }, isSaving ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"], {
      className: "h-4 w-4 animate-spin"
    }) : null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Start Customizing', 'saasvibe'))))));
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "saasvibe-container min-h-screen bg-slate-50 flex flex-col select-none"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(sonner__WEBPACK_IMPORTED_MODULE_3__.Toaster, {
    position: "top-right",
    richColors: true
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("header", {
    className: "bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm shrink-0"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex items-center gap-3"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bg-indigo-600 text-white p-2 rounded-xl"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_12__["default"], {
    className: "h-5 w-5"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h1", {
    className: "text-lg font-bold text-slate-800 m-0 leading-tight"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Saasvibe', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: "text-xs text-slate-400"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Version %s', 'saasvibe'), window.SaasMenu_Vars?.version || '2.0.0')))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex items-center gap-3"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: () => setShowWizard(true),
    className: "bg-white border border-slate-200 hover:border-slate-300 text-slate-600 px-4 py-2 rounded-lg text-xs font-medium transition-colors"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Onboarding Wizard', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: handleSaveSettings,
    disabled: isSaving,
    className: "bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
  }, isSaving ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"], {
    className: "h-4 w-4 animate-spin"
  }) : null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Save Settings', 'saasvibe')))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex-1 flex flex-col lg:flex-row overflow-hidden min-h-[500px]"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex-1 flex flex-col bg-white overflow-y-auto"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex border-b border-slate-100 bg-slate-50/50 px-6 overflow-x-auto shrink-0"
  }, [{
    id: 'templates',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Templates', 'saasvibe'),
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], {
      className: "h-4 w-4"
    })
  }, {
    id: 'colors',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Colors & Sizing', 'saasvibe'),
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], {
      className: "h-4 w-4"
    })
  }, {
    id: 'roles',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Role Visibility', 'saasvibe'),
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], {
      className: "h-4 w-4"
    })
  }, {
    id: 'advanced',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Advanced', 'saasvibe'),
    icon: (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_11__["default"], {
      className: "h-4 w-4"
    })
  }].map(tab => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    key: tab.id,
    onClick: () => setActiveTab(tab.id),
    className: `flex items-center gap-2 py-4 px-4 border-b-2 text-xs font-semibold transition-all ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`
  }, tab.icon, tab.label))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex-1 overflow-y-auto"
  }, activeTab === 'templates' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_TemplateSelector__WEBPACK_IMPORTED_MODULE_14__["default"], {
    currentTemplate: settings.templateId,
    onSelect: id => handleSettingChange('templateId', id)
  }), activeTab === 'colors' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_ColorCustomizer__WEBPACK_IMPORTED_MODULE_15__["default"], {
    settings: settings,
    onChange: handleSettingChange,
    activeTemplate: activeTemplate
  }), activeTab === 'roles' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "p-6"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "mb-6"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
    className: "text-xl font-semibold text-slate-800 m-0"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Role-Based Visibility Matrix', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "text-sm text-slate-500 mt-1"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Select which WordPress user roles should hide specific navigation menu items.', 'saasvibe'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("table", {
    className: "w-full text-left text-xs border-collapse"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("thead", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", {
    className: "bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold select-none"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", {
    className: "p-4"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Navigation Menu Item', 'saasvibe')), (window.SaasMenu_Vars?.roles || []).map(role => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", {
    key: role.key,
    className: "p-4 text-center"
  }, role.name)))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tbody", null, (window.SaasMenu_Vars?.menuItems || []).map(item => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", {
    key: item.id,
    className: "border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
    className: "p-4 font-medium text-slate-700"
  }, item.title), (window.SaasMenu_Vars?.roles || []).map(role => {
    const isHidden = settings.roleVisibility?.[role.key]?.[item.id] || false;
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
      key: role.key,
      className: "p-4 text-center"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
      type: "checkbox",
      checked: isHidden,
      onChange: e => {
        const roleMap = settings.roleVisibility?.[role.key] || {};
        const updatedRoleMap = {
          ...roleMap,
          [item.id]: e.target.checked
        };
        handleSettingChange('roleVisibility', {
          ...settings.roleVisibility,
          [role.key]: updatedRoleMap
        });
      },
      className: "rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
    }));
  }))))))), activeTab === 'advanced' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "p-6 space-y-6"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
    className: "text-xl font-semibold text-slate-800 m-0"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Advanced Configuration', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "text-sm text-slate-500 mt-1"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Set up target development environment indicators and manage JSON exports.', 'saasvibe'))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "border border-slate-200 rounded-xl p-6 bg-white space-y-4"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
    className: "text-sm font-semibold text-slate-800 m-0"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Environment Badge', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "space-y-4"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex items-center gap-3"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "checkbox",
    id: "env-badge-enabled",
    checked: settings.environmentBadge?.enabled,
    onChange: e => handleNestedChange('environmentBadge', 'enabled', e.target.checked),
    className: "rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    htmlFor: "env-badge-enabled",
    className: "text-xs font-semibold text-slate-700"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Show Environment Indicator Badge in Top Bar', 'saasvibe'))), settings.environmentBadge?.enabled && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "grid grid-cols-2 gap-4 pt-2"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "space-y-1"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "text-xs font-medium text-slate-500 block"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Badge Label', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    value: settings.environmentBadge.label,
    onChange: e => handleNestedChange('environmentBadge', 'label', e.target.value),
    className: "border border-slate-200 rounded px-3 py-1.5 text-xs w-full focus:outline-none focus:border-indigo-500"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "space-y-1"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
    className: "text-xs font-medium text-slate-500 block"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Badge Color (HEX)', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex items-center gap-2"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "color",
    value: settings.environmentBadge.color,
    onChange: e => handleNestedChange('environmentBadge', 'color', e.target.value),
    className: "w-8 h-8 p-0 border-0 rounded cursor-pointer bg-transparent"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    value: settings.environmentBadge.color,
    onChange: e => handleNestedChange('environmentBadge', 'color', e.target.value),
    className: "border border-slate-200 rounded px-2 py-1 text-xs w-24 font-mono uppercase"
  })))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "border border-slate-200 rounded-xl p-6 bg-white space-y-4"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
    className: "text-sm font-semibold text-slate-800 m-0"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Data Backup & Deployment', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "text-xs text-slate-500 max-w-lg"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Deploy layouts seamlessly. Export configurations into a JSON file, or upload configuration packages on new WordPress instances.', 'saasvibe')), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    onClick: () => setShowExportModal(true),
    className: "bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], {
    className: "h-4 w-4"
  }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Import / Export Config Package', 'saasvibe')))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "lg:w-[460px] xl:w-[500px] bg-slate-50 shrink-0"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_MenuPreview__WEBPACK_IMPORTED_MODULE_16__["default"], {
    settings: settings,
    activeTemplate: activeTemplate
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_ExportModal__WEBPACK_IMPORTED_MODULE_17__["default"], {
    isOpen: showExportModal,
    onClose: () => setShowExportModal(false),
    onImportSuccess: importedSettings => {
      setSettings(importedSettings);
      setShowExportModal(false);
      sonner__WEBPACK_IMPORTED_MODULE_3__.toast.success((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Import successfully written! Save to apply.', 'saasvibe'));
    }
  }));
};
const rootEl = document.getElementById('saasvibe-app');
if (rootEl) {
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createRoot)(rootEl).render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(App, null));
}
})();

/******/ })()
;
//# sourceMappingURL=saasmenu.js.map