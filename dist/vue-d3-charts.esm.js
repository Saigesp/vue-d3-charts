import Vue from 'vue';
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
  data: function data() {
    return {
      chart: {},
    };
  },
  props: {
    config: {
      type: Object,
      required: true,
      default: function () { return ({}); },
    },
    datum: {
      type: Array,
      required: true,
      default: function () { return ([]); },
    },
    title: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      default: '',
    },
    height: {
      type: Number,
      default: 300,
    },
  },
  watch: {
    config: {
      handler: function handler(val) {
        this.chart.updateConfig(val);
      },
      deep: true,
    },
    datum: function datum(vals) {
      this.chart.updateData([].concat( vals ));
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.chart.destroyChart();
  },
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) { style.element.setAttribute('media', css.media); }
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) { style.element.removeChild(nodes[index]); }
      if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }else { style.element.appendChild(textNode); }
    }
  }
}

var browser = createInjector;

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"chart__wrapper"},[(_vm.title)?_c('div',{staticClass:"chart__title"},[_vm._v(_vm._s(_vm.title))]):_vm._e(),_vm._v(" "),_c('div',{ref:"chart",style:({ height: ((this.height) + "px") })}),_vm._v(" "),(_vm.source)?_c('div',{staticClass:"chart__source"},[_vm._v(_vm._s(_vm.source))]):_vm._e()])};
var __vue_staticRenderFns__ = [];

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-12ef7492_0", { source: ".chart__wrapper{margin:20px 0}.chart__wrap{margin:0}.chart__title{text-align:center;font-weight:700}.chart__source{font-size:12px}.chart__tooltip{position:absolute;pointer-events:none;display:none}.chart__tooltip.active{display:block}.chart__tooltip>div{background:#2b2b2b;color:#fff;padding:6px 10px;border-radius:3px}.chart__axis{font-size:12px;shape-rendering:crispEdges}.chart__grid .domain{stroke:none;fill:none}.chart__grid .tick line{opacity:.2}.chart__label{font-size:12px}.chart .clickable{cursor:pointer}", map: undefined, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var D3Chart = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

var d3 = {select: select};

/**
* D3 Chart Base
*/
var d3chart = function d3chart(selection, data, config, cfg) {
    var this$1 = this;

    this.selection = d3.select(selection);
    this.data = data;
    this.cfg = cfg;
    this._setConfig(config);

    // Resize listener
    this.onResize = function () {this$1.resizeChart();};
    window.addEventListener("resize", this.onResize);

    this.initChart();
};

d3chart.prototype._setConfig = function _setConfig (config){
        var this$1 = this;

    // Set up configuration
    Object.keys(config).forEach(function (key){
        if(config[key] instanceof Object && config[key] instanceof Array === false){
            Object.keys(config[key]).forEach(function (sk){
                this$1.cfg[key][sk] = config[key][sk];
            });
        } else { this$1.cfg[key] = config[key]; }
    });
};

/**
* Init chart
*/
d3chart.prototype.initChart = function initChart (){
    console.error('d3chart.initChart not implemented');
};

/**
* Resize chart pipe
*/
d3chart.prototype.setScales = function setScales (){
    console.error('d3chart.setScales not implemented');
};

/**
* Set chart dimensional sizes
*/
d3chart.prototype.setChartDimension = function setChartDimension (){
    console.error('d3chart.setChartDimension not implemented');
};

/**
* Bind data to main elements groups
*/
d3chart.prototype.bindData = function bindData (){
    console.error('d3.chart.bindData not implemented');
};

/**
* Add new chart's elements
*/
d3chart.prototype.enterElements = function enterElements (){
    console.error('d3.chart.enterElements not implemented');
};

/**
* Update chart's elements based on data change
*/
d3chart.prototype.updateElements = function updateElements (){
    console.error('d3.chart.updateElements not implemented');
};

/**
* Remove chart's elements without data
*/
d3chart.prototype.exitElements = function exitElements (){
    console.error('d3.chart.exitElements not implemented');
};


/**
* Set up chart dimensions
*/
d3chart.prototype.getDimensions = function getDimensions (){
    this.cfg.width = parseInt(this.selection.node().offsetWidth) - this.cfg.margin.left - this.cfg.margin.right;
    this.cfg.height = parseInt(this.selection.node().offsetHeight)- this.cfg.margin.top - this.cfg.margin.bottom;
};

/**
* Returns chart's data
*/
d3chart.prototype.getData = function getData (){
    return this.data;
};

/**
* Add new data elements
*/
d3chart.prototype.enterData = function enterData (data){
    this.data = this.data.concat(data);
    this.setScales();
    this.updateChart();
};

/**
* Update existing data elements
*/
d3chart.prototype.updateData = function updateData (data){
    this.data = [].concat( data );
    this.setScales();
    this.updateChart();
};

/**
* Compute data before operate
*/
d3chart.prototype.computeData = function computeData (){
};

/**
* Remove data elements
*/
d3chart.prototype.exitData = function exitData (filter){
        var this$1 = this;

    this.data.forEach(function (d,i) {
        var c = 0;
        Object.keys(filter).forEach(function (key) {
            if(filter[key] == d[key]) { c++; }
        });
        if(c == Object.keys(filter).length){
            this$1.data.splice(i,1);
        }
    });
    this.setScales();
    this.updateChart();
};

/**
* Init chart commons elements (div > svg > g; tooltip)
*/
d3chart.prototype.initChartFrame = function initChartFrame (classname){
        if ( classname === void 0 ) classname='undefined';

    // Wrapper div
    this.wrap = this.selection.append('div') 
        .attr("class", "chart__wrap chart__wrap--"+classname);

    // SVG element
    this.svg = this.wrap.append('svg')
        .attr("class", "chart chart--"+classname);

    // General group for margin convention
    this.g = this.svg.append("g")
        .attr("class", "chart__margin-wrap chart__margin-wrap--"+classname)
        .attr("transform", ("translate(" + (this.cfg.margin.left) + "," + (this.cfg.margin.top) + ")"));

    // Tooltip
    this.selection.selectAll('.chart__tooltip').remove();
    this.tooltip = this.wrap
        .append('div')
        .attr('class', "chart__tooltip chart__tooltip--"+classname);
};

/**
* Compute element color
*/
d3chart.prototype.colorElement = function colorElement (d, key) {
        if ( key === void 0 ) key = undefined;

    key = key ? key : this.cfg.key;

    // if key is set, return own object color key
    if(this.cfg.color.key) { return d[this.cfg.color.key]; }

    // base color is default one if current key is set, else current one
    var baseColor = this.cfg.currentKey
        ? this.cfg.color.default
        : this.cfg.color.current;

    // if scheme is set, base color is color scheme
    if(this.cfg.color.scheme){
        baseColor = this.colorScale(d[key]);
    }

    // if keys is an object, base color is color key if exists
    if(this.cfg.color.keys
        && this.cfg.color.keys instanceof Object
        && this.cfg.color.keys instanceof Array === false
        && this.cfg.color.keys[d[key]]){
        baseColor = this.cfg.color.keys[d[key]];
    }

    // if current key is set and key is current, base color is current
    if(this.cfg.currentKey && d[this.cfg.key] === this.cfg.currentKey){
        baseColor = this.cfg.color.current;
    }

    return baseColor;
};

/**
* Update chart methods
*/
d3chart.prototype.updateChart = function updateChart (){
    this.computeData();
    this.bindData();
    this.setScales();
    this.enterElements();
    this.updateElements();
    this.exitElements();
};

/**
* Resize chart methods
*/
d3chart.prototype.resizeChart = function resizeChart (){
    this.getDimensions();
    //this.setScales();
    this.setChartDimension();
    this.updateChart();
};

/**
* Update chart configuration
*/
d3chart.prototype.updateConfig = function updateConfig (config){
    this._setConfig(config);
    this.resizeChart();
};

/**
* Destroy chart methods
*/
d3chart.prototype.destroyChart = function destroyChart (){
    window.removeEventListener("resize", this.onResize);
};

var d3$1 = {
  select: select, selectAll: selectAll,
  scaleBand: scaleBand, scaleLinear: scaleLinear, scaleOrdinal: scaleOrdinal,
  max: max,
  transition: transition,
  axisBottom: axisBottom, axisLeft: axisLeft,
  easeLinear: easeLinear, easePolyIn: easePolyIn, easePolyOut: easePolyOut, easePoly: easePoly, easePolyInOut: easePolyInOut,
  easeQuadIn: easeQuadIn, easeQuadOut: easeQuadOut, easeQuad: easeQuad, easeQuadInOut: easeQuadInOut, easeCubicIn: easeCubicIn, easeCubicOut: easeCubicOut,
  easeCubic: easeCubic, easeCubicInOut: easeCubicInOut, easeSinIn: easeSinIn, easeSinOut: easeSinOut, easeSin: easeSin, easeSinInOut: easeSinInOut,
  easeExpIn: easeExpIn, easeExpOut: easeExpOut, easeExp: easeExp, easeExpInOut: easeExpInOut, easeCircleIn: easeCircleIn, easeCircleOut: easeCircleOut,
  easeCircle: easeCircle, easeCircleInOut: easeCircleInOut, easeElasticIn: easeElasticIn, easeElastic: easeElastic, easeElasticOut: easeElasticOut,
  easeElasticInOut: easeElasticInOut, easeBackIn: easeBackIn, easeBackOut: easeBackOut, easeBack: easeBack, easeBackInOut: easeBackInOut, easeBounceIn: easeBounceIn,
  easeBounce: easeBounce, easeBounceOut: easeBounceOut, easeBounceInOut: easeBounceInOut,
  schemeCategory10: schemeCategory10, schemeAccent: schemeAccent, schemeDark2: schemeDark2, schemePaired: schemePaired, schemePastel1: schemePastel1,
  schemePastel2: schemePastel2, schemeSet1: schemeSet1, schemeSet2: schemeSet2, schemeSet3: schemeSet3, schemeTableau10: schemeTableau10
};

/**
 * D3 Bar Chart
 */
var d3barchart = /*@__PURE__*/(function (d3chart) {
  function d3barchart(selection, data, config) {
    d3chart.call(this, selection, data, config, {
      margin: { top: 10, right: 30, bottom: 20, left: 40 },
      key: 'key',
      currentKey: false,
      value: 'value',
      labelRotation: 0,
      color: { key: false, keys: false, scheme: false, current: "#1f77b4", default: "#AAA", axis: "#000" },
      axis: { yTitle: false, xTitle: false, yFormat: ".0f", xFormat: ".0f", yTicks: 10, xTicks: 10 },
      tooltip: { label: false },
      transition: { duration: 350, ease: "easeLinear" },
    });
  }

  if ( d3chart ) d3barchart.__proto__ = d3chart;
  d3barchart.prototype = Object.create( d3chart && d3chart.prototype );
  d3barchart.prototype.constructor = d3barchart;

  /**
   * Init chart
   */
  d3barchart.prototype.initChart = function initChart () {

    // Set up dimensions
    this.getDimensions();
    this.initChartFrame('barchart');

    // Set up scales
    this.xScale = d3$1.scaleBand();
    this.yScale = d3$1.scaleLinear();

    // Axis group
    this.axisg = this.g.append('g')
        .attr('class', 'chart__axis chart__axis--barchart');

    // Horizontal grid
    this.yGrid = this.axisg.append("g")
        .attr("class", "chart__grid chart__grid--y chart__grid--barchart");

    // Bottom axis
    this.xAxis = this.axisg.append("g")
        .attr("class", "chart__axis-x chart__axis-x--barchart");

    // Vertical axis title
    if (this.cfg.axis.yTitle)
        { this.yAxisTitle = this.axisg.append('text')
        .attr('class', 'chart__axis-title chart__axis-title--barchart')
        .attr("transform", 'rotate(-90)')
        .style("text-anchor", "middle"); }

    this.setChartDimension();
    this.updateChart();
  };

  /**
   * Resize chart pipe
   */
  d3barchart.prototype.setScales = function setScales () {
    var this$1 = this;


    this.xScale
      .rangeRound([0, this.cfg.width])
      .padding(0.1)
      .domain(this.data.map(function (d) { return d[this$1.cfg.key]; }));

    this.yScale
      .rangeRound([0, this.cfg.height])
      .domain([d3$1.max(this.data, function (d) { return +d[this$1.cfg.value]; }), 0]);

    if (this.cfg.color.scheme instanceof Array === true) {
      this.colorScale = d3$1.scaleOrdinal().range(this.cfg.color.scheme);
    } else if (typeof this.cfg.color.scheme === 'string') {
      this.colorScale = d3$1.scaleOrdinal(d3$1[this.cfg.color.scheme]);
    }

    // Horizontal grid
    this.yGrid
      .call(
        d3$1.axisLeft(this.yScale)
          .tickSize(-this.cfg.width)
          .ticks(this.cfg.axis.yTicks, this.cfg.axis.yFormat)
      );

    // Bottom axis
    this.xAxis
        .attr("transform", ("translate(0," + (this.cfg.height) + ")"))
        .call(d3$1.axisBottom(this.xScale));
  };

  /**
   * Set chart dimensional sizes
   */
  d3barchart.prototype.setChartDimension = function setChartDimension () {
    // SVG element
    this.svg
      .attr("viewBox", ("0 0 " + (this.cfg.width + this.cfg.margin.left + this.cfg.margin.right) + " " + (this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom)))
      .attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right)
      .attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom);

    // Vertical axis title
    if (this.cfg.axis.yTitle)
      { this.yAxisTitle
        .attr("y", -this.cfg.margin.left + 10)
        .attr("x", -this.cfg.height / 2)
        .text(this.cfg.axis.yTitle); }

    // Bottom axis label rotation
    if(this.cfg.labelRotation!=0)
      { this.xAxis.selectAll('text')
        .attr("y", Math.cos(this.cfg.labelRotation*Math.PI/180)*9)
        .attr("x", Math.sin(this.cfg.labelRotation*Math.PI/180)*9)
        .attr("dy", ".35em")
        .attr("transform", ("rotate(" + (this.cfg.labelRotation) + ")"))
        .style("text-anchor", "start"); }
  };

  /**
   * Bind data to main elements groups
   */
  d3barchart.prototype.bindData = function bindData () {
    var this$1 = this;


    // Set transition
    this.transition = d3$1.transition('t')
      .duration(this.cfg.transition.duration)
      .ease(d3$1[this.cfg.transition.ease]);

    // Bars groups
    this.itemg = this.g.selectAll('.chart__bar-group')
      .data(this.data, function (d) { return d[this$1.cfg.key]; });
  };

  /**
   * Add new chart's elements
   */
  d3barchart.prototype.enterElements = function enterElements () {
    var this$1 = this;


    var newbars = this.itemg
      .enter().append('g')
      .attr('class', 'chart__bar-group chart__bar-group--barchart')
      .attr('transform', function (d) { return ("translate(" + (this$1.xScale(d[this$1.cfg.key])) + ",0)"); });
      
    var rects = newbars.append('rect')
      .attr('class', 'chart__bar chart__bar--barchart')
      .classed('chart__bar--current', function (d) { return this$1.cfg.currentKey && d[this$1.cfg.key] == this$1.cfg.currentKey; })
      .attr('x', 0)
      .attr('y', this.cfg.height)
      .attr('height', 0)
      .on('mouseover', function (d) {
        this$1.tooltip.html(function () {
          return ("<div>" + (d[this$1.cfg.key]) + ": " + (d[this$1.cfg.value]) + "</div>")
        })
        .classed('active', true);
      })
      .on('mouseout', function () {
        this$1.tooltip.classed('active', false);
      })
      .on('mousemove', function () {
        this$1.tooltip
          .style('left', window.event['pageX'] - 28 + 'px')
          .style('top', window.event['pageY'] - 40 + 'px');
      });

  };

  /**
   * Update chart's elements based on data change
   */
  d3barchart.prototype.updateElements = function updateElements () {
    var this$1 = this;

    // Bars groups
    this.itemg
      .transition(this.transition)
      .attr('transform', function (d) { return ("translate(" + (this$1.xScale(d[this$1.cfg.key])) + ",0)"); });

    // Bars
    this.g
      .selectAll('.chart__bar')
      .transition(this.transition)
      .attr('fill', function (d) { return this$1.colorElement(d); })
      .attr('width', this.xScale.bandwidth())
      .attr('y', function (d) { return this$1.yScale(+d[this$1.cfg.value]); })
      .attr('height', function (d) { return this$1.cfg.height - this$1.yScale(+d[this$1.cfg.value]); });

  };

  /**
   * Remove chart's elements without data
   */
  d3barchart.prototype.exitElements = function exitElements () {
    this.itemg.exit()
      .transition(this.transition)
      .style("opacity", 0)
      .remove();
  };

  return d3barchart;
}(d3chart));

