<template>
  <!--<q-page class="flex flex-center">-->
  <q-page padding class="row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <div id="map"></div>
    </div>
  </q-page>
</template>

<style>
#map {
    height: 100%;
    width: 100%;
}
</style>

<script>
export default {
  name: 'PageEntregaRota',
  data () {
    return {
      currentPosition: {
        latitude: 0,
        longitude: 0
      }
    }
  },
  created () {
  },
  async mounted () {
    await this.$google()
    this.$nextTick(function () {
      this.getMapLocation()
    })
  },
  methods: {
    getMapLocation () {
      const vm = this
      vm.$q.loading.show()

      if (window.cordova) {
        cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
          if (!enabled) {
            cordova.plugins.diagnostic.switchToLocationSettings()
          }
        }, function (error) {
          console.log(error)
          vm.$uiUtil.showErrorMessage('Não foi possível obter a informação sobre geolocalização')
        })
      }

      navigator.geolocation.getCurrentPosition(onMapSuccess, onMapError, { enableHighAccuracy: true, timeout: 120000 })

      //  Callback functions
      function onMapSuccess (position) {
        vm.currentPosition.latitude = position.coords.latitude
        vm.currentPosition.longitude = position.coords.longitude
        vm.buildMapRoute()
      }
      function onMapError (error) {
        vm.$q.loading.hide()
        console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n')
        vm.$uiUtil.showErrorMessage('Não foi possível obter a informação sobre geolocalização')
        vm.$router.go(-1)
      }
    },
    buildMapRoute () {
      const vm = this
      var start = new window.google.maps.LatLng(vm.currentPosition.latitude, vm.currentPosition.longitude)

      let end
      if (vm.$store.state.app.entregaAtual.latitudeentrega !== null && vm.$store.state.app.entregaAtual.longitudeentrega !== null) {
        end = new window.google.maps.LatLng(vm.$store.state.app.entregaAtual.latitudeentrega, vm.$store.state.app.entregaAtual.longitudeentrega)
        build(start, end)
      } else {
        var geocoder = new window.google.maps.Geocoder()
        var address = vm.$store.state.app.entregaAtual.address
        geocoder.geocode({'address': address}, function (results, status) {
          if (status === 'OK') {
            let position = results[0].geometry.location
            end = new window.google.maps.LatLng(position.lat(), position.lng())
            build(start, end)
          } else {
            vm.$q.loading.hide()
            vm.$uiUtil.showErrorMessage('Não foi possível obter a informação sobre geolocalização do endereço')
            vm.$router.go(-1)
          }
        })
      }

      function build (start, end) {
        var directionsService = new window.google.maps.DirectionsService()
        var directionsDisplay = new window.google.maps.DirectionsRenderer()

        var mapOptions = {
          center: start
        }

        var map = new window.google.maps.Map(document.getElementById('map'), mapOptions)
        directionsDisplay.setMap(map)

        var request = {
          origin: start,
          destination: end,
          travelMode: 'DRIVING'
        }

        directionsService.route(request, function (result, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(result)
          }
        })

        vm.$q.loading.hide()
      }
    }
  }
}
</script>
