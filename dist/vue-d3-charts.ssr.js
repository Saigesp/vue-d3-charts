'use strict';Object.defineProperty(exports,'__esModule',{value:true});var d3Selection=require('d3-selection'),d3Scale=require('d3-scale'),d3Array=require('d3-array'),d3Transition=require('d3-transition'),d3Axis=require('d3-axis'),d3Ease=require('d3-ease'),d3ScaleChromatic=require('d3-scale-chromatic'),d3TimeFormat=require('d3-time-format'),d3Shape=require('d3-shape'),d3Interpolate=require('d3-interpolate'),d3Hierarchy=require('d3-hierarchy'),cloud=require('d3-cloud');function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}//
//
//
//
//
//
//
//
var script = {
  name: 'D3Chart',
  data: function data() {
    return {
      chart: {}
    };
  },
  props: {
    config: {
      type: Object,
      required: true,
      default: function _default() {
        return {};
      }
    },
    datum: {
      type: Array,
      required: true,
      default: function _default() {
        return [];
      }
    },
    title: {
      type: String,
      default: ''
    },
    source: {
      type: String,
      default: ''
    },
    height: {
      type: [Number, String],
      default: 300
    }
  },
  watch: {
    config: {
      handler: function handler(val) {
        this.chart.updateConfig(val);
      },
      deep: true
    },
    datum: function datum(vals) {
      this.chart.updateData(_toConsumableArray(vals));
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.chart.destroyChart();
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        return () => { };
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: () => context._renderStyles(context._styles)
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return (id, style) => addStyle(id, style, context);
}
function addStyle(id, css, context) {
    const group =  css.media || 'default' ;
    const style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        let code = css.source;
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    let css = '';
    for (const key in styles) {
        const style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "chart__wrapper"
  }, [_vm._ssrNode((_vm.title ? "<div class=\"chart__title\">" + _vm._ssrEscape(_vm._s(_vm.title)) + "</div>" : "<!---->") + " <div" + _vm._ssrStyle(null, {
    height: this.height + "px"
  }, null) + "></div> " + (_vm.source ? "<div class=\"chart__source\">" + _vm._ssrEscape(_vm._s(_vm.source)) + "</div>" : "<!---->"))]);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-52bb9522_0", {
    source: ".chart__wrapper{margin:20px 0}.chart__wrap{margin:0}.chart__title{text-align:center;font-weight:700}.chart__source{font-size:12px}.chart__tooltip{position:absolute;pointer-events:none;display:none}.chart__tooltip.active{display:block}.chart__tooltip>div{background:#2b2b2b;color:#fff;padding:6px 10px;border-radius:3px}.chart__axis{font-size:12px;shape-rendering:crispEdges}.chart__grid .domain{stroke:none;fill:none}.chart__grid .tick line{opacity:.2}.chart__label{font-size:12px}.chart .clickable{cursor:pointer}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = "data-v-52bb9522";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject shadow dom */

var __vue_component__ = normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, createInjectorSSR, undefined);var d3 = {
  select: d3Selection.select
};
/**
* D3 Chart Base
*/

var d3chart =
/*#__PURE__*/
function () {
  function d3chart(selection, data, config, cfg) {
    var _this = this;

    _classCallCheck(this, d3chart);

    this.selection = d3.select(selection);
    this.data = data;
    this.cfg = cfg;

    this._setConfig(config); // Resize listener


    this.onResize = function () {
      _this.resizeChart();
    };

    window.addEventListener("resize", this.onResize);
    this.initChart();
  }

  _createClass(d3chart, [{
    key: "_setConfig",
    value: function _setConfig(config) {
      var _this2 = this;

      // Set up configuration
      Object.keys(config).forEach(function (key) {
        if (config[key] instanceof Object && config[key] instanceof Array === false) {
          Object.keys(config[key]).forEach(function (sk) {
            _this2.cfg[key][sk] = config[key][sk];
          });
        } else _this2.cfg[key] = config[key];
      });
    }
    /**
    * Init chart
    */

  }, {
    key: "initChart",
    value: function initChart() {
      console.error('d3chart.initChart not implemented');
    }
    /**
    * Resize chart pipe
    */

  }, {
    key: "setScales",
    value: function setScales() {
      console.error('d3chart.setScales not implemented');
    }
    /**
    * Set chart dimensional sizes
    */

  }, {
    key: "setChartDimension",
    value: function setChartDimension() {
      console.error('d3chart.setChartDimension not implemented');
    }
    /**
    * Bind data to main elements groups
    */

  }, {
    key: "bindData",
    value: function bindData() {
      console.error('d3.chart.bindData not implemented');
    }
    /**
    * Add new chart's elements
    */

  }, {
    key: "enterElements",
    value: function enterElements() {
      console.error('d3.chart.enterElements not implemented');
    }
    /**
    * Update chart's elements based on data change
    */

  }, {
    key: "updateElements",
    value: function updateElements() {
      console.error('d3.chart.updateElements not implemented');
    }
    /**
    * Remove chart's elements without data
    */

  }, {
    key: "exitElements",
    value: function exitElements() {
      console.error('d3.chart.exitElements not implemented');
    }
    /**
    * Set up chart dimensions
    */

  }, {
    key: "getDimensions",
    value: function getDimensions() {
      this.cfg.width = parseInt(this.selection.node().offsetWidth) - this.cfg.margin.left - this.cfg.margin.right;
      this.cfg.height = parseInt(this.selection.node().offsetHeight) - this.cfg.margin.top - this.cfg.margin.bottom;
    }
    /**
    * Returns chart's data
    */

  }, {
    key: "getData",
    value: function getData() {
      return this.data;
    }
    /**
    * Add new data elements
    */

  }, {
    key: "enterData",
    value: function enterData(data) {
      this.data = this.data.concat(data);
      this.setScales();
      this.updateChart();
    }
    /**
    * Update existing data elements
    */

  }, {
    key: "updateData",
    value: function updateData(data) {
      this.data = _toConsumableArray(data);
      this.setScales();
      this.updateChart();
    }
    /**
    * Compute data before operate
    */

  }, {
    key: "computeData",
    value: function computeData() {}
    /**
    * Remove data elements
    */

  }, {
    key: "exitData",
    value: function exitData(filter) {
      var _this3 = this;

      this.data.forEach(function (d, i) {
        var c = 0;
        Object.keys(filter).forEach(function (key) {
          if (filter[key] == d[key]) c++;
        });

        if (c == Object.keys(filter).length) {
          _this3.data.splice(i, 1);
        }
      });
      this.setScales();
      this.updateChart();
    }
    /**
    * Init chart commons elements (div > svg > g; tooltip)
    */

  }, {
    key: "initChartFrame",
    value: function initChartFrame() {
      var classname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'undefined';
      // Wrapper div
      this.wrap = this.selection.append('div').attr("class", "chart__wrap chart__wrap--" + classname); // SVG element

      this.svg = this.wrap.append('svg').attr("class", "chart chart--" + classname); // General group for margin convention

      this.g = this.svg.append("g").attr("class", "chart__margin-wrap chart__margin-wrap--" + classname).attr("transform", "translate(".concat(this.cfg.margin.left, ",").concat(this.cfg.margin.top, ")")); // Tooltip

      this.selection.selectAll('.chart__tooltip').remove();
      this.tooltip = this.wrap.append('div').attr('class', "chart__tooltip chart__tooltip--" + classname);
    }
    /**
    * Compute element color
    */

  }, {
    key: "colorElement",
    value: function colorElement(d) {
      var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      key = key ? key : this.cfg.key; // if key is set, return own object color key

      if (this.cfg.color.key) return d[this.cfg.color.key]; // base color is default one if current key is set, else current one

      var baseColor = this.cfg.currentKey ? this.cfg.color.default : this.cfg.color.current; // if scheme is set, base color is color scheme

      if (this.cfg.color.scheme) {
        baseColor = this.colorScale(d[key]);
      } // if keys is an object, base color is color key if exists


      if (this.cfg.color.keys && this.cfg.color.keys instanceof Object && this.cfg.color.keys instanceof Array === false) {
        if (typeof this.cfg.color.keys[key] == 'string') {
          baseColor = this.cfg.color.keys[key];
        } else if (typeof this.cfg.color.keys[d[key]] == 'string') {
          baseColor = this.cfg.color.keys[d[key]];
        }
      } // if current key is set and key is current, base color is current


      if (this.cfg.currentKey && d[this.cfg.key] === this.cfg.currentKey) {
        baseColor = this.cfg.color.current;
      }

      return baseColor;
    }
    /**
    * Update chart methods
    */

  }, {
    key: "updateChart",
    value: function updateChart() {
      this.computeData();
      this.bindData();
      this.setScales();
      this.enterElements();
      this.updateElements();
      this.exitElements();
    }
    /**
    * Resize chart methods
    */

  }, {
    key: "resizeChart",
    value: function resizeChart() {
      this.getDimensions(); //this.setScales();

      this.setChartDimension();
      this.updateChart();
    }
    /**
    * Update chart configuration
    */

  }, {
    key: "updateConfig",
    value: function updateConfig(config) {
      this._setConfig(config);

      this.resizeChart();
    }
    /**
    * Destroy chart methods
    */

  }, {
    key: "destroyChart",
    value: function destroyChart() {
      window.removeEventListener("resize", this.onResize);
    }
  }]);

  return d3chart;
}();var d3$1 = {
  select: d3Selection.select,
  selectAll: d3Selection.selectAll,
  scaleBand: d3Scale.scaleBand,
  scaleLinear: d3Scale.scaleLinear,
  scaleOrdinal: d3Scale.scaleOrdinal,
  max: d3Array.max,
  transition: d3Transition.transition,
  axisBottom: d3Axis.axisBottom,
  axisLeft: d3Axis.axisLeft,
  easeLinear: d3Ease.easeLinear,
  easePolyIn: d3Ease.easePolyIn,
  easePolyOut: d3Ease.easePolyOut,
  easePoly: d3Ease.easePoly,
  easePolyInOut: d3Ease.easePolyInOut,
  easeQuadIn: d3Ease.easeQuadIn,
  easeQuadOut: d3Ease.easeQuadOut,
  easeQuad: d3Ease.easeQuad,
  easeQuadInOut: d3Ease.easeQuadInOut,
  easeCubicIn: d3Ease.easeCubicIn,
  easeCubicOut: d3Ease.easeCubicOut,
  easeCubic: d3Ease.easeCubic,
  easeCubicInOut: d3Ease.easeCubicInOut,
  easeSinIn: d3Ease.easeSinIn,
  easeSinOut: d3Ease.easeSinOut,
  easeSin: d3Ease.easeSin,
  easeSinInOut: d3Ease.easeSinInOut,
  easeExpIn: d3Ease.easeExpIn,
  easeExpOut: d3Ease.easeExpOut,
  easeExp: d3Ease.easeExp,
  easeExpInOut: d3Ease.easeExpInOut,
  easeCircleIn: d3Ease.easeCircleIn,
  easeCircleOut: d3Ease.easeCircleOut,
  easeCircle: d3Ease.easeCircle,
  easeCircleInOut: d3Ease.easeCircleInOut,
  easeElasticIn: d3Ease.easeElasticIn,
  easeElastic: d3Ease.easeElastic,
  easeElasticOut: d3Ease.easeElasticOut,
  easeElasticInOut: d3Ease.easeElasticInOut,
  easeBackIn: d3Ease.easeBackIn,
  easeBackOut: d3Ease.easeBackOut,
  easeBack: d3Ease.easeBack,
  easeBackInOut: d3Ease.easeBackInOut,
  easeBounceIn: d3Ease.easeBounceIn,
  easeBounce: d3Ease.easeBounce,
  easeBounceOut: d3Ease.easeBounceOut,
  easeBounceInOut: d3Ease.easeBounceInOut,
  schemeCategory10: d3ScaleChromatic.schemeCategory10,
  schemeAccent: d3ScaleChromatic.schemeAccent,
  schemeDark2: d3ScaleChromatic.schemeDark2,
  schemePaired: d3ScaleChromatic.schemePaired,
  schemePastel1: d3ScaleChromatic.schemePastel1,
  schemePastel2: d3ScaleChromatic.schemePastel2,
  schemeSet1: d3ScaleChromatic.schemeSet1,
  schemeSet2: d3ScaleChromatic.schemeSet2,
  schemeSet3: d3ScaleChromatic.schemeSet3,
  schemeTableau10: d3ScaleChromatic.schemeTableau10
};
/**
 * D3 Bar Chart
 */

var d3barchart =
/*#__PURE__*/
function (_d3chart) {
  _inherits(d3barchart, _d3chart);

  function d3barchart(selection, data, config) {
    _classCallCheck(this, d3barchart);

    return _possibleConstructorReturn(this, _getPrototypeOf(d3barchart).call(this, selection, data, config, {
      margin: {
        top: 10,
        right: 30,
        bottom: 20,
        left: 40
      },
      key: 'key',
      currentKey: false,
      values: [],
      orientation: 'vertical',
      labelRotation: 0,
      color: {
        key: false,
        keys: false,
        scheme: false,
        current: "#1f77b4",
        default: "#AAA",
        axis: "#000"
      },
      axis: {
        yTitle: false,
        xTitle: false,
        yFormat: ".0f",
        xFormat: ".0f",
        yTicks: 10,
        xTicks: 10
      },
      tooltip: {
        label: false
      },
      transition: {
        duration: 350,
        ease: "easeLinear"
      }
    }));
  }
  /**
   * Init chart
   */


  _createClass(d3barchart, [{
    key: "initChart",
    value: function initChart() {
      // Set up dimensions
      this.getDimensions();
      this.initChartFrame('barchart'); // Set up scales

      this.xScale = d3$1.scaleBand();
      this.xScaleInn = d3$1.scaleBand();
      this.yScale = d3$1.scaleLinear(); // Axis group

      this.axisg = this.g.append('g').attr('class', 'chart__axis chart__axis--barchart'); // Horizontal grid

      this.yGrid = this.axisg.append("g").attr("class", "chart__grid chart__grid--y chart__grid--barchart"); // Bottom axis

      this.xAxis = this.axisg.append("g").attr("class", "chart__axis-x chart__axis-x--barchart"); // Vertical axis title

      if (this.cfg.axis.yTitle) this.yAxisTitle = this.axisg.append('text').attr('class', 'chart__axis-title chart__axis-title--barchart').attr("transform", 'rotate(-90)').style("text-anchor", "middle");
      this.setChartDimension();
      this.updateChart();
    }
    /**
     * Resize chart pipe
     */

  }, {
    key: "setScales",
    value: function setScales() {
      var _this = this;

      this.xScale.rangeRound(this.cfg.orientation !== 'horizontal' ? [0, this.cfg.width] : [0, this.cfg.height]).paddingInner(0.1).domain(this.data.map(function (d) {
        return d[_this.cfg.key];
      }));
      this.xScaleInn.domain(this.cfg.values).rangeRound([0, this.xScale.bandwidth()]).paddingInner(0.05);
      this.yScale.rangeRound(this.cfg.orientation !== 'horizontal' ? [0, this.cfg.height] : [this.cfg.width, 0]).domain([d3$1.max(this.data, function (d) {
        return d3$1.max(_this.cfg.values.map(function (v) {
          return d[v];
        }));
      }), 0]);

      if (this.cfg.color.scheme instanceof Array === true) {
        this.colorScale = d3$1.scaleOrdinal().range(this.cfg.color.scheme);
      } else if (typeof this.cfg.color.scheme === 'string') {
        this.colorScale = d3$1.scaleOrdinal(d3$1[this.cfg.color.scheme]);
      }

      var yGridFunction = this.cfg.orientation !== 'horizontal' ? d3$1.axisLeft(this.yScale).tickSize(-this.cfg.width).ticks(this.cfg.axis.yTicks, this.cfg.axis.yFormat) : d3$1.axisBottom(this.yScale).tickSize(-this.cfg.height).ticks(this.cfg.axis.yTicks, this.cfg.axis.yFormat);
      var xAxisFunction = this.cfg.orientation !== 'horizontal' ? d3$1.axisBottom(this.xScale) : d3$1.axisLeft(this.xScale); // Horizontal grid

      this.yGrid.attr("transform", this.cfg.orientation !== 'horizontal' ? 'translate(0,0)' : "translate(0,".concat(this.cfg.height, ")")).transition(this.transition).call(yGridFunction); // Bottom axis

      this.xAxis.attr("transform", this.cfg.orientation !== 'horizontal' ? "translate(0,".concat(this.cfg.height, ")") : 'translate(0,0)').call(xAxisFunction);
    }
    /**
     * Set chart dimensional sizes
     */

  }, {
    key: "setChartDimension",
    value: function setChartDimension() {
      // SVG element
      this.svg.attr("viewBox", "0 0 ".concat(this.cfg.width + this.cfg.margin.left + this.cfg.margin.right, " ").concat(this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom)).attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right).attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom); // Vertical axis title

      if (this.cfg.axis.yTitle) this.yAxisTitle.attr("y", -this.cfg.margin.left + 10).attr("x", -this.cfg.height / 2).text(this.cfg.axis.yTitle); // Bottom axis label rotation

      if (this.cfg.labelRotation !== 0) this.xAxis.selectAll('text').attr("y", Math.cos(this.cfg.labelRotation * Math.PI / 180) * 9).attr("x", Math.sin(this.cfg.labelRotation * Math.PI / 180) * 9).attr("dy", ".35em").attr("transform", "rotate(".concat(this.cfg.labelRotation, ")")).style("text-anchor", "start");
    }
    /**
     * Bind data to main elements groups
     */

  }, {
    key: "bindData",
    value: function bindData() {
      var _this2 = this;

      // Set transition
      this.transition = d3$1.transition('t').duration(this.cfg.transition.duration).ease(d3$1[this.cfg.transition.ease]); // Bars groups

      this.itemg = this.g.selectAll('.chart__bar-group').data(this.data, function (d) {
        return d[_this2.cfg.key];
      });
    }
    /**
     * Add new chart's elements
     */

  }, {
    key: "enterElements",
    value: function enterElements() {
      var _this3 = this;

      var newbars = this.itemg.enter().append('g').attr('class', 'chart__bar-group chart__bar-group--barchart').attr('transform', function (d) {
        if (_this3.cfg.orientation !== 'horizontal') {
          return "translate(".concat(_this3.xScale(d[_this3.cfg.key]), ",0)");
        }

        return "translate(0,".concat(_this3.xScale(d[_this3.cfg.key]), ")");
      });
      var rects = newbars.selectAll('.chart__bar').data(function (d) {
        return _this3.cfg.values.map(function (v) {
          var dat = _objectSpread2({}, d);

          dat[_this3.cfg.key] = d[_this3.cfg.key];
          return dat;
        });
      }).enter().append('rect').attr('class', 'chart__bar chart__bar--barchart').classed('chart__bar--current', function (d) {
        return _this3.cfg.currentKey && d[_this3.cfg.key] === _this3.cfg.currentKey;
      }).attr('x', function (d, i) {
        return _this3.cfg.orientation !== 'horizontal' ? _this3.xScaleInn(_this3.cfg.values[i % _this3.cfg.values.length]) : 0;
      }).attr('y', function (d, i) {
        return _this3.cfg.orientation !== 'horizontal' ? _this3.cfg.height : _this3.xScaleInn(_this3.cfg.values[i % _this3.cfg.values.length]);
      }).attr('height', 0).attr('width', 0).on('mouseover', function (d, i) {
        var key = _this3.cfg.values[i % _this3.cfg.values.length];

        _this3.tooltip.html(function () {
          return "<div>".concat(key, ": ").concat(d[key], "</div>");
        }).classed('active', true);
      }).on('mouseout', function () {
        _this3.tooltip.classed('active', false);
      }).on('mousemove', function () {
        _this3.tooltip.style('left', window.event['pageX'] - 28 + 'px').style('top', window.event['pageY'] - 40 + 'px');
      });
    }
    /**
     * Update chart's elements based on data change
     */

  }, {
    key: "updateElements",
    value: function updateElements() {
      var _this4 = this;

      // Bars groups
      this.itemg.transition(this.transition).attr('transform', function (d) {
        return _this4.cfg.orientation !== 'horizontal' ? "translate(".concat(_this4.xScale(d[_this4.cfg.key]), ",0)") : "translate(0,".concat(_this4.xScale(d[_this4.cfg.key]), ")");
      }); // Bars

      this.g.selectAll('.chart__bar').transition(this.transition).attr('fill', function (d, i) {
        return _this4.colorElement(d, _this4.cfg.values[i % _this4.cfg.values.length]);
      }).attr('x', function (d, i) {
        return _this4.cfg.orientation !== 'horizontal' ? _this4.xScaleInn(_this4.cfg.values[i % _this4.cfg.values.length]) : 0;
      }).attr('y', function (d, i) {
        return _this4.cfg.orientation !== 'horizontal' ? _this4.yScale(+d[_this4.cfg.values[i % _this4.cfg.values.length]]) : _this4.xScaleInn(_this4.cfg.values[i % _this4.cfg.values.length]);
      }).attr('width', function (d, i) {
        return _this4.cfg.orientation !== 'horizontal' ? _this4.xScaleInn.bandwidth() : _this4.yScale(+d[_this4.cfg.values[i % _this4.cfg.values.length]]);
      }).attr('height', function (d, i) {
        return _this4.cfg.orientation !== 'horizontal' ? _this4.cfg.height - _this4.yScale(+d[_this4.cfg.values[i % _this4.cfg.values.length]]) : _this4.xScaleInn.bandwidth();
      });
    }
    /**
     * Remove chart's elements without data
     */

  }, {
    key: "exitElements",
    value: function exitElements() {
      this.itemg.exit().transition(this.transition).style("opacity", 0).remove();
    }
  }]);

  return d3barchart;
}(d3chart);var script$1 = {
  name: 'D3BarChart',
  extends: __vue_component__,
  mounted: function mounted() {
    this.chart = new d3barchart(this.$refs.chart, JSON.parse(JSON.stringify(this.datum)), this.config);
  }
};/* script */
var __vue_script__$1 = script$1;
/* template */

