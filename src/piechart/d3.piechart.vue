<script>
import D3Chart from '../d3.chart.vue';
import d3piechart from './d3.piechart';

export default {
  name: 'D3PieChart',
  extends: D3Chart,
  mounted() {
    this.chart = new d3piechart(
      this.$refs.chart,
      JSON.parse(JSON.stringify(this.datum)),
      this.config,
    );
  },
};
</script>

<style lang="scss">
@import '../styles';

.chart--piechart {
  .chart__line {
    fill: none;
    stroke: black;
  }
}
</style>
