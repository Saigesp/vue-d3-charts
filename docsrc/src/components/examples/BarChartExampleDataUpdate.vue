<template>
  <div>
    <h4>{{title}}</h4>
    <p v-if="desc">{{desc}}</p>
    <D3BarChart :config="chart_config" :datum="chart_data"></D3BarChart>
    <div class="example__controls">
      <button @click="addData()">Add</button>
      <button @click="removeFirst()">Remove first</button>
      <button @click="removeLast()">Remove last</button>
    </div>
    <div v-highlight><pre class="language-html"><code>{{codehtml}}</code></pre></div>
    <div v-highlight><pre class="language-js"><code>{{codejs}}</code></pre></div>
  </div>
</template>


<script>
import {D3BarChart} from 'vue-d3-charts'

export default {
  name: 'BarChartExampleDataUpdate',
  components: {
    D3BarChart,
  },
  data() {
    return {
      chart_config: {
        key: 'year',
        values: ['hours']
      },
      chart_data: [
        {hours: 238, year: '2000'},
        {hours: 938, year: '2001'},
        {hours: 1832, year: '2002'},
        {hours: 2092, year: '2003'},
        {hours: 2847, year: '2004'},
        {hours: 2576, year: '2005'},
        {hours: 2524, year: '2006'},
        {hours: 1648, year: '2007'},
        {hours: 2479, year: '2008'},
        {hours: 3200, year: '2009'},
      ],
      codehtml: `<template>
  <div class="my-app">
    
    <!-- chart -->
    <D3BarChart
      :config="chart_config"
      :datum="chart_data"
    ></D3BarChart>

    <button @click="addData()">Add</button>
    <button @click="removeFirst()">Remove first</button>
    <button @click="removeLast()">Remove last</button>

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
        //...
        {hours: 1648, year: '2007'},
        {hours: 2479, year: '2008'},
        {hours: 3200, year: '2009'}
      ],
      chart_config: {
        key: 'year',
        values: ['hours']
      },
      count: 2010
    }
  },
  methods: {
    addData(){
      const hours = Math.floor(Math.random() * 10000);
      const year = (this.count++).toString();
      this.chart_data.push({hours, year})
    },
    removeFirst(){
      if(!this.chart_data.length) return;
      this.chart_data.splice(0, 1);
    },
    removeLast(){
      if(!this.chart_data.length) return;
      this.chart_data.splice(this.chart_data.length-1, 1);
    }
  }
}`,
      count: 2010
    }
  },
  props: {
    title: {
      type: String,
      default: 'Bar chart with data update'
    },
    desc: {
      type: String,
      default: ''
    }
  },
  methods: {
    addData(){
      const hours = Math.floor(Math.random() * 10000);
      const year = (this.count++).toString();
      this.chart_data.push({hours, year})
    },
    removeFirst(){
      if(!this.chart_data.length) return;
      this.chart_data.splice(0, 1);
    },
    removeLast(){
      if(!this.chart_data.length) return;
      this.chart_data.splice(this.chart_data.length-1, 1);
    }
  }
}
</script>