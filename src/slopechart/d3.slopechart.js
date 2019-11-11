import {select, selectAll} from 'd3-selection'
import {scaleLinear} from 'd3-scale'
import {max, min} from 'd3-array'
import {transition} from 'd3-transition'

const d3 = {
    select, selectAll,
    scaleLinear,
    max, min,
    transition,
}

class d3slopechart {

    constructor(selection, data, config = {}) {
        this.selection = d3.select(selection);
        this.data = data;

        // Graph configuration
        this.cfg = {
            margin: {top: 10, right: 100, bottom: 20, left: 100},
            key: '',
            currentKey: '',
            values: ['start', 'end'],
            color: '#1f77b4',
            defaultColor: '#AAA',
            opacity: 0.5,
            radius: 3,
            axisLabels: false,
            transition: {duration: 550}
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
        this.cfg.width = parseInt(this.selection.node().offsetWidth) - this.cfg.margin.left - this.cfg.margin.right;
        this.cfg.height = parseInt(this.selection.node().offsetHeight)- this.cfg.margin.top - this.cfg.margin.bottom;

        // Set up scales
        this.yScale = d3.scaleLinear().rangeRound([this.cfg.height, 0]);

        // Resize listener
        this.redraw = () => { this.draw() };
        window.addEventListener("resize", this.redraw);

        this.initGraph();
    }

    initGraph() {

        this.yScale.domain([
            d3.min(this.data, d => d[this.cfg.values[0]] < d[this.cfg.values[1]] ? d[this.cfg.values[0]]*0.9 : d[this.cfg.values[1]]*0.9 ),
            d3.max(this.data, d => d[this.cfg.values[0]] > d[this.cfg.values[1]] ? d[this.cfg.values[0]]*1.1 : d[this.cfg.values[1]]*1.1 )
        ]);

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
        this.axisg = this.g.append('g')
            .attr('class', 'chart__axis chart__axis--slopechart')

        // Vertical left axis
        this.startAxis = this.axisg.append('line')
            .attr("class", "chart__axis-y chart__axis-y--slopechart chart__axis-y--start")
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('stroke', 'black');

        // Vertical right axis
        this.endAxis = this.axisg.append('line')
            .attr("class", "chart__axis-y chart__axis-y--slopechart chart__axis-y--end")
            .attr('stroke', 'black')
            .attr('y1', 0);

        // Axis labels
        if(this.cfg.axisLabels){
            this.startl = this.axisg.append('text')
                .attr('class', 'chart__axis-text chart__axis-text--slopechart chart__axis-text--start')
                .attr('text-anchor', 'middle')
                .attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom -12)
                .text(this.cfg.axisLabels[0])

            this.endl = this.axisg.append('text')
                .attr('class', 'chart__axis-text chart__axis-text--slopechart chart__axis-text--end')
                .attr('text-anchor', 'middle')
                .attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom -12)
                .text(this.cfg.axisLabels[1])
        }

        // Line selector
        this.lin = this.g.selectAll(".chart__lines-group")
            .data(this.data);

        // Line group
        this.lineg = this.lin
            .enter().append('g')
            .attr("class", "chart__lines-group chart__lines-group--slopechart");

        // Lines element
        this.lines = this.lineg.append('line')
            .attr("class", "chart__line chart__line--slopechart")
            .attr('stroke', (d, i) => 
                d[this.cfg.key] == this.cfg.currentKey ? this.cfg.color : this.cfg.defaultColor
            )
            .style("stroke-width", d => d[this.cfg.key] == this.cfg.currentKey ? '2px' : '1px')
            .style("opacity", this.cfg.opacity)

        // Vertical left axis points group
        this.startg = this.lineg.append('g')
            .attr('class', 'chart__points-group chart__points-group--slopechart chart__points-group--start')
            .classed('current', d => d[this.cfg.key] == this.cfg.currentKey);

        // Vertical right axis points group
        this.endg = this.lineg.append('g')
            .attr('class', 'chart__points-group chart__points-group--slopechart chart__points-group--end')
            .classed('current', d => d[this.cfg.key] == this.cfg.currentKey)
            .attr('transform', 'translate('+this.cfg.width+',0)');

        // Vertical left axis points
        this.startg.append('circle')
            .attr('class', 'chart__point chart__point--slopechart chart__point--start')
            .attr('fill', d => 
                 d[this.cfg.key] == this.cfg.currentKey ? this.cfg.color : this.cfg.defaultColor
            )
            .attr('r', this.cfg.radius)

        // Vertical right axis points
        this.endg.append('circle')
            .attr('class', 'chart__point chart__point--slopechart chart__point--end')
            .attr('fill', d => 
                d[this.cfg.key] == this.cfg.currentKey ? this.cfg.color : this.cfg.defaultColor
            )
            .attr('r', this.cfg.radius)

        // Vertical left axis labels
        this.startg.append('text')
            .attr('class', 'chart__label chart__label--slopechart chart__label--start')
            .attr('text-anchor', 'end')
            .attr('y', 3)
            .attr('x', -5)
            .text(d => d[this.cfg.key] +' '+ d[this.cfg.values[0]])

        // Vertical right axis labels
        this.endg.append('text')
            .attr('class', 'chart__label chart__label--slopechart chart__label--end')
            .attr('text-anchor', 'start')
            .attr('y', 3)
            .attr('x', 5)
            .text(d => d[this.cfg.values[1]] + '  ' + d[this.cfg.key])

