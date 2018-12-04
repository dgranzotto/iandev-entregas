<template>
  <!--<q-page class="flex flex-center">-->
  <q-page padding class="row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <div class="q-headline">Entrega</div>
      <q-field :label="entregaAtual.descricao"></q-field>
      <q-field :label="entregaAtual.subdescricao"></q-field>
      <q-btn v-if="entregaAtual.address || (entregaAtual.latitudeentrega && entregaAtual.longitudeentrega)" rounded push glossy color="primary" icon="directions" label="Visualizar Rota" size="md" class="full-width" @click="visualizarRota" />
      <q-item-separator />
      <q-field label="Confirmação da Entrega/Retorno"></q-field>
      <div class="row">
        <div class="col-12 q-mt-sm q-mb-sm">
          <q-btn-group class="full-width" push>
            <q-btn @click="tirarFotoRecibo" push align="center" size="md" :color="fotoReciboStatus.color" label="Foto do Recibo" icon="photo_camera"></q-btn>
            <q-btn @click="adicionarObservacao" push align="center" size="md" color="primary" label="Observação" icon="insert_comment"></q-btn>
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
        <q-item v-for="(item, index) in entregaAtual.itens" :key="index" @click.native="entregas(item)">
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
import { mapState } from 'vuex'

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
        color: 'red-4'
      }
    }
  },
  computed: {
    ...mapState({
      entregaAtual: state => state.app.entregaAtual
    })
  },
  methods: {
    entregas () {
    },
    onModalShowObservacao () {
      this.$refs.observacao.focus()
    },
    adicionarObservacao () {
      this.observacao = this.entregaAtual.ocorrencia.observacao
      this.modalObservacao = true
    },
    salvarObservacao () {
      this.entregaAtual.ocorrencia.observacao = this.observacao
      this.modalObservacao = false
    },
    tirarFotoRecibo () {
      const vm = this
      if (vm.entregaAtual.ocorrencia.imagemReciboPath !== null) {
        vm.$uiUtil.showConfirmOkCancelMessage('Já existe uma imagem do recibo, deseja sobrepor essa imagem?', 'Sobrepor imagem')
          .then(() => {
            takePhoto()
          }).catch(() => {
            // do nothing
          })
      } else {
        takePhoto()
      }

      function takePhoto () {
        setTimeout(
          navigator.camera.getPicture(
            (data) => { // on success
              vm.moveAndSaveFileURI(data)
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
          ), 1000)
      }
    },
    moveAndSaveFileURI (data) {
      var fileName = data.substring(data.lastIndexOf('/') + 1)
      window.resolveLocalFileSystemURL(data,
        fileEntry => { // on success
          var dataDirectory = cordova.file.externalDataDirectory
          window.resolveLocalFileSystemURL(dataDirectory,
            dataDirectoryEntry => { // on success
              dataDirectoryEntry.getDirectory('imagens', { create: true },
                dirEntry => { // on success
                  var today = new Date(), dd = today.getDate(), mm = today.getMonth() + 1, yyyy = today.getFullYear()
                  var newFileName = yyyy + '-' + mm + '-' + dd + 'R_' + fileName
                  fileEntry.moveTo(dirEntry, newFileName,
                    entry => { // on success
                      this.entregaAtual.ocorrencia.imagemReciboPath = entry.nativeURL
                      this.fotoReciboStatus.icon = 'check'
                      this.fotoReciboStatus.color = 'positive'
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

        if (!this.entregaAtual.ocorrencia.imagemReciboPath) {
          validaConfirmacao = false
          this.$uiUtil.showErrorMessage('Obrigatório tirar foto do recibo')
        } else {
          for (var i = 0; i < this.entregaAtual.itens.length; i++) {
            if (this.entregaAtual.itens[i].requerfoto === 'S') {
              if (!this.entregaAtual.itens[i].midias) {
                validaConfirmacao = false
                this.$uiUtil.showErrorMessage('Obrigatório tirar foto do item ' + this.entregaAtual.itens[i].descricao)
              } else if (this.entregaAtual.itens[i].midias) {
                if (this.entregaAtual.itens[i].midias.length === 0) {
                  validaConfirmacao = false
                  this.$uiUtil.showErrorMessage('Obrigatório tirar foto do item ' + this.entregaAtual.itens[i].descricao)
                }
              }
            }
          }
        }

        if (validaConfirmacao) {
          this.motivoRetorno = null
          this.motivoRetornoColor = 'white'
          this.entregaAtual.ocorrencia.confirmaEntrega = newVal
          this.entregaAtual.ocorrencia.idCargaEntregaMotivoRetorno = null
          this.setMapLocalEntrega()
          this.setDataHoraEntrega()
        } else {
          this.confirmaEntrega = 'Não'
          this.entregaAtual.ocorrencia.confirmaEntrega = this.confirmaEntrega
        }
      }
    },
    onChangeMotivoRetorno (newVal) {
      this.motivoRetornoColor = 'red-3'
      this.entregaAtual.ocorrencia.idCargaEntregaMotivoRetorno = newVal
      if (this.confirmaEntrega === 'Sim') {
        this.confirmaEntrega = 'Não'
        this.entregaAtual.ocorrencia.confirmaEntrega = this.confirmaEntrega
      }
      this.setMapLocalEntrega()
      this.setDataHoraEntrega()
    },
    setDataHoraEntrega () {
      var date = new Date()
      this.entregaAtual.ocorrencia.data = this.$moment(date).format('YYYY-MM-DD')
      this.entregaAtual.ocorrencia.hora = this.$moment(date).format('HH:mm:ss')
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
        vm.entregaAtual.ocorrencia.latitudeConfirmacaoEntrega = position.coords.latitude
        vm.entregaAtual.ocorrencia.longitudeConfirmacaoEntrega = position.coords.longitude
        vm.$q.loading.hide()
      }
      function onMapError (error) {
        vm.$q.loading.hide()
        console.log(error)
      }
    }
  },
  created () {
    this.confirmaEntrega = this.entregaAtual.ocorrencia.confirmaEntrega ? this.entregaAtual.ocorrencia.confirmaEntrega : 'Não'
    this.motivoRetorno = this.entregaAtual.ocorrencia.idCargaEntregaMotivoRetorno ? this.entregaAtual.ocorrencia.idCargaEntregaMotivoRetorno : null
    this.motivoRetornoColor = this.entregaAtual.ocorrencia.idCargaEntregaMotivoRetorno ? 'red-3' : 'white'

    if (this.entregaAtual.ocorrencia.imagemReciboPath !== null) {
      this.fotoReciboStatus.icon = 'check'
      this.fotoReciboStatus.color = 'positive'
    }
  }
}
</script>
