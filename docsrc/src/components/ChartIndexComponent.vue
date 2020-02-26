<template>
  <section class="chart-grid">
    <h2>Charts</h2>
    <div class="chart-grid__list">
      <div class="chart-grid__item" v-for="chart in charts" v-if="$route.path !== '/'+chart.routername">
        <router-link :to="{name: chart.routername}">
          <img :src="'./img/icons/D3'+chart.chart+'.svg'" :alt="chart.chart">
          <h5>{{chart.chart}}</h5>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ChartIndexComponent',
  data(){
    return {
      charts: [
        {chart: 'BarChart', routername: 'barchart'},
        {chart: 'LineChart', routername: 'linechart'},
        {chart: 'PieChart', routername: 'piechart'},
        {chart: 'SlicesChart', routername: 'sliceschart'},
        {chart: 'SlopeChart', routername: 'slopechart'},
        {chart: 'Sunburst', routername: 'sunburst'},
        {chart: 'WordsCloud', routername: 'wordscloud'},
      ],
    };
  },
};
</script>

<style lang="scss">
.chart-grid {
  &__list {
    display: flex;
    flex-wrap: wrap;
    flex-grow: none;
  }
  &__item {
    flex: 1 1 auto;
    text-align: center;
    padding: 20px;
    img {
      display: block;
      width: 100px;
      margin: 0 auto 6px;
      background: #f5f2f0;
      border-radius: 100%;
      overflow: hidden;
    }
    a {
      display: contents;
      color: inherit;
      &:hover {
        img {
          background: #41b882;
        }
        h5 {
          color: black;
        }
      }
    }
    h5 {
      display: inline-block;
      margin-top: 3px;
    }
  }
}
</style>
