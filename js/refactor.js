


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
        
        var engine = new BABYLON.Engine(this.canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true
        });
        
        this.scene = this.initializeScene(engine);
        this.scene.activeCamera.attachControl(this.canvas);
        console.log('scene: ',this.scene);
        
        this.createMaterials(this.materials);
        // var glowLayer = new BABYLON.GlowLayer("glowLayer", this.scene);
        //     glowLayer.intensity = .75;

        // console.log(this.materials);

        this.gui3D = new Gui3DManager(this.scene, this.objects, this.options);
        this.gui2D = new Gui2DManager(this);


        this.lineMat = new BABYLON.StandardMaterial("lineMat", this.scene);
        this.lineMat.diffuseColor = new BABYLON.Color3(.2, .2, .2);
        this.lineMat.specularColor = new BABYLON.Color3(0, 0, 0);
        this.lineMat.alpha = 1;
        this.lineMat.emissiveColor = new BABYLON.Color3(.5, .5, .5);

        this.seriesNames = Object.keys(options.data);    
        console.log('seriesNames:',this.seriesNames);

        this.seriesCount = this.seriesNames.length;
        console.log('seriesCount:', this.seriesCount);

        this.seriesLength = options.data[this.seriesNames[0]].length;
        console.log('this.seriesLength:', this.seriesLength);

        this.highVal = Number.MIN_SAFE_INTEGER;
        this.lowVal = Number.MAX_SAFE_INTEGER;
        for (let elementIndex = 0; elementIndex < this.seriesLength; elementIndex++) {
            for (let seriesIndex = 0; seriesIndex < this.seriesCount; seriesIndex++){
                const element = this.options.data[this.seriesNames[seriesIndex]][elementIndex];
    
                if (element.value > this.highVal) this.highVal = element.value;
                if (element.value < this.lowVal) this.lowVal = element.value;
            }
        }


        console.log('high/low:',this.highVal,this.lowVal);

        engine.runRenderLoop(() => {
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

        return scene;
    }

    updateScene(){

    }

    createMaterials(materials){
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



    for(let i = 0; i < colorList.length; i++){
        let mat = new BABYLON.StandardMaterial("mat", this.scene);
        mat.diffuseColor = BABYLON.Color3.FromHexString(colorList[i]);
        mat.specularColor = new BABYLON.Color3(0, 0, 0);
        mat.alpha = 1;

        materials.push(mat);
    }
    }
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////

class BarChart extends BaseChart {

    constructor(options) {
        super(options);
        this.padding = 10;

        console.log('data:', options.data);

        this.elementWidth = Math.trunc(500/this.seriesLength)-this.padding;
        // console.log('elementWidth:', this.elementWidth);

        this.barWidth = (this.elementWidth)/this.seriesCount;
        // console.log('barWidth:', this.barWidth);


        this.planeWidth = (this.elementWidth+this.padding)*this.seriesLength+this.padding;
        this.planeHeight = 300;

        var chartPlane = BABYLON.MeshBuilder.CreatePlane("chartPlane", {width: this.planeWidth, height: this.planeHeight}, this.scene);
        chartPlane.position.x = (this.elementWidth+this.padding)*this.seriesLength/2 + this.padding/2;
        chartPlane.position.y = this.planeHeight/2;

        this.scene.activeCamera.position.x = (this.elementWidth+this.padding)*this.seriesLength/2+this.padding/2
        this.options.planeWidth = this.planeWidth;
        this.options.planeHeight = this.planeHeight;


        var chartMarginPlane = BABYLON.MeshBuilder.CreatePlane("chartMarginPlane", {width: this.planeWidth+200, height: this.planeHeight+100}, this.scene);
        chartMarginPlane.position.x = (this.elementWidth+this.padding)*this.seriesLength/2 + this.padding/2;
        chartMarginPlane.position.y = this.planeHeight/2;

        this.scene.activeCamera.position.x = (this.elementWidth+this.padding)*this.seriesLength/2+this.padding/2
        this.options.planeWidth = this.planeWidth;
        this.options.planeHeight = this.planeHeight;

        
        this.build(options);

        
        // draw vertical lines separating elements
        for (let index = 0; index < this.seriesLength+1; index++) {

            // let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {height: 300, width: 1, depth: .1}, this.scene);
            let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {height: 305, width: 1, depth: .1}, this.scene);
            myBox.material = this.lineMat;
            myBox.position.x = index*(this.elementWidth+this.padding) + this.padding/2;
            myBox.position.y = 146;

        }        
        
        this.addScale(0,'0',5);
        this.addScale(this.planeHeight,this.highVal.toString(),5);

        this.addScale(10*(this.planeHeight)/(this.highVal),'10',5);
        this.addScale(8*(this.planeHeight)/(this.highVal),'8',5);
        this.addScale(6*(this.planeHeight)/(this.highVal),'6',5);
        this.addScale(4*(this.planeHeight)/(this.highVal),'4',5);
        this.addScale(2*(this.planeHeight)/(this.highVal),'2',5);
                                                                                                                      

        let textScale = 3;
        options.data[this.seriesNames[0]].forEach((element,index) => {
            console.log(element);
            this.gui3D.create3DText(this.scene, textScale, element.label, 'this.planeWidth', 'this.planeHeight', 
                                    index*this.planeWidth/this.seriesLength/textScale +  this.planeWidth/this.seriesLength/textScale/2, 
                                    -7 - (index%2)*textScale , 
                                    -.01);
            // this.gui3D.create3DText(this.scene, textScale, element.label, 'this.planeWidth', 'this.planeHeight', (index*(this.planeWidth/this.seriesLength)/textScale + this.padding ) , -5 , -.01);
            // this.gui3D.create3DText(this.scene, textScale, element.label, 'this.planeWidth', 'this.planeHeight',  index *((this.elementWidth+this.padding)/textScale) + (this.elementWidth+this.padding)/textScale/1.6, -7 - (index%2)*5 , -.01);

        });
    }

    addBar(barOptions) {

    }

    addScale(yPosition,label, textScale){
        let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {height: 1, width: this.options.planeWidth, depth: .1}, this.scene);

        myBox.material = this.lineMat;
        myBox.position.x = this.planeWidth/2;
        myBox.position.y = yPosition;

        this.gui3D.create3DText(this.scene, textScale, label, 'this.planeWidth', 'this.planeHeight', -3, yPosition/textScale -textScale/3, -.01);
        this.gui3D.create3DText(this.scene, textScale, label, 'this.planeWidth', 'this.planeHeight', this.planeWidth/textScale+3, yPosition/textScale -textScale/3, -.01);
    }

    build(barChartOptions) {
        console.log('barChartOptions: ',barChartOptions);

        this.gui3D.create3DText(this.scene, 6, 'Monthly Metrics', 'this.planeWidth', 'this.planeHeight', this.planeWidth/2/6, this.planeHeight/6+6/2, -.2);


        // let colorIndex = 1;
        for (let elementIndex = 0; elementIndex < this.seriesLength; elementIndex++) {
            for (let seriesIndex = 0; seriesIndex < this.seriesCount; seriesIndex++){
                const element = barChartOptions.data[this.seriesNames[seriesIndex]][elementIndex];

                console.log('element:',element)
                let bar;

                let barHeight = barChartOptions.planeHeight*(element.value/this.highVal);

                // // create the bar
                if (this.options.round) {
                    bar = BABYLON.MeshBuilder.CreateCylinder(this.seriesNames[seriesIndex]+'-'+element.label, {height: barHeight, diameter: this.barWidth}, this.options.graph);
                } else {
                    bar = BABYLON.MeshBuilder.CreateBox(this.seriesNames[seriesIndex]+'-'+element.label,{height: barHeight, width: this.barWidth, depth: this.options.depth ? this.options.depth : 10}, this.scene);
                }

                // bar = BABYLON.MeshBuilder.CreateBox("bar", {height: element.value*20, width: this.barWidth, depth: 10}, this.scene);
                if (this.seriesCount > 1) {
                    bar.material = (this.materials[seriesIndex+1]).clone();
                }
                else {
                    bar.material = (this.materials[elementIndex+1]).clone();
                }

                bar.position.x = elementIndex*(this.elementWidth+this.padding) + seriesIndex*this.elementWidth/this.seriesCount + this.barWidth/2 + this.padding;
                bar.position.y = barHeight/2;

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
                                console.log('hovering over ' + bar.name)
                                bar.material.emissiveColor = new BABYLON.Color3(.5,.5,.5);
                                // bar.userData.myLabel.material.emissiveColor = new BABYLON.Color3(.1,.1,.1);
                            })
                    );
        
                bar.actionManager
                    .registerAction(
                        new BABYLON.ExecuteCodeAction(
                            BABYLON.ActionManager.OnPointerOutTrigger,
                            () => {
                                console.log('stopped hovering over ' + bar.name)
                                bar.material.emissiveColor = new BABYLON.Color3(0,0,0);
                                // bar.userData.myLabel.material.emissiveColor = new BABYLON.Color3(0,0,0);
        
                            })
                    );
        
            }
            // colorIndex = 1;
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

    addLine(lineOptions){

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

for (let seriesCount = 0; seriesCount < 1; seriesCount++){
    dataSeries['Series'+seriesCount] = [];
    for (let dataPoints = 1; dataPoints <= 12; dataPoints++) {
        
        let data = {
            label: months[dataPoints].long,
            value: 1* (Math.abs(6 - dataPoints) + 2 +seriesCount),
            // value: 6 - dataPoints + 2,
            details: {
                detail1: dataPoints,
                detail2: dataPoints * dataPoints,
                detail3: 1 / dataPoints
            }
        };
        dataSeries['Series'+seriesCount].push(data);

    }
}


let barChart2 = new BarChart({
    id: 'bar2', // required - id of canvas element to use
    data: dataSeries, // required - array of data objects     { label: "July", value: 100 }

    ///////////////////////
    // optional settings //
    ///////////////////////

    width: 800, // <default 300>
    height: 600, // <default 200>
    shadows: true, // <default false>
    round: false, // <default false>        // Added
    depth: 10, // <default .25 >            // Added
    // logo: 'logo.png',
    label2D: false,
    coloredLabels: false,
    ground: false,
    cameraFirstPerson: false,
    backplane: false,
    horizontalLabels: false,
    verticalLabels: true,
    alpha: .6,
    showScale: true,
    backgroundColor: {
        r: 0,
        g: 0,
        b: 0
    },
    normal: 'normal5.jpg'

});