<template>
  <!--<q-page class="flex flex-center">-->
  <q-page padding class="row justify-center">
    <div style="width: 500px; max-width: 90vw;">
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
// import db from '../db/db'

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
