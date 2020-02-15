<template>
  <div class="page">

    <ChartTitleComponent :name="chartname" :desc="chartdesc"></ChartTitleComponent>
    
    <section class="chart">
      <div class="flex">
        <div class="flex__middle">
          <D3PieChart :config="chartconfig" :datum="chartdata" title="Lorem ipsum" source="Dolor sit amet"></D3PieChart>
        </div>
        <div class="flex__middle">
          <D3PieChart :config="chartconfig2" :datum="chartdata" title="Lorem ipsum" source="Dolor sit amet"></D3PieChart>
        </div>
      </div>
    </section>

    <ChartImportComponent :code="chartname" link="https://github.com/Saigesp/vue-d3-charts/blob/master/src/piechart/d3.piechart.js"></ChartImportComponent>

    <ChartTemplateComponent :template="chartcode"></ChartTemplateComponent>

    <ChartDataComponent :desc="chartdatadesc" :code="chartdatacode" :config="chartdataconfig"></ChartDataComponent>

    <ChartConfigComponent :options="chartoptions" :custom="chartcustomoptions"></ChartConfigComponent>

    <ChartColorComponent></ChartColorComponent>

    <ChartStylesComponent classname="piechart" :elements="['slice', 'label']"></ChartStylesComponent>

    <PieChartExamples></PieChartExamples>

  </div>
</template>


<script>
import { D3PieChart } from 'vue-d3-charts';

export default {
  name: 'PieChart',
  components: {
    D3PieChart,
  },
  data(){
    return {
      chartname: 'D3PieChart',
      chartdesc: 'A pie chart divides a circle into slices to illustrate numerical proportions.',
      chartcode: '<D3PieChart :config="chart_config" :datum="chart_data"></D3PieChart>',
      chartoptions: ['margin', 'key', 'value', 'currentKey', 'color', 'transition', 'radius'],
      chartcustomoptions: {
        radius: {
          required: true
        }
      },
      chartconfig: {
        key: 'name',
        value: 'total',
        color: {key: 'color'},
        transition: {duration: 200}
      },
      chartconfig2: {
        key: 'name',
        value: 'total',
        radius: {inner: 80},
        color: {key: 'color'},
        transition: {duration: 200}
      },
      chartdata: [
        {name: 'Lorem', total: 30, color: '#425265'},
        {name: 'Ipsum', total: 21, color: '#3e9a70'},
        {name: 'Dolor', total: 20, color: '#41ab7b'},
        {name: 'Sit',   total: 112, color: '#222f3e'},
      ],
      chartdatadesc: 'An <strong>objects array</strong> is expected, with each object as a pie slice',
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



<style lang="scss">
.flex {
  display: flex;
  flex-wrap: wrap;
  &__middle {
    flex: 1 1 100%;
    svg {
      max-width: 100%;
    }
  }
}

@media screen and (min-width: 768px) {
  .flex {
    &__middle {
      flex: 1 1 50%;
    }
  }
}
</style>