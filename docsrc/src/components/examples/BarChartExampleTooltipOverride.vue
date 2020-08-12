<template>
  <div>
    <h4>{{title}}</h4>
    <p v-if="desc">{{desc}}</p>
    <D3BarChart :config="config" :datum="data" :title="customtitle" :source="customsource"></D3BarChart>
    <div class="example__controls">
      <select v-model="config.currentKey">
        <option :value="d.year" v-for="d in data" :key="d.year">{{d.year}}</option>
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
  name: 'BarChartExampleTooltipOverride',
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
        tooltip: { label: 'tooltipLabel' },
        axis: {
          yTicks: 4
        },
        color: {default: '#222f3e', current: '#41B882'}
      },
      data: [
        {hours: 238, year: '2000', tooltipLabel: 'Worked Hours'},
        {hours: 938, year: '2001', tooltipLabel: 'Worked Hours'},
        {hours: 1832, year: '2002', tooltipLabel: 'Worked Hours'},
        {hours: 2092, year: '2003', tooltipLabel: 'Worked Hours'},
        {hours: 2847, year: '2004', tooltipLabel: 'Worked Hours'},
        {hours: 2576, year: '2005', tooltipLabel: 'Worked Hours'},
        {hours: 2524, year: '2006', tooltipLabel: 'Worked Hours'},
        {hours: 1648, year: '2007', tooltipLabel: 'Worked Hours'},
        {hours: 2479, year: '2008', tooltipLabel: 'Worked Hours'},
        {hours: 3200, year: '2009', tooltipLabel: 'Worked Hours'},
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
        {hours: 238, year: '2000', tooltipLabel: 'Worked Hours'},
        {hours: 938, year: '2001', tooltipLabel: 'Worked Hours'},
        {hours: 1832, year: '2002', tooltipLabel: 'Worked Hours'},
      ],
      chart_config: {
        key: 'year',
        currentKey: '2004',
        values: ['hours'],
        tooltip: { label: 'tooltipLabel' },
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
      default: 'Basic bar chart with tooltip label override'
    },
    desc: {
      type: String,
      default: ''
    }
  },
}
</script>