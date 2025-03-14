

/**
 * @Author: YJR-1100
 * @Date: 2022-03-21 22:06:52
 * @LastEditors: YJR-1100
 * @LastEditTime: 2022-04-16 22:14:25
 * @FilePath: \wx_RoomOrder\wxRoomOrderfont\pages\index\index.js
 * @Description: 
 * @
 * @Copyright (c) 2022 by yjr-1100/CSU, All Rights Reserved. 
 */
// index.jss

// 获取应用实例
const app = getApp()
import {request} from "../../request/index.js"  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperimage:[],
    noimage:"https://cdn.jsdelivr.net/gh/yjr-1100/Photobag/roomorderimage/202203261650698.jpg",
    classroomlist:[
      {
        "name":"635",
        "adress":"Network Building",
        "imageurl":"/images/互动研讨室1.jpg",
        "describe":"No booking"
      },
      {
        "name":"634",
        "adress":"Network Building",
        "imageurl":"/Images/互动研讨室2.jpg",
        "describe":"No booking"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log("加载首页数据");
  
    // 读取本地存储的教室数据
    let localRooms = wx.getStorageSync('classroomlist') || [];
  
    // 如果本地没有数据，初始化默认教室列表
    if (!localRooms.length) {
      localRooms = [
        {
          "name": "635",
          "adress": "Network Building",
          "imageurl": "/images/互动研讨室1.jpg",
          "describe": "No booking"
        },
        {
          "name": "634",
          "adress": "Network Building",
          "imageurl": "/images/互动研讨室2.jpg",
          "describe": "No booking"
        }
      ];
      wx.setStorageSync('classroomlist', localRooms);
    }
  
    this.setData({
      classroomlist: localRooms,
      swiperimage: [
        "/images/banner1.jpg",
        "/images/banner2.jpg"
      ]
    });
  },
  gotoroomorder:function(e){
    //当前点击的索引
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var that = this
    wx.navigateTo({
      url: `../roomdetail/roomdetail?rid=${that.data.classroomlist[index].rid}`,
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('classdata', { data:that.data.classroomlist[index] })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("indexonReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("首页显示");
    let localRooms = wx.getStorageSync('classroomlist') || [];
    this.setData({ classroomlist: localRooms });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("indexonHide")
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload")
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})