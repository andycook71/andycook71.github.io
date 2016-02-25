$(function () {
    $.getJSON('http://blog.andycook.com/posts/cellar/output.json', function (data) {

        var bomData = new Array();
        for (var i=0; i<data.length; i++) {
            var record = data[i];
            bomData.push([new Date(record.date).getTime(), record.bMin, record.bMax])
        }

        var cellarData = new Array();
        for (var i=0; i<data.length; i++) {
            var record = data[i];
            cellarData.push([new Date(record.date).getTime(), record.cMin, record.cMax])
        }
//        = $.map(data, function(record) {
  //          return new Array(new Date(record.date).getTime(), record.bMin, record.bMax);
            /*
  {
    "date": "2016-01-28",
    "cMin": 25.3,
    "cMax": 26.6,
    "cAvg": 26.0,
    "bMin": 21.4,
    "bMax": 27.6
  },
            */
     //   });

        $('#container').highcharts({

            chart: {
                type: 'arearange',
                zoomType: 'x'
            },

            title: {
                text: 'Temperature variation by day'
            },

            xAxis: {
                type: 'datetime'
            },

            yAxis: {
                title: {
                    text: null
                }
            },

            tooltip: {
                crosshairs: true,
                shared: true,
                valueSuffix: '°C'
            },

            legend: {
                enabled: false
            },

            series: [{
                name: 'BOM Temperatures',
                data: bomData
            },
            {
                name: 'Cellar Temperatures',
                data: cellarData
            },
            ]

        });
    });

});