var script$1 = {
  name: 'D3BarChart',
  extends: D3Chart,
  mounted: function mounted() {
    this.chart = new d3barchart(
      this.$refs.chart,
      JSON.parse(JSON.stringify(this.datum)),
      this.config
    );
  },
};

/* script */
var __vue_script__$1 = script$1;

/* template */

  /* style */
  var __vue_inject_styles__$1 = undefined;
  /* scoped */
  var __vue_scope_id__$1 = undefined;
  /* module identifier */
  var __vue_module_identifier__$1 = undefined;
  /* functional template */
  var __vue_is_functional_template__$1 = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var D3BarChart = normalizeComponent_1(
    {},
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    undefined,
    undefined
  );

var d3$2 = { select: select, selectAll: selectAll, scaleOrdinal: scaleOrdinal, scaleLinear: scaleLinear, scaleTime: scaleTime,
  timeParse: timeParse, timeFormat: timeFormat, max: max, extent: extent, line: line, transition: transition, axisLeft: axisLeft,
  axisBottom: axisBottom, easeLinear: easeLinear, easePolyIn: easePolyIn, easePolyOut: easePolyOut, easePoly: easePoly, easePolyInOut: easePolyInOut,
  easeQuadIn: easeQuadIn, easeQuadOut: easeQuadOut, easeQuad: easeQuad, easeQuadInOut: easeQuadInOut, easeCubicIn: easeCubicIn, easeCubicOut: easeCubicOut,
  easeCubic: easeCubic, easeCubicInOut: easeCubicInOut, easeSinIn: easeSinIn, easeSinOut: easeSinOut, easeSin: easeSin, easeSinInOut: easeSinInOut,
  easeExpIn: easeExpIn, easeExpOut: easeExpOut, easeExp: easeExp, easeExpInOut: easeExpInOut, easeCircleIn: easeCircleIn, easeCircleOut: easeCircleOut,
  easeCircle: easeCircle, easeCircleInOut: easeCircleInOut, easeElasticIn: easeElasticIn, easeElastic: easeElastic, easeElasticOut: easeElasticOut,
  easeElasticInOut: easeElasticInOut, easeBackIn: easeBackIn, easeBackOut: easeBackOut, easeBack: easeBack, easeBackInOut: easeBackInOut, easeBounceIn: easeBounceIn,
  easeBounce: easeBounce, easeBounceOut: easeBounceOut, easeBounceInOut: easeBounceInOut, curveBasis: curveBasis, curveBundle: curveBundle, curveCardinal: curveCardinal,
  curveCatmullRom: curveCatmullRom, curveLinear: curveLinear, curveMonotoneX: curveMonotoneX, curveMonotoneY: curveMonotoneY, curveNatural: curveNatural, curveStep: curveStep,
  curveStepAfter: curveStepAfter, curveStepBefore: curveStepBefore, schemeCategory10: schemeCategory10, schemeAccent: schemeAccent, schemeDark2: schemeDark2, schemePaired: schemePaired,
  schemePastel1: schemePastel1, schemePastel2: schemePastel2, schemeSet1: schemeSet1, schemeSet2: schemeSet2, schemeSet3: schemeSet3, schemeTableau10: schemeTableau10};

