import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './store/index'

Vue.use(Router)

export const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // Home. Shows the users timeline.
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    // Login page
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Logreg'),
      props: { action: 'login' },
      meta: { title: 'Login', requiresNoAuth: true }
    },
    // Register page
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/Logreg'),
      props: { action: 'register' },
      meta: { title: 'Register', requiresNoAuth: true }
    },

    // Profile page
    {
      path: '/user/:username', // The username defines whose profile you are viewing
      name: 'profile',
      props: true, // it is passed as 'username' prop
      component: () => import('./views/Profile'),
      meta: { title: 'Profile' },
      children: [ // This child route is used to automatically load a users post
        {
          name: 'post',
          path: 'post/:linkedPostId', 
          props: true // The prop 'linkedPost' which is the post ID is passed to the Profile component, then to the Timeline component which loads and focuses it
        }
      ]
    },

    {
      path: '/account',
      name: 'account',
      redirect: '/account/details',
      component: () => import('./views/Account/index.vue'),
      meta: { requiresAuth: true },
      children: [
        { name: 'details', path: 'details', component: () => import('./views/Account/Details'), meta: { title: 'Details' } },
        { name: 'display-info', path: 'display-info', component: () => import('./views/Account/DisplayInfo'), meta: { title: 'Display Info' } }
      ]
    },

    // Email verification
    {
      path: '/verify-email/:uniqueCode',
      name: 'verify-email',
      component: () => import('./views/Account/VerifyEmail'),
      meta: { title: 'Verify Email' },
      props: true
    },

    // Reset Password form
    {
      path: '/reset-password/:uniqueCode',
      name: 'reset-password',
      component: () => import ('./views/Account/ResetPassword'),
      meta: { title: 'Reset Password' },
      props: true
    },

    // 404
    {
      path: "*",
      redirect: '/404'
    },
    {
      name: '404',
      path: '/404',
      meta: { title: 'Page not found' },
      component: () => import('./views/404')
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `Bitter - ${to.meta.title}` : 'Bitter' // Set a default title if one has not been specified

  // Check for protected routes
  let isAuthed = store.state.user.isAuthed // Whether user is currently authenticated

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