# Contributing

This repository contains the charts components library (on `/src`) and the demo/documentation page (on `/docsrc` and `/docs` folders).

### Create a new chart

#### Create chart

1. Create a new folder `/src/mynewchart` with files `d3.mynewchart.vue` and `d3.mynewchart.js`

    **d3.mynewchart.js** is the chart's vanilla javascript file (isolated from any JS framework).
    **d3.mynewchart.vue** is the vue component wrapper.

2. **d3.mynewchart.js** must instantiate `/src/d3.chart.js` class, which contains common charts features, action pipes and methods:

    ```javascript
    import d3chart from '../d3.chart'
    //...
    class d3mynewchart extends d3chart{
        //...
    }
    export default d3mynewchart
    ```

    This class is expected to contain some methods, which will be called from the main pipes. A basic schema may be:

    ```javascript
    import d3chart from '../d3.chart'
    //...

    class d3mynewchart extends d3chart{

        constructor(selection, data, config) {
            super(selection, data, config, { // Default configuration options
            })
        }

        initChart() { // Chart initialization
        }

        setChartDimension(){ // Set up chart dimensions (non depending on data)
        }

        setScales(){ // Set up scales
        }

        bindData(){ // Data binding
        }

        enterElements(){ // Elements to add
        }

        updateElements(){ // Elements to update
        }

        exitElements(){ // Elements to remove
        }
    }

    export default d3mynewchart
    ```
    > See [d3.chart.js](/src/d3.chart.js) for more detail, or [d3.barchart.js](/src/barchart/d3.barchart.js) for an example.

2. **d3.mynewchart.vue** must be a common vue single file component that interacts with the chart
    ```javascript
    export default {
        name: 'D3Mynewchart',
        data: function(){
            return {
                chart: {},
            }
        },
        props: {
            config: {
                type: Object,
                required: true,
                default: ()=>{
                    return {};
                }
            },
            datum: {
                type: Array,
                required: true,
                default: ()=>{
                    return [];
                }
            },
            title: {
                type: String,
                default: ''
            },
            source: {
                type: String,
                default: ''
            },
            height: {
                type: Number,
                default: 300,
            }
        },
        mounted: function(){
            // Create chart
            this.chart = new d3sunburst(
                this.$refs.chart,
                [...this.datum],
                this.config
            )
        },
        watch: {
            config: {
                handler(val){
                    // Handle configuration change
                    this.chart.updateConfig(val);
                },
                deep: true
            },
            datum(vals){
                // Handle data change
                this.chart.updateData([...vals]);
            }
        },
        beforeDestroy: function(){
            // Fire chart removal
            this.chart.destroyChart();
        }
    }
    ```
    > See [d3.barchart.vue](/src/barchart/d3.barchart.vue) for an example.

3. Add component to `/src/index.js`:

    ```javascript
    import Vue from "vue";
    //...
    import D3Mynewchart from "./mynewchart/d3.mynewchart.vue";

    const Components = {
        //...
        D3Mynewchart
    }

    Object.keys(Components).forEach(name => {
        Vue.component(name, Components[name]);
    });

    export default Components;
    ```

3. Build package:
    ```
    npm run build
    ```

#### Create demo and documentation pages

4. In order to develop the new additions demo and documentation, replace `/docsrc` vue-d3-charts node module:
    ```
    npm run build
    rm -rf docsrc/node_modules/vue-d3-charts/dist/
    cp -r dist/ docsrc/node_modules/vue-d3-charts/
    ```

5. Create a new vue component to act as chart's view in `/docsrc/src/views`

6. Add it to `/docs/router/index.js`

## Build and replace docs files

Build and copy files to test on `doc`:
```bash
npm run build && rm -rf docsrc/node_modules/vue-d3-charts/dist/ && cp -r dist/ docsrc/node_modules/vue-d3-charts/
```

## Documentation page

Documentation source files are located in `/docsrc` folder

##### Serve files
```bash
cd docsrc/
npm run dev
```

##### Build files
```bash
cd docsrc/
npm run build
```