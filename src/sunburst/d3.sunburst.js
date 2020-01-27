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
  * Bind data to main elements groups
  */
  bindData(){
    const partition = (data) => {
      const root = d3.hierarchy(data)
          .sum(d => d[this.cfg.value])
      return d3.partition()(root);
    }

    this.hData = partition(this.data[0]).descendants();

    this.itemg = this.gcenter.selectAll('.chart__slice-group')
      .data(this.hData, d => d.data[this.cfg.key])

    // Set transition
    this.transition = d3.transition('t')
        .duration(this.cfg.transition.duration)
        .ease(d3[this.cfg.transition.ease]);
  }

  /**
  * Set up scales
  */
  setScales(){

    this.radius = Math.min(this.cfg.width, this.cfg.height)/2;

    this.xScale = d3.scaleLinear()
      .range([0, 2*Math.PI])
      .clamp(true);

    this.yScale = d3.scaleSqrt()
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
      .transition(this.transition)
      .attrTween('d', d => {
        const iy0 = d3.interpolate(0, d.y0);
        const iy1 = d3.interpolate(d.y0, d.y1);
        const ix0 = d3.interpolate(0, d.x0);
        const ix1 = d3.interpolate(0, d.x1);
        return t => {
          d.y0 = iy0(t);
          d.y1 = iy1(t);
          d.x0 = ix0(t);
          d.x1 = ix1(t);
          return this.arc(d)
        }
      })

  }

  /**
  * Update chart's elements based on data change
  */
  updateElements(){
    this.itemg.selectAll('.chart__slice')
      .transition(this.transition)
      .attrTween('d', d => {
        const d2 = this.hData.filter(j => j.data.name === d.data.name)[0];
        const iy0 = d3.interpolate(d.y0, d2.y0);
        const iy1 = d3.interpolate(d.y1, d2.y1);
        const ix0 = d3.interpolate(d.x0, d2.x0);
        const ix1 = d3.interpolate(d.x1, d2.x1);
        return t => {
          d2.y0 = iy0(t);
          d2.y1 = iy1(t);
          d2.x0 = ix0(t);
          d2.x1 = ix1(t);
          return this.arc(d2)
        }
      })
      .style("fill", d => this.colorElement(d.data))
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

  /**
  * Check if text fits in available space
  */
  textFits(d){
      const deltaAngle = this.xScale(d.x1) - this.xScale(d.x0);
      const r = Math.max(0, (this.yScale(d.y0) + this.yScale(d.y1)) / 2);
      return d.data[this.cfg.key].length * this.cfg.charSpace < r * deltaAngle;
  }

  /**
  * Transition slice on focus
  */
  focusOn(d){
      const d2 = this.hData.filter(j => j.data.name === d.data.name)[0];
      const transition = this.svg.transition()
        .duration(this.cfg.transition.duration)
        .ease(d3[this.cfg.transition.ease])
        .tween('scale', () => {
          const xd = d3.interpolate(this.xScale.domain(), [d2.x0, d2.x1]);
          const yd = d3.interpolate(this.yScale.domain(), [d2.y0, 1]);
          return t => {
            this.xScale.domain(xd(t));
            this.yScale.domain(yd(t));
          };
        });

      transition.selectAll('.chart__slice')
        .attrTween('d', d => () => {
          const d3 = this.hData.filter(j => j.data.name === d.data.name)[0];
          return this.arc(d3)
        });
  }
}

export default d3sunburst