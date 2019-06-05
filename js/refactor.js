//////////////////////////////////////////////////
//////////////////////////////////////////////////
/*

    options = {
        scene: { 
            id: 'id of canvas element'
        },
        chart: {
            title: 'Report Title'
        },
        dataSeries: {
            'series1Name':  [
                                {
                                    label: 'string',
                                    value: 'number',
                                    details: {
                                        'detail1': 'detail',
                                        'detail2': 'detail',
                                        // ...
                                    } 
                                },
                                {
                                    label: 'string',
                                    value: 'number',
                                    details: {
                                        'detail1': 'detail',
                                        'detail2': 'detail',
                                        // ...
                                    } 
                                }
                            ],
            'series2Name':  [
                                // ...
                            ]
            // ...
        }
    }




    SceneManager(options)
        Initialize
        AddChart
        RemoveChart
        RecalculateChart
        MoveChart

        
*/

class BaseChart { 

    constructor(options) {
        this.options = options;

        // Create base scene
        this.scene = this.initializeScene();
        this.gui3D = new Gui3DManager(this.scene, this.objects, this.options, this);
        this.gui2D = new Gui2DManager(this);

        this.materials = [];
        this.createMaterials(this.materials);

        // Basic line/text material
        this.lineMat = new BABYLON.StandardMaterial("lineMat", this.scene);
        this.lineMat.alpha = 1;
        this.lineMat.specularColor = new BABYLON.Color3(0, 0, 0);
        this.lineMat.emissiveColor = new BABYLON.Color3(0, 0, 0);

        if (this.options.chart.textColor) {
            this.lineMat.diffuseColor = new BABYLON.Color3(this.options.chart.textColor.r, this.options.chart.textColor.g, this.options.chart.textColor.b);
        } else {
            this.lineMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
        }

        // Main render loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }

    initializeScene() {
        // console.log('id',this.options.scene.id);
        this.canvas = document.getElementById(this.options.scene.id);
        // console.log('canvas', this.canvas);
        this.canvas.width = this.options.scene.width ? this.options.scene.width : 300;
        this.canvas.height = this.options.scene.height ? this.options.scene.height : 200;

        // this.height = this.canvas.height;
        // this.width = this.canvas.width;

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

        let camera;

        if (this.options.scene.cameraFirstPerson) {
            camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -18), scene);
            camera.cameraDirection = new BABYLON.Vector3(0, 0, 0);
            camera.rotation = new BABYLON.Vector3(0, 0, 0);
            camera.position = new BABYLON.Vector3(254, 150, -500);

            if (this.options.ucCameraSpeed) camera.speed = this.options.ucCameraSpeed;
            if (this.options.ucCameraRotX) camera.rotation.x = this.options.ucCameraRotX;
            if (this.options.ucCameraRotY) camera.rotation.y = this.options.ucCameraRotY;
            if (this.options.ucCameraRotZ) camera.rotation.z = this.options.ucCameraRotZ;

            if (this.options.ucCameraPosX) camera.position.x = this.options.ucCameraPosX;
            if (this.options.ucCameraPosY) camera.position.y = this.options.ucCameraPosY;
            if (this.options.ucCameraPosZ) camera.position.z = this.options.ucCameraPosZ;

        } else {
            camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 3, 600, new BABYLON.Vector3(0, 0, 0), scene);

