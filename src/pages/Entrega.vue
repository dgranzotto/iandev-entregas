<template>
  <!--<q-page class="flex flex-center">-->
  <q-page
    padding
    class="row justify-center"
  >
    <div style="width: 500px; max-width: 90vw; margin-top:60px!important;">
      <q-field :label="entregaAtual.descricao"></q-field>
      <q-field :label="entregaAtual.endereco"></q-field>
      <q-field :label="entregaAtual.observacaoentrega"></q-field>
      <q-btn
        v-if="entregaAtual.address || (entregaAtual.latitudeentrega && entregaAtual.longitudeentrega)"
        push
        color="primary"
        icon="directions"
        label="Visualizar Rota"
        size="md"
        class="full-width"
        @click="visualizarRota"
      />
      <q-item-separator />
      <q-field label="Confirmação da Entrega/Retorno"></q-field>
      <div class="row">
        <div class="col-12 q-mt-sm q-mb-sm">
          <q-btn-group
            class="full-width"
            push
          >
            <q-btn
              @click="tirarFotoRecibo"
              push
              class="half-width"
              align="center"
              size="md"
              :color="fotoReciboStatus.color"
              label="Recibo"
              icon="photo_camera"
              :disabled="motivoRetorno != null"
            ></q-btn>
            <q-btn
              @click="adicionarObservacao"
              push
              class="half-width"
              align="center"
              size="md"
              color="primary"
              label="Observação"
              icon="insert_comment"
            ></q-btn>
          </q-btn-group>
        </div>
        <div class="row full-width">
          <div class="col full-width">
            <q-btn
              @click="confirmarEntrega"
              :disabled="confirmaEntrega === 'Sim' || motivoRetorno != null"
              color="positive"
              :label="msgEntregaConfirmada"
              size="md"
              class="full-width"
              style="padding:15px;"
            />
          </div>
          <div>
            <q-btn
              @click="desfazerConfirmacaoEntrega"
              v-if="confirmaEntrega === 'Sim'"
              round
              flat
              style="color: gray;"
              icon="undo"
            />
          </div>
        </div>
      </div>
      <q-item-separator />
      <div class="row full-width">
        <div class="col full-width">
          <q-select
            @input="onChangeMotivoRetorno"
            float-label="Motivo do retorno"
            inverted-light
            :color="motivoRetornoColor"
            separator
            v-model="motivoRetorno"
            :options="$store.state.app.motivosRetorno"
            class="full-width"
          />
        </div>
        <div>
          <q-btn
            @click="desfazerRetorno"
            v-if="motivoRetorno !== null"
            round
            flat
            style="color: gray; margin-top:5px;"
            icon="undo"
          />
        </div>
      </div>
      <q-item-separator />
      <q-list
        no-border
        striped
        class="q-mt-md dark-example"
      >
        <div class="col-12 q-mt-sm q-mb-sm">
          <div
            class="full-width" style="position: relative; display: flex;"
          >
            <div class="q-headline" style="width: 50%;">Itens</div>
            <q-btn
              @click="tirarFotoCarga"
              push
              class="half-width"
              align="center"
              size="sm"
              :color="fotoCargaStatus.color"
              label="Foto Carga"
              icon="photo_camera"
            ></q-btn>
          </div>
        </div>
        <q-item
          v-for="(item, index) in entregaAtual.itens"
          :key="index"
        >
          <q-item-main>
            <q-item-tile label>{{ item.descricao }}</q-item-tile>
            <q-item-tile sublabel>Quantidade: {{ item.quantidade }}</q-item-tile>
            <q-item-tile
              v-show="showMsgFoto(item)"
              label
              color="negative"
            >{{ msgFoto(item) }}</q-item-tile>
          </q-item-main>
          <q-item-side>
            <q-btn
              round
              color="primary"
              icon="photo_camera"
              @click.native="tirarFoto(item)"
            >
              <q-chip
                v-show="item.midias && item.midias.length > 0"
                floating
                color="positive"
              >{{ item.midias && item.midias.length }}</q-chip>
            </q-btn>
          </q-item-side>
        </q-item>
      </q-list>
    </div>

    <q-modal
      @show="onModalShowObservacao"
      class="modal-dark"
      v-model="modalObservacao"
      minimized
      position="right"
      :content-css="{minWidth: '90vw'}"
    >
      <div style="padding: 20px">
        <div class="q-display-1 q-mb-md">Observação</div>
        <q-input
          ref="observacao"
          v-model="observacao"
          dark
          color="white"
          type="textarea"
          stack-label="Observação"
        />
        <q-btn
          style="margin-top:20px"
          color="primary"
          @click="salvarObservacao"
          label="Salvar"
        />
      </div>
    </q-modal>
  </q-page>
