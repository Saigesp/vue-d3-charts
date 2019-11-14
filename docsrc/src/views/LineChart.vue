<template>
  <div class="page">

    <ChartTitleComponent :name="chartname" :desc="chartdesc"></ChartTitleComponent>

    <section class="chart">
        <D3LineChart :config="chartconfig" :datum="chartdata" title="Lorem ipsum dolor sit amet" source="Custom source"></D3LineChart>
    </section>

    <ChartImportComponent :code="chartname" link="https://github.com/Saigesp/vue-d3-charts/blob/master/src/linechart/d3.linechart.js"></ChartImportComponent>

    <ChartTemplateComponent :template="chartcode"></ChartTemplateComponent>

    <ChartDataComponent :desc="chartdatadesc" :code="chartdatacode" :config="chartdataconfig"></ChartDataComponent>

    <ChartConfigComponent :options="chartoptions" :custom="chartcustomoptions"></ChartConfigComponent>

    <ChartColorComponent></ChartColorComponent>

    <ChartStylesComponent classname="linechart"></ChartStylesComponent>

  </div>
</template>



<script>
import {D3LineChart} from 'vue-d3-charts'

export default {
    name: 'LineChart',
    data(){
      return {
        chartname: 'D3LineChart',
        chartdesc: 'A line chart displays information as a series of data points connected by line segments, usually to visualize a trends over time.',
        chartcode: '<D3LineChart :config="chart_config" :datum="chart_data"></D3LineChart>',
        chartoptions: ['margin', 'values', 'color', 'axis', 'points', 'curve', 'date', 'tooltip'],
        chartcustomoptions: {
          values: {
            required: true,
            example: '<code>values: ["Iphone", "Android"]</code>'
          },
        },
        chartconfig: {
            keys: ['hours', 'production'],
            labels: ['Hour', 'Production'],
            dateField: 'date',
            dateFormat: '%Y',
            dateFormatOutput: '%Y',
            yScaleFormat: '.0f',
            xScaleTicks: 10,
            yAxis: 'Lorem ipsum',
            colorScheme: ['#41B882', '#222f3e']
        },
        chartdata: [
            {"hours": 2387, "production": 2134, "date": 2000},
            {"hours": 2938, "production": 2478, "date": 2001},
            {"hours": 2832, "production": 2392, "date": 2002},
            {"hours": 3092, "production": 2343, "date": 2003},
            {"hours": 2847, "production": 2346, "date": 2004},
            {"hours": 2976, "production": 2233, "date": 2005},
            {"hours": 2864, "production": 2325, "date": 2006},
            {"hours": 2748, "production": 2456, "date": 2007},
            {"hours": 2479, "production": 2329, "date": 2008},
            {"hours": 3200, "production": 2438, "date": 2009},
        ],
        chartdatadesc: 'An <strong>objects array</strong> is expected, with each object as an interval in the horizontal axis',
        chartdatacode: `chart_data = [{
  "iphone": 123,
  "android": 208,
  "when": "2019-08-01"
},{
  "iphone": 165,
  "android": 201,
  "when": "2019-09-01"
}]`,
        chartdataconfig: '<code>keys: ["iphone","android"], dateField: "when", dateFormat: "%Y-%m-%d"</code>'
      }
    }
}
</script>