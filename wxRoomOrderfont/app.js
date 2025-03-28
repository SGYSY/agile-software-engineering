import {request} from "./request/index.js"
App({
  onLaunch() {
    var that = this
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    // clean up storage
     wx.clearStorage({
      success: function (res) {
        console.log('successfully clean the storage');
      },
      fail: function (err) {
        console.error('fail to clean the storage', err);
      }
    });
  },
  // get userId
  fetchUserID(page) {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: 'loginuser',
        success: function(res) {
          if ("id" in res.data) { 
            page.setData({ userId: res.data.id });
            resolve();
          } else {
            page.setData({ userId: -1 });
            console.error('fail to get user id');
            reject(new Error('fail to get user id'));
          }
        },
        fail: function(err) {
          page.setData({ userId: -1 });
          console.error('fail to get user id', err);
          reject(err); 
        }
      });
    });
  },
  globalData: {
    userInfo: null,
    rulereadtime:3,
    canIlogin:0
  }
})
