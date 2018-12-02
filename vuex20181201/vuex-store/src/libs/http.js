import Axios from 'axios';
import Vue from 'vue';
import qs from 'querystring';
import sf from 'string-format';
import { ResError } from './error/ResError';
import store from '@/store';

const axios = Axios.create({
    baseURL: '/api',//开发地址
    // baseURL: '/',//发包地址
    timeout: 16000,
    headers: {
    }
});
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'

// 请求拦截器
axios.interceptors.request.use(config => {
    if (config.method === 'post') {
        console.log('请求拦截器 ： ');
        console.log('[data] : ');
        console.log(config.data);
        let bakData = config.data;
        config.data = qs.stringify(config.data) || bakData;
        console.log('解析data: ');
        console.log(config.data);
    }

    return config;
}, error => {
    Vue.alert('请求出错拉>.<');
  return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use(res => {
    console.log('响应回调！！');
    console.log(res);
    if(res.data.code == 501){
      console.log('用户未登录!');
      // store.commit('setToken', '')
      // store.commit('setAccess', [])
      localStorage.clear()
    }
    //状态码小于0属于异常情况
    if(res.data.code < 0){
      throw new ResError(res.data.msg)
    }
    return res.data;
}, error => {
    console.log(error);
    alert('发生错误了，再试一下');
    throw new ResError("请求服务器失败，请检查服务是否正常！")
    return error
});

export const get = (url,params,pathVariable=null) =>  axios.get(sf(url, pathVariable), {params:params})

export const post = (url,params,pathVariable=null) => axios.post(sf(url, pathVariable), params)

export const put = (url,params,pathVariable=null) => axios.put(sf(url, pathVariable), params)

export const patch = (url,params,pathVariable=null) => axios.patch(sf(url, pathVariable), params)

export const del = (url,params,pathVariable=null) => axios.delete(sf(url, pathVariable), {params:params})