        this.draw()
    }

    draw(){
        // Set up dimensions
        this.cfg.width = parseInt(this.selection.node().offsetWidth) - this.cfg.margin.left - this.cfg.margin.right;
        this.cfg.height = parseInt(this.selection.node().offsetHeight)- this.cfg.margin.top - this.cfg.margin.bottom;

        // Set scales
        this.yScale.rangeRound([this.cfg.height, 0]);

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
        if(this.cfg.axisLabels){
            this.startl.attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom -12)
            this.endl.attr('x', this.cfg.width).attr('y', this.cfg.height + this.cfg.margin.top + this.cfg.margin.bottom -12)
        }

        this.update()

    }

    getData(){
        return this.data;
    }

    addData(data){
        this.data = this.data.concat(data)
        this.update()
    }

    updateData(data){
        const existingkeys = this.data.map(d=> d[this.cfg.key])
        const newkeys = data.map(d=> d[this.cfg.key])

        // Remove non passed data items
        this.data = this.data.filter(d=> newkeys.indexOf(d[this.cfg.key]) > -1)
        // Update existing passed data items
        this.data.forEach(d=>{ d = data[newkeys.indexOf(d[this.cfg.key])] });
        // Add non existing passed data items
        this.data = this.data.concat(data.filter(d=> existingkeys.indexOf(d[this.cfg.key]) == -1))
        
        this.update()
    }

    removeData(filter){
        this.data.forEach((d,i) => {
            let c = 0
            Object.keys(filter).forEach(key => {
                if(filter[key] == d[key]) c++
            })
            if(c == Object.keys(filter).length){
                this.data.splice(i,1)
            }
        })
        this.update()
    }

    update(){
        // Set transition
        const t = d3.transition().duration(this.cfg.transition.duration);

        // Set scale
        this.yScale.domain([
            d3.min(this.data, d => d[this.cfg.values[0]] < d[this.cfg.values[1]] ? d[this.cfg.values[0]]*0.9 : d[this.cfg.values[1]]*0.9 ),
            d3.max(this.data, d => d[this.cfg.values[0]] > d[this.cfg.values[1]] ? d[this.cfg.values[0]]*1.1 : d[this.cfg.values[1]]*1.1 )
        ]);

        // Lines group selection data
        this.lin = this.g.selectAll(".chart__lines-group")
            .data(this.data, d => d[this.cfg.key])

        // Elements to remove
        this.lin.exit().transition(t)
            .style("opacity", 0)
            .remove();

        // Left axis points to modify
        this.startg = this.lineg.selectAll('.chart__points-group--start')
            .transition(t)
            .attr('transform', d => 'translate(0,'+this.yScale(d[this.cfg.values[0]])+')')

        // Right axis points to modify
        this.endg = this.lineg.selectAll('.chart__points-group--end')
            .transition(t)
            .attr('transform', d => 'translate('+this.cfg.width+','+this.yScale(d[this.cfg.values[1]])+')')

        // Lines to modify
        this.lines = this.lineg.selectAll('.chart__line')
            .transition(t)
            .attr("x1", 0)
            .attr("x2", this.cfg.width)
            .attr("y1", d => this.yScale(d[this.cfg.values[0]]))
            .attr("y2", d => this.yScale(d[this.cfg.values[1]]))

        // Elements to add
        var news = this.lin
            .enter().append('g')
            .attr("class", "chart__lines-group chart__lines-group--slopechart");

        // Lines to add
        news.append('line') 
            .attr("class", "chart__line chart__line--slopechart")
            .attr('stroke', (d, i) => {
                return d[this.cfg.key] == this.cfg.currentKey ? this.cfg.color : this.cfg.defaultColor;
            })
            .style("opacity", this.cfg.opacity)
            .transition(t)
            .attr("x1", 0)
            .attr("x2", this.cfg.width)
            .attr("y1", d => this.yScale(d[this.cfg.values[0]]))
            .attr("y2", d => this.yScale(d[this.cfg.values[1]]))

        // Vertical left axis points group to add
        const gstart = news.append('g')
            .attr('class', 'chart__points-group chart__points-group--slopechart chart__points-group--start')
        
        gstart
            .transition(t)
            .attr('transform', d => 'translate(0,'+this.yScale(d[this.cfg.values[0]])+')')

        // Vertical right axis points group to add
        const gend = news.append('g')
            .attr('class', 'chart__points-group chart__points-group--slopechart chart__points-group--end')
            .attr('transform', 'translate('+this.cfg.width+',0)')

        gend
            .transition(t)
            .attr('transform', d => 'translate('+this.cfg.width+','+this.yScale(d[this.cfg.values[1]])+')')

        // Vertical left axis points to add
        gstart.append('circle')
            .attr('class', 'chart__point chart__point--slopechart chart__point--start')
            .attr('fill', d =>
                d[this.cfg.key] == this.cfg.currentKey ? this.cfg.color : this.cfg.defaultColor
            )
            .attr('r', this.cfg.radius)

        // Vertical right axis points to add
        gend.append('circle')
            .attr('class', 'chart__point chart__point--slopechart chart__point--end')
            .attr('fill', d =>
                d[this.cfg.key] == this.cfg.currentKey ? this.cfg.color : this.cfg.defaultColor
            )
            .attr('r', this.cfg.radius)

        gstart.append('text')
            .attr('class', 'chart__label chart__label--slopechart chart__label--start')
            .attr('text-anchor', 'end')
            .attr('y', 3)
            .attr('x', -5)
            .text(d => d[this.cfg.key] +' '+ d[this.cfg.values[0]])

        gend.append('text')
            .attr('class', 'chart__label chart__label--slopechart chart__label--end')
            .attr('text-anchor', 'start')
            .attr('y', 3)
            .attr('x', 5)
            .text(d => d[this.cfg.values[1]] + '  ' + d[this.cfg.key])

    }

    destroy(){
        window.removeEventListener("resize", this.redraw);
    }

}


export default d3slopechart