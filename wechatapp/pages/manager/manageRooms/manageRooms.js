Page({
    data: {
      roomList: [],         // 自习室列表
      showEditForm: false,  // 是否显示编辑表单弹窗
      editMode: 'add',      // 'add' 或 'edit'
      formData: {
        name: '',
        capacity: '',
        location: '',
        teacherOnly: false
      }
    },
  
    onLoad: function() {
      this.fetchRooms();
    },
  
    // 模拟获取自习室列表
    fetchRooms: function() {
      // 可根据需要添加更多数据，测试滚动效果
      const dummyData = [
        { id: 1, name: '自习室A', capacity: 30, location: '3楼', teacherOnly: false },
        { id: 2, name: '自习室B', capacity: 20, location: '4楼', teacherOnly: true },
        { id: 3, name: '自习室C', capacity: 25, location: '5楼', teacherOnly: false },
        { id: 4, name: '自习室D', capacity: 40, location: '6楼', teacherOnly: true },
        { id: 5, name: '自习室E', capacity: 15, location: '2楼', teacherOnly: false },
        { id: 6, name: '自习室F', capacity: 35, location: '1楼', teacherOnly: false }
        // ...可继续添加更多
      ];
      this.setData({
        roomList: dummyData
      });
    },
  
    // 打开新增自习室弹窗
    addRoom: function() {
      this.setData({
        showEditForm: true,
        editMode: 'add',
        formData: {
          name: '',
          capacity: '',
          location: '',
          teacherOnly: false
        }
      });
    },
  
    // 打开编辑弹窗
    editRoom: function(e) {
      const roomId = e.currentTarget.dataset.id;
      const room = this.data.roomList.find(item => item.id === roomId);
      if (room) {
        this.setData({
          showEditForm: true,
          editMode: 'edit',
          formData: {
            name: room.name,
            capacity: room.capacity,
            location: room.location,
            teacherOnly: room.teacherOnly
          }
        });
      }
    },
  
    // 关闭弹窗
    closeForm: function() {
      this.setData({
        showEditForm: false
      });
    },
  
    // 切换“仅供教师使用”属性
    onTeacherOnlyChange: function(e) {
      this.setData({
        'formData.teacherOnly': e.detail.value
      });
    },
  
    // 提交表单
    submitForm: function(e) {
      // 取出表单数据
      const formData = e.detail.value;
      // 手动补上 switch 的值
      formData.teacherOnly = this.data.formData.teacherOnly;
  
      if (this.data.editMode === 'add') {
        // 调用后台接口新增
        console.log('新增自习室：', formData);
      } else {
        // 调用后台接口编辑
        console.log('编辑自习室：', formData);
      }
      // 假装成功后关闭弹窗，并刷新列表
      this.setData({
        showEditForm: false
      });
      this.fetchRooms();
    },
  
    // 删除自习室
    deleteRoom: function(e) {
      const roomId = e.currentTarget.dataset.id;
      wx.showModal({
        title: '确认删除',
        content: '确定要删除该自习室吗？',
        success: (res) => {
          if (res.confirm) {
            console.log('删除自习室ID：', roomId);
            // 模拟删除
            const updatedList = this.data.roomList.filter(item => item.id !== roomId);
            this.setData({ roomList: updatedList });
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
          }
        }
      });
    }
  });
  