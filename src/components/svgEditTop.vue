<template>
    <div class="top">
      <section class="head">
        <img src="../assets/head.jpg" alt="">
        <div class="txt">
            <span class="name">挺帅</span>
            <span class="line"> | </span>
            <span class="exit">退出</span>
        </div>
      </section>
      <section class="controlbar">
          <div class="menuList">
              <ul>
                  <li><span class="menuTxt">文件</span></li>
                  <li><span class="menuTxt">编辑</span></li>
                  <li><span class="menuTxt">对象</span></li>
              </ul>
          </div>
          <div class="controlList">
              
          </div>
      </section>
    </div>
</template>
<script>
export default {
  props:{
    selType:{
      default:'',
      type:String
    }
  },
  components: {
    
  },  
  data () {
    return {
      
    }
  },
  created(){

  },
  methods:{
     
  },
  watch:{
    selType(n,o){
      console.log(n);
    }      
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
    .menuList{
        border-bottom:1px solid @color;
        box-shadow: @color 0 0.4px 0;
        padding-left: 15px;
        ul{
            width: 100%;
            display: flex;
            padding: 5px 0;
            li{
                display: inline-block;
                color: white;
                font-size: 13px;
                margin: 0 1px;
                :hover{
                    cursor:default;
                    background-color: #676767;
                    box-shadow: 0px 0px 5px @color;
                }
                .menuTxt{
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 3px;
                    :hover{
                        cursor:default;
                    }                    
                }                
            }
        }
    }
  }
}
</style>