/* style */

var __vue_inject_styles__$1 = undefined;
/* scoped */

var __vue_scope_id__$1 = undefined;
/* module identifier */

var __vue_module_identifier__$1 = "data-v-0d808703";
/* functional template */

var __vue_is_functional_template__$1 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$1 = normalizeComponent({}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);var d3$2 = {
  select: d3Selection.select,
  selectAll: d3Selection.selectAll,
  scaleOrdinal: d3Scale.scaleOrdinal,
  scaleLinear: d3Scale.scaleLinear,
  scaleTime: d3Scale.scaleTime,
  timeParse: d3TimeFormat.timeParse,
  timeFormat: d3TimeFormat.timeFormat,
  max: d3Array.max,
  extent: d3Array.extent,
  line: d3Shape.line,
  transition: d3Transition.transition,
  axisLeft: d3Axis.axisLeft,
  axisBottom: d3Axis.axisBottom,
  easeLinear: d3Ease.easeLinear,
  easePolyIn: d3Ease.easePolyIn,
  easePolyOut: d3Ease.easePolyOut,
  easePoly: d3Ease.easePoly,
  easePolyInOut: d3Ease.easePolyInOut,
  easeQuadIn: d3Ease.easeQuadIn,
  easeQuadOut: d3Ease.easeQuadOut,
  easeQuad: d3Ease.easeQuad,
  easeQuadInOut: d3Ease.easeQuadInOut,
  easeCubicIn: d3Ease.easeCubicIn,
  easeCubicOut: d3Ease.easeCubicOut,
  easeCubic: d3Ease.easeCubic,
  easeCubicInOut: d3Ease.easeCubicInOut,
  easeSinIn: d3Ease.easeSinIn,
  easeSinOut: d3Ease.easeSinOut,
  easeSin: d3Ease.easeSin,
  easeSinInOut: d3Ease.easeSinInOut,
  easeExpIn: d3Ease.easeExpIn,
  easeExpOut: d3Ease.easeExpOut,
  easeExp: d3Ease.easeExp,
  easeExpInOut: d3Ease.easeExpInOut,
  easeCircleIn: d3Ease.easeCircleIn,
  easeCircleOut: d3Ease.easeCircleOut,
  easeCircle: d3Ease.easeCircle,
  easeCircleInOut: d3Ease.easeCircleInOut,
  easeElasticIn: d3Ease.easeElasticIn,
  easeElastic: d3Ease.easeElastic,
  easeElasticOut: d3Ease.easeElasticOut,
  easeElasticInOut: d3Ease.easeElasticInOut,
  easeBackIn: d3Ease.easeBackIn,
  easeBackOut: d3Ease.easeBackOut,
  easeBack: d3Ease.easeBack,
  easeBackInOut: d3Ease.easeBackInOut,
  easeBounceIn: d3Ease.easeBounceIn,
  easeBounce: d3Ease.easeBounce,
  easeBounceOut: d3Ease.easeBounceOut,
  easeBounceInOut: d3Ease.easeBounceInOut,
  curveBasis: d3Shape.curveBasis,
  curveBundle: d3Shape.curveBundle,
  curveCardinal: d3Shape.curveCardinal,
  curveCatmullRom: d3Shape.curveCatmullRom,
  curveLinear: d3Shape.curveLinear,
  curveMonotoneX: d3Shape.curveMonotoneX,
  curveMonotoneY: d3Shape.curveMonotoneY,
  curveNatural: d3Shape.curveNatural,
  curveStep: d3Shape.curveStep,
  curveStepAfter: d3Shape.curveStepAfter,
  curveStepBefore: d3Shape.curveStepBefore,
  schemeCategory10: d3ScaleChromatic.schemeCategory10,
  schemeAccent: d3ScaleChromatic.schemeAccent,
  schemeDark2: d3ScaleChromatic.schemeDark2,
  schemePaired: d3ScaleChromatic.schemePaired,
  schemePastel1: d3ScaleChromatic.schemePastel1,
  schemePastel2: d3ScaleChromatic.schemePastel2,
  schemeSet1: d3ScaleChromatic.schemeSet1,
  schemeSet2: d3ScaleChromatic.schemeSet2,
  schemeSet3: d3ScaleChromatic.schemeSet3,
  schemeTableau10: d3ScaleChromatic.schemeTableau10
};
/**
 * D3 Line Chart
 */

