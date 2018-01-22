<template>
  <form v-on:submit.prevent="submit" v-if="thumb_url">
    <div>
      <div class="thumbnail">
        <CanvasWrapper v-bind:url="thumb_url" v-bind:width="width" v-bind:height="height" v-bind:updateRect="updateRect" />
        <Thumbnail v-bind:url="thumb_url" v-bind:rect="thumb_rect" />
      </div>
    </div>
    <div>
      <input type="text" name="title" v-model="title" placeholder="title" />
    </div>
    <div>
      <textarea name="description" v-model="description" placeholder="description"></textarea>
    </div>
    <button type="submit">Submit</button>
  </form>
</template>

<script>
import consts from '@/constants'
import api from '@/api'
import Thumbnail from '@/components/Thumbnail'

if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: (callback, type, quality) => {
      let binStr = atob(this.toDataURL(type, quality).split(',')[1])
      let len = binStr.length
      let arr = new Uint8Array(len)

      for (var i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i)
      }

      callback(new Blob([arr], {type: type || 'image/png'}))
    }
  })
}

const CanvasWrapper = {
  template: '<canvas v-bind:width="width" v-bind:height="height" v-bind:style="styleObject" v-on:mousedown="onMouseDown($event)" v-on:mouseup="onMouseUp($event)" v-on:mousemove="onMouseMove($event)"></canvas>',
  props: ['url', 'width', 'height', 'updateRect'],
  computed: {
    styleObject () {
      return {
        backgroundImage: `url(${this.url})`,
        backgroundSize: '100%'
      }
    }
  },
  mounted () {
    this._ctx = this.$el.getContext('2d')
    this._ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
    this._ctx.strokeStyle = 'red'

    // デフォルト矩形の起点
    let pivot = {
      x: parseInt((this.width - consts.THUMBNAIL_BOX_SIZE.WIDTH) / 2),
      y: parseInt((this.height - consts.THUMBNAIL_BOX_SIZE.HEIGHT) / 2)
    }

    this._begin_point = {x: 0, y: 0}
    this._current_rect = {
      min: {x: pivot.x, y: pivot.y},
      max: {x: pivot.x + consts.THUMBNAIL_BOX_SIZE.WIDTH, y: pivot.y + consts.THUMBNAIL_BOX_SIZE.HEIGHT}
    }

    this.draw()
  },
  methods: {
    // 矩形の値を 0 ~ 1.0 の値にして返す
    getRect () {
      return {
        min: {x: this._current_rect.min.x / this.width, y: this._current_rect.min.y / this.height},
        max: {x: this._current_rect.max.x / this.width, y: this._current_rect.max.y / this.height}
      }
    },
    // canvas の左上 を起点としたカーソル位置を返す
    getPoint (e) {
      return {
        x: (window.pageXOffset + e.clientX) - this.$el.offsetLeft,
        y: (window.pageYOffset + e.clientY) - this.$el.offsetTop
      }
    },
    // canvas からはみ出た矩形の位置を解決する
    resolveRect () {
      if (this._current_rect.min.x < 0) {
        this._current_rect.max.x -= this._current_rect.min.x
        this._current_rect.min.x = 0
      }
      if (this._current_rect.min.y < 0) {
        this._current_rect.max.y -= this._current_rect.min.y
        this._current_rect.min.y = 0
      }
      if (this._current_rect.max.x > this.width) {
        this._current_rect.min.x -= this._current_rect.max.x - this.width
        this._current_rect.max.x = this.width
      }
      if (this._current_rect.max.y > this.height) {
        this._current_rect.min.y -= this._current_rect.max.y - this.height
        this._current_rect.max.y = this.height
      }
    },
    // 矩形のスケールを変更
    setScale (scale) {
      if (this.width * scale < consts.THUMBNAIL_BOX_SIZE.WIDTH) {
        scale = consts.THUMBNAIL_BOX_SIZE.WIDTH / this.width
      }
      if (this.height * scale < consts.THUMBNAIL_BOX_SIZE.HEIGHT) {
        scale = consts.THUMBNAIL_BOX_SIZE.HEIGHT / this.height
      }
      let size = {w: this._current_rect.max.x - this._current_rect.min.x, h: this._current_rect.max.y - this._current_rect.min.y}
      let pivot = {x: this._current_rect.min.x + size.w / 2, y: this._current_rect.min.y + size.h / 2}
      let x = consts.THUMBNAIL_BOX_SIZE.WIDTH * (1.0 / scale) / 2
      let y = consts.THUMBNAIL_BOX_SIZE.HEIGHT * (1.0 / scale) / 2
      this._current_rect = {
        min: {x: pivot.x - x, y: pivot.y - y},
        max: {x: pivot.x + x, y: pivot.y + y}
      }
      this.resolveRect()
    },
    onMouseDown (e) {
      if (this._dragging) {
        return
      }

      let { x, y } = this.getPoint(e)

      if (this._current_rect.min.x <= x && x <= this._current_rect.max.x &&
          this._current_rect.min.y <= y && y <= this._current_rect.max.y) {
        this._dragging = true
        this._begin_point = {x: x - this._current_rect.min.x, y: y - this._current_rect.min.y}
      }
    },
    onMouseUp (e) {
      this._dragging = false
    },
    onMouseMove (e) {
      if (!this._dragging) {
        return
      }

      let { x, y } = this.getPoint(e)

      let p = {
        x: x - this._begin_point.x,
        y: y - this._begin_point.y
      }
      this._current_rect = {
        min: p,
        max: {
          x: this._current_rect.max.x - (this._current_rect.min.x - p.x),
          y: this._current_rect.max.y - (this._current_rect.min.y - p.y)
        }
      }

      // canvas 外へは矩形を移動しない
      if (this._current_rect.min.x < 0) {
        this._begin_point.x = x
      }
      if (this._current_rect.max.x > this.width) {
        this._begin_point.x = x - (this.width - (this._current_rect.max.x - this._current_rect.min.x))
      }
      if (this._current_rect.min.y < 0) {
        this._begin_point.y = y
      }
      if (this._current_rect.max.y > this.height) {
        this._begin_point.y = y - (this.height - (this._current_rect.max.y - this._current_rect.min.y))
      }

      this.resolveRect()
      this.draw()
    },
    draw () {
      this._ctx.clearRect(0, 0, this.width, this.height)
      this._ctx.fillRect(0, 0, this.width, this.height)
      this._ctx.clearRect(this._current_rect.min.x, this._current_rect.min.y, this._current_rect.max.x - this._current_rect.min.x, this._current_rect.max.y - this._current_rect.min.y)
      this._ctx.strokeRect(this._current_rect.min.x, this._current_rect.min.y, this._current_rect.max.x - this._current_rect.min.x, this._current_rect.max.y - this._current_rect.min.y)
      this.updateRect(this.getRect())
    }
  }
}

