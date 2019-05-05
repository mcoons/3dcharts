class Gui2D {
    
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
        // this.panelOptions.height = '60px';
        this.panelOptions.height = '5px';
        this.panelOptions.onPointerEnterObservable.add(()=>{this.panelOptions.height= '120px'})
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

     }  //  end initializeGUI method


    // optionsMenu(){
    //     let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    //     let panelOptions = new BABYLON.GUI.StackPanel();
    //     formatMenuPanel(panelOptions);

    //     advancedTexture.addControl(panelOptions);   

    //     let buttonScreenOptions = BABYLON.GUI.Button.CreateSimpleButton('scene options button', 'Scene Options');
    //     formatButton(buttonScreenOptions);
    //     buttonScreenOptions.onPointerUpObservable.add(this.sceneOptionsMenu);
    //     panelOptions.addControl(buttonScreenOptions);  

    //     let buttonGraphOptions = BABYLON.GUI.Button.CreateSimpleButton('graph options button', 'Graph Options');
    //     formatButton(buttonGraphOptions);
    //     buttonGraphOptions.onPointerUpObservable.add(this.graphOptionsMenu);
    //     panelOptions.addControl(buttonGraphOptions);  

    //     let buttonBack = BABYLON.GUI.Button.CreateSimpleButton('options back button', 'Back');
    //     formatButton(buttonBack);
    //     buttonBack.onPointerUpObservable.add(()=>{advancedTexture.dispose()});
    //     panelOptions.addControl(buttonBack);  
    // }

    sceneOptionsMenu(){
        console.log('in scene options menu');
        console.log(this.parentThis);

        // let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        let panelSceneOptions = new BABYLON.GUI.StackPanel();
        formatMenuPanel(panelSceneOptions);

        this.advancedTexture.addControl(panelSceneOptions);   

        let buttonScreenOptions = BABYLON.GUI.Button.CreateSimpleButton('scene options 1', 'Scene Option 1');
        formatButton(buttonScreenOptions);
        // buttonScreenOptions.onPointerUpObservable.add(this.sceneOptionsMenu);
        panelSceneOptions.addControl(buttonScreenOptions);  

        let buttonGraphOptions = BABYLON.GUI.Button.CreateSimpleButton('scene options 2', 'Scene Option 2');
        formatButton(buttonGraphOptions);
        // buttonGraphOptions.onPointerUpObservable.add(this.graphOptionsMenu);
        panelSceneOptions.addControl(buttonGraphOptions);  

        let buttonBack = BABYLON.GUI.Button.CreateSimpleButton('options back button', 'Back');
        formatButton(buttonBack);
        buttonBack.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelSceneOptions)});
        panelSceneOptions.addControl(buttonBack);  
    }

    graphOptionsMenu(){
        console.log('in graph options menu')
        console.log(this.test);
        // let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        let panelGraphOptions = new BABYLON.GUI.StackPanel();
        formatMenuPanel(panelGraphOptions);

        this.advancedTexture.addControl(panelGraphOptions);   

        let buttonGraphOption1 = BABYLON.GUI.Button.CreateSimpleButton('graph options 1', 'Graph Option 1');
        formatButton(buttonGraphOption1);
        buttonGraphOption1.onPointerUpObservable.add(this.thirdLevel.bind(this));
        panelGraphOptions.addControl(buttonGraphOption1);  

        let buttonGraphOption2 = BABYLON.GUI.Button.CreateSimpleButton('graph options 2', 'Graph Option 2');
        formatButton(buttonGraphOption2);
        buttonGraphOption2.onPointerUpObservable.add(this.thirdLevel.bind(this));
        panelGraphOptions.addControl(buttonGraphOption2);  

        let buttonBack = BABYLON.GUI.Button.CreateSimpleButton('options back button', 'Back');
        formatButton(buttonBack);
        buttonBack.onPointerUpObservable.add(()=>{this.advancedTexture.removeControl(panelGraphOptions)});
        panelGraphOptions.addControl(buttonBack); 
    }



    thirdLevel(){
        console.log('in third level menu')
        console.log(this.test);
        // let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        let thirdGraphOptions = new BABYLON.GUI.StackPanel();
        formatMenuPanel(thirdGraphOptions);

        this.advancedTexture.addControl(thirdGraphOptions);   

        let buttonGraphOption1 = BABYLON.GUI.Button.CreateSimpleButton('graph options third level', 'Graph Option third level');
        formatButton(buttonGraphOption1);
        // buttonGraphOption1.onPointerUpObservable.add(this.sceneOptionsMenu);
        thirdGraphOptions.addControl(buttonGraphOption1);  

        let buttonGraphOption2 = BABYLON.GUI.Button.CreateSimpleButton('graph options 2', 'Graph Option 2');
        formatButton(buttonGraphOption2);
        // buttonGraphOption2.onPointerUpObservable.add(this.graphOptionsMenu);
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
        var label = new BABYLON.GUI.Rectangle("label for " + mesh.name);
        label.background = "white"
        label.height = "15px";
        // label.alpha = 0.5;
        label.width = "40px";
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
        label.zIndex = 10;
        this.advancedTexture.addControl(label); 
        label.linkWithMesh(mesh);

        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = options.name;
        text1.color = "black";
        text1.fontSize = 10;

        label.addControl(text1);  


        var line = new BABYLON.GUI.Line();
        // line.alpha = 0.5;
        line.lineWidth = 2;
        // line.dash = [5, 10];
        line.zIndex = 5;
        line.color = 'black';
        this.advancedTexture.addControl(line); 
        line.linkWithMesh(mesh);
        line.connectedControl = label;
    
        var endRound = new BABYLON.GUI.Ellipse();
        endRound.width = "5px";
        endRound.background = "black";
        endRound.height = "5px";
        endRound.color = "black";
        this.advancedTexture.addControl(endRound);
        endRound.linkWithMesh(mesh);

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
    panel.height = "120px";
    panel.cornerRadius = 10;
    panel.thickness = 1;
    panel.color = 'black';
    panel.background = "green";
    // panel.paddingTop    =  25;
    // panel.paddingLeft    =  25;
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    // panel.paddingBottom =  5;
    // panel.paddingLeft   =  5;
    // panel.paddingRight  =  5;
}