            // camera.lowerRadiusLimit = 5;
            // camera.upperRadiusLimit = 40;
            // camera.lowerAlphaLimit = Math.PI;
            // camera.upperAlphaLimit = Math.PI * 2;
            // camera.lowerBetaLimit = 0;
            // camera.upperBetaLimit = Math.PI;
        }

        scene.activeCamera.attachControl(this.canvas);

        if (this.options.scene.backgroundColor) {
            scene.clearColor = new BABYLON.Color3(
                this.options.scene.backgroundColor.r,
                this.options.scene.backgroundColor.g,
                this.options.scene.backgroundColor.b
            );
        }

        return scene;
    }

    createMaterials(materials) {
        for (let i = 0; i < colorList.length; i++) {
            let mat = new BABYLON.StandardMaterial("mat", this.scene);
            mat.diffuseColor = BABYLON.Color3.FromHexString(colorList[i]);
            mat.specularColor = new BABYLON.Color3(0, 0, 0);
            mat.alpha = this.options.chart.alpha;

            materials.push(mat);
        }
    }

    parseData() {
        this.seriesNames = Object.keys(this.options.data);
        this.seriesCount = this.seriesNames.length;
        this.seriesLength = this.options.data[this.seriesNames[0]].length;
        this.seriesTotals = [];

        this.highVal = Number.MIN_SAFE_INTEGER;
        this.lowVal = Number.MAX_SAFE_INTEGER;

        for (let elementIndex = 0; elementIndex < this.seriesLength; elementIndex++) {
            this.seriesTotals[elementIndex] = 0;

            for (let seriesIndex = 0; seriesIndex < this.seriesCount; seriesIndex++) {
                const element = this.options.data[this.seriesNames[seriesIndex]][elementIndex];

                if (element.value > this.highVal) this.highVal = element.value;
                if (element.value < this.lowVal) this.lowVal = element.value;

                this.seriesTotals[elementIndex] += element.value;
            }
        }

        this.seriesHighTotal = Math.max(...this.seriesTotals);

        console.log('seriestotals', this.seriesTotals);
        console.log('largestSeries', this.seriesHighTotal);

        // this.scaleInfo = calculateScale(this.seriesHighTotal);

        // this.elementWidth = Math.trunc(500 / this.seriesLength) - this.padding;
        // this.barWidth = (this.elementWidth) / this.seriesCount;

        // this.planeWidth = (this.elementWidth + this.padding) * this.seriesLength + this.padding;
        // this.planeHeight = 300;
    }

    addActions(obj, actionOptions) {
        obj.actionManager = new BABYLON.ActionManager(this.scene);

        Object.keys(actionOptions).forEach(key => {
            obj.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager[key],
                    actionOptions[key]
                ));
        });
    }
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////

class BarChart extends BaseChart {

    constructor(options) {
        super(options);
        console.log('options:', options);

        this.padding = 10;

        this.myBars = [];
        this.myScales = [];
        this.myLabels = [];
        this.myTexts = [];
        this.myPlanes = [];

        this.labelScale = 3;

        if (this.options.chart.textDepth) {
            this.textDepth = this.options.chart.textDepth;
        } else {
            this.textDepth = .01;
        }

        this.parseData();

        this.scaleInfo = calculateScale(this.highVal);

        this.elementWidth = Math.trunc(500 / this.seriesLength) - this.padding;
        this.barWidth = (this.elementWidth) / this.seriesCount;

        this.planeWidth = (this.elementWidth + this.padding) * this.seriesLength + this.padding;
        this.planeHeight = 300;

        this.scene.activeCamera.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2
        this.options.chart.planeWidth = this.planeWidth;
        this.options.chart.planeHeight = this.planeHeight;

        this.titleDepth = this.options.chart.titleDepth ? this.options.chart.titleDepth : 1;

        this.build(options);
    }

    addScale(yPosition, label, textScale) {
        let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {
            height: 1,
            width: this.options.chart.planeWidth,
            depth: 1.2
        }, this.scene);

        myBox.material = this.lineMat;
        myBox.position.x = this.options.chart.planeWidth / 2;
        myBox.position.y = yPosition;
        myBox.position.z = 0;

