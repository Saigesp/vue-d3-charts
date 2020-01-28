import d3chart from '../d3.chart'
import {select, selectAll} from 'd3-selection'
import {scaleOrdinal, scaleLinear} from 'd3-scale'
import {max, extent} from 'd3-array'
import {transition} from 'd3-transition'
import * as cloud from 'd3-cloud'
import {schemeCategory10, schemeAccent, schemeDark2, schemePaired,
  schemePastel1, schemePastel2, schemeSet1, schemeSet2, schemeSet3,
  schemeTableau10} from 'd3-scale-chromatic'

const d3 = { select, selectAll, scaleOrdinal, scaleLinear, max, extent, transition, cloud,
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
      color: { key: false, keys: false, scheme: false, current: '#1f77b4', default: '#AAA', axis: '#000' },
      // transition: { duration: 350, ease: 'easeLinear' }
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
      .rotate(() => this.angleOrtogonal())
      //.spiral('rectangular')
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
    console.log('bindData', this.tData);

    // Word group selection data
    this.wordgroup = this.gcenter
      .selectAll(".chart__word-group")
      .data(this.tData, d => d.text);
  }

  /**
   * Set up scales
   */
  setScales() {}


/*
  d3.select("body").append("svg")
    .attr("width", layout.size()[0])
    .attr("height", layout.size()[1])
    .append("g")
    .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
    .selectAll("text")
    .data(words)
    .enter().append("text")
    .style("font-size", function(d) { return d.size + "px"; })
    .style("font-family", "Impact")
    .attr("text-anchor", "middle")
    .attr("transform", function(d) {
      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function(d) { return d.text; });
*/


  /**
   * Add new chart's elements
   */
  enterElements() {
    console.log('enterElements');

    // Elements to add
    const newwords = this.wordgroup
      .enter().append('g')
      .attr("class", "chart__word-group chart__word-group--wordscloud");

    newwords.append("text")
      .style("font-size", d => d.size + "px")
      .style("font-family", d => d.font)
      .attr("text-anchor", "middle")
      .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
      .text(d => d.text);
  }

  /**
   * Update chart's elements based on data change
   */
  updateElements() {
    console.log('updateElements');
  }

  /**
   * Remove chart's elements without data
   */
  exitElements() {
    console.log('exitElements');
  }

  angleOrtogonal() {
    return this.randomInt(0, 1) * 90;
  }

  randomInt(min, max) {
    const i = Math.ceil(min);
    const j = Math.floor(max);
    return Math.floor(Math.random() * (j - i + 1)) + i;
  }

};

export default d3wordscloud;
