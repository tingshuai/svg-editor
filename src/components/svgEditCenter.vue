<template>
      <section class="center">
        <svg id="svg" class="svg" @mousedown="mousedown" :class="selType" width="80%" height="80%" style="background-color: white;" xmlns="http://www.w3.org/2000/svg" version="1.1"></svg>
      </section>
</template>
<script>
let Svg;
export default {
  props:{
    selType:{
      default:'',
      type:String
    },
    coordinateMove:{//鼠标移动
      default:()=>{
        return []
      },
      type:Array
    }
  },
  components: {
    
  },  
  data () {
    return {
      layer:[],//图层......
    }
  },
  created(){

  },
  mounted(){
    Svg = this.Snap('#svg');
    this.$store.state.Svg = this.Snap("#svg");
    this.$store.commit("focusSvgItem");
    this.$store.commit("bindDrag");
  },
  watch:{
    selType(n,o){
      Svg.selectAll(".gSvgItem").forEach((ele,i,arr)=>{
          ele.undrag();
      })
      this.$store.state.drawType = n;
      if( n == "xuanze" ){
        this.$store.commit("bindDrag");
      }
    },
    layer:{
      handler(n,o){
        
      },
      deep:true
    },
    coordinateMove:{
      handler(n,o){
        let that = this;
        this.draw({ event:{type:"mousemove"} });
      },
      deep:true
    }
  },
  methods:{
    antAni(){//蚂蚁线动画
      let _storeState = this.$store.state;
      let _lineLength = Svg.select(`#ant${_storeState.actLayerId}`).getTotalLength();
      let ani = ()=>{
        this.Snap.animate(0, _lineLength*150, (val)=>{
          Svg.select(`#ant${_storeState.actLayerId}`).attr({
            strokeDashoffset:val,
          });
        },_lineLength*20000,()=>{
          setTimeout(ani,_lineLength*20000)
        });
      }
      ani();
    },
    mousedown(e){
      let that = this;
      let _storeState = this.$store.state;
      _storeState.timer = true;//绘画开始.....
      _storeState.coordinateDown = [ e.pageX,e.pageY ];//记录鼠标按下的坐标....
      _storeState.coordinateOffsetDown = [ e.offsetX,e.offsetY ];
      this.draw({ event:{type:"mousedown"} });
      e.preventDefault();
    },
    draw(obj){
      let _time = null;
      let _storeState = this.$store.state;
      if( obj.event.type == "mousedown" ){
        _time = new Date().getTime();
        _storeState.actLayerId = _time;
        this.$store.commit("addLayer");
      }
      switch(_storeState.drawType){
        case "xuanze":{//选择.....
          break;
        }
        case "wenzi":{//文字工具......
          break;
        }
        case "xiantiao":{//线段
          if( _storeState.timer ){
            if( obj.event.type == "mousedown" ){
              let _line = Svg.paper.line( _storeState.coordinateOffsetDown[0]-5,_storeState.coordinateOffsetDown[1]-5,_storeState.coordinateOffsetDown[0],_storeState.coordinateOffsetDown[1] ).attr({
                  stroke: "#000",
                  strokeWidth: 5,
                  class:"svgItem",
                  id:'id'+ _storeState.actLayerId,
                  'data-id':_storeState.actLayerId
              });
              Svg.paper.g(_line).attr({
                fill:"none",
                  class:"gSvgItem",
                  id:'gid'+_storeState.actLayerId
              })
              this.$store.commit('addAnt');
              this.$store.commit('focusSvgItem');
            }else if(obj.event.type == "mousemove"){
              Svg.select(`#id${_storeState.actLayerId}`).attr({
                x2:_storeState.coordinateMove[0] - _storeState.coordinateDown[0] + _storeState.coordinateOffsetDown[0],
                y2:_storeState.coordinateMove[1] - _storeState.coordinateDown[1] + _storeState.coordinateOffsetDown[1]
              });
              let _lineBox = Svg.select(`#id${_storeState.actLayerId}`).getBBox();
              let _line = `M${_lineBox.x-2} ${_lineBox.y-2}V${_lineBox.y2+2}H${_lineBox.x2+2}V${_lineBox.y-2}Z`;
              Svg.select(`#ant${_storeState.actLayerId}`).attr({
                d:_line
              });//更新蚂蚁线范围
            }
          }          
          break;
        }
        case "icon-test3":{//钢笔工具.....
          break;
        }
        case "bi1":{//画笔工具...
          break;
        }
        case "juxing1":{//矩形工具.....
          break;
        }
        case "tuoyuanxing":{//椭圆工具.....
          break;
        }
        case "xiangpi":{//橡皮工具....
          break;
        }
        case "yanse1":{//色板
          break;
        }
        default:{
          break;
        }
      }
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
.center{
  flex-grow: 1;
  background-color: #212121;
  display: flex;
  justify-content: center;
  align-items: center;
  .svg{
    .actItem{
      .gSvgItem.antBorder{
        opacity: 1;
      }
    }
    .gSvgItem{
      .antBorder{
        opacity: 0;
      }
    }
    :hover{

    }
  }
  .svg.xuanze{
    &:hover{
      cursor: default;
    }
  }
  .svg.xiantiao,.svg.icon-test3,.svg.juxing1,.svg.tuoyuanxing{
    &:hover{
      cursor: crosshair;
    }
  }
  .svg.wenzi{
    &:hover{
      cursor: text;
    }
  }
  .svg.bi1,.svg.xiangpi{
    &:hover{
      
    }
  }
}
</style>
