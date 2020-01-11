import d3chart from '../d3.chart'
import {select, selectAll} from 'd3-selection'
import {scaleLinear, scaleOrdinal, scaleSqrt} from 'd3-scale'
import {hierarchy, partition} from 'd3-hierarchy'
import {arc} from 'd3-shape'
/*
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
*/
import {schemeCategory10, schemeAccent, schemeDark2, schemePaired,
    schemePastel1, schemePastel2, schemeSet1, schemeSet2, schemeSet3,
    schemeTableau10} from 'd3-scale-chromatic'
/*
const d3 = {select, selectAll, scaleLinear, scaleOrdinal, max, min, transition, easeLinear,
    easePolyIn, easePolyOut, easePoly, easePolyInOut, easeQuadIn, easeQuadOut,
    easeQuad, easeQuadInOut, easeCubicIn, easeCubicOut, easeCubic, easeCubicInOut,
    easeSinIn, easeSinOut, easeSin, easeSinInOut, easeExpIn, easeExpOut, easeExp,
    easeExpInOut, easeCircleIn, easeCircleOut, easeCircle, easeCircleInOut,
    easeElasticIn, easeElastic, easeElasticOut, easeElasticInOut, easeBackIn,
    easeBackOut, easeBack, easeBackInOut, easeBounceIn, easeBounce, easeBounceOut,
    easeBounceInOut, schemeCategory10, schemeAccent, schemeDark2, schemePaired,
    schemePastel1, schemePastel2, schemeSet1, schemeSet2, schemeSet3,
    schemeTableau10}*/

const d3 = {select, selectAll, scaleLinear, scaleOrdinal, scaleSqrt, hierarchy,
    partition, arc,
    schemeCategory10, schemeAccent, schemeDark2, schemePaired,
    schemePastel1, schemePastel2, schemeSet1, schemeSet2, schemeSet3,
    schemeTableau10
}

/**
* D3 Sunburst
*/
class d3sunburst extends d3chart{
    constructor(selection, data, config) {
        super(selection, data, config, {
            margin: {top: 10, right: 100, bottom: 20, left: 100},
            key: '',
            value: '',
            color : {key: false, keys: false, scheme: false, current: '#1f77b4', default: '#AAA', axis: '#000'},
            //transition: {duration: 350, ease: 'easeLinear'}
        })
    }

    /**
    * Init chart
    */
    initChart() {

        // Set up dimensions
        this.getDimensions();
        this.initChartFrame('sunburst');

        this.xScale = d3.scaleLinear();
        this.yScale = d3.scaleSqrt();

        // Center group
        this.gcenter = this.g.append('g');

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

        // Center group
        this.gcenter
            .attr('transform', `translate(${this.cfg.width/2}, ${this.cfg.height/2})`)
    }

    /**
    * Set up scales
    */
    setScales(){

        this.radius = Math.min(this.cfg.width, this.cfg.height)/2;

        this.xScale
            .range([0, 2*Math.PI])
            .clamp(true);

        this.yScale
            .range([this.radius*.1, this.radius]);

        this.arc = d3.arc()
            .startAngle(d => this.xScale(d.x0))
            .endAngle(d => this.xScale(d.x1))
            .innerRadius(d => Math.max(0, this.yScale(d.y0)))
            .outerRadius(d => Math.max(0, this.yScale(d.y1)));

        // Set up color scheme
        if(this.cfg.color.scheme){
            if(this.cfg.color.scheme instanceof Array === true){
                this.colorScale = d3.scaleOrdinal()
                    .range(this.cfg.color.scheme);
            }else{
                this.colorScale = d3.scaleOrdinal(d3[this.cfg.color.scheme]);
            }
        }
    }

    /**
    * Bind data to main elements groups
    */
    bindData(){
        let partition = d3.partition();
        let root = d3.hierarchy(this.data);
        root.sum(d=> d.value);

        this.itemg = this.gcenter.selectAll('.chart__slice-group')
            .data(partition(root).descendants())

    }

    /**
    * Add new chart's elements
    */
    enterElements(){

        const newg = this.itemg
            .enter().append('g')
            .attr("class", "chart__slice-group chart__slice-group--sunburst")

        // PATHS
        newg.append("path")
            .attr("class", "chart__slice chart__slice--sunburst")
            .style("fill", d => this.colorElement(d.data))
            .attr("d", this.arc)

    }

    /**
    * Update chart's elements based on data change
    */
    updateElements(){
        //console.log('updateElements');
    }

    /**
    * Remove chart's elements without data
    */
    exitElements(){
        //console.log('exitElements');
    }
}

export default d3sunburst