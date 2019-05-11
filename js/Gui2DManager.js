class Gui2DManager {
    
    constructor(par){
        this.parentThis = par;

        this.mouseCanvasX = 0;
        this.mouseCanvasY = 0;
        

        this.parentThis.canvas.addEventListener('mousemove', (evt) => {
            var mousePos = getMousePos(this.parentThis.canvas, evt);
            this.mouseCanvasX = mousePos.x;
            this.mouseCanvasY = mousePos.y;
            // console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
          }, false);

        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        this.initializeGUIMenu();
    
        // console.log(this.parentThis.scene.meshes[0])

        // this.buildMenu();
        // this.showObjectDetails();
        this.panelPickObjectColor.bind(this);
        // this.panelPickObjectColor(this.parentThis.objects[3]);

    }

    initializeGUIMenu(){

        this.panelOptionsContainer = new BABYLON.GUI.Rectangle();
        this.panelOptionsContainer.name = 'Options Menu';
        // formatMenuPanel(this.panelOptionsContainer);
        this.panelOptionsContainer.width = "120px";
        this.panelOptionsContainer.height = "150px";
        this.panelOptionsContainer.cornerRadius = 10;
        this.panelOptionsContainer.thickness = 1;
        this.panelOptionsContainer.color = 'black';
        this.panelOptionsContainer.background = "lightgray";
        this.panelOptionsContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.panelOptionsContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

        this.panelOptionsContainer.height= '5px';
        this.panelOptionsContainer.width= '120px';
        // this.panelOptionsContainer.paddingLeft = '10px';
        // this.panelOptionsContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        // this.panelOptionsContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this.panelOptionsContainer.isPointerBlock = true;
        this.panelOptionsContainer.onPointerEnterObservable.add(()=>{this.panelOptionsContainer.height= '95px'})
        this.panelOptionsContainer.onPointerOutObservable.add(()=>{this.panelOptionsContainer.height= '5px'})

        this.advancedTexture.addControl(this.panelOptionsContainer);   

        let panelOptions = new BABYLON.GUI.StackPanel();
            formatMenuPanel(panelOptions);
            // panelOptions.height = '5px';
            panelOptions.isPointerBlock = true;
        this.panelOptionsContainer.addControl(panelOptions)

        let buttonSceneOptions = BABYLON.GUI.Button.CreateSimpleButton("scene options button", "Scene Options");
        formatButton(buttonSceneOptions);
        buttonSceneOptions.onPointerUpObservable.add(this.menuSceneOptions.bind(this));
        panelOptions.addControl(buttonSceneOptions);  

        let buttonGraphOptions = BABYLON.GUI.Button.CreateSimpleButton("graph options button", "Graph Options");
        formatButton(buttonGraphOptions);
        buttonGraphOptions.onPointerUpObservable.add(this.menuGraphOptions.bind(this));
        panelOptions.addControl(buttonGraphOptions);  

        
        let button3 = BABYLON.GUI.Button.CreateSimpleButton("help button", "Help");
        formatButton(button3);
        // button3.onPointerUpObservable.add(this.menuGraphOptions.bind(this));
        panelOptions.addControl(button3);  

     }  //  end initializeGUIMenu method

/////////////////////////////////



    buildMenu(){
        let menuOptions = [
        
        ]

        let panelContainer = new BABYLON.GUI.StackPanel();
        panelContainer.adaptWidthToChildren = true;
        panelContainer.adaptHeightToChildren = true;
        
        panelContainer = new BABYLON.GUI.Rectangle();
        // panelContainer.name = 'Options Menu';
        // formatMenuPanel(panelContainer);
        // panelContainer.width = "120px";
        // panelContainer.height = "150px";
        panelContainer.cornerRadius = 10;
        panelContainer.thickness = 1;
        panelContainer.color = 'black';
        panelContainer.background = "lightgray";

        panelContainer.adaptWidthToChildren = true;
        panelContainer.adaptHeightToChildren = true;

        this.advancedTexture.addControl(panelContainer);   


        let buttonCameraOptions = BABYLON.GUI.Button.CreateSimpleButton('camera options button', 'Camera');
        formatButton(buttonCameraOptions);
        buttonCameraOptions.onPointerUpObservable.add(this.menuCameraOptions.bind(this));
        panelContainer.addControl(buttonCameraOptions);  

    }

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

        let speed = this.parentThis.scene.cameras[0].speed;
        var header = new BABYLON.GUI.TextBlock();
        header.text = "Camera Speed: " + speed;
        header.height = "18px";
        header.color = "white";
        header.color    =  "black";
        header.fontSize =  10;
        panelCameraOptions.addControl(header); 
    
        var slider = new BABYLON.GUI.Slider();
        slider.minimum = .5;
        slider.maximum = 5;
        slider.value = speed;
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

        // let buttonGeneric = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Field of View');
        // formatButton(buttonGeneric);
        // // buttonGeneric.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelCameraOptions)});
        // panelCameraOptions.addControl(buttonGeneric); 

        let buttonGeneric2 = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Lock Camera');
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








        let buttonGeneric = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
        formatButton(buttonGeneric);
        // buttonGeneric.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelLightOptions)});
        panelLightOptions.addControl(buttonGeneric); 

        let buttonGeneric2 = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
        formatButton(buttonGeneric2);
        // buttonGeneric2.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelLightOptions)});
        panelLightOptions.addControl(buttonGeneric2); 

        let buttonGeneric3 = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
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

        let buttonGeneric = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
        formatButton(buttonGeneric);
        // buttonGeneric.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelGroundOptions)});
        panelGroundOptions.addControl(buttonGeneric); 

        let buttonGeneric2 = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
        formatButton(buttonGeneric2);
        // buttonGeneric2.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelGroundOptions)});
        panelGroundOptions.addControl(buttonGeneric2); 

        let buttonGeneric3 = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
        formatButton(buttonGeneric3);
        // buttonGeneric3.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelGroundOptions)});
        panelGroundOptions.addControl(buttonGeneric3); 

        let buttonGeneric4 = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
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

        let buttonGeneric = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
        formatButton(buttonGeneric);
        // buttonGeneric.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelBackgroundOptions)});
        panelBackgroundOptions.addControl(buttonGeneric); 

        let buttonGeneric2 = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
        formatButton(buttonGeneric2);
        // buttonGeneric2.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelBackgroundOptions)});
        panelBackgroundOptions.addControl(buttonGeneric2); 

        let buttonGeneric3 = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
        formatButton(buttonGeneric3);
        // buttonGeneric3.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelBackgroundOptions)});
        panelBackgroundOptions.addControl(buttonGeneric3); 

        let buttonGeneric4 = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
        formatButton(buttonGeneric4);
        // buttonGeneric4.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelBackgroundOptions)});
        panelBackgroundOptions.addControl(buttonGeneric4); 

        let buttonBack = BABYLON.GUI.Button.CreateSimpleButton('background options back button', 'Back');
        formatButton(buttonBack);
        buttonBack.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelBackgroundOptions)});
        panelBackgroundOptions.addControl(buttonBack); 

    }

