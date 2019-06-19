# 3dcharts

DESCRIPTION: 

/////////////////////////////////////////////////////////////////////////

USAGE:


    let sceneManager1 = new ChartSceneManager( {id: 'mixed',                // required - id of canvas element to use
                                                width: 600,                 //  <default 300>
                                                height: 350} );

    let dataSeries = getDataProdecure();

    let chart1_1 = sceneManager1.addChart( {type: 'pie',                    // required - ['line', 'bar', 'stacked', '3D', 'pie']
                                            title: 'Monthly Pie Sales',     // required
                                            data: dataSeries,               // required
                                            doughnut: true} );

    sceneManager1.removeChart(chart1_1);


/////////////////////////////////////////////////////////////////////////


class ChartSceneManager

    Main scene management class.  
        returns a scene ID or null
        usage: 
            let sceneManager1 = new ChartSceneManager(sceneOptions);

        scene options:
            let sceneOptions = {
                id: 'mixed',                // required - id of canvas element to use

                width: 600,                 //  <default 300>
                height: 350,                //  <default 200>
                cameraFirstPerson: true,    //  <default true>
                backgroundColor: {          //  <default white>
                     r: 0,
                     g: 0,
                     b: 0
                 }   
            };

    Methods:
        addChart(chartOptions);
            returns a chartID or null
            usage: 
                let chart1_1 = sceneManager1.addChart(chartOptions);

        updateChart(chartOptions);
            usage: 
                sceneManager1.updateChart(chartOptions);

        removeChart(chartID);
            usage: 
                sceneManager1.removeChart(chartID);


    chart options;
        let chartOptions = {
            type: 'pie',                    // required - ['line', 'bar', 'stacked', '3D', 'pie']
            title: 'Monthly Pie Sales',     // required
            data: dataSeries,               // required

            titleDepth: .01,                //  < default .01 >
            doughnut: false,                //  < default false > applies to pie chart only

            round: false,                   //  < default false >  applies to bar chart only        
            depth: 10.5,                    //  < default .25 >          
            alpha: 1,                       //  < default 1 >

            textDepth: .01,                 //  < default .01 >
            textColor: {                    //  < default black >
                r: 0,
                g: 0,
                b: 0
            }
        };


    dataSeries object:

        {
            'series1Name':  [
                {
                    label: 'string',            // required
                    value: 'number',            // required
                    details: {                  // optional
                        'detail1': 'detail',
                        'detail2': 'detail',
                        // ...
                    } 
                },
                {
                    label: 'string',
                    value: 'number',
                    details: {
                        'detail1': 'detail',
                        'detail2': 'detail',
                        // ...
                    } 
                }
            ],
            'series2Name':  [
                // ...
            ]
            // ...
        }

