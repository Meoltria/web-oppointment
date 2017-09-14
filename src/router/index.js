import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      component: resolve => require(['../views/home/Home.vue'], resolve),
      children: []
    },
    {
      path: '/login',
      component: resolve => require(['../views/login/Login.vue'], resolve)
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})
