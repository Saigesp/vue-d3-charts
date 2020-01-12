import d3chart from '../d3.chart'
import {select, selectAll} from 'd3-selection'
import {scaleLinear, scaleOrdinal, scaleSqrt} from 'd3-scale'
import {hierarchy, partition} from 'd3-hierarchy'
import {arc} from 'd3-shape'
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

const d3 = {select, selectAll, scaleLinear, scaleOrdinal, scaleSqrt, hierarchy,
    partition, arc, transition, interpolate,
    easeLinear, easePolyIn, easePolyOut, easePoly,
    easePolyInOut, easeQuadIn, easeQuadOut, easeQuad, easeQuadInOut,
    easeCubicIn, easeCubicOut, easeCubic, easeCubicInOut, easeSinIn,
    easeSinOut, easeSin, easeSinInOut, easeExpIn, easeExpOut, easeExp,
    easeExpInOut, easeCircleIn, easeCircleOut, easeCircle, easeCircleInOut,
    easeElasticIn, easeElastic, easeElasticOut, easeElasticInOut, easeBackIn,
    easeBackOut, easeBack, easeBackInOut, easeBounceIn, easeBounce,
    easeBounceOut, easeBounceInOut,
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
      margin: {top: 20, right: 20, bottom: 20, left: 20},
      key: '',
      value: '',
      color : {key: false, keys: false, scheme: false, current: '#1f77b4', default: '#AAA', axis: '#000'},
      transition: {duration: 350, ease: 'easeLinear'},
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
      root.sum(d=> d[this.cfg.value]);

      this.itemg = this.gcenter.selectAll('.chart__slice-group')
        .data(partition(root).descendants())

  }

  /**
  * Add new chart's elements
  */
  enterElements(){

      const newg = this.itemg
        .enter().append('g')
        .attr("class", "chart__slice-group chart__slice-group--sunburst clickable")
        .on('click', d => {
          window.event.stopPropagation();
          this.focusOn(d);
        })

      // PATHS
      newg.append("path")
        .attr("class", "chart__slice chart__slice--sunburst")
        .style("fill", d => this.colorElement(d.data))
        .attr("d", this.arc)
        .on('mouseover', d => {
          this.tooltip.html(() => {
            return `<div>${d.data[this.cfg.key]}: ${d.value}</div>`
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

  /**
  * Check if text fits in available space
  */
  textFits(d){
      const deltaAngle = this.xScale(d.x1) - this.xScale(d.x0);
      const r = Math.max(0, (this.yScale(d.y0) + this.yScale(d.y1)) / 2);

      return d.data[this.cfg.key].length * this.cfg.charSpace < r * deltaAngle;
  }

  focusOn(d){

      const transition = this.svg.transition()
        .duration(this.cfg.transition.duration)
        .ease(d3[this.cfg.transition.ease])
        .tween('scale', () => {
          const xd = d3.interpolate(this.xScale.domain(), [d.x0, d.x1]);
          const yd = d3.interpolate(this.yScale.domain(), [d.y0, 1]);
          return t => { this.xScale.domain(xd(t)); this.yScale.domain(yd(t)); };
        });

      transition.selectAll('.chart__slice')
        .attrTween('d', d => () => this.arc(d));

      //this.moveStackToFront(d);
  }
/*
  moveStackToFront(d) {
    const self = this; 
    this.svg.selectAll('.chart__slice').filter(d => d === d)
      .each(function(d) {
        console.log('each', d.data.name, d.parent);
        this.parentNode.appendChild(this);
        //if (d.parent) { self.moveStackToFront(d.parent); }
      })
  }
*/
}

export default d3sunburst