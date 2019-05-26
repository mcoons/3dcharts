


//////////////////////////////////////////////////
//////////////////////////////////////////////////

class BaseChart { // Base Chart Class

    constructor(options) {
        var options = options;

        this.materials = [];
        
        var canvas = document.getElementById(options.id);
        canvas.width = options.width ? options.width : 300;
        canvas.height = options.height ? options.height : 200;
        
        var engine = new BABYLON.Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true
        });
        
        // this should be base scene items only
        this.scene = this.initializeScene(engine);
        this.scene.activeCamera.attachControl(canvas);
        
        this.createMaterials(this.materials);
        // var glowLayer = new BABYLON.GlowLayer("glowLayer", this.scene);
        //     glowLayer.intensity = .75;

        // console.log(this.materials);

        this.lineMat = new BABYLON.StandardMaterial("lineMat", this.scene);
        this.lineMat.diffuseColor = new BABYLON.Color3(.3, .3, .3);
        this.lineMat.specularColor = new BABYLON.Color3(0, 0, 0);
        this.lineMat.alpha = 1;
        this.lineMat.emissiveColor = new BABYLON.Color3(.5, .5, .5);

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
        for (let xr = 0; xr <= 1; xr += .333) 
        for (let yg = 0; yg <= 1; yg += .333) 
        for (let zb = 0; zb <= 1; zb += .333)
        {
            let mat = new BABYLON.StandardMaterial("mat", this.scene);
                mat.diffuseColor = new BABYLON.Color3(xr, yg, zb);
                mat.specularColor = new BABYLON.Color3(0, 0, 0);
                mat.alpha = 1;
                mat.emissiveColor = new BABYLON.Color3(xr/5, yg/5, zb/5);

            materials.push(mat);
        }
    }

}

//////////////////////////////////////////////////
//////////////////////////////////////////////////

class BarChart extends BaseChart {

    constructor(options) {
        super(options);

        console.log('data:', options.data);

        var seriesNames = Object.keys(options.data);    
        console.log('seriesNames:',seriesNames);
        // console.log('Series 0 Data:')
        // options.data[seriesNames[0]].forEach(element => {
        //     console.log(element);
        // });

var padding = 10;

        var seriesCount = seriesNames.length;
        console.log('seriesCount:',seriesCount);

        var seriesLength = options.data[seriesNames[0]].length;
        console.log('seriesLength:', seriesLength);

        var elementWidth = Math.trunc(500/seriesLength)-padding;
        console.log('elementWidth:', elementWidth);

        var barWidth = (elementWidth)/seriesCount;

        var myPlane = BABYLON.MeshBuilder.CreatePlane("myPlane", {width: (elementWidth+padding)*seriesLength+padding, height: 300}, this.scene);
        myPlane.position.x = (elementWidth+padding)*seriesLength/2 + padding/2;
        myPlane.position.y = 150;

        this.scene.activeCamera.position.x = (elementWidth+padding)*seriesLength/2+padding/2
        

        let colorIndex = 1;

        for (let seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++)
        for (let elementIndex = 0; elementIndex < options.data[seriesNames[0]].length; elementIndex++) {
            const element = options.data[seriesNames[seriesIndex]][elementIndex];
            // console.log(element);
            let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {height: element.value*20, width: barWidth, depth: 10}, this.scene);
            myBox.material = this.materials[colorIndex];
            myBox.position.x = elementIndex*(elementWidth+padding) + seriesIndex*elementWidth/seriesCount + barWidth/2 + padding;
            myBox.position.y = 20*element.value/2;

            colorIndex++;
            if (colorIndex === 64) colorIndex = 1;

        }
        

        


        
        // draw vertical lines separating elements
        for (let index = 0; index < options.data[seriesNames[0]].length+1; index++) {
            const element = options.data[seriesNames[0]][index];

            let myBox = BABYLON.MeshBuilder.CreateBox("myBox", {height: 300, width: 1, depth: 1}, this.scene);
            myBox.material = this.lineMat;
            myBox.position.x = index*(elementWidth+padding) + padding/2;
            myBox.position.y = 150;
        }        
        

    }

    addBar(barOptions) {

    }

    build(barChartOptions) {

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

for (let seriesCount = 0; seriesCount < 3; seriesCount++){
    dataSeries['Series'+seriesCount] = [];
    for (let dataPoints = 1; dataPoints <= 10; dataPoints++) {
        
        let data = {
            label: months[dataPoints].long,
            value: Math.abs(6 - dataPoints) + 2 +seriesCount,
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

    width: 600, // <default 300>
    height: 600, // <default 200>
    shadows: true, // <default false>
    round: true, // <default false>
    depth: 1, // <default .25 >
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


    // ground color
    // camera distance
    // intro animation

});