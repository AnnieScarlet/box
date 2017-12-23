<template>
	<div id="index">
		Index <br>
		route name: {{ $route.name }}<br>
		route path: {{ $route.path }}<br>
		route params: {{ $route.params[0] }}<br>

		<div class="thumb" v-for="post in posts" v-on:click="selectMedia(post)">
			<img v-bind:src="getThumbnailUrl(post)" />
		</div>
		<div class="clear"/>
	</div>
</template>

<script>
import consts from '@/constants'
import api from '@/api'

export default {
  name: 'index',
  data: () => {
    return {
      posts: []
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
    // URL PATH を処理

    if (this.$route.name === 'index-view') {
      // 表示していた投稿があった
      this.$store.commit('MediaView/setData', { id: this.$route.params.id })
    }

    // 投稿リストを作る
    let query = ''

    if (this.$route.name === 'index-search') {
      query = this.$route.params[0]
    }

    (async () => {
      let posts = []
      let response = await api.getPosts(query)
      console.log(response)
      let {data, error} = response
      if (!error) {
        console.log(data)
        console.log(data.forEach)
        console.log(data.length)
        data.forEach((x) => posts.push({ id: x }))
        this.posts = posts
      }
    })()
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
