<template>
    <div id="index">
      <div>videoWallMode视图数据：{{ videoWallMode }}</div>
      <div>isTestSuccess视图数据：{{ isTestSuccess }}</div>
      <div>videoList视图数据：{{ videoList }}</div>
      <hello-world></hello-world>
    </div>
</template>
<script>
  import { mapState } from 'vuex';
import HelloWorld from '@/components/HelloWorld';


export default {
    name: 'index',
    components: {
      HelloWorld,
    },
    data() {
        return {
          videoList:[],
        }
    },
    computed: {
      //获取store中用户信息；
      ...mapState({
        userInfo: state => state.user.userInfo,
      }),
      storeVideoList: function () {
        return this.$store.state.videoStorage.videoList;
      },
      videoWallMode: function(){
        return this.$store.state.globalStatus.videoWallMode;
      },
      isTestSuccess: function(){
        return this.$store.state.globalStatus.isTestSuccess;
      },
    },
  watch: {
    storeVideoList: {
      handler: function (newValue, oldValue) {
        console.log("【监听】 videoList改变了")
        console.log(newValue)
        var that = this;
        that.videoList = newValue;
//         that.videoList.forEach((v,index)=> {
//           if(v.userID == that.userId && v.videoID == that.currentVideo.videoID){
//             that.currentVideo = Object.assign({}, that.currentVideo, {
//               audioStatus: v.audioStatus,
//               videoStatus: v.videoStatus,
//               qingxidu: v.qingxidu
//             })
//             that.qingxidu = v.qingxidu;
//           }
//         })
      },
      deep: true
    },
    videoWallMode: {
      handler: function (n, oldValue) {
        console.log('videoWallMode 更新了..... ')
        console.log(n)

          this.videoList = this.$store.state.videoStorage.videoList;

      },
      deep: true
    },
    isTestSuccess:{
      handler: function (n, oldValue) {
        console.log('isTestSuccess 更新了..... ')
        console.log(n)
        if(n){
          console.log('测试完成，打开摄像头。麦克风！！！！！！！！')
        }
      },
      deep: true
    },
    storeVideoList:{
      handler: function (n, oldValue) {
        console.log('storeVideoList 更新了..... ')
        console.log(n)
        if(n){
          console.log('更新本地videoList')
          this.videoList = n;
          console.log(this.videoList)
        }
      },
      deep: true,
      immediate:true
    },
  },
  created:function(){
      let that = this;
    that.$store.dispatch('setVideoList' , '1234455dispatch'); //异步设置videoList
    that.$store.commit('setVideoList' , '123456commit'); //同步设置videoList
  },

}
</script>
<style scoped>


</style>

