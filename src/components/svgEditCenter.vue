<template>
      <section class="center" id="wrapDraw"><!--contenteditable ="false"-->
          <vuescroll ref="vs" :opsvg="opsvg">
              <svg id="svg" class="svg" @mousewheel="mousewheel" :class="selType" :style="{'cursor':svgStyle.cursor}" xmlns="http://www.w3.org/2000/svg" version="1.1">
                <svg id="canvas" xmlns="http://www.w3.org/2000/svg" @mousedown="mousedown">
                  <rect id="contentBg" style="pointer-events:all;"></rect>
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
              </svg>
          </vuescroll>
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
        <div id="mask" v-show="isMove" @mousemove="moveSvg" :style="{'cursor':svgStyle.cursor}"></div>
      </section>
</template>
<script>
let Svg;
import vuescroll from 'vuescroll';
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
    vuescroll
  },  
  data () {
    return {
      formula:"",
      dragPosition:{//绘制pop 位置信息...
        x:0,
        y:0
      },
      movePosition:{//绘制pop 位置方向提示....
        x:0,
        y:0,
        show:false,
        isUp:"toUp",
        isRight:"toRight"
      },
      svgStyle:{//svg上的鼠标样式
        cursor:"default"
      },
      wheel:{
        value:null,
        step:40,
        rate:0
      },
      isMove:false,
      svgMouseDownCoor:[],//鼠标在svg上点击时的坐标.....
      opsvg:{//滚动条配置....
          vuescroll: {
            mode: "native",
            zooming: false,
            sizeStrategy:"number"
          },
          rail: {
            background: "",
            size: "15px",
            gutterOfEnds:"0px",
            gutterOfSide:"0px"
          },
          scrollPanel:{
            initialScrollY:true,
            initialScrollX:true,
            scrollLeft:0,
            scrollTop:0
          },
          bar: {
            keepShow: true,
            size: "8px"
          },
          scrollButton: {
            enable: true
          }
      }
    }
  },
  created(){

  },
  computed:{
    coordinateClientMove(){
      return this.$store.state.draw.itemMoveMsg;
    },
    showAnt:{//是否显示蚂蚁线...
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
    this.formula =  "$${\\frac{[Hg^2+][Hg]}{[co2^2+]}}$$";
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
    this.$store.commit("initViewBox");
    document.addEventListener('keypress', (e)=> {
      if( e.keyCode == 32 ){//按下space键........
        this.isMove = true;
        this.svgStyle.cursor = "-webkit-grab";
      }
    })  
    document.addEventListener('keyup', (e)=> {
      if( _storeState.drawType != "" ){

      }
      if( e.keyCode == 32 ){//space键
        this.isMove = false;
        this.svgStyle.cursor = "default";
      }
    })          

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
        this.draw(n[2]);
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
    moveSvg(e){//按下space用滑动滚动条.......
      if( e.buttons == 1 ){//按下左键...
          let _rate = -1.5;
          this.$refs['vs'].scrollBy({ dx: e.movementX*_rate, dy: e.movementY*_rate },false);
      }
    },
    mousewheel(e){//鼠标滚轮放大.....
      let _boxSvg = $('#wrapDraw').get(0).getBoundingClientRect();
      let _boxCanvas = $('#canvas').get(0).getBoundingClientRect();
      let _step = 40;//滚动放大步长.....
      e.wheelDelta ? this.wheel.value = e.wheelDelta : this.wheel.value = e.detail;
      if( this.wheel.value > 0 ){
        this.svgStyle.cursor = "zoom-in";
      }else{
        this.svgStyle.cursor = "zoom-out"
      }
      if(e.altKey){//按下alt键.........
        let _oldRate;
        let promise = new Promise((resolve,reject)=>{
          if( this.wheel.value > 0 ){//放大.....
            this.wheel.rate += this.wheel.step;
            _oldRate = this.wheel.rate -  this.wheel.step;
            resolve();
          }else{//缩小......
            if( (_boxCanvas.width > 100) && (_boxCanvas.height > 100) ){//控制不能无限缩小.....
              this.wheel.rate -= this.wheel.step;
              _oldRate = this.wheel.rate +  this.wheel.step;
              resolve();
            }
          }
        })
        promise.then((wheel)=>{
          let _w = (_boxSvg.width+this.wheel.rate)*2/3, _h = _w*_boxSvg.height/_boxSvg.width;
          let _oldW = (_boxSvg.width+_oldRate)*2/3, _oldH = _oldW*_boxSvg.height/_boxSvg.width;
          SVG.get('svg').animate(50,'<>').during((pos, morph, eased, situation)=>{
            SVG.get('svg').attr({
              width:_w > _boxSvg.width ? morph(_oldW,_w) : _boxSvg.width,
              height:_h > _boxSvg.height ? morph(_oldH,_h) : _boxSvg.height-4
            })
            SVG.get('canvas').attr({
              width: morph(_oldW,_w),
              height:morph(_oldH,_h),
              x:_w > _boxSvg.width ? 0 : morph((_boxSvg.width-_oldW)/2,( _boxSvg.width-_w )/2),
              y:_h > _boxSvg.height ? 0 : morph((_boxSvg.height-_oldH)/2,(_boxSvg.height-_h)/2)
            })
            this.$refs['vs'].scrollBy({
                dx: `${(_w - _oldW)/(_w-_boxSvg.width)*100}%`,
                dy: `${(_h - _oldH)/(_h-_boxSvg.height)*100}%`
            });
          }).afterAll(()=>{
            this.svgStyle.cursor = "default"
          })
        })
      }else if(this.svgStyle.cursor != "default"){
        this.svgStyle.cursor = "default";
      }
    },
    mousedown(e){
      let that = this;
      let _storeState = this.$store.state;
      let _rates = 1/SVG.get('canvas').viewbox().zoom;
      _storeState.draw.timer = true;//绘画开始.....
      _storeState.coordinateDown = [ e.pageX,e.pageY ,e ];//记录鼠标按下的坐标....
      let _canvasBox = SVG.get('canvas').rbox();
      this.svgMouseDownCoor = this.$store.getters.getSvgPosi([e.pageX,e.pageY,e]);
      _storeState.time = new Date().getTime();
      this.draw(e);
      e.preventDefault();
    },
    draw(event){
      let _storeState = this.$store.state;
      let _canvasMove = this.$store.getters.getSvgPosi(_storeState.coordinateMove);
      switch( _storeState.drawType ){
        case "xuanze":{//选择.....
          break;
        }
        case "wenzi":{//文字工具......
          if( _storeState.draw.timer && event.type == "mousedown" ){
              if( SVG.get(`id${_storeState.time}`) == null ){
                let _group = _storeState.Draw.group().attr({
                  id:'gid'+_storeState.time
                });
                _group.foreignObject().attr({
                    fill:"none",
                    class:"gSvgItem",
                    id:'id'+_storeState.time,
                    "data-type":"text",
                    "data-id":_storeState.time,
                    "stroke-width": 1,
                    "vector-effect":"non-scaling-stroke",
                    stroke:_storeState.defaultConfig.stroke,
                    width:0,
                    height:0,
                    x:this.svgMouseDownCoor[0],
                    y:this.svgMouseDownCoor[1]
                }).appendChild("div", {
                  innerText: " ",
                  id:'textId'+ _storeState.time
                })
                $(`#textId${_storeState.time}`).attr({
                  class:"svgItem",
                  'data-id':_storeState.time,
                  'data-type':"text",
                  "font-size":'12px',
                }).css({
                  "text-align":"left",
                  "white-space": "nowrap",
                  "display":"inline-block"
                })
                _storeState.popEditPosition.value = '';
                _storeState.popEditPosition.isShow = true;
                _storeState.popEditPosition.x = event.offsetX ;
                _storeState.popEditPosition.y = event.offsetY ;
                this.$store.dispatch('bindFocusEvent');//以后聚焦显示蚂蚁线......
                this.$store.dispatch("addLayer",_storeState.time);
                this.$store.commit('addAnt',_storeState.time);//重绘蚂蚁线......
              }
          }
          break;
        }
        case "xiantiao":{//线段
          if( _storeState.draw.timer && event.type == "mousemove" ){
              if( SVG.get(`id${_storeState.time}`) == null ){
                let _line = _storeState.Draw.line(`${this.svgMouseDownCoor[0]}, ${this.svgMouseDownCoor[1]} ,${_canvasMove[0]}, ${_canvasMove[1]}`).attr({
                    stroke: _storeState.defaultConfig.stroke,
                    "stroke-width": _storeState.defaultConfig.strokeWidth,
                    class:"svgItem",
                    "vector-effect":"non-scaling-stroke",
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
                this.$store.dispatch( 'bindFocusEvent' );//以后聚焦显示蚂蚁线......
                this.$store.dispatch( "addLayer", _storeState.time );
              }else{
                SVG.get(`id${_storeState.time}`).attr({
                  x1:`${this.svgMouseDownCoor[0]}`,
                  y1:`${this.svgMouseDownCoor[1]}`,
                  x2:`${_canvasMove[0]}`,
                  y2:`${_canvasMove[1]}`
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
          if( _storeState.draw.timer && event.type == "mousemove" ){
            if( SVG.get(`id${_storeState.time}`) == null ){
              let _rect = _storeState.Draw.path(`M${_storeState.coordinateOffsetDown[0]} ${_storeState.coordinateOffsetDown[1]}`).attr({
                  stroke: _storeState.defaultConfig.stroke,
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
  position:absolute;
  left:80px;
  right:300px;
  bottom:0;
  top:0;
  overflow: hidden;
  transition:transform 500ms cubic-bezier(0.92, -0.06, 0.24, 0.92);
  .svg{
    overflow: hidden;
    #canvas{
      
    }
    .svgItem{
      vector-effect:"non-scaling-stroke";
    }    
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
.read-write {
    -webkit-user-modify: read-write;
    user-modify: read-write;
}
#mask{
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>
