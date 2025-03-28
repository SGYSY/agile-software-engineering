Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    }
  },
  data: {
    issueName: "",
    description: ""
  },
  methods: {
    onIssueNameChange(event) {
      this.setData({ issueName: event.detail.value });
    },
    onDescriptionChange(event) {
      this.setData({ description: event.detail.value });
    },
    submitIssue() {
      const { issueName, description } = this.data;
      if (!issueName || !description) {
        wx.showToast({ title: "请填写完整信息", icon: "none" });
        return;
      }

      this.triggerEvent("submitIssue", { issueName, description });
    },
    onClose() {
      // 关闭时清空输入
      this.setData({ issueName: "", description: "" });
      this.triggerEvent("closePopup");
    }
  }
});