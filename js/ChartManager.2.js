// This is a canvas based class to support charts
//
// TODO: 
//      Implement GUI as classes Gui2d and Gui3D - DONE!!
//      Implement file download - DONE!!!
//
//      Implement Scales/Axis options - WORKING ON IT
//      Implement bar value normalization/remap to default width/height
//      Implement Options menu - WORKING ON IT
//      Implement palette options - WORKING ON IT
//      Implement custom colors
//
//      Implement state
//      Implement defaults
//      Implement storage class - save/load state - local browser/server database?
//      Implement help system - include feedback/question/request option per panel
//      Implement data input/fetch
//  
//      Implement Object/Label menu - WORKING ON IT
//      Implement Drill Down Data Detail system
//      Implement series - WORKING ON IT
//      Implement saveable frames perhaps animated for a moving presentation
//      Implement camera dolly system
//      Implement Scene Save/Load/Add to presentation
//
//      Implement glowing materials
//      Implement Glow/Selection on hover
//      Implement 2D data details panel - WORKING ON IT
//      Implement horitontal and vertical bars option
//      Implement background - image/color - WORKING ON IT
//      Implement logo placement
//
//      Server side with database?
//      User accounts?
//
//////////////// GUI //////////////////
//
//      GUIs should be their own class Gui2d/Gui3d - DONE!!
//
//      Object alignment arrows in base gui object
//      Object sizing in base gui object
//      Help in base gui object
//
//      'Options' button
//          Scene options
//              Camera 
//                  position
//                  target
//                  alpha
//                  beta
//                  radius
//                  lowerAlphaLimit
//                  lowerBetaLimit
//                  lowerRadiusLimit
//                  Lock/Unlock Camera
//
//              Lighting and effects
//                  Light brightness
//                  Light Color
//              Ground
//                  Enabled
//                  Logo
//                  Color
//              Background
//                  Enabled
//                  Logo
//                  Color
//              
//          Graph options
//              Title
//                  Text
//                  Attributes
//              Type
//                  Pie
//                  Bar
//                  Line
//              
//              Labels
//                  2D floating labels
//                      Attributes
//                  2D legend
//                      Attributes
//                  3D floating
//                      Attributes
//                  3D Legend
//                      Attributes
//              Save/DL image 
//          Help
//              Help '?' on every gui element
//      
//      Add object clicks
//          click to select
//              glow: on/off
//          right click for options and details
//              options: change color 
//                       toggle label
//              options: make camera target
//
//      Add label clicks
//          click to select
//              glow: on/off
//          right click for options and details
//              options: change color
//                       hide label
//                       make camera target              
//          click/hold to move lobel
//
//      Add a label manager?


class Chart { // Base Chart Class

    constructor(options) {
        this.options = options;

        console.log(options);

        this.labels2D = [];
        this.objects = [];

        let sampleOptions = {
            type: 'bar',
            id: 'bar1', // required - id of canvas element to use
            data: dataSeries // required - array of data objects     { label: "July", value: 100 }

                ///////////////////////
                // optional settings //
                ///////////////////////

                ,
            width: 800 // <default 300>
                ,
            height: 500 // <default 200>
                ,
            shadows: false // <default false>
                ,
            round: false // <default false>
                ,
            depth: .6 // <default .25 >
                // ,logo: 'logo.png'
                ,
            label2D: false,
            coloredLabels: true,
            ground: false,
            cameraFirstPerson: true,
            backPlane: true,
            horizontalLabels: true,
            verticalLabels: false

            // ground color
            // camera distance
            // intro animation

        };

        this.state = {
            root: this,
            options: options
        };

        this.defaults = {
            camera: {
                cameraTargetPosition: new BABYLON.Vector3(0, 0, 0)
            },
            button: {

            }
        };

        this.canvas = document.getElementById(this.options.id);
        this.canvas.width = this.options.width ? this.options.width : 300;
        this.canvas.height = this.options.height ? this.options.height : 200;

        this.engine = new BABYLON.Engine(this.canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true
        });

        this.createScene.bind(this);
        this.scene = this.createScene(this.canvas);

        this.buildMaterials.bind(this);
        this.materials = this.buildMaterials(this.options.data.Series1.length);

        this.buildCustomMaterials.bind(this);
        this.customMaterials = this.buildCustomMaterials();

