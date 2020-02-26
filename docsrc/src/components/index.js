import Vue from 'vue'

// Page components
Vue.component('HeaderComponent',                    require('./HeaderComponent').default);
Vue.component('FooterComponent',                    require('./FooterComponent').default);
Vue.component('ChartIndexComponent',                require('./ChartIndexComponent').default);

// Chart's documentation components
Vue.component('ChartStylesComponent',               require('./ChartStylesComponent').default);
Vue.component('ChartColorComponent',                require('./ChartColorComponent').default);
Vue.component('ChartConfigComponent',               require('./ChartConfigComponent').default);
Vue.component('ChartDataComponent',                 require('./ChartDataComponent').default);
Vue.component('ChartTemplateComponent',             require('./ChartTemplateComponent').default);
Vue.component('ChartImportComponent',               require('./ChartImportComponent').default);
Vue.component('ChartTitleComponent',                require('./ChartTitleComponent').default);

// Charts examples
Vue.component('SlopeChartExamples',                 require('./examples/SlopeChartExamples').default);
Vue.component('SlopeChartExampleBasic',             require('./examples/SlopeChartExampleBasic').default);
Vue.component('SlopeChartExampleHighlight',         require('./examples/SlopeChartExampleHighlight').default);
Vue.component('SlopeChartExampleColors',            require('./examples/SlopeChartExampleColors').default);
Vue.component('SlopeChartExampleDataUpdate',        require('./examples/SlopeChartExampleDataUpdate').default);

Vue.component('LineChartExamples',                  require('./examples/LineChartExamples').default);
Vue.component('LineChartExampleBasic',              require('./examples/LineChartExampleBasic').default);
Vue.component('LineChartExampleUpdate',              require('./examples/LineChartExampleUpdate').default);
Vue.component('LineChartExampleCustomization',      require('./examples/LineChartExampleCustomization').default);

Vue.component('BarChartExamples',                   require('./examples/BarChartExamples').default);
Vue.component('BarChartExampleBasic',               require('./examples/BarChartExampleBasic').default);
Vue.component('BarChartExampleGroup',               require('./examples/BarChartExampleGroup').default);
Vue.component('BarChartExampleDataUpdate',          require('./examples/BarChartExampleDataUpdate').default);
Vue.component('BarChartExampleHorizontal',          require('./examples/BarChartExampleHorizontal').default);

Vue.component('PieChartExamples',                   require('./examples/PieChartExamples').default);
Vue.component('PieChartExampleDataUpdate',          require('./examples/PieChartExampleDataUpdate').default);
