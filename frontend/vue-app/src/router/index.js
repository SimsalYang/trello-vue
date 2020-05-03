import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store';

const Home = () => import('../views/Home.vue')
const Board = () => import('../views/Board.vue')
const Card = () => import('../views/Card.vue')
const Register = () => import('../views/Register.vue')
const Login = () => import('../views/Login.vue')
const NotFound = () => import('../views/NotFound.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  }, {
    path: '/board/:id(\\d+)',
    name: 'Board',
    component: Board,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'list/:listId(\\d+)/card/:cardId(\\d+)',
        name: 'Card',
        component: Card
      }
    ]
  }, {
    path: '/register',
    name: 'Register',
    component: Register
  }, {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// 从 localStorage 中取 token
store.commit('user/initUserInfo');
// 实现鉴权
router.beforeEach((to, from, next) => {
  // 如果该路由需要鉴权，则验证用户信息
  // 如果不通过，跳转到登录页
  if (to.matched.some(matched => matched.meta.requiresAuth) && /*没有用户信息*/ !store.state.user.info) {
    next({ name: 'Login' });
  } else {
    next();
  }
})

export default router
