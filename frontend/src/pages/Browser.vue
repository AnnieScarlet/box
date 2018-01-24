<template>
  <div class="thumbnail-browser" v-on:scroll="onScroll">
    <div id="index-info">
      Index <br>
      route name: {{ $route.name }}<br>
      route path: {{ $route.path }}<br>
      route params: {{ $route.params[0] }}<br>
    </div>

    <div id="index-posts" v-bind:style="styleObject">
      <Thumbnail class="thumbnail" v-for="post in displayItems"
                 v-bind:url="getThumbnailUrl(post)"
                 v-bind:rect="post.thumb_rect"
                 v-bind:key="post.id"
                 v-on:click.native="selectMedia(post)" />
    </div>
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
      posts: [],
      index: 0,
      scroll_y: 0,
      info_height: 0,
      item_size: null,
      visible_size: null
    }
  },
  computed: {
    displayXY () {
      return {
        x: parseInt(this.visible_size.width / this.item_size.width) + 0,
        y: parseInt(this.visible_size.height / this.item_size.height) + 2
      }
    },
    displayItems () {
      if (this.posts.length === 0) {
        return
      }
      if (!this.item_size) {
        return this.posts.slice(0, 10)
      }
      let scroll = this.scroll_y - this.info_height
      if (scroll < 0) {
        scroll = 0
      }
      this.index = parseInt(scroll / this.item_size.height) * this.displayXY.x
      return this.posts.slice(this.index, this.index + this.displayXY.x * this.displayXY.y)
    },
    styleObject () {
      if (!this.item_size) {
        return
      }
      let totalHeight = Math.ceil(this.posts.length / this.displayXY.x) * this.item_size.height
      let scrollHeight = Math.ceil(this.index / this.displayXY.x) * this.item_size.height
      let visibleHeight = this.displayXY.y * this.item_size.height
      return {
        paddingTop: scrollHeight + 'px',
        paddingBottom: (totalHeight - scrollHeight - visibleHeight) + 'px'
      }
    }
  },
  methods: {
    getThumbnailUrl (mediaData) {
      return consts.static_url + mediaData.id
    },
    selectMedia (mediaData) {
      this.$router.push({path: `/media/${mediaData.id}`})
      this.$store.commit('MediaView/setData', mediaData)
    },
    onScroll (e) {
      this.scroll_y = e.target.scrollTop
      if ((e.target.scrollTop + e.target.offsetHeight) >= e.target.scrollHeight) {
        // console.log('end')
      }
    }
  },

  updated () {
    if (!this.item_size) {
      let posts = document.getElementById('index-posts')
      if (posts.children.length > 0) {
        let item = posts.children[0]
        this.item_size = { width: item.offsetWidth, height: item.offsetHeight }
      }
    }
  },
  mounted () {
    this.info_height = document.getElementById('index-info').offsetHeight

    const checkVisibleSize = () => {
      this.visible_size = { width: this.$el.offsetWidth, height: this.$el.offsetHeight }
    }

    window.addEventListener('resize', checkVisibleSize, false)
    checkVisibleSize()
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
        // posts.push({id: data[0]})
        this.posts = posts
      }
    })()
  }
}
</script>

<style scoped>
.thumbnail {
	float: left;
}
.clear {
  clear: both;
}
.thumbnail-browser {
  position: fixed;
  top: 0;
  bottom: 0;
  overflow-y: auto;
  width: 100%;
}
#index-posts {
  width: 100%;
}
</style>
