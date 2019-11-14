<template>
  <section class="chart-grid">
    <h2>Charts</h2>
    <router-link :to="{name: 'barchart'}">barchart</router-link><br>
    <router-link :to="{name: 'linechart'}">linechart</router-link><br>
    <router-link :to="{name: 'slopechart'}">slopechart</router-link><br>
  </section>
</template>


<script>
export default {
  name: 'ChartIndexComponent'
}
</script>