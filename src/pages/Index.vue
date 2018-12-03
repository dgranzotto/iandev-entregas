<template>
  <q-page class="flex flex-center">
    <!--<img alt="Quasar logo" src="~assets/quasar-logo-full.svg">-->
    <div class="row justify-center">
      <div class="col-xs-12">
        <img alt="App Logo" src="~assets/images/iandev-entregas.png" />
      </div>
    </div>
    <div class="row justify-center">
      <div class="col-xs-12 q-pa-sm">
        <q-btn rounded color="primary" icon="local_shipping" label="Entregas" size="lg" class="full-width q-my-md" @click="entregas" />
      </div>
      <div class="row justify-center">
        <div class="col-xs-6">
        <q-card inline class="bigger q-ma-sm">
          <q-card-title class="relative-position">
            <div class="text-faded s-size">Realizadas</div>
          </q-card-title>
          <q-card-main>
            <q-knob v-model="getNumRealizadas" :min="0" :max="$store.state.app.entregas.length" color="positive" size="80px" line-width="3px" >
              <div class="s-size">{{ getNumRealizadas }}</div>
            </q-knob>
          </q-card-main>
         </q-card>
        </div>
        <div class="col-xs-6">
          <q-card inline class="bigger q-ma-sm">
            <q-card-title class="relative-position">
              <div class="text-faded s-size">Pendentes</div>
            </q-card-title>
            <q-card-main>
              <q-knob v-model="getNumRetornos" :min="0" :max="$store.state.app.entregas.length" color="negative" size="80px" line-width="3px" >
                <div class="s-size">{{ getNumRetornos }}</div>
              </q-knob>
            </q-card-main>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import entregaServices from '../services/entrega-services'
import { mapGetters } from 'vuex'

export default {
  name: 'PageIndex',
  data () {
    return {
    }
  },
  methods: {
    entregas () {
      this.$uiUtil.gotoPage(this, 'entregas')
    }
  },
  computed: {
    ...mapGetters('app', [ 'getNumRealizadas', 'getNumRetornos' ])
  },
  created () {
    console.log('Index.vue created')
    console.log('syncEntregas()')
    entregaServices.syncEntregas()
  }
}
</script>
