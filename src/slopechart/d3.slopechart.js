import {select, selectAll} from 'd3-selection'
import {scaleLinear, scaleOrdinal} from 'd3-scale'
import {max, min} from 'd3-array'
import {transition} from 'd3-transition'
import {easeLinear, easePolyIn, easePolyOut, easePoly,
    easePolyInOut, easeQuadIn, easeQuadOut, easeQuad, easeQuadInOut,
    easeCubicIn, easeCubicOut, easeCubic, easeCubicInOut, easeSinIn,
    easeSinOut, easeSin, easeSinInOut, easeExpIn, easeExpOut, easeExp,
    easeExpInOut, easeCircleIn, easeCircleOut, easeCircle, easeCircleInOut,
    easeElasticIn, easeElastic, easeElasticOut, easeElasticInOut, easeBackIn,
    easeBackOut, easeBack, easeBackInOut, easeBounceIn, easeBounce,
    easeBounceOut, easeBounceInOut} from 'd3-ease'
import {schemeCategory10, schemeAccent, schemeDark2, schemePaired,
    schemePastel1, schemePastel2, schemeSet1, schemeSet2, schemeSet3,
    schemeTableau10} from 'd3-scale-chromatic'

const d3 = {select, selectAll, scaleLinear, scaleOrdinal, max, min, transition, easeLinear,
    easePolyIn, easePolyOut, easePoly, easePolyInOut, easeQuadIn, easeQuadOut,
    easeQuad, easeQuadInOut, easeCubicIn, easeCubicOut, easeCubic, easeCubicInOut,
    easeSinIn, easeSinOut, easeSin, easeSinInOut, easeExpIn, easeExpOut, easeExp,
    easeExpInOut, easeCircleIn, easeCircleOut, easeCircle, easeCircleInOut,
    easeElasticIn, easeElastic, easeElasticOut, easeElasticInOut, easeBackIn,
    easeBackOut, easeBack, easeBackInOut, easeBounceIn, easeBounce, easeBounceOut,
    easeBounceInOut, schemeCategory10, schemeAccent, schemeDark2, schemePaired,
    schemePastel1, schemePastel2, schemeSet1, schemeSet2, schemeSet3,
    schemeTableau10}

/**
* D3 Slope Chart
*/
class d3slopechart {

    constructor(selection, data, config = {}) {
        this.selection = d3.select(selection);
        this.data = data;

        // Graph configuration
        this.cfg = {
            margin: {top: 10, right: 100, bottom: 20, left: 100},
            key: '',
            currentKey: false,
            values: ['start', 'end'],
            color : {key: false, keys: false, scheme: false, current: '#1f77b4', default: '#AAA', axis: '#000'},
            axis: {titles: false},
            points: {visibleRadius: 3},
            opacity: 0.5,
            transition: {duration: 350, ease: 'easeLinear'}
        };

        // Set up configuration
        Object.keys(config).forEach(key=> {
            if(config[key] instanceof Object && config[key] instanceof Array === false){
                Object.keys(config[key]).forEach(sk=> {
                    this.cfg[key][sk] = config[key][sk];
                });
            } else this.cfg[key] = config[key];
        });

        // Set up dimensions
        this.setDimensions();

        // Set up scales
        this.yScale = d3.scaleLinear()

        // Resize listener
        this.onResize = () => {this.resizeChart()}
        window.addEventListener("resize", this.onResize);

        this.initChart();
    }

