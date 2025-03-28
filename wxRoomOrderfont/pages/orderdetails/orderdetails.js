Page({

  data: {
    isFloatingVisible: false,
    modified:{},
    timeHose:[
      {"startTime":"08:00:00","endTime":"08:45:00"},
      {"startTime":"08:55:00","endTime":"09:40:00"},
      {"startTime":"10:00:00","endTime":"10:45:00"},
      {"startTime":"10:55:00","endTime":"11:40:00"},
      {"startTime":"14:00:00","endTime":"14:45:00"},
      {"startTime":"14:55:00","endTime":"15:40:00"},
      {"startTime":"16:00:00","endTime":"16:45:00"},
      {"startTime":"16:55:00","endTime":"17:40:00"},
      {"startTime":"19:00:00","endTime":"19:45:00"},
      {"startTime":"19:55:00","endTime":"20:40:00"},
    ],
    weekColumn:["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16"],
    dayColumn:[
      "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"
    ],
    timeHoseIndex:"",
    order: {
    },
    zhankai:true
  },

  onLoad: function (options) {
    console.log(options)
    var that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('orderdata', function(data) {
      console.log(data)
      that.setData({
        order:data.data,
        modified: data.data,
        checkername:"Teacher",
        "username": "James",
        oid:2549999
      })
      if(data.data.autograph){
        that.setData({
          [`order.autograph`]:data.data.autograph.split(';'),
        })
      }
    })
  },
  clickzhankai(){
    this.setData({
      zhankai:!this.data.zhankai,
      checkername:"Teacher",
        "username": "James",
        oid:2549999
    })
  },
  
  onReady: function () {

  },

  onShow: function () {
  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },
  cancelOrder(){
    wx.request({
      url: `http://47.113.186.66:8080/api/bookings/${this.data.order.id}`, 
      method: "DELETE",
      header: {
        'content-type': 'application/json' 
      },
      success: (res) => {
        wx.showToast({
          title: 'cancel done',
          icon: 'success'
        });
      },
      fail: (err) => {
        wx.showToast({
          title: 'cancel fail',
          icon: 'none'
        });
      }
    });
    wx.navigateBack({
      delta: 1
    });
  },
  chooseTime(e){
    const timeIndex = e.currentTarget.dataset.index;
    this.setData({
      'modified.startTime': this.data.timeHose[timeIndex].startTime,
      'modified.endTime': this.data.timeHose[timeIndex].endTime,
    });
    console.log(this.data.modified.startTime);
  },
  bindWeekChange(e){
    this.setData({
      'modified.weekNumber': this.data.weekColumn[e.detail.value],
    });
    console.log(this.data.modified.weekNumber);
  },
  bindDayChange(e){
    this.setData({
    'modified.dayOfWeek': e.detail.value+1,
    });    
    console.log(this.data.modified.dayOfWeek);
  },
  cancelModify(){
    this.setData({
      isFloatingVisible: false,
    });
  },
})