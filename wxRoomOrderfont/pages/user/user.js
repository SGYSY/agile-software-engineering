// pages/user/user.js
const app = getApp()
import {request} from "../../request/index.js"  
Page({


  data: {
    loginUser:{},
    ifLogin:false,
  },
  onLoad(options) {
    this.fectchUser();
  },


  
  onReady() {

  },


  
  onShow() {
    this.fectchUser();
  },


  
  onHide() {

  },


  
  onUnload() {

  },


  
  onPullDownRefresh() {

  },


  
  onReachBottom() {

  },
  gotoLogin(){
    wx.navigateTo({
      url: '/pages/emaillogin/emaillogin',
      success: function(res) {
      },
      fail: function(err) {
      },
      complete: function(res) {
      }
    });
  },
  fectchUser(){
    const that = this;
    wx.getStorage({
      key: 'loginuser',
      success: function (res) {
        that.setData({loginUser:res.data,ifLogin:true});
      },
      fail: function (err) {
      }
    });
  },
  editmyinfo(){
    wx.navigateTo({
      url: '/pages/edituserinfo/edituserinfo',
      success: function(res) {
      },
      fail: function(err) {
      },
      complete: function(res) {
      }
    });
  },
  userQuit(){
    this.setData({
      ifLogin: false,
      loginUser: {},
    });
    // delete user in storage
    wx.removeStorage({
      key: 'loginuser', 
      success: function (res) {
      },
      fail: function (err) {
      },
      complete: function (res) {
        const pages = getCurrentPages(); 
        const orderPage = pages.find(page => page.route === 'pages/myorders/myorders');
        if (orderPage) {
          orderPage.setData({
            orderlist: [],
          });
        } else {
          console.log('order page does not exist');
        }
      }
    });
    this.onLoad(this.options);
  },
  deleteTest(){
    // delete the orders of the previous user
    const pages = getCurrentPages(); 
    console.log(pages);
    const orderPage = pages.find(page => page.route === `pages/index/index`); 
    if (orderPage) {
      orderPage.setData({
        orderlist: [],
      });
      console.log("deleteTest");
    } else {
      console.log('order page does not exist');
    }
  }
})