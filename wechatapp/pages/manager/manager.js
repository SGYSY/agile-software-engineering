Page({
    data: {
      totalReservations: 120,    // 示例数据：总预约数
      pendingReservations: 15,   // 示例数据：待审核申请数
      totalRooms: 8              // 示例数据：自习室总数
    },

    back: function() {
        wx.navigateBack({
          delta: 1  // 返回上一个页面
        });
      },
  
    // 跳转到审核预约申请页面
    navigateToAudit: function() {
      wx.navigateTo({
        url: '/pages/manager/audit/audit' // 请根据实际路径调整
      });
    },
  
    // 跳转到管理自习室页面
    navigateToManageRooms: function() {
      wx.navigateTo({
        url: '/pages/manager/manageRooms/manageRooms' // 请根据实际路径调整
      });
    }
  });
  