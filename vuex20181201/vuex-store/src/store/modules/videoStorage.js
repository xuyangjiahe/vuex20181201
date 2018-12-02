import {setStore, getStore} from '@/util/store';
import { errorHandler } from "@/libs/iview-cfg";

export default {
  state: {
    videoList: getStore({ name: 'videoList' }) || {}
  },
  mutations: {
    setVideoList(state, videoList){
      state.videoList = videoList;
      setStore({
        name: 'videoList',
        content: videoList,
        type: '',
      });
    },
  },
  actions: {
    setVideoList ({ state, commit },param) {
      console.log('actions ...............setVideoList')
      console.log(param)
      commit('setVideoList', param)
    },
  }
}

