<template>
    <div class="chart__wrapper">
        <div v-if="title" class="chart__title">{{title}}</div>
        <div ref="chart" :style="{height: `${this.height}px`}"></div>
        <div v-if="source" class="chart__source">{{source}}</div>
    </div>
</template>


<script>
import d3linechart from './d3.linechart';

export default {
    name: 'D3LineChart',
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
        this.chart = new d3linechart(
            this.$refs.chart,
            this.datum,
            this.config
        )
    },
    beforeDestroy: function(){
        this.chart.destroy();
    }
}
</script>


<style lang="scss">
@import '../styles';
</style>