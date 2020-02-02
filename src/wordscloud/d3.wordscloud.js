import d3chart from '../d3.chart'
import {select, selectAll} from 'd3-selection'
import {scaleOrdinal, scaleLinear} from 'd3-scale'
import {max, extent} from 'd3-array'
import {transition} from 'd3-transition'
import * as cloud from 'd3-cloud'
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

const d3 = { select, selectAll, scaleOrdinal, scaleLinear, max, extent, transition, cloud,
  easeLinear, easePolyIn, easePolyOut, easePoly, easePolyInOut,
  easeQuadIn, easeQuadOut, easeQuad, easeQuadInOut, easeCubicIn,
  easeCubicOut, easeCubic, easeCubicInOut, easeSinIn, easeSinOut,
  easeSin, easeSinInOut, easeExpIn, easeExpOut, easeExp,
  easeExpInOut, easeCircleIn, easeCircleOut, easeCircle,
  easeCircleInOut, easeElasticIn, easeElastic, easeElasticOut,
  easeElasticInOut, easeBackIn, easeBackOut, easeBack, easeBackInOut,
  easeBounceIn, easeBounce, easeBounceOut, easeBounceInOut,
  schemeCategory10, schemeAccent, schemeDark2, schemePaired, schemePastel1, schemePastel2,
  schemeSet1, schemeSet2, schemeSet3, schemeTableau10 };

/**
 * D3 Words Cloud
 */
class d3wordscloud extends d3chart {

  constructor(selection, data, config) {
    super(selection, data, config, {
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      key: 'word',
      value: 'size',
      fontFamily: 'Arial',
      angle: {steps: 2, start: 0, end: 90},
      color: { key: false, keys: false, scheme: false, current: '#1f77b4', default: '#AAA', axis: '#000' },
      transition: { duration: 350, ease: 'easeLinear' }
    });
  }

  /**
  * Init chart
  */
  initChart() {
    // Set up dimensions
    this.getDimensions();
    this.initChartFrame('wordscloud');

    this.gcenter = this.g.append('g');

    this.setChartDimension();
    this.updateChart();
  }

  /**
  * Compute data before operate
  */
  computeData(){
    let layout = d3.cloud()
      .size([ this.cfg.width, this.cfg.height ])
      .words(this.data.map(d => ({
        text: d[this.cfg.key],
        size: d[this.cfg.value],
      })))
      .rotate(() => this.wordsAngle(this.cfg.angle))
      .font(this.cfg.fontFamily)
      .fontSize(d => d.size)
      .on("end", d => { this.tData = d; })
      .start();
  }  

  /**
   * Set up chart dimensions (non depending on data)
   */
  setChartDimension() {
    // Resize SVG element
    this.svg
      .attr("viewBox", `0 0 ${this.cfg.width+this.cfg.margin.left+this.cfg.margin.right} ${this.cfg.height+this.cfg.margin.top+this.cfg.margin.bottom}`)
      .attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right)
      .attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom);

    // Center element
    this.gcenter.attr('transform', `translate(${this.cfg.width/2}, ${this.cfg.height/2})`)
  }

  /**
   * Bind data to main elements groups
   */
  bindData() {
    // Set transition
    this.transition = d3.transition('t')
      .duration(this.cfg.transition.duration)
      .ease(d3[this.cfg.transition.ease]);

    // Word group selection data
    this.wordgroup = this.gcenter
      .selectAll(".chart__word-group")
      .data(this.tData, d => d.text);
  }

  /**
   * Set up scales
   */
  setScales() {
    if (this.cfg.color.scheme instanceof Array === true) {
      this.colorScale = d3.scaleOrdinal().range(this.cfg.color.scheme)
    } else if (typeof this.cfg.color.scheme === 'string') {
      this.colorScale = d3.scaleOrdinal(d3[this.cfg.color.scheme]);
    }
  }


  /**
   * Add new chart's elements
   */
  enterElements() {

    // Elements to add
    const newwords = this.wordgroup
      .enter().append('g')
      .attr("class", "chart__word-group chart__word-group--wordscloud");

    newwords.append("text")
      .style("font-size", d => d.size + "px")
      .style("font-family", d => d.font)
      .attr("text-anchor", "middle")
      .attr('fill', d => this.colorElement(d, 'text'))
      .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
      .text(d => d.text);
  }

  /**
   * Update chart's elements based on data change
   */
  updateElements() {
    this.wordgroup.selectAll('text')
      .data(this.tData, d => d.text)
      .transition(this.transition)
      .attr('fill', d => this.colorElement(d, 'text'))
      .style("font-size", d => d.size + "px")
      .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`);
  }

  /**
   * Remove chart's elements without data
   */
  exitElements() {
    this.wordgroup.exit()
      .transition(this.transition)
      .style("opacity", 0)
      .remove();
  }

  /**
   * Word's angle
   */
  wordsAngle(angle) {
    if (typeof this.cfg.angle === 'number') {
      // Config angle is fixed number
      return this.cfg.angle;
    } else if (typeof this.cfg.angle === 'object') {
      if (this.cfg.angle instanceof Array === true) {
        // Config angle is custom array
        const idx = this.randomInt(0, this.cfg.angle.length-1);
        return this.cfg.angle[idx];
      } else {
        // Config angle is custom object
        const angle = (this.cfg.angle.end - this.cfg.angle.start) / (this.cfg.angle.steps - 1);
        return this.cfg.angle.start + (this.randomInt(0, this.cfg.angle.steps) * angle);
      }
    }
    return 0;
  }

  randomInt(min, max) {
    const i = Math.ceil(min);
    const j = Math.floor(max);
    return Math.floor(Math.random() * (j - i + 1)) + i;
  }

};

export default d3wordscloud;
