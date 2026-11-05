<template>
  <div class="tree">
    <div class="tree-content" @mousedown.stop="move">
      <tree-item :tree-data="treeData" :tree-first="true" />
    </div>
    <div class="legend">
      <div>
        <div class="legend-item" style="background: rgb(218, 246, 228);"></div>
        <p>已完成任务</p>
      </div>
      <div>
        <div class="legend-item" style="background: rgb(213, 220, 245);"></div>
        <p>执行中任务</p>
      </div>
      <div>
        <div class="legend-item" style="background: rgb(255, 226, 225);"></div>
        <p>未执行任务</p>
      </div>
      <div style="width: 200px;display: flex;position: relative">
        <div style="background:red; width: 15px; height: 15px;margin: 5% 0 0 15%;border-radius: 50%;"></div>
        <p style="position: absolute;left: 45%;top: 20%;">表示计入总工期</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getTreeList } from "@/api/labor";

import TreeItem from "./components/TreeItem";
export default {
  name: "Tree",
  props: {
    id: String ,
  },
  components: {
    TreeItem,
  },
  data() {
    return {
      treeData: [],
    };
  },
  mounted(){
    this.getTreeList()
  },
  methods: {
    async getTreeList(){
      let res = await getTreeList({projectId:this.id})
      if(res.data.code == 200){
        console.log(res.data.data);
        this.treeData = res.data.data
      }else{
        this.$message.error(res.data.msg)
      }
    }
    // 拖拽移动
    // move(e) {
    //   const odiv = e.currentTarget // 获取元素
    //   console.log(odiv)
    //   // 算出鼠标相对元素的位置
    //   const disX = e.clientX - odiv.offsetLeft
    //   const disY = e.clientY - odiv.offsetTop
    //   document.onmousemove = (e) => { // 鼠标按下并移动的事件
    //     // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
    //     const left = e.clientX - disX
    //     const top = e.clientY - disY
    //     // 绑定元素位置到positionX和positionY上面
    //     this.positionX = top
    //     this.positionY = left
    //     // 移动当前元素
    //     odiv.style.left = left + 'px'
    //     odiv.style.top = top + 'px'
    //   }
    //   document.onmouseup = () => {
    //     document.onmousemove = null
    //     document.onmouseup = null
    //   }
    // }
  },
};
</script>

<style lang="less" scoped>
.tree {
  background: #fff;
  min-height: calc(100vh - 110px);
  width: 100%;
  position: relative;
  overflow-x: auto;

  &-content {
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
  }
}

.legend {
  position: absolute;
  top: 10px;
  left: 75%;

  > div {
    display: flex;
  }
}

.legend-item {
  width: 70px;
  height: 20px;
  margin-right: 20px;
  border: 1px solid rgb(179, 177, 177);
  border-radius: 5px;
}
</style>

