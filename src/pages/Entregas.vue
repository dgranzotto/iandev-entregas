<template>
  <entregas :data-list="$store.state.app.entregas" />
</template>

<script>
import Entregas from 'components/Entregas'

export default {
  components: {
    Entregas
  },
  name: 'PageEntregas'
}
</script>
