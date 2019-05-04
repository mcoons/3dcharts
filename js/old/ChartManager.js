
var createScene = function (engine,canvas) {
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("Camera", 3*Math.PI/2, .8, 18, new BABYLON.Vector3(0, -3, 0), scene);
    var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(100, 100, 20), scene);

    scene.clearColor = new BABYLON.Color3(1, 1, 1); 
    scene.activeCamera.attachControl(canvas);

    // var pipeline = new BABYLON.DefaultRenderingPipeline(
    //     "default", // The name of the pipeline
    //     true, // Do you want HDR textures ?
    //     scene, // The scene instance
    //     [camera] // The list of cameras to be attached to
    // );

    // pipeline.samples = 4;
    // pipeline.fxaaEnabled = true;
    // pipeline.sharpenEnabled = true;
    // pipeline.sharpen.edgeAmount = 0.2;

    return scene;
}

// slice options = {graph: graph1, percent: .125, startRotation: 0, color: '#ff0000', name: 'slice 1', value: 100}
var addPieSlice = function (options) { 

    // X and Y calculations for offset animation
    let offset = .6;
    let offsetX, offsetZ, medianAngle;
    medianAngle = options.startRotation + Math.PI * options.percent;
    offsetX = Math.cos(medianAngle) * offset;
    offsetZ = -Math.sin(medianAngle) * offset;
    offsetX2 = Math.cos(medianAngle) * 6;
    offsetZ2 = -Math.sin(medianAngle) * 6;

    // basic settings for a cylinder
    let settings = {
        height: 1,
        diameterTop: 10,
        diameterBottom: 10,
        tessellation: 40,
        arc: options.percent, // update size of slice % [0..1]
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    };
    
    // create the slice
    let slice = BABYLON.MeshBuilder.CreateCylinder(options.name, settings, options.graph);
    slice.enableEdgesRendering();    
    slice.edgesWidth = 2.0;
    slice.edgesColor = new BABYLON.Color4(0, 0, 0, 1);

    let myPlane1 = BABYLON.MeshBuilder.CreatePlane("myPlane", {width: 5, height: 1, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, options.graph);
    myPlane1.position.x = 2.5;
    myPlane1.parent = slice;

    let myPlane2 = BABYLON.MeshBuilder.CreatePlane("myPlane", {width: 5, height: 1, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, options.graph);
    myPlane2.setPivotPoint(new BABYLON.Vector3(-2.5,0,0));
    myPlane2.rotation.y = Math.PI * options.percent*2;
    myPlane2.position.x = 2.5;
    myPlane2.parent = slice;

    // set rotation of slice in pie
    slice.rotation.y = options.startRotation; // location in pie

    let basePosition = slice.position;

    // // set color
    slice.material = options.mat;
    myPlane1.material = options.mat;
    myPlane2.material = options.mat;

    /////// Add Actions

    slice.actionManager = new BABYLON.ActionManager(options.graph);
    slice.actionManager.registerAction(
        new BABYLON.InterpolateValueAction(
            BABYLON.ActionManager.OnPointerOverTrigger,
            slice,
            'scaling',
            new BABYLON.Vector3(1.1, 2, 1.1),
            100
        )
    );

    slice.actionManager.registerAction(
        new BABYLON.InterpolateValueAction(
            BABYLON.ActionManager.OnPointerOutTrigger,
            slice,
            'scaling',
            new BABYLON.Vector3(1, 1, 1),
            100
        )
    );

    slice.actionManager.registerAction(
        new BABYLON.InterpolateValueAction(
            BABYLON.ActionManager.OnPointerOverTrigger,
            slice,
            'position',
            new BABYLON.Vector3(offsetX, 0, offsetZ),
            100
        )
    );

    slice.actionManager.registerAction(
        new BABYLON.InterpolateValueAction(
            BABYLON.ActionManager.OnPointerOutTrigger,
            slice,
            'position',
            basePosition,
            100
        )
    );

    return slice;
}

var Piechart = function (options) {

    this.options = options;
    this.canvas = document.getElementById(this.options.id);
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = createScene(this.engine, this.canvas);

    this.canvas.height = this.options.height ? this.options.height : 500;
    this.canvas.width = this.options.width ? this.options.width : 500;

    this.materials = [];

    let max_label_size = 0;
    let total_value = 0;
    let color_index = 0;

    this.materials = buildMaterials(this.options.data.length, this.scene);

    this.options.data.forEach(element => {
        total_value += element.value;
        max_label_size = element.label.length > max_label_size ? element.label.length : max_label_size;
    });

    let start_angle = 0;
    this.options.data.forEach(element => {
        let slice_angle = 2 * Math.PI * element.value / total_value;
        let slice = addPieSlice({
            graph: this.scene,
            percent: element.value / total_value,
            startRotation: start_angle,
            mat: this.materials[color_index % this.materials.length],
            name: element.label,
            value: element.value
        });

        start_angle += slice_angle;
        color_index++;
    })

    let myScene = this.scene;

    this.engine.runRenderLoop(function () {
        myScene.render();
    });
}

// bar options = {graph: graph1, percent: .125, name: 'slice 1', value: 100}
var addBar = function (options) {

    // basic settings for a bar
    let settings = {
        width: 1,
        height: 5,
        depth: .25,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    };

    // create the bar
    // let bar = BABYLON.MeshBuilder.CreateBox(options.name, settings, options.graph);
    let bar = BABYLON.MeshBuilder.CreateCylinder(options.name, settings, options.graph);


    return bar;
}

var Barchart = function (options){
    this.options = options;
    this.canvas = document.getElementById(this.options.id);
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = createScene(this.engine, this.canvas);

    this.canvas.height = this.options.height ? this.options.height : 500;
    this.canvas.width = this.options.width ? this.options.width : 500;

    this.materials = [];

    let max_label_size = 0;
    let total_value = 0;
    let color_index = 0;
    
    this.materials = buildMaterials(this.options.data.length, this.scene);

    this.options.data.forEach(element => {
        total_value += element.value;
        max_label_size = element.label.length > max_label_size ? element.label.length : max_label_size;
    });



    this.options.data.forEach(element => {
        let bar = addBar({
            graph: this.scene,
            percent: element.value / total_value,
            mat: this.materials[color_index % this.materials.length],
            name: element.label,
            value: element.value
        });

        color_index++;
    })



    let myScene = this.scene;

    this.engine.runRenderLoop(function () {
        myScene.render();
    });
}

//////////////////////////////////////////////////////////////////////
// Palette Functions
//////////////////////////////////////////////////////////////////////

function buildMaterials (count, scene) {

    let palette = buildPalette();
    let materials = [];

    for (let index = 0; index < count; index++) {
        let paletteIndex = remap(index, 0, count, 0, palette.length-1);

        let mat = new BABYLON.StandardMaterial("mat"+index, scene);
        mat.diffuseColor = palette[Math.round(paletteIndex)];
        mat.sideOrientation = BABYLON.Mesh.DOUBLESIDE ;
        materials.push(mat);        
    }

    return materials;
}

// Builds a palette array[1530] of palette objects
function buildPalette() {

    let palette = [];
    let r = 255, g = 0, b = 0;
    let shade = 1;

    for (g = 0; g <= 255; g++) { addToPalette(r, g, b) }
    g--;

    for (r = 254; r >= 0; r--) { addToPalette(r, g, b) }
    r++;

    for (b = 1; b <= 255; b++) { addToPalette(r, g, b) }
    b--;

    for (g = 254; g >= 0; g--) { addToPalette(r, g, b) }
    g++;

    for (r = 1; r <= 255; r++) { addToPalette(r, g, b) }
    r--;

    for (b = 254; b > 0; b--) { addToPalette(r, g, b) }
    b++;

    function addToPalette(r, g, b) {
        palette.push(new BABYLON.Color3( (r/255)*shade, (g/255)*shade, (b/255)*shade) );
    }

    console.log('Palette: ');
    console.log(palette);
    

    return palette;
}

function drawPalette (){
        
}

// Function to remap one range to another
function remap(x, oMin, oMax, nMin, nMax) {
    //     #range check

    if (oMin === oMax) {
        console.log("Warning: Zero input range");
        return null;
    }

    if (nMin === nMax) {
        console.log("Warning: Zero output range");
        return null;
    }

    //     #check reversed input range
    let reverseInput = false;
    let oldMin = Math.min(oMin, oMax);
    let oldMax = Math.max(oMin, oMax);

    if (oldMin != oMin) reverseInput = true;

    //     #check reversed output range
    let reverseOutput = false;
    let newMin = Math.min(nMin, nMax);
    let newMax = Math.max(nMin, nMax);

    if (newMin != nMin) reverseOutput = true;

    portion = (x - oldMin) * (newMax - newMin) / (oldMax - oldMin);

    if (reverseInput) portion = (oldMax - x) * (newMax - newMin) / (oldMax - oldMin);

    let result = portion + newMin;

    if (reverseOutput) result = newMax - portion;

    return result;
}

//////////////////////////////////////////////////////////////////////

var dataSet = [
    {
        label: "July",
        value: 20,
    },
    {
        label: "February",
        value: 20,
    },
    {
        label: "February",
        value: 20,
    },
    {
        label: "February",
        value: 20,
    },
    {
        label: "February",
        value: 20,
    },    {
        label: "July",
        value: 20,
    },
    {
        label: "February",
        value: 20,
    },
    {
        label: "February",
        value: 20,
    },
    {
        label: "February",
        value: 20,
    },
    {
        label: "February",
        value: 20,
    },    {
        label: "July",
        value: 20,
    },
    {
        label: "February",
        value: 20,
    },
    {
        label: "February",
        value: 20,
    },
    {
        label: "February",
        value: 20,
    },
    {
        label: "February",
        value: 20,
    },
    {
        label: "May",
        value: 20,
    }
];

var piechart = new Piechart({
    id: 'pie',
    data: dataSet,
    width: 500,
    height: 300
})

var barchart = new Barchart({
    id: 'bar',
    data: dataSet,
    width: 500,
    height: 300
})
