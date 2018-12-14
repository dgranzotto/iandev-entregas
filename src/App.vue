<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import network from './util/network'
import store from './store'

export default {
  name: 'App',
  created () {
    console.log('App created')
    store.commit('app/setOnline', network.isOnline())
  }
}
</script>

<style>
</style>
