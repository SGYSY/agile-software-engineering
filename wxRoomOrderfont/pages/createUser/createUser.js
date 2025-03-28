// pages/createUser/createUser.js
Page({

  /**
   * intail data of the page
   */
  data: {
    // to activate the role selector
    roleColumn:[1,2,3], 
    roleNameColumn:["student","teacher","administrator"],
    roleIndex:0,
    // to store other user information
    email:"",
    phoneNumber:"",
    password:"",
    firstName:"",
    lastName:"",
    username:"",
  },

  /**
   * Lifecycle function - listens for page loads
   */
  onLoad(options) {

  },

  /**
   * Lifecycle function - Listen for the initial rendering of the page
   */
  onReady() {

  },

  /**
   * Lifecycle function - listen to the page display
   */
  onShow() {

  },

  /**
   * Lifecycle function -- listen to the page hidden
   */
  onHide() {

  },

  /**
   * Lifecycle function -- Listen for page unloading
   */
  onUnload() {

  },

  /**
   * Page-related event handler -- listens to the user's drop-down actions
   */
  onPullDownRefresh() {

  },

  /**
   * Handler for the page pull-bottom event
   */
  onReachBottom() {

  },

  /**
   * The user clicks Share in the upper right corner
   */
  onShareAppMessage() {

  },
  // store the email value of new user
  setEmail(e){
    // get input value
    const value = e.detail.value;
    // store the input value
    this.setData({
      email: value
    });
    // store the username value of new user
  },setNickName(e){
    const value = e.detail.value;
    this.setData({
      username: value
    });
  },
  // store the first name and last name value of new user
  setName(e){
    // get the whole name and divide it into first name and last name
    const value = e.detail.value;
    const names = value.split(".",2);
    this.setData({
      firstName: names[0],
      lastName: names[1],
    });
  },
  // store the phone number value of new user
  setPhoneNumber(e){
    const value = e.detail.value;
    this.setData({
      phoneNumber: value
    });
  },
  // store the password value of new user
  setPassword(e){
    const value = e.detail.value;
    this.setData({
      password: value
    });
  },
  // store the row index of new user
  bindRoleChange(e){
    this.setData({
      roleIndex: Number(e.detail.value)+1,
    });
    console.log(this.data.roleIndex);
  },
  // request to create a new user with data above
  newUser(){
    wx.request({
      url: 'http://47.113.186.66:8080/api/users',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data:{
        "username": this.data.username,
        "firstName": this.data.firstName,
        "lastName": this.data.lastName,
        "email": this.data.email,
        "phoneNumber": this.data.phoneNumber,
        "passwordHash": this.data.password,
        "role": {
          "id": this.data.roleIndex
        }
      },
      //if program get the response body
      success: (res) => {
        // if there is an "id" item in th response body, the request success
        if (res.data.id){
          wx.showToast({
            title: 'creating done',
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: 'creating  fail',
            icon: 'none'
          });
        }
      },
      // if program does not receive a response body, the request fail
      fail: (err) => {
        wx.showToast({
          title: 'creating  fail',
          icon: 'none'
        });
      }
    })
  }
})