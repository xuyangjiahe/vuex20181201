import Vue from 'vue';
import iView from "iview";

var cloudroom = {
  // 插件是否初始化
  g_isRefresh:false,

  g_is_init: false,
  // g_server_addr: '192.168.1.224:2727',
  g_server_addr: 'www.cloudroom.com',
  //是否是主持人身份 1-是 0-否
  g_master: 1,
  //创建会议返回id
  g_main_id: '', // 主视频的ID
  g_meet_id: '',
  g_meet_pswd: '',
  //会议号
  g_meet_number: '',
  g_nick_name: '',
  g_user_id: '',
  g_me_user_id: '',
  g_logining: '',
  //自己是否开启屏幕共享
  g_meScreenShare : false,
  g_otherScreenShare: false,
  // 是否在会议中
  g_meeting : false,
  // 屏幕共享对象
  g_screenShareObj: null,
  g_screenShareX : 0,
  g_screenShareY : 0,
  g_screenShareWidth : 0,
  g_screenShareHeight : 0,
  g_startRecord: false,
  cr_account: 'demo@cloudroom.com',
  // cr_pwd: '123456'//'e10adc3949ba59abbe56e057f20f883e',
  cr_pwd: 'e10adc3949ba59abbe56e057f20f883e',
  // 视频码率
  video_size_arr :[[0,0,0],[160,96,70],[224,128,96],[288,160,123],[352,192,146],[448,256,200],[512,288,250],[576,320,300],[640,360,350],[704,400,420],[864,480,500],[1024,576,650],[1280,720,1000],[1920,1080,2000]],
  //清晰度
  QingXiDu:{
      chaoqing:{
        sizeType: CRVideo_VIDEO_SHOW_SIZE.VIDEO_SZ_720,
        fps: 25,
        maxbps: 1000*1000,
        qp_min: 22,
        qp_max: 18,
        wh_rate: 0
      },
      gaoqing:{
        sizeType: CRVideo_VIDEO_SHOW_SIZE.VIDEO_SZ_360,
        fps: 15,
        maxbps: 350*1000,
        qp_min: 22,
        qp_max: 25,
        wh_rate: 0
      },
      liuchang:{
        sizeType: CRVideo_VIDEO_SHOW_SIZE.VIDEO_SZ_160,
        fps: 5,
        maxbps: 123*1000,
        qp_min: 22,
        qp_max: 36,
        wh_rate: 0
      }
  },
  netQualityEnum:{
    you:'优',
    liang:'良',
    cha:'差'
  },
  g_recording : false,//是否正在录制
  //视频是否正在上传
  g_uploading: false,
  //录制视频的文件名称
  g_record: '',
  //录制视频的宽度初始值
  // g_recordWidth: 640,
  g_recordWidth:840,
  //录制视频的高度初始值
  g_recordHeight: 360,
  //录制视频码率的初始值
  g_bitRate: 350000,
  //录制视频帧率的初始值
  g_frameRate: 10,
  //是否边录边传
  g_isUploadOnRecording: 0,
  //录制视频的上传限制初始值 kb/s
  g_FURate: 100*1024,
  /**
   * 是否启用多摄像头 1-开启 0-关闭
   */
  g_muti_video: 1,
  //白板相关
  g_boardObj: null,
  g_board_id : "",//会议白板ID
  g_board_id2 : "",//文档白板
  g_pageCount : 1,//类型
  g_login_name : "test",
  g_lineColor : {"opacity":1, "color": "#01009a"},
  g_lineNum : 2,
  g_boardWidth : parseInt(window.document.body.offsetWidth * 0.6 * 0.93),
  g_openFile : "",//文件
  g_boardHeight : parseInt(this.g_boardWidth*9/16),
  /**
   * 目录地址
   * @returns {string}
   */
  g_location_dir: function(){
    var location_dir = location.href;
    if(location_dir.indexOf("http") > -1){
      location_dir = "C:/Users/Public/"
    }else{
      var end = location_dir.lastIndexOf('/');
      var start = location_dir.indexOf('file:///');
      if(start > -1) {
        start = 8;
      }else {
        start = 0;
      }
      location_dir = location_dir.slice(start,end)+"/home/";
      location_dir = decodeURIComponent(location_dir);
    }
    console.log(location_dir)
    return location_dir;
  },
  /**
   * 初始化
   * @param userId
   * @param nickname
   */
  init: function(userId, nickname){
    this.g_user_id = userId;
    this.g_nick_name = nickname;
    // 插件是否初始化
    if(!this.g_is_init) {
      let location_dir  = "C:/Users/Public/";//this.g_location_dir();
      console.log('location_dir : ' + location_dir)
      let result = CRVideo_Init2(location_dir);

      if(result == CRVideo_WEB_OCX_NOTINSTALLED) {
        // 没有安装
        this.popTip("当前使用的是插件版浏览器，请先安装插件!");
        return;
      } else if(result == CRVideo_OCX_VERSION_NOTUPPORTED) {
        // 版本过低
        this.popTip("当前插件版本过低!");
        return;
      } else if(result == CRVideo_WEB_BROWER_NOTUPPORTED) {
        // 不支持的浏览器
        this.popTip("当前浏览器不支持，请使用谷歌或者360极速浏览器!");
        return;
      } else if(result != 0) {
        // 其他错误
        this.popTip("初始化错误:"+ result);
        return;
      } else {
        this.g_is_init = true;
      }
    }
    CRVideo_SetServerAddr(this.g_server_addr);
    CRVideo_Login(this.cr_account, this.cr_pwd, this.g_nick_name, this.g_user_id, "");
  },
  /**
   * 创建并进入会议
   * @param meetingName 会议名称
   */
  createMeeting: function(meetingName){
    CRVideo_CreateMeeting(meetingName);
  },
  /**
   * 会议号入会
   * @param meetNumber 会议号
   * @param password 密码
   * @param userId 用户id
   * @param nickname 用户昵称
   */
  enterMeeting: function(meetNumber, password, userId, nickname){
    CRVideo_EnterMeeting(meetNumber, password, userId, nickname);
  },
  /**
   * 会议号入会
   * @param meetNumber
   */
  enterMeeting2: function(meetNumber, userId, nickname){
    console.log('enterMeeting2： ' + meetNumber)
    console.log((meetNumber, "", userId, nickname));
    CRVideo_EnterMeeting(meetNumber, "", this.g_user_id, this.g_nick_name);
  },
  /**
   * 打开或关闭摄像头
   * @param userId
   * @param callback
   */
  openOrCloseCamera: function(userId, callback){
    // VUNKNOWN	0	视频状态未知
    // VNULL	1	没有视频设备
    // VCLOSE	2	视频处于关闭状态（软开关）
    // VOPEN	3	视频处于打开状态（软开关）
    // VOPENING	4	向服务器发送打开消息中
    let vStatus = CRVideo_GetVideoStatus(userId);
    if(vStatus == 0 || vStatus == 1) {
      this.popTip("没有可打开的视频设备");
    }else if(vStatus == 3){
      console.log('视频处于打开状态（软开关）')
      CRVideo_CloseVideo(userId);
    }else if(vStatus == 2){
      console.log('视频处于关闭状态（软开关）')
      CRVideo_OpenVideo(userId);
    }
    callback(vStatus);
  },
  /**
   * 打开或关闭麦克风
   * @param userId
   * @param callback
   */
  openOrCloseMicrophone: function(userId, callback){
    // 代码	数值	含义
    // AUNKNOWN	0	音频状态未知
    // ANULL	1	没有麦克风设备
    // ACLOSE	2	麦克风处于关闭状态（软开关）
    // AOPEN	3	麦克风处于打开状态（软开关）
    // AOPENING	4	向服务器发送打开消息中
    var aStatus = CRVideo_GetAudioStatus(userId);
    if(aStatus == 0 || aStatus == 1) {
      this.$layer("没有可打开的音频设备");
    }else if(aStatus == 3){
      // 如果没有禁音
      CRVideo_CloseMic(userId);
    }else if(aStatus == 2){
      CRVideo_OpenMic(userId);
    }
    callback(aStatus);
  },
  /**
   * 设置video清晰度,支持的参数有：{"disabled": 取值0/1}，1:代表不启用此摄像头；
   * @param videoId
   * @param qixidu
   */
  setVideoDefinition: function(videoId, q){
    CRVideo_SetLocVideoAttributes(videoId, q)
  },
  /**
   * 设置全局视频配置
   */
  setGlobalVideoConfig: function(cfg){
    CRVideo_SetVideoCfg(cfg);
  },
  /**
   * 打开摄像头
   * @param userId
   */
  openAllCamera: function (userId, callback) {
    CRVideo_OpenVideo(userId);
    callback();
  },
  openCamera: function (userId, videoId, callback) {
    // CRVideo_OpenVideo(userId);
    CRVideo_SetLocVideoAttributes(videoId, {"disabled": 0})
    callback();
  },
  openRemoteCamera:  function (userId, videoId, callback) {
    CRVideo_OpenVideo(userId);
    callback();
  },
  /**
   * 关闭所有摄像头
   * @param userId
   */
  closeAllCamera: function (userId) {
    CRVideo_CloseVideo(userId)
  },
  closeCamera: function(userId, videoId, callback){
    console.log('userId')
    console.log(userId, videoId)
    CRVideo_SetLocVideoAttributes(videoId, {"disabled": 1})
  },
  /**
   * 打开麦克风
   * @param userId
   */
  openMicrophone: function (userId) {
    // 打开麦克风
    CRVideo_OpenMic(userId);
  },
  /**
   * 关闭麦克风
   * @param userId
   */
  closeMicrophone: function (userId) {
    CRVideo_CloseMic(userId);
  },
  /**
   * 获取所有加入成员
   * @returns {any}
   */
  getAllMembers: function(){
    return JSON.parse(CRVideo_GetAllMembers());
  },
  /**
   * 全体禁言
   */
  muteAllVoice: function () {
    CRVideo_SetAllAudioClose()
  },
  /**
   * 取消全体禁言
   */
  unmuteAllVoice: function () {

  },
  /**
   * 发送小块数据(一次性发送不会有进度通知,发送结果事件CRVideo_SendCmdRlst,CRVideo_SendCmd不能被CRVideo_CancelSend)
   * @access public
   * @param {string} targetUserId  - 目标用户ID
   * @param {string} data - 发送的数据
   * @returns {string} 分配的任务ID
   */
  sendCmd: function(userId, data){
    var sendCmdID = CRVideo_SendCmd(userId,data);
  },
  /**
   * 发送IM消息
   * 响应事件CRVideo_SendIMmsgRlst
   * @access public
   * @param {string} text - 发送的文本消息
   * @param {string} UserID - 目标用户，如果用户ID为空，消息发送给会议内所有用户
   * @param {string} cookie - 自定义用户数据
   * @returns {string} - 任务id
   */
  sendMsg: function(text,userId, cookie){
    CRVideo_SendIMmsg(text,userId,cookie);
  },
  createBoard: function(){
    let that = this;
    that.g_boardObj = CRVideo_CreatBoardObj();
    setTimeout(function(){
      that.g_boardObj.width(960);
      that.g_boardObj.height(540);
    },500);

    $(window).resize(function () {
      that.g_boardObj.width(1);
      that.g_boardObj.height(1);
      that.g_boardObj.width(960);
      that.g_boardObj.height(540);
      that.g_boardObj.style("position","absolute");
      that.g_boardObj.style("left",0);
      that.g_boardObj.style("top",0);
      $("#whiteBoard").css({"left":0,"top":0})
    });
  },
  /**
   * 退出会议
   */
  exitMeeting: function(){
    CRVideo_ExitMeeting();
    CRVideo_SetDNDStatus(0);
  },
  /**
   * 开始录制
   */
  startRecord: function(videos,callback){
    var g_nowRecSrvDir;  // 保证srt与对应视频文件同目录
    var date = new Date();
    var year = date.getFullYear();
    var month = f(date.getMonth()+1);
    var day = f(date.getDate());
    var hour = f(date.getHours());
    var minute = f(date.getMinutes());
    var second = f(date.getSeconds());
    g_nowRecSrvDir = "/" + year + "-" + month + "-" + day + "/";
    function f(val) {
      return (val < 10 ? ('0'+val):(val));
    }
    this.g_record = year + "-" + month + "-" + day + "_" + hour+'-' + minute + '-' + second + "_Web" +".mp4";
    //本地录制
    // let location_dir  = "C:/Users/Public/";
    // var recParam = {"filePathName": location_dir + this.g_record,"recordWidth": this.g_recordWidth ,"recordHeight": this.g_recordHeight,"frameRate": this.g_frameRate,"bitRate":this.g_bitRate,"defaultQP":22,"isUploadOnRecording": this.g_isUploadOnRecording,"serverPathFileName": g_nowRecSrvDir + this.g_record};
    // CRVideo_StartRecordIng2(recParam);

    //云端录制
    var serverRecordConfig =	{"filePathName":this.g_record,"recordWidth": this.g_recordWidth ,"recordHeight": this.g_recordHeight,"frameRate": this.g_frameRate,"bitRate": this.g_bitRate,"defaultQP":22,"serverPathFileName": g_nowRecSrvDir +  this.g_record};
    this.g_recording = true;
    // 云端录制 结束
    this.g_startRecord = true;
    console.log('serverRecordConfig: ')
    console.log(serverRecordConfig)
    //第二步 计算布局
    this.setRecordVideosLayout(serverRecordConfig,videos);
    // 设置录制信息
    callback();
  },
  /**
   *
   * @param videos
   * @param layout
   */
  setRecordVideosLayout: function(serverRecordConfig, videos, layout){
    let recContents = [];
    let sWidth,sHeight,sX,sY;
    if(this.g_recordHeight* 16/9 > this.g_recordWidth) {
      sWidth = this.g_recordWidth;
      sHeight = this.g_recordWidth/16*9;
      sX = 0;
      sY = (this.g_recordHeight - sHeight)/2;
    }else {
      sWidth = this.g_recordHeight*16/9;
      sHeight = this.g_recordHeight;
      sX = (this.g_recordWidth - sWidth)/2;
      sY = 0;
    }
    console.log(videos)
    console.log('videos.length : ' + videos.length)
    if(videos.length == 1){
      console.log('拼装参数..............')
      videos.forEach(function (video, index) {
        let videoContent = {};
        videoContent["type"] = CRVideo_REC_VCONTENT_TYPE.RECVTP_VIDEO;
        videoContent["left"] = 0;
        videoContent["top"] = 0;
        videoContent["width"] = sWidth;
        videoContent["height"] = sHeight;
        videoContent["param"] = {"camid": video.userID + "." + video.videoID};
        recContents.push(videoContent);
      })
    }else if(videos.length == 2){
      videos.forEach(function (video, index) {
        let videoContent = {};
        switch (index) {
          case 0:
            videoContent["type"] = CRVideo_REC_VCONTENT_TYPE.RECVTP_VIDEO;
            videoContent["left"] = 0;
            videoContent["top"] = 0;
            videoContent["width"] = sWidth/2;
            videoContent["height"] = sHeight;
            videoContent["param"] = {"camid": video.userID + "." + video.videoID};
            break;
          case 1:
            videoContent["type"] = CRVideo_REC_VCONTENT_TYPE.RECVTP_VIDEO;
            videoContent["left"] = 0+sWidth/2;
            videoContent["top"] = 0;
            videoContent["width"] = sWidth/2;
            videoContent["height"] = sHeight;
            videoContent["param"] = {"camid": video.userID + "." + video.videoID};
            break;
        }
        recContents.push(videoContent);
      })
    }else if(videos.length == 3){
      videos.forEach(function (video, index) {
        let videoContent = {};
        switch (index) {
          case 0:
            videoContent["type"] = CRVideo_REC_VCONTENT_TYPE.RECVTP_VIDEO;
            videoContent["left"] = sWidth/4;
            videoContent["top"] = 0;
            videoContent["width"] = sWidth/2;
            videoContent["height"] = sHeight/2;
            videoContent["param"] = {"camid": video.userID + "." + video.videoID};
            break;
          case 1:
            videoContent["type"] = CRVideo_REC_VCONTENT_TYPE.RECVTP_VIDEO;
            videoContent["left"] = 0;
            videoContent["top"] = sHeight/2;
            videoContent["width"] = sWidth/2;
            videoContent["height"] = sHeight/2;
            videoContent["param"] = {"camid": video.userID + "." + video.videoID};
            break;
          case 2:
            videoContent["type"] = CRVideo_REC_VCONTENT_TYPE.RECVTP_VIDEO;
            videoContent["left"] = 0+sWidth/2;
            videoContent["top"] = sHeight/2;
            videoContent["width"] = sWidth/2;
            videoContent["height"] = sHeight/2;
            videoContent["param"] = {"camid": video.userID + "." + video.videoID};
            break;
        }
        recContents.push(videoContent);
      })
    }else if(videos.length == 4){
      videos.forEach(function (video, index) {
        let videoContent = {};
        switch (index) {
          case 0:
            videoContent["type"] = CRVideo_REC_VCONTENT_TYPE.RECVTP_VIDEO;
            videoContent["left"] = 0;
            videoContent["top"] = 0;
            videoContent["width"] = sWidth/2;
            videoContent["height"] = sHeight/2;
            videoContent["param"] = {"camid": video.userID + "." + video.videoID};
            break;
          case 1:
            videoContent["type"] = CRVideo_REC_VCONTENT_TYPE.RECVTP_VIDEO;
            videoContent["left"] = 0+sWidth/2;
            videoContent["top"] = 0;
            videoContent["width"] = sWidth/2;
            videoContent["height"] = sHeight/2;
            videoContent["param"] = {"camid": video.userID + "." + video.videoID};
            break;
          case 2:
            videoContent["type"] = CRVideo_REC_VCONTENT_TYPE.RECVTP_VIDEO;
            videoContent["left"] = 0;
            videoContent["top"] = sHeight/2;
            videoContent["width"] = sWidth/2;
            videoContent["height"] = sHeight/2;
            videoContent["param"] = {"camid": video.userID + "." + video.videoID};
            break;
          case 3:
            videoContent["type"] = CRVideo_REC_VCONTENT_TYPE.RECVTP_VIDEO;
            videoContent["left"] = 0+sWidth/2;
            videoContent["top"] = sHeight/2;
            videoContent["width"] = sWidth/2;
            videoContent["height"] = sHeight/2;
            videoContent["param"] = {"camid": video.userID + "." + video.videoID};
            break;
        }
        recContents.push(videoContent);
      })
    }else if(videos.length == 5){
      videos.forEach(function (video, index) {
        let videoContent = {};
        switch (index) {
          case 0:
            videoContent["type"] = CRVideo_REC_VCONTENT_TYPE.RECVTP_VIDEO;
            videoContent["left"] = 0;
            videoContent["top"] = 0;
            videoContent["width"] = sWidth;
            videoContent["height"] = sHeight/2*3;
            videoContent["param"] = {"camid": video.userID + "." + video.videoID};
            break;
          case 1:
            videoContent["type"] = CRVideo_REC_VCONTENT_TYPE.RECVTP_VIDEO;
            videoContent["left"] = 0;
            videoContent["top"] = 0 + sHeight/2*3;
            videoContent["width"] = sWidth/4;
            videoContent["height"] = sHeight/3;
            videoContent["param"] = {"camid": video.userID + "." + video.videoID};
            break;
          case 2:
            videoContent["type"] = CRVideo_REC_VCONTENT_TYPE.RECVTP_VIDEO;
            videoContent["left"] = 0 + sWidth/4;
            videoContent["top"] = 0 + sHeight/2*3;
            videoContent["width"] = sWidth/4;
            videoContent["height"] = sHeight/3;
            videoContent["param"] = {"camid": video.userID + "." + video.videoID};
            break;
          case 3:
            videoContent["type"] = CRVideo_REC_VCONTENT_TYPE.RECVTP_VIDEO;
            videoContent["left"] = 0+sWidth/2;
            videoContent["top"] = sHeight/2*3;
            videoContent["width"] = sWidth/4;
            videoContent["height"] = sHeight/3;
            videoContent["param"] = {"camid": video.userID + "." + video.videoID};
            break;
          case 4:
            videoContent["type"] = CRVideo_REC_VCONTENT_TYPE.RECVTP_VIDEO;
            videoContent["left"] = 0+sWidth*3/4;
            videoContent["top"] = sHeight/2*3;
            videoContent["width"] = sWidth/4;
            videoContent["height"] = sHeight/3;
            videoContent["param"] = {"camid": video.userID + "." + video.videoID};
            break;
        }
        recContents.push(videoContent);
      })
    }
    console.log('recContents ...')
    console.log(recContents)
    //本地录制
    // CRVideo_SetRecordVideos(recContents);
    //云端录制
    CRVideo_StartSvrRecording(serverRecordConfig, recContents);
  },
  /**
   * 结束录制
   * @constructor
   */
  stopRecord: function(callback){
    // 服务端录制
    CRVideo_StopSvrRecording();
    var data = CRVideo_GetSvrRecordInfo();


    //客户端录制
    // CRVideo_StopRecord();
    this.g_startRecord = false;
    this.g_recording = false;
    callback(data);
  },
  /**
   * 所有录制文件
   */
  getAllRecordFiles: function(){
    return CRVideo_GetAllRecordFiles();
  },
  /**
   * 开启屏幕共享
   */
  startScreenShare: function(){
    if(this.g_meScreenShare) {
      this.poptip("正在屏幕共享中");
      return;
    }

    var obj = {}
    obj.encodeType = 0;
    this.g_screenShareX = 0;
    this.g_screenShareY = 0;
    CRVideo_SetScreenShareCfg(obj);

    CRVideo_StartScreenShare();
  },
  getUserNickname: function(userId){
      return CRVideo_GetMemberNickName(userId);
  },
  /**
   * 获取成员信息
   * @param userId
   * @returns {
   *userID	string	用户ID
   *nickname	string	昵称
   *audioStatus	CRVideo_ASTATUS	音频状态，数值参考麦克风状态
   *videoStatus	CRVideo_VSTATUS	视频状态，数值参考视频状态定义}
   */
  getMemberInfo: function(userId){
    return CRVideo_GetMemberInfo(userId);
  },
  //   云屋所有回调开始
  /**
   * 创建会议成功会回调
   * @param callback
   */
  createMeetingSuccessCallback: function(callback){
    let that = this;
    CRVideo_CreateMeetingSuccess.callback = function(meetObj, cookie) {
      that.g_meet_id = meetObj.ID;
      that.g_meet_pswd = meetObj.pswd;
      that.enterMeeting(that.g_meet_id, that.g_meet_pswd,that.g_user_id, that.g_nick_name);
      callback();
    }
  },
  /**
   * 创建会议失败回调
   * @param callback
   */
  createMeetingFailCallback: function(callback){
    let that = this;
    CRVideo_CreateMeetingFail.callback = function(sdkErr,cookie) {
      that.g_meet_id = null;
      that.g_meet_pswd = null;
      that.popTip("创建会议失败 错误码:"+ sdkErr);
      callback();
    }
  },
  /**
   * 进入会议的结果回调
   * @param callback
   */
  enterMeetingRsltCallback: function(callback){
    let that = this;
    CRVideo_EnterMeetingRslt.callback = function(sdkErr) {
      if(sdkErr == CRVideo_NOERR){
          that.g_meeting = true;
         // 设置呼叫免打扰
          CRVideo_SetDNDStatus(1);
          // 默认开启多摄像头
          callback(sdkErr)
      }else{
        if(sdkErr == 803) {
          that.popTip("分配会议资源失败！");
          CRVideo_ExitMeeting();
          that.g_meeting = false;
        } else if(sdkErr == 800) {
          that.popTip("会议不存在或已结束！");
          CRVideo_ExitMeeting();
          that.g_meeting = false;
        } else {
          that.g_meeting = false;
          // if(that.g_meet_id) {
          //   CRVideo_EnterMeeting(that.g_meet_id, that.g_meet_pswd, that.g_user_id, that.g_nick_name);
          // } else if(that.g_meet_number) {
          //   CRVideo_EnterMeeting(that.g_meet_number, "", that.g_user_id, that.g_nick_name);
          // }
        }
      }
    }
  },
  /**
   * 启用多个摄像头
   * @param userId
   */
  setEnableMutiVideo: function(userId){
    CRVideo_SetEnableMutiVideo(userId,this.g_muti_video);
  },
  /**
   * 用户加入房间回调
   * @param callback
   */
  userJoinCallback: function(callback){
    CRVideo_UserEnterMeeting.callback = function(usrID) {
      callback(usrID)
    }
  },
  /**
   * 用户离开回调
   * @param callback
   */
  userLeftCallback: function(callback){
    // 某用户离开了会议
    let that = this;
    CRVideo_UserLeftMeeting.callback = function(id) {
      that.popTip("【" + id + "】离开了会议");
      callback(id)
    }
  },
  /**
   * 用户离线
   */
  userLineOffCallback: function(){
    let that = this;
    CRVideo_LineOff.callback = function(sdkErr) {
      //layer.msg('会话离线');
      that.$layer.open({
        type : 0,
        area: '400px',
        title : ['提示', 'font-size:14px;'],
        closeBtn: 0,
        content: "会话离线:  "+sdkErr,
        btn: ['确定'],
        success:function(){
          if(g_meeting) {
            // videoContainerHide();
          }
        },
        yes: function(index, layero){
          if(that.g_meeting) {
            if(that.g_meScreenShare){
              CRVideo_StopScreenShare()
              if(that.g_meScreenShare) {
                that.g_meScreenShare = false;
              }
            }
            CRVideo_ExitMeeting();
            that.g_meeting = false;
          }
          that.$layer.close(index);
        }
      });
    }
  },
  /**
   * 会议掉线
   */
  meetingDroppedCallback: function(callback){
    // if(this.g_meet_id) {
    //   CRVideo_EnterMeeting(this.g_meet_id, this.g_meet_pswd, this.g_user_id, this.g_nick_name);
    // } else if(this.g_meet_number) {
    //   CRVideo_EnterMeeting(this.g_meet_number, "", this.g_user_id, this.g_nick_name);
    // }
    callback();
  },
  /**
   * 摄像头状态改变
   * @param callback
   */
  videoStatusChangedCallback: function(callback){
// 摄像头状态改变
    CRVideo_VideoStatusChanged.callback = function(userID, oldStatus, newStatus) {
      //更新视频列表
      //更新用户列表
      callback(userID, newStatus);
    }
  },
  /**
   * 摄像头设备改变
   */
  videoDevChangedCallback: function(){
    let that = this;
    CRVideo_VideoDevChanged.callback = function(userID) {
      console.log('that g_meeting ' + that.g_meeting)
      if(that.g_meeting) {
        // updateVideo();
        callback(userID)
        var vStatus = CRVideo_GetVideoStatus(userID);
        if(vStatus == 0) {
          // 	// 没有可打开的音频设备
          //meetTip("没有可打开的视频设备");
        }else if(vStatus == 3){
          // 如果没有禁音
          CRVideo_OpenVideo(userID);
        }else if(vStatus == 2){
          CRVideo_OpenVideo(userID);
        }
      }
    }
  },
  /**
   * 麦克风状态改变
   */
  audioStatusChangedCallback: function(callback){
    let that = this;
    // AUNKNOWN	0	音频状态未知
    // ANULL	1	没有麦克风设备
    // ACLOSE	2	麦克风处于关闭状态（软开关）
    // AOPEN	3	麦克风处于打开状态（软开关）
    // AOPENING	4	向服务器发送打开消息中
    CRVideo_AudioStatusChanged.callback = function(userID, oldStatus, newStatus) {
      // setMemberList(); // 会议成员列表
      callback(userID, newStatus)
      // var memberList = JSON.parse(CRVideo_GetAllMembers());
      // if(memberList != undefined) {
      //   if(newStatus == 3) {
      //     for(var i = 0; i < memberList.length; i++) {
      //       // if(userID == $("#member_flag"+i+"").html()) {
      //       //   // $("#member_flag"+i+"").siblings(".icon_mic img").attr("src","image/voice_1.png");
      //       //   // $("#member_flag"+i+"").siblings(".icon_mic").attr("title","3");
      //       // }
      //     }
      //   }else if(newStatus == 2) {
      //     // for(var i = 0; i < memberList.length; i++) {
      //     //   if(userID == $("#member_flag"+i+"").html()) {
      //     //     // $("#member_flag"+i+"").siblings(".icon_mic img").attr("src","image/mic_close1.png");
      //     //     // $("#member_flag"+i+"").siblings(".icon_mic").attr("title","2");
      //     //   }
      //     // }
      //   }
      // }
    }
  },
  /**
   * 麦克风声音变化(可以用于激励)
   */
  micEnergyUpdateCallback: function(callback){
    CRVideo_MicEnergyUpdate.callback = function(userID,oldLevel,newLevel) {
      callback(userID,oldLevel,newLevel)
      // var memberList = $.parseJSON(CRVideo_GetAllMembers());
      // var macImg = "image/voice_1.png";
      // if(newLevel == 0){
      //   macImg = "image/voice_1.png";
      // }else if(newLevel == 1 || newLevel == 2){
      //   macImg = "image/voice_2.png";
      // }else if(newLevel == 3){
      //   macImg = "image/voice_3.png";
      // }else if(newLevel == 4){
      //   macImg = "image/voice_4.png";
      // }else if(newLevel == 5){
      //   macImg = "image/voice_5.png";
      // };
      // if(memberList.length > 0) {
      //   for(var i = 0; i < memberList.length; i++) {
      //     if(userID == $("#member_flag"+i+"").html()){
      //       if($("#member_flag"+i+"").siblings(".icon_mic").attr("title") == "3"){
      //         // 如果没有禁音
      //         $("#member_flag"+i+"").siblings(".icon_mic").children().attr("src",macImg);
      //       }else{
      //         $("#member_flag"+i+"").siblings(".icon_mic").children().attr("src","image/mic_close1.png");
      //       }
      //     }
      //   }
      // }
    }
  },
  /**
   * 通知我的网络变化 0-10
   */
  netStateChangedCallback: function(callback){
    let that = this;
    CRVideo_NetStateChanged.callback = function(level){
      callback(that.netQuality(level))
    }
  },
  /**
   * SDK通知主视频更改
   */
  notifyMainVideoChangedCallback: function(){
    let that = this;
    CRVideo_NotifyMainVideoChanged.callback = function() {
      that.g_main_id = CRVideo_GetMainVideo();
    }
  },
  /**
   * SDK通知功能切换
   */
  notifySwitchToPageCallback: function(){
    let that = this;
    CRVideo_NotifySwitchToPage.callback = function(mainPage,pageID) {
      // $('.meetingDetail_tab_left li').removeClass("onmeetingDetail");
      // if((window.navigator.userAgent.match(/chrome/i) != null) && window.chrome){
      //   if(mainPage == 0){
      //     videoContainerShow();
      //     $('.meetingDetail_tab_items').css("display","none");
      //   }else if(mainPage == 1){
      //     videoContainerHide();
      //     setTimeout(function(){
      //       $('.meetingDetail_tab_items').eq(1).siblings().css("display","none"); //排除隐藏“1”自己
      //     }, 100);
      //   }else {
      //     $('.meetingDetail_tab_items').css("display","none");
      //   }
      // }else{
      //   $('.meetingDetail_tab_items').css("display","none");
      // }
      // if(mainPage == 0) {
      //   g_current_page = mainPage;
      //   $('.meetingDetail_tab_left li').eq(0).addClass("onmeetingDetail");
      //   $('.meetingDetail_tab_items').eq(0).css("display","block");
      //   if(g_meet_mode == 2 || g_meet_mode == 0) {
      //     $('.meetingDetail_radio_bg').removeClass('onradio');
      //     $('.meetingDetail_radio_bg').eq(0).addClass('onradio');
      //     modeTwo();
      //   } else if(g_meet_mode == 3) {
      //     $('.meetingDetail_radio_bg').removeClass('onradio');
      //     $('.meetingDetail_radio_bg').eq(1).addClass('onradio');
      //     modeFour();
      //   } else if(g_meet_mode == 5) {
      //     $('.meetingDetail_radio_bg').removeClass('onradio');
      //     $('.meetingDetail_radio_bg').eq(2).addClass('onradio');
      //     modeSix();
      //   }
      //   updateVideo();
      // } else if(mainPage == 1) {
      //   $('.meetingDetail_tab_left li').eq(1).addClass("onmeetingDetail");
      //   $('.meetingDetail_tab_items').eq(1).css("display","block");
      //   if((window.navigator.userAgent.match(/chrome/i) != null) && window.chrome){
      //     updateScreenShare();
      //   }
      // } else if(mainPage == 2) {
      //   $('.meetingDetail_tab_left li').eq(2).addClass("onmeetingDetail");
      //   $('.meetingDetail_tab_items').eq(2).css("display","block");
      // }
    }
  },
  /**
   * 开启屏幕共享的响应事件 本人开启
   */
  startScreenShareRsltCallback: function(){
    let that = this;
    CRVideo_StartScreenShareRslt.callback = function(sdkErr) {
      if(sdkErr == 0) {
        that.g_meScreenShare = true;     //自己是否开启
        // $("#screenShareContainer").hide();
      }
    }
  },
  /**
   * 通知他人开启了屏幕共享，只有当他人开启，本地展示显示的div  同时屏幕共享的红框应该隐藏
   */
  notifyScreenShareStartedCallback: function(callback){
    let that = this;
    CRVideo_NotifyScreenShareStarted.callback = function() {
      that.g_otherScreenShare = true;
      // // if(g_screenShareObj){
      // // 	console.log("CRVideo_NotifyScreenShareStarted")
      // // 	g_screenShareObj.clear();
      // // }
      // $("#screenShareContainer").css({"display":"block","left":"0px","top":"0px","width":"980px","height":"600px","overflow":"hidden"})
      // g_screenShareObj.width(980);
      // g_screenShareObj.height(600);
      // g_screenShareObj.keepAspectRatio(1);
      // //CRVideo_StopScreenShare();
      callback();
    }
  },
  notifyScreenShareStoppedCallback: function() {
    // 通知他人停止了屏幕共享,本地的展示框应该隐藏并清除遗留残影
    let that = this;
    CRVideo_NotifyScreenShareStopped.callback = function () {
      if (that.g_otherScreenShare) {
        that.g_otherScreenShare = false;
      }
      CRVideo_StopScreenShare();
      if (that.g_screenShareObj) {
        that.g_screenShareObj.clear();
      }
      // $("#screenShareContainer").hide();
      if (that.g_screenShareObj) {
        that.g_screenShareObj.width(1);
        that.g_screenShareObj.height(1);
      }

    }
  },
  /**
   * 停止屏幕共享的响应事件 本人停止,需要将窗口关闭，将红框隐藏
   */
  stopScreenShareRsltCallback: function(){
    let that = this;
    CRVideo_StopScreenShareRslt.callback = function(sdkErr) {
      if(sdkErr == 0) {
        that.g_meScreenShare = false;
        // $("#screenShareContainer").hide();
        if(that.g_screenShareObj){
          that.g_screenShareObj.width(1);
          that.g_screenShareObj.height(1);
        }
      }
    }
  },
  /**
   * SDK通知视频分屏模式切换
   */
  notifyVideoWallModeCallback: function(){
    CRVideo_NotifyVideoWallMode.callback = function(model) {
      if(model == 2) {
        // g_meet_mode = 2;
        // modeTwo();
        // updateVideo();
        // $('.meetingDetail_radio_bg').removeClass('onradio');
        // $('.meetingDetail_radio_bg').eq(0).addClass('onradio');
      } else if(model == 3) {
        // g_meet_mode = 3;
        // modeFour();
        // updateVideo();
        // $('.meetingDetail_radio_bg').removeClass('onradio');
        // $('.meetingDetail_radio_bg').eq(1).addClass('onradio');
      } else if(model == 5) {
        // g_meet_mode = 5;
        // modeSix();
        // updateVideo();
        // $('.meetingDetail_radio_bg').removeClass('onradio');
        // $('.meetingDetail_radio_bg').eq(2).addClass('onradio');
      }
    }
  },
  /**
   * 收到命令消息回调
   */
  notifyCmdDataCallback: function(callback){
    /**
     * SDK通知收到小块数据
     * @callback CRVideo.CbProxy~CRVideo_NotifyCmdData
     * @param {string} sourceUserId - 数据来源
     * @param {string} data - 数据
     */
    CRVideo_NotifyCmdData.callback = function(userId, data){
      callback(userId, data);
    }
  },
  /**
   *发送消息结果回调
   */
  sendIMmsgRlstCallback: function(callback){
    /**
     * 发送IM消息，SDK通知使用者发送结果
     * @callback CRVideo.CbProxy~CRVideo_SendIMmsgRlst
     * @param {string} taskID - 发送任务id
     * @param {number} sdkErr - 操作结果代码,定义见cr/error
     * @param {string} cookie - 自定义用户数据
     */
    CRVideo_SendIMmsgRlst.callback=function(taskID,sdkErr,cookie){
      callback(taskID, sdkErr);
    }
  },
  /**
   * 收到消息回调
   * @param callback
   */
  notifyIMmsgCallback: function(callback){
    /**
     * SDK通知收到IM消息
     * @callback CRVideo.CbProxy~CRVideo_NotifyIMmsg
     * @param {string} fromUserID - 消息来源
     * @param {string} text - 消息内容
     * @param {number} sendTime - 消息发送时间戳，从1970开始算起
     */
    CRVideo_NotifyIMmsg.callback= function(fromUserID, text, sendTime){
      callback(fromUserID, text, sendTime)
    }
  },
  /**
   * 录制异常，录制将自动停止
   */
  recordErrCallback: function(callback){
    CRVideo_RecordErr.callback=function(sdkErr){
      callback(sdkErr);
    }
  },
  /**
   * sdk通知录制文件状态更改 fileName本地文件路径 state - 状态 0 未上传 1 上传中 2已上传
   * @param callback
   */
  notifyRecordFileStateChangedCallback: function(callback){
    CRVideo_NotifyRecordFileStateChanged.callback=function(fileName,state){
      callback(fileName,state)
    }
  },
  notifyCoverSuccessCallback: function(callback){
    CRVideo_NotifyCoverSuccess.callback = function(coverRsltObjs) {
      //文档转换成功

      console.log('CRVideo_NotifyCoverSuccess............')
      // console.log(boardList)
      // g_boardObj.width(1);
      // g_boardObj.height(1);
      // $(".page_num").text("1/" + boardList.length + "页")
      // $("#page_progress").show();
      // $(".file_upload").text("文档转换成功");
      // $(".file_upload").show();

      callback(coverRsltObjs);
    }
  },
  notifyCoverFailedCallback: function(callback){
    CRVideo_NotifyCoverFailed.callback = function(coverErr){
      //文档转换失败
      //coverErr=0，代表传输失败
      //coverErr=1，代表转换失败
      console.log('转换文件失败....')
      console.log(coverErr)
      // if(coverErr == 0){
      //   g_boardObj.width(1)
      //   g_boardObj.height(1)
      //   $("#page_progress").show();
      //   $(".file_upload").text("文档上传失败！");
      //   $(".file_upload").show();
      //   setTimeout(function(){
      //     $("#whiteBoard").show();
      //     g_boardObj.width(960)
      //     g_boardObj.height(540)
      //     $("#page_progress").hide();
      //   },2000)
      // }else if(coverErr == 1){
      //   g_boardObj.width(1)
      //   g_boardObj.height(1)
      //   $("#page_progress").show();
      //   $(".file_upload").text("文档转换失败");
      //   $(".file_upload").show();
      //   setTimeout(function(){
      //     $("#whiteBoard").show();
      //     g_boardObj.width(960)
      //     g_boardObj.height(540)
      //     $("#page_progress").hide();
      //   },2000)
      // }

    }
  },
  notifyCoverStateChangeCallback: function(callback){
    CRVideo_NotifyCoverStateChange.callback = function(jsonState){
      //state=0，代表上传中，param的值为上传进度； state=1，代表等待服务器处理； state=2，代表文档转换中
      if(jsonState.state == 0){
        // g_boardObj.width(1)
        // g_boardObj.height(1)
        // $("#page_progress").show();
        console.log("文档上传中...." +jsonState.param + "%");
        // $(".file_upload").show();
      }else if(jsonState.state == 1){
        // g_boardObj.width(1)
        // g_boardObj.height(1)
        // $("#page_progress").show();
        console.log("服务器处理中.....");
        // $(".file_upload").show();
      }else if(jsonState.state == 2){
        // g_boardObj.width(1)
        // g_boardObj.height(1)
        // $("#page_progress").show();
        console.log("文档转换中...");
        // $(".file_upload").show();
      }
    }
  },
  /**
   * 注销
   */
  logout: function(){
    CRVideo_Logout();
  },
  /**
   * 登录成功回调
   * @param callback
   */
  loginSuccessCallback: function (callback) {
    let that = this;
    CRVideo_LoginSuccess.callback = function(usrID,cookie) {
      that.g_me_user_id = usrID;
      that.g_logining = true;
      callback(usrID,cookie);
    };
  },
  /**
   * 登录失败回调
   * @param callback
   */
  loginFailCallback: function(callback){
    CRVideo_LoginFail.callback = function(sdkErr,cookie) {
      console.error("【loginFail】 error : " + sdkErr);
      callback()
    }
  },
  /**
   * 云端开始录制回调事件
   * @param callback
   */
  serverRecordStateChangedCallback: function(callback){
    CRVideo_SvrRecordStateChanged.callback = function(state,err){
      callback(state,err)
    };
  },
  /**
   * 初始化白板回调事件
   */
  notifyInitBoardsCallback: function(){
    let that = this;
    CRVideo_NotifyInitBoards.callback = function (boardObjs) {
      if(boardObjs.length > 0){
        var board_id = boardObjs[0]
        that.g_board_id = board_id.boardID;
        that.g_pageCount = board_id.pageCount;
      }

    }
  },
  //监听白板被创建
  notifyCreateBoardCallback: function(){
    CRVideo_NotifyCreateBoard.callback = function(jsonBoard,operatorID){
      //{ "boardID": "xx", "title": "board_1", "width": 1024, "height": 768, "pageCount": 1}
    }
  },
  //通知白板被关闭
  notifyCloseBoardCallback: function(){
    CRVideo_NotifyCloseBoard.callback = function(boardID,operatorID){
      //console.log(boardID,operatorID)
    }
  },
  /**
   * 销毁对象
   * @param obj
   */
  destroyDynamicObj(obj){
    if(obj){
      //1.remove from dom 2.delete handler 3._handler = null 4.delete obj
      var rmObj1 = document.getElementById(obj.id());
      if(rmObj1){
        var p = rmObj1.parentNode;
        if(p){p.innerHTML='';}  //1.
        rmObj1 = null;
        var handler = obj.handler();
        // noinspection JSAnnotator
        // delete handler; //2.
         obj.handler(null); //3.
        // noinspection JSAnnotator
        // delete obj; //4.
        obj = null;
      }
    }
  },
  popTip: function(msg) {
    iView.Notice.error({
      title: '提示',
      desc: msg,
      duration: 5,
      render: h => {
        return h('span',{
            style:{
              fontSize: '16px',
            }
          },
          msg,
        )
      }
    });
  },
  msg: function(msg) {
    iView.Notice.success({
      title: '提示',
      desc: msg,
      duration: 5,
      render: h => {
        return h('span',{
            style:{
              fontSize: '16px',
            }
          },
          msg,
        )
      }
    });
  },
  netQuality: function (level) {
    switch (level) {
      case 0:
      case 1:
      case 2:
      case 3:
         return this.netQualityEnum.cha;
      case 4:
      case 5:
      case 6:
      case 7:
        return this.netQualityEnum.liang;
      case 8:
      case 9:
      case 10:
        return this.netQualityEnum.you;
    }
  },
  pageOpenFolderCallback:function(e){
    //打开文件夹；
    this.g_openFile = CRVideo_GetOpenFileName("Open file", "", "*.* (*.*)");
    console.log('打开文件');
    console.log(this.g_openFile); //得到文件的全路径；
    if(!!this.g_openFile){
      CRVideo_CoverFile(this.g_openFile,"{}");
    }
  },
  pageRestoreCallback:function(e){
    console.log('this.g_boardObj');
    console.log(this.g_boardObj);

    this.g_boardObj.undo();
  },
  pageCancelCallback:function(){
    //撤销
    console.log('this.g_boardObj');
    console.log(this.g_boardObj);
    this.g_boardObj.redo();
  },
  pageDeleteCallback:function(){
    //删除；
    this.g_boardObj.clear();
  },
  penLineCallback:function(line){
    //钢笔线条；line 传入数字；
    console.log('line && this.g_boardObj');
    console.log(line);
    console.log(this.g_boardObj);
    if(line && this.g_boardObj){
      // g_lineNum = line.replace(/[^0-9]/g, "");
      // g_lineNum = parseInt(g_lineNum)
      this.g_boardObj.setLineWidth(this.g_lineNum)
    }


  },
  penColorCallback:function(line){
    if(line && this.g_boardObj){
      this.g_lineColor = {"opacity":1, "color": line}
      this.g_boardObj.setColor(this.g_lineColor)
    }
  },
  //上一页
  pageLastCallback:function() {
    //closeMeeting();
    var g_page = this.g_boardObj.getBoardInfo(this.g_board_id2);
    var boardId = this.g_boardObj.boardID;
    var curren = g_page.curPage + 1;
    var zon = g_page.pageCount;
    var pageNum = '';
    if (curren > 1) {
      this.g_boardObj.setCurBoard(this.g_board_id2, g_page.curPage - 1);
      // $(".page_num").text(curren - 1 + "/" + zon + "页")
      pageNum = curren - 1 + "/" + zon + "页";
      return pageNum;
    } else {
      return false
    }
  },
//下一页
pageNextCallback:function() {
  var g_page = this.g_boardObj.getBoardInfo(this.g_board_id2);
  var boardId = this.g_boardObj.boardID;
  var curren = g_page.curPage + 1;//当前是多少页
  var zon = g_page.pageCount;
  var pageNum = '';
  if(curren < zon){
    this.g_boardObj.setCurBoard(this.g_board_id2,g_page.curPage + 1);
    // $(".page_num").text(curren + 1 + "/" + zon + "页")
    pageNum = curren + 1 + "/" + zon + "页"
    return pageNum;
  }else{
    return false
  }
},
  pageCloseCallback:function() {
  var current = this.g_boardObj.getCurBoardID();
  //CRVideo_Closeboard(current);
  setTimeout(function(){
    CRVideo_Switchtopage(2, this.g_board_id)
    // this.g_boardObj.width(960);
    // this.g_boardObj.height(540);
    // $(".page_turn_file").hide();
  },1000)
},




}

export default cloudroom;
