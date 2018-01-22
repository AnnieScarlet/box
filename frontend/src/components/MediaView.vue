<template>
  <div class="view" v-if="media_view_data" v-on:click.prevent="onClose">
    Media {{ media_view_data }}
    <img v-bind:src="media_url" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'media-view',
  computed: {
    ...mapState('MediaView', {
      media_view_data: 'media_view_data'
    }),
    ...mapGetters('MediaView', {
      media_url: 'getMediaUrl'
    })
  },
  methods: {
    onClose () {
      this.$router.go(-1)
      this.$store.commit('MediaView/setData', null)
    }
  }
}
</script>

<style scoped>
.view {
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.8);
  color: #ffffff;
}
.view img {
  width: 100%;
}
</style>
