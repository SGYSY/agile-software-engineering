// pages/edituserinfo/edituserinfo.js
Page({

  /**
   * intail data of the page
   */
  data: {
    editedisabled:false,
    loginUser:{},
    // store the modified version of user data
    modifiedUser:{},
    
  },

  /**
   * Lifecycle function - listens for page loads
   */
  onLoad: function (options) {
    this.fectchUser();
  },

  /**
   * Lifecycle function - Listen for the initial rendering of the page
   */
  onReady: function () {

  },

  /**
   * Lifecycle function - listen to the page display
   */
  onShow: function () {
    this.fectchUser();
  },

  /**
   * Lifecycle function -- listen to the page hidden
   */
  onHide: function () {

  },

  /**
   * Lifecycle function -- Listen for page unloading
   */
  onUnload: function () {

  },

  /**
   * Page-related event handler -- listens to the user's drop-down actions
   */
  onPullDownRefresh: function () {

  },

  /**
   * Handler for the page pull-bottom event
   */
  onReachBottom: function () {

  },

  /**
   * The user clicks Share in the upper right corner
   */
  onShareAppMessage: function () {

  },
  // get the user information from MiniPorgram "Storage"
  fectchUser(){
    const that = this;
    // get data from "Storage"
    wx.getStorage({
      key: 'loginuser',
      success: function (res) {
        console.log('fetched user imformation:', res.data);
        that.setData({loginUser:res.data,modifiedUser:res.data});
      },
      fail: function (err) {
        console.error('failed to fetch data', err);
      }
    });
  },
  // check and store the new phone number of user
  checkphone(e){
    // Check whether the mobile phone number is legitimate
    if(!/^(\+?0?86\-?)?1[3456789]\d{9}$/.test(e.detail.value)){
      wx.showToast({
        title: 'Wrong Phone Number',
        icon: 'error',//
        mask:true,
        duration: 1000
      })
    }else{
      // if the munber is legal, store it
      this.setData({
        'modifiedUser.phoneNumber':e.detail.value,
      });
      console.log(this.data.modifiedUser.phoneNumber);
    }
  },
  // store the new first name of user
  setuserName(e){
    this.setData({
      'modifiedUser.firstName':e.detail.value,
    });
    console.log(this.data.modifiedUser.firstName);
  },
  // store the new last name of user
  setlastname(e){
    this.setData({
      'modifiedUser.lastName':e.detail.value,
    });
    console.log(this.data.modifiedUser.lastName);
  },
  // send the data for modification to server and request for modify
  commitinfo(){
    wx.request({
      url: `http://47.113.186.66:8080/api/users/${this.data.modifiedUser.id}`,
      method: "PUT",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data:{
        "firstName": this.data.modifiedUser.firstName,
        "lastName": this.data.modifiedUser.lastName,
        "phoneNumber": this.data.modifiedUser.phoneNumber,
      },
      //if program get the response body
      success: (res) => {
        // if there is an "id" item in th response body, the request success
        if('id' in res.data){
          wx.showToast({
            title: 'edit done',
            icon: 'success'
          });
          this.storeLoginUser(res.data);
        } else {
          wx.showToast({
            title: 'edit fail',
            icon: 'none'
          });
        }
      },
      // if program does not receive a response body, the request fail
      fail: (err) => {
        wx.showToast({
          title: 'edit fail',
          icon: 'none'
        });
      }
    });
  },
  // store the new user object into "Storage"
  storeLoginUser(newdata){
    wx.setStorage({
      key: 'loginuser',
      data: newdata,
      success: function (res) {
      },
      fail: function (err) {
      }
    });
    wx.navigateBack({
      delta: 1 //Returns to the previous page
    });
  },
})