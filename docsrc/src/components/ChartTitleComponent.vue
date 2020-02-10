<template>
  <section class="text">
    <h2 class="page__title">{{name}}</h2>
    <p class="page__claim">{{desc}}</p>
  </section>
</template>


<script>
export default {
  name: 'ChartTitleComponent',
  props: {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
};
</script>
