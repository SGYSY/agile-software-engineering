// pages/myorders/myorders.js
// const app = getApp()
// import {request} from "../../request/index.js"  
// import {formatTime,formatDate} from "../../utils/util.js"
Page({


  data: {

   userId:-1,
   locationPicker:{
    column:["ALL","Building A, Floor 2","Building A, Floor 3","Building A, Floor 4",
    "Foreign Language Network Building, Floor 6","Foreign Language Network Building, Floor 1"],
    columnIndex:0,
   },
   weekPicker:{
    column:["ALL",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    columnIndex:0,
   },
   statusPicker:{
    column:["ALL","confirmed","unconfirmed"],
    columnIndex:0,
   },
    inputValue:"",
    filtedOrders:[],
    orderlist:[{
      status:-1,
      roomname:"A207",
      usingtime:"2025-3-21 20:00-21:00",
      ordertime:"2025-3-21 02:45",
      address:"Network Building"
    },
  ],
  // show the element of filter
  showfilter: false,
  },


  onLoad: function () {
    // getmyorders(this);
  },
  showdetailoforder(e){
    console.log(e)
    wx.navigateTo({
      url: `../orderdetails/orderdetails`,
      success: function(res) {
        console.log(e.currentTarget.dataset.item);
        res.eventChannel.emit('orderdata', { data:e.currentTarget.dataset.item })
      }
    })
  },
  onReady: function () {
    this.picker = this.selectComponent('#hidden-Picker');
  },

  async onShow() {
    const app = getApp(); 
    app.fetchUserID(this)
      .then(() => {
        this.getOrdersInfo();
      })
      .catch((error) => {
        console.error("Error in onShow:", error);
      })
      .finally(() => {
        this.getOrdersInfo();
      });
  },

  onHide: function () {

  },

  onUnload: function () {
  },


  onPullDownRefresh: function () {
    this.getOrdersInfo();
  },

  onReachBottom: function () {
  },

  onShareAppMessage: function () {

  },
  getOrdersInfo(){
    if (this.data.userId === -1){
      this.setData({orderlist:{},filtedOrders:{}});
      wx.showToast({
        title: 'please login',
        icon: 'none'
      });
      return;
    }
    wx.request({
      url: `http://47.113.186.66:8080/api/bookings/user/${this.data.userId}`, 
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        this.setData({orderlist:res.data,filtedOrders:res.data});
      },
      fail: (err) => {
      }
    });
  },
  handleInput(e){
    const value = e.detail.value;
    this.setData({
      inputValue: value
    });
    console.log(this.data.inputValue);
  },

  // filter
  filtWithName(){
    if(!this.data.inputValue){        
      wx.showToast({
        title: 'input value is null',
        icon: 'none'
      });
      this.setData({filtedOrders: this.data.orderlist});
    } else {
      try {
        const regex = new RegExp(this.data.inputValue, 'i');
        const matchedOrderlists = this.data.filtedOrders.filter(filtedOrders => regex.test(filtedOrders.room.name));
        this.setData({filtedOrders:matchedOrderlists});
      } catch (e) {
        wx.showToast({
          title: 'found error in Regex',
          icon: 'none'
        });
      }
    }
  },
  showFilter(){
    this.setData({showfilter:true})
  },
  unshowFilter(){
    this.setData({
      showfilter:false,
      filtedOrders: this.data.orderlist,
    });
  },
  //locationPicker
  locationPickerChange: function(e) {
    this.setData({
      "locationPicker.columnIndex": e.detail.value,
    });
  },  
  //weekPicker
  weekPickerChange: function(e) {
    this.setData({
      "weekPicker.columnIndex": e.detail.value,
    });
  },  
  //statusPicker
  statusPickerChange: function(e) {
    this.setData({
      "statusPicker.columnIndex": e.detail.value,
    });
  },
  // advanced filter
  filtOrders() {
    const tmpOrderlists = [...this.data.orderlist]; 
    let filteredOrders = [...tmpOrderlists]; 
  
    // location
    if (Number(this.data.locationPicker.columnIndex) !== 0) {
      console.log(this.data.locationPicker.columnIndex);
      const regex = new RegExp(this.data.locationPicker.column[this.data.locationPicker.columnIndex], 'i');
      filteredOrders = filteredOrders.filter(item => regex.test(item.room.location));
    }
  
    // week
    if (Number(this.data.weekPicker.columnIndex) !== 0) {
      console.log(this.data.weekPicker.columnIndex);
      const num = Number(this.data.weekPicker.column[this.data.weekPicker.columnIndex]);
      filteredOrders = filteredOrders.filter(item => item.weekNumber === num);
    }
  
    // status
    if (Number(this.data.statusPicker.columnIndex) !== 0) {
      console.log(this.data.statusPicker.columnIndex);
      const regex = new RegExp(this.data.statusPicker.column[this.data.statusPicker.columnIndex], 'i');
      filteredOrders = filteredOrders.filter(item => regex.test(item.status));
    }
    this.setData({ 
        filtedOrders: filteredOrders,
        showfilter:false,
     });
  },
  fectchUserID(){
    const that = this;
    wx.getStorage({
      key: 'loginuser',
      success: function (res) {
        if ("id" in res.data){ 
          that.setData({userId:res.data.id});
        } else{
          that.setData({userId:-1});
          console.error('fail to get user id', err);
        }
      },
      fail: function (err) {
        console.error('fail to get user id', err);
      }
    });
  },
})


function getmyorders(that) {
  let localOrders = wx.getStorageSync('myOrders') || [];

  if (!localOrders.length) {
    wx.setStorageSync('myOrders', []);
  }

  // by names
  localOrders.sort((a, b) => {
    var ay = a.ordertime.split(' ')[0];
    var by = b.ordertime.split(' ')[0];
    var at = a.ordertime.split(' ')[1];
    var bt = b.ordertime.split(' ')[1];
    if (ay < by) return 1;
    else if (ay > by) return -1;
    else return at > bt ? -1 : 1;
  });

  // update data of page
  that.setData({ orderlist: localOrders });
}
