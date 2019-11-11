<template>
  <div class="page">

    <section class="text">
      <h2 class="page__title">D3BarChart</h2>
      <p class="page__claim">A <a href="https://en.wikipedia.org/wiki/Bar_chart" target="_blank">bar chart</a> presents categorical data with rectangular bars with heights proportional to the values that they represent.</p>
    </section>
    
    <section class="chart">
      <D3BarChart :config="chartconfig" :datum="chartdata" title="Lorem ipsum" source="Dolor sit amet"></D3BarChart>
    </section>

    <section class="code">
      <h3>Import</h3>
      <pre><code>import {D3BarChart} from 'vue-d3-charts'</code></pre>
    </section>

    <section class="code">
      <h3>Template</h3>
      <pre><code>{{chartcode}}</code></pre>
    </section>

    <section class="code">
      <h3>Data format</h3>
      <p>An <strong>objects array</strong> is expected, with each object as a bar. Fields can be changed in configuration. Example:</p>
      <pre><code>chart_data = [{
  name: "Lorem",
  total: 30
},{
  name: "Ipsum",
  total: 21
},{
  name: "Dolor",
  total: 20
}]</code></pre>
      <p class="note">To work with this data, configuration must be <code>key = "name"</code> and <code>value = "total"</code></p>
    </section>

    <section class="code">
      <h3>Configuration</h3>
      <p>Default options:</p>
      <pre><code>chart_config = {
  margin: {top: 10, right: 30, bottom: 50, left: 40},
  key: "key",
  value: "value",
  labelRotation: 0,
  color: "steelblue",
  yAxis: ",
  yScaleTicks: 5,
  yScaleFormat: ".0f",
}</code></pre>
      <ul>
        <li><strong>margin</strong>: (object). Chart's margins based on <a href="https://bl.ocks.org/mbostock/3019563">d3 margins convention</a>.</li>
        <li><strong>key</strong>: (string). Field to use as name of each bar (bottom axis texts).</li>
        <li><strong>value</strong>: (string). Field to compute bar's height.</li>
        <li><strong>labelRotation</strong>: (number). Angle (in degs) to rotate labels. Use it if labels are too long.</li>
        <li><strong>color</strong>: (string). Color to apply to bars.</li>
        <li><strong>yAxis</strong>: (string). Vertical axis text.</li>
        <li><strong>yScaleTicks</strong>: (number). Vertical axis divisions (horizonal grid lines).</li>
        <li><strong>yScaleFormat</strong>: (string). Vertical axis number format based on <a href="https://github.com/d3/d3-format">d3-format</a>.</li>
      </ul>
      <p class="note">Chart's width is automatically calculed based on component's available space.</p>
    </section>

    <section class="code">
      <h3>Styles</h3>
      <p>Default styles can be easily overrided with BEM modifiers notation:</p>
      <pre><code>.chart{
  &__label--barchart {
    font-size: 10px;
  }
  &__axis--barchart {
    font-size: 9px;
  }
  &__bar--barchart {
    fill: red;
  }
}</code></pre>
      <p class="note">Note that SVG elements use some special properties in CSS. <a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_and_CSS">More info</a>.</p>
    </section>
  </div>
</template>


<script>
import {D3BarChart} from 'vue-d3-charts'

export default {
  name: 'BarChart',
  data(){
    return {
      chartcode: '<D3BarChart :config="chart_config" :datum="chart_data"></D3BarChart>',
      chartconfig: {
        key: 'name',
        value: 'total',
        color: '#41B882',
        yAxis: 'Lorem ipsum dolor sit amet',
        yScaleTicks: 10,
        yScaleFormat: '.0s',
      },
      chartdata: [
        {name: '1992', total: 4748},
        {name: '1993', total: 5526},
        {name: '1994', total: 8574},
        {name: '1995', total: 15805},
        {name: '1996', total: 14582},
        {name: '1997', total: 26694},
        {name: '1998', total: 35205},
        {name: '1999', total: 45944},
        {name: '2000', total: 78595},
        {name: '2001', total: 78530},
        {name: '2002', total: 45407},
        {name: '2003', total: 54044},
        {name: '2004', total: 69165},
        {name: '2005', total: 61798},
        {name: '2006', total: 63686},
      ]
    }
  }
}
</script>