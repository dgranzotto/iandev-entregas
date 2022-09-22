<template>
  <q-page class="flex flex-center">
    <div style="width: 500px; max-width: 90vw; margin-top:40px!important;">
      <div class="q-headline">IANDev Entregas</div>
      <q-field label="Versão">
        <q-input
          readonly
          v-model="version"
        />
      </q-field>
    </div>
    <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
    <img
      alt="App Logo"
      src="~assets/images/iandev-entregas.png"
      style="max-width: 80vw;"
    />
    <p class="caption">&copy; Copyright 2009-2022&nbsp;&nbsp;&nbsp;IANDev Sistemas</p>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageAbout',
  data () {
    return {
      version: '22.09.21'
    }
  }
}
</script>
