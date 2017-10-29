require('./app/core/UBApp')
require('./app/view/UBDropZone')
require('./app/view/ErrorWindow')

/**
 * Main UnityBase Ext-based client file
 */

function launchApp () {
// for a unhandled rejection in bluebird-q
  if (window.Q && window.Q.getBluebirdPromise) {
    window.Q.onerror = function (error) {
      window.onerror.apply(this, [ '', '', '', '', error ])
    }
  }
// for unhandled rejection in bluebird/native promises (IE 10+)
  window.addEventListener('unhandledrejection', function (e) {
    // NOTE: e.preventDefault() must be manually called to prevent the default
    // action which is currently to log the stack trace to console.warn
    e.preventDefault()
    // NOTE: parameters are properties of the event detail property
    let reason = e.detail ? e.detail.reason : e.reason
    let promise = e.detail ? e.detail.promise : e.promise
    // See Promise.onPossiblyUnhandledRejection for parameter documentation
    if (window.onerror) window.onerror.apply(this, [ '', '', '', '', reason ])
    console.error('UNHANDLED', reason, promise)
  })

  window.onerror = function (msg, file, line, column, errorObj) {
    var message, detail = '', strace, isHandled

    if (errorObj && UB.UBAbortError && errorObj instanceof UB.UBAbortError) {
      console.log(errorObj)
      return
    }
    isHandled = errorObj && UB.UBError && errorObj instanceof UB.UBError

    if (errorObj && Error && errorObj instanceof Error) {
      message = errorObj.message
      detail = ''
      if (/q\.js/.test(file) === false) {
        detail += 'file: "' + file + '" line: ' + line
      }
      strace = errorObj.stack || ''
      detail += strace.replace(/\?ubver=\w*/g, '').replace(/\?ver=\w*/g, '') // remove any versions
      detail = detail.replace(new RegExp(window.location.origin.replace(/\:/g, '\\$&'), 'g'), '') // remove address if same as origin
      detail = detail.replace(/\/[\w-]+\.js:/g, '<b>$&</b>&nbsp;line ') // file name is BOLD
      detail = detail.replace(/\n/g, '<br>&nbsp;&nbsp;')
    } else if (errorObj && errorObj.data && errorObj.data.errMsg) {
      message = errorObj.data.errMsg
    } else if (errorObj && errorObj.status === 0) { // long network request
      message = 'serverIsBusy'
      isHandled = true
    } else if (errorObj && errorObj.errMsg) {
      message = errorObj.errMsg
      detail = errorObj.detail ? errorObj.detail : message
    } else {
      message = errorObj && (typeof errorObj === 'string') ? errorObj : msg
    }
    if (errorObj && errorObj.detail) {
      detail = errorObj.detail + (detail ? '<BR/>' + detail : '')
      // 405 Method Not Allowed
      if (errorObj.detail === 'Method Not Allowed') {
        message = 'recordNotExistsOrDontHaveRights'
      }
    }
    if (!message) {
      message = 'internalServerError'
    }

    if (!isHandled) {
      // MPV - message is already in datail (stack trace)
      // detail = message + '<BR/> ' + detail;
      message = 'unknownError'
    }
    try {
      if (UB.showErrorWindow) {
        UB.showErrorWindow(message, '', '', detail)
      } else {
        alert(message)
      }
    } catch (err) {
      alert(message)
    }
  }

// disable shadow for all floating window
  Ext.Window.prototype.floating = { shadow: false }

  var core = require('@unitybase/ub-pub')
  var addResourceVersion = core.addResourceVersion
  Ext.Loader.loadScriptBase = Ext.Loader.loadScript
  Ext.Loader.loadScript = function (options) {
    var config = this.getConfig(),
      isString = typeof options === 'string',
      opt = options
    if (!config.disableCaching) {
      if (!isString) {
        opt = Ext.clone(options)
        opt.url = addResourceVersion(opt.url)
      } else {
        opt = addResourceVersion(opt)
      }
    }
    this.loadScriptBase(opt)
  }

  Ext.Loader.loadScriptFileBase = Ext.Loader.loadScriptFile
  Ext.Loader.loadScriptFile = function (url, onLoad, onError, scope, synchronous) {
    // debugger
    try {
      throw new Error('Component "' + url + '" is loaded directly using Ext.require or inderectly by one of Ext.create({"requires":.., "extend": ..., "mixins": ...}) directive) - in UB4 use require() instead')
    } catch (e) {
      console.warn(e)
    }
    Ext.Loader.isLoading = true
    SystemJS.import(url).then(
      function () {
        return onLoad.call(scope)
      },
      function () {
        return onError.call(scope)
      }
    )
    // var config = this.getConfig()
    // if (!config.disableCaching) {
    //   url = addResourceVersion(url)
    // }
    // this.loadScriptFileBase(url, onLoad, onError, scope, synchronous)
  }

  // Ext.require([
  //   'UB.core.UBApp',
  //   'UB.view.UBDropZone',
  //   'UB.view.ErrorWindow',
  //   'Ext.AbstractManager'
  // ])
  Ext.onReady(extLoaded)
  /**
   * !!!
   * Patch for correct work with timezones
   * !!!
   * */
  Ext.JSON.encodeDate = JSON.stringify

  /**
   * Wrapper in global scope, that allows to use toLog() function on client in the same way
   * as on server. It forwards message to console.debug().
   * @param {String} message text, which you want to log
   * @param {String} [param] text which will replace '%' char in message
   */
  window.toLog = function (message, param) {
    if (console && console.debug) {
      if (param) {
        console.debug(message.replace('%', '%s'), param)
      } else {
        console.debug(message)
      }
    }
  }

  // Ext.onReady(function () {
  function extLoaded () {
    Ext.tip.QuickTipManager.init()
    // this override is just for set separate mask for modal windows & loading mask
    // one line of code changed compared to original: cls: Ext.baseCSSPrefix + 'modal-mask', //mpv
    Ext.override(Ext.ZIndexManager, {
      _showModalMask: function (comp) {
        var me = this, zIndex = comp.el.getStyle('zIndex') - 4, maskTarget = comp.floatParent ? comp.floatParent.getTargetEl() : comp.container, mask = me.mask

        if (!mask) {
          // Create the mask at zero size so that it does not affect upcoming target measurements.
          mask = me.mask = Ext.getBody().createChild({
            role: 'presentation',
            cls: 'ub-mask'// Ext.baseCSSPrefix + 'modal-mask', //mpv
            // style: 'height:0;width:0'
          })
          mask.setVisibilityMode(Ext.Element.DISPLAY)
          mask.on('click', me._onMaskClick, me)
        }

        mask.maskTarget = maskTarget

        mask.setStyle('zIndex', zIndex)

        // setting mask box before showing it in an IE7 strict iframe within a quirks page
        // can cause body scrolling [EXTJSIV-6219]
        mask.show()
      }
    })

    /**
     * Patch for HUGE speed-up of all ext component destruction
     */
    Ext.override(Ext.AbstractManager, {
      unregister: function (item) {
        if (item.id) {
          this.all.removeAtKey(item.id)
        } else {
          this.all.remove(item)
        }
      }
    })

// Patch for "skip" form. When "Ext.LoadMask" use "visibility" for hide mask element and element extends beyond the screen the "viewPort" is expanding.
    Ext.override(Ext.LoadMask, {
      getMaskEl: function () {
        var me = this
        if (me.maskEl || me.el) {
          (me.maskEl || me.el).setVisibilityMode(Ext.Element.DISPLAY)
        }
        return me.callParent(arguments)
      }
    })

    // fix hide submenu (in chrome 43)
    Ext.override(Ext.menu.Menu, {
      onMouseLeave: function (e) {
        var me = this

        // BEGIN FIX
        var visibleSubmenu = false
        me.items.each(function (item) {
          if (item.menu && item.menu.isVisible()) {
            visibleSubmenu = true
          }
        })
        if (visibleSubmenu) {
          // console.log('apply fix hide submenu');
          return
        }
        // END FIX

        me.deactivateActiveItem()

        if (me.disabled) {
          return
        }

        me.fireEvent('mouseleave', me, e)
      }
    })

    /* solutions for problems with a narrow field of chromium */
    Ext.override(Ext.layout.component.field.Field, {
      beginLayoutFixed: function (ownerContext, width, suffix) {
        var owner = ownerContext.target,
          inputEl = owner.inputEl,
          inputWidth = owner.inputWidth

        owner.el.setStyle('table-layout', 'fixed')
        if (width !== 100 && suffix !== '%') {
          owner.bodyEl.setStyle('width', width + suffix)
        }
        if (inputEl) {
          if (inputWidth) {
            inputEl.setStyle('width', inputWidth + 'px')
          }
        }
        ownerContext.isFixed = true
      }
    })

    /**
     * It is override Ext.form.field.Text for visually select required field
     */
    Ext.override(Ext.form.field.Text, {
      initComponent: function () {
        var me = this
        me.requiredCls = 'ub-require-control-u'
        me.callParent(arguments)
      },

      afterRender: function () {
        var me = this

        me.callParent(arguments)

        if (!me.allowBlank) {
          me.setAllowBlank(me.allowBlank)
        }
      },

      fieldSubTpl: [ // note: {id} here is really {inputId}, but {cmpId} is available
        '<input id="{id}" type="{type}" role="{role}" {inputAttrTpl}',
        // ' size="1"', /* solutions for problems with a narrow field of chromium */ // allows inputs to fully respect CSS widths across all browsers
        '<tpl if="name"> name="{name}"</tpl>',
        '<tpl if="value"> value="{[Ext.util.Format.htmlEncode(values.value)]}"</tpl>',
        '<tpl if="placeholder"> placeholder="{placeholder}"</tpl>',
        '{%if (values.maxLength !== undefined){%} maxlength="{maxLength}"{%}%}',
        '<tpl if="readOnly"> readonly="readonly"</tpl>',
        '<tpl if="disabled"> disabled="disabled"</tpl>',
        '<tpl if="tabIdx"> tabIndex="{tabIdx}"</tpl>',
        '<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>',
        ' class="{fieldCls} {typeCls} {editableCls} {inputCls} x-form-field-text" />',  // autocomplete="off"
        {
          disableFormats: true
        }
      ],

      /**
       *  @cfg {String} requireText Text for placeHolder. Default value 'pleaseInputValueToThisField'.
       */
      requireText: 'pleaseInputValueToThisField',
      /**
       * This method allow change the allowBlank property dynamically
       * @param allowBlank
       */
      setAllowBlank: function (allowBlank) {
        var me = this
        me.allowBlank = allowBlank
        if (!me.inputEl) {
          return
        }
        if (allowBlank) {
          me.inputEl.removeCls(me.requiredCls)
          me.inputEl.dom.removeAttribute('placeholder')
        } else {
          me.inputEl.addCls(me.requiredCls)
          if (me.requireText) {
            me.inputEl.dom.setAttribute('placeholder', UB.i18n(me.requireText))
          }
        }
      }
    })

    Ext.override(Ext.form.field.Base, {
      /**
       * @cfg leftIndent Width in pixels of left field indent. Default 15.
       */
      leftIndent: 15,
      /**
       * @cfg rightIndent Width in pixels of right field indent. Default 15.
       */
      rightIndent: 15,
      /**
       * @cfg withoutIndent Disable all field indent when true. Default true.
       */
      margin: '3 15 2 15',  // 9 15 9 15
      withoutIndent: true,
      getLabelableRenderData: function () {
        var me = this, data

        data = me.callParent(arguments)
        if (!me.withoutIndent) {
          data.leftIndent = me.leftIndent
          data.rightIndent = me.rightIndent
        }
        return data
      },

      labelableRenderTpl: [
        // body row. If a heighted Field (eg TextArea, HtmlEditor, this must greedily consume height.
        '<tr role="presentation" id="{id}-inputRow" <tpl if="inFormLayout">id="{id}"</tpl> class="{inputRowCls}">',
        '<tpl if="leftIndent">',
        '<td class="labelable-left-indent" style="width: {leftIndent}px;" ></td>',
        '</tpl>',

        // Label cell
        '<tpl if="labelOnLeft">',
        '<td role="presentation" id="{id}-labelCell" style="{labelCellStyle}" {labelCellAttrs}>',
        '{beforeLabelTpl}',
        '<label id="{id}-labelEl" {labelAttrTpl}',
        '<tpl if="inputId && !(boxLabel && !fieldLabel)"> for="{inputId}"</tpl>',
        ' class="{labelCls}"',
        '<tpl if="labelStyle"> style="{labelStyle}"</tpl>',
        // Required for Opera
        ' unselectable="on"',
        '>',
        '{beforeLabelTextTpl}',
        '<tpl if="fieldLabel">{fieldLabel}',
        '<tpl if="labelSeparator">',
        '<span role="separator">{labelSeparator}</span>',
        '</tpl>',
        '</tpl>',
        '{afterLabelTextTpl}',
        '</label>',
        '{afterLabelTpl}',
        '</td>',
        '</tpl>',

        // Body of the input. That will be an input element, or, from a TriggerField, a table containing an input cell and trigger cell(s)
        '<td role="presentation" class="{baseBodyCls} {fieldBodyCls} {extraFieldBodyCls}" id="{id}-bodyEl" colspan="{bodyColspan}" role="presentation">',
        '{beforeBodyEl}',

        // Label just sits on top of the input field if labelAlign === 'top'
        '<tpl if="labelAlign==\'top\'">',
        '{beforeLabelTpl}',
        '<div role="presentation" id="{id}-labelCell" style="{labelCellStyle}">',
        '<label id="{id}-labelEl" {labelAttrTpl}<tpl if="inputId"> for="{inputId}"</tpl> class="{labelCls}"',
        '<tpl if="labelStyle"> style="{labelStyle}"</tpl>',
        // Required for Opera
        ' unselectable="on"',
        '>',
        '{beforeLabelTextTpl}',
        '<tpl if="fieldLabel">{fieldLabel}',
        '<tpl if="labelSeparator">',
        '<span role="separator">{labelSeparator}</span>',
        '</tpl>',
        '</tpl>',
        '{afterLabelTextTpl}',
        '</label>',
        '</div>',
        '{afterLabelTpl}',
        '</tpl>',

        '{beforeSubTpl}',
        '{[values.$comp.getSubTplMarkup(values)]}',
        '{afterSubTpl}',

        // Final TD. It's a side error element unless there's a floating external one
        '<tpl if="msgTarget===\'side\'">',
        '{afterBodyEl}',
        '</td>',
        '<td role="presentation" id="{id}-sideErrorCell" vAlign="{[values.labelAlign===\'top\' && !values.hideLabel ? \'bottom\' : \'middle\']}" style="{[values.autoFitErrors ? \'display:none\' : \'\']}" width="{errorIconWidth}">',
        '<div role="alert" aria-live="polite" id="{id}-errorEl" class="{errorMsgCls}" style="display:none"></div>',
        '</td>',
        '<tpl elseif="msgTarget==\'under\'">',
        '<div role="alert" aria-live="polite" id="{id}-errorEl" class="{errorMsgClass}" colspan="2" style="display:none"></div>',
        '{afterBodyEl}',
        '</td>',
        '</tpl>',
        '<tpl if="rightIndent">',
        '<td class="labelable-right-indent" style="width: {rightIndent}px;" ></td>',
        '</tpl>',
        '</tr>',
        {
          disableFormats: true
        }
      ]
    })

    Ext.override(Ext.form.FieldContainer, {
      margin: '0 15 0 15'
    })

    Ext.override(Ext.layout.container.Accordion, {
      beforeRenderItems: function (items) {
        var me = this, i, comp
        for (i = 0; i < items.length; i++) {
          comp = items[i]
          comp.simpleCollapse = true
        }
        me.callParent([items])
      }
    })

    Ext.override(Ext.panel.Panel, {
      initTools: function () {
        var me = this, vertical
        if (me.simpleCollapse) {
          me.tools = []

          me.toggleCmp = Ext.widget({
            xtype: 'component',
            autoEl: {
              tag: 'div'
            },
            height: 15,
            width: 35,
            isHeader: true,
            id: me.id + '-legendToggle',
            style: 'float: left; font-size: 1.4em; padding-left: 12px; cursor: pointer;',
            scope: me
          })
          me.toggleCmp.on('boxready', function () {
            // me.toggleCmp.getEl().on('click', me.toggle, me);
          })
          if (!me.collapsed) {
            me.toggleCmp.addCls(['fa', 'fa-angle-down'])
          } else {
            me.toggleCmp.addCls(['fa', 'fa-angle-right'])
          }

          vertical = me.headerPosition === 'left' || me.headerPosition === 'right'
          me.header = Ext.widget(Ext.apply({
            xtype: 'header',
            title: me.title,
            titleAlign: me.titleAlign,
            orientation: vertical ? 'vertical' : 'horizontal',
            dock: me.headerPosition || 'top',
            textCls: me.headerTextCls,
            iconCls: me.iconCls,
            icon: me.icon,
            glyph: me.glyph,
            baseCls: me.baseCls + '-header',
            tools: [me.toggleCmp],
            ui: me.ui,
            id: me.id + '_header',
            overCls: me.headerOverCls,
            indicateDrag: me.draggable,
            frame: (me.frame || me.alwaysFramed) && me.frameHeader,
            ignoreParentFrame: me.frame || me.overlapHeader,
            ignoreBorderManagement: me.frame || me.ignoreHeaderBorderManagement,
            headerRole: me.headerRole,
            ownerCt: me,
            listeners: me.collapsible && me.titleCollapse ? {
              click: me.toggleCollapse,
              scope: me
            } : null
          }, me.header))

          me.header.titleCmp.flex = undefined
          me.header.addCls(['accordion-header'])

          me.addDocked(me.header, 0)
        } else {
          me.callParent(arguments)
        }
      },

      toggleC: function () {
        var me = this
        if (!me.toggleCmp) {
          return
        }
        if (!me.collapsed) {
          me.toggleCmp.removeCls('fa-angle-right')
          me.toggleCmp.addCls('fa-angle-down')
        } else {
          me.toggleCmp.removeCls('fa-angle-down')
          me.toggleCmp.addCls('fa-angle-right')
        }
      },

      expand: function (animate) {
        var me = this
        me.callParent(arguments)
        me.toggleC()
      },

      collapse: function (direction, animate) {
        var me = this
        me.callParent(arguments)
        me.toggleC()
      },

      updateCollapseTool: function () {
        var me = this
        if (!me.simpleCollapse) {
          me.callParent(arguments)
        }
      }
    })

    Ext.util.CSS.refreshCache() // !!! Fix for 4.2.0 || в исходниках ExtJS согласно http://www.sencha.com/forum/showthread.php?251691-Ext.utils.CSS.getRule-always-throws-error&p=921906&viewfull=1#post921906
    delete Ext.tip.Tip.prototype.minWidth

    Ext.Ajax.timeout = 120000

    if ('onHashChange' in window) {
      window.addEventListener('hashchange', UB.core.UBApp.locationHashChanged, false)
    } else {
      window.onhashchange = UB.core.UBApp.locationHashChanged
    }

    Ext.setGlyphFontFamily('FontAwesome')

    Ext.state.Manager.setProvider(Ext.create('Ext.state.LocalStorageProvider'))
    // Ext.FocusManager.enable({focusFrame: true});
    $App.launch().fin(function () {
      Ext.get(Ext.query('html.loading')).removeCls('loading')
    })

    // Cancel the default behavior Ctrl+R to of the user input is not lost
    new Ext.util.KeyMap({
      target: window.document.body,
      binding: [ {
        ctrl: true,
        shift: false,
        key: Ext.EventObject.R,
        fn: function (keyCode, e) {
          e.stopEvent()
          return false
        }
      } ]
    })

    // Stop the backspace key from going to the previous page in your extjs app
    Ext.EventManager.addListener(Ext.getBody(), 'keydown', function (e) {
      var
        type = (e.getTarget().tagName || '').toLocaleLowerCase(),
        eKey = e.getKey()
      if (eKey === Ext.EventObject.BACKSPACE && 'textarea|input'.indexOf(type) < 0) {
        e.preventDefault()
      }

      if (e.getKey() === Ext.EventObject.C && e.ctrlKey && e.altKey) {
        UB.core.UBFormLoader.clearFormCache()
      }
    })

    // init dropzone
    UB.view.UBDropZone.init()

    window.onbeforeunload = function () {
      window.onbeforeunload = null
      window.toLog = null
      window.onerror = null
      if ($App.connection) {
        $App.connection.logout()
      }
    }
    // totally disable context menu for cases we do not handle it on application logic layer
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault()
    }, false)
  }
}

module.exports = launchApp
