<template>
  <div>
    <h4>{{title}}</h4>
    <D3LineChart :config="config" :datum="data"></D3LineChart>
    <div v-highlight><pre class="language-html"><code>{{codehtml}}</code></pre></div>
    <div v-highlight><pre class="language-js"><code>{{codejs}}</code></pre></div>
  </div>
</template>


<script>
import {D3LineChart} from 'vue-d3-charts'

export default {
  name: 'LineChartExampleCustomization',
  components: {
    D3LineChart,
  },
  data() {
    return {
      title: 'Customized line chart',
      config: {
        values: ['hours', 'production'],
        date: {
          key: 'date',
          inputFormat: '%Y-%m-%d',
          outputFormat: '%B',
        },
        tooltip: {
          labels: ['Total hours', 'Total production']
        },
        axis: {
          yFormat: '.1s',
          yTicks: 6,
          yTitle: 'Lorem ipsum',
          xTicks: 5,
        },
        color: {
          scheme: ['#41B882', '#222f3e']
        },
        curve: 'curveStep',
        transition: {
          ease: 'easeBounceOut',
          duration: 1000
        }
      },
      data: [
        {hours: 2092, production: 1343, date: '2003-01-01'},
        {hours: 2847, production: 1346, date: '2003-02-01'},
        {hours: 2576, production: 1233, date: '2003-03-01'},
        {hours: 2524, production: 1325, date: '2003-04-01'},
        {hours: 1648, production: 1456, date: '2003-05-01'},
      ],
      codehtml: `<template>
  <div class="my-app">
    <D3LineChart :config="chart_config" :datum="chart_data"></D3LineChart>
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
        {hours: 2092, production: 1343, date: 2003},
        {hours: 2847, production: 1346, date: 2004},
        {hours: 2576, production: 1233, date: 2005},
        {hours: 2524, production: 1325, date: 2006},
        {hours: 1648, production: 1456, date: 2007}
      ],
      chart_config: {
        values: ['hours', 'production'],
        date: {
          key: 'date',
          inputFormat: '%Y',
          outputFormat: '%Y',
        },
        tooltip: {
          labels: ['Total hours', 'Total production']
        },
        axis: {
          yFormat: '.1s',
          yTicks: 6,
          yTitle: 'Lorem ipsum',
          xTicks: 5,
        },
        color: {
          scheme: ['#41B882', '#222f3e']
        },
        curve: 'curveStep',
        transition: {
          ease: 'easeBounceOut',
          duration: 1000
        }
      }
    }
  }
}`
    }
  }
}
</script>