<template>
  <div class="page">

    <ChartTitleComponent :name="chartname" :desc="chartdesc"></ChartTitleComponent>
    
    <section class="chart">
      <D3BarChart :config="chartconfig" :datum="chartdata" title="Lorem ipsum" source="Dolor sit amet"></D3BarChart>
    </section>

    <ChartImportComponent :code="chartname" link="https://github.com/Saigesp/vue-d3-charts/blob/master/src/barchart/d3.barchart.js"></ChartImportComponent>

    <ChartTemplateComponent :template="chartcode"></ChartTemplateComponent>

    <ChartDataComponent :desc="chartdatadesc" :code="chartdatacode" :config="chartdataconfig"></ChartDataComponent>

    <ChartConfigComponent :options="chartoptions" :custom="chartcustomoptions"></ChartConfigComponent>

    <ChartColorComponent></ChartColorComponent>

    <ChartStylesComponent classname="barchart" :elements="['bar', 'label']"></ChartStylesComponent>

    <BarChartExamples></BarChartExamples>

  </div>
</template>


<script>
import { D3BarChart } from 'vue-d3-charts'

export default {
  name: 'BarChart',
  components: {
    D3BarChart,
  },
  data(){
    return {
      chartname: 'D3BarChart',
      chartdesc: 'A bar chart presents categorical data with rectangular bars with heights proportional to the values that they represent.',
      chartcode: '<D3BarChart :config="chart_config" :datum="chart_data"></D3BarChart>',
      chartoptions: ['margin', 'key', 'values', 'color', 'transition', 'axis', 'labelRotation', 'tooltip', 'currentKey', 'orientation'],
      chartcustomoptions: {
        tooltip: {
          required: false,
          default: 'tooltip: { label: false }',
          type: 'Object',
          desc: "Tooltip options convention.<br><code>label</code>: object field to override the label in the tooltip. If set to false, label will be the key field.",
          example: '<code>tooltip: { label: "displayName" }</code>',
        },
      },
      chartconfig: {
        key: 'name',
        values: ['total'],
        color: {current: '#41B882'},
        axis: {yTitle: 'Lorem ipsum dolor sit amet', yTicks: 10, yFormat: '.0s'},
        transition: {ease: 'easeBounceOut', duration: 1000}
      },
      chartdata: [
        {name: '1992', total: 4748},
        {name: '1993', total: 5526},
        {name: '1994', total: 8574},
        {name: '1995', total: 15805},
        {name: '1996', total: 14582},
        {name: '1997', total: 26694},
        {name: '1998', total: 35205},
        {name: '1999', total: 45944},
        {name: '2000', total: 78595},
        {name: '2001', total: 78530},
        {name: '2002', total: 45407},
        {name: '2003', total: 54044},
        {name: '2004', total: 69165},
        {name: '2005', total: 61798},
        {name: '2006', total: 63686},
      ],
      chartdatadesc: 'An <strong>objects array</strong> is expected, with each object as a bar',
      chartdatacode: `chart_data = [{
  name: "Lorem",
  total: 30
},{
  name: "Ipsum",
  total: 21
},{
  name: "Dolor",
  total: 20
}]`,
      chartdataconfig: '<code>key: "name", values: ["total"]</code>'
    }
  }
}
</script>