        this.panelDisplayed = false;


        // this.lastFrameTime = Date.now();
        // this.frameTimes = [];

        // run build() in child classes
        this.build();

        this.gui2D = new Gui2DManager(this);
        this.gui3D = new Gui3DManager(this.scene, this.objects, this.options);

        this.engine.runRenderLoop(() => {
            this.updateScene.bind(this);
            this.updateScene();
            this.scene.render();
        });

    } //  end constructor

    updateScene() {

        if (this.options.label2D === false && this.labels2D.length > 0) {
            this.labels2D.forEach(element => this.gui2D.advancedTexture.removeControl(element));
            this.labels2D = [];
        }

        if (this.options.label2D === true && this.labels2D.length === 0) {
            this.objects.forEach((element, index) => {
                this.gui2D.create2DLabel(element, index, element.userData.myOptions);
            })
        }


        this.logoParent.rotation.y += .01;

    }

    createScene(canvas) {

        let scene = new BABYLON.Scene(this.engine);
        // scene.debugLayer.show();
        // scene.clearColor = new BABYLON.Color3(0, 0, 0);

        let light0 = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(100, 100, 20), scene);
        light0.intensity = .315;

        let light1 = new BABYLON.PointLight("light1", new BABYLON.Vector3(-100, 80, -50), scene);
        light1.intensity = .55;

        let light = new BABYLON.PointLight("light1", new BABYLON.Vector3(150, 80, -150), scene);
        light.intensity = .75;

        let camera;

        if (this.options.cameraFirstPerson) {
            camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 0, -18), scene);

            if (this.options.ucCameraSpeed) camera.speed = this.options.ucCameraSpeed;

            if (this.options.ucCameraRotX) camera.rotation.x = this.options.ucCameraRotX;
            if (this.options.ucCameraRotY) camera.rotation.y = this.options.ucCameraRotY;
            if (this.options.ucCameraRotZ) camera.rotation.z = this.options.ucCameraRotZ;

            if (this.options.ucCameraPosX) camera.position.x = this.options.ucCameraPosX;
            if (this.options.ucCameraPosY) camera.position.y = this.options.ucCameraPosY;
            if (this.options.ucCameraPosZ) camera.position.z = this.options.ucCameraPosZ;

        } else {
            camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI/2+.2, 18, new BABYLON.Vector3(0, 3, 0), scene);

            camera.lowerRadiusLimit = 5;
            camera.upperRadiusLimit = 40;
            camera.lowerAlphaLimit = Math.PI;
            camera.upperAlphaLimit = Math.PI * 2;
            camera.lowerBetaLimit = 0;
            camera.upperBetaLimit = Math.PI;
        }

        scene.activeCamera.attachControl(canvas);

        // var pipeline = new BABYLON.DefaultRenderingPipeline(
        //     "default", // The name of the pipeline
        //     false, // Do you want HDR textures ?
        //     scene, // The scene instance
        //     [camera] // The list of cameras to be attached to
        // );

        // pipeline.samples = 8;

        // apply scene options here

        // if (this.options.){
        // }

        // if (this.options.){
        // }

        // if (this.options.){
        // }


        if (this.options.backgroundColor){

            scene.clearColor = new BABYLON.Color3(
                this.options.backgroundColor.r,
                this.options.backgroundColor.g,
                this.options.backgroundColor.b
            );


        }

        if (this.options.cameraSpeed) {
            camera.speed = this.options.cameraSpeed;
        }

        //Create back plane
        let plane0;
        if (this.options.backPlane) {
            plane0 = BABYLON.MeshBuilder.CreatePlane("plane", {
                width: 20,
                height: 20
            }, scene);
            plane0.position.y = 10;
        }

        if (this.options.shadows) {
            this.shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
            this.shadowGenerator.setDarkness(0.5);
            this.shadowGenerator.usePoissonSampling = true;
        }

        if (this.options.ground) {
            let ground = BABYLON.MeshBuilder.CreateGround("myGround", {
                width: 20,
                height: 20,
                subdivisions: 50
            }, scene);
            ground.receiveShadows = true;
            ground.rotation.x = -Math.PI / 8;
        }

        if (this.options.logo) {
            var logoMaterial = new BABYLON.StandardMaterial("logoMaterial", scene);
            logoMaterial.diffuseTexture = new BABYLON.Texture("/logo.png", scene);
            logoMaterial.diffuseTexture.hasAlpha = true;
            logoMaterial.diffuseTexture.uScale = 10.0;
            logoMaterial.diffuseTexture.vScale = 10.0;

            let logoOverlay = BABYLON.MeshBuilder.CreateGround("logoOverlay", {
                width: 50,
                height: 50,
                subdivisions: 50
            }, scene);
            logoOverlay.position.y = .005
            logoOverlay.receiveShadows = true;
            logoOverlay.material = logoMaterial;
            // logoOverlay.rotation.x = -Math.PI/8;

        }


        var scale   = 0.1, MeshWriter, text1, text2, C1, C2;

        let Writer = BABYLON.MeshWriter(scene, {scale:scale});
        text1  = new Writer( 
            "Coons Consulting",
            {
                "anchor": "center",
                "letter-height": 20,
                "letter-thickness": 7,
                "color": "#0C2880",
                "position": {
                    "y":8/scale,
                    "z": -.5/scale
                }
            }
        );
        text1.getMesh().rotation.x = -Math.PI/2;

        text2  = new Writer( 
            "Series 1 - Monthly Trends",
            {
                "anchor": "center",
                "letter-height": 6,
                "letter-thickness": .5,
                "color": "#000000",
                "position": {
                    "y":6/scale,
                    "z": -.1/scale
                }
            }
        );
        text2.getMesh().rotation.x = -Math.PI/2;
        text2.getMesh().material.diffuseColor = new BABYLON.Color3(0, 0, 0);


        C1  = new Writer( 
            "C",
            {
                "anchor": "center",
                "letter-height": 20,
                "letter-thickness": 1,
                "color": "#000088",
                "position": {
                    "x":-.25/scale,
                    "y":.25/scale,
                    "z": 0
                }
            }
        );
        C1.getMesh().rotation.x = -Math.PI/2;


        C2  = new Writer( 
            "C",
            {
                "anchor": "center",
                "letter-height": 20,
                "letter-thickness": 1,
                "color": "#0000ff",
                "position": {
                    "x":.25/scale,
                    "y":-.35/scale,
                    "z": 0
                }
            }
        );
        C2.getMesh().rotation.x = -Math.PI/2;

        this.logoParent = new BABYLON.Mesh("dummy", scene);
        
        C1.getMesh().parent = this.logoParent;
        C2.getMesh().parent = this.logoParent;
        
        this.logoParent.position.y = 8.25;
        this.logoParent.position.x = -9;
        this.logoParent.position.z = -.5;
        
        this.logoParent.scaling = new BABYLON.Vector3(.5,.5,.5);
        

        return scene;

    } //  end createScene method

    build() {
        console.log(' ---- default build: please override with a custom build method ----');
    } //  end build method

    /////////////////////////
    //   Palette Methods   //
    /////////////////////////

    // Build an array of materials[count]

    buildMaterials(count) {

        let palette = this.buildPalette();
        let materials = [];

        for (let index = 0; index < count; index++) {
            let paletteIndex = this.remap(index, 0, count, 0, palette.length - 1);

            let mat = new BABYLON.StandardMaterial("mat" + index, this.scene);
            mat.diffuseColor = palette[Math.round(paletteIndex)];
            // mat.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
            if (this.options.normal){

                mat.bumpTexture = new BABYLON.Texture("textures/"+this.options.normal, this.scene);
            }
            if (index%2){
                mat.invertNormalMapX = true;
                mat.invertNormalMapY = true;
            }

            if (this.options.alpha) {
                mat.alpha = this.options.alpha;
            }

            materials.push(mat);
        }

        return materials;
    } //  end buildMaterials method

    buildCustomMaterials() {
        let customMaterials = [];

        for (let index = 0; index < 10; index++) {
            let mat = new BABYLON.StandardMaterial("Custom " + index, this.scene);
            mat.sideOrientation = BABYLON.Mesh.DOUBLESIDE;

            customMaterials.push(mat);
        }

        return customMaterials;
    }

    // Build a palette array[1530] of colors

    buildPalette() {

        let palette = [];
        let r = 255,
            g = 0,
            b = 0,
            gray = 0;
        let shade = 1;

        for (let b = 30; b <= 210; b += 30) {
            for (g = 0; g <= 255; g++) {
                addToPalette(r, g, b)
            }
        }
        b = 0;
        g--;

        for (let b = 30; b <= 210; b += 30) {
            for (r = 254; r >= 0; r--) {
                addToPalette(r, g, b)
            }
        }
        b = 0;
        r++;

        for (let r = 30; r <= 210; r += 30) {
            for (b = 1; b <= 255; b++) {
                addToPalette(r, g, b)
            }
        }
        r = 0;
        b--;

        for (let r = 30; r <= 210; r += 30) {
            for (g = 254; g >= 0; g--) {
                addToPalette(r, g, b)
            }
        }
        r = 0;
        g++;

        for (let g = 30; g <= 210; g += 30) {
            for (r = 1; r <= 255; r++) {
                addToPalette(r, g, b)
            }
        }
        g = 0;
        r--;

        for (let g = 30; g <= 210; g += 30) {
            for (b = 254; b > 0; b--) {
                addToPalette(r, g, b)
            }
        }
        g = 0;
        b++;

        for (gray = 254; gray > 0; gray--) {
            addToPalette(gray, gray, gray)
        }
        gray++;

        function addToPalette(r, g, b) {
            palette.push(new BABYLON.Color3((r / 255) * shade, (g / 255) * shade, (b / 255) * shade));
        }

        // console.log('Palette: ');
        // console.log(palette);
        return palette;
    } //  end buildPalette method

    /////////////////////////
    //    Helper Methods   //
    /////////////////////////

    // Function to remap one range to another
    remap(x, oMin, oMax, nMin, nMax) {
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

        let portion = (x - oldMin) * (newMax - newMin) / (oldMax - oldMin);

        if (reverseInput) portion = (oldMax - x) * (newMax - newMin) / (oldMax - oldMin);

        let result = portion + newMin;

        if (reverseOutput) result = newMax - portion;

        return result;
    } //  end remap method

    lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    } //  end lerp method

    calculateFPS() {
        let now = Date.now();
        let difference = now - this.lastFrameTime;
        this.frameTimes.push(difference);
        if (this.frameTimes.length > 100) this.frameTimes.shift();
        let total = this.frameTimes.reduce((a, e) => a + e, 0);
        console.log(`${Math.round(this.frameTimes.length/total*1000)}FPS`);
        this.lastFrameTime = now;
    } //  end calculateFPS method

} //  end Chart class

