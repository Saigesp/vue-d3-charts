import { select, selectAll } from 'd3-selection';
import { scaleBand, scaleLinear, scaleOrdinal, scaleTime, scaleSqrt } from 'd3-scale';
import { max, extent, min } from 'd3-array';
import { transition } from 'd3-transition';
import { axisBottom, axisLeft } from 'd3-axis';
import { easeLinear, easePolyIn, easePolyOut, easePoly, easePolyInOut, easeQuadIn, easeQuadOut, easeQuad, easeQuadInOut, easeCubicIn, easeCubicOut, easeCubic, easeCubicInOut, easeSinIn, easeSinOut, easeSin, easeSinInOut, easeExpIn, easeExpOut, easeExp, easeExpInOut, easeCircleIn, easeCircleOut, easeCircle, easeCircleInOut, easeElasticIn, easeElastic, easeElasticOut, easeElasticInOut, easeBackIn, easeBackOut, easeBack, easeBackInOut, easeBounceIn, easeBounce, easeBounceOut, easeBounceInOut } from 'd3-ease';
import { schemeCategory10, schemeAccent, schemeDark2, schemePaired, schemePastel1, schemePastel2, schemeSet1, schemeSet2, schemeSet3, schemeTableau10 } from 'd3-scale-chromatic';
import { timeParse, timeFormat } from 'd3-time-format';
import { line, curveBasis, curveBundle, curveCardinal, curveCatmullRom, curveLinear, curveMonotoneX, curveMonotoneY, curveNatural, curveStep, curveStepAfter, curveStepBefore, pie, arc } from 'd3-shape';
import { interpolate } from 'd3-interpolate';
import { hierarchy, partition } from 'd3-hierarchy';
import * as cloud from 'd3-cloud';

//
//
//
//
//
//
//
//
var script = {
  name: 'D3Chart',

  data() {
    return {
      chart: {}
    };
  },

  props: {
    config: {
      type: Object,
      required: true,
      default: () => ({})
    },
    datum: {
      type: Array,
      required: true,
      default: () => []
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
      handler(val) {
        this.chart.updateConfig(val);
      },

      deep: true
    },

    datum(vals) {
      this.chart.updateData([...vals]);
    }

  },

  beforeDestroy() {
    this.chart.destroyChart();
  }

};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "chart__wrapper"
  }, [_vm.title ? _c('div', {
    staticClass: "chart__title"
  }, [_vm._v(_vm._s(_vm.title))]) : _vm._e(), _vm._v(" "), _c('div', {
    ref: "chart",
    style: {
      height: this.height + "px"
    }
  }), _vm._v(" "), _vm.source ? _c('div', {
    staticClass: "chart__source"
  }, [_vm._v(_vm._s(_vm.source))]) : _vm._e()]);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-52bb9522_0", {
    source: ".chart__wrapper{margin:20px 0}.chart__wrap{margin:0}.chart__title{text-align:center;font-weight:700}.chart__source{font-size:12px}.chart__tooltip{position:absolute;pointer-events:none;display:none}.chart__tooltip.active{display:block}.chart__tooltip>div{background:#2b2b2b;color:#fff;padding:6px 10px;border-radius:3px}.chart__axis{font-size:12px;shape-rendering:crispEdges}.chart__grid .domain{stroke:none;fill:none}.chart__grid .tick line{opacity:.2}.chart__label{font-size:12px}.chart .clickable{cursor:pointer}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = undefined;
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

const d3 = {
  select
};
/**
* D3 Chart Base
*/

class d3chart {
  constructor(selection, data, config, cfg) {
    this.selection = d3.select(selection);
    this.data = data;
    this.cfg = cfg;

    this._setConfig(config); // Resize listener


    this.onResize = () => {
      this.resizeChart();
    };

    window.addEventListener("resize", this.onResize);
    this.initChart();
  }

  _setConfig(config) {
    // Set up configuration
    Object.keys(config).forEach(key => {
      if (config[key] instanceof Object && config[key] instanceof Array === false) {
        Object.keys(config[key]).forEach(sk => {
          this.cfg[key][sk] = config[key][sk];
        });
      } else this.cfg[key] = config[key];
    });
  }
  /**
  * Init chart
  */


  initChart() {
    console.error('d3chart.initChart not implemented');
  }
  /**
  * Resize chart pipe
  */


  setScales() {
    console.error('d3chart.setScales not implemented');
  }
  /**
  * Set chart dimensional sizes
  */


  setChartDimension() {
    console.error('d3chart.setChartDimension not implemented');
  }
  /**
  * Bind data to main elements groups
  */


  bindData() {
    console.error('d3.chart.bindData not implemented');
  }
  /**
  * Add new chart's elements
  */


  enterElements() {
    console.error('d3.chart.enterElements not implemented');
  }
  /**
  * Update chart's elements based on data change
  */


  updateElements() {
    console.error('d3.chart.updateElements not implemented');
  }
  /**
  * Remove chart's elements without data
  */


  exitElements() {
    console.error('d3.chart.exitElements not implemented');
  }
  /**
  * Set up chart dimensions
  */


  getDimensions() {
    this.cfg.width = parseInt(this.selection.node().offsetWidth) - this.cfg.margin.left - this.cfg.margin.right;
    this.cfg.height = parseInt(this.selection.node().offsetHeight) - this.cfg.margin.top - this.cfg.margin.bottom;
  }
  /**
  * Returns chart's data
  */


  getData() {
    return this.data;
  }
  /**
  * Add new data elements
  */


  enterData(data) {
    this.data = this.data.concat(data);
    this.setScales();
    this.updateChart();
  }
  /**
  * Update existing data elements
  */


  updateData(data) {
    this.data = [...data];
    this.setScales();
    this.updateChart();
  }
  /**
  * Compute data before operate
  */


  computeData() {}
  /**
  * Remove data elements
  */


  exitData(filter) {
    this.data.forEach((d, i) => {
      let c = 0;
      Object.keys(filter).forEach(key => {
        if (filter[key] == d[key]) c++;
      });

      if (c == Object.keys(filter).length) {
        this.data.splice(i, 1);
      }
    });
    this.setScales();
    this.updateChart();
  }
  /**
  * Init chart commons elements (div > svg > g; tooltip)
  */


  initChartFrame(classname = 'undefined') {
    // Wrapper div
    this.wrap = this.selection.append('div').attr("class", "chart__wrap chart__wrap--" + classname); // SVG element

    this.svg = this.wrap.append('svg').attr("class", "chart chart--" + classname); // General group for margin convention

    this.g = this.svg.append("g").attr("class", "chart__margin-wrap chart__margin-wrap--" + classname).attr("transform", `translate(${this.cfg.margin.left},${this.cfg.margin.top})`); // Tooltip

    this.selection.selectAll('.chart__tooltip').remove();
    this.tooltip = this.wrap.append('div').attr('class', "chart__tooltip chart__tooltip--" + classname);
  }
  /**
  * Compute element color
  */


