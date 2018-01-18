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

    this.scale = 1.0
    this.width = width
    this.height = height
    this.dragging = false
    this.begin_point = {x: 0, y: 0}
    this.current_point = {
      x: parseInt(width / 2 - this.box_size.width / 2),
      y: parseInt(height / 2 - this.box_size.height / 2)
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
  get scale () {
    return this._scale
  }
  set scale (scale) {
    this._scale = scale
    this.box_size = {
      width: THUMBNAIL_BOX_SIZE.WIDTH * (1.0 / scale),
      height: THUMBNAIL_BOX_SIZE.HEIGHT * (1.0 / scale)
    }
  }
  get position () {
    return {
      x: (this.current_point.x + this.box_size.width / 2) / this.width,
      y: (this.current_point.y + this.box_size.height / 2) / this.height
    }
  }
  static getPoint (e, canvas) {
    return {
      x: parseInt(e.clientX - canvas.offsetLeft),
      y: parseInt(e.clientY - canvas.offsetTop)
    }
  }
  onMouseDown (e, canvas, ctx) {
    if (this.dragging) {
      return
    }

    let { x, y } = this.constructor.getPoint(e, canvas)

    if (this.current_point.x <= x && x <= this.current_point.x + this.box_size.width &&
        this.current_point.y <= y && y <= this.current_point.y + this.box_size.height) {
      this.dragging = true
      this.begin_point = {x: x - this.current_point.x, y: y - this.current_point.y}
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

    this.current_point = {
      x: x - this.begin_point.x,
      y: y - this.begin_point.y
    }
    if (this.current_point.x < 0) {
      this.current_point.x = 0
      this.begin_point.x = x
    }
    if (this.current_point.x > canvas.width - this.box_size.width) {
      this.current_point.x = canvas.width - this.box_size.width
      this.begin_point.x = x - (canvas.width - this.box_size.width)
    }
    if (this.current_point.y < 0) {
      this.current_point.y = 0
      this.begin_point.y = y
    }
    if (this.current_point.y > canvas.height - this.box_size.height) {
      this.current_point.y = canvas.height - this.box_size.height
      this.begin_point.y = y - (canvas.height - this.box_size.height)
    }
    this.draw(canvas, ctx)
  }
  draw (canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.clearRect(this.current_point.x, this.current_point.y, this.box_size.width, this.box_size.height)
    ctx.strokeRect(this.current_point.x, this.current_point.y, this.box_size.width, this.box_size.height)

    if (this.preview) {
      this.preview.update(this.position, this.scale)
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
  update (position, scale) {
    if (this.scale !== scale) {
      this.scale = scale
      this.img.width = this.width * scale
      this.img.height = this.height * scale
    }
    this.img.style.left = '-' + (this.img.width * position.x - THUMBNAIL_BOX_SIZE.WIDTH / 2) + 'px'
    this.img.style.top = '-' + (this.img.height * position.y - THUMBNAIL_BOX_SIZE.HEIGHT / 2) + 'px'
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
