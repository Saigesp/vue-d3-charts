<template>
  <div>
    <h4>{{title}}</h4>
    <p v-if="desc">{{desc}}</p>
    <D3BarChart :config="config" :datum="data"></D3BarChart>
    <div v-highlight><pre class="language-html"><code>{{codehtml}}</code></pre></div>
    <div v-highlight><pre class="language-js"><code>{{codejs}}</code></pre></div>
  </div>
</template>


<script>
import { D3BarChart } from 'vue-d3-charts';

export default {
  name: 'BarChartExampleGroup',
  components: {
    D3BarChart,
  },
  data() {
    return {
      config: {
        key: 'year',
        values: ['lorem', 'ipsum', 'dolor', 'sit'],
        axis: {
          yTicks: 4
        },
        color: {
          keys: {
            lorem: '#F98B3B',
            ipsum: '#F26643',
            dolor: '#FF463D',
            sit: '#C92C39',
          },
        },
      },
      data: [
        {lorem: 538, ipsum: 3153, dolor: 5330, sit: 3530,  year: '2000'},
        {lorem: 938, ipsum: 5163, dolor: 6350, sit: 5630,  year: '2001'},
        {lorem: 1832, ipsum: 3151, dolor: 5130, sit: 3510, year: '2002'},
        {lorem: 2092, ipsum: 1681, dolor: 8110, sit: 1810, year: '2003'},
        {lorem: 2847, ipsum: 2513, dolor: 1320, sit: 2130, year: '2004'},
        {lorem: 2576, ipsum: 6854, dolor: 5460, sit: 6540, year: '2005'},
        {lorem: 2524, ipsum: 6841, dolor: 4160, sit: 6410, year: '2006'},
        {lorem: 1648, ipsum: 9613, dolor: 1390, sit: 9130, year: '2007'},
        {lorem: 2479, ipsum: 6315, dolor: 1560, sit: 6150, year: '2008'},
        {lorem: 3200, ipsum: 12541, dolor: 5421, sit: 2541, year: '2009'},
      ],
      codehtml: `<template>
  <D3BarChart :config="chart_config" :datum="chart_data"></D3BarChart>
</template>`,
            codejs:`import { D3BarChart } from 'vue-d3-charts';

export default {
  components: {
    D3BarChart,
  },
  data() {
    return {
      chart_data: [
        //...
        {lorem: 1648, ipsum: 9613, dolor: 1390, sit: 9130, year: '2007'},
        {lorem: 2479, ipsum: 6315, dolor: 1560, sit: 6150, year: '2008'},
        {lorem: 3200, ipsum: 12541, dolor: 5421, sit: 2541, year: '2009'},
      ],
      chart_config: {
        key: 'year',
        values: ['lorem', 'ipsum', 'dolor', 'sit'],
        axis: {
          yTicks: 4
        },
        color: {
          keys: {
            lorem: '#F98B3B',
            ipsum: '#F26643',
            dolor: '#FF463D',
            sit: '#C92C39',
          },
        },
      },
    };
  },
};`
    }
  },
  props: {
    title: {
      type: String,
      default: 'Grouped bar chart'
    },
    desc: {
      type: String,
      default: ''
    }
  },
}
</script>