<template>
  <!--<q-page class="flex flex-center">-->
  <q-page padding class="row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <div class="q-headline">Entrega</div>
      <q-input readonly v-model="$store.state.app.entregaAtual.descricao" />
      <q-input readonly v-model="$store.state.app.entregaAtual.subdescricao" />
      <q-item-separator />
      <q-select float-label="Selecione o tipo da ocorrência" v-model="motivoRetorno" :options="$store.state.app.motivosRetorno" />
      <q-item-separator />
      <q-list no-border striped class="q-mt-md dark-example">
        <div class="q-headline">Itens</div>
        <q-item v-for="(item, index) in $store.state.app.entregaAtual.itens" :key="index" @click.native="entregas(item)">
          <q-item-main>
            <q-item-tile label>{{ item.descricao }}</q-item-tile>
            <q-item-tile sublabel>Quantidade: {{ item.quantidade }}</q-item-tile>
            <q-item-tile v-show="item.requerfoto == 'S'" label color="negative">Necessário tirar foto</q-item-tile>
          </q-item-main>
          <q-item-side>
            <q-btn round color="primary" icon="photo_camera" @click.native="tirarFoto(item)"/>
          </q-item-side>
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
      motivoRetorno: null
    }
  },
  methods: {
    entregas () {
    },
    tirarFoto (item) {
      this.$uiUtil.gotoPage(this, 'midias')
    }
  }
}
</script>
