var bar_chart_draw =function(content, idx) {
    /*am4core.ready(function () {
        // Themes begin
        am4core.useTheme(am4themes_material);
        am4core.useTheme(am4themes_animated);

        var chart = am4core.create("bar-chartdiv"+idx, am4charts.XYChart);
        chart.scrollbarX = new am4core.Scrollbar();

        chart.data = [];
        for(let i = 1; i < content.length; i++) {
            for (let j = 1; j < content[0].length; j++) {
                let name = content[i][0] + "(" + content[0][j] + ")";
                if(content[0][j] == undefined || content[0][j] == null || content[0][j] == "")
                    name = content[i][0];
                let val = content[i][j];
                if(val == undefined || isNaN(val))
                    val = 0;
                if (Array.isArray(content[i][j]) === true)
                    val = 10;
                var dt = {
                    "country": name,
                    "visits": val
                };
                chart.data.push(dt);
            }
        }

        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "country";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.renderer.labels.template.rotation = 270;
        categoryAxis.tooltip.disabled = true;
        categoryAxis.renderer.minHeight = 110;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minWidth = 50;

        // Create series

        var series = chart.series.push(new am4charts.ColumnSeries());
        series.sequencedInterpolation = true;
        series.dataFields.valueY = "visits";
        series.dataFields.categoryX = "country";
        series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
        series.columns.template.strokeWidth = 0;
        series.tooltip.pointerOrientation = "vertical";
        series.columns.template.column.cornerRadiusTopLeft = 10;
        series.columns.template.column.cornerRadiusTopRight = 10;
        series.columns.template.column.fillOpacity = 0.8;

        // on hover, make corner radiuses bigger
        var hoverState = series.columns.template.column.states.create("hover");
        hoverState.properties.cornerRadiusTopLeft = 0;
        hoverState.properties.cornerRadiusTopRight = 0;
        hoverState.properties.fillOpacity = 1;

        series.columns.template.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
        });
        // Cursor
        chart.cursor = new am4charts.XYCursor();

    }); // end am4core.ready()*/

    let x_point = [];
    let y_point = [];
    let names = [];
    for(let i = 1; i < content.length; i++) {
        let x = [];
        let y = [];
        for (let j = 1; j < content[0].length; j++) {
            x.push(content[0][j]);
            let val = content[i][j];
            if(val == undefined || isNaN(val))
                val = 0;
            if (Array.isArray(content[i][j]) === true)
                val = 10;
            y.push(val);
        }
        x_point.push(x);
        y_point.push(y);
        names.push(content[i][0]);
    }
    let chart_data = [];
    for(let c = 0; c < names.length; c++) {
        let trace = {
            x: x_point[c],
            y: y_point[c],
            name: names[c],
            type: 'bar',
        }
        chart_data.push(trace);
    }

    var layout = {barmode: 'group'};

    Plotly.newPlot("bar-chartdiv"+idx, chart_data, layout);

};

