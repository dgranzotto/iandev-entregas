<template>
  <q-page class="flex flex-center">
    <div style="width: 500px; max-width: 90vw;">
      <div class="row">
        <thumbnail class="shadow-box" v-for="(item, index) in $store.state.app.imagens" :key="index" :img="item" :width="65" :height="65" @click.native="editarImagem(item)"/>
      </div>
      <q-page-sticky position="bottom-right" :offset="[40, 40]">
         <q-btn round icon="add_a_photo" color="primary" @click="tirarFoto()"></q-btn>
      </q-page-sticky>
    </div>
  </q-page>
</template>

<script>
import Thumbnail from 'components/Thumbnail'
export default {
  components: {
    Thumbnail
  },
  name: 'PageMidias',
  data () {
    return {
    }
  },
  methods: {
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

      /* var db = window.sqlitePlugin.openDatabase({
        name: 'my.db',
        location: 'default'
      })

       db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS DemoTable (name, score)')
        tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Alice', 101])
      }, function (error) {
        console.log('Transaction ERROR: ' + error.message)
      }, function () {
        console.log('Populated database OK')
      }) */
    }
  },
  created () {
    // entregaServices.syncEntregas()
  }
}
</script>
