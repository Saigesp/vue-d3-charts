<template>
  <div class="page page--home">
    <div class="page__wrap">
      <h1 class="page__title">vue-d3-charts</h1>
      <D3BarChart :config="barconfig" :datum="bardata"></D3BarChart>
    </div>
  </div>
</template>

<script>
import {D3BarChart} from 'vue-d3-charts'

export default {
  name: 'home',
  data(){
    return {
      barconfig: {
        key: 'name',
        value: 'total'
      },
      bardata: [
        {name: '1992', total: 4748},
        {name: '1993', total: 5526},
        {name: '1994', total: 8574},
        {name: '1995', total: 15805},
        {name: '1996', total: 14582},
        {name: '1997', total: 26694},
        {name: '1998', total: 35205},
        {name: '1999', total: 45944},
        {name: '2000', total: 78595},
        {name: '2001', total: 78530},
        {name: '2002', total: 45407},
        {name: '2003', total: 54044},
        {name: '2004', total: 69165},
        {name: '2005', total: 61798},
        {name: '2006', total: 63686},
      ]
    }
  }
}
</script>
