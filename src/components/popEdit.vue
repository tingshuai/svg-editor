<template>
    <vue-draggable-resizable v-show="isShow" :w="popEdit.w" :h="popEdit.h" @dragging="onDrag" :parent="'.container'" :resizable="false" drag-cancel=".content">
        <section id="popEdit">
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
        isShow:false,
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
    let _ele = document.getElementById("popEdit")
    document.addEventListener('mousedown', (e)=> {
      if( !_ele.contains(e.target) ){
          that.isShow = false;
      }
    })
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
    background-color: rgba(0,0,0,0);
    .head{
        height: 30px;
        background-color: rgba(170, 170, 63, 0.5);
        cursor: move;
        border: 1px solid rgba(169, 169, 169, 1);
        border-bottom: none;
    }
    #areaEdit{
        display: inline-block;
        width: 100%;
        max-width: 220px;
        min-width: 220px;
        min-height: 120px;
        font-size: 14px;
        background-color: rgba(255,255,255,0.5);
        border-top: none;
    }
}
</style>
