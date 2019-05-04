// This is a canvas based class to support charts
// TODO: Implement state object
//       Implement defaults object
//       Add horitontal and vertical bars option


class Chart {

    constructor(options) {
        this.options = options;
    
        let sampleOptions = {
            id: 'bar1',          // required - id of canvas element to use
            data: dataSet        // required - array of data objects     { label: "July", value: 100 }
            
            ///////////////////////
            // optional settings //
            ///////////////////////
        
            ,width: 500          // <default 300>
            ,height: 300         // <default 200>
            ,shadows: false      // <default false>
            ,round: false        // <default false>
            ,depth: .25          // <default .25 >
            ,logo: 'logo.png'
        
            // ,groundColor
            // ,cameraDistance
            // ,introAnimation
        }

        this.state = {

        };

        this.defaults = {
            camera : {
                cameraTargetPosition: new BABYLON.Vector3(0,0,0)
            },
            button: {

            }
        }

        let canvas = document.getElementById(this.options.id);
            canvas.width = this.options.width ? this.options.width : 300;
            canvas.height = this.options.height ? this.options.height : 200;

        let engine = new BABYLON.Engine(canvas, true);

        this.createScene.bind(this);
        this.scene = this.createScene(canvas);

        this.buildMaterials.bind(this);
        this.materials = this.buildMaterials(this.options.data.length, this.scene);


        let guiManager = new BABYLON.GUI.GUI3DManager(this.scene);
        
        // this.lastFrameTime = Date.now();
        // this.frameTimes = [];

        this.initializeGUI.bind(this);
        this.initializeGUI();

        this.build.bind(this);
        this.build();
        
        let myScene = this.scene;
        engine.runRenderLoop(function () {
            myScene.render();
        });

    }  //  end constructor
    
    createScene(canvas) {

        let scene = new BABYLON.Scene(this.engine);
            scene.clearColor = new BABYLON.Color3(1, 1, 1); 
            
        let camera = new BABYLON.ArcRotateCamera("Camera", 3*Math.PI/2, .8, 18, new BABYLON.Vector3(0, 0, 0), scene);
            camera.lowerRadiusLimit = 5;
            camera.upperRadiusLimit = 40;
            camera.lowerAlphaLimit = Math.PI;
            camera.upperAlphaLimit = Math.PI*2;
            camera.lowerBetaLimit = 0;
            camera.upperBetaLimit = Math.PI/2;
            scene.activeCamera.attachControl(canvas);

        let light0 = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(100, 100, 20), scene);
            light0.intensity = .015;
        
        let light1 = new BABYLON.PointLight("light1", new BABYLON.Vector3(-100, 80, -50), scene);
            light1.intensity = .65;        
        
        let light = new BABYLON.PointLight("light1", new BABYLON.Vector3(100, 80, -50), scene);
            light.intensity = .95;
            
        let ground = BABYLON.MeshBuilder.CreateGround("myGround", {width: 500, height: 500, subdivisions: 40}, scene);
            ground.receiveShadows = true;
        

        // apply scene options here

        if (this.options.shadows){
            this.shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
            this.shadowGenerator.setDarkness(0.5);
            this.shadowGenerator.usePoissonSampling = true;
        }

        if (this.options.logo){
            var logoMaterial = new BABYLON.StandardMaterial("logoMaterial", scene);
                logoMaterial.diffuseTexture = new BABYLON.Texture("/logo.png", scene);
                logoMaterial.diffuseTexture.hasAlpha = true;
                logoMaterial.diffuseTexture.uScale = 100.0;
                logoMaterial.diffuseTexture.vScale = 100.0;

            let logoOverlay = BABYLON.MeshBuilder.CreateGround("logoOverlay", {width: 500, height: 500, subdivisions: 40}, scene);
                logoOverlay.receiveShadows = true; 
                logoOverlay.material = logoMaterial;
        }

        // this.materials = this.buildMaterials(this.options.data.length, scene);

