import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Editor from '../views/Editor.vue'
import SelectResearchReport from '../views/SelectResearchReport.vue'
import { isAuthenticated } from '../api/userapi'

const routes = [
  { path: '/login', component: Login },
  { path: '/', component: Dashboard },
  { path: '/editor/:id', component: Editor, props: true },
  { path: '/editor/:id?', component: Editor, props: true },
  { path: '/selectResearchReport',component: SelectResearchReport}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  if (!isAuthenticated()) {
    return next('/login')
  }
  next()
})

export default router
