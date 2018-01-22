<template>
  <div id="container">
    <app-header id="header" />
    <router-view id="contents" />
    <app-footer id="footer" />
    <media-view id="media-view" />
  </div>
</template>

<script>
import MediaView from '@/components/MediaView'
import AppHeader from '@/components/Header'
import AppFooter from '@/components/Footer'

export default {
  name: 'app',
  components: {
    MediaView,
    AppHeader,
    AppFooter
  },
  methods: {
    fixMargin () {
      let contents = document.getElementById('contents')
      contents.style.marginTop = this._header.offsetHeight + 'px'
      contents.style.marginBottom = this._footer.offsetHeight + 'px'
    }
  },
  mounted () {
    this._header = document.getElementById('header')
    this._footer = document.getElementById('footer')
    window.addEventListener('resize', this.fixMargin, false)
    this.fixMargin()
  },
  updated () {
    this.fixMargin()
  }
}
</script>

<style>
*{
  margin:0;
  padding:0;
}
body{
  width:100%;
}
header {
  position: fixed;
  top: 0;
  z-index: 10;
  background-color: #fff;
  width:100%;
}
footer {
  position: fixed;
  bottom: 0;
  z-index: 10;
  background-color: #fff;
  width:100%;
}
#contents {
  height: auto;
  overflow-y: auto;
}
</style>
