var Fly = require("flyio/dist/npm/wx")
// import store from '../store/index'

const fly = new Fly()

fly.config.baseURL = process.env.API_BASEURL
fly.config.timeout = 20000

// http 请求拦截器
fly.interceptors.request.use((config) => {
  wx.showNavigationBarLoading()// 导航条加载动画
  // 给所有请求添加自定义header
})

// http 响应拦截器
fly.interceptors.response.use(
  (response) => {
    wx.hideNavigationBarLoading()// 导航条加载动画
    const res = response.data;
    // if (res.message) {
    //   if (res && res.status.code === 100201) {
    //     wx.showToast({
    //       title: "token过期,请重新进入小程序",
    //       icon: "none",
    //       duration: 2000
    //     });
    //     wx.removeStorageSync('userInfo');
    //     wx.removeStorageSync('token');
    //   }
    // } else {
    //   if (res && res.status.code === 100201) {
    //     wx.showToast({
    //       title: "token过期,请重新进入小程序",
    //       icon: "none",
    //       duration: 2000
    //     });
    //     wx.removeStorageSync('userInfo');
    //     wx.removeStorageSync('token');
    //   } else if (res && res.status.code !== 100001 && res.status.code !== 100201) {
    //     wx.showToast({
    //       title: res.status.message,
    //       duration: 2000,
    //       icon: "none"
    //     });
    //   }
    // }
    return res
  },
  (err) => {
    wx.showToast({
      title: '活动异常',
      icon: "none",
      duration: 2000
    })
    wx.hideNavigationBarLoading()// 导航条加载动画
    // 捕获错误
    return Promise.reject(err.response)
  }
)

export default fly;
