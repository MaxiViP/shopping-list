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
	faSpinner, // ДОБАВИЛИ
	faCopy, // ДОБАВИЛИ для копирования
	faQrcode, // ДОБАВИЛИ для QR кода
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
	faEnvelope,
	faSpinner,
	faCopy,
	faQrcode
)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

const pinia = createPinia()
app.use(pinia)
app.use(router)

app.mount('#app')
