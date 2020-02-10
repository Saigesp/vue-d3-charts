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
import { D3Sunburst } from 'vue-d3-charts';

export default {
  name: 'Sunburst',
  components: {
    D3Sunburst,
  },
  data() {
    return {
      chartname: 'D3Sunburst',
      chartdesc: 'A sunburst is used to visualize hierarchical data, depicted by concentric circles.',
      chartcode: '<D3Sunburst :config="chart_config" :datum="chart_data"></D3Sunburst>',
      chartoptions: ['margin', 'key', 'value', 'color', 'transition'],
      chartconfig: {
        key: 'name',
        value: 'value',
        color: {
          keys:{
            one: '#C1E4D5',
            two: '#41B882',
            four: '#80CCAA',
            lorem: '#FC6471',
            ipsum: '#384A5F',
          }
        },
        transition: {duration: 500},
      },
      chartdata: [{
        name: "one",
        children: [{
          name: "two",
          value: 9038
        },{
          name: "four",
          value: 554
        }]
      }],
      chartdatadesc: 'An <strong>array with a single hierachycal object</strong> is expected',
      chartdatacode: `chart_data = [{
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
}]`,
      chartdataconfig: '<code>key: "name", value: "value"</code>',
    }
  },
  mounted(){
    setTimeout(() => {
      this.chartdata = [{
        name: "one",
        children: [{
          name: "two",
          children: [
            {name: "lorem", value: 938},
            {name: "ipsum", value: 3812}
          ]
        },{
          name: "four",
          value: 2354
        }]
      }]
    }, 2000);

    setTimeout(() => {
      this.chartdata = [{
        name: "one",
        children: [{
          name: "two",
          children: [
            {name: "dolor", value: 1500},
            {name: "lorem", value: 938},
            {name: "ipsum", value: 3812},
          ]
        },{
          name: "four",
          value: 2354
        }]
      }]
    }, 4000);

    setTimeout(() => {
      this.chartdata = [{
        name: "one",
        children: [{
          name: "two",
          children: [
            {name: "dolor", value: 1500},
            {name: "lorem", value: 938},
          ]
        },{
          name: "four",
          value: 2354
        }]
      }]
    }, 6000);
  },
};
</script>
