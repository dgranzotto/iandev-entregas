<template>
  <!--<q-page class="flex flex-center">-->
  <q-page padding class="row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <div class="q-headline">Entrega</div>
      <q-field :label="$store.state.app.entregaAtual.descricao"><q-field :label="$store.state.app.entregaAtual.subdescricao"></q-field></q-field>
      <q-btn v-if="$store.state.app.entregaAtual.address || ($store.state.app.entregaAtual.latitudeentrega && $store.state.app.entregaAtual.longitudeentrega)" rounded color="primary" icon="directions" label="Visualizar Rota" size="md" class="full-width q-my-md" @click="visualizarRota" />
      <q-item-separator />
      <div class="row">
        <div class="col-12 q-mt-sm q-mb-sm">
          <q-btn-group class="full-width" rounded>
            <q-btn @click="tirarFotoRecibo" rounded class="half-width" align="center" size="sm" color="indigo" label="Foto do Recibo" icon="photo_camera">
              <q-icon class="s-size" :name="fotoReciboStatus.icon" :color="fotoReciboStatus.color" />
            </q-btn>
            <q-btn @click="adicionarObservacao" rounded class="half-width" align="center" size="sm" color="indigo" label="Observação" icon="add_comment"></q-btn>
          </q-btn-group>
        </div>
        <div class="col-12 q-mt-sm q-mb-md" style="font-size:1.2em;">
          <q-toggle @input="onChangeConfirmaEntrega" v-model="confirmaEntrega" checked-icon="check" unchecked-icon="close" left-label color="positive" label="Entrega realizada?" true-value="Sim" false-value="Não"/> {{ confirmaEntrega }}
        </div>
      </div>
      <q-select @input="onChangeMotivoRetorno" float-label="Motivo do retorno" inverted-light :color="motivoRetornoColor" separator v-model="motivoRetorno" :options="$store.state.app.motivosRetorno" />
      <!-- <q-select float-label="Selecione o tipo da ocorrência" v-model="motivoRetorno" :options="$store.state.app.motivosRetorno" /> -->
      <q-item-separator />
      <q-list no-border striped class="q-mt-md dark-example">
        <div class="q-headline">Itens</div>
        <q-item v-for="(item, index) in $store.state.app.entregaAtual.itens" :key="index" @click.native="entregas(item)">
          <q-item-main>
            <q-item-tile label>{{ item.descricao }}</q-item-tile>
            <q-item-tile sublabel>Quantidade: {{ item.quantidade }}</q-item-tile>
            <q-item-tile v-show="item.requerfoto == 'S' && (!item.midias || item.midias.length == 0)" label color="negative">Necessário tirar foto</q-item-tile>
          </q-item-main>
          <q-item-side>
            <q-btn round color="primary" icon="photo_camera" @click.native="tirarFoto(item)"/>
          </q-item-side>
        </q-item>
      </q-list>
    </div>

    <q-modal @show="onModalShowObservacao" class="modal-dark" v-model="modalObservacao" minimized position="right" :content-css="{minWidth: '90vw'}">
      <div style="padding: 20px">
        <div class="q-display-1 q-mb-md">Observação</div>
        <q-input ref="observacao" v-model="observacao" dark color="white" type="textarea" stack-label="Observação" />
        <q-btn style="margin-top:20px" color="primary" @click="salvarObservacao" label="Salvar" />
      </div>
    </q-modal>
  </q-page>
</template>

