<script>
export default {
  onShow(options) {
    if (Object.keys(options.referrerInfo).length > 0) {
      wx.setStorage({
        key: "userInfo",
        data: options.referrerInfo.extraData
      });
    }
  }
};
</script>

<style lang="scss" scope>
.container {
  height: 100%;
  min-height: 100%;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
