<template>
  <div class="page page--home">

    <section class="code">
      <h2>Install</h2>
      <div v-highlight><pre class="language-shell align-center"><code>npm i vue-d3-charts --save</code></pre></div>
    </section>

    <section class="chart">
      <D3BarChart :config="barconfig" :datum="bardata"></D3BarChart>
    </section>

    <section class="text">
      <h2>Introduction</h2>
      <p>vue-d3-charts is a <strong>charts library</strong> build with reusability in mind. It has evolved from a personal bl.ocks collection to a modular charts system, to allow <strong>quick implementation and customatization</strong>.</p>
      <p>vue-d3-charts is built on top of <a href="https://d3js.org/">d3.js</a> and <a href="https://vuejs.org/">vue.js</a> and is an <strong>open source</strong> project started by <a href="https://github.com/Saigesp">Saigesp</a> under GNU General Public License v3.0. See <a href="https://github.com/Saigesp/vue-d3-charts/blob/master/CONTRIB.md">contribution guide</a> if you want to contribute.</p>
    </section>

    <section class="code">
      <h2>How to use</h2>
      <p>First import your desired charts:</p>
      <div v-highlight>
        <pre class="language-javascript"><code>import { D3BarChart } from 'vue-d3-charts';

export default {
  name: 'LoremIpsumComponent',
  components: {
    D3BarChart,
  },
  // ...
};</code></pre>
      </div>
      <p>And then use it on your project, passing them a configuratioin object and a data array:</p>
      <div v-highlight><pre class="language-html"><code>{{bartext}}</code></pre></div>
      <p>Each chart has it's own configuration options. For example, the <strong>bar chart</strong> has these:</p>
      <div v-highlight>
        <pre class="language-javascript"><code>chart_config = {
  key: 'name',
  value: 'total',
  color: {current:'#41B882'},
  transition: {ease: 'easeBounceOut', duration: 1000}
}</code></pre>
      </div>
    </section>

    <ChartIndexComponent/>
    
    <section class="code">
      <h2>Common features</h2>
      <p>Each chart has its own features, but these are across all charts:</p>
      <SlopeChartExampleDataUpdate title="Data update" desc="Simply change your binding data as you want:"></SlopeChartExampleDataUpdate>
      <BarChartExampleBasic title="Reactive elements"></BarChartExampleBasic>
    </section>

  </div>
</template>

<script>
import { D3BarChart } from 'vue-d3-charts';

export default {
  name: 'HomeView',
  components: {
    D3BarChart,
  },
  data(){
    return {
      bartext: '<D3BarChart :config="chart_config" :datum="chart_data"></D3BarChart>',
      titlechart: '<D3BarChart title="Your custom title"></D3BarChart>',
      sourcechart: '<D3BarChart source="Your custom source"></D3BarChart>',
      barconfig: {
        key: 'name',
        values: ['total', 'balance'],
        color: {scheme:['#41B882', '#222f3e']},
        transition: {ease: 'easeBounceOut', duration: 1000}
      },
      bardata: [
        {name: '1992', total: 4748, balance: 748},
        {name: '1993', total: 5526, balance: 526},
        {name: '1994', total: 8574, balance: 574},
        {name: '1995', total: 15805, balance: 5805},
        {name: '1996', total: 14582, balance: 4582},
        {name: '1997', total: 26694, balance: 6694},
        {name: '1998', total: 35205, balance: 5205},
        {name: '1999', total: 45944, balance: 5944},
        {name: '2000', total: 78595, balance: 8595},
      ]
    }
  }
}
</script>
