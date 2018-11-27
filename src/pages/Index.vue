<template>
  <q-page class="flex flex-center">
    <!--<img alt="Quasar logo" src="~assets/quasar-logo-full.svg">-->
    <img alt="App Logo" src="~assets/images/truck-blue.jpg">
    <div style="width: 500px; max-width: 90vw;">
      <q-btn rounded color="primary" icon="local_shipping" label="Entregas" size="lg" class="full-width q-my-md" @click="entregas" />
      <div class="row justify-center">
        <q-card inline class="bigger q-ma-sm">
          <q-card-title class="relative-position">
            <div class="text-faded s-size">Realizadas</div>
          </q-card-title>
          <q-card-main>
            <q-knob v-model="numRealizadas" :min="0" :max="numEntregas" color="positive" size="80px" line-width="3px" ><div class="s-size">{{ numRealizadas }}</div></q-knob>
          </q-card-main>
        </q-card>
        <q-card inline class="bigger q-ma-sm">
          <q-card-title class="relative-position">
            <div class="text-faded s-size">Pendentes</div>
          </q-card-title>
          <q-card-main>
            <q-knob v-model="numPendentes" :min="0" :max="numEntregas" color="negative" size="80px" line-width="3px" ><div class="s-size">{{ numPendentes }}</div></q-knob>
          </q-card-main>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import entregaServices from '../services/entrega-services'

export default {
  name: 'PageIndex',
  data () {
    return {
      numEntregas: 19,
      numRealizadas: 12,
      numPendentes: 7
    }
  },
  methods: {
    entregas () {
      this.gotoPage('entregas')
    },
    gotoPage (page) {
      this.$router.push({
        name: page
      })
    }
  },
  created () {
    console.log('Index.vue created')
    entregaServices.syncEntregas()
  }
}
</script>
