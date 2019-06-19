
class ChartSceneManager { 

    constructor(options) {   // scene options object
        this.options = {
            // defaults
            id: null,
            type: null,
            width: 300,
            height: 200,
            cameraFirstPerson: true,
            backgroundColor: { //  <default white>
                r: 1,
                g: 1,
                b: 1
            }

        }
        
        Object.assign(this.options, options);

        if (this.options.id === null) {
            console.log('ERROR: Scene canvas id not defined!');
            return {error: 'ERROR: Scene canvas id not defined!'};
        }

        // if (this.options.type === null) {
        //     console.log('ERROR: Scene type not defined!');
        //     return {error: 'ERROR: Scene type not defined!'};
        // }

        // Create base scene
        this.scene = this.initializeScene();
        this.gui3D = new Gui3DManager(this.scene, this.objects, options, this);
        this.gui2D = new Gui2DManager(this);


        this.chartsList = [];

        this.hoverPanel = null;

        this.engine.runRenderLoop(() => {

            this.chartsList.forEach(chart => {
                chart.myUpdate();
                // chart.masterTransform.rotation.x +=.01;
                // chart.masterTransform.rotation.y +=.01;
                // chart.masterTransform.rotation.z +=.01;
            })

            this.scene.render();
        });

    }

    initializeScene() {
        // console.log('id',this.options.id);
        this.canvas = document.getElementById(this.options.id);
        // console.log('canvas', this.canvas);
        this.canvas.width = this.options.width ? this.options.width : 300;
        this.canvas.height = this.options.height ? this.options.height : 200;

        this.engine = new BABYLON.Engine(this.canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true
        });

        let scene = new BABYLON.Scene(this.engine);
        // scene.debugLayer.show();

        // let light0 = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, -1), scene);
        // light0.intensity = .55;

        let light1 = new BABYLON.PointLight("light1", new BABYLON.Vector3(1500, 1500, 1500), scene);
        light1.intensity = .9;

        let light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(-1500, -1500, -1500), scene);
        light2.intensity = .9;

        let light3 = new BABYLON.PointLight("light2", new BABYLON.Vector3(1500, 1500, -1500), scene);
        light3.intensity = .9;

        let light4 = new BABYLON.PointLight("light2", new BABYLON.Vector3(-1500, -1500, 1500), scene);
        light4.intensity = .9;

        let camera;

        if (this.options.cameraFirstPerson) {
            camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, 0), scene);
            camera.setTarget(new BABYLON.Vector3(0,0,100));
            //camera.cameraDirection = new BABYLON.Vector3(0, 0, 0);
            //camera.rotation = new BABYLON.Vector3(0, 0, 0);
//            camera.position = new BABYLON.Vector3(254, 150, -550);
            // camera.position = new BABYLON.Vector3(0, 0, 0);

            // if (this.options.ucCameraSpeed) camera.speed = this.options.ucCameraSpeed;
            // if (this.options.ucCameraRotX) camera.rotation.x = this.options.ucCameraRotX;
            // if (this.options.ucCameraRotY) camera.rotation.y = this.options.ucCameraRotY;
            // if (this.options.ucCameraRotZ) camera.rotation.z = this.options.ucCameraRotZ;

            // if (this.options.ucCameraPosX) camera.position.x = this.options.ucCameraPosX;
            // if (this.options.ucCameraPosY) camera.position.y = this.options.ucCameraPosY;
            // if (this.options.ucCameraPosZ) camera.position.z = this.options.ucCameraPosZ;

        } else {
            camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI / 3, 600, new BABYLON.Vector3(0, 0, 0), scene);

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
        } else {
            scene.clearColor = new BABYLON.Color3(1,1,1);
        }

        return scene;
    }

    addChart(options){   //  chart options object

        let chart = null;

        switch (options.type) {
            case 'line':
                chart = new LineChart(this.scene, options, this.gui3D, this.gui2D);
            break;

            case 'bar':
                chart = new BarChart(this.scene, options, this.gui3D, this.gui2D);
            break;

            case 'stacked':
                chart = new StackedBarChart(this.scene, options, this.gui3D, this.gui2D);
            break;

            case '3D':
                chart = new BarChart3D(this.scene, options, this.gui3D, this.gui2D);
            break;

            case 'pie':
                chart = new PieChart(this.scene, options, this.gui3D, this.gui2D);
            break

        
            default:
                console.log('ERROR: Invalid chart type');
            break;
        }

        if (chart != null)
            this.chartsList.push(chart);

        return chart;
    }

    updateChart(options){

    }

    removeChart(id){
        console.log('in removeChart');
        console.log('id:');
        console.log(id);
        console.log('this:');
        console.log(this);

        id.destroySelf();

        for( var i = 0; i < this.chartsList.length; i++){ 
            if ( this.chartsList[i] === id) {
              this.chartsList.splice(i, 1); 
            }
         }
    }

}


class BaseChart { 

