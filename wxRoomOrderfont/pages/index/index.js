// index.js


const app = getApp()
import {request} from "../../request/index.js"  
Page({


  data: {
    swiperimage:[],
    noimage:"https://cdn.jsdelivr.net/gh/yjr-1100/Photobag/roomorderimage/202203261650698.jpg",
    tmpIamge:"%E4%BA%92%E5%8A%A8%E7%A0%94%E8%AE%A8%E5%AE%A431",
    rooms: [],  
    filtedrooms:[],
    roomColumn:["roomName","location"],
    columnIndex: "0",
    userId:-1,
        //-------------------filter
        capFilterText: 'capacity',
        capPickerValue: [],
        capPickText: [],
    
        locFilterText: 'location',
        locPickerValue: [],
        locPickText: [],
      },
        formatter(item) {
          const { value, label } = item;
          if (value === '北京市') {
            return {
              value,
              label: label.substring(0, 2),
            };
          }
          return item;
        },
        // ------------------------filter

  //request for rooms
  fetchRooms: function() {
    wx.request({
      url: 'http://47.113.186.66:8080/api/rooms',  
      method: 'GET',  
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            rooms: res.data, 
            filtedrooms:res.data,
          },() => {//---------------------------filter
            this.setCapPickText();
            this.setLocPickText()
          });
        } else {
          console.log('请求失败，状态码:', res.statusCode);
        }
      },
      fail: (error) => {
        console.log('请求失败:', error);  
      }
    });
  },


  onLoad: function () {
    console.log("Loading Book Page");
    this.fetchRooms(); 
    this.setData({
      swiperimage: [
        "http://st2sjmp3d.hn-bkt.clouddn.com/banner1.jpg",
        "http://st2sjmp3d.hn-bkt.clouddn.com/banner2.jpg"
      ],
      //--------------------------------filter
      locFilterText: 'Location', 
      capFilterText: 'Capacity', 
      //--------------------------------filter
    });
  },
  gotoroomorder: function(e) {
    if (this.data.userId === -1){
      wx.showToast({
        title: 'please login',
        icon: 'none'
      });
      return;
    }
    var index = e.currentTarget.dataset.index;
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: `../roomdetail/roomdetail`,  
      success: function(res) {
        res.eventChannel.emit('classdata', { data: index});
      }
    });
  },
  

  onReady: function () {
    console.log("indexonReady")
  },


  onShow: function () {
    const app = getApp(); 
    app.fetchUserID(this);
    console.log("首页显示");
  },


  onHide: function () {
    console.log("indexonHide")
  },


  onUnload: function () {
    console.log("onUnload")
  },


  onPullDownRefresh: function () {
    
  },


  onReachBottom: function () {
    
  },


  onShareAppMessage: function () {
    
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      columnIndex: e.detail.value
    });
  },
  handleInput(e){
    const value = e.detail.value;
    this.setData({
      inputValue: value
    });
    console.log(this.data.inputValue);
  },
  //-----------------------------------------filter
  filterRooms() {
    let filteredRooms = this.data.filtedrooms;
  
    // filt with capacity
    if (this.data.capPickerValue.length > 0) {
      filteredRooms = filteredRooms.filter(room => room.capacity == this.data.capPickerValue);
    }
  
    // filt with location
    if (this.data.locPickerValue.length > 0) {
      filteredRooms = filteredRooms.filter(room => room.location.split(",")[0].trim() == this.data.locPickerValue);
    }
  
    this.setData({ filtedrooms: filteredRooms });
  },

  filtRooms(){
    if(!this.data.inputValue){
      console.log("input value in null");
      this.setData({filtedrooms: this.data.filtedrooms});
    } else {
      if(this.data.columnIndex === "0"){
        try {
          const regex = new RegExp(this.data.inputValue, 'i');
          const matchedRoomlists = this.data.rooms.filter(room => regex.test(room.name));
          this.setData({filtedrooms:matchedRoomlists});
        } catch (e) {
          wx.showToast({
            title: 'regular expression error',
            icon: 'none'
          });
        }
      }else if(this.data.columnIndex === "1"){
        try {
          const regex = new RegExp(this.data.inputValue, 'i');
          const matchedRoomlists = this.data.rooms.filter(room => regex.test(room.location));
          this.setData({filtedrooms:matchedRoomlists});
        } catch (e) {
          wx.showToast({
            title: 'regular expression error',
            icon: 'none'
          });
        }
      }
    }
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
        }
      },
      fail: function (err) {
      }
    });
  },

  //-----------------------------------------filter
  onCapColumnChange(e) {
    console.log('picker pick:', e);
  },

  onCapPickerChange(e) {
    const { key } = e.currentTarget.dataset;
    const { value } = e.detail;


    console.log('picker change:', e.detail);
    this.setData({
      [`${key}Visible`]: false,
      [`${key}Value`]: value,
      capFilterText: value.join(' '),
      capPickerValue: value,
    }, this.filterRooms);
  },

  onCapPickerCancel(e) {
    const { key } = e.currentTarget.dataset;
    console.log(e, 'cnacel');
    console.log('picker1 cancel:');
    this.setData({
      [`${key}Visible`]: false,
    });
  },

  onCapPicker() {
    this.setData({ capPickerVisible: true });
  },

  setCapPickText() {
    // 1. Extract the capacity and deduplicate and sort it
    const uniqueCapacities = [...new Set(this.data.rooms.map(room => room.capacity))].sort((a, b) => a - b);

    // 2. to a capPickText structure
    const pickTexts = uniqueCapacities.map(capacity => ({
      label: capacity,
      value: capacity
    }));

    // 3. update data
    this.setData({ capPickText: pickTexts});
  },

  onLocColumnChange(e) {
    console.log('picker pick:', e);
  },

  onLocPickerChange(e) {
    const { key } = e.currentTarget.dataset;
    const { value } = e.detail;



    console.log('picker change:', e.detail);
    this.setData({
      [`${key}Visible`]: false,
      [`${key}Value`]: value,
      locFilterText: value.join(' '),
      locPickerValue: value,
    }, this.filterRooms);
  },

  onCLocPickerCancel(e) {
    const { key } = e.currentTarget.dataset;
    console.log(e, '取消');
    console.log('picker1 cancel:');
    this.setData({
      [`${key}Visible`]: false,
    });
  },

  onLocPicker() {
    this.setData({ locPickerVisible: true });
  },

  setLocPickText() {
    // 1. Extract the capacity and deduplicate and sort it
    const uniqueLocacities = [...new Set(this.data.rooms.map(room => room.location.split(",")[0].trim()))].sort((a, b) => a - b);

    // 2. to a capPickText structure
    const pickTexts = uniqueLocacities.map(location => ({
      label: location,
      value: location
    }));

    // 3. update data
    this.setData({ locPickText: pickTexts});
  },

  resetFilters() {
    this.setData({
      capPickerValue: [],  // clear capacity 
      capFilterText: 'Capacity', 
      locPickerValue: [],  // clear location 
      locFilterText: 'Location', 
      filtedrooms: this.data.rooms 
    });
  }
  //-----------------------------------------filter
})