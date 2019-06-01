//////////////////////////////////////////////////
//////////////////////////////////////////////////

class BaseChart { // Base Chart Class

    constructor(options) {
        this.options = options;

        
        this.scene = this.initializeScene();
        // this.scene.activeCamera.attachControl(this.canvas);
        
        this.materials = [];
        this.createMaterials(this.materials);

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

        this.engine.runRenderLoop(() => {
            this.updateScene.bind(this);
            this.updateScene();
            this.scene.render();
        });

    }

    initializeScene() {
        this.canvas = document.getElementById(this.options.id);
        this.canvas.width = this.options.width ? this.options.width : 300;
        this.canvas.height = this.options.height ? this.options.height : 200;

        this.height = this.canvas.height;
        this.width = this.canvas.width;

        this.engine = new BABYLON.Engine(this.canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true
        });

        let scene = new BABYLON.Scene(this.engine);
        // scene.debugLayer.show();

        let light0 = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, -1), scene);
        light0.intensity = .55;

        let light1 = new BABYLON.PointLight("light1", new BABYLON.Vector3(-500, -800, -500), scene);
        light1.intensity = .5;

        let light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(500, 800, -500), scene);
        light2.intensity = .5;

        // this.glowLayer = new BABYLON.GlowLayer("glowLayer", this.scene);
        // this.glowLayer.intensity = .75;

        // let camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(250, 150, -650), scene);

        // camera.cameraDirection = new BABYLON.Vector3(0,0,0);
        // camera.rotation = new BABYLON.Vector3(0,0,0);
        // camera.position = new BABYLON.Vector3(254, 150, -650);

        let camera;

        if (this.options.cameraFirstPerson) {
            camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -18), scene);
            camera.cameraDirection = new BABYLON.Vector3(0,0,0);
            camera.rotation = new BABYLON.Vector3(0,0,0);
            camera.position = new BABYLON.Vector3(254, 150, -500);

            if (this.options.ucCameraSpeed) camera.speed = this.options.ucCameraSpeed;


            if (this.options.ucCameraRotX) camera.rotation.x = this.options.ucCameraRotX;
            if (this.options.ucCameraRotY) camera.rotation.y = this.options.ucCameraRotY;
            if (this.options.ucCameraRotZ) camera.rotation.z = this.options.ucCameraRotZ;

            if (this.options.ucCameraPosX) camera.position.x = this.options.ucCameraPosX;
            if (this.options.ucCameraPosY) camera.position.y = this.options.ucCameraPosY;
            if (this.options.ucCameraPosZ) camera.position.z = this.options.ucCameraPosZ;

        } else {
            camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI/3, 600, new BABYLON.Vector3(0, 0, 0), scene);
            // camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI/2, 18, new BABYLON.Vector3(0,0,0), scene);

            // camera.lowerRadiusLimit = 5;
            // camera.upperRadiusLimit = 40;
            // camera.lowerAlphaLimit = Math.PI;
            // camera.upperAlphaLimit = Math.PI * 2;
            // camera.lowerBetaLimit = 0;
            // camera.upperBetaLimit = Math.PI;
        }

        scene.activeCamera.attachControl(this.canvas);

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

        
        // console.log('data:', options.data);
        
        this.myBars = [];
        this.myScales = [];
        this.myLabels = [];
        this.myTexts = [];
        this.myPlanes = [];

        this.labelScale = 3;
        
        if (this.options.textDepth) {
            this.textDepth = this.options.textDepth;
        } else {
            this.textDepth = .01;
        }

        this.parseData();

        this.scene.activeCamera.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2
        this.options.planeWidth = this.planeWidth;
        this.options.planeHeight = this.planeHeight;

        this.titleDepth = this.options.titleDepth ? this.options.titleDepth : 1;

        this.build(options);

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

        let leftScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label,  -6, yPosition / textScale - textScale / 3, -.01);
        let rightScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label,  this.planeWidth / textScale + 6, yPosition / textScale - textScale / 3, -.01);
    
        this.myScales.push(myBox)
        this.myTexts.push(leftScale);
        this.myTexts.push(rightScale);

    }

    updateData(optionsObject){

    }

    setLabelOptions(optionsObject){

    }

    setTitle1Options(optionsObject){
        
    }

    setTitle2Options(optionsObject){
        
    }

    destroy(){
        this.myBars.forEach(element => {
            element.dispose();
        });
        this.myBars = [];

        this.myLabels.forEach(element => {
            element.dispose();
        });
        this.myLabels = [];

        this.myPlanes.forEach(element => {
            element.dispose();
        });
        this.myPlanes = [];

        this.myScales.forEach(element => {
            element.dispose();
        });
        this.myScales = [];

        this.myTexts.forEach(element => {
            element.dispose();
        });
        this.myTexts = [];

    }

    addActions(obj, actionOptions){
        obj.actionManager = new BABYLON.ActionManager(this.scene);

        Object.keys(actionOptions).forEach( key => {
            obj.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager[key],
                    actionOptions[key]
            ));
        });
    }

    build(barChartOptionsxx) {
        // console.log('barChartOptions: ', barChartOptionsxx);

        var chartPlane = BABYLON.MeshBuilder.CreatePlane("chartPlane", {width: this.planeWidth, height: this.planeHeight}, this.scene);
        chartPlane.position.x = (this.elementWidth+this.padding)*this.seriesLength/2 + this.padding/2;
        chartPlane.position.y = this.planeHeight/2;
        this.myPlanes.push(chartPlane);

        // var chartMarginPlane = BABYLON.MeshBuilder.CreatePlane("chartMarginPlane", {width: this.planeWidth+200, height: this.planeHeight+100}, this.scene);
        // chartMarginPlane.position.x = (this.elementWidth+this.padding)*this.seriesLength/2 + this.padding/2;
        // chartMarginPlane.position.y = this.planeHeight/2;
        // this.myPlanes.push(chartMarginPlane);

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

        // add scales
        for (let index = 0; index <= this.scaleInfo.maxScale; index += this.scaleInfo.interval) {
            this.addScale(index * (this.planeHeight) / (this.scaleInfo.maxScale), index.toString(), this.labelScale);
        }

        let textScale = this.labelScale;

        this.options.data[this.seriesNames[0]].forEach((element, index) => {
            // console.log(element);
            let text = this.gui3D.create3DText(this.scene, textScale, this.textDepth, element.label, 
                index * this.planeWidth / this.seriesLength / textScale + this.planeWidth / this.seriesLength / textScale / 2,
                -7 - (index % 2) * textScale,
                -.01);
            this.myTexts.push(text);
        });

        let titleText = this.gui3D.create3DText(this.scene, 6, this.titleDepth, this.options.reportTitle,  this.planeWidth / 2 / 6, this.planeHeight / 6 + 6 / 2, -.2);
        this.myTexts.push(titleText);

        for (let elementIndex = 0; elementIndex < this.seriesLength; elementIndex++) {
            for (let seriesIndex = 0; seriesIndex < this.seriesCount; seriesIndex++) {
                const element = this.options.data[this.seriesNames[seriesIndex]][elementIndex];

                // console.log('element:',element)
                let bar;

                let barHeight = this.options.planeHeight * (element.value / this.scaleInfo.maxScale);

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
                
                // Add actions to bar
                var actionsObject = {
                    OnLeftPickTrigger: () => { console.log('left clicked ' + bar.name) },
                    OnRightPickTrigger: () => { this.gui2D.menuObjectOptions(bar, this.scene.pointerX, this.scene.pointerY) },
                    OnPointerOverTrigger: () => { bar.material.emissiveColor = new BABYLON.Color3(.1, .1, .1) },
                    OnPointerOutTrigger: () => { bar.material.emissiveColor = new BABYLON.Color3(0, 0, 0) }
                }
                
                this.addActions(bar, actionsObject);
                
                this.myBars.push(bar);
            }
        }
    }

}

