<template>
  <entregas :data-list="getRealizadas()" />
</template>

<script>
import Entregas from 'components/Entregas'
import { mapGetters } from 'vuex'

export default {
  components: {
    Entregas
  },
  name: 'PageEntregasRealizadas',
  computed: {
    ...mapGetters('app', [ 'getRealizadas' ])
  }
}
</script>
