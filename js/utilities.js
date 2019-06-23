// Function to remap one range to another
function remap(x, oMin, oMax, nMin, nMax) {
    // check range

    if (oMin === oMax) {
        console.log("Warning: Zero input range");
        return null;
    }

    if (nMin === nMax) {
        console.log("Warning: Zero output range");
        return null;
    }

    // check reversed input range
    let reverseInput = false;
    let oldMin = Math.min(oMin, oMax);
    let oldMax = Math.max(oMin, oMax);

    if (oldMin != oMin) reverseInput = true;

    // check reversed output range
    let reverseOutput = false;
    let newMin = Math.min(nMin, nMax);
    let newMax = Math.max(nMin, nMax);

    if (newMin != nMin) reverseOutput = true;

    // calculate new range
    let portion = (x - oldMin) * (newMax - newMin) / (oldMax - oldMin);

    if (reverseInput) portion = (oldMax - x) * (newMax - newMin) / (oldMax - oldMin);

    let result = portion + newMin;

    if (reverseOutput) result = newMax - portion;

    return result;
} //  end remap method


// function for linear interpolation
function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
} //  end lerp function


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


function calculateScale(max) {
    let interval;
    let unit = max / 10;
    let grade = Math.floor(Math.log10(unit));
    let sunit = unit / (10 ** grade);

    if (sunit < Math.sqrt(2)) {
        interval = 10 ** grade * 1;
    } else if (sunit < Math.sqrt(10)) {
        interval = 10 ** grade * 2;
    } else if (sunit < Math.sqrt(50)) {
        interval = 10 ** grade * 5;
    } else {
        interval = 10 ** grade * 10;
    }

    let maxscale = Math.ceil(max / interval) * interval;

    // console.log(maxscale, interval);

    return {
        'interval': interval,
        'maxScale': maxscale
    }
}


function map(value, fromSource, toSource, fromTarget, toTarget) {
    return (value - fromSource) / (toSource - fromSource) * (toTarget - fromTarget) + fromTarget;
}


function getColor(startColor, endColor, min, max, value) {
    var startRGB = hexToRgb(startColor);
    var endRGB = hexToRgb(endColor);
    var percentFade = map(value, min, max, 0, 1);

    var diffRed = endRGB.r - startRGB.r;
    var diffGreen = endRGB.g - startRGB.g;
    var diffBlue = endRGB.b - startRGB.b;

    diffRed = (diffRed * percentFade) + startRGB.r;
    diffGreen = (diffGreen * percentFade) + startRGB.g;
    diffBlue = (diffBlue * percentFade) + startRGB.b;

    var result = {
        r: diffRed / 255,
        g: diffGreen / 255,
        b: diffBlue / 255
    };
    return result;
}


  // show axis
 function showAxis(size) {
    var makeTextPlane = function(text, color, size) {
        var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
        var plane = BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
        plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
        plane.material.backFaceCulling = false;
        plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
        plane.material.diffuseTexture = dynamicTexture;
        return plane;
    };
  
    var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
      BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
      new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
      ], scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
    var axisY = BABYLON.Mesh.CreateLines("axisY", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
        ], scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
        ], scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
  };




var colorList = [
    "#000000",
    "#00FF00",
    "#0000FF",
    "#FF0000",
    "#01FFFE",
    "#FFA6FE",
    "#FFDB66",
    "#006401",
    "#010067",
    "#95003A",
    "#007DB5",
    "#FF00F6",
    "#FFEEE8",
    "#774D00",
    "#90FB92",
    "#0076FF",
    "#D5FF00",
    "#FF937E",
    "#6A826C",
    "#FF029D",
    "#FE8900",
    "#7A4782",
    "#7E2DD2",
    "#85A900",
    "#FF0056",
    "#A42400",
    "#00AE7E",
    "#683D3B",
    "#BDC6FF",
    "#263400",
    "#BDD393",
    "#00B917",
    "#9E008E",
    "#001544",
    "#C28C9F",
    "#FF74A3",
    "#01D0FF",
    "#004754",
    "#E56FFE",
    "#788231",
    "#0E4CA1",
    "#91D0CB",
    "#BE9970",
    "#968AE8",
    "#BB8800",
    "#43002C",
    "#DEFF74",
    "#00FFC6",
    "#FFE502",
    "#620E00",
    "#008F9C",
    "#98FF52",
    "#7544B1",
    "#B500FF",
    "#00FF78",
    "#FF6E41",
    "#005F39",
    "#6B6882",
    "#5FAD4E",
    "#A75740",
    "#A5FFD2",
    "#FFB167",
    "#009BFF",
    "#E85EBE"
];

var months = {
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