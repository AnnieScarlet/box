<template>
	<div id="media-view" v-if="media_view_data">
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
  }
}
</script>

<style>
#media-view img {
	width: 100%;
}
</style>