    constructor(scene, options, gui3D, gui2D) {

        this.options = {
            type: null,
            title: null,
            data: null,
    
            titleDepth: .01, //  < default .01 >
            doughnut: false,  // applies to pie chart only
    
            round: false, //  < default false >  applies to bar chart only        
            depth: 10.5, //  < default .25 >          
            alpha: 1, //  < default 1 >
    
            textDepth: .01, //  < default .01 >
            textColor: { //  < default black >
                r: 0,
                g: 0,
                b: 0
            },
            transition: false
        };

        Object.assign(this.options, options);

        if (this.options.type === null) {
            console.log('ERROR: Chart type not defined!');
            return {error: 'ERROR: Chart type not defined!'};
        }

        if (this.options.title === null) {
            console.log('ERROR: Chart title not defined!');
            return {error: 'ERROR: Chart title not defined!'};
        }

        if (this.options.data === null) {
            console.log('ERROR: Chart data not defined!');
            return {error: 'ERROR: Chart data not defined!'};
        }

        this.scene = scene;
        this.options = options;
        this.data = options.data;
        this.gui3D = gui3D;
        this.gui2D = gui2D;

        this.mySlices = [];
        this.myBars = [];
        this.myScales = [];
        this.myLabels = [];
        this.myTexts = [];
        this.myPlanes = [];

        // this.masterTransform = new BABYLON.TransformNode("root", this.scene); 
        this.masterTransform = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 10, diameterX: 10}, this.scene);;

        this.materials = [];
        this.createMaterials(this.materials);



        // this.sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 10, diameterX: 10}, this.scene);
        // this.sphere.position.z = 10;
        // this.sphere.material = this.materials[0];


        //console.log(this.materials);

        this.padding = 10;

        this.labelScale = 3.5;

        // Basic line/text material
        this.lineMat = new BABYLON.StandardMaterial("lineMat", this.scene);
        this.lineMat.alpha = 1;
        this.lineMat.specularColor = new BABYLON.Color3(0, 0, 0);
        this.lineMat.emissiveColor = new BABYLON.Color3(0, 0, 0);

        if (this.options.textColor) {
            this.lineMat.diffuseColor = new BABYLON.Color3(this.options.textColor.r, this.options.textColor.g, this.options.textColor.b);
        } else {
            this.lineMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
        }

        if (this.options.textDepth) {
            this.textDepth = this.options.textDepth;
        } else {
            this.textDepth = .01;
        }
    }

    createMaterials(materials) {
        for (let i = 0; i < colorList.length; i++) {
            let mat = new BABYLON.StandardMaterial("mat", this.scene);
            mat.diffuseColor = BABYLON.Color3.FromHexString(colorList[i]);
            mat.specularColor =  BABYLON.Color3.FromHexString(colorList[i]);
            // let tex = new BABYLON.Texture("textures/normal2.jpg", this.scene);	
            // tex.coordinatesMode = 8;
            // mat.bumpTexture = tex;
	
            
            if (this.options.alpha){
                mat.alpha = this.options.alpha;
            } else {
                mat.alpha = 1;
            }

            materials.push(mat);
        }
    }

    updateMaterial(index, color){
        if (index >= this.materials.length || index < 0) { 
            console.log('ERROR: Material index out of range.');
            return;
        } else {
            this.materials[index].diffuseColor.r = color.r;
            this.materials[index].diffuseColor.g = color.g;
            this.materials[index].diffuseColor.b = color.b;
        }
    }


    updateMaterialGradient(startColor, endColor, startIndex, endIndex){  // 0-63

        let length = endIndex - startIndex;
        for (let index = 0; index <= length; index++) {
            let newColor = getColor(startColor, endColor, 0, length, index);     
            // console.log(newColor);       
            this.materials[index+startIndex].diffuseColor.r = newColor.r;
            this.materials[index+startIndex].diffuseColor.g = newColor.g;
            this.materials[index+startIndex].diffuseColor.b = newColor.b;

            // console.log(BABYLON.Color3.from)
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

        // console.log('seriestotals', this.seriesTotals);
        // console.log('largestSeries', this.seriesHighTotal);

        // this.scaleInfo = calculateScale(this.seriesHighTotal);

        // this.elementWidth = Math.trunc(500 / this.seriesLength) - this.padding;
        // this.barWidth = (this.elementWidth) / this.seriesCount;

        // this.planeWidth = (this.elementWidth + this.padding) * this.seriesLength + this.padding;
        // this.planeHeight = 300;
    }

    getElementsAcrossSeries(data, index){

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

    destroySelf(chart) {
        this.mySlices.forEach(element => {
            element.dispose();
        });
        this.mySlices = [];

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

    fadeIn(){
        BABYLON.Animation.CreateAndStartAnimation('zoomin', this.masterTransform, 'scaling', 30, 30, new BABYLON.Vector3(.0001,.0001,.0001), new BABYLON.Vector3(1,1,1),BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        BABYLON.Animation.CreateAndStartAnimation('rotin', this.masterTransform, 'rotation.y', 30, 30, 0, 2*Math.PI,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        BABYLON.Animation.CreateAndStartAnimation('movey', this.masterTransform, 'position.y', 30, 30, -200,0,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        BABYLON.Animation.CreateAndStartAnimation('movez', this.masterTransform, 'position.z', 30, 30, -600,-1000,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    }

    moveMe(start, end, fps, seconds){
        BABYLON.Animation.CreateAndStartAnimation('movez', this.masterTransform, 'position', fps, fps*seconds, start,end,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    }

    scaleMe(start, end, fps, seconds){
        BABYLON.Animation.CreateAndStartAnimation('movez', this.masterTransform, 'scaling', fps, fps*seconds, start,end,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    }

    rotateMeX(start, end, fps, seconds){
        BABYLON.Animation.CreateAndStartAnimation('rotatex', this.masterTransform, 'rotation.x', fps, fps*seconds, start,end,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    }
    
    rotateMeY(start, end, fps, seconds){
        BABYLON.Animation.CreateAndStartAnimation('rotatey', this.masterTransform, 'rotation.y', fps, fps*seconds, start,end,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    }
    
    rotateMeZ(start, end, fps, seconds){
        BABYLON.Animation.CreateAndStartAnimation('rotatez', this.masterTransform, 'rotation.z', fps, fps*seconds, start,end,BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    }
}


class BarChart extends BaseChart {

    constructor(scene, options, gui3D, gui2D) {
        super(scene, options, gui3D, gui2D);
        // console.log('options:', options);

        // this.padding = 10;

        // this.labelScale = 3.5;

        // if (this.options.textDepth) {
        //     this.textDepth = this.options.textDepth;
        // } else {
        //     this.textDepth = .01;
        // }

        // parse the data for min,max,total, etc
        this.parseData();

        // calculate scale max and interval
        this.scaleInfo = calculateScale(this.highVal);

        this.elementWidth = Math.trunc(500 / this.seriesLength) - this.padding;
        this.barWidth = (this.elementWidth) / this.seriesCount;

        this.planeWidth = (this.elementWidth + this.padding) * this.seriesLength + this.padding;
        this.planeHeight = 300;

        // this.scene.activeCamera.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2
        this.options.planeWidth = this.planeWidth;
        this.options.planeHeight = this.planeHeight;

        // this.masterTransform.setAbsolutePosition(new BABYLON.Vector3(this.planeWidth / 2, this.planeHeight / 2, 0));
        // this.masterTransform.position.x = this.planeWidth / 2;
        // this.masterTransform.position.y = this.planeHeight / 2;

        this.masterTransform.position.x = this.planeWidth / 2;
        this.masterTransform.position.y = this.planeHeight/2;

        this.titleDepth = this.options.titleDepth ? this.options.titleDepth : 1;
        // this.masterTransform.position = new BABYLON.Vector3(this.planeWidth / 2, this.planeHeight / 2, 0);
        // this.masterTransform.setPivotMatrix(BABYLON.Matrix.Translation(-this.planeWidth / 2, -this.planeHeight / 2, 0));

        this.build(options);

        // console.log('masterTransform:');
        // console.log(this.masterTransform);
        this.masterTransform.position.x = 0;
        this.masterTransform.position.y = 0;

        
        // this.masterTransform.setAbsolutePosition(new BABYLON.Vector3( 0 ,0 ,0 ));
        // this.fadeIn();
    }

    addScale(yPosition, label, textScale, gui3D) {
        let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {
            height: 1,
            width: this.options.planeWidth,
            depth: 1.2
        }, this.scene);

        myBox.material = this.lineMat;
        myBox.position.x = this.options.planeWidth / 2;
        myBox.position.y = yPosition;
        myBox.position.z = 0;

        // let leftScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, -6, yPosition / textScale - textScale / 3, -5, this.lineMat);
        // let rightScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, this.planeWidth / textScale + 6, yPosition / textScale - textScale / 3, -5, this.lineMat);
        let leftScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, -6, yPosition/textScale -textScale/3, -1.75, this.lineMat);
        let rightScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, this.planeWidth / textScale + 6, yPosition / textScale, -1.75, this.lineMat);

        this.myScales.push(myBox)
        this.myTexts.push(leftScale);
        this.myTexts.push(rightScale);

        myBox.parent = this.masterTransform;
        myBox.position.x -= this.masterTransform.position.x;
        myBox.position.y -= this.masterTransform.position.y;
        myBox.position.z -= this.masterTransform.position.z;


        leftScale.getMesh().parent = this.masterTransform;
        leftScale.getMesh().position.x -= this.masterTransform.position.x;
        leftScale.getMesh().position.y -= this.masterTransform.position.y;
        leftScale.getMesh().position.z -= this.masterTransform.position.z;


        rightScale.getMesh().parent = this.masterTransform;
        rightScale.getMesh().position.x -= this.masterTransform.position.x;
        rightScale.getMesh().position.y -= this.masterTransform.position.y;
        rightScale.getMesh().position.z -= this.masterTransform.position.z;

    }

    addBar(elementIndex, seriesIndex){

        let element = this.options.data[this.seriesNames[seriesIndex]][elementIndex];

        // console.log('element',element)

        let bar;
        let barHeight = this.options.planeHeight * (element.value / this.scaleInfo.maxScale);

        // console.log('this.options.planeHeight',this.options.planeHeight);

        // // create the bar
        if (this.options.round) {
            bar = BABYLON.MeshBuilder.CreateCylinder(this.seriesNames[seriesIndex] + '-' + element.label, {
                height: barHeight,
                diameter: this.barWidth
            }, this.scene);
        } else {
            bar = BABYLON.MeshBuilder.CreateBox(this.seriesNames[seriesIndex] + '-' + element.label, {
                height: barHeight,
                width: this.barWidth,
                depth: this.options.depth ? this.options.depth : 10
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
        bar.userData.material = this.seriesNames[seriesIndex];

        // Add actions to bar
        var actionsObject = {
            OnLeftPickTrigger: () => {
                console.log('left clicked ' + bar.name)
            },
            OnRightPickTrigger: () => {
                // console.log(bar);
                // console.log(this.scene.pointerX);
                // console.log(this.scene.pointerY);
                
                this.gui2D.menuObjectOptions(bar, this.scene.pointerX, this.scene.pointerY)
            },
            OnPointerOverTrigger: () => {
                // bar.material.emissiveColor = new BABYLON.Color3(.1, .1, .1);
                this.hoverPanel = this.gui2D.showObjectValue(bar, this.scene.pointerX, this.scene.pointerY);
                // console.log('mouseOver', bar);

            },
            OnPointerOutTrigger: () => {
                // bar.material.emissiveColor = new BABYLON.Color3(0, 0, 0)
                // console.log('mouseOut');

                // panelContainer.onPointerOutObservable.add(()=>{this.advancedTexture.removeControl( this.parentThis.hoverPanel)});
                this.gui2D.advancedTexture.removeControl( this.hoverPanel);
            }
        }

        this.addActions(bar, actionsObject);

        this.myBars.push(bar);

        return bar;
    }

    build(barChartOptionsxx) {
        // console.log('barChartOptions: ', barChartOptionsxx);

        if (this.options.showBackplanes){
            var chartPlane = BABYLON.MeshBuilder.CreatePlane("chartPlane", {
                width: this.planeWidth,
                height: this.planeHeight
            }, this.scene);

            chartPlane.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2;
            chartPlane.position.y = this.planeHeight / 2;

            chartPlane.parent = this.masterTransform;
            chartPlane.position.x -= this.masterTransform.position.x;
            chartPlane.position.y -= this.masterTransform.position.y;
            chartPlane.position.z -= this.masterTransform.position.z;

            this.myPlanes.push(chartPlane);

            var chartMarginPlane = BABYLON.MeshBuilder.CreatePlane("chartMarginPlane", {
                width: this.planeWidth+400, 
                height: this.planeHeight+300
            }, this.scene);

            chartMarginPlane.position.x = (this.elementWidth+this.padding)*this.seriesLength/2 + this.padding/2;
            chartMarginPlane.position.y = this.planeHeight/2;

            chartMarginPlane.parent = this.masterTransform;
            chartMarginPlane.position.x -= this.masterTransform.position.x;
            chartMarginPlane.position.y -= this.masterTransform.position.y;
            chartMarginPlane.position.z -= this.masterTransform.position.z;

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

            myBox.parent = this.masterTransform;
            myBox.position.x -= this.masterTransform.position.x;
            myBox.position.y -= this.masterTransform.position.y;
            myBox.position.z -= this.masterTransform.position.z;
        }

        // add scales
        for (let index = 0; index <= this.scaleInfo.maxScale; index += this.scaleInfo.interval) {
            this.addScale(index * (this.planeHeight) / (this.scaleInfo.maxScale), index.toString(), this.labelScale, this.gui3D);
        }

        let textScale = this.labelScale;

        this.options.data[this.seriesNames[0]].forEach((element, index) => {
            // console.log(element);
            let text = this.gui3D.create3DText(this.scene, textScale, this.textDepth, element.label,
                index * this.planeWidth / this.seriesLength / textScale + this.planeWidth / this.seriesLength / textScale / 2,
                -7 - (index % 2) * textScale*2,
                -1.75,
                this.lineMat);
            this.myTexts.push(text);
            text.getMesh().parent = this.masterTransform;
            text.getMesh().position.x -= this.masterTransform.position.x;
            text.getMesh().position.y -= this.masterTransform.position.y;
            text.getMesh().position.z -= this.masterTransform.position.z;
            
        });

        let titleText = this.gui3D.create3DText(this.scene, 6, this.titleDepth, this.options.title, this.planeWidth / 2 / 6, this.planeHeight / 6 + 6 / 2, -1.75, this.lineMat);
        this.myTexts.push(titleText);
        // titleText.getMesh().setPivotPoint(titleText.getMesh().getBoundingInfo().boundingBox.centerWorld, BABYLON.Space.WORLD);
        // console.log(titleText.getMesh().getBoundingInfo().boundingBox.center);
        titleText.getMesh().parent = this.masterTransform;
        titleText.getMesh().position.x -= this.masterTransform.position.x;
        titleText.getMesh().position.y -= this.masterTransform.position.y;
        titleText.getMesh().position.z -= this.masterTransform.position.z;


        for (let elementIndex = 0; elementIndex < this.seriesLength; elementIndex++) {
            for (let seriesIndex = 0; seriesIndex < this.seriesCount; seriesIndex++) {
                
                let bar = this.addBar(elementIndex, seriesIndex);
                bar.parent = this.masterTransform;
                bar.position.x -= this.masterTransform.position.x;
                bar.position.y -= this.masterTransform.position.y;
                bar.position.z -= this.masterTransform.position.z;

            }
        }
    }

    myUpdate(){
        // this.masterTransform.rotation.x +=.01;
        // this.masterTransform.rotation.y +=.01;
        // this.masterTransform.rotation.z +=.01;
    }

}


class StackedBarChart extends BaseChart {

    constructor(scene, options, gui3D, gui2D) {
        super(scene, options, gui3D, gui2D);
        // console.log('options:', options);

        // this.padding = 10;

        // this.labelScale = 3.5;

        // if (this.options.textDepth) {
        //     this.textDepth = this.options.textDepth;
        // } else {
        //     this.textDepth = .01;
        // }

        this.parseData();

        this.scaleInfo = calculateScale(this.seriesHighTotal);

        this.elementWidth = Math.trunc(500 / this.seriesLength) - this.padding;
        // this.barWidth = (this.elementWidth) / this.seriesCount;
        this.barWidth = this.elementWidth;

        this.planeWidth = (this.elementWidth + this.padding) * this.seriesLength + this.padding;
        this.planeHeight = 300;

        this.scene.activeCamera.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2
        this.options.planeWidth = this.planeWidth;
        this.options.planeHeight = this.planeHeight;

        this.titleDepth = this.options.titleDepth ? this.options.titleDepth : 1;


        this.masterTransform.position.x = this.planeWidth / 2;
        this.masterTransform.position.y = this.planeHeight / 2;

        // this.masterTransform.setPivotMatrix(BABYLON.Matrix.Translation(-this.planeWidth / 2, -this.planeHeight / 2, 0));

        this.build(options);

    }

    addScale(yPosition, label, textScale, gui3D) {
        let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {
            height: 1,
            width: this.options.planeWidth,
            depth: 1.2
        }, this.scene);

        myBox.material = this.lineMat;
        myBox.position.x = this.options.planeWidth / 2;
        myBox.position.y = yPosition;
        myBox.position.z = 0;

        // let leftScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, -6, yPosition / textScale - textScale / 3, -5);
        // let rightScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, this.planeWidth / textScale + 6, yPosition / textScale - textScale / 3, -5);
        let leftScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, -6, yPosition/textScale -textScale/3, -1.75, this.lineMat);
        let rightScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, this.planeWidth / textScale + 6, yPosition / textScale, -1.75, this.lineMat);

        this.myScales.push(myBox)
        this.myTexts.push(leftScale);
        this.myTexts.push(rightScale);

        myBox.parent = this.masterTransform;
        myBox.position.x -= this.masterTransform.position.x;
        myBox.position.y -= this.masterTransform.position.y;
        myBox.position.z -= this.masterTransform.position.z;


        leftScale.getMesh().parent = this.masterTransform;
        leftScale.getMesh().position.x -= this.masterTransform.position.x;
        leftScale.getMesh().position.y -= this.masterTransform.position.y;
        leftScale.getMesh().position.z -= this.masterTransform.position.z;


        rightScale.getMesh().parent = this.masterTransform;
        rightScale.getMesh().position.x -= this.masterTransform.position.x;
        rightScale.getMesh().position.y -= this.masterTransform.position.y;
        rightScale.getMesh().position.z -= this.masterTransform.position.z;
    }

    addBar(elementIndex, seriesIndex, seriesOffset){

        let element = this.options.data[this.seriesNames[seriesIndex]][elementIndex];

        // console.log('element',element)

        let bar;
        let barHeight = this.options.planeHeight * (element.value / this.scaleInfo.maxScale);

        // console.log('this.options.planeHeight',this.options.planeHeight);

        // // create the bar
        if (this.options.round) {
            bar = BABYLON.MeshBuilder.CreateCylinder(this.seriesNames[seriesIndex] + '-' + element.label, {
                height: barHeight,
                diameter: this.barWidth
            }, this.scene);
        } else {
            bar = BABYLON.MeshBuilder.CreateBox(this.seriesNames[seriesIndex] + '-' + element.label, {
                height: barHeight,
                width: this.barWidth,
                depth: this.options.depth ? this.options.depth : 10
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
        bar.userData.material = this.seriesNames[seriesIndex];

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
                // bar.material.emissiveColor = new BABYLON.Color3(.1, .1, .1)
                this.hoverPanel = this.gui2D.showObjectValue(bar, this.scene.pointerX, this.scene.pointerY);
            },
            OnPointerOutTrigger: () => {
                // bar.material.emissiveColor = new BABYLON.Color3(0, 0, 0)
                this.gui2D.advancedTexture.removeControl( this.hoverPanel);
            }
        }

        this.addActions(bar, actionsObject);

        this.myBars.push(bar);

        return bar;
    }

    build(barChartOptionsxx) {
        // console.log('barChartOptions: ', barChartOptionsxx);

        if (this.options.showBackplanes){
            // var chartPlane = BABYLON.MeshBuilder.CreatePlane("chartPlane", {
            //     width: this.planeWidth,
            //     height: this.planeHeight
            // }, this.scene);

            // chartPlane.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2;
            // chartPlane.position.y = this.planeHeight / 2;
            // this.myPlanes.push(chartPlane);

            var chartMarginPlane = BABYLON.MeshBuilder.CreatePlane("chartMarginPlane", {width: this.planeWidth+400, height: this.planeHeight+300}, this.scene);
            chartMarginPlane.position.x = (this.elementWidth+this.padding)*this.seriesLength/2 + this.padding/2;
            chartMarginPlane.position.y = this.planeHeight/2;
            chartMarginPlane.material = this.materials[0];
            chartMarginPlane.position.z = .25;

            chartMarginPlane.parent = this.masterTransform;
            chartMarginPlane.position.x -= this.masterTransform.position.x;
            chartMarginPlane.position.y -= this.masterTransform.position.y;
            chartMarginPlane.position.z -= this.masterTransform.position.z;

            this.myPlanes.push(chartMarginPlane);

            // chartMarginPlane.position.x = (this.elementWidth+this.padding)*this.seriesLength/2 + this.padding/2;
            // chartMarginPlane.position.y = this.planeHeight/2;
            // this.myPlanes.push(chartMarginPlane);
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

            myBox.parent = this.masterTransform;
            myBox.position.x -= this.masterTransform.position.x;
            myBox.position.y -= this.masterTransform.position.y;
            myBox.position.z -= this.masterTransform.position.z;
        }

        // add scales
        for (let index = 0; index <= this.scaleInfo.maxScale; index += this.scaleInfo.interval) {
            this.addScale(index * (this.planeHeight) / (this.scaleInfo.maxScale), index.toString(), this.labelScale, this.gui3D);
        }

        let textScale = this.labelScale;

        this.options.data[this.seriesNames[0]].forEach((element, index) => {
            // console.log(element);
            let text = this.gui3D.create3DText(this.scene, textScale, this.textDepth, element.label,
                index * this.planeWidth / this.seriesLength / textScale + this.planeWidth / this.seriesLength / textScale / 2,
                -7 - (index % 2) * textScale*2,
                -1.75, 
                this.lineMat);
            this.myTexts.push(text);
            text.getMesh().parent = this.masterTransform;
            text.getMesh().position.x -= this.masterTransform.position.x;
            text.getMesh().position.y -= this.masterTransform.position.y;
            text.getMesh().position.z -= this.masterTransform.position.z;

        });

        let titleText = this.gui3D.create3DText(this.scene, 6, this.titleDepth, this.options.title, this.planeWidth / 2 / 6, this.planeHeight / 6 + 6 / 2, -1.75, this.lineMat);
        this.myTexts.push(titleText);
        // titleText.getMesh().setPivotPoint(titleText.getMesh().getBoundingInfo().boundingBox.centerWorld, BABYLON.Space.WORLD);
        // console.log(titleText.getMesh().getBoundingInfo().boundingBox.center);
        titleText.getMesh().parent = this.masterTransform;
        titleText.getMesh().position.x -= this.masterTransform.position.x;
        titleText.getMesh().position.y -= this.masterTransform.position.y;
        titleText.getMesh().position.z -= this.masterTransform.position.z;

        this.stackedHeight = []

        for (let elementIndex = 0; elementIndex < this.seriesLength; elementIndex++) {
            this.stackedHeight[elementIndex] = 0;
            for (let seriesIndex = 0; seriesIndex < this.seriesCount; seriesIndex++) {
                
                let bar = this.addBar(elementIndex, seriesIndex, this.stackedHeight[elementIndex]);
                // stackedHeight[elementIndex] += this.options.data[this.seriesNames[seriesIndex]][elementIndex].value;
                bar.parent = this.masterTransform;
                bar.position.x -= this.masterTransform.position.x;
                bar.position.y -= this.masterTransform.position.y;
                bar.position.z -= this.masterTransform.position.z;
            }
        }
    }

    myUpdate(){
        // this.masterTransform.rotation.x +=.01;
        // this.masterTransform.rotation.y +=.01;
        // this.masterTransform.rotation.z +=.01;
    }   

}


class BarChart3D extends BaseChart {

    constructor(scene, options, gui3D, gui2D) {
        super(scene, options, gui3D, gui2D);
        // console.log('options:', options);

        // this.padding = 10;

        // this.labelScale = 3.5;

        // if (this.options.textDepth) {
        //     this.textDepth = this.options.textDepth;
        // } else {
        //     this.textDepth = .01;
        // }

        this.parseData();

        this.scaleInfo = calculateScale(this.highVal);

        this.elementWidth = Math.trunc(500 / this.seriesLength) - this.padding;
        // this.barWidth = (this.elementWidth) / this.seriesCount;
        this.barWidth = this.elementWidth;

        this.planeWidth = (this.elementWidth + this.padding) * this.seriesLength + this.padding;
        this.planeHeight = 300;

        // this.scene.activeCamera.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2
        this.options.planeWidth = this.planeWidth;
        this.options.planeHeight = this.planeHeight;

        this.titleDepth = this.options.titleDepth ? this.options.titleDepth : 1;
        this.masterTransform.setPivotMatrix(BABYLON.Matrix.Translation(-this.planeWidth / 2, -this.planeHeight / 2, 0));

        this.build(options);

        this.masterTransform.position.x = -this.planeWidth / 2;
        this.masterTransform.position.y = -this.planeHeight / 2;
    }

    addScale(yPosition, label, textScale, gui3D) {
        let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {
            height: 1,
            width: this.options.planeWidth,
            depth: 1.2
        }, this.scene);

        myBox.material = this.lineMat;
        myBox.position.x = this.options.planeWidth / 2;
        myBox.position.y = yPosition;
        myBox.position.z = 0;

        // let leftScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, -6, yPosition / textScale - textScale / 3, -5);
        // let rightScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, this.planeWidth / textScale + 6, yPosition / textScale - textScale / 3, -5);
        let leftScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, -6, yPosition/textScale -textScale/3, -1.75, this.lineMat);
        let rightScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, this.planeWidth / textScale + 6, yPosition / textScale, -1.75, this.lineMat);

        this.myScales.push(myBox)
        this.myTexts.push(leftScale);
        this.myTexts.push(rightScale);

        myBox.parent = this.masterTransform;
        leftScale.getMesh().parent = this.masterTransform;
        rightScale.getMesh().parent = this.masterTransform;
        
    }

    addBar(elementIndex, seriesIndex){

        let element = this.options.data[this.seriesNames[seriesIndex]][elementIndex];

        // console.log('element',element)

        let bar;
        let barHeight = this.options.planeHeight * (element.value / this.scaleInfo.maxScale);

        // console.log('this.options.planeHeight',this.options.planeHeight);

        // // create the bar
        if (this.options.round) {
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
        bar.userData.material = this.seriesNames[seriesIndex];

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
                this.hoverPanel = this.gui2D.showObjectValue(bar, this.scene.pointerX, this.scene.pointerY);
            },
            OnPointerOutTrigger: () => {
                bar.material.emissiveColor = new BABYLON.Color3(0, 0, 0)
                this.gui2D.advancedTexture.removeControl( this.hoverPanel);
            }
        }

        this.addActions(bar, actionsObject);

        this.myBars.push(bar);

        return bar;
    }

    build(barChartOptionsxx) {
        // console.log('barChartOptions: ', barChartOptionsxx);

        if (this.options.showBackplanes){
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

            myBox.parent = this.masterTransform;
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
            text.getMesh().parent = this.masterTransform;

        });

        let titleText = this.gui3D.create3DText(this.scene, 6, this.titleDepth, this.options.title, this.planeWidth / 2 / 6, this.planeHeight / 6 + 6 / 2, -1.75, this.lineMat);
        this.myTexts.push(titleText);
        // titleText.getMesh().setPivotPoint(titleText.getMesh().getBoundingInfo().boundingBox.centerWorld, BABYLON.Space.WORLD);
        // console.log(titleText.getMesh().getBoundingInfo().boundingBox.center);
        titleText.getMesh().parent = this.masterTransform;

        for (let elementIndex = 0; elementIndex < this.seriesLength; elementIndex++) {
            for (let seriesIndex = 0; seriesIndex < this.seriesCount; seriesIndex++) {
                
                let bar = this.addBar(elementIndex, seriesIndex);
                bar.parent = this.masterTransform;
            }
        }
    }

    myUpdate(){
        this.masterTransform.rotation.x +=.0051;
        this.masterTransform.rotation.y -=.0051;
        this.masterTransform.rotation.z +=.0051;
    }
}


class LineChart extends BaseChart {

    constructor(scene, options, gui3D, gui2D) {
        super(scene, options, gui3D, gui2D);
        // console.log('options:', options);

        // this.padding = 10;

        // this.labelScale = 3.5;

        // if (this.options.textDepth) {
        //     this.textDepth = this.options.textDepth;
        // } else {
        //     this.textDepth = .01;
        // }

        this.parseData();

        this.scaleInfo = calculateScale(this.highVal);

        this.elementWidth = Math.trunc(500 / this.seriesLength) - this.padding;
        // this.barWidth = (this.elementWidth) / this.seriesCount;
        this.barWidth = this.elementWidth;

        this.planeWidth = (this.elementWidth + this.padding) * this.seriesLength + this.padding;
        this.planeHeight = 300;

        // this.scene.activeCamera.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2
        this.options.planeWidth = this.planeWidth;
        this.options.planeHeight = this.planeHeight;

        this.titleDepth = this.options.titleDepth ? this.options.titleDepth : 1;

        this.masterTransform.position.x = this.planeWidth / 2;
        this.masterTransform.position.y = this.planeHeight / 2;

        this.build(options);

    }

    addScale(yPosition, label, textScale, gui3D) {
        let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {
            height: 1,
            width: this.options.planeWidth,
            depth: 1.2
        }, this.scene);

        myBox.material = this.lineMat;
        myBox.position.x = this.options.planeWidth / 2;
        myBox.position.y = yPosition;
        myBox.position.z = 0;

        // let leftScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, -6, yPosition / textScale - textScale / 3, -5);
        // let rightScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, this.planeWidth / textScale + 6, yPosition / textScale - textScale / 3, -5);
        let leftScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, -6, yPosition/textScale -textScale/3, -1.75, this.lineMat);
        let rightScale = this.gui3D.create3DText(this.scene, textScale, this.textDepth, label, this.planeWidth / textScale + 6, yPosition / textScale, -1.75, this.lineMat);

        this.myScales.push(myBox)
        this.myTexts.push(leftScale);
        this.myTexts.push(rightScale);

        myBox.parent = this.masterTransform;
        myBox.position.x -= this.masterTransform.position.x;
        myBox.position.y -= this.masterTransform.position.y;
        myBox.position.z -= this.masterTransform.position.z;


        leftScale.getMesh().parent = this.masterTransform;
        leftScale.getMesh().position.x -= this.masterTransform.position.x;
        leftScale.getMesh().position.y -= this.masterTransform.position.y;
        leftScale.getMesh().position.z -= this.masterTransform.position.z;


        rightScale.getMesh().parent = this.masterTransform;
        rightScale.getMesh().position.x -= this.masterTransform.position.x;
        rightScale.getMesh().position.y -= this.masterTransform.position.y;
        rightScale.getMesh().position.z -= this.masterTransform.position.z;
        
    }

    addPoint(elementIndex, seriesIndex, tubePath){

        let element = this.options.data[this.seriesNames[seriesIndex]][elementIndex];

        // console.log('element',element)

        let point;
        let pointHeight = this.options.planeHeight * (element.value / this.scaleInfo.maxScale);

        // console.log('this.options.planeHeight',this.options.planeHeight);

        // // create the bar
        point = BABYLON.MeshBuilder.CreateSphere("mySphere", {diameter: 7}, this.scene);

        if (this.seriesCount > 1) {
            point.material = this.materials[seriesIndex + 1];
        } else {
            point.material = this.materials[elementIndex + 1];
        }

        // point.position.x = elementIndex * (this.elementWidth + this.padding) + seriesIndex * this.elementWidth / this.seriesCount + this.pointWidth / 2 + this.padding;
        point.position.x = elementIndex * (this.elementWidth + this.padding) + this.barWidth / 2 + this.padding;
        point.position.y = pointHeight;
        // point.position.z = seriesIndex * (this.elementWidth + this.padding);

        tubePath.push(point.position);

        point.userData = element;
        point.userData.seriesName = this.seriesNames[seriesIndex];
        point.userData.material = this.seriesNames[seriesIndex];

        // Add actions to point
        var actionsObject = {
            OnLeftPickTrigger: () => {
                console.log('left clicked ' + point.name)
            },
            OnRightPickTrigger: () => {
                // console.log(point);
                // console.log(this.scene.pointerX);
                // console.log(this.scene.pointerY);
                
                this.gui2D.menuObjectOptions(point, this.scene.pointerX, this.scene.pointerY)
            },
            OnPointerOverTrigger: () => {
                // point.material.emissiveColor = new BABYLON.Color3(.1, .1, .1)
                this.hoverPanel = this.gui2D.showObjectValue(point, this.scene.pointerX, this.scene.pointerY);
            },
            OnPointerOutTrigger: () => {
                // point.material.emissiveColor = new BABYLON.Color3(0, 0, 0)
                this.gui2D.advancedTexture.removeControl( this.hoverPanel);
            }
        }

        this.addActions(point, actionsObject);

        this.myBars.push(point);

        return point;
    }

    build(barChartOptionsxx) {
        // console.log('barChartOptions: ', barChartOptionsxx);

        if (this.options.showBackplanes){
            // var chartPlane = BABYLON.MeshBuilder.CreatePlane("chartPlane", {
            //     width: this.planeWidth,
            //     height: this.planeHeight
            // }, this.scene);

            // chartPlane.position.x = (this.elementWidth + this.padding) * this.seriesLength / 2 + this.padding / 2;
            // chartPlane.position.y = this.planeHeight / 2;
            // this.myPlanes.push(chartPlane);

            var chartMarginPlane = BABYLON.MeshBuilder.CreatePlane("chartMarginPlane", {
                width: this.planeWidth+400, 
                height: this.planeHeight+300
            }, this.scene);

            chartMarginPlane.position.x = (this.elementWidth+this.padding)*this.seriesLength/2 + this.padding/2;
            chartMarginPlane.position.y = this.planeHeight/2;
            chartMarginPlane.position.z = .25;

            chartMarginPlane.parent = this.masterTransform;
            chartMarginPlane.position.x -= this.masterTransform.position.x;
            chartMarginPlane.position.y -= this.masterTransform.position.y;
            chartMarginPlane.position.z -= this.masterTransform.position.z;  


            chartMarginPlane.material = this.materials[0];
            this.myPlanes.push(chartMarginPlane);
        }

        // draw vertical lines separating elements
        for (let index = 0; index < this.seriesLength; index++) {
            let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {
                height: 305,
                width: .5,
                depth: .1
            }, this.scene);
            myBox.material = this.lineMat;
            myBox.position.x = index * (this.elementWidth + this.padding) + this.barWidth / 2 + this.padding;
            myBox.position.y = 146;
            myBox.position.z = 0;

            this.myScales.push(myBox);

            myBox.parent = this.masterTransform;
            myBox.position.x -= this.masterTransform.position.x;
            myBox.position.y -= this.masterTransform.position.y;
            myBox.position.z -= this.masterTransform.position.z;
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
                -1.75, 
                this.lineMat);
            this.myTexts.push(text);
            text.getMesh().parent = this.masterTransform;
            text.getMesh().position.x -= this.masterTransform.position.x;
            text.getMesh().position.y -= this.masterTransform.position.y;
            text.getMesh().position.z -= this.masterTransform.position.z;            
        });

        let titleText = this.gui3D.create3DText(this.scene, 6, this.titleDepth, this.options.title, this.planeWidth / 2 / 6, this.planeHeight / 6 + 6 / 2, -1.75, this.lineMat);
        this.myTexts.push(titleText);
        titleText.getMesh().parent = this.masterTransform;
        titleText.getMesh().position.x -= this.masterTransform.position.x;
        titleText.getMesh().position.y -= this.masterTransform.position.y;
        titleText.getMesh().position.z -= this.masterTransform.position.z;

        // titleText.getMesh().setPivotPoint(titleText.getMesh().getBoundingInfo().boundingBox.centerWorld, BABYLON.Space.WORLD);
        // console.log(titleText.getMesh().getBoundingInfo().boundingBox.center);

        for (let seriesIndex = 0; seriesIndex < this.seriesCount; seriesIndex++) {
            let tubePath = [];
        for (let elementIndex = 0; elementIndex < this.seriesLength; elementIndex++) {

                
                let point = this.addPoint(elementIndex, seriesIndex, tubePath);
                point.parent = this.masterTransform;
                point.position.x -= this.masterTransform.position.x;
                point.position.y -= this.masterTransform.position.y;
                point.position.z -= this.masterTransform.position.z;
            }

            for (let index = 0; index < tubePath.length-1; index++) {
                const element = tubePath[index];
                
                let tube = BABYLON.MeshBuilder.CreateTube("tube", {path: [ element, tubePath[index+1] ]}, this.scene);
                tube.parent = this.masterTransform;
                // tube.position.x -= this.masterTransform.position.x;
                // tube.position.y -= this.masterTransform.position.y;
                // tube.position.z -= this.masterTransform.position.z;

                

                if (this.seriesCount > 1) {
                    tube.material = this.materials[seriesIndex + 1];
                } else {
                    tube.material = this.lineMat;
                }
            }
        }
    }

    myUpdate(){
        // this.masterTransform.rotation.x +=.007;
        // this.masterTransform.rotation.y +=.007;
        // this.masterTransform.rotation.z +=.007;
    }
}


