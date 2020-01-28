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
    
    <ChartConfigComponent :options="chartoptions"></ChartConfigComponent>

    <ChartColorComponent></ChartColorComponent>

    <ChartStylesComponent classname="sunburst"></ChartStylesComponent>
<!--
    <WordsCloudExamples></WordsCloudExamples>
 -->
  </div>
</template>
<script>
import {D3WordsCloud} from 'vue-d3-charts'

export default {
  name: 'WordsCloud',
  data() {
    return {
      chartname: 'D3WordsCloud',
      chartdesc: 'A words cloud is a visual representation of text data, typically used to depict keyword metadata.',
      chartcode: '<D3WordsCloud :config="chart_config" :datum="chart_data"></D3WordsCloud>',
      chartoptions: ['margin', 'color', 'transition'],
      chartconfig: {
        key: 'word',
        value: 'size',
      },
      chartdata: [
        {word: "Lorem", size: 60},
        {word: "Ipsum", size: 10},
        {word: "Dolor", size: 20},
        {word: "Sit", size: 50},
        {word: "Amet", size: 30},
        {word: "Consectetur", size: 20},
        {word: "Adipiscing", size: 30},
        {word: "Elit", size: 10},
      ],
      chartdatadesc: 'An <strong>objects array</strong> is expected, with each object as a words',
      chartdatacode: `chart_data = []`,
      chartdataconfig: '<code>?</code>',
    }
  },
  mounted(){
  },
};
</script>
