<template>
  <div class="page">

    <ChartTitleComponent :name="chartname" :desc="chartdesc"></ChartTitleComponent>

    <section class="chart">
      <D3SlopeChart :config="chartconfig" :datum="chartdata" title="Lorem ipsum" source="Dolor sit amet"></D3SlopeChart>
    </section>

    <ChartImportComponent :code="chartname" link="https://github.com/Saigesp/vue-d3-charts/blob/master/src/slopechart/d3.slopechart.js"></ChartImportComponent>

    <ChartTemplateComponent :template="chartcode"></ChartTemplateComponent>

    <ChartDataComponent :desc="chartdatadesc" :code="chartdatacode" :config="chartdataconfig"></ChartDataComponent>

    <ChartConfigComponent :options="chartoptions" :custom="chartcustomoptions"></ChartConfigComponent>

    <ChartColorComponent></ChartColorComponent>

    <ChartStylesComponent classname="slopechart"></ChartStylesComponent>

    <SlopeChartExamples></SlopeChartExamples>

  </div>
</template>
<script>
import { D3SlopeChart } from 'vue-d3-charts';

export default {
  name: 'SlopeChart',
  components: {
    D3SlopeChart,
  },
  data() {
    return {
      chartname: 'D3SlopeChart',
      chartdesc: 'A slope chart displays information as a series of lines between two points.',
      chartcode: '<D3SlopeChart :config="chart_config" :datum="chart_data"></D3SlopeChart>',
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
      chartconfig: {
        key: 'name',
        currentKey: 'Lorem',
        color: {current: '#41B882'},
        axis: {titles: ['2000', '2015']},
        transition: {ease: 'easeBounceOut', duration: 1000}
      },
      chartdata: [
        { start: 5355, end: 5855, name: "Lorem" },
        { start: 6160, end: 6510, name: "Ipsum" },
        { start: 3029, end: 5138, name: "Dolor" },
        { start: 2116, end: 2904, name: "Sit" },
        { start: 3503, end: 4408, name: "Amet" }
      ],
      chartdatadesc: 'An <strong>objects array</strong> is expected, with each object as a line',
      chartdatacode: `chart_data = [{
  yesterday: 5355,
  today: 5855,
  name: "Lorem"
},{
  yesterday: 6160,
  today: 6510,
  name: "Ipsum"
}]`,
      chartdataconfig: '<code>key: "name", values: ["yesterday","today"]</code>'
    }
  },
  mounted(){

    setTimeout(()=>{
      this.chartdata = this.chartdata.filter(d => d.name != 'Lorem');
      this.chartdata.push({ start: 5085, end: 9321, name: "Lorem" });
    }, 2000);

    setTimeout(()=>{
      this.chartdata = this.chartdata.filter(d => d.name != 'Sit')
    }, 4000);

    setTimeout(()=>{
      this.chartdata = this.chartdata.concat([
        {start: 7500, end: 9960, name: "Aperiam"}
      ])
    }, 6000);

  }
}
</script>