class PieChart extends BaseChart {

    constructor(scene, options, gui3D, gui2D) {
        super(scene, options, gui3D, gui2D);

        // console.log(options);

        this.parseData();

        this.build();

        // console.log('this.masterTransform');
        // console.log(this.masterTransform);
        // this.masterTransform.rotation.x = -2*Math.PI;

        // this.fadeIn();
        if (options.transition){
            this.moveMe(new BABYLON.Vector3(-400,0,0), new BABYLON.Vector3(250,-150,350),30,2);
            this.scaleMe(new BABYLON.Vector3(0.00000001,0.00000001,0.00000001), new BABYLON.Vector3(.25,.25,.25),30,2);
            this.rotateMeY( 0,6*Math.PI,30,2);
        }
    }

    addPieSlice(options) {
        // X and Y calculations for offset animation
        let offset = 20;
        let height = 50;
        let medianAngle = options.startRotation + Math.PI * options.percent;
        let offsetX = Math.cos(medianAngle) * offset;
        let offsetZ = -Math.sin(medianAngle) * offset;
        let offsetX2 = Math.cos(medianAngle) * 6;
        let offsetZ2 = -Math.sin(medianAngle) * 6;

        // this.masterTransform.rotation.x = -Math.PI/2;


        // basic settings for a cylinder
        var settings = {
            height: height,
            diameterTop: 500,
            diameterBottom: 500,
            tessellation: 40,
            arc: options.percent, // update size of slice % [0..1]
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        };

        // create the slice pieces and side caps(planes) f
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

        // build the slice
        var slice = BABYLON.Mesh.MergeMeshes([slice1, myPlane1, myPlane2]);

        if (options.doughnut) {
            console.log('options.doughnut true')
            var cylinder = BABYLON.MeshBuilder.CreateCylinder("cone", {height: height + 10, diameter: 250, tessellation: 40, arc: options.percent}, options.graph);

            let csgSlice = BABYLON.CSG.FromMesh(slice);
            let csgCyl = BABYLON.CSG.FromMesh(cylinder );
        
            var subCSG = csgSlice.subtract(csgCyl);
            let newSlice = subCSG.toMesh("csg", options.mat, options.graph);
            // csg.subtractinplace(BABYLON.CSG.FromMesh(BABYLON.MeshBuilder.CreateCylinder("cone", {diameter: 1, tessellation: 4}, options.graph) ));
            slice.dispose();
            cylinder.dispose();
            slice = newSlice;
        }

        slice.material = options.mat;
        slice.rotation.y = options.startRotation; // rotation location in pie
        // slice.visibility = .75;


        slice.userData = options.element;
        slice.userData.seriesName = this.seriesNames[0];
        slice.userData.material = slice.material;

        /////// Add Actions
        var basePosition = slice.position;



        var actionsObject = {
            OnLeftPickTrigger: () => {
                console.log('left clicked ' + slice.name)
            },
            OnRightPickTrigger: () => {
                // console.log(bar);
                // console.log(this.scene.pointerX);
                // console.log(this.scene.pointerY);
                
                this.gui2D.menuObjectOptions(slice, this.scene.pointerX, this.scene.pointerY)
            },
            OnPointerOverTrigger: () => {
                // bar.material.emissiveColor = new BABYLON.Color3(.1, .1, .1);
                this.hoverPanel = this.gui2D.showObjectValue(slice, this.scene.pointerX, this.scene.pointerY);
                // console.log('mouseOver', bar);

            },
            OnPointerOutTrigger: () => {
                // bar.material.emissiveColor = new BABYLON.Color3(0, 0, 0)
                // console.log('mouseOut');

                // panelContainer.onPointerOutObservable.add(()=>{this.advancedTexture.removeControl( this.parentThis.hoverPanel)});
                this.gui2D.advancedTexture.removeControl( this.hoverPanel);
            }
        }

        this.addActions(slice, actionsObject);

        // slice.actionManager = new BABYLON.ActionManager(options.graph);
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
        let titleText = this.gui3D.create3DText(this.scene, 6, this.options.titleDepth, this.options.title, 0, 20, -.2, this.lineMat);
        titleText.getMesh().parent = this.masterTransform;
        console.log(this.options);
        if (this.options.horizontal){
            console.log('horizontal');
            // titleText.getMesh().setPivotPoint(new BABYLON.Vector3(0,0,0));
            titleText.getMesh().rotation.x = 0;
            titleText.getMesh().rotation.y = -Math.PI/2;
            titleText.getMesh().position.x = -420;
            titleText.getMesh().position.y = 0;
        }
        this.myTexts.push(titleText);

        let max_label_size = 0;
        let total_value = 0;
        // let largestValue = Number.MIN_SAFE_INTEGER;
        // let smallestValue = Number.MAX_SAFE_INTEGER;


        let totalValue = 0;

        this.options.data[this.seriesNames[0]].forEach(element => {
            total_value += element.value;
            max_label_size = element.label.length > max_label_size ? element.label.length : max_label_size;
        });

        let me = this;
        let start_angle = 0;


        this.options.data[this.seriesNames[0]].forEach((element,index) => {
                let slice_angle = 2 * Math.PI * element.value / total_value;
                let slice = this.addPieSlice({
                    graph: this.scene,
                    percent: element.value / total_value,
                    startRotation: start_angle,
                    mat: me.materials[index + 1],
                    name: element.label,
                    value: element.value,
                    element: element,
                    doughnut: this.options.doughnut
                });
                slice.parent = this.masterTransform; 


                start_angle += slice_angle;
            });

        // this.masterTransform.rotation.y = -2*Math.PI;
    } //  end build method

    myUpdate(){
        // this.masterTransform.rotation.x +=.01;
        // this.masterTransform.rotation.y +=.01;
        // this.masterTransform.rotation.z +=.01;
    }
} //  end PieChart class