var d3linechart =
/*#__PURE__*/
function (_d3chart) {
  _inherits(d3linechart, _d3chart);

  function d3linechart(selection, data, config) {
    _classCallCheck(this, d3linechart);

    return _possibleConstructorReturn(this, _getPrototypeOf(d3linechart).call(this, selection, data, config, {
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 40
      },
      values: [],
      date: {
        key: false,
        inputFormat: "%Y-%m-%d",
        outputFormat: "%Y-%m-%d"
      },
      color: {
        key: false,
        keys: false,
        scheme: false,
        current: '#1f77b4',
        default: '#AAA',
        axis: '#000'
      },
      curve: 'curveLinear',
      points: {
        visibleSize: 3,
        hoverSize: 6
      },
      axis: {
        yTitle: false,
        xTitle: false,
        yFormat: ".0f",
        xFormat: "%Y-%m-%d",
        yTicks: 5,
        xTicks: 3
      },
      tooltip: {
        labels: false
      },
      transition: {
        duration: 350,
        ease: 'easeLinear'
      }
    }));
  }
  /**
  * Init chart
  */


  _createClass(d3linechart, [{
    key: "initChart",
    value: function initChart() {
      // Set up dimensions
      this.getDimensions();
      this.initChartFrame('linechart'); // Format date functions

      this.parseTime = d3$2.timeParse(this.cfg.date.inputFormat);
      this.formatTime = d3$2.timeFormat(this.cfg.date.outputFormat); // Init scales

      this.yScale = d3$2.scaleLinear();
      this.xScale = d3$2.scaleTime();
      this.line = d3$2.line(); // Axis group

      this.axisg = this.g.append('g').attr('class', 'chart__axis chart__axis--linechart'); // Horizontal grid

      this.yGrid = this.axisg.append("g").attr("class", "chart__grid chart__grid--y chart__grid--linechart"); // Bottom axis

      this.xAxis = this.axisg.append("g").attr("class", "chart__axis-x chart__axis-x--linechart"); // Vertical axis

      this.yAxis = this.axisg.append("g").attr("class", "chart__axis-y chart__axis-y--linechart chart__grid"); // Vertical axis title

      if (this.cfg.axis.yTitle) this.yAxisTitle = this.axisg.append('text').attr('class', 'chart__axis-title chart__axis-title--linechart').attr("transform", 'rotate(-90)').style("text-anchor", "middle");
      this.setChartDimension();
      this.updateChart();
    }
    /**
     * Calcule required derivated data
     */

  }, {
    key: "computeData",
    value: function computeData() {
      var _this = this;

      // Calcule transpose data
      var tData = [];
      this.cfg.values.forEach(function (j, i) {
        tData[i] = {};
        tData[i].key = j;
        tData[i].values = [];
      });
      this.data.forEach(function (d) {
        d.jsdate = _this.parseTime(d[_this.cfg.date.key]);
      });
      this.data.sort(function (a, b) {
        return a.jsdate - b.jsdate;
      });
      this.data.forEach(function (d, c) {
        d.min = 9999999999999999999;
        d.max = -9999999999999999999;

        _this.cfg.values.forEach(function (j, i) {
          tData[i].values.push({
            x: d.jsdate,
            y: +d[j],
            k: i
          });
          if (d[j] < d.min) d.min = +d[j];
          if (d[j] > d.max) d.max = +d[j];
        });
      });
      this.tData = tData;
    }
    /**
     * Set up chart dimensions (non depending on data)
     */

  }, {
    key: "setChartDimension",
    value: function setChartDimension() {
      // Resize SVG element
      this.svg.attr("viewBox", "0 0 ".concat(this.cfg.width + this.cfg.margin.left + this.cfg.margin.right, " ").concat(this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom)).attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right).attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom); // Vertical axis title

      if (this.cfg.axis.yTitle) this.yAxisTitle.attr("y", -this.cfg.margin.left + 10).attr("x", -this.cfg.height / 2).text(this.cfg.axis.yTitle);
    }
    /**
     * Set up scales
     */

  }, {
    key: "setScales",
    value: function setScales() {
      var _this2 = this;

      // Calcule vertical scale
      this.yScale.domain([0, d3$2.max(this.data, function (d) {
        return d.max;
      })]).rangeRound([this.cfg.height, 0]); // Calcule horizontal scale

      this.xScale.domain(d3$2.extent(this.data, function (d) {
        return d.jsdate;
      })).rangeRound([0, this.cfg.width]);

      if (this.cfg.color.scheme instanceof Array === true) {
        this.colorScale = d3$2.scaleOrdinal().range(this.cfg.color.scheme);
      } else if (typeof this.cfg.color.scheme === 'string') {
        this.colorScale = d3$2.scaleOrdinal(d3$2[this.cfg.color.scheme]);
      } // Set up line function


      this.line.x(function (d) {
        return _this2.xScale(d.x);
      }).y(function (d) {
        return _this2.yScale(d.y);
      }).curve(d3$2[this.cfg.curve]); // Redraw grid

      this.yGrid.call(d3$2.axisLeft(this.yScale).tickSize(-this.cfg.width).ticks(this.cfg.axis.yTicks, this.cfg.axis.yFormat)); // Redraw horizontal axis

      this.xAxis.attr("transform", "translate(0,".concat(this.cfg.height, ")")).call(d3$2.axisBottom(this.xScale).tickFormat(this.formatTime).ticks(this.cfg.axis.xTicks, this.cfg.axis.xFormat));
    }
    /**
     * Bind data to main elements groups
     */

  }, {
    key: "bindData",
    value: function bindData() {
      // Set transition
      this.transition = d3$2.transition('t').duration(this.cfg.transition.duration).ease(d3$2[this.cfg.transition.ease]); // Lines group

      this.linesgroup = this.g.selectAll(".chart__lines-group").data(this.tData, function (d) {
        return d.key;
      }); // Don't continue if points are disabled

      if (this.cfg.points === false) return; // Set points store

      if (!this.pointsg || this.pointsg instanceof Array === false) {
        this.pointsg = [];
      }
    }
    /**
     * Add new chart's elements
     */

  }, {
    key: "enterElements",
    value: function enterElements() {
      var _this3 = this;

      // Elements to add
      var newgroups = this.linesgroup.enter().append('g').attr("class", "chart__lines-group chart__lines-group--linechart"); // Lines

      newgroups.append('path').attr("class", "chart__line chart__line--linechart").attr('fill', 'transparent').attr("d", function (d) {
        return _this3.line(d.values.map(function (v) {
          return {
            y: 0,
            x: v.x,
            k: v.k
          };
        }));
      }); // Don't continue if points are disabled

      if (this.cfg.points === false) return;
      this.cfg.values.forEach(function (k, i) {
        // Point group
        var gp = _this3.g.selectAll('.chart__points-group--' + k).data(_this3.data).enter().append('g').attr('class', 'chart__points-group chart__points-group--linechart chart__points-group--' + k).attr('transform', function (d) {
          return "translate(".concat(_this3.xScale(d.jsdate), ",").concat(_this3.cfg.height, ")");
        }); // Hover point


        gp.append('circle').attr('class', 'chart__point-hover chart__point-hover--linechart').attr('fill', 'transparent').attr('r', _this3.cfg.points.hoverSize).on('mouseover', function (d, j) {
          _this3.tooltip.html(function (_) {
            var label = _this3.cfg.tooltip.labels && _this3.cfg.tooltip.labels[i] ? _this3.cfg.tooltip.labels[i] : k;
            return "\n                            <div>".concat(label, ": ").concat(_this3.tData[i].values[j].y, "</div>\n                        ");
          }).classed('active', true);
        }).on('mouseout', function (_) {
          _this3.tooltip.classed('active', false);
        }).on('mousemove', function (_) {
          _this3.tooltip.style('left', window.event['pageX'] - 28 + 'px').style('top', window.event['pageY'] - 40 + 'px');
        }); // Visible point

        gp.append('circle').attr('class', 'chart__point-visible chart__point-visible--linechart').attr('pointer-events', 'none');

        _this3.pointsg.push({
          selection: gp,
          key: k
        });
      });
    }
    /**
     * Update chart's elements based on data change
     */

  }, {
    key: "updateElements",
    value: function updateElements() {
      var _this4 = this;

      // Color lines
      this.linesgroup.attr('stroke', function (d) {
        return _this4.colorElement(d, 'key');
      }); // Redraw lines

      this.g.selectAll('.chart__line').attr('stroke', function (d) {
        return _this4.colorElement(d, 'key');
      }).transition(this.transition).attr("d", function (d, i) {
        return _this4.line(_this4.tData[i].values);
      }); // Don't continue if points are disabled

      if (this.cfg.points === false) return; // Redraw points

      this.pointsg.forEach(function (p, i) {
        p.selection.transition(_this4.transition).attr('transform', function (d) {
          return "translate(".concat(_this4.xScale(d.jsdate), ",").concat(_this4.yScale(d[p.key]), ")");
        }); // Visible point

        p.selection.selectAll('.chart__point-visible').attr('fill', function (d) {
          return _this4.colorElement(p, 'key');
        }).attr('r', _this4.cfg.points.visibleSize); // Hover point

        p.selection.selectAll('.chart__point-hover').attr('r', _this4.cfg.points.hoverSize);
      });
    }
    /**
     * Remove chart's elements without data
     */

  }, {
    key: "exitElements",
    value: function exitElements() {
      this.linesgroup.exit().transition(this.transition).style("opacity", 0).remove();
    }
  }]);

  return d3linechart;
}(d3chart);var script$2 = {
  name: 'D3LineChart',
  extends: __vue_component__,
  mounted: function mounted() {
    this.chart = new d3linechart(this.$refs.chart, JSON.parse(JSON.stringify(this.datum)), this.config);
  }
};/* script */
var __vue_script__$2 = script$2;
/* template */

/* style */

var __vue_inject_styles__$2 = undefined;
/* scoped */

var __vue_scope_id__$2 = undefined;
/* module identifier */

var __vue_module_identifier__$2 = "data-v-ca65854c";
/* functional template */

