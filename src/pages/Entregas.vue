<template>
  <!--<q-page class="flex flex-center">-->
  <q-page padding class="row justify-center">
    <div style="width: 500px; max-width: 90vw;">
    <!-- <q-btn :loading="loading" round icon="map" color="primary" @click="handler"> -->
    <!-- <q-spinner-oval slot="loading" /> -->
    <!-- </q-btn> -->
      <q-item-separator />
      <q-list no-border striped class="q-mt-md dark-example">
        <q-item class="itens" v-for="(item, index) in $store.state.app.entregas" :key="index" @click.native="realizarEntrega(item)">
          <q-item-main>
            <q-item-tile label>{{ item.descricao }}</q-item-tile>
            <q-item-tile sublabel>{{ item.subdescricao }}</q-item-tile>
          </q-item-main>
          <q-item-side v-if="item.sync === 'true'" class="info-icon" right icon="" color="green" />
          <q-item-side v-if="Boolean((item.ocorrencia ? item.ocorrencia.confirmaEntrega : false) === 'Sim')" class="info-icon" right icon="info" color="green" />
          <q-item-side v-if="Boolean((item.ocorrencia ? item.ocorrencia.idCargaEntregaMotivoRetorno : null) !== null)" class="info-icon" right icon="check" color="orange" />
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<style>
.itens .info-icon {
  margin: 0 !important;
}
.itens .info-icon {
  min-width: 0 !important;
}
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
