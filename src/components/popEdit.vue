<template>
    <vue-draggable-resizable :w="220" :h="220" @dragging="onDrag" :parent="'.container'" :resizable="false" drag-cancel=".content">
        <section id="popEdit" v-show="isShow">
            <div class="head"></div>
            <div class="content">
                <textarea name="" id="areaEdit" cols="30" rows="10"></textarea>
            </div>
        </section>
    </vue-draggable-resizable>
</template>
<script>

export default {
  props:{
    coordinateMove:{//鼠标移动
      default:()=>{
        return []
      },
      type:Array
    }
  },
  data () {
    return {
        isShow:true,
    }
  },
  created(){

  },
  computed:{
  
  },
  mounted(){
      let that = this;  
  },
  watch:{
 
  },
  methods:{
    onDrag(){
        
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
#popEdit{
    text-align: left;
    .head{
        height: 30px;
        background-color: @backgroundColor;
        cursor: move;
    }
    .areaEdit{
        display: inline-block;
        width: 100%;
        max-width: 100%;
    }
}
</style>
