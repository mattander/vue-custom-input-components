import Vue from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
// import jQuery from 'jquery'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/css/v4-shims.min.css'
Vue.config.productionTip = false
import moment from 'moment';

Vue.prototype.moment = moment;

new Vue({
	render: h => h(App),
}).$mount('#app')