<template>
  <div>
    <div style="margin-top: 8px;height: 40px;float:right;margin-right: 3px;">
      <el-select v-model="value" placeholder="请选择格局" @change="changeLayout">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="flexMain">
      <!-- 1 * 1 -->
      <div class="box box-1" id="one">
        <div class="boxColumn box1">
          <div class="box-item one">1</div>
        </div>
      </div>

      <!-- 1 * 2 -->
      <div class="box box-1" id="two" style="display: none;">
        <div class="boxColumn box2">
          <div class="box-item two">2</div>
        </div>
        <div class="boxColumn box2">
          <div class="box-item two">2</div>
        </div>
      </div>

      <!-- 1 * 3 -->
      <div class="box box-1" id="three" style="display: none;">
        <div class="boxColumn box3">
          <div class="box-item three">3</div>
        </div>
        <div class="boxColumn box3">
          <div class="box-item three">3</div>
        </div>
        <div class="boxColumn box3">
          <div class="box-item three">3</div>
        </div>
      </div>

      <!-- 2 * 2 -->
      <div class="box box-2" id="four" style="display: none;">
        <div class="boxColumn box2">
          <div class="box-item four">4</div>
          <div class="box-item four">4</div>
        </div>
        <div class="boxColumn box2">
          <div class="box-item four">4</div>
          <div class="box-item four">4</div>
        </div>
      </div>

      <!-- 2 * 3 -->
      <div class="box box-2" id="six" style="display: none;">
        <div class="boxColumn box3">
          <div class="box-item six">6</div>
          <div class="box-item six">6</div>
        </div>
        <div class="boxColumn box3">
          <div class="box-item six">6</div>
          <div class="box-item six">6</div>
        </div>
        <div class="boxColumn box3">
          <div class="box-item six">6</div>
          <div class="box-item six">6</div>
        </div>
      </div>

      <!-- 3 * 3 -->
      <div class="box box-2" id="nine" style="display: none;">
        <div class="boxColumn box3">
          <div class="box-item nine">9</div>
          <div class="box-item nine">9</div>
          <div class="box-item nine">9</div>
        </div>
        <div class="boxColumn box3">
          <div class="box-item nine">9</div>
          <div class="box-item nine">9</div>
          <div class="box-item nine">9</div>
        </div>
        <div class="boxColumn box3">
          <div class="box-item nine">9</div>
          <div class="box-item nine">9</div>
          <div class="box-item nine">9</div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  /*eslint-disable*/
    export default {
      name: "flex",
      data() {
        return {
          layout: '',
          options: [{
            value: 'one',
            label: '1 * 1'
          }, {
            value: 'two',
            label: '1 * 2'
          }, {
            value: 'three',
            label: '1 * 3'
          }, {
            value: 'four',
            label: '2 * 2'
          }, {
            value: 'six',
            label: '2 * 3'
          }, {
            value: 'nine',
            label: '3 * 3'
          }],
          value: ''
        }
      },
      methods: {
        changeLayout: function () {
          this.layout = this.value;
          console.log(this.layout)

          document.getElementById("one").style.display = "none";
          document.getElementById("two").style.display = "none";
          document.getElementById("three").style.display = "none";
          document.getElementById("four").style.display = "none";
          document.getElementById("six").style.display = "none";
          document.getElementById("nine").style.display = "none";

          if(this.layout === "one"){
            document.getElementById("one").style.display = "flex";
          }else if(this.layout === "two"){
            document.getElementById("two").style.display = "flex";
          }else if(this.layout === "three"){
            document.getElementById("three").style.display = "flex";
          }else if(this.layout === "four"){
            document.getElementById("four").style.display = "flex";
          }else if(this.layout === "six"){
            document.getElementById("six").style.display = "flex";
          }else if(this.layout === "nine"){
            document.getElementById("nine").style.display = "flex";
          }
        },
      }
    }
</script>

<style scoped>
  .flexMain {
    width: 100%;
    position: absolute;
    top: 130px;
    bottom: 0;
  }

  /*
    父盒子样式
  */
  .box {
    background-color: white;
    display: flex;
    width: 100%;
    height: 100%;
  }

  /*.box-1 {
    justify-content: center;
    align-items: center;
    flex: 1;
  }*/

  /*
    1 * 1, 1 * 2, 1 * 3样式  box-1
  */

  /*
    2 * 2, 2 * 3样式  box-1
  */
  /*.box-2{
    justify-content: center;
    flex: 1;
  }*/


  .boxColumn {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 3px 3px;
  }

  /*
    1列
  */
  .box1 {
    width: 100%;
  }

    /*
      列排: 2列
    */
  .box2 {
    width: 50%;
  }

  /*
    列排: 3列
  */
  .box3 {
    width: 33.33%;
  }

  /*
    子容器样式
  */
  .box-item {
    height: 100%;
    margin: 0 3px;
    border: 1px solid lightgray;
    background-color: #ffd200;
  }

  .one, .two, .three, .four, .six, .nine {
    width: 100%;
    margin: 3px 0 0 0;
  }


  /*.one {
    width: 100%;
  }

  .two {
    width: 50%;
  }

  .three {
    width: 33%;
  }*/

</style>
