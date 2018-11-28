<template>
  <q-page class="flex flex-center">
    <div style="width: 500px; max-width: 90vw;">
      <div class="row">
        <thumbnail class="shadow-box" v-for="(item, index) in $store.state.app.imagens" :key="index" :img="item" :width="65" :height="65" @click.native="editarImagem(item)"/>
      </div>
      <q-page-sticky position="bottom-right" :offset="[40, 40]">
        <q-fab icon="add_a_photo" direction="up" color="primary"></q-fab>
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
    }
  },
  created () {
    // entregaServices.syncEntregas()
  }
}
</script>