var __vue_is_functional_template__$2 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$2 = normalizeComponent({}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);var d3$3 = {
  select: d3Selection.select,
  selectAll: d3Selection.selectAll,
  scaleLinear: d3Scale.scaleLinear,
  scaleOrdinal: d3Scale.scaleOrdinal,
  max: d3Array.max,
  min: d3Array.min,
  transition: d3Transition.transition,
  pie: d3Shape.pie,
  arc: d3Shape.arc,
  interpolate: d3Interpolate.interpolate,
  easeLinear: d3Ease.easeLinear,
  easePolyIn: d3Ease.easePolyIn,
  easePolyOut: d3Ease.easePolyOut,
  easePoly: d3Ease.easePoly,
  easePolyInOut: d3Ease.easePolyInOut,
  easeQuadIn: d3Ease.easeQuadIn,
  easeQuadOut: d3Ease.easeQuadOut,
  easeQuad: d3Ease.easeQuad,
  easeQuadInOut: d3Ease.easeQuadInOut,
  easeCubicIn: d3Ease.easeCubicIn,
  easeCubicOut: d3Ease.easeCubicOut,
  easeCubic: d3Ease.easeCubic,
  easeCubicInOut: d3Ease.easeCubicInOut,
  easeSinIn: d3Ease.easeSinIn,
  easeSinOut: d3Ease.easeSinOut,
  easeSin: d3Ease.easeSin,
  easeSinInOut: d3Ease.easeSinInOut,
  easeExpIn: d3Ease.easeExpIn,
  easeExpOut: d3Ease.easeExpOut,
  easeExp: d3Ease.easeExp,
  easeExpInOut: d3Ease.easeExpInOut,
  easeCircleIn: d3Ease.easeCircleIn,
  easeCircleOut: d3Ease.easeCircleOut,
  easeCircle: d3Ease.easeCircle,
  easeCircleInOut: d3Ease.easeCircleInOut,
  easeElasticIn: d3Ease.easeElasticIn,
  easeElastic: d3Ease.easeElastic,
  easeElasticOut: d3Ease.easeElasticOut,
  easeElasticInOut: d3Ease.easeElasticInOut,
  easeBackIn: d3Ease.easeBackIn,
  easeBackOut: d3Ease.easeBackOut,
  easeBack: d3Ease.easeBack,
  easeBackInOut: d3Ease.easeBackInOut,
  easeBounceIn: d3Ease.easeBounceIn,
  easeBounce: d3Ease.easeBounce,
  easeBounceOut: d3Ease.easeBounceOut,
  easeBounceInOut: d3Ease.easeBounceInOut,
  schemeCategory10: d3ScaleChromatic.schemeCategory10,
  schemeAccent: d3ScaleChromatic.schemeAccent,
  schemeDark2: d3ScaleChromatic.schemeDark2,
  schemePaired: d3ScaleChromatic.schemePaired,
  schemePastel1: d3ScaleChromatic.schemePastel1,
  schemePastel2: d3ScaleChromatic.schemePastel2,
  schemeSet1: d3ScaleChromatic.schemeSet1,
  schemeSet2: d3ScaleChromatic.schemeSet2,
  schemeSet3: d3ScaleChromatic.schemeSet3,
  schemeTableau10: d3ScaleChromatic.schemeTableau10
};
/**
* D3 Pie Chart
*/

var d3piechart =
/*#__PURE__*/
function (_d3chart) {
  _inherits(d3piechart, _d3chart);

  function d3piechart(selection, data, config) {
    _classCallCheck(this, d3piechart);

    return _possibleConstructorReturn(this, _getPrototypeOf(d3piechart).call(this, selection, data, config, {
      margin: {
        top: 40,
        right: 20,
        bottom: 40,
        left: 20
      },
      key: '',
      value: 'value',
      color: {
        key: false,
        keys: false,
        scheme: false,
        current: '#1f77b4',
        default: '#AAA',
        axis: '#000'
      },
      radius: {
        inner: false,
        outter: false,
        padding: 0,
        round: 0
      },
      transition: {
        duration: 350,
        ease: 'easeLinear'
      }
    }));
  }
  /**
  * Init chart
  */


  _createClass(d3piechart, [{
    key: "initChart",
    value: function initChart() {
      var _this = this;

      // Set up dimensions
      this.getDimensions();
      this.initChartFrame('piechart');
      this.cScale = d3$3.scaleOrdinal();
      this.arc = d3$3.arc();
      this.outerArc = d3$3.arc();
      this.pie = d3$3.pie().sort(null).value(function (d) {
        return d[_this.cfg.value];
      }).padAngle(this.cfg.radius.padding);

      if (this.cfg.radius && this.cfg.radius.inner) {
        var outRadius = this.cfg.radius.outter ? this.cfg.radius.outter : Math.min(this.cfg.width, this.cfg.height) / 2;
        this.cfg.radius.relation = this.cfg.radius.inner ? this.cfg.radius.inner / outRadius : 0;
      }

      this.gcenter = this.g.append('g');
      this.setChartDimension();
      this.updateChart();
    }
    /**
    * Set up chart dimensions (non depending on data)
    */

  }, {
    key: "setChartDimension",
    value: function setChartDimension() {
      // SVG element
      this.svg.attr("viewBox", "0 0 ".concat(this.cfg.width + this.cfg.margin.left + this.cfg.margin.right, " ").concat(this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom)).attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right).attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom); // Center element

      this.gcenter.attr('transform', "translate(".concat(this.cfg.width / 2, ", ").concat(this.cfg.height / 2, ")"));
    }
    /**
    * Bind data to main elements groups
    */

  }, {
    key: "bindData",
    value: function bindData() {
      var _this2 = this;

      this.itemg = this.gcenter.selectAll('.chart__slice-group').data(this.pie(this.data), function (d) {
        return d.data[_this2.cfg.key];
      }); // Set transition

      this.transition = d3$3.transition('t').duration(this.cfg.transition.duration).ease(d3$3[this.cfg.transition.ease]);
    }
    /**
    * Set up scales
    */

  }, {
    key: "setScales",
    value: function setScales() {
      var _this3 = this;

      // Set up radius
      this.cfg.radius.outter = this.cfg.radius && this.cfg.radius.outter ? this.cfg.radius.outter : Math.min(this.cfg.width, this.cfg.height) / 2;
      var inRadius = this.cfg.radius && this.cfg.radius.inner ? this.cfg.radius.inner : 0;

      if (this.cfg.radius.relation) {
        inRadius = this.cfg.radius.outter * this.cfg.radius.relation;
      } // Set up arcs


      this.arc = d3$3.arc().outerRadius(this.cfg.radius.outter).innerRadius(inRadius).cornerRadius(this.cfg.radius.round);
      this.outerArc = d3$3.arc().outerRadius(this.cfg.radius.outter * 1.1).innerRadius(this.cfg.radius.outter * 1.1); // Set up color scheme

      if (this.cfg.color.scheme) {
        if (this.cfg.color.scheme instanceof Array === true) {
          this.colorScale = d3$3.scaleOrdinal().domain(this.data.map(function (d) {
            return d[_this3.cfg.key];
          })).range(this.cfg.color.scheme);
        } else {
          this.colorScale = d3$3.scaleOrdinal(d3$3[this.cfg.color.scheme]).domain(this.data.map(function (d) {
            return d[_this3.cfg.key];
          }));
        }
      }
    }
    /**
    * Add new chart's elements
    */

  }, {
    key: "enterElements",
    value: function enterElements() {
      var _this4 = this;

      var newg = this.itemg.enter().append('g').attr("class", "chart__slice-group chart__slice-group--piechart"); // PATHS

      newg.append("path").attr("class", "chart__slice chart__slice--piechart").transition(this.transition).delay(function (d, i) {
        return i * _this4.cfg.transition.duration;
      }).attrTween('d', function (d) {
        var i = d3$3.interpolate(d.startAngle + 0.1, d.endAngle);
        return function (t) {
          d.endAngle = i(t);
          return _this4.arc(d);
        };
      }).style("fill", function (d) {
        return _this4.colorElement(d.data);
      }).style('opacity', 1); // LABELS

      newg.append('text').attr("class", "chart__label chart__label--piechart").style('opacity', 0).attr("transform", function (d) {
        var pos = _this4.outerArc.centroid(d);

        pos[0] = _this4.cfg.radius.outter * (_this4.midAngle(d) < Math.PI ? 1.1 : -1.1);
        return "translate(" + pos + ")";
      }).attr('text-anchor', function (d) {
        return _this4.midAngle(d) < Math.PI ? 'start' : 'end';
      }).text(function (d) {
        return d.data[_this4.cfg.key];
      }).transition(this.transition).delay(function (d, i) {
        return i * _this4.cfg.transition.duration;
      }).style('opacity', 1); // LINES

      newg.append('polyline').attr("class", "chart__line chart__line--piechart").style('opacity', 0).attr('points', function (d) {
        var pos = _this4.outerArc.centroid(d);

        pos[0] = _this4.cfg.radius.outter * 0.95 * (_this4.midAngle(d) < Math.PI ? 1.1 : -1.1);
        return [_this4.arc.centroid(d), _this4.outerArc.centroid(d), pos];
      }).transition(this.transition).delay(function (d, i) {
        return i * _this4.cfg.transition.duration;
      }).style('opacity', 1);
    }
    /**
    * Update chart's elements based on data change
    */

  }, {
    key: "updateElements",
    value: function updateElements() {
      var _this5 = this;

      // PATHS
      this.itemg.selectAll(".chart__slice").style('opacity', 0).data(this.pie(this.data), function (d) {
        return d.data[_this5.cfg.key];
      }).transition(this.transition).delay(function (d, i) {
        return i * _this5.cfg.transition.duration;
      }).attrTween('d', function (d) {
        var i = d3$3.interpolate(d.startAngle + 0.1, d.endAngle);
        return function (t) {
          d.endAngle = i(t);
          return _this5.arc(d);
        };
      }).style("fill", function (d) {
        return _this5.colorElement(d.data);
      }).style('opacity', 1); // LABELS

      this.itemg.selectAll(".chart__label").data(this.pie(this.data), function (d) {
        return d.data[_this5.cfg.key];
      }).text(function (d) {
        return d.data[_this5.cfg.key];
      }).transition(this.transition).attr("transform", function (d) {
        var pos = _this5.outerArc.centroid(d);

        pos[0] = _this5.cfg.radius.outter * (_this5.midAngle(d) < Math.PI ? 1.1 : -1.1);
        return "translate(" + pos + ")";
      }).attr('text-anchor', function (d) {
        return _this5.midAngle(d) < Math.PI ? 'start' : 'end';
      }); // LINES

      this.itemg.selectAll(".chart__line").data(this.pie(this.data), function (d) {
        return d.data[_this5.cfg.key];
      }).transition(this.transition).attr('points', function (d) {
        var pos = _this5.outerArc.centroid(d);

        pos[0] = _this5.cfg.radius.outter * 0.95 * (_this5.midAngle(d) < Math.PI ? 1.1 : -1.1);
        return [_this5.arc.centroid(d), _this5.outerArc.centroid(d), pos];
      });
    }
    /**
    * Remove chart's elements without data
    */

  }, {
    key: "exitElements",
    value: function exitElements() {
      this.itemg.exit().transition(this.transition).style("opacity", 0).remove();
    }
  }, {
    key: "midAngle",
    value: function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }
    /**
    * Store the displayed angles in _current.
    * Then, interpolate from _current to the new angles.
    * During the transition, _current is updated in-place by d3.interpolate.
    */

  }, {
    key: "arcTween",
    value: function arcTween(a) {
      var _this6 = this;

      var i = d3$3.interpolate(this._current, a);
      this._current = i(0);
      return function (t) {
        return _this6.arc(i(t));
      };
    }
  }]);

  return d3piechart;
}(d3chart);var script$3 = {
  name: 'D3PieChart',
  extends: __vue_component__,
  mounted: function mounted() {
    this.chart = new d3piechart(this.$refs.chart, JSON.parse(JSON.stringify(this.datum)), this.config);
  }
};/* script */
var __vue_script__$3 = script$3;
/* template */

/* style */

