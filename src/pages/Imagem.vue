<template>
  <q-page class="flex flex-center">
    <div style="width: 500px; max-width: 90vw;">
      <q-input float-label="Descrição" type="textarea" />
    </div>
    <img :src="$store.state.app.imagemAtual" />
    <q-page-sticky position="bottom-right" :offset="[40, 40]">
      <q-fab icon="delete_outline" direction="up" color="primary"></q-fab>
    </q-page-sticky>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageImagem',
  data () {
    return {
    }
  }
}
</script>
