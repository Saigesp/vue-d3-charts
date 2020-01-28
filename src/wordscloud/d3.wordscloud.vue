<script>
import D3Chart from '../d3.chart.vue';
import d3wordscloud from './d3.wordscloud';

export default {
  name: 'D3WordsCloud',
  extends: D3Chart,
  mounted() {
    this.chart = new d3wordscloud(
      this.$refs.chart,
      JSON.parse(JSON.stringify(this.datum)),
      this.config,
    );
  },
};
</script>
