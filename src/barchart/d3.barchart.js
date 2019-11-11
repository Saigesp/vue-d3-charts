import {select, selectAll} from 'd3-selection';
import {scaleBand, scaleLinear} from 'd3-scale';
import {max} from 'd3-array';
import {axisBottom, axisLeft} from 'd3-axis';

const d3 = {
    select, selectAll,
    scaleBand, scaleLinear,
    max,
    axisBottom, axisLeft,
}

class d3barchart{

    constructor(selection, data, config = {}) {
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

        // Set up scales domain
        this.xScale = d3.scaleBand().rangeRound([0, this.cfg.width]).padding(0.1);
        this.yScale = d3.scaleLinear().rangeRound([0, this.cfg.height]);

        // Resize listener
        this.redraw = () => {
            this.draw();
        }
        window.addEventListener("resize", this.redraw);

        this.initGraph();
    }
    initGraph() {

        this.xScale.domain(this.data.map(d=> d[this.cfg.key] ));
        this.yScale.domain([d3.max(this.data, d=> +d[this.cfg.value]),0])

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
            .attr("transform", `translate(${this.cfg.margin.left},${this.cfg.margin.top})`);

        // Axis group
        this.axisg = this.g.append('g')
            .attr('class', 'chart__axis chart__axis--barchart')

        // Horizontal grid
        this.yGrid = this.axisg.append("g")           
            .attr("class", "chart__grid chart__grid--y chart__grid--barchart")
            .call(
                this.make_y_gridlines()
                    .tickSize(-this.cfg.width)
                    .ticks(this.cfg.yScaleTicks, this.cfg.yScaleFormat)
                )

        // Vertical axis title
        if(this.cfg.yAxis)
        this.yAxisTitle = this.axisg.append('text')
            .attr('class', 'chart__axis-title chart__axis-title--barchart')
            .attr("y", -this.cfg.margin.left+10)
            .attr("x", -this.cfg.height/2)
            .attr("transform", 'rotate(-90)')
            .style("text-anchor", "middle")
            .text(this.cfg.yAxis)

        // Bottom axis
        this.xAxis = this.axisg.append("g")
            .attr("class", "chart__axis-x chart__axis-x--barchart")
            .attr("transform", "translate(0," + this.cfg.height + ")")
            .call(d3.axisBottom(this.xScale));

        // Bottom axis label rotation
        if(this.cfg.labelRotation!=0)
        this.xAxis.selectAll('text')
            .attr("y", Math.cos(this.cfg.labelRotation*Math.PI/180)*9)
            .attr("x", Math.sin(this.cfg.labelRotation*Math.PI/180)*9)
            .attr("dy", ".35em")
            .attr("transform", `rotate(${this.cfg.labelRotation})`)
            .style("text-anchor", "start");

        // Tooltip
        this.selection.selectAll('.chart__tooltip').remove()
        this.tooltip = this.wrap
            .append('div')
            .attr('class', 'chart__tooltip chart__tooltip--barchart');

        // Bars groups
        this.itemg = this.g.selectAll('.itemgroup')
            .data(this.data)
            .enter().append('g')
            .attr('class', 'itemgroup')
            .attr('transform', (d, i) => `translate(${this.xScale(d[this.cfg.key])},0)`)

        // Bars
        this.rects = this.itemg.append('rect')
            .attr('x', 0)
            .attr('y', (d, i) => this.yScale(+d[this.cfg.value]))
            .attr('width', this.xScale.bandwidth())
            .attr('height', d => this.cfg.height - this.yScale(+d[this.cfg.value]))
            .attr('fill', d => {
                return !this.cfg.currentkey || d[this.cfg.key] == this.cfg.currentkey ? this.cfg.color : this.cfg.greycolor;
            })
            .on('mouseover', d => {
                this.tooltip.html(() => {
                    return `
                        <div>${d[this.cfg.key]}: ${d[this.cfg.value]}</div>
                    `
                })
                .classed('active', true);
            })
            .on('mouseout', () => {
                this.tooltip.classed('active', false)
            })
            .on('mousemove', () => {
                this.tooltip
                    .style('left', window.event['pageX'] - 28 + 'px')
                    .style('top', window.event['pageY'] - 40 + 'px')
            })
    }

    draw(){
        // Get dimensions
        this.cfg.width = parseInt(this.selection.node().offsetWidth) - this.cfg.margin.left - this.cfg.margin.right;
        this.cfg.height = parseInt(this.selection.node().offsetHeight)- this.cfg.margin.top - this.cfg.margin.bottom;

        // Set up scales
        this.xScale.rangeRound([0, this.cfg.width]);
        this.yScale.rangeRound([0, this.cfg.height]);

        // SVG element
        this.svg
            .attr("viewBox", `0 0 ${this.cfg.width + this.cfg.margin.left + this.cfg.margin.right} ${this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom}`)
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
            .attr("transform", `translate(0,${this.cfg.height})`)
            .call(d3.axisBottom(this.xScale))

        // Vertical axis title
        if(this.cfg.yAxis)
        this.yAxisTitle
            .attr("x", -this.cfg.height/2)

        // Bars groups
        this.itemg.attr('transform', d => `translate(${this.xScale(d[this.cfg.key])},0)`)

        // Bars
        this.rects
            .attr('width', this.xScale.bandwidth())
            .attr('y', d => this.yScale(+d[this.cfg.value]))
            .attr('height', d => this.cfg.height - this.yScale(+d[this.cfg.value]) )
    }

    // Gridlines in x axis function
    make_x_gridlines() {       
        return d3.axisBottom(this.xScale);
    }

    // Gridlines in y axis function
    make_y_gridlines() {       
        return d3.axisLeft(this.yScale);
    }

    destroy(){
        window.removeEventListener("resize", this.redraw);
    }
}

export default d3barchart