var __vue_inject_styles__$3 = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-ac66c84e_0", {
    source: ".chart__wrapper{margin:20px 0}.chart__wrap{margin:0}.chart__title{text-align:center;font-weight:700}.chart__source{font-size:12px}.chart__tooltip{position:absolute;pointer-events:none;display:none}.chart__tooltip.active{display:block}.chart__tooltip>div{background:#2b2b2b;color:#fff;padding:6px 10px;border-radius:3px}.chart__axis{font-size:12px;shape-rendering:crispEdges}.chart__grid .domain{stroke:none;fill:none}.chart__grid .tick line{opacity:.2}.chart__label{font-size:12px}.chart .clickable{cursor:pointer}.chart--piechart .chart__line{fill:none;stroke:#000}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$3 = undefined;
/* module identifier */

var __vue_module_identifier__$3 = "data-v-ac66c84e";
/* functional template */

var __vue_is_functional_template__$3 = undefined;
/* style inject shadow dom */

var __vue_component__$3 = normalizeComponent({}, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, false, undefined, createInjectorSSR, undefined);var d3$4 = {
  select: d3Selection.select,
  selectAll: d3Selection.selectAll,
  scaleLinear: d3Scale.scaleLinear,
  scaleOrdinal: d3Scale.scaleOrdinal,
  max: d3Array.max,
  min: d3Array.min,
  transition: d3Transition.transition,
  easeLinear: d3Ease.easeLinear,
  easePolyIn: d3Ease.easePolyIn,
  easePolyOut: d3Ease.easePolyOut,
  easePoly: d3Ease.easePoly,
  easePolyInOut: d3Ease.easePolyInOut,
  easeQuadIn: d3Ease.easeQuadIn,
  easeQuadOut: d3Ease.easeQuadOut,
  easeQuad: d3Ease.easeQuad,
  easeQuadInOut: d3Ease.easeQuadInOut,
  easeCubicIn: d3Ease.easeCubicIn,
  easeCubicOut: d3Ease.easeCubicOut,
  easeCubic: d3Ease.easeCubic,
  easeCubicInOut: d3Ease.easeCubicInOut,
  easeSinIn: d3Ease.easeSinIn,
  easeSinOut: d3Ease.easeSinOut,
  easeSin: d3Ease.easeSin,
  easeSinInOut: d3Ease.easeSinInOut,
  easeExpIn: d3Ease.easeExpIn,
  easeExpOut: d3Ease.easeExpOut,
  easeExp: d3Ease.easeExp,
  easeExpInOut: d3Ease.easeExpInOut,
  easeCircleIn: d3Ease.easeCircleIn,
  easeCircleOut: d3Ease.easeCircleOut,
  easeCircle: d3Ease.easeCircle,
  easeCircleInOut: d3Ease.easeCircleInOut,
  easeElasticIn: d3Ease.easeElasticIn,
  easeElastic: d3Ease.easeElastic,
  easeElasticOut: d3Ease.easeElasticOut,
  easeElasticInOut: d3Ease.easeElasticInOut,
  easeBackIn: d3Ease.easeBackIn,
  easeBackOut: d3Ease.easeBackOut,
  easeBack: d3Ease.easeBack,
  easeBackInOut: d3Ease.easeBackInOut,
  easeBounceIn: d3Ease.easeBounceIn,
  easeBounce: d3Ease.easeBounce,
  easeBounceOut: d3Ease.easeBounceOut,
  easeBounceInOut: d3Ease.easeBounceInOut,
  schemeCategory10: d3ScaleChromatic.schemeCategory10,
  schemeAccent: d3ScaleChromatic.schemeAccent,
  schemeDark2: d3ScaleChromatic.schemeDark2,
  schemePaired: d3ScaleChromatic.schemePaired,
  schemePastel1: d3ScaleChromatic.schemePastel1,
  schemePastel2: d3ScaleChromatic.schemePastel2,
  schemeSet1: d3ScaleChromatic.schemeSet1,
  schemeSet2: d3ScaleChromatic.schemeSet2,
  schemeSet3: d3ScaleChromatic.schemeSet3,
  schemeTableau10: d3ScaleChromatic.schemeTableau10
};
/**
* D3 Slope Chart
*/

var d3slopechart =
/*#__PURE__*/
function (_d3chart) {
  _inherits(d3slopechart, _d3chart);

  function d3slopechart(selection, data, config) {
    _classCallCheck(this, d3slopechart);

    return _possibleConstructorReturn(this, _getPrototypeOf(d3slopechart).call(this, selection, data, config, {
      margin: {
        top: 10,
        right: 100,
        bottom: 20,
        left: 100
      },
      key: '',
      currentKey: false,
      values: ['start', 'end'],
      color: {
        key: false,
        keys: false,
        scheme: false,
        current: '#1f77b4',
        default: '#AAA',
        axis: '#000'
      },
      axis: {
        titles: false
      },
      points: {
        visibleRadius: 3
      },
      opacity: 0.5,
      transition: {
        duration: 350,
        ease: 'easeLinear'
      }
    }));
  }
  /**
  * Init chart
  */


  _createClass(d3slopechart, [{
    key: "initChart",
    value: function initChart() {
      // Set up dimensions
      this.getDimensions();
      this.initChartFrame('slopechart'); // Set up scales

      this.yScale = d3$4.scaleLinear(); // Axis group

      var axisg = this.g.append('g').attr('class', 'chart__axis chart__axis--slopechart'); // Vertical left axis

      this.startAxis = axisg.append('line').attr("class", "chart__axis-y chart__axis-y--slopechart chart__axis-y--start").attr('x1', 0).attr('x2', 0).attr('y1', 0).attr('stroke', this.cfg.color.axis); // Vertical right axis

      this.endAxis = axisg.append('line').attr("class", "chart__axis-y chart__axis-y--slopechart chart__axis-y--end").attr('y1', 0).attr('stroke', this.cfg.color.axis); // Axis labels

      if (this.cfg.axis.titles) {
        this.startl = axisg.append('text').attr('class', 'chart__axis-text chart__axis-text--slopechart chart__axis-text--start').attr('text-anchor', 'middle').attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom - 12).text(this.cfg.axis.titles[0]);
        this.endl = axisg.append('text').attr('class', 'chart__axis-text chart__axis-text--slopechart chart__axis-text--end').attr('text-anchor', 'middle').attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom - 12).text(this.cfg.axis.titles[1]);
      }

      this.setChartDimension();
      this.updateChart();
    }
    /**
    * Set up chart dimensions (non depending on data)
    */

  }, {
    key: "setChartDimension",
    value: function setChartDimension() {
      // SVG element
      this.svg.attr("viewBox", "0 0 ".concat(this.cfg.width + this.cfg.margin.left + this.cfg.margin.right, " ").concat(this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom)).attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right).attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom); // Vertical left axis position

      this.startAxis.attr('y2', this.cfg.height); // Vertical right axis position

      this.endAxis.attr('x1', this.cfg.width).attr('x2', this.cfg.width).attr('y2', this.cfg.height); // Axis labels

      if (this.cfg.axis.titles) {
        this.startl.attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom - 12);
        this.endl.attr('x', this.cfg.width).attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom - 12);
      }
    }
    /**
    * Set up scales
    */

  }, {
    key: "setScales",
    value: function setScales() {
      var _this = this;

      // Set up dimensional scales
      this.yScale.rangeRound([this.cfg.height, 0]).domain([d3$4.min(this.data, function (d) {
        return d[_this.cfg.values[0]] < d[_this.cfg.values[1]] ? d[_this.cfg.values[0]] * 0.9 : d[_this.cfg.values[1]] * 0.9;
      }), d3$4.max(this.data, function (d) {
        return d[_this.cfg.values[0]] > d[_this.cfg.values[1]] ? d[_this.cfg.values[0]] * 1.1 : d[_this.cfg.values[1]] * 1.1;
      })]); // Set up color scheme

      if (this.cfg.color.scheme) {
        if (this.cfg.color.scheme instanceof Array === true) {
          this.colorScale = d3$4.scaleOrdinal().domain(this.data.map(function (d) {
            return d[_this.cfg.key];
          })).range(this.cfg.color.scheme);
        } else {
          this.colorScale = d3$4.scaleOrdinal(d3$4[this.cfg.color.scheme]).domain(this.data.map(function (d) {
            return d[_this.cfg.key];
          }));
        }
      }
    }
    /**
    * Bind data to main elements groups
    */

  }, {
    key: "bindData",
    value: function bindData() {
      var _this2 = this;

      // Lines group selection data
      this.linesgroup = this.g.selectAll(".chart__lines-group").data(this.data, function (d) {
        return d[_this2.cfg.key];
      }); // Set transition

      this.transition = d3$4.transition('t').duration(this.cfg.transition.duration).ease(d3$4[this.cfg.transition.ease]);
    }
    /**
    * Add new chart's elements
    */

  }, {
    key: "enterElements",
    value: function enterElements() {
      var _this3 = this;

      // Elements to add
      var newlines = this.linesgroup.enter().append('g').attr("class", "chart__lines-group chart__lines-group--slopechart"); // Lines to add

      newlines.append('line').attr("class", "chart__line chart__line--slopechart").classed('chart__line--current', function (d) {
        return _this3.cfg.currentKey && d[_this3.cfg.key] == _this3.cfg.currentKey;
      }).attr('stroke', function (d) {
        return _this3.colorElement(d);
      }).style("opacity", this.cfg.opacity).attr("x1", 0).attr("x2", this.cfg.width).transition(this.transition).attr("y1", function (d) {
        return _this3.yScale(d[_this3.cfg.values[0]]);
      }).attr("y2", function (d) {
        return _this3.yScale(d[_this3.cfg.values[1]]);
      }); // Vertical left axis points group to add

      var gstart = newlines.append('g').attr('class', 'chart__points-group chart__points-group--slopechart chart__points-group--start');
      gstart.transition(this.transition).attr('transform', function (d) {
        return 'translate(0,' + _this3.yScale(d[_this3.cfg.values[0]]) + ')';
      }); // Vertical left axis points to add

      gstart.append('circle').attr('class', 'chart__point chart__point--slopechart chart__point--start').attr('fill', function (d) {
        return _this3.colorElement(d);
      }).attr('r', this.cfg.points.visibleRadius); // Vertical left axis label to add

      gstart.append('text').attr('class', 'chart__label chart__label--slopechart chart__label--start').attr('text-anchor', 'end').attr('y', 3).attr('x', -5).text(function (d) {
        return d[_this3.cfg.key] + ' ' + d[_this3.cfg.values[0]];
      }); // Vertical right axis points group to add

      var gend = newlines.append('g').attr('class', 'chart__points-group chart__points-group--slopechart chart__points-group--end').attr('transform', 'translate(' + this.cfg.width + ',0)');
      gend.transition(this.transition).attr('transform', function (d) {
        return 'translate(' + _this3.cfg.width + ',' + _this3.yScale(d[_this3.cfg.values[1]]) + ')';
      }); // Vertical right axis points to add

      gend.append('circle').attr('class', 'chart__point chart__point--slopechart chart__point--end').attr('fill', function (d) {
        return _this3.colorElement(d);
      }).attr('r', this.cfg.points.visibleRadius); // Vertical right axis label to add

      gend.append('text').attr('class', 'chart__label chart__label--slopechart chart__label--end').attr('text-anchor', 'start').attr('y', 3).attr('x', 5).text(function (d) {
        return d[_this3.cfg.values[1]] + '  ' + d[_this3.cfg.key];
      });
    }
    /**
    * Update chart's elements based on data change
    */

  }, {
    key: "updateElements",
    value: function updateElements() {
      var _this4 = this;

      // Lines to modify
      this.linesgroup.selectAll('.chart__line').data(this.data, function (d) {
        return d[_this4.cfg.key];
      }).transition(this.transition).attr("x1", 0).attr("x2", this.cfg.width).attr("y1", function (d) {
        return _this4.yScale(d[_this4.cfg.values[0]]);
      }).attr("y2", function (d) {
        return _this4.yScale(d[_this4.cfg.values[1]]);
      }); // Left axis points to modify

      this.linesgroup.selectAll('.chart__points-group--start').data(this.data, function (d) {
        return d[_this4.cfg.key];
      }).transition(this.transition).attr('transform', function (d) {
        return 'translate(0,' + _this4.yScale(d[_this4.cfg.values[0]]) + ')';
      }); // Left axis labels to modify

      this.linesgroup.selectAll('.chart__label--start').data(this.data, function (d) {
        return d[_this4.cfg.key];
      }).text(function (d) {
        return d[_this4.cfg.key] + ' ' + d[_this4.cfg.values[0]];
      }); // Right axis points to modify

      this.linesgroup.selectAll('.chart__points-group--end').data(this.data, function (d) {
        return d[_this4.cfg.key];
      }).transition(this.transition).attr('transform', function (d) {
        return 'translate(' + _this4.cfg.width + ',' + _this4.yScale(d[_this4.cfg.values[1]]) + ')';
      }); // Right axis labels to modify

      this.linesgroup.selectAll('.chart__label--end').data(this.data, function (d) {
        return d[_this4.cfg.key];
      }).text(function (d) {
        return d[_this4.cfg.values[1]] + '  ' + d[_this4.cfg.key];
      });
    }
    /**
    * Remove chart's elements without data
    */

  }, {
    key: "exitElements",
    value: function exitElements() {
      this.linesgroup.exit().transition(this.transition).style("opacity", 0).remove();
    }
  }]);

  return d3slopechart;
}(d3chart);var script$4 = {
  name: 'D3SlopeChart',
  extends: __vue_component__,
  mounted: function mounted() {
    this.chart = new d3slopechart(this.$refs.chart, JSON.parse(JSON.stringify(this.datum)), this.config);
  }
};/* script */
var __vue_script__$4 = script$4;
/* template */

