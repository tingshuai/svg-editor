import { joinSafe } from "upath";
import { root } from "postcss";

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
    boxMsg:null,//保存变动时的图形的box信息....
    matrix:null,
    consBoxMsg:null
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
    rootState.Svg.selectAll("g.referenceLine").remove();//清除referenceLine 对齐线
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
      commit("addAnt");
      rootState._matrix = new Snap.Matrix();
    }
  },
  bindFocusEvent({ state, commit, rootState }){
    if(rootState.actLayerId != null){//判断是否有焦点....
      commit("addAnt");//聚焦时应该重绘蚂蚁线.......
    }
    rootState.Svg.selectAll('.svgItem').forEach((val,i,arr)=>{
      val.unclick();
      val.mousedown((e)=>{
        let _dataset = e.currentTarget.dataset;
        rootState.actLayerId = _dataset.id;//更新活动元素ID
        commit("addAnt");//添加蚂蚁线
      });
    })
  },   
  bindDrag({ state, commit, rootState }){
    let that = this;
    rootState.Svg.selectAll(".gSvgItem").forEach((ele,i,arr)=>{
      let _dataset;
      let _ele,_gele,_boxMsg;
      ele.drag();
      let onend = (e)=>{
        state.itemMoveMsg.state = "end";
        this.dispatch("resizeEnd",{"e":e,"id":_dataset.id,"type":_dataset.type});
      }
      let onmove = (x,y,cx,cy,e)=>{
        if( e.shiftKey ){//按住shift 横移竖直移动.....
          Math.abs(x) > Math.abs(y) ? y = 0 : x = 0; 
          _gele.attr({"transform":new Snap.Matrix(1,0,0,1,x,y)})
        }
        e.eventType = "resize";
        state.itemMoveMsg.x = x;
        state.itemMoveMsg.y = y;
        state.itemMoveMsg.cx = cx;
        state.itemMoveMsg.cy = cy;
        state.itemMoveMsg.e = e;
        state.itemMoveMsg.state = "move";
        rootState.showAnt = false;
        rootState._matrix.e = x;
        rootState._matrix.f = y;
        // 移动时更新焦点图形的box信息.....
        state.actItem.boxMsg.x = state.actItem.consBoxMsg.x + x;
        state.actItem.boxMsg.y = state.actItem.consBoxMsg.y + y;
        state.actItem.boxMsg.cx = state.actItem.consBoxMsg.cx + x;
        state.actItem.boxMsg.cy = state.actItem.consBoxMsg.cy + y;
        state.actItem.boxMsg.x2 = state.actItem.consBoxMsg.x2 + x;
        state.actItem.boxMsg.y2 = state.actItem.consBoxMsg.y2 + y;

        if(!e.ctrlKey){//当ctrl键按下时不计算对齐标记线....
          this.dispatch("computeLine",e);
        }
      }
      let onstart = (cx,cy,e)=>{
        state.itemMoveMsg.cx = cx;
        state.itemMoveMsg.cy = cy;
        state.itemMoveMsg.state = "start";
        _dataset = e.srcElement.dataset;
        _ele = rootState.Svg.select(`#id${_dataset.id}`);
        _gele = rootState.Svg.select(`#gid${_dataset.id}`);
        rootState._matrix = new Snap.Matrix(1,0,0,1,0,0);
        commit("setActItem");
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
  addLayer({ state, commit, rootState },_id){
    rootState.actLayerId = _id;
    state.layer.push({
      name:"图层" + (state.layer.length + 1),
      id:rootState.actLayerId,
      matrix:new Snap.Matrix(),
      "fill":"none",
      "stroke":rootState.defaultConfig.stroke,
      "strokeWidth":rootState.defaultConfig.strokeWidth,
      "strokeDasharray":0,
      "strokeDashoffset":0,
      boxMsg:null,
      rotate:0
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
  upLoadSvg({ state, commit, rootState }){//变相更新svg视图以解决毛边问题....
    rootState.Svg.attr({"font-size":12+Math.random()});
  },
  computeLine({ state, commit, rootState },e){//计算 对齐标记线......
    let _gele = rootState.Svg.select(`#gid${rootState.actLayerId}`);
    let _consBoxMsg = state.actItem.consBoxMsg;//获取保存的boxMsg常量..
    let _pointX = ["x","cx","x2"];
    let _pointY = ["y","cy","y2"];
    let _threshold = 5;
    let setMe = ()=>{
      _gele.transform( rootState._matrix );
    }
    let _showLine = (x1,y1,x2,y2,_item,_move,_type)=>{
      let _group = rootState.Draw.group().attr({id:`referenceLine${_item.id}`,class:"referenceLine"});
      let _line = _group.line(x1,y1,x2,y2).attr({"stroke":"#FF6600","stroke-width":1,"class":`referenceLine${_item.id}`,"stroke-dasharray":"5 5"})
      _group.text(`${Math.floor(Math.abs(_move))}px`).center(_line.bbox().cx,_line.bbox().cy-4).font({size:12,anchor:_type == "x" ? 'middle' : '',fill:"#FF6600"});
      _line.marker('start', 5, 5, function(add) {
        add.circle(5).fill('#FF6600');
      })
      _line.marker('end', 5, 5, function(add) {
        add.circle(5).fill('#FF6600');
      })
    }
    let _compute = (_m,_n,_item)=>{
      _pointX.forEach((val,i,arr)=>{
        _pointX.forEach((value,ii,array)=>{
          if( _n[val] >= _m[value] - _threshold && _n[val] <= _m[value] + _threshold ){
            rootState._matrix.e = _m[value]-_consBoxMsg[val];
            setMe();//执行变换.....
            if( Math.abs(_m.cy-_n.cy)>(_m.h+_n.h)/2 ){//不接触则显示对齐线...
              let _x1 , _x2,_y1,_y2;
              _x1 = _x2 = _m[value];
              if( _m.cy < _n.cy ){//活动元素在下面
                _y2 = i == 1 ? _n.cy : _n.y;
                _y1 = ii == 1 ? _m.cy : _m.y2;
              }else{
                _y2 = i == 1 ? _n.cy : _n.y2;
                _y1 = ii == 1 ? _m.cy : _m.y;
              }
              _showLine(_x1,_y1,_x2,_y2,_item,Math.abs(_y1-_y2),"x");
            }
          }
        })
      })
      _pointY.forEach((val,i,arr)=>{
        _pointY.forEach((value,ii,array)=>{
          if( _n[val] >= _m[value] - _threshold && _n[val] <= _m[value] + _threshold ){
            rootState._matrix.f = _m[value]-_consBoxMsg[val];
            setMe(_m,_n,"y");
            if( Math.abs(_m.cx-_n.cx)>(_m.w+_n.w)/2 ){//不接触则显示对齐线...
              let _x1 , _x2,_y1,_y2;
              _y1 = _y2 = _m[value];
              if( _m.cx < _n.cx ){//活动元素在下面
                _x2 = i == 1 ? _n.cx : _n.x;
                _x1 = ii == 1 ? _m.cx : _m.x2;
              }else{
                _x2 = i == 1 ? _n.cx : _n.x2;
                _x1 = ii == 1 ? _m.cx : _m.x;
              }
              _showLine(_x1,_y1,_x2,_y2,_item,Math.abs(_x1-_x2),"y");
            }            
          }
        })
      })
    }
    state.layer.map((val,index,arr)=>{
      if( val.id != rootState.actLayerId ){
        rootState.Svg.selectAll(`g#referenceLine${val.id}`).remove();//清除referenceLine 对齐线
        _compute( val.boxMsg,state.actItem.boxMsg,val );
      }
    })
  }
}

// mutations
const mutations = {
  setActItem(context){//设定焦点元素的boxmsg
    let rootState = this.getters.rootState;
    return context.layer.filter((item,index,arr)=>{
      let _box = rootState.Svg.select(`#id${item.id}`).getBBox();
      item.boxMsg = _box;
      item.boxMsg.x = _box.x - item.strokeWidth/2;
      item.boxMsg.y = _box.y - item.strokeWidth/2;
      item.boxMsg.x2 = _box.x2 + item.strokeWidth/2;
      item.boxMsg.y2 = _box.y2 + item.strokeWidth/2;
      item.boxMsg.w = _box.width + item.strokeWidth;
      item.boxMsg.h = _box.height + item.strokeWidth;
      if( item.id == rootState.actLayerId ){
        context.actItem.boxMsg = item.boxMsg;
        state.actItem.consBoxMsg = JSON.parse(JSON.stringify( item.boxMsg ));
        return item.boxMsg;
      }else{
        // rootState.Svg.paper.circle(item.boxMsg.cx,item.boxMsg.cy,1).attr({fill:"red"});
      }
    });
  },  
  resize(context,obj){//开始变换....
    let rootState = this.getters.rootState;
    let _ele = rootState.Svg.select(`#id${obj.id}`);
    let _gele = rootState.Svg.select(`#gid${obj.id}`);
    let _antBorder = rootState.Svg.select("#_antBorder");
    let _box = rootState.Snap.path.getBBox(_ele.realPath);
    rootState.actLayerId = obj.id;
    context.itemMoveMsg.x = obj.x;
    context.itemMoveMsg.y = obj.y;
    rootState._matrix = new Snap.Matrix();
    let _rateX,_rateY,_point=[];
    if( obj.type == "squareLT" ){
      _rateX = (_box.width-obj.x)/_box.width;
      _rateY = (_box.height-obj.y)/_box.height;
    }else if( obj.type == "squareBL" ){
      _rateX = (_box.width-obj.x)/_box.width;
      _rateY = (_box.height+obj.y)/_box.height;
    }else if( obj.type == "squareBR" ){
      _rateY = (_box.height+obj.y)/_box.height;
      _rateX = (_box.width+obj.x)/_box.width;
    }else if( obj.type == "squareRT" ){
      _rateX = (_box.width+obj.x)/_box.width;
      _rateY = (_box.height-obj.y)/_box.height;
    }else if( obj.type == "squareCT" ){
      _rateX = 1;
      _rateY = (_box.height-obj.y)/_box.height;
    }else if( obj.type == "squareCR" ){
      _rateY = 1;
      _rateX = (_box.width+obj.x)/_box.width; 
    }else if( obj.type == "squareBC" ){
      _rateX = 1;
      _rateY = (_box.height+obj.y)/_box.height;
    }else if( obj.type == "squareCL" ){
      _rateY = 1;
      _rateX = (_box.width-obj.x)/_box.width;
    }
    if( obj.e.altKey && !obj.e.shiftKey ){//只按下alt键
      _point[0] = _box.cx, _point[1] = _box.cy;
    }else if( obj.e.shiftKey && !obj.e.altKey &&  _rateX != 1 && _rateY != 1 ){//按下shift
      _rateY = _rateX;
    }else if( obj.e.altKey && obj.e.shiftKey ){//都按下
      _point[0] = _box.cx, _point[1] = _box.cy; _rateY == 1 ? _rateY = _rateX : _rateX = _rateY;
    }else{//都没按下
      _point = context.fixedPoint;
    }
    
    if( obj.type == "rotateBar" ){//旋转....
      rootState._matrix = new Snap.Matrix();
      let _rotate = Snap.angle( context.fixedPoint[0],context.fixedPoint[1], obj.e.offsetX,obj.e.offsetY )-180;
      rootState._matrix.rotate( _rotate, context.fixedPoint[0],context.fixedPoint[1] );
      _ele.transform( rootState._matrix );
      rootState.Svg.select("#_antLine").attr({ d:_box.path.toString() });         
      // _ele.transform( context.actItem.matrix.invert().add(rootState._matrix) );
    }else{
      rootState._matrix.scale(_rateX,_rateY,_point[0],_point[1]);
      _ele.transform(rootState._matrix).attr({"vector-effect":"non-scaling-stroke"});
    }
    // rootState.Svg.select("#demo_circle").attr({cx:`${_box.x}`,cy:`${_box.y}`,r:`${_box.r0}`,fill:`#${Math.floor(Math.random()*100)}${Math.floor(Math.random()*100)}${Math.floor(Math.random()*100)}`})
    this.dispatch("upLoadSvg");
  },
  addAnt(context,_id){//重绘控制点.....
      let rootState = this.getters.rootState;
      let __actId = _id ? _id : rootState.actLayerId;
      rootState.showAnt = true;
      if(rootState.Svg.select(`#id${__actId}`) != null){
          let _ele = rootState.Svg.select(`#id${__actId}`);
          let _lineBox = _ele.getBBox();
          let _strockWidth = Number( _ele.attr("stroke-width").replace('px',''))+2;
          let _stroke = document.getElementById(`id${__actId}`).getAttribute("stroke")
          state.actItem.fill=_ele.attr("fill");
          state.actItem.stroke=_stroke;
          state.actItem.strokeWidth=_strockWidth;
          state.actItem.strokeDasharray=_ele.attr("stroke-dasharray");
          state.actItem.strokeDashoffset=_ele.attr("stroke-dashoffset");
    
          rootState.Svg.select("#_antBorder").attr({'data-id':__actId});
          rootState.Svg.select("#_antLine").attr({d:`M${_lineBox.x-_strockWidth/2} ${_lineBox.y-_strockWidth/2}H${_lineBox.x2+_strockWidth/2}V${_lineBox.y2+_strockWidth/2}H${_lineBox.x-_strockWidth/2}Z`});
          let _w = 5;
          rootState.Svg.select("#squareLT").attr({x:_lineBox.x-_w-_strockWidth/2,y:_lineBox.y-_w-_strockWidth/2,width:_w,height:_w,"data-id":__actId,"data-fixedpoint_x":_lineBox.x2,"data-fixedpoint_y":_lineBox.y2});
          rootState.Svg.select("#squareCT").attr({x:_lineBox.x+_lineBox.width/2-_w/2,y:_lineBox.y-_w-_strockWidth/2,width:_w,height:_w,"data-id":__actId,"data-fixedpoint_x":_lineBox.x+_lineBox.width/2,"data-fixedpoint_y":_lineBox.y2});
          rootState.Svg.select("#squareRT").attr({x:_lineBox.x2+_strockWidth/2,y:_lineBox.y-_w-_strockWidth/2,width:_w,height:_w,"data-id":__actId,"data-fixedpoint_x":_lineBox.x,"data-fixedpoint_y":_lineBox.y2});
          rootState.Svg.select("#squareCR").attr({x:_lineBox.x2+_strockWidth/2,y:_lineBox.y+_strockWidth/2+_lineBox.height/2-_w/2-_strockWidth/2,width:_w,height:_w,"data-id":__actId,"data-fixedpoint_x":_lineBox.x,"data-fixedpoint_y":_lineBox.y+_lineBox.height/2});
          rootState.Svg.select("#squareBR").attr({x:_lineBox.x2+_strockWidth/2,y:_lineBox.y2+_strockWidth/2,width:_w,height:_w,"data-id":__actId,"data-fixedpoint_x":_lineBox.x,"data-fixedpoint_y":_lineBox.y});
          rootState.Svg.select("#squareBC").attr({x:_lineBox.x+_lineBox.width/2-_w/2,y:_lineBox.y2+_strockWidth/2,width:_w,height:_w,"data-id":__actId,"data-fixedpoint_x":_lineBox.x+_lineBox.width/2,"data-fixedpoint_y":_lineBox.y});
          rootState.Svg.select("#squareBL").attr({x:_lineBox.x-_w-_strockWidth/2,y:_lineBox.y2+_strockWidth/2,width:_w,height:_w,"data-id":__actId,"data-fixedpoint_x":_lineBox.x2,"data-fixedpoint_y":_lineBox.y});
          rootState.Svg.select("#squareCL").attr({x:_lineBox.x-_w-_strockWidth/2,y:_lineBox.y+_strockWidth/2+_lineBox.height/2-_w/2-_strockWidth/2,width:_w,height:_w,"data-id":__actId,"data-fixedpoint_x":_lineBox.x2,"data-fixedpoint_y":_lineBox.y+_lineBox.height/2});
    
          rootState.Svg.select("#rotateLine").attr({d:`M${_lineBox.x2+_strockWidth/2} ${_lineBox.y+_strockWidth/2+_lineBox.height/2-_strockWidth/2}L${_lineBox.x2+_strockWidth/2 + 30} ${_lineBox.y+_strockWidth/2+_lineBox.height/2-_strockWidth/2}`});
          rootState.Svg.select("#rotateBar").attr({cx:_lineBox.x2+_strockWidth/2 + 30,cy:_lineBox.y+_strockWidth/2+_lineBox.height/2-_strockWidth/2,r:5,"data-fixedpoint_x":_lineBox.cx,"data-fixedpoint_y":_lineBox.cy,"data-id":__actId});
      }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}