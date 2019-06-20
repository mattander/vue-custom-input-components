import Vue from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
// import jQuery from 'jquery'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/css/v4-shims.min.css'
Vue.config.productionTip = false
import dayjs from 'dayjs';

Vue.prototype.dayjs = dayjs;

// NodeList.forEach polyfill for IE11
if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = Array.prototype.forEach;
}

Vue.config.productionTip = false;

// Make the dayjs function available at the template level
Vue.prototype.dayjs = dayjs;

Vue.directive('focus', {
	// When the bound element is inserted into the DOM...
	inserted: function (el) {
		// Focus the element
		const { x, y } = el.getBoundingClientRect();
		window.scrollTo(x, y);
	}
})

Vue.directive('popupcalc', {
	// When the bound element is inserted into the DOM...
	inserted: function (el, binding) {
		// remove class from last popup, using the method twice for IE11 support
		el.classList.remove('picker-top');
		el.classList.remove('picker-bottom');

		const { height: pickerHeight } = el.getBoundingClientRect();
		const { height: inputHeight, top: inputTop } = document.querySelector(`#${binding.value}`).getBoundingClientRect();
		const roomAbove = inputTop > pickerHeight
			? true
			: false;
		if (roomAbove) {
			el.classList.add('picker-top');
			el.style.top = `-${pickerHeight + 16}px`;
		} else {
			el.classList.add('picker-bottom');
			el.style.top = `${inputHeight + 16}px`;
		}
	}
})


new Vue({
	render: h => h(App),
}).$mount('#app')