<template>
	<div id="index">
		Index <br>
		route name: {{ $route.name }}<br>
		route path: {{ $route.path }}<br>
		route params: {{ $route.params[0] }}<br>

		<div class="thumb" v-for="media in media_list" v-on:click="selectMedia(media)">
			<img v-bind:src="getThumbnailUrl(media)" />
		</div>
		<div class="clear"/>
	</div>
</template>

<script>
import consts from '@/constants'

// 仮データ
const photos = [
  'ffxiv_20171126_152637',
  'ffxiv_20171126_152841',
  'ffxiv_20171126_153353',
  'ffxiv_20171126_153556',
  'ffxiv_20171126_153716',
  'ffxiv_20171126_153716_',
  'ffxiv_20171126_153824',
  'ffxiv_20171126_154146',
  'ffxiv_20171126_154618',
  'ffxiv_20171126_155042',
  'ffxiv_20171126_155049',
  'ffxiv_20171128_012111',
  'ffxiv_20171129_000925',
  'ffxiv_20171129_001104'
]

export default {
  name: 'index',
  data: () => {
    return {
      media_list: []
    }
  },
  methods: {
    getThumbnailUrl (mediaData) {
      return consts.static_url + mediaData.id + '.png'
    },
    selectMedia (mediaData) {
      this.$router.push({name: 'index-view', params: {type: 'photo', id: mediaData.id}})
      this.$store.commit('MediaView/setData', mediaData)
    }
  },
  mounted () {
    if (this.$route.name === 'index-view') {
      this.$store.commit('MediaView/setData', { id: this.$route.params.id })
    }

    // リストを作る
    let mediaList = []
    photos.forEach((x) => mediaList.push({ id: x }))
    this.media_list = mediaList
  }
}
</script>

<style>
#index .thumb {
	float: left;
}
#index .clear {
	clear: both;
}
#index .thumb img {
	width: 100px;
}
</style>
