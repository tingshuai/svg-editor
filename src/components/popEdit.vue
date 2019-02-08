<template>
    <vue-draggable-resizable :w="popEdit.w" :h="popEdit.h" @dragging="onDrag" :parent="'.container'" :resizable="false" drag-cancel=".content">
        <section id="popEdit" v-show="isShow">
            <div class="head"></div>
            <div class="content">
                <textarea name="" id="areaEdit" @resize="resize"></textarea>
            </div>
        </section>
    </vue-draggable-resizable>
</template>
<script>

export default {
  props:{

  },
  data () {
    return {
        isShow:true,
        popEdit:{
            w:220,
            h:160
        }
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
        
    },
    resize(e){
        console.log(e);
        
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
    #areaEdit{
        display: inline-block;
        width: 100%;
        max-width: 220px;
    }
}
</style>