/////////////////////////////////////////////////////////////////////////////////////////////////

class PieChart extends Chart {

    addPieSlice(options) {
        // X and Y calculations for offset animation
        let offset = .6;
        let medianAngle = options.startRotation + Math.PI * options.percent;
        let offsetX = Math.cos(medianAngle) * offset;
        let offsetZ = -Math.sin(medianAngle) * offset;
        let offsetX2 = Math.cos(medianAngle) * 6;
        let offsetZ2 = -Math.sin(medianAngle) * 6;

        // basic settings for a cylinder
        var settings = {
            height: 1,
            diameterTop: 10,
            diameterBottom: 10,
            tessellation: 40,
            arc: options.percent, // update size of slice % [0..1]
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        };

        // create the slice pieces
        var slice1 = BABYLON.MeshBuilder.CreateCylinder(options.name, settings, options.graph);
        var myPlane1 = BABYLON.MeshBuilder.CreatePlane("myPlane", {
            width: 5,
            height: 1,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        }, options.graph);
        myPlane1.position.x = 2.5;
        var myPlane2 = BABYLON.MeshBuilder.CreatePlane("myPlane", {
            width: 5,
            height: 1,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        }, options.graph);
        myPlane2.setPivotPoint(new BABYLON.Vector3(-2.5, 0, 0));
        myPlane2.rotation.y = Math.PI * options.percent * 2;
        myPlane2.position.x = 2.5;

        // build the slice
        var slice = BABYLON.Mesh.MergeMeshes([slice1, myPlane1, myPlane2]);
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


        if (this.options.shadows) {
            this.shadowGenerator.getShadowMap().renderList.push(slice);
        }

        // createLabel(slice, this.advancedTexture);

        if (this.options.label2D) {
            this.gui2D.create2DLabel.bind(this);
            this.gui2D.create2DLabel(slice, options.index, options);
        }

        this.objects.push(slice);

        // console.log(slice);
        return slice;
    } //  end addPieSlice method

