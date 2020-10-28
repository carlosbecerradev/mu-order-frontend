import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

import store from '../store/index.js'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import(/* webpackChunkName: "Orders" */ '../views/Orders.vue'),
    meta: {protectedRoute: true}
  },
  {
    path: '/my-orders',
    name: 'MyOrders',
    component: () => import(/* webpackChunkName: "MyOrders" */ '../views/MyOrders.vue'),
    meta: {protectedRoute: true}
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach( (to, from, next)=>{
  const isProtectedRoute = to.matched.some( route => route.meta.protectedRoute)
  if(isProtectedRoute && store.state.token === null){
    next({path:'/login'})
  } else {
    next()
  }
})

export default router
