import { createApp } from 'vue'
import App from './App.vue'
import StartScreen from './components/start-screen.vue'
import HomeScreen from './components/home-screen.vue'
import GroupView from './components/groupView.vue'
import ChannelView from './components/channelView.vue'
import * as VueRouter from 'vue-router'
import { createPinia } from 'pinia'
import { Login } from './API/HttpAPI'
import { Connect } from './API/WsAPI'

const app = createApp(App)

const routes = [
  { path: '/login', component: StartScreen },
  { path: '/', component: HomeScreen, name: "home", children: [ { path: 'group/:groupID', name:"group", component: GroupView, children: [ { path: 'channel/:channelID', name: "channel", component: ChannelView } ]  } ] }
]

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})

app.use(router);
app.use(createPinia());

// Mount app to DOM
app.mount('#app');