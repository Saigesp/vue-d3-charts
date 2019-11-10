import {select, selectAll} from 'd3-selection'
import {scaleOrdinal, scaleLinear, scaleTime} from 'd3-scale'
import {timeParse, timeFormat} from 'd3-time-format'
import {max, extent} from 'd3-array'
import {line} from 'd3-shape'
import {axisLeft, axisBottom} from 'd3-axis'
import {curveBasis, curveBundle, curveCardinal, curveCatmullRom,
    curveLinear, curveMonotoneX, curveMonotoneY, curveNatural, curveStep,
    curveStepAfter, curveStepBefore} from 'd3-shape' // Curve variables
import {schemeCategory10, schemeAccent, schemeDark2, schemePaired,
    schemePastel1, schemePastel2, schemeSet1, schemeSet2, schemeSet3,
    schemeTableau10} from 'd3-scale-chromatic'


const d3 = {
    select, selectAll,
    scaleOrdinal, scaleLinear, scaleTime,
    timeParse, timeFormat,
    max, extent,
    line,
    axisLeft, axisBottom,
    curveBasis, curveBundle, curveCardinal, curveCatmullRom, curveLinear, curveMonotoneX,
    curveMonotoneY, curveNatural, curveStep, curveStepAfter, curveStepBefore,
    schemeCategory10, schemeAccent, schemeDark2, schemePaired, schemePastel1,
    schemePastel2, schemeSet1, schemeSet2, schemeSet3, schemeTableau10,
}


class d3linechart{

