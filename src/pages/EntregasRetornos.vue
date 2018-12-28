<template>
  <entregas :data-list="getRetornos()" />
</template>

<script>
import Entregas from 'components/Entregas'
import { mapGetters } from 'vuex'

export default {
  components: {
    Entregas
  },
  name: 'PageEntregasRetornos',
  computed: {
    ...mapGetters('app', [ 'getRetornos' ])
  }
}
</script>
