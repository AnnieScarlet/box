import Vue from 'vue'
import Vuex from 'vuex'
import consts from '@/constants'

Vue.use(Vuex)

const MediaView = {
  namespaced: true,
  state: {
    media_view_data: null
  },
  mutations: {
    setData (state, data) {
      state.media_view_data = data
    }
  },
  getters: {
    getMediaUrl (state) {
      return consts.static_url + state.media_view_data.id
    }
  }
}

export default new Vuex.Store({
  modules: { MediaView }
})
