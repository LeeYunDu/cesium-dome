<template>
  <div class="wrapper">
    <div class="container">
      <div class="login-content">
        <slot />
      </div>
      <div class="pics-box">
        <div class="pics-text">
          <p>欢迎登录</p>
          <p class="big-title">云上鳌江</p>
        </div>
        <!-- height="520px" -->
        <el-carousel height="750px" style="z-index:1">
          <el-carousel-item v-for="item in 3" :key="item">
            <img src="~@/assets/login/login-rt.png">
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AccountBackground'
}
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-image: url(~@/assets/login/login-bg.png);
  background-color: rgb(166 198 245 / 20%);
  background-size: contain;
  background-position:0 center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.container {
  display: flex;
  margin-right: 100px;
  height: 750px;
  justify-content: flex-end;
  width:1100px;
  border-radius: 20px;
  box-shadow: 0px 5px 50px 0px
		rgba(99, 132, 251, 0.1);
   background: white;
}
.pics-box{
  position:relative;
  width: 600px;
  .pics-text{
    position:absolute;
    z-index: 5;
    top: 40%;
    left: 40px;
    transform: translateY(-50%);
    color:rgba(255,255,255,0.6);
    font-size: 20px;
  }
  .big-title{
     margin-top:15px;
    font-family: DFZongYi-Bd-80-Win-GB;
    font-size: 50px;
    color: #ffffff;
  }
  img{
    width:100%;
  }
}
.project-title {
  position: relative;
  // top: -22px;
  // left: 116px;
  color: #fff;
  font-weight: 500;
  font-size: 30px;
}
.login-content {
  flex:1;
  padding:136px 60px 0;
  overflow: hidden;
  height:100%;
  box-sizing: border-box;
}

.footer-container {
  border-top: solid 1px rgba(255,255,255,.3);
  margin: 20px 0;
  padding-top: 15px;
  font-size: 14px;
  color: #fff;
  white-space: nowrap;
}
// @media screen and (max-width: 1600px) {
//   .container {
//     width: 500px !important;
//     // width: 90% !important;
//   }
// }
</style>

