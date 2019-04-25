<template>
  <div id="sample">
    <div class="operationBar">
      <span class="operation-btn" @click="saveMyDiagram">保存</span>
      <span class="operation-btn" @click="undoMyDiagram">撤销</span>
      <span class="operation-btn" @click="redoMyDiagram">恢复</span>
      <el-button @click="createFromTemp" type="primary" size="mini">创建</el-button>
    </div>
    <div style="width: 100%; display: flex; justify-content: space-between">
      <div id="myPaletteDiv" style="width: 105px; margin-right: 2px; background-color: whitesmoke; border: solid 1px black"></div>
      <div id="myDiagramDiv" style="flex-grow: 1; height: 620px; border: solid 1px black"></div>
    </div>
    <!--<div>
       <textarea id="mySavedModel" style="width:100%;height:300px">
           {
               "class": "go.GraphLinksModel",
               "linkFromPortIdProperty": "fromPort",
               "linkToPortIdProperty": "toPort",
               "nodeDataArray": [
                   {"key":8, "loc":"30 510", "text":"Cut into rectangular grid", "size":"207.2770233154297 75"},
                   {"figure": "subtask","key":-2, "category":"End", "loc":"150 690", "text":"Enjoy!", "size":"118.79598999023438 44"},
                   {"figure": "subtask","text":"Step", "key":-3, "loc":"150 780"},
                   {"figure": "subtask","text":"Step", "key":-4, "loc":"278.115966796875 509.5622756958008", "size":"154 69"},
                   {"figure": "subtask","text":"Step", "key":-7, "loc":"270 300", "size":"154 69"}
               ],
               "linkDataArray": [
                   {"points":[], "from":8, "to":-2, "fromPort":"B"},
                   {"from":-2, "to":-3, "fromPort":"B", "toPort":"T", "points":[]},
                   {"from":-4, "to":-2, "fromPort":"", "toPort":"T", "points":[]},
                   {"from":-7, "to":-2, "fromPort":"", "toPort":"T", "points":[]},
                   {"from":-7, "to":-2, "fromPort":"R", "toPort":"R", "points":[]}
               ]
           }
       </textarea>
    </div>-->
  </div>
</template>

