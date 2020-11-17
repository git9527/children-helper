<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">两数加减</router-link> |
      <router-link to="/math/plus-minus/3">三数加减</router-link> |
      <router-link to="/math/plus-minus/5">五数加减</router-link> |
      <router-link to="/secret/haluo">哈啰二维码</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
