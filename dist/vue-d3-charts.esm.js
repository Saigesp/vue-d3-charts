import Vue from 'vue';
import { select, selectAll } from 'd3-selection';
import { scaleBand, scaleLinear, scaleOrdinal, scaleTime } from 'd3-scale';
import { max, extent, min } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { timeParse, timeFormat } from 'd3-time-format';
import { line, curveBasis, curveBundle, curveCardinal, curveCatmullRom, curveLinear, curveMonotoneX, curveMonotoneY, curveNatural, curveStep, curveStepAfter, curveStepBefore } from 'd3-shape';
import { schemeCategory10, schemeAccent, schemeDark2, schemePaired, schemePastel1, schemePastel2, schemeSet1, schemeSet2, schemeSet3, schemeTableau10 } from 'd3-scale-chromatic';
import { transition } from 'd3-transition';

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
    this.redraw = function () {
        this$1.draw();
    };
    window.addEventListener("resize", this.redraw);

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

d3barchart.prototype.draw = function draw (){
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

d3barchart.prototype.destroy = function destroy (){
    window.removeEventListener("resize", this.redraw);
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
    },
    beforeDestroy: function(){
        this.chart.destroy();
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
    inject("data-v-04721bf6_0", { source: ".chart__wrapper{margin:20px 0}.chart__wrap{margin:0}.chart__title{text-align:center;font-weight:700}.chart__source{font-size:12px}.chart__tooltip{position:absolute;pointer-events:none;display:none}.chart__tooltip.active{display:block}.chart__tooltip>div{background:#2b2b2b;color:#fff;padding:6px 10px;border-radius:3px}.chart__axis{font-size:12px;shape-rendering:crispEdges}.chart__grid .domain{stroke:none;fill:none}.chart__grid .tick line{opacity:.2}.chart__label{font-size:12px}", map: undefined, media: undefined });

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

var d3$1 = {
    select: select, selectAll: selectAll,
    scaleOrdinal: scaleOrdinal, scaleLinear: scaleLinear, scaleTime: scaleTime,
    timeParse: timeParse, timeFormat: timeFormat,
    max: max, extent: extent,
    line: line,
    axisLeft: axisLeft, axisBottom: axisBottom,
    curveBasis: curveBasis, curveBundle: curveBundle, curveCardinal: curveCardinal, curveCatmullRom: curveCatmullRom, curveLinear: curveLinear, curveMonotoneX: curveMonotoneX,
    curveMonotoneY: curveMonotoneY, curveNatural: curveNatural, curveStep: curveStep, curveStepAfter: curveStepAfter, curveStepBefore: curveStepBefore,
    schemeCategory10: schemeCategory10, schemeAccent: schemeAccent, schemeDark2: schemeDark2, schemePaired: schemePaired, schemePastel1: schemePastel1,
    schemePastel2: schemePastel2, schemeSet1: schemeSet1, schemeSet2: schemeSet2, schemeSet3: schemeSet3, schemeTableau10: schemeTableau10,
};


var d3linechart = function d3linechart(selection, data, config) {
    var this$1 = this;
    if ( config === void 0 ) config = {};

    this.selection = d3$1.select(selection);
    this.data = data;

    // Default configuration
    this.cfg = {
        margin: {top: 16, right: 30, bottom: 20, left: 40},
        keys: ['key'], // Values to compute
        labels: false, // Labels to display
        dateField: 'date',
        dateFormat: '%Y-%m-%d', // https://github.com/d3/d3-time-format/blob/master/README.md#locale_format
        dateFormatOutput: '%Y-%m-%d', // https://github.com/d3/d3-time-format/blob/master/README.md#locale_format
        colorScheme: 'schemeCategory10', // More schemes in https://github.com/d3/d3-scale-chromatic
        colorKeys: {},
        curve: 'curveLinear', // More examples in https://bl.ocks.org/d3noob/ced1b9b18bd8192d2c898884033b5529
        pointRadius: 3,
        pointHoverRadius: 6,
        yAxis: '', // Vertical axis title
        xScaleTicks: 3, // Horizontal axis divisions 
        xScaleFormat: '%Y-%m-%d', // Horizontal axis format
        yScaleTicks: 5, // Vertical axis divisions 
        yScaleFormat: '.0f', // Vertical axis format. More on https://github.com/d3/d3-format
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

    // Set up color scheme
    if(this.cfg.colorScheme instanceof Array === true){
        this.colorScale = d3$1.scaleOrdinal().range(this.cfg.colorScheme);
    }else{
        this.colorScale = d3$1.scaleOrdinal(d3$1[this.cfg.colorScheme]);
    }

    // Format date functions
    this.parseTime = d3$1.timeParse(this.cfg.dateFormat);
    this.formatTime = d3$1.timeFormat(this.cfg.dateFormatOutput);

    // Calcule transpose data
    this.tdata = [];
    this.cfg.keys.forEach(function (j,i){
        this$1.tdata[i] = {};
        this$1.tdata[i].key = j;
        this$1.tdata[i].values = [];
    });

    this.data.forEach(function (d){ d.jsdate = this$1.parseTime(d[this$1.cfg.dateField]);});
    this.data.sort(function (a,b){ return b.jsdate - a.jsdate; });

    this.data.forEach(function (d) {
        d.min =  9999999999;
        d.max = -9999999999;
        this$1.cfg.keys.forEach(function (j, i){
            this$1.tdata[i].values.push({x: d.jsdate, y: +d[j], k: i});
            if (d[j] < d.min) { d.min = +d[j]; }
            if (d[j] > d.max) { d.max = +d[j]; }
        });
    });

    // Calcule vertical scale
    this.yScale = d3$1.scaleLinear()
        .domain([0, d3$1.max(this.data, function (d) { return d.max; } )])
        .rangeRound([this.cfg.height, 0]);

    // Calcule horizontal scale
    this.xScale = d3$1.scaleTime()
        .domain(d3$1.extent(this.data, function (d) { return d.jsdate; }))
        .rangeRound([0, this.cfg.width]);

    // Set up line function
    this.line = d3$1.line()
        .curve(d3$1[this.cfg.curve])
        .x(function (d) { return this$1.xScale(d.x); })
        .y(function (d) { return this$1.yScale(d.y); });

    // Resize listener
    this.redraw = function () { this$1.draw(); };
    window.addEventListener("resize", this.redraw);

    this.initGraph();
};

d3linechart.prototype.initGraph = function initGraph () {
        var this$1 = this;


    // Wrapper div
    this.wrap = this.selection.append('div') 
        .attr("class", "chart__wrap chart__wrap--linechart");

    // SVG element
    this.svg = this.wrap.append('svg')
        .attr("class", "chart chart--linechart")
        .attr("viewBox", ("0 0 " + (this.cfg.width+this.cfg.margin.left+this.cfg.margin.right) + " " + (this.cfg.height+this.cfg.margin.top+this.cfg.margin.bottom)))
        .attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right)
        .attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom);

    // General group for margin convention
    this.g = this.svg.append("g")
        .attr('class', 'chart__margin-wrap')
        .attr("transform", ("translate(" + (this.cfg.margin.left) + "," + (this.cfg.margin.top) + ")"));

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
    if(this.cfg.yAxis)
    { this.yAxisTitle = this.axisg.append('text')
        .attr('class', 'chart__axis-title chart__axis-title--linechart')
        .attr("y", -this.cfg.margin.left+10)
        .attr("x", -this.cfg.height/2)
        .attr("transform", 'rotate(-90)')
        .style("text-anchor", "middle")
        .text(this.cfg.yAxis); }

    // Tooltip
    this.selection.selectAll('.chart__tooltip').remove();
    this.tooltip = this.wrap
        .append('div')
        .attr('class', 'chart__tooltip chart__tooltip--linechart');

    // Lines group
    this.linesg = this.g.selectAll(".chart__lines-group")
      .data(this.tdata)
      .enter().append('g')
      .attr("class", function (d) {
        return "chart__lines-group chart__lines-group--linechart chart__lines-group--"+d.key;
      });

    // Lines
    this.lines = this.linesg.append('path')
      .attr("class", "chart__line chart__line--linechart")
      .attr('fill', 'transparent')
      .attr('stroke', function (d) { return this$1.lineColor(d); })
      .attr("d", function (d) { return this$1.line(d.values); });

    // Points
    this.pointsg = [];
    this.cfg.keys.forEach(function (k, i){

        // Point group
        var gp = this$1.g.selectAll('.chart__points-group--'+k)
            .data(this$1.data).enter()
            .append('g')
            .attr('class', 'chart__points-group chart__points-group--linechart chart__points-group--'+k);

        // Hover point
        gp.append('circle')
            .attr('class', 'chart__point-hover chart__point-hover--linechart')
            .attr('fill', 'transparent')
            .attr('r', this$1.cfg.pointHoverRadius)
            .on('mouseover', function (d) {
                this$1.tooltip.html(function (_) {
                    var label = this$1.cfg.labels && this$1.cfg.labels[i] ? this$1.cfg.labels[i] : k;
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
            .attr('pointer-events', 'none')
            .attr('fill', function (d) { return this$1.lineColor(k); })
            .attr('r', this$1.cfg.pointRadius);

        this$1.pointsg.push({selection:gp, key:k });
    });

    this.draw();
};

d3linechart.prototype.draw = function draw (){
        var this$1 = this;


    // Set up dimensions
    this.cfg.width = parseInt(this.selection.node().offsetWidth) - this.cfg.margin.left - this.cfg.margin.right;
    this.cfg.height = parseInt(this.selection.node().offsetHeight)- this.cfg.margin.top - this.cfg.margin.bottom;

    // Resize scales
    this.xScale.rangeRound([0, this.cfg.width]);
    this.yScale.rangeRound([this.cfg.height,  0]);

    // Resize SVG element
    this.svg
        .attr("viewBox", ("0 0 " + (this.cfg.width+this.cfg.margin.left+this.cfg.margin.right) + " " + (this.cfg.height+this.cfg.margin.top+this.cfg.margin.bottom)))
        .attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right)
        .attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom);

    // Redraw grid
    this.yGrid.call(
        this.make_y_gridlines()
            .tickSize(-this.cfg.width)
            .ticks(this.cfg.yScaleTicks, this.cfg.yScaleFormat)
    );

    // Redraw horizontal axis
    this.xAxis
        .attr("transform", ("translate(0," + (this.cfg.height) + ")"))
        .call(
            d3$1.axisBottom(this.xScale)
                .tickFormat(this.formatTime)
                .ticks(this.cfg.xScaleTicks, this.cfg.xScaleFormat)

        );

    // Set up line function
    this.line = d3$1.line()
        .curve(d3$1[this.cfg.curve])
        .x(function (d) { return this$1.xScale(d.x); })
        .y(function (d) { return this$1.yScale(d.y); });

    // Redraw lines
    this.lines.attr("d", function (d) { return this$1.line(d.values); });

    // Redraw points
    this.pointsg.forEach(function (p, i){
        p.selection
            .attr('transform', function (d) { return ("translate(" + (this$1.xScale(d.jsdate)) + "," + (this$1.yScale(d[p.key])) + ")"); });
    });

};

// Gridlines in x axis function
d3linechart.prototype.make_x_gridlines = function make_x_gridlines () {       
    return d3$1.axisBottom(this.xScale);
};

// Gridlines in y axis function
d3linechart.prototype.make_y_gridlines = function make_y_gridlines () {       
    return d3$1.axisLeft(this.yScale);
};

// Compute line color
d3linechart.prototype.lineColor = function lineColor (d) {
    if(!d.hasOwnProperty('key')) { d = {key: d}; }
    if(this.cfg.colorKeys && this.cfg.colorKeys.hasOwnProperty(d.key)){
        return this.cfg.colorKeys[d.data[this.cfg.key]]
    }else{
        return this.colorScale(d.key)
    }
};

d3linechart.prototype.destroy = function destroy (){
    window.removeEventListener("resize", this.redraw);
};

//

var script$1 = {
    name: 'D3LineChart',
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
        this.chart = new d3linechart(
            this.$refs.chart,
            this.datum,
            this.config
        );
    },
    beforeDestroy: function(){
        this.chart.destroy();
    }
};

/* script */
var __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"chart__wrapper"},[(_vm.title)?_c('div',{staticClass:"chart__title"},[_vm._v(_vm._s(_vm.title))]):_vm._e(),_vm._v(" "),_c('div',{ref:"chart",style:({height: ((this.height) + "px")})}),_vm._v(" "),(_vm.source)?_c('div',{staticClass:"chart__source"},[_vm._v(_vm._s(_vm.source))]):_vm._e()])};
var __vue_staticRenderFns__$1 = [];

  /* style */
  var __vue_inject_styles__$1 = function (inject) {
    if (!inject) { return }
    inject("data-v-0b7bc892_0", { source: ".chart__wrapper{margin:20px 0}.chart__wrap{margin:0}.chart__title{text-align:center;font-weight:700}.chart__source{font-size:12px}.chart__tooltip{position:absolute;pointer-events:none;display:none}.chart__tooltip.active{display:block}.chart__tooltip>div{background:#2b2b2b;color:#fff;padding:6px 10px;border-radius:3px}.chart__axis{font-size:12px;shape-rendering:crispEdges}.chart__grid .domain{stroke:none;fill:none}.chart__grid .tick line{opacity:.2}.chart__label{font-size:12px}", map: undefined, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__$1 = undefined;
  /* module identifier */
  var __vue_module_identifier__$1 = undefined;
  /* functional template */
  var __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var D3LineChart = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    browser,
    undefined
  );

var d3$2 = {
    select: select, selectAll: selectAll,
    scaleLinear: scaleLinear,
    max: max, min: min,
    transition: transition,
};

var d3slopechart = function d3slopechart(selection, data, config) {
    var this$1 = this;
    if ( config === void 0 ) config = {};

    this.selection = d3$2.select(selection);
    this.data = data;

    // Graph configuration
    this.cfg = {
        margin: {top: 10, right: 100, bottom: 20, left: 100},
        key: '',
        currentKey: '',
        values: ['start', 'end'],
        color: '#1f77b4',
        defaultColor: '#AAA',
        opacity: 0.5,
        radius: 3,
        axisLabels: false,
        transition: {duration: 550}
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

    // Set up scales
    this.yScale = d3$2.scaleLinear().rangeRound([this.cfg.height, 0]);

    // Resize listener
    this.redraw = function () { this$1.draw(); };
    window.addEventListener("resize", this.redraw);

    this.initGraph();
};

d3slopechart.prototype.initGraph = function initGraph () {
        var this$1 = this;


    this.yScale.domain([
        d3$2.min(this.data, function (d) { return d[this$1.cfg.values[0]] < d[this$1.cfg.values[1]] ? d[this$1.cfg.values[0]]*0.9 : d[this$1.cfg.values[1]]*0.9; } ),
        d3$2.max(this.data, function (d) { return d[this$1.cfg.values[0]] > d[this$1.cfg.values[1]] ? d[this$1.cfg.values[0]]*1.1 : d[this$1.cfg.values[1]]*1.1; } )
    ]);

    // Wrapper div
    this.wrap = this.selection.append('div') 
        .attr("class", "chart__wrap chart__wrap--slopechart");

    // SVG element
    this.svg = this.wrap.append('svg')
        .attr("class", "chart chart--slopegraph");

    // General group for margin convention
    this.g = this.svg.append("g")
        .attr('class', 'chart__margin-wrap')
        .attr("transform", ("translate(" + (this.cfg.margin.left) + "," + (this.cfg.margin.top) + ")"));

    // Axis group
    this.axisg = this.g.append('g')
        .attr('class', 'chart__axis chart__axis--slopechart');

    // Vertical left axis
    this.startAxis = this.axisg.append('line')
        .attr("class", "chart__axis-y chart__axis-y--slopechart chart__axis-y--start")
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('stroke', 'black');

    // Vertical right axis
    this.endAxis = this.axisg.append('line')
        .attr("class", "chart__axis-y chart__axis-y--slopechart chart__axis-y--end")
        .attr('stroke', 'black')
        .attr('y1', 0);

    // Axis labels
    if(this.cfg.axisLabels){
        this.startl = this.axisg.append('text')
            .attr('class', 'chart__axis-text chart__axis-text--slopechart chart__axis-text--start')
            .attr('text-anchor', 'middle')
            .attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom -12)
            .text(this.cfg.axisLabels[0]);

        this.endl = this.axisg.append('text')
            .attr('class', 'chart__axis-text chart__axis-text--slopechart chart__axis-text--end')
            .attr('text-anchor', 'middle')
            .attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom -12)
            .text(this.cfg.axisLabels[1]);
    }

    // Line selector
    this.lin = this.g.selectAll(".chart__lines-group")
        .data(this.data);

    // Line group
    this.lineg = this.lin
        .enter().append('g')
        .attr("class", "chart__lines-group chart__lines-group--slopechart");

    // Lines element
    this.lines = this.lineg.append('line')
        .attr("class", "chart__line chart__line--slopechart")
        .attr('stroke', function (d, i) { return d[this$1.cfg.key] == this$1.cfg.currentKey ? this$1.cfg.color : this$1.cfg.defaultColor; }
        )
        .style("stroke-width", function (d) { return d[this$1.cfg.key] == this$1.cfg.currentKey ? '2px' : '1px'; })
        .style("opacity", this.cfg.opacity);

    // Vertical left axis points group
    this.startg = this.lineg.append('g')
        .attr('class', 'chart__points-group chart__points-group--slopechart chart__points-group--start')
        .classed('current', function (d) { return d[this$1.cfg.key] == this$1.cfg.currentKey; });

    // Vertical right axis points group
    this.endg = this.lineg.append('g')
        .attr('class', 'chart__points-group chart__points-group--slopechart chart__points-group--end')
        .classed('current', function (d) { return d[this$1.cfg.key] == this$1.cfg.currentKey; })
        .attr('transform', 'translate('+this.cfg.width+',0)');

    // Vertical left axis points
    this.startg.append('circle')
        .attr('class', 'chart__point chart__point--slopechart chart__point--start')
        .attr('fill', function (d) { return d[this$1.cfg.key] == this$1.cfg.currentKey ? this$1.cfg.color : this$1.cfg.defaultColor; }
        )
        .attr('r', this.cfg.radius);

    // Vertical right axis points
    this.endg.append('circle')
        .attr('class', 'chart__point chart__point--slopechart chart__point--end')
        .attr('fill', function (d) { return d[this$1.cfg.key] == this$1.cfg.currentKey ? this$1.cfg.color : this$1.cfg.defaultColor; }
        )
        .attr('r', this.cfg.radius);

    // Vertical left axis labels
    this.startg.append('text')
        .attr('class', 'chart__label chart__label--slopechart chart__label--start')
        .attr('text-anchor', 'end')
        .attr('y', 3)
        .attr('x', -5)
        .text(function (d) { return d[this$1.cfg.key] +' '+ d[this$1.cfg.values[0]]; });

    // Vertical right axis labels
    this.endg.append('text')
        .attr('class', 'chart__label chart__label--slopechart chart__label--end')
        .attr('text-anchor', 'start')
        .attr('y', 3)
        .attr('x', 5)
        .text(function (d) { return d[this$1.cfg.values[1]] + '  ' + d[this$1.cfg.key]; });

    this.draw();
};

d3slopechart.prototype.draw = function draw (){
    // Set up dimensions
    this.cfg.width = parseInt(this.selection.node().offsetWidth) - this.cfg.margin.left - this.cfg.margin.right;
    this.cfg.height = parseInt(this.selection.node().offsetHeight)- this.cfg.margin.top - this.cfg.margin.bottom;

    // Set scales
    this.yScale.rangeRound([this.cfg.height, 0]);

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
    if(this.cfg.axisLabels){
        this.startl.attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom -12);
        this.endl.attr('x', this.cfg.width).attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom -12);
    }

    this.update();

};

