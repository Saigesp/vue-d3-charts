<template>
    <section class="code">
      <h3>Template</h3>
      <pre><code>{{template}}</code></pre>
      <p class="note">Note that <code>title</code>, <code>source</code> and <code>height</code> are others accepted props.</p>
    </section>
</template>

<script>
export default {
    name: 'ChartTemplateComponent',
    props: {
        template: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: false
        },
    }
}
</script>