    build() {

        let max_label_size = 0;
        let total_value = 0;
        let largestValue = Number.MIN_SAFE_INTEGER;
        let smallestValue = Number.MAX_SAFE_INTEGER;
        let color_index = 0;

        this.options.data.Series1.forEach(element => {
            total_value += element.value;
            if (element.value > largestValue) {
                largestValue = element.value
            }
            if (element.value < smallestValue) {
                smallestValue = element.value
            }
            max_label_size = element.label.length > max_label_size ? element.label.length : max_label_size;
        });

        let start_angle = 0;
        this.options.data.Series1.forEach(element => {
            let slice_angle = 2 * Math.PI * element.value / total_value;
            let slice = this.addPieSlice({
                graph: this.scene,
                percent: element.value / total_value,
                startRotation: start_angle,
                mat: this.materials[color_index % this.materials.length],
                name: element.label,
                value: element.value
            });

            start_angle += slice_angle;
            color_index++;
        });

    } //  end build method

} //  end PieChart class

/////////////////////////////////////////////////////////////////////////////////////////////////

class BarChart extends Chart {

    addBar(options) {

        // basic settings for a bar
        let settings = {
            width: 1,
            height: options.value,
            depth: this.options.depth ? this.options.depth : .5,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        };

        var bar;

        // create the bar
        if (this.options.round) {
            bar = BABYLON.MeshBuilder.CreateCylinder(options.name, settings, options.graph);
        } else {
            bar = BABYLON.MeshBuilder.CreateBox(options.name, settings, options.graph);
        }

        bar.position.x = options.startPosition - 6;
        bar.position.y = options.value / 2;
        bar.material = options.mat;
        bar.userData = {};
        bar.userData.myOptions = options;

        // BABYLON.ExecuteCodeAction(trigger, func, condition): Executes code.

        // OnLeftPickTrigger, OnRightPickTrigger, OnPointerOverTrigger, OnPointerOutTrigger

        bar.actionManager = new BABYLON.ActionManager(options.graph);
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
                    })
            );

        bar.actionManager
            .registerAction(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnPointerOutTrigger,
                    () => {
                        console.log('stopped hovering over ' + bar.name)
                    })
            );



        if (this.options.shadows) {
            this.shadowGenerator.getShadowMap().renderList.push(bar);
        }

        if (this.options.label2D) {
            this.gui2D.create2DLabel.bind(this);
            this.gui2D.create2DLabel(bar, options.index, options);
        }

        this.objects.push(bar);

    } // end addBar method

    build() {

        let max_label_size = 0;
        let total_value = 0;
        let largestValue = Number.MIN_SAFE_INTEGER;
        let smallestValue = Number.MAX_SAFE_INTEGER;
        let color_index = 0;

        this.options.data.Series1.forEach(element => {
            total_value += element.value;
            if (element.value > largestValue) {
                largestValue = element.value
            }
            if (element.value < smallestValue) {
                smallestValue = element.value
            }
            max_label_size = element.label.length > max_label_size ? element.label.length : max_label_size;
        });

        let start_pos = 0;
        this.options.data.Series1.forEach((element, index) => {
            // let slice_angle = 2 * Math.PI * element.value / total_value;
            let bar = this.addBar({
                graph: this.scene,
                percent: 1,
                startPosition: start_pos,
                mat: this.materials[color_index % this.materials.length],
                name: element.label,
                value: element.value,
                index: index
            });

            start_pos += 1.1;
            color_index++;
        });

    } // end build method

} //  end BarChart class

