<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          IANDev Entregas
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list no-border inset-delimiter>
        <q-list-header>Menu</q-list-header>
        <q-item-separator />
        <q-item sparse>
          <q-item-main>
            <q-item-tile color="primary" label>{{ $store.state.session.user.colaborador }}</q-item-tile>
          </q-item-main>
        </q-item>
        <q-collapsible dense :sublabel="$store.state.session.userSession.url">
          <div>
            <q-btn flat color="secondary" label="Logoff" />
          </div>
        </q-collapsible>
        <q-item-separator />
        <q-item v-if="$store.state.session.user.idusuario != null" @click.native="gotoPage('home')">
          <q-item-side icon="home" />
          <q-item-main label="Início" />
        </q-item>
        <q-item @click.native="gotoPage('about')">
          <q-item-side icon="info" />
          <q-item-main label="Sobre" />
        </q-item>
        <q-item @click.native="exitApp()">
          <q-item-side icon="exit_to_app" />
          <q-item-main label="Sair" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MainLayout',
  data () {
    return {
      user: null,
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL,
    login (data) {
      this.user = data.user
    },
    gotoPage (page) {
      this.leftDrawerOpen = false
      this.$uiUtil.gotoPage(this, page)
    },
    exitApp (evt) {
      if (evt) {
        evt.stopPropagation()
      }
      navigator.app.exitApp()
    }
  },
  mounted () {
    this.$on('App.login', (data) => {
      this.login(data)
    })
  }
}
</script>

<style>
</style>
