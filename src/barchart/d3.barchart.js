import d3chart from '../d3.chart'
import {select, selectAll} from 'd3-selection';
import {scaleBand, scaleLinear, scaleOrdinal} from 'd3-scale';
import {max} from 'd3-array';
import {transition} from 'd3-transition'
import {axisBottom, axisLeft} from 'd3-axis';
import {easeLinear, easePolyIn, easePolyOut, easePoly, easePolyInOut,
    easeQuadIn, easeQuadOut, easeQuad, easeQuadInOut, easeCubicIn,
    easeCubicOut, easeCubic, easeCubicInOut, easeSinIn, easeSinOut,
    easeSin, easeSinInOut, easeExpIn, easeExpOut, easeExp,
    easeExpInOut, easeCircleIn, easeCircleOut, easeCircle,
    easeCircleInOut, easeElasticIn, easeElastic, easeElasticOut,
    easeElasticInOut, easeBackIn, easeBackOut, easeBack, easeBackInOut,
    easeBounceIn, easeBounce, easeBounceOut, easeBounceInOut} from 'd3-ease'
import {schemeCategory10, schemeAccent, schemeDark2, schemePaired,
  schemePastel1, schemePastel2, schemeSet1, schemeSet2, schemeSet3,
  schemeTableau10} from 'd3-scale-chromatic'

const d3 = {
  select, selectAll,
  scaleBand, scaleLinear, scaleOrdinal,
  max,
  transition,
  axisBottom, axisLeft,
  easeLinear, easePolyIn, easePolyOut, easePoly, easePolyInOut,
  easeQuadIn, easeQuadOut, easeQuad, easeQuadInOut, easeCubicIn, easeCubicOut,
  easeCubic, easeCubicInOut, easeSinIn, easeSinOut, easeSin, easeSinInOut,
  easeExpIn, easeExpOut, easeExp, easeExpInOut, easeCircleIn, easeCircleOut,
  easeCircle, easeCircleInOut, easeElasticIn, easeElastic, easeElasticOut,
  easeElasticInOut, easeBackIn, easeBackOut, easeBack, easeBackInOut, easeBounceIn,
  easeBounce, easeBounceOut, easeBounceInOut,
  schemeCategory10, schemeAccent, schemeDark2, schemePaired, schemePastel1,
  schemePastel2, schemeSet1, schemeSet2, schemeSet3, schemeTableau10
}

/**
 * D3 Bar Chart
 */
class d3barchart extends d3chart {

  constructor(selection, data, config) {
    super(selection, data, config, {
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

  /**
   * Init chart
   */
  initChart() {

    // Set up dimensions
    this.getDimensions();
    this.initChartFrame('barchart');

    // Set up scales
    this.xScale = d3.scaleBand()
    this.yScale = d3.scaleLinear()

    // Set up scales
    this.xScale = d3.scaleBand();
    this.yScale = d3.scaleLinear();

    // Axis group
    this.axisg = this.g.append('g')
        .attr('class', 'chart__axis chart__axis--barchart')

    // Horizontal grid
    this.yGrid = this.axisg.append("g")
        .attr("class", "chart__grid chart__grid--y chart__grid--barchart")

    // Bottom axis
    this.xAxis = this.axisg.append("g")
        .attr("class", "chart__axis-x chart__axis-x--barchart")

    // Vertical axis title
    if (this.cfg.axis.yTitle)
        this.yAxisTitle = this.axisg.append('text')
        .attr('class', 'chart__axis-title chart__axis-title--barchart')
        .attr("transform", 'rotate(-90)')
        .style("text-anchor", "middle");

    this.setChartDimension();
    this.updateChart();
  }

  /**
   * Resize chart pipe
   */
  setScales() {

    this.xScale
      .rangeRound([0, this.cfg.width])
      .padding(0.1)
      .domain(this.data.map(d => d[this.cfg.key]));

    this.yScale
      .rangeRound([0, this.cfg.height])
      .domain([d3.max(this.data, d => +d[this.cfg.value]), 0]);

    if (this.cfg.color.scheme instanceof Array === true) {
      this.colorScale = d3.scaleOrdinal().range(this.cfg.color.scheme)
    } else if (typeof this.cfg.color.scheme === 'string') {
      this.colorScale = d3.scaleOrdinal(d3[this.cfg.color.scheme]);
    }

    // Horizontal grid
    this.yGrid
      .call(
        d3.axisLeft(this.yScale)
          .tickSize(-this.cfg.width)
          .ticks(this.cfg.axis.yTicks, this.cfg.axis.yFormat)
      );

    // Bottom axis
    this.xAxis
        .attr("transform", `translate(0,${this.cfg.height})`)
        .call(d3.axisBottom(this.xScale))
  }

  /**
   * Set chart dimensional sizes
   */
  setChartDimension() {
    // SVG element
    this.svg
      .attr("viewBox", `0 0 ${this.cfg.width + this.cfg.margin.left + this.cfg.margin.right} ${this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom}`)
      .attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right)
      .attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom);

    // Vertical axis title
    if (this.cfg.axis.yTitle)
      this.yAxisTitle
        .attr("y", -this.cfg.margin.left + 10)
        .attr("x", -this.cfg.height / 2)
        .text(this.cfg.axis.yTitle);

    // Bottom axis label rotation
    if(this.cfg.labelRotation!=0)
      this.xAxis.selectAll('text')
        .attr("y", Math.cos(this.cfg.labelRotation*Math.PI/180)*9)
        .attr("x", Math.sin(this.cfg.labelRotation*Math.PI/180)*9)
        .attr("dy", ".35em")
        .attr("transform", `rotate(${this.cfg.labelRotation})`)
        .style("text-anchor", "start");
  }

  /**
   * Bind data to main elements groups
   */
  bindData() {

    // Set transition
    this.transition = d3.transition('t')
      .duration(this.cfg.transition.duration)
      .ease(d3[this.cfg.transition.ease]);

    // Bars groups
    this.itemg = this.g.selectAll('.chart__bar-group')
      .data(this.data);
  }

  /**
   * Add new chart's elements
   */
  enterElements() {

    const newbars = this.itemg
      .enter().append('g')
      .attr('class', 'chart__bar-group chart__bar-group--barchart')
      .attr('transform', d => `translate(${this.xScale(d[this.cfg.key])},0)`);
      
    const rects = newbars.append('rect')
      .attr('class', 'chart__bar chart__bar--barchart')
      .classed('chart__bar--current', d => this.cfg.currentKey && d[this.cfg.key] == this.cfg.currentKey)
      .attr('x', 0)
      .attr('y', this.cfg.height)
      .attr('height', 0)
      .on('mouseover', d => {
        this.tooltip.html(() => {
          return `<div>${d[this.cfg.key]}: ${d[this.cfg.value]}</div>`
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
  updateElements() {
    // Bars groups
    this.itemg
      .attr('transform', d => `translate(${this.xScale(d[this.cfg.key])},0)`)

    // Bars
    this.g
      .selectAll('.chart__bar')
      .attr('width', this.xScale.bandwidth())
      .attr('fill', d => this.colorElement(d))
      .transition(this.transition)
      .attr('y', d => this.yScale(+d[this.cfg.value]))
      .attr('height', d => this.cfg.height - this.yScale(+d[this.cfg.value]))

  }

  /**
   * Remove chart's elements without data
   */
  exitElements() {
    this.itemg.exit()
      .transition(this.transition)
      .style("opacity", 0)
      .remove();
  }

}

export default d3barchart