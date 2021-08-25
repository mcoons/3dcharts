class Gui3DManager {

    constructor(scene, elements, options, parent){

        this.parent = parent;
        // console.log('In gui3D constructor');

        // this.create3dGroundLabels(scene, elements, options); 

        // if (options.showScale){
        //     this.create3dScale(scene, elements, options, 0, 10, "5", 5); 
        //     this.create3dScale(scene, elements, options, 0, 10, "10", 10); 
        //     this.create3dScale(scene, elements, options, 0, 10, "15", 15); 
        // }
    }


    // create3dGroundLabels (scene, elements, options){
    //     // console.log(elements);

    //     if (elements.length > 0)
    //     elements.forEach(element => {
                    
    //         //Set font type
    //         var font_type = "Arial";
                
    //         //Set width an height for plane
    //         var planeWidth = 4;
    //         var planeHeight = 1.1;

    //         //Set width and height for dynamic texture using same multiplier
    //         var DTWidth = planeWidth * 60;
    //         var DTHeight = planeHeight * 60;


    //         //Set text
    //         var text = element.userData.myOptions.name;// + '      ' + element.userData.myOptions.value;

    //         //Create dynamic texture
    //         var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", {width:DTWidth, height:DTHeight}, scene);

    //         //Check width of text for given font type at any size of font
    //         var ctx = dynamicTexture.getContext();
    //         var size = 45; //any value will work
    //         ctx.font = size + "px " + font_type;
    //         var textWidth = ctx.measureText(text).width;

    //         //Calculate ratio of text width to size of font used
    //         var ratio = textWidth/size;

    //         //set font to be actually used to write text on dynamic texture
    //         var font_size = Math.floor(DTWidth / (ratio * 1)); //size of multiplier (1) can be adjusted, increase for smaller text
    //         // var font = font_size + "px " + font_type;
    //         var font = ctx.font;

    //         //Draw text
    //         dynamicTexture.drawText(text, null, null, font, "#000000", "#ffffff", true);

    //         //create material
    //         var mat = new BABYLON.StandardMaterial("mat", scene);
    //         mat.diffuseTexture = dynamicTexture;
    //         mat.opacityTexture = dynamicTexture;
            
    //         // if (options.transparent){
    //         //     mat.alpha = 0.5;
    //         // }
           

    //         if (options.coloredLabels)
    //             mat.diffuseColor = element.material.diffuseColor;


    //         if (options.horizontalLabels){

    //             //Create horizontal labels
    //             var plane1 = BABYLON.MeshBuilder.CreatePlane("label for "+element.userData.name, {width:planeWidth, height:planeHeight}, scene);
    //             plane1.position.x = element.position.x;
    //             plane1.position.y = .01;
    //             plane1.position.z = -planeWidth/2 - .5;

    //             plane1.rotation.x = Math.PI/2;
    //             plane1.rotation.y = Math.PI/2;
    //             plane1.rotation.z = 0;

    //             plane1.material = mat;

    //             element.userData.myLabel = plane1;
    //             plane1.userData = {};
    //             plane1.userData.myElement = element;

    //         }

    //         if (options.verticalLabels){

    //             //Create vertical labels

    //             var plane2 = BABYLON.MeshBuilder.CreatePlane("label for "+element.userData.name, {width:planeWidth, height:planeHeight}, scene);
    //             plane2.position.x = element.position.x;
    //             plane2.position.y = -2.2;
    //             plane2.position.z = -.01;

    //             // plane2.rotation.x = Math.PI/2;
    //             // plane2.rotation.y = Math.PI/2;
    //             plane2.rotation.z = -Math.PI/2;;

    //             // plane.rotation.z = -Math.PI/8;

    //             plane2.material = mat;

    //             element.userData.myLabel = plane2;
    //             plane2.userData = {};
    //             plane2.userData.myElement = element;


    //         }




    //         //apply material

    //     });
    // }

    // create3dScale (scene, elements, options, min, max, text, location){

    //     //Set font type
    //     var font_type = "Arial";
            
    //     //Set width an height for plane
    //     var planeWidth = 20;
    //     var planeHeight = 1.1;

    //     //Set width and height for dynamic texture using same multiplier
    //     var DTWidth = planeWidth * 60;
    //     var DTHeight = planeHeight * 60;
        
        
        
    //     //Create plane
    //     var planeScales = BABYLON.MeshBuilder.CreatePlane("plane", {width:planeWidth, height:planeHeight}, scene);
    //     // planeScales.position.x = -6;
    //     planeScales.position.y = location;
    //     planeScales.position.z = -.01;

    //     //Set text
    //     var text = text + '  --------------------------------------------------------------------';// + '      ' + element.userData.myOptions.value;

    //     //Create dynamic texture
    //     var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", {width:DTWidth, height:DTHeight}, scene);

    //     //Check width of text for given font type at any size of font
    //     var ctx = dynamicTexture.getContext();
    //     var size = 45; //any value will work
    //     ctx.font = size + "px " + font_type;
    //     var textWidth = ctx.measureText(text).width;

    //     //Calculate ratio of text width to size of font used
    //     var ratio = textWidth/size;

    //     //set font to be actually used to write text on dynamic texture
    //     var font_size = Math.floor(DTWidth / (ratio * 1)); //size of multiplier (1) can be adjusted, increase for smaller text
    //     // var font = font_size + "px " + font_type;
    //     var font = ctx.font;

    //     //Draw text
    //     dynamicTexture.drawText(text, null, null, font, "#000000", "#ffffff", true);

    //     //create material
    //     var mat = new BABYLON.StandardMaterial("mat", scene);
    //     mat.diffuseTexture = dynamicTexture;
    //     // if (options.coloredLabels)
    //     // mat.diffuseColor = elements[0].material.diffuseColor;
    //     // mat.wireframe = true;


    //     //apply material
    //     planeScales.material = mat;

    // }

    create3DText(scene, scale, depth, displayText, xPos, yPos, zPos, color){
        // var  MeshWriter, text1, text2, C1, C2;

        let Writer = BABYLON.MeshWriter(scene, {scale:scale});
        let text1  = new Writer( 
            displayText,
            {
                "anchor": "center",
                "letter-height": scale,
                "letter-thickness": depth,
                "color": "#ff0000",
                "position": {
                    "x": xPos,
                    "y": yPos,
                    "z": zPos
                }
            }
        );

        text1.getMesh().setPivotPoint(text1.getMesh().getBoundingInfo().boundingBox.centerWorld, BABYLON.Space.WORLD);

        text1.getMesh().rotation.x = -Math.PI/2;
        text1.getMesh().material = color;

// console.log('text',text1)

        return text1;
    }
}