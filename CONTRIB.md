# Contributing

This repository contains the charts components library (on `/src`) and the demo/documentation page (on `/docsrc` and `/docs` folders).

### Create a new chart

##### Definition of done
- Charts have to follow the common schemes.
- Data and configuration have to be updatable.
- Charts have to be responsive and resizable.
- Charts have to be documented and with examples.

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

        initChart() {
            // Chart initialization
        }

        setChartDimension(){
            // Set up chart dimensions (non depending on data)
        }

        setScales(){
            // Set up scales
        }

        bindData(){
            // Data binding
        }

        enterElements(){
            // Elements to add
        }

        updateElements(){
            // Elements to update
        }

        exitElements(){
            // Elements to remove
        }
    }

    export default d3mynewchart
    ```
    > See [d3.chart.js](/src/d3.chart.js) for more detail, or [d3.barchart.js](/src/barchart/d3.barchart.js) for an example.

2. **d3.mynewchart.vue** is the single file component that interacts with the chart. It extends `/src/d3.chart.vue`:
    ```javascript
    import D3Chart from '../d3.chart.vue';
    import d3mynewchart from './d3.mynewchart';

    export default {
      name: 'D3MyNewChart',
      extends: D3Chart,
      mounted() {
        this.chart = new d3mynewchart(
          this.$refs.chart,
          JSON.parse(JSON.stringify(this.datum)),
          this.config,
        );
      },
    };
    ```
    > See [d3.barchart.vue](/src/barchart/d3.barchart.vue) for an example.

3. Add component to `/src/index.js`:

    ```javascript
    export { default as D3Mynewchart } from './mynewchart/d3.mynewchart.vue';
    ```

3. Build package:
    ```bash
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

7. Develop documentation page and examples (TBD)

8. Once documentation page is finished, build it:
    ```bash
    cd docsrc/
    rm -rf node_modules/vue-d3-charts/ && npm i # update charts components
    npm run build
    ```

## Demo and documentation page

Documentation source files are located in `/docsrc` folder, and compiles to `/docs`.

It has `"vue-d3-charts": "../",` as dependency in package.json

#### Get new components on demo page

```bash
cd docsrc/
rm -rf node_modules/vue-d3-charts/ && npm i
```

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