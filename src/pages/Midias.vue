<template>
  <q-page class="flex flex-center" style="background-color:#4b4b4be0;">
      <div style="width:100%">
        <!-- <thumbnail class="shadow-box" v-for="(item, index) in $store.state.app.entregaAtual.itemAtual.midias" :key="index" :img="item" :width="50" :height="50" @click.native="editarImagem(item)"/> -->
          <q-carousel @input="currentIndex" ref="carousel" :height="windowHeight" color="white" arrows :thumbnails="thumbnails" thumbnails-horizontal>
            <q-carousel-slide class="carousel-slide" v-for="(item, index) in $store.state.app.entregaAtual.itemAtual.midias" :img-src="item.filePath" :key="index"></q-carousel-slide>
          </q-carousel>
      </div>
      <q-page-sticky position="top-left" :offset="[5, 5]">
        <q-btn class="btn-carousel" round icon="add_a_photo" size="lg" @click="tirarFoto()"></q-btn>
      </q-page-sticky>
      <q-page-sticky v-if="$store.state.app.entregaAtual.itemAtual.midias.length > 0" position="top-left" :offset="[78, 5]">
        <q-btn class="btn-carousel" round icon="delete" size="lg" @click="excluirFoto()"></q-btn>
      </q-page-sticky>
      <q-page-sticky v-if="$store.state.app.entregaAtual.itemAtual.midias.length > 0" position="top" :offset="[80, 5]">
        <q-btn class="btn-carousel" round icon="insert_comment" size="lg" @click="adicionarDescricao()"></q-btn>
      </q-page-sticky>
      <q-modal class="modal-dark" v-model="modalMidiaDescricao" minimized position="top" :content-css="{minWidth: '100vw'}">
        <div style="padding: 20px">
          <div class="q-display-1 q-mb-md">Editar descrição</div>
          <q-input v-model="midiaDescricao" type="textarea" dark color="white" float-label="Descrição" />
          <q-btn style="margin-top:20px" color="primary" @click="salvarDescricao" label="Salvar" />
        </div>
      </q-modal>
  </q-page>
</template>

<script>
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
  methods: {
    updateThumbnails () {
      this.thumbnails = []
      for (var i = 0; i < this.$store.state.app.entregaAtual.itemAtual.midias.length; i++) {
        this.thumbnails.push(this.$store.state.app.entregaAtual.itemAtual.midias[i].filePath)
      }
    },
    currentIndex (index) {
      this.carouselIndex = index
    },
    getWindowHeight () {
      this.windowHeight = (window.innerHeight - 50) + 'px'
    },
    adicionarDescricao () {
      this.midiaDescricao = this.$store.state.app.entregaAtual.itemAtual.midias[this.carouselIndex].descricao
      this.modalMidiaDescricao = true
    },
    salvarDescricao () {
      this.$store.state.app.entregaAtual.itemAtual.midias[this.carouselIndex].descricao = this.midiaDescricao
      this.modalMidiaDescricao = false
    },
    excluirFoto () {
      this.$uiUtil.showConfirmDeleteMessage('Tem certeza de que deseja excluir a imagem atual?', 'Excluir imagem')
        .then(() => {
          this.$store.state.app.entregaAtual.itemAtual.midias.splice(this.carouselIndex, 1)
          if (this.carouselIndex >= this.$store.state.app.entregaAtual.itemAtual.midias.length - 1) {
            this.updateThumbnails()
            this.$refs.carousel.goToSlide(this.carouselIndex - 1)
          }
        }).catch(() => {
          // do nothing
        })
    },
    tirarFoto () {
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
                      var newFileName = yyyy + '-' + mm + '-' + dd + 'P_' + fileName
                      fileEntry.moveTo(dirEntry, newFileName,
                        entry => { // on success
                          var midia = { filePath: entry.nativeURL, descricao: null }
                          vm.$store.state.app.entregaAtual.itemAtual.midias.push(midia)
                          vm.updateThumbnails()
                          vm.$refs.carousel.goToSlide(vm.thumbnails.length - 1)
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
          allowEdit: true,
          correctOrientation: true
        }
      )
    }
  },
  created () {
    // entregaServices.syncEntregas()
    this.updateThumbnails()
    this.getWindowHeight()

    if (this.$store.state.app.entregaAtual.itemAtual.midias.length === 0) {
      this.tirarFoto()
    }
  },
  mounted () {
    this.$nextTick(function () {
      window.addEventListener('resize', this.getWindowHeight)
      // console.log(this.$refs.carousel.index())
    })
  }
}
</script>
