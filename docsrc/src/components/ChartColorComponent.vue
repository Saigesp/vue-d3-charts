<template>
    <section class="code">
        <h3>Color configuration</h3>
        <p>This chart has different color configurations that can me combined and used together.</p>
        
        <!-- start color key -->
        <h4>Color key</h4>
        <p>Object field to use as a color. This option overrides all other options.</p>
        <div v-highlight>
            <pre class="language-js"><code>chart_data = [
  {name: 'Anna', teamColor: '#55D6BE'},
  {name: 'Mikel', teamColor: '#00FF35'},
]

chart_config = {
  color: {
    key: 'teamColor',
  },
}</code></pre>
        </div>
        <!-- end color key -->

        <!-- start current color -->
        <h4>Current color with no current key</h4>
        <p>If <code>currentKey</code> isn't set, set all the object's color to passed value.</p>
        <div v-highlight>
            <pre class="language-js"><code>chart_config = {
  color: {
    current: 'blue',
  },
}</code></pre>
        </div>
        <!-- end current color -->

        <!-- start current key -->
        <h4>Current color and current key</h4>
        <p>If <code>currentKey</code> is set, overrides the selected object matched by its <code>key</code> and <code>currentKey</code> values, and set not matching objects to default color.</p>
        <div v-highlight>
            <pre class="language-js"><code>chart_config = {
  key: 'name',
  currentKey: 'John',
  color: {
    current: 'green',
    default: 'grey',
  }
}</code></pre>
        </div>
        <p class="note"><code>current key</code> overrides <code>color scheme</code> and <code>color keys</code> set up values only on matched items.</p>
        <!-- end current key -->

        <!-- start color scheme -->
        <h4>Color scheme</h4>
        <p>If set, a the passed color scale will be used as default (this can be overrided by color keys or current key).</p>
        <p>If the <strong>passed value is a string</strong>, (example: <code>'schemeCategory10'</code>) a <a href="https://github.com/d3/d3-scale-chromatic">d3 scale chromatic</a> color scheme will be used. Some example options are <code>schemeAccent</code>, <code>schemeDark2</code>, <code>schemePaired</code> or <code>schemeSet1</code>. These color schemes are <strong>colorblind safe</strong>, so colorblind people won't be confused reading the chart. <a href="http://mkweb.bcgsc.ca/colorblind/">Read more</a>.</p>
        <div v-highlight>
            <pre class="language-js"><code>chart_config = {
  color: {
    scheme: 'schemeSet1',
  },
}</code></pre>
        </div>
        <p>If the <strong>passed value is an array</strong>, a custom color scale will be used.</p>
        <div v-highlight>
            <pre class="language-js"><code>chart_config = {
  color: {
    scheme: ['#55D6BE', '#ACFCD9', '#7D5BA6', '#DDDDDD', '#FC6471'],
  },
}</code></pre>
        </div>
        <p class="note">Fancy color palettes can be generated easily with <a href="https://coolors.co/app">Coolors</a>.</p>
        <!-- end color scheme -->

        <!-- start color keys -->
        <h4>Color keys</h4>
        <p>Key-values color overrider. If you want to override the color scheme, you can pass an object <code>colorKeys</code> in configuration. When a item key matches one, the color will be overrided (Note that the key field has to be the same as passed in configuration).</p>
        <div v-highlight>
            <pre class="language-js"><code>chart_config = {
  color: {
    keys: {
      'Success': '#339900',
      'Warning': '#ffcc00',
      'Error': '#cc3300',
    },
  },
}</code></pre>
        </div>
        <p class="note">Note that <code>color.scheme</code>, <code>color.keys</code> and <code>currentKey</code> can be used together.</p>
        <!-- end color keys -->

        
    </section>
</template>
<script>
export default {
    name: 'ChartColorComponent',
}
</script>