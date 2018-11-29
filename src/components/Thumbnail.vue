<template>
  <div>
    <!--<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" />-->
    <img :src="img" :width="width" :height="height" />
  </div>
</template>

<style lang="stylus">
@import '~variables'
.shadow-box
  margin 10px
  border-radius 5%
  border 1px solid
</style>

<script>
export default {
  props: {
    img: String,
    width: {
      type: Number,
      default: 50
    },
    height: {
      type: Number,
      default: 50
    }
  }
}
</script>
