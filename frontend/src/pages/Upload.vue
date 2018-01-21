<template>
  <div id="upload">
    Upload
    <form v-on:submit.prevent="submit">
      <div>
        <div>
          <canvas class="thumbnail" width="0" height="0"></canvas>
          <Thumbnail class="thumbnail" v-if="thumb_url" v-bind:url="thumb_url" v-bind:rect="thumb_rect" />
        </div>
        <input type="file" name="file" v-on:change="onChangeFile">
      </div>
      <div>
        <input type="text" name="title" v-model="title" placeholder="title" />
      </div>
      <div>
        <textarea name="description" v-model="description" placeholder="description"></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import consts from '@/constants'
import api from '@/api'
import Thumbnail from '@/components/Thumbnail'

class ThumbnailView {
  constructor (canvas, width, height, data, updateRect) {
    this.update_rect = updateRect

    this.width = width
    this.height = height

    // デフォルト矩形の起点
    let pivot = {
      x: parseInt(width / 2 - consts.THUMBNAIL_BOX_SIZE.WIDTH / 2),
      y: parseInt(height / 2 - consts.THUMBNAIL_BOX_SIZE.HEIGHT / 2)
    }

    this.dragging = false
    this.begin_point = {x: 0, y: 0}
    this.current_rect = {
      min: {x: pivot.x, y: pivot.y},
      max: {x: pivot.x + consts.THUMBNAIL_BOX_SIZE.WIDTH, y: pivot.y + consts.THUMBNAIL_BOX_SIZE.HEIGHT}
    }

    let ctx = canvas.getContext('2d')

    canvas.width = width
    canvas.height = height
    canvas.style.backgroundImage = `url("${data}")`
    canvas.style.backgroundSize = '100%'

    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
    ctx.strokeStyle = 'red'

    canvas.addEventListener('mousedown', (e) => this.onMouseDown(e, canvas, ctx), false)
    canvas.addEventListener('mouseup', (e) => this.onMouseUp(e, canvas, ctx), false)
    canvas.addEventListener('mousemove', (e) => this.onMouseMove(e, canvas, ctx), false)

    this.draw(canvas, ctx)
  }
  // 矩形の値を 0 ~ 1.0 の値にして返す
  get rect () {
    return {
      min: {x: this.current_rect.min.x / this.width, y: this.current_rect.min.y / this.height},
      max: {x: this.current_rect.max.x / this.width, y: this.current_rect.max.y / this.height}
    }
  }
  // canvas の左上 を起点としたカーソル位置を返す
  static getPoint (e, canvas) {
    return {
      x: parseInt(e.clientX - canvas.offsetLeft),
      y: parseInt(e.clientY - canvas.offsetTop)
    }
  }
  // canvas からはみ出た矩形の位置を解決する
  resolveRect () {
    if (this.current_rect.min.x < 0) {
      this.current_rect.max.x -= this.current_rect.min.x
      this.current_rect.min.x = 0
    }
    if (this.current_rect.min.y < 0) {
      this.current_rect.max.y -= this.current_rect.min.y
      this.current_rect.min.y = 0
    }
    if (this.current_rect.max.x > this.width) {
      this.current_rect.min.x -= this.current_rect.max.x - this.width
      this.current_rect.max.x = this.width
    }
    if (this.current_rect.max.y > this.height) {
      this.current_rect.min.y -= this.current_rect.max.y - this.height
      this.current_rect.max.y = this.height
    }
  }
  // 矩形のスケールを変更
  setScale (scale) {
    if (this.width * scale < consts.THUMBNAIL_BOX_SIZE.WIDTH) {
      scale = consts.THUMBNAIL_BOX_SIZE.WIDTH / this.width
    }
    if (this.height * scale < consts.THUMBNAIL_BOX_SIZE.HEIGHT) {
      scale = consts.THUMBNAIL_BOX_SIZE.HEIGHT / this.height
    }
    let size = {w: this.current_rect.max.x - this.current_rect.min.x, h: this.current_rect.max.y - this.current_rect.min.y}
    let pivot = {x: this.current_rect.min.x + size.w / 2, y: this.current_rect.min.y + size.h / 2}
    let x = consts.THUMBNAIL_BOX_SIZE.WIDTH * (1.0 / scale) / 2
    let y = consts.THUMBNAIL_BOX_SIZE.HEIGHT * (1.0 / scale) / 2
    this.current_rect = {
      min: {x: pivot.x - x, y: pivot.y - y},
      max: {x: pivot.x + x, y: pivot.y + y}
    }
    this.resolveRect()
  }
  onMouseDown (e, canvas, ctx) {
    if (this.dragging) {
      return
    }

    let { x, y } = this.constructor.getPoint(e, canvas)

    if (this.current_rect.min.x <= x && x <= this.current_rect.max.x &&
        this.current_rect.min.y <= y && y <= this.current_rect.max.y) {
      this.dragging = true
      this.begin_point = {x: x - this.current_rect.min.x, y: y - this.current_rect.min.y}
    }
  }
  onMouseUp (e, canvas, ctx) {
    this.dragging = false
  }
  onMouseMove (e, canvas, ctx) {
    if (!this.dragging) {
      return
    }

    let { x, y } = this.constructor.getPoint(e, canvas)

    let p = {
      x: x - this.begin_point.x,
      y: y - this.begin_point.y
    }
    this.current_rect = {
      min: p,
      max: {
        x: this.current_rect.max.x - (this.current_rect.min.x - p.x),
        y: this.current_rect.max.y - (this.current_rect.min.y - p.y)
      }
    }

    // canvas 外へは矩形を移動しない
    if (this.current_rect.min.x < 0) {
      this.begin_point.x = x
    }
    if (this.current_rect.max.x > this.width) {
      this.begin_point.x = x - (this.width - (this.current_rect.max.x - this.current_rect.min.x))
    }
    if (this.current_rect.min.y < 0) {
      this.begin_point.y = y
    }
    if (this.current_rect.max.y > this.height) {
      this.begin_point.y = y - (this.height - (this.current_rect.max.y - this.current_rect.min.y))
    }

    this.resolveRect()
    this.draw(canvas, ctx)
  }
  draw (canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.clearRect(this.current_rect.min.x, this.current_rect.min.y, this.current_rect.max.x - this.current_rect.min.x, this.current_rect.max.y - this.current_rect.min.y)
    ctx.strokeRect(this.current_rect.min.x, this.current_rect.min.y, this.current_rect.max.x - this.current_rect.min.x, this.current_rect.max.y - this.current_rect.min.y)
    this.update_rect(this.rect)
  }
}

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

