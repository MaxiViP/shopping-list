import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './main.css'

// Font Awesome
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
	faList,
	faTimes,
	faCheckCircle,
	faArrowLeft,
	faPaperPlane,
	faEnvelope,
} from '@fortawesome/free-solid-svg-icons'

// Регистрируем ВСЕ используемые иконки
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
	faChevronDown,
	faList,
	faTimes,
	faCheckCircle,
	faArrowLeft,
	faPaperPlane,
	faEnvelope
)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)

app.mount('#app')
