import d3chart from '../d3.chart'
import {select, selectAll} from 'd3-selection'
import {scaleLinear, scaleOrdinal} from 'd3-scale'
import {max, min} from 'd3-array'
import {pie, arc} from 'd3-shape'
import {transition} from 'd3-transition'
import {interpolate} from 'd3-interpolate'
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

const d3 = {select, selectAll, scaleLinear, scaleOrdinal, max, min, transition, pie, arc, interpolate,
    easeLinear, easePolyIn, easePolyOut, easePoly, easePolyInOut, easeQuadIn, easeQuadOut,
    easeQuad, easeQuadInOut, easeCubicIn, easeCubicOut, easeCubic, easeCubicInOut,
    easeSinIn, easeSinOut, easeSin, easeSinInOut, easeExpIn, easeExpOut, easeExp,
    easeExpInOut, easeCircleIn, easeCircleOut, easeCircle, easeCircleInOut,
    easeElasticIn, easeElastic, easeElasticOut, easeElasticInOut, easeBackIn,
    easeBackOut, easeBack, easeBackInOut, easeBounceIn, easeBounce, easeBounceOut,
    easeBounceInOut, schemeCategory10, schemeAccent, schemeDark2, schemePaired,
    schemePastel1, schemePastel2, schemeSet1, schemeSet2, schemeSet3,
    schemeTableau10}

/**
* D3 Slices Chart
*/
class d3sliceschart extends d3chart{

    constructor(selection, data, config) {
        super(selection, data, config, {
            margin: {top: 40, right: 20, bottom: 40, left: 20},
            key: '',
            value: 'value',
            color : {key: false, keys: false, scheme: false, current: '#1f77b4', default: '#AAA', axis: '#000'},
            radius: {inner: false, outter: false, padding: 0, round: 0},
            transition: {duration: 350, ease: 'easeLinear'}
        })
    }

    /**
    * Init chart
    */
    initChart() {

        // Set up dimensions
        this.getDimensions();
        this.initChartFrame('sliceschart');

        this.cScale = d3.scaleOrdinal();
        this.rScale = d3.scaleLinear();
        this.arc = d3.arc();
        this.pie = d3.pie()
            .sort(null)
            .value(() => 1)
            .padAngle(this.cfg.radius.padding);

        if(this.cfg.radius && this.cfg.radius.inner){
            const outRadius = this.cfg.radius.outter ? this.cfg.radius.outter : Math.min(this.cfg.width, this.cfg.height) / 2;
            this.cfg.radius.relation = this.cfg.radius.inner
                ? this.cfg.radius.inner / outRadius
                : 0
        }

        this.gcenter = this.g.append('g')
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
        
        // Center element
        this.gcenter
            .attr('transform', `translate(${this.cfg.width/2}, ${this.cfg.height/2})`)
    }

    /**
    * Bind data to main elements groups
    */
    bindData(){
        this.itemg = this.gcenter.selectAll('.chart__slice-group')
            .data(this.pie(this.data), d => d.data[this.cfg.key])

        // Set transition
        this.transition = d3.transition('t')
            .duration(this.cfg.transition.duration)
            .ease(d3[this.cfg.transition.ease]);
    }

    /**
    * Set up scales
    */
    setScales(){

        // Set up radius
        this.cfg.radius.outter = this.cfg.radius && this.cfg.radius.outter ? this.cfg.radius.outter : Math.min(this.cfg.width, this.cfg.height) / 2;
        this.inRadius = this.cfg.radius && this.cfg.radius.inner ? this.cfg.radius.inner : 0;
        if(this.cfg.radius.relation){
            this.inRadius = this.cfg.radius.outter * this.cfg.radius.relation;
        }

        // Set up arcs
        this.arc = d3.arc()
            .outerRadius(this.cfg.radius.outter)
            .innerRadius(this.inRadius)
            .cornerRadius(this.cfg.radius.round);

        this.rScale
          .range([this.inRadius, this.cfg.radius.outter])
          .domain([0, d3.max(this.data, d => d[this.cfg.value])])

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
    * Add new chart's elements
    */
    enterElements(){

        const newg = this.itemg
            .enter().append('g')
            .attr("class", "chart__slice-group chart__slice-group--sliceschart")

        // BACKGROUNDS
        newg.append("path")
            .attr("class", "chart__slice chart__slice--sliceschart")
            .on('mouseover', (d, i) => {
                const key = d.data[this.cfg.key];
                const value = d.data[this.cfg.value];
                this.tooltip.html(() => {
                   return `<div>${key}: ${value}</div>`
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
            .transition(this.transition)
            .delay((d,i) => i * this.cfg.transition.duration)
            .attrTween('d', d => {
                const i = d3.interpolate(d.startAngle+0.1, d.endAngle);
                return t => {
                    d.endAngle = i(t); 
                    return this.arc(d)
                }
            })
            .style("fill", d=> this.cfg.color.default)
            .style('opacity', 1);

        // FILLS
        newg.append("path")
            .attr("class", "chart__slice chart__slice--sliceschart")
            .transition(this.transition)
            .delay((d,i) => i * this.cfg.transition.duration)
            .attrTween('d', d => {
                const i = d3.interpolate(d.startAngle+0.1, d.endAngle);
                const arc = d3.arc()
                    .outerRadius(this.rScale(d.data[this.cfg.value]))
                    .innerRadius(this.inRadius)
                    .cornerRadius(this.cfg.radius.round);
                return t => {
                    d.endAngle = i(t); 
                    return arc(d)
                }
            })
            .style("fill", d=> this.colorElement(d.data))
            .style('pointer-events', 'none')
            .style('opacity', 1);

    }

    /**
    * Update chart's elements based on data change
    */
    updateElements(){
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
    }

    /**
    * Remove chart's elements without data
    */
    exitElements(){
        this.itemg.exit()
            .transition(this.transition)
            .style("opacity", 0)
            .remove();
    }

    midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    /**
    * Store the displayed angles in _current.
    * Then, interpolate from _current to the new angles.
    * During the transition, _current is updated in-place by d3.interpolate.
    */
    arcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return (t) => this.arc(i(t)) ;
    }

}

export default d3sliceschart