/* style */

var __vue_inject_styles__$4 = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-6b03ba8c_0", {
    source: ".chart__wrapper{margin:20px 0}.chart__wrap{margin:0}.chart__title{text-align:center;font-weight:700}.chart__source{font-size:12px}.chart__tooltip{position:absolute;pointer-events:none;display:none}.chart__tooltip.active{display:block}.chart__tooltip>div{background:#2b2b2b;color:#fff;padding:6px 10px;border-radius:3px}.chart__axis{font-size:12px;shape-rendering:crispEdges}.chart__grid .domain{stroke:none;fill:none}.chart__grid .tick line{opacity:.2}.chart__label{font-size:12px}.chart .clickable{cursor:pointer}.chart--slopegraph .chart__line--current{stroke-width:2px}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$4 = undefined;
/* module identifier */

var __vue_module_identifier__$4 = "data-v-6b03ba8c";
/* functional template */

var __vue_is_functional_template__$4 = undefined;
/* style inject shadow dom */

var __vue_component__$4 = normalizeComponent({}, __vue_inject_styles__$4, __vue_script__$4, __vue_scope_id__$4, __vue_is_functional_template__$4, __vue_module_identifier__$4, false, undefined, createInjectorSSR, undefined);var d3$5 = {
  select: d3Selection.select,
  selectAll: d3Selection.selectAll,
  scaleLinear: d3Scale.scaleLinear,
  scaleOrdinal: d3Scale.scaleOrdinal,
  scaleSqrt: d3Scale.scaleSqrt,
  hierarchy: d3Hierarchy.hierarchy,
  partition: d3Hierarchy.partition,
  arc: d3Shape.arc,
  transition: d3Transition.transition,
  interpolate: d3Interpolate.interpolate,
  easeLinear: d3Ease.easeLinear,
  easePolyIn: d3Ease.easePolyIn,
  easePolyOut: d3Ease.easePolyOut,
  easePoly: d3Ease.easePoly,
  easePolyInOut: d3Ease.easePolyInOut,
  easeQuadIn: d3Ease.easeQuadIn,
  easeQuadOut: d3Ease.easeQuadOut,
  easeQuad: d3Ease.easeQuad,
  easeQuadInOut: d3Ease.easeQuadInOut,
  easeCubicIn: d3Ease.easeCubicIn,
  easeCubicOut: d3Ease.easeCubicOut,
  easeCubic: d3Ease.easeCubic,
  easeCubicInOut: d3Ease.easeCubicInOut,
  easeSinIn: d3Ease.easeSinIn,
  easeSinOut: d3Ease.easeSinOut,
  easeSin: d3Ease.easeSin,
  easeSinInOut: d3Ease.easeSinInOut,
  easeExpIn: d3Ease.easeExpIn,
  easeExpOut: d3Ease.easeExpOut,
  easeExp: d3Ease.easeExp,
  easeExpInOut: d3Ease.easeExpInOut,
  easeCircleIn: d3Ease.easeCircleIn,
  easeCircleOut: d3Ease.easeCircleOut,
  easeCircle: d3Ease.easeCircle,
  easeCircleInOut: d3Ease.easeCircleInOut,
  easeElasticIn: d3Ease.easeElasticIn,
  easeElastic: d3Ease.easeElastic,
  easeElasticOut: d3Ease.easeElasticOut,
  easeElasticInOut: d3Ease.easeElasticInOut,
  easeBackIn: d3Ease.easeBackIn,
  easeBackOut: d3Ease.easeBackOut,
  easeBack: d3Ease.easeBack,
  easeBackInOut: d3Ease.easeBackInOut,
  easeBounceIn: d3Ease.easeBounceIn,
  easeBounce: d3Ease.easeBounce,
  easeBounceOut: d3Ease.easeBounceOut,
  easeBounceInOut: d3Ease.easeBounceInOut,
  schemeCategory10: d3ScaleChromatic.schemeCategory10,
  schemeAccent: d3ScaleChromatic.schemeAccent,
  schemeDark2: d3ScaleChromatic.schemeDark2,
  schemePaired: d3ScaleChromatic.schemePaired,
  schemePastel1: d3ScaleChromatic.schemePastel1,
  schemePastel2: d3ScaleChromatic.schemePastel2,
  schemeSet1: d3ScaleChromatic.schemeSet1,
  schemeSet2: d3ScaleChromatic.schemeSet2,
  schemeSet3: d3ScaleChromatic.schemeSet3,
  schemeTableau10: d3ScaleChromatic.schemeTableau10
};
/**
* D3 Sunburst
*/

var d3sunburst =
/*#__PURE__*/
function (_d3chart) {
  _inherits(d3sunburst, _d3chart);

  function d3sunburst(selection, data, config) {
    _classCallCheck(this, d3sunburst);

    return _possibleConstructorReturn(this, _getPrototypeOf(d3sunburst).call(this, selection, data, config, {
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      },
      key: '',
      value: '',
      color: {
        key: false,
        keys: false,
        scheme: false,
        current: '#1f77b4',
        default: '#AAA',
        axis: '#000'
      },
      transition: {
        duration: 350,
        ease: 'easeLinear'
      }
    }));
  }
  /**
  * Init chart
  */


  _createClass(d3sunburst, [{
    key: "initChart",
    value: function initChart() {
      // Set up dimensions
      this.getDimensions();
      this.initChartFrame('sunburst'); // Center group

      this.gcenter = this.g.append('g');
      this.setChartDimension();
      this.updateChart();
    }
    /**
    * Set up chart dimensions (non depending on data)
    */

  }, {
    key: "setChartDimension",
    value: function setChartDimension() {
      // SVG element
      this.svg.attr("viewBox", "0 0 ".concat(this.cfg.width + this.cfg.margin.left + this.cfg.margin.right, " ").concat(this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom)).attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right).attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom); // Center group

      this.gcenter.attr('transform', "translate(".concat(this.cfg.width / 2, ", ").concat(this.cfg.height / 2, ")"));
    }
    /**
    * Bind data to main elements groups
    */

  }, {
    key: "bindData",
    value: function bindData() {
      var _this = this;

      var partition = function partition(data) {
        var root = d3$5.hierarchy(data).sum(function (d) {
          return d[_this.cfg.value];
        });
        return d3$5.partition()(root);
      };

      this.hData = partition(this.data[0]).descendants();
      this.itemg = this.gcenter.selectAll('.chart__slice-group').data(this.hData, function (d) {
        return d.data[_this.cfg.key];
      }); // Set transition

      this.transition = d3$5.transition('t').duration(this.cfg.transition.duration).ease(d3$5[this.cfg.transition.ease]);
    }
    /**
    * Set up scales
    */

  }, {
    key: "setScales",
    value: function setScales() {
      var _this2 = this;

      this.radius = Math.min(this.cfg.width, this.cfg.height) / 2;
      this.xScale = d3$5.scaleLinear().range([0, 2 * Math.PI]).clamp(true);
      this.yScale = d3$5.scaleSqrt().range([this.radius * .1, this.radius]);
      this.arc = d3$5.arc().startAngle(function (d) {
        return _this2.xScale(d.x0);
      }).endAngle(function (d) {
        return _this2.xScale(d.x1);
      }).innerRadius(function (d) {
        return Math.max(0, _this2.yScale(d.y0));
      }).outerRadius(function (d) {
        return Math.max(0, _this2.yScale(d.y1));
      }); // Set up color scheme

      if (this.cfg.color.scheme) {
        if (this.cfg.color.scheme instanceof Array === true) {
          this.colorScale = d3$5.scaleOrdinal().range(this.cfg.color.scheme);
        } else {
          this.colorScale = d3$5.scaleOrdinal(d3$5[this.cfg.color.scheme]);
        }
      }
    }
    /**
    * Add new chart's elements
    */

  }, {
    key: "enterElements",
    value: function enterElements() {
      var _this3 = this;

      var newg = this.itemg.enter().append('g').attr("class", "chart__slice-group chart__slice-group--sunburst clickable").on('click', function (d) {
        window.event.stopPropagation();

        _this3.focusOn(d);
      }); // PATHS

      newg.append("path").attr("class", "chart__slice chart__slice--sunburst").style("fill", function (d) {
        return _this3.colorElement(d.data);
      }).on('mouseover', function (d) {
        _this3.tooltip.html(function () {
          return "<div>".concat(d.data[_this3.cfg.key], ": ").concat(d.value, "</div>");
        }).classed('active', true);
      }).on('mouseout', function () {
        _this3.tooltip.classed('active', false);
      }).on('mousemove', function () {
        _this3.tooltip.style('left', window.event['pageX'] - 28 + 'px').style('top', window.event['pageY'] - 40 + 'px');
      }).transition(this.transition).attrTween('d', function (d) {
        var iy0 = d3$5.interpolate(0, d.y0);
        var iy1 = d3$5.interpolate(d.y0, d.y1);
        var ix0 = d3$5.interpolate(0, d.x0);
        var ix1 = d3$5.interpolate(0, d.x1);
        return function (t) {
          d.y0 = iy0(t);
          d.y1 = iy1(t);
          d.x0 = ix0(t);
          d.x1 = ix1(t);
          return _this3.arc(d);
        };
      });
    }
    /**
    * Update chart's elements based on data change
    */

  }, {
    key: "updateElements",
    value: function updateElements() {
      var _this4 = this;

      this.itemg.selectAll('.chart__slice').transition(this.transition).attrTween('d', function (d) {
        var d2 = _this4.hData.filter(function (j) {
          return j.data.name === d.data.name;
        })[0];

        var iy0 = d3$5.interpolate(d.y0, d2.y0);
        var iy1 = d3$5.interpolate(d.y1, d2.y1);
        var ix0 = d3$5.interpolate(d.x0, d2.x0);
        var ix1 = d3$5.interpolate(d.x1, d2.x1);
        return function (t) {
          d2.y0 = iy0(t);
          d2.y1 = iy1(t);
          d2.x0 = ix0(t);
          d2.x1 = ix1(t);
          return _this4.arc(d2);
        };
      }).style("fill", function (d) {
        return _this4.colorElement(d.data);
      });
    }
    /**
    * Remove chart's elements without data
    */

  }, {
    key: "exitElements",
    value: function exitElements() {
      this.itemg.exit().transition(this.transition).style("opacity", 0).remove();
    }
    /**
    * Check if text fits in available space
    */

  }, {
    key: "textFits",
    value: function textFits(d) {
      var deltaAngle = this.xScale(d.x1) - this.xScale(d.x0);
      var r = Math.max(0, (this.yScale(d.y0) + this.yScale(d.y1)) / 2);
      return d.data[this.cfg.key].length * this.cfg.charSpace < r * deltaAngle;
    }
    /**
    * Transition slice on focus
    */

  }, {
    key: "focusOn",
    value: function focusOn(d) {
      var _this5 = this;

      var d2 = this.hData.filter(function (j) {
        return j.data.name === d.data.name;
      })[0];
      var transition = this.svg.transition().duration(this.cfg.transition.duration).ease(d3$5[this.cfg.transition.ease]).tween('scale', function () {
        var xd = d3$5.interpolate(_this5.xScale.domain(), [d2.x0, d2.x1]);
        var yd = d3$5.interpolate(_this5.yScale.domain(), [d2.y0, 1]);
        return function (t) {
          _this5.xScale.domain(xd(t));

          _this5.yScale.domain(yd(t));
        };
      });
      transition.selectAll('.chart__slice').attrTween('d', function (d) {
        return function () {
          var d3 = _this5.hData.filter(function (j) {
            return j.data.name === d.data.name;
          })[0];

          return _this5.arc(d3);
        };
      });
    }
  }]);

  return d3sunburst;
}(d3chart);var script$5 = {
  name: 'D3Sunburst',
  extends: __vue_component__,
  mounted: function mounted() {
    this.chart = new d3sunburst(this.$refs.chart, JSON.parse(JSON.stringify(this.datum)), this.config);
  }
};/* script */
var __vue_script__$5 = script$5;
/* template */

