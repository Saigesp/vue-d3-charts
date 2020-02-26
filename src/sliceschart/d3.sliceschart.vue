<script>
import D3Chart from '../d3.chart.vue';
import d3sliceschart from './d3.sliceschart';

export default {
  name: 'D3SlicesChart',
  extends: D3Chart,
  mounted() {
    this.chart = new d3sliceschart(
      this.$refs.chart,
      JSON.parse(JSON.stringify(this.datum)),
      this.config,
    );
  },
};
</script>

<style lang="scss">
@import '../styles';
</style>
