// import shop from '../../api/shop'

// initial state
const state = {
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
    matrix:null,
  },
  fixedPoint:[],//变换时的定点坐标......
} 

// getters
const getters = {
    rootState (state, getters, rootState) {
      return rootState;
    }
}

// actions
const actions = {
  resizeEnd({ state, commit, rootState },obj){//结束变换触发....
    let _ele = rootState.Svg.select(`#id${obj.id}`);
    let _gele = rootState.Svg.select(`#gid${obj.id}`);
    let _m = new Snap.Matrix();
    let _antBorder = rootState.Svg.select("#_antBorder");
    if( rootState._matrix.toTransformString() != _m.toTransformString() ){
      state.layer.find((val,i,arr)=>{
        if( val.id == obj.id ){
          let newPath = rootState.Snap.path.map(_ele.attr('d').toString(), rootState._matrix).toString()+"Z";
          _ele.transform(_m).attr({d:newPath});//重置焦点元素matrix  将变换写入path..    
          _gele.transform(_m);
          val.matrix = rootState._matrix;
        }
      });
      commit("addAnt",rootState);
      rootState._matrix = new Snap.Matrix();
    }
  },
  bindFocusEvent({ state, commit, rootState }){
    if(rootState.actLayerId != null){//判断是否有焦点....
      commit("addAnt",rootState);//聚焦时应该重绘蚂蚁线.......
    }
    rootState.Svg.selectAll('.svgItem').forEach((val,i,arr)=>{
      val.unclick();
      val.mousedown((e)=>{
        let _dataset = e.currentTarget.dataset;
        rootState.actLayerId = _dataset.id;//更新活动元素ID
        commit("addAnt",rootState);//添加蚂蚁线
      });
    })
  },   
  bindDrag({ state, commit, rootState }){
    let that = this;
    rootState.Svg.selectAll(".gSvgItem").forEach((ele,i,arr)=>{
      let _dataset;
      let _ele,_gele;
      ele.drag();
      let onend = (e)=>{
        state.itemMoveMsg.state = "end";
        this.dispatch("resizeEnd",{"e":e,"id":_dataset.id,"type":_dataset.type});
      }
      let onmove = (x,y,cx,cy,e)=>{
        state.itemMoveMsg.x = x;
        state.itemMoveMsg.y = y;
        state.itemMoveMsg.cx = cx;
        state.itemMoveMsg.cy = cy;
        state.itemMoveMsg.e = e;
        state.itemMoveMsg.state = "move";
        rootState._matrix = new Snap.Matrix(1,0,0,1,x,y);
        rootState.showAnt = false;
        this.dispatch("upLoadSvg");
      }
      let onstart = (cx,cy,e)=>{
        state.itemMoveMsg.cx = cx;
        state.itemMoveMsg.cy = cy;
        state.itemMoveMsg.state = "start";
        _dataset = e.srcElement.dataset;
        _ele = rootState.Svg.select(`#id${_dataset.id}`);
        _gele = rootState.Svg.select(`#gid${_dataset.id}`);
      }
      ele.drag(onmove, onstart, onend);
    });
    rootState.Svg.selectAll(".svgItem").forEach((ele,i,arr)=>{
      ele.hover((e)=>{
        ele.attr({
          cursor:"move"
        })
      });
    });
  },
  addLayer({ state, commit, rootState }){
    let _time = new Date().getTime();
    rootState.actLayerId = _time;      
    state.layer.push({
      name:"图层" + (state.layer.length + 1),
      id:rootState.actLayerId,
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
  bindResize({ state, commit, rootState }){
    let bind = (type)=>{
      let _id = null;
      let onend = (e)=>{
        e.stopPropagation();
        this.dispatch("resizeEnd",{"e":e,"id":_id,"type":type});
      }
      let onmove = (x,y,cx,cy,e)=>{
        e.stopPropagation();
        rootState.showAnt = false;
        
        commit("resize",{"x":x,"y":y,"cx":cx,"cy":cy,"e":e,"type":type,id:_id});
      }
      let onstart = (cx,cy,e)=>{
        //获取焦点元素ID
        let _dataset = e.srcElement.dataset;
        _id = _dataset.id;
        //定点坐标....
        state.fixedPoint[0] = Number(_dataset["fixedpoint_x"]);
        state.fixedPoint[1] = Number(_dataset["fixedpoint_y"]);
        if(_dataset.type == "rotateBar"){
          let _box = rootState.Svg.select(`#${_dataset.type}`).getBBox();
          state.fixedPoint[2] = _box.cx;
          state.fixedPoint[3] = _box.cy;
        }
        state.layer.find((val,i,arr)=>{
          if( val.id == _id ){
            state.actItem.matrix = val.matrix;
          }
        });
        rootState.coordinateOffsetDown[0] = e.offsetX;
        rootState.coordinateOffsetDown[1] = e.offsetY;
        e.stopPropagation();
      }
      rootState.Svg.select(`#${type}`).drag( onmove,onstart,onend );
    }
    rootState.Svg.selectAll("._controlBar").forEach((ele)=>{
      let _type = ele.attr('data-type');
      bind(_type);
    })
  },  
  upLoadSvg({ state, commit, rootState }){
    rootState.Svg.attr({"font-size":12+Math.random()});
  }  
}

// mutations
const mutations = {
  resize(context,obj){//开始变换....
    let rootState = this.getters.rootState;
    let _ele = rootState.Svg.select(`#id${obj.id}`);
    let _gele = rootState.Svg.select(`#gid${obj.id}`);
    let _antBorder = rootState.Svg.select("#_antBorder");
    let _box = rootState.Snap.path.getBBox(_ele.realPath);
    context.itemMoveMsg.x = obj.x;
    context.itemMoveMsg.y = obj.y;
    rootState._matrix = new Snap.Matrix();

    if( obj.type == "squareLT" ){
        if( obj.e.altKey && !obj.e.shiftKey ){ 
          rootState._matrix.scale((_box.width-obj.x)/_box.width,(_box.height-obj.y)/_box.height,_box.cx,_box.cy);
        }else if( obj.e.shiftKey && !obj.e.altKey){
          rootState._matrix.scale((_box.width-obj.x)/_box.width,(_box.width-obj.x)/_box.width,context.fixedPoint[0],context.fixedPoint[1]);
        }else if( obj.e.altKey && obj.e.shiftKey ){
          rootState._matrix.scale((_box.width-obj.x)/_box.width,(_box.width-obj.x)/_box.width,context.fixedPoint[0]-_box.width/2,context.fixedPoint[1]-_box.height/2);
        }else{
          rootState._matrix.scale((_box.width-obj.x)/_box.width,(_box.height-obj.y)/_box.height,context.fixedPoint[0],context.fixedPoint[1]);
        }
        _ele.transform(rootState._matrix);
    }else if( obj.type == "squareCT" || obj.type == "lineTop" ){
        if( obj.e.altKey ){
          rootState._matrix.scale(1,(_box.height-obj.y)/_box.height,context.fixedPoint[0]-_box.width/2,context.fixedPoint[1]-_box.height/2);
        }else{
          rootState._matrix.scale(1,(_box.height-obj.y)/_box.height,context.fixedPoint[0],context.fixedPoint[1]);
        }
        _ele.transform(rootState._matrix).attr({"vector-effect":"non-scaling-stroke"});
    }else if( obj.type == "squareRT" ){
      if( obj.e.altKey && !obj.e.shiftKey ){
        // rootState.Svg.paper.circle(_box.cx,_box.cy,5).attr({ fill:"red"} );
        rootState._matrix.scale((_box.width+obj.x)/_box.width,(_box.height-obj.y)/_box.height,_box.cx,_box.cy);
      }else if( obj.e.shiftKey && !obj.e.altKey){
        rootState._matrix.scale((_box.width+obj.x)/_box.width,(_box.width+obj.x)/_box.width,context.fixedPoint[0],context.fixedPoint[1]);
      }else if( obj.e.altKey && obj.e.shiftKey ){
        rootState._matrix.scale((_box.width+obj.x)/_box.width,(_box.width+obj.x)/_box.width,_box.cx,_box.cy);
      }else{
        rootState._matrix.scale((_box.width+obj.x)/_box.width,(_box.height-obj.y)/_box.height,context.fixedPoint[0],context.fixedPoint[1]);
      }
      _ele.transform(rootState._matrix).attr({"vector-effect":"non-scaling-stroke"});

    }else if( obj.type == "squareCR" || obj.type == "lineRight" ){
      if( obj.e.altKey ){
        rootState._matrix.scale((_box.width+obj.x)/_box.width,1,context.fixedPoint[0]+_box.width/2,context.fixedPoint[1]);
      }else{
        rootState._matrix.scale((_box.width+obj.x)/_box.width,1,context.fixedPoint[0],context.fixedPoint[1]);
      }
        _ele.transform(rootState._matrix).attr({"vector-effect":"non-scaling-stroke"});
    }else if( obj.type == "squareBR" ){
      if( obj.e.altKey && !obj.e.shiftKey ){
        rootState._matrix.scale((_box.width+obj.x)/_box.width,(_box.height+obj.y)/_box.height,context.fixedPoint[0]+_box.width/2,context.fixedPoint[1]+_box.height/2);
      }else if( obj.e.shiftKey && !obj.e.altKey){
        rootState._matrix.scale((_box.width+obj.x)/_box.width,(_box.width+obj.x)/_box.width,context.fixedPoint[0],context.fixedPoint[1]);
      }else if( obj.e.altKey && obj.e.shiftKey ){
        rootState._matrix.scale((_box.width+obj.x)/_box.width,(_box.width+obj.x)/_box.width,context.fixedPoint[0]+_box.width/2,context.fixedPoint[1]+_box.height/2);
      }else{
        rootState._matrix.scale((_box.width+obj.x)/_box.width,(_box.height+obj.y)/_box.height,context.fixedPoint[0],context.fixedPoint[1]);
      }
      _ele.transform(rootState._matrix).attr({"vector-effect":"non-scaling-stroke"});
    }else if( obj.type == "squareBC" || obj.type == "lineBottom" ){
      if( obj.e.altKey ){
        rootState._matrix.scale(1,(_box.height+obj.y)/_box.height,context.fixedPoint[0]+_box.width/2,context.fixedPoint[1]+_box.height/2);
      }else{
        rootState._matrix.scale(1,(_box.height+obj.y)/_box.height,context.fixedPoint[0],context.fixedPoint[1]);
      }
        _ele.transform(rootState._matrix).attr({"vector-effect":"non-scaling-stroke"});
    }else if( obj.type == "squareBL"){
      if( obj.e.altKey && !obj.e.shiftKey ){
        rootState._matrix.scale((_box.width+obj.x)/_box.width,(_box.height-obj.y)/_box.height,context.fixedPoint[0]-_box.width/2,context.fixedPoint[1]+_box.height/2);
      }else if( obj.e.shiftKey && !obj.e.altKey){
        rootState._matrix.scale((_box.width-obj.x)/_box.width,(_box.width-obj.x)/_box.width,context.fixedPoint[0],context.fixedPoint[1]);
      }else if( obj.e.altKey && obj.e.shiftKey ){
        rootState._matrix.scale((_box.width-obj.x)/_box.width,(_box.width-obj.x)/_box.width,context.fixedPoint[0]-_box.width/2,context.fixedPoint[1]+_box.height/2);
      }else{
        rootState._matrix.scale((_box.width-obj.x)/_box.width,(_box.height+obj.y)/_box.height,context.fixedPoint[0],context.fixedPoint[1]);
      }    
        _ele.transform(rootState._matrix).attr({"vector-effect":"non-scaling-stroke"});
    }else if( obj.type == "squareCL" || obj.type == "lineLeft" ){
      if( obj.e.altKey ){
        rootState._matrix.scale((_box.width-obj.x)/_box.width,1,context.fixedPoint[0]-_box.width/2,context.fixedPoint[1]);
      }else{
        rootState._matrix.scale((_box.width-obj.x)/_box.width,1,context.fixedPoint[0],context.fixedPoint[1]);
      }
        _ele.transform(rootState._matrix).attr({"vector-effect":"non-scaling-stroke"});
    }else if( obj.type == "rotateBar" ){
      rootState._matrix = new Snap.Matrix();
      let _rotate = Snap.angle( context.fixedPoint[0],context.fixedPoint[1], obj.e.offsetX,obj.e.offsetY )-180;
      rootState._matrix.rotate( _rotate, context.fixedPoint[0],context.fixedPoint[1] );
      // _antBorder.transform( rootState._matrix );
      _ele.transform( rootState._matrix );
      
      let _lineBox = rootState.Svg.select(`#id${context.actLayerId}`).getBBox();
      rootState.Svg.select("#_antLine").attr({ d:_lineBox.path.toString() });         
      // _ele.transform( context.actItem.matrix.invert().add(rootState._matrix) );
    }
    this.dispatch("upLoadSvg");
  },
  addAnt(context){//重绘控制点.....
      let rootState = this.getters.rootState;
      rootState.showAnt = true;
      let _lineBox = rootState.Svg.select(`#id${rootState.actLayerId}`).getBBox();
      let _strockWidth = Number( rootState.Svg.select(`#id${rootState.actLayerId}`).attr("stroke-width").replace('px',''));
      
      rootState.Svg.select("#_antBorder").attr({'data-id':rootState.actLayerId});
      rootState.Svg.select("#_antLine").attr({d:`M${_lineBox.x-_strockWidth/2} ${_lineBox.y-_strockWidth/2}H${_lineBox.x2+_strockWidth/2}V${_lineBox.y2+_strockWidth/2}H${_lineBox.x-_strockWidth/2}Z`});
      let _w = 5;
      rootState.Svg.select("#squareLT").attr({x:_lineBox.x-_w-_strockWidth/2,y:_lineBox.y-_w-_strockWidth/2,width:_w,height:_w,"data-id":rootState.actLayerId,"data-fixedpoint_x":_lineBox.x2,"data-fixedpoint_y":_lineBox.y2});
      rootState.Svg.select("#squareCT").attr({x:_lineBox.x+_lineBox.width/2-_w/2,y:_lineBox.y-_w-_strockWidth/2,width:_w,height:_w,"data-id":rootState.actLayerId,"data-fixedpoint_x":_lineBox.x+_lineBox.width/2,"data-fixedpoint_y":_lineBox.y2});
      rootState.Svg.select("#squareRT").attr({x:_lineBox.x2+_strockWidth/2,y:_lineBox.y-_w-_strockWidth/2,width:_w,height:_w,"data-id":rootState.actLayerId,"data-fixedpoint_x":_lineBox.x,"data-fixedpoint_y":_lineBox.y2});
      rootState.Svg.select("#squareCR").attr({x:_lineBox.x2+_strockWidth/2,y:_lineBox.y+_strockWidth/2+_lineBox.height/2-_w/2-_strockWidth/2,width:_w,height:_w,"data-id":rootState.actLayerId,"data-fixedpoint_x":_lineBox.x,"data-fixedpoint_y":_lineBox.y+_lineBox.height/2});
      rootState.Svg.select("#squareBR").attr({x:_lineBox.x2+_strockWidth/2,y:_lineBox.y2+_strockWidth/2,width:_w,height:_w,"data-id":rootState.actLayerId,"data-fixedpoint_x":_lineBox.x,"data-fixedpoint_y":_lineBox.y});
      rootState.Svg.select("#squareBC").attr({x:_lineBox.x+_lineBox.width/2-_w/2,y:_lineBox.y2+_strockWidth/2,width:_w,height:_w,"data-id":rootState.actLayerId,"data-fixedpoint_x":_lineBox.x+_lineBox.width/2,"data-fixedpoint_y":_lineBox.y});
      rootState.Svg.select("#squareBL").attr({x:_lineBox.x-_w-_strockWidth/2,y:_lineBox.y2+_strockWidth/2,width:_w,height:_w,"data-id":rootState.actLayerId,"data-fixedpoint_x":_lineBox.x2,"data-fixedpoint_y":_lineBox.y});
      rootState.Svg.select("#squareCL").attr({x:_lineBox.x-_w-_strockWidth/2,y:_lineBox.y+_strockWidth/2+_lineBox.height/2-_w/2-_strockWidth/2,width:_w,height:_w,"data-id":rootState.actLayerId,"data-fixedpoint_x":_lineBox.x2,"data-fixedpoint_y":_lineBox.y+_lineBox.height/2});

      rootState.Svg.select("#rotateLine").attr({d:`M${_lineBox.x2+_strockWidth/2} ${_lineBox.y+_strockWidth/2+_lineBox.height/2-_strockWidth/2}L${_lineBox.x2+_strockWidth/2 + 30} ${_lineBox.y+_strockWidth/2+_lineBox.height/2-_strockWidth/2}`});
      rootState.Svg.select("#rotateBar").attr({cx:_lineBox.x2+_strockWidth/2 + 30,cy:_lineBox.y+_strockWidth/2+_lineBox.height/2-_strockWidth/2,r:5,"data-fixedpoint_x":_lineBox.cx,"data-fixedpoint_y":_lineBox.cy,"data-id":rootState.actLayerId});
      // rootState.Svg.paper.circle(_lineBox.cx,_lineBox.cy,5).attr({fill:`#${Math.floor(Math.random()*100)}${Math.floor(Math.random()*100)}${Math.floor(Math.random()*100)}`,"z-index":0});

  }
}

export default {
  state,
  getters,
  actions,
  mutations
}