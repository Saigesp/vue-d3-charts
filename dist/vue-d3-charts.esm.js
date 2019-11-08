import Vue from 'vue';
import { select, selectAll } from 'd3-selection';
import { scaleBand, scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';

var d3 = {
    select: select, selectAll: selectAll,
    scaleBand: scaleBand, scaleLinear: scaleLinear,
    max: max,
    axisBottom: axisBottom, axisLeft: axisLeft,
};

var d3barchart = function d3barchart(selection, data, config) {
    var this$1 = this;
    if ( config === void 0 ) config = {};

    this.selection = d3.select(selection);
    this.data = data;

    // Default configuration
    this.cfg = {
        margin: {top: 10, right: 30, bottom: 20, left: 40},
        key: 'key',
        value: 'value',
        labelRotation: 0,
        color: 'steelblue',
        yAxis: '',
        yScaleTicks: 5,
        yScaleFormat: '.0f',
    };

    // Set up configuration
    Object.keys(config).forEach(function (key){
        if(config[key] instanceof Object && config[key] instanceof Array === false){
            Object.keys(config[key]).forEach(function (sk){
                this$1.cfg[key][sk] = config[key][sk];
            });
        } else { this$1.cfg[key] = config[key]; }
    });

    // Set up dimensions
    this.cfg.width = parseInt(this.selection.node().offsetWidth) - this.cfg.margin.left - this.cfg.margin.right;
    this.cfg.height = parseInt(this.selection.node().offsetHeight)- this.cfg.margin.top - this.cfg.margin.bottom;

    // Set up scales domain
    this.xScale = d3.scaleBand().rangeRound([0, this.cfg.width]).padding(0.1);
    this.yScale = d3.scaleLinear().rangeRound([0, this.cfg.height]);

    // Resize listener
    window.addEventListener("resize", function (_) {
        this$1.resize();
    });

    this.initGraph();
};
d3barchart.prototype.initGraph = function initGraph () {
        var this$1 = this;


    this.xScale.domain(this.data.map(function (d){ return d[this$1.cfg.key]; } ));
    this.yScale.domain([d3.max(this.data, function (d){ return +d[this$1.cfg.value]; }),0]);

    // Wrapper div
    this.wrap = this.selection.append('div') 
        .attr("class", "chart__wrap chart__wrap--barchart");

    // SVG element
    this.svg = this.wrap.append('svg')
        .attr("class", "chart chart--barchart")
        .attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right)
        .attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom);

    // General group for margin convention
    this.g = this.svg.append("g")
        .attr('class', 'chart__margin-wrap')
        .attr("transform", ("translate(" + (this.cfg.margin.left) + "," + (this.cfg.margin.top) + ")"));

    // Axis group
    this.axisg = this.g.append('g')
        .attr('class', 'chart__axis chart__axis--barchart');

    // Horizontal grid
    this.yGrid = this.axisg.append("g")           
        .attr("class", "chart__grid chart__grid--y chart__grid--barchart")
        .call(
            this.make_y_gridlines()
                .tickSize(-this.cfg.width)
                .ticks(this.cfg.yScaleTicks, this.cfg.yScaleFormat)
            );

    // Vertical axis title
    if(this.cfg.yAxis)
    { this.yAxisTitle = this.axisg.append('text')
        .attr('class', 'chart__axis-title chart__axis-title--barchart')
        .attr("y", -this.cfg.margin.left+10)
        .attr("x", -this.cfg.height/2)
        .attr("transform", 'rotate(-90)')
        .style("text-anchor", "middle")
        .text(this.cfg.yAxis); }

    // Bottom axis
    this.xAxis = this.axisg.append("g")
        .attr("class", "chart__axis-x chart__axis-x--barchart")
        .attr("transform", "translate(0," + this.cfg.height + ")")
        .call(d3.axisBottom(this.xScale));

    // Bottom axis label rotation
    if(this.cfg.labelRotation!=0)
    { this.xAxis.selectAll('text')
        .attr("y", Math.cos(this.cfg.labelRotation*Math.PI/180)*9)
        .attr("x", Math.sin(this.cfg.labelRotation*Math.PI/180)*9)
        .attr("dy", ".35em")
        .attr("transform", ("rotate(" + (this.cfg.labelRotation) + ")"))
        .style("text-anchor", "start"); }

    // Tooltip
    this.selection.selectAll('.chart__tooltip').remove();
    this.tooltip = this.wrap
        .append('div')
        .attr('class', 'chart__tooltip chart__tooltip--barchart');

    // Bars groups
    this.itemg = this.g.selectAll('.itemgroup')
        .data(this.data)
        .enter().append('g')
        .attr('class', 'itemgroup')
        .attr('transform', function (d, i) { return ("translate(" + (this$1.xScale(d[this$1.cfg.key])) + ",0)"); });

    // Bars
    this.rects = this.itemg.append('rect')
        .attr('x', 0)
        .attr('y', function (d, i) { return this$1.yScale(+d[this$1.cfg.value]); })
        .attr('width', this.xScale.bandwidth())
        .attr('height', function (d) { return this$1.cfg.height - this$1.yScale(+d[this$1.cfg.value]); })
        .attr('fill', function (d) {
            return !this$1.cfg.currentkey || d[this$1.cfg.key] == this$1.cfg.currentkey ? this$1.cfg.color : this$1.cfg.greycolor;
        })
        .on('mouseover', function (d) {
            this$1.tooltip.html(function () {
                return ("\n                        <div>" + (d[this$1.cfg.key]) + ": " + (d[this$1.cfg.value]) + "</div>\n                    ")
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

d3barchart.prototype.resize = function resize (){
        var this$1 = this;

    // Get dimensions
    this.cfg.width = parseInt(this.selection.node().offsetWidth) - this.cfg.margin.left - this.cfg.margin.right;
    this.cfg.height = parseInt(this.selection.node().offsetHeight)- this.cfg.margin.top - this.cfg.margin.bottom;

    // Set up scales
    this.xScale.rangeRound([0, this.cfg.width]);
    this.yScale.rangeRound([0, this.cfg.height]);

    // SVG element
    this.svg
        .attr("viewBox", ("0 0 " + (this.cfg.width + this.cfg.margin.left + this.cfg.margin.right) + " " + (this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom)))
        .attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right)
        .attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom);

    // Horizontal grid
    this.yGrid
        .call(
            this.make_y_gridlines()
                .tickSize(-this.cfg.width)
                .ticks(this.cfg.yScaleTicks, this.cfg.yScaleFormat)
        );
        
    // Bottom axis
    this.xAxis
        .attr("transform", ("translate(0," + (this.cfg.height) + ")"))
        .call(d3.axisBottom(this.xScale));

    // Vertical axis title
    if(this.cfg.yAxis)
    { this.yAxisTitle
        .attr("x", -this.cfg.height/2); }

    // Bars groups
    this.itemg.attr('transform', function (d) { return ("translate(" + (this$1.xScale(d[this$1.cfg.key])) + ",0)"); });

    // Bars
    this.rects
        .attr('width', this.xScale.bandwidth())
        .attr('y', function (d) { return this$1.yScale(+d[this$1.cfg.value]); })
        .attr('height', function (d) { return this$1.cfg.height - this$1.yScale(+d[this$1.cfg.value]); } );
};

// Gridlines in x axis function
d3barchart.prototype.make_x_gridlines = function make_x_gridlines () {       
    return d3.axisBottom(this.xScale);
};

// Gridlines in y axis function
d3barchart.prototype.make_y_gridlines = function make_y_gridlines () {       
    return d3.axisLeft(this.yScale);
};

//

var script = {
    name: 'D3BarChart',
    data: function(){
        return {
            chart: {},
        }
    },
    props: {
        config: {
            type: Object,
            required: true,
            default: function (){
                return {};
            }
        },
        datum: {
            type: Array,
            required: true,
            default: function (){
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
            type: Number,
            default: 300,
        }
    },
    mounted: function(){
        this.chart = new d3barchart(
            this.$refs.chart,
            this.datum,
            this.config
        );
    }
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
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"chart__wrapper"},[(_vm.title)?_c('div',{staticClass:"chart__title"},[_vm._v(_vm._s(_vm.title))]):_vm._e(),_vm._v(" "),_c('div',{ref:"chart",style:({height: ((this.height) + "px")})}),_vm._v(" "),(_vm.source)?_c('div',{staticClass:"chart__source"},[_vm._v(_vm._s(_vm.source))]):_vm._e()])};
var __vue_staticRenderFns__ = [];

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-199fee6e_0", { source: ".chart__wrapper{margin:20px 0}.chart__wrap{margin:0}.chart__title{text-align:center;font-weight:700}.chart__source{font-size:12px}.chart__tooltip{position:absolute;pointer-events:none;display:none}.chart__tooltip.active{display:block}.chart__tooltip>div{background:#2b2b2b;color:#fff;padding:6px 10px;border-radius:3px}.chart__axis{font-size:12px}.chart__grid .domain{stroke:none;fill:none}.chart__grid .tick line{opacity:.2}", map: undefined, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var D3BarChart = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

//
//
//
//
//
//

var script$1 = {
  name: 'D3LineChart',
};

/* script */
var __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_vm._v("\n  D3LineChart\n")])};
var __vue_staticRenderFns__$1 = [];

  /* style */
  var __vue_inject_styles__$1 = undefined;
  /* scoped */
  var __vue_scope_id__$1 = undefined;
  /* module identifier */
  var __vue_module_identifier__$1 = undefined;
  /* functional template */
  var __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var D3LineChart = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    undefined,
    undefined
  );

var Components = {
    D3BarChart: D3BarChart,
    D3LineChart: D3LineChart
};

Object.keys(Components).forEach(function (name) {
    Vue.component(name, Components[name]);
});

export default Components;