d3slopechart.prototype.getData = function getData (){
    return this.data;
};

d3slopechart.prototype.addData = function addData (data){
    this.data = this.data.concat(data);
    this.update();
};

d3slopechart.prototype.updateData = function updateData (data){
        var this$1 = this;

    var existingkeys = this.data.map(function (d){ return d[this$1.cfg.key]; });
    var newkeys = data.map(function (d){ return d[this$1.cfg.key]; });
    // Remove non passed data items
    this.data = this.data.filter(function (d){ return newkeys.indexOf(d[this$1.cfg.key]) > -1; });
    // Update existing passed data items
    this.data.forEach(function (d){ d = data[newkeys.indexOf(d[this$1.cfg.key])]; });
    // Add non existing passed data items
    this.data = this.data.concat(data.filter(function (d){ return existingkeys.indexOf(d[this$1.cfg.key]) == -1; }));
    this.update();
};

d3slopechart.prototype.removeData = function removeData (filter){
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
    this.update();
};

d3slopechart.prototype.update = function update (){
        var this$1 = this;

    // Set transition
    var t = d3$2.transition().duration(this.cfg.transition.duration);

    // Set scale
    this.yScale.domain([
        d3$2.min(this.data, function (d) { return d[this$1.cfg.values[0]] < d[this$1.cfg.values[1]] ? d[this$1.cfg.values[0]]*0.9 : d[this$1.cfg.values[1]]*0.9; } ),
        d3$2.max(this.data, function (d) { return d[this$1.cfg.values[0]] > d[this$1.cfg.values[1]] ? d[this$1.cfg.values[0]]*1.1 : d[this$1.cfg.values[1]]*1.1; } )
    ]);

    // Lines group selection data
    this.lin = this.g.selectAll(".chart__lines-group")
        .data(this.data, function (d) { return d[this$1.cfg.key]; });

    // Elements to remove
    this.lin.exit().transition(t)
        .style("opacity", 0)
        .remove();

    // Left axis points to modify
    this.startg = this.lineg.selectAll('.chart__points-group--start')
        .transition(t)
        .attr('transform', function (d) { return 'translate(0,'+this$1.yScale(d[this$1.cfg.values[0]])+')'; });

    // Right axis points to modify
    this.endg = this.lineg.selectAll('.chart__points-group--end')
        .transition(t)
        .attr('transform', function (d) { return 'translate('+this$1.cfg.width+','+this$1.yScale(d[this$1.cfg.values[1]])+')'; });

    // Lines to modify
    this.lines = this.lineg.selectAll('.chart__line')
        .transition(t)
        .attr("x1", 0)
        .attr("x2", this.cfg.width)
        .attr("y1", function (d) { return this$1.yScale(d[this$1.cfg.values[0]]); })
        .attr("y2", function (d) { return this$1.yScale(d[this$1.cfg.values[1]]); });

    // Elements to add
    var news = this.lin
        .enter().append('g')
        .attr("class", "chart__lines-group chart__lines-group--slopechart");

    // Lines to add
    news.append('line') 
        .attr("class", "chart__line chart__line--slopechart")
        .attr('stroke', function (d, i) {
            return d[this$1.cfg.key] == this$1.cfg.currentKey ? this$1.cfg.color : this$1.cfg.defaultColor;
        })
        .style("opacity", this.cfg.opacity)
        .transition(t)
        .attr("x1", 0)
        .attr("x2", this.cfg.width)
        .attr("y1", function (d) { return this$1.yScale(d[this$1.cfg.values[0]]); })
        .attr("y2", function (d) { return this$1.yScale(d[this$1.cfg.values[1]]); });

    // Vertical left axis points group to add
    var gstart = news.append('g')
        .attr('class', 'chart__points-group chart__points-group--slopechart chart__points-group--start');
        
    gstart
        .transition(t)
        .attr('transform', function (d) { return 'translate(0,'+this$1.yScale(d[this$1.cfg.values[0]])+')'; });

    // Vertical right axis points group to add
    var gend = news.append('g')
        .attr('class', 'chart__points-group chart__points-group--slopechart chart__points-group--end')
        .attr('transform', 'translate('+this.cfg.width+',0)');

    gend
        .transition(t)
        .attr('transform', function (d) { return 'translate('+this$1.cfg.width+','+this$1.yScale(d[this$1.cfg.values[1]])+')'; });

    // Vertical left axis points to add
    gstart.append('circle')
        .attr('class', 'chart__point chart__point--slopechart chart__point--start')
        .attr('fill', function (d) { return d[this$1.cfg.key] == this$1.cfg.currentKey ? this$1.cfg.color : this$1.cfg.defaultColor; }
        )
        .attr('r', this.cfg.radius);

    // Vertical right axis points to add
    gend.append('circle')
        .attr('class', 'chart__point chart__point--slopechart chart__point--end')
        .attr('fill', function (d) { return d[this$1.cfg.key] == this$1.cfg.currentKey ? this$1.cfg.color : this$1.cfg.defaultColor; }
        )
        .attr('r', this.cfg.radius);

    gstart.append('text')
        .attr('class', 'chart__label chart__label--slopechart chart__label--start')
        .attr('text-anchor', 'end')
        .attr('y', 3)
        .attr('x', -5)
        .text(function (d) { return d[this$1.cfg.key] +' '+ d[this$1.cfg.values[0]]; });

    gend.append('text')
        .attr('class', 'chart__label chart__label--slopechart chart__label--end')
        .attr('text-anchor', 'start')
        .attr('y', 3)
        .attr('x', 5)
        .text(function (d) { return d[this$1.cfg.values[1]] + '  ' + d[this$1.cfg.key]; });

};

