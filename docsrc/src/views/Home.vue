<template>
  <div class="home">
    home
    <D3BarChart :config="barconfig" :datum="bardata"></D3BarChart>
    bye
  </div>
</template>

<script>

import {D3BarChart} from 'vue-d3-charts'
console.log(D3BarChart);


export default {
  name: 'home',
  data(){
    return {
      barconfig: {
        key: 'name',
        value: 'total'
      },
      bardata: [
        {name: 'ey', total: 30},
        {name: 'yo', total: 40},
      ]
    }
  }
}
</script>
