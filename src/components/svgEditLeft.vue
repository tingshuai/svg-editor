<template>
      <section class="left">
        <ul>
          <li class="item" v-for="(item,index) in barList" :key="index" :title="item.title" @contextmenu.prevent="contextmenu" :data-index="index" :data-item="item" @click="actMe" :class="{ 'act':'' }">
              <i :class="['icon-' + item.icon,{'act': item.act}]" class="iconfont"></i>
              <span class="triangle" v-if="item.children.length"></span>
              <ul class="contextMenu" v-show="item.showChild && item.children.length != 0">
                  <li v-for="(it,i) in item.children" :data-parentindex="index" :data-parentItem="item" @click.stop="actChild" :data-index="i" :data-item="it"><i class="block" :style="{'opacity': it.act ? 1 : 0 }"></i><i class="iconfont" :class="['icon-'+it.icon]"></i> <span>{{ it.name }}</span><span class="key">{{ it.key }}</span></li>
              </ul>
          </li>
          <li></li>
          <li></li>
        </ul>
      </section>
</template>
<script>

export default {
  components: {
  },  
  props:{
      },
  data () {
    return {
      barList:[
          {
              icon:"xuanze",
              title:"移动工具 A",
              children:[],
              act:true,
              keyCode:65,
              showChild:false
          },
          {
              icon:"wenzi",
              title:"文字工具 T",
              showChild:false,
              act:false,
              keyCode:84,
              children:[]
          },
          {
              icon:"xiantiao",
              title:"线性工具 L",
              showChild:false,
              act:false,
              keyCode:76,
              children:[
                  {
                      icon:"xiantiao",
                      name:"直线",
                      key:"L",
                      act:true
                  },
                  {
                      icon:"-xuxian",
                      name:"虚线",
                      key:"L",
                      act:false
                  },
                  {
                      icon:"zhexiantu",
                      name:"折线",
                      key:"L",
                      act:false
                  },
                  {
                      icon:"zhexian",
                      name:"折线",
                      key:"L",
                      act:false
                  }                      
              ]
          },
          {
              icon:"icon-test3",
              title:"钢笔工具 P",
              showChild:false,
              act:false,
              keyCode:80,
              children:[]
          },  
          {
              icon:"bi1",
              title:"画笔工具 B",
              showChild:false,
              act:false,
              keyCode:66,
              children:[]
          },   
          {
              icon:"juxing1",
              title:"矩形工具 M",
              showChild:false,
              keyCode:77,
              act:false,
              children:[
                  {
                      icon:"juxing1",
                      name:"实线",
                      key:"M",
                      act:true
                  },
                  {
                      icon:"juxing",
                      name:"虚线",
                      key:"M",
                      act:false
                  }                                    
              ]
          },    
          {
              icon:"tuoyuanxing",
              title:"椭圆工具 O",
              showChild:false,
              act:false,
              keyCode:79,
              children:[]
          },  
          {
              icon:"xiangpi",
              title:"橡皮擦 E",
              showChild:false,
              act:false,
              keyCode:69,
              children:[]
          },    
          {
              icon:"yanse1",
              title:"色板 C",
              keyCode:67,
              showChild:false,
              act:false,
              children:[]
          }
      ]
    }
  },
  created(){

  },
  mounted(){
    document.addEventListener('keyup', (e)=> {
        if( e.keyCode == 65 || e.keyCode == 84 || e.keyCode == 76 || e.keyCode == 80 || e.keyCode ==77 || e.keyCode == 66 || e.keyCode == 79 || e.keyCode == 69 || e.keyCode == 67){
            this.toggleMe(e.keyCode)
        }
        e.preventDefault();
    })
  },
  watch:{
 
  },
  methods:{
      toggleMe(code){
          let _dataSet = {currentTarget:{dataset:{}}};
          let _i = this.barList.findIndex((item)=>{
            return item.keyCode == code
          })
          let _ii;
          if(this.barList[_i].children.length == 0){
            _dataSet.currentTarget.dataset.index = _i;
            _dataSet.currentTarget.dataset.parentindex = null;
            this.actMe(_dataSet);
          }else{
            _ii = this.barList[_i].children.findIndex((it)=>{
                return it.icon = this.barList[_i].icon;
            })
            _dataSet.currentTarget.dataset.index = _ii;
            _dataSet.currentTarget.dataset.parentindex = _i;
            this.actChild(_dataSet);
          }
      },
      hid(){
          this.barList.forEach((item,i,arr) => {
              item.showChild = false;
          });
      },
      actMe(e){
          let _dataSet = e.currentTarget.dataset;
          let that = this;
          this.barList.forEach((item,i,arr) => {
            item.act = false;
          });
          this.barList[ _dataSet.index ].act = true;
          this.$emit( "selTool", this.barList[ _dataSet.index ].icon );
      },
      actChild(e){
          let _dataSet = e.currentTarget.dataset;
          this.barList.forEach((it,i,arr)=>{
              it.act = false;
          })
          this.barList[ _dataSet.parentindex ].children.forEach((item,i,arr)=>{
                item.act = false;
          })
          this.barList[ _dataSet.parentindex ].act = true;
          this.barList[ _dataSet.parentindex ].children[ _dataSet.index ].act = true;
          this.barList[ _dataSet.parentindex ].icon = this.barList[ _dataSet.parentindex ].children[ _dataSet.index ].icon;
          this.barList[ _dataSet.parentindex ].showChild = false;
          this.$emit( "selTool", this.barList[ _dataSet.parentindex ].icon );
          console.log(this.barList);
      },
      contextmenu(e) {
        let _dataSet = e.currentTarget.dataset;
        this.actMe(e);
        this.barList[ _dataSet.index ].showChild = true;
      }
  }
}
</script>
<style scoped lang="less">
@color:#333;
@colorLight:#42d29d;
@backgroundColor:#A5AA3F;
@borderColor:#ddd;
@gray:#93999F;
.left{
  width: 80px;
  border-top: 1px solid gray;   
  ul{
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      padding: 20px 0;
      li{
          flex-basis: 30px;
          height: 25px;
          text-align: center;
          line-height: 23px;
          border-radius: 3px;
          margin: 1.5px 1px;    
          position: relative;
          &.item{
              >.iconfont{
                font-size: 22px;
                display: inline-block;
                color: #c1c1c1;
                height: 100%;
                width: 30px;
                border-radius: 4px;
                &:hover{
                    background-color: #808080;
                    box-shadow: #333 0 0 2px 1px;
                }  
                &.act{
                    box-shadow: #232323 0px 0px 2px 2px inset!important;
                    background-color: #333333!important;
                }                              
              }
              .contextMenu{
                  width:150px;
                  background-color: #505050;
                  position: absolute;
                  left: 108%;
                  top: 0;
                  border: 1px solid #3e3e3e;
                  z-index: 100;
                  display:flex;
                  flex-direction: column;
                  align-content: flex-start;
                  padding: 0 7px;
                  li{
                      text-align: left;
                      font-size: 12px;
                      vertical-align: top;
                      color: #d8d7d7;
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      flex-basis: 20px;
                      &:hover{
                          cursor: default;
                      }
                      .block{
                         width: 4px;
                         height: 4px;
                         margin-right: 8px;
                         background-color: #d8d7d7;
                         vertical-align: middle;
                      }
                      span{
                          vertical-align: middle;
                          flex-basis: 30px;
                      }
                      .iconfont{
                          flex-basis: 30px;
                          vertical-align: middle;
                      }
                      span.key{
                          flex-grow: 1;
                          text-align: right;
                      }
                  }
              }
          }
      }
  }      
  .vue-contextmenu-listWrapper{
      display: none;
  }     
}
span.triangle{
    border-width: 0 2px 2px;
    border-style: solid;
    border-color: transparent transparent #c1c1c1;
    position: absolute;
    bottom: 1px;
    right: 0px;
    transform: rotate(135deg);
}
</style>
