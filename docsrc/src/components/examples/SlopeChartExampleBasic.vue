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
  values: ['start', 'end'],
  color: {
    current: '#41B882'
  }
}</code></pre>
    </div>
</template>


<script>
import {D3SlopeChart} from 'vue-d3-charts'

export default {
    name: 'SlopeChartExampleBasic',
    data() {
        return {
            title: 'Basic slope chart',
            config: { key: 'name', color: { current: '#41B882' } },
            data: [
                { start: 2355, end: 5855, name: "Lorem" },
                { start: 4260, end: 6510, name: "Ipsum" },
                { start: 5029, end: 5138, name: "Dolor" },
            ]
        }
    }
}
</script>