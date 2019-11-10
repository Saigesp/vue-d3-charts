<template>
  <div class="page">

    <section class="text">
      <h2 class="page__title">D3LineChart</h2>
      <p class="page__claim">A <a href="https://en.wikipedia.org/wiki/Line_chart" target="_blank">line chart</a> displays information as a series of data points connected by line segments, usually to visualize a trends over time.</p>
    </section>

    <section class="chart">
        <D3LineChart :config="chartconfig" :datum="chartdata" title="Lorem ipsum dolor sit amet" source="Custom source"></D3LineChart>
    </section>

    <section class="code">
      <h3>Import</h3>
      <pre><code>import {D3LineChart} from 'vue-d3-charts'</code></pre>
    </section>

    <section class="code">
      <h3>Template</h3>
      <pre><code>{{chartcode}}</code></pre>
    </section>

    <section class="code">
      <h3>Data format</h3>
      <p>An <strong>objects array</strong> is expected, with each object as an interval in the horizontal axis. Fields can be changed in configuration. Example:</p>
      <pre><code>chart_data = [{
  "iphone": 123,
  "android": 208,
  "motorola": 2,
  "when": "2019-08-01"
},{
  "iphone": 165,
  "android": 201,
  "motorola": 3,
  "when": "2019-09-01"
},{
  "iphone": 112,
  "android": 301,
  "motorola": 1,
  "when": "2019-10-01"
}]</code></pre>
      <p class="note">To work with this data, configuration must be <code>keys = ["iphone","android","motorola"]</code>, <code>dateField = "when"</code> and <code>dateformat = "%Y-%m-%d"</code></p>
    </section>

    <section class="code">
      <h3>Configuration</h3>
      <p>Default options:</p>
      <pre><code>chart_config = {
  margin: {top: 10, right: 30, bottom: 50, left: 40},
  keys: ["key"],
  labels: false,
  dateField: "date",
  dateFormat: "%Y-%m-%d",
  dateFormatOutput: "%Y-%m-%d",
  colorScheme: "schemeCategory10",
  colorKeys: {},
  curve: "curveLinear",
  pointRadius: 3,
  pointHoverRadius: 6,
  yAxis: "",
  xScaleTicks: 3,
  xScaleFormat: "%Y-%m-%d",
  yScaleTicks: 5,
  yScaleFormat: ".0f",
}</code></pre>
      <ul>
        <li><strong>margin</strong>: (object). Chart's margins based on <a href="https://bl.ocks.org/mbostock/3019563">d3 margins convention</a>.</li>
        <li><strong>keys</strong>: (strings array). Fields to compute each line.</li>
        <li><strong>labels</strong>: (strings array). Labels to display (1:1 with keys). If set to false, labels will be each key.</li>
        <li><strong>dateField</strong>: (string). Field to compute each horizontal axis division.</li>
        <li><strong>dateFormat</strong>: (string). How to parse <code>dateField</code> field. <a href="https://github.com/d3/d3-time-format/blob/master/README.md#locale_format">See more</a>.</li>
        <li><strong>dateFormatOutput</strong>: (string). How to output <code>dateField</code> field. <a href="https://github.com/d3/d3-time-format/blob/master/README.md#locale_format">See more</a>.</li>
        <li><strong>colorScheme</strong>: (string | array). Color scheme to use automatically in slices. Strings must be a scale name from <a href="https://github.com/d3/d3-scale-chromatic">d3 scale chromatic</a>. If set as array, a custom color scheme with these colors will be used.</li>
        <li><strong>colorKeys</strong>: (object). Key-value color override.</li>
        <li><strong>curve</strong>: (string). Interpolation curve. <a href="https://bl.ocks.org/d3noob/ced1b9b18bd8192d2c898884033b5529">See options</a>.</li>
        <li><strong>pointRadius</strong>: (number). Visible points radius.</li>
        <li><strong>pointHoverRadius</strong>: (number). Invisible points radius, used to trigger tooltip. </li>
        <li><strong>xScaleTicks</strong>: (number). Horizontal axis divisions.</li>
        <li><strong>xScaleFormat</strong>: (string). Horizontal axis number format based on <a href="https://github.com/d3/d3-format">d3-format</a>.</li>
        <li><strong>yAxis</strong>: (string). Vertical axis text.</li>
        <li><strong>yScaleTicks</strong>: (number). Vertical axis divisions (horizonal grid lines).</li>
        <li><strong>yScaleFormat</strong>: (string). Vertical axis number format based on <a href="https://github.com/d3/d3-format">d3-format</a>.</li>
      </ul>
      <p class="note">Chart's width is automatically calculed based on component's available space.</p>
    </section>

    <section class="code">
      <h3>Color configuration</h3>
      <p>This chart has a main color configuration <code>colorScheme</code>, and an overriding key-value color option <code>colorKeys</code></p>
      <h4>Color scheme</h4>
      <p>Default configuration. D3 will load the specific color scheme set in configuration (<code>schemeCategory10</code> is the default). Some example options are <code>schemeAccent</code>, <code>schemeDark2</code>, <code>schemePaired</code> or <code>schemeSet1</code>. These <a href="https://github.com/d3/d3-scale-chromatic">d3 scale chromatic</a> color schemes are <strong>colorblind safe</strong>, so colorblind people won't be confused reading the chart. <a href="http://mkweb.bcgsc.ca/colorblind/">Read more</a>.</p>
      <p>Using <strong>d3 scale chromatic</strong>:</p>
      <pre><code>chart_config = {
  colorScheme: 'schemeSet1',
}</code></pre>
      <p>Using <strong>custom color scheme</strong>:</p>
      <pre><code>chart_config = {
  colorScheme: ['55D6BE', '#ACFCD9', '#7D5BA6', '#DDDDDD', '#FC6471'],
}</code></pre>
      <p class="note">Fancy color palettes can be generated easily with <a href="https://coolors.co/app">Coolors</a>.</p>
      <h4>Key-values colors</h4>
      <p>If you want to override the color scheme, you can pass an object <code>colorKeys</code> in configuration. When a series key matches one, the color will be overrided (Note that the key field has to be the same as passed in configuration).</p>
      <pre><code>chart_config = {
  colorKeys: {
    'Success': '#339900',
    'Warning': '#ffcc00',
    'Error': '#cc3300',
  },
}</code></pre>
      <p class="note"><code>colorScheme</code> and <code>colorKeys</code> can be used together.</p>
    </section>

    <section class="code">
      <h3>Styles</h3>
      <p>Default styles can be easily overrided with BEM modifiers notation:</p>
      <pre><code>.chart{
  &--linechart {
    font-size: 10px;
    .chart__line {
      stroke-width: 4px;
    }
  }
  &__point--linechart {
    stroke: #000;
    stroke-width: 1px;
  }
}</code></pre>
      <p class="note">Note that SVG elements use some special properties in CSS. <a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_and_CSS">More info</a>.</p>
    </section>

  </div>
