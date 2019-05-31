//////////////////////////////////////////////////
//////////////////////////////////////////////////

class BaseChart { // Base Chart Class

    constructor(options) {
        this.options = options;

        this.materials = [];

        this.canvas = document.getElementById(options.id);
        this.canvas.width = options.width ? options.width : 300;
        this.canvas.height = options.height ? options.height : 200;

        this.height = this.canvas.height;
        this.width = this.canvas.width;

        this.engine = new BABYLON.Engine(this.canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true
        });

        this.scene = this.initializeScene(this.engine);
        this.scene.activeCamera.attachControl(this.canvas);
        console.log('scene: ', this.scene);

        this.createMaterials(this.materials);
        // var glowLayer = new BABYLON.GlowLayer("glowLayer", this.scene);
        //     glowLayer.intensity = .75;

        // console.log(this.materials);

        this.gui3D = new Gui3DManager(this.scene, this.objects, this.options, this);
        this.gui2D = new Gui2DManager(this);

        this.lineMat = new BABYLON.StandardMaterial("lineMat", this.scene);
        this.lineMat.alpha = 1;
        this.lineMat.specularColor = new BABYLON.Color3(0, 0, 0);
        this.lineMat.emissiveColor = new BABYLON.Color3(0, 0, 0);

        if (this.options.textColor) {
            this.lineMat.diffuseColor = new BABYLON.Color3(this.options.textColor.r, this.options.textColor.g, this.options.textColor.b);
        } else {
            this.lineMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
        }


        // this.parseData();
        // this.seriesNames = Object.keys(options.data);
        // this.seriesCount = this.seriesNames.length;
        // this.seriesLength = options.data[this.seriesNames[0]].length;

        // this.highVal = Number.MIN_SAFE_INTEGER;
        // this.lowVal = Number.MAX_SAFE_INTEGER;

        // // calculate data properties
        // for (let elementIndex = 0; elementIndex < this.seriesLength; elementIndex++) {
        //     for (let seriesIndex = 0; seriesIndex < this.seriesCount; seriesIndex++) {
        //         const element = this.options.data[this.seriesNames[seriesIndex]][elementIndex];

        //         if (element.value > this.highVal) this.highVal = element.value;
        //         if (element.value < this.lowVal) this.lowVal = element.value;
        //     }
        // }

        // this.scaleInfo = calculateScale(this.highVal);

        this.engine.runRenderLoop(() => {
            this.updateScene.bind(this);
            this.updateScene();
            this.scene.render();
        });

    }

    

    initializeScene() {

        let scene = new BABYLON.Scene(this.engine);
        // scene.debugLayer.show();

        let light0 = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, -1), scene);
        light0.intensity = .55;

        let light1 = new BABYLON.PointLight("light1", new BABYLON.Vector3(-500, -800, -500), scene);
        light1.intensity = .5;

        let light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(500, 800, -500), scene);
        light2.intensity = .5;

        let camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(250, 150, -650), scene);

        camera.cameraDirection = new BABYLON.Vector3(0,0,0);
        camera.rotation = new BABYLON.Vector3(0,0,0);
        camera.position = new BABYLON.Vector3(254, 150, -650);


        if (this.options.backgroundColor) {
            scene.clearColor = new BABYLON.Color3(
                this.options.backgroundColor.r,
                this.options.backgroundColor.g,
                this.options.backgroundColor.b
            );
        }

        return scene;
    }

    updateScene() {

    }

    createMaterials(materials) {
        // for (let xr = 0; xr <= 1; xr += .333) 
        // for (let yg = 0; yg <= 1; yg += .333) 
        // for (let zb = 0; zb <= 1; zb += .333)
        // {
        //     let mat = new BABYLON.StandardMaterial("mat", this.scene);
        //         mat.diffuseColor = new BABYLON.Color3(xr, yg, zb);
        //         mat.specularColor = new BABYLON.Color3(0, 0, 0);
        //         mat.alpha = 1;
        //         mat.emissiveColor = new BABYLON.Color3(xr/5, yg/5, zb/5);

        //     materials.push(mat);
        // }

        for (let i = 0; i < colorList.length; i++) {
            let mat = new BABYLON.StandardMaterial("mat", this.scene);
            mat.diffuseColor = BABYLON.Color3.FromHexString(colorList[i]);
            mat.specularColor = new BABYLON.Color3(0, 0, 0);
            mat.alpha = this.options.alpha;

            materials.push(mat);
        }
    }

    parseData(){
        this.seriesNames = Object.keys(this.options.data);
        this.seriesCount = this.seriesNames.length;
        this.seriesLength = this.options.data[this.seriesNames[0]].length;

        this.highVal = Number.MIN_SAFE_INTEGER;
        this.lowVal = Number.MAX_SAFE_INTEGER;

        // calculate data properties
        for (let elementIndex = 0; elementIndex < this.seriesLength; elementIndex++) {
            for (let seriesIndex = 0; seriesIndex < this.seriesCount; seriesIndex++) {
                const element = this.options.data[this.seriesNames[seriesIndex]][elementIndex];

                if (element.value > this.highVal) this.highVal = element.value;
                if (element.value < this.lowVal) this.lowVal = element.value;
            }
        }

        this.scaleInfo = calculateScale(this.highVal);

        this.elementWidth = Math.trunc(500 / this.seriesLength) - this.padding;
        this.barWidth = (this.elementWidth) / this.seriesCount;

        this.planeWidth = (this.elementWidth + this.padding) * this.seriesLength + this.padding;
        this.planeHeight = 300;
    }
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////

