<template>
  <div class="page">
    <ChartIndexComponent v-if="$route.path !== '/examples' "/>
    <div class="footer">
      <div class="footer__wrap">
        <div class="links">
          <div class="links__group">
            <ul>
              <li><router-link :to="{name: 'home'}">Home</router-link></li>
            </ul>
          </div>
          <div class="links__group">
            <ul>
              <li><router-link :to="{name: 'examples'}">Examples</router-link></li>
            </ul>
          </div>
          <div class="links__group">
            <ul>
              <li><a href="https://github.com/Saigesp/vue-d3-charts">Source code</a></li>
              <li><a href="https://github.com/Saigesp/vue-d3-charts/blob/master/CONTRIB.md">How to contribute</a></li>
              <li><a href="https://github.com/Saigesp/vue-d3-charts/blob/master/LICENSE.md">License</a></li>
              <li><a href="https://github.com/Saigesp/vue-d3-charts/issues">Issues</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FooterComponent',
};
</script>

<style lang="scss">
.footer {
  background: #222f3e;
  color: white;
  overflow: auto;
  padding: 20px;
  a {
    color: inherit;
  }
  &__wrap {
    max-width: 860px;
    margin: 20px auto 20px;
  }
  .links {
    display: flex;
    &__group {
      flex: 1 1 33%;
    }
  }
}
</style>
