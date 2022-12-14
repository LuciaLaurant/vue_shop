import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/views/user/Users'
import RightsList from '@/views/Rights/RightsList'
import RolesList from '@/views/Rights/RolesList'
import Cate from '@/views/Goods/Category/Cate'
import Params from '@/views/Goods/Category/Params'
import Goods from '@/views/Goods/Category/Goods'
import Add from '@/views/Goods/Category/Add'
import Order from '@/views/Order/Order'
import Report from '@/views/Report/Report'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [{
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/users',
                component: Users
            },
            {
                path: '/rights',
                component: RightsList
            },
            {
                path: '/roles',
                component: RolesList
            },
            {
                path: '/categories',
                component: Cate
            },
            {
                path: '/params',
                component: Params
            },
            {
                path: '/goods',
                component: Goods,
            },
            {
                path: '/goods/add',
                component: Add
            },
            {
                path: '/orders',
                component: Order
            },
            {
                path: '/reports',
                component: Report
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

// 挂载路由守卫
router.beforeEach((to, from, next) => {
    // 如果是login 直接放行
    if (to.path === '/login') return next();
    // 查询是否有token
    const token = window.sessionStorage.getItem('token')
    if (!token) return next('/login')
    next()
})

export default router
