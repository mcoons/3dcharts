var newData = {};


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

    // Send request
    request.send();
}


// var retrievedData = 
// getRESTData(url);


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

for (let seriesCount = 0; seriesCount < 3; seriesCount++) {
    dataSeries['Series' + seriesCount] = [];
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
        dataSeries['Series' + seriesCount].push(data);
    }
}

console.log('dataSeries:')
console.log(dataSeries)

parseData(dataSeries);
buildIt(dataSeries)

////////////////////////////////////////////////////////////////////

function buildIt(data) {
    // console.log('data in buildIt' )
    // console.log(data);

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
        }
    };


    let chart1_1 = sceneManager1.addChart(chartOptions);

    // setTimeout( () => {sceneManager1.removeChart(chart1_1)}, 10000);


    chartOptions = {
        type: 'bar',
        title: 'Monthly Metrics',
        data: data,

        titleDepth: .01, //  < default .01 >

        round: false, //  < default false >          
        depth: 10.5, //  < default .25 >          
        alpha: 1, //  < default 1 >

        textDepth: .01, //  < default .01 >
        textColor: { //  < default black >
            r: 0,
            g: 0,
            b: 0
        }
    };

    let chart1_2 = sceneManager1.addChart(chartOptions);

    // setTimeout(() => {sceneManager1.removeChart(chart1_2)}, 20000);


    ////////////////////////////////////////////////////////////////////

    sceneOptions = {
        id: 'bar1', // required - id of canvas element to use
        width: 600, //  <default 300>
        height: 350, //  <default 200>
        cameraFirstPerson: true, //  <default true>
        backgroundColor: { //  <default white>
            r: 0.2,
            g: 0.0,
            b: 0.2
        }
    };

    let sceneManager2 = new ChartSceneManager(sceneOptions);


    chartOptions.round = true;
    chartOptions.textColor = {
        r: 1,
        g: 1,
        b: 1
    };

    let chart2_1 = sceneManager2.addChart(chartOptions);

    ////////////////////////////////////////////////////////////////////

    sceneOptions = {
        id: 'bar2', // required - id of canvas element to use
        width: 600, //  <default 300>
        height: 350, //  <default 200>
        cameraFirstPerson: true, //  <default true>
        backgroundColor: { //  <default white>
            r: 0.2,
            g: 0.2,
            b: 0.0
        }
    };

    let sceneManager3 = new ChartSceneManager(sceneOptions);


    chartOptions.type = 'stacked';
    chartOptions.round = false;

    let chart3_1 = sceneManager3.addChart(chartOptions);

    ////////////////////////////////////////////////////////////////////

    sceneOptions = {
        id: 'bar3', // required - id of canvas element to use
        width: 600, //  <default 300>
        height: 350, //  <default 200>
        cameraFirstPerson: true, //  <default true>
        backgroundColor: { //  <default white>
            r: 0.0,
            g: 0.2,
            b: 0.2
        }
    };

    let sceneManager4 = new ChartSceneManager(sceneOptions);


    chartOptions.type = '3D';
    chartOptions.round = false;

    let chart4_1 = sceneManager4.addChart(chartOptions);


    ////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////

    sceneOptions = {
        id: 'line1', // required - id of canvas element to use
        width: 600, //  <default 300>
        height: 350, //  <default 200>
        cameraFirstPerson: true, //  <default true>
        backgroundColor: { //  <default white>
            r: 0.0,
            g: 0.0,
            b: 0.2
        }
    };

    let sceneManager5 = new ChartSceneManager(sceneOptions);


    chartOptions.type = 'line';
    chartOptions.round = false;

    let chart5_1 = sceneManager5.addChart(chartOptions);


    ////////////////////////////////////////////////////////////////////


}