</template>

<script>
import bo from '../bo/entrega-bo'
import dao from '../db/dao'
import entregaServices from '../services/entrega-services'
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
      },
      fotoCargaStatus: {
        icon: 'close',
        color: 'red-4'
      },
      sourcePage: ''
    }
  },
  computed: {
    ...mapState({
      entregaAtual: state => state.app.entregaAtual
    }),
    msgEntregaConfirmada () {
      if (this.confirmaEntrega === 'Sim') {
        return 'Entrega Confirmada dia ' +
          this.entregaAtual.ocorrencia.data.substring(8) +
          ' às ' +
          this.entregaAtual.ocorrencia.hora
      }
      return 'Confirmar Entrega'
    }
  },
  methods: {
    beforeLeave (to) {
      if (to.name.startsWith('entregas')) {
        if (bo.isRetorno(this.entregaAtual)) { // Retorno
          if (!this.entregaAtual.ocorrencia.observacao || this.entregaAtual.ocorrencia.observacao.trim().length === 0) {
            this.$uiUtil.showErrorMessage('É necessário digitar uma observação sobre o retorno')
            return false
          }
        }
        if (bo.isRealizada(this.entregaAtual) || bo.isRetorno(this.entregaAtual) || bo.isPendente(this.entregaAtual)) { // Realizada ou Retorno
          dao.saveEntrega(this.entregaAtual)
            .then(result => {
            })
            .catch(error => {
              this.$uiUtil.showErrorMessage('Erro ao gravar entrega', error.message)
            })
            .finally(() => { // Gravando ou não a ocorrência no SQLite, tenta enviar a mesma ao servidor
              console.log('saveOcorrenciasStart')
              entregaServices.saveOcorrenciasStart((count) => {
                if (count > 0) {
                  this.$uiUtil.showSuccessMessage(bo.getDescEnvioOcorrenciasServer(count))
                }
              })
            })
        }
      }
      return true
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
      this.entregaAtual.sync = 'false'
      this.modalObservacao = false
      if (bo.isRetorno(this.entregaAtual)) { // Retorno
        this.$uiUtil.replacePage(this, this.sourcePage)
      }
    },
    tirarFotoRecibo () {
      const vm = this
      console.log('vm.entregaAtual.ocorrencia.imagemReciboPath', vm.entregaAtual.ocorrencia.imagemReciboPath)
      if (vm.entregaAtual.ocorrencia.imagemReciboPath && vm.entregaAtual.ocorrencia.imagemReciboPath !== null) {
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
        if (vm.$config.runningAsWebApp) {
          vm.assignImagemRecibo('xyz')
          return
        }
        setTimeout(
          navigator.camera.getPicture(
            (data) => { // on success
              vm.moveAndSaveFileURI(data, 'R')
            }, (error) => { // on fail
              console.log(error)
              vm.$uiUtil.showErrorMessage('Não foi possível acessar a câmera do dispositivo')
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
    tirarFotoCarga () {
      const vm = this
      console.log('vm.entregaAtual.ocorrencia.imagemCargaPath', vm.entregaAtual.ocorrencia.imagemCargaPath)
      if (vm.entregaAtual.ocorrencia.imagemCargaPath && vm.entregaAtual.ocorrencia.imagemCargaoPath !== null) {
        vm.$uiUtil.showConfirmOkCancelMessage('Já existe uma imagem da carga, deseja sobrepor essa imagem?', 'Sobrepor imagem')
          .then(() => {
            takePhoto()
          }).catch(() => {
            // do nothing
          })
      } else {
        takePhoto()
      }

      function takePhoto () {
        if (vm.$config.runningAsWebApp) {
          vm.assignImagemCarga('xyz')
          return
        }
        setTimeout(
          navigator.camera.getPicture(
            (data) => { // on success
              vm.moveAndSaveFileURI(data, 'C')
            }, (error) => { // on fail
              console.log(error)
              vm.$uiUtil.showErrorMessage('Não foi possível acessar a câmera do dispositivo')
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
    moveAndSaveFileURI (data, tipo) {
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
                      if (tipo === 'R') {
                        this.assignImagemRecibo(entry.nativeURL)
                      } else {
                        this.assignImagemCarga(entry.nativeURL)
                      }
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
    assignImagemRecibo (imagemReciboPath) {
      this.entregaAtual.sync = 'false'
      this.entregaAtual.ocorrencia.imagemReciboPath = imagemReciboPath
      this.fotoReciboStatus.icon = 'check'
      this.fotoReciboStatus.color = 'positive'
    },
    assignImagemCarga (imagemCargaPath) {
      this.entregaAtual.sync = 'false'
      this.entregaAtual.ocorrencia.imagemCargaPath = imagemCargaPath
      this.fotoCargaStatus.icon = 'check'
      this.fotoCargaStatus.color = 'positive'
    },
    tirarFoto (item) {
      this.$store.commit('app/setItemAtual', item)
      this.$uiUtil.gotoPage(this, 'midias')
    },
    visualizarRota () {
      this.$uiUtil.gotoPage(this, 'entregarota')
    },
    confirmarEntrega () {
      this.onChangeConfirmaEntrega('Sim')
    },
    desfazerConfirmacaoEntrega () {
      this.onChangeConfirmaEntrega('Não')
    },
    getLocationPromise () {
      return new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { maximumAge: 0, timeout: 45000, enableHighAccuracy: true })
      )
    },
    async onChangeConfirmaEntrega (newVal) {
      const vm = this
      this.entregaAtual.sync = 'false'
      if (newVal === 'Sim') {
        // valida se existe algum item que é obrigatório tirar foto e se foi tirado a foto do mesmo
        let validaConfirmacao = true
        vm.$q.loading.show()
        if (!this.entregaAtual.ocorrencia.imagemReciboPath) {
          validaConfirmacao = false
          this.$uiUtil.showErrorMessage('Obrigatório tirar foto do recibo')
        } else if (this.entregaAtual.itens) {
          let item
          for (let i = 0; i < this.entregaAtual.itens.length; i++) {
            item = this.entregaAtual.itens[i]
            if (item.numminimofotos > 0) {
              if (!item.midias || item.midias.length < item.numminimofotos || item.midias.length > item.nummaximofotos) {
                if (item.nummaximofotos > 0) {
                  validaConfirmacao = false
                  this.$uiUtil.showErrorMessage(`Necessário tirar ${item.numminimofotos} a ${item.nummaximofotos} fotos para o item ${item.descricao}`)
                } else {
                  validaConfirmacao = false
                  this.$uiUtil.showErrorMessage(`Necessário tirar ${item.numminimofotos} ou mais fotos para o item ${item.descricao}`)
                }
              }
            }
          }
        }
        if (window.cordova) {
          cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
            if (!enabled) {
              cordova.plugins.diagnostic.switchToLocationSettings()
            }
          }, function (error) {
            console.log(error)
          })
        }
        await this.getLocationPromise()
          .then((res) => {
            const { coords } = res
            if (validaConfirmacao) {
              vm.entregaAtual.ocorrencia.latitudeConfirmacaoEntrega = coords.latitude
              vm.entregaAtual.ocorrencia.longitudeConfirmacaoEntrega = coords.longitude
              this.$nextTick(function () {
                setTimeout(() => {
                  this.confirmaEntrega = 'Sim'
                  this.motivoRetorno = null
                  this.motivoRetornoColor = 'white'
                  this.entregaAtual.ocorrencia.confirmaEntrega = newVal
                  this.entregaAtual.ocorrencia.idCargaEntregaMotivoRetorno = null
                  this.setDataHoraEntrega()
                  this.$nextTick(function () {
                    setTimeout(() => {
                      console.log('latitude: ' + vm.entregaAtual.ocorrencia.latitudeConfirmacaoEntrega + ' | longitude: ' + vm.entregaAtual.ocorrencia.longitudeConfirmacaoEntrega)
                      this.$uiUtil.replacePage(this, this.sourcePage)
                    }, 500)
                  })
                }, 500)
              })
            } else {
              this.confirmaEntrega = 'Não'
              this.entregaAtual.ocorrencia.confirmaEntrega = this.confirmaEntrega
            }
            vm.$q.loading.hide()
          })
          .catch((error) => {
            console.log(`Erro: ${error.message}`)
            this.$uiUtil.showErrorMessage('Obrigatório permitir que o APP acesse sua localização')
            vm.$q.loading.hide()
          })
      } else {
        this.confirmaEntrega = 'Não'
        this.entregaAtual.ocorrencia.confirmaEntrega = this.confirmaEntrega
      }
    },
    async onChangeMotivoRetorno (newVal) {
      const vm = this
      if (window.cordova) {
        cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
          if (!enabled) {
            cordova.plugins.diagnostic.switchToLocationSettings()
          }
        }, function (error) {
          console.log(error)
        })
      }
      await this.getLocationPromise()
        .then((res) => {
          const { coords } = res
          vm.entregaAtual.ocorrencia.latitudeConfirmacaoEntrega = coords.latitude
          vm.entregaAtual.ocorrencia.longitudeConfirmacaoEntrega = coords.longitude
          this.$nextTick(function () {
            setTimeout(() => {
              this.motivoRetornoColor = 'red-3'
              this.entregaAtual.ocorrencia.idCargaEntregaMotivoRetorno = newVal
              this.entregaAtual.sync = 'false'
              this.confirmaEntrega = 'Não'
              this.entregaAtual.ocorrencia.confirmaEntrega = this.confirmaEntrega
              this.setDataHoraEntrega()
              this.adicionarObservacao()
              if (newVal != null) {
                this.removeRecibo()
                this.removeCarga()
              }
            }, 500)
          })
        })
        .catch((error) => {
          console.log(`Erro: ${error.message}`)
          this.$uiUtil.showErrorMessage('Obrigatório permitir que o APP acesse sua localização')
          vm.$q.loading.hide()
        })
    },
    removeRecibo () {
      if (this.entregaAtual.ocorrencia.imagemReciboPath) {
        var dataDirectory = cordova.file.externalDataDirectory
        window.resolveLocalFileSystemURL(dataDirectory,
          dataDirectoryEntry => { // on success
            dataDirectoryEntry.getDirectory('imagens', { create: true },
              dirEntry => { // on success
                var fileName = this.entregaAtual.ocorrencia.imagemReciboPath.split('/')
                fileName = fileName[fileName.length - 1]
                // console.log('fullPath', dirEntry.fullPath)
                // console.log('fileName', fileName)
                dirEntry.getFile(fileName, { create: false },
                  fileEntry => {
                    fileEntry.remove(file => {
                      this.entregaAtual.ocorrencia.imagemReciboPath = null
                      this.fotoReciboStatus.icon = 'close'
                      this.fotoReciboStatus.color = 'faded'
                      console.log('recibo removido')
                    }, (error) => {
                      console.log(error)
                    }, () => {
                      console.log('arquivo não existe')
                    })
                  })
              }, (error) => { // on fail
                console.log(error)
              })
          }, (error) => { // on fail
            console.log(error)
          })
      }
    },
    removeCarga () {
      if (this.entregaAtual.ocorrencia.imagemCargaPath) {
        var dataDirectory = cordova.file.externalDataDirectory
        window.resolveLocalFileSystemURL(dataDirectory,
          dataDirectoryEntry => { // on success
            dataDirectoryEntry.getDirectory('imagens', { create: true },
              dirEntry => { // on success
                var fileName = this.entregaAtual.ocorrencia.imagemCargaPath.split('/')
                fileName = fileName[fileName.length - 1]
                // console.log('fullPath', dirEntry.fullPath)
                // console.log('fileName', fileName)
                dirEntry.getFile(fileName, { create: false },
                  fileEntry => {
                    fileEntry.remove(file => {
                      this.entregaAtual.ocorrencia.imagemCargaPath = null
                      this.fotoCargaStatus.icon = 'close'
                      this.fotoCargaStatus.color = 'faded'
                      console.log('Imagem Carga removida')
                    }, (error) => {
                      console.log(error)
                    }, () => {
                      console.log('arquivo não existe')
                    })
                  })
              }, (error) => { // on fail
                console.log(error)
              })
          }, (error) => { // on fail
            console.log(error)
          })
      }
    },
    desfazerRetorno () {
      this.motivoRetorno = null
      this.motivoRetornoColor = 'white'
      this.fotoReciboStatus.icon = 'close'
      this.fotoReciboStatus.color = 'red-4'
      this.fotoCargaStatus.icon = 'close'
      this.fotoCargaStatus.color = 'red-4'
      this.entregaAtual.ocorrencia.idCargaEntregaMotivoRetorno = null
      this.entregaAtual.sync = 'false'
    },
    setDataHoraEntrega () {
      var date = new Date()
      this.entregaAtual.ocorrencia.data = this.$moment(date).format('YYYY-MM-DD')
      this.entregaAtual.ocorrencia.hora = this.$moment(date).format('HH:mm:ss')
    },
    msgFoto (item) {
      if (item.numminimofotos > 0) {
        if (!item.midias || item.midias.length < item.numminimofotos || item.midias.length > item.nummaximofotos) {
          if (item.nummaximofotos > 0) {
            return `Necessário tirar ${item.numminimofotos} a ${item.nummaximofotos} fotos`
          } else {
            return `Necessário tirar ${item.numminimofotos} ou mais fotos`
          }
        }
      }
      return null
    },
    showMsgFoto (item) {
      return this.msgFoto(item) != null
    }
  },
  created () {
    this.confirmaEntrega = this.entregaAtual.ocorrencia.confirmaEntrega ? this.entregaAtual.ocorrencia.confirmaEntrega : 'Não'
    this.motivoRetorno = this.entregaAtual.ocorrencia.idCargaEntregaMotivoRetorno ? this.entregaAtual.ocorrencia.idCargaEntregaMotivoRetorno : null
    this.motivoRetornoColor = this.entregaAtual.ocorrencia.idCargaEntregaMotivoRetorno ? 'red-3' : 'white'

    if (this.entregaAtual.ocorrencia.imagemReciboPath && this.entregaAtual.ocorrencia.imagemReciboPath !== null) {
      this.fotoReciboStatus.icon = 'check'
      this.fotoReciboStatus.color = 'positive'
    } else if (this.motivoRetorno != null) {
      this.fotoReciboStatus.icon = 'close'
      this.fotoReciboStatus.color = 'faded'
    }

    if (this.entregaAtual.ocorrencia.imagemCargaPath && this.entregaAtual.ocorrencia.imagemCargaPath !== null) {
      this.fotoCargaStatus.icon = 'check'
      this.fotoCargaStatus.color = 'positive'
    } else if (this.motivoRetorno != null) {
      this.fotoCargaStatus.icon = 'close'
      this.fotoCargaStatus.color = 'faded'
    }
    console.log('this.entregaAtual', this.entregaAtual)
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name.startsWith('entregas')) {
        vm.sourcePage = from.name
        console.log(vm.sourcePage)
      }
    })
  }
}
</script>
