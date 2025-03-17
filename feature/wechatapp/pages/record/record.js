// pages/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    records:[],
    currentRecord:{},
    isDrawerVisible: false,
    isFloatingVisible: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 模拟从后台获取商品数据
    this.getRecords();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  getRecords(){
    const records = [
      {"name":"A101","capacity":50,"device":["projector","white board"],"time":"11-1","state":"unexpired"},
      {"name":"A102","capacity":50,"device":["projector","white board"],"time":"11-2","state":"unexpired"},
      {"name":"A103","capacity":50,"device":["projector","white board"],"time":"11-3","state":"expired"},
      {"name":"B101","capacity":30,"device":["white board"],"time":"11-4","state":"unexpired"},
      {"name":"B102","capacity":30,"device":["white board"],"time":"11-5","state":"unexpired"},
      {"name":"B103","capacity":30,"device":["white board"],"time":"12-1","state":"expired"},
      {"name":"C101","capacity":20,"device":[""],"time":"12-2","state":"unexpired"},
      {"name":"C102","capacity":20,"device":[""],"time":"12-3","state":"unexpired"},
      {"name":"C103","capacity":20,"device":[""],"time":"12-4","state":"expired"},
    ];
    console.log(records)
    this.setData({records})
  },
  onPageScroll(e) {
    // 监听页面滚动事件
    if (e.scrollTop > 300) { // 当滚动距离超过300px时显示悬浮窗
      this.setData({
        isFloatingVisible: true
      });
    } else {
      this.setData({
        isFloatingVisible: false
      });
    }
  },
  backToTop() {
    // 返回顶部
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  },
  openDrawer(e){    
    this.setData({
      isDrawerVisible: true,
      currentRecord: this.data.records[e.currentTarget.dataset.index],
    })
  },
  closeDrawer(){
    this.setData({
      isDrawerVisible: false, 
      currentRecord: {},
    })
  },
})