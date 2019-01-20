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
    actItem:{
      "fill":"none",
      "stroke":"black",
      "strokeWidth":5,
      "strokeDasharray":0,
      "strokeDashoffset":0,
      newRotate:0,
      xita:null,
      matrix:null,
      oldRotate:0
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
        let _dataset;
        let _ele,_gele;
        let onend = (e)=>{
          context.itemMoveMsg.state = "end";
          this.commit("resizeEnd",{"e":e,"id":_dataset.id,"type":_dataset.type});
        }
        let onmove = (x,y,cx,cy,e)=>{
          context.itemMoveMsg.x = x;
          context.itemMoveMsg.y = y;
          context.itemMoveMsg.cx = cx;
          context.itemMoveMsg.cy = cy;
          context.itemMoveMsg.e = e;
          context.itemMoveMsg.state = "move";
          context._matrix = new Snap.Matrix(1,0,0,1,x,y);
        }
        let onstart = (cx,cy,e)=>{
          context.itemMoveMsg.cx = cx;
          context.itemMoveMsg.cy = cy;          
          context.itemMoveMsg.state = "start";
          _dataset = e.srcElement.dataset;
          _ele = context.Svg.select(`#id${_dataset.id}`);
          _gele = context.Svg.select(`#gid${_dataset.id}`);
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
        id:context.actLayerId,
        matrix:new Snap.Matrix(),
        "fill":"none",
        "stroke":"black",
        "strokeWidth":5,
        "strokeDasharray":0,
        "strokeDashoffset":0,
        rotate:0,
        xita:null,
      })
    },
    bindResize(context){
      let bind = (type)=>{
        let _id = null;
        let onend = (e)=>{
          e.stopPropagation();
          console.log( "type" , type );
          this.commit("resizeEnd",{"e":e,"id":_id,"type":type});
        }
        let onmove = (x,y,cx,cy,e)=>{
          e.stopPropagation();
          this.commit("resize",{"x":x,"y":y,"cx":cx,"cy":cy,"e":e,"type":type,id:_id});
        }
        let onstart = (cx,cy,e)=>{
          //获取焦点元素ID
          let _dataset = e.srcElement.dataset;
          _id = _dataset.id;
          //定点坐标....
          context.fixedPoint[0] = Number(_dataset["fixedpoint_x"]);
          context.fixedPoint[1] = Number(_dataset["fixedpoint_y"]);
          if(_dataset.type == "rotateBar"){
            let _box = context.Svg.select(`#${_dataset.type}`).getBBox();
            context.fixedPoint[2] = _box.cx;
            context.fixedPoint[3] = _box.cy;
          }
          context.layer.find((val,i,arr)=>{
            if( val.id == _id ){
              context.actItem.matrix = val.matrix;
            }
          });
          context.coordinateOffsetDown[0] = e.offsetX;
          context.coordinateOffsetDown[1] = e.offsetY;
          e.stopPropagation();
        }
        context.Svg.select(`#${type}`).drag( onmove,onstart,onend );
      }
      context.Svg.selectAll("._controlBar").forEach((ele)=>{
        let _type = ele.attr('data-type');
        bind(_type);
      })
    },
    resize(context,obj){//开始变换....
      let _ele = context.Svg.select(`#id${obj.id}`);
      let _gele = context.Svg.select(`#gid${obj.id}`);
      let _antBorder = context.Svg.select("#_antBorder");
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
          _ele.transform(context._matrix).attr({"vector-effect":"non-scaling-stroke"});
          this.commit("addAnt")
      }else if( obj.type == "squareCT" || obj.type == "lineTop" ){
          if( obj.e.altKey ){
            context._matrix.scale(1,(_box.height-obj.y)/_box.height,context.fixedPoint[0]-_box.width/2,context.fixedPoint[1]-_box.height/2);
          }else{
            context._matrix.scale(1,(_box.height-obj.y)/_box.height,context.fixedPoint[0],context.fixedPoint[1]);
          }
          _ele.transform(context._matrix).attr({"vector-effect":"non-scaling-stroke"});
          this.commit("addAnt")
      }else if( obj.type == "squareRT" ){
        if( obj.e.altKey && !obj.e.shiftKey ){
          context._matrix.scale((_box.width+obj.x)/_box.width,(_box.height-obj.y)/_box.height,context.fixedPoint[0]-_box.width/2,context.fixedPoint[1]-_box.height/2);
        }else if( obj.e.shiftKey && !obj.e.altKey){
          context._matrix.scale((_box.width+obj.x)/_box.width,(_box.width+obj.x)/_box.width,context.fixedPoint[0],context.fixedPoint[1]);
        }else if( obj.e.altKey && obj.e.shiftKey ){
          context._matrix.scale((_box.width+obj.x)/_box.width,(_box.width+obj.x)/_box.width,context.fixedPoint[0]-_box.width/2,context.fixedPoint[1]-_box.height/2);
        }else{
          context._matrix.scale((_box.width+obj.x)/_box.width,(_box.height-obj.y)/_box.height,context.fixedPoint[0],context.fixedPoint[1]);
        }   
          _ele.transform(context._matrix).attr({"vector-effect":"non-scaling-stroke"});
          this.commit("addAnt")
      }else if( obj.type == "squareCR" || obj.type == "lineRight" ){
        if( obj.e.altKey ){
          context._matrix.scale((_box.width+obj.x)/_box.width,1,context.fixedPoint[0]+_box.width/2,context.fixedPoint[1]);
        }else{
          context._matrix.scale((_box.width+obj.x)/_box.width,1,context.fixedPoint[0],context.fixedPoint[1]);
        }
          _ele.transform(context._matrix).attr({"vector-effect":"non-scaling-stroke"});
          this.commit("addAnt")
      }else if( obj.type == "squareBR" ){
        if( obj.e.altKey && !obj.e.shiftKey ){
          context._matrix.scale((_box.width+obj.x)/_box.width,(_box.height+obj.y)/_box.height,context.fixedPoint[0]+_box.width/2,context.fixedPoint[1]+_box.height/2);
        }else if( obj.e.shiftKey && !obj.e.altKey){
          context._matrix.scale((_box.width+obj.x)/_box.width,(_box.width+obj.x)/_box.width,context.fixedPoint[0],context.fixedPoint[1]);
        }else if( obj.e.altKey && obj.e.shiftKey ){
          context._matrix.scale((_box.width+obj.x)/_box.width,(_box.width+obj.x)/_box.width,context.fixedPoint[0]+_box.width/2,context.fixedPoint[1]+_box.height/2);
        }else{
          context._matrix.scale((_box.width+obj.x)/_box.width,(_box.height+obj.y)/_box.height,context.fixedPoint[0],context.fixedPoint[1]);
        }
        _ele.transform(context._matrix).attr({"vector-effect":"non-scaling-stroke"});
        this.commit("addAnt");
      }else if( obj.type == "squareBC" || obj.type == "lineBottom" ){
        if( obj.e.altKey ){
          context._matrix.scale(1,(_box.height+obj.y)/_box.height,context.fixedPoint[0]+_box.width/2,context.fixedPoint[1]+_box.height/2);
        }else{
          context._matrix.scale(1,(_box.height+obj.y)/_box.height,context.fixedPoint[0],context.fixedPoint[1]);
        }
          _ele.transform(context._matrix).attr({"vector-effect":"non-scaling-stroke"});
          this.commit("addAnt")
      }else if( obj.type == "squareBL"){
        if( obj.e.altKey && !obj.e.shiftKey ){
          context._matrix.scale((_box.width+obj.x)/_box.width,(_box.height-obj.y)/_box.height,context.fixedPoint[0]-_box.width/2,context.fixedPoint[1]+_box.height/2);
        }else if( obj.e.shiftKey && !obj.e.altKey){
          context._matrix.scale((_box.width-obj.x)/_box.width,(_box.width-obj.x)/_box.width,context.fixedPoint[0],context.fixedPoint[1]);
        }else if( obj.e.altKey && obj.e.shiftKey ){
          context._matrix.scale((_box.width-obj.x)/_box.width,(_box.width-obj.x)/_box.width,context.fixedPoint[0]-_box.width/2,context.fixedPoint[1]+_box.height/2);
        }else{
          context._matrix.scale((_box.width-obj.x)/_box.width,(_box.height+obj.y)/_box.height,context.fixedPoint[0],context.fixedPoint[1]);
        }    
          _ele.transform(context._matrix).attr({"vector-effect":"non-scaling-stroke"});
          this.commit("addAnt")
      }else if( obj.type == "squareCL" || obj.type == "lineLeft" ){
        if( obj.e.altKey ){
          context._matrix.scale((_box.width-obj.x)/_box.width,1,context.fixedPoint[0]-_box.width/2,context.fixedPoint[1]);
        }else{
          context._matrix.scale((_box.width-obj.x)/_box.width,1,context.fixedPoint[0],context.fixedPoint[1]);
        }
          _ele.transform(context._matrix).attr({"vector-effect":"non-scaling-stroke"});
          this.commit("addAnt")
        }else if( obj.type == "rotateBar" ){
          context._matrix = new Snap.Matrix();
          let _rotate = Snap.angle( context.fixedPoint[0],context.fixedPoint[1], obj.e.offsetX,obj.e.offsetY )-180;
          context._matrix.rotate( _rotate, context.fixedPoint[0],context.fixedPoint[1] );
          _antBorder.transform( context._matrix );
          
          // console.log( "deg",Snap.angle( context.fixedPoint[0],context.fixedPoint[1], obj.e.offsetX,obj.e.offsetY )-180 );
          // context.Svg.select("#polyline").attr({points:`${context.fixedPoint[0]},${context.fixedPoint[1]} ${obj.e.offsetX},${obj.e.offsetY}`}).attr({fill:"none",stroke:"#00ffff"});

          // this.commit("addAnt");
          // let pathTransform = Snap.path.map( _ele.attr('d').toString(), context._matrix ).toString()+"Z";
          // let _m = new Snap.Matrix();

          // _ele.transform(_m);//重置焦点元素matrix
          // _ele.attr({d:pathTransform});//将变换写入path..
      }
    },
    resizeEnd(context,obj){//结束变换触发....
      let _ele = context.Svg.select(`#id${obj.id}`);
      let _gele = context.Svg.select(`#gid${obj.id}`);
        let _m = new Snap.Matrix();
        // _ele.attr({d:pathTransform});//将变换写入path..
        _gele.transform(_m);//重置焦点元素matrix
        context.layer.find((val,i,arr)=>{
          if( val.id == obj.id ){
            val.matrix = context._matrix;
            // let _new = new Snap.Matrix().rotate(context.actItem.newRotate ,context.fixedPoint[0],context.fixedPoint[1]);

            // arr[i].rotate = context.actItem.newRotate;
          }
        });
        // _ele.attr({d:pathTransform});//将变换写入path..
        // this.commit("addAnt");//将变换写入蚂蚁线.....
        // if(obj.type == "rotateBar"){
        // }
    },
    addAnt(context){//重绘控制点.....

        let _lineBox = context.Svg.select(`#id${context.actLayerId}`).getBBox();
        
        let _strockWidth = Number( context.Svg.select(`#id${context.actLayerId}`).attr("stroke-width").replace('px',''));
        let isOne = context.actLayerId == context.Svg.select('#_antBorder').attr("data-id") ? true : false;//判断是否是同一个图层.....
        context.Svg.select("#_antBorder").attr({'data-id':context.actLayerId});
        context.Svg.select("#_antLine").attr({d:`M${_lineBox.x-_strockWidth/2} ${_lineBox.y-_strockWidth/2}H${_lineBox.x2+_strockWidth/2}V${_lineBox.y2+_strockWidth/2}H${_lineBox.x-_strockWidth/2}Z`});
        context.actItem.matrix = context._matrix;
        let _w = 5,_xita = Snap.atan(_lineBox.height/_lineBox.width),_alpha = context._matrix.split().rotate;
        context.actItem.xita = _xita;
        console.log("xita",_xita);
        console.log("_alpha",_alpha);
        // if( (_alpha > -22.5 && _alpha < 22.5) || (_alpha >= 157.5 && _alpha < 202.5) ){
        //   console.log(111);
        //   context.Svg.select("#squareCL").attr({cursor:"ew-resize"});
        //   context.Svg.select("#squareCR").attr({cursor:"ew-resize"});

        //   context.Svg.select("#squareLT").attr({cursor:"nw-resize"});
        //   context.Svg.select("#squareBR").attr({cursor:"nw-resize"}); 

        //   context.Svg.select("#squareCT").attr({cursor:"ns-resize"});
        //   context.Svg.select("#squareBC").attr({cursor:"ns-resize"});   

        //   context.Svg.select("#squareBL").attr({cursor:"ne-resize"});
        //   context.Svg.select("#squareRT").attr({cursor:"ne-resize"});                          
        // }else if( (_alpha >= 22.5 && _alpha < 67.5) || (_alpha >= 202.5 && _alpha < 247.5) ){
        //   console.log(222);
        //   context.Svg.select("#squareLT").attr({cursor:"nw-resize"});
        //   context.Svg.select("#squareBR").attr({cursor:"nw-resize"});
        // }else if( (_alpha >=67.5 && _alpha<112.5)||(_alpha >= 247.5 && _alpha<270)||(_alpha>=-90 && _alpha<-67.5)){
        //   console.log(333);
        //   context.Svg.select("#squareCT").attr({cursor:"ns-resize"});
        //   context.Svg.select("#squareBC").attr({cursor:"ns-resize"});
        // }else{
        //   context.Svg.select("#squareBL").attr({cursor:"ne-resize"});
        //   context.Svg.select("#squareRT").attr({cursor:"ne-resize"});
        //   console.log(444);
        // }
        // context.Svg.paper.circle(_lineBox.cx,_lineBox.cy,5).attr({fill:`#${Math.floor(Math.random()*100)}${Math.floor(Math.random()*100)}${Math.floor(Math.random()*100)}`,"z-index":0});
        // context.Svg.paper.circle(_lineBox.x,_lineBox.y,5).attr({ fill:"red"} );
        context.Svg.select("#squareLT").attr({x:_lineBox.x-_w-_strockWidth/2,y:_lineBox.y-_w-_strockWidth/2,width:_w,height:_w,"data-id":context.actLayerId,"data-fixedpoint_x":_lineBox.x2,"data-fixedpoint_y":_lineBox.y2});
        context.Svg.select("#squareCT").attr({x:_lineBox.x+_lineBox.width/2-_w/2,y:_lineBox.y-_w-_strockWidth/2,width:_w,height:_w,"data-id":context.actLayerId,"data-fixedpoint_x":_lineBox.x+_lineBox.width/2,"data-fixedpoint_y":_lineBox.y2});
        context.Svg.select("#squareRT").attr({x:_lineBox.x2+_strockWidth/2,y:_lineBox.y-_w-_strockWidth/2,width:_w,height:_w,"data-id":context.actLayerId,"data-fixedpoint_x":_lineBox.x,"data-fixedpoint_y":_lineBox.y2});
        context.Svg.select("#squareCR").attr({x:_lineBox.x2+_strockWidth/2,y:_lineBox.y+_strockWidth/2+_lineBox.height/2-_w/2-_strockWidth/2,width:_w,height:_w,"data-id":context.actLayerId,"data-fixedpoint_x":_lineBox.x,"data-fixedpoint_y":_lineBox.y+_lineBox.height/2});
        context.Svg.select("#squareBR").attr({x:_lineBox.x2+_strockWidth/2,y:_lineBox.y2+_strockWidth/2,width:_w,height:_w,"data-id":context.actLayerId,"data-fixedpoint_x":_lineBox.x,"data-fixedpoint_y":_lineBox.y});
        context.Svg.select("#squareBC").attr({x:_lineBox.x+_lineBox.width/2-_w/2,y:_lineBox.y2+_strockWidth/2,width:_w,height:_w,"data-id":context.actLayerId,"data-fixedpoint_x":_lineBox.x+_lineBox.width/2,"data-fixedpoint_y":_lineBox.y});
        context.Svg.select("#squareBL").attr({x:_lineBox.x-_w-_strockWidth/2,y:_lineBox.y2+_strockWidth/2,width:_w,height:_w,"data-id":context.actLayerId,"data-fixedpoint_x":_lineBox.x2,"data-fixedpoint_y":_lineBox.y});
        context.Svg.select("#squareCL").attr({x:_lineBox.x-_w-_strockWidth/2,y:_lineBox.y+_strockWidth/2+_lineBox.height/2-_w/2-_strockWidth/2,width:_w,height:_w,"data-id":context.actLayerId,"data-fixedpoint_x":_lineBox.x2,"data-fixedpoint_y":_lineBox.y+_lineBox.height/2});

        context.Svg.select("#rotateLine").attr({d:`M${_lineBox.x2+_strockWidth/2} ${_lineBox.y+_strockWidth/2+_lineBox.height/2-_strockWidth/2}L${_lineBox.x2+_strockWidth/2 + 30} ${_lineBox.y+_strockWidth/2+_lineBox.height/2-_strockWidth/2}`});
        context.Svg.select("#rotateBar").attr({cx:_lineBox.x2+_strockWidth/2 + 30,cy:_lineBox.y+_strockWidth/2+_lineBox.height/2-_strockWidth/2,r:5,"data-fixedpoint_x":_lineBox.cx,"data-fixedpoint_y":_lineBox.cy,"data-id":context.actLayerId});

        context.showAnt ? null : context.showAnt = true;
    }
  },
  actions: {

  }
});
