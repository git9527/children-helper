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
    path: '/math/mix/3',
    name: 'math-mix-3',
    component: () => import('../views/maths/mix-3.vue')
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
    path: '/hidden/barcode',
    name: 'hidden-barcode',
    component: () => import('../views/hidden/barcode.vue')
  },
  {
    path: '/hidden/party',
    name: 'hidden-party',
    component: () => import('../views/hidden/party.vue')
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