class BarChart extends BaseChart {

    constructor(options) {
        super(options);
        this.padding = 10;

        this.parseData();

        console.log('data:', options.data);

        this.myBars = [];
        this.myScales = [];
        this.myLabels = [];
        this.myTexts = [];
        this.myPlanes = [];


        // this.elementWidth = Math.trunc(500 / this.seriesLength) - this.padding;
        // this.barWidth = (this.elementWidth) / this.seriesCount;

        // this.planeWidth = (this.elementWidth + this.padding) * this.seriesLength + this.padding;
        // this.planeHeight = 300;

        if (this.options.textDepth) {
            this.textDepth = this.options.textDepth;
        } else {
            this.textDepth = .01;
        }

        this.scene.activeCamera.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2
        this.options.planeWidth = this.planeWidth;
        this.options.planeHeight = this.planeHeight;

        // var chartPlane = BABYLON.MeshBuilder.CreatePlane("chartPlane", {width: this.planeWidth, height: this.planeHeight}, this.scene);
        // chartPlane.position.x = (this.elementWidth+this.padding)*this.seriesLength/2 + this.padding/2;
        // chartPlane.position.y = this.planeHeight/2;
        // this.myPlanes.push(chartPlane);

        // var chartMarginPlane = BABYLON.MeshBuilder.CreatePlane("chartMarginPlane", {width: this.planeWidth+200, height: this.planeHeight+100}, this.scene);
        // chartMarginPlane.position.x = (this.elementWidth+this.padding)*this.seriesLength/2 + this.padding/2;
        // chartMarginPlane.position.y = this.planeHeight/2;
        // this.myPlanes.push(chartMarginPlane);

        this.scene.activeCamera.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2
        this.options.planeWidth = this.planeWidth;
        this.options.planeHeight = this.planeHeight;

        this.titleDepth = this.options.titleDepth ? this.options.titleDepth : 1;

        // let titleText = this.gui3D.create3DText(this.scene, 6, this.titleDepth, this.options.reportTitle, 'this.planeWidth', 'this.planeHeight', this.planeWidth / 2 / 6, this.planeHeight / 6 + 6 / 2, -.2);
        // this.myTexts.push(titleText);

        this.build(options);

        // // draw vertical lines separating elements
        // for (let index = 0; index < this.seriesLength + 1; index++) {
        //     let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {
        //         height: 305,
        //         width: .5,
        //         depth: .1
        //     }, this.scene);
        //     myBox.material = this.lineMat;
        //     myBox.position.x = index * (this.elementWidth + this.padding) + this.padding / 2;
        //     myBox.position.y = 146;
        //     myBox.position.z = 0;

        //     this.myScales.push(myBox);
        // }

        // for (let index = 0; index <= this.scaleInfo.maxScale; index += this.scaleInfo.interval) {
        //     this.addScale(index * (this.planeHeight) / (this.scaleInfo.maxScale), index.toString(), 3);
        // }

        // let textScale = 3;
        // // options.data[this.seriesNames[0]].forEach((element, index) => {
        //     // console.log(element);
        //     let text = this.gui3D.create3DText(this.scene, textScale, this.textDepth, element.label, 'this.planeWidth', 'this.planeHeight',
        //         index * this.planeWidth / this.seriesLength / textScale + this.planeWidth / this.seriesLength / textScale / 2,
        //         -7 - (index % 2) * textScale,
        //         -.01);
        //     this.myTexts.push(text);
        // });
    }

    addBar(barOptions) {

    }

    addScale(yPosition, label, textScale) {
        let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {
            height: 1,
            width: this.options.planeWidth,
            depth: 1.2
        }, this.scene);

        myBox.material = this.lineMat;
        myBox.position.x = this.planeWidth / 2;
        myBox.position.y = yPosition;
        myBox.position.z = 0;

