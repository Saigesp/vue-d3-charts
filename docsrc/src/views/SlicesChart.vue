<template>
  <div class="page">

    <ChartTitleComponent :name="chartname" :desc="chartdesc"></ChartTitleComponent>
    
    <section class="chart">
      <D3SlicesChart :config="chartconfig" :datum="chartdata"></D3SlicesChart>
    </section>

    <ChartImportComponent :code="chartname" link="https://github.com/Saigesp/vue-d3-charts/blob/master/src/sliceschart/d3.sliceschart.js"></ChartImportComponent>

    <ChartTemplateComponent :template="chartcode"></ChartTemplateComponent>

    <ChartDataComponent :desc="chartdatadesc" :code="chartdatacode" :config="chartdataconfig"></ChartDataComponent>

    <ChartConfigComponent :options="chartoptions" :custom="chartcustomoptions"></ChartConfigComponent>

    <ChartColorComponent></ChartColorComponent>

    <ChartStylesComponent classname="sliceschart" :elements="['slice', 'label']"></ChartStylesComponent>

<!-- 
    <PieChartExamples></PieChartExamples>
 -->
  </div>
</template>


<script>
import { D3SlicesChart } from 'vue-d3-charts';

export default {
  name: 'SlicesChart',
  components: {
    D3SlicesChart,
  },
  data(){
    return {
      chartname: 'D3SlicesChart',
      chartdesc: 'A slices chart fill the circle slices to illustrate numerical proportions.',
      chartcode: '<D3SlicesChart :config="chart_config" :datum="chart_data"></D3SlicesChart>',
      chartoptions: ['margin', 'key', 'value', 'color', 'transition', 'radius'],
      chartcustomoptions: {
        radius: {
          required: true
        }
      },
      chartconfig: {
        key: 'name',
        value: 'total',
        color: {key: 'color', default: '#CCC'},
        radius: {inner: 60, padding: 0.05, round: 5},
        transition: {duration: 200},
      },
      chartdata: [
        {name: 'Lorem', total: 50, color: '#DD1267'},
        {name: 'Ipsum', total: 180, color: '#E5243C'},
        {name: 'Dolor', total: 100, color: '#10699D'},
        {name: 'Sit',   total: 160, color: '#2CBDE2'},
        {name: 'Amet',   total: 112, color: '#3F7D44'},
        {name: 'Conse',   total: 130, color: '#4C9F38'},
      ],
      chartdatadesc: 'An <strong>objects array</strong> is expected, with each object as a slice',
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
      chartdataconfig: '<code>key: "name", value: "total"</code>'
    }
  }
}
</script>