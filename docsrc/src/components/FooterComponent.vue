<template>
  <div class="page">
    <ChartIndexComponent v-if="$route.path !== '/'"/>
  </div>
</template>


<script>
export default {
  name: 'FooterComponent'
}
</script>