/////////////////////////////////

    menuGraphOptions(){
    
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

        let buttonGeneric = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
        formatButton(buttonGeneric);
        // buttonGeneric.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelTitleOptions)});
        panelTitleOptions.addControl(buttonGeneric); 

        let buttonGeneric2 = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
        formatButton(buttonGeneric2);
        // buttonGeneric2.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelTitleOptions)});
        panelTitleOptions.addControl(buttonGeneric2); 

        let buttonGeneric3 = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
        formatButton(buttonGeneric3);
        // buttonGeneric3.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelTitleOptions)});
        panelTitleOptions.addControl(buttonGeneric3); 

        let buttonGeneric4 = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
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

        let buttonGeneric = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
        formatButton(buttonGeneric);
        // buttonGeneric.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelGraphType)});
        panelGraphType.addControl(buttonGeneric); 

        let buttonGeneric2 = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
        formatButton(buttonGeneric2);
        // buttonGeneric2.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelGraphType)});
        panelGraphType.addControl(buttonGeneric2); 

        let buttonGeneric3 = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
        formatButton(buttonGeneric3);
        // buttonGeneric3.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelGraphType)});
        panelGraphType.addControl(buttonGeneric3); 

        let buttonGeneric4 = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
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

        let buttonGeneric = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
        formatButton(buttonGeneric);
        // buttonGeneric.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelLabelOptions)});
        panelLabelOptions.addControl(buttonGeneric); 

        let buttonGeneric2 = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
        formatButton(buttonGeneric2);
        // buttonGeneric2.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelLabelOptions)});
        panelLabelOptions.addControl(buttonGeneric2); 

        let buttonGeneric3 = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
        formatButton(buttonGeneric3);
        // buttonGeneric3.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelLabelOptions)});
        panelLabelOptions.addControl(buttonGeneric3); 

        let buttonGeneric4 = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
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
        // buttonDownload.onPointerUpObservable.add(() =>{BABYLON.Tools.CreateScreenshotUsingRenderTarget(this.parentThis.engine, this.parentThis.scene.cameras[0],  { width: this.parentThis.options.width, height: this.parentThis.options.height })});
        buttonDownload.onPointerUpObservable.add(() =>{BABYLON.Tools.CreateScreenshotUsingRenderTarget(this.parentThis.engine, this.parentThis.scene.cameras[0],  { width: this.parentThis.options.width*2, height: this.parentThis.options.height*2 })});
        panelDLOptions.addControl(buttonDownload);  

        let buttonGeneric2 = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
        formatButton(buttonGeneric2);
        // buttonGeneric2.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelDLOptions)});
        panelDLOptions.addControl(buttonGeneric2); 

        let buttonGeneric3 = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
        formatButton(buttonGeneric3);
        // buttonGeneric3.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelDLOptions)});
        panelDLOptions.addControl(buttonGeneric3); 

        let buttonGeneric4 = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Generic Temp');
        formatButton(buttonGeneric4);
        // buttonGeneric4.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelDLOptions)});
        panelDLOptions.addControl(buttonGeneric4); 



        let buttonBack = BABYLON.GUI.Button.CreateSimpleButton('dl options back button', 'Back');
        formatButton(buttonBack);
        buttonBack.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelDLOptions)});
        panelDLOptions.addControl(buttonBack); 

    }

