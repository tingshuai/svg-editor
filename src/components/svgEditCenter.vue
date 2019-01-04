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
      timer:"",//是否结束绘制....
      layer:[],//图层......
      drawType:"",//画笔类型.....
      actLayerId:"",//焦点图层......
    }
  },
  created(){

  },
  mounted(){
    Svg = this.Snap('#svg');
    this.$store.state.Svg = this.Snap("#svg");
    this.focusSvgItem();
    this.bindDrag();
  },
  watch:{
    selType(n,o){
      Svg.selectAll(".gSvgItem").forEach((ele,i,arr)=>{
          ele.undrag();
      })
      this.drawType = n;
      this.$store.state.drawType = n;
      if( n == "xuanze" ){
        this.bindDrag();
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
        this.$store.commit('draw',{ event:{type:"mousemove"},_me:that });
      },
      deep:true
    }
  },
  methods:{
      antAni(){//蚂蚁线动画
        let _lineLength = Svg.select(`#ant${this.actLayerId}`).getTotalLength();
        let ani = ()=>{
          this.Snap.animate(0, _lineLength*150, (val)=>{
            Svg.select(`#ant${this.actLayerId}`).attr({
              strokeDashoffset:val,
            });
          },_lineLength*20000,()=>{
            setTimeout(ani,_lineLength*20000)
          });
        }
        ani();
      },
      focusSvgItem(){
        let that = this;
        let _storeState = this.$store.state;
        Svg.selectAll('.svgItem').forEach((val,i,arr)=>{
          val.unclick();
          val.mousedown((e)=>{
            let _dataset = e.currentTarget.dataset;
            _storeState.actLayerId = _dataset.id;//更新活动元素ID
            that.addAnt();//添加蚂蚁线
          });
        })
      },
      removeAnt(){
        Svg.selectAll('.antBorder').forEach((val,i,arr)=>{
          val.remove();
        })
      },
      addAnt(){
        let that = this;
        let _storeState = this.$store.state;
        this.removeAnt();
        if(Svg.selectAll(`#ant${_storeState.actLayerId}`).length == 0){
          let _lineBox = Svg.select(`#id${_storeState.actLayerId}`).getBBox();
          let _line = `M${_lineBox.x-2} ${_lineBox.y-2}V${_lineBox.y2+2}H${_lineBox.x2+2}V${_lineBox.y-2}Z`;   
          let promise = new Promise((resolve,reject)=>{
            let _box = Svg.paper.path(_line).attr({
                stroke: "#333",
                strokeWidth: 1,
                fill:"none",
                strokeDasharray:"2 2",
                strokeDashoffset:0,
                id:`ant${_storeState.actLayerId}`,
                class:"antBorder"
            });
            resolve(_box);
          })
          promise.then((_box)=>{
              Svg.select(`#gid${_storeState.actLayerId}`).append(_box);
          })
        }
      },
      clickSvgItem(e){
        Svg.selectAll('.svgItem').forEach((val,i,arr)=>{
          val.remove();
        })
      },
      bindDrag(){
        Svg.selectAll(".gSvgItem").forEach((ele,i,arr)=>{
            ele.drag();
        });
      },
      mousedown(e){
        let that = this;
        this.timer = true;//绘画开始.....
        this.$store.state.coordinateDown = [ e.pageX,e.pageY ];//记录鼠标按下的坐标....
        this.$store.state.coordinateOffsetDown = [ e.offsetX,e.offsetY ];
        this.$store.commit('draw',{ event:e,_me:that })
        e.preventDefault();
      },
      addLayer(){
        let _storeState = this.$store.state;
        _storeState.layer.push({
          name:"图层" + (_storeState.layer.length + 1),
          id:_storeState.actLayerId
        })
      },
      drawFirst(obj){
        let _time = new Date().getTime();
        this.actLayerId = _time;
        let _storeState = this.$store.state;
        switch( this.drawType ){
          case "xuanze":{//选择.....
            break;
          }
          case "wenzi":{//文字工具......
            break;
          }
          case "xiantiao":{//线段
            if( this.timer ){
              let _line = Svg.paper.line( _storeState.coordinateOffsetDown[0]-5,_storeState.coordinateOffsetDown[1]-5,_storeState.coordinateOffsetDown[0],_storeState.coordinateOffsetDown[1] ).attr({
                  stroke: "#000",
                  strokeWidth: 5,
                  class:"svgItem",
                  id:'id'+_time,
                  'data-id':_time
              });
              Svg.paper.g(_line).attr({
                fill:"none",
                  class:"gSvgItem",
                  id:'gid'+_time
              })
              this.addAnt(_time);
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
      },
      draw(n){
        let _storeState = this.$store.state;
        switch(this.drawType){
          case "xuanze":{//选择.....
            break;
          }
          case "wenzi":{//文字工具......
            break;
          }
          case "xiantiao":{//线段
            Svg.select(`#id${this.actLayerId}`).attr({
              x2:_storeState.coordinateMove[0] - _storeState.coordinateDown[0] + _storeState.coordinateOffsetDown[0],
              y2:_storeState.coordinateMove[1] - _storeState.coordinateDown[1] + _storeState.coordinateOffsetDown[1]
            });
            let _lineBox = Svg.select(`#id${this.actLayerId}`).getBBox();
            let _line = `M${_lineBox.x-2} ${_lineBox.y-2}V${_lineBox.y2+2}H${_lineBox.x2+2}V${_lineBox.y-2}Z`;
            Svg.select(`#ant${this.actLayerId}`).attr({
              d:_line
            });//更新蚂蚁线范围
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
