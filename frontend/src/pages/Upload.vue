<template>
  <div id="upload">
    Upload
    <Uploader v-for="file in files" v-bind:file="file" v-bind:key="file.name" />
    <input type="file" value="Drop files here" multiple
            v-on:change="handleFileSelect($event)"
            v-on:dragover="handleDragOver($event)"
            v-on:drop="handleFileSelect($event)" />
  </div>
</template>

<script>
import Uploader from '@/components/Uploader'

export default {
  components: { Uploader },
  data () {
    return {
      files: []
    }
  },
  methods: {
    handleFileSelect (e) {
      e.stopPropagation()
      e.preventDefault()

      for (let f of (e.dataTransfer || e.target).files) {
        if (f.type.indexOf('image/') === 0) {
          this.files.push(f)
        }
      }
    },
    handleDragOver (e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'  // Explicitly show this is a copy.
    }
  }
}
</script>

<style>
</style>
