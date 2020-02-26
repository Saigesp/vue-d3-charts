<template>
  <div>
    <h4>{{title}}</h4>
    <D3LineChart :config="chart_config" :datum="chart_data"></D3LineChart>
    <div class="example__controls">
      <button @click="addData()">Add</button>
    </div>
    <div v-highlight><pre class="language-html"><code>{{codehtml}}</code></pre></div>
    <div v-highlight><pre class="language-js"><code>{{codejs}}</code></pre></div>
  </div>
</template>


<script>
import {D3LineChart} from 'vue-d3-charts'

export default {
  name: 'LineChartExampleBasic',
  components: {
    D3LineChart,
  },
  data() {
    return {
      title: 'Line chart update',
      chart_config: {
        values: ['hours', 'production'],
        date: {
          key: 'date',
          inputFormat: '%Y',
          outputFormat: '%Y',
        },
        color: {
          scheme: ['#41B882', '#222f3e']
        },
        axis: {
          yTicks: 3,
        },
      },
      chart_data: [
        {hours: 238, production: 134, date: 2000},
        {hours: 938, production: 478, date: 2001},
        {hours: 1832, production: 1392, date: 2002},
        {hours: 2092, production: 2343, date: 2003},
        {hours: 2847, production: 2346, date: 2004},
        {hours: 2576, production: 2233, date: 2005},
        {hours: 2524, production: 2325, date: 2006},
        {hours: 1648, production: 2456, date: 2007},
        {hours: 2479, production: 2329, date: 2008},
        {hours: 3200, production: 2438, date: 2009},
      ],
      count: 2010,
      codehtml: `<template>
  <div class="my-app">
    <D3LineChart :config="chart_config" :datum="chart_data"></D3LineChart>
    <button @click="addData()">Add</button>
  </div>
</template>`,
      codejs:`import { D3LineChart } from 'vue-d3-charts';

export default {
  components: {
    D3LineChart,
  },
  data() {
    return {
      chart_data: [
        {hours: 238, production: 134, date: 2000},
        {hours: 938, production: 478, date: 2001},
        {hours: 1832, production: 1392, date: 2002},
        {hours: 2092, production: 2343, date: 2003},
        {hours: 2847, production: 2346, date: 2004},
        {hours: 2576, production: 2233, date: 2005},
        {hours: 2524, production: 2325, date: 2006},
        {hours: 1648, production: 2456, date: 2007},
        {hours: 2479, production: 2329, date: 2008},
        {hours: 3200, production: 2438, date: 2009}
      ],
      chart_config: {
        values: ['hours', 'production'],
        date: {
          key: 'date',
          inputFormat: '%Y',
          outputFormat: '%Y',
        },
        points:false,
        axis: {
          yTicks: 3,
        }
      },
      count: 2010,
    }
  },
  methods: {
    addData() {
      const hours = Math.floor(Math.random() * 1000 * 3);
      const production = Math.floor(Math.random() * 1000 * 3);
      const date = this.count++;
      this.chart_data.push({hours, production, date});
    },
  }
}`
    }
  },
  methods: {
    addData() {
      const hours = Math.floor(Math.random() * 1000 * 3);
      const production = Math.floor(Math.random() * 1000 * 3);
      const date = this.count++;
      this.chart_data.push({hours, production, date});
    },
  }
}
</script>