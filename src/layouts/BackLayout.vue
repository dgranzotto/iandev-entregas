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
        <q-btn
          rounded
          :color="!$store.state.session.userPrefs.statusButton ? 'red' : 'green'"
          :label="!$store.state.session.userPrefs.statusButton ? 'Modo Offline' : 'Disponível'"
          :icon="!$store.state.session.userPrefs.statusButton ? 'signal_cellular_off' : env.networkIcon"
          class="q-my-xs"
          style="font-size: 10px;"
          @click="changeStatus(!$store.state.session.userPrefs.statusButton)"
        />
      </q-toolbar>
    </q-layout-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>
  .layout-padding {
    padding: unset!important;
  }
</style>

<script>
import { mapState } from 'vuex'
import store from '../store'

export default {
  name: 'BackLayout',
  data () {
    return {
    }
  },
  methods: {
    changeStatus (status) {
      console.log('alterando status do botão ' + status)
      store.commit('session/setStatusButton', status)
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
