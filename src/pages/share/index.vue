<template>
  <div class="share">
    <img class="share_img" src="/static/images/share.png" :class="{spacial:!common}" mode="widthFix" alt="">
    <button @tap="savaPic" v-if="auth">保存图片</button>
    <button @tap="openSetting" v-if="!auth">保存图片</button>
    <img class="bg_share" src="/static/images/bg_share.png" mode="widthFix" v-if="bgShareShow" @tap="bgShareShow = false" alt="" catchtouchmove>
  </div>
</template>

<script>
import API from "../../api/index";
export default {
  data() {
    return {
      bgShareShow: true,
      auth: true,
      uid: "",
      common: true
    };
  },
  methods: {
    savaPic() {
      const _that = this;
      wx.getSetting({
        success(res) {
          if (!res.authSetting["scope.writePhotosAlbum"]) {
            wx.authorize({
              scope: "scope.writePhotosAlbum",
              success() {
                // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                wx.saveImageToPhotosAlbum({
                  filePath: "/static/images/share.png",
                  success(res) {
                    _that.addPoints();
                    console.log("保存成功");
                  },
                  fail(res) {
                    console.log("保存失败");
                  }
                });
              },
              fail() {
                _that.auth = false;
                wx.showModal({
                  title: "需要授权才能使用",
                  content: "请再次点击保存图片以授权",
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                    }
                  }
                });
              }
            });
          } else {
            wx.saveImageToPhotosAlbum({
              filePath: "/static/images/share.png",
              success(res) {
                _that.addPoints();
                console.log("保存成功");
              },
              fail(res) {
                console.log("保存失败");
              }
            });
          }
        }
      });
    },
    openSetting() {
      const _that = this;
      wx.openSetting({
        success(res) {
          const result = res.authSetting["scope.writePhotosAlbum"];
          if (result) {
            _that.auth = true;
          }
        }
      });
    },
    async addPoints() {
      const data = {
        uid: this.uid,
        activityId: "1"
      };
      let res = await this.$mutils.fetchData(API.ADD_POINTS, data, "psot");
      if (res.code === 200) {
        wx.showToast({
          title: "保存成功",
          icon: "success",
          duration: 2000
        });
      }
    }
  },
  onLoad(options) {
    this.uid = options.uid;
    const sysInfo = wx.getSystemInfoSync();
    const height = sysInfo.windowHeight;
    if (height < 700) {
      this.common = true;
    } else {
      this.common = false;
    }
  }
};
</script>

<style scoped lang="scss">
.share {
  position: relative;
  width: 100%;
  height: 100%;
  .share_img {
    position: absolute;
    left: 0;
    top: -220rpx;
    width: 100%;
    &.spacial {
      top: -130rpx;
    }
  }
  button {
    position: fixed;
    bottom: 40rpx;
    left: 75rpx;
    width: 600rpx;
    height: 88rpx;
    font-size: 36rpx;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    background: linear-gradient(
      -90deg,
      rgba(217, 35, 47, 1),
      rgba(241, 91, 101, 1)
    );
    box-shadow: 0px 3rpx 10rpx 0rpx rgba(232, 20, 20, 0.68);
    border-radius: 44rpx;
  }
  .bg_share {
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
  }
}
</style>