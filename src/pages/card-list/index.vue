<template>
  <div class="card-list">
    <view class="swiper-tab">
      <view :class="currentTab==0?'active':''" class="swiper-tab-item" data-current="0" @tap="clickTab">全部</view>
      <view :class="currentTab==1?'active':''" class="swiper-tab-item" data-current="1" @tap="clickTab">已使用</view>
    </view>
    <div class="empty" v-if="cardList.length === 0">
      <img src="/static/images/icon_kzt.png" mode="widthFix" alt="">
      <span>亲，你还没有现金券哦</span>
      <button @tap="draw">马上去抽奖</button>
    </div>
    <swiper :current="currentTab" duration="300" @change="swiperTab" v-if="cardList.length > 0" :style="{height:currentTab==0?allHeight:didHeight}">
      <swiper-item>
        <div class="list_wrapper">
          <div class="item" v-for="(item,index) in cardList" :key="index">
            <img src="/static/images/bg_kaquan.png" mode="widthFix" alt="">
            <div class="text">
              <div class="t_left">
                <span class="symbol">￥</span>
                <span class="num">{{item.faceValue}}</span>
              </div>
              <div class="t_right">
                <span class="rule">{{item.useRule}}</span>
                <span class="time">2019.02.04-2019.02.10</span>
                <span class="tips">详看使用规则</span>
              </div>
            </div>
          </div>
        </div>
      </swiper-item>
      <swiper-item>
        <view>
          <div class="list_wrapper">
            <div class="item" v-for="(item,index) in cardList" :key="index" v-if="item.status === '已使用' ">
              <img src="/static/images/bg_kaquan.png " mode="widthFix " alt=" ">
              <div class="text ">
                <div class="t_left ">
                  <span class="symbol ">￥</span>
                  <span class="num ">{{item.faceValue}}</span>
                </div>
                <div class="t_right ">
                  <span class="rule ">{{item.useRule}}</span>
                  <span class="time ">2019.02.04-2019.02.10</span>
                  <span class="tips ">详看使用规则</span>
                </div>
              </div>
              <div class="hadUse ">
                <img src="/static/images/icon_use.png " alt=" ">
              </div>
            </div>
          </div>
        </view>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import API from "../../api/index";

export default {
  data() {
    return {
      allHeight: "1000rpx",
      didHeight: "1000rpx",
      currentTab: 0,
      useHeight: 0,
      uid: "",
      cardList: []
    };
  },
  methods: {
    async getList() {
      const data = {
        uid: this.uid,
        activityId: "1",
        status: "0"
      };
      let res = await this.$mutils.fetchData(API.AWARD_RECORD, data);
      this.cardList = res.data;
      this.allHeight = this.cardList.length * (200 + 20) + 20 + "rpx";
      this.didHeight =
        this.cardList.filter(item => {
          return item.status === "已使用";
        }).length *
          (200 + 20) +
          20 >
        this.useHeight
          ? this.cardList.filter(item => {
              return item.status === "已使用";
            }).length *
              (200 + 20) +
            20 +
            "rpx"
          : this.useHeight + "px";
    },
    draw() {
      wx.navigateBack({
        delta: 1
      });
    },
    swiperTab: function(e) {
      var that = this;
      that.currentTab = e.mp.detail.current;
    },
    // 点击切换
    clickTab: function(e) {
      var that = this;
      if (this.currentTab === e.target.dataset.current) {
        return false;
      } else {
        that.currentTab = e.target.dataset.current;
      }
    }
  },
  onShareAppMessage: function(ops) {
    if (ops.from === "button") {
      // 来自页面内转发按钮
      console.log(ops.target);
    }
    return {
      title: "1亿红包，邀你来抢！",
      path: "pages/index/main",
      imageUrl: "/static/images/push.png",
      success: function(res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    };
  },
  onLoad(options) {
    const width = wx.getSystemInfoSync().screenWidth;
    const height = wx.getSystemInfoSync().screenHeight;
    const radio = width / 750;
    this.useHeight = height - 88 - radio * 88;
    this.uid = options.uid;
    this.getList();
  }
};
</script>
<style>
page {
  background: #f2f3f8;
}
</style>


<style scoped lang="scss">
@import "./index.scss";
</style>