<script>
  /*eslint-disable*/
  import { createProcessNodes } from '@/api/pro-design-link'
  export default {
    name: "visio",
    props: {
      proId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        myDiagram: null,
        originValue: {
          "class": "go.GraphLinksModel",
          "linkFromPortIdProperty": "fromPort",
          "linkToPortIdProperty": "toPort",
          "nodeDataArray": [
            {"key":8, "loc":"30 510", "text":"Cut into rectangular grid", "size":"207.2770233154297 75", 'editable':false},
            {"figure": "subtask","key":-2, "category":"End", "loc":"150 690", "text":"Enjoy!", "size":"118.79598999023438 44"},
            {"figure": "subtask","text":"Step", "key":-3, "loc":"150 780"},
            {"figure": "subtask","text":"Step", "key":-4, "loc":"278.115966796875 509.5622756958008", "size":"154 69"},
            {"figure": "subtask","text":"Step", "key":-7, "loc":"270 300", "size":"154 69"}
          ],
          "linkDataArray": [
            {"points":[], "from":8, "to":-2, "fromPort":"B"},
            {"from":-2, "to":-3, "fromPort":"B", "toPort":"T", "points":[]},
            {"from":-4, "to":-2, "fromPort":"", "toPort":"T", "points":[]},
            {"from":-7, "to":-2, "fromPort":"", "toPort":"T", "points":[]},
            {"from":-7, "to":-2, "fromPort":"R", "toPort":"R", "points":[]}
          ]
        }
      }
    },
    methods: {
      init() {
        let go = this.go
        let myCanvas = go.GraphObject.make
        this.myDiagram = myCanvas(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
          {
            grid: myCanvas(go.Panel, "Grid",
              myCanvas(go.Shape, "LineH", {stroke: "lightgray", strokeWidth: 0.5}),
              myCanvas(go.Shape, "LineH", {stroke: "gray", strokeWidth: 0.5, interval: 10}),
              myCanvas(go.Shape, "LineV", {stroke: "lightgray", strokeWidth: 0.5}),
              myCanvas(go.Shape, "LineV", {stroke: "gray", strokeWidth: 0.5, interval: 10})
            ),

            // 限制已完成节点的修改
            "InitialLayoutCompleted": function(e) {
              e.diagram.nodes.each(function(n) {
                if(n.data.editable === false) {
                  n.deletable = false;
                  n.textEditable = false;
                }
              });
              e.diagram.links.each(function(l) {
                l.deletable = false;
                l.textEditable = false;
              });
            },
            "draggingTool.dragsLink": true,
            "draggingTool.isGridSnapEnabled": true,
            "linkingTool.isUnconnectedLinkValid": true,
            "linkingTool.portGravity": 20,
            "relinkingTool.isUnconnectedLinkValid": true,
            "relinkingTool.portGravity": 20,
            "relinkingTool.fromHandleArchetype":
              myCanvas(go.Shape, "Diamond", {
                segmentIndex: 0,
                cursor: "pointer",
                desiredSize: new go.Size(8, 8),
                fill: "tomato",
                stroke: "darkred"
              }),
            "relinkingTool.toHandleArchetype":
              myCanvas(go.Shape, "Diamond", {
                segmentIndex: -1,
                cursor: "pointer",
                desiredSize: new go.Size(8, 8),
                fill: "darkred",
                stroke: "tomato"
              }),
            "linkReshapingTool.handleArchetype":
              myCanvas(go.Shape, "Diamond", {
                desiredSize: new go.Size(7, 7),
                fill: "lightblue",
                stroke: "deepskyblue"
              }),
            "rotatingTool.handleAngle": 270,
            "rotatingTool.handleDistance": 30,
            "rotatingTool.snapAngleMultiple": 15,
            "rotatingTool.snapAngleEpsilon": 15,
            "undoManager.isEnabled": true
          })

        /*this.myDiagram.addDiagramListener("Modified", function (e) {
            var button = document.getElementById("SaveButton");
            if (button) button.disabled = !this.myDiagram.isModified;
            var idx = document.title.indexOf("*");
            if (this.myDiagram.isModified) {
                if (idx < 0) document.title += "*";
            } else {
                if (idx >= 0) document.title = document.title.substr(0, idx);
            }
        });*/

        function makePort(name, spot, output, input) {
          // the port is basically just a small transparent square
          return myCanvas(go.Shape, "Circle",
            {
              fill: null,  // not seen, by default; set to a translucent gray by showSmallPorts, defined below
              stroke: null,
              desiredSize: new go.Size(7, 7),
              alignment: spot,  // align the port on the main Shape
              alignmentFocus: spot,  // just inside the Shape
              portId: name,  // declare this object to be a "port"
              fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
              fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
              cursor: "pointer"  // show a different cursor to indicate potential link point
            });
        }

        var nodeSelectionAdornmentTemplate =
          myCanvas(go.Adornment, "Auto",
            myCanvas(go.Shape, {
              fill: null,
              stroke: "deepskyblue",
              strokeWidth: 1.5,
              strokeDashArray: [4, 2]
            }),
            myCanvas(go.Placeholder)
          );

        var nodeResizeAdornmentTemplate =
          myCanvas(go.Adornment, "Spot",
            {locationSpot: go.Spot.Right},
            myCanvas(go.Placeholder),
            myCanvas(go.Shape, {
              alignment: go.Spot.TopLeft,
              cursor: "nw-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
            myCanvas(go.Shape, {
              alignment: go.Spot.Top,
              cursor: "n-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
            myCanvas(go.Shape, {
              alignment: go.Spot.TopRight,
              cursor: "ne-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),

            myCanvas(go.Shape, {
              alignment: go.Spot.Left,
              cursor: "w-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
            myCanvas(go.Shape, {
              alignment: go.Spot.Right,
              cursor: "e-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),

            myCanvas(go.Shape, {
              alignment: go.Spot.BottomLeft,
              cursor: "se-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
            myCanvas(go.Shape, {
              alignment: go.Spot.Bottom,
              cursor: "s-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
            myCanvas(go.Shape, {
              alignment: go.Spot.BottomRight,
              cursor: "sw-resize",
              desiredSize: new go.Size(6, 6),
              fill: "lightblue",
              stroke: "deepskyblue"
            })
          );

        var nodeRotateAdornmentTemplate =
          myCanvas(go.Adornment,
            {locationSpot: go.Spot.Center, locationObjectName: "CIRCLE"},
            myCanvas(go.Shape, "Circle", {
              name: "CIRCLE",
              cursor: "pointer",
              desiredSize: new go.Size(7, 7),
              fill: "lightblue",
              stroke: "deepskyblue"
            }),
            myCanvas(go.Shape, {
              geometryString: "M3.5 7 L3.5 30",
              isGeometryPositioned: true,
              stroke: "deepskyblue",
              strokeWidth: 1.5,
              strokeDashArray: [4, 2]
            })
          );

        this.myDiagram.nodeTemplate =
          myCanvas(go.Node, "Spot",
            {locationSpot: go.Spot.Center},
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            {selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate},
            {
              resizable: true,
              resizeObjectName: "PANEL",
              resizeAdornmentTemplate: nodeResizeAdornmentTemplate
            },
            {rotatable: true, rotateAdornmentTemplate: nodeRotateAdornmentTemplate},
            new go.Binding("angle").makeTwoWay(),
            // the main object is a Panel that surrounds a TextBlock with a Shape
            myCanvas(go.Panel, "Auto",
              {name: "PANEL"},
              new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
              myCanvas(go.Shape, "Rectangle",  // default figure
                {
                  portId: "", // the default port: if no spot on link data, use closest side
                  fromLinkable: true, toLinkable: true, cursor: "pointer",
                  fill: "white",  // default color
                  strokeWidth: 2
                },
                new go.Binding("figure"),
                new go.Binding("fill")),
              myCanvas(go.TextBlock,
                {
                  font: "bold 11pt Helvetica, Arial, sans-serif",
                  margin: 8,
                  maxSize: new go.Size(160, NaN),
                  wrap: go.TextBlock.WrapFit,
                  editable: true
                },
                new go.Binding("text").makeTwoWay())
            ),
            // four small named ports, one on each side:
            makePort("T", go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, true, false),
            { // handle mouse enter/leave events to show/hide the ports
              mouseEnter: function (e, node) {
                showSmallPorts(node, true);
              },
              mouseLeave: function (e, node) {
                showSmallPorts(node, false);
              }
            }
          );

        function showSmallPorts(node, show) {
          node.ports.each(function (port) {
            if (port.portId !== "") {  // don't change the default port, which is the big shape
              port.fill = show ? "rgba(0,0,0,.3)" : null;
            }
          });
        }

        var linkSelectionAdornmentTemplate =
          myCanvas(go.Adornment, "Link",
            myCanvas(go.Shape,
              // isPanelMain declares that this Shape shares the Link.geometry
              {isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0})  // use selection object's strokeWidth
          );

        this.myDiagram.linkTemplate =
          myCanvas(go.Link,  // the whole link panel
            {selectable: true, selectionAdornmentTemplate: linkSelectionAdornmentTemplate},
            {relinkableFrom: true, relinkableTo: true, reshapable: true},
            {
              routing: go.Link.AvoidsNodes,
              curve: go.Link.JumpOver,
              corner: 0,
              toShortLength: 4
            },
            new go.Binding("points").makeTwoWay(),
            myCanvas(go.Shape,  // the link path shape
              {isPanelMain: true, strokeWidth: 2}),
            myCanvas(go.Shape,  // the arrowhead
              {toArrow: "Standard", stroke: null}),
            myCanvas(go.Panel, "Auto",
              new go.Binding("visible", "isSelected").ofObject(),
              myCanvas(go.Shape, "RoundedRectangle",  // the link shape
                {fill: "#F8F8F8", stroke: null}),
              myCanvas(go.TextBlock,
                {
                  textAlign: "center",
                  font: "10pt helvetica, arial, sans-serif",
                  stroke: "#919191",
                  margin: 2,
                  minSize: new go.Size(10, NaN),
                  editable: true
                },
                new go.Binding("text").makeTwoWay())
            )
          );

        // load();  // load an initial diagram from some JSON text

        // initialize the Palette that is on the left side of the page
        // this.myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
        var myPalette =
          myCanvas(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
            {
              maxSelectionCount: 1,
              nodeTemplateMap: this.myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
              linkTemplate: // simplify the link template, just in this Palette
                myCanvas(go.Link,
                  { // because the GridLayout.alignment is Location and the nodes have locationSpot == Spot.Center,
                    // to line up the Link in the same manner we have to pretend the Link has the same location spot
                    locationSpot: go.Spot.Center,
                    selectionAdornmentTemplate:
                      myCanvas(go.Adornment, "Link",
                        {locationSpot: go.Spot.Center},
                        myCanvas(go.Shape,
                          {
                            isPanelMain: true,
                            fill: null,
                            stroke: "deepskyblue",
                            strokeWidth: 0
                          }),
                        myCanvas(go.Shape,  // the arrowhead
                          {toArrow: "Standard", stroke: null})
                      )
                  },
                  {
                    routing: go.Link.AvoidsNodes,
                    curve: go.Link.JumpOver,
                    corner: 5,
                    toShortLength: 4
                  },
                  new go.Binding("points"),
                  myCanvas(go.Shape,  // the link path shape
                    {isPanelMain: true, strokeWidth: 2}),
                  myCanvas(go.Shape,  // the arrowhead
                    {toArrow: "Standard", stroke: null})
                ),
              model: new go.GraphLinksModel([  // specify the contents of the Palette
                {text: "Start", figure: "Circle", fill: "#00AD5F"},
                {text: "Step", figure: "subtask"},
                {text: "结构体建模", figure: "subtask"},
                {text: "电路建模", figure: "subtask"},
                {text: "装配仿真", figure: "subtask"},
                {text: "结构仿真", figure: "subtask"},
                {text: "电路仿真", figure: "subtask"},
                {text: "力学仿真", figure: "subtask"},
                {text: "装配仿真", figure: "subtask"},
                {text: "热学仿真", figure: "subtask"},
                {text: "热仿真", figure: "subtask"},
                {text: "电磁仿真", figure: "subtask"},
                /*{text: "DB", figure: "Database", fill: "lightgray"},*/
                {text: "???", figure: "Diamond", fill: "lightskyblue"},
                {text: "End", figure: "Circle", fill: "#CE0620"},
                {text: "Comment", figure: "RoundedRectangle", fill: "lightyellow"},
              ], [
                // the Palette also has a disconnected Link, which the user can drag-and-drop
                {points: new go.List(/*go.Point*/).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)])}
              ])
            });

      },
      saveMyDiagram() {
        // nodeDataArray
        console.log(this.myDiagram.model.Gc)
        // linkDataArray
        console.log(this.myDiagram.model.Pc)
      },
      undoMyDiagram() {
        this.myDiagram.commandHandler.undo()
      },
      redoMyDiagram() {
        this.myDiagram.commandHandler.redo()
      },
      createFromTemp() {
        let processNodeEntities = {

        }
        let arrRes = []
        let nodeArr = this.myDiagram.model.Gc
        let linkArr = this.myDiagram.model.Pc

        let toKeyArr = []


        linkArr.forEach(item => {
          if(item.to) {
            toKeyArr.push(item.to)
          }
        })

        for(let i = 0; i < nodeArr.length; i++) {
          let ifHasTo = false;
          /*if(!(toKeyArr.indexOf(nodeArr[i].key) > -1)) {
            arrRes.push({
              name: nodeArr[i].text,
              location: nodeArr[i].loc,
              sign: nodeArr[i].key,
              figure: nodeArr[i].figure,
              size: nodeArr[i].size ? nodeArr[i].size : '150 70',
              parentSign: null,
              toPort: null,
              fromPort: null
              /!*parentSign: linkArr[j].from,
              toPort: linkArr[j].toPort ? linkArr[j].toPort : null,
              fromPort: linkArr[j].fromPort ? linkArr[j].fromPort : null*!/
            })
          }*/
          for(let j = 0; j < linkArr.length; j++) {
            if(nodeArr[i].key === linkArr[j].to) {
              ifHasTo = true;
              arrRes.push({
                name: nodeArr[i].text,
                location: nodeArr[i].loc,
                sign: nodeArr[i].key,
                figure: nodeArr[i].figure,
                size: nodeArr[i].size ? nodeArr[i].size : '150 70',
                parentSign: linkArr[j].from,
                toPort: linkArr[j].toPort ? linkArr[j].toPort : null,
                fromPort: linkArr[j].fromPort ? linkArr[j].fromPort : null
              })
            }
          }
          if(!ifHasTo){
            arrRes.push({
              name: nodeArr[i].text,
              location: nodeArr[i].loc,
              sign: nodeArr[i].key,
              figure: nodeArr[i].figure,
              size: nodeArr[i].size ? nodeArr[i].size : '150 70',
              parentSign: null,
              toPort: null,
              fromPort: null
            })
          }
        }
        console.log(arrRes)
        /*let params = new URLSearchParams();
        params.append('processNodeEntities', JSON.stringify(arrRes));
        let data = {
          processNodeEntities: JSON.stringify(arrRes)
          // processNodeEntities: arrRes
        }
        createProcessNodes(this.proId, data).then((res) => {

        })*/
      }
    },
    mounted() {
      this.init()
      // 实例化之后再进行传值刷新列表
      this.myDiagram.model = this.go.Model.fromJson(this.originValue)
    }
  }
</script>

<style scoped>

</style>
