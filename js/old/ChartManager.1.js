
var createScene = function (engine,canvas) {
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("Camera", 3*Math.PI/2, .8, 18, new BABYLON.Vector3(0, -3, 0), scene);
    var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(100, 100, 20), scene);

    scene.clearColor = new BABYLON.Color3(1, 1, 1); 
    scene.activeCamera.attachControl(canvas);

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
    offsetX2 = Math.cos(medianAngle) * 6;
    offsetZ2 = -Math.sin(medianAngle) * 6;

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

    // var myPlane1 = BABYLON.MeshBuilder.CreatePlane("myPlane", {width: 5, height: 1, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, options.graph);
    // myPlane1.position.x = 2.5;
    // myPlane1.parent = slice;

    // var myPlane2 = BABYLON.MeshBuilder.CreatePlane("myPlane", {width: 5, height: 1, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, options.graph);
    // myPlane2.setPivotPoint(new BABYLON.Vector3(-2.5,0,0));
    // myPlane2.rotation.y = Math.PI * options.percent*2;
    // myPlane2.position.x = 2.5;
    // myPlane2.parent = slice;

    // set rotation of slice in pie
    slice.rotation.y = options.startRotation; // location in pie

    var basePosition = slice.position;

    // // set color
    slice.material = options.mat;
    // myPlane1.material = options.mat;
    // myPlane2.material = options.mat;


    // console.log('options.mat');
    // console.log(options.mat);

    // var material = new BABYLON.StandardMaterial("mat", options.graph);

    // // set color
    // slice.material = material
    // myPlane1.material = material
    // myPlane2.material = material

    // console.log('options.mat in addPieSlice');
    // console.log(options.mat);
    

    /////// Add Label

    // var path = [
    //     new BABYLON.Vector3(0, 0, 0),
    //     new BABYLON.Vector3(Math.cos(medianAngle) * 6 , 0, -Math.sin(medianAngle) * 6 ),
    //     new BABYLON.Vector3(Math.cos(medianAngle) * 6 , 0, -Math.sin(medianAngle) * 6 )
    // ];

    // var tube = BABYLON.MeshBuilder.CreateTube("tube", {path: path, radius: 0.1}, options.graph);


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

    // slice.actionManager.registerAction(
    //     new BABYLON.InterpolateValueAction(
    //         BABYLON.ActionManager.OnPointerOverTrigger,
    //         slice,
    //         'visibility',
    //         0.5,
    //         100
    //     )
    // );

    // slice.actionManager.registerAction(
    //     new BABYLON.InterpolateValueAction(
    //         BABYLON.ActionManager.OnPointerOutTrigger,
    //         slice,
    //         'visibility',
    //         1.0,
    //         100
    //     )
    // );

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

    // console.log(slice);
    return slice;
}




// Legend

// var legendSize = 5;
// var legend = BABYLON.Mesh.CreatePlane("legend", legendSize, graph1, false);

// legend.material = new BABYLON.StandardMaterial("legend", graph1);
// // legend.scaling.y = 0.5;

// legend.position.z = -8;
// legend.position.y = -1.5;
// legend.rotation.x = 3.14/4;

// var legendTexture = new BABYLON.DynamicTexture("dynamic texture", 256, graph1, true);
// legend.material.diffuseTexture = legendTexture;
// legend.material.specularColor = new BABYLON.Color3(1, 1, 1);
// legend.material.backFaceCulling = false;

// legendTexture.drawText("Legend", null, 30, "bold 30px Segoe UI", "black", "#ffffff");
// legendTexture.drawText("1234567890", null, 60, "30px Segoe UI", "black", null);

// engine.runRenderLoop(function () {
//     graph1.render();
// });



var dataSet2 = { 
                'set 1' :[  
                            {
                                label: "January",
                                value: 10,
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
                        ],
                'set 2': [  
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
                            }
                        ]
                }


var dataSet = [{
                    label: "June",
                    value: 40,
                },
                {
                    label: "July",
                    value: 20,
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
                }
                // ,
                // {
                //     label: "June",
                //     value: 40,
                // },
                // {
                //     label: "March",
                //     value: 40,
                // },
                // {
                //     label: "April",
                //     value: 80,
                // },
                // {
                //     label: "May",
                //     value: 60,
                // },
                // {
                //     label: "June",
                //     value: 40,
                // }
                ];


// var drawLabels = function (slices, scene) {