/////////////////////////////////////////////////////////////////////////////////////////////////

class LineChart extends Chart {

} //  end LineChart class

/////////////////////////////////////////////////////////////////////////////////////////////////

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

let dataSeries = {
    Series1: [],
    Series2: [],
    Series3: []
};

for (let index = 1; index <= 12; index++) {
    
    let data = {
        label: months[index].long,
        value: Math.abs(6 - index) + 2,
        details: {
            detail1: index,
            detail2: index * index,
            detail3: 1 / index
        }
    };
    dataSeries.Series1.push(data);
    dataSeries.Series2.push(data);
    dataSeries.Series3.push(data);
}



// for (let index = 11; index <= 20; index++) { dataSeries.push({label: 'label '+index, value: 15-index+6, details : { detail1: index, detail2: index*index, detail3: 1/index}})}


let barChart = new BarChart({
    type: 'bar',
    id: 'bar1', // required - id of canvas element to use
    data: dataSeries, // required - array of data objects     { label: "July", value: 100 }
    yLabel: 'Month',
    xLabel: 'Income',
        ///////////////////////
        // optional settings //
        ///////////////////////
    width: 800, // <default 300>
    height: 600, // <default 200>
        // ,shadows: false   // <default false>
    round: false, // <default false>
    depth: .6, // <default .25 >
        // ,logo: 'logo.png'
    label2D: false,
    coloredLabels: true,
    ground: false,
    cameraFirstPerson: true,
    backPlane: true,
    horizontalLabels: true,
    verticalLabels: false,
    alpha: 1,
    showScale: true,
    backgroundColor: {
        r: .7,
        g: .7,
        b: .75
    },
    normal: 'normal4.jpg',

    ucCameraSpeed: .25,
    ucCameraRotX: .05,
    ucCameraRotY: .9,
    ucCameraRotZ: 0,
    ucCameraPosX: -15,
    ucCameraPosY: 5,
    ucCameraPosZ: -10



    // ground color
    // camera distance
    // intro animation

});