//////////////////////////////////////////////////
//////////////////////////////////////////////////

// class PieChart extends BaseChart {

//     constructor(options) {
//         super(options);
//     }

//     addSlice(options) {

//     }

//     build(barChartOptions) {

//     }

// }

class PieChart extends BaseChart {

    constructor(options){
        super(options);

        this.build();
    }

    addPieSlice(options) {
        // X and Y calculations for offset animation
        let offset = 60;
        let height = 50;
        let medianAngle = options.startRotation + Math.PI * options.percent;
        let offsetX = Math.cos(medianAngle) * offset;
        let offsetZ = -Math.sin(medianAngle) * offset;
        let offsetX2 = Math.cos(medianAngle) * 6;
        let offsetZ2 = -Math.sin(medianAngle) * 6;

        // basic settings for a cylinder
        var settings = {
            height: height,
            diameterTop: 500,
            diameterBottom: 500,
            tessellation: 40,
            arc: options.percent, // update size of slice % [0..1]
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        };

        // create the slice pieces
        var slice1 = BABYLON.MeshBuilder.CreateCylinder(options.name, settings, options.graph);
        var myPlane1 = BABYLON.MeshBuilder.CreatePlane("myPlane", {
            width: 250,
            height: height,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        }, options.graph);
        myPlane1.position.x = 125;
        var myPlane2 = BABYLON.MeshBuilder.CreatePlane("myPlane", {
            width: 250,
            height: height,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        }, options.graph);
        myPlane2.setPivotPoint(new BABYLON.Vector3(-125, 0, 0));
        myPlane2.rotation.y = Math.PI * options.percent * 2;
        myPlane2.position.x = 125;





        // let mat = new BABYLON.StandardMaterial("mat", this.scene);
        // mat.diffuseColor = new BABYLON.Color3(1,0,0);
        // mat.specularColor = new BABYLON.Color3(0, 0, 0);
        // mat.alpha = this.options.alpha;




        // build the slice
        var slice = BABYLON.Mesh.MergeMeshes([slice1, myPlane1, myPlane2]);
        // console.log('pie option.mat',options.mat);
        slice.material = options.mat;
        slice.rotation.y = options.startRotation; // rotation location in pie
        // slice.visibility = .75;
        // slice.userData = {};
        // slice.userData.test1 = 'testing123';
        // slice.userData.test2 = 'testing321';
        // slice.userData.test3 = 'testingxyz';
        // slice.userData.test4 = 100;
        // slice.userData.test5 = slice.material;
        // slice.userData.test6 = 100.000001;
        slice.userData = {};
        slice.userData.myOptions = options;

        /////// Add Actions

        var basePosition = slice.position;

        slice.actionManager = new BABYLON.ActionManager(options.graph);
        slice.actionManager
            .registerAction(
                new BABYLON.InterpolateValueAction(
                    BABYLON.ActionManager.OnPickTrigger,
                    slice,
                    'position',
                    new BABYLON.Vector3(offsetX, 0, offsetZ),
                    100
                )
            ).then(
                new BABYLON.InterpolateValueAction(
                    BABYLON.ActionManager.NothingTrigger,
                    slice,
                    'position',
                    basePosition,
                    100
                )
            );


        // createLabel(slice, this.advancedTexture);

        // if (this.options.label2D) {
        //     this.gui2D.create2DLabel.bind(this);
        //     this.gui2D.create2DLabel(slice, options.index, options);
        // }

        // this.objects.push(slice);

        // console.log(slice);
        return slice;
    } //  end addPieSlice method

