<template>
  <div class="page">

    <ChartTitleComponent :name="chartname" :desc="chartdesc"></ChartTitleComponent>

    <section class="chart">
      <D3Sunburst :config="chartconfig" :datum="chartdata" title="Lorem ipsum" source="Dolor sit amet"></D3Sunburst>
    </section>

    <ChartImportComponent :code="chartname" link="https://github.com/Saigesp/vue-d3-charts/blob/master/src/sunburst/d3.sunburst.js"></ChartImportComponent>

    <ChartTemplateComponent :template="chartcode"></ChartTemplateComponent>

    <ChartDataComponent :desc="chartdatadesc" :code="chartdatacode" :config="chartdataconfig"></ChartDataComponent>
<!--

    <ChartConfigComponent :options="chartoptions" :custom="chartcustomoptions"></ChartConfigComponent>

-->
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
/*
      chartoptions: ['margin', 'key', 'currentKey', 'values', 'color', 'opacity', 'transition', 'axis', 'points'],
      chartcustomoptions: {
        axis: {
          default: `axis: {
    titles: false
  }`,
          desc: "Axis custom properties.",
          example: '<code>axis: {titles: ["Yesterday", "Today"]}</code>'
        },
        margin: {
          default: `margin: {
    top: 10,
    right: 100,
    bottom: 20,
    left: 100
  }`
        }
      },
*/
      chartconfig: {
        key: 'name',
        value: 'value',
        color: {scheme: ['#EFEFEF', '#41B882', '#80CCAA', '#FC6471', '#384A5F']},
      },
      chartdata: {
        "name": "one",
        "children": [{
          "name": "two",
          "value": 5354,
          "children": [
            {"name": "Lorem", "value": 938},
            {"name": "Ipsum", "value": 3812}
          ]
        },{
          "name": "four",
          "value": 7354
        }]
      },
      chartdatadesc: 'An <strong>hierachycal object</strong> is expected',
      chartdatacode: `chart_data = {
  "name": "one",
  "children": [{
    "name": "two",
    "children": [{
      "name": "three",
      "children": [
        {"name": "Lorem", "value": 3938},
        {"name": "Ipsum", "value": 3812},
        {"name": "Dolor", "value": 6714},
        {"name": "SitAm", "value": 1002}
     ]
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