export default {
  components: { Thumbnail, CanvasWrapper },
  props: ['file'],
  data () {
    return {
      width: 0,
      height: 0,
      thumb_url: null,
      thumb_rect: null,
      title: null,
      description: null
    }
  },
  mounted () {
    this.reset()

    let vm = this
    let reader = new FileReader()
    reader.readAsDataURL(this.file)
    reader.onload = async () => {
      let img = new Image()
      img.src = reader.result
      img.onload = async () => {
        let { width, height } = this.resolveSize(img.width, img.height, consts.THUMBNAIL_MAX_SIZE, consts.THUMBNAIL_MAX_SIZE)

        vm.width = width
        vm.height = height

        vm._img_data = await this.resize(img, consts.IMAGE_MAX_SIZE)
        vm._img_url = URL.createObjectURL(vm._img_data)
        vm.thumb_url = vm._img_url
      }
    }
  },
  methods: {
    updateRect (rect) {
      this.thumb_rect = rect
    },
    reset () {
      this._img_data = null
      if (this._img_url) {
        URL.revokeObjectURL(this._img_url)
      }
    },
    resolveSize (width, height, max, min) {
      let calc = (exp, ratio) => {
        let r = ratio(exp(width, height))
        width *= r
        height *= r
      }
      if (max) {
        calc(Math.max, (x) => x > max ? max / x : 1)
      }
      if (min) {
        calc(Math.min, (x) => x < min ? min / x : 1)
      }
      return { width, height }
    },
    async resize (src, max, tmp) {
      let { width, height } = this.resolveSize(src.width, src.height, max)
      tmp = tmp || document.createElement('canvas')
      let ctx = tmp.getContext('2d')

      // 急激に縮小するとかなりギザる
      // if (width / src.width <= 0.5) {
      //   tmp.width = src.width * 0.5
      //   tmp.height = src.height * 0.5
      //   ctx.drawImage(src, 0, 0, tmp.width, tmp.height)
      //   return await this.resize(tmp, max, src.getContext && src)
      // }

      tmp.width = width
      tmp.height = height
      ctx.drawImage(src, 0, 0, width, height)

      return new Promise((resolve, reject) => {
        tmp.toBlob(resolve, 'image/jpeg', consts.IMAGE_QUALITY)
      })
    },
    submit (e) {
      let data = new FormData()
      data.append('title', this.title)
      data.append('description', this.description)
      data.append('file', this._img_data)
      api.postMediaData(data)
    }
  },
  destroyed () {
    this.reset()
  }
}
</script>

<style>
</style>