////////////////////////////////

    panelPickObjectColor(object){

        let original = object.material.diffuseColor;

        var colorPickerContainer = new BABYLON.GUI.Rectangle();
            colorPickerContainer.name = 'Color Picker Panel';
            colorPickerContainer.width = '150px';
            colorPickerContainer.height= '250px';
            colorPickerContainer.cornerRadius = 5;
            colorPickerContainer.thickness = 1;
            colorPickerContainer.color = 'black';
            colorPickerContainer.background =  "white";
            colorPickerContainer.paddingRight = '10px'
            colorPickerContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            colorPickerContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            colorPickerContainer.isPointerBlock = true;

        var colorPickerPanel = new BABYLON.GUI.StackPanel();
            colorPickerPanel.fontSize = "14px";
            colorPickerPanel.width = "140px";
            colorPickerPanel.height = '240px';
            colorPickerPanel.color = 'black';
            colorPickerPanel.background =  "white";
            colorPickerPanel.isPointerBlock = true;


        //////  Add title
        var title = new BABYLON.GUI.TextBlock();
            title.text = "Color Picker";
            title.color = "black";
            title.fontSize = 20;
            title.height = '20px';

        colorPickerPanel.addControl(title);


        ////// Add original/new color selections

        let colorGrid = new BABYLON.GUI.Grid();
            colorGrid.addRowDefinition(25,true);
            colorGrid.addRowDefinition(25,true);
            colorGrid.addColumnDefinition(.5);
            colorGrid.addColumnDefinition(.5);
            colorGrid.height = '50px';
        colorPickerPanel.addControl(colorGrid);

        var originalTitle = new BABYLON.GUI.TextBlock();
            originalTitle.text = "Original";
            originalTitle.color = "black";
            originalTitle.fontSize = 10;
            originalTitle.height = '15px';

        colorGrid.addControl(originalTitle,0,0);

        var newTitle = new BABYLON.GUI.TextBlock();
            newTitle.text = "New";
            newTitle.color = "black";
            newTitle.fontSize = 10;
            newTitle.height = '15px';

        colorGrid.addControl(newTitle,0,1);

        let originalColor = new BABYLON.GUI.Rectangle();
            originalColor.background = original.toHexString();
            originalColor.thickness = 1;
            originalColor.cornerRadius = 5;
            originalColor.color = "black";
            originalColor.width = '60px';
            originalColor.height = '25px';

        colorGrid.addControl(originalColor, 1,0);

        var newColor = new BABYLON.GUI.Rectangle();
            newColor.background = original.toHexString();
            newColor.thickness = 1;
            newColor.cornerRadius = 5;
            newColor.color = "black";
            newColor.width = '60px';
            newColor.height = '25px';

        colorGrid.addControl(newColor, 1,1);


        //////  Add picker

        var pickerContainer = new BABYLON.GUI.Rectangle();
            pickerContainer.width = '130px';
            pickerContainer.height= '140px';

        var picker = new BABYLON.GUI.ColorPicker();
            picker.value = original;
            picker.height = "130px";
            picker.width = "130px";
            picker.onValueChangedObservable.add(function(value) { // value is a color3
                object.material.diffuseColor = value;
                newColor.background = value.toHexString();
            });    
        
        pickerContainer.addControl(picker);
        colorPickerPanel.addControl(pickerContainer);  


        //////  Add buttons

        let buttonGrid = new BABYLON.GUI.Grid();
            buttonGrid.addColumnDefinition(.5);
            buttonGrid.addColumnDefinition(.5);
            buttonGrid.height = '30px';
        colorPickerPanel.addControl(buttonGrid);

        let buttonApply = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Apply Color');
            formatButton(buttonApply);
            buttonApply.width = '60px';
            buttonApply.background = '#eeeeee';
            buttonApply.onPointerUpObservable.add(()=>{
                this.advancedTexture.removeControl(colorPickerContainer);
            });
        buttonGrid.addControl(buttonApply,0,0); 
    
        let buttonCancel = BABYLON.GUI.Button.CreateSimpleButton('generic button', 'Cancel');
            formatButton(buttonCancel);
            buttonCancel.width = '60px';
            buttonCancel.background = '#eeeeee';
            buttonCancel.onPointerUpObservable.add(()=>{
                object.material.diffuseColor = original;
                this.advancedTexture.removeControl(colorPickerContainer)
            });
        buttonGrid.addControl(buttonCancel,0,1); 
        
        colorPickerContainer.addControl(colorPickerPanel);
        this.advancedTexture.addControl(colorPickerContainer);   
    }

