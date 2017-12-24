<template>
	<div id="upload">
		Upload
        <form v-on:submit.prevent="submit">
            <div>
                <img v-bind:src="img_data" v-if="img_data" />
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

export default {
  data () {
    return {
      img_data: null
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
        vm.img_data = reader.result
      }
    },
    submit (e) {
      let form = new FormData(e.srcElement)
      api.postMediaData(form)
    }
  }
}
</script>

<style>
#upload form img {
  width: 100%;
}
</style>
