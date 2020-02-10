<template>
  <div class="page">

    <ChartTitleComponent :name="chartname" :desc="chartdesc"></ChartTitleComponent>

    <section class="chart">
      <D3WordsCloud :config="chartconfig" :datum="chartdata" title="Lorem ipsum dolor sit amet"></D3WordsCloud>
    </section>

    <section class="text text--center">
      <br>This chart uses <a href="https://github.com/jasondavies/d3-cloud">d3-clouds</a>, developed by <a href="https://www.jasondavies.com/">Jason Davies</a>.
    </section>

    <ChartImportComponent :code="chartname" link="https://github.com/Saigesp/vue-d3-charts/blob/master/src/wordscloud/d3.wordscloud.js"></ChartImportComponent>

    <ChartTemplateComponent :template="chartcode"></ChartTemplateComponent>

    <ChartDataComponent :desc="chartdatadesc" :code="chartdatacode" :config="chartdataconfig"></ChartDataComponent>
    
    <ChartConfigComponent :options="chartoptions" :custom="chartcustomoptions"></ChartConfigComponent>

    <ChartColorComponent></ChartColorComponent>

    <ChartStylesComponent classname="wordcloud"></ChartStylesComponent>
<!--
    <WordsCloudExamples></WordsCloudExamples>
 -->
  </div>
</template>
<script>
import { D3WordsCloud } from 'vue-d3-charts';

export default {
  name: 'WordsCloud',
  components: {
    D3WordsCloud,
  },
  data() {
    return {
      chartname: 'D3WordsCloud',
      chartdesc: 'A words cloud is a visual representation of text data, typically used to depict keyword metadata.',
      chartcode: '<D3WordsCloud :config="chart_config" :datum="chart_data"></D3WordsCloud>',
      chartoptions: ['margin', 'color', 'transition', 'fontFamily', 'angle'],
      chartcustomoptions: {
        angle: {
          type: 'Object or Array',
          desc: "Word's angle configuration options (in degrees).",
          example: '<code>angle: [-90, -45, 0, 45, 90]</code>',
        },
      },
      chartconfig: {
        key: 'word',
        value: 'size',
        color: {scheme: 'schemeTableau10'},
        angle: [0, 90],
      },
      chartdata: [
        { word: 'Lorem', size: 60 },
        { word: 'Ipsum', size: 10 },
        { word: 'Dolor', size: 20 },
        { word: 'Sit', size: 50 },
        { word: 'Amet', size: 30 },
      ],
      chartdatadesc: 'An <strong>objects array</strong> is expected, with each object as a words',
      chartdatacode: `chart_data = [{
  word: "Lorem",
  size: 30
},{
  word: "Ipsum",
  size: 23
},{
  word: "Dolor",
  size: 64
}]`,
      chartdataconfig: '<code>key: "word", value: "size"</code>',
    }
  },
  mounted(){
    setTimeout(() => {
      this.chartdata = this.chartdata.concat(
      [
        { word: 'Consectetur', size: 20 },
        { word: 'Adipiscing', size: 30 },
        { word: 'Elit', size: 10 },
      ])
    }, 2000);

    setTimeout(() => {
      this.chartdata = this.chartdata.concat(
      [
        { word: 'Sed', size: 12 },
        { word: 'Do', size: 20 },
        { word: 'Eiusmod', size: 40 },
        { word: 'Tempor', size: 45 },
        { word: 'Incididunt', size: 30 },
      ])
    }, 4000);

    setTimeout(() => {
      this.chartdata = this.chartdata.concat(
      [
        { word: 'Ut', size: 20 },
        { word: 'Labore', size: 60 },
        { word: 'Et', size: 15 },
        { word: 'Dolore', size: 35 },
        { word: 'Magna', size: 50 },
        { word: 'Aliqua', size: 25 },
      ])
    }, 6000);
  },
};
</script>
