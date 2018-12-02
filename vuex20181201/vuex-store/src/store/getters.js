
const getters = {
  getVideoList: state => state.videoStorage.videoList,
  getNetQuality: state => state.globalStatus.netQuality,
  getVideoWallMode: state => state.globalStatus.videoWallMode,
  getIsDestroyDynamicObj: state => state.globalStatus.isDestroyDynamicObj,
  getIsShowMsg: state => state.globalStatus.isShowMsg,
  getIsTestSuccess: state => state.globalStatus.isTestSuccess,
};

export default getters;


