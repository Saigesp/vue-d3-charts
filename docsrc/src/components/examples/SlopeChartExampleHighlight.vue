<template>
    <div>
        <h4>{{title}}</h4>
        <D3SlopeChart :config="config" :datum="data"></D3SlopeChart>
        <pre><code>data = [
  { start: 2355, end: 5855, name: "Lorem" },
  { start: 4260, end: 6510, name: "Ipsum" },
  { start: 5029, end: 5138, name: "Dolor" }
]

config = {
  key: 'name',
  currentKey: 'Lorem',
  color: {
    current: '#41B882'
  },
  axis: {
    titles: ['Sit', 'Amet']
  }
}</code></pre>
    </div>
</template>


<script>
import {D3SlopeChart} from 'vue-d3-charts'

export default {
    name: 'SlopeChartExampleHighlight',
    data() {
        return {
            title: 'Highlighted value and labeled axis',
            config: {key: 'name', color: {current: '#41B882'}, currentKey: 'Lorem', axis: {titles: ['Sit', 'Amet']}},
            data: [
                { start: 2355, end: 5855, name: "Lorem" },
                { start: 4260, end: 6510, name: "Ipsum" },
                { start: 5029, end: 5138, name: "Dolor" },
            ]
        }
    }
}
</script>