        let leftScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, 'this.planeWidth', 'this.planeHeight', -6, yPosition / textScale - textScale / 3, -.01);
        let rightScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, 'this.planeWidth', 'this.planeHeight', this.planeWidth / textScale + 6, yPosition / textScale - textScale / 3, -.01);
    
        this.myScales.push(myBox)
        this.myScales.push(leftScale);
        this.myScales.push(rightScale);

    }

    destroy(){
        this.myBars.forEach(element => {
            element.dispose();
        });

        this.myLabels.forEach(element => {
            element.dispose();
        });

        this.myPlanes.forEach(element => {
            element.dispose();
        });

        this.myScales.forEach(element => {
            element.dispose();
        });

        this.myTexts.forEach(element => {
            element.dispose();
        });

    }

    updateData(barChartOptions){

    }

    build(barChartOptions) {
        console.log('barChartOptions: ', barChartOptions);

        var chartPlane = BABYLON.MeshBuilder.CreatePlane("chartPlane", {width: this.planeWidth, height: this.planeHeight}, this.scene);
        chartPlane.position.x = (this.elementWidth+this.padding)*this.seriesLength/2 + this.padding/2;
        chartPlane.position.y = this.planeHeight/2;
        this.myPlanes.push(chartPlane);

        var chartMarginPlane = BABYLON.MeshBuilder.CreatePlane("chartMarginPlane", {width: this.planeWidth+200, height: this.planeHeight+100}, this.scene);
        chartMarginPlane.position.x = (this.elementWidth+this.padding)*this.seriesLength/2 + this.padding/2;
        chartMarginPlane.position.y = this.planeHeight/2;
        this.myPlanes.push(chartMarginPlane);

       // draw vertical lines separating elements
       for (let index = 0; index < this.seriesLength + 1; index++) {
        let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {
            height: 305,
            width: .5,
            depth: .1
        }, this.scene);
        myBox.material = this.lineMat;
        myBox.position.x = index * (this.elementWidth + this.padding) + this.padding / 2;
        myBox.position.y = 146;
        myBox.position.z = 0;

        this.myScales.push(myBox);
    }

    for (let index = 0; index <= this.scaleInfo.maxScale; index += this.scaleInfo.interval) {
        this.addScale(index * (this.planeHeight) / (this.scaleInfo.maxScale), index.toString(), 3);
    }

    let textScale = 3;

        this.options.data[this.seriesNames[0]].forEach((element, index) => {
            // console.log(element);
            let text = this.gui3D.create3DText(this.scene, textScale, this.textDepth, element.label, 'this.planeWidth', 'this.planeHeight',
                index * this.planeWidth / this.seriesLength / textScale + this.planeWidth / this.seriesLength / textScale / 2,
                -7 - (index % 2) * textScale,
                -.01);
            this.myTexts.push(text);
        });


        let titleText = this.gui3D.create3DText(this.scene, 6, this.titleDepth, this.options.reportTitle, 'this.planeWidth', 'this.planeHeight', this.planeWidth / 2 / 6, this.planeHeight / 6 + 6 / 2, -.2);
        this.myTexts.push(titleText);

        for (let elementIndex = 0; elementIndex < this.seriesLength; elementIndex++) {
            for (let seriesIndex = 0; seriesIndex < this.seriesCount; seriesIndex++) {
                const element = barChartOptions.data[this.seriesNames[seriesIndex]][elementIndex];

                // console.log('element:',element)
                let bar;

                let barHeight = barChartOptions.planeHeight * (element.value / this.scaleInfo.maxScale);

                // // create the bar
                if (this.options.round) {
                    bar = BABYLON.MeshBuilder.CreateCylinder(this.seriesNames[seriesIndex] + '-' + element.label, {
                        height: barHeight,
                        diameter: this.barWidth
                    }, this.options.graph);
                } else {
                    bar = BABYLON.MeshBuilder.CreateBox(this.seriesNames[seriesIndex] + '-' + element.label, {
                        height: barHeight,
                        width: this.barWidth,
                        depth: this.options.depth ? this.options.depth : 10
                    }, this.scene);
                }

                this.myBars.push(bar);


                if (this.seriesCount > 1) {
                    // bar.material = (this.materials[seriesIndex+1]).clone();
                    bar.material = this.materials[seriesIndex + 1];
                } else {
                    // bar.material = (this.materials[elementIndex+1]).clone();
                    bar.material = this.materials[elementIndex + 1];
                }

                bar.position.x = elementIndex * (this.elementWidth + this.padding) + seriesIndex * this.elementWidth / this.seriesCount + this.barWidth / 2 + this.padding;
                bar.position.y = barHeight / 2;

                bar.userData = element;
                bar.userData.seriesName = this.seriesNames[seriesIndex];

                bar.actionManager = new BABYLON.ActionManager(this.scene);
                bar.actionManager
                    .registerAction(
                        new BABYLON.ExecuteCodeAction(
                            BABYLON.ActionManager.OnLeftPickTrigger,
                            () => {
                                console.log('left clicked ' + bar.name)
                            })
                    );

                bar.actionManager
                    .registerAction(
                        new BABYLON.ExecuteCodeAction(
                            BABYLON.ActionManager.OnRightPickTrigger,
                            // ()=>{console.log(' right clicked ' + bar.name + ' at ' + this.scene.pointerX + ',' +this.scene.pointerY); this.gui2D.panelPickObjectColor(bar) })
                            () => {
                                this.gui2D.menuObjectOptions(bar, this.scene.pointerX, this.scene.pointerY)
                            })
                    );

                bar.actionManager
                    .registerAction(
                        new BABYLON.ExecuteCodeAction(
                            BABYLON.ActionManager.OnPointerOverTrigger,
                            () => {
                                console.log('hovering over ' + bar.name, bar.userData.value);
                                bar.material.emissiveColor = new BABYLON.Color3(.1, .1, .1);
                                // bar.userData.myLabel.material.emissiveColor = new BABYLON.Color3(.1,.1,.1);
                            })
                    );

                bar.actionManager
                    .registerAction(
                        new BABYLON.ExecuteCodeAction(
                            BABYLON.ActionManager.OnPointerOutTrigger,
                            () => {
                                console.log('stopped hovering over ' + bar.name)
                                bar.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
                                // bar.userData.myLabel.material.emissiveColor = new BABYLON.Color3(0,0,0);

                            })
                    );
            }
        }
    }

}

