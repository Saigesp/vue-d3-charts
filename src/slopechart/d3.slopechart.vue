<template>
    <div class="chart__wrapper">
        <div v-if="title" class="chart__title">{{title}}</div>
        <div ref="chart" :style="{height: `${this.height}px`}"></div>
        <div v-if="source" class="chart__source">{{source}}</div>
    </div>
</template>


<script>
import d3slopechart from './d3.slopechart';

export default {
    name: 'D3SlopeChart',
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
        this.chart = new d3slopechart(
            this.$refs.chart,
            [...this.datum],
            this.config
        )
    },
    watch: {
        datum(vals){
            this.chart.updateData([...vals]);
        }
    },
    beforeDestroy: function(){
        this.chart.destroyChart();
    }
}
</script>


<style lang="scss">
@import '../styles';

.chart--slopegraph {
    .chart__line--current {
        stroke-width: 2px;
    }
}
</style>