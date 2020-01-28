<script>
import D3Chart from '../d3.chart.vue';
import d3slopechart from './d3.slopechart';

export default {
  name: 'D3SlopeChart',
  extends: D3Chart,
  mounted() {
    this.chart = new d3slopechart(
      this.$refs.chart,
      JSON.parse(JSON.stringify(this.datum)),
      this.config,
    );
  },
};
</script>

<style lang="scss">
@import '../styles';

.chart--slopegraph {
  .chart__line--current {
    stroke-width: 2px;
  }
}
</style>
