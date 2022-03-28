import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/math/plus-minus/2',
    alias: '/',
    name: 'plus-minus-2',
    component: () => import('../views/maths/plus-minus-2.vue')
  },
  {
    path: '/math/plus-minus/3',
    name: 'plus-minus-3',
    component: () => import('../views/maths/plus-minus-3.vue')
  },
  {
    path: '/math/plus-minus/5',
    name: 'plus-minus-5',
    component: () => import('../views/maths/plus-minus-5.vue')
  },
  {
    path: '/secret/haluo',
    name: 'secret-haluo',
    component: () => import('../views/secret/haluo.vue')
  },
  {
    path: '/secret/subscribe',
    name: 'secret-subscribe',
    component: () => import('../views/secret/subscribe.vue')
  },
  {
    path: '/secret/anki',
    name: 'secret-anki',
    component: () => import('../views/secret/anki-select.vue')
  },
  {
    path: '/secret/notes',
    name: 'secret-notes',
    component: () => import('../views/secret/question-notes.vue')
  },
  {
    path: '/hidden/yijian',
    name: 'hidden-yijian',
    component: () => import('../views/hidden/yijian.vue')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes: routes
})

export default router
