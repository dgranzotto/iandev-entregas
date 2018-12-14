<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn flat @click="$router.go(-1)">
          <q-icon name="arrow_back" />
        </q-btn>
        <q-toolbar-title>
          {{ $route.meta.title || 'IANDev Entregas'}}
        </q-toolbar-title>
        <q-icon :name="env.networkIcon" />
      </q-toolbar>
    </q-layout-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'BackLayout',
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      env: state => state.app.env
    })
  }
}
</script>

<style>
</style>
