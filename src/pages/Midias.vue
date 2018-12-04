<template>
  <q-page class="flex flex-center midia">
    <div v-if="itemAtual.midias.length === 0" class="no-data">
      Nenhum imagem foi encontrada.
    </div>
    <div v-show="itemAtual.midias.length > 0" style="width:100%">
        <q-carousel @input="currentIndex" ref="carousel" :height="windowHeight" color="white" arrows :thumbnails="thumbnails" thumbnails-horizontal>
          <q-carousel-slide class="carousel-slide" v-for="(item, index) in itemAtual.midias" :img-src="item.filePath" :key="index"></q-carousel-slide>
        </q-carousel>
    </div>
    <q-page-sticky position="top-left" :offset="[5, 5]">
      <q-btn class="btn-carousel" round icon="add_a_photo" size="lg" @click="tirarFoto()"></q-btn>
    </q-page-sticky>
    <q-page-sticky v-if="itemAtual.midias.length > 0" position="top-left" :offset="[78, 5]">
      <q-btn class="btn-carousel" round icon="delete" size="lg" @click="excluirFoto()"></q-btn>
    </q-page-sticky>
    <q-page-sticky v-if="itemAtual.midias.length > 0" position="top" :offset="[80, 5]">
      <q-btn class="btn-carousel" round icon="insert_comment" size="lg" @click="adicionarDescricao()"></q-btn>
    </q-page-sticky>
    <q-modal @show="onModalShowDescricao" class="modal-dark" v-model="modalMidiaDescricao" minimized position="top" :content-css="{minWidth: '100vw'}">
      <div style="padding: 20px">
        <div class="q-display-1 q-mb-md">Editar descrição</div>
        <q-input ref="descricao" v-model="midiaDescricao" type="textarea" dark color="white" float-label="Descrição" />
        <q-btn style="margin-top:20px" color="primary" @click="salvarDescricao" label="Salvar" />
      </div>
    </q-modal>
  </q-page>
</template>

<style>
.no-data {
  text-align: center;
  color: #FFF;
}
</style>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PageMidias',
  data () {
    return {
      windowHeight: 0,
      carouselIndex: 0,
      modalMidiaDescricao: false,
      midiaDescricao: null,
      thumbnails: []
    }
  },
  computed: {
    ...mapState({
      itemAtual: state => state.app.entregaAtual.itemAtual
    })
  },
  methods: {
    updateThumbnails () {
      this.thumbnails = []
      for (var i = 0; i < this.itemAtual.midias.length; i++) {
        this.thumbnails.push(this.itemAtual.midias[i].filePath)
      }
    },
    currentIndex (index) {
      this.carouselIndex = index
    },
    getWindowHeight () {
      this.windowHeight = (window.innerHeight - 50) + 'px'
    },
    onModalShowDescricao () {
      this.$refs.descricao.focus()
    },
    adicionarDescricao () {
      this.midiaDescricao = this.itemAtual.midias[this.carouselIndex].descricao
      this.modalMidiaDescricao = true
    },
    salvarDescricao () {
      this.itemAtual.midias[this.carouselIndex].descricao = this.midiaDescricao
      this.modalMidiaDescricao = false
    },
    excluirFoto () {
      this.$uiUtil.showConfirmDeleteMessage('Tem certeza de que deseja excluir a imagem atual?', 'Excluir imagem')
        .then(() => {
          this.itemAtual.midias.splice(this.carouselIndex, 1)
          if (this.carouselIndex >= this.itemAtual.midias.length - 1) {
            this.updateThumbnails()
            this.$refs.carousel.goToSlide(this.carouselIndex - 1)
          }
        }).catch(() => {
          // do nothing
        })
    },
    tirarFoto () {
      setTimeout(
        navigator.camera.getPicture(
          (data) => { // on success
            this.moveAndSaveFileURI(data)
          }, (error) => { // on fail
            console.log(error)
            var mensagem = (error === 'No Image Selected' ? 'Nenhuma imagem capturada' : null)
            this.$uiUtil.showErrorMessage(mensagem || 'Não foi possível acessar a camera do dispositivo')
          },
          {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            encodingType: Camera.EncodingType.JPEG,
            correctOrientation: true
          }
        ), 1000)
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
                  var newFileName = yyyy + '-' + mm + '-' + dd + 'P_' + fileName
                  fileEntry.moveTo(dirEntry, newFileName,
                    entry => { // on success
                      var midia = { filePath: entry.nativeURL, descricao: null }
                      this.itemAtual.midias.push(midia)
                      this.updateThumbnails()
                      this.$refs.carousel.goToSlide(this.thumbnails.length - 1)
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
    }
  },
  created () {
    this.updateThumbnails()
    this.getWindowHeight()

    if (this.itemAtual.midias.length === 0) {
      this.tirarFoto()
    }
  },
  mounted () {
    this.$nextTick(function () {
      window.addEventListener('resize', this.getWindowHeight)
    })
  }
}
</script>