export default {
  components: { Thumbnail },
  data () {
    return {
      thumb_url: null,
      thumb_rect: null,
      title: null,
      description: null
    }
  },
  methods: {
    reset () {
      this._img_data = null
      if (this._img_url) {
        URL.revokeObjectURL(this._img_url)
      }
    },
    onChangeFile (e) {
      let files = e.target.files
      if (files.length === 0) {
        return
      }

      let file = files[0]
      let type = file.type.split('/', 2)[0]
      if (type !== 'image') {
        return
      }

      this.reset()

      let vm = this
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        let img = new Image()
        img.src = reader.result
        img.onload = async () => {
          let { width, height } = this.resolveSize(img.width, img.height, consts.THUMBNAIL_MAX_SIZE, consts.THUMBNAIL_MAX_SIZE)

          vm._img_data = await this.resize(img, consts.IMAGE_MAX_SIZE)
          vm._img_url = URL.createObjectURL(vm._img_data)
          vm.thumb_url = vm._img_url

          this._thumbnail_view = new ThumbnailView(
              e.target.previousElementSibling.children[0],  // canvas element
              width, height, vm._img_url, (rect) => { vm.thumb_rect = rect })
        }
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
        tmp.toBlob(resolve, 'image/jpeg', consts.QUALITY)
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
