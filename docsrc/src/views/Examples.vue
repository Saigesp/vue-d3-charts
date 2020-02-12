<template>
  <div class="page">

    <section class="example">
      <h2 class="page__title">Examples</h2>
      <p class="page__claim">Select chart to see code examples</p>
      <div class="example__controls">
        <select v-model="currentComponent">
          <option :value="chart.component" v-for="chart in charts">{{chart.name}}</option>
        </select>
      </div>
    </section>

    <div v-if="currentComponent">
      <component v-bind:is="currentComponent"></component>
    </div>

  </div>
</template>


<script>
export default {
  name: 'Examples',
  data(){
    return {
      currentComponent: false,
      charts: [
        {name: 'Bar chart',   component: 'BarChartExamples'},
        {name: 'Pie chart',   component: 'PieChartExamples'},
        {name: 'Line chart',  component: 'LineChartExamples'},
        {name: 'Slope chart', component: 'SlopeChartExamples'},
      ]
    }
  }
}
</script>