////////////////////////////////

    showObjectDetails(mesh){

        // var text1 = new BABYLON.GUI.TextBlock();
        // text1.text = " afdgvtw5rt56347ebtfsgbevsrtyb436ub6th r h  hrt rth re ertherth th ewrtherh ert herth etrh erth ertghfgqra gsghd ";
        // text1.color = "white";
        // label.addControl(text1); 

        // this.advancedTexture.addControl(text1); 

        // var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        var panel3 = new BABYLON.GUI.StackPanel();
        panel3.name = 'Object Details Panel';
            panel3.width = "200px";
            // panel3.height = "300px";
            //     panel3.fontSize = "24px";
            // panel3.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            // panel3.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            panel3.thickness = 1;
            panel3.background = "lightgray";
        //     panel3.color = 'black';
        //     panel3.cornerRadius =  5;
        //     panel3.background =  "white";


        this.advancedTexture.addControl(panel3);  

        var myScrollViewer = new BABYLON.GUI.ScrollViewer();
        myScrollViewer.height = '150px';
        myScrollViewer.paddingLeft = '10px';
        myScrollViewer.paddingRight = '10px';
        myScrollViewer.paddingTop = '10px';
        myScrollViewer.paddingBottom = '10px';
        myScrollViewer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

        var textPanel = new BABYLON.GUI.StackPanel();
        textPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

        // var text2 = new BABYLON.GUI.TextBlock();
        // text2.text = "egfsrf rfg wt fv zgwtery fs f gwr te sbf g sf fsf dsfgsdfg egfsrf rfg wt fv zgwtery fs f gwr te sbf g sf fsf dsfgsdfg egfsrf rfg wt fv zgwtery fs f gwr te sbf g sf fsf dsfgsdfg egfsrf rfg wt fv zgwterysf fsf dsfgsdfg egfsrf rfg wt fv zgwtery fs f gwr te sbf g sf fsf dsfgsdfg egfsrf rfg wt fv zgwterysf fsf dsfgsdfg egfsrf rfg wt fv zgwtery fs f gwr te sbf g sf fsf dsfgsdfg egfsrf rfg wt fv zgwterysf fsf dsfgsdfg egfsrf rfg wt fv zgwtery fs f gwr te sbf g sf fsf dsfgsdfg egfsrf rfg wt fv zgwterysf fsf dsfgsdfg egfsrf rfg wt fv zgwtery fs f gwr te sbf g sf fsf dsfgsdfg egfsrf rfg wt fv zgwtery fs f gwr te sbf g sf fsf dsfgsdfg wetrgwtg eg gwetg er raert ertsergsdfb zfcgearg aresga rgareg aerg argaer gcaergfcrg gea aerh erg serhg serg";
        // text2.color = "black";
        // text2.fontSize = 12;
        // text2.textWrapping = true;
        // // text2.outlineWidth = 1;
        // text2.height = '20px';
        // // text2.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        // // text2.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_LEFT;       
        // text2.outlineColor = "black";
        // console.log('text2: ',text2);

        // text2.fontOffset.height
        // text2.lines.length


        for (let index = 0; index < 5; index++) {
            let            text2 = new BABYLON.GUI.TextBlock();
            text2.text = "egfsrf f g sf fsf rg";
            text2.color = "black";
            text2.fontSize = 10;
            // text2.textWrapping = true;
            // text2.outlineWidth = 1;
            text2.height = '12px';
            text2.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            // text2.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_LEFT;       
            text2.outlineColor = "black";
            console.log('text2: ',text2);
        
            textPanel.addControl(text2);
        }


        myScrollViewer.addControl(textPanel); 

        panel3.addControl(myScrollViewer); 
        // console.log('height: ',text2.lines);
        // console.log('length: ',text2);

        let buttonCancel = BABYLON.GUI.Button.CreateSimpleButton('close button', 'Close');
        formatButton(buttonCancel);
        buttonCancel.width = '60px';
        // buttonCancel.height = '30px';
        buttonCancel.onPointerUpObservable.add(()=>{
            this.advancedTexture.removeControl(panel3);
        });
        // buttonCancel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        // buttonCancel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

        panel3.addControl(buttonCancel,0,1); 

        // this.advancedTexture.addControl(text2);  

    }

    showObjectValue(mesh){

    }

    menuObjectOptions(mesh, positionX, positionY){
        console.log('right clicked on ' + mesh.name + ' at ' + positionX +','+positionY );

        let panelContainer = new BABYLON.GUI.Rectangle();
        panelContainer.adaptWidthToChildren = true;
        panelContainer.adaptHeightToChildren = true;
        // panelContainer.cornerRadius = 10;
        // panelContainer.thickness = 1;
        panelContainer.color = 'black';
        panelContainer.background = "lightgray";

        // console.log('mouseCanvasX', this.mouseCanvasX-300)
        // console.log('mouseCanvasY', this.mouseCanvasY)

        // panelContainer.left = this.mouseCanvasX-300;
        // panelContainer.top = this.mouseCanvasY-200;

        panelContainer.left = this.mouseCanvasX-this.parentThis.options.width/2;
        panelContainer.top = this.mouseCanvasY-this.parentThis.options.height/2;

        panelContainer.onPointerOutObservable.add(()=>{this.advancedTexture.removeControl(panelContainer)});


        // panelContainer.left = -300 + 50;
        // panelContainer.top = -200;

        this.advancedTexture.addControl(panelContainer);   
        
        // panelContainer.
        
        let panel = new BABYLON.GUI.StackPanel();;
        // panel.name = 'Options Menu';
        // formatMenuPanel(panel);
        // panel.width = "120px";
        // panel.height = "150px";
        
        panel.adaptWidthToChildren = true;
        // panel.adaptHeightToChildren = true;
        panel.color = 'black';
        panel.background = "lightgray";
        
        panelContainer.addControl(panel);
        
        // let spacer = 
        
        let button = BABYLON.GUI.Button.CreateSimpleButton('camera options button', 'Details');
        button.width  =  "50px"
        button.height =  "15px";
        // button.color    =  "black";
        button.fontSize =  10;
        // button.cornerRadius =  5;
        // button.background =  "white";
        button.background = '#eeeeee';
        button.onPointerUpObservable.add(()=>{});

        let button2 = BABYLON.GUI.Button.CreateSimpleButton('camera options button', 'Target');
        button2.width  =  "50px"
        button2.height =  "15px";
        // button2.color    =  "black";
        button2.fontSize =  10;
        // button2.cornerRadius =  5;
        // button2.background =  "white";
        button2.background = '#eeeeee';
        button2.onPointerUpObservable.add(() =>{
            // this.parentThis.scene.cameras[0].setTarget(mesh);  // works for arc camera
            this.parentThis.scene.cameras[0].lockedTarget = mesh;  // changes camera?
            this.advancedTexture.removeControl(panelContainer);  
         });

        panel.addControl(button);  
        panel.addControl(button2);  
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
        
    addGrid(){
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        var displayGrid = new BABYLON.GUI.DisplayGrid();
        displayGrid.width = "50px";
        displayGrid.height = "50px";
        displayGrid.zIndex = 5;
        advancedTexture.addControl(displayGrid);  
    }

}

function formatButton(button){
    button.width  =  "100px"
    button.height =  "30px";
    button.color    =  "black";
    button.fontSize =  10;
    button.paddingTop    =  5;
    button.paddingBottom =  5;
    button.cornerRadius =  5;
    button.background =  "white";
    button.background = '#eeeeee';
    // button.shadowBlur = 2;
    // button.shadowOffsetX = 3;
    // button.shadowOffsetY = 3;
    // button.shadowColor = '#ccc'
}

function formatMenuPanel(panel){
    panel.width = "120px";
    panel.height = "150px";
    panel.cornerRadius = 10;
    panel.thickness = 1;
    panel.color = 'black';
    panel.background = "lightgray";
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    // button.shadowBlur = 2;
    // button.shadowOffsetX = 3;
    // button.shadowOffsetY = 3;
    // button.shadowColor = '#ccc'
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

