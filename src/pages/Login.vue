<template>
  <q-page class="flex flex-center">
    <img
      alt="App Logo"
      src="~assets/images/iandev-entregas.png"
      style="max-width: 80vw;"
    >
    <div style="width: 500px; max-width: 90vw;">
      <q-input
        v-model="formLogin.usr"
        float-label="Usuário"
      />
      <q-input
        v-model="formLogin.pwd"
        type="password"
        float-label="Senha"
      />
      <q-input
        v-model="formLogin.url"
        float-label="Servidor"
      />
      <q-btn
        rounded
        :loading="loading"
        color="primary"
        icon="vpn_key"
        label="Login"
        size="lg"
        class="full-width q-my-md"
        @click="login"
      />
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import bo from '../bo/entrega-bo'
import db from '../db/db'
import dao from '../db/dao'
import entregaServices from '../services/entrega-services'
import network from '../util/network'

export default {
  name: 'PageLogin',
  data () {
    return {
      loading: false,
      formLogin: {
        usr: this.$store.state.session.userSession.usr,
        pwd: this.$store.state.session.userSession.pwd,
        url: this.$store.state.session.userSession.url
      }
    }
  },
  methods: {
    login () {
      this.loading = true
      const vm = this
      if (network.isOnline()) { // online
        console.log('Realizando login...')
        vm.$store.dispatch('session/login', vm.formLogin).then(response => { // login no OD
          vm.loading = false
          vm.$uiUtil.showSuccessMessage('Login realizado com sucesso')
          db.openDB(vm.$store.state.session.userSession, (success) => {
            dao.saveUserInfo(vm.$store.state.session.userInfo)
              .then(result => {
                console.log('Informações do usuário gravadas com sucesso')
                console.log('Lendo informações das entregas...')
                dao.getEntregasInfo()
                  .then(result => {
                    if (result != null) {
                      vm.$store.commit('app/setEntregasInfo', result)
                    }
                  })
                  .catch(error => {
                    vm.$uiUtil.showErrorMessage('Erro ao ler informações das entregas', error.message)
                  })
                  .finally(() => {
                    console.log(bo.getDateDescription(vm.$store.state.app.entregasInfo))
                    if (bo.isEntregasOutOfDate(vm.$store.state.app.entregasInfo)) { // base de dados local desatualizada
                      entregaServices.saveOcorrenciasStart((count) => {
                        if (count > 0) {
                          vm.$uiUtil.showSuccessMessage(bo.getDescEnvioOcorrenciasServer(count))
                        } else if (count < 0) {
                          vm.$uiUtil.showErrorMessage(bo.getDescEnvioOcorrenciasServer(count))
                        }
                        if (count >= 0) {
                          console.log('Buscando entregas no servidor...')
                          vm.$store.dispatch('app/getEntregas')
                            .then(response => {
                              console.log('Entregas atualizadas a partir do servidor com sucesso')
                              // vm.$uiUtil.showSuccessMessage('Entregas atualizadas a partir do servidor com sucesso')
                              vm.$uiUtil.gotoPage(vm, 'home')
                            })
                        }
                      }, (err) => {
                        vm.$uiUtil.showErrorMessage('Error ao enviar ocorrências ao servidor', err)
                      })
                    } else { // base de dados local atualizada
                      console.log('Há entregas recentes gravadas no dispositivo')
                      // vm.$uiUtil.showSuccessMessage('Há entregas recentes gravadas no dispositivo')
                      dao.getEntregas()
                        .then(result => {
                          // vm.$store.commit('app/setEntregas', result)
                          dao.getMotivosRetorno()
                            .then(result2 => {
                              let payload = {
                                entregas: result,
                                motivosretorno: result2,
                                local: true
                              }
                              vm.$store.commit('app/setEntregas', payload)
                              vm.$uiUtil.gotoPage(vm, 'home')
                            })
                            .catch(error => {
                              vm.$uiUtil.showErrorMessage('Erro ao ler motivos de retorno', error.message)
                            })
                        })
                        .catch(error => {
                          vm.$uiUtil.showErrorMessage('Erro ao ler entregas', error.message)
                        })
                    }
                  })
              })
              .catch(error => {
                vm.$uiUtil.showErrorMessage('Erro ao gravar informações do usuário', error.message)
              })
          }, (error) => {
            vm.$uiUtil.showErrorMessage('Erro ao abrir base de dados', error.message)
          })
        }).catch(error => {
          vm.loading = false
          vm.$uiUtil.showErrorMessage(error.message || 'Login incorreto')
        })
      } else { // offline
        db.openExistentDB(vm.$store.state.session.userSession, (exists) => {
          if (exists) { // base de dados existente
            dao.getUserInfo()
              .then(result => {
                vm.$store.commit('session/setUserInfo', result)
                dao.getEntregasInfo()
                  .then(result => {
                    vm.$store.commit('app/setEntregasInfo', result)
                    dao.getEntregas()
                      .then(result => {
                        vm.$store.commit('app/setEntregas', result)
                        dao.getMotivosRetorno()
                          .then(result => {
                            vm.$store.commit('app/setMotivosRetorno', result)
                            vm.$uiUtil.gotoPage(vm, 'home')
                          })
                          .catch(error => {
                            vm.$uiUtil.showErrorMessage('Erro ao ler motivos de retorno', error.message)
                          })
                      })
                      .catch(error => {
                        vm.$uiUtil.showErrorMessage('Erro ao ler entregas', error.message)
                      })
                  })
                  .catch(error => {
                    vm.$uiUtil.showErrorMessage('Erro ao ler informações das entregas', error.message)
                  })
              })
              .catch(error => {
                vm.$uiUtil.showErrorMessage('Erro ao ler informações do usuário', error.message)
              })
          } else { // base de dados inexistente
            vm.$uiUtil.showErrorMessage('Não foi possível conectar ao servidor e também não foram encontrados dados de entregas armazenados no seu dispositivo.<br>Verifique sua conexão com a internet e os dados de login e tente novamente.')
          }
        }, (error) => {
          vm.$uiUtil.showErrorMessage('Erro ao abrir base de dados', error.message)
        })
      } // offline
    }
  }
}
</script>
