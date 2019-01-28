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
  },
  mutations: {

  },
  actions: {

  }
});
