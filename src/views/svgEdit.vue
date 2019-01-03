<template>
  <section class="container">
    <top></top>
    <div class="bottom">
      <left ref="left" @selTool="selTool"></left>
      <center ref="center" :sel-type="selType"></center>
      <right></right>
    </div>
  </section>
</template>

<script>
import top from '@/components/svgEditTop.vue'
import left from '@/components/svgEditLeft.vue'
import right from '@/components/svgEditRight.vue'
import center from '@/components/svgEditCenter.vue'

import axios from 'axios'
import { VueMathjax } from 'vue-mathjax'
export default {
  components: {
    'vue-mathjax': VueMathjax,
    top,left,right,center
  },
  data () {
    return {
      formula: "",
      selType: "",
      ops:{
        
      }
    }
  },
  created(){
  },
  mounted(){
    this.formula =  "$$\\ce{\\frac{[Hg^2+][Hg]}{[co2^2+]}}$$";
    // MathJax.Hub.Queue(["Typeset", MathJax.Hub])
    let _this = this;
    document.addEventListener('click', (e)=> {
      _this.$refs.left.hid();
    })
    document.addEventListener('mouseup', (e)=> {
      _this.$refs.center.timer = false;
    })
    document.addEventListener('contextmenu', (e)=> {
      e.preventDefault();
    })
  },
  computed:{

  },
  methods:{
    handleScroll(vertical, horizontal, nativeEvent){
    
    },
    selTool(type){
      this.selType = type;
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
  @time:0.3s;
  @media all{  
      .container{
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          background-color: #505050;
          &:hover{
            
          }
          .bottom{
            flex-grow: 1;
            display: flex;
            justify-content: space-between;
          }
      }
  }
</style>
