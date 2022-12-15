<template>
  <q-page
    padding
    class="row justify-center"
  >
    <div style="width: 500px; max-width: 90vw; margin-top: 50px;">
      <div class="row">
        <div class="auto">
          <q-btn
            rounded
            color="primary"
            icon="sync"
            label="Sincronizar"
            size="md"
            class="q-my-md"
            @click="salvarOcorrencias"
          />
        </div>
        <div
          class="auto"
          style="margin-top: 14px; position: relative; top: 28px; left: 26%; transform: translate(-50%, -50%);"
        >
          <span :class="dateClass">
            <small>Última atualização em<br></small>
            <small><strong>{{ $moment($store.state.app.entregasInfo.entregasLastSync).format(`DD/MM/YYYY [às] HH:mm`) }}</strong></small>
          </span>
        </div>
      </div>
      <q-item-separator style="margin-top:0px; margin-bottom: -5px;"/>
      <div
          class="auto"
          style="margin-top: 14px;"
        >
          <span>
            <small>Ordenação</small>
          </span>
      </div>
      <div style="position: relative;" class="row justify-center">
        <q-btn
            rounded
            color="primary"
            label="Destino"
            :icon="currentSort.type === 'C' && currentSort.asc ? 'keyboard_arrow_down' : currentSort.type === 'C' && !currentSort.asc ? 'keyboard_arrow_up' : ''"
            class="q-my-md"
            style="font-size: 10px; margin-right:5px;"
            @click="orderList('C')"
        />
        <q-btn
            rounded
            color="primary"
            label="Nota Fiscal"
            :icon="currentSort.type === 'N' && currentSort.asc ? 'keyboard_arrow_down' : currentSort.type === 'N' && !currentSort.asc ? 'keyboard_arrow_up' : ''"
            class="q-my-md"
            style="font-size: 10px; margin-right:5px;"
            @click="orderList('N')"
        />
        <q-btn
            rounded
            color="primary"
            label="Data"
            :icon="currentSort.type === 'D' && currentSort.asc ? 'keyboard_arrow_down' : currentSort.type === 'D' && !currentSort.asc ? 'keyboard_arrow_up' : ''"
            class="q-my-md"
            style="font-size: 10px; margin-right:5px;"
            @click="orderList('D')"
        />
      </div>
      <q-item-separator style="margin-top:0px; margin-bottom: -5px;"/>
      <q-field icon="search">
        <q-input
          v-model="filter"
          float-label="Buscar por"
          clearable
        />
      </q-field>
      <q-scroll-area style="height: calc(100vh - 270px); max-height: calc(100vh - 270px); padding-top: 5px;">
        <q-list
          no-border
          striped
        >
          <q-item
            class="itens"
            v-for="(item, index) in dataList.filter(data => !this.filter || data.descricao.toLowerCase().includes(this.filter.toLowerCase()) || data.subdescricao.toLowerCase().includes(this.filter.toLowerCase()))"
            :key="index"
            @click.native="realizarEntrega(item)"
          >
            <q-item-main>
              <q-item-tile overline style="font-size: 16px;">{{ item.descricao }}</q-item-tile>
              <q-item-tile sublabel>{{ item.subdescricao }}</q-item-tile>
            </q-item-main>
            <q-item-side
              v-if="item.sync === 'true' && isNaoPendente(item)"
              class="info-icon"
              right
              icon="sync"
              color="green"
            />
            <q-item-side
              v-if="item.sync === 'false' && isNaoPendente(item)"
              class="info-icon"
              right
              icon="sync_disabled"
              color="orange"
            />
            <q-item-side
              v-if="isRealizada(item)"
              class="info-icon"
              right
              icon="check"
              color="green"
            />
            <q-item-side
              v-if="isRetorno(item)"
              class="info-icon"
              right
              icon="check"
              color="orange"
            />
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
.q-list-striped > .q-item:nth-child(even) {
    background-color: rgb(0 157 195 / 19%)!important;
}
</style>

<script>
import bo from '../bo/entrega-bo'
import entregaServices from '../services/entrega-services'
import { mapGetters } from 'vuex'
import store from '../store'

export default {
  props: {
    dataList: Array,
    sourcePage: String
  },
  data () {
    return {
      filter: '',
      currentSort: {
        type: 'C',
        asc: true
      }
    }
  },
  methods: {
    salvarOcorrencias () {
      entregaServices.saveOcorrenciasStart((count) => {
        if (count > 0 && store.state.session.userPrefs.statusButton) {
          this.$uiUtil.showSuccessMessage(bo.getDescEnvioOcorrenciasServer(count))
        } else if (count < 0) {
          this.$uiUtil.showErrorMessage(bo.getDescEnvioOcorrenciasServer(count))
        }
        if (count >= 0 && store.state.session.userPrefs.statusButton) {
          console.log('Buscando entregas no servidor...')
          this.$nextTick(function () {
            setTimeout(() => {
              this.$store.dispatch('app/getEntregas')
                .then(response => {
                  console.log('Entregas atualizadas a partir do servidor com sucesso')
                  this.$uiUtil.showSuccessMessage('Entregas atualizadas a partir do servidor com sucesso')
                })
            }, 500)
          })
        }
      }, (err) => {
        this.$uiUtil.showErrorMessage('Error ao enviar ocorrências ao servidor', err)
      })
    },
    orderList (sort) {
      if (this.currentSort.type === sort) {
        this.currentSort.asc = !this.currentSort.asc
      } else {
        this.currentSort.asc = true
      }
      this.currentSort.type = sort
      switch (sort) {
        case 'C':
          if (this.currentSort.asc) {
            this.dataList.sort((a, b) => (a.nomecliente > b.nomecliente) ? 1 : ((b.nomecliente > a.nomecliente) ? -1 : 0))
          } else {
            this.dataList.sort((a, b) => (b.nomecliente > a.nomecliente) ? 1 : ((a.nomecliente > b.nomecliente) ? -1 : 0))
          }
          break
        case 'N':
          if (this.currentSort.asc) {
            this.dataList.sort((a, b) => b.notafiscal - a.notafiscal)
          } else {
            this.dataList.sort((a, b) => a.notafiscal - b.notafiscal)
          }
          break
        case 'D':
          if (this.currentSort.asc) {
            this.dataList.sort((a, b) => new Date(b.datamovimento) - new Date(a.datamovimento))
          } else {
            this.dataList.sort((a, b) => new Date(a.datamovimento) - new Date(b.datamovimento))
          }
          break
      }
      let auxfilter = this.filter
      this.filter = null
      this.filter = auxfilter
    },
    realizarEntrega (entregaAtual) {
      this.$store.commit('app/setEntregaAtual', entregaAtual)
      this.$uiUtil.gotoPage(this, 'entrega')
    }
  },
  computed: {
    ...mapGetters('app', ['isRealizada', 'isRetorno', 'isNaoPendente']),
    dateClass () {
      return bo.isToday(this.$store.state.app.entregasInfo.entregasLastSync) ? '' : 'text-negative'
    }
  }
}
</script>
