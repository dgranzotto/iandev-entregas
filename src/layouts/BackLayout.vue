<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn flat v-go-back=" '/' ">
          <q-icon name="arrow_back" />
        </q-btn>
        <q-toolbar-title>
          {{title}}
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'BackLayout',
  data () {
    return {
      title: 'Sobre'
    }
  },
  methods: {
    gotoPage (page) {
      this.leftDrawerOpen = false
      this.$router.push({
        name: page
      })
    }
  }
}
</script>

<style>
</style>
