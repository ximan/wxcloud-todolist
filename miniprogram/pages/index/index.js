//index.js
const app = getApp()

Page({
  data: {
    inputValue: '',
    listData: [],
  },

  onLoad: function() {
    this.getTodolist();
  },

  // 获取文本框值
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  // 增加
  todoAdd: function(){
    let me = this;
    if (me.data.inputValue == '') {
      wx.showModal({
        title: '',
        content: '不能为空'
      });
      return false;
    }
    wx.cloud.callFunction({
      name: 'todoAdd',
      data: {
        name: me.data.inputValue,
        complete: false
      },
      success: res => {
        wx.showToast({
          title: '增加成功'
        })
        me.setData({
          inputValue: ''
        })
        me.getTodolist();
      },
      fail: err => {
        console.log(err)
      },
    })
  },
  // 查询
  getTodolist: function () {
    let me = this;
    wx.cloud.callFunction({
      name: 'todolist',
      success: res => {
        me.setData({
          listData: res.result.data
        });
      },
      fail: err => {
        console.log(err)
      },
    })
  },
  // 修改
  btnChange: function (e) {
    let me = this;
    let _id = e.currentTarget.dataset.id;
    let complete = e.currentTarget.dataset.complete;
    wx.cloud.callFunction({
      name: 'todoEdit',
      data: {
        _id: _id,
        complete: !complete
      },
      success: res => {
        if (res.result.stats.updated >= 1){
          wx.showToast({
            title: '修改成功'
          })
          me.getTodolist();
        }
      },
      fail: err => {
        console.log(err)
      },
    })
  },
  // 删除
  btnDel: function (e) {
    let me = this;
    let _id = e.currentTarget.dataset.id;
    wx.cloud.callFunction({
      name: 'todoDel',
      data: {
        _id: _id
      },
      success: res => {
        if (res.result.stats.removed >= 1) {
          wx.showToast({
            title: '删除成功'
          })
          me.getTodolist();
        }
      },
      fail: err => {
        console.log(err)
      },
    })
  },
})