  colorElement(d, key = undefined) {
    key = key ? key : this.cfg.key; // if key is set, return own object color key

    if (this.cfg.color.key) return d[this.cfg.color.key]; // base color is default one if current key is set, else current one

    let baseColor = this.cfg.currentKey ? this.cfg.color.default : this.cfg.color.current; // if scheme is set, base color is color scheme

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


  updateChart() {
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


  resizeChart() {
    this.getDimensions(); //this.setScales();

    this.setChartDimension();
    this.updateChart();
  }
  /**
  * Update chart configuration
  */


  updateConfig(config) {
    this._setConfig(config);

    this.resizeChart();
  }
  /**
  * Destroy chart methods
  */


  destroyChart() {
    window.removeEventListener("resize", this.onResize);
  }

}

const d3$1 = {
  select,
  selectAll,
  scaleBand,
  scaleLinear,
  scaleOrdinal,
  max,
  transition,
  axisBottom,
  axisLeft,
  easeLinear,
  easePolyIn,
  easePolyOut,
  easePoly,
  easePolyInOut,
  easeQuadIn,
  easeQuadOut,
  easeQuad,
  easeQuadInOut,
  easeCubicIn,
  easeCubicOut,
  easeCubic,
  easeCubicInOut,
  easeSinIn,
  easeSinOut,
  easeSin,
  easeSinInOut,
  easeExpIn,
  easeExpOut,
  easeExp,
  easeExpInOut,
  easeCircleIn,
  easeCircleOut,
  easeCircle,
  easeCircleInOut,
  easeElasticIn,
  easeElastic,
  easeElasticOut,
  easeElasticInOut,
  easeBackIn,
  easeBackOut,
  easeBack,
  easeBackInOut,
  easeBounceIn,
  easeBounce,
  easeBounceOut,
  easeBounceInOut,
  schemeCategory10,
  schemeAccent,
  schemeDark2,
  schemePaired,
  schemePastel1,
  schemePastel2,
  schemeSet1,
  schemeSet2,
  schemeSet3,
  schemeTableau10
};
/**
 * D3 Bar Chart
 */

class d3barchart extends d3chart {
  constructor(selection, data, config) {
    super(selection, data, config, {
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
    });
  }
  /**
   * Init chart
   */


  initChart() {
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


  setScales() {
    this.xScale.rangeRound(this.cfg.orientation !== 'horizontal' ? [0, this.cfg.width] : [0, this.cfg.height]).paddingInner(0.1).domain(this.data.map(d => d[this.cfg.key]));
    this.xScaleInn.domain(this.cfg.values).rangeRound([0, this.xScale.bandwidth()]).paddingInner(0.05);
    this.yScale.rangeRound(this.cfg.orientation !== 'horizontal' ? [0, this.cfg.height] : [this.cfg.width, 0]).domain([d3$1.max(this.data, d => d3$1.max(this.cfg.values.map(v => d[v]))), 0]);

    if (this.cfg.color.scheme instanceof Array === true) {
      this.colorScale = d3$1.scaleOrdinal().range(this.cfg.color.scheme);
    } else if (typeof this.cfg.color.scheme === 'string') {
      this.colorScale = d3$1.scaleOrdinal(d3$1[this.cfg.color.scheme]);
    }

    const yGridFunction = this.cfg.orientation !== 'horizontal' ? d3$1.axisLeft(this.yScale).tickSize(-this.cfg.width).ticks(this.cfg.axis.yTicks, this.cfg.axis.yFormat) : d3$1.axisBottom(this.yScale).tickSize(-this.cfg.height).ticks(this.cfg.axis.yTicks, this.cfg.axis.yFormat);
    const xAxisFunction = this.cfg.orientation !== 'horizontal' ? d3$1.axisBottom(this.xScale) : d3$1.axisLeft(this.xScale); // Horizontal grid

    this.yGrid.attr("transform", this.cfg.orientation !== 'horizontal' ? 'translate(0,0)' : `translate(0,${this.cfg.height})`).transition(this.transition).call(yGridFunction); // Bottom axis

    this.xAxis.attr("transform", this.cfg.orientation !== 'horizontal' ? `translate(0,${this.cfg.height})` : 'translate(0,0)').call(xAxisFunction);
  }
  /**
   * Set chart dimensional sizes
   */


  setChartDimension() {
    // SVG element
    this.svg.attr("viewBox", `0 0 ${this.cfg.width + this.cfg.margin.left + this.cfg.margin.right} ${this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom}`).attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right).attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom); // Vertical axis title

    if (this.cfg.axis.yTitle) this.yAxisTitle.attr("y", -this.cfg.margin.left + 10).attr("x", -this.cfg.height / 2).text(this.cfg.axis.yTitle); // Bottom axis label rotation

    if (this.cfg.labelRotation !== 0) this.xAxis.selectAll('text').attr("y", Math.cos(this.cfg.labelRotation * Math.PI / 180) * 9).attr("x", Math.sin(this.cfg.labelRotation * Math.PI / 180) * 9).attr("dy", ".35em").attr("transform", `rotate(${this.cfg.labelRotation})`).style("text-anchor", "start");
  }
  /**
   * Bind data to main elements groups
   */


  bindData() {
    // Set transition
    this.transition = d3$1.transition('t').duration(this.cfg.transition.duration).ease(d3$1[this.cfg.transition.ease]); // Bars groups

    this.itemg = this.g.selectAll('.chart__bar-group').data(this.data, d => d[this.cfg.key]);
  }
  /**
   * Add new chart's elements
   */


  enterElements() {
    const newbars = this.itemg.enter().append('g').attr('class', 'chart__bar-group chart__bar-group--barchart').attr('transform', d => {
      if (this.cfg.orientation !== 'horizontal') {
        return `translate(${this.xScale(d[this.cfg.key])},0)`;
      }

      return `translate(0,${this.xScale(d[this.cfg.key])})`;
    });
    const rects = newbars.selectAll('.chart__bar').data(d => this.cfg.values.map(v => {
      const dat = { ...d
      };
      dat[this.cfg.key] = d[this.cfg.key];
      return dat;
    })).enter().append('rect').attr('class', 'chart__bar chart__bar--barchart').classed('chart__bar--current', d => {
      return this.cfg.currentKey && d[this.cfg.key] === this.cfg.currentKey;
    }).attr('x', (d, i) => {
      return this.cfg.orientation !== 'horizontal' ? this.xScaleInn(this.cfg.values[i % this.cfg.values.length]) : 0;
    }).attr('y', (d, i) => {
      return this.cfg.orientation !== 'horizontal' ? this.cfg.height : this.xScaleInn(this.cfg.values[i % this.cfg.values.length]);
    }).attr('height', 0).attr('width', 0).on('mouseover', (d, i) => {
      const key = this.cfg.values[i % this.cfg.values.length];
      this.tooltip.html(() => {
        return `<div>${key}: ${d[key]}</div>`;
      }).classed('active', true);
    }).on('mouseout', () => {
      this.tooltip.classed('active', false);
    }).on('mousemove', () => {
      this.tooltip.style('left', window.event['pageX'] - 28 + 'px').style('top', window.event['pageY'] - 40 + 'px');
    });
  }
  /**
   * Update chart's elements based on data change
   */


  updateElements() {
    // Bars groups
    this.itemg.transition(this.transition).attr('transform', d => {
      return this.cfg.orientation !== 'horizontal' ? `translate(${this.xScale(d[this.cfg.key])},0)` : `translate(0,${this.xScale(d[this.cfg.key])})`;
    }); // Bars

    this.g.selectAll('.chart__bar').transition(this.transition).attr('fill', (d, i) => this.colorElement(d, this.cfg.values[i % this.cfg.values.length])).attr('x', (d, i) => {
      return this.cfg.orientation !== 'horizontal' ? this.xScaleInn(this.cfg.values[i % this.cfg.values.length]) : 0;
    }).attr('y', (d, i) => {
      return this.cfg.orientation !== 'horizontal' ? this.yScale(+d[this.cfg.values[i % this.cfg.values.length]]) : this.xScaleInn(this.cfg.values[i % this.cfg.values.length]);
    }).attr('width', (d, i) => {
      return this.cfg.orientation !== 'horizontal' ? this.xScaleInn.bandwidth() : this.yScale(+d[this.cfg.values[i % this.cfg.values.length]]);
    }).attr('height', (d, i) => {
      return this.cfg.orientation !== 'horizontal' ? this.cfg.height - this.yScale(+d[this.cfg.values[i % this.cfg.values.length]]) : this.xScaleInn.bandwidth();
    });
  }
  /**
   * Remove chart's elements without data
   */


  exitElements() {
    this.itemg.exit().transition(this.transition).style("opacity", 0).remove();
  }

}

var script$1 = {
  name: 'D3BarChart',
  extends: __vue_component__,

  mounted() {
    this.chart = new d3barchart(this.$refs.chart, JSON.parse(JSON.stringify(this.datum)), this.config);
  }

};

/* script */
const __vue_script__$1 = script$1;
/* template */

/* style */

const __vue_inject_styles__$1 = undefined;
/* scoped */

const __vue_scope_id__$1 = undefined;
/* module identifier */

const __vue_module_identifier__$1 = undefined;
/* functional template */

const __vue_is_functional_template__$1 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$1 = normalizeComponent({}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, undefined, undefined, undefined);

const d3$2 = {
  select,
  selectAll,
  scaleOrdinal,
  scaleLinear,
  scaleTime,
  timeParse,
  timeFormat,
  max,
  extent,
  line,
  transition,
  axisLeft,
  axisBottom,
  easeLinear,
  easePolyIn,
  easePolyOut,
  easePoly,
  easePolyInOut,
  easeQuadIn,
  easeQuadOut,
  easeQuad,
  easeQuadInOut,
  easeCubicIn,
  easeCubicOut,
  easeCubic,
  easeCubicInOut,
  easeSinIn,
  easeSinOut,
  easeSin,
  easeSinInOut,
  easeExpIn,
  easeExpOut,
  easeExp,
  easeExpInOut,
  easeCircleIn,
  easeCircleOut,
  easeCircle,
  easeCircleInOut,
  easeElasticIn,
  easeElastic,
  easeElasticOut,
  easeElasticInOut,
  easeBackIn,
  easeBackOut,
  easeBack,
  easeBackInOut,
  easeBounceIn,
  easeBounce,
  easeBounceOut,
  easeBounceInOut,
  curveBasis,
  curveBundle,
  curveCardinal,
  curveCatmullRom,
  curveLinear,
  curveMonotoneX,
  curveMonotoneY,
  curveNatural,
  curveStep,
  curveStepAfter,
  curveStepBefore,
  schemeCategory10,
  schemeAccent,
  schemeDark2,
  schemePaired,
  schemePastel1,
  schemePastel2,
  schemeSet1,
  schemeSet2,
  schemeSet3,
  schemeTableau10
};
/**
 * D3 Line Chart
 */

class d3linechart extends d3chart {
  constructor(selection, data, config) {
    super(selection, data, config, {
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
    });
  }
  /**
  * Init chart
  */


