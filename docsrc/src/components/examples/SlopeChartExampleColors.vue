<template>
    <div>
        <h4>{{title}}</h4>
        <D3SlopeChart :config="config" :datum="data"></D3SlopeChart>
        <pre><code>data = [
  { start: 2355, end: 5855, name: "Lorem" },
  { start: 4260, end: 6510, name: "Ipsum" },
  { start: 5029, end: 5138, name: "Dolor" },
  { start: 3135, end: 4547, name: "Sit" },
  { start: 3640, end: 6860, name: "Amet" }
]

config = {
  key: 'name',
  currentKey: 'Dolor',
  color: {
    current: 'red',
    scheme: 'schemeTableau10',
    keys: {
      'Lorem': 'black',
      'Ipsum': 'orange'
    }
  }
}</code></pre>
    </div>
</template>
<script>
import { D3SlopeChart } from 'vue-d3-charts'

export default {
  name: 'SlopeChartExampleColors',
  data() {
    return {
      title: 'Color scheme, currentKey and color keys',
      config: { key: 'name', currentKey: 'Dolor', color: { current: 'red', scheme: 'schemeTableau10', keys: { 'Lorem': 'black', 'Ipsum': 'orange' } } },
      data: [
        { start: 2355, end: 5855, name: "Lorem" },
        { start: 4260, end: 6510, name: "Ipsum" },
        { start: 5029, end: 5138, name: "Dolor" },
        { start: 3135, end: 4547, name: "Sit" },
        { start: 3640, end: 6860, name: "Amet" },
      ]
    }
  }
}
</script>