        // let leftScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, -6, yPosition / textScale - textScale / 3, -5);
        // let rightScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, this.planeWidth / textScale + 6, yPosition / textScale - textScale / 3, -5);
        let leftScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, -6, yPosition/textScale -textScale/3, -1.75);
        let rightScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, this.planeWidth / textScale + 6, yPosition / textScale, -1.75);

        this.myScales.push(myBox)
        this.myTexts.push(leftScale);
        this.myTexts.push(rightScale);

    }

    getElementsAcrossSeries(){

    }

    destroy() {
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

    // addActions(obj, actionOptions) {
    //     obj.actionManager = new BABYLON.ActionManager(this.scene);

    //     Object.keys(actionOptions).forEach(key => {
    //         obj.actionManager.registerAction(
    //             new BABYLON.ExecuteCodeAction(
    //                 BABYLON.ActionManager[key],
    //                 actionOptions[key]
    //             ));
    //     });
    // }


    addBar(elementIndex, seriesIndex){

        let element = this.options.data[this.seriesNames[seriesIndex]][elementIndex];

        // console.log('element',element)

        let bar;
        let barHeight = this.options.chart.planeHeight * (element.value / this.scaleInfo.maxScale);

        // console.log('this.options.planeHeight',this.options.chart.planeHeight);

        // // create the bar
        if (this.options.chart.round) {
            bar = BABYLON.MeshBuilder.CreateCylinder(this.seriesNames[seriesIndex] + '-' + element.label, {
                height: barHeight,
                diameter: this.barWidth
            }, this.scene);
        } else {
            bar = BABYLON.MeshBuilder.CreateBox(this.seriesNames[seriesIndex] + '-' + element.label, {
                height: barHeight,
                width: this.barWidth,
                depth: this.options.chart.depth ? this.options.chart.depth : 10
            }, this.scene);
        }

        if (this.seriesCount > 1) {
            bar.material = this.materials[seriesIndex + 1];
        } else {
            bar.material = this.materials[elementIndex + 1];
        }

        bar.position.x = elementIndex * (this.elementWidth + this.padding) + seriesIndex * this.elementWidth / this.seriesCount + this.barWidth / 2 + this.padding;
        bar.position.y = barHeight / 2;

        bar.userData = element;
        bar.userData.seriesName = this.seriesNames[seriesIndex];

        // Add actions to bar
        var actionsObject = {
            OnLeftPickTrigger: () => {
                console.log('left clicked ' + bar.name)
            },
            OnRightPickTrigger: () => {
                console.log(bar);
                console.log(this.scene.pointerX);
                console.log(this.scene.pointerY);
                
                this.gui2D.menuObjectOptions(bar, this.scene.pointerX, this.scene.pointerY)
            },
            OnPointerOverTrigger: () => {
                bar.material.emissiveColor = new BABYLON.Color3(.1, .1, .1)
            },
            OnPointerOutTrigger: () => {
                bar.material.emissiveColor = new BABYLON.Color3(0, 0, 0)
            }
        }

        this.addActions(bar, actionsObject);

        this.myBars.push(bar);
    }

    build(barChartOptionsxx) {
        // console.log('barChartOptions: ', barChartOptionsxx);

        if (this.options.chart.showBackplanes){
            var chartPlane = BABYLON.MeshBuilder.CreatePlane("chartPlane", {
                width: this.planeWidth,
                height: this.planeHeight
            }, this.scene);

            chartPlane.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2;
            chartPlane.position.y = this.planeHeight / 2;
            this.myPlanes.push(chartPlane);

            var chartMarginPlane = BABYLON.MeshBuilder.CreatePlane("chartMarginPlane", {
                width: this.planeWidth+400, 
                height: this.planeHeight+300
            }, this.scene);

            chartMarginPlane.position.x = (this.elementWidth+this.padding)*this.seriesLength/2 + this.padding/2;
            chartMarginPlane.position.y = this.planeHeight/2;
            this.myPlanes.push(chartMarginPlane);
        }

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
                -7 - (index % 2) * textScale*2,
                -1.75);
            this.myTexts.push(text);
        });

        let titleText = this.gui3D.create3DText(this.scene, 6, this.titleDepth, this.options.chart.title, this.planeWidth / 2 / 6, this.planeHeight / 6 + 6 / 2, -1.75);
        this.myTexts.push(titleText);
        // titleText.getMesh().setPivotPoint(titleText.getMesh().getBoundingInfo().boundingBox.centerWorld, BABYLON.Space.WORLD);
        // console.log(titleText.getMesh().getBoundingInfo().boundingBox.center);

        for (let elementIndex = 0; elementIndex < this.seriesLength; elementIndex++) {
            for (let seriesIndex = 0; seriesIndex < this.seriesCount; seriesIndex++) {
                
                this.addBar(elementIndex, seriesIndex);
            }
        }
    }

}

//////////////////////////////////////////////////

class StackedBarChart extends BaseChart {

