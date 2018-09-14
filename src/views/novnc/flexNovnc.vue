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
    <keep-alive>
      <div class="flexMain" id="flexMainID">
        <!-- 1 * 1 -->
        <div class="box box-1" id="one">
          <div class="boxColumn box1">
            <div class="box-item one">
              <div class="selectShow" id="oneoneSelect">
                <el-select v-model="value11" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>

              <iframe :src="url11" frameborder="0" id="oneone" style="display: none;"></iframe>
            </div>
          </div>
        </div>

        <!-- 1 * 2 -->
        <div class="box box-1" id="two" style="display: none;">
          <div class="boxColumn box2">
            <div class="box-item two">
              <div class="selectShow" id="twoFirstSelect">
                <el-select v-model="value21" filterable placeholder="请选择设备" @change="chooseTwofirstDevice">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url21" frameborder="0" id="twoFirst" style="display: none;"></iframe>
            </div>
          </div>
          <div class="boxColumn box2">
            <div class="box-item two">
              <div class="selectShow" id="twoSecondSelect">
                <el-select v-model="value22" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url22" frameborder="0" id="twoSecond" style="display: none;"></iframe>
            </div>
          </div>
        </div>

        <!-- 1 * 3 -->
        <div class="box box-1" id="three" style="display: none;">
          <div class="boxColumn box3">
            <div class="box-item three">
              <div class="selectShow" id="threeFirstSelect">
                <el-select v-model="value31" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url31" frameborder="0" id="threeFirst" style="display: none;"></iframe>
            </div>
          </div>
          <div class="boxColumn box3">
            <div class="box-item three">
              <div class="selectShow" id="threeSecondSelect">
                <el-select v-model="value32" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url32" frameborder="0" id="threeSecond" style="display: none;"></iframe>
            </div>
          </div>
          <div class="boxColumn box3">
            <div class="box-item three">
              <div class="selectShow" id="threeThirdSelect">
                <el-select v-model="value33" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url33" frameborder="0" id="threeThird" style="display: none;"></iframe>
            </div>
          </div>
        </div>

        <!-- 2 * 2 -->
        <div class="box box-2" id="four" style="display: none;">
          <div class="boxColumn box2">
            <div class="box-item four">
              <div class="selectShow" id="fourFirstSelect">
                <el-select v-model="value41" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url41" frameborder="0" id="fourFirst" style="display: none;"></iframe>
            </div>
            <div class="box-item four">
              <div class="selectShow" id="fourSecondSelect">
                <el-select v-model="value42" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url42" frameborder="0" id="fourSecond" style="display: none;"></iframe>
            </div>
          </div>
          <div class="boxColumn box2">
            <div class="box-item four">
              <div class="selectShow" id="fourThirdSelect">
                <el-select v-model="value43" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url43" frameborder="0" id="fourThird" style="display: none;"></iframe>
            </div>
            <div class="box-item four">
              <div class="selectShow" id="fourFourthSelect">
                <el-select v-model="value44" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url44" frameborder="0" id="fourFourth" style="display: none;"></iframe>
            </div>
          </div>
        </div>

        <!-- 2 * 3 -->
        <div class="box box-2" id="six" style="display: none;">
          <div class="boxColumn box3">
            <div class="box-item six">
              <div class="selectShow" id="sixFirstSelect">
                <el-select v-model="value61" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url61" frameborder="0" id="sixFirst" style="display: none;"></iframe>
            </div>
            <div class="box-item six">
              <div class="selectShow" id="sixSecondSelect">
                <el-select v-model="value62" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url62" frameborder="0" id="sixSecond" style="display: none;"></iframe>
            </div>
          </div>
          <div class="boxColumn box3">
            <div class="box-item six">
              <div class="selectShow" id="sixThirdSelect">
                <el-select v-model="value63" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url63" frameborder="0" id="sixThird" style="display: none;"></iframe>
            </div>
            <div class="box-item six">
              <div class="selectShow" id="sixFourthSelect">
                <el-select v-model="value64" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url64" frameborder="0" id="sixFourth" style="display: none;"></iframe>
            </div>
          </div>
          <div class="boxColumn box3">
            <div class="box-item six">
              <div class="selectShow" id="sixFifthSelect">
                <el-select v-model="value65" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url65" frameborder="0" id="sixFifth" style="display: none;"></iframe>
            </div>
            <div class="box-item six">
              <div class="selectShow" id="sixSixthSelect">
                <el-select v-model="value66" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url66" frameborder="0" id="sixSixth" style="display: none;"></iframe>
            </div>
          </div>
        </div>

        <!-- 3 * 3 -->
        <div class="box box-2" id="nine" style="display: none;">
          <div class="boxColumn box3">
            <div class="box-item nine">
              <div class="selectShow" id="nineFirstSelect">
                <el-select v-model="value91" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url91" frameborder="0" id="nineFirst" style="display: none;"></iframe>
            </div>
            <div class="box-item nine">
              <div class="selectShow" id="nineSecondSelect">
                <el-select v-model="value92" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url92" frameborder="0" id="nineSecond" style="display: none;"></iframe>
            </div>
            <div class="box-item nine">
              <div class="selectShow" id="nineThirdSelect">
                <el-select v-model="value93" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url93" frameborder="0" id="nineThird" style="display: none;"></iframe>
            </div>
          </div>
          <div class="boxColumn box3">
            <div class="box-item nine">
              <div class="selectShow" id="nineFourthSelect">
                <el-select v-model="value94" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url94" frameborder="0" id="nineFourth" style="display: none;"></iframe>
            </div>
            <div class="box-item nine">
              <div class="selectShow" id="nineFifthSelect">
                <el-select v-model="value95" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url95" frameborder="0" id="nineFifth" style="display: none;"></iframe>
            </div>
            <div class="box-item nine">
              <div class="selectShow" id="nineSixthSelect">
                <el-select v-model="value96" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url96" frameborder="0" id="nineSixth" style="display: none;"></iframe>
            </div>
          </div>
          <div class="boxColumn box3">
            <div class="box-item nine">
              <div class="selectShow" id="nineSeventhSelect">
                <el-select v-model="value97" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url97" frameborder="0" id="nineSeventh" style="display: none;"></iframe>
            </div>
            <div class="box-item nine">
              <div class="selectShow" id="nineEighthSelect">
                <el-select v-model="value98" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url98" frameborder="0" id="nineEighth" style="display: none;"></iframe>
            </div>
            <div class="box-item nine">
              <div class="selectShow" id="nineNinthSelect">
                <el-select v-model="value99" filterable placeholder="请选择设备" @click.native="transParams($event)"
                           @change="chooseAnyDevice()">
                  <el-option
                    v-for="item in list"
                    :key="item.hostAddress"
                    :label="item.hostAddress"
                    :value="item.hostAddress">
                  </el-option>
                </el-select>
              </div>
              <iframe :src="url99" frameborder="0" id="nineNinth" style="display: none;"></iframe>
            </div>
          </div>
        </div>
      </div>
    </keep-alive>
  </div>