//     // console.log('slices in function:');
//     // console.log(slices);


//     slices.forEach(element => {

//         let  medianAngle = element.startRotation + Math.PI * element.percent;      
//         let endX = Math.cos(medianAngle) * 6;
//         let endZ = -Math.sin(medianAngle) * 6;

//         let path = [
//             new BABYLON.Vector3(Math.cos(medianAngle) * 5, 0, -Math.sin(medianAngle) * 5),
//             new BABYLON.Vector3(endX , - (endZ <= 0 ? 1 : -1), endZ),
//             new BABYLON.Vector3(endX- (endX <= 0 ? 1 : -1) , - (endZ <= 0 ? 1 : -1), endZ)
//         ];
    
//         let tube = BABYLON.MeshBuilder.CreateTube("tube", {path: path, radius: 0.02}, scene);
//         tube.material = new BABYLON.StandardMaterial("mat4", this.scene);
//         tube.material.diffuseColor = new BABYLON.Color3(0, 0, 0);

//     });

// }



var Piechart = function (options) {

    this.options = options;
    this.canvas = document.getElementById(this.options.id);
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = createScene(this.engine, this.canvas);

    this.canvas.height = this.options.height ? this.options.height : 500;
    this.canvas.width = this.options.width ? this.options.width : 500;

    // this.slices = [];
    this.materials = [];

    var max_label_size = 0;
    var total_value = 0;
    var color_index = 0;

    this.materials = buildMaterials(this.options.data.length, this.scene);

    // console.log('materials:');
    // console.log(this.materials);

    this.options.data.forEach(element => {
        total_value += element.value;
        max_label_size = element.label.length > max_label_size ? element.label.length : max_label_size;
    });

    var start_angle = 0;
    this.options.data.forEach(element => {

        var slice_angle = 2 * Math.PI * element.value / total_value;

        var slice = addPieSlice({
            graph: this.scene,
            percent: element.value / total_value,
            startRotation: start_angle,
            mat: this.materials[color_index % this.materials.length],
            name: element.label,
            value: element.value
        });

        // console.log(this.materials[color_index % this.materials.length]);

        // this.slices.push( { mesh:            slice, 
        //                     label:           element.label, 
        //                     labelMesh:       null,
        //                     value:           element.value, 
        //                     visible:         true,
        //                     percent:         element.value / total_value, 
        //                     startRotation:   start_angle, 
        //                     sliceAngle:      slice_angle } );

        start_angle += slice_angle;
        color_index++;
    })

    console.log('finished adding slices');

    var myScene = this.scene;
    var mySlices = this.slices;

    // console.log("scene");
    // console.log(this.scene);

    this.engine.runRenderLoop(function () {
        myScene.render();
    });

}


var piechart = new Piechart({
    id: 'pie',
    data: dataSet,
    width: 500,
    height: 300
});


//////////////////////////////////////////////////////////////////////
// Palette Functions
//////////////////////////////////////////////////////////////////////


function buildMaterials (count, scene) {
    let palette = buildPalette();
    let materials = [];

    console.log("palette");
    console.log(palette);

    for (let index = 0; index < count; index++) {
        let mat = new BABYLON.StandardMaterial("mat"+index, scene);
        let paletteIndex = remap(index, 0, count, 0, palette.length-1);

        mat.diffuseColor = palette[paletteIndex];

        mat.sideOrientation = BABYLON.Mesh.DOUBLESIDE ;
        materials.push(mat);        
    }

    console.log("materials");
    console.log(materials);


    return materials;
}

  
// Builds a palette array[1530] of palette objects
function buildPalette() {

    let palette = [];
    let r = 255,
        g = 0,
        b = 0;

    var shade = .5;

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
        palette.push(new BABYLON.Color3((r/255)*shade, (g/255)*shade, (b/255)*shade) );
    }

    return palette;
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
    if (oldMin != oMin)
        reverseInput = true;

    //     #check reversed output range
    let reverseOutput = false;
    let newMin = Math.min(nMin, nMax);
    let newMax = Math.max(nMin, nMax);
    if (newMin != nMin)
        reverseOutput = true;

    portion = (x - oldMin) * (newMax - newMin) / (oldMax - oldMin);
    if (reverseInput)
        portion = (oldMax - x) * (newMax - newMin) / (oldMax - oldMin);

    let result = portion + newMin
    if (reverseOutput)
        result = newMax - portion;

    return result;
}