</template>



<script>
import {D3LineChart} from 'vue-d3-charts'

export default {
    name: 'LineChart',
    data(){
      return {
        chartcode: '<D3LineChart :config="chart_config" :datum="chart_data"></D3LineChart>',
        chartconfig: {
            keys: ['hours', 'production'],
            labels: ['Hour', 'Production'],
            dateField: 'date',
            dateFormat: '%Y',
            dateFormatOutput: '%Y',
            yScaleFormat: '.0f',
            xScaleTicks: 10,
            yAxis: 'Lorem ipsum',
            colorScheme: ['#41B882', '#222f3e']
        },
        chartdata: [
            {"hours": 2387, "production": 2134, "date": 2000},
            {"hours": 2938, "production": 2478, "date": 2001},
            {"hours": 2832, "production": 2392, "date": 2002},
            {"hours": 3092, "production": 2343, "date": 2003},
            {"hours": 2847, "production": 2346, "date": 2004},
            {"hours": 2976, "production": 2233, "date": 2005},
            {"hours": 2864, "production": 2325, "date": 2006},
            {"hours": 2748, "production": 2456, "date": 2007},
            {"hours": 2479, "production": 2329, "date": 2008},
            {"hours": 3200, "production": 2438, "date": 2009},
        ]
      }
    }
}
</script>