    constructor(options) {
        super(options);
        console.log('options:', options);

        this.padding = 10;

        this.myBars = [];
        this.myScales = [];
        this.myLabels = [];
        this.myTexts = [];
        this.myPlanes = [];

        this.labelScale = 3;

        if (this.options.chart.textDepth) {
            this.textDepth = this.options.chart.textDepth;
        } else {
            this.textDepth = .01;
        }

        this.parseData();

        this.scaleInfo = calculateScale(this.seriesHighTotal);

        this.elementWidth = Math.trunc(500 / this.seriesLength) - this.padding;
        // this.barWidth = (this.elementWidth) / this.seriesCount;
        this.barWidth = this.elementWidth;

        this.planeWidth = (this.elementWidth + this.padding) * this.seriesLength + this.padding;
        this.planeHeight = 300;

        this.scene.activeCamera.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2
        this.options.chart.planeWidth = this.planeWidth;
        this.options.chart.planeHeight = this.planeHeight;

        this.titleDepth = this.options.chart.titleDepth ? this.options.chart.titleDepth : 1;

        this.build(options);
    }

    addScale(yPosition, label, textScale) {
        let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {
            height: 1,
            width: this.options.chart.planeWidth,
            depth: 1.2
        }, this.scene);

        myBox.material = this.lineMat;
        myBox.position.x = this.options.chart.planeWidth / 2;
        myBox.position.y = yPosition;
        myBox.position.z = 0;

        // let leftScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, -6, yPosition / textScale - textScale / 3, -5);
        // let rightScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, this.planeWidth / textScale + 6, yPosition / textScale - textScale / 3, -5);
        let leftScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, -6, yPosition/textScale -textScale/3, -1.75);
        let rightScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, this.planeWidth / textScale + 6, yPosition / textScale, -1.75);

        this.myScales.push(myBox)
        this.myTexts.push(leftScale);
        this.myTexts.push(rightScale);

    }

    getElementsAcrossSeries(){

    }

    destroy() {
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

    // addActions(obj, actionOptions) {
    //     obj.actionManager = new BABYLON.ActionManager(this.scene);

    //     Object.keys(actionOptions).forEach(key => {
    //         obj.actionManager.registerAction(
    //             new BABYLON.ExecuteCodeAction(
    //                 BABYLON.ActionManager[key],
    //                 actionOptions[key]
    //             ));
    //     });
    // }


    addBar(elementIndex, seriesIndex, seriesOffset){

        let element = this.options.data[this.seriesNames[seriesIndex]][elementIndex];

        // console.log('element',element)

        let bar;
        let barHeight = this.options.chart.planeHeight * (element.value / this.scaleInfo.maxScale);

        // console.log('this.options.planeHeight',this.options.chart.planeHeight);

        // // create the bar
        if (this.options.chart.round) {
            bar = BABYLON.MeshBuilder.CreateCylinder(this.seriesNames[seriesIndex] + '-' + element.label, {
                height: barHeight,
                diameter: this.barWidth
            }, this.scene);
        } else {
            bar = BABYLON.MeshBuilder.CreateBox(this.seriesNames[seriesIndex] + '-' + element.label, {
                height: barHeight,
                width: this.barWidth,
                depth: this.options.chart.depth ? this.options.chart.depth : 10
            }, this.scene);
        }

        if (this.seriesCount > 1) {
            bar.material = this.materials[seriesIndex + 1];
        } else {
            bar.material = this.materials[elementIndex + 1];
        }

        // bar.position.x = elementIndex * (this.elementWidth + this.padding) + seriesIndex * this.elementWidth / this.seriesCount + this.barWidth / 2 + this.padding;
        bar.position.x = elementIndex * (this.elementWidth + this.padding) + this.barWidth / 2 + this.padding;
        bar.position.y = barHeight / 2;

        if (seriesOffset >= 0) {
            bar.position.y = barHeight / 2 + seriesOffset;
            this.stackedHeight[elementIndex] += barHeight;
        }

        bar.userData = element;
        bar.userData.seriesName = this.seriesNames[seriesIndex];

        // Add actions to bar
        var actionsObject = {
            OnLeftPickTrigger: () => {
                console.log('left clicked ' + bar.name)
            },
            OnRightPickTrigger: () => {
                console.log(bar);
                console.log(this.scene.pointerX);
                console.log(this.scene.pointerY);
                
                this.gui2D.menuObjectOptions(bar, this.scene.pointerX, this.scene.pointerY)
            },
            OnPointerOverTrigger: () => {
                bar.material.emissiveColor = new BABYLON.Color3(.1, .1, .1)
            },
            OnPointerOutTrigger: () => {
                bar.material.emissiveColor = new BABYLON.Color3(0, 0, 0)
            }
        }

        this.addActions(bar, actionsObject);

        this.myBars.push(bar);
    }

    build(barChartOptionsxx) {
        // console.log('barChartOptions: ', barChartOptionsxx);

        if (this.options.chart.showBackplanes){
            var chartPlane = BABYLON.MeshBuilder.CreatePlane("chartPlane", {
                width: this.planeWidth,
                height: this.planeHeight
            }, this.scene);

            chartPlane.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2;
            chartPlane.position.y = this.planeHeight / 2;
            this.myPlanes.push(chartPlane);

            var chartMarginPlane = BABYLON.MeshBuilder.CreatePlane("chartMarginPlane", {width: this.planeWidth+400, height: this.planeHeight+300}, this.scene);
            chartMarginPlane.position.x = (this.elementWidth+this.padding)*this.seriesLength/2 + this.padding/2;
            chartMarginPlane.position.y = this.planeHeight/2;
            this.myPlanes.push(chartMarginPlane);
        }

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
                -7 - (index % 2) * textScale*2,
                -1.75);
            this.myTexts.push(text);
        });

        let titleText = this.gui3D.create3DText(this.scene, 6, this.titleDepth, this.options.chart.title, this.planeWidth / 2 / 6, this.planeHeight / 6 + 6 / 2, -1.75);
        this.myTexts.push(titleText);
        // titleText.getMesh().setPivotPoint(titleText.getMesh().getBoundingInfo().boundingBox.centerWorld, BABYLON.Space.WORLD);
        // console.log(titleText.getMesh().getBoundingInfo().boundingBox.center);

        this.stackedHeight = []

        for (let elementIndex = 0; elementIndex < this.seriesLength; elementIndex++) {
            this.stackedHeight[elementIndex] = 0;
            for (let seriesIndex = 0; seriesIndex < this.seriesCount; seriesIndex++) {
                
                this.addBar(elementIndex, seriesIndex, this.stackedHeight[elementIndex]);
                // stackedHeight[elementIndex] += this.options.data[this.seriesNames[seriesIndex]][elementIndex].value;
            }
        }
    }

}