    build() {
        let titleText = this.gui3D.create3DText(this.scene, 6, this.titleDepth, this.options.reportTitle,  0,  20, -.2);
        // this.myTexts.push(titleText);

        let max_label_size = 0;
        let total_value = 0;
        let largestValue = Number.MIN_SAFE_INTEGER;
        let smallestValue = Number.MAX_SAFE_INTEGER;
        let color_index = 0;

        this.options.data.Series0.forEach(element => {
            total_value += element.value;
            if (element.value > largestValue) {
                largestValue = element.value
            }
            if (element.value < smallestValue) {
                smallestValue = element.value
            }
            max_label_size = element.label.length > max_label_size ? element.label.length : max_label_size;
        });

// console.log('this in pie', this)

let me = this;
        let start_angle = 0;
        this.options.data.Series0.forEach((element,index) => {
            // console.log('slice mat', me.materials[index])
            let slice_angle = 2 * Math.PI * element.value / total_value;
            let slice = this.addPieSlice({
                graph: this.scene,
                percent: element.value / total_value,
                startRotation: start_angle,
                mat: me.materials[index+1],
                name: element.label,
                value: element.value
            });

            start_angle += slice_angle;
            // color_index++;
        });

    } //  end build method

} //  end PieChart class

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

for (let seriesCount = 0; seriesCount < 3; seriesCount++) {
    dataSeries['Series' + seriesCount] = [];
    for (let dataPoints = 1; dataPoints <= 12; dataPoints++) {

        let data = {
            label: months[dataPoints].long,
            // label: 'Label'+ dataPoints,
            value: 20 + 75 * (Math.abs(6 - dataPoints/(seriesCount+1) + 2 + 3*Math.sin(seriesCount*dataPoints))),
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
    reportTitle: 'Monthly Report', // Added
    data: dataSeries, // required - array of data objects     { label: "July", value: 100 }


    ///////////////////////
    // optional settings //
    ///////////////////////

    width: 600, // <default 300>
    height: 350, // <default 200>
    // shadows: true, // <default false>
    round: false, // <default false>        // Added
    depth: 10.5, // <default .25 >            // Added
    textDepth: .01,
    titleDepth: .01,
    textColor: {
        r: 0,
        g: 0,
        b: 0
    }, // Added

    alpha: 1, // Added
    showScale: true,
    backgroundColor: { // added
        r: 1,
        g: 1,
        b: 1
    },
        // logo: 'logo.png',
    // label2D: false,
    // coloredLabels: false,
    // ground: true,
    cameraFirstPerson: true
    // backplane: false,
    // horizontalLabels: false,
    // verticalLabels: true,
    // normal: 'normal5.jpg'

});


let pieChart = new PieChart({
    id: 'pie',     // required - id of canvas element to use
    data: dataSeries, // required - array of data objects     { label: "July", value: 100 }
    reportTitle: 'Deloitte', // Added

    ///////////////////////
    // optional settings //
    ///////////////////////

    width: 600,     // <default 300>
    height: 350,    // <default 200>
    alpha: 1, // Added
    backgroundColor: { // added
        r: 1,
        g: 1,
        b: 1
    },
    titleDepth: .1,
    textColor: {
        r: 0,
        g: 1,
        b: 0
    }, // Added
    // shadows: true,  // <default false>
    // label2D: false,
    // tansparent: false,
    // showScale: false,
    cameraFirstPerson: false

    // ground color
    // camera distance
    // intro animation

});
