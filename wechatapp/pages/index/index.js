// index.js
Page({
  data: {
    rooms:[],
    currentRoom: {},
  },
  onLoad() {
    // 模拟从后台获取商品数据
    this.getRooms();
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
  getRooms(){
    const rooms = [
      {"name":"A101","capacity":50,"device":["projector","white board"]},
      {"name":"A102","capacity":50,"device":["projector","white board"]},
      {"name":"A103","capacity":50,"device":["projector","white board"]},
      {"name":"B101","capacity":30,"device":["white board"]},
      {"name":"B102","capacity":30,"device":["white board"]},
      {"name":"B103","capacity":30,"device":["white board"]},
      {"name":"C101","capacity":20,"device":[""]},
      {"name":"C102","capacity":20,"device":[""]},
      {"name":"C103","capacity":20,"device":[""]},
    ];
    this.setData({rooms})
  },
  openDrawer(e){    
    this.setData({
      isDrawerVisible: true,
      currentRoom: this.data.rooms[e.currentTarget.dataset.index],
    })
  },
  closeDrawer(){
    this.setData({
      isDrawerVisible: false, 
      currentRoom: {},
    })
  }
})
