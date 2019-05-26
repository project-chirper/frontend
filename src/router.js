import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './store/index'

Vue.use(Router)

export const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Logreg'),
      props: { action: 'login' },
      meta: { title: 'Bitter Login', requiresNoAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/Logreg'),
      props: { action: 'register' },
      meta: { title: 'Bitter Login', requiresNoAuth: true }
    },


    // Profile
    {
      path: '/user/:username',
      name: 'profile',
      props: true,
      component: () => import('./views/Profile'),
      meta: { title: 'Bitter Profile' },
      children: [
        {
          name: 'post',
          path: 'post/:linkedPost',
          props: true
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title : 'Bitter'

  // Check for protected routes
  let isAuthed = store.state.user.isAuthed // if user is authed or not

  // Check if the to route requires auth
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // If so, check if user is logged. IF user is logged let them pass otherwise redirect to login page
    if (isAuthed) next(); else next({ name: 'login' })
  } else if (to.matched.some(record => record.meta.requiresNoAuth)) {
    // Check if the to route requires that the user strictly isn't authorized e.g login/register
    if (!isAuthed) next(); else next({ name: 'home' })
  } else next() // No guards, next them
})

export default router