<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">国内疫情</router-link> |
      <router-link to="/worldMap">国外疫情</router-link> |
      <router-link to="/earth">3d地球</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50

  #nav
    height 40px
    line-height 40px
</style>