<script>
export default {
  name: 'PageEntrega',
  data () {
    return {
      motivoRetorno: null,
      confirmaEntrega: 'Não',
      motivoRetornoColor: 'white',
      modalObservacao: false,
      observacao: null,
      fotoReciboStatus: {
        icon: 'close',
        color: 'negative'
      }
    }
  },
  methods: {
    entregas () {
    },
    onModalShowObservacao () {
      this.$refs.observacao.focus()
    },
    adicionarObservacao () {
      this.observacao = this.$store.state.app.entregaAtual.ocorrencia.observacao
      this.modalObservacao = true
    },
    salvarObservacao () {
      this.$store.state.app.entregaAtual.ocorrencia.observacao = this.observacao
      this.modalObservacao = false
    },
    tirarFotoRecibo () {
      const vm = this
      navigator.camera.getPicture(
        (data) => { // on success
          var fileName = data.substring(data.lastIndexOf('/') + 1)
          window.resolveLocalFileSystemURL(data,
            fileEntry => { // on success
              var dataDirectory = cordova.file.externalDataDirectory
              window.resolveLocalFileSystemURL(dataDirectory,
                dataDirectoryEntry => { // on success
                  dataDirectoryEntry.getDirectory('imagens', { create: true },
                    dirEntry => { // on success
                      var today = new Date()
                      var dd = today.getDate()
                      var mm = today.getMonth() + 1
                      var yyyy = today.getFullYear()
                      var newFileName = yyyy + '-' + mm + '-' + dd + 'R_' + fileName
                      fileEntry.moveTo(dirEntry, newFileName,
                        entry => { // on success
                          vm.$store.state.app.entregaAtual.ocorrencia.imagemReciboPath = entry.nativeURL
                          vm.fotoReciboStatus.icon = 'check'
                          vm.fotoReciboStatus.color = 'positive'
                        }, (error) => { // on fail
                          console.log(error)
                        })
                    }, (error) => { // on fail
                      console.log(error)
                    })
                }, (error) => { // on fail
                  console.log(error)
                })
            }, (error) => { // on fail
              console.log(error)
            })
        }, (error) => { // on fail
          console.log(error)
          vm.$uiUtil.showErrorMessage('Não foi possível acessar a camera do dispositivo')
        },
        {
          quality: 50,
          destinationType: Camera.DestinationType.FILE_URI,
          encodingType: Camera.EncodingType.JPEG,
          correctOrientation: true
        }
      )
    },
    tirarFoto (item) {
      this.$store.commit('app/setItemAtual', item)
      this.$uiUtil.gotoPage(this, 'midias')
    },
    visualizarRota () {
      this.$uiUtil.gotoPage(this, 'entregarota')
    },
    onChangeConfirmaEntrega (newVal) {
      if (newVal === 'Sim') {
        // valida se existe algum item que é obrigatorio tirar foto e se foi tirado a foto desse item
        var validaConfirmacao = true

        if (!this.$store.state.app.entregaAtual.ocorrencia.imagemReciboPath) {
          validaConfirmacao = false
          this.$uiUtil.showErrorMessage('Obrigatório tirar foto do recibo')
        } else {
          for (var i = 0; i < this.$store.state.app.entregaAtual.itens.length; i++) {
            if (this.$store.state.app.entregaAtual.itens[i].requerfoto === 'S') {
              if (!this.$store.state.app.entregaAtual.itens[i].midias) {
                validaConfirmacao = false
                this.$uiUtil.showErrorMessage('Obrigatório tirar foto do item ' + this.$store.state.app.entregaAtual.itens[i].descricao)
              } else if (this.$store.state.app.entregaAtual.itens[i].midias) {
                if (this.$store.state.app.entregaAtual.itens[i].midias.length === 0) {
                  validaConfirmacao = false
                  this.$uiUtil.showErrorMessage('Obrigatório tirar foto do item ' + this.$store.state.app.entregaAtual.itens[i].descricao)
                }
              }
            }
          }
        }

        if (validaConfirmacao) {
          this.motivoRetorno = null
          this.motivoRetornoColor = 'white'
          this.$store.state.app.entregaAtual.ocorrencia.confirmaEntrega = newVal
          this.$store.state.app.entregaAtual.ocorrencia.idCargaEntregaMotivoRetorno = null
          this.setMapLocalEntrega()
          this.setDataHoraEntrega()
        } else {
          this.confirmaEntrega = 'Não'
          this.$store.state.app.entregaAtual.ocorrencia.confirmaEntrega = this.confirmaEntrega
        }
      }
    },
    onChangeMotivoRetorno (newVal) {
      this.motivoRetornoColor = 'red-3'
      this.$store.state.app.entregaAtual.ocorrencia.idCargaEntregaMotivoRetorno = newVal
      if (this.confirmaEntrega === 'Sim') {
        this.confirmaEntrega = 'Não'
        this.$store.state.app.entregaAtual.ocorrencia.confirmaEntrega = this.confirmaEntrega
      }
      this.setMapLocalEntrega()
      this.setDataHoraEntrega()
    },
    setDataHoraEntrega () {
      var date = new Date()
      this.$store.state.app.entregaAtual.ocorrencia.data = this.$moment(date).format('YYYY-MM-DD')
      this.$store.state.app.entregaAtual.ocorrencia.hora = this.$moment(date).format('HH:mm:ss')
    },
    setMapLocalEntrega () {
      const vm = this
      vm.$q.loading.show()

      if (window.cordova) {
        cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
          if (!enabled) {
            cordova.plugins.diagnostic.switchToLocationSettings()
          }
        }, function (error) {
          console.log(error)
        })
      }

      navigator.geolocation.getCurrentPosition(onMapSuccess, onMapError, { enableHighAccuracy: true, timeout: 120000 })

      //  Callback functions
      function onMapSuccess (position) {
        vm.$store.state.app.entregaAtual.ocorrencia.latitudeConfirmacaoEntrega = position.coords.latitude
        vm.$store.state.app.entregaAtual.ocorrencia.longitudeConfirmacaoEntrega = position.coords.longitude
        vm.$q.loading.hide()
      }
      function onMapError (error) {
        vm.$q.loading.hide()
        console.log(error)
      }
    }
  },
  created () {
    this.confirmaEntrega = this.$store.state.app.entregaAtual.ocorrencia.confirmaEntrega ? this.$store.state.app.entregaAtual.ocorrencia.confirmaEntrega : 'Não'
    this.motivoRetorno = this.$store.state.app.entregaAtual.ocorrencia.idCargaEntregaMotivoRetorno ? this.$store.state.app.entregaAtual.ocorrencia.idCargaEntregaMotivoRetorno : null
    this.motivoRetornoColor = this.$store.state.app.entregaAtual.ocorrencia.idCargaEntregaMotivoRetorno ? 'red-3' : 'white'

    if (this.$store.state.app.entregaAtual.ocorrencia.imagemReciboPath !== null) {
      this.fotoReciboStatus.icon = 'check'
      this.fotoReciboStatus.color = 'positive'
    }
  }
}
</script>
