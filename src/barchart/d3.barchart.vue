<template>
    <div class="chart__wrapper">
        <div v-if="title" class="chart__title">{{title}}</div>
        <div ref="chart" :style="{height: `${this.height}px`}"></div>
        <div v-if="source" class="chart__source">{{source}}</div>
    </div>
</template>


<script>
import d3barchart from './d3.barchart';

export default {
    name: 'D3BarChart',
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
        this.chart = new d3barchart(
            this.$refs.chart,
            [...this.datum],
            this.config
        )
    },
    watch: {
        config: {
            handler(val){
                this.chart.updateConfig(val);
            },
            deep: true
        },
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
</style>