import d3chart from '../d3.chart'
import {select, selectAll} from 'd3-selection'
import {scaleLinear, scaleOrdinal} from 'd3-scale'
import {max, min} from 'd3-array'
import {transition} from 'd3-transition'
import {easeLinear, easePolyIn, easePolyOut, easePoly,
    easePolyInOut, easeQuadIn, easeQuadOut, easeQuad, easeQuadInOut,
    easeCubicIn, easeCubicOut, easeCubic, easeCubicInOut, easeSinIn,
    easeSinOut, easeSin, easeSinInOut, easeExpIn, easeExpOut, easeExp,
    easeExpInOut, easeCircleIn, easeCircleOut, easeCircle, easeCircleInOut,
    easeElasticIn, easeElastic, easeElasticOut, easeElasticInOut, easeBackIn,
    easeBackOut, easeBack, easeBackInOut, easeBounceIn, easeBounce,
    easeBounceOut, easeBounceInOut} from 'd3-ease'
import {schemeCategory10, schemeAccent, schemeDark2, schemePaired,
    schemePastel1, schemePastel2, schemeSet1, schemeSet2, schemeSet3,
    schemeTableau10} from 'd3-scale-chromatic'

const d3 = {select, selectAll, scaleLinear, scaleOrdinal, max, min, transition, easeLinear,
    easePolyIn, easePolyOut, easePoly, easePolyInOut, easeQuadIn, easeQuadOut,
    easeQuad, easeQuadInOut, easeCubicIn, easeCubicOut, easeCubic, easeCubicInOut,
    easeSinIn, easeSinOut, easeSin, easeSinInOut, easeExpIn, easeExpOut, easeExp,
    easeExpInOut, easeCircleIn, easeCircleOut, easeCircle, easeCircleInOut,
    easeElasticIn, easeElastic, easeElasticOut, easeElasticInOut, easeBackIn,
    easeBackOut, easeBack, easeBackInOut, easeBounceIn, easeBounce, easeBounceOut,
    easeBounceInOut, schemeCategory10, schemeAccent, schemeDark2, schemePaired,
    schemePastel1, schemePastel2, schemeSet1, schemeSet2, schemeSet3,
    schemeTableau10}

/**
* D3 Slope Chart
*/
class d3slopechart extends d3chart{

    constructor(selection, data, config) {
        super(selection, data, config, {
            margin: {top: 10, right: 100, bottom: 20, left: 100},
            key: '',
            currentKey: false,
            values: ['start', 'end'],
            color : {key: false, keys: false, scheme: false, current: '#1f77b4', default: '#AAA', axis: '#000'},
            axis: {titles: false},
            points: {visibleRadius: 3},
            opacity: 0.5,
            transition: {duration: 350, ease: 'easeLinear'}
        })
    }

