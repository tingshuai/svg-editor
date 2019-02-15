<template>
    <section class="right">
      <div class="history">
        <section class="header">
          
        </section>
        <ul>
          <li></li>
        </ul>
      </div>
      <div class="layer"></div>
    </section>
</template>
<script>
export default {
  components: {
    
  },  
  data () {
    return {
      
    }
  },
  created(){

  },
  methods:{
     
  }
}
</script>
<style scoped lang="less">
@color:#333;
@colorLight:#42d29d;
@backgroundColor:#A5AA3F;
@borderColor:#ddd;
@gray:#93999F;
.right{
  width: 300px;
  display: flex;
  justify-content: space-between;
  flex-shrink:0;
  .history,.layer{
    flex-grow: 1;
    background-color: #333;
  }
}
</style>
