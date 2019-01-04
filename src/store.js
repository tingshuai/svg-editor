import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    Svg:null,
    coordinateDown:[],//鼠标按下的坐标.....
    coordinateUp:[],//鼠标抬起的坐标.....   
    coordinateOffsetDown:[],//鼠标相对于svg的偏移.....
    coordinateMove:[],//鼠标移动.....
    actLayerId:null,//当前活动层.....
    drawType:"xuanze",//画笔类型.....
    layer:[],//图层....
  },
  mutations: {
    draw(context,obj){
      let _time = null;
      if( obj.event.type == "mousedown" ){
        _time = new Date().getTime();
        this.state.actLayerId = _time;
        obj._me.addLayer();
      }
      switch(context.drawType){
        case "xuanze":{//选择.....
          break;
        }
        case "wenzi":{//文字工具......
          break;
        }
        case "xiantiao":{//线段
          if( obj._me.timer ){
            if( obj.event.type == "mousedown" ){
              let _line = context.Svg.paper.line( context.coordinateOffsetDown[0]-5,context.coordinateOffsetDown[1]-5,context.coordinateOffsetDown[0],context.coordinateOffsetDown[1] ).attr({
                  stroke: "#000",
                  strokeWidth: 5,
                  class:"svgItem",
                  id:'id'+ context.actLayerId,
                  'data-id':this.state.actLayerId
              });
              context.Svg.paper.g(_line).attr({
                fill:"none",
                  class:"gSvgItem",
                  id:'gid'+this.state.actLayerId
              })
              obj._me.addAnt();
              obj._me.focusSvgItem();
            }else if(obj.event.type == "mousemove"){
              context.Svg.select(`#id${context.actLayerId}`).attr({
                x2:context.coordinateMove[0] - context.coordinateDown[0] + context.coordinateOffsetDown[0],
                y2:context.coordinateMove[1] - context.coordinateDown[1] + context.coordinateOffsetDown[1]
              });
              let _lineBox = context.Svg.select(`#id${context.actLayerId}`).getBBox();
              let _line = `M${_lineBox.x-2} ${_lineBox.y-2}V${_lineBox.y2+2}H${_lineBox.x2+2}V${_lineBox.y-2}Z`;
              context.Svg.select(`#ant${context.actLayerId}`).attr({
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
  },
  actions: {

  }
});
