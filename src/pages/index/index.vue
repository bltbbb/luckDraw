<template>
  <div class="award_wrapper">
    <div class="bg">
      <img src="/static/images/bg.gif" mode="widthFix" alt="">
      <div class="header">
        <div class="left" @tap="goMiniso">
          <img class="img_wrapper" src="/static/images/avatar.png" alt="" v-if="!userInfo.data">
          <!-- <img class="img_wrapper" src="/static/images/avatar_wrapper.png" alt="" v-if="userInfo.data"> -->
          <view class="userinfo-avatar" v-if="userInfo.data">
            <open-data class="img_content" type="userAvatarUrl"></open-data>
          </view>
          <!-- <img class="img_content" :src="userInfo.data.pic" alt="" v-if="userInfo.data"> -->
          <span v-if="!userInfo.data">未登录</span>
          <open-data class="nickName" type="userNickName" v-if="userInfo.data"></open-data>
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
        <img src="/static/images/rule.png" alt="">
      </div>
      <div class="clickShow" @tap="clickShow">
        <span>{{ruleTips}}</span>
        <img src="/static/images/down.png" :class="{rate:show_rule}" alt="">
      </div>
      <div class="main" :class="{show:show_rule}">
        <li>
          <i class="circle"></i>
          <span class="title">活动时间：</span><br>
          <span>领券时间：2019年02月04日-2019年02月11日</span><br>
          <span>用券时间：2019年02月04日-2019年02月28日</span>
        </li>
        <li>
          <i class="circle"></i>
          <span class="title">活动地点：</span><br>
          <span>中国内地地区名创优品门店（港澳台以及西藏地区不参与）</span>
        </li>
        <li>
          <i class="circle"></i>
          <span class="title">活动形式：</span>
          <span>领券规则：</span><br>
          <span>（1）在2019年2月4日-2019年2月11日，会员进入红包小程序领取现金券；非会员可进入小程序登录注册会员后再领取现金券；<br>（2）每位会员每天限领取一次，当天保存及分享图片再获得一次领券机会，分享次数上限为两次；<br>（3）数量有限，先到先得。</span><br>
          <span>用券规则：</span><br>
          <span>（1）会员成功领取现金券后，在2019年2月4日-2019年2月28日期间，消费满额后凭券码直接抵扣现金<br> （2）消费满48元或以上（含48元）可使用一张10元及以下任意金额（含10元）的现金券抵扣现金 <br>（3）消费满148元或以上（含148元）可使用一张任意金额的现金券抵扣现金<br> （4）每人每单满额限使用一张现金券<br> （5）本次现金券活动不与门店其他活动同时享用</span>
        </li>
        <li>
          <i class="circle"></i>
          <span class="title">温馨提示：</span>
          <span>
            a) 名创优品将依法运营本活动，但若收银计算机病毒、系统故障、自然灾害等不可抗力原因需要取消、暂停或延期活动的，名创优品无需为不可抗力时事件承担任何赔偿或补偿责任。<br> b) 参与本次活动的用户即视为同意并遵守活动规则，不得违反中华人民共和国法律法规及本活动的相关规定。本次活动仅限中国大陆地区名创优品门店（港澳台以及西藏地区不参与）。<br> c) MINISO名创优品在法律许可范围内保留对本活动的最终解释权。 <br>d) 如有任何疑问，可拨打客服热线：400-700-5553，我们会尽快帮您处理。（客服服务时间：周一-周五8:30-20:00）。</span>
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
import { setTimeout } from "timers";

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
      awardNum: 0,
      show_rule: false,
      scroll: 0,
      ruleTips: "点击查看活动规则",
      IAC: null
    };
  },
  methods: {
    draw() {
      if (!this.userInfo.data) {
        this.gotoTop();
        setTimeout(() => {
          this.showGuide = true;
        }, 200);
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
    gotoTop() {
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 200
        });
      } else {
        this.showGuide = true;
      }
    },
    async drawAward() {
      const data = {
        uid: this.userData.uid,
        activityId: 2
      };
      const _that = this;
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
          content: "今日免费抽奖次数已用完，分享给好友还可获得2次抽奖机会噢！",
          confirmText: "去分享",
          confirmColor: "#D9232F",
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: `../share/main?uid=${_that.userData.uid}`
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
    clickShow() {
      if (wx.pageScrollTo) {
        if (!this.show_rule) {
          this.show_rule = true;
          this.ruleTips = "点击收起活动规则";
          setTimeout(() => {
            wx.pageScrollTo({
              scrollTop: this.scroll + 1000,
              duration: 400
            });
          }, 100);
        } else {
          this.ruleTips = "点击查看活动规则";
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 400
          });
          setTimeout(() => {
            this.show_rule = false;
          }, 400);
        }
      }
    },
    initUser() {
      const data = {
        ...this.userInfo,
        activityId: 2
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
        activityId: 2
      };
      this.$mutils
        .fetchData(API.DETAIL, data)
        .then(res => {
          if (res.code === 200 && res.data.activityStatus === "1") {
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
      if (this.userData.nick) {
        return;
      }
      wx.navigateToMiniProgram({
        appId: "wx2a212470bade49bf",
        path: "pages/index/index",
        extraData: {
          foo: "bar"
        },
        envVersion: "release",
        success(res) {
          // 打开成功
        }
      });
    },
    goCard() {
      const _that = this;
      wx.setStorage({
        key: "minisoUidForCard",
        data: _that.userData.uid,
        success() {
          wx.navigateTo({
            url: `../card-list/main`
          });
        }
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
  onShow() {
    this.IAC = wx.createInnerAudioContext();
    this.IAC.src = "/static/images/mp3.mp3";
    this.IAC.autoplay = true;
    this.IAC.loop = true;
  },
  onPageScroll: function(e) {
    // 获取滚动条当前位置
    this.scroll = e.scrollTop;
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
    this.IAC.destroy();
  },
  onHide() {
    this.open = false;
    this.showScreen = false;
    this.IAC.destroy();
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
