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
          <q-item-side v-if="item.sync === 'false' && isNaoPendente(item)" class="info-icon" right icon="sync_disabled" color="orange" />
          <q-item-side v-if="isRealizada(item)" class="info-icon" right icon="check" color="green" />
          <q-item-side v-if="isRetorno(item)" class="info-icon" right icon="check" color="orange" />
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<style>
.itens .info-icon {
  margin: 0 !important;
  min-width: 0 !important;
  text-align: right;
}
</style>

<script>
// import db from '../db/db'
import { mapGetters } from 'vuex'

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
  },
  computed: {
    ...mapGetters('app', [ 'isRealizada', 'isRetorno', 'isNaoPendente' ])
  },
  mounted () {
    // db.createDB()
    // db.transaction((tx) => {
    //   db.entregaExists({ idcargaentrega: 111, idsaidaorigem: 12 }, tx, (exists) => {
    //     console.log('--entregaExists 1/12: ' + exists)
    //   }, (error) => {
    //     console.log('--entregaExists error:' + JSON.stringify(error))
    //   })
    //   db.entregaExists({ idcargaentrega: 1111111, idsaidaorigem: 12 }, tx, (exists) => {
    //     console.log('--entregaExists 1111111/12: ' + exists)
    //   }, (error) => {
    //     console.log('--entregaExists error:' + JSON.stringify(error))
    //   })
    //   db.getEntregas(tx, (entregas) => {
    //     console.log('--getEntregas: ')
    //     console.log(entregas)
    //   }, (error) => {
    //     console.log('--getEntregas error:' + JSON.stringify(error))
    //   })
    // }, (error) => {
    //   console.log('--Transaction ERROR: ' + error.message)
    // }, () => {
    //   console.log('--Transaction OK')
    // })
  }
}
</script>
