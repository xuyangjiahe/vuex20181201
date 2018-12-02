import {setStore, getStore} from '@/util/store'
import {errorHandler} from '@/libs/iview-cfg'
export default {
  state: {
    userInfo: getStore({ name: 'userInfo'}) || {},
  },
  mutations: {
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
      setStore({
        name: 'userInfo',
        content: userInfo,
        type:''
      })
    }
  },
   actions: {
    // 退出登录
    handleLogOut ({ state, commit }) {
      commit('setToken', '')
      commit('setAccess', [])
      localStorage.clear()
    },
    // 获取用户相关信息
    async getUserInfo ({ state, commit }) {
      try {
          let res = await post('/account/all-permission-tag')
          commit('setAccess', res.data)
          return {access:res.data}
      } catch (error) {
        errorHandler(error)
      }
    }
  }
}