//////////////////////////////////////////////////
//////////////////////////////////////////////////

class PieChart extends BaseChart {

    constructor(options) {
        super(options);
    }

    addSlice(options) {

    }

    build(barChartOptions) {

    }

}

//////////////////////////////////////////////////
//////////////////////////////////////////////////

class LineChart extends BaseChart {

    constructor(options) {
        super(options);
    }

    addPoint(options) {

    }

    addLine(lineOptions) {

    }

    build(lineChartOptions) {

    }

}

//////////////////////////////////////////////////
//////////////////////////////////////////////////

let months = {
    1: {
        long: 'January',
        short: 'Jan'
    },
    2: {
        long: 'February',
        short: 'Feb'
    },
    3: {
        long: 'March',
        short: 'Mar'
    },
    4: {
        long: 'April',
        short: 'Apr'
    },
    5: {
        long: 'May',
        short: 'May'
    },
    6: {
        long: 'June',
        short: 'Jun'
    },
    7: {
        long: 'July',
        short: 'Jul'
    },
    8: {
        long: 'August',
        short: 'Aug'
    },
    9: {
        long: 'September',
        short: 'Sep'
    },
    10: {
        long: 'October',
        short: 'Oct'
    },
    11: {
        long: 'November',
        short: 'Nov'
    },
    12: {
        long: 'December',
        short: 'Dec'
    }
}

let dataSeries = {};

for (let seriesCount = 0; seriesCount < 6; seriesCount++) {
    dataSeries['Series' + seriesCount] = [];
    for (let dataPoints = 1; dataPoints <= 3; dataPoints++) {

        let data = {
            label: months[dataPoints].long,
            // label: 'Label'+ dataPoints,
            value: 5 * (Math.abs(6 - dataPoints/(seriesCount+1) + 2 + 3*Math.sin(seriesCount*dataPoints))),
            details: {
                detail1: dataPoints,
                detail2: dataPoints * dataPoints,
                detail3: 1 / dataPoints
            }
        };
        dataSeries['Series' + seriesCount].push(data);
    }
}


let barChart2 = new BarChart({
    id: 'bar2', // required - id of canvas element to use
    reportTitle: 'Quarterly Report', // Added
    data: dataSeries, // required - array of data objects     { label: "July", value: 100 }


    ///////////////////////
    // optional settings //
    ///////////////////////

    width: 800, // <default 300>
    height: 700, // <default 200>
    // shadows: true, // <default false>
    round: false, // <default false>        // Added
    depth: 10, // <default .25 >            // Added
    textDepth: .01,
    titleDepth: 1,
    textColor: {
        r: 0,
        g: 0,
        b: 0
    }, // Added

    alpha: .8, // Added
    showScale: true,
    backgroundColor: { // added
        r: 0,
        g: 0,
        b: 0.2
    }
        // logo: 'logo.png',
    // label2D: false,
    // coloredLabels: false,
    // ground: true,
    // cameraFirstPerson: false,
    // backplane: false,
    // horizontalLabels: false,
    // verticalLabels: true,
    // normal: 'normal5.jpg'

});