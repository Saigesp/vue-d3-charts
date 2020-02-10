<template>
  <div>
    <h4>{{title}}</h4>
    <p v-if="desc">{{desc}}</p>
    <D3PieChart :config="chart_config" :datum="chart_data"></D3PieChart>
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
import { D3PieChart } from 'vue-d3-charts'

export default {
  name: 'PieChartExampleDataUpdate',
  components: {
    D3PieChart,
  },
  data() {
    return {
      chart_config: {
        key: 'name',
        value: 'hours',
        color: {scheme: 'schemeTableau10'},
        radius: {inner: 80}
      },
      chart_data: [
        {hours: 20, name: 'Lorem'},
        {hours: 30, name: 'Ipsum'},
        {hours: 31, name: 'Dolor'},
        {hours: 15, name: 'Sit'},
      ],
      codehtml: `<template>
  <div class="my-app">
    
    <!-- chart -->
    <D3PieChart
      :config="chart_config"
      :datum="chart_data"
    ></D3PieChart>

    <button @click="addData()">Add</button>
    <button @click="removeFirst()">Remove first</button>
    <button @click="removeLast()">Remove last</button>

  </div>
</template>`,
      codejs:`import { D3PieChart } from 'vue-d3-charts';

export default {
  components: {
    D3PieChart,
  },
  data() {
    return {
      chart_data: [
        {hours: 20, name: 'Lorem'},
        {hours: 30, name: 'Ipsum'},
        {hours: 31, name: 'Dolor'},
        {hours: 15, name: 'Sit'},
      ],
      chart_config: {
        key: 'name',
        value: 'hours',
        color: {scheme: 'schemeTableau10'},
        radius: {inner: 80}
      },
      count: 1
    }
  },
  methods: {
    addData(){
      const hours = Math.floor(Math.random() * 30);
      const name = 'New '+this.count++;
      this.chart_data.push({hours, name})
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
      count: 1
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
      const hours = Math.floor(Math.random() * 30);
      const name = 'New '+this.count++;
      this.chart_data.push({hours, name})
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