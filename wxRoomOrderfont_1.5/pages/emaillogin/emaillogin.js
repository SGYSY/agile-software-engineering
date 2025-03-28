// login.js
Page({
    data: {
      email: '', // Leave email empty by default
      captcha: '', // Leave code empty by default
      theUser: {},
    },
  
    // Handle email input change
    onEmailInput: function (e) {
      this.setData({
        email: e.detail.value
      });
    },
  
    // Handle password input change
    onCaptchaInput: function (e) {
      this.setData({
        captcha: e.detail.value
      });
    },
    GetCaptcha(){
      console.log("GetCaptcha");
      wx.request({
        url: `http://47.113.186.66:8080/api/auth/send-code`,
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data:{
          email: this.data.email,
        },
        success: (res) => {
          console.log(res.data);
          if (res.data ==="The verification code has been sent to your email. It is valid for 10 minutes.") {
            wx.showToast({
              title: 'request done',
              icon: 'success'
            });
          } else {
            wx.showToast({
              title: 'request fail',
              icon: 'none'
            });
          }

        },
        fail: (err) => {
          wx.showToast({
            title: 'request fail',
            icon: 'none'
          });
        }
      })
    },
    Login(){
      console.log("Login");
      wx.request({
        url: `http://47.113.186.66:8080/api/auth/verify-code?`,
        method: "POST",
        header: {
          'content-type': 'application/json' 
        },
        data:{
          email: this.data.email,
          code: this.data.captcha,
        },
        success: (res) => {
          this.GetLoginUser(res);
        },
        fail: (err) => {
          wx.showToast({
            title: 'login fail',
            icon: 'none'
          });
        }
      })
    },
    GetLoginUser(input){
      wx.request({
        url: `http://47.113.186.66:8080/api/users/${input.data.userId}`,
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          this.setData({theUser:res.data});
          if('id' in this.data.theUser){
            console.log('', res.data);
            wx.showToast({
              title: 'login done',
              icon: 'success'
            });
            this.storeLoginUser(res.data);
          } else {
            wx.showToast({
              title: 'login fail',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          wx.showToast({
            title: 'login fail',
            icon: 'none'
          });
        }
      });
    },
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
        delta: 1 //Back to the previous page
      });
    },
    gotoCreateUser(){
      wx.navigateTo({
        url: '/pages/createUser/createUser',
        success: function(res) {
        },
        fail: function(err) {
        },
        complete: function(res) {
        }
      });
    },
  });
  