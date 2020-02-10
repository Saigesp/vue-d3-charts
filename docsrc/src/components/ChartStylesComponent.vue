<template>
  <section class="code">
    <h3>Styles</h3>
    <p>Default styles can be easily overrided with BEM modifiers notation:</p>
    <div v-highlight>
      <pre class="language-css"><code>.chart{
  &--{{classname}} {
    font-size: 10px;
  }
<div v-for="el in elements">  &__{{el}}--{{classname}} {
    /* your styles */
  }
</div>}</code></pre>
    </div>
    <p class="note">Note that SVG elements use some special properties in CSS.
      <a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_and_CSS">More info</a>.</p>
  </section>
</template>

<script>
export default {
  name: 'ChartStylesComponent',
  props: {
    classname: {
      type: String,
      required: true,
    },
    elements: {
      type: Array,
      required: false,
      default: () => (['point', 'line']),
    },
  },
};
</script>
