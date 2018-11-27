<template>
  <q-page class="flex flex-center">
    <div style="width: 500px; max-width: 90vw;">
      <div class="q-headline">IANDev Entregas</div>
      <q-field label="Versão">
        <q-input readonly v-model="version" />
      </q-field>
    </div>
    <img alt="Quasar logo" src="~assets/quasar-logo-full.svg">
    <p class="caption">&copy; Copyright 2009-2018&nbsp;&nbsp;&nbsp;IANDev Sistemas</p>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageAbout',
  data () {
    return {
      version: '18.10.25'
    }
  }
}
</script>
