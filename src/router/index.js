import {createRouter,createWebHashHistory} from 'vue-router'
import ProjectPage from '../components/project-page.vue'
import VersionPage from '../components/version-page.vue'
import SettingPage from '../components/setting-page.vue'


const routes = [
  { path: '/', component: ProjectPage },
  { path: '/version', component: VersionPage },
  { path: '/setting', component: SettingPage},
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router