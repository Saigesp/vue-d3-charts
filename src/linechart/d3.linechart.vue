<script>
import D3Chart from '../d3.chart.vue';
import d3linechart from './d3.linechart';

export default {
  name: 'D3LineChart',
  extends: D3Chart,
  mounted() {
    this.chart = new d3linechart(
      this.$refs.chart,
      JSON.parse(JSON.stringify(this.datum)),
      this.config,
    );
  },
};
</script>