/* style */

var __vue_inject_styles__$5 = undefined;
/* scoped */

var __vue_scope_id__$5 = undefined;
/* module identifier */

var __vue_module_identifier__$5 = "data-v-4ce47b3e";
/* functional template */

var __vue_is_functional_template__$5 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$5 = normalizeComponent({}, __vue_inject_styles__$5, __vue_script__$5, __vue_scope_id__$5, __vue_is_functional_template__$5, __vue_module_identifier__$5, false, undefined, undefined, undefined);var d3$6 = {
  select: d3Selection.select,
  selectAll: d3Selection.selectAll,
  scaleOrdinal: d3Scale.scaleOrdinal,
  scaleLinear: d3Scale.scaleLinear,
  max: d3Array.max,
  extent: d3Array.extent,
  transition: d3Transition.transition,
  cloud: cloud,
  easeLinear: d3Ease.easeLinear,
  easePolyIn: d3Ease.easePolyIn,
  easePolyOut: d3Ease.easePolyOut,
  easePoly: d3Ease.easePoly,
  easePolyInOut: d3Ease.easePolyInOut,
  easeQuadIn: d3Ease.easeQuadIn,
  easeQuadOut: d3Ease.easeQuadOut,
  easeQuad: d3Ease.easeQuad,
  easeQuadInOut: d3Ease.easeQuadInOut,
  easeCubicIn: d3Ease.easeCubicIn,
  easeCubicOut: d3Ease.easeCubicOut,
  easeCubic: d3Ease.easeCubic,
  easeCubicInOut: d3Ease.easeCubicInOut,
  easeSinIn: d3Ease.easeSinIn,
  easeSinOut: d3Ease.easeSinOut,
  easeSin: d3Ease.easeSin,
  easeSinInOut: d3Ease.easeSinInOut,
  easeExpIn: d3Ease.easeExpIn,
  easeExpOut: d3Ease.easeExpOut,
  easeExp: d3Ease.easeExp,
  easeExpInOut: d3Ease.easeExpInOut,
  easeCircleIn: d3Ease.easeCircleIn,
  easeCircleOut: d3Ease.easeCircleOut,
  easeCircle: d3Ease.easeCircle,
  easeCircleInOut: d3Ease.easeCircleInOut,
  easeElasticIn: d3Ease.easeElasticIn,
  easeElastic: d3Ease.easeElastic,
  easeElasticOut: d3Ease.easeElasticOut,
  easeElasticInOut: d3Ease.easeElasticInOut,
  easeBackIn: d3Ease.easeBackIn,
  easeBackOut: d3Ease.easeBackOut,
  easeBack: d3Ease.easeBack,
  easeBackInOut: d3Ease.easeBackInOut,
  easeBounceIn: d3Ease.easeBounceIn,
  easeBounce: d3Ease.easeBounce,
  easeBounceOut: d3Ease.easeBounceOut,
  easeBounceInOut: d3Ease.easeBounceInOut,
  schemeCategory10: d3ScaleChromatic.schemeCategory10,
  schemeAccent: d3ScaleChromatic.schemeAccent,
  schemeDark2: d3ScaleChromatic.schemeDark2,
  schemePaired: d3ScaleChromatic.schemePaired,
  schemePastel1: d3ScaleChromatic.schemePastel1,
  schemePastel2: d3ScaleChromatic.schemePastel2,
  schemeSet1: d3ScaleChromatic.schemeSet1,
  schemeSet2: d3ScaleChromatic.schemeSet2,
  schemeSet3: d3ScaleChromatic.schemeSet3,
  schemeTableau10: d3ScaleChromatic.schemeTableau10
};
/**
 * D3 Words Cloud
 */

var d3wordscloud =
/*#__PURE__*/
function (_d3chart) {
  _inherits(d3wordscloud, _d3chart);

  function d3wordscloud(selection, data, config) {
    _classCallCheck(this, d3wordscloud);

    return _possibleConstructorReturn(this, _getPrototypeOf(d3wordscloud).call(this, selection, data, config, {
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      },
      key: 'word',
      value: 'size',
      fontFamily: 'Arial',
      angle: {
        steps: 2,
        start: 0,
        end: 90
      },
      color: {
        key: false,
        keys: false,
        scheme: false,
        current: '#1f77b4',
        default: '#AAA',
        axis: '#000'
      },
      transition: {
        duration: 350,
        ease: 'easeLinear'
      }
    }));
  }
  /**
  * Init chart
  */


  _createClass(d3wordscloud, [{
    key: "initChart",
    value: function initChart() {
      // Set up dimensions
      this.getDimensions();
      this.initChartFrame('wordscloud');
      this.gcenter = this.g.append('g');
      this.setChartDimension();
      this.updateChart();
    }
    /**
    * Compute data before operate
    */

  }, {
    key: "computeData",
    value: function computeData() {
      var _this = this;

      var layout = d3$6.cloud().size([this.cfg.width, this.cfg.height]).words(this.data.map(function (d) {
        return {
          text: d[_this.cfg.key],
          size: d[_this.cfg.value]
        };
      })).rotate(function () {
        return _this.wordsAngle(_this.cfg.angle);
      }).font(this.cfg.fontFamily).fontSize(function (d) {
        return d.size;
      }).on("end", function (d) {
        _this.tData = d;
      }).start();
    }
    /**
     * Set up chart dimensions (non depending on data)
     */

  }, {
    key: "setChartDimension",
    value: function setChartDimension() {
      // Resize SVG element
      this.svg.attr("viewBox", "0 0 ".concat(this.cfg.width + this.cfg.margin.left + this.cfg.margin.right, " ").concat(this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom)).attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right).attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom); // Center element

      this.gcenter.attr('transform', "translate(".concat(this.cfg.width / 2, ", ").concat(this.cfg.height / 2, ")"));
    }
    /**
     * Bind data to main elements groups
     */

  }, {
    key: "bindData",
    value: function bindData() {
      // Set transition
      this.transition = d3$6.transition('t').duration(this.cfg.transition.duration).ease(d3$6[this.cfg.transition.ease]); // Word group selection data

      this.wordgroup = this.gcenter.selectAll(".chart__word-group").data(this.tData, function (d) {
        return d.text;
      });
    }
    /**
     * Set up scales
     */

  }, {
    key: "setScales",
    value: function setScales() {
      if (this.cfg.color.scheme instanceof Array === true) {
        this.colorScale = d3$6.scaleOrdinal().range(this.cfg.color.scheme);
      } else if (typeof this.cfg.color.scheme === 'string') {
        this.colorScale = d3$6.scaleOrdinal(d3$6[this.cfg.color.scheme]);
      }
    }
    /**
     * Add new chart's elements
     */

  }, {
    key: "enterElements",
    value: function enterElements() {
      var _this2 = this;

      // Elements to add
      var newwords = this.wordgroup.enter().append('g').attr("class", "chart__word-group chart__word-group--wordscloud");
      newwords.append("text").style("font-size", function (d) {
        return d.size + "px";
      }).style("font-family", function (d) {
        return d.font;
      }).attr("text-anchor", "middle").attr('fill', function (d) {
        return _this2.colorElement(d, 'text');
      }).attr("transform", function (d) {
        return "translate(".concat([d.x, d.y], ")rotate(").concat(d.rotate, ")");
      }).text(function (d) {
        return d.text;
      });
    }
    /**
     * Update chart's elements based on data change
     */

  }, {
    key: "updateElements",
    value: function updateElements() {
      var _this3 = this;

      this.wordgroup.selectAll('text').data(this.tData, function (d) {
        return d.text;
      }).transition(this.transition).attr('fill', function (d) {
        return _this3.colorElement(d, 'text');
      }).style("font-size", function (d) {
        return d.size + "px";
      }).attr("transform", function (d) {
        return "translate(".concat([d.x, d.y], ")rotate(").concat(d.rotate, ")");
      });
    }
    /**
     * Remove chart's elements without data
     */

  }, {
    key: "exitElements",
    value: function exitElements() {
      this.wordgroup.exit().transition(this.transition).style("opacity", 0).remove();
    }
    /**
     * Word's angle
     */

  }, {
    key: "wordsAngle",
    value: function wordsAngle(angle) {
      if (typeof this.cfg.angle === 'number') {
        // Config angle is fixed number
        return this.cfg.angle;
      } else if (_typeof(this.cfg.angle) === 'object') {
        if (this.cfg.angle instanceof Array === true) {
          // Config angle is custom array
          var idx = this.randomInt(0, this.cfg.angle.length - 1);
          return this.cfg.angle[idx];
        } else {
          // Config angle is custom object
          var _angle = (this.cfg.angle.end - this.cfg.angle.start) / (this.cfg.angle.steps - 1);

          return this.cfg.angle.start + this.randomInt(0, this.cfg.angle.steps) * _angle;
        }
      }

      return 0;
    }
  }, {
    key: "randomInt",
    value: function randomInt(min, max) {
      var i = Math.ceil(min);
      var j = Math.floor(max);
      return Math.floor(Math.random() * (j - i + 1)) + i;
    }
  }]);

  return d3wordscloud;
}(d3chart);var script$6 = {
  name: 'D3WordsCloud',
  extends: __vue_component__,
  mounted: function mounted() {
    this.chart = new d3wordscloud(this.$refs.chart, JSON.parse(JSON.stringify(this.datum)), this.config);
  }
};/* script */
var __vue_script__$6 = script$6;
/* template */

/* style */

var __vue_inject_styles__$6 = undefined;
/* scoped */

var __vue_scope_id__$6 = undefined;
/* module identifier */

var __vue_module_identifier__$6 = "data-v-66b7e034";
/* functional template */

