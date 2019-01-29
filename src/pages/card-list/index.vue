<template>
  <div class="card-list">
    <view class="swiper-tab">
      <view :class="currentTab==0?'active':''" class="swiper-tab-item" data-current="0" @tap="clickTab">待使用</view>
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
          <div class="item" v-for="(item,index) in cardList" :key="index" @tap="cardDtail(item)" v-if="item.status === '未使用' ">
            <img src="/static/images/bg_kaquan.png" mode="widthFix" alt="">
            <div class="text">
              <div class="t_left">
                <span class="symbol">￥</span>
                <span class="num">{{item.faceValue}}</span>
              </div>
              <div class="t_right">
                <span class="rule">{{item.name}}</span>
                <span class="time">{{item.start}} - {{item.end}}</span>
                <span class="tips">点击查看优惠券券码</span>
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
                  <span class="time ">{{item.start}} - {{item.end}}</span>
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
    <div class="screen" v-if="showScreen" catchtouchmove>
      <img class="bg" src="/static/images/card_list.png" alt="">
      <img class="close" @tap="closeScreen" src="/static/images/icon_close.png" mode="widthFix" alt="">
      <div class="num">
        <div class="top">
          <text class="symbol">￥</text>
          <text class="num">{{currentNum}}</text>
          <text class="normal">现金券</text>
        </div>
        <div class="bottom">
          <text>- </text>
          <text>{{currentRule}}</text>
          <text> -</text>
        </div>
      </div>
      <div class="rule">
        <div class="header">
          <span>有效期：</span>
          <span>{{start}}</span>
          <span> - </span>
          <span>{{end}}</span>
        </div>
        <div class="detail">
          <span>
            1、在中国大陆地区任意名创优品门店可使用（西藏、港澳台地区除外）。
          </span>
          <br>
          <span>
            2、单笔订单消费满148可使用任意面额现金券一张、满48可使用10元及以下面额现金券一张，可直接抵用现金。
          </span>
        </div>
      </div>
      <div class="bottom">
        <div class="header">请于结账前出示给收银员</div>
        <div class="barcode">
          <canvas style="width:611rpx;height:120rpx;" canvas-id="barcode" />
        </div>
        <div class="code">
          {{code}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from "../../api/index";
import wxbarcode from "wxbarcode";

export default {
  data() {
    return {
      allHeight: "1000rpx",
      didHeight: "1000rpx",
      currentTab: 0,
      useHeight: 0,
      uid: "",
      cardList: [],
      showScreen: false,
      currentNum: 0,
      currentRule: "",
      start: "",
      end: "",
      code: ""
    };
  },
  methods: {
    async getList() {
      const data = {
        uid: this.uid,
        activityId: "2",
        status: "0"
      };
      let res = await this.$mutils.fetchData(API.AWARD_RECORD, data);
      this.cardList = res.data;
      res.data.forEach((item, index) => {
        let startTem = item.beginDate.split(" ")[0].split("-");
        let endTem = item.endDate.split(" ")[0].split("-");
        this.cardList[index].start = `${startTem[0]}.${startTem[1]}.${startTem[2]}`;
        this.cardList[index].end = `${endTem[0]}.${endTem[1]}.${endTem[2]}`;
      });
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
    cardDtail(data) {
      let startTem = data.beginDate.split(" ")[0].split("-");
      let endTem = data.endDate.split(" ")[0].split("-");
      this.showScreen = true;
      this.currentNum = data.faceValue;
      this.currentRule = data.name;
      this.start = `${startTem[0]}.${startTem[1]}.${startTem[2]}`;
      this.end = `${endTem[0]}.${endTem[1]}.${endTem[2]}`;
      this.code = data.code;
      wxbarcode.barcode("barcode", data.code, 611, 120);
    },
    closeScreen() {
      this.showScreen = false;
      this.getList();
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
  // onLoad(options) {
  //   const width = wx.getSystemInfoSync().screenWidth;
  //   const height = wx.getSystemInfoSync().screenHeight;
  //   const radio = width / 750;
  //   this.useHeight = height - 88 - radio * 88;
  //   this.uid = options.uid;
  //   wx.setStorage({
  //     key: "minisoUidForCard",
  //     data: options.uid
  //   });
  //   this.getList();
  // },
  onShow() {
    const _that = this;
    const width = wx.getSystemInfoSync().screenWidth;
    const height = wx.getSystemInfoSync().screenHeight;
    const radio = width / 750;
    this.useHeight = height - 88 - radio * 88;
    wx.getStorage({
      key: "minisoUidForCard",
      success(res) {
        _that.uid = res.data;
        _that.getList();
      }
    });
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