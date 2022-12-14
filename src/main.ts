import Vue from 'vue'
import App from './App.vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import routes from 'pages-generated';
import VueRouter from "vue-router";

const pinia = createPinia()
import './theme.scss'
import { ModalPlugin } from 'bootstrap-vue'
import { ForgeModal, ForgeModalHelper, useForgeValidation } from "@3squared/forge-ui";
const router = new VueRouter({
  routes // short for `routes: routes`
})
Vue.use(VueRouter)
Vue.use(PiniaVuePlugin)
Vue.use(ModalPlugin)
Vue.use(ForgeModalHelper)
useForgeValidation();
new Vue({
  pinia,
  router,
  render: (h) => h(App),
}).$mount('#app')