let barChart2 = new BarChart({
    id: 'bar2', // required - id of canvas element to use
    data: dataSeries, // required - array of data objects     { label: "July", value: 100 }

    ///////////////////////
    // optional settings //
    ///////////////////////

    width: 800, // <default 300>
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
        r: .3,
        g: .8,
        b: 1
    },
    normal: 'normal5.jpg'


    // ground color
    // camera distance
    // intro animation

});


// let barChart3 = new BarChart({
//     id: 'bar3',     // required - id of canvas element to use
//     data: dataSeries, // required - array of data objects     { label: "July", value: 100 }

//     ///////////////////////
//     // optional settings //
//     ///////////////////////

//     width: 600,     // <default 300>
//     height: 250,    // <default 200>
//     shadows: true,   // <default false>
//     round: false,     // <default false>
//     depth: 1.35,        // <default .25 >
//     // logo: 'logo.png',
//     label2D: false,
//     coloredLabels: true,
//     ground: true,
//     cameraFirstPerson: false,
//     backPlane: true,
//     horizontalLabels:true,
//     verticalLabels: false,
//     transparent: true,
//     showScale: false,
//     cameraSpeed: 1


//     // ground color
//     // camera distance
//     // intro animation

// } );


// let barChart4 = new BarChart({
//     id: 'bar4',     // required - id of canvas element to use
//     data: dataSeries, // required - array of data objects     { label: "July", value: 100 }

//     ///////////////////////
//     // optional settings //
//     ///////////////////////

//     width: 600,     // <default 300>
//     height: 250,    // <default 200>
//     shadows: true,   // <default false>
//     round: true,     // <default false>
//     depth: 1,        // <default .25 >
//     // logo: 'logo.png',
//     label2D: false,
//     coloredLabels: true,
//     ground: false,
//     cameraFirstPerson: false,
//     backplane: false,
//     horizontalLabels:false,
//     verticalLabels: true,
//     transparent: true,
//     showScale: false,
//     cameraSpeed: 10


//     // ground color
//     // camera distance
//     // intro animation

// } );


// let pieChart = new PieChart({
//     id: 'pie',     // required - id of canvas element to use
//     data: dataSeries, // required - array of data objects     { label: "July", value: 100 }

//     ///////////////////////
//     // optional settings //
//     ///////////////////////

//     width: 450,     // <default 300>
//     height: 450,    // <default 200>
//     shadows: true,  // <default false>
//     label2D: false,
//     tansparent: false,
//     showScale: false

//     // ground color
//     // camera distance
//     // intro animation

// } );

// let lineChart = new LineChart({
//     id: 'line',     // required - id of canvas element to use
//     data: dataSeries   // required - array of data objects     { label: "July", value: 100 }

//     ///////////////////////
//     // optional settings //
//     ///////////////////////

//     ,width: 400     // <default 300>
//     ,height: 400    // <default 200>
//     ,shadows: true   // <default false>
//     ,round: true     // <default false>
//     ,depth: 1        // <default .25 >
//     // ,logo: 'logo.png'

//     // ground color
//     // camera distance
//     // intro animation

// } );