    /**
    * Init chart
    */
    initChart() {

        // Set up dimensions
        this.getDimensions();
        this.initChartFrame('slopechart');

        // Set up scales
        this.yScale = d3.scaleLinear();

        // Axis group
        const axisg = this.g.append('g')
            .attr('class', 'chart__axis chart__axis--slopechart')

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
                .text(this.cfg.axis.titles[0])

            this.endl = axisg.append('text')
                .attr('class', 'chart__axis-text chart__axis-text--slopechart chart__axis-text--end')
                .attr('text-anchor', 'middle')
                .attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom -12)
                .text(this.cfg.axis.titles[1])
        }

        this.setChartDimension();
        this.updateChart();
    }

    /**
    * Set up chart dimensions (non depending on data)
    */
    setChartDimension(){
        // SVG element
        this.svg
            .attr("viewBox", `0 0 ${this.cfg.width+this.cfg.margin.left+this.cfg.margin.right} ${this.cfg.height+this.cfg.margin.top+this.cfg.margin.bottom}`)
            .attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right)
            .attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom);

        // Vertical left axis position
        this.startAxis
            .attr('y2', this.cfg.height)

        // Vertical right axis position
        this.endAxis
            .attr('x1', this.cfg.width)
            .attr('x2', this.cfg.width)
            .attr('y2', this.cfg.height)

        // Axis labels
        if(this.cfg.axis.titles){
            this.startl.attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom -12)
            this.endl.attr('x', this.cfg.width).attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom -12)
        }
    }

    /**
    * Set up scales
    */
    setScales(){
        // Set up dimensional scales
        this.yScale
            .rangeRound([this.cfg.height, 0])
            .domain([
                d3.min(this.data, d => d[this.cfg.values[0]] < d[this.cfg.values[1]] ? d[this.cfg.values[0]]*0.9 : d[this.cfg.values[1]]*0.9 ),
                d3.max(this.data, d => d[this.cfg.values[0]] > d[this.cfg.values[1]] ? d[this.cfg.values[0]]*1.1 : d[this.cfg.values[1]]*1.1 )
            ]);

        // Set up color scheme
        if(this.cfg.color.scheme){
            if(this.cfg.color.scheme instanceof Array === true){
                this.colorScale = d3.scaleOrdinal()
                    .domain(this.data.map(d=>d[this.cfg.key]))
                    .range(this.cfg.color.scheme);
            }else{
                this.colorScale = d3.scaleOrdinal(d3[this.cfg.color.scheme])
                    .domain(this.data.map(d=>d[this.cfg.key]));
            }
        }
    }

    /**
    * Bind data to main elements groups
    */
    bindData(){
        // Lines group selection data
        this.linesgroup = this.g.selectAll(".chart__lines-group")
            .data(this.data, d => d[this.cfg.key]);

        // Set transition
        this.transition = d3.transition('t')
            .duration(this.cfg.transition.duration)
            .ease(d3[this.cfg.transition.ease]);
    }

    /**
    * Add new chart's elements
    */
    enterElements(){

        // Elements to add
        const newlines = this.linesgroup
            .enter().append('g')
            .attr("class", "chart__lines-group chart__lines-group--slopechart");

        // Lines to add
        newlines.append('line') 
            .attr("class", "chart__line chart__line--slopechart")
            .classed('chart__line--current', d => this.cfg.currentKey && d[this.cfg.key] == this.cfg.currentKey)
            .attr('stroke', d => this.colorElement(d))
            .style("opacity", this.cfg.opacity)
            .attr("x1", 0)
            .attr("x2", this.cfg.width)
            .transition(this.transition)
            .attr("y1", d => this.yScale(d[this.cfg.values[0]]))
            .attr("y2", d => this.yScale(d[this.cfg.values[1]]))

        // Vertical left axis points group to add
        const gstart = newlines.append('g')
            .attr('class', 'chart__points-group chart__points-group--slopechart chart__points-group--start')
        
        gstart.transition(this.transition)
            .attr('transform', d => 'translate(0,'+this.yScale(d[this.cfg.values[0]])+')')

        // Vertical left axis points to add
        gstart.append('circle')
            .attr('class', 'chart__point chart__point--slopechart chart__point--start')
            .attr('fill', d => this.colorElement(d))
            .attr('r', this.cfg.points.visibleRadius)

        // Vertical left axis label to add
        gstart.append('text')
            .attr('class', 'chart__label chart__label--slopechart chart__label--start')
            .attr('text-anchor', 'end')
            .attr('y', 3)
            .attr('x', -5)
            .text(d => d[this.cfg.key] +' '+ d[this.cfg.values[0]])

        // Vertical right axis points group to add
        const gend = newlines.append('g')
            .attr('class', 'chart__points-group chart__points-group--slopechart chart__points-group--end')
            .attr('transform', 'translate('+this.cfg.width+',0)')

        gend.transition(this.transition)
            .attr('transform', d => 'translate('+this.cfg.width+','+this.yScale(d[this.cfg.values[1]])+')')

        // Vertical right axis points to add
        gend.append('circle')
            .attr('class', 'chart__point chart__point--slopechart chart__point--end')
            .attr('fill', d => this.colorElement(d))
            .attr('r', this.cfg.points.visibleRadius)

        // Vertical right axis label to add
        gend.append('text')
            .attr('class', 'chart__label chart__label--slopechart chart__label--end')
            .attr('text-anchor', 'start')
            .attr('y', 3)
            .attr('x', 5)
            .text(d => d[this.cfg.values[1]] + '  ' + d[this.cfg.key])
    }

    /**
    * Update chart's elements based on data change
    */
    updateElements(){
        // Lines to modify
        this.linesgroup.selectAll('.chart__line')
            .data(this.data, d=> d[this.cfg.key])
            .transition(this.transition)
            .attr("x1", 0)
            .attr("x2", this.cfg.width)
            .attr("y1", d => this.yScale(d[this.cfg.values[0]]))
            .attr("y2", d => this.yScale(d[this.cfg.values[1]]))

        // Left axis points to modify
        this.linesgroup.selectAll('.chart__points-group--start')
            .data(this.data, d=> d[this.cfg.key])
            .transition(this.transition)
            .attr('transform', d => 'translate(0,'+this.yScale(d[this.cfg.values[0]])+')')

        // Left axis labels to modify
        this.linesgroup.selectAll('.chart__label--start')
            .data(this.data, d=> d[this.cfg.key])
            .text(d =>{return d[this.cfg.key] +' '+ d[this.cfg.values[0]]})

        // Right axis points to modify
        this.linesgroup.selectAll('.chart__points-group--end')
            .data(this.data, d=> d[this.cfg.key])
            .transition(this.transition)
            .attr('transform', d => 'translate('+this.cfg.width+','+this.yScale(d[this.cfg.values[1]])+')')

        // Right axis labels to modify
        this.linesgroup.selectAll('.chart__label--end')
            .data(this.data, d=> d[this.cfg.key])
            .text(d => d[this.cfg.values[1]] + '  ' + d[this.cfg.key])
    }

    /**
    * Remove chart's elements without data
    */
    exitElements(){
        this.linesgroup.exit()
            .transition(this.transition)
            .style("opacity", 0)
            .remove();
    }

}


export default d3slopechart