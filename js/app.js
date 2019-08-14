

let url = 'https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=DEMO_KEY';

function getRESTData(url) {
    var request = new XMLHttpRequest()
    
    request.open('GET', url, true);
    
    request.onload = function () {
        var data = JSON.parse(this.response);
        
        if (request.status >= 200 && request.status < 400) {
            // console.log(data);
            parseData(data);
            buildIt(newData);
            return data;
        } else {
            console.log('GET error');
            return null;
        }
    }
    
    request.send();
}


// var retrievedData =  getRESTData(url);


let sampleJSONData = {
    "rovers": [{
        "id": 5,
        "name": "Curiosity",
        "landing_date": "2012-08-06",
        "launch_date": "2011-11-26",
        "status": "active",
        "max_sol": 2422,
        "max_date": "2019-05-30",
        "total_photos": 352391,
        "cameras": [{
            "name": "FHAZ",
            "full_name": "Front Hazard Avoidance Camera"
        }, {
            "name": "NAVCAM",
            "full_name": "Navigation Camera"
        }, {
            "name": "MAST",
            "full_name": "Mast Camera"
        }, {
            "name": "CHEMCAM",
            "full_name": "Chemistry and Camera Complex"
        }, {
            "name": "MAHLI",
            "full_name": "Mars Hand Lens Imager"
        }, {
            "name": "MARDI",
            "full_name": "Mars Descent Imager"
        }, {
            "name": "RHAZ",
            "full_name": "Rear Hazard Avoidance Camera"
        }]
    }, {
        "id": 7,
        "name": "Spirit",
        "landing_date": "2004-01-04",
        "launch_date": "2003-06-10",
        "status": "complete",
        "max_sol": 2208,
        "max_date": "2010-03-21",
        "total_photos": 124550,
        "cameras": [{
            "name": "FHAZ",
            "full_name": "Front Hazard Avoidance Camera"
        }, {
            "name": "NAVCAM",
            "full_name": "Navigation Camera"
        }, {
            "name": "PANCAM",
            "full_name": "Panoramic Camera"
        }, {
            "name": "MINITES",
            "full_name": "Miniature Thermal Emission Spectrometer (Mini-TES)"
        }, {
            "name": "ENTRY",
            "full_name": "Entry, Descent, and Landing Camera"
        }, {
            "name": "RHAZ",
            "full_name": "Rear Hazard Avoidance Camera"
        }]
    }, {
        "id": 6,
        "name": "Opportunity",
        "landing_date": "2004-01-25",
        "launch_date": "2003-07-07",
        "status": "complete",
        "max_sol": 5111,
        "max_date": "2018-06-11",
        "total_photos": 198439,
        "cameras": [{
            "name": "FHAZ",
            "full_name": "Front Hazard Avoidance Camera"
        }, {
            "name": "NAVCAM",
            "full_name": "Navigation Camera"
        }, {
            "name": "PANCAM",
            "full_name": "Panoramic Camera"
        }, {
            "name": "MINITES",
            "full_name": "Miniature Thermal Emission Spectrometer (Mini-TES)"
        }, {
            "name": "ENTRY",
            "full_name": "Entry, Descent, and Landing Camera"
        }, {
            "name": "RHAZ",
            "full_name": "Rear Hazard Avoidance Camera"
        }]
    }]
}

var newData = {};

function parseData(objectData) {
    console.log('started parsing')
    let seriesNames = Object.keys(objectData);
    let seriesCount = seriesNames.length;
    let seriesLength = objectData[seriesNames[0]].length;
    
    for (let seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
        newData[seriesNames[seriesIndex]] = [];
        for (let elementIndex = 0; elementIndex < seriesLength; elementIndex++) {
            
            const element = objectData[seriesNames[seriesIndex]][elementIndex];
            
            let dataElement = {
                label: element.name,
                value: element.total_photos
            }
            
            newData[seriesNames[seriesIndex]].push(dataElement);
        }
    }
}



let dataSeries = {};

