Page({
    data: {
      reservationList: []  // 待审核预约列表
    },
  
    back: function() {
      wx.navigateBack({
        delta: 1  // 返回上一个页面
      });
    },
  
    onLoad: function() {
      this.fetchReservations();
    },
  
    // 获取待审核预约数据（示例中使用假数据，实际请调用接口）
    fetchReservations: function() {
      // 模拟数据获取，添加更多示例预约
      const dummyData = [
        {
          id: 1,
          studentName: '张三',
          roomName: '自习室A',
          startTime: '10:00',
          endTime: '12:00',
          submitTime: '2025-03-10 09:30',
          reason: '希望提前预定'
        },
        {
          id: 2,
          studentName: '李四',
          roomName: '自习室B',
          startTime: '14:00',
          endTime: '16:00',
          submitTime: '2025-03-10 10:00'
        },
        {
          id: 3,
          studentName: '王五',
          roomName: '自习室C',
          startTime: '09:00',
          endTime: '10:00',
          submitTime: '2025-03-10 08:30',
          reason: '早起学习'
        },
        {
          id: 4,
          studentName: '赵六',
          roomName: '自习室D',
          startTime: '13:00',
          endTime: '15:00',
          submitTime: '2025-03-10 09:50',
          reason: '课后复习'
        },
        {
          id: 5,
          studentName: '周七',
          roomName: '自习室E',
          startTime: '16:00',
          endTime: '18:00',
          submitTime: '2025-03-10 12:30'
        },
        {
          id: 6,
          studentName: '孙八',
          roomName: '自习室F',
          startTime: '18:00',
          endTime: '20:00',
          submitTime: '2025-03-10 14:00',
          reason: '晚间自习'
        }
      ];
      this.setData({
        reservationList: dummyData
      });
    },
  
    // 通过预约申请
    approveReservation: function(e) {
      const id = e.currentTarget.dataset.id;
      wx.showModal({
        title: '确认操作',
        content: '是否确认通过该预约申请？',
        success: (res) => {
          if (res.confirm) {
            // 调用接口处理审批逻辑
            console.log(`通过预约ID：${id}`);
            // 更新数据，示例直接从列表中移除
            this.updateReservationStatus(id, 'approved');
          }
        }
      });
    },
  
    // 拒绝预约申请
    rejectReservation: function(e) {
      const id = e.currentTarget.dataset.id;
      wx.showModal({
        title: '确认操作',
        content: '是否确认拒绝该预约申请？',
        success: (res) => {
          if (res.confirm) {
            // 调用接口处理拒绝逻辑
            console.log(`拒绝预约ID：${id}`);
            this.updateReservationStatus(id, 'rejected');
          }
        }
      });
    },
  
    // 更新预约状态（示例：直接移除审核过的项）
    updateReservationStatus: function(id, status) {
      const updatedList = this.data.reservationList.filter(item => item.id !== id);
      this.setData({
        reservationList: updatedList
      });
      wx.showToast({
        title: status === 'approved' ? '已通过' : '已拒绝',
        icon: 'success'
      });
    }
  });
  