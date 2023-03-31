import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '../pages/LoginForm.vue'
import SignupForm from '../pages/SignupForm.vue'
import Home from '../pages/Home.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'homepage',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            component: LoginForm
        },
        {
            path: '/signup',
            name: 'signup',
            component: SignupForm
        }
    ]
})

export default router