</template>

<script>
  import { getDevice } from '@/api/device'
  /*eslint-disable*/
  export default {
    name: "flexNovnc",
    data() {
      return {
        layout: '',
        list: '',
        proId: '',
        fatherDiv: '',
        IframeDiv: '',
        fatherDivId: '',
        IframeId: '',
        url: '',
        url11: '',
        url21: '',
        url22: '',
        url31: '',
        url32: '',
        url33: '',
        url41: '',
        url42: '',
        url43: '',
        url44: '',
        url61: '',
        url62: '',
        url63: '',
        url64: '',
        url65: '',
        url66: '',
        url91: '',
        url92: '',
        url93: '',
        url94: '',
        url95: '',
        url96: '',
        url97: '',
        url98: '',
        url99: '',
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
        value: '',
        value11: '',
        value21: '',
        value22: '',
        value31: '',
        value32: '',
        value33: '',
        value41: '',
        value42: '',
        value43: '',
        value44: '',
        value61: '',
        value62: '',
        value63: '',
        value64: '',
        value65: '',
        value66: '',
        value91: '',
        value92: '',
        value93: '',
        value94: '',
        value95: '',
        value96: '',
        value97: '',
        value98: '',
        value99: ''
      }
    },
    created() {
      this.proId = this.getCookie('projectId')
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getDevice(this.proId).then(response => {
          this.isHistory = false
          this.list = response.data.data
          console.log(this.list);
          this.total = response.data.total
          this.listLoading = false
        })
      },

      changeLayout: function () {
        this.layout = this.value;
        console.log(this.layout)

        document.getElementById("one").style.display = "none";
        document.getElementById("two").style.display = "none";
        document.getElementById("three").style.display = "none";
        document.getElementById("four").style.display = "none";
        document.getElementById("six").style.display = "none";
        document.getElementById("nine").style.display = "none";

        if (this.layout === "one") {
          document.getElementById("one").style.display = "flex";
        } else if (this.layout === "two") {
          document.getElementById("two").style.display = "flex";
        } else if (this.layout === "three") {
          document.getElementById("three").style.display = "flex";
        } else if (this.layout === "four") {
          document.getElementById("four").style.display = "flex";
        } else if (this.layout === "six") {
          document.getElementById("six").style.display = "flex";
        } else if (this.layout === "nine") {
          document.getElementById("nine").style.display = "flex";
        }
      },

      chooseDevice: function () {
        let deviceIp = this.value11;
        if (deviceIp !== null) {
          this.url = 'http://' + deviceIp + ':9000'
          document.getElementById("oneone").style.display = "flex";
          document.getElementById("oneoneSelect").style.display = "none";
        }
      },
      chooseTwofirstDevice: function () {
        let deviceIp = this.value21;
        if (deviceIp !== null) {
          this.url21 = 'http://' + deviceIp + ':9000'
          document.getElementById("twoFirst").style.display = "flex";
          document.getElementById("twoFirstSelect").style.display = "none";
        }
      },
      chooseTwoSecondDevice: function () {
        let deviceIp = this.value22;
        if (deviceIp !== null) {
          this.url22 = 'http://' + deviceIp + ':9000'
          document.getElementById("twoSecond").style.display = "flex";
          document.getElementById("twoSecondSelect").style.display = "none";
        }
      },
      transParams(event) {
        console.log(event.target.parentNode.parentNode.parentNode)

        this.fatherDiv = event.target.parentNode.parentNode.parentNode;
        this.fatherDivId = this.fatherDiv.id;
        console.log(this.fatherDivId)
        this.IframeDiv = this.fatherDiv.parentNode.lastChild
        console.log(this.IframeDiv)
        this.IframeId = this.IframeDiv.id;
        console.log(this.IframeId)

        //this.chooseAnyDevice(IframeId, fatherDivId)
      },
      chooseAnyDevice() {
        console.log(this.IframeId)
        console.log(this.fatherDivId)

        if (this.IframeId === "oneone") {
          let deviceIp = this.value11;
          this.url11 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "twoFirst") {
          let deviceIp = this.value21;
          this.url21 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "twoSecond") {
          let deviceIp = this.value22;
          this.url22 = 'http://' + deviceIp + ':9000'
        }

        //
        if (this.IframeId === "threeFirst") {
          let deviceIp = this.value31;
          this.url31 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "threeSecond") {
          let deviceIp = this.value32;
          this.url32 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "threeThird") {
          let deviceIp = this.value33;
          this.url33 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "fourFirst") {
          let deviceIp = this.value41;
          this.url41 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "fourSecond") {
          let deviceIp = this.value42;
          this.url42 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "fourThird") {
          let deviceIp = this.value43;
          this.url43 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "fourFourth") {
          let deviceIp = this.value44;
          this.url44 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "sixFirst") {
          let deviceIp = this.value61;
          this.url61 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "sixSecond") {
          let deviceIp = this.value62;
          this.url62 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "sixThird") {
          let deviceIp = this.value63;
          this.url63 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "sixFourth") {
          let deviceIp = this.value64;
          this.url64 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "sixFifth") {
          let deviceIp = this.value65;
          this.url65 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "sixSixth") {
          let deviceIp = this.value66;
          this.url66 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "nineFirst") {
          let deviceIp = this.value91;
          this.url91 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "nineSecond") {
          let deviceIp = this.value92;
          this.url92 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "nineThird") {
          let deviceIp = this.value93;
          this.url93 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "nineFourth") {
          let deviceIp = this.value94;
          this.url94 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "nineFifth") {
          let deviceIp = this.value95;
          this.url95 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "nineSixth") {
          let deviceIp = this.value96;
          this.url96 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "nineSeventh") {
          let deviceIp = this.value97;
          this.url97 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "nineEighth") {
          let deviceIp = this.value98;
          this.url98 = 'http://' + deviceIp + ':9000'
        }
        if (this.IframeId === "nineNinth") {
          let deviceIp = this.value99;
          this.url99 = 'http://' + deviceIp + ':9000'
        }

        document.getElementById(this.IframeId).style.display = "flex";
        document.getElementById(this.fatherDivId).style.display = "none";

      },
      connectVNC() {
        let
          DEFAULT_HOST = '',
          DEFAULT_PORT = '9000',
          DEFAULT_PASSWORD = "",
          DEFAULT_PATH = "websockify"
        ;
        let cRfb = null;
        let oTarget = document.getElementById("noVNC_canvas");

        let that = this
        /*if (!this.currentEquipment) {
          return
        }*/
        // debugger
        // let novncPort = this.currentEquipment.novncPort
        let novncPort = 9000
        // getNovncIp().then(function (resData)
        let current_guac = {};
        current_guac.broker_host = this.vncIP// resData.data.ip;
        current_guac.broker_port = '9000' //resData.data.vncPort;
        current_guac.graphics_passwd = 'spy123456' //resData.data.vncPassword;
        console.log(current_guac)
        // UI.openConnectPanel()
        UI.connect(current_guac);
        // UI.start()
        // WebUtil.init_logging(WebUtil.getConfigVar("logging", "warn"));

        // let sHost =resData.data.data[0].ip || DEFAULT_HOST,
        let sHost = this.vncIP || DEFAULT_HOST,
          nPort = novncPort || DEFAULT_PORT,
          sPassword = DEFAULT_PASSWORD,
          sPath = DEFAULT_PATH
        ;
        /*cRfb = new RFB(oTarget,'192.168.31.173',{
          "target": oTarget, // 目标
          "focusContainer": top.document,  // 鼠标焦点定位
          "encrypt": WebUtil.getConfigVar("encrypt", window.location.protocol === "https:"),
          "repeaterID": WebUtil.getConfigVar("repeaterID", ""),
          "true_color": WebUtil.getConfigVar("true_color", true),
          "local_cursor": WebUtil.getConfigVar("cursor", true),
          "shared": WebUtil.getConfigVar("shared", true),
          "view_only": WebUtil.getConfigVar("view_only", false),
          "onFBUComplete": that._onCompleteHandler,    // 回调函数
          "onDisconnected": that._disconnected  // 断开连接
        });*/
        // cRfb._connect(sHost, nPort, sPassword, sPath);
      },
      _onCompleteHandler(rfb, fbu) {
        // 清除 onComplete 的回调。
        rfb.set_onFBUComplete(function () {
        });

        let oDisplay = rfb.get_display(),
          nWidth = oDisplay.get_width(),
          nHeight = oDisplay.get_height(),

          oView = oDisplay.get_target(),
          nViewWidth = oView.clientWidth,
          nViewHeight = oView.clientHeight
        ;
        // 设置当前与实际的比例。
        oDisplay.setScale(nWidth / nViewWidth, nHeight / nViewHeight);
      },
      resize() {
        console.log('resize')
      }
    },
    /*mounted () {
      this.$nextTick(() => {
        $('html').niceScroll()
        $("#flexMainID").getNiceScroll().hide();
      })
    },*/

    destroyed() {
      // UI.disconnect()
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
    padding: 0 5px 0 0;
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
    /*background-color: #ffd200;*/
    background: linear-gradient(to bottom right,#9ecfff, #7b7b7b,#8d8d9d,#ffbaba);
  }

  .one, .two, .three {
    width: 100%;
    height: 100%;
  }

  .four, .six {
    width: 100%;
    height: 50%;
  }

  .nine {
    width: 100%;
    height: 33.33%;
  }

  iframe {
    width: 100%;
    height: 100%;
  }

  .selectShow {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
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
