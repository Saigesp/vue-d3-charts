<template>
  <div>
    <h4>{{title}}</h4>
    <p v-if="desc">{{desc}}</p>
    <D3BarChart :config="chart_config" :datum="chart_data"></D3BarChart>
    <div v-highlight><pre class="language-html"><code>{{codehtml}}</code></pre></div>
    <div v-highlight><pre class="language-js"><code>{{codejs}}</code></pre></div>
  </div>
</template>


<script>
import {D3BarChart} from 'vue-d3-charts'

export default {
  name: 'BarChartExampleHorizontal',
  components: {
    D3BarChart,
  },
  data() {
    return {
      chart_config: {
        key: 'category',
        values: ['vue', 'd3'],
        orientation: 'horizontal',
        color: {
          keys: {
            vue: '#41b882',
            d3: '#b35899', 
          }
        }
      },
      chart_data: [
        {vue: 20, d3: 62, category: 'lorem'},
        {vue: 28, d3: 47, category: 'ipsum'},
        {vue: 35, d3: 36, category: 'dolor'},
        {vue: 60, d3: 24, category: 'sit'},
        {vue: 65, d3: 18, category: 'amet'},
      ],
      codehtml: `<template>
  <div class="my-app">
    <D3BarChart :config="chart_config" :datum="chart_data"></D3BarChart>
  </div>
</template>`,
      codejs:`import { D3BarChart } from 'vue-d3-charts';

export default {
  components: {
    D3BarChart,
  },
  data() {
    return {
      chart_data: [
        {vue: 20, d3: 62, category: 'lorem'},
        {vue: 28, d3: 47, category: 'ipsum'},
        {vue: 35, d3: 36, category: 'dolor'},
        {vue: 60, d3: 24, category: 'sit'},
        {vue: 65, d3: 18, category: 'amet'},
      ],
      chart_config: {
        key: 'category',
        values: ['vue', 'd3'],
        orientation: 'horizontal',
        color: {
          keys: {
            vue: '#41b882',
            d3: '#b35899', 
          },
        },
      },
    }
  },
}`,
    }
  },
  props: {
    title: {
      type: String,
      default: 'Horizontal bar chart'
    },
    desc: {
      type: String,
      default: ''
    }
  },
}
</script>