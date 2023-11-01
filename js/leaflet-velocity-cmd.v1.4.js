	 	// **************************
	 	// velocity part 0
	 	// **************************  
	 	var GFS_server_year = 2019;
	 	var GFS_server_month = 8;
	 	var GFS_server_day = 19;
	 	var GFS_server_hour = 6;
	 	var GFS_timesteps = 81;
	 	var GFS_interval = 3;
	 	var WAVE_timesteps = 61;
	 	var WAVE_interval = 3;
		var actualTimeIndex;

	 	// **************************
	 	// velocity part 1
	 	// **************************  
	 	var startTime = new Date(Date.UTC(GFS_server_year, GFS_server_month - 1, GFS_server_day, GFS_server_hour));
	 	var actualTime = new Date(Date.UTC(GFS_server_year, GFS_server_month - 1, GFS_server_day, GFS_server_hour + 6));
	 	var endTime = new Date(Date.UTC(GFS_server_year, GFS_server_month - 1, GFS_server_day, GFS_server_hour + ((GFS_timesteps - 1) * GFS_interval)));
	 	var dataTimeInterval = startTime.toISOString() + "/" + endTime.toISOString();
	 	var actualInterval = GFS_interval * 2; // show only every second available timestep (GFS_interval is "3" hours  
	 	var baseIndex = 1; // index of the wind10mArray containing the layer nearest to the actual time (2 if actualIndex == GFS_Index, 1 if actualIndex == GFS_Index * 2 )  
	 	var dataPeriod = "PT" + (actualInterval) + "H";
	 	var wind10mBaseURL = 'https://smtp.openportguide.org/weather/wind10m/';
	 	var wind10mBaseName = 'wind10m_{h}h';
	 	var wind10mName = '';
	 	var wind10mArray = [];

	 	// **************************
	 	// Moving velocity part 2
	 	// **************************
	 	function velocityFollowup() {
	 	    wind10mLayerGroup = new L.layerGroup([], {});
	 	    wind10mArray.length = map.timeDimension._availableTimes.length;

	 	    actualTimeIndex = map.timeDimension._currentTimeIndex;
	 	    updateLayer(wind10mArray[actualTimeIndex]);

	 	    //the following code will enable the call to retrieve the vector data
	 	    window.setInterval(function() { // check if time index changed        
	 	        if (actualTimeIndex != map.timeDimension._currentTimeIndex) {
	 	            actualTimeIndex = map.timeDimension._currentTimeIndex;
	 	            updateLayer(wind10mArray[actualTimeIndex]);
	 	        }
	 	    }, 100);
	 	}

	 	function updateLayer(Layer) { // updates the actual layer  
	 	    wind10mLayerGroup.clearLayers();
	 	    wind10mName = wind10mBaseName.replace(/{h}/g, (actualTimeIndex - baseIndex) * actualInterval);


	 	    //get data from JSON file on Amazon S3 bucket
			var airNowUrl = "https://d33xjurfl7x8p2.cloudfront.net/windvectors2.json?y=22&x=" + kendo.toString(new Date(), "yyyyMMddHH");
	 	    //var airNowUrl = "https://terrabase-www-static.s3.amazonaws.com/windvectors2.json?y=22&x=" + kendo.toString(new Date(), "yyyyMMddHH");
	 	    //var airNowUrl=wind10mBaseURL+wind10mName+".json?x="+kendo.toString(new Date(),"yyyyMMddTH");;
	 	    $.getJSON(airNowUrl)
	 	        .done(function(data) {
	 	            createWindVectors(data);
	 	        })
	 	        .fail(function(err) {
	 	            alert("Error: " + JSON.stringify(err));
	 	        });

	 	    function createWindVectors(data) {
	 	        this[wind10mName] = L.velocityLayer({
	 	            displayValues: true,
	 	            displayOptions: {
	 	                velocityType: "Wind",
	 	                emptyString: "No wind data",
	 	                angleConvention: "BearingCW",
	 	                speedUnit: "Bft"
	 	            },
	 	            data: data,
	 	            minVolocity: 0,
	 	            maxVelocity: 30,
	 	            velocityScale: 0.008,
	 	            particleAge: 90,
	 	            lineWidth: 1,
	 	            particleMultiplier: 0.0033,
	 	            frameRate: 15,
	 	            //colorScale: ["#73B2FF", "#73B2FF", "#73B2FF", "#73B2FF", "#73B2FF", "#73B2FF", "#73B2FF", "#73B2FF","#73B2FF","#73B2FF","#73B2FF","#73B2FF","#73B2FF","#73B2FF","#73B2FF"]          

	 	            colorScale: ["#2468b4", "#3c9dc2", "#80cdc1", "#97daa8", "#c6e7b5", "#eef7d9", "#ffee9f", "#fcd97d", " #ffb664", " #fc964b", " #fa7034", " #f54020", " #ed2d1c", " #dc1820", " #b40023"]
	 	        });

	 	        wind10mLayerGroup.addLayer(this[wind10mName]);
	 	        wind10mArray[actualTimeIndex] = wind10mLayerGroup.getLayer(wind10mLayerGroup.getLayerId(this[wind10mName]));
                  wind10mLayerGroup.addTo(map);
                  map.spin(false);
	 	    }

	 	}