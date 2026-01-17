import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './main.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
	faHeart,
	faSearch,
	faShoppingCart,
	faHistory,
	faSignOutAlt,
	faStore,
	faRubleSign,
	faCheck,
	faPlus,
	faUndoAlt,
	faChevronUp,
	faChevronDown,
} from '@fortawesome/free-solid-svg-icons'

library.add(
	faHeart,
	faSearch,
	faShoppingCart,
	faHistory,
	faSignOutAlt,
	faStore,
	faRubleSign,
	faCheck,
	faPlus,
	faUndoAlt,
	faChevronUp,
	faChevronDown
)

createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(createPinia()).use(router).mount('#app')
