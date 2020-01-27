<template>
    <div class="chart__wrapper">
        <div v-if="title" class="chart__title">{{title}}</div>
        <div ref="chart" :style="{height: `${this.height}px`}"></div>
        <div v-if="source" class="chart__source">{{source}}</div>
    </div>
</template>


<script>
import d3sunburst from './d3.sunburst';

export default {
    name: 'D3Sunburst',
    data: function(){
        return {
            chart: {},
        }
    },
    props: {
        config: {
            type: Object,
            required: true,
            default: () => ({}),
        },
        datum: {
            type: Array,
            required: true,
            default: () => ([]),
        },
        title: {
            type: String,
            default: '',
        },
        source: {
            type: String,
            default: '',
        },
        height: {
            type: Number,
            default: 300,
        }
    },
    mounted: function(){
        this.chart = new d3sunburst(
            this.$refs.chart,
            JSON.parse(JSON.stringify(this.datum)),
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
            this.chart.updateData(JSON.parse(JSON.stringify(vals)));
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