        return scene;

    }  //  end createScene method
    
    build(){
        console.log(' ---- default build: please override with a custom build method ----');
    }  //  end build method

    /////////////////////////
    //     GUI methods     //
    /////////////////////////

    initializeGUI(){

        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // var rect1 = new BABYLON.GUI.Rectangle();
        // rect1.width = 0.15;
        // rect1.height = "30px";
        // rect1.cornerRadius = 2;
        // // rect1.color = "Black";
        // rect1.thickness = 1;
        // rect1.background = "white";
        // advancedTexture.addControl(rect1);
        
        // var label = new BABYLON.GUI.TextBlock();
        // label.text = "January";
        // label.fontSize = 10;
        // rect1.addControl(label);
        
        // rect1.linkWithMesh(ground);   
        // rect1.linkOffsetY = -50;
        
        function buttonClick () {
            alert("Options Clicked!!");
        }

        let buttonOptions = {};
        this.addButton("optionsButton", "Options", buttonClick, buttonOptions);

 
    }  //  end initializeGUI method

    addButton (id, text, callBack, options){

        let button = BABYLON.GUI.Button.CreateSimpleButton(id, text);
            button.width = "100px"
            button.height = "20px";
            button.color = "black";
            button.fontSize = 10;
            button.paddingTop = 5;
            button.paddingLeft = 5;
        
            button.cornerRadius = 5;
            button.background = "white";
            button.onPointerUpObservable.add(callBack);

            button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

        this.advancedTexture.addControl(button);  

    } //  end addButton method

    /////////////////////////
    //   Palette Methods   //
    /////////////////////////

    // Build an array of materials[count]
    
    buildMaterials (count) {

        let palette = this.buildPalette();
        let materials = [];

        for (let index = 0; index < count; index++) {
            let paletteIndex = this.remap(index, 0, count, 0, palette.length-1);

            let mat = new BABYLON.StandardMaterial("mat"+index, this.scene);
                mat.diffuseColor = palette[Math.round(paletteIndex)];
                mat.sideOrientation = BABYLON.Mesh.DOUBLESIDE ;

            materials.push(mat);        
        }

        return materials;
    }  //  end buildMaterials method

    // Build a palette array[1530] of colors

    buildPalette() {

        let palette = [];
        let r = 255, g = 0, b = 0, gray = 0;
        let shade = 1;

        for (let b = 30; b <= 210; b+=30) {
        for (g = 0; g <= 255; g++) { 
                addToPalette(r, g, b) 
            }
        }
        b = 0;
        g--;

        for (let b = 30; b <= 210; b+=30) {
        for (r = 254; r >= 0; r--) {             
                addToPalette(r, g, b) 
            }
        }
        b = 0;
        r++;

        for (let r = 30; r <= 210; r+=30) {
        for (b = 1; b <= 255; b++) {             
                addToPalette(r, g, b) 
            }
        }
            r = 0;
        b--;

        for (let r = 30; r <= 210; r+=30) {
        for (g = 254; g >= 0; g--) {             
                addToPalette(r, g, b) 
            }
        }
            r = 0;
        g++;

        for (let g = 30; g <= 210; g+=30) {
        for (r = 1; r <= 255; r++) {             
                addToPalette(r, g, b) 
            }
        }
            g = 0;
        r--;

        for (let g = 30; g <= 210; g+=30) {
        for (b = 254; b > 0; b--) {             
                addToPalette(r, g, b) 
            }
        }
            g = 0;
        b++;

        for (gray = 254; gray > 0; gray--) { addToPalette(gray, gray, gray) }
        gray++;

        function addToPalette(r, g, b) {
            palette.push(new BABYLON.Color3( (r/255)*shade, (g/255)*shade, (b/255)*shade) );
        }

        // console.log('Palette: ');
        // console.log(palette);
        return palette;
    }  //  end buildPalette method

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
    }  //  end remap method

    lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }  //  end lerp method

    calculateFPS() {
        let now = Date.now();
        let difference = now - this.lastFrameTime;
        this.frameTimes.push(difference);
        if (this.frameTimes.length > 100) this.frameTimes.shift();
        let total = this.frameTimes.reduce( (a,e) => a+e, 0);
        console.log(`${Math.round(this.frameTimes.length/total*1000)}FPS`);
        this.lastFrameTime = now;
    }  //  end calculateFPS method

}  //  end Chart class

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
        var myPlane1 = BABYLON.MeshBuilder.CreatePlane("myPlane", {width: 5, height: 1, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, options.graph);
            myPlane1.position.x = 2.5;
        var myPlane2 = BABYLON.MeshBuilder.CreatePlane("myPlane", {width: 5, height: 1, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, options.graph);
            myPlane2.setPivotPoint(new BABYLON.Vector3(-2.5,0,0));
            myPlane2.rotation.y = Math.PI * options.percent*2;
            myPlane2.position.x = 2.5;

        // build the slice
        var slice = BABYLON.Mesh.MergeMeshes([slice1, myPlane1, myPlane2]);
            slice.material = options.mat;
            slice.rotation.y = options.startRotation; // rotation location in pie
            // slice.visibility = .75;
            slice.userData = {};
            slice.userData.test1 = 'testing123';
            slice.userData.test2 = 'testing321';
            slice.userData.test3 = 'testingxyz';
            slice.userData.test4 = 100;
            slice.userData.test5 = slice.material;
            slice.userData.test6 = 100.000001;
            
            /////// Add Actions
            slice.actionManager = new BABYLON.ActionManager(options.graph);
            

        
        // slice.actionManager.registerAction(
        //     new BABYLON.InterpolateValueAction(
        //         BABYLON.ActionManager.OnPointerOverTrigger,
        //         slice,
        //         'scaling',
        //         new BABYLON.Vector3(1.1, 1, 1.1),
        //         100
        //     )
        // );
    
        // slice.actionManager.registerAction(
        //     new BABYLON.InterpolateValueAction(
        //         BABYLON.ActionManager.OnPointerOutTrigger,
        //         slice,
        //         'scaling',
        //         new BABYLON.Vector3(1, 1, 1),
        //         100
        //     )
        // );
    
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
    
        var basePosition = slice.position; 

        slice.actionManager.registerAction(
            new BABYLON.InterpolateValueAction(
                BABYLON.ActionManager.OnPointerOutTrigger,
                slice,
                'position',
                basePosition,
                100
            )
        );
    


        if (this.options.shadows){
            this.shadowGenerator.getShadowMap().renderList.push(slice);
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////
        ///// Add Label
        // var path = [
        //     new BABYLON.Vector3(0, 0, 0),
        //     new BABYLON.Vector3(Math.cos(Math.PI * options.percent) * 6 , 0, -Math.sin(Math.PI * options.percent) * 6 ),
        //     new BABYLON.Vector3(Math.cos(Math.PI * options.percent) * 6 , 0, -Math.sin(Math.PI * options.percent) * 6 )
        // ];
        // var tube = BABYLON.MeshBuilder.CreateTube("tube", {path: path, radius: 0.05}, options.graph);
        // tube.parent = slice;
        /////////////////////////////////////////////////////////////////////////////////////////////////
        
        function createLabel(mesh, gui) {
            var label = new BABYLON.GUI.Rectangle("label for " + mesh.name);
            label.background = "white"
            label.height = "15px";
            // label.alpha = 0.5;
            label.width = "75px";
            label.cornerRadius = 10;
            label.thickness = 1;
            // label.linkOffsetX = offsetX * 150;
            // label.linkOffsetY = offsetZ * 150;
            // label.linkOffsetZ = offsetZ * 150;
            gui.addControl(label); 
            label.linkWithMesh(mesh);
    
            var text1 = new BABYLON.GUI.TextBlock();
            text1.text = options.name;
            text1.color = "black";
            text1.fontSize = 10;

            label.addControl(text1);  
        }  

        createLabel(slice, this.advancedTexture);



        // console.log(slice);
        return slice;
    }  //  end addPieSlice method

    build(){

        let max_label_size = 0;
        let total_value = 0;
        let largestValue = Number.MIN_SAFE_INTEGER;
        let smallestValue = Number.MAX_SAFE_INTEGER;
        let color_index = 0;
        
        this.options.data.forEach(element => {
            total_value += element.value;
            if (element.value > largestValue) {largestValue = element.value} 
            if (element.value < smallestValue) {smallestValue = element.value} 
            max_label_size = element.label.length > max_label_size ? element.label.length : max_label_size;
        });
    
        let start_angle = 0;
        this.options.data.forEach(element => {
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

    }  //  end build method

}  //  end PieChart class

/////////////////////////////////////////////////////////////////////////////////////////////////

class BarChart extends Chart {

    addBar(options){

        // basic settings for a bar
        let settings = {
            width: 1,
            height: options.data,
            depth: this.options.depth ? this.options.depth : .25,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        };
        
        var bar;

        // create the bar
        if (this.options.round) { 
            bar = BABYLON.MeshBuilder.CreateCylinder(options.name, settings, options.graph);
        } else {
            bar = BABYLON.MeshBuilder.CreateBox(options.name, settings, options.graph);
        }
        
        bar.position.x = options.startPosition - 10.5;
        bar.material = options.mat;

        if (this.options.shadows){
            this.shadowGenerator.getShadowMap().renderList.push(bar);
        }

        function createLabel(mesh, gui) {
            var label = new BABYLON.GUI.Rectangle("label for " + mesh.name);
            label.background = "white"
            label.height = "15px";
            // label.alpha = 0.5;
            label.width = "75px";
            label.cornerRadius = 10;
            label.thickness = 1;
            label.linkOffsetY = 50;
            gui.addControl(label); 
            label.linkWithMesh(mesh);
    
            var text1 = new BABYLON.GUI.TextBlock();
            text1.text = options.name;
            text1.color = "black";
            text1.fontSize = 10;

            label.addControl(text1);  

        }  // end createLabel function

        createLabel(bar, this.advancedTexture);

    }  // end addBar method

    build(){

        let max_label_size = 0;
        let total_value = 0;
        let largestValue = Number.MIN_SAFE_INTEGER;
        let smallestValue = Number.MAX_SAFE_INTEGER;
        let color_index = 0;
        
        this.options.data.forEach(element => {
            total_value += element.value;
            if (element.value > largestValue) {largestValue = element.value} 
            if (element.value < smallestValue) {smallestValue = element.value} 
            max_label_size = element.label.length > max_label_size ? element.label.length : max_label_size;
        });
    
        let start_pos = 0;
        this.options.data.forEach(element => {
            // let slice_angle = 2 * Math.PI * element.value / total_value;
            let bar = this.addBar({
                graph: this.scene,
                percent: 1,
                startPosition: start_pos,
                mat: this.materials[color_index % this.materials.length],
                name: element.label,
                value: element.value
            });
    
            start_pos += 1.1;
            color_index++;
        });
        
    }  // end build method

}  //  end BarChart class

/////////////////////////////////////////////////////////////////////////////////////////////////

class LineChart extends Chart {

}  //  end LineChart class

/////////////////////////////////////////////////////////////////////////////////////////////////

let dataSet = [];
for (let index = 1; index < 10; index++) { dataSet.push({label: 'label '+index, value: 50, details : { detail1: index, detail2: index*index, detail3: 1/index}})}
for (let index = 1; index < 10; index++) { dataSet.push({label: 'label '+index, value: 25, details : { detail1: index, detail2: index*index, detail3: 1/index}})}

let pieChart = new PieChart({
    id: 'pie',     // required - id of canvas element to use
    data: dataSet, // required - array of data objects     { label: "July", value: 100 }

    ///////////////////////
    // optional settings //
    ///////////////////////

    width: 500,     // <default 300>
    height: 300,    // <default 200>
    shadows: true   // <default false>

    // ground color
    // camera distance
    // intro animation

} );

let barChart = new BarChart({
    id: 'bar1',     // required - id of canvas element to use
    data: dataSet // required - array of data objects     { label: "July", value: 100 }
    
    ///////////////////////
    // optional settings //
    ///////////////////////

    ,width: 500     // <default 300>
    ,height: 300    // <default 200>
    // ,shadows: false   // <default false>
    ,round: false    // <default false>
    ,depth: .25       // <default .25 >
    // ,logo: 'logo.png'

    // ground color
    // camera distance
    // intro animation

} );

let barChart2 = new BarChart({
    id: 'bar2',     // required - id of canvas element to use
    data: dataSet, // required - array of data objects     { label: "July", value: 100 }

    ///////////////////////
    // optional settings //
    ///////////////////////

    width: 500,     // <default 300>
    height: 300,    // <default 200>
    shadows: true,   // <default false>
    round: true,     // <default false>
    depth: 1,        // <default .25 >
    logo: 'logo.png'

    // ground color
    // camera distance
    // intro animation

} );

let lineChart = new LineChart({
    id: 'line',     // required - id of canvas element to use
    data: dataSet   // required - array of data objects     { label: "July", value: 100 }

    ///////////////////////
    // optional settings //
    ///////////////////////

    ,width: 500     // <default 300>
    ,height: 300    // <default 200>
    ,shadows: true   // <default false>
    ,round: true     // <default false>
    ,depth: 1        // <default .25 >
    // ,logo: 'logo.png'

    // ground color
    // camera distance
    // intro animation
    
} );
        