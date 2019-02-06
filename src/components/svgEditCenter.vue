<template>
      <section class="center">
        <svg id="svg" class="svg" @mousedown="mousedown" :class="selType" width="80%" height="80%" style="background-color: white;" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <svg id="canvas" width="100%" height="100%" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>
          <g id="_antBorder" data-id="" :class="{'showAnt':!showAnt}" style="vector-effect:non-scaling-stroke;">
            <path id="rotateLine" style="stroke:gray;stroke-width:1;vector-effect:non-scaling-stroke"></path>
            <circle class="_controlBar" data-type="rotateBar" id="rotateBar" cx="0" cy="0" r="2.5" stroke="black" stroke-width="0" fill="#00bf63" style="font-size:11px;vector-effect:non-scaling-stroke;"/>
            <path id="_antLine" stroke="#00bf63" d="" fill="none"style="vector-effect:non-scaling-stroke;stroke-dasharray: 2, 2; stroke-dashoffset: 0;" ></path>
            <rect x="0" y="0" width="5" height="5" rx="0" ry="0" stroke="#00bf63" fill="#00bf63" id="squareLT" data-type="squareLT" style="cursor:nw-resize;stroke-width: 1; cursor: nw-resize;vector-effect:non-scaling-stroke" class="_controlBar" title="缩放"></rect>
            <rect x="0" y="0" width="5" height="5" rx="0" ry="0" stroke="#00bf63" fill="#00bf63" id="squareCT" data-type="squareCT" style="cursor:ns-resize;stroke-width: 1; cursor: ns-resize;vector-effect:non-scaling-stroke" class="_controlBar" title="缩放"></rect>
            <rect x="0" y="0" width="5" height="5" rx="0" ry="0" stroke="#00bf63" fill="#00bf63" id="squareRT" data-type="squareRT" style="cursor:ne-resize;stroke-width: 1; cursor: ne-resize;vector-effect:non-scaling-stroke" class="_controlBar" title="缩放"></rect>
            <rect x="0" y="0" width="5" height="5" rx="0" ry="0" stroke="#00bf63" fill="#00bf63" id="squareCR" data-type="squareCR" style="cursor:ew-resize;stroke-width: 1; cursor: ew-resize;vector-effect:non-scaling-stroke" class="_controlBar" title="缩放"></rect>
            <rect x="0" y="0" width="5" height="5" rx="0" ry="0" stroke="#00bf63" fill="#00bf63" id="squareBR" data-type="squareBR" style="cursor:nw-resize;stroke-width: 1; cursor: nw-resize;vector-effect:non-scaling-stroke" class="_controlBar" title="缩放"></rect>
            <rect x="0" y="0" width="5" height="5" rx="0" ry="0" stroke="#00bf63" fill="#00bf63" id="squareBC" data-type="squareBC" style="cursor:nw-resize;stroke-width: 1; cursor: ns-resize;vector-effect:non-scaling-stroke" class="_controlBar" title="缩放"></rect>
            <rect x="0" y="0" width="5" height="5" rx="0" ry="0" stroke="#00bf63" fill="#00bf63" id="squareBL" data-type="squareBL" style="cursor:ns-resize;stroke-width: 1; cursor: ne-resize;vector-effect:non-scaling-stroke" class="_controlBar" title="缩放"></rect>
            <rect x="0" y="0" width="5" height="5" rx="0" ry="0" stroke="#00bf63" fill="#00bf63" id="squareCL" data-type="squareCL" style="cursor:ew-resize;stroke-width: 1; cursor: ew-resize;vector-effect:non-scaling-stroke" class="_controlBar" title="缩放"></rect>
          </g>
        </svg>
        <div class="posiMsg" :style="{'left':dragPosition.x +'px','top':dragPosition.y + 'px'}" v-if="movePosition.show">
          <section class="part part1">
            <span class="posiType"><i :class="movePosition.isRight" class="iconfont icon-zhiding"></i>： </span>
            <span class="value">{{ movePosition.x }}&thinsp;px</span>
          </section>
          <section class="part part2">
            <span class="posiType"><i :class="movePosition.isUp" class="iconfont icon-zhiding"></i>： </span>
            <span class="value">{{ movePosition.y }}&thinsp;px</span>
          </section>
        </div>
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
      moveType:"",
      dragPosition:{
        x:0,
        y:0
      },
      movePosition:{
        x:0,
        y:0,
        show:false,
        isUp:"toUp",
        isRight:"toRight"
      }
    }
  },
  created(){

  },
  computed:{
    coordinateClientMove(){
      return this.$store.state.draw.itemMoveMsg;
    },
    showAnt:{
      get () {
        return this.$store.state.showAnt
      }
    },
    layer(){
      return this.$store.state.draw.layer
    },
    _matrix(){
      return this.$store.state._matrix
    }
  },
  mounted(){
    Svg = this.Snap('#svg');
    let _storeState = this.$store.state;
    _storeState.Svg = this.Snap("#svg");
    _storeState.canvas = this.Snap("#canvas");
    _storeState.Snap = this.Snap;
    _storeState.Draw = SVG('canvas');//初始化svg.js 绘图对象..
    _storeState.draw.actItem.matrix = new Snap.Matrix();
    this.$store.dispatch("bindFocusEvent");
    this.$store.dispatch("bindDrag");
    this.$store.dispatch("bindResize");
    // _storeState.Svg.paper.circle(0,0,5).attr({id:'demo_circle'});
  },
  watch:{
    selType(n,o){
      Svg.selectAll(".gSvgItem").forEach((ele,i,arr)=>{
          ele.undrag();
      })
      this.$store.state.drawType = n;
      if( n == "xuanze" ){
        this.$store.dispatch("bindDrag");
      }
    },
    layer:{
      handler(n,o){
        
      },
      deep:true
    },
    coordinateMove:{
      handler(n,o){
        this.draw({ event:{type:"mousemove"} });
      },
      deep:true
    },
    _matrix:{
      handler(n,o){
        let _storeState = this.$store.state;
      },
      deep:true      
    },
    coordinateClientMove:{
      handler(n,o){
        let _storeState = this.$store.state;
        if( _storeState.draw.itemMoveMsg.state == "move" ){
          this.dragPosition.x = n.cx + 10;
          this.dragPosition.y = n.cy - 50;
          this.movePosition.x = Math.abs(n.x);
          this.movePosition.y = Math.abs(n.y);
          n.x > 0 ? this.movePosition.isRight = 'toRight' : this.movePosition.isRight = 'toLeft';
          n.y > 0 ? this.movePosition.isUp = 'toUp' : this.movePosition.isUp = 'toBottom';
        }else if( _storeState.draw.itemMoveMsg.state == "end" ){
          this.movePosition.show = false;
        }else if( _storeState.draw.itemMoveMsg.state == "start"){
          this.movePosition.x = 0;
          this.movePosition.y = 0;
          this.dragPosition.x = n.cx + 10;
          this.dragPosition.y = n.cy - 50;
          this.movePosition.show = true;
        }
      },
      deep:true
    }
  },
  methods:{
    mousedown(e){
      let that = this;
      let _storeState = this.$store.state;
      _storeState.draw.timer = true;//绘画开始.....
      _storeState.coordinateDown = [ e.pageX,e.pageY ,e];//记录鼠标按下的坐标....
      _storeState.coordinateOffsetDown = [ e.offsetX,e.offsetY ,e];
      _storeState.time = new Date().getTime();
      e.preventDefault();
    },
    draw(obj){
      let _storeState = this.$store.state;
      switch(_storeState.drawType){
        case "xuanze":{//选择.....
          break;
        }
        case "wenzi":{//文字工具......
          break;
        }
        case "xiantiao":{//线段
          if( _storeState.draw.timer ){
              if( SVG.get(`id${_storeState.time}`) == null ){
                let _line = _storeState.Draw.path(`M${_storeState.coordinateOffsetDown[0]-5} ${_storeState.coordinateOffsetDown[1]-5}L${_storeState.coordinateOffsetDown[0]} ${_storeState.coordinateOffsetDown[1]}`).attr({
                    stroke: _storeState.defaultConfig.stroke,
                    "stroke-width": _storeState.defaultConfig.strokeWidth,
                    class:"svgItem",
                    id:'id'+ _storeState.time,
                    'data-id':_storeState.time,
                    'data-type':"line"
                });
                _storeState.Draw.group().add(_line).attr({
                    fill:"none",
                    class:"gSvgItem",
                    id:'gid'+_storeState.time,
                    "data-type":"line",
                    "data-id":_storeState.time
                })
                this.$store.dispatch('bindFocusEvent');//以后聚焦显示蚂蚁线......
                this.$store.dispatch("addLayer",_storeState.time);
              }else{
                SVG.get(`id${_storeState.time}`).attr({
                  d:`M${_storeState.coordinateOffsetDown[0]-5} ${_storeState.coordinateOffsetDown[1]-5}L${_storeState.coordinateMove[0] - _storeState.coordinateDown[0] + _storeState.coordinateOffsetDown[0]} ${_storeState.coordinateMove[1] - _storeState.coordinateDown[1] + _storeState.coordinateOffsetDown[1]}`
                });
                this.$store.commit('addAnt',_storeState.time);//重绘蚂蚁线......
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
          if( _storeState.draw.timer ){
            if( SVG.get(`id${_storeState.time}`) == null ){
              let _rect = _storeState.Draw.path(`M${_storeState.coordinateOffsetDown[0]} ${_storeState.coordinateOffsetDown[1]}`).attr({
                  stroke: _storeState.defaultConfig.stroke,
                  "stroke-width": _storeState.defaultConfig.strokeWidth,
                  class:"svgItem",
                  "vector-effect":"non-scaling-stroke",
                  "stroke-miterlimit":10,
                  "stroke-linejoin":"miter",
                  id:'id'+ _storeState.time,
                  'data-id':_storeState.time,
                  "data-type":"rect"
              });
              _storeState.Draw.group().add(_rect).attr({
                fill:"none",
                  class:"gSvgItem",
                  id:'gid'+_storeState.time,
                  "data-type":"rect",
                  "data-id":_storeState.time
              })
              this.$store.dispatch('bindFocusEvent');//以后聚焦显示蚂蚁线......
              this.$store.dispatch("addLayer",_storeState.time);
            }else{
              SVG.get(`id${_storeState.time}`).attr({
                d:`M${_storeState.coordinateOffsetDown[0]} ${_storeState.coordinateOffsetDown[1]}H${_storeState.coordinateMove[0] - _storeState.coordinateDown[0] + _storeState.coordinateOffsetDown[0]}V${_storeState.coordinateMove[1] - _storeState.coordinateDown[1] + _storeState.coordinateOffsetDown[1]}H${_storeState.coordinateOffsetDown[0]}Z`
              });
              this.$store.commit('addAnt',_storeState.time);
            }
          }        
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
        
      }
    }
  }
  .svg.xuanze{
      .svgItem{
          cursor: pointer;
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
.posiMsg{
  position: fixed;
  display: flex;
  width: auto;
  height: 50px;
  background-color: rgba(0,0,0,0.5);
  border-radius: 4px;
  overflow: hidden;
  justify-content: space-between;
  flex-direction: column;
  text-align: left;
  padding: 5px 10px;
  color: white;
  font-size: 12px;
  .part{
    flex-grow: 1;
    line-height: 20px;
    .posiType{
      .iconfont{
        font-size: 12px;
        display: inline-block;
      }
      .toLeft{
        transform: rotate(-90deg)
      }
      .toRight{
        transform: rotate(90deg);
      }
      .toUp{
        transform: rotate(180deg)
      }
      .toBottom{
        transform: rotate(0deg)
      }
    }
    .value{

    }
  }
}
#rotateBar{
  cursor:url(https://www.zhangxinxu.com/sp/svg/images/rotate.png) 12 12,auto;
}
#gAntBorder{

}
.showAnt{
  display: none;
}
</style>
