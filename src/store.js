import Vue from "vue";
import Vuex from "vuex";
import draw from './modules/draw.js'
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    draw
  },  
  state: {
    Snap:null,
    Svg:null,
    coordinateDown:[],//鼠标按下的坐标.....
    coordinateUp:null,//鼠标抬起的坐标.....   
    coordinateOffsetDown:[],//鼠标相对于svg的偏移.....
    coordinateSvgMove:[],//鼠标在svg上的移动距离......
    coordinateMove:[],//鼠标移动.....
    actLayerId:null,//当前活动层.....
    drawType:"xuanze",//画笔类型.....
    layer:[],//图层....
    timer:null,//是否结束绘制....
    itemMoveMsg:{
      x:"",
      y:"",
      cx:"",
      cy:"",
      e:"",
      state:""
    },
    publicAttr:{
      "fill":"none",
      "stroke":"black",
      "strokeWidth":5,
      "strokeDasharray":0,
      "strokeDashoffset":0
    },
    _matrix:null,//变换矩阵....
    fixedPoint:[],//变换时的定点坐标......
    showAnt:false,//是否显示蚂蚁线.....
  },
  mutations: {
    bindFocusEvent(context){
      if(context.actLayerId != null){//判断是否有焦点....
        this.commit("addAnt");//聚焦时应该重绘蚂蚁线.......
      }
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
    bindResize(context){
          let bind = (type)=>{
            let _id = null;
            let onend = (e)=>{
              e.stopPropagation();
              this.commit("resizeEnd",{"e":e,"id":_id});
            }
            let onmove = (x,y,cx,cy,e)=>{
              e.stopPropagation();
              this.commit("resize",{"x":x,"y":y,"cx":cx,"cy":cy,"e":e,"type":type,id:_id});
            }
            let onstart = (cx,cy,e)=>{
              e.stopPropagation();
              //获取焦点元素ID
              let _dataset = e.srcElement.dataset;
              _id = _dataset.id;
              //定点坐标....
              context.fixedPoint[0] = Number(_dataset["fixedpoint_x"]);
              context.fixedPoint[1] = Number(_dataset["fixedpoint_y"]);              
            }
            context.Svg.select(`#${type}`).drag( onmove,onstart,onend );
          }
          context.Svg.selectAll("._controlBar").forEach((ele)=>{
            let _type = ele.attr('data-type');
            bind(_type)
          })
    },
    resize(context,obj){//开始变换....
      let _ele = context.Svg.select(`#id${obj.id}`);
      let _box = context.Snap.path.getBBox(_ele.realPath);
      context.itemMoveMsg.x = obj.x;
      context.itemMoveMsg.y = obj.y;
      
      context._matrix = new Snap.Matrix();
      if( obj.type == "squareLT" ){
          if( obj.e.altKey && !obj.e.shiftKey ){
            context._matrix.scale((_box.width-obj.x)/_box.width,(_box.height-obj.y)/_box.height,context.fixedPoint[0]-_box.width/2,context.fixedPoint[1]-_box.height/2);
          }else if( obj.e.shiftKey && !obj.e.altKey){
            context._matrix.scale((_box.width-obj.x)/_box.width,(_box.width-obj.x)/_box.width,context.fixedPoint[0],context.fixedPoint[1]);
          }else if( obj.e.altKey && obj.e.shiftKey ){
            context._matrix.scale((_box.width-obj.x)/_box.width,(_box.width-obj.x)/_box.width,context.fixedPoint[0]-_box.width/2,context.fixedPoint[1]-_box.height/2);
          }else{
            context._matrix.scale((_box.width-obj.x)/_box.width,(_box.height-obj.y)/_box.height,context.fixedPoint[0],context.fixedPoint[1]);
          }
      }else if( obj.type == "squareCT" || obj.type == "lineTop" ){

      }else if( obj.type == "squareRT" ){
        
      }else if( obj.type == "squareCR" || obj.type == "lineRight" ){

      }else if( obj.type == "squareBR" ){

      }else if( obj.type == "squareBC" || obj.type == "lineBottom" ){

      }else if( obj.type == "squareBL"){

      }else if( obj.type == "squareCL" || obj.type == "lineLeft" ){

      }
      _ele.transform(context._matrix).attr({"vector-effect":"non-scaling-stroke"});
      this.commit("addAnt")
    },
    resizeEnd(context,obj){//结束变换触发....
        let _ele = context.Svg.select(`#id${obj.id}`);
        let pathTransform = Snap.path.map(_ele.attr("d").toString(), context._matrix).toString() + "Z";
        let _m = new Snap.Matrix();
        _ele.attr({d:pathTransform})
        _ele.transform(_m);        
        context.itemMoveMsg.x = 0;
        context.itemMoveMsg.y = 0;
    },
    addAnt(context){//重绘控制点.....
        let _lineBox = context.Svg.select(`#id${context.actLayerId}`).getBBox();
        let _strockWidth = Number( context.Svg.select(`#id${context.actLayerId}`).attr("stroke-width").replace('px',''));
        let isOne = context.actLayerId == context.Svg.select('#gAntBorder').attr("data-id") ? true : false;//判断是否是同一个图层.....
        context.Svg.select("#gAntBorder").attr({'data-id':context.actLayerId});
        
        context.Svg.select("#lineTop").attr({x1:_lineBox.x-_strockWidth/2,y1:_lineBox.y-_strockWidth/2,x2:_lineBox.x2+_strockWidth/2,y2:_lineBox.y-_strockWidth/2,"data-id":context.actLayerId,"data-fixedpoint_x":_lineBox.x+_lineBox.width/2,"data-fixedpoint_y":_lineBox.y2});
        context.Svg.select("#lineRight").attr({x1:_lineBox.x2+_strockWidth/2,y1:_lineBox.y-_strockWidth/2,x2:_lineBox.x2+_strockWidth/2,y2:_lineBox.y2+_strockWidth/2,"data-id":context.actLayerId,"data-fixedpoint_x":_lineBox.x,"data-fixedpoint_y":_lineBox.y+_lineBox.height/2});
        context.Svg.select("#lineBottom").attr({x1:_lineBox.x-_strockWidth/2,y1:_lineBox.y2+_strockWidth/2,x2:_lineBox.x2+_strockWidth/2,y2:_lineBox.y2+_strockWidth/2,"data-id":context.actLayerId,"data-fixedpoint_x":_lineBox.x+_lineBox.width/2,"data-fixedpoint_y":_lineBox.y});
        context.Svg.select("#lineLeft").attr({x1:_lineBox.x-_strockWidth/2,y1:_lineBox.y-_strockWidth/2,x2:_lineBox.x-_strockWidth/2,y2:_lineBox.y2+_strockWidth/2,"data-id":context.actLayerId,"data-fixedpoint_x":_lineBox.x2,"data-fixedpoint_y":_lineBox.y+_lineBox.height/2});
        
        let _w = 5;
        context.Svg.select("#squareLT").attr({x:_lineBox.x-_w-_strockWidth/2,y:_lineBox.y-_w-_strockWidth/2,width:_w,height:_w,"data-id":context.actLayerId,"data-fixedpoint_x":_lineBox.x2,"data-fixedpoint_y":_lineBox.y2});
        context.Svg.select("#squareCT").attr({x:_lineBox.x+_lineBox.width/2-_w/2,y:_lineBox.y-_w-_strockWidth/2,width:_w,height:_w,"data-id":context.actLayerId,"data-fixedpoint_x":_lineBox.x+_lineBox.width/2,"data-fixedpoint_y":_lineBox.y2});
        context.Svg.select("#squareRT").attr({x:_lineBox.x2+_strockWidth/2,y:_lineBox.y-_w-_strockWidth/2,width:_w,height:_w,"data-id":context.actLayerId,"data-fixedpoint_x":_lineBox.x,"data-fixedpoint_y":_lineBox.y2});
        context.Svg.select("#squareCR").attr({x:_lineBox.x2+_strockWidth/2,y:_lineBox.y+_strockWidth/2+_lineBox.height/2-_w/2-_strockWidth/2,width:_w,height:_w,"data-id":context.actLayerId,"data-fixedpoint_x":_lineBox.x,"data-fixedpoint_y":_lineBox.y+_lineBox.height/2});
        context.Svg.select("#squareBR").attr({x:_lineBox.x2+_strockWidth/2,y:_lineBox.y2+_strockWidth/2,width:_w,height:_w,"data-id":context.actLayerId,"data-fixedpoint_x":_lineBox.x,"data-fixedpoint_y":_lineBox.y});
        context.Svg.select("#squareBC").attr({x:_lineBox.x+_lineBox.width/2-_w/2,y:_lineBox.y2+_strockWidth/2,width:_w,height:_w,"data-id":context.actLayerId,"data-fixedpoint_x":_lineBox.x+_lineBox.width/2,"data-fixedpoint_y":_lineBox.y});
        context.Svg.select("#squareBL").attr({x:_lineBox.x-_w-_strockWidth/2,y:_lineBox.y2+_strockWidth/2,width:_w,height:_w,"data-id":context.actLayerId,"data-fixedpoint_x":_lineBox.x2,"data-fixedpoint_y":_lineBox.y});
        context.Svg.select("#squareCL").attr({x:_lineBox.x-_w-_strockWidth/2,y:_lineBox.y+_strockWidth/2+_lineBox.height/2-_w/2-_strockWidth/2,width:_w,height:_w,"data-id":context.actLayerId,"data-fixedpoint_x":_lineBox.x2,"data-fixedpoint_y":_lineBox.y+_lineBox.height/2});

        let _use = context.Svg.select('#_antBorder');
        if( !isOne ){//如果不是同一个图层则添加.....
          context.Svg.select(`#gid${context.actLayerId}`).append(_use);
        }
        context.showAnt ? null : context.showAnt = true;
    }
  },
  actions: {

  }
});
