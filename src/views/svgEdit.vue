<template>
  <section class="container" @mouseleave.stop="mouseleave" @mouseup="mouseUp" @mousemove="mousemove">
    <top></top>
    <div class="bottom">
      <left ref="left" @selTool="selTool"></left>
      <center ref="center" :coordinateMove="coordinateMove" :sel-type="selType"></center>
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
      coordinateMove:[],
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
    document.addEventListener('contextmenu', (e)=> {
      e.preventDefault();
    })
  },
  computed:{

  },
  methods:{
    handleScroll(vertical, horizontal, nativeEvent){
    
    },
    mousemove(e){
      this.coordinateMove = [e.pageX,e.pageY];
      this.$store.state.coordinateMove = [e.pageX,e.pageY];
    },
    mouseUp(e){
      let _storestate = this.$store.state;
      this.$refs.left.hid();
      _storestate.coordinateUp = [ e.pageX,e.pageY ];// 记下鼠标抬起的坐标.....
      _storestate.timer = false;
      _storestate.mouseevent = 0;
    },
    mouseleave(e){
      this.mouseUp(e);
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
