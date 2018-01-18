<template>
  <div id="upload">
    Upload
        <form v-on:submit.prevent="submit">
            <div>
                <div>
                  <canvas class="thumbnail" width="0" height="0"></canvas>
                  <div class="preview"><img /></div>
                </div>
                <input type="file" name="file" v-on:change="onChangeFile">
            </div>
            <div>
                <input type="text" name="title" placeholder="title" />
            </div>
            <div>
                <textarea name="description" placeholder="description"></textarea>
            </div>
            <button type="submit">Submit</button>
        </form>
  </div>
</template>

<script>
import api from '@/api'

const QUARITY = 0.6
const THUMBNAIL_BOX_SIZE = { WIDTH: 200, HEIGHT: 200 }
const IMAGE_MAX_SIZE = 1280
const THUMBNAIL_MAX_SIZE = 250

class ThumbnailView {
  constructor (canvas, width, height, data, preview) {
    this.preview = preview

    this.width = width
    this.height = height

    let pivot = {
      x: parseInt(width / 2 - THUMBNAIL_BOX_SIZE.WIDTH / 2),
      y: parseInt(height / 2 - THUMBNAIL_BOX_SIZE.HEIGHT / 2)
    }
    this.dragging = false
    this.begin_point = {x: 0, y: 0}
    this.current_rect = {
      min: {x: pivot.x, y: pivot.y},
      max: {x: pivot.x + THUMBNAIL_BOX_SIZE.WIDTH, y: pivot.y + THUMBNAIL_BOX_SIZE.HEIGHT}
    }

    let ctx = canvas.getContext('2d')

    canvas.width = width
    canvas.height = height
    canvas.style.backgroundImage = 'url(data:' + data + ')'
    canvas.style.backgroundSize = '100%'

    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
    ctx.strokeStyle = 'red'

    canvas.addEventListener('mousedown', (e) => this.onMouseDown(e, canvas, ctx), false)
    canvas.addEventListener('mouseup', (e) => this.onMouseUp(e, canvas, ctx), false)
    canvas.addEventListener('mousemove', (e) => this.onMouseMove(e, canvas, ctx), false)

    this.draw(canvas, ctx)
  }
  get rect () {
    return {
      min: {x: this.current_rect.min.x / this.width, y: this.current_rect.min.y / this.height},
      max: {x: this.current_rect.max.x / this.width, y: this.current_rect.max.y / this.height}
    }
  }
  static getPoint (e, canvas) {
    return {
      x: parseInt(e.clientX - canvas.offsetLeft),
      y: parseInt(e.clientY - canvas.offsetTop)
    }
  }
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
  setScale (scale) {
    if (this.width * scale < THUMBNAIL_BOX_SIZE.WIDTH) {
      scale = THUMBNAIL_BOX_SIZE.WIDTH / this.width
    }
    if (this.height * scale < THUMBNAIL_BOX_SIZE.HEIGHT) {
      scale = THUMBNAIL_BOX_SIZE.HEIGHT / this.height
    }
    let size = {w: this.current_rect.max.x - this.current_rect.min.x, h: this.current_rect.max.y - this.current_rect.min.y}
    let pivot = {x: this.current_rect.min.x + size.w / 2, y: this.current_rect.min.y + size.h / 2}
    let x = THUMBNAIL_BOX_SIZE.WIDTH * (1.0 / scale) / 2
    let y = THUMBNAIL_BOX_SIZE.HEIGHT * (1.0 / scale) / 2
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

    if (this.preview) {
      this.preview.update(this.rect)
    }
  }
}

class ThumbnailPreview {
  constructor (img, width, height, data) {
    this.scale = 1.0
    this.width = width
    this.height = height
    this.img = img

    let previewBox = img.parentElement
    previewBox.style.width = THUMBNAIL_BOX_SIZE.WIDTH + 'px'
    previewBox.style.height = THUMBNAIL_BOX_SIZE.HEIGHT + 'px'

    img.src = data
    img.width = width
    img.height = height
  }
  update (rect) {
    let scale = THUMBNAIL_BOX_SIZE.WIDTH / (this.width * (rect.max.x - rect.min.x))
    if (this.scale !== scale) {
      this.scale = scale
      this.img.width = this.width * scale
      this.img.height = this.height * scale
    }
    this.img.style.left = '-' + (this.img.width * rect.min.x) + 'px'
    this.img.style.top = '-' + (this.img.height * rect.min.y) + 'px'
  }
}

export default {
  data () {
    return {
      img_data: null,
      thumb_data: null
    }
  },
  methods: {
    reset () {
    },
    onChangeFile (e) {
      let files = e.target.files
      if (files.length === 0) {
        return
      }

      let file = files[0]
      let type = file.type.split('/', 2)[0]
      if (type !== 'image') {
        this.reset()
        return
      }

      let vm = this
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        let img = new Image()
        img.src = reader.result
        img.onload = () => {
          let { width, height } = this.resolveSize(img.width, img.height, THUMBNAIL_MAX_SIZE, THUMBNAIL_MAX_SIZE)

          vm.img_data = this.resize(img, IMAGE_MAX_SIZE)
          // vm.thumb_data = this.resize(img, THUMBNAIL_MAX_SIZE)
          vm.thumb_data = vm.img_data

          let preview = new ThumbnailPreview(
              e.target.previousElementSibling.children[1].children[0],  // preview img element
              width, height, vm.thumb_data)

          this._thumbnail_view = new ThumbnailView(
              e.target.previousElementSibling.children[0],  // canvas element
              width, height, vm.thumb_data, preview)
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
    resize (src, max, tmp) {
      let { width, height } = this.resolveSize(src.width, src.height, max)
      tmp = tmp || document.createElement('canvas')
      let ctx = tmp.getContext('2d')

      if (width / src.width <= 0.5) {
        tmp.width = src.width * 0.5
        tmp.height = src.height * 0.5
        ctx.drawImage(src, 0, 0, tmp.width, tmp.height)
        return this.resize(tmp, max, src.getContext && src)
      }

      tmp.width = width
      tmp.height = height
      ctx.drawImage(src, 0, 0, width, height)
      return tmp.toDataURL('image/jpeg', QUARITY)
    },
    submit (e) {
      let form = new FormData(e.srcElement)
      api.postMediaData(form)
    }
  }
}
</script>

<style>
#upload div.preview {
  overflow: hidden;
  position: relative;
  /* width: 200px; */
  /* height: 200px; */
}
#upload div.preview img {
  position: relative;
  /* width: 100%; */
}
</style>
