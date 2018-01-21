<template>
  <div id="index">
    Index <br>
    route name: {{ $route.name }}<br>
    route path: {{ $route.path }}<br>
    route params: {{ $route.params[0] }}<br>

    <Thumbnail class="thumbnail" v-for="post in posts" v-bind:url="getThumbnailUrl(post)" v-bind:rect="post.thumb_rect" v-bind:key="post.id" v-on:click.native="selectMedia(post)" />
    <div class="clear"/>
  </div>
</template>

<script>
import consts from '@/constants'
import api from '@/api'
import Thumbnail from '@/components/Thumbnail'

export default {
  name: 'index',
  components: { Thumbnail },
  data () {
    return {
      posts: []
    }
  },
  methods: {
    getThumbnailUrl (mediaData) {
      return consts.static_url + mediaData.id
    },
    selectMedia (mediaData) {
      this.$router.push({path: `/media/${mediaData.id}`})
      this.$store.commit('MediaView/setData', mediaData)
    }
  },

  beforeCreate () {
     // URL PATH を処理

    if (this.$route.name === 'index-view') {
      // 表示していた投稿があった
      (async () => {
        this.$store.commit('MediaView/setData', { id: this.$route.params[0] })
      })()
    }

    // 投稿リストを作る
    let query = ''

    if (this.$route.name === 'index-search') {
      query = this.$route.params[0]
    }

    (async () => {
      let posts = []
      let {data, error} = await api.getPosts(query)
      if (!error) {
        data.forEach((x) => posts.push({ id: x }))
        this.posts = posts
      }
    })()
  }
}
</script>

<style>
#index .thumbnail {
  float: left;
}
#index .clear {
  clear: both;
}
</style>
