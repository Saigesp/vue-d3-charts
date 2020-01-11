# Contributing

This repository contains the charts components library (on `/src`) and the demo/documentation page (on `/docsrc` and `/docs` folders).

### Create a new chart

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
    > See [d3.chart.js](/src/d3.chart.js) and [d3.barchart.js](/src/barchart/d3.barchart.js) for more details

### Build

Build and copy files to test on `doc`:
```bash
npm run build && rm -rf docsrc/node_modules/vue-d3-charts/dist/ && cp -r dist/ docsrc/node_modules/vue-d3-charts/
```

### Documentation page

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