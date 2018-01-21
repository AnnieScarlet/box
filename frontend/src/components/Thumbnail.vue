<template>
  <div class="thumb-wrapper">
    <img v-bind:width="width" v-bind:height="height" v-bind:style="styleObject" v-bind:src="url" v-on:load="onLoad" />
  </div>
</template>

<script>
import consts from '@/constants'

export default {
  props: ['url', 'rect'],
  data () {
    return {
      width: 0,
      height: 0
    }
  },
  computed: {
    styleObject () {
      return this.resolvedRect && {
        left: `-${parseInt(this.resolvedRect.x)}px`,
        top: `-${parseInt(this.resolvedRect.y)}px`
      }
    },
    resolvedRect () {
      if (this.rect) {
        return {
          x: this.rect.min.x * this.width,
          y: this.rect.min.y * this.height
        }
      } else {
        return {
          x: (this.width - consts.THUMBNAIL_BOX_SIZE.WIDTH) * 0.5,
          y: (this.height - consts.THUMBNAIL_BOX_SIZE.HEIGHT) * 0.5
        }
      }
    }
  },
  methods: {
    onLoad (e) {
      let img = e.path[0]
      {
        // サムネイル画像サイズの調整
        let scale = consts.THUMBNAIL_MAX_SIZE / Math.max(img.naturalWidth, img.naturalHeight)
        scale = Math.max(scale, Math.min(consts.THUMBNAIL_BOX_SIZE.WIDTH, consts.THUMBNAIL_BOX_SIZE.HEIGHT) / Math.min(img.naturalWidth, img.naturalHeight))
        this.width = parseInt(img.naturalWidth * scale)
        this.height = parseInt(img.naturalHeight * scale)
      }
      if (this.rect) {
        // サムネイル表示矩形の調整
        let scale = consts.THUMBNAIL_BOX_SIZE.WIDTH / (this.width * (this.rect.max.x - this.rect.min.x))
        this.width = this.width * scale
        this.height = this.height * scale
      }
    }
  }
}
</script>

<style scoped>
.thumb-wrapper {
  width: 200px;
  height: 200px;
  overflow: hidden;
  position: relative;
}
.thumb-wrapper img {
  position: relative;
}
</style>