for (let seriesCount = 0; seriesCount < 5; seriesCount++) {
    dataSeries['Series' + seriesCount] = [];
    for (let dataPoints = 1; dataPoints <= 3; dataPoints++) {

        let data = {
            label: months[dataPoints].long,
            // label: 'Label'+ dataPoints,
            value: 20 + 75 * (Math.abs(6 - dataPoints / (seriesCount + 1) + 2 + 3 * Math.sin(seriesCount * dataPoints))),
            details: {
                detail1: dataPoints,
                detail2: dataPoints * dataPoints,
                detail3: 1 / dataPoints
            }
        };
        dataSeries['Series' + seriesCount].push(data);
    }
}

// console.log('dataSeries:')
// console.log(dataSeries)

// parseData(dataSeries);
// buildIt(dataSeries, dataSeries2)



let dataSeries2 = {};

for (let seriesCount = 0; seriesCount < 3; seriesCount++) {
    dataSeries2['Series' + seriesCount] = [];
    for (let dataPoints = 1; dataPoints <= 12; dataPoints++) {

        let data = {
            label: months[dataPoints].long,
            // label: 'Label'+ dataPoints,
            value: 20 + 75 * (Math.abs(6 - dataPoints / (seriesCount + 1) + 2 + 3 * Math.sin(seriesCount * dataPoints))),
            details: {
                detail1: dataPoints,
                detail2: dataPoints * dataPoints,
                detail3: 1 / dataPoints
            }
        };
        dataSeries2['Series' + seriesCount].push(data);
    }
}

// console.log('dataSeries2:')
// console.log(dataSeries2)
// parseData(dataSeries2);


let dataSeries3 = {};

for (let seriesCount = 1; seriesCount < 6; seriesCount++) {
    dataSeries3['Series' + seriesCount] = [];
    for (let dataPoints = 1; dataPoints <= 6; dataPoints++) {

        let data = {
            label: months[dataPoints].long,
            // label: 'Label'+ dataPoints,
            value: 20 + 75 * (Math.abs(6 - dataPoints / (seriesCount + 1) + 2 + 3 * Math.sin(seriesCount * dataPoints))),
            details: {
                detail1: dataPoints,
                detail2: dataPoints * dataPoints,
                detail3: 1 / dataPoints
            }
        };
        dataSeries3['Series' + seriesCount].push(data);
    }
}





buildIt(dataSeries, dataSeries2, dataSeries3)


////////////////////////////////////////////////////////////////////

