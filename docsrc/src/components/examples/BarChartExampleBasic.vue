<template>
  <div>
    <h4>{{title}}</h4>
    <p v-if="desc">{{desc}}</p>
    <D3BarChart :config="config" :datum="data" :title="customtitle" :source="customsource"></D3BarChart>
    <div class="example__controls">
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
  props: {
    title: {
      type: String,
      default: 'Basic bar chart with dynamic title'
    },
    desc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      customtitle: 'Your title goes here',
      customsource: 'Your source goes here',
      config: {
        key: 'year',
        currentKey: 2004,
        value: 'hours',
        axis: {
          yTicks: 3
        },
        color: {default: '#222f3e', current: '#41B882'}
      },
      data: [
        {hours: 238,  year: 2000},
        {hours: 938,  year: 2001},
        {hours: 1832, year: 2002},
        {hours: 2092, year: 2003},
        {hours: 2847, year: 2004},
        {hours: 2576, year: 2005},
        {hours: 2524, year: 2006},
        {hours: 1648, year: 2007},
        {hours: 2479, year: 2008},
        {hours: 3200, year: 2009},
      ],
      codehtml: `<template>
  <div class="my-app">
    <D3BarChart
      :config="chart_config"
      :datum="chart_data"
      :title="chart_title"
      :source="chart_source"
    ></D3BarChart>
    <input type="text" v-model="chart_title">
    <input type="text" v-model="chart_source">
  </div>
</template>`,
            codejs:`import {D3BarChart} from 'vue-d3-charts'

export default {
  data() {
    return {
      chart_title: 'Your title goes here',
      chart_source: 'Your source goes here',
      chart_data: [
        //...
        {hours: 2479, year: 2008},
        {hours: 3200, year: 2009}
      ],
      chart_config: {
        key: 'year',
        currentKey: 2004,
        value: 'hours',
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
  }
}
</script>