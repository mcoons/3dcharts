class Gui2DManager {
    
    constructor(par){
        this.parentThis = par;
        let parentLet = par;
        var parentVar = par;

        this.test = 'test string';

        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        this.initializeGUI();
    }

    initializeGUI(){

        this.panelOptions = new BABYLON.GUI.StackPanel();
        formatMenuPanel(this.panelOptions);
        this.panelOptions.height = '5px';
        this.panelOptions.onPointerEnterObservable.add(()=>{this.panelOptions.height= '90px'})
        this.panelOptions.onPointerOutObservable.add(()=>{this.panelOptions.height= '5px'})

        this.advancedTexture.addControl(this.panelOptions);   

        let button1 = BABYLON.GUI.Button.CreateSimpleButton("optionsButton1", "Scene Options");
        formatButton(button1);
        button1.onPointerUpObservable.add(this.sceneOptionsMenu.bind(this));
        this.panelOptions.addControl(button1);  

        let button2 = BABYLON.GUI.Button.CreateSimpleButton("optionsButton2", "Graph Options");
        formatButton(button2);
        button2.onPointerUpObservable.add(this.graphOptionsMenu.bind(this));
        this.panelOptions.addControl(button2);  

        
        let button3 = BABYLON.GUI.Button.CreateSimpleButton("optionsButton3", "Help");
        formatButton(button3);
        // button3.onPointerUpObservable.add(this.graphOptionsMenu.bind(this));
        this.panelOptions.addControl(button3);  

        

     }  //  end initializeGUI method

    sceneOptionsMenu(){
        // console.log('in scene options menu');
        // console.log(this.parentThis);

        let panelSceneOptions = new BABYLON.GUI.StackPanel();
        formatMenuPanel(panelSceneOptions);
        panelSceneOptions.height = '150px';

        this.advancedTexture.addControl(panelSceneOptions);   

        let buttonCameraOptions = BABYLON.GUI.Button.CreateSimpleButton('scene options 1', 'Camera');
        formatButton(buttonCameraOptions);
        // buttonCameraOptions.onPointerUpObservable.add(this.sceneOptionsMenu);
        panelSceneOptions.addControl(buttonCameraOptions);  

        let buttonLightsOptions = BABYLON.GUI.Button.CreateSimpleButton('scene options 2', 'Lights');
        formatButton(buttonLightsOptions);
        // buttonLightsOptions.onPointerUpObservable.add(this.graphOptionsMenu);
        panelSceneOptions.addControl(buttonLightsOptions);  

        let buttonGroundOptions = BABYLON.GUI.Button.CreateSimpleButton('scene options 2', 'Ground');
        formatButton(buttonGroundOptions);
        // buttonGroundOptions.onPointerUpObservable.add(this.graphOptionsMenu);
        panelSceneOptions.addControl(buttonGroundOptions);  

        let buttonBackgroundOptions = BABYLON.GUI.Button.CreateSimpleButton('scene options 2', 'Background');
        formatButton(buttonBackgroundOptions);
        // buttonBackgroundOptions.onPointerUpObservable.add(this.graphOptionsMenu);
        panelSceneOptions.addControl(buttonBackgroundOptions);  

        let buttonBack = BABYLON.GUI.Button.CreateSimpleButton('options back button', 'Back');
        formatButton(buttonBack);
        buttonBack.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelSceneOptions)});
        panelSceneOptions.addControl(buttonBack);  
    }




    graphOptionsMenu(){
        // console.log('in graph options menu')
        // console.log(this.test);

        let panelData = {
                            title: 'Panel Title',
                            buttons: {  
                                        'graph options 1':  {   
                                                                text: 'Title',
                                                                callback: this.thirdLevel.bind(this)
                                                            },
                                        'graph options 2':  {   
                                                                text: 'Graph Type',
                                                                callback: this.thirdLevel.bind(this)
                                                            },
                                        'graph options 2':  {   
                                                                text: 'Labels',
                                                                callback: this.thirdLevel.bind(this)
                                                            },
                                        'graph options 2':  {   
                                                                text: 'Save/DL',
                                                                callback: this.thirdLevel.bind(this)
                                                            }
                                     }
                        }
    

        let panelGraphOptions = new BABYLON.GUI.StackPanel();
        formatMenuPanel(panelGraphOptions);
        panelGraphOptions.height = '150px';

        this.advancedTexture.addControl(panelGraphOptions);   

        let buttonTitleOption = BABYLON.GUI.Button.CreateSimpleButton('graph options 1', 'Title');
        formatButton(buttonTitleOption);
        buttonTitleOption.onPointerUpObservable.add(this.thirdLevel.bind(this));
        panelGraphOptions.addControl(buttonTitleOption);  

        let buttonGraphType = BABYLON.GUI.Button.CreateSimpleButton('graph options 2', 'Graph Type');
        formatButton(buttonGraphType);
        buttonGraphType.onPointerUpObservable.add(this.thirdLevel.bind(this));
        panelGraphOptions.addControl(buttonGraphType);  

        let buttonLabelOptions = BABYLON.GUI.Button.CreateSimpleButton('graph options 2', 'Labels');
        formatButton(buttonLabelOptions);
        buttonLabelOptions.onPointerUpObservable.add(this.thirdLevel.bind(this));
        panelGraphOptions.addControl(buttonLabelOptions);  

        let buttonDownload = BABYLON.GUI.Button.CreateSimpleButton('graph options 2', 'Save/DL');
        formatButton(buttonDownload);
        buttonDownload.onPointerUpObservable.add(() =>{BABYLON.Tools.CreateScreenshot(this.parentThis.engine, this.parentThis.scene.cameras, 200)});
        buttonDownload.onPointerUpObservable.add(() =>{console.log(this.parentThis.engine)});
        buttonDownload.onPointerUpObservable.add(() =>{console.log(this.parentThis.scene.cameras[0])});
        panelGraphOptions.addControl(buttonDownload);  

        let buttonBack = BABYLON.GUI.Button.CreateSimpleButton('options back button', 'Back');
        formatButton(buttonBack);
        buttonBack.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelGraphOptions)});
        panelGraphOptions.addControl(buttonBack); 
    }

    thirdLevel(){
        // console.log('in third level menu')
        // console.log(this.test);
        // console.log(this.parentThis); 

        let thirdGraphOptions = new BABYLON.GUI.StackPanel();
        formatMenuPanel(thirdGraphOptions);
        thirdGraphOptions.height = '150px';


        this.advancedTexture.addControl(thirdGraphOptions);   

        let buttonGraphOption1 = BABYLON.GUI.Button.CreateSimpleButton('2D labels', '2D Labels');
        formatButton(buttonGraphOption1);
        buttonGraphOption1.onPointerUpObservable.add(()=>{ this.parentThis.options.label2D = !this.parentThis.options.label2D });
        thirdGraphOptions.addControl(buttonGraphOption1);  

        let buttonGraphOption2 = BABYLON.GUI.Button.CreateSimpleButton('brightness', 'Brightness');
        formatButton(buttonGraphOption2);
        buttonGraphOption2.onPointerUpObservable.add(() => { this.parentThis.scene.lights[1].intensity = (this.parentThis.scene.lights[1].intensity > .2 ? .2 : .65)});
        thirdGraphOptions.addControl(buttonGraphOption2);  

        let buttonBack = BABYLON.GUI.Button.CreateSimpleButton('options back button', 'Back');
        formatButton(buttonBack);
        buttonBack.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(thirdGraphOptions)});
        thirdGraphOptions.addControl(buttonBack); 
    }



    addGrid(){
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        var displayGrid = new BABYLON.GUI.DisplayGrid();
        displayGrid.width = "50px";
        displayGrid.height = "50px";
        displayGrid.zIndex = 5;
        advancedTexture.addControl(displayGrid);  
    }

    addColorPanel(options){
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        advancedTexture.layer.layerMask = 2;
    
        var panel3 = new BABYLON.GUI.StackPanel();
            panel3.width = "160px";
            panel3.fontSize = "14px";
            panel3.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            panel3.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            panel3.cornerRadius = 10;
            panel3.thickness = 1;
            panel3.color = 'black';
            panel3.cornerRadius = options.radius ? options.radius : 5;
            panel3.background = options.backgroundColor ? optiopns.backgroundColor : "white";
        advancedTexture.addControl(panel3);   
    
        var picker = new BABYLON.GUI.ColorPicker();
            picker.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            // picker.value = sphereMaterial.diffuseColor;
            picker.height = "150px";
            picker.width = "150px";
            picker.onValueChangedObservable.add(function(value) { // value is a color3
                // sphereMaterial.diffuseColor = value;
                console.log(value);
            });    
        panel3.addControl(picker);  
    }

    create2DLabel(mesh, index, options) {

// console.log(this.parentThis.labels2D);

        var label = new BABYLON.GUI.Rectangle("label for " + mesh.name);
        label.background = "white"
        label.height = "15px";
        // label.alpha = 0.5;
        label.width = "70px";
        label.cornerRadius = 10;
        label.thickness = 1;
        label.color = 'black';
        if ((index%2) == 0){ // even
            if ((index%4) === 0) {
                label.linkOffsetY = -50;
            } else {
                label.linkOffsetY = -25;
            }
        } else { // odd
            if (((index-1)%4) === 0) {
                label.linkOffsetY = 50;
            } else {
                label.linkOffsetY = 25;
            }            }
        // label.linkOffsetY = 50 * (index %2 ? -1 : 1) * (index%4 ? 2:1); 
        label.zIndex = -10;
        this.advancedTexture.addControl(label); 
        label.linkWithMesh(mesh);

        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = options.name +' - '+options.value;
        text1.color = "black";
        text1.fontSize = 10;

        label.addControl(text1);  

        this.parentThis.labels2D.push(label);


        var line = new BABYLON.GUI.Line();
        // line.alpha = 0.5;
        line.lineWidth = 2;
        // line.dash = [5, 10];
        line.zIndex = -15;
        line.color = 'black';
        this.advancedTexture.addControl(line); 
        line.linkWithMesh(mesh);
        line.connectedControl = label;

        this.parentThis.labels2D.push(line);

    
        var endRound = new BABYLON.GUI.Ellipse();
        endRound.width = "5px";
        endRound.background = "black";
        endRound.zIndex = -15;
        endRound.height = "5px";
        endRound.color = "black";
        this.advancedTexture.addControl(endRound);
        endRound.linkWithMesh(mesh);

        this.parentThis.labels2D.push(endRound);

    }  // end createLabel function


}

function formatButton(button){
    button.width  =  "100px"
    button.height =  "30px";
    button.color    =  "black";
    button.fontSize =  10;
    button.paddingTop    =  5;
    button.paddingBottom =  5;
    // button.paddingLeft   =  5;
    // button.paddingRight  =  5;

    button.cornerRadius =  5;
    button.background =  "white";
}

function formatMenuPanel(panel){
    panel.width = "120px";
    panel.height = "90px";
    panel.cornerRadius = 10;
    panel.thickness = 1;
    panel.color = 'black';
    panel.background = "lightgray";
    // panel.paddingTop    =  25;
    // panel.paddingLeft    =  25;
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    // panel.paddingBottom =  5;
    // panel.paddingLeft   =  5;
    // panel.paddingRight  =  5;
}

function downloadImage(dlLink, canvas) {
    dlLink.href = canvas.toDataURL('image/png');
    dlLink.download = 'myGraph.png'
  };