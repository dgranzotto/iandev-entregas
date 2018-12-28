<template>
  <q-page padding class="row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <div class="row">
        <div class="auto">
          <q-btn rounded color="primary" icon="sync" label="Sincronizar" size="md" class="q-my-md" @click="salvarOcorrencias" />
        </div>
        <div class="auto" style="margin-top: 14px; margin-left: 10px;">
          <span :class="dateClass">
            <small>Última atualização em<br></small>
            <small><strong>{{ $moment($store.state.app.entregasInfo.entregasLastSync).format(`DD/MM/YYYY [às] HH:mm`) }}</strong></small>
          </span>
        </div>
      </div>
      <q-item-separator />
      <q-scroll-area style="height: 75vh; max-height: 75vh;">
        <q-list no-border striped>
          <q-item class="itens" v-for="(item, index) in dataList" :key="index" @click.native="realizarEntrega(item)">
            <q-item-main>
              <q-item-tile label>{{ item.descricao }}</q-item-tile>
              <q-item-tile sublabel>{{ item.subdescricao }}</q-item-tile>
            </q-item-main>
            <q-item-side v-if="item.sync === 'true' && isNaoPendente(item)" class="info-icon" right icon="sync" color="green" />
            <q-item-side v-if="item.sync === 'false' && isNaoPendente(item)" class="info-icon" right icon="sync_disabled" color="orange" />
            <q-item-side v-if="isRealizada(item)" class="info-icon" right icon="check" color="green" />
            <q-item-side v-if="isRetorno(item)" class="info-icon" right icon="check" color="orange" />
          </q-item>
        </q-list>
      </q-scroll-area>
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
import bo from '../bo/entrega-bo'
import entregaServices from '../services/entrega-services'
import { mapGetters } from 'vuex'

export default {
  props: {
    dataList: Array,
    sourcePage: String
  },
  data () {
    return {
    }
  },
  methods: {
    salvarOcorrencias () {
      entregaServices.saveOcorrenciasStart((count) => {
        if (count > 0) {
          this.$uiUtil.showSuccessMessage(bo.getDescEnvioOcorrenciasServer(count))
        } else if (count < 0) {
          this.$uiUtil.showErrorMessage(bo.getDescEnvioOcorrenciasServer(count))
        }
        if (count >= 0) {
          console.log('Buscando entregas no servidor...')
          this.$store.dispatch('app/getEntregas')
            .then(response => {
              console.log('Entregas atualizadas a partir do servidor com sucesso')
              this.$uiUtil.showSuccessMessage('Entregas atualizadas a partir do servidor com sucesso')
            })
        }
      }, (err) => {
        this.$uiUtil.showErrorMessage('Error ao enviar ocorrências ao servidor', err)
      })
    },
    realizarEntrega (entregaAtual) {
      this.$store.commit('app/setEntregaAtual', entregaAtual)
      this.$uiUtil.gotoPage(this, 'entrega')
    }
  },
  computed: {
    ...mapGetters('app', [ 'isRealizada', 'isRetorno', 'isNaoPendente' ]),
    dateClass () {
      return bo.isToday(this.$store.state.app.entregasInfo.entregasLastSync) ? '' : 'text-negative'
    }
  }
}
</script>
