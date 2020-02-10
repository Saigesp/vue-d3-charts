<template>
    <div>
        <h4>{{title}}</h4>
        <D3SlopeChart :config="config" :datum="data"></D3SlopeChart>
        <div v-highlight><pre class="language-html"><code>{{codehtml}}</code></pre></div>
        <div v-highlight><pre class="language-js"><code>{{codejs}}</code></pre></div>
    </div>
</template>


<script>
import { D3SlopeChart } from 'vue-d3-charts'

export default {
    name: 'SlopeChartExampleHighlight',
    components: {
      D3SlopeChart,
    },
    data() {
        return {
            title: 'Highlighted value and labeled axis',
            config: {key: 'name', color: {current: '#41B882'}, currentKey: 'Lorem', axis: {titles: ['Sit', 'Amet']}},
            data: [
                { start: 2355, end: 5855, name: "Lorem" },
                { start: 4260, end: 6510, name: "Ipsum" },
                { start: 5029, end: 5138, name: "Dolor" },
            ],
            codehtml: `<template>
  <div class="my-app">
    <D3SlopeChart :config="chart_config" :datum="chart_data"></D3SlopeChart>
  </div>
</template>`,
            codejs:`import { D3SlopeChart } from 'vue-d3-charts';

export default {
  components: {
    D3SlopeChart,
  },
  data() {
    return {
      chart_data: [
        { start: 2355, end: 5855, name: "Lorem" },
        { start: 4260, end: 6510, name: "Ipsum" },
        { start: 5029, end: 5138, name: "Dolor" }
      ],
      chart_config: {
        key: 'name',
        currentKey: 'Lorem',
        color: {
          current: '#41B882'
        },
        axis: {
          titles: ['Sit', 'Amet']
        }
      }
    }
  }
}`
        }
    }
}
</script>