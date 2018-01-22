import Vue from 'vue'
import Router from 'vue-router'

import Browser from '@/pages/Browser'
import Album from '@/pages/Album'
import User from '@/pages/User'
import Settings from '@/pages/Settings'
import Signin from '@/pages/Signin'
import Signup from '@/pages/Signup'

// import NotFound from '@/pages/NotFound'

Vue.use(Router)

const router = new Router({
  // mode: 'history',  サーバー立てるまで hash
  routes: [
    {
      path: '/',
      name: 'index',
      component: Browser
    },
    {
      path: '/-/(.*)',
      name: 'index-search',
      component: Browser
    },
    {
      path: '/media/(.*)',
      name: 'index-view',
      component: Browser
    },
    {
      path: '/album/(.*)?',
      name: 'album`',
      component: Album
    },
    {
      path: '/user/:id',
      name: 'user`',
      component: User
    },

    {
      path: '/upload',
      name: 'upload`',
      component: () => import('@/pages/Upload'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings`',
      component: Settings,
      meta: { requiresAuth: true }
    },

    {
      path: '/signin',
      name: 'signin`',
      component: Signin
    },
    {
      path: '/signup',
      name: 'signup`',
      component: Signup
    },

    {
      path: '*',
      // name: 'notfound`',
      // component: NotFound
      redirect: { path: '/' }
    }
  ]
})

// router.beforeEach((to, from, next) => {
  // console.log(to, from, to.name)
  // if (from.name === 'index-view') {
  //   next('/')
  // } else {
  //   next()
  // }
// })

export default router
