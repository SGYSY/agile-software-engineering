// pages/roomdetail/roomdetail.js
const app = getApp()

import {request} from "../../request/index.js"  
import {formatTime,formatDate} from "../../utils/util.js"
Page({
    /*---------------------------------------------------room issue-------------------------------------*/
    visible: false,
    roomID: "1",
    issueName: "",
    description: "",
/*---------------------------------------------------room issue-------------------------------------*/

  data: {
    weekDates: [], 
    userId: -1,
    activeCell: null,
    selectedTime: '',
    weeks: Array.from({length: 22}, (_, i) => (i + 1).toString()), 
    selectedWeek: '',
    timeSlots: [
        { startTime: "08:00", endTime: "08:45" },
        { startTime: "08:55", endTime: "09:40" },
        { startTime: "10:00", endTime: "10:45" },
        { startTime: "10:55", endTime: "11:40" },
        { startTime: "14:00", endTime: "14:45" },
        { startTime: "14:55", endTime: "15:40" },
        { startTime: "16:00", endTime: "16:45" },
        { startTime: "16:55", endTime: "17:40" },
        { startTime: "19:00", endTime: "19:45" },
        { startTime: "19:55", endTime: "20:40" }
      ],
      weekschedules: Array.from({ length: 7 }, () => Array(10).fill("Free")), 
    roomDetail: {}, 
    schedules: [],    
    timetable: []
  },

  /*---------------------------------------------------room issue-------------------------------------*/
  handlePopup() {
    this.setData({ visible: true });
  },
  submitIssue(event) {
    const { issueName, description } = event.detail;
    wx.request({
      url: "http://47.113.186.66:8080/api/room-issues",
      method: "POST",
      header: { "Content-Type": "application/json" },
      data: {
        room: { id: parseInt(this.data.roomDetail.id) },
        issueName,
        description
      },
      success(res) {
        if (res.statusCode === 201) {
          wx.showToast({ title: "Submit Success", icon: "success" });
        } else {
          wx.showToast({ title: "Submit Fail", icon: "error" });
        }
      },
      fail(err) {
        wx.showToast({ title: "Request Fail，Please Check Internet", icon: "none" });
      }
    });

    this.setData({ visible: false });
  },
  onClose() {
    this.setData({ visible: false });
  },
  /*---------------------------------------------------room issue-------------------------------------*/

  onCellClick: function(event) {
    const row = event.currentTarget.dataset.row; 
    const col = event.currentTarget.dataset.col; 
    const cellData = this.data.weekschedules[row][col]; 
    this.setData({
      activeCell: { row, col }, 
      selectedTime:cellData
    });

  },

onReserveClick: function() {
    const { activeCell, selectedWeek, timeSlots,selectedTime,weekDates } = this.data;
    if (!activeCell) {
      wx.showToast({
        title: 'Please a time',
        icon: 'none'
      });
      return;
    }
    if (!selectedWeek) {
      wx.showToast({
        title: 'Please choose a week',
        icon: 'none'
      });
      return;
    }
    if (selectedTime!="Free") {
        wx.showToast({
          title: 'Time unavailuable',
          icon: 'none'
        });
        return;
      }
    const timeSlot = timeSlots[activeCell.col];  
    const dayOfWeek = activeCell.row; 
    const startTime = timeSlot.startTime;
    const endTime = timeSlot.endTime;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    
    const selectedDateWithoutBrackets = weekDates[dayOfWeek].replace(/[()]/g, '');
    const [selectedMonth, selectedDay] = selectedDateWithoutBrackets.split('.').map(Number);
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    
    const currentDateTime = new Date(currentDate.getFullYear(), currentMonth, currentDay, currentHours, currentMinutes).getTime();
    const selectedDateTime = new Date(currentDate.getFullYear(), selectedMonth - 1, selectedDay, startHour, startMinute).getTime();
    
    if (currentDateTime > selectedDateTime) {
      wx.showToast({
        title: 'Cannot book past times',
        icon: 'none'
      });
      return;
    }
    
      wx.request({
        url: 'http://47.113.186.66:8080/api/bookings',  
        method: 'POST',
        header: {"Content-Type": "application/json",},
        data: {
            user: {id:this.data.userId},
            room: {id:this.data.roomDetail.id},
            weekNumber: selectedWeek,
            dayOfWeek: dayOfWeek,
            startTime: startTime,
            endTime: endTime,
            purpose: "purpose"//
        },
        success: (res) => {
          if (res.statusCode === 201) {
            wx.showToast({
              title: 'Booking success',
              icon: 'success'
            });
          } else {
            wx.showToast({
              title: 'Booking fail, Please try later',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          wx.showToast({
            title: 'Network error，Please try later',
            icon: 'none'
          });
        }
      });
  },


updateSchedule: function(event) {
    const selectedIndex = event.detail.value;  
    let weekNumber = this.data.weeks[selectedIndex];  
    this.setData({ selectedWeek: weekNumber });  
  
    if (weekNumber < 1 || weekNumber > this.data.timetable.length) {
      console.log("Invalid week number");
      return;
    }
    let weekIndex = weekNumber - 1; 
  
    
    this.setData({
      weekschedules: Array.from({ length: 7 }, () => Array(10).fill("Free"))
    });
  
    
    for (let timeIndex = 0; timeIndex < this.data.timetable[weekIndex].length; timeIndex++) {
      let weekday = this.data.timetable[weekIndex][timeIndex].weekday;  
      let name = this.data.timetable[weekIndex][timeIndex].name;  
      let period = this.data.timetable[weekIndex][timeIndex].period;  
  
      if (period >= 1 && period <= 10) {
        
        this.data.weekschedules[weekday - 1][period - 1] = name;
      }
    }
  
    
    this.setData({ weekschedules: this.data.weekschedules });
  
    
    const weekDates = this.getWeekDates(weekNumber);  
    this.setData({ weekDates });  
    
  },


  onLoad: function(options) {
    
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('classdata', (data) => {
      
      this.setData({
        roomDetail: data.data
      }, () => {
        
        this.getSchedulesByRoom(this.data.roomDetail.id);
      });
    });
    this.setData({ timetable });
  },
  
  onReady: function () {

  },
  
  onShow: function () {
    const app = getApp(); 
    app.fetchUserID(this); 
    
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
  
  getSchedulesByRoom: function(roomId) {
    wx.request({
      url: `http://47.113.186.66:8080/api/schedules/room/${roomId}`,  
      method: 'GET',  
      success: (res) => {
        if (res.statusCode === 200) {

          this.setData({
            schedules: res.data
          }, () => {
            
            let timetable = this.getTimetable();
            this.setData({ timetable });
          });
        } else {
          console.log('request fail', res.statusCode);
        }
      },
      fail: (error) => {
        console.log('request fail:', error);  
      }
    });
  },
  getTimetable() {
    let timetable = [
      [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []
    ];
    this.data.schedules.forEach(schedules => {
      const week = schedules.weekNumber;
      const courseData = {
        name: schedules.courseName,
        id: schedules.id,
        period:schedules.period,
        weekday:schedules.weekday
      };
      if (week >= 1 && week <= 22) {
        timetable[week - 1].push(courseData);
      }
    });
    return timetable;
  },

getWeekDates: function(selectedWeek) {
    const startDate = new Date(2025, 1, 17);  
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + (selectedWeek - 1) * 7);
  
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(weekStart);
      currentDay.setDate(weekStart.getDate() + i);
      weekDates.push(this.formatDate(currentDay));
    }
  
    return weekDates;
  },

formatDate: function(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `(${month}.${day})`;
  },
  
  

  

  
})



