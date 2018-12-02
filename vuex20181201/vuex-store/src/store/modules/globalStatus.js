import {setStore, getStore} from '@/util/store';
import { errorHandler } from "@/libs/iview-cfg";

export default {
  state: {
    videoWallMode: getStore({ name: 'videoWallMode' }) || {},
    netQuality: getStore({name:'netQuality'}) || {},
    isDestroyDynamicObj: getStore({name:'isDestroyDynamicObj'}) || {},
    isShowMsg:getStore({name:'isShowMsg'}) || {},
    isShowWhiteBoard:getStore({name:'isShowWhiteBoard'}) || {},
    isTestSuccess: getStore({name:'isTestSuccess'}) || {},
  },
  mutations: {
    setVideoWallMode(state, videoWallMode){
      state.videoWallMode = videoWallMode;
      setStore({
        name: 'videoWallMode',
        content: videoWallMode,
        type: '',
      });
    },
    setNetQuality(state, netQuality){
      state.netQuality = netQuality;
      setStore({
        name: 'netQuality',
        content: netQuality,
        type: '',
      });
    },
    setIsDestroyDynamicObj(state, isDestroyDynamicObj){
      state.isDestroyDynamicObj = isDestroyDynamicObj;
      setStore({
        name: 'isDestroyDynamicObj',
        content: isDestroyDynamicObj,
        type: '',
      });
    },
    setIsShowMsg(state, isShowMsg){
      state.isShowMsg = isShowMsg;
      setStore({
        name: 'isShowMsg',
        content: isShowMsg,
        type: '',
      });
    },
    setIsShowWhiteBoard(state, isShowWhiteBoard){
      state.isShowWhiteBoard = isShowWhiteBoard;
      setStore({
        name: 'isShowWhiteBoard',
        content: isShowWhiteBoard,
        type: '',
      });
    },
    setIsTestSuccess(state, isTestSuccess){
      state.isTestSuccess = isTestSuccess;
      setStore({
        name: 'isTestSuccess',
        content: isTestSuccess,
        type: '',
      });
    },
  },
  actions: {
    setVideoWallMode ({ state, commit },param) {
      console.log('actions ...............setVideoWallMode')
      console.log(param)
      commit('setVideoWallMode', param)
    },
    setNetQuality ({ state, commit },param) {
      console.log('actions ...............setNetQuality')
      console.log(param)
      commit('setNetQuality', param)
    },
    setIsDestroyDynamicObj ({ state, commit },param) {
      console.log('actions ...............setIsDestroyDynamicObj')
      console.log(param)
      commit('setIsDestroyDynamicObj', param)
    },
    setIsShowMsg ({ state, commit },param) {
      console.log('actions ...............isShowMsg')
      console.log(param)
      commit('setIsShowMsg', param)
    },
    setIsShowWhiteBoard ({ state, commit },param) {
      console.log('actions ...............isShowWhiteBoard')
      console.log(param)
      commit('setIsShowWhiteBoard', param)
    },
    setIsTestSuccess ({ state, commit },param) {
      console.log('actions ...............setIsTestSuccess')
      console.log(param)
      commit('setIsTestSuccess', param)
    },
  }
}

