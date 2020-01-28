<script>
import D3Chart from '../d3.chart.vue';
import d3sunburst from './d3.sunburst';

export default {
  name: 'D3Sunburst',
  extends: D3Chart,
  mounted() {
    this.chart = new d3sunburst(
      this.$refs.chart,
      JSON.parse(JSON.stringify(this.datum)),
      this.config,
    );
  },
};
</script>
