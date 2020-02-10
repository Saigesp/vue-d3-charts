<template>
    <section class="code">
      <h3>Import</h3>
      <div v-highlight><pre class="language-js"><code>{{chartcode}}</code></pre></div>
      <p v-if="link" class="note">See <a :href="link">source code</a>.</p>
    </section>
</template>

<script>
export default {
  name: 'ChartImportComponent',
  props: {
    code: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: false,
    },
  },
  computed: {
    chartcode(){
      return `import { ${this.code} } from 'vue-d3-charts';

export default {
  components: {
    ${this.code},
  },
  // ...
};`;
    },
  },
};
</script>
