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
  async mounted () {
    await this.$google()
    this.$nextTick(function () {
      this.getMapLocation()
    })
  },
  methods: {
    getMapLocation () {
      const vm = this

      navigator.geolocation.getCurrentPosition(onMapSuccess, onMapError, { enableHighAccuracy: true })

      //  Callback functions
      function onMapSuccess (position) {
        vm.currentPosition.latitude = position.coords.latitude
        vm.currentPosition.longitude = position.coords.longitude
        vm.buildMapRoute()
      }
      function onMapError (error) {
        console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n')
      }
    },
    buildMapRoute () {
      var directionsService = new window.google.maps.DirectionsService()
      var directionsDisplay = new window.google.maps.DirectionsRenderer()

      var start = new window.google.maps.LatLng(this.currentPosition.latitude, this.currentPosition.longitude)

      var end
      if (this.$store.state.app.entregaAtual.latitudeentrega !== null || this.$store.state.app.entregaAtual.longitudeentrega !== null) {
        end = new window.google.maps.LatLng(this.$store.state.app.entregaAtual.latitudeentrega, this.$store.state.app.entregaAtual.longitudeentrega)
      } else {
        var geocoder = new window.google.maps.Geocoder()
        var address = this.$store.state.app.entregaAtual.address
        geocoder.geocode({'address': address}, function (results, status) {
          if (status === 'OK') {
            let position = results[0].geometry.location
            console.log(position)
            end = new window.google.maps.LatLng(position.lat, position.lng)
          } else {
            alert('Geocode was not successful for the following reason: ' + status)
          }
        })
      }

      var mapOptions = {
        zoom: 7,
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
    }
  }
}
</script>
