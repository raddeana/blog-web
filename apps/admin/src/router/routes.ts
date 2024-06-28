import usersView from '@/views/users.vue'
import rolesView from '@/views/roles.vue'

export const routes = [{ 
    path: '/users',
    component: usersView
}, {
    path: '/roles',
    component: rolesView
}]