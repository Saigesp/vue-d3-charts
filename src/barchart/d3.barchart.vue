<script>
import D3Chart from '../d3.chart.vue';
import d3barchart from './d3.barchart';

export default {
  name: 'D3BarChart',
  extends: D3Chart,
  mounted() {
    this.chart = new d3barchart(
      this.$refs.chart,
      JSON.parse(JSON.stringify(this.datum)),
      this.config,
    );
  },
};
</script>
