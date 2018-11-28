<template>
  <!--<q-page class="flex flex-center">-->
  <q-page padding class="row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <div class="q-headline">Entrega</div>
      <q-input readonly v-model="$store.state.app.entregaAtual.descricao" />
      <q-input readonly v-model="$store.state.app.entregaAtual.subdescricao" />
      <q-item-separator />
      <q-btn v-if="$store.state.app.entregaAtual.address || ($store.state.app.entregaAtual.latitudeentrega && $store.state.app.entregaAtual.longitudeentrega)" rounded color="primary" icon="directions" label="Visualizar Rota" size="md" class="full-width q-my-md" @click="visualizarRota" />
      <q-item-separator />
      <q-list no-border striped class="q-mt-md dark-example">
        <div class="q-headline">Itens</div>
        <q-item v-for="(item, index) in $store.state.app.entregaAtual.itens" :key="index" @click.native="entregas(item)">
          <q-item-main>
            <q-item-tile label>{{ item.descricao }}</q-item-tile>
            <q-item-tile sublabel>Quantidade: {{ item.quantidade }}</q-item-tile>
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
  name: 'PageEntrega',
  data () {
    return {
    }
  },
  methods: {
    entregas () {
    },
    visualizarRota () {
      this.$uiUtil.gotoPage(this, 'entregarota')
    }
  }
}
</script>
