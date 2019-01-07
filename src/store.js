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
    focusSvgItem(context){
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
        }
        let onstart = (cx,cy,e)=>{
          context.itemMoveMsg.cx = cx;
          context.itemMoveMsg.cy = cy;          
          context.itemMoveMsg.state = "start"
        }
        ele.drag(onmove, onstart, onend);
      });
      if(context.Svg.selectAll(`#ant${context.actLayerId}`).length != 0){
        this.commit("addAnt");
      }
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
    },
    bindResize(context){
      if(context.Svg.selectAll(`#ant${context.actLayerId}`).length != 0){
        context.Svg.select('.squareLT').attr({cursor:"nw-resize"});
        context.Svg.select('.squareCT').attr({cursor:"ns-resize"});
        context.Svg.select('.squareRT').attr({cursor:"ne-resize"});
        context.Svg.select('.squareCR').attr({cursor:"ew-resize"});
        context.Svg.select('.squareBR').attr({cursor:"nw-resize"});
        context.Svg.select('.squareBC').attr({cursor:"ns-resize"});
        context.Svg.select('.squareBL').attr({cursor:"ne-resize"});
        context.Svg.select('.squareCL').attr({cursor:"ew-resize"});
        context.Svg.select('.lineTop').attr({cursor:"ns-resize"});
        context.Svg.select('.lineRight').attr({cursor:"ew-resize"});
        context.Svg.select('.lineBottom').attr({cursor:"ns-resize"});
        context.Svg.select('.lineLeft').attr({cursor:"ew-resize"});
      }
    },
    addAnt(context){
      this.commit('removeAnt')
      if(context.Svg.selectAll(`#ant${context.actLayerId}`).length == 0){
        console.log(context.actLayerId);
        let _lineBox = context.Svg.select(`#id${context.actLayerId}`).getBBox();
        let _lineTop = context.Svg.paper.line(_lineBox.x,_lineBox.y,_lineBox.x2,_lineBox.y).attr({class:"lineTop",stroke: "#333",strokeWidth: 1,fill:"none",strokeDasharray:"2 2",strokeDashoffset:0});
        let _lineRight = context.Svg.paper.line(_lineBox.x2,_lineBox.y,_lineBox.x2,_lineBox.y2).attr({class:"lineRight",stroke: "#333",strokeWidth: 1,fill:"none",strokeDasharray:"2 2",strokeDashoffset:0});
        let _lineBottom = context.Svg.paper.line(_lineBox.x,_lineBox.y2,_lineBox.x2,_lineBox.y2).attr({class:"lineBottom", stroke: "#333",strokeWidth: 1,fill:"none",strokeDasharray:"2 2",strokeDashoffset:0});
        let _lineLeft = context.Svg.paper.line(_lineBox.x,_lineBox.y,_lineBox.x,_lineBox.y2).attr({class:"lineLeft",stroke: "#333",strokeWidth: 1,fill:"none",strokeDasharray:"2 2",strokeDashoffset:0});

        let _w = 5;
        let _squareLT = context.Svg.paper.rect(_lineBox.x-_w,_lineBox.y-_w,_w,_w,0,0).attr({class:"squareLT",stroke: "#333",strokeWidth: 1,fill:"#333"});
        let _squareCT = context.Svg.paper.rect(_lineBox.x+_lineBox.width/2-_w/2,_lineBox.y-_w,_w,_w,0,0).attr({class:"squareCT",stroke: "#333",strokeWidth: 1,fill:"#333"});
        let _squareRT = context.Svg.paper.rect(_lineBox.x2,_lineBox.y-_w,_w,_w,0,0).attr({class:"squareRT",stroke: "#333",strokeWidth: 1,fill:"#333"});
        let _squareCR = context.Svg.paper.rect(_lineBox.x2,_lineBox.y+_lineBox.height/2-_w/2,_w,_w,0,0).attr({class:"squareCR",stroke: "#333",strokeWidth: 1,fill:"#333"});
        let _squareBR = context.Svg.paper.rect(_lineBox.x2,_lineBox.y2,_w,_w,0,0).attr({class:"squareBR",stroke: "#333",strokeWidth: 1,fill:"#333"});
        let _squareBC = context.Svg.paper.rect(_lineBox.x+_lineBox.width/2-_w/2,_lineBox.y2,_w,_w,0,0).attr({class:"squareBC",stroke: "#333",strokeWidth: 1,fill:"#333"});
        let _squareBL = context.Svg.paper.rect(_lineBox.x-_w,_lineBox.y2,_w,_w,0,0).attr({class:"squareBL",stroke: "#333",strokeWidth: 1,fill:"#333"});
        let _squareCL = context.Svg.paper.rect(_lineBox.x-_w,_lineBox.y+_lineBox.height/2-_w/2,_w,_w,0,0).attr({class:"squareCL",stroke: "#333",strokeWidth: 1,fill:"#333"});

        let promise = new Promise((resolve,reject)=>{
          let _gLineBox = context.Svg.paper.g(_lineTop,_lineRight,_lineBottom,_lineLeft,_squareLT,_squareCT,_squareRT,_squareCR,_squareBR,_squareBC,_squareBL,_squareCL).attr({id:`ant${context.actLayerId}`,class:"antBorder"});
          resolve(_gLineBox);
        })
        promise.then((_box)=>{
            context.Svg.select(`#gid${context.actLayerId}`).append(_box);
        })
      }
    }
  },
  actions: {

  }
});