function buildIt(data, data2, data3) {
    // console.log('data in buildIt' )
    // console.log(data);

    function scene1(){
        let sceneOptions = {
            id: 'mixed', // required - id of canvas element to use
            width: 600, //  <default 300>
            height: 350, //  <default 200>
            cameraFirstPerson: true, //  <default true>
            // backgroundColor: {          //  <default white>
            //     r: 0,
            //     g: 0,
            //     b: 0
            // }   
        };

        let sceneManager1 = new ChartSceneManager(sceneOptions);



        let chartOptions = {
            type: 'pie',
            title: 'Monthly Pie Sales',
            data: data,
    
            titleDepth: .01, //  < default .01 >
            doughnut: false,  // applies to pie chart only
    
            round: false, //  < default false >  applies to bar chart only        
            depth: 10.5, //  < default .25 >          
            alpha: 1, //  < default 1 >
    
            textDepth: .01, //  < default .01 >
            textColor: { //  < default black >
                r: 0,
                g: 0,
                b: 0
            },
            transition: true
        };
    
        let chart1_1 = sceneManager1.addChart(chartOptions);
    
        // setTimeout( () => {sceneManager1.removeChart(chart1_1)}, 10000);
    
    
        chartOptions = {
            type: 'bar',
            title: 'Quarterly Report',
            data: data,
    
            titleDepth: .01, //  < default .01 >
    
            round: false, //  < default false >          
            depth: 1.5, //  < default .25 >          
            alpha: 1, //  < default 1 >
            showBackplanes: true,
    
            textDepth: .01, //  < default .01 >
            textColor: { //  < default black >
                r: 0,
                g: 0,
                b: 0
            }
        };
    
        let chart1_2 = sceneManager1.addChart(chartOptions);
        chart1_2.masterTransform.position.z = 500;
        chart1_2.updateMaterial(1,{r:0,g:.5,b:1});
    }

    ////////////////////////////////////////////////////////////////////
    
    function scene2(){
        let sceneOptions = {
            id: 'bar1', // required - id of canvas element to use
            width: 600, //  <default 300>
            height: 350, //  <default 200>
            cameraFirstPerson: true, //  <default true>
            backgroundColor: { //  <default white>
                r: 0.95,
                g: 0.97,
                b: 0.95
            }
        };

        let sceneManager2 = new ChartSceneManager(sceneOptions);


        let chartOptions = {
            type: 'bar',
            title: 'Quarterly Report',
            data: data,
    
            titleDepth: .01, //  < default .01 >
    
            round: false, //  < default false >          
            depth: 1.5, //  < default .25 >          
            alpha: 1, //  < default 1 >
            showBackplanes: true,
    
            textDepth: .01, //  < default .01 >
            textColor: { //  < default black >
                r: 0,
                g: 0,
                b: 0
            }
        };


        chartOptions.title = 'Reported Stuff';
        chartOptions.round = true;
        chartOptions.textColor = {
            r: 0,
            g: 0,
            b: 0
        };
        chartOptions.showBackplanes = true;
        chartOptions.data = data3;
    
        let chart2_1 = sceneManager2.addChart(chartOptions);
        chart2_1.masterTransform.position.z = 500;
    
    
        chartOptions.data = data2;
    
    
    
    
        chartOptions.title = 'Defect Analysis';
        chartOptions.type = 'stacked';
        chartOptions.textColor = {r:1, g:1, b:1};
    
        let chart2_2 = sceneManager2.addChart(chartOptions);
        chart2_2.masterTransform.position.z = -500;
        chart2_2.masterTransform.rotation.y = -Math.PI;
    
    
    
        chartOptions.type = 'line';
        chartOptions.title = 'Cost Analysis'
    
        let chart2_3 = sceneManager2.addChart(chartOptions);  // right
        chart2_3.masterTransform.position.x = 500;
        chart2_3.masterTransform.position.y = 0;
        chart2_3.masterTransform.position.z = 0;
        chart2_3.masterTransform.rotation.y = Math.PI/2;
    
    
    
    
        chartOptions.textColor = {
            r: 0,
            g: 0,
            b: 0
        };
    
        chartOptions.data = data;
        chartOptions.title = 'Doughnut Sales';
        chartOptions.type = 'pie';
        chartOptions.horizontal = true;
        chartOptions.doughnut = true;
    
        let chart2_4 = sceneManager2.addChart(chartOptions);  //  left
    
    
    
        chart2_4.masterTransform.position.x = -500;
        chart2_4.masterTransform.position.y = 0;
        chart2_4.masterTransform.position.z = 0;
        // chart2_4.masterTransform.rotation.y = 3*Math.PI/2;
        chart2_4.masterTransform.rotation.z = 3*Math.PI/2;
        chart2_4.masterTransform.scaling.x = .5;
        chart2_4.masterTransform.scaling.y = .5;
        chart2_4.masterTransform.scaling.z = .5;
    
    }

    ////////////////////////////////////////////////////////////////////

    function scene3(){
        let sceneOptions = {
            id: 'bar2', // required - id of canvas element to use
            width: 600, //  <default 300>
            height: 350, //  <default 200>
            cameraFirstPerson: false, //  <default true>
            backgroundColor: { //  <default white>
                r: 0.0,
                g: 0.0,
                b: 0.0
            }
        };

        let sceneManager3 = new ChartSceneManager(sceneOptions);
    
        let chartOptions = {
            type: 'bar',
            title: 'Quarterly Report',
            data: data,
    
            titleDepth: .01, //  < default .01 >
    
            round: false, //  < default false >          
            depth: 1.5, //  < default .25 >          
            alpha: 1, //  < default 1 >
            showBackplanes: true,
    
            textDepth: .01, //  < default .01 >
            textColor: { //  < default black >
                r: 0,
                g: 0,
                b: 0
            }
        };

        chartOptions.title = 'Successful Repairs';
        chartOptions.type = 'stacked';
        chartOptions.round = false;
        chartOptions.alpha = 1;
        chartOptions.data = data;
        chartOptions.textColor = {
            r: 1,
            g: 1,
            b: 1
        };
        chartOptions.showBackplanes = true;

        let chart3_1 = sceneManager3.addChart(chartOptions);
        chart3_1.updateMaterialGradient('#FF0000','#00FF00',1,5);

        chart3_1.masterTransform.position.x = 0; 
        chart3_1.masterTransform.position.y = 0; 
        chart3_1.masterTransform.position.z = 0; 

        chartOptions.title = 'Expense Report';

        chartOptions.type = 'line';
        chartOptions.textColor = {
            r: 1,
            g: 1,
            b: 1
        };
        chartOptions.data = data2;
        
        let chart3_2 = sceneManager3.addChart(chartOptions);
        chart3_2.masterTransform.position.x = 0; 
        chart3_2.masterTransform.position.y = 0; 
        chart3_2.masterTransform.position.z = 5; 
        chart3_2.masterTransform.rotation.y = Math.PI;

        chartOptions.showBackplanes = false;
    
    }

    ////////////////////////////////////////////////////////////////////

    function scene4(){
        let sceneOptions = {
            id: 'bar3', // required - id of canvas element to use
            width: 1200, //  <default 300>
            height: 600, //  <default 200>
            cameraFirstPerson: true, //  <default true>
            backgroundColor: { //  <default white>
                r: 0.15,
                g: 0.0,
                b: 0.0
            }
        };

        let sceneManager4 = new ChartSceneManager(sceneOptions);
        sceneManager4.scene.activeCamera.position.z = -500;

        let chartOptions = {
            type: 'bar',
            title: 'Quarterly Report',
            data: data,
    
            titleDepth: .01, //  < default .01 >
    
            round: false, //  < default false >          
            depth: 1.5, //  < default .25 >          
            alpha: 1, //  < default 1 >
            showBackplanes: false,
    
            textDepth: .01, //  < default .01 >
            textColor: { //  < default black >
                r: 0,
                g: 0,
                b: 0
            }
        };

        chartOptions.title = '3D Printer Sales';

        chartOptions.type = '3D';
        chartOptions.round = false;
        chartOptions.alpha = 1;
        chartOptions.titleDepth = 1;
        chartOptions.data = data2;
        chartOptions.textColor = {
            r: .8,
            g: .8,
            b: .0
        };
    
        let chart4_1 = sceneManager4.addChart(chartOptions);

    }

    ////////////////////////////////////////////////////////////////////

    function scene5(){
        let sceneOptions = {
            id: 'bar4', // required - id of canvas element to use
            width: 1200, //  <default 300>
            height: 600, //  <default 200>
            cameraFirstPerson: false, //  <default true>
            backgroundColor: { //  <default white>
                r: .95,
                g: .95,
                b: 1
            }
        };

        let sceneManager5 = new ChartSceneManager(sceneOptions);
    

        let chartOptions = {
            type: 'bar',
            title: 'Quarterly Report',
            data: data,
    
            titleDepth: .01, //  < default .01 >
    
            round: false, //  < default false >          
            depth: 1.5, //  < default .25 >          
            alpha: 1, //  < default 1 >
            showBackplanes: true,
    
            textDepth: .01, //  < default .01 >
            textColor: { //  < default black >
                r: 0,
                g: 0,
                b: 0
            }
        };

        chartOptions.title = 'User Count';

        chartOptions.type = 'bar';
        chartOptions.round = false;
        chartOptions.textColor = {
            r:0,
            g:0,
            b:0
        }
        chartOptions.titleDepth = 2;
        chartOptions.showBackplanes = true;

        
        let chart5_1 = sceneManager5.addChart(chartOptions);
        // chart5_1.masterTransform.position.z = 500;
        chart5_1.masterTransform.position.z= -450;

        chartOptions.title = 'Expense Report';


        let chart5_2 = sceneManager5.addChart(chartOptions);
        // chart5_1.masterTransform.position.z = 500;
        chart5_2.masterTransform.position.z= 450;
        chart5_2.masterTransform.rotation.y= Math.PI;
        
        
        chartOptions.title = 'UFO Sightings';
        chartOptions.data = data;


        let chart5_3 = sceneManager5.addChart(chartOptions);
        chart5_3.masterTransform.position.x= -450;
        chart5_3.masterTransform.rotation.y= Math.PI/2;

        chartOptions.title = 'Books Read';

        
        let chart5_4 = sceneManager5.addChart(chartOptions);
        chart5_4.masterTransform.position.x= 450;
        chart5_4.masterTransform.rotation.y= -Math.PI/2;
        
        
        sceneManager5.scene.activeCamera.radius = 1000;
        sceneManager5.scene.activeCamera.beta = Math.PI/2;

        sceneManager5.scene.masterTransform =  BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 10, diameterX: 10}, sceneManager5.scene);
        
        chart5_1.masterTransform.parent = sceneManager5.scene.masterTransform;
        chart5_2.masterTransform.parent = sceneManager5.scene.masterTransform;
        chart5_3.masterTransform.parent = sceneManager5.scene.masterTransform;
        chart5_4.masterTransform.parent = sceneManager5.scene.masterTransform;

    }

    ////////////////////////////////////////////////////////////////////

    // sceneOptions = {
    //     id: 'pie', // required - id of canvas element to use
    //     width: 600, //  <default 300>
    //     height: 350, //  <default 200>
    //     cameraFirstPerson: false, //  <default true>
    //     backgroundColor: { //  <default white>
    //         r: 1,
    //         g: .95,
    //         b: .95
    //     }
    // };

    // let sceneManager6 = new ChartSceneManager(sceneOptions);

    ////////////////////////////////////////////////////////////////////

    function scene7(){
        let sceneOptions = {
            id: 'gauge', // required - id of canvas element to use
            width: 600, //  <default 300>
            height: 350, //  <default 200>
            cameraFirstPerson: false, //  <default true>
            backgroundColor: { //  <default white>
                r: .95,
                g: .95,
                b: 1
            }
        };

        let sceneManager7 = new ChartSceneManager(sceneOptions);

        let chartOptions = {
            type: 'gauge',
            title: 'Project Completion Status',
            data: data,
    
            titleDepth: .01, //  < default .01 >
            doughnut: false,  // applies to pie chart only
    
            round: false, //  < default false >  applies to bar chart only        
            depth: 10.5, //  < default .25 >          
            alpha: 1, //  < default 1 >
    
            textDepth: .01, //  < default .01 >
            textColor: { //  < default black >
                r: 0,
                g: 0,
                b: 0
            },
            transition: true
        };
    
        chartOptions.materialIndex =  1;
        chartOptions.value = 85;
        chartOptions.title = 'UI Modifications';
    
        let chart7_1 = sceneManager7.addChart(chartOptions);  //  left
        chart7_1.masterTransform.position.x = -280;
        chart7_1.masterTransform.position.y = 70;
        chart7_1.masterTransform.scaling = new BABYLON.Vector3(.27,.27,.27);
        
        chartOptions.type = 'gauge2';
        chartOptions.materialIndex =  6;
        chartOptions.value = 54;
        chartOptions.title = 'Project Completion';
        let chart7_2 = sceneManager7.addChart(chartOptions);  //  left
        // chart7_2.masterTransform.position.x = 500;
        chart7_2.masterTransform.position.y = 50;
        chart7_2.masterTransform.scaling = new BABYLON.Vector3(.543,.543,.543);    
        
        chartOptions.type = 'gauge';
        chartOptions.materialIndex = 6;
        chartOptions.value = 55;
        chartOptions.title = 'DB Modifications';
        let chart7_3 = sceneManager7.addChart(chartOptions);  //  left
        chart7_3.masterTransform.position.x = 280;
        chart7_3.masterTransform.position.y = 70;
        chart7_3.masterTransform.scaling = new BABYLON.Vector3(.27,.27,.27);    
    
        chartOptions.materialIndex = 1;
        chartOptions.value = 100;
        chartOptions.title = 'Component 1';
        let chart7_4 = sceneManager7.addChart(chartOptions);  //  left
        chart7_4.masterTransform.position.x = -220;
        chart7_4.masterTransform.position.y = -130;
        chart7_4.masterTransform.scaling = new BABYLON.Vector3(.27,.27,.27);    
    
        chartOptions.materialIndex = 3;
        chartOptions.value = 10;
        chartOptions.title = 'Component 2';
        let chart7_5 = sceneManager7.addChart(chartOptions);  //  left
        chart7_5.masterTransform.position.y = -180;
        chart7_5.masterTransform.scaling = new BABYLON.Vector3(.27,.27,.27);    
    
        chartOptions.materialIndex = 3;
        chartOptions.value = 20;
        chartOptions.title = 'Component 3';
        let chart7_6 = sceneManager7.addChart(chartOptions);  //  left
        chart7_6.masterTransform.position.x = 220;
        chart7_6.masterTransform.position.y = -130;
        chart7_6.masterTransform.scaling = new BABYLON.Vector3(.27,.27,.27);    
    }





    ////////////////////////////////////////////////////////////////////


    function scene8(){
        let sceneOptions = {
            id: 'area', // required - id of canvas element to use
            width: 600, //  <default 300>
            height: 350, //  <default 200>
            cameraFirstPerson: false, //  <default true>
            backgroundColor: { //  <default white>
                r: .95,
                g: .95,
                b: 1
            }
        };

        let sceneManager8 = new ChartSceneManager(sceneOptions);

        let chartOptions = {
            type: 'area',
            title: 'Area Summary',
            data: data2,
    
            titleDepth: .01, //  < default .01 >
            doughnut: false,  // applies to pie chart only
    
            round: false, //  < default false >  applies to bar chart only        
            depth: 15, //  < default .25 >          
            alpha: 1, //  < default 1 >
    
            textDepth: .01, //  < default .01 >
            textColor: { //  < default black >
                r: 0,
                g: 0,
                b: 0
            },
            transition: true
        };
    
        let chart8_1 = sceneManager8.addChart(chartOptions);  //  left
        chart8_1.masterTransform.position.x = 0;
        chart8_1.masterTransform.position.y = 0;

    }

    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////


    scene1();
    scene2();
    scene3();
    scene4();
    scene5();
    scene7();
    scene8();



    // setTimeout(() => {sceneManager1.removeChart(chart1_2)}, 20000);


    ////////////////////////////////////////////////////////////////////


 

    ////////////////////////////////////////////////////////////////////




    ////////////////////////////////////////////////////////////////////




    ////////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////



    // chartOptions.title = 'Doughnut Sales';

    // chartOptions.type = 'pie';
    // chartOptions.textColor = {
    //     r:0,
    //     g:0,
    //     b:0
    // }
    // chartOptions.transition = false;
    // chartOptions.doughnut = true;

    // let chart6_1 = sceneManager6.addChart(chartOptions);

    ////////////////////////////////////////////////////////////////////

    



    ////////////////////////////////////////////////////////////////////



    ////////////////////////////////////////////////////////////////////


    // chart8_1.masterTransform.scaling = new BABYLON.Vector3(.27,.27,.27);
    

}