/**
 * D3 Line Chart
 */
var d3linechart = /*@__PURE__*/(function (d3chart) {
  function d3linechart(selection, data, config) {
        d3chart.call(this, selection, data, config, {
            margin: { top: 20, right: 20, bottom: 20, left: 40 },
            values: [],
            date: { key: false, inputFormat: "%Y-%m-%d", outputFormat: "%Y-%m-%d" },
            color: { key: false, keys: false, scheme: false, current: '#1f77b4', default: '#AAA', axis: '#000' },
            curve: 'curveLinear',
            points: { visibleSize: 3, hoverSize: 6 },
            axis: { yTitle: false, xTitle: false, yFormat: ".0f", xFormat: "%Y-%m-%d", yTicks: 5, xTicks: 3 },
            tooltip: { labels: false },
            transition: { duration: 350, ease: 'easeLinear' }
        });
    }

  if ( d3chart ) d3linechart.__proto__ = d3chart;
  d3linechart.prototype = Object.create( d3chart && d3chart.prototype );
  d3linechart.prototype.constructor = d3linechart;

    /**
    * Init chart
    */
    d3linechart.prototype.initChart = function initChart () {

        // Set up dimensions
        this.getDimensions();
        this.initChartFrame('linechart');

        // Format date functions
        this.parseTime = d3$2.timeParse(this.cfg.date.inputFormat);
        this.formatTime = d3$2.timeFormat(this.cfg.date.outputFormat);

        // Init scales
        this.yScale = d3$2.scaleLinear();
        this.xScale = d3$2.scaleTime();

        // Axis group
        this.axisg = this.g.append('g')
            .attr('class', 'chart__axis chart__axis--linechart');

        // Horizontal grid
        this.yGrid = this.axisg.append("g")
            .attr("class", "chart__grid chart__grid--y chart__grid--linechart");

        // Bottom axis
        this.xAxis = this.axisg.append("g")
            .attr("class", "chart__axis-x chart__axis-x--linechart");

        // Vertical axis
        this.yAxis = this.axisg.append("g")
            .attr("class", "chart__axis-y chart__axis-y--linechart chart__grid");

        // Vertical axis title
        if (this.cfg.axis.yTitle)
            { this.yAxisTitle = this.axisg.append('text')
            .attr('class', 'chart__axis-title chart__axis-title--linechart')
            .attr("transform", 'rotate(-90)')
            .style("text-anchor", "middle"); }

        this.setChartDimension();
        this.updateChart();
    };

    /**
     * Calcule required derivated data
     */
    d3linechart.prototype.computeData = function computeData () {
        var this$1 = this;

        // Calcule transpose data
        var tData = [];
        this.cfg.values.forEach(function (j, i) {
            tData[i] = {};
            tData[i].key = j;
            tData[i].values = [];
        });

        this.data.forEach(function (d) { d.jsdate = this$1.parseTime(d[this$1.cfg.date.key]); });
        this.data.sort(function (a, b) { return b.jsdate - a.jsdate; });

        this.data.forEach(function (d) {
            d.min = 9999999999999999999;
            d.max = -9999999999999999999;
            this$1.cfg.values.forEach(function (j, i) {
                tData[i].values.push({ x: d.jsdate, y: +d[j], k: i });
                if (d[j] < d.min) { d.min = +d[j]; }
                if (d[j] > d.max) { d.max = +d[j]; }
            });
        });
        this.tData = tData;
    };

    /**
     * Set up chart dimensions (non depending on data)
     */
    d3linechart.prototype.setChartDimension = function setChartDimension () {
        // Resize SVG element
        this.svg
            .attr("viewBox", ("0 0 " + (this.cfg.width+this.cfg.margin.left+this.cfg.margin.right) + " " + (this.cfg.height+this.cfg.margin.top+this.cfg.margin.bottom)))
            .attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right)
            .attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom);

        // Vertical axis title
        if (this.cfg.axis.yTitle)
            { this.yAxisTitle
            .attr("y", -this.cfg.margin.left + 10)
            .attr("x", -this.cfg.height / 2)
            .text(this.cfg.axis.yTitle); }
    };

    /**
     * Set up scales
     */
    d3linechart.prototype.setScales = function setScales () {
        var this$1 = this;

        // Calcule vertical scale
        this.yScale
            .domain([0, d3$2.max(this.data, function (d) { return d.max; })])
            .rangeRound([this.cfg.height, 0]);

        // Calcule horizontal scale
        this.xScale
            .domain(d3$2.extent(this.data, function (d) { return d.jsdate; }))
            .rangeRound([0, this.cfg.width]);

        if (this.cfg.color.scheme instanceof Array === true) {
            this.colorScale = d3$2.scaleOrdinal().range(this.cfg.color.scheme);
        } else if (typeof this.cfg.color.scheme === 'string') {
            this.colorScale = d3$2.scaleOrdinal(d3$2[this.cfg.color.scheme]);
        }

        // Set up line function
        this.line = d3$2.line()
            .x(function (d) { return this$1.xScale(d.x); })
            .y(function (d) { return this$1.yScale(d.y); })
            .curve(d3$2[this.cfg.curve]);

        // Redraw grid
        this.yGrid
            .call(
                d3$2.axisLeft(this.yScale)
                .tickSize(-this.cfg.width)
                .ticks(this.cfg.axis.yTicks, this.cfg.axis.yFormat)
            );

        // Redraw horizontal axis
        this.xAxis
            .attr("transform", ("translate(0," + (this.cfg.height) + ")"))
            .call(
                d3$2.axisBottom(this.xScale)
                .tickFormat(this.formatTime)
                .ticks(this.cfg.axis.xTicks, this.cfg.axis.xFormat)
            );
    };

    /**
     * Bind data to main elements groups
     */
    d3linechart.prototype.bindData = function bindData () {

        // Set transition
        this.transition = d3$2.transition('t')
            .duration(this.cfg.transition.duration)
            .ease(d3$2[this.cfg.transition.ease]);

        // Lines group
        this.linesgroup = this.g.selectAll(".chart__lines-group")
            .data(this.tData);

        // Don't continue if points are disabled
        if(this.cfg.points===false)
          { return; }
        
        // Set points store
        if (!this.pointsg || this.pointsg instanceof Array === false) {
            this.pointsg = [];
        }
    };

    /**
     * Add new chart's elements
     */
    d3linechart.prototype.enterElements = function enterElements () {
        var this$1 = this;


        // Elements to add
        var newgroups = this.linesgroup
            .enter().append('g')
            .attr("class", "chart__lines-group chart__lines-group--linechart");

        // Lines
        newgroups.append('path')
            .attr("class", "chart__line chart__line--linechart")
            .attr('fill', 'transparent')
            .attr("d", function (d) { return this$1.line(d.values.map(function (v) {return { y: 0, x: v.x, k: v.k}})); });

        // Don't continue if points are disabled
        if(this.cfg.points===false)
          { return; }

        this.cfg.values.forEach(function (k, i) {
            // Point group
            var gp = this$1.g.selectAll('.chart__points-group--' + k)
                .data(this$1.data).enter()
                .append('g')
                .attr('class', 'chart__points-group chart__points-group--linechart chart__points-group--' + k)
                .attr('transform', function (d) { return ("translate(" + (this$1.xScale(d.jsdate)) + "," + (this$1.cfg.height) + ")"); });

            // Hover point
            gp.append('circle')
                .attr('class', 'chart__point-hover chart__point-hover--linechart')
                .attr('fill', 'transparent')
                .attr('r', this$1.cfg.points.hoverSize)
                .on('mouseover', function (d) {
                    this$1.tooltip.html(function (_) {
                            var label = this$1.cfg.tooltip.labels && this$1.cfg.tooltip.labels[i] ?
                                this$1.cfg.tooltip.labels[i] :
                                k;
                            return ("\n                            <div>" + label + ": " + (d[k]) + "</div>\n                        ")
                        })
                        .classed('active', true);
                })
                .on('mouseout', function (_) {
                    this$1.tooltip.classed('active', false);
                })
                .on('mousemove', function (_) {
                    this$1.tooltip
                        .style('left', window.event['pageX'] - 28 + 'px')
                        .style('top', window.event['pageY'] - 40 + 'px');
                });

            // Visible point
            gp.append('circle')
                .attr('class', 'chart__point-visible chart__point-visible--linechart')
                .attr('pointer-events', 'none');

            this$1.pointsg.push({ selection: gp, key: k });
        });
    };

    /**
     * Update chart's elements based on data change
     */
    d3linechart.prototype.updateElements = function updateElements () {
        var this$1 = this;


        // Color lines
        this.linesgroup
            .attr('stroke', function (d) { return this$1.colorElement(d, 'key'); });

        // Redraw lines
        this.g.selectAll('.chart__line')
            .attr('stroke', function (d) { return this$1.colorElement(d, 'key') })
            .transition(this.transition)
            .attr("d", function (d) { return this$1.line(d.values); });

        // Don't continue if points are disabled
        if(this.cfg.points===false)
          { return; }

        // Redraw points
        this.pointsg.forEach(function (p, i) {
            p.selection
                .transition(this$1.transition)
                .attr('transform', function (d) { return ("translate(" + (this$1.xScale(d.jsdate)) + "," + (this$1.yScale(d[p.key])) + ")"); });

            // Visible point
            p.selection.selectAll('.chart__point-visible')
                .attr('fill', function (d) { return this$1.colorElement(p, 'key'); })
                .attr('r', this$1.cfg.points.visibleSize);
            
            // Hover point
            p.selection.selectAll('.chart__point-hover')
                .attr('r', this$1.cfg.points.hoverSize);
        });
    };

    /**
     * Remove chart's elements without data
     */
    d3linechart.prototype.exitElements = function exitElements () {
        this.linesgroup.exit()
            .transition(this.transition)
            .style("opacity", 0)
            .remove();
    };

  return d3linechart;
}(d3chart));