//////////////////////////////////////////////////

class BarChart3D extends BaseChart {

    constructor(options) {
        super(options);
        console.log('options:', options);

        this.padding = 10;

        this.myBars = [];
        this.myScales = [];
        this.myLabels = [];
        this.myTexts = [];
        this.myPlanes = [];

        this.labelScale = 3;

        if (this.options.chart.textDepth) {
            this.textDepth = this.options.chart.textDepth;
        } else {
            this.textDepth = .01;
        }

        this.parseData();

        this.scaleInfo = calculateScale(this.highVal);

        this.elementWidth = Math.trunc(500 / this.seriesLength) - this.padding;
        // this.barWidth = (this.elementWidth) / this.seriesCount;
        this.barWidth = this.elementWidth;

        this.planeWidth = (this.elementWidth + this.padding) * this.seriesLength + this.padding;
        this.planeHeight = 300;

        this.scene.activeCamera.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2
        this.options.chart.planeWidth = this.planeWidth;
        this.options.chart.planeHeight = this.planeHeight;

        this.titleDepth = this.options.chart.titleDepth ? this.options.chart.titleDepth : 1;

        this.build(options);
    }

    addScale(yPosition, label, textScale) {
        let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {
            height: 1,
            width: this.options.chart.planeWidth,
            depth: 1.2
        }, this.scene);

        myBox.material = this.lineMat;
        myBox.position.x = this.options.chart.planeWidth / 2;
        myBox.position.y = yPosition;
        myBox.position.z = 0;

