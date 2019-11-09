<template>
  <div class="page page--home">
    <section class="code">
      <h2>Install with NPM</h2>
      <code class="align-center">
        <pre>npm i d3-vue-charts --save</pre>
      </code>
    </section>
    <section class="chart">
      <D3BarChart :config="barconfig" :datum="bardata"></D3BarChart>
    </section>
    <section class="text">
      <h2>Introduction</h2>
      <p>vue-d3-charts is a charts module build with reusability in mind. It has evolved from a personal bl.ocks collection to a modular charts system, to allow quick implementations and high customatization charts.</p>
    </section>
    <section class="code">
      <h2>How to use</h2>
      <p>First import your desired charts:</p>
      <code>
        <pre>import {D3BarChart} from 'vue-d3-charts'</pre>
      </code>
      <p>And then use it on your project, passing them a configuratioin object and a data array:</p>
      <code>
        <pre>{{bartext}}</pre>
      </code>
      <p>Each chart has it's own configuration options. For example, the <strong>bar chart</strong> has these as default:</p>
      <code>
<pre>chart_config = {
  key: 'key',
  value: 'value',
  labelRotation: 0,
  color: 'steelblue',
  yAxis: '',
  yScaleTicks: 5,
  yScaleFormat: '.0f'
}</pre>
      </code>
    </section>
    <section>
      <router-link :to="{name: 'barchart'}">barchar</router-link>
    </section>
  </div>
</template>

<script>
import {D3BarChart} from 'vue-d3-charts'

export default {
  name: 'home',
  data(){
    return {
      bartext: '<D3BarChart :config="chart_config" :datum="chart_data"></D3BarChart>',
      barconfig: {
        key: 'name',
        value: 'total',
        color: '#4295d6'
      },
      bardata: [
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
