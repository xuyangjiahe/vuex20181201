import Vue from 'vue';
import iView from 'iview';
import { ResError } from '@/libs//error/ResError';

iView.Message.config({
    duration: 4
});
//全局引入
Vue.use(iView)

export const errorHandler = (error, vm)=>{
    iView.Message.destroy()
    if(!(error instanceof ResError)){
        console.error(error)
    }else{
        iView.Message.error(error.message);
    }
}

Vue.config.errorHandler = errorHandler;
Vue.prototype.$throw = (error)=> errorHandler(error,this);