        // let leftScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, -6, yPosition / textScale - textScale / 3, -5);
        // let rightScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, this.planeWidth / textScale + 6, yPosition / textScale - textScale / 3, -5);
        let leftScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, -6, yPosition/textScale -textScale/3, -1.75);
        let rightScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, this.planeWidth / textScale + 6, yPosition / textScale, -1.75);

        this.myScales.push(myBox)
        this.myTexts.push(leftScale);
        this.myTexts.push(rightScale);

    }

    getElementsAcrossSeries(){

    }

    destroy() {
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

    // addActions(obj, actionOptions) {
    //     obj.actionManager = new BABYLON.ActionManager(this.scene);

    //     Object.keys(actionOptions).forEach(key => {
    //         obj.actionManager.registerAction(
    //             new BABYLON.ExecuteCodeAction(
    //                 BABYLON.ActionManager[key],
    //                 actionOptions[key]
    //             ));
    //     });
    // }


    addBar(elementIndex, seriesIndex){

        let element = this.options.data[this.seriesNames[seriesIndex]][elementIndex];

        // console.log('element',element)

        let bar;
        let barHeight = this.options.chart.planeHeight * (element.value / this.scaleInfo.maxScale);

        // console.log('this.options.planeHeight',this.options.chart.planeHeight);

        // // create the bar
        if (this.options.chart.round) {
            bar = BABYLON.MeshBuilder.CreateCylinder(this.seriesNames[seriesIndex] + '-' + element.label, {
                height: barHeight,
                diameter: this.barWidth
            }, this.scene);
        } else {
            bar = BABYLON.MeshBuilder.CreateBox(this.seriesNames[seriesIndex] + '-' + element.label, {
                height: barHeight,
                width: this.barWidth,
                depth: this.barWidth
            }, this.scene);
        }

        if (this.seriesCount > 1) {
            bar.material = this.materials[seriesIndex + 1];
        } else {
            bar.material = this.materials[elementIndex + 1];
        }

        // bar.position.x = elementIndex * (this.elementWidth + this.padding) + seriesIndex * this.elementWidth / this.seriesCount + this.barWidth / 2 + this.padding;
        bar.position.x = elementIndex * (this.elementWidth + this.padding) + this.barWidth / 2 + this.padding;
        bar.position.y = barHeight / 2;
        bar.position.z = seriesIndex * (this.elementWidth + this.padding);

        bar.userData = element;
        bar.userData.seriesName = this.seriesNames[seriesIndex];

        // Add actions to bar
        var actionsObject = {
            OnLeftPickTrigger: () => {
                console.log('left clicked ' + bar.name)
            },
            OnRightPickTrigger: () => {
                console.log(bar);
                console.log(this.scene.pointerX);
                console.log(this.scene.pointerY);
                
                this.gui2D.menuObjectOptions(bar, this.scene.pointerX, this.scene.pointerY)
            },
            OnPointerOverTrigger: () => {
                bar.material.emissiveColor = new BABYLON.Color3(.1, .1, .1)
            },
            OnPointerOutTrigger: () => {
                bar.material.emissiveColor = new BABYLON.Color3(0, 0, 0)
            }
        }

        this.addActions(bar, actionsObject);

        this.myBars.push(bar);
    }

    build(barChartOptionsxx) {
        // console.log('barChartOptions: ', barChartOptionsxx);

        if (this.options.chart.showBackplanes){
            var chartPlane = BABYLON.MeshBuilder.CreatePlane("chartPlane", {
                width: this.planeWidth,
                height: this.planeHeight
            }, this.scene);

            chartPlane.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2;
            chartPlane.position.y = this.planeHeight / 2;
            this.myPlanes.push(chartPlane);

            var chartMarginPlane = BABYLON.MeshBuilder.CreatePlane("chartMarginPlane", {
                width: this.planeWidth+400, 
                height: this.planeHeight+300
            }, this.scene);

            chartMarginPlane.position.x = (this.elementWidth+this.padding)*this.seriesLength/2 + this.padding/2;
            chartMarginPlane.position.y = this.planeHeight/2;
            this.myPlanes.push(chartMarginPlane);
        }

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
                -7 - (index % 2) * textScale*2,
                -1.75);
            this.myTexts.push(text);
        });

        let titleText = this.gui3D.create3DText(this.scene, 6, this.titleDepth, this.options.chart.title, this.planeWidth / 2 / 6, this.planeHeight / 6 + 6 / 2, -1.75);
        this.myTexts.push(titleText);
        // titleText.getMesh().setPivotPoint(titleText.getMesh().getBoundingInfo().boundingBox.centerWorld, BABYLON.Space.WORLD);
        // console.log(titleText.getMesh().getBoundingInfo().boundingBox.center);

        for (let elementIndex = 0; elementIndex < this.seriesLength; elementIndex++) {
            for (let seriesIndex = 0; seriesIndex < this.seriesCount; seriesIndex++) {
                
                this.addBar(elementIndex, seriesIndex);
            }
        }
    }

}

