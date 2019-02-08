<template>

    <!-- <section id="popEdit" v-show="isShow" :style="{'left':popEdit.left,'top':popEdit.top}">
        <div class="head" draggable="true" @mousedown="mousedown"></div>
        <div class="conten">
            <textarea name="" id="" cols="30" rows="10"></textarea>
        </div>
    </section> -->
    <vue-draggable-resizable :w="100" :h="100" @dragging="onDrag" :parent="'.container'">
        <section id="popEdit" v-show="isShow" :style="{'left':popEdit.left,'top':popEdit.top}">
            <div class="head" draggable="true" @mousedown="mousedown"></div>
            <div class="conten">
                <textarea name="" id="" cols="30" rows="10"></textarea>
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
        isMove:false,
        popEdit:{
            left:0,
            top:0,
            offsetX:0,
            offsetY:0
        }
    }
  },
  created(){

  },
  computed:{
  
  },
  mounted(){
      let that = this;
    document.addEventListener('mousemove', (e)=> {
        e.preventDefault();
        let _rectBox = document.getElementById('popEdit').getBoundingClientRect();
        if( _rectBox.left < 0 ){
            that.popEdit.left = 0 + 'px'
        }else if(_rectBox.top < 0){
            that.popEdit.top = 0 + 'px'
        }else if(_rectBox.right < 0){
            that.popEdit.left = document.body.clientWidth - _rectBox.width;
        }else if(_rectBox.bottom < 0){
            that.popEdit.top = document.body.clientHeight - _rectBox.height;
        }
        if(that.isMove && _rectBox.left >= 0 && _rectBox.top >= 0  && _rectBox.right >= 0 && _rectBox.bottom >= 0){
            that.popEdit.left = e.clientX - that.popEdit.offsetX + 'px';
            that.popEdit.top = e.clientY - that.popEdit.offsetY + 'px';
        }
    })      
    document.addEventListener('mouseup', (e)=> {
        e.preventDefault();
        that.isMove = false;
    })       
  },
  watch:{
 
  },
  methods:{
    mousedown(e){
        this.popEdit.offsetX = e.offsetX;
        this.popEdit.offsetY = e.offsetY;
        this.isMove = true;
    },
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
    position: fixed;
    .head{
        height: 30px;
        background-color: @backgroundColor;
        cursor: move;
    }
}
</style>