var script$2 = {
  name: 'D3LineChart',
  extends: D3Chart,
  mounted: function mounted() {
    this.chart = new d3linechart(
      this.$refs.chart,
      JSON.parse(JSON.stringify(this.datum)),
      this.config
    );
  },
};

/* script */
var __vue_script__$2 = script$2;

/* template */

  /* style */
  var __vue_inject_styles__$2 = undefined;
  /* scoped */
  var __vue_scope_id__$2 = undefined;
  /* module identifier */
  var __vue_module_identifier__$2 = undefined;
  /* functional template */
  var __vue_is_functional_template__$2 = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var D3LineChart = normalizeComponent_1(
    {},
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  );

var d3$3 = {select: select, selectAll: selectAll, scaleLinear: scaleLinear, scaleOrdinal: scaleOrdinal, max: max, min: min, transition: transition, easeLinear: easeLinear,
    easePolyIn: easePolyIn, easePolyOut: easePolyOut, easePoly: easePoly, easePolyInOut: easePolyInOut, easeQuadIn: easeQuadIn, easeQuadOut: easeQuadOut,
    easeQuad: easeQuad, easeQuadInOut: easeQuadInOut, easeCubicIn: easeCubicIn, easeCubicOut: easeCubicOut, easeCubic: easeCubic, easeCubicInOut: easeCubicInOut,
    easeSinIn: easeSinIn, easeSinOut: easeSinOut, easeSin: easeSin, easeSinInOut: easeSinInOut, easeExpIn: easeExpIn, easeExpOut: easeExpOut, easeExp: easeExp,
    easeExpInOut: easeExpInOut, easeCircleIn: easeCircleIn, easeCircleOut: easeCircleOut, easeCircle: easeCircle, easeCircleInOut: easeCircleInOut,
    easeElasticIn: easeElasticIn, easeElastic: easeElastic, easeElasticOut: easeElasticOut, easeElasticInOut: easeElasticInOut, easeBackIn: easeBackIn,
    easeBackOut: easeBackOut, easeBack: easeBack, easeBackInOut: easeBackInOut, easeBounceIn: easeBounceIn, easeBounce: easeBounce, easeBounceOut: easeBounceOut,
    easeBounceInOut: easeBounceInOut, schemeCategory10: schemeCategory10, schemeAccent: schemeAccent, schemeDark2: schemeDark2, schemePaired: schemePaired,
    schemePastel1: schemePastel1, schemePastel2: schemePastel2, schemeSet1: schemeSet1, schemeSet2: schemeSet2, schemeSet3: schemeSet3,
    schemeTableau10: schemeTableau10};

/**
* D3 Slope Chart
*/
var d3slopechart = /*@__PURE__*/(function (d3chart) {
    function d3slopechart(selection, data, config) {
        d3chart.call(this, selection, data, config, {
            margin: {top: 10, right: 100, bottom: 20, left: 100},
            key: '',
            currentKey: false,
            values: ['start', 'end'],
            color : {key: false, keys: false, scheme: false, current: '#1f77b4', default: '#AAA', axis: '#000'},
            axis: {titles: false},
            points: {visibleRadius: 3},
            opacity: 0.5,
            transition: {duration: 350, ease: 'easeLinear'}
        });
    }

    if ( d3chart ) d3slopechart.__proto__ = d3chart;
    d3slopechart.prototype = Object.create( d3chart && d3chart.prototype );
    d3slopechart.prototype.constructor = d3slopechart;

    /**
    * Init chart
    */
    d3slopechart.prototype.initChart = function initChart () {

        // Set up dimensions
        this.getDimensions();
        this.initChartFrame('slopechart');

        // Set up scales
        this.yScale = d3$3.scaleLinear();

        // Axis group
        var axisg = this.g.append('g')
            .attr('class', 'chart__axis chart__axis--slopechart');

        // Vertical left axis
        this.startAxis = axisg.append('line')
            .attr("class", "chart__axis-y chart__axis-y--slopechart chart__axis-y--start")
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('stroke', this.cfg.color.axis);

        // Vertical right axis
        this.endAxis = axisg.append('line')
            .attr("class", "chart__axis-y chart__axis-y--slopechart chart__axis-y--end")
            .attr('y1', 0)
            .attr('stroke', this.cfg.color.axis);

        // Axis labels
        if(this.cfg.axis.titles){
            this.startl = axisg.append('text')
                .attr('class', 'chart__axis-text chart__axis-text--slopechart chart__axis-text--start')
                .attr('text-anchor', 'middle')
                .attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom -12)
                .text(this.cfg.axis.titles[0]);

            this.endl = axisg.append('text')
                .attr('class', 'chart__axis-text chart__axis-text--slopechart chart__axis-text--end')
                .attr('text-anchor', 'middle')
                .attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom -12)
                .text(this.cfg.axis.titles[1]);
        }

        this.setChartDimension();
        this.updateChart();
    };

    /**
    * Set up chart dimensions (non depending on data)
    */
    d3slopechart.prototype.setChartDimension = function setChartDimension (){
        // SVG element
        this.svg
            .attr("viewBox", ("0 0 " + (this.cfg.width+this.cfg.margin.left+this.cfg.margin.right) + " " + (this.cfg.height+this.cfg.margin.top+this.cfg.margin.bottom)))
            .attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right)
            .attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom);

        // Vertical left axis position
        this.startAxis
            .attr('y2', this.cfg.height);

        // Vertical right axis position
        this.endAxis
            .attr('x1', this.cfg.width)
            .attr('x2', this.cfg.width)
            .attr('y2', this.cfg.height);

        // Axis labels
        if(this.cfg.axis.titles){
            this.startl.attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom -12);
            this.endl.attr('x', this.cfg.width).attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom -12);
        }
    };

    /**
    * Set up scales
    */
    d3slopechart.prototype.setScales = function setScales (){
        var this$1 = this;

        // Set up dimensional scales
        this.yScale
            .rangeRound([this.cfg.height, 0])
            .domain([
                d3$3.min(this.data, function (d) { return d[this$1.cfg.values[0]] < d[this$1.cfg.values[1]] ? d[this$1.cfg.values[0]]*0.9 : d[this$1.cfg.values[1]]*0.9; } ),
                d3$3.max(this.data, function (d) { return d[this$1.cfg.values[0]] > d[this$1.cfg.values[1]] ? d[this$1.cfg.values[0]]*1.1 : d[this$1.cfg.values[1]]*1.1; } )
            ]);

        // Set up color scheme
        if(this.cfg.color.scheme){
            if(this.cfg.color.scheme instanceof Array === true){
                this.colorScale = d3$3.scaleOrdinal()
                    .domain(this.data.map(function (d){ return d[this$1.cfg.key]; }))
                    .range(this.cfg.color.scheme);
            }else{
                this.colorScale = d3$3.scaleOrdinal(d3$3[this.cfg.color.scheme])
                    .domain(this.data.map(function (d){ return d[this$1.cfg.key]; }));
            }
        }
    };

    /**
    * Bind data to main elements groups
    */
    d3slopechart.prototype.bindData = function bindData (){
        var this$1 = this;

        // Lines group selection data
        this.linesgroup = this.g.selectAll(".chart__lines-group")
            .data(this.data, function (d) { return d[this$1.cfg.key]; });

        // Set transition
        this.transition = d3$3.transition('t')
            .duration(this.cfg.transition.duration)
            .ease(d3$3[this.cfg.transition.ease]);
    };

    /**
    * Add new chart's elements
    */
    d3slopechart.prototype.enterElements = function enterElements (){
        var this$1 = this;


        // Elements to add
        var newlines = this.linesgroup
            .enter().append('g')
            .attr("class", "chart__lines-group chart__lines-group--slopechart");

        // Lines to add
        newlines.append('line') 
            .attr("class", "chart__line chart__line--slopechart")
            .classed('chart__line--current', function (d) { return this$1.cfg.currentKey && d[this$1.cfg.key] == this$1.cfg.currentKey; })
            .attr('stroke', function (d) { return this$1.colorElement(d); })
            .style("opacity", this.cfg.opacity)
            .attr("x1", 0)
            .attr("x2", this.cfg.width)
            .transition(this.transition)
            .attr("y1", function (d) { return this$1.yScale(d[this$1.cfg.values[0]]); })
            .attr("y2", function (d) { return this$1.yScale(d[this$1.cfg.values[1]]); });

        // Vertical left axis points group to add
        var gstart = newlines.append('g')
            .attr('class', 'chart__points-group chart__points-group--slopechart chart__points-group--start');
        
        gstart.transition(this.transition)
            .attr('transform', function (d) { return 'translate(0,'+this$1.yScale(d[this$1.cfg.values[0]])+')'; });

        // Vertical left axis points to add
        gstart.append('circle')
            .attr('class', 'chart__point chart__point--slopechart chart__point--start')
            .attr('fill', function (d) { return this$1.colorElement(d); })
            .attr('r', this.cfg.points.visibleRadius);

        // Vertical left axis label to add
        gstart.append('text')
            .attr('class', 'chart__label chart__label--slopechart chart__label--start')
            .attr('text-anchor', 'end')
            .attr('y', 3)
            .attr('x', -5)
            .text(function (d) { return d[this$1.cfg.key] +' '+ d[this$1.cfg.values[0]]; });

        // Vertical right axis points group to add
        var gend = newlines.append('g')
            .attr('class', 'chart__points-group chart__points-group--slopechart chart__points-group--end')
            .attr('transform', 'translate('+this.cfg.width+',0)');

        gend.transition(this.transition)
            .attr('transform', function (d) { return 'translate('+this$1.cfg.width+','+this$1.yScale(d[this$1.cfg.values[1]])+')'; });

        // Vertical right axis points to add
        gend.append('circle')
            .attr('class', 'chart__point chart__point--slopechart chart__point--end')
            .attr('fill', function (d) { return this$1.colorElement(d); })
            .attr('r', this.cfg.points.visibleRadius);

        // Vertical right axis label to add
        gend.append('text')
            .attr('class', 'chart__label chart__label--slopechart chart__label--end')
            .attr('text-anchor', 'start')
            .attr('y', 3)
            .attr('x', 5)
            .text(function (d) { return d[this$1.cfg.values[1]] + '  ' + d[this$1.cfg.key]; });
    };

    /**
    * Update chart's elements based on data change
    */
    d3slopechart.prototype.updateElements = function updateElements (){
        var this$1 = this;

        // Lines to modify
        this.linesgroup.selectAll('.chart__line')
            .data(this.data, function (d){ return d[this$1.cfg.key]; })
            .transition(this.transition)
            .attr("x1", 0)
            .attr("x2", this.cfg.width)
            .attr("y1", function (d) { return this$1.yScale(d[this$1.cfg.values[0]]); })
            .attr("y2", function (d) { return this$1.yScale(d[this$1.cfg.values[1]]); });

        // Left axis points to modify
        this.linesgroup.selectAll('.chart__points-group--start')
            .data(this.data, function (d){ return d[this$1.cfg.key]; })
            .transition(this.transition)
            .attr('transform', function (d) { return 'translate(0,'+this$1.yScale(d[this$1.cfg.values[0]])+')'; });

        // Left axis labels to modify
        this.linesgroup.selectAll('.chart__label--start')
            .data(this.data, function (d){ return d[this$1.cfg.key]; })
            .text(function (d) {return d[this$1.cfg.key] +' '+ d[this$1.cfg.values[0]]});

        // Right axis points to modify
        this.linesgroup.selectAll('.chart__points-group--end')
            .data(this.data, function (d){ return d[this$1.cfg.key]; })
            .transition(this.transition)
            .attr('transform', function (d) { return 'translate('+this$1.cfg.width+','+this$1.yScale(d[this$1.cfg.values[1]])+')'; });

        // Right axis labels to modify
        this.linesgroup.selectAll('.chart__label--end')
            .data(this.data, function (d){ return d[this$1.cfg.key]; })
            .text(function (d) { return d[this$1.cfg.values[1]] + '  ' + d[this$1.cfg.key]; });
    };

    /**
    * Remove chart's elements without data
    */
    d3slopechart.prototype.exitElements = function exitElements (){
        this.linesgroup.exit()
            .transition(this.transition)
            .style("opacity", 0)
            .remove();
    };

    return d3slopechart;
}(d3chart));

