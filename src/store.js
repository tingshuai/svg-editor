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
        }
        let onstart = (cx,cy,e)=>{
          context.itemMoveMsg.cx = cx;
          context.itemMoveMsg.cy = cy;          
          context.itemMoveMsg.state = "start"
        }
        ele.drag(onmove, onstart, onend)
      });
      context.Svg.selectAll(".svgItem").forEach((ele,i,arr)=>{
        console.log(ele);
        
        ele.hover((e)=>{
          ele.attr({
            cursor:"move"
          })
        });
      });
      context.Svg.selectAll(".gSvgItem").forEach((ele,i,arr)=>{
        ele.mousemove((e)=>{
          console.log(e);
        });
      });      
    },
    addLayer(context){
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
    addAnt(context){
      this.commit('removeAnt')
      if(context.Svg.selectAll(`#ant${context.actLayerId}`).length == 0){
        let _lineBox = context.Svg.select(`#id${context.actLayerId}`).getBBox();
        console.log( _lineBox );
        let _line = `M${_lineBox.x-2} ${_lineBox.y-2}V${_lineBox.y2+2}H${_lineBox.x2+2}V${_lineBox.y-2}Z`;   
        let promise = new Promise((resolve,reject)=>{
          let _box = context.Svg.paper.path(_line).attr({
              stroke: "#333",
              strokeWidth: 1,
              fill:"none",
              strokeDasharray:"2 2",
              strokeDashoffset:0,
              id:`ant${context.actLayerId}`,
              class:"antBorder"
          });
          resolve(_box);
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
