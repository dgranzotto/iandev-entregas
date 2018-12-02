<template>
  <q-page class="flex flex-center">
    <!--<img alt="Quasar logo" src="~assets/quasar-logo-full.svg">-->
    <img alt="App Logo" src="~assets/images/truck-blue.jpg">
    <div style="width: 500px; max-width: 90vw;">
      <q-input v-model="formLogin.usr" float-label="Usuário" />
      <q-input v-model="formLogin.pwd" type="password" float-label="Senha" />
      <q-input v-model="formLogin.url" float-label="Servidor" />
      <q-btn rounded :loading="loading" color="primary" icon="vpn_key" label="Login" size="lg" class="full-width q-my-md" @click="login" />
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import db from '../db/db'
import entregaServices from '../services/entrega-services'

export default {
  name: 'PageLogin',
  data () {
    return {
      loading: false,
      formLogin: {
        usr: 'motorista1',
        pwd: '1',
        url: 'server1iandev.no-ip.org:38080'
      }
    }
  },
  methods: {
    login () {
      this.loading = true
      this.$store.dispatch('session/login', this.formLogin).then(response => {
        this.loading = false
        this.$uiUtil.gotoPage(this, 'home')
        this.$uiUtil.showSuccessMessage('Login realizado com sucesso')
        db.initializeDB()
        entregaServices.syncEntregas()
      }).catch(error => {
        this.loading = false
        this.$uiUtil.showErrorMessage(error.response.data.message || 'Login incorreto')
      })
    }
  },
  created () {
  }
}
</script>