    /**
    * Init chart
    */
    initChart() {

        // Wrapper div
        this.wrap = this.selection.append('div') 
            .attr("class", "chart__wrap chart__wrap--slopechart");

        // SVG element
        this.svg = this.wrap.append('svg')
            .attr("class", "chart chart--slopegraph");

        // General group for margin convention
        this.g = this.svg.append("g")
            .attr('class', 'chart__margin-wrap')
            .attr("transform", `translate(${this.cfg.margin.left},${this.cfg.margin.top})`);

        // Axis group
        const axisg = this.g.append('g')
            .attr('class', 'chart__axis chart__axis--slopechart')

        // Vertical left axis
        this.startAxis = axisg.append('line')
            .attr("class", "chart__axis-y chart__axis-y--slopechart chart__axis-y--start")
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('stroke', this.cfg.color.axis);

        // Vertical right axis
        this.endAxis = axisg.append('line')
            .attr("class", "chart__axis-y chart__axis-y--slopechart chart__axis-y--end")
            .attr('y1', 0)
            .attr('stroke', this.cfg.color.axis);

        // Axis labels
        if(this.cfg.axis.titles){
            this.startl = axisg.append('text')
                .attr('class', 'chart__axis-text chart__axis-text--slopechart chart__axis-text--start')
                .attr('text-anchor', 'middle')
                .attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom -12)
                .text(this.cfg.axis.titles[0])

            this.endl = axisg.append('text')
                .attr('class', 'chart__axis-text chart__axis-text--slopechart chart__axis-text--end')
                .attr('text-anchor', 'middle')
                .attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom -12)
                .text(this.cfg.axis.titles[1])
        }

        this.setChartDimension();
        this.updateChart();
    }

    /**
    * Set up chart dimensions (non depending on data)
    */
    setChartDimension(){
        // SVG element
        this.svg
            .attr("viewBox", `0 0 ${this.cfg.width+this.cfg.margin.left+this.cfg.margin.right} ${this.cfg.height+this.cfg.margin.top+this.cfg.margin.bottom}`)
            .attr("width", this.cfg.width + this.cfg.margin.left + this.cfg.margin.right)
            .attr("height", this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom);

        // Vertical left axis position
        this.startAxis
            .attr('y2', this.cfg.height)

        // Vertical right axis position
        this.endAxis
            .attr('x1', this.cfg.width)
            .attr('x2', this.cfg.width)
            .attr('y2', this.cfg.height)

        // Axis labels
        if(this.cfg.axis.titles){
            this.startl.attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom -12)
            this.endl.attr('x', this.cfg.width).attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom -12)
        }
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
        this.data = this.data.concat(data)
        this.updateChart()
    }

    /**
    * Update existing data elements
    */
    updateData(data){
        this.data = [...data];
        this.updateChart()
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
        })
        this.updateChart()
    }

    /**
    * Set up chart dimensions
    */
    setDimensions(){
        this.cfg.width = parseInt(this.selection.node().offsetWidth) - this.cfg.margin.left - this.cfg.margin.right;
        this.cfg.height = parseInt(this.selection.node().offsetHeight)- this.cfg.margin.top - this.cfg.margin.bottom;
    }

    /**
    * Set up scales
    */
    setScales(){
        this.yScale
            .rangeRound([this.cfg.height, 0])
            .domain([
                d3.min(this.data, d => d[this.cfg.values[0]] < d[this.cfg.values[1]] ? d[this.cfg.values[0]]*0.9 : d[this.cfg.values[1]]*0.9 ),
                d3.max(this.data, d => d[this.cfg.values[0]] > d[this.cfg.values[1]] ? d[this.cfg.values[0]]*1.1 : d[this.cfg.values[1]]*1.1 )
            ]);

        // Set up color scheme
        if(this.cfg.color.scheme){
            if(this.cfg.color.scheme instanceof Array === true){
                this.colorScale = d3.scaleOrdinal().range(this.cfg.color.scheme)
            }else{
                this.colorScale = d3.scaleOrdinal(d3[this.cfg.color.scheme]);
            }
        }
    }

    /**
    * Bind data to main elements groups
    */
    bindData(){
        // Lines group selection data
        this.linesgroup = this.g.selectAll(".chart__lines-group")
            .data(this.data, d => d[this.cfg.key]);

        // Set transition
        this.transition = d3.transition('t')
            .duration(this.cfg.transition.duration)
            .ease(d3[this.cfg.transition.ease]);
    }

    /**
    * Add new chart's elements
    */
    enterElements(){

        // Elements to add
        const newlines = this.linesgroup.enter().append('g')
            .attr("class", d => "chart__lines-group chart__lines-group--slopechart");

        // Lines to add
        newlines.append('line') 
            .attr("class", "chart__line chart__line--slopechart")
            .classed('chart__line--current', d => this.cfg.currentKey && d[this.cfg.key] == this.cfg.currentKey)
            .attr('stroke', d => this.colorElement(d))
            .style("opacity", this.cfg.opacity)
            .attr("x1", 0)
            .attr("x2", this.cfg.width)
            .transition(this.transition)
            .attr("y1", d => this.yScale(d[this.cfg.values[0]]))
            .attr("y2", d => this.yScale(d[this.cfg.values[1]]))

        // Vertical left axis points group to add
        const gstart = newlines.append('g')
            .attr('class', 'chart__points-group chart__points-group--slopechart chart__points-group--start')
        
        gstart.transition(this.transition)
            .attr('transform', d => 'translate(0,'+this.yScale(d[this.cfg.values[0]])+')')

        // Vertical left axis points to add
        gstart.append('circle')
            .attr('class', 'chart__point chart__point--slopechart chart__point--start')
            .attr('fill', d => this.colorElement(d))
            .attr('r', this.cfg.points.visibleRadius)

        // Vertical left axis label to add
        gstart.append('text')
            .attr('class', 'chart__label chart__label--slopechart chart__label--start')
            .attr('text-anchor', 'end')
            .attr('y', 3)
            .attr('x', -5)
            .text(d => d[this.cfg.key] +' '+ d[this.cfg.values[0]])

        // Vertical right axis points group to add
        const gend = newlines.append('g')
            .attr('class', 'chart__points-group chart__points-group--slopechart chart__points-group--end')
            .attr('transform', 'translate('+this.cfg.width+',0)')

        gend.transition(this.transition)
            .attr('transform', d => 'translate('+this.cfg.width+','+this.yScale(d[this.cfg.values[1]])+')')

        // Vertical right axis points to add
        gend.append('circle')
            .attr('class', 'chart__point chart__point--slopechart chart__point--end')
            .attr('fill', d => this.colorElement(d))
            .attr('r', this.cfg.points.visibleRadius)

        // Vertical right axis label to add
        gend.append('text')
            .attr('class', 'chart__label chart__label--slopechart chart__label--end')
            .attr('text-anchor', 'start')
            .attr('y', 3)
            .attr('x', 5)
            .text(d => d[this.cfg.values[1]] + '  ' + d[this.cfg.key])
    }

    /**
    * Update chart's elements based on data change
    */
    updateElements(){
        // Lines to modify
        this.linesgroup.selectAll('.chart__line')
            .data(this.data, d=> d[this.cfg.key])
            .transition(this.transition)
            .attr("x1", 0)
            .attr("x2", this.cfg.width)
            .attr("y1", d => this.yScale(d[this.cfg.values[0]]))
            .attr("y2", d => this.yScale(d[this.cfg.values[1]]))

        // Left axis points to modify
        this.linesgroup.selectAll('.chart__points-group--start')
            .data(this.data, d=> d[this.cfg.key])
            .transition(this.transition)
            .attr('transform', d => 'translate(0,'+this.yScale(d[this.cfg.values[0]])+')')

        // Left axis labels to modify
        this.linesgroup.selectAll('.chart__label--start')
            .data(this.data, d=> d[this.cfg.key])
            .text(d =>{return d[this.cfg.key] +' '+ d[this.cfg.values[0]]})

        // Right axis points to modify
        this.linesgroup.selectAll('.chart__points-group--end')
            .data(this.data, d=> d[this.cfg.key])
            .transition(this.transition)
            .attr('transform', d => 'translate('+this.cfg.width+','+this.yScale(d[this.cfg.values[1]])+')')

        // Right axis labels to modify
        this.linesgroup.selectAll('.chart__label--end')
            .data(this.data, d=> d[this.cfg.key])
            .text(d => d[this.cfg.values[1]] + '  ' + d[this.cfg.key])
    }

    /**
    * Remove chart's elements without data
    */
    exitElements(){
        this.linesgroup.exit()
            .transition(this.transition)
            .style("opacity", 0)
            .remove();
    }

    /**
    * Compute element color
    */
    colorElement(d) {

        // if key is set, return own object color key
        if(this.cfg.color.key) return  d[this.cfg.color.key];

        // base color is default one if current key is set, else current one
        let baseColor = this.cfg.currentKey
            ? this.cfg.color.default
            : this.cfg.color.current;

        // if scheme is set, base color is color scheme
        if(this.cfg.color.scheme){
            baseColor = this.colorScale(d[this.cfg.key]);
        }

        // if keys is an object, base color is color key if exists
        if(this.cfg.color.keys
            && this.cfg.color.keys instanceof Object
            && this.cfg.color.keys instanceof Array === false
            && this.cfg.color.keys[d[this.cfg.key]]){
            baseColor = this.cfg.color.keys[d[this.cfg.key]];
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
        this.setScales();
        this.bindData();
        this.enterElements();
        this.updateElements();
        this.exitElements();
    }

    /**
    * Resize chart methods
    */
    resizeChart(){
        this.setDimensions();
        this.setScales();
        this.setChartDimension();
        this.updateChart();
    }

    /**
    * Destroy chart methods
    */
    destroyChart(){
        window.removeEventListener("resize", this.onResize);
    }

}


export default d3slopechart