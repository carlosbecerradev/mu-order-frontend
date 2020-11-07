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
  {
    path: '/create/order',
    name: 'CreateOrder',
    component: () => import(/* webpackChunkName: "NewOrder" */ '../views/CreateOrder.vue'),
    meta: {protectedRoute: true}
  },
  {
    path: '/edit/order/:id',
    name: 'EditOrder',
    component: () => import(/* webpackChunkName: "EditOrder" */ '../views/EditOrder.vue'),
    meta: {protectedRoute: true}
  },
  {
    path: '/create/order-history/:id',
    name: 'CreateOrderHistory',
    component: () => import(/* webpackChunkName: "CreateOrderHistory" */ '../views/CreateOrderHistory.vue'),
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

  if(isProtectedRoute &&  isInvalidToken(store.state.token)){
    next({path:'/login'})
  } else {
    next()
  }
})

/**
 * If the result is positive, then the token has already expired
 * @param {JWT} token
 */
const isInvalidToken = (token)=>{
  try {
    const getJwtExpiredDate = JSON.parse(atob(token.split('.')[1])).exp
    const getCurrentTimestampInMillis = Math.floor(Date.now() / 1000);
    return getCurrentTimestampInMillis - getJwtExpiredDate >= 0 ? true : false;
  } catch (error) {
    return true
  }
};

export default router