//////////////////////////////////////////////////

class PieChart extends BaseChart {

    constructor(options) {
        super(options);
        
        this.mySlices = [];
        this.myScales = [];
        this.myLabels = [];
        this.myTexts = [];
        this.myPlanes = [];

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

        // // basic settings for a cylinder
        // var settings = {
        //     diameter: 500,
        //     thickness: 50,
        //     tessellation: 40,
        //     arc: options.percent, // update size of slice % [0..1]
        //     sideOrientation: BABYLON.Mesh.DOUBLESIDE,
        //     updatable: true
        // };

        // create the slice pieces
        var slice1 = BABYLON.MeshBuilder.CreateCylinder(options.name, settings, options.graph);
        // var slice1 = BABYLON.MeshBuilder.CreateTorus(options.name, settings, options.graph);
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

        // build the slice
        var slice = BABYLON.Mesh.MergeMeshes([slice1, myPlane1, myPlane2]);

        // var slice = slice1; 
        slice.material = options.mat;
        slice.rotation.y = options.startRotation; // rotation location in pie
        // slice.visibility = .75;
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

        this.mySlices.push(slice);

        return slice;
    } //  end addPieSlice method

    build() {
        let titleText = this.gui3D.create3DText(this.scene, 6, this.options.chart.titleDepth, this.options.chart.title, 0, 20, -.2);
        this.myTexts.push(titleText);

        let max_label_size = 0;
        let total_value = 0;
        // let largestValue = Number.MIN_SAFE_INTEGER;
        // let smallestValue = Number.MAX_SAFE_INTEGER;

        this.options.data.Series0.forEach(element => {
            total_value += element.value;
            // if (element.value > largestValue) {
            //     largestValue = element.value
            // }
            // if (element.value < smallestValue) {
            //     smallestValue = element.value
            // }
            max_label_size = element.label.length > max_label_size ? element.label.length : max_label_size;
        });

        let me = this;
        let start_angle = 0;
        this.options.data.Series0.forEach((element, index) => {
            let slice_angle = 2 * Math.PI * element.value / total_value;
            let slice = this.addPieSlice({
                graph: this.scene,
                percent: element.value / total_value,
                startRotation: start_angle,
                mat: me.materials[index + 1],
                name: element.label,
                value: element.value
            });

            start_angle += slice_angle;
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

let dataSeries = {};

for (let seriesCount = 0; seriesCount < 3; seriesCount++) {
    dataSeries['Series' + seriesCount] = [];
    for (let dataPoints = 1; dataPoints <= 20; dataPoints++) {

        let data = {
            // label: months[dataPoints].long,
            label: 'Label'+ dataPoints,
            value: 20 + 75 * (Math.abs(6 - dataPoints / (seriesCount + 1) + 2 + 3 * Math.sin(seriesCount * dataPoints))),
            details: {
                detail1: dataPoints,
                detail2: dataPoints * dataPoints,
                detail3: 1 / dataPoints
            }
        };
        dataSeries['Series' + seriesCount].push(data);
    }
}


let barChart1 = new BarChart({

    scene: {
        id: 'bar1',         // required - id of canvas element to use
        width: 600,                 //  <default 300>
        height: 350,                //  <default 200>
        cameraFirstPerson: true,    //  <default true>
        backgroundColor: {          //  <default white>
            r: 1,
            g: 1,
            b: 1
        },    
    },

    chart: {
        title: 'Monthly Report', 
        titleDepth: .01,            //  < default .01 >

        round: false,               //  < default false >          
        depth: 10.5,                //  < default .25 >          
        alpha: 1,                  //  < default 1 >
        
        textDepth: .05,             //  < default .01 >
        textColor: {                //  < default black >
            r: 0,
            g: 0,
            b: 0
        },
        showBackplanes: false
    
    },

    data: dataSeries // required - array of data objects     { label: "July", value: 100 }




// id: 'bar2', // required - id of canvas element to use
// reportTitle: 'Monthly Report', // Added


///////////////////////
// optional settings //
///////////////////////

// width: 600, // <default 300>
// height: 350, // <default 200>
// shadows: true, // <default false>
// round: false, // <default false>        // Added
// depth: 10.5, // <default .25 >            // Added
// textDepth: .01,
// titleDepth: .01,
// textColor: {
//     r: 0,
//     g: 0,
//     b: 0
// }, // Added

// alpha: 1, // Added
// showScale: true,
// backgroundColor: { // added
//     r: 1,
//     g: 1,
//     b: 1
// },
// logo: 'logo.png',
// label2D: false,
// coloredLabels: false,
// ground: true,
// cameraFirstPerson: true
// backplane: false,
// horizontalLabels: false,
// verticalLabels: true,
// normal: 'normal5.jpg'

});

let barChart2 = new StackedBarChart({

    scene: {
        id: 'bar2',         // required - id of canvas element to use
        width: 600,                 //  <default 300>
        height: 350,                //  <default 200>
        cameraFirstPerson: true,    //  <default true>
        backgroundColor: {          //  <default white>
            r: 1,
            g: 1,
            b: 1
        },    
    },

    chart: {
        title: 'Monthly Report', 
        titleDepth: .01,            //  < default .01 >

        round: false,               //  < default false >          
        depth: 10.5,                //  < default .25 >          
        alpha: .8,                  //  < default 1 >
        
        textDepth: .05,             //  < default .01 >
        textColor: {                //  < default black >
            r: 0,
            g: 0,
            b: 0
        },
        showBackplanes: false
    
    },

    data: dataSeries // required - array of data objects     { label: "July", value: 100 }
});


let barChart3 = new BarChart3D({

    scene: {
        id: 'bar3',         // required - id of canvas element to use
        width: 600,                 //  <default 300>
        height: 350,                //  <default 200>
        cameraFirstPerson: true,    //  <default true>
        backgroundColor: {          //  <default white>
            r: 1,
            g: 1,
            b: 1
        },    
    },

    chart: {
        title: 'Monthly Report', 
        titleDepth: .01,            //  < default .01 >

        round: false,               //  < default false >          
        depth: 10.5,                //  < default .25 >          
        alpha: .7,                  //  < default 1 >
        
        textDepth: .05,             //  < default .01 >
        textColor: {                //  < default black >
            r: 0,
            g: 0,
            b: 0
        },
        showBackplanes: false
    
    },

    data: dataSeries // required - array of data objects     { label: "July", value: 100 }

});


let pieChart = new PieChart({


    scene: {
        id: 'pie',         // required - id of canvas element to use
        width: 600,                 //  <default 300>
        height: 350,                //  <default 200>
        cameraFirstPerson: false,    //  <default true>
        backgroundColor: {          //  <default white>
            r: 1,
            g: 1,
            b: 1
        },    
    },

    chart: {
        title: 'Monthly Report', 
        titleDepth: .01,            //  < default .01 >

        round: false,               //  < default false >          
        depth: 10.5,                //  < default .25 >          
        alpha: 1,                  //  < default 1 >
        
        textDepth: .01,             //  < default .01 >
        textColor: {                //  < default black >
            r: 0,
            g: 0,
            b: 0
        }
    
    },

    data: dataSeries // required - array of data objects     { label: "July", value: 100 }


});


    // id: 'pie', // required - id of canvas element to use
    // data: dataSeries, // required - array of data objects     { label: "July", value: 100 }
    // reportTitle: 'Deloitte', // Added

    // ///////////////////////
    // // optional settings //
    // ///////////////////////

    // width: 600, // <default 300>
    // height: 350, // <default 200>
    // alpha: 1, // Added
    // backgroundColor: { // added
    //     r: 1,
    //     g: 1,
    //     b: 1
    // },
    // titleDepth: .1,
    // textColor: {
    //     r: 0,
    //     g: 1,
    //     b: 0
    // }, // Added
    // // shadows: true,  // <default false>
    // // label2D: false,
    // // tansparent: false,
    // // showScale: false,
    // cameraFirstPerson: false

    // ground color
    // camera distance
    // intro animation

// });