var __vue_is_functional_template__$6 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__$6 = normalizeComponent({}, __vue_inject_styles__$6, __vue_script__$6, __vue_scope_id__$6, __vue_is_functional_template__$6, __vue_module_identifier__$6, false, undefined, undefined, undefined);var d3$7 = {
  select: d3Selection.select,
  selectAll: d3Selection.selectAll,
  scaleLinear: d3Scale.scaleLinear,
  scaleOrdinal: d3Scale.scaleOrdinal,
  max: d3Array.max,
  min: d3Array.min,
  transition: d3Transition.transition,
  pie: d3Shape.pie,
  arc: d3Shape.arc,
  interpolate: d3Interpolate.interpolate,
  easeLinear: d3Ease.easeLinear,
  easePolyIn: d3Ease.easePolyIn,
  easePolyOut: d3Ease.easePolyOut,
  easePoly: d3Ease.easePoly,
  easePolyInOut: d3Ease.easePolyInOut,
  easeQuadIn: d3Ease.easeQuadIn,
  easeQuadOut: d3Ease.easeQuadOut,
  easeQuad: d3Ease.easeQuad,
  easeQuadInOut: d3Ease.easeQuadInOut,
  easeCubicIn: d3Ease.easeCubicIn,
  easeCubicOut: d3Ease.easeCubicOut,
  easeCubic: d3Ease.easeCubic,
  easeCubicInOut: d3Ease.easeCubicInOut,
  easeSinIn: d3Ease.easeSinIn,
  easeSinOut: d3Ease.easeSinOut,
  easeSin: d3Ease.easeSin,
  easeSinInOut: d3Ease.easeSinInOut,
  easeExpIn: d3Ease.easeExpIn,
  easeExpOut: d3Ease.easeExpOut,
  easeExp: d3Ease.easeExp,
  easeExpInOut: d3Ease.easeExpInOut,
  easeCircleIn: d3Ease.easeCircleIn,
  easeCircleOut: d3Ease.easeCircleOut,
  easeCircle: d3Ease.easeCircle,
  easeCircleInOut: d3Ease.easeCircleInOut,
  easeElasticIn: d3Ease.easeElasticIn,
  easeElastic: d3Ease.easeElastic,
  easeElasticOut: d3Ease.easeElasticOut,
  easeElasticInOut: d3Ease.easeElasticInOut,
  easeBackIn: d3Ease.easeBackIn,
  easeBackOut: d3Ease.easeBackOut,
  easeBack: d3Ease.easeBack,
  easeBackInOut: d3Ease.easeBackInOut,
  easeBounceIn: d3Ease.easeBounceIn,
  easeBounce: d3Ease.easeBounce,
  easeBounceOut: d3Ease.easeBounceOut,
  easeBounceInOut: d3Ease.easeBounceInOut,
  schemeCategory10: d3ScaleChromatic.schemeCategory10,
  schemeAccent: d3ScaleChromatic.schemeAccent,
  schemeDark2: d3ScaleChromatic.schemeDark2,
  schemePaired: d3ScaleChromatic.schemePaired,
  schemePastel1: d3ScaleChromatic.schemePastel1,
  schemePastel2: d3ScaleChromatic.schemePastel2,
  schemeSet1: d3ScaleChromatic.schemeSet1,
  schemeSet2: d3ScaleChromatic.schemeSet2,
  schemeSet3: d3ScaleChromatic.schemeSet3,
  schemeTableau10: d3ScaleChromatic.schemeTableau10
};
/**
* D3 Slices Chart
*/

var d3sliceschart =
/*#__PURE__*/
function (_d3chart) {
  _inherits(d3sliceschart, _d3chart);

  function d3sliceschart(selection, data, config) {
    _classCallCheck(this, d3sliceschart);

    return _possibleConstructorReturn(this, _getPrototypeOf(d3sliceschart).call(this, selection, data, config, {
      margin: {
        top: 40,
        right: 20,
        bottom: 40,
        left: 20
      },
      key: '',
      value: 'value',
      color: {
        key: false,
        keys: false,
        scheme: false,
        current: '#1f77b4',
        default: '#AAA',
        axis: '#000'
      },
      radius: {
        inner: false,
        outter: false,
        padding: 0,
        round: 0
      },
      transition: {
        duration: 350,
        ease: 'easeLinear'
      }
    }));
  }
  /**
  * Init chart
  */


  _createClass(d3sliceschart, [{
    key: "initChart",
    value: function initChart() {
      // Set up dimensions
      this.getDimensions();
      this.initChartFrame('sliceschart');
      this.cScale = d3$7.scaleOrdinal();
      this.rScale = d3$7.scaleLinear();
      this.arc = d3$7.arc();
      this.pie = d3$7.pie().sort(null).value(function () {
        return 1;
      }).padAngle(this.cfg.radius.padding);

      if (this.cfg.radius && this.cfg.radius.inner) {
        var outRadius = this.cfg.radius.outter ? this.cfg.radius.outter : Math.min(this.cfg.width, this.cfg.height) / 2;
        this.cfg.radius.relation = this.cfg.radius.inner ? this.cfg.radius.inner / outRadius : 0;
      }

      this.gcenter = this.g.append('g');
      this.setChartDimension();
      this.updateChart();
    }
    /**
    * Set up chart dimensions (non depending on data)
    */

  }, {
    key: "setChartDimension",
    value: function setChartDimension() {
      // SVG element
      this.svg.attr("viewBox", "0 0 ".concat(this.cfg.width + this.cfg.margin.left + this.cfg.margin.right, " ").concat(this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom)).attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right).attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom); // Center element

      this.gcenter.attr('transform', "translate(".concat(this.cfg.width / 2, ", ").concat(this.cfg.height / 2, ")"));
    }
    /**
    * Bind data to main elements groups
    */

  }, {
    key: "bindData",
    value: function bindData() {
      var _this = this;

      this.itemg = this.gcenter.selectAll('.chart__slice-group').data(this.pie(this.data), function (d) {
        return d.data[_this.cfg.key];
      }); // Set transition

      this.transition = d3$7.transition('t').duration(this.cfg.transition.duration).ease(d3$7[this.cfg.transition.ease]);
    }
    /**
    * Set up scales
    */

  }, {
    key: "setScales",
    value: function setScales() {
      var _this2 = this;

      // Set up radius
      this.cfg.radius.outter = this.cfg.radius && this.cfg.radius.outter ? this.cfg.radius.outter : Math.min(this.cfg.width, this.cfg.height) / 2;
      this.inRadius = this.cfg.radius && this.cfg.radius.inner ? this.cfg.radius.inner : 0;

      if (this.cfg.radius.relation) {
        this.inRadius = this.cfg.radius.outter * this.cfg.radius.relation;
      } // Set up arcs


      this.arc = d3$7.arc().outerRadius(this.cfg.radius.outter).innerRadius(this.inRadius).cornerRadius(this.cfg.radius.round);
      this.rScale.range([this.inRadius, this.cfg.radius.outter]).domain([0, d3$7.max(this.data, function (d) {
        return d[_this2.cfg.value];
      })]); // Set up color scheme

      if (this.cfg.color.scheme) {
        if (this.cfg.color.scheme instanceof Array === true) {
          this.colorScale = d3$7.scaleOrdinal().domain(this.data.map(function (d) {
            return d[_this2.cfg.key];
          })).range(this.cfg.color.scheme);
        } else {
          this.colorScale = d3$7.scaleOrdinal(d3$7[this.cfg.color.scheme]).domain(this.data.map(function (d) {
            return d[_this2.cfg.key];
          }));
        }
      }
    }
    /**
    * Add new chart's elements
    */

  }, {
    key: "enterElements",
    value: function enterElements() {
      var _this3 = this;

      var newg = this.itemg.enter().append('g').attr("class", "chart__slice-group chart__slice-group--sliceschart"); // BACKGROUNDS

      newg.append("path").attr("class", "chart__slice chart__slice--sliceschart").on('mouseover', function (d, i) {
        var key = d.data[_this3.cfg.key];
        var value = d.data[_this3.cfg.value];

        _this3.tooltip.html(function () {
          return "<div>".concat(key, ": ").concat(value, "</div>");
        }).classed('active', true);
      }).on('mouseout', function () {
        _this3.tooltip.classed('active', false);
      }).on('mousemove', function () {
        _this3.tooltip.style('left', window.event['pageX'] - 28 + 'px').style('top', window.event['pageY'] - 40 + 'px');
      }).transition(this.transition).delay(function (d, i) {
        return i * _this3.cfg.transition.duration;
      }).attrTween('d', function (d) {
        var i = d3$7.interpolate(d.startAngle + 0.1, d.endAngle);
        return function (t) {
          d.endAngle = i(t);
          return _this3.arc(d);
        };
      }).style("fill", function (d) {
        return _this3.cfg.color.default;
      }).style('opacity', 1); // FILLS

      newg.append("path").attr("class", "chart__slice chart__slice--sliceschart").transition(this.transition).delay(function (d, i) {
        return i * _this3.cfg.transition.duration;
      }).attrTween('d', function (d) {
        var i = d3$7.interpolate(d.startAngle + 0.1, d.endAngle);
        var arc = d3$7.arc().outerRadius(_this3.rScale(d.data[_this3.cfg.value])).innerRadius(_this3.inRadius).cornerRadius(_this3.cfg.radius.round);
        return function (t) {
          d.endAngle = i(t);
          return arc(d);
        };
      }).style("fill", function (d) {
        return _this3.colorElement(d.data);
      }).style('pointer-events', 'none').style('opacity', 1);
    }
    /**
    * Update chart's elements based on data change
    */

  }, {
    key: "updateElements",
    value: function updateElements() {}
    /*
            // PATHS
            this.itemg.selectAll(".chart__slice")
                .style('opacity', 0)
                .data(this.pie(this.data), d => d.data[this.cfg.key])
                .transition(this.transition)
                .delay((d,i) => i * this.cfg.transition.duration)
                .attrTween('d', d => {
                    const i = d3.interpolate(d.startAngle+0.1, d.endAngle);
                    return t => {
                        d.endAngle = i(t); 
                        return this.arc(d)
                    }
                })
                .style("fill", this.cfg.color.default)
                .style('opacity', 1);
    */

    /**
    * Remove chart's elements without data
    */

  }, {
    key: "exitElements",
    value: function exitElements() {
      this.itemg.exit().transition(this.transition).style("opacity", 0).remove();
    }
  }, {
    key: "midAngle",
    value: function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }
    /**
    * Store the displayed angles in _current.
    * Then, interpolate from _current to the new angles.
    * During the transition, _current is updated in-place by d3.interpolate.
    */

  }, {
    key: "arcTween",
    value: function arcTween(a) {
      var _this4 = this;

      var i = d3$7.interpolate(this._current, a);
      this._current = i(0);
      return function (t) {
        return _this4.arc(i(t));
      };
    }
  }]);

  return d3sliceschart;
}(d3chart);var script$7 = {
  name: 'D3SlicesChart',
  extends: __vue_component__,
  mounted: function mounted() {
    this.chart = new d3sliceschart(this.$refs.chart, JSON.parse(JSON.stringify(this.datum)), this.config);
  }
};/* script */
var __vue_script__$7 = script$7;
/* template */

/* style */

var __vue_inject_styles__$7 = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-6a52c448_0", {
    source: ".chart__wrapper{margin:20px 0}.chart__wrap{margin:0}.chart__title{text-align:center;font-weight:700}.chart__source{font-size:12px}.chart__tooltip{position:absolute;pointer-events:none;display:none}.chart__tooltip.active{display:block}.chart__tooltip>div{background:#2b2b2b;color:#fff;padding:6px 10px;border-radius:3px}.chart__axis{font-size:12px;shape-rendering:crispEdges}.chart__grid .domain{stroke:none;fill:none}.chart__grid .tick line{opacity:.2}.chart__label{font-size:12px}.chart .clickable{cursor:pointer}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$7 = undefined;
/* module identifier */

var __vue_module_identifier__$7 = "data-v-6a52c448";
/* functional template */

var __vue_is_functional_template__$7 = undefined;
/* style inject shadow dom */

var __vue_component__$7 = normalizeComponent({}, __vue_inject_styles__$7, __vue_script__$7, __vue_scope_id__$7, __vue_is_functional_template__$7, __vue_module_identifier__$7, false, undefined, createInjectorSSR, undefined);/* eslint-disable import/prefer-default-export */var components=/*#__PURE__*/Object.freeze({__proto__:null,D3BarChart: __vue_component__$1,D3LineChart: __vue_component__$2,D3PieChart: __vue_component__$3,D3SlopeChart: __vue_component__$4,D3Sunburst: __vue_component__$5,D3WordsCloud: __vue_component__$6,D3SlicesChart: __vue_component__$7});var install = function installVueD3Charts(Vue) {
  if (install.installed) return;
  install.installed = true;
  Object.entries(components).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        componentName = _ref2[0],
        component = _ref2[1];

    Vue.component(componentName, component);
  });
}; // Create module definition for Vue.use()


var plugin = {
  install: install
}; // To auto-install when vue is found
// eslint-disable-next-line no-redeclare

/* global window, global */

var GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
} // Default export is library as a whole, registered via Vue.use()
exports.D3BarChart=__vue_component__$1;exports.D3LineChart=__vue_component__$2;exports.D3PieChart=__vue_component__$3;exports.D3SlicesChart=__vue_component__$7;exports.D3SlopeChart=__vue_component__$4;exports.D3Sunburst=__vue_component__$5;exports.D3WordsCloud=__vue_component__$6;exports.default=plugin;