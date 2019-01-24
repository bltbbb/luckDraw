<template>
  <div class="award_wrapper">
    <div class="bg">
      <img src="/static/images/bg.gif" mode="widthFix" alt="">
      <div class="header">
        <div class="left" @tap="goMiniso">
          <img class="img_wrapper" src="/static/images/avatar.png" alt="" v-if="!userInfo.nick">
          <img class="img_wrapper" src="/static/images/avatar_wrapper.png" alt="" v-if="userInfo.nick">
          <img class="img_content" :src="userInfo.pic" alt="" v-if="userInfo.nick">
          <span>{{userInfo.nick ? userInfo.nick :"未登录"}}</span>
        </div>
        <div class="right" @tap="goCard">
          <img src="/static/images/icon_kaquan.png" alt="">
          <span>我的卡券包</span>
        </div>
      </div>
    </div>
    <div class="btn_wrapper">
      <button @click="draw">点击抽奖</button>
    </div>
    <div class="tips">
      <div class="header">
        活动规则
      </div>
      <div class="main">
        <li>
          <i class="circle"></i>
          <span>微信、微博在春节期间送一亿红包代金券，前往门店消费满额即可参与用券活动。</span>
        </li>
        <li>
          <i class="circle"></i>
          <span>消费满48元即可使用10元以下面值红包，随机派发，直接抵扣现金。</span>
        </li>
        <li>
          <i class="circle"></i>
          <span>消费满148元即可使用所有面值红包，随机派发，直接抵扣现金。</span>
        </li>
        <li>
          <i class="circle"></i>
          <span>每个用户每单仅只能使用一张优惠券！</span>
        </li>
        <div style="widht:100%;height:66rpx;"></div>
      </div>
    </div>
    <div class="bg_guide" catchtouchmove="ture" v-if="showGuide" @tap="showGuide = false">
      <img src="/static/images/bg_yindaoye.png" mode="widthFix" alt="">
    </div>
    <div class="screen" catchtouchmove="ture" v-if="showScreen">
      <div class="loading" v-if="!open">
        <img src="/static/images/loading.gif" alt="">
        <span>开奖中...</span>
      </div>
      <div class="open" v-if="open" :animation="animation">
        <img class="bg" src="/static/images/bg_redbg.png" alt="">
        <img src="/static/images/icon_close.png" alt="" class="close" @click.stop="keepHandle">
        <div class="text">
          <span class="title">恭喜您<br>获得现金券一张</span>
          <span class="num">
            <i class="value">{{awardNum}}</i>
            <i class="symbol">元</i>
          </span>
          <span class="tips">
            已自动发放至您的卡券包中
          </span>
          <button @click.stop="keepHandle">继续抽奖</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import API from "../../api/index";

export default {
  data() {
    return {
      showGuide: false,
      open: false,
      showScreen: false,
      animation: null,
      count: 0,
      nickname: "未登录",
      userInfo: {},
      canDraw: false,
      userData: {},
      errNo: false,
      awardNum: 0
    };
  },
  methods: {
    draw() {
      if (!this.userInfo.nick) {
        this.showGuide = true;
      } else {
        if (this.errNo) {
          wx.showToast({
            title: "活动异常",
            icon: "none"
          });
          this.initUser();
        } else {
          if (this.canDraw) {
            this.drawAward();
          } else {
            this.initUser();
          }
        }
      }
    },
    async drawAward() {
      const data = {
        uid: this.userData.uid,
        activityId: 1
      };
      let res = await this.$mutils.fetchData(API.DRAW, data, "post");
      this.count = 1;
      if (res.code === 200) {
        this.showScreen = true;
        setTimeout(() => {
          this.awardNum = res.data.faceValue;
          this.open = true;
          this.scaleHandle();
        }, 2000);
      } else if (res.code === 10004) {
        wx.showModal({
          title: "提示",
          content: "今日免费抽奖次数已用完，分享活动可以奖励一次抽奖次数噢",
          confirmText: "去分享",
          confirmColor: "#D9232F",
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: `../share/main?uid=${this.userData.uid}`
              });
            }
          }
        });
      } else if (res.code !== 200 || res.code !== 10004) {
        wx.showToast({
          title: res.message,
          icon: "none",
          duration: 2000,
          mask: true
        });
      }
    },
    initUser() {
      const data = {
        ...this.userInfo,
        activityId: 1
      };
      this.$mutils
        .fetchData(API.INIT, data, "post")
        .then(res => {
          if (res.code === 200) {
            this.userData = res.data;
            this.nickname = res.data.nick;
            this.initActive();
          } else {
            this.errNo = true;
            wx.showToast({
              title: "初始化失败",
              icon: "none"
            });
          }
        })
        .catch(() => {
          this.errNo = true;
        });
    },
    initActive() {
      const data = {
        activityId: 1
      };
      this.$mutils
        .fetchData(API.DETAIL, data)
        .then(res => {
          if (res.code === 200 && res.data.activityStatus === 1) {
            this.canDraw = true;
            this.errNo = false;
          } else {
            this.errNo = true;
            wx.showToast({
              title: "活动异常",
              icon: "none"
            });
          }
        })
        .catch(() => {
          this.errNo = true;
        });
    },
    goMiniso() {
      wx.navigateToMiniProgram({
        appId: "wx2a212470bade49bf",
        path: "pages/index/index",
        extraData: {
          foo: "bar"
        },
        envVersion: "develop",
        success(res) {
          // 打开成功
        }
      });
    },
    goCard() {
      wx.navigateTo({
        url: `../card-list/main?uid=${this.userData.uid}`
      });
    },
    keepHandle() {
      this.showScreen = false;
      this.open = false;
    },
    scaleHandle: function() {
      this.animation.scale(1).step();
      this.animation = this.animation.export();
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
  onReady: function() {
    // 页面渲染完成
    // 实例化一个动画
    this.animation = wx.createAnimation({
      // 动画持续时间，单位ms，默认值 400
      duration: 2000,
      timingFunction: "linear",
      // 延迟多长时间开始
      delay: 1000,
      /**
       * 以什么为基点做动画  效果自己演示
       * left,center right是水平方向取值，对应的百分值为left=0%;center=50%;right=100%
       * top center bottom是垂直方向的取值，其中top=0%;center=50%;bottom=100%
       */
      success: function(res) {
        console.log(res);
      }
    });
  },
  onLoad() {
    const _that = this;
    wx.getStorage({
      key: "userInfoMiniso",
      success(res) {
        _that.userInfo = res.data;
        _that.initUser();
      },
      fail() {}
    });
  },
  onUnload() {
    this.open = false;
    this.showScreen = false;
  }
};
</script>
<style>
page {
  background: #fff;
}
</style>

<style lang="scss" scoped>
@import "./index.scss";
</style>
