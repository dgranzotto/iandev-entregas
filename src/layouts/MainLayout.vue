<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          {{ $route.meta.title || 'IANDev Entregas'}}
        </q-toolbar-title>
        <q-spinner-rings style="margin-right: 5px;" v-show="env.syncing" color="write" :size="30" />
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
    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list no-border inset-delimiter>
        <q-list-header>Menu</q-list-header>
        <div v-show="this.$router.currentRoute.name != 'login'">
          <q-item-separator />
          <q-item sparse>
            <q-item-main>
              <q-item-tile color="primary" label>{{ $store.state.session.userInfo.colaborador }}</q-item-tile>
            </q-item-main>
          </q-item>
          <q-collapsible dense :sublabel="$store.state.session.userSession.url">
            <div>
              <q-btn flat color="secondary" label="Logoff" @click="logoff"/>
            </div>
          </q-collapsible>
        </div>
        <q-item-separator />
        <q-item v-if="$store.state.session.userInfo.idusuario != null" @click.native="gotoPage('home')">
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

<style>
  .layout-padding {
    padding: unset!important;
  }
  .q-layout-page-container {
    padding-top: unset!important;
  }
</style>

<script>
import { openURL } from 'quasar'
import { mapState } from 'vuex'
import store from '../store'

export default {
  name: 'MainLayout',
  data () {
    return {
      user: null,
      leftDrawerOpen: false // this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL,
    login (data) {
      this.user = data.user
    },
    logoff () {
      this.$uiUtil.gotoPage(this, 'login')
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
    },
    changeStatus (status) {
      console.log('alterando status do botão ' + status)
      store.commit('session/setStatusButton', status)
    }
  },
  computed: {
    ...mapState({
      env: state => state.app.env
    })
  },
  mounted () {
    this.$on('App.login', (data) => {
      this.login(data)
    })
    console.log(this.env)
  }
}
</script>

<style>
</style>
