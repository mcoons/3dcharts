var canvas = document.getElementById("pie");
var engine = new BABYLON.Engine(canvas, true);


var dataSet = [{
    label: "January",
    value: 10,
    color: "#ff0000"
},
{
    label: "February",
    value: 20,
},
{
    label: "March",
    value: 40,
},
{
    label: "April",
    value: 80,
},
{
    label: "May",
    value: 60,
},
{
    label: "June",
    value: 40,
},
{
    label: "July",
    value: 20,
}
];


var width = 300;
var height = 300;
canvas.width = width;
canvas.height = height;

var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    // set background color
    scene.clearColor = new BABYLON.Color3(1, 1, 1); 

    // add camera and light
    var camera = new BABYLON.ArcRotateCamera("Camera", 3*Math.PI/2, .8, 18, new BABYLON.Vector3(0, -3, 0), scene);
    var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(100, 100, 20), scene);

    // add mouse control to camera
    scene.activeCamera.attachControl(canvas);

    // return scene object
    return scene;
};

// slice options = {graph: graph1, percent: .125, startRotation: 0, color: '#ff0000', name: 'slice 1', value: 100}

var addPieSlice = function (options) { 
    // X and Y calculations for offset animation
    var offset = .6;
    var offsetX, offsetZ, medianAngle;
    medianAngle = options.startRotation + Math.PI * options.percent;
    offsetX = Math.cos(medianAngle) * offset;
    offsetZ = -Math.sin(medianAngle) * offset;

    // basic settings for a cylinder
    var settings = {
        height: 1,
        diameterTop: 10,
        diameterBottom: 10,
        tessellation: 40,
        arc: options.percent, // update size of slice % [0..1]
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    };
    
    // create the slice
    var slice = BABYLON.MeshBuilder.CreateCylinder(options.name, settings, options.graph);

    // set rotation in pie
    slice.rotation.y = options.startRotation; // location in pie
    var basePosition = slice.position;

    // set color
    slice.material = options.color;

    /////////////////////// Label


    /////////////////////// Actions

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
            'visibility',
            0.5,
            100
        )
    );

    slice.actionManager.registerAction(
        new BABYLON.InterpolateValueAction(
            BABYLON.ActionManager.OnPointerOutTrigger,
            slice,
            'visibility',
            1.0,
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

    console.log(slice);
    return slice;
}

var graph1 = createScene('renderCanvas');

var material0 = new BABYLON.StandardMaterial("mat0", graph1);
material0.diffuseColor = new BABYLON.Color3(1, 0, 0);

var material1 = new BABYLON.StandardMaterial("mat1", graph1);
material1.diffuseColor = new BABYLON.Color3(0, 1, 0);

var material2 = new BABYLON.StandardMaterial("mat2", graph1);
material2.diffuseColor = new BABYLON.Color3(0, 0, 1);

var material3 = new BABYLON.StandardMaterial("mat3", graph1);
material3.diffuseColor = new BABYLON.Color3(1, 1, 0);

var material4 = new BABYLON.StandardMaterial("mat4", graph1);
material4.diffuseColor = new BABYLON.Color3(0, 1, 1);

var material5 = new BABYLON.StandardMaterial("mat5", graph1);
material5.diffuseColor = new BABYLON.Color3(1, 0, 1);


var slice1 = addPieSlice({
    graph: graph1,
    percent: .5,
    startRotation: 0,
    color: material0,
    name: 'slice 1',
    value: 100
});

var slice2 = addPieSlice({
    graph: graph1,
    percent: .25,
    startRotation: Math.PI,
    color: material1,
    name: 'slice 2',
    value: 100
});

var slice3 = addPieSlice({
    graph: graph1,
    percent: .125,
    startRotation: 3 * Math.PI / 2,
    color: material2,
    name: 'slice 3',
    value: 100
});

var slice4 = addPieSlice({
    graph: graph1,
    percent: .125,
    startRotation: (2 * Math.PI) * (.5 + .25 + .125),
    color: material3,
    name: 'slice 4',
    value: 100
});


// Legend

var legendSize = 5;
var legend = BABYLON.Mesh.CreatePlane("legend", legendSize, graph1, false);

legend.material = new BABYLON.StandardMaterial("legend", graph1);
// legend.scaling.y = 0.5;

legend.position.z = -8;
legend.position.y = -1.5;
legend.rotation.x = 3.14/4;

var legendTexture = new BABYLON.DynamicTexture("dynamic texture", 256, graph1, true);
legend.material.diffuseTexture = legendTexture;
legend.material.specularColor = new BABYLON.Color3(1, 1, 1);
legend.material.backFaceCulling = false;

legendTexture.drawText("Legend", null, 30, "bold 30px Segoe UI", "black", "#ffffff");
legendTexture.drawText("1234567890", null, 60, "30px Segoe UI", "black", null);

engine.runRenderLoop(function () {
    graph1.render();
});

