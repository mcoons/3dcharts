class Gui2DManager {
    
    constructor(par){
        this.parentThis = par;

        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        this.initializeGUI();
    
        console.log(this.parentThis.scene.meshes[0])

        // this.showDetails();
        this.addColorPanel(this.parentThis.objects[1]);
    }

    initializeGUI(){

        this.panelOptions = new BABYLON.GUI.StackPanel();
        formatMenuPanel(this.panelOptions);
        this.panelOptions.height = '5px';
        this.panelOptions.onPointerEnterObservable.add(()=>{this.panelOptions.height= '90px'})
        this.panelOptions.onPointerOutObservable.add(()=>{this.panelOptions.height= '5px'})

        this.advancedTexture.addControl(this.panelOptions);   

        let buttonSceneOptions = BABYLON.GUI.Button.CreateSimpleButton("scene options button", "Scene Options");
        formatButton(buttonSceneOptions);
        buttonSceneOptions.onPointerUpObservable.add(this.menuSceneOptions.bind(this));
        this.panelOptions.addControl(buttonSceneOptions);  

        let buttonGraphOptions = BABYLON.GUI.Button.CreateSimpleButton("graph options button", "Graph Options");
        formatButton(buttonGraphOptions);
        buttonGraphOptions.onPointerUpObservable.add(this.menuGraphOptions.bind(this));
        this.panelOptions.addControl(buttonGraphOptions);  

        
        let button3 = BABYLON.GUI.Button.CreateSimpleButton("help button", "Help");
        formatButton(button3);
        // button3.onPointerUpObservable.add(this.menuGraphOptions.bind(this));
        this.panelOptions.addControl(button3);  

     }  //  end initializeGUI method

    menuSceneOptions(){

        let panelSceneOptions = new BABYLON.GUI.StackPanel();
        formatMenuPanel(panelSceneOptions);
        this.advancedTexture.addControl(panelSceneOptions);   

        let buttonCameraOptions = BABYLON.GUI.Button.CreateSimpleButton('camera options button', 'Camera');
        formatButton(buttonCameraOptions);
        buttonCameraOptions.onPointerUpObservable.add(this.menuCameraOptions.bind(this));
        panelSceneOptions.addControl(buttonCameraOptions);  

        let buttonLightsOptions = BABYLON.GUI.Button.CreateSimpleButton('light options button', 'Lights');
        formatButton(buttonLightsOptions);
        buttonLightsOptions.onPointerUpObservable.add(this.menuLightOptions.bind(this));
        panelSceneOptions.addControl(buttonLightsOptions);  

        let buttonGroundOptions = BABYLON.GUI.Button.CreateSimpleButton('ground options button', 'Ground');
        formatButton(buttonGroundOptions);
        buttonGroundOptions.onPointerUpObservable.add(this.menuGroundOptions.bind(this));
        panelSceneOptions.addControl(buttonGroundOptions);  

        let buttonBackgroundOptions = BABYLON.GUI.Button.CreateSimpleButton('background options button', 'Background');
        formatButton(buttonBackgroundOptions);
        buttonBackgroundOptions.onPointerUpObservable.add(this.menuBackgroundOptions.bind(this));
        panelSceneOptions.addControl(buttonBackgroundOptions);  

        let buttonBack = BABYLON.GUI.Button.CreateSimpleButton('scene options back button', 'Back');
        formatButton(buttonBack);
        buttonBack.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelSceneOptions)});
        panelSceneOptions.addControl(buttonBack);  

    }

    menuCameraOptions(){

        let panelCameraOptions = new BABYLON.GUI.StackPanel();
        formatMenuPanel(panelCameraOptions);
        this.advancedTexture.addControl(panelCameraOptions);  

        //// camera speed ////

        var header = new BABYLON.GUI.TextBlock();
        header.text = "Camera Speed: 2";
        header.height = "18px";
        header.color = "white";
        header.color    =  "black";
        header.fontSize =  10;
        panelCameraOptions.addControl(header); 
    
        var slider = new BABYLON.GUI.Slider();
        slider.minimum = .5;
        slider.maximum = 5;
        slider.value = 2;
        slider.step = .5;

        slider.thumbWidth = '15px';        
        slider.thumbHeight = '15px';

        slider.height = "12px";
        slider.width = "100px";

        slider.onValueChangedObservable.add((value) => {
            header.text = "Camera Speed: " + value;
            this.parentThis.scene.cameras[0].speed = value
        });
        panelCameraOptions.addControl(slider);    






        let positioning = BABYLON.GUI.Button.CreateSimpleButton('positioning options button', 'Position Camera');
        formatButton(positioning);
        // positioning.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelCameraOptions)});
        panelCameraOptions.addControl(positioning); 

        let cameraType = BABYLON.GUI.Button.CreateSimpleButton('camera type  button', 'Camera Target');
        formatButton(cameraType);
        // cameraType.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelCameraOptions)});
        panelCameraOptions.addControl(cameraType); 

        // let buttonGeneric = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Field of View');
        // formatButton(buttonGeneric);
        // // buttonGeneric.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelCameraOptions)});
        // panelCameraOptions.addControl(buttonGeneric); 

        let buttonGeneric2 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Lock Camera');
        formatButton(buttonGeneric2);
        // buttonGeneric2.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelCameraOptions)});
        panelCameraOptions.addControl(buttonGeneric2); 

        let buttonBack = BABYLON.GUI.Button.CreateSimpleButton('camera options back button', 'Back');
        formatButton(buttonBack);
        buttonBack.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelCameraOptions)});
        panelCameraOptions.addControl(buttonBack); 

    }

    menuLightOptions(){

        let panelLightOptions = new BABYLON.GUI.StackPanel();
        formatMenuPanel(panelLightOptions);
        this.advancedTexture.addControl(panelLightOptions);  

        //// brightness////

        var header = new BABYLON.GUI.TextBlock();
        header.text = "Brightness: 1x";
        header.height = "18px";
        header.color = "white";
        header.color    =  "black";
        header.fontSize =  10;
        panelLightOptions.addControl(header); 
    
        var slider = new BABYLON.GUI.Slider();
        slider.minimum = 0;
        slider.maximum = 2;
        slider.value = 1;
        slider.step = .1;

        slider.thumbWidth = '15px';        
        slider.thumbHeight = '15px';

        slider.height = "12px";
        slider.width = "100px";

        slider.onValueChangedObservable.add((value) => {
            header.text = "Brightness: " + value +'x';
            this.parentThis.scene.lights.forEach(light => light.intensity = value )
        });
        panelLightOptions.addControl(slider);   








        let buttonGeneric = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric);
        // buttonGeneric.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelLightOptions)});
        panelLightOptions.addControl(buttonGeneric); 

        let buttonGeneric2 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric2);
        // buttonGeneric2.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelLightOptions)});
        panelLightOptions.addControl(buttonGeneric2); 

        let buttonGeneric3 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric3);
        // buttonGeneric3.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelLightOptions)});
        panelLightOptions.addControl(buttonGeneric3); 

        let buttonBack = BABYLON.GUI.Button.CreateSimpleButton('light options back button', 'Back');
        formatButton(buttonBack);
        buttonBack.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelLightOptions)});
        panelLightOptions.addControl(buttonBack);    

    }

    menuGroundOptions(){

        let panelGroundOptions = new BABYLON.GUI.StackPanel();
        formatMenuPanel(panelGroundOptions);
        this.advancedTexture.addControl(panelGroundOptions);  

        let buttonGeneric = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric);
        // buttonGeneric.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelGroundOptions)});
        panelGroundOptions.addControl(buttonGeneric); 

        let buttonGeneric2 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric2);
        // buttonGeneric2.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelGroundOptions)});
        panelGroundOptions.addControl(buttonGeneric2); 

        let buttonGeneric3 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric3);
        // buttonGeneric3.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelGroundOptions)});
        panelGroundOptions.addControl(buttonGeneric3); 

        let buttonGeneric4 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric4);
        // buttonGeneric4.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelGroundOptions)});
        panelGroundOptions.addControl(buttonGeneric4); 

        let buttonBack = BABYLON.GUI.Button.CreateSimpleButton('ground options back button', 'Back');
        formatButton(buttonBack);
        buttonBack.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelGroundOptions)});
        panelGroundOptions.addControl(buttonBack);   

    }

    menuBackgroundOptions(){

        let panelBackgroundOptions = new BABYLON.GUI.StackPanel();
        formatMenuPanel(panelBackgroundOptions);
        this.advancedTexture.addControl(panelBackgroundOptions);  

        let buttonGeneric = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric);
        // buttonGeneric.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelBackgroundOptions)});
        panelBackgroundOptions.addControl(buttonGeneric); 

        let buttonGeneric2 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric2);
        // buttonGeneric2.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelBackgroundOptions)});
        panelBackgroundOptions.addControl(buttonGeneric2); 

        let buttonGeneric3 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric3);
        // buttonGeneric3.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelBackgroundOptions)});
        panelBackgroundOptions.addControl(buttonGeneric3); 

        let buttonGeneric4 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric4);
        // buttonGeneric4.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelBackgroundOptions)});
        panelBackgroundOptions.addControl(buttonGeneric4); 

        let buttonBack = BABYLON.GUI.Button.CreateSimpleButton('background options back button', 'Back');
        formatButton(buttonBack);
        buttonBack.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelBackgroundOptions)});
        panelBackgroundOptions.addControl(buttonBack); 

    }

    menuGraphOptions(){

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
        this.advancedTexture.addControl(panelGraphOptions);   

        let buttonTitleOptions = BABYLON.GUI.Button.CreateSimpleButton('title options button', 'Title');
        formatButton(buttonTitleOptions);
        buttonTitleOptions.onPointerUpObservable.add(this.menuTitleOptions.bind(this));
        panelGraphOptions.addControl(buttonTitleOptions);  

        let buttonGraphType = BABYLON.GUI.Button.CreateSimpleButton('graph type button', 'Graph Type');
        formatButton(buttonGraphType);
        buttonGraphType.onPointerUpObservable.add(this.menuGraphType.bind(this));
        panelGraphOptions.addControl(buttonGraphType);  

        let buttonLabelOptions = BABYLON.GUI.Button.CreateSimpleButton('label options button', 'Labels');
        formatButton(buttonLabelOptions);
        buttonLabelOptions.onPointerUpObservable.add(this.menuLabelOptions.bind(this));
        panelGraphOptions.addControl(buttonLabelOptions);  

        // let buttonDownload = BABYLON.GUI.Button.CreateSimpleButton('download button', 'Save/DL');
        // formatButton(buttonDownload);
        // buttonDownload.onPointerUpObservable.add(() =>{BABYLON.Tools.CreateScreenshotUsingRenderTarget(this.parentThis.engine, this.parentThis.scene.cameras[0],  { width: this.parentThis.options.width, height: this.parentThis.options.height })});
        // panelGraphOptions.addControl(buttonDownload);  

        let buttonDLOptions = BABYLON.GUI.Button.CreateSimpleButton('label options button', 'Download');
        formatButton(buttonDLOptions);
        buttonDLOptions.onPointerUpObservable.add(this.menuDLOptions.bind(this));
        panelGraphOptions.addControl(buttonDLOptions);  

        let buttonBack = BABYLON.GUI.Button.CreateSimpleButton('options back button', 'Back');
        formatButton(buttonBack);
        buttonBack.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelGraphOptions)});
        panelGraphOptions.addControl(buttonBack); 

    }


    menuTitleOptions(){

        let panelTitleOptions = new BABYLON.GUI.StackPanel();
        formatMenuPanel(panelTitleOptions);
        this.advancedTexture.addControl(panelTitleOptions);  

        let buttonGeneric = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric);
        // buttonGeneric.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelTitleOptions)});
        panelTitleOptions.addControl(buttonGeneric); 

        let buttonGeneric2 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric2);
        // buttonGeneric2.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelTitleOptions)});
        panelTitleOptions.addControl(buttonGeneric2); 

        let buttonGeneric3 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric3);
        // buttonGeneric3.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelTitleOptions)});
        panelTitleOptions.addControl(buttonGeneric3); 

        let buttonGeneric4 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric4);
        // buttonGeneric4.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelTitleOptions)});
        panelTitleOptions.addControl(buttonGeneric4); 

        let buttonBack = BABYLON.GUI.Button.CreateSimpleButton('camera options back button', 'Back');
        formatButton(buttonBack);
        buttonBack.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelTitleOptions)});
        panelTitleOptions.addControl(buttonBack); 

    }

    menuGraphType(){

        let panelGraphType = new BABYLON.GUI.StackPanel();
        formatMenuPanel(panelGraphType);
        this.advancedTexture.addControl(panelGraphType);  

        let buttonGeneric = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric);
        // buttonGeneric.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelGraphType)});
        panelGraphType.addControl(buttonGeneric); 

        let buttonGeneric2 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric2);
        // buttonGeneric2.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelGraphType)});
        panelGraphType.addControl(buttonGeneric2); 

        let buttonGeneric3 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric3);
        // buttonGeneric3.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelGraphType)});
        panelGraphType.addControl(buttonGeneric3); 

        let buttonGeneric4 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric4);
        // buttonGeneric4.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelGraphType)});
        panelGraphType.addControl(buttonGeneric4); 

        let buttonBack = BABYLON.GUI.Button.CreateSimpleButton('type options back button', 'Back');
        formatButton(buttonBack);
        buttonBack.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelGraphType)});
        panelGraphType.addControl(buttonBack);    

    }

    menuLabelOptions(){

        let panelLabelOptions = new BABYLON.GUI.StackPanel();
        formatMenuPanel(panelLabelOptions);
        this.advancedTexture.addControl(panelLabelOptions);  

        let buttonGeneric = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric);
        // buttonGeneric.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelLabelOptions)});
        panelLabelOptions.addControl(buttonGeneric); 

        let buttonGeneric2 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric2);
        // buttonGeneric2.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelLabelOptions)});
        panelLabelOptions.addControl(buttonGeneric2); 

        let buttonGeneric3 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric3);
        // buttonGeneric3.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelLabelOptions)});
        panelLabelOptions.addControl(buttonGeneric3); 

        let buttonGeneric4 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric4);
        // buttonGeneric4.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelLabelOptions)});
        panelLabelOptions.addControl(buttonGeneric4); 

        let buttonBack = BABYLON.GUI.Button.CreateSimpleButton('label options back button', 'Back');
        formatButton(buttonBack);
        buttonBack.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelLabelOptions)});
        panelLabelOptions.addControl(buttonBack);   

    }

    menuDLOptions(){

        let panelDLOptions = new BABYLON.GUI.StackPanel();
        formatMenuPanel(panelDLOptions);
        this.advancedTexture.addControl(panelDLOptions);  

        let buttonDownload = BABYLON.GUI.Button.CreateSimpleButton('download button', 'Save/DL');
        formatButton(buttonDownload);
        buttonDownload.onPointerUpObservable.add(() =>{BABYLON.Tools.CreateScreenshotUsingRenderTarget(this.parentThis.engine, this.parentThis.scene.cameras[0],  { width: this.parentThis.options.width, height: this.parentThis.options.height })});
        panelDLOptions.addControl(buttonDownload);  

        let buttonGeneric2 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric2);
        // buttonGeneric2.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelDLOptions)});
        panelDLOptions.addControl(buttonGeneric2); 

        let buttonGeneric3 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric3);
        // buttonGeneric3.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelDLOptions)});
        panelDLOptions.addControl(buttonGeneric3); 

        let buttonGeneric4 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Generic Temp');
        formatButton(buttonGeneric4);
        // buttonGeneric4.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelDLOptions)});
        panelDLOptions.addControl(buttonGeneric4); 



        let buttonBack = BABYLON.GUI.Button.CreateSimpleButton('dl options back button', 'Back');
        formatButton(buttonBack);
        buttonBack.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelDLOptions)});
        panelDLOptions.addControl(buttonBack); 

    }
















    thirdLevel(){
        let thirdGraphOptions = new BABYLON.GUI.StackPanel();
        formatMenuPanel(thirdGraphOptions);
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

    addColorPanel(object, options){
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        advancedTexture.layer.layerMask = 2;
    
        var panel3 = new BABYLON.GUI.StackPanel();
            panel3.width = "120px";
            panel3.fontSize = "14px";
            panel3.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            panel3.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            panel3.cornerRadius = 10;
            panel3.thickness = 1;
            panel3.color = 'black';
            panel3.cornerRadius =  5;
            panel3.background =  "white";
        advancedTexture.addControl(panel3);   
    
        var picker = new BABYLON.GUI.ColorPicker();
            picker.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            picker.value = object.material.diffuseColor;
            picker.height = "100px";
            picker.width = "100px";
            picker.onValueChangedObservable.add(function(value) { // value is a color3
                object.material.diffuseColor = value;
                // console.log(value);
            });    
        panel3.addControl(picker);  

        let buttonGeneric = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Apply Color');
        formatButton(buttonGeneric);
        // buttonGeneric.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelLabelOptions)});
        panel3.addControl(buttonGeneric); 

        let buttonGeneric2 = BABYLON.GUI.Button.CreateSimpleButton('cgeneric button', 'Cancel');
        formatButton(buttonGeneric2);
        // buttonGeneric2.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelLabelOptions)});
        panel3.addControl(buttonGeneric2); 
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

    showDetails(mesh, options){

        // var text1 = new BABYLON.GUI.TextBlock();
        // text1.text = " afdgvtw5rt56347ebtfsgbevsrtyb436ub6th r h  hrt rth re ertherth th ewrtherh ert herth etrh erth ertghfgqra gsghd ";
        // text1.color = "white";
        // label.addControl(text1); 

        // this.advancedTexture.addControl(text1); 

        // var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        var panel3 = new BABYLON.GUI.StackPanel();
            panel3.width = "200px";
            panel3.height = "300px";
            //     panel3.fontSize = "24px";
            panel3.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            panel3.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            panel3.thickness = 1;
            panel3.background = "lightgray";
        //     panel3.color = 'black';
        //     panel3.cornerRadius =  5;
        //     panel3.background =  "white";


        this.advancedTexture.addControl(panel3);  

        var text2 = new BABYLON.GUI.TextBlock();
        text2.text = "egfsrf rfg wt fv zgwtery fs f gwr te sbf g sf fsf dsfgsdfg wetrgwtg eg gwetg er raert ertsergsdfb zfcgearg aresga rgareg aerg argaer gcaergfcrg gea aerh erg serhg serg";
        text2.color = "black";
        text2.fontSize = 18;
        text2.textWrapping = true;
        text2.outlineWidth = 1;
        text2.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        text2.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_LEFT;       
        text2.outlineColor = "black";
        panel3.addControl(text2); 

        // this.advancedTexture.addControl(text2);  

    }
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
    panel.height = "150px";
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


