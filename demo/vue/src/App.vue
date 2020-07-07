<template>
  <div id="app">
      <ThreeScene></ThreeScene>
  </div>
</template>

<script>
import ThreeScene from './components/threeScene'


export default {
  name: 'App',
  components: {
    ThreeScene
  },
  data() {return {}},
  methods: {}
}
</script>

<style scoped>
  #app{
    position: absolute;
    top: 0; 
    left: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
</style>