    constructor(selection, data, config = {}) {
        this.selection = d3.select(selection);
        this.data = data;
        let self = this;

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
        Object.keys(config).forEach(key=> {
            if(config[key] instanceof Object && config[key] instanceof Array === false){
                Object.keys(config[key]).forEach(sk=> {
                    this.cfg[key][sk] = config[key][sk];
                });
            } else this.cfg[key] = config[key];
        });

        // Set up dimensions
        this.cfg.width = parseInt(this.selection.node().offsetWidth) - this.cfg.margin.left - this.cfg.margin.right;
        this.cfg.height = parseInt(this.selection.node().offsetHeight)- this.cfg.margin.top - this.cfg.margin.bottom;

        // Set up color scheme
        if(this.cfg.colorScheme instanceof Array === true){
            this.colorScale = d3.scaleOrdinal().range(this.cfg.colorScheme)
        }else{
            this.colorScale = d3.scaleOrdinal(d3[this.cfg.colorScheme]);
        }

        // Format date functions
        this.parseTime = d3.timeParse(this.cfg.dateFormat);
        this.formatTime = d3.timeFormat(this.cfg.dateFormatOutput);

        // Calcule transpose data
        this.tdata = [];
        this.cfg.keys.forEach((j,i)=>{
            this.tdata[i] = {};
            this.tdata[i].key = j;
            this.tdata[i].values = [];
        });

        this.data.forEach(d=>{ d.jsdate = this.parseTime(d[this.cfg.dateField])});
        this.data.sort((a,b)=> b.jsdate - a.jsdate);

        this.data.forEach(d => {
            d.min =  9999999999;
            d.max = -9999999999;
            this.cfg.keys.forEach((j, i)=>{
                this.tdata[i].values.push({x: d.jsdate, y: +d[j], k: i})
                if (d[j] < d.min) d.min = +d[j];
                if (d[j] > d.max) d.max = +d[j];
            })
        });

        // Calcule vertical scale
        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(this.data, d => d.max )])
            .rangeRound([this.cfg.height, 0]);

        // Calcule horizontal scale
        this.xScale = d3.scaleTime()
            .domain(d3.extent(this.data, d => d.jsdate))
            .rangeRound([0, this.cfg.width]);

        // Set up line function
        this.line = d3.line()
            .curve(d3[this.cfg.curve])
            .x(d => this.xScale(d.x))
            .y(d => this.yScale(d.y))

        // Resize listener
        window.addEventListener("resize", _ => {
            this.draw();
        });

        this.initGraph();
    }

    initGraph() {

        // Wrapper div
        this.wrap = this.selection.append('div') 
            .attr("class", "chart__wrap chart__wrap--linechart");

        // SVG element
        this.svg = this.wrap.append('svg')
            .attr("class", "chart chart--linechart")
            .attr("viewBox", `0 0 ${this.cfg.width+this.cfg.margin.left+this.cfg.margin.right} ${this.cfg.height+this.cfg.margin.top+this.cfg.margin.bottom}`)
            .attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right)
            .attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom);

        // General group for margin convention
        this.g = this.svg.append("g")
            .attr('class', 'chart__margin-wrap')
            .attr("transform", `translate(${this.cfg.margin.left},${this.cfg.margin.top})`);

        // Axis group
        this.axisg = this.g.append('g')
            .attr('class', 'chart__axis chart__axis--linechart')

        // Horizontal grid
        this.yGrid = this.axisg.append("g")
            .attr("class", "chart__grid chart__grid--y chart__grid--linechart");
        
        // Bottom axis
        this.xAxis = this.axisg.append("g")
            .attr("class", "chart__axis-x chart__axis-x--linechart");

        // Vertical axis
        this.yAxis = this.axisg.append("g")
            .attr("class", "chart__axis-y chart__axis-y--linechart chart__grid")

        // Vertical axis title
        if(this.cfg.yAxis)
        this.yAxisTitle = this.axisg.append('text')
            .attr('class', 'chart__axis-title chart__axis-title--linechart')
            .attr("y", -this.cfg.margin.left+10)
            .attr("x", -this.cfg.height/2)
            .attr("transform", 'rotate(-90)')
            .style("text-anchor", "middle")
            .text(this.cfg.yAxis)

        // Tooltip
        this.selection.selectAll('.chart__tooltip').remove()
        this.tooltip = this.wrap
            .append('div')
            .attr('class', 'chart__tooltip chart__tooltip--linechart');

        // Lines group
        this.linesg = this.g.selectAll(".chart__lines-group")
          .data(this.tdata)
          .enter().append('g')
          .attr("class", d => {
            return "chart__lines-group chart__lines-group--linechart chart__lines-group--"+d.key;
          });

        // Lines
        this.lines = this.linesg.append('path')
          .attr("class", "chart__line chart__line--linechart")
          .attr('fill', 'transparent')
          .attr('stroke', d => this.lineColor(d))
          .attr("d", d => this.line(d.values))

        // Points
        this.pointsg = []
        this.cfg.keys.forEach((k, i)=>{

            // Point group
            let gp = this.g.selectAll('.chart__points-group--'+k)
                .data(this.data).enter()
                .append('g')
                .attr('class', 'chart__points-group chart__points-group--linechart chart__points-group--'+k)

            // Hover point
            gp.append('circle')
                .attr('class', 'chart__point-hover chart__point-hover--linechart')
                .attr('fill', 'transparent')
                .attr('r', this.cfg.pointHoverRadius)
                .on('mouseover', d => {
                    this.tooltip.html(_ => {
                        let label = this.cfg.labels && this.cfg.labels[i] ? this.cfg.labels[i] : k;
                        return `
                            <div>${label}: ${d[k]}</div>
                        `
                    })
                    .classed('active', true);
                })
                .on('mouseout', _ => {
                    this.tooltip.classed('active', false)
                })
                .on('mousemove', _ => {
                    this.tooltip
                        .style('left', window.event['pageX'] - 28 + 'px')
                        .style('top', window.event['pageY'] - 40 + 'px')
                })

            // Visible point
            gp.append('circle')
                .attr('class', 'chart__point-visible chart__point-visible--linechart')
                .attr('pointer-events', 'none')
                .attr('fill', d => this.lineColor(k))
                .attr('r', this.cfg.pointRadius)

            this.pointsg.push({selection:gp, key:k })
        })

        this.draw()
    }

    draw(){

        // Set up dimensions
        this.cfg.width = parseInt(this.selection.node().offsetWidth) - this.cfg.margin.left - this.cfg.margin.right;
        this.cfg.height = parseInt(this.selection.node().offsetHeight)- this.cfg.margin.top - this.cfg.margin.bottom;

        // Resize scales
        this.xScale.rangeRound([0, this.cfg.width]);
        this.yScale.rangeRound([this.cfg.height,  0]);

        // Resize SVG element
        this.svg
            .attr("viewBox", `0 0 ${this.cfg.width+this.cfg.margin.left+this.cfg.margin.right} ${this.cfg.height+this.cfg.margin.top+this.cfg.margin.bottom}`)
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
            .attr("transform", `translate(0,${this.cfg.height})`)
            .call(
                d3.axisBottom(this.xScale)
                    .tickFormat(this.formatTime)
                    .ticks(this.cfg.xScaleTicks, this.cfg.xScaleFormat)

            );

        // Set up line function
        this.line = d3.line()
            .curve(d3[this.cfg.curve])
            .x(d => this.xScale(d.x))
            .y(d => this.yScale(d.y))

        // Redraw lines
        this.lines.attr("d", d => this.line(d.values));

        // Redraw points
        this.pointsg.forEach((p, i)=>{
            p.selection
                .attr('transform', d => `translate(${this.xScale(d.jsdate)},${this.yScale(d[p.key])})`)
        })

    }

    // Gridlines in x axis function
    make_x_gridlines() {       
        return d3.axisBottom(this.xScale);
    }

    // Gridlines in y axis function
    make_y_gridlines() {       
        return d3.axisLeft(this.yScale);
    }

    // Compute line color
    lineColor(d) {
        if(!d.hasOwnProperty('key')) d = {key: d}
        if(this.cfg.colorKeys && this.cfg.colorKeys.hasOwnProperty(d.key)){
            return this.cfg.colorKeys[d.data[this.cfg.key]]
        }else{
            return this.colorScale(d.key)
        }
    }

}

export default d3linechart