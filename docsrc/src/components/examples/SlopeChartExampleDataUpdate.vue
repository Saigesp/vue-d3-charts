<template>
    <div class="example">
        <h4>{{title}}</h4>
        <p v-if="desc">{{desc}}</p>
        <D3SlopeChart :config="chart_config" :datum="chart_data"></D3SlopeChart>
        <div class="example__controls">
          <button @click="addData()">Add</button>
          <button @click="removeData()">Remove</button>
        </div>
        <div v-highlight><pre class="language-html"><code>{{codehtml}}</code></pre></div>
        <div v-highlight><pre class="language-js"><code>{{codejs}}</code></pre></div>
    </div>
</template>


<script>
import { D3SlopeChart } from 'vue-d3-charts';

export default {
    name: 'SlopeChartExampleDataUpdate',
    components: {
      D3SlopeChart,
    },
    data() {
        return {
            chart_config: { key: 'name', color: { scheme: 'schemeCategory10' }, transition: {ease: 'easeBounceOut', duration: 1000} },
            chart_data: [
                { start: 2355, end: 5855, name: "Lorem" },
                { start: 4260, end: 6510, name: "Ipsum" },
                { start: 5029, end: 5138, name: "Dolor" },
            ],
            count: 0,
            codehtml: `<template>
  <div>
      <D3SlopeChart :config="chart_config" :datum="chart_data"></D3SlopeChart>
      <button @click="addData()">Add</button>
      <button @click="removeData()">Remove</button>
  </div>
</template>`,
            codejs:`import { D3SlopeChart } from 'vue-d3-charts';

export default {
  components: {
    D3SlopeChart,
  },
  data() {
    return {
      chart_config: {
        key: 'name',
        color: {
          scheme: 'schemeCategory10'
        },
        transition: {
          ease: 'easeBounceOut',
          duration: 1000
        }
      },
      chart_data: [
          { start: 2355, end: 5855, name: "Lorem" },
          { start: 4260, end: 6510, name: "Ipsum" },
          { start: 5029, end: 5138, name: "Dolor" }
      ],
      count: 0
    }
  },
  methods: {
    addData(){
      const start = Math.floor(Math.random() * 20000);
      const end = Math.floor(Math.random() * 20000);
      const name = 'new #'+this.count++;
      this.chart_data.push({start, end, name})
    },
    removeData(){
      if(!this.chart_data.length)
        return;
      const random_index = Math.floor(Math.random() * this.chart_data.length)
      this.chart_data.splice(random_index, 1);
    }
  }
}`,
        }
    },
    props: {
      title: {
        type: String,
        default: 'Data update with bouncing transition'
      },
      desc: {
        type: String,
        default: ''
      },
    },
    methods: {
      addData(){
        const start = Math.floor(Math.random() * 10000);
        const end = Math.floor(Math.random() * 10000);
        const name = 'new #'+this.count++;
        this.chart_data.push({start, end, name})
      },
      removeData(){
        if(!this.chart_data.length)
          return;
        const random_index = Math.floor(Math.random() * this.chart_data.length)
        this.chart_data.splice(random_index, 1);
      }
    }
}
</script>