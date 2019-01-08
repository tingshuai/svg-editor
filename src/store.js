import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    Snap:null,
    Svg:null,
    coordinateDown:[],//鼠标按下的坐标.....
    coordinateUp:[],//鼠标抬起的坐标.....   
    coordinateOffsetDown:[],//鼠标相对于svg的偏移.....
    coordinateMove:[],//鼠标移动.....
    actLayerId:null,//当前活动层.....
    drawType:"xuanze",//画笔类型.....
    layer:[],//图层....
    timer:null,//是否结束绘制....
    mouseevent:0,//0无事件,1左键按下，2右键按下....
    itemMoveMsg:{
      x:"",
      y:"",
      cx:"",
      cy:"",
      e:"",
      state:""
    }
  },
  mutations: {
    bindFocusEvent(context){
      context.Svg.selectAll('.svgItem').forEach((val,i,arr)=>{
        val.unclick();
        val.mousedown((e)=>{
          let _dataset = e.currentTarget.dataset;
          context.actLayerId = _dataset.id;//更新活动元素ID
          this.commit("addAnt");//添加蚂蚁线
        });
      })
    },    
    bindDrag(context){
      let that = this;
      context.Svg.selectAll(".gSvgItem").forEach((ele,i,arr)=>{
        ele.drag();
        let onend = (e)=>{
          context.itemMoveMsg.state = "end"
        }
        let onmove = (x,y,cx,cy,e)=>{
          context.itemMoveMsg.x = x;
          context.itemMoveMsg.y = y;
          context.itemMoveMsg.cx = cx;
          context.itemMoveMsg.cy = cy;
          context.itemMoveMsg.e = e;
          context.itemMoveMsg.state = "move"
          that.commit("addAnt");
          that.commit("bindResize");
        }
        let onstart = (cx,cy,e)=>{
          context.itemMoveMsg.cx = cx;
          context.itemMoveMsg.cy = cy;          
          context.itemMoveMsg.state = "start"
        }
        ele.drag(onmove, onstart, onend);
      });
      context.Svg.selectAll(".svgItem").forEach((ele,i,arr)=>{
        ele.hover((e)=>{
          ele.attr({
            cursor:"move"
          })
        });
      });  
    },
    addLayer(context){
      let _time = new Date().getTime();
      context.actLayerId = _time;      
      context.layer.push({
        name:"图层" + (context.layer.length + 1),
        id:context.actLayerId
      })
    },
    removeAnt(context){
      context.Svg.selectAll('.antBorder').forEach((val,i,arr)=>{
        val.remove();
      })
      context.Snap('#svgNoShow').selectAll('line').forEach((val,i,arr)=>{
        val.remove();
      })  
      context.Snap('#svgNoShow').selectAll('rect').forEach((val,i,arr)=>{
        val.remove();
      })             
    },
    bindResize(context){
      if(context.Svg.selectAll(`#ant${context.actLayerId}`).length != 0){
          let bind = (target,type)=>{
            context.Svg.select(`.${target}`).attr({cursor:type,'data-type':target});
            let _id = null;
            let onend = (e)=>{
              console.log(e);
              e.stopPropagation();
            }
            let onmove = (x,y,cx,cy,e)=>{
              this.commit("resize",{"x":x,"y":y,"cx":cx,"cy":cy,"e":e,"type":target,"dragger":type,id:_id});
              e.stopPropagation();
            }
            let onstart = (cx,cy,e)=>{
              console.log(cx,cy,e);
              _id = e.srcElement.dataset.id;
              e.stopPropagation();
            }
            context.Svg.select(`.${target}`).drag(onmove,onstart,onend);
          }
          context.Svg.select('.squareLT') != null ? bind('squareLT',"nw-resize") : null;
          context.Svg.select('.squareCT') != null ? bind('squareCT',"ns-resize") : null;
          context.Svg.select('.squareRT') != null ? bind('squareRT',"ne-resize") : null;
          context.Svg.select('.squareCR') != null ? bind('squareCR',"ew-resize") : null;
          context.Svg.select('.squareBR') != null ? bind('squareBR',"nw-resize") : null;
          context.Svg.select('.squareBC') != null ? bind('squareBC',"ns-resize") : null;
          context.Svg.select('.squareBL') != null ? bind('squareBL',"ne-resize") : null;
          context.Svg.select('.squareCL') != null ? bind('squareCL',"ew-resize") : null;
          context.Svg.select('.lineTop') != null ? bind('lineTop',"ns-resize") : null;
          context.Svg.select('.lineRight') != null ? bind('lineRight',"ew-resize") : null;
          context.Svg.select('.lineBottom') != null ? bind('lineBottom',"ns-resize") : null;
          context.Svg.select('.lineLeft') != null ? bind('lineLeft',"ew-resize") : null;
      }
    },
    resize(context,obj){
      let _ele = context.Svg.select(`#id${obj.id}`);
      let _changeSize = ()=>{
        if( obj.type == "squareLT" ){
          if( _ele.type == "line" ){
            if( obj.e.altKey ){
  
            }else{
              
            }
          }else if( _ele.type == "rect" ){
  
          }
        }else if( obj.type == "squareCT" || obj.type == "lineTop" ){

        }else if( obj.type == "squareRT" ){
          
        }else if( obj.type == "squareCR" || obj.type == "lineRight" ){

        }else if( obj.type == "squareBR" ){

        }else if( obj.type == "squareBC" || obj.type == "lineBottom" ){

        }else if( obj.type == "squareBL"){

        }else if( obj.type == "squareCL" || obj.type == "lineLeft" ){

        }
      }
      if( obj.e.altKey ){

      }else{

      }
    },
    addAnt(context){
      this.commit('removeAnt')
      if(context.Svg.selectAll(`#ant${context.actLayerId}`).length == 0){
        let _lineBox = context.Svg.select(`#id${context.actLayerId}`).getBBox();
        let _color = "#00bf63";
        let _lineTop = context.Snap('#svgNoShow').paper.line(_lineBox.x,_lineBox.y,_lineBox.x2,_lineBox.y).attr({"data-id":context.actLayerId,class:"lineTop",stroke: _color,strokeWidth: 1,fill:"none",strokeDasharray:"2 2",strokeDashoffset:0});
        let _lineRight = context.Snap('#svgNoShow').paper.line(_lineBox.x2,_lineBox.y,_lineBox.x2,_lineBox.y2).attr({"data-id":context.actLayerId,class:"lineRight",stroke: _color,strokeWidth: 1,fill:"none",strokeDasharray:"2 2",strokeDashoffset:0});
        let _lineBottom = context.Snap('#svgNoShow').paper.line(_lineBox.x,_lineBox.y2,_lineBox.x2,_lineBox.y2).attr({"data-id":context.actLayerId,class:"lineBottom", stroke: _color,strokeWidth: 1,fill:"none",strokeDasharray:"2 2",strokeDashoffset:0});
        let _lineLeft = context.Snap('#svgNoShow').paper.line(_lineBox.x,_lineBox.y,_lineBox.x,_lineBox.y2).attr({"data-id":context.actLayerId,class:"lineLeft",stroke: _color,strokeWidth: 1,fill:"none",strokeDasharray:"2 2",strokeDashoffset:0});

        let _w = 5;
        let _squareLT = context.Snap('#svgNoShow').paper.rect(_lineBox.x-_w,_lineBox.y-_w,_w,_w,0,0).attr({"data-id":context.actLayerId,class:"squareLT",stroke: _color,strokeWidth: 1,fill:_color});
        let _squareCT = context.Snap('#svgNoShow').paper.rect(_lineBox.x+_lineBox.width/2-_w/2,_lineBox.y-_w,_w,_w,0,0).attr({"data-id":context.actLayerId,class:"squareCT",stroke: _color,strokeWidth: 1,fill:_color});
        let _squareRT = context.Snap('#svgNoShow').paper.rect(_lineBox.x2,_lineBox.y-_w,_w,_w,0,0).attr({"data-id":context.actLayerId,class:"squareRT",stroke: _color,strokeWidth: 1,fill:_color});
        let _squareCR = context.Snap('#svgNoShow').paper.rect(_lineBox.x2,_lineBox.y+_lineBox.height/2-_w/2,_w,_w,0,0).attr({"data-id":context.actLayerId,class:"squareCR",stroke: _color,strokeWidth: 1,fill:_color});
        let _squareBR = context.Snap('#svgNoShow').paper.rect(_lineBox.x2,_lineBox.y2,_w,_w,0,0).attr({"data-id":context.actLayerId,class:"squareBR",stroke: _color,strokeWidth: 1,fill:_color});
        let _squareBC = context.Snap('#svgNoShow').paper.rect(_lineBox.x+_lineBox.width/2-_w/2,_lineBox.y2,_w,_w,0,0).attr({"data-id":context.actLayerId,class:"squareBC",stroke: _color,strokeWidth: 1,fill:_color});
        let _squareBL = context.Snap('#svgNoShow').paper.rect(_lineBox.x-_w,_lineBox.y2,_w,_w,0,0).attr({"data-id":context.actLayerId,class:"squareBL",stroke: _color,strokeWidth: 1,fill:_color});
        let _squareCL = context.Snap('#svgNoShow').paper.rect(_lineBox.x-_w,_lineBox.y+_lineBox.height/2-_w/2,_w,_w,0,0).attr({"data-id":context.actLayerId,class:"squareCL",stroke: _color,strokeWidth: 1,fill:_color});

        let promise;
        promise = new Promise((resolve,reject)=>{
          let _gLineBox = context.Snap('#svgNoShow').paper.g(_lineTop,_lineRight,_lineBottom,_lineLeft,_squareLT,_squareCT,_squareRT,_squareCR,_squareBR,_squareBC,_squareBL,_squareCL).attr({id:`ant${context.actLayerId}`,class:"antBorder","data-id":context.actLayerId});
          resolve(_gLineBox);
        })          
        promise.then((_box)=>{
            context.Svg.select(`#gid${context.actLayerId}`).append(_box);
            this.commit("bindResize");
        })
      }
    }
  },
  actions: {

  }
});
