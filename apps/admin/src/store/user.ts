import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
    const token = ref('')
    const userInfo = ref({})
    const userName = computed(() => userInfo.name)
    function setToken (val:string) {
        token.value = val
    }
  
    return { token, userInfo, userName, setToken }
})