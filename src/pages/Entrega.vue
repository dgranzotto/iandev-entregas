<template>
  <!--<q-page class="flex flex-center">-->
  <q-page padding class="row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <div class="q-headline">Entrega</div>
      <q-field :label="$store.state.app.entregaAtual.descricao"><q-field :label="$store.state.app.entregaAtual.subdescricao"></q-field></q-field>
      <q-btn align="around" v-if="$store.state.app.entregaAtual.address || ($store.state.app.entregaAtual.latitudeentrega && $store.state.app.entregaAtual.longitudeentrega)" rounded color="primary" icon="directions" label="Visualizar Rota" size="md" class="full-width q-my-md" @click="visualizarRota" />
      <q-item-separator />
      <div class="row">
        <div class="col-12" style="font-size:1.2em;">
          <q-toggle @input="onChangeConfirmaEntrega" v-model="confirmaEntrega" checked-icon="check" unchecked-icon="close" left-label color="positive" label="Entrega realizada?" true-value="Sim" false-value="Não"/> {{ confirmaEntrega }}
        </div>
        <div class="col-12">
          <q-btn align="around" rounded size="md" class="full-width q-my-md" color="tertiary" label="Foto do Recibo" icon="photo_camera">
            <q-icon class="l-size" name="check" color="positive" />
            <q-icon class="l-size" name="close" color="negative" />
          </q-btn>
        </div>
      </div>
      <q-select @input="onChangeMotivoRetorno" float-label="Motivo do retorno" inverted-light :color="motivoRetornoColor" separator v-model="motivoRetorno" :options="$store.state.app.motivosRetorno" />
      <!-- <q-select float-label="Selecione o tipo da ocorrência" v-model="motivoRetorno" :options="$store.state.app.motivosRetorno" /> -->
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
      motivoRetorno: null,
      confirmaEntrega: 'Não',
      motivoRetornoColor: 'white'
    }
  },
  methods: {
    entregas () {
    },
    tirarFoto (item) {
      this.$uiUtil.gotoPage(this, 'midias')
    },
    visualizarRota () {
      this.$uiUtil.gotoPage(this, 'entregarota')
    },
    onChangeConfirmaEntrega (newVal) {
      if (newVal === 'Sim') {
        this.motivoRetorno = null
        this.motivoRetornoColor = 'white'
      }
    },
    onChangeMotivoRetorno (newVal) {
      this.motivoRetornoColor = 'red-3'
      if (this.confirmaEntrega === 'Sim') {
        this.confirmaEntrega = 'Não'
      }
    }
  },
  created () {
    console.log(this.$store.entregaAtual)
  }
}
</script>
