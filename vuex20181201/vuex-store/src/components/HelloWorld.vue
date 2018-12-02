<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <h2 >Ecosystem</h2>
    <button @click="changeData">change data</button>

  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods:{
    changeData:function(){
      //存储用户登录信息；
      this.$store.commit('setUserInfo', { id:'123334568', name:'AndyAAA',  });
      //设置存储VideoWallMode   IsDestroyDynamicObj
      this.$store.dispatch('setVideoWallMode' , '33333333');
      this.$store.dispatch('setVideoList' , true);
    }
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
