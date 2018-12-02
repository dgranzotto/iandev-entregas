<template>
  <!--<q-page class="flex flex-center">-->
  <q-page padding class="row justify-center">
    <div style="width: 500px; max-width: 90vw;">
    <!-- <q-btn :loading="loading" round icon="map" color="primary" @click="handler"> -->
    <!-- <q-spinner-oval slot="loading" /> -->
    <!-- </q-btn> -->
      <q-item-separator />
      <q-list no-border striped class="q-mt-md dark-example">
        <q-item v-for="(item, index) in $store.state.app.entregas" :key="index" @click.native="realizarEntrega(item)">
          <q-item-main>
            <q-item-tile label>{{ item.descricao }}</q-item-tile>
            <q-item-tile sublabel>{{ item.subdescricao }}</q-item-tile>
          </q-item-main>
          <q-item-side right icon="info" color="green" />
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageEntregas',
  data () {
    return {
    }
  },
  methods: {
    realizarEntrega (entregaAtual) {
      this.$store.commit('app/setEntregaAtual', entregaAtual)
      this.$uiUtil.gotoPage(this, 'entrega')
    }
  }
}
</script>
