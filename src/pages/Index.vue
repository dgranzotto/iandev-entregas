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
      <div class="row">
        <div class="col" style="width: 33%">
          <q-card class="bigger q-ma-xs">
            <q-card-title class="relative-position">
              <div class="text-faded xs-size">Realizadas</div>
            </q-card-title>
            <q-card-main>
              <q-knob :min="0" :max="$store.state.app.entregas.length" color="green" size="80px" line-width="3px" >
                <div class="s-size">{{ getNumRealizadas() }}</div>
              </q-knob>
            </q-card-main>
          </q-card>
        </div>
        <div class="col" style="width: 33%">
          <q-card class="bigger q-ma-xs">
            <q-card-title class="relative-position">
              <div class="text-faded xs-size">Retornos</div>
            </q-card-title>
            <q-card-main>
              <q-knob :min="0" :max="$store.state.app.entregas.length" color="orange" size="80px" line-width="3px" >
                <div class="s-size">{{ getNumRetornos() }}</div>
              </q-knob>
            </q-card-main>
          </q-card>
        </div>
        <div class="col" style="width: 33%">
          <q-card class="bigger q-ma-xs">
            <q-card-title class="relative-position">
              <div class="text-faded xs-size">Pendentes</div>
            </q-card-title>
            <q-card-main>
              <q-knob :min="0" :max="$store.state.app.entregas.length" color="red" size="80px" line-width="3px" >
                <div class="s-size">{{ getNumPendentes() }}</div>
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
import { mapGetters } from 'vuex'

export default {
  name: 'PageIndex',
  data () {
    return {
    }
  },
  methods: {
    entregas () {
      console.log(JSON.stringify(this.getNaoPendentes()))
      this.$uiUtil.gotoPage(this, 'entregas')
    }
  },
  computed: {
    ...mapGetters('app', [ 'getNumRealizadas', 'getNumRetornos', 'getNumPendentes', 'getNaoPendentes' ])
  }
}
</script>
