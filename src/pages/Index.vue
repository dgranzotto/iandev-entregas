<template>
  <q-page class="flex flex-center">
    <!--<img alt="Quasar logo" src="~assets/quasar-logo-full.svg">-->
    <div class="row justify-center">
      <div class="col-xs-12">
        <img
          alt="App Logo"
          src="~assets/images/iandev-entregas.png"
          style="max-width: 80vw;"
        />
      </div>
    </div>
    <div class="row justify-center">
      <div class="col-xs-12 q-pa-sm">
        <q-btn
          rounded
          color="primary"
          icon="local_shipping"
          label="Todas as Entregas"
          size="lg"
          class="full-width q-my-md"
          @click="entregas"
        />
      </div>
      <div class="row">
        <div
          class="col"
          style="width: 33%"
        >
          <q-card
            class="bigger q-ma-xs"
            @click.native="entregasRealizadas"
          >
            <q-card-title class="relative-position">
              <div class="text-faded xs-size">Realizadas</div>
            </q-card-title>
            <q-card-main>
              <q-knob
                disable
                :min="0"
                :max="9999999"
                color="green"
                size="80px"
                line-width="3px"
              >
                <div class="s-size">{{ getNumRealizadas() }}</div>
              </q-knob>
            </q-card-main>
          </q-card>
        </div>
        <div
          class="col"
          style="width: 33%"
        >
          <q-card
            class="bigger q-ma-xs"
            @click.native="entregasRetornos"
          >
            <q-card-title class="relative-position">
              <div class="text-faded xs-size">Retornos</div>
            </q-card-title>
            <q-card-main>
              <q-knob
                disable
                :min="0"
                :max="9999999"
                color="orange"
                size="80px"
                line-width="3px"
              >
                <div class="s-size">{{ getNumRetornos() }}</div>
              </q-knob>
            </q-card-main>
          </q-card>
        </div>
        <div
          class="col"
          style="width: 33%"
        >
          <q-card
            class="bigger q-ma-xs"
            @click.native="entregasPendentes"
          >
            <q-card-title class="relative-position">
              <div class="text-faded xs-size">Pendentes</div>
            </q-card-title>
            <q-card-main>
              <q-knob
                disable
                :min="0"
                :max="9999999"
                color="red"
                size="80px"
                line-width="3px"
              >
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
      this.$uiUtil.gotoPage(this, 'entregas')
    },
    entregasRealizadas () {
      this.$uiUtil.gotoPage(this, 'entregasrealizadas')
    },
    entregasRetornos () {
      this.$uiUtil.gotoPage(this, 'entregasretornos')
    },
    entregasPendentes () {
      this.$uiUtil.gotoPage(this, 'entregaspendentes')
    }
  },
  computed: {
    ...mapGetters('app', ['getNumRealizadas', 'getNumRetornos', 'getNumPendentes', 'getNaoPendentes'])
  }
}
</script>
