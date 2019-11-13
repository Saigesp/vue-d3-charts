<template>
  <div class="page">

    <section class="text">
      <h2 class="page__title">D3SlopeChart</h2>
      <p class="page__claim">A <a href="https://datavizproject.com/data-type/slope-chart/" target="_blank">slope chart</a> displays information as a series of lines between two points.</p>
    </section>

    <section class="chart">
      <D3SlopeChart :config="chartconfig" :datum="chartdata" title="Lorem ipsum" source="Dolor sit amet"></D3SlopeChart>
    </section>

    <section class="code">
      <h3>Import</h3>
      <pre><code>import {D3SlopeChart} from 'vue-d3-charts'</code></pre>
    </section>

    <section class="code">
      <h3>Template</h3>
      <pre><code>{{chartcode}}</code></pre>
    </section>

    <section class="code">
      <h3>Data format</h3>
      <p>An <strong>objects array</strong> is expected, with each object as a line. Fields can be changed in configuration. Example:</p>
      <pre><code>chart_data = [{
  pib: 5355,
  bip: 5855,
  name: "Lorem"
},{
  pib: 6160,
  bip: 6510,
  name: "Ipsum"
},{
  pib: 3029,
  bip: 5138,
  name: "Dolor"
}]</code></pre>
      <p class="note">To work with this data, configuration must be <code>key = "name"</code> and <code>values = ["pib","bip"]</code></p>
    </section>

    <section class="code">
      <h3>Configuration</h3>
      <p>Default options:</p>
      <pre><code>chart_config = {
  margin: {top: 10, right: 100, bottom: 20, left: 100},
  key: '',
  currentKey: '',
  values: ['start', 'end'],
  color: '#1f77b4',
  defaultColor: '#AAA',
  opacity: 0.5,
  radius: 3,
  axisLabels: false,
  transition: {duration: 550}
}</code></pre>
      <ul>
        <li><strong>margin</strong>: (object). Chart's margins based on <a href="https://bl.ocks.org/mbostock/3019563">d3 margins convention</a>.</li>
        <li><strong>key</strong>: (string). Field to name.</li>
        <li><strong>currentKey</strong>: (string). Key field value to highlight.</li>
        <li><strong>values</strong>: (string). Fields to compute each axis value.</li>
        <li><strong>color</strong>: (string). Color to use on highlighted line.</li>
        <li><strong>defaultColor</strong>: (string). Color to use on no highlighted lines.</li>
        <li><strong>opacity</strong>: (number). Default no highlighted lines opacity.</li>
        <li><strong>radius</strong>: (number). Visible points radius.</li>
        <li><strong>axisLabels</strong>: (strings array). Each axis label text.</li>
        <li><strong>transition</strong>: (object). Transition options.</li>
      </ul>
      <p class="note">Chart's width is automatically calculed based on component's available space.</p>
    </section>

    <section class="code">
      <h3>Styles</h3>
      <p>Default styles can be easily overrided with BEM modifiers notation:</p>
      <pre><code>.chart{
  &--slopechart {
    font-size: 10px;
    .chart__line {
      stroke-width: 4px;
    }
  }
  &__point--slopechart {
    stroke: #000;
    stroke-width: 1px;
  }
}</code></pre>
      <p class="note">Note that SVG elements use some special properties in CSS. <a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_and_CSS">More info</a>.</p>
    </section>

    <section class="chart code">
      <h3>Examples</h3>

      
      <h4>{{example1.title}}</h4>
      <D3SlopeChart :config="example1.config" :datum="example1.data"></D3SlopeChart>
      <pre><code>config = {
  key: 'name',
  defaultColor: '#41B882'
}</code></pre>
      
      <h4>{{example2.title}}</h4>
      <D3SlopeChart :config="example2.config" :datum="example2.data"></D3SlopeChart>
      <pre><code>config = {
  key: 'name',
  currentKey: 'Lorem'
  color: '#41B882'
}</code></pre>
      
      <h4>{{example3.title}}</h4>
      <D3SlopeChart :config="example3.config" :datum="example3.data"></D3SlopeChart>
      <pre><code>config = {
  key: 'name',
  axisLabels: ['Start', 'End']
}</code></pre>

    </section>

  </div>
</template>
<script>
import {D3SlopeChart} from 'vue-d3-charts'

export default {
  name: 'SlopeChart',
  data() {
    return {
      chartcode: '<D3SlopeChart :config="chart_config" :datum="chart_data"></D3SlopeChart>',
      chartconfig: {
        key: 'name',
        currentKey: 'Lorem',
        color: ['#41B882'],
        axisLabels: ['2000', '2015'],
        transition: {ease: 'easeBounceOut', duration: 1000}
      },
      chartdata: [
        { start: 5355, end: 5855, name: "Lorem" },
        { start: 6160, end: 6510, name: "Ipsum" },
        { start: 3029, end: 5138, name: "Dolor" },
        { start: 2116, end: 2904, name: "Sit" },
        { start: 3503, end: 4408, name: "Amet" }
      ],
      example1: {
        title: 'Basic chart',
        config: {key: 'name', defaultColor: '#41B882'},
        data: [
          { start: 2355, end: 5855, name: "Lorem" },
          { start: 4260, end: 6510, name: "Ipsum" },
          { start: 5029, end: 5138, name: "Dolor" },
        ]
      },
      example2: {
        title: 'Highlighted value',
        config: {key: 'name', color: '#41B882', currentKey: 'Lorem'},
        data: [
          { start: 2355, end: 5855, name: "Lorem" },
          { start: 4260, end: 6510, name: "Ipsum" },
          { start: 5029, end: 5138, name: "Dolor" },
        ]
      },
      example3: {
        title: 'Axis labels',
        config: {key: 'name', axisLabels: ['Start', 'End']},
        data: [
          { start: 2355, end: 5855, name: "Lorem" },
          { start: 4260, end: 6510, name: "Ipsum" },
          { start: 5029, end: 5138, name: "Dolor" },
        ]
      }
    }
  },
  mounted(){

    setTimeout(()=>{
      this.chartdata = this.chartdata.filter(d => d.name != 'Lorem');
      this.chartdata.push({ start: 5085, end: 9321, name: "Lorem" });
    }, 2000);

    setTimeout(()=>{
      this.chartdata = this.chartdata.filter(d => d.name != 'Sit')
    }, 4000);

    setTimeout(()=>{
      this.chartdata = this.chartdata.concat([
        {start: 7500, end: 9960, name: "Aperiam"}
      ])
    }, 6000);

  }
}
</script>