<template>
  <q-page class="flex flex-center" style="background-color:#4b4b4be0;">
      <div style="width:100%">
        <!-- <thumbnail class="shadow-box" v-for="(item, index) in $store.state.app.imagens" :key="index" :img="item" :width="50" :height="50" @click.native="editarImagem(item)"/> -->
          <q-carousel @input="currentIndex" ref="carousel" :height="windowHeight" color="white" arrows :thumbnails="$store.state.app.imagens" thumbnails-horizontal>
            <q-carousel-slide class="carousel-slide" v-for="(item, index) in $store.state.app.imagens" :img-src="item" :key="index"></q-carousel-slide>
          </q-carousel>
      </div>
      <q-page-sticky position="top-left" :offset="[5, 5]">
        <q-btn class="btn-carousel" round icon="add_a_photo" size="lg" @click="tirarFoto()"></q-btn>
      </q-page-sticky>
      <q-page-sticky v-if="$store.state.app.imagens.length > 0" position="top-left" :offset="[80, 5]">
        <q-btn class="btn-carousel" round icon="delete" size="lg" @click="excluirFoto()"></q-btn>
      </q-page-sticky>
  </q-page>
</template>

<style lang="stylus">
.btn-carousel {
  color #FFFFFF;
  background rgba(0, 0, 0, .3);
}
.carousel-slide {
  background-color: #4b4b4be0;
  background-size: contain !important;
  background-position: center;
  background-repeat: no-repeat;
}
</style>

<script>
export default {
  name: 'PageMidias',
  data () {
    return {
      windowHeight: 0,
      carouselIndex: 0
    }
  },
  methods: {
    currentIndex (index) {
      this.carouselIndex = index
    },
    getWindowHeight () {
      this.windowHeight = (window.innerHeight - 50) + 'px'
    },
    excluirFoto () {
      this.$uiUtil.showConfirmDeleteMessage('Tem certeza de que deseja excluir a imagem atual?', 'Excluir imagem')
        .then(() => {
          this.$store.state.app.imagens.splice(this.carouselIndex, 1)
          if (this.carouselIndex >= this.$store.state.app.imagens.length - 1) {
            this.$refs.carousel.goToSlide(this.carouselIndex - 1)
          }
        }).catch(() => {
          // do nothing
        })
    },
    editarImagem (imagem) {
      this.$store.commit('app/setImagemAtual', imagem)
      this.$uiUtil.gotoPage(this, 'imagem')
    },
    tirarFoto () {
      const vm = this

      navigator.camera.getPicture(
        (data) => { // on success
          var fileName = data.substring(data.lastIndexOf('/') + 1)
          window.resolveLocalFileSystemURL(data,
            fileEntry => { // on success
              console.log(fileEntry)
              var dataDirectory = cordova.file.externalDataDirectory
              window.resolveLocalFileSystemURL(dataDirectory,
                dataDirectoryEntry => { // on success
                  dataDirectoryEntry.getDirectory('imagens', { create: true },
                    dirEntry => { // on success
                      console.log(fileName)
                      console.log(dirEntry)
                      fileEntry.moveTo(dirEntry, fileName,
                        entry => { // on success
                          console.log(entry)
                          this.$store.state.app.imagens.push(entry.nativeURL)
                          this.$refs.carousel.goToSlide(this.$store.state.app.imagens.length - 1)
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
          encodingType: Camera.EncodingType.JPEG
        }
      )
    }
  },
  created () {
    // entregaServices.syncEntregas()
    this.getWindowHeight()
  },
  mounted () {
    this.$nextTick(function () {
      window.addEventListener('resize', this.getWindowHeight)
      // console.log(this.$refs.carousel.index())
    })
  }
}
</script>
