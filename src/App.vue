<script>
export default {
  onShow(options) {
    console.log(options.referrerInfo.extraData);
    if (
      options.referrerInfo.appId &&
      options.referrerInfo.appId === "wx2a212470bade49bf"
    ) {
      wx.setStorage({
        key: "userInfoMiniso",
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
