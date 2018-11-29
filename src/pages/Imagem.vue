<template>
  <q-page class="flex flex-center">
    <div style="width: 500px; max-width: 90vw;">
      <q-input float-label="Descrição" type="textarea" />
    </div>
    <div class="row justify-center">
      <div class="col-12">
        <img style="height: 100%;width: 100%;" :src="$store.state.app.imagemAtual" />
      </div>
    </div>
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
