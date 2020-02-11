<template>
  <div>
    <h4>{{title}}</h4>
    <p v-if="desc">{{desc}}</p>
    <D3BarChart :config="config" :datum="data" :title="customtitle" :source="customsource"></D3BarChart>
    <div class="example__controls">
      <select v-model="config.values">
        <option :value="[d]" v-for="d in ['hours', 'production']">{{d}}</option>
      </select>
      <select v-model="config.currentKey">
        <option :value="d.year" v-for="d in data">{{d.year}}</option>
      </select>
      <input type="text" v-model="customtitle">
      <input type="text" v-model="customsource">
    </div>
    <div v-highlight><pre class="language-html"><code>{{codehtml}}</code></pre></div>
    <div v-highlight><pre class="language-js"><code>{{codejs}}</code></pre></div>
  </div>
</template>


<script>
import {D3BarChart} from 'vue-d3-charts'

export default {
  name: 'BarChartExampleBasic',
  components: {
    D3BarChart,
  },
  data() {
    return {
      customtitle: 'Your title goes here',
      customsource: 'Your source goes here',
      config: {
        key: 'year',
        currentKey: '2004',
        values: ['hours'],
        axis: {
          yTicks: 4
        },
        color: {default: '#222f3e', current: '#41B882'}
      },
      data: [
        {hours: 238, production: 3153,  year: '2000'},
        {hours: 938, production: 5163,  year: '2001'},
        {hours: 1832, production: 3151, year: '2002'},
        {hours: 2092, production: 1681, year: '2003'},
        {hours: 2847, production: 2513, year: '2004'},
        {hours: 2576, production: 6854, year: '2005'},
        {hours: 2524, production: 6841, year: '2006'},
        {hours: 1648, production: 9613, year: '2007'},
        {hours: 2479, production: 6315, year: '2008'},
        {hours: 3200, production: 20541, year: '2009'},
      ],
      codehtml: `<template>
  <div class="my-app">
    
    <!-- chart -->
    <D3BarChart
      :config="chart_config"
      :datum="chart_data"
      :title="chart_title"
      :source="chart_source"
    ></D3BarChart>

    <!-- value control -->
    <select v-model="config.values">
      <option :value="[d]" v-for="d in ['hours', 'production']">{{d}}</option>
    </select>

    <!-- current control -->
    <select v-model="config.currentKey">
      <option :value="d.year" v-for="d in data">{{d.year}}</option>
    </select>

    <!-- title control -->
    <input type="text" v-model="chart_title">

    <!-- source control -->
    <input type="text" v-model="chart_source">

  </div>
</template>`,
            codejs:`import { D3BarChart } from 'vue-d3-charts';

export default {
  components: {
    D3BarChart,
  },
  data() {
    return {
      chart_title: 'Your title goes here',
      chart_source: 'Your source goes here',
      chart_data: [
        //...
        {hours: 1648, production: 9613, year: '2007'},
        {hours: 2479, production: 6315, year: '2008'},
        {hours: 3200, production: 2541, year: '2009'}
      ],
      chart_config: {
        key: 'year',
        currentKey: '2004',
        values: ['hours'],
        axis: {
          yTicks: 3
        },
        color: {
          default: '#222f3e',
          current: '#41B882'
        }
      }
    }
  }
}`
    }
  },
  props: {
    title: {
      type: String,
      default: 'Basic bar chart with dynamic elements'
    },
    desc: {
      type: String,
      default: ''
    }
  },
}
</script>