<template>
    <div id="login">
      <button @click="signIn">sign  in </button>
    </div>
</template>
<script>


    export default {
        name: 'login',
        components: {
//      组件
        },
        data() {
            return {}
        },
        computed: {},
        watch: {},
        created: function () {
          //存储用户登录信息；
          this.$store.commit('setUserInfo', { id:'123334568', name:'Andy',  });
          //设置存储VideoWallMode   IsDestroyDynamicObj
          this.$store.dispatch('setVideoWallMode' , '85293522');
          this.$store.dispatch('setVideoList' , false);
        },
        methods: {
          signIn:function(){
            //进入首页；
            this.$router.push({
              path:'/index',
            })
          }
        },
        mounted() {

        },
        updated: function () {

        },



    }
</script>
<style scoped>


</style>

