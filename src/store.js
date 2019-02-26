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
    canvas:null,
    Svg:null,
    Draw:null,
    coordinateDown:[],//鼠标按下的坐标.....
    coordinateUp:null,//鼠标抬起的坐标.....   
    coordinateOffsetDown:[],//鼠标相对于svg的偏移.....
    coordinateSvgMove:[],//鼠标在svg上的移动距离......
    coordinateMove:[],//鼠标移动.....
    actLayerId:null,//当前活动层.....
    drawType:"xuanze",//画笔类型.....
    showAnt:false,//是否显示蚂蚁线.....
    _matrix:null,//变换矩阵....
    defaultConfig:{
      strokeWidth:5,
      stroke:"#000"
    },
    popEditPosition:{//输入框是否显示.....
      x:0,
      y:0,
      value:"",
      isShow:false
    }
  },
  mutations: {
    initViewBox(context){
      let _boxSvg = $('#wrapDraw').get(0).getBoundingClientRect();
      let _w = _boxSvg.width*2/3, _h = _boxSvg.height*2/3;
      SVG.get('svg').attr({
        width:_boxSvg.width,
        height:_boxSvg.height-4
      });
      SVG.get('canvas').attr({
        width:_w,
        height:_h,
        x:(_boxSvg.width-_w)/2,
        y:(_boxSvg.height-_h)/2,
      }).viewbox(0,0,_w,_h);
      SVG.get('contentBg').attr({
        width:"100%",
        height:"100%",
        fill:"white"
      })
    }
  },
  actions: {

  },
  getters: {
    getSvgPosi: (state) => (posi) => {//将屏幕坐标转换成canvas坐标........
      let _rates = 1/SVG.get('canvas').viewbox().zoom;
      let _canvasBox = SVG.get('contentBg').rbox();
      return [ ( posi[0] - _canvasBox.x )*_rates , ( posi[1] - _canvasBox.y )*_rates ,posi[2]];
    }
  }
});
