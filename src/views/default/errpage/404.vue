<template>
  <div>
    <div class="http404-container clearfix">
      <section class="http404-header ">
        <img
          src="@/assets/404_images/404kuqi.png"
          alt=""
        >
        <span class="http404-text">糟糕，出错了！您访问的页面不存在或者没有权限访问……</span>
      </section>
      <section class="http404-imgbox">
        <img
          class="http404-ellipse"
          src="@/assets/404_images/tuoyuan1.png"
          alt=""
        >
        <img
          class="http404-group"
          src="@/assets/404_images/404zu.png"
          alt=""
        >
        <img
          class="http404-404"
          src="@/assets/404_images/404bg.png"
          alt=""
        >

      </section>
      <section class="http404-footer">
        <p class="http404-text">您可以通过一下方式继续访问：</p>
        <el-button @click="$router.push('/')">返回首页</el-button>
      </section>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {}
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.http404-container {
  transform: translate(-50%, -50%);
  position: absolute;
  top: 20%;
  left: 50%;
  width: 600px;
  .http404-header {
    img {
      vertical-align: middle;
    }
  }
}
.http404-text {
  font-weight: 700;
  margin-left: 10px;
  font-size: 18px;
  color: #2497f2;
  vertical-align: middle;
}
.http404-imgbox {
  position: relative;
  top: 50%;
  left: 73%;
  transform: translate(-50%, -50%);
  .http404-ellipse {
    position: absolute;
  }
  .http404-group {
    position: absolute;
    top: 83px;
    left: -90px;
  }
  .http404-404 {
    position: absolute;
    animation: move 3s linear infinite;
  }
}
.http404-footer {
  text-align: center;
  position: absolute;
  bottom: -342px;
  left: 163px;
  .el-button {
    position: absolute;
    top: 60px;
    left: 50px;
    border-radius: 10px;
    width: 150px;
    height: 50px;
    font-size: 24px;
    color: #fff;
    background-image: linear-gradient(0deg, #73a1fb 0%, #3bc6fd 100%),
      linear-gradient(#2497f2, #2497f2);
  }
}
@keyframes move {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(10deg);
  }
  50% {
    transform: rotate(20deg);
  }
  75% {
    transform: rotate(10deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>

