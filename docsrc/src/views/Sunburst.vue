<template>
  <div class="page">

    <ChartTitleComponent :name="chartname" :desc="chartdesc"></ChartTitleComponent>

    <section class="chart">
      <D3Sunburst :config="chartconfig" :datum="chartdata" title="Lorem ipsum dolor sit amet"></D3Sunburst>
    </section>

    <ChartImportComponent :code="chartname" link="https://github.com/Saigesp/vue-d3-charts/blob/master/src/sunburst/d3.sunburst.js"></ChartImportComponent>

    <ChartTemplateComponent :template="chartcode"></ChartTemplateComponent>

    <ChartDataComponent :desc="chartdatadesc" :code="chartdatacode" :config="chartdataconfig"></ChartDataComponent>
    
    <ChartConfigComponent :options="chartoptions"></ChartConfigComponent>

    <ChartColorComponent></ChartColorComponent>

    <ChartStylesComponent classname="sunburst"></ChartStylesComponent>
<!--
    <SunburstExamples></SunburstExamples>
 -->
  </div>
</template>
<script>
import {D3Sunburst} from 'vue-d3-charts'

export default {
  name: 'Sunburst',
  data() {
    return {
      chartname: 'D3Sunburst',
      chartdesc: 'A sunburst is used to visualize hierarchical data, depicted by concentric circles.',
      chartcode: '<D3Sunburst :config="chart_config" :datum="chart_data"></D3Sunburst>',
      chartoptions: ['margin', 'key', 'value', 'color', 'transition'],
      chartconfig: {
        key: 'name',
        value: 'value',
        color: {scheme: ['#C1E4D5', '#41B882', '#80CCAA', '#FC6471', '#384A5F']},
      },
      chartdata: {
        "name": "one",
        "children": [{
          "name": "two",
          "children": [
            {"name": "Lorem", "value": 938},
            {"name": "Ipsum", "value": 3812}
          ]
        },{
          "name": "four",
          "value": 2354
        }]
      },
      chartdatadesc: 'An <strong>hierachycal object</strong> is expected',
      chartdatacode: `chart_data = {
  "name": "one",
  "children": [{
    "name": "two",
    "children": [{
      "name": "three",
      "value": 2354
    },{
      "name": "four",
      "value": 1384
    }]
  }]
}`,
      chartdataconfig: '<code>key: "name", value: "value"</code>'
    }
  },
  mounted(){

  }
}
</script>