d3slopechart.prototype.destroy = function destroy (){
    window.removeEventListener("resize", this.redraw);
};

//

var script$2 = {
    name: 'D3SlopeChart',
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
        this.chart = new d3slopechart(
            this.$refs.chart,
            this.datum,
            this.config
        );
    },
    watch: {
        datum: function datum(vals){
            this.chart.updateData(vals);
        }
    },
    beforeDestroy: function(){
        this.chart.destroy();
    }
};

/* script */
var __vue_script__$2 = script$2;

/* template */
var __vue_render__$2 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"chart__wrapper"},[(_vm.title)?_c('div',{staticClass:"chart__title"},[_vm._v(_vm._s(_vm.title))]):_vm._e(),_vm._v(" "),_c('div',{ref:"chart",style:({height: ((this.height) + "px")})}),_vm._v(" "),(_vm.source)?_c('div',{staticClass:"chart__source"},[_vm._v(_vm._s(_vm.source))]):_vm._e()])};
var __vue_staticRenderFns__$2 = [];

  /* style */
  var __vue_inject_styles__$2 = function (inject) {
    if (!inject) { return }
    inject("data-v-744662b4_0", { source: ".chart__wrapper{margin:20px 0}.chart__wrap{margin:0}.chart__title{text-align:center;font-weight:700}.chart__source{font-size:12px}.chart__tooltip{position:absolute;pointer-events:none;display:none}.chart__tooltip.active{display:block}.chart__tooltip>div{background:#2b2b2b;color:#fff;padding:6px 10px;border-radius:3px}.chart__axis{font-size:12px;shape-rendering:crispEdges}.chart__grid .domain{stroke:none;fill:none}.chart__grid .tick line{opacity:.2}.chart__label{font-size:12px}", map: undefined, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__$2 = undefined;
  /* module identifier */
  var __vue_module_identifier__$2 = undefined;
  /* functional template */
  var __vue_is_functional_template__$2 = false;
  /* style inject SSR */
  

  
  var D3SlopeChart = normalizeComponent_1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    browser,
    undefined
  );

var Components = {
    D3BarChart: D3BarChart,
    D3LineChart: D3LineChart,
    D3SlopeChart: D3SlopeChart,
};

Object.keys(Components).forEach(function (name) {
    Vue.component(name, Components[name]);
});

export default Components;
