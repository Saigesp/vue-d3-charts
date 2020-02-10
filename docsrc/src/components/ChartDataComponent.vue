<template>
  <section class="code">
    <h3>Data format</h3>
    <p><span v-html="desc"></span>. Fields can be changed in configuration. Example:</p>
    <div v-highlight><pre class="language-js"><code>{{code}}</code></pre></div>
    <p class="note">To work with this data, configuration must be <span v-html="config"></span>.</p>
  </section>
</template>

<script>
export default {
  name: 'ChartDataComponent',
    props: {
        desc: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        },
        config: {
            type: String,
            required: true
        },
    },
}
</script>