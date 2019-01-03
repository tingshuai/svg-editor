<template>
    <div class="top">
      <section class="head">
        <img src="../assets/head.jpg" alt="">
        <div class="txt">
            <span class="name">挺帅</span>
            <span class="line">|</span>
            <span class="exit">退出</span>
        </div>
      </section>
      <section class="controlbar"></section>
    </div>
</template>
<script>
export default {
  components: {
    
  },  
  data () {
    return {
      
    }
  },
  created(){

  },
  methods:{
     
  }
}
</script>
<style scoped lang="less">
@color:#333;
@colorLight:#42d29d;
@backgroundColor:#A5AA3F;
@borderColor:#ddd;
@gray:#93999F;
.top{
    height: 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  .head{
      width: 80px;
      text-align: center;
      border-right: 1px solid gray;
      >img{
          width: 55px;
          height: 55px;
          border-radius: 7px;
          overflow: hidden;
          box-shadow:#dcdcdc 0 0 1px 2px;
      }
      .txt{
        font-size: 12px;
        color: white;
        text-align: center;
        height: 20px;
        line-height: 20px;
        font-weight: lighter;
        span{
            vertical-align: middle;
            &:hover{
                cursor: pointer;
            }
        }
        span.line{
            vertical-align: top;
        }
      }
  }
  .controlbar{
      flex-grow: 1;
      height: 100%;

  }
}
</style>
