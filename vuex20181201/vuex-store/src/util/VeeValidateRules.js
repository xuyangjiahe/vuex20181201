//vue中表格校验vee-validate信息提示；；；

import Vue from 'vue'
import VeeValidate, {Validator} from 'vee-validate'
import zh_CN from 'vee-validate/dist/locale/zh_CN'; //引入中文包，提示信息可以以中文形式显示
/**
 *  VeeValidate内置校验规则
   after{target} - 比target要大的一个合法日期，格式(DD/MM/YYYY)
   alpha - 只包含英文字符
   alpha_dash - 可以包含英文、数字、下划线、破折号
   alpha_num - 可以包含英文和数字
   before:{target} - 和after相反
   between:{min},{max} - 在min和max之间的数字
   confirmed:{target} - 必须和target一样
   date_between:{min,max} - 日期在min和max之间
   date_format:{format} - 合法的format格式化日期
   decimal:{decimals?} - 数字，而且是decimals进制
   digits:{length} - 长度为length的数字
   dimensions:{width},{height} - 符合宽高规定的图片
   email - 不解释
   ext:[extensions] - 后缀名
   image - 图片
   in:[list] - 包含在数组list内的值
   ip - ipv4地址
   max:{length} - 最大长度为length的字符
   mimes:[list] - 文件类型
   min - max相反
   mot_in - in相反
   numeric - 只允许数字
   regex:{pattern} - 值必须符合正则pattern
   required - 不解释
   size:{kb} - 文件大小不超过
   url:{domain?} - (指定域名的)url
 **/
const config = {
  locale: 'zh_CN',
  events: 'input|blur',
  errorBagName: 'errorBags',
  fieldsBagName: 'fieldBags',
};
Vue.use(VeeValidate, config);

const dictionary = {
  en: {
    // attributes and messages
  },
  zh_CN: {
    optionContent:'建议内容',
    optionName:'建议名称',
    optionType:'意见类型',

    messages:{
      required:function (name) {return name + '不能为空' },
      email: function () {return '邮箱格式无效' },
      is: function(field) {return '两次输入的密码不一致';},
      is_not: function(field){return '账号和密码不能相同'}
    },
    attributes:{
      email:'邮箱',
      username:'账户',
      phone: '手机号',
      mobile: '手机号',
      userPhone: '手机号',
      suggestionUserName:'建议者名字',
      suggestionUserPhone:'建议者手机号',
      permanentAddress:'家庭住址',
      emergencyContact:'紧急联系人',
      dateOfBirth:'出生年月日',
      password:'密码',
      oldPassword:'原始密码',
      newPassword:'新密码',
      confirmPassword:'第二次密码',
      optionContent:'建议内容',
      optionName:'建议名称',
      userEmail:'邮箱',
      userName:'用户名'
    }
  }
};

Validator.localize('zh_CN', zh_CN);
Validator.localize('zh_CN', dictionary.zh_CN);

//配置验证规则
const validateRules = {
  mobile: {
    getMessage: (field, [args]) => `请输入正确格式的手机号码`,
    validate: (value, [args]) => {
      return value.length == 11 && /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/.test(value);
    }
  },
  password: {
    getMessage: (field) => `密码需为5-20位数字与字母组合`,
    validate: value => {
      // let reg = /^([A-Z]|[a-z]|[0-9]){5,20}$/;
      let reg1 = /\d+/;
      let reg2 = /[a-zA-Z]/;
      return value.length >= 5 && value.length <= 20 && reg1.test(value) && reg2.test(value);
      // return reg.test(value);
    }
  },
  name:{
    getMessage: (field) => '请输入中文名字(2~4)位',
    validate: value =>{
      return /^[\u4e00-\u9fa5]{2,4}$/.test(value)
    }
  },
  email:{
    getMessage:field => '请输入正确的邮箱格式',
    validate: value => {
      let isEmail =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return isEmail.test(value);
    }
  },
  isValueSame:{
    getMessage: (field,oldVal) => '新密码和原密码不能一样',
    validate:(oldVal, newVal) =>{
      return oldVal === newVal;
    }

  },
  idCard:{
    getMessage:(field) => `请输入正确的身份证号码`,
    validate: (value, [args]) => {
      return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
    }
  },
  isNull:{
    getMessage:(field) =>'此项不能为空！！！',
    validate: (value) => {
      return /^\s*$/g.test(value);
    }
  }


}
//添加验证规则
Object.keys(validateRules).forEach((key) => {
  Validator.extend(key, validateRules[key]);
});