  initChart() {
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


  computeData() {
    // Calcule transpose data
    const tData = [];
    this.cfg.values.forEach((j, i) => {
      tData[i] = {};
      tData[i].key = j;
      tData[i].values = [];
    });
    this.data.forEach(d => {
      d.jsdate = this.parseTime(d[this.cfg.date.key]);
    });
    this.data.sort((a, b) => a.jsdate - b.jsdate);
    this.data.forEach((d, c) => {
      d.min = 9999999999999999999;
      d.max = -9999999999999999999;
      this.cfg.values.forEach((j, i) => {
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


  setChartDimension() {
    // Resize SVG element
    this.svg.attr("viewBox", `0 0 ${this.cfg.width + this.cfg.margin.left + this.cfg.margin.right} ${this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom}`).attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right).attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom); // Vertical axis title

    if (this.cfg.axis.yTitle) this.yAxisTitle.attr("y", -this.cfg.margin.left + 10).attr("x", -this.cfg.height / 2).text(this.cfg.axis.yTitle);
  }
  /**
   * Set up scales
   */


  setScales() {
    // Calcule vertical scale
    this.yScale.domain([0, d3$2.max(this.data, d => d.max)]).rangeRound([this.cfg.height, 0]); // Calcule horizontal scale

    this.xScale.domain(d3$2.extent(this.data, d => d.jsdate)).rangeRound([0, this.cfg.width]);

    if (this.cfg.color.scheme instanceof Array === true) {
      this.colorScale = d3$2.scaleOrdinal().range(this.cfg.color.scheme);
    } else if (typeof this.cfg.color.scheme === 'string') {
      this.colorScale = d3$2.scaleOrdinal(d3$2[this.cfg.color.scheme]);
    } // Set up line function


    this.line.x(d => this.xScale(d.x)).y(d => this.yScale(d.y)).curve(d3$2[this.cfg.curve]); // Redraw grid

    this.yGrid.call(d3$2.axisLeft(this.yScale).tickSize(-this.cfg.width).ticks(this.cfg.axis.yTicks, this.cfg.axis.yFormat)); // Redraw horizontal axis

    this.xAxis.attr("transform", `translate(0,${this.cfg.height})`).call(d3$2.axisBottom(this.xScale).tickFormat(this.formatTime).ticks(this.cfg.axis.xTicks, this.cfg.axis.xFormat));
  }
  /**
   * Bind data to main elements groups
   */


  bindData() {
    // Set transition
    this.transition = d3$2.transition('t').duration(this.cfg.transition.duration).ease(d3$2[this.cfg.transition.ease]); // Lines group

    this.linesgroup = this.g.selectAll(".chart__lines-group").data(this.tData, d => d.key); // Don't continue if points are disabled

    if (this.cfg.points === false) return; // Set points store

    if (!this.pointsg || this.pointsg instanceof Array === false) {
      this.pointsg = [];
    }
  }
  /**
   * Add new chart's elements
   */


  enterElements() {
    // Elements to add
    const newgroups = this.linesgroup.enter().append('g').attr("class", "chart__lines-group chart__lines-group--linechart"); // Lines

    newgroups.append('path').attr("class", "chart__line chart__line--linechart").attr('fill', 'transparent').attr("d", d => this.line(d.values.map(v => ({
      y: 0,
      x: v.x,
      k: v.k
    })))); // Don't continue if points are disabled

    if (this.cfg.points === false) return;
    this.cfg.values.forEach((k, i) => {
      // Point group
      let gp = this.g.selectAll('.chart__points-group--' + k).data(this.data).enter().append('g').attr('class', 'chart__points-group chart__points-group--linechart chart__points-group--' + k).attr('transform', d => `translate(${this.xScale(d.jsdate)},${this.cfg.height})`); // Hover point

      gp.append('circle').attr('class', 'chart__point-hover chart__point-hover--linechart').attr('fill', 'transparent').attr('r', this.cfg.points.hoverSize).on('mouseover', (d, j) => {
        this.tooltip.html(_ => {
          const label = this.cfg.tooltip.labels && this.cfg.tooltip.labels[i] ? this.cfg.tooltip.labels[i] : k;
          return `
                            <div>${label}: ${this.tData[i].values[j].y}</div>
                        `;
        }).classed('active', true);
      }).on('mouseout', _ => {
        this.tooltip.classed('active', false);
      }).on('mousemove', _ => {
        this.tooltip.style('left', window.event['pageX'] - 28 + 'px').style('top', window.event['pageY'] - 40 + 'px');
      }); // Visible point

      gp.append('circle').attr('class', 'chart__point-visible chart__point-visible--linechart').attr('pointer-events', 'none');
      this.pointsg.push({
        selection: gp,
        key: k
      });
    });
  }
  /**
   * Update chart's elements based on data change
   */


  updateElements() {
    // Color lines
    this.linesgroup.attr('stroke', d => this.colorElement(d, 'key')); // Redraw lines

    this.g.selectAll('.chart__line').attr('stroke', d => this.colorElement(d, 'key')).transition(this.transition).attr("d", (d, i) => this.line(this.tData[i].values)); // Don't continue if points are disabled

    if (this.cfg.points === false) return; // Redraw points

    this.pointsg.forEach((p, i) => {
      p.selection.transition(this.transition).attr('transform', d => `translate(${this.xScale(d.jsdate)},${this.yScale(d[p.key])})`); // Visible point

      p.selection.selectAll('.chart__point-visible').attr('fill', d => this.colorElement(p, 'key')).attr('r', this.cfg.points.visibleSize); // Hover point

      p.selection.selectAll('.chart__point-hover').attr('r', this.cfg.points.hoverSize);
    });
  }
  /**
   * Remove chart's elements without data
   */


  exitElements() {
    this.linesgroup.exit().transition(this.transition).style("opacity", 0).remove();
  }

}

var script$2 = {
  name: 'D3LineChart',
  extends: __vue_component__,

  mounted() {
    this.chart = new d3linechart(this.$refs.chart, JSON.parse(JSON.stringify(this.datum)), this.config);
  }

};

/* script */
const __vue_script__$2 = script$2;
/* template */

/* style */

const __vue_inject_styles__$2 = undefined;
/* scoped */

const __vue_scope_id__$2 = undefined;
/* module identifier */

const __vue_module_identifier__$2 = undefined;
/* functional template */

const __vue_is_functional_template__$2 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$2 = normalizeComponent({}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, undefined, undefined, undefined);

const d3$3 = {
  select,
  selectAll,
  scaleLinear,
  scaleOrdinal,
  max,
  min,
  transition,
  pie,
  arc,
  interpolate,
  easeLinear,
  easePolyIn,
  easePolyOut,
  easePoly,
  easePolyInOut,
  easeQuadIn,
  easeQuadOut,
  easeQuad,
  easeQuadInOut,
  easeCubicIn,
  easeCubicOut,
  easeCubic,
  easeCubicInOut,
  easeSinIn,
  easeSinOut,
  easeSin,
  easeSinInOut,
  easeExpIn,
  easeExpOut,
  easeExp,
  easeExpInOut,
  easeCircleIn,
  easeCircleOut,
  easeCircle,
  easeCircleInOut,
  easeElasticIn,
  easeElastic,
  easeElasticOut,
  easeElasticInOut,
  easeBackIn,
  easeBackOut,
  easeBack,
  easeBackInOut,
  easeBounceIn,
  easeBounce,
  easeBounceOut,
  easeBounceInOut,
  schemeCategory10,
  schemeAccent,
  schemeDark2,
  schemePaired,
  schemePastel1,
  schemePastel2,
  schemeSet1,
  schemeSet2,
  schemeSet3,
  schemeTableau10
};
/**
* D3 Pie Chart
*/

class d3piechart extends d3chart {
  constructor(selection, data, config) {
    super(selection, data, config, {
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
    });
  }
  /**
  * Init chart
  */


  initChart() {
    // Set up dimensions
    this.getDimensions();
    this.initChartFrame('piechart');
    this.cScale = d3$3.scaleOrdinal();
    this.arc = d3$3.arc();
    this.outerArc = d3$3.arc();
    this.pie = d3$3.pie().sort(null).value(d => d[this.cfg.value]).padAngle(this.cfg.radius.padding);

    if (this.cfg.radius && this.cfg.radius.inner) {
      const outRadius = this.cfg.radius.outter ? this.cfg.radius.outter : Math.min(this.cfg.width, this.cfg.height) / 2;
      this.cfg.radius.relation = this.cfg.radius.inner ? this.cfg.radius.inner / outRadius : 0;
    }

    this.gcenter = this.g.append('g');
    this.setChartDimension();
    this.updateChart();
  }
  /**
  * Set up chart dimensions (non depending on data)
  */


  setChartDimension() {
    // SVG element
    this.svg.attr("viewBox", `0 0 ${this.cfg.width + this.cfg.margin.left + this.cfg.margin.right} ${this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom}`).attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right).attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom); // Center element

    this.gcenter.attr('transform', `translate(${this.cfg.width / 2}, ${this.cfg.height / 2})`);
  }
  /**
  * Bind data to main elements groups
  */


  bindData() {
    this.itemg = this.gcenter.selectAll('.chart__slice-group').data(this.pie(this.data), d => d.data[this.cfg.key]); // Set transition

    this.transition = d3$3.transition('t').duration(this.cfg.transition.duration).ease(d3$3[this.cfg.transition.ease]);
  }
  /**
  * Set up scales
  */


  setScales() {
    // Set up radius
    this.cfg.radius.outter = this.cfg.radius && this.cfg.radius.outter ? this.cfg.radius.outter : Math.min(this.cfg.width, this.cfg.height) / 2;
    let inRadius = this.cfg.radius && this.cfg.radius.inner ? this.cfg.radius.inner : 0;

    if (this.cfg.radius.relation) {
      inRadius = this.cfg.radius.outter * this.cfg.radius.relation;
    } // Set up arcs


    this.arc = d3$3.arc().outerRadius(this.cfg.radius.outter).innerRadius(inRadius).cornerRadius(this.cfg.radius.round);
    this.outerArc = d3$3.arc().outerRadius(this.cfg.radius.outter * 1.1).innerRadius(this.cfg.radius.outter * 1.1); // Set up color scheme

    if (this.cfg.color.scheme) {
      if (this.cfg.color.scheme instanceof Array === true) {
        this.colorScale = d3$3.scaleOrdinal().domain(this.data.map(d => d[this.cfg.key])).range(this.cfg.color.scheme);
      } else {
        this.colorScale = d3$3.scaleOrdinal(d3$3[this.cfg.color.scheme]).domain(this.data.map(d => d[this.cfg.key]));
      }
    }
  }
  /**
  * Add new chart's elements
  */


  enterElements() {
    const newg = this.itemg.enter().append('g').attr("class", "chart__slice-group chart__slice-group--piechart"); // PATHS

    newg.append("path").attr("class", "chart__slice chart__slice--piechart").transition(this.transition).delay((d, i) => i * this.cfg.transition.duration).attrTween('d', d => {
      const i = d3$3.interpolate(d.startAngle + 0.1, d.endAngle);
      return t => {
        d.endAngle = i(t);
        return this.arc(d);
      };
    }).style("fill", d => this.colorElement(d.data)).style('opacity', 1); // LABELS

    newg.append('text').attr("class", "chart__label chart__label--piechart").style('opacity', 0).attr("transform", d => {
      let pos = this.outerArc.centroid(d);
      pos[0] = this.cfg.radius.outter * (this.midAngle(d) < Math.PI ? 1.1 : -1.1);
      return "translate(" + pos + ")";
    }).attr('text-anchor', d => this.midAngle(d) < Math.PI ? 'start' : 'end').text(d => d.data[this.cfg.key]).transition(this.transition).delay((d, i) => i * this.cfg.transition.duration).style('opacity', 1); // LINES

    newg.append('polyline').attr("class", "chart__line chart__line--piechart").style('opacity', 0).attr('points', d => {
      let pos = this.outerArc.centroid(d);
      pos[0] = this.cfg.radius.outter * 0.95 * (this.midAngle(d) < Math.PI ? 1.1 : -1.1);
      return [this.arc.centroid(d), this.outerArc.centroid(d), pos];
    }).transition(this.transition).delay((d, i) => i * this.cfg.transition.duration).style('opacity', 1);
  }
  /**
  * Update chart's elements based on data change
  */


  updateElements() {
    // PATHS
    this.itemg.selectAll(".chart__slice").style('opacity', 0).data(this.pie(this.data), d => d.data[this.cfg.key]).transition(this.transition).delay((d, i) => i * this.cfg.transition.duration).attrTween('d', d => {
      const i = d3$3.interpolate(d.startAngle + 0.1, d.endAngle);
      return t => {
        d.endAngle = i(t);
        return this.arc(d);
      };
    }).style("fill", d => this.colorElement(d.data)).style('opacity', 1); // LABELS

    this.itemg.selectAll(".chart__label").data(this.pie(this.data), d => d.data[this.cfg.key]).text(d => d.data[this.cfg.key]).transition(this.transition).attr("transform", d => {
      let pos = this.outerArc.centroid(d);
      pos[0] = this.cfg.radius.outter * (this.midAngle(d) < Math.PI ? 1.1 : -1.1);
      return "translate(" + pos + ")";
    }).attr('text-anchor', d => this.midAngle(d) < Math.PI ? 'start' : 'end'); // LINES

    this.itemg.selectAll(".chart__line").data(this.pie(this.data), d => d.data[this.cfg.key]).transition(this.transition).attr('points', d => {
      let pos = this.outerArc.centroid(d);
      pos[0] = this.cfg.radius.outter * 0.95 * (this.midAngle(d) < Math.PI ? 1.1 : -1.1);
      return [this.arc.centroid(d), this.outerArc.centroid(d), pos];
    });
  }
  /**
  * Remove chart's elements without data
  */


  exitElements() {
    this.itemg.exit().transition(this.transition).style("opacity", 0).remove();
  }

  midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }
  /**
  * Store the displayed angles in _current.
  * Then, interpolate from _current to the new angles.
  * During the transition, _current is updated in-place by d3.interpolate.
  */


  arcTween(a) {
    var i = d3$3.interpolate(this._current, a);
    this._current = i(0);
    return t => this.arc(i(t));
  }

}

var script$3 = {
  name: 'D3PieChart',
  extends: __vue_component__,

  mounted() {
    this.chart = new d3piechart(this.$refs.chart, JSON.parse(JSON.stringify(this.datum)), this.config);
  }

};

/* script */
const __vue_script__$3 = script$3;
/* template */

/* style */

const __vue_inject_styles__$3 = function (inject) {
  if (!inject) return;
  inject("data-v-ac66c84e_0", {
    source: ".chart__wrapper{margin:20px 0}.chart__wrap{margin:0}.chart__title{text-align:center;font-weight:700}.chart__source{font-size:12px}.chart__tooltip{position:absolute;pointer-events:none;display:none}.chart__tooltip.active{display:block}.chart__tooltip>div{background:#2b2b2b;color:#fff;padding:6px 10px;border-radius:3px}.chart__axis{font-size:12px;shape-rendering:crispEdges}.chart__grid .domain{stroke:none;fill:none}.chart__grid .tick line{opacity:.2}.chart__label{font-size:12px}.chart .clickable{cursor:pointer}.chart--piechart .chart__line{fill:none;stroke:#000}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__$3 = undefined;
/* module identifier */

const __vue_module_identifier__$3 = undefined;
/* functional template */

const __vue_is_functional_template__$3 = undefined;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$3 = normalizeComponent({}, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, false, createInjector, undefined, undefined);

const d3$4 = {
  select,
  selectAll,
  scaleLinear,
  scaleOrdinal,
  max,
  min,
  transition,
  easeLinear,
  easePolyIn,
  easePolyOut,
  easePoly,
  easePolyInOut,
  easeQuadIn,
  easeQuadOut,
  easeQuad,
  easeQuadInOut,
  easeCubicIn,
  easeCubicOut,
  easeCubic,
  easeCubicInOut,
  easeSinIn,
  easeSinOut,
  easeSin,
  easeSinInOut,
  easeExpIn,
  easeExpOut,
  easeExp,
  easeExpInOut,
  easeCircleIn,
  easeCircleOut,
  easeCircle,
  easeCircleInOut,
  easeElasticIn,
  easeElastic,
  easeElasticOut,
  easeElasticInOut,
  easeBackIn,
  easeBackOut,
  easeBack,
  easeBackInOut,
  easeBounceIn,
  easeBounce,
  easeBounceOut,
  easeBounceInOut,
  schemeCategory10,
  schemeAccent,
  schemeDark2,
  schemePaired,
  schemePastel1,
  schemePastel2,
  schemeSet1,
  schemeSet2,
  schemeSet3,
  schemeTableau10
};
/**
* D3 Slope Chart
*/

class d3slopechart extends d3chart {
  constructor(selection, data, config) {
    super(selection, data, config, {
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
    });
  }
  /**
  * Init chart
  */


  initChart() {
    // Set up dimensions
    this.getDimensions();
    this.initChartFrame('slopechart'); // Set up scales

    this.yScale = d3$4.scaleLinear(); // Axis group

    const axisg = this.g.append('g').attr('class', 'chart__axis chart__axis--slopechart'); // Vertical left axis

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


  setChartDimension() {
    // SVG element
    this.svg.attr("viewBox", `0 0 ${this.cfg.width + this.cfg.margin.left + this.cfg.margin.right} ${this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom}`).attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right).attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom); // Vertical left axis position

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


  setScales() {
    // Set up dimensional scales
    this.yScale.rangeRound([this.cfg.height, 0]).domain([d3$4.min(this.data, d => d[this.cfg.values[0]] < d[this.cfg.values[1]] ? d[this.cfg.values[0]] * 0.9 : d[this.cfg.values[1]] * 0.9), d3$4.max(this.data, d => d[this.cfg.values[0]] > d[this.cfg.values[1]] ? d[this.cfg.values[0]] * 1.1 : d[this.cfg.values[1]] * 1.1)]); // Set up color scheme

    if (this.cfg.color.scheme) {
      if (this.cfg.color.scheme instanceof Array === true) {
        this.colorScale = d3$4.scaleOrdinal().domain(this.data.map(d => d[this.cfg.key])).range(this.cfg.color.scheme);
      } else {
        this.colorScale = d3$4.scaleOrdinal(d3$4[this.cfg.color.scheme]).domain(this.data.map(d => d[this.cfg.key]));
      }
    }
  }
  /**
  * Bind data to main elements groups
  */


  bindData() {
    // Lines group selection data
    this.linesgroup = this.g.selectAll(".chart__lines-group").data(this.data, d => d[this.cfg.key]); // Set transition

    this.transition = d3$4.transition('t').duration(this.cfg.transition.duration).ease(d3$4[this.cfg.transition.ease]);
  }
  /**
  * Add new chart's elements
  */


  enterElements() {
    // Elements to add
    const newlines = this.linesgroup.enter().append('g').attr("class", "chart__lines-group chart__lines-group--slopechart"); // Lines to add

    newlines.append('line').attr("class", "chart__line chart__line--slopechart").classed('chart__line--current', d => this.cfg.currentKey && d[this.cfg.key] == this.cfg.currentKey).attr('stroke', d => this.colorElement(d)).style("opacity", this.cfg.opacity).attr("x1", 0).attr("x2", this.cfg.width).transition(this.transition).attr("y1", d => this.yScale(d[this.cfg.values[0]])).attr("y2", d => this.yScale(d[this.cfg.values[1]])); // Vertical left axis points group to add

    const gstart = newlines.append('g').attr('class', 'chart__points-group chart__points-group--slopechart chart__points-group--start');
    gstart.transition(this.transition).attr('transform', d => 'translate(0,' + this.yScale(d[this.cfg.values[0]]) + ')'); // Vertical left axis points to add

    gstart.append('circle').attr('class', 'chart__point chart__point--slopechart chart__point--start').attr('fill', d => this.colorElement(d)).attr('r', this.cfg.points.visibleRadius); // Vertical left axis label to add

    gstart.append('text').attr('class', 'chart__label chart__label--slopechart chart__label--start').attr('text-anchor', 'end').attr('y', 3).attr('x', -5).text(d => d[this.cfg.key] + ' ' + d[this.cfg.values[0]]); // Vertical right axis points group to add

    const gend = newlines.append('g').attr('class', 'chart__points-group chart__points-group--slopechart chart__points-group--end').attr('transform', 'translate(' + this.cfg.width + ',0)');
    gend.transition(this.transition).attr('transform', d => 'translate(' + this.cfg.width + ',' + this.yScale(d[this.cfg.values[1]]) + ')'); // Vertical right axis points to add

    gend.append('circle').attr('class', 'chart__point chart__point--slopechart chart__point--end').attr('fill', d => this.colorElement(d)).attr('r', this.cfg.points.visibleRadius); // Vertical right axis label to add

    gend.append('text').attr('class', 'chart__label chart__label--slopechart chart__label--end').attr('text-anchor', 'start').attr('y', 3).attr('x', 5).text(d => d[this.cfg.values[1]] + '  ' + d[this.cfg.key]);
  }
  /**
  * Update chart's elements based on data change
  */


  updateElements() {
    // Lines to modify
    this.linesgroup.selectAll('.chart__line').data(this.data, d => d[this.cfg.key]).transition(this.transition).attr("x1", 0).attr("x2", this.cfg.width).attr("y1", d => this.yScale(d[this.cfg.values[0]])).attr("y2", d => this.yScale(d[this.cfg.values[1]])); // Left axis points to modify

    this.linesgroup.selectAll('.chart__points-group--start').data(this.data, d => d[this.cfg.key]).transition(this.transition).attr('transform', d => 'translate(0,' + this.yScale(d[this.cfg.values[0]]) + ')'); // Left axis labels to modify

    this.linesgroup.selectAll('.chart__label--start').data(this.data, d => d[this.cfg.key]).text(d => {
      return d[this.cfg.key] + ' ' + d[this.cfg.values[0]];
    }); // Right axis points to modify

    this.linesgroup.selectAll('.chart__points-group--end').data(this.data, d => d[this.cfg.key]).transition(this.transition).attr('transform', d => 'translate(' + this.cfg.width + ',' + this.yScale(d[this.cfg.values[1]]) + ')'); // Right axis labels to modify

    this.linesgroup.selectAll('.chart__label--end').data(this.data, d => d[this.cfg.key]).text(d => d[this.cfg.values[1]] + '  ' + d[this.cfg.key]);
  }
  /**
  * Remove chart's elements without data
  */


  exitElements() {
    this.linesgroup.exit().transition(this.transition).style("opacity", 0).remove();
  }

}

var script$4 = {
  name: 'D3SlopeChart',
  extends: __vue_component__,

  mounted() {
    this.chart = new d3slopechart(this.$refs.chart, JSON.parse(JSON.stringify(this.datum)), this.config);
  }

};

/* script */
const __vue_script__$4 = script$4;
/* template */

/* style */

const __vue_inject_styles__$4 = function (inject) {
  if (!inject) return;
  inject("data-v-6b03ba8c_0", {
    source: ".chart__wrapper{margin:20px 0}.chart__wrap{margin:0}.chart__title{text-align:center;font-weight:700}.chart__source{font-size:12px}.chart__tooltip{position:absolute;pointer-events:none;display:none}.chart__tooltip.active{display:block}.chart__tooltip>div{background:#2b2b2b;color:#fff;padding:6px 10px;border-radius:3px}.chart__axis{font-size:12px;shape-rendering:crispEdges}.chart__grid .domain{stroke:none;fill:none}.chart__grid .tick line{opacity:.2}.chart__label{font-size:12px}.chart .clickable{cursor:pointer}.chart--slopegraph .chart__line--current{stroke-width:2px}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__$4 = undefined;
/* module identifier */

const __vue_module_identifier__$4 = undefined;
/* functional template */

const __vue_is_functional_template__$4 = undefined;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$4 = normalizeComponent({}, __vue_inject_styles__$4, __vue_script__$4, __vue_scope_id__$4, __vue_is_functional_template__$4, __vue_module_identifier__$4, false, createInjector, undefined, undefined);

const d3$5 = {
  select,
  selectAll,
  scaleLinear,
  scaleOrdinal,
  scaleSqrt,
  hierarchy,
  partition,
  arc,
  transition,
  interpolate,
  easeLinear,
  easePolyIn,
  easePolyOut,
  easePoly,
  easePolyInOut,
  easeQuadIn,
  easeQuadOut,
  easeQuad,
  easeQuadInOut,
  easeCubicIn,
  easeCubicOut,
  easeCubic,
  easeCubicInOut,
  easeSinIn,
  easeSinOut,
  easeSin,
  easeSinInOut,
  easeExpIn,
  easeExpOut,
  easeExp,
  easeExpInOut,
  easeCircleIn,
  easeCircleOut,
  easeCircle,
  easeCircleInOut,
  easeElasticIn,
  easeElastic,
  easeElasticOut,
  easeElasticInOut,
  easeBackIn,
  easeBackOut,
  easeBack,
  easeBackInOut,
  easeBounceIn,
  easeBounce,
  easeBounceOut,
  easeBounceInOut,
  schemeCategory10,
  schemeAccent,
  schemeDark2,
  schemePaired,
  schemePastel1,
  schemePastel2,
  schemeSet1,
  schemeSet2,
  schemeSet3,
  schemeTableau10
};
/**
* D3 Sunburst
*/

class d3sunburst extends d3chart {
  constructor(selection, data, config) {
    super(selection, data, config, {
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
    });
  }
  /**
  * Init chart
  */


  initChart() {
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


  setChartDimension() {
    // SVG element
    this.svg.attr("viewBox", `0 0 ${this.cfg.width + this.cfg.margin.left + this.cfg.margin.right} ${this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom}`).attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right).attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom); // Center group

    this.gcenter.attr('transform', `translate(${this.cfg.width / 2}, ${this.cfg.height / 2})`);
  }
  /**
  * Bind data to main elements groups
  */


  bindData() {
    const partition = data => {
      const root = d3$5.hierarchy(data).sum(d => d[this.cfg.value]);
      return d3$5.partition()(root);
    };

    this.hData = partition(this.data[0]).descendants();
    this.itemg = this.gcenter.selectAll('.chart__slice-group').data(this.hData, d => d.data[this.cfg.key]); // Set transition

    this.transition = d3$5.transition('t').duration(this.cfg.transition.duration).ease(d3$5[this.cfg.transition.ease]);
  }
  /**
  * Set up scales
  */


  setScales() {
    this.radius = Math.min(this.cfg.width, this.cfg.height) / 2;
    this.xScale = d3$5.scaleLinear().range([0, 2 * Math.PI]).clamp(true);
    this.yScale = d3$5.scaleSqrt().range([this.radius * .1, this.radius]);
    this.arc = d3$5.arc().startAngle(d => this.xScale(d.x0)).endAngle(d => this.xScale(d.x1)).innerRadius(d => Math.max(0, this.yScale(d.y0))).outerRadius(d => Math.max(0, this.yScale(d.y1))); // Set up color scheme

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


  enterElements() {
    const newg = this.itemg.enter().append('g').attr("class", "chart__slice-group chart__slice-group--sunburst clickable").on('click', d => {
      window.event.stopPropagation();
      this.focusOn(d);
    }); // PATHS

    newg.append("path").attr("class", "chart__slice chart__slice--sunburst").style("fill", d => this.colorElement(d.data)).on('mouseover', d => {
      this.tooltip.html(() => {
        return `<div>${d.data[this.cfg.key]}: ${d.value}</div>`;
      }).classed('active', true);
    }).on('mouseout', () => {
      this.tooltip.classed('active', false);
    }).on('mousemove', () => {
      this.tooltip.style('left', window.event['pageX'] - 28 + 'px').style('top', window.event['pageY'] - 40 + 'px');
    }).transition(this.transition).attrTween('d', d => {
      const iy0 = d3$5.interpolate(0, d.y0);
      const iy1 = d3$5.interpolate(d.y0, d.y1);
      const ix0 = d3$5.interpolate(0, d.x0);
      const ix1 = d3$5.interpolate(0, d.x1);
      return t => {
        d.y0 = iy0(t);
        d.y1 = iy1(t);
        d.x0 = ix0(t);
        d.x1 = ix1(t);
        return this.arc(d);
      };
    });
  }
  /**
  * Update chart's elements based on data change
  */


  updateElements() {
    this.itemg.selectAll('.chart__slice').transition(this.transition).attrTween('d', d => {
      const d2 = this.hData.filter(j => j.data.name === d.data.name)[0];
      const iy0 = d3$5.interpolate(d.y0, d2.y0);
      const iy1 = d3$5.interpolate(d.y1, d2.y1);
      const ix0 = d3$5.interpolate(d.x0, d2.x0);
      const ix1 = d3$5.interpolate(d.x1, d2.x1);
      return t => {
        d2.y0 = iy0(t);
        d2.y1 = iy1(t);
        d2.x0 = ix0(t);
        d2.x1 = ix1(t);
        return this.arc(d2);
      };
    }).style("fill", d => this.colorElement(d.data));
  }
  /**
  * Remove chart's elements without data
  */


  exitElements() {
    this.itemg.exit().transition(this.transition).style("opacity", 0).remove();
  }
  /**
  * Check if text fits in available space
  */


  textFits(d) {
    const deltaAngle = this.xScale(d.x1) - this.xScale(d.x0);
    const r = Math.max(0, (this.yScale(d.y0) + this.yScale(d.y1)) / 2);
    return d.data[this.cfg.key].length * this.cfg.charSpace < r * deltaAngle;
  }
  /**
  * Transition slice on focus
  */


  focusOn(d) {
    const d2 = this.hData.filter(j => j.data.name === d.data.name)[0];
    const transition = this.svg.transition().duration(this.cfg.transition.duration).ease(d3$5[this.cfg.transition.ease]).tween('scale', () => {
      const xd = d3$5.interpolate(this.xScale.domain(), [d2.x0, d2.x1]);
      const yd = d3$5.interpolate(this.yScale.domain(), [d2.y0, 1]);
      return t => {
        this.xScale.domain(xd(t));
        this.yScale.domain(yd(t));
      };
    });
    transition.selectAll('.chart__slice').attrTween('d', d => () => {
      const d3 = this.hData.filter(j => j.data.name === d.data.name)[0];
      return this.arc(d3);
    });
  }

}

var script$5 = {
  name: 'D3Sunburst',
  extends: __vue_component__,

  mounted() {
    this.chart = new d3sunburst(this.$refs.chart, JSON.parse(JSON.stringify(this.datum)), this.config);
  }

};

/* script */
const __vue_script__$5 = script$5;
/* template */

/* style */

const __vue_inject_styles__$5 = undefined;
/* scoped */

const __vue_scope_id__$5 = undefined;
/* module identifier */

const __vue_module_identifier__$5 = undefined;
/* functional template */

const __vue_is_functional_template__$5 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$5 = normalizeComponent({}, __vue_inject_styles__$5, __vue_script__$5, __vue_scope_id__$5, __vue_is_functional_template__$5, __vue_module_identifier__$5, false, undefined, undefined, undefined);

const d3$6 = {
  select,
  selectAll,
  scaleOrdinal,
  scaleLinear,
  max,
  extent,
  transition,
  cloud,
  easeLinear,
  easePolyIn,
  easePolyOut,
  easePoly,
  easePolyInOut,
  easeQuadIn,
  easeQuadOut,
  easeQuad,
  easeQuadInOut,
  easeCubicIn,
  easeCubicOut,
  easeCubic,
  easeCubicInOut,
  easeSinIn,
  easeSinOut,
  easeSin,
  easeSinInOut,
  easeExpIn,
  easeExpOut,
  easeExp,
  easeExpInOut,
  easeCircleIn,
  easeCircleOut,
  easeCircle,
  easeCircleInOut,
  easeElasticIn,
  easeElastic,
  easeElasticOut,
  easeElasticInOut,
  easeBackIn,
  easeBackOut,
  easeBack,
  easeBackInOut,
  easeBounceIn,
  easeBounce,
  easeBounceOut,
  easeBounceInOut,
  schemeCategory10,
  schemeAccent,
  schemeDark2,
  schemePaired,
  schemePastel1,
  schemePastel2,
  schemeSet1,
  schemeSet2,
  schemeSet3,
  schemeTableau10
};
/**
 * D3 Words Cloud
 */

class d3wordscloud extends d3chart {
  constructor(selection, data, config) {
    super(selection, data, config, {
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
    });
  }
  /**
  * Init chart
  */


  initChart() {
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


  computeData() {
    let layout = d3$6.cloud().size([this.cfg.width, this.cfg.height]).words(this.data.map(d => ({
      text: d[this.cfg.key],
      size: d[this.cfg.value]
    }))).rotate(() => this.wordsAngle(this.cfg.angle)).font(this.cfg.fontFamily).fontSize(d => d.size).on("end", d => {
      this.tData = d;
    }).start();
  }
  /**
   * Set up chart dimensions (non depending on data)
   */


  setChartDimension() {
    // Resize SVG element
    this.svg.attr("viewBox", `0 0 ${this.cfg.width + this.cfg.margin.left + this.cfg.margin.right} ${this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom}`).attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right).attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom); // Center element

    this.gcenter.attr('transform', `translate(${this.cfg.width / 2}, ${this.cfg.height / 2})`);
  }
  /**
   * Bind data to main elements groups
   */


  bindData() {
    // Set transition
    this.transition = d3$6.transition('t').duration(this.cfg.transition.duration).ease(d3$6[this.cfg.transition.ease]); // Word group selection data

    this.wordgroup = this.gcenter.selectAll(".chart__word-group").data(this.tData, d => d.text);
  }
  /**
   * Set up scales
   */


  setScales() {
    if (this.cfg.color.scheme instanceof Array === true) {
      this.colorScale = d3$6.scaleOrdinal().range(this.cfg.color.scheme);
    } else if (typeof this.cfg.color.scheme === 'string') {
      this.colorScale = d3$6.scaleOrdinal(d3$6[this.cfg.color.scheme]);
    }
  }
  /**
   * Add new chart's elements
   */


  enterElements() {
    // Elements to add
    const newwords = this.wordgroup.enter().append('g').attr("class", "chart__word-group chart__word-group--wordscloud");
    newwords.append("text").style("font-size", d => d.size + "px").style("font-family", d => d.font).attr("text-anchor", "middle").attr('fill', d => this.colorElement(d, 'text')).attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`).text(d => d.text);
  }
  /**
   * Update chart's elements based on data change
   */


  updateElements() {
    this.wordgroup.selectAll('text').data(this.tData, d => d.text).transition(this.transition).attr('fill', d => this.colorElement(d, 'text')).style("font-size", d => d.size + "px").attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`);
  }
  /**
   * Remove chart's elements without data
   */


  exitElements() {
    this.wordgroup.exit().transition(this.transition).style("opacity", 0).remove();
  }
  /**
   * Word's angle
   */


  wordsAngle(angle) {
    if (typeof this.cfg.angle === 'number') {
      // Config angle is fixed number
      return this.cfg.angle;
    } else if (typeof this.cfg.angle === 'object') {
      if (this.cfg.angle instanceof Array === true) {
        // Config angle is custom array
        const idx = this.randomInt(0, this.cfg.angle.length - 1);
        return this.cfg.angle[idx];
      } else {
        // Config angle is custom object
        const angle = (this.cfg.angle.end - this.cfg.angle.start) / (this.cfg.angle.steps - 1);
        return this.cfg.angle.start + this.randomInt(0, this.cfg.angle.steps) * angle;
      }
    }

    return 0;
  }

  randomInt(min, max) {
    const i = Math.ceil(min);
    const j = Math.floor(max);
    return Math.floor(Math.random() * (j - i + 1)) + i;
  }

}

var script$6 = {
  name: 'D3WordsCloud',
  extends: __vue_component__,

  mounted() {
    this.chart = new d3wordscloud(this.$refs.chart, JSON.parse(JSON.stringify(this.datum)), this.config);
  }

};

/* script */
const __vue_script__$6 = script$6;
/* template */

/* style */

const __vue_inject_styles__$6 = undefined;
/* scoped */

const __vue_scope_id__$6 = undefined;
/* module identifier */

const __vue_module_identifier__$6 = undefined;
/* functional template */

const __vue_is_functional_template__$6 = undefined;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$6 = normalizeComponent({}, __vue_inject_styles__$6, __vue_script__$6, __vue_scope_id__$6, __vue_is_functional_template__$6, __vue_module_identifier__$6, false, undefined, undefined, undefined);

const d3$7 = {
  select,
  selectAll,
  scaleLinear,
  scaleOrdinal,
  max,
  min,
  transition,
  pie,
  arc,
  interpolate,
  easeLinear,
  easePolyIn,
  easePolyOut,
  easePoly,
  easePolyInOut,
  easeQuadIn,
  easeQuadOut,
  easeQuad,
  easeQuadInOut,
  easeCubicIn,
  easeCubicOut,
  easeCubic,
  easeCubicInOut,
  easeSinIn,
  easeSinOut,
  easeSin,
  easeSinInOut,
  easeExpIn,
  easeExpOut,
  easeExp,
  easeExpInOut,
  easeCircleIn,
  easeCircleOut,
  easeCircle,
  easeCircleInOut,
  easeElasticIn,
  easeElastic,
  easeElasticOut,
  easeElasticInOut,
  easeBackIn,
  easeBackOut,
  easeBack,
  easeBackInOut,
  easeBounceIn,
  easeBounce,
  easeBounceOut,
  easeBounceInOut,
  schemeCategory10,
  schemeAccent,
  schemeDark2,
  schemePaired,
  schemePastel1,
  schemePastel2,
  schemeSet1,
  schemeSet2,
  schemeSet3,
  schemeTableau10
};
/**
* D3 Slices Chart
*/

class d3sliceschart extends d3chart {
  constructor(selection, data, config) {
    super(selection, data, config, {
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
    });
  }
  /**
  * Init chart
  */


  initChart() {
    // Set up dimensions
    this.getDimensions();
    this.initChartFrame('sliceschart');
    this.cScale = d3$7.scaleOrdinal();
    this.rScale = d3$7.scaleLinear();
    this.arc = d3$7.arc();
    this.pie = d3$7.pie().sort(null).value(() => 1).padAngle(this.cfg.radius.padding);

    if (this.cfg.radius && this.cfg.radius.inner) {
      const outRadius = this.cfg.radius.outter ? this.cfg.radius.outter : Math.min(this.cfg.width, this.cfg.height) / 2;
      this.cfg.radius.relation = this.cfg.radius.inner ? this.cfg.radius.inner / outRadius : 0;
    }

    this.gcenter = this.g.append('g');
    this.setChartDimension();
    this.updateChart();
  }
  /**
  * Set up chart dimensions (non depending on data)
  */


  setChartDimension() {
    // SVG element
    this.svg.attr("viewBox", `0 0 ${this.cfg.width + this.cfg.margin.left + this.cfg.margin.right} ${this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom}`).attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right).attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom); // Center element

    this.gcenter.attr('transform', `translate(${this.cfg.width / 2}, ${this.cfg.height / 2})`);
  }
  /**
  * Bind data to main elements groups
  */


  bindData() {
    this.itemg = this.gcenter.selectAll('.chart__slice-group').data(this.pie(this.data), d => d.data[this.cfg.key]); // Set transition

    this.transition = d3$7.transition('t').duration(this.cfg.transition.duration).ease(d3$7[this.cfg.transition.ease]);
  }
  /**
  * Set up scales
  */


  setScales() {
    // Set up radius
    this.cfg.radius.outter = this.cfg.radius && this.cfg.radius.outter ? this.cfg.radius.outter : Math.min(this.cfg.width, this.cfg.height) / 2;
    this.inRadius = this.cfg.radius && this.cfg.radius.inner ? this.cfg.radius.inner : 0;

    if (this.cfg.radius.relation) {
      this.inRadius = this.cfg.radius.outter * this.cfg.radius.relation;
    } // Set up arcs


    this.arc = d3$7.arc().outerRadius(this.cfg.radius.outter).innerRadius(this.inRadius).cornerRadius(this.cfg.radius.round);
    this.rScale.range([this.inRadius, this.cfg.radius.outter]).domain([0, d3$7.max(this.data, d => d[this.cfg.value])]); // Set up color scheme

    if (this.cfg.color.scheme) {
      if (this.cfg.color.scheme instanceof Array === true) {
        this.colorScale = d3$7.scaleOrdinal().domain(this.data.map(d => d[this.cfg.key])).range(this.cfg.color.scheme);
      } else {
        this.colorScale = d3$7.scaleOrdinal(d3$7[this.cfg.color.scheme]).domain(this.data.map(d => d[this.cfg.key]));
      }
    }
  }
  /**
  * Add new chart's elements
  */


  enterElements() {
    const newg = this.itemg.enter().append('g').attr("class", "chart__slice-group chart__slice-group--sliceschart"); // BACKGROUNDS

    newg.append("path").attr("class", "chart__slice chart__slice--sliceschart").on('mouseover', (d, i) => {
      const key = d.data[this.cfg.key];
      const value = d.data[this.cfg.value];
      this.tooltip.html(() => {
        return `<div>${key}: ${value}</div>`;
      }).classed('active', true);
    }).on('mouseout', () => {
      this.tooltip.classed('active', false);
    }).on('mousemove', () => {
      this.tooltip.style('left', window.event['pageX'] - 28 + 'px').style('top', window.event['pageY'] - 40 + 'px');
    }).transition(this.transition).delay((d, i) => i * this.cfg.transition.duration).attrTween('d', d => {
      const i = d3$7.interpolate(d.startAngle + 0.1, d.endAngle);
      return t => {
        d.endAngle = i(t);
        return this.arc(d);
      };
    }).style("fill", d => this.cfg.color.default).style('opacity', 1); // FILLS

    newg.append("path").attr("class", "chart__slice chart__slice--sliceschart").transition(this.transition).delay((d, i) => i * this.cfg.transition.duration).attrTween('d', d => {
      const i = d3$7.interpolate(d.startAngle + 0.1, d.endAngle);
      const arc = d3$7.arc().outerRadius(this.rScale(d.data[this.cfg.value])).innerRadius(this.inRadius).cornerRadius(this.cfg.radius.round);
      return t => {
        d.endAngle = i(t);
        return arc(d);
      };
    }).style("fill", d => this.colorElement(d.data)).style('pointer-events', 'none').style('opacity', 1);
  }
  /**
  * Update chart's elements based on data change
  */


  updateElements() {}
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


  exitElements() {
    this.itemg.exit().transition(this.transition).style("opacity", 0).remove();
  }

  midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }
  /**
  * Store the displayed angles in _current.
  * Then, interpolate from _current to the new angles.
  * During the transition, _current is updated in-place by d3.interpolate.
  */


  arcTween(a) {
    var i = d3$7.interpolate(this._current, a);
    this._current = i(0);
    return t => this.arc(i(t));
  }

}

var script$7 = {
  name: 'D3SlicesChart',
  extends: __vue_component__,

  mounted() {
    this.chart = new d3sliceschart(this.$refs.chart, JSON.parse(JSON.stringify(this.datum)), this.config);
  }

};

/* script */
const __vue_script__$7 = script$7;
/* template */

/* style */

const __vue_inject_styles__$7 = function (inject) {
  if (!inject) return;
  inject("data-v-6a52c448_0", {
    source: ".chart__wrapper{margin:20px 0}.chart__wrap{margin:0}.chart__title{text-align:center;font-weight:700}.chart__source{font-size:12px}.chart__tooltip{position:absolute;pointer-events:none;display:none}.chart__tooltip.active{display:block}.chart__tooltip>div{background:#2b2b2b;color:#fff;padding:6px 10px;border-radius:3px}.chart__axis{font-size:12px;shape-rendering:crispEdges}.chart__grid .domain{stroke:none;fill:none}.chart__grid .tick line{opacity:.2}.chart__label{font-size:12px}.chart .clickable{cursor:pointer}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__$7 = undefined;
/* module identifier */

const __vue_module_identifier__$7 = undefined;
/* functional template */

const __vue_is_functional_template__$7 = undefined;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__$7 = normalizeComponent({}, __vue_inject_styles__$7, __vue_script__$7, __vue_scope_id__$7, __vue_is_functional_template__$7, __vue_module_identifier__$7, false, createInjector, undefined, undefined);

/* eslint-disable import/prefer-default-export */

var components = /*#__PURE__*/Object.freeze({
  __proto__: null,
  D3BarChart: __vue_component__$1,
  D3LineChart: __vue_component__$2,
  D3PieChart: __vue_component__$3,
  D3SlopeChart: __vue_component__$4,
  D3Sunburst: __vue_component__$5,
  D3WordsCloud: __vue_component__$6,
  D3SlicesChart: __vue_component__$7
});

// Import vue components

const install = function installVueD3Charts(Vue) {
  if (install.installed) return;
  install.installed = true;
  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  });
}; // Create module definition for Vue.use()


const plugin = {
  install
}; // To auto-install when vue is found
// eslint-disable-next-line no-redeclare

/* global window, global */

let GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
} // Default export is library as a whole, registered via Vue.use()

export default plugin;
export { __vue_component__$1 as D3BarChart, __vue_component__$2 as D3LineChart, __vue_component__$3 as D3PieChart, __vue_component__$7 as D3SlicesChart, __vue_component__$4 as D3SlopeChart, __vue_component__$5 as D3Sunburst, __vue_component__$6 as D3WordsCloud };
