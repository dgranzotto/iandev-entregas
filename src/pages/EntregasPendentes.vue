<template>
  <entregas :data-list="getPendentes()" />
</template>

<script>
import Entregas from 'components/Entregas'
import { mapGetters } from 'vuex'

export default {
  components: {
    Entregas
  },
  name: 'PageEntregasPendentes',
  computed: {
    ...mapGetters('app', [ 'getPendentes' ])
  }
}
</script>
