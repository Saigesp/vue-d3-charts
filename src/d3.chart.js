import {select} from 'd3-selection'

const d3 = {select}

/**
* D3 Chart Base
*/
class d3chart {
    constructor(selection, data, config, cfg) {
        this.selection = d3.select(selection);
        this.data = data;
        this.cfg = cfg;
        this._setConfig(config);

        // Resize listener
        this.onResize = () => {this.resizeChart()}
        window.addEventListener("resize", this.onResize);

        this.initChart();
    }

    _setConfig(config){
        // Set up configuration
        Object.keys(config).forEach(key=> {
            if(config[key] instanceof Object && config[key] instanceof Array === false){
                Object.keys(config[key]).forEach(sk=> {
                    this.cfg[key][sk] = config[key][sk];
                });
            } else this.cfg[key] = config[key];
        });
    }

    /**
    * Init chart
    */
    initChart(){
        console.error('d3chart.initChart not implemented');
    }

    /**
    * Resize chart pipe
    */
    setScales(){
        console.error('d3chart.setScales not implemented');
    }

    /**
    * Set chart dimensional sizes
    */
    setChartDimension(){
        console.error('d3chart.setChartDimension not implemented');
    }

    /**
    * Bind data to main elements groups
    */
    bindData(){
        console.error('d3.chart.bindData not implemented')
    }

    /**
    * Add new chart's elements
    */
    enterElements(){
        console.error('d3.chart.enterElements not implemented')
    }

    /**
    * Update chart's elements based on data change
    */
    updateElements(){
        console.error('d3.chart.updateElements not implemented')
    }

    /**
    * Remove chart's elements without data
    */
    exitElements(){
        console.error('d3.chart.exitElements not implemented')
    }


    /**
    * Set up chart dimensions
    */
    getDimensions(){
        this.cfg.width = parseInt(this.selection.node().offsetWidth) - this.cfg.margin.left - this.cfg.margin.right;
        this.cfg.height = parseInt(this.selection.node().offsetHeight)- this.cfg.margin.top - this.cfg.margin.bottom;
    }

    /**
    * Returns chart's data
    */
    getData(){
        return this.data;
    }

    /**
    * Add new data elements
    */
    enterData(data){
        this.data = this.data.concat(data);
        this.setScales();
        this.updateChart();
    }

    /**
    * Update existing data elements
    */
    updateData(data){
        this.data = [...data];
        this.setScales();
        this.updateChart();
    }

    /**
    * Compute data before operate
    */
    computeData(){
    }

    /**
    * Remove data elements
    */
    exitData(filter){
        this.data.forEach((d,i) => {
            let c = 0
            Object.keys(filter).forEach(key => {
                if(filter[key] == d[key]) c++
            })
            if(c == Object.keys(filter).length){
                this.data.splice(i,1)
            }
        });
        this.setScales();
        this.updateChart();
    }

    /**
    * Init chart commons elements (div > svg > g; tooltip)
    */
    initChartFrame(classname='undefined'){
        // Wrapper div
        this.wrap = this.selection.append('div') 
            .attr("class", "chart__wrap chart__wrap--"+classname);

        // SVG element
        this.svg = this.wrap.append('svg')
            .attr("class", "chart chart--"+classname);

        // General group for margin convention
        this.g = this.svg.append("g")
            .attr("class", "chart__margin-wrap chart__margin-wrap--"+classname)
            .attr("transform", `translate(${this.cfg.margin.left},${this.cfg.margin.top})`);

        // Tooltip
        this.selection.selectAll('.chart__tooltip').remove()
        this.tooltip = this.wrap
            .append('div')
            .attr('class', "chart__tooltip chart__tooltip--"+classname);
    }

    /**
    * Compute element color
    */
    colorElement(d, key = undefined) {
        key = key ? key : this.cfg.key;

        // if key is set, return own object color key
        if(this.cfg.color.key) return d[this.cfg.color.key];

        // base color is default one if current key is set, else current one
        let baseColor = this.cfg.currentKey
            ? this.cfg.color.default
            : this.cfg.color.current;

        // if scheme is set, base color is color scheme
        if(this.cfg.color.scheme){
            baseColor = this.colorScale(d[key]);
        }

        // if keys is an object, base color is color key if exists
        if(this.cfg.color.keys
            && this.cfg.color.keys instanceof Object
            && this.cfg.color.keys instanceof Array === false) {
            if (typeof this.cfg.color.keys[key] == 'string') {
                baseColor = this.cfg.color.keys[key];
            } else if (typeof this.cfg.color.keys[d[key]] == 'string') {
                baseColor = this.cfg.color.keys[d[key]];
            }
        }

        // if current key is set and key is current, base color is current
        if(this.cfg.currentKey && d[this.cfg.key] === this.cfg.currentKey){
            baseColor = this.cfg.color.current;
        }

        return baseColor;
    }

    /**
    * Update chart methods
    */
    updateChart(){
        this.computeData();
        this.bindData();
        this.setScales();
        this.enterElements();
        this.updateElements();
        this.exitElements();
    }

    /**
    * Resize chart methods
    */
    resizeChart(){
        this.getDimensions();
        //this.setScales();
        this.setChartDimension();
        this.updateChart();
    }

    /**
    * Update chart configuration
    */
    updateConfig(config){
        this._setConfig(config);
        this.resizeChart();
    }

    /**
    * Destroy chart methods
    */
    destroyChart(){
        window.removeEventListener("resize", this.onResize);
    }

}


export default d3chart