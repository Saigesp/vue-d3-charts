<template>
  <div class="page page--header">
    <section class="title">
      <h1 class="page__title"><router-link :to="{name: 'home'}">vue-d3-charts</router-link></h1>
      <p class="page__subtitle">A D3 charts module for Vue</p>
    </section>
  </div>
</template>


<script>
export default {
  name: 'HeaderComponent'
}
</script>