var script$3 = {
  name: 'D3SlopeChart',
  extends: D3Chart,
  mounted: function mounted() {
    this.chart = new d3slopechart(
      this.$refs.chart,
      JSON.parse(JSON.stringify(this.datum)),
      this.config
    );
  },
};

/* script */
var __vue_script__$3 = script$3;

/* template */

  /* style */
  var __vue_inject_styles__$3 = function (inject) {
    if (!inject) { return }
    inject("data-v-6b03ba8c_0", { source: ".chart__wrapper{margin:20px 0}.chart__wrap{margin:0}.chart__title{text-align:center;font-weight:700}.chart__source{font-size:12px}.chart__tooltip{position:absolute;pointer-events:none;display:none}.chart__tooltip.active{display:block}.chart__tooltip>div{background:#2b2b2b;color:#fff;padding:6px 10px;border-radius:3px}.chart__axis{font-size:12px;shape-rendering:crispEdges}.chart__grid .domain{stroke:none;fill:none}.chart__grid .tick line{opacity:.2}.chart__label{font-size:12px}.chart .clickable{cursor:pointer}.chart--slopegraph .chart__line--current{stroke-width:2px}", map: undefined, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__$3 = undefined;
  /* module identifier */
  var __vue_module_identifier__$3 = undefined;
  /* functional template */
  var __vue_is_functional_template__$3 = undefined;
  /* style inject SSR */
  

  
  var D3SlopeChart = normalizeComponent_1(
    {},
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    browser,
    undefined
  );

var d3$4 = {select: select, selectAll: selectAll, scaleLinear: scaleLinear, scaleOrdinal: scaleOrdinal, max: max, min: min, transition: transition, pie: pie, arc: arc, interpolate: interpolate,
    easeLinear: easeLinear, easePolyIn: easePolyIn, easePolyOut: easePolyOut, easePoly: easePoly, easePolyInOut: easePolyInOut, easeQuadIn: easeQuadIn, easeQuadOut: easeQuadOut,
    easeQuad: easeQuad, easeQuadInOut: easeQuadInOut, easeCubicIn: easeCubicIn, easeCubicOut: easeCubicOut, easeCubic: easeCubic, easeCubicInOut: easeCubicInOut,
    easeSinIn: easeSinIn, easeSinOut: easeSinOut, easeSin: easeSin, easeSinInOut: easeSinInOut, easeExpIn: easeExpIn, easeExpOut: easeExpOut, easeExp: easeExp,
    easeExpInOut: easeExpInOut, easeCircleIn: easeCircleIn, easeCircleOut: easeCircleOut, easeCircle: easeCircle, easeCircleInOut: easeCircleInOut,
    easeElasticIn: easeElasticIn, easeElastic: easeElastic, easeElasticOut: easeElasticOut, easeElasticInOut: easeElasticInOut, easeBackIn: easeBackIn,
    easeBackOut: easeBackOut, easeBack: easeBack, easeBackInOut: easeBackInOut, easeBounceIn: easeBounceIn, easeBounce: easeBounce, easeBounceOut: easeBounceOut,
    easeBounceInOut: easeBounceInOut, schemeCategory10: schemeCategory10, schemeAccent: schemeAccent, schemeDark2: schemeDark2, schemePaired: schemePaired,
    schemePastel1: schemePastel1, schemePastel2: schemePastel2, schemeSet1: schemeSet1, schemeSet2: schemeSet2, schemeSet3: schemeSet3,
    schemeTableau10: schemeTableau10};

/**
* D3 Slope Chart
*/
var d3piechart = /*@__PURE__*/(function (d3chart) {
    function d3piechart(selection, data, config) {
        d3chart.call(this, selection, data, config, {
            margin: {top: 40, right: 20, bottom: 40, left: 20},
            key: '',
            currentKey: false,
            value: 'value',
            color : {key: false, keys: false, scheme: false, current: '#1f77b4', default: '#AAA', axis: '#000'},
            radius: {inner: false, outter: false},
            transition: {duration: 350, ease: 'easeLinear'}
        });
    }

    if ( d3chart ) d3piechart.__proto__ = d3chart;
    d3piechart.prototype = Object.create( d3chart && d3chart.prototype );
    d3piechart.prototype.constructor = d3piechart;

    /**
    * Init chart
    */
    d3piechart.prototype.initChart = function initChart () {
        var this$1 = this;


        // Set up dimensions
        this.getDimensions();
        this.initChartFrame('piechart');

        this.cScale = d3$4.scaleOrdinal();
        this.arc = d3$4.arc();
        this.outerArc = d3$4.arc();
        this.pie = d3$4.pie().sort(null).value(function (d) { return d[this$1.cfg.value]; });

        if(this.cfg.radius && this.cfg.radius.inner){
            var outRadius = this.cfg.radius.outter ? this.cfg.radius.outter : Math.min(this.cfg.width, this.cfg.height) / 2;
            this.cfg.radius.relation = this.cfg.radius.inner
                ? this.cfg.radius.inner / outRadius
                : 0;
        }

        this.gcenter = this.g.append('g');
        this.setChartDimension();
        this.updateChart();
    };

    /**
    * Set up chart dimensions (non depending on data)
    */
    d3piechart.prototype.setChartDimension = function setChartDimension (){
        // SVG element
        this.svg
            .attr("viewBox", ("0 0 " + (this.cfg.width+this.cfg.margin.left+this.cfg.margin.right) + " " + (this.cfg.height+this.cfg.margin.top+this.cfg.margin.bottom)))
            .attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right)
            .attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom);
        
        // Center element
        this.gcenter
            .attr('transform', ("translate(" + (this.cfg.width/2) + ", " + (this.cfg.height/2) + ")"));
    };

    /**
    * Bind data to main elements groups
    */
    d3piechart.prototype.bindData = function bindData (){
        var this$1 = this;

        this.itemg = this.gcenter.selectAll('.chart__slice-group')
            .data(this.pie(this.data), function (d) { return d.data[this$1.cfg.key]; });

        // Set transition
        this.transition = d3$4.transition('t')
            .duration(this.cfg.transition.duration)
            .ease(d3$4[this.cfg.transition.ease]);
    };

    /**
    * Set up scales
    */
    d3piechart.prototype.setScales = function setScales (){
        var this$1 = this;


        // Set up radius
        this.cfg.radius.outter = this.cfg.radius && this.cfg.radius.outter ? this.cfg.radius.outter : Math.min(this.cfg.width, this.cfg.height) / 2;
        var inRadius = this.cfg.radius && this.cfg.radius.inner ? this.cfg.radius.inner : 0;
        if(this.cfg.radius.relation){
            inRadius = this.cfg.radius.outter * this.cfg.radius.relation;
        }

        // Set up arcs
        this.arc = d3$4.arc().outerRadius(this.cfg.radius.outter).innerRadius(inRadius);
        this.outerArc = d3$4.arc().outerRadius(this.cfg.radius.outter*1.1).innerRadius(this.cfg.radius.outter*1.1);
        
        // Set up pie
        this.pie = d3$4.pie().sort(null).value(function (d) { return d[this$1.cfg.value]; });

        // Set up color scheme
        if(this.cfg.color.scheme){
            if(this.cfg.color.scheme instanceof Array === true){
                this.colorScale = d3$4.scaleOrdinal()
                    .domain(this.data.map(function (d){ return d[this$1.cfg.key]; }))
                    .range(this.cfg.color.scheme);
            }else{
                this.colorScale = d3$4.scaleOrdinal(d3$4[this.cfg.color.scheme])
                    .domain(this.data.map(function (d){ return d[this$1.cfg.key]; }));
            }
        }
    };

    /**
    * Add new chart's elements
    */
    d3piechart.prototype.enterElements = function enterElements (){
        var this$1 = this;


        var newg = this.itemg
            .enter().append('g')
            .attr("class", "chart__slice-group chart__slice-group--piechart");

        // PATHS
        newg.append("path")
            .attr("class", "chart__slice chart__slice--piechart")
            .transition(this.transition)
            .delay(function (d,i) { return i * this$1.cfg.transition.duration; })
            .attrTween('d', function (d) {
                var i = d3$4.interpolate(d.startAngle+0.1, d.endAngle);
                return function (t) {
                    d.endAngle = i(t); 
                    return this$1.arc(d)
                }
            })
            .style("fill", function (d){ return this$1.colorElement(d.data); })
            .style('opacity', 1);

        // LABELS
        newg.append('text')
            .attr("class", "chart__label chart__label--piechart")
            .style('opacity', 0)
            .attr("transform", function (d) {
                var pos = this$1.outerArc.centroid(d);
                pos[0] = this$1.cfg.radius.outter * (this$1.midAngle(d) < Math.PI ? 1.1 : -1.1);
                return "translate("+pos+")";
            })
            .attr('text-anchor', function (d) { return this$1.midAngle(d) < Math.PI ? 'start' : 'end'; })
            .text(function (d) { return d.data[this$1.cfg.key]; })
            .transition(this.transition)
            .delay(function (d,i) { return i * this$1.cfg.transition.duration; })
            .style('opacity', 1);

        // LINES
        newg.append('polyline')
            .attr("class", "chart__line chart__line--piechart")
            .style('opacity', 0)
            .attr('points', function (d) {
                var pos = this$1.outerArc.centroid(d);
                pos[0] = this$1.cfg.radius.outter * 0.95 * (this$1.midAngle(d) < Math.PI ? 1.1 : -1.1);
                return [this$1.arc.centroid(d), this$1.outerArc.centroid(d), pos]
            })
            .transition(this.transition)
            .delay(function (d,i) { return i * this$1.cfg.transition.duration; })
            .style('opacity', 1);
    };

    /**
    * Update chart's elements based on data change
    */
    d3piechart.prototype.updateElements = function updateElements (){
        var this$1 = this;


        // PATHS
        this.itemg.selectAll(".chart__slice")
            .style('opacity', 0)
            .data(this.pie(this.data), function (d){ return d.data[this$1.cfg.key]; })
            .transition(this.transition)
            .delay(function (d,i) { return i * this$1.cfg.transition.duration; })
            .attrTween('d', function (d) {
                var i = d3$4.interpolate(d.startAngle+0.1, d.endAngle);
                return function (t) {
                    d.endAngle = i(t); 
                    return this$1.arc(d)
                }
            })
            .style("fill", function (d){ return this$1.colorElement(d.data); })
            .style('opacity', 1);

        // LABELS
        this.itemg.selectAll(".chart__label")
            .data(this.pie(this.data), function (d){ return d.data[this$1.cfg.key]; })
            .text(function (d) { return d.data[this$1.cfg.key]; })
            .transition(this.transition)
            .attr("transform", function (d) {
                var pos = this$1.outerArc.centroid(d);
                pos[0] = this$1.cfg.radius.outter * (this$1.midAngle(d) < Math.PI ? 1.1 : -1.1);
                return "translate("+pos+")";
            })
            .attr('text-anchor', function (d) { return this$1.midAngle(d) < Math.PI ? 'start' : 'end'; });

        // LINES
        this.itemg.selectAll(".chart__line")
            .data(this.pie(this.data), function (d){ return d.data[this$1.cfg.key]; })
            .transition(this.transition)
            .attr('points', function (d) {
                var pos = this$1.outerArc.centroid(d);
                pos[0] = this$1.cfg.radius.outter * 0.95 * (this$1.midAngle(d) < Math.PI ? 1.1 : -1.1);
                return [this$1.arc.centroid(d), this$1.outerArc.centroid(d), pos]
            });
    };

    /**
    * Remove chart's elements without data
    */
    d3piechart.prototype.exitElements = function exitElements (){
        this.itemg.exit()
            .transition(this.transition)
            .style("opacity", 0)
            .remove();
    };

    d3piechart.prototype.midAngle = function midAngle (d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    };

    /**
    * Store the displayed angles in _current.
    * Then, interpolate from _current to the new angles.
    * During the transition, _current is updated in-place by d3.interpolate.
    */
    d3piechart.prototype.arcTween = function arcTween (a) {
      var this$1 = this;

      var i = d3$4.interpolate(this._current, a);
      this._current = i(0);
      return function (t) { return this$1.arc(i(t)); } ;
    };

    return d3piechart;
}(d3chart));

var script$4 = {
  name: 'D3PieChart',
  extends: D3Chart,
  mounted: function mounted() {
    this.chart = new d3piechart(
      this.$refs.chart,
      JSON.parse(JSON.stringify(this.datum)),
      this.config
    );
  },
};

/* script */
var __vue_script__$4 = script$4;

/* template */

  /* style */
  var __vue_inject_styles__$4 = function (inject) {
    if (!inject) { return }
    inject("data-v-ac66c84e_0", { source: ".chart__wrapper{margin:20px 0}.chart__wrap{margin:0}.chart__title{text-align:center;font-weight:700}.chart__source{font-size:12px}.chart__tooltip{position:absolute;pointer-events:none;display:none}.chart__tooltip.active{display:block}.chart__tooltip>div{background:#2b2b2b;color:#fff;padding:6px 10px;border-radius:3px}.chart__axis{font-size:12px;shape-rendering:crispEdges}.chart__grid .domain{stroke:none;fill:none}.chart__grid .tick line{opacity:.2}.chart__label{font-size:12px}.chart .clickable{cursor:pointer}.chart--piechart .chart__line{fill:none;stroke:#000}", map: undefined, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__$4 = undefined;
  /* module identifier */
  var __vue_module_identifier__$4 = undefined;
  /* functional template */
  var __vue_is_functional_template__$4 = undefined;
  /* style inject SSR */
  

  
  var D3PieChart = normalizeComponent_1(
    {},
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    browser,
    undefined
  );

var d3$5 = {select: select, selectAll: selectAll, scaleLinear: scaleLinear, scaleOrdinal: scaleOrdinal, scaleSqrt: scaleSqrt, hierarchy: hierarchy,
    partition: partition, arc: arc, transition: transition, interpolate: interpolate,
    easeLinear: easeLinear, easePolyIn: easePolyIn, easePolyOut: easePolyOut, easePoly: easePoly,
    easePolyInOut: easePolyInOut, easeQuadIn: easeQuadIn, easeQuadOut: easeQuadOut, easeQuad: easeQuad, easeQuadInOut: easeQuadInOut,
    easeCubicIn: easeCubicIn, easeCubicOut: easeCubicOut, easeCubic: easeCubic, easeCubicInOut: easeCubicInOut, easeSinIn: easeSinIn,
    easeSinOut: easeSinOut, easeSin: easeSin, easeSinInOut: easeSinInOut, easeExpIn: easeExpIn, easeExpOut: easeExpOut, easeExp: easeExp,
    easeExpInOut: easeExpInOut, easeCircleIn: easeCircleIn, easeCircleOut: easeCircleOut, easeCircle: easeCircle, easeCircleInOut: easeCircleInOut,
    easeElasticIn: easeElasticIn, easeElastic: easeElastic, easeElasticOut: easeElasticOut, easeElasticInOut: easeElasticInOut, easeBackIn: easeBackIn,
    easeBackOut: easeBackOut, easeBack: easeBack, easeBackInOut: easeBackInOut, easeBounceIn: easeBounceIn, easeBounce: easeBounce,
    easeBounceOut: easeBounceOut, easeBounceInOut: easeBounceInOut,
    schemeCategory10: schemeCategory10, schemeAccent: schemeAccent, schemeDark2: schemeDark2, schemePaired: schemePaired,
    schemePastel1: schemePastel1, schemePastel2: schemePastel2, schemeSet1: schemeSet1, schemeSet2: schemeSet2, schemeSet3: schemeSet3,
    schemeTableau10: schemeTableau10
};

/**
* D3 Sunburst
*/
var d3sunburst = /*@__PURE__*/(function (d3chart) {
  function d3sunburst(selection, data, config) {
    d3chart.call(this, selection, data, config, {
      margin: {top: 20, right: 20, bottom: 20, left: 20},
      key: '',
      value: '',
      color : {key: false, keys: false, scheme: false, current: '#1f77b4', default: '#AAA', axis: '#000'},
      transition: {duration: 350, ease: 'easeLinear'},
    });
  }

  if ( d3chart ) d3sunburst.__proto__ = d3chart;
  d3sunburst.prototype = Object.create( d3chart && d3chart.prototype );
  d3sunburst.prototype.constructor = d3sunburst;

  /**
  * Init chart
  */
  d3sunburst.prototype.initChart = function initChart () {

    // Set up dimensions
    this.getDimensions();
    this.initChartFrame('sunburst');

    // Center group
    this.gcenter = this.g.append('g');

    this.setChartDimension();
    this.updateChart();
  };

  /**
  * Set up chart dimensions (non depending on data)
  */
  d3sunburst.prototype.setChartDimension = function setChartDimension (){
    // SVG element
    this.svg
      .attr("viewBox", ("0 0 " + (this.cfg.width+this.cfg.margin.left+this.cfg.margin.right) + " " + (this.cfg.height+this.cfg.margin.top+this.cfg.margin.bottom)))
      .attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right)
      .attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom);

    // Center group
    this.gcenter
      .attr('transform', ("translate(" + (this.cfg.width/2) + ", " + (this.cfg.height/2) + ")"));
  };

  /**
  * Bind data to main elements groups
  */
  d3sunburst.prototype.bindData = function bindData (){
    var this$1 = this;

    var partition = function (data) {
      var root = d3$5.hierarchy(data)
          .sum(function (d) { return d[this$1.cfg.value]; });
      return d3$5.partition()(root);
    };

    this.hData = partition(this.data[0]).descendants();

    this.itemg = this.gcenter.selectAll('.chart__slice-group')
      .data(this.hData, function (d) { return d.data[this$1.cfg.key]; });

    // Set transition
    this.transition = d3$5.transition('t')
        .duration(this.cfg.transition.duration)
        .ease(d3$5[this.cfg.transition.ease]);
  };

  /**
  * Set up scales
  */
  d3sunburst.prototype.setScales = function setScales (){
    var this$1 = this;


    this.radius = Math.min(this.cfg.width, this.cfg.height)/2;

    this.xScale = d3$5.scaleLinear()
      .range([0, 2*Math.PI])
      .clamp(true);

    this.yScale = d3$5.scaleSqrt()
      .range([this.radius*.1, this.radius]);

    this.arc = d3$5.arc()
      .startAngle(function (d) { return this$1.xScale(d.x0); })
      .endAngle(function (d) { return this$1.xScale(d.x1); })
      .innerRadius(function (d) { return Math.max(0, this$1.yScale(d.y0)); })
      .outerRadius(function (d) { return Math.max(0, this$1.yScale(d.y1)); });

    // Set up color scheme
    if(this.cfg.color.scheme){
      if(this.cfg.color.scheme instanceof Array === true){
        this.colorScale = d3$5.scaleOrdinal()
          .range(this.cfg.color.scheme);
      }else{
        this.colorScale = d3$5.scaleOrdinal(d3$5[this.cfg.color.scheme]);
      }
    }
  };

  /**
  * Add new chart's elements
  */
  d3sunburst.prototype.enterElements = function enterElements (){
    var this$1 = this;


    var newg = this.itemg
      .enter().append('g')
      .attr("class", "chart__slice-group chart__slice-group--sunburst clickable")
      .on('click', function (d) {
        window.event.stopPropagation();
        this$1.focusOn(d);
      });

    // PATHS
    newg.append("path")
      .attr("class", "chart__slice chart__slice--sunburst")
      .style("fill", function (d) { return this$1.colorElement(d.data); })
      .on('mouseover', function (d) {
       this$1.tooltip.html(function () {
         return ("<div>" + (d.data[this$1.cfg.key]) + ": " + (d.value) + "</div>")
       })
       .classed('active', true);
      })
      .on('mouseout', function () {
       this$1.tooltip.classed('active', false);
      })
      .on('mousemove', function () {
       this$1.tooltip
         .style('left', window.event['pageX'] - 28 + 'px')
         .style('top', window.event['pageY'] - 40 + 'px');
      })
      .transition(this.transition)
      .attrTween('d', function (d) {
        var iy0 = d3$5.interpolate(0, d.y0);
        var iy1 = d3$5.interpolate(d.y0, d.y1);
        var ix0 = d3$5.interpolate(0, d.x0);
        var ix1 = d3$5.interpolate(0, d.x1);
        return function (t) {
          d.y0 = iy0(t);
          d.y1 = iy1(t);
          d.x0 = ix0(t);
          d.x1 = ix1(t);
          return this$1.arc(d)
        }
      });

  };

  /**
  * Update chart's elements based on data change
  */
  d3sunburst.prototype.updateElements = function updateElements (){
    var this$1 = this;

    this.itemg.selectAll('.chart__slice')
      .transition(this.transition)
      .attrTween('d', function (d) {
        var d2 = this$1.hData.filter(function (j) { return j.data.name === d.data.name; })[0];
        var iy0 = d3$5.interpolate(d.y0, d2.y0);
        var iy1 = d3$5.interpolate(d.y1, d2.y1);
        var ix0 = d3$5.interpolate(d.x0, d2.x0);
        var ix1 = d3$5.interpolate(d.x1, d2.x1);
        return function (t) {
          d2.y0 = iy0(t);
          d2.y1 = iy1(t);
          d2.x0 = ix0(t);
          d2.x1 = ix1(t);
          return this$1.arc(d2)
        }
      })
      .style("fill", function (d) { return this$1.colorElement(d.data); });
  };

  /**
  * Remove chart's elements without data
  */
  d3sunburst.prototype.exitElements = function exitElements (){
    this.itemg.exit()
      .transition(this.transition)
      .style("opacity", 0)
      .remove();
  };

  /**
  * Check if text fits in available space
  */
  d3sunburst.prototype.textFits = function textFits (d){
      var deltaAngle = this.xScale(d.x1) - this.xScale(d.x0);
      var r = Math.max(0, (this.yScale(d.y0) + this.yScale(d.y1)) / 2);
      return d.data[this.cfg.key].length * this.cfg.charSpace < r * deltaAngle;
  };

  /**
  * Transition slice on focus
  */
  d3sunburst.prototype.focusOn = function focusOn (d){
      var this$1 = this;

      var d2 = this.hData.filter(function (j) { return j.data.name === d.data.name; })[0];
      var transition = this.svg.transition()
        .duration(this.cfg.transition.duration)
        .ease(d3$5[this.cfg.transition.ease])
        .tween('scale', function () {
          var xd = d3$5.interpolate(this$1.xScale.domain(), [d2.x0, d2.x1]);
          var yd = d3$5.interpolate(this$1.yScale.domain(), [d2.y0, 1]);
          return function (t) {
            this$1.xScale.domain(xd(t));
            this$1.yScale.domain(yd(t));
          };
        });

      transition.selectAll('.chart__slice')
        .attrTween('d', function (d) { return function () {
          var d3 = this$1.hData.filter(function (j) { return j.data.name === d.data.name; })[0];
          return this$1.arc(d3)
        }; });
  };

  return d3sunburst;
}(d3chart));

var script$5 = {
  name: 'D3Sunburst',
  extends: D3Chart,
  mounted: function mounted() {
    this.chart = new d3sunburst(
      this.$refs.chart,
      JSON.parse(JSON.stringify(this.datum)),
      this.config
    );
  },
};

/* script */
var __vue_script__$5 = script$5;

/* template */

  /* style */
  var __vue_inject_styles__$5 = undefined;
  /* scoped */
  var __vue_scope_id__$5 = undefined;
  /* module identifier */
  var __vue_module_identifier__$5 = undefined;
  /* functional template */
  var __vue_is_functional_template__$5 = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var D3Sunburst = normalizeComponent_1(
    {},
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    undefined,
    undefined
  );

var d3$6 = { select: select, selectAll: selectAll, scaleOrdinal: scaleOrdinal, scaleLinear: scaleLinear, max: max, extent: extent, transition: transition, cloud: cloud,
  easeLinear: easeLinear, easePolyIn: easePolyIn, easePolyOut: easePolyOut, easePoly: easePoly, easePolyInOut: easePolyInOut,
  easeQuadIn: easeQuadIn, easeQuadOut: easeQuadOut, easeQuad: easeQuad, easeQuadInOut: easeQuadInOut, easeCubicIn: easeCubicIn,
  easeCubicOut: easeCubicOut, easeCubic: easeCubic, easeCubicInOut: easeCubicInOut, easeSinIn: easeSinIn, easeSinOut: easeSinOut,
  easeSin: easeSin, easeSinInOut: easeSinInOut, easeExpIn: easeExpIn, easeExpOut: easeExpOut, easeExp: easeExp,
  easeExpInOut: easeExpInOut, easeCircleIn: easeCircleIn, easeCircleOut: easeCircleOut, easeCircle: easeCircle,
  easeCircleInOut: easeCircleInOut, easeElasticIn: easeElasticIn, easeElastic: easeElastic, easeElasticOut: easeElasticOut,
  easeElasticInOut: easeElasticInOut, easeBackIn: easeBackIn, easeBackOut: easeBackOut, easeBack: easeBack, easeBackInOut: easeBackInOut,
  easeBounceIn: easeBounceIn, easeBounce: easeBounce, easeBounceOut: easeBounceOut, easeBounceInOut: easeBounceInOut,
  schemeCategory10: schemeCategory10, schemeAccent: schemeAccent, schemeDark2: schemeDark2, schemePaired: schemePaired, schemePastel1: schemePastel1, schemePastel2: schemePastel2,
  schemeSet1: schemeSet1, schemeSet2: schemeSet2, schemeSet3: schemeSet3, schemeTableau10: schemeTableau10 };

/**
 * D3 Words Cloud
 */
var d3wordscloud = /*@__PURE__*/(function (d3chart) {
  function d3wordscloud(selection, data, config) {
    d3chart.call(this, selection, data, config, {
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      key: 'word',
      value: 'size',
      fontFamily: 'Arial',
      angle: {steps: 2, start: 0, end: 90},
      color: { key: false, keys: false, scheme: false, current: '#1f77b4', default: '#AAA', axis: '#000' },
      transition: { duration: 350, ease: 'easeLinear' }
    });
  }

  if ( d3chart ) d3wordscloud.__proto__ = d3chart;
  d3wordscloud.prototype = Object.create( d3chart && d3chart.prototype );
  d3wordscloud.prototype.constructor = d3wordscloud;

  /**
  * Init chart
  */
  d3wordscloud.prototype.initChart = function initChart () {
    // Set up dimensions
    this.getDimensions();
    this.initChartFrame('wordscloud');

    this.gcenter = this.g.append('g');

    this.setChartDimension();
    this.updateChart();
  };

  /**
  * Compute data before operate
  */
  d3wordscloud.prototype.computeData = function computeData (){
    var this$1 = this;

    var layout = d3$6.cloud()
      .size([ this.cfg.width, this.cfg.height ])
      .words(this.data.map(function (d) { return ({
        text: d[this$1.cfg.key],
        size: d[this$1.cfg.value],
      }); }))
      .rotate(function () { return this$1.wordsAngle(this$1.cfg.angle); })
      .font(this.cfg.fontFamily)
      .fontSize(function (d) { return d.size; })
      .on("end", function (d) { this$1.tData = d; })
      .start();
  };  

  /**
   * Set up chart dimensions (non depending on data)
   */
  d3wordscloud.prototype.setChartDimension = function setChartDimension () {
    // Resize SVG element
    this.svg
      .attr("viewBox", ("0 0 " + (this.cfg.width+this.cfg.margin.left+this.cfg.margin.right) + " " + (this.cfg.height+this.cfg.margin.top+this.cfg.margin.bottom)))
      .attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right)
      .attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom);

    // Center element
    this.gcenter.attr('transform', ("translate(" + (this.cfg.width/2) + ", " + (this.cfg.height/2) + ")"));
  };

  /**
   * Bind data to main elements groups
   */
  d3wordscloud.prototype.bindData = function bindData () {
    // Set transition
    this.transition = d3$6.transition('t')
      .duration(this.cfg.transition.duration)
      .ease(d3$6[this.cfg.transition.ease]);

    // Word group selection data
    this.wordgroup = this.gcenter
      .selectAll(".chart__word-group")
      .data(this.tData, function (d) { return d.text; });
  };

  /**
   * Set up scales
   */
  d3wordscloud.prototype.setScales = function setScales () {
    if (this.cfg.color.scheme instanceof Array === true) {
      this.colorScale = d3$6.scaleOrdinal().range(this.cfg.color.scheme);
    } else if (typeof this.cfg.color.scheme === 'string') {
      this.colorScale = d3$6.scaleOrdinal(d3$6[this.cfg.color.scheme]);
    }
  };


  /**
   * Add new chart's elements
   */
  d3wordscloud.prototype.enterElements = function enterElements () {
    var this$1 = this;


    // Elements to add
    var newwords = this.wordgroup
      .enter().append('g')
      .attr("class", "chart__word-group chart__word-group--wordscloud");

    newwords.append("text")
      .style("font-size", function (d) { return d.size + "px"; })
      .style("font-family", function (d) { return d.font; })
      .attr("text-anchor", "middle")
      .attr('fill', function (d) { return this$1.colorElement(d, 'text'); })
      .attr("transform", function (d) { return ("translate(" + ([d.x, d.y]) + ")rotate(" + (d.rotate) + ")"); })
      .text(function (d) { return d.text; });
  };

  /**
   * Update chart's elements based on data change
   */
  d3wordscloud.prototype.updateElements = function updateElements () {
    var this$1 = this;

    this.wordgroup.selectAll('text')
      .data(this.tData, function (d) { return d.text; })
      .transition(this.transition)
      .attr('fill', function (d) { return this$1.colorElement(d, 'text'); })
      .style("font-size", function (d) { return d.size + "px"; })
      .attr("transform", function (d) { return ("translate(" + ([d.x, d.y]) + ")rotate(" + (d.rotate) + ")"); });
  };

  /**
   * Remove chart's elements without data
   */
  d3wordscloud.prototype.exitElements = function exitElements () {
    this.wordgroup.exit()
      .transition(this.transition)
      .style("opacity", 0)
      .remove();
  };

  /**
   * Word's angle
   */
  d3wordscloud.prototype.wordsAngle = function wordsAngle (angle) {
    if (typeof this.cfg.angle === 'number') {
      // Config angle is fixed number
      return this.cfg.angle;
    } else if (typeof this.cfg.angle === 'object') {
      if (this.cfg.angle instanceof Array === true) {
        // Config angle is custom array
        var idx = this.randomInt(0, this.cfg.angle.length-1);
        return this.cfg.angle[idx];
      } else {
        // Config angle is custom object
        var angle$1 = (this.cfg.angle.end - this.cfg.angle.start) / (this.cfg.angle.steps - 1);
        return this.cfg.angle.start + (this.randomInt(0, this.cfg.angle.steps) * angle$1);
      }
    }
    return 0;
  };

  d3wordscloud.prototype.randomInt = function randomInt (min, max) {
    var i = Math.ceil(min);
    var j = Math.floor(max);
    return Math.floor(Math.random() * (j - i + 1)) + i;
  };

  return d3wordscloud;
}(d3chart));

var script$6 = {
  name: 'D3WordsCloud',
  extends: D3Chart,
  mounted: function mounted() {
    this.chart = new d3wordscloud(
      this.$refs.chart,
      JSON.parse(JSON.stringify(this.datum)),
      this.config
    );
  },
};

/* script */
var __vue_script__$6 = script$6;

/* template */

  /* style */
  var __vue_inject_styles__$6 = undefined;
  /* scoped */
  var __vue_scope_id__$6 = undefined;
  /* module identifier */
  var __vue_module_identifier__$6 = undefined;
  /* functional template */
  var __vue_is_functional_template__$6 = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var D3WordsCloud = normalizeComponent_1(
    {},
    __vue_inject_styles__$6,
    __vue_script__$6,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    undefined,
    undefined
  );

var Components = {
    D3BarChart: D3BarChart,
    D3LineChart: D3LineChart,
    D3SlopeChart: D3SlopeChart,
    D3PieChart: D3PieChart,
    D3Sunburst: D3Sunburst,
    D3WordsCloud: D3WordsCloud,
};

Object.keys(Components).forEach(function (name) {
    Vue.component(name, Components[name]);
});

export default Components;
