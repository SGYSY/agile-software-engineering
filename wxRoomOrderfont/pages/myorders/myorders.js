/**
 * @Author: YJR-1100
 * @Date: 2022-03-25 17:21:08
 * @LastEditors: YJR-1100
 * @LastEditTime: 2022-04-15 21:40:18
 * @FilePath: \wx_RoomOrder\wxRoomOrderfont\pages\myorders\myorders.js
 * @Description: 
 * @
 * @Copyright (c) 2022 by yjr-1100/CSU, All Rights Reserved. 
 */
// pages/myorders/myorders.js
const app = getApp()
import {request} from "../../request/index.js"  
import {formatTime,formatDate} from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*
    # -1 未审核
    # 0  不通过
    # 1  通过
    */
    orderlist:[{
      status:-1,
      roomname:"635",
      usingtime:"2022-12-13 8:00-9:00",
      ordertime:"2022-12-12 04:23",
      address:"Network Building"
    }
  ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log("加载订单列表");
    getmyorders(this);
  },
  showdetailoforder(e){
    console.log(e)
    wx.navigateTo({
      url: `../orderdetails/orderdetails`,
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('orderdata', { data:e.currentTarget.dataset.item })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    getmyorders(this,this.data.options)
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


function getmyorders(that) {
  // 从本地存储获取订单列表
  let localOrders = wx.getStorageSync('myOrders') || [];

  // 如果本地存储中没有订单，初始化一个空数组
  if (!localOrders.length) {
    wx.setStorageSync('myOrders', []);
  }

  // 按时间排序
  localOrders.sort((a, b) => {
    var ay = a.ordertime.split(' ')[0];
    var by = b.ordertime.split(' ')[0];
    var at = a.ordertime.split(' ')[1];
    var bt = b.ordertime.split(' ')[1];
    if (ay < by) return 1;
    else if (ay > by) return -1;
    else return at > bt ? -1 : 1;
  });

  // 更新页面数据
  that.setData({ orderlist: localOrders });
}
