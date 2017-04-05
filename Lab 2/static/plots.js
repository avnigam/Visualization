var DATA_URL = '/api/';
// call the method below

function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function plot_values_eud() {
    d3.select("#scatter-load").selectAll("svg").remove();
    d3.json(DATA_URL + 'mds_eu', function (error, data) {
        var csv = ConvertToCSV(data);
        plot(csv);
    });
}

function plot_values_cor() {
    d3.select("#scatter-load").selectAll("svg").remove();
    d3.json(DATA_URL + 'mds_cor', function (error, data) {
        var csv = ConvertToCSV(data);
        plot(csv);
    });
}

function plot_values_pca() {
    d3.select("#scatter-load").selectAll("svg").remove();
    d3.json(DATA_URL + 'pca', function (error, data) {
        var csv = ConvertToCSV(data);
        plot(csv);
    });
}

function plot_attributes_ada() {
    d3.select("#scatter-load").selectAll("svg").remove();
    d3.json(DATA_URL + 'data_ada', function (error, data) {
        var csv = ConvertToCSV(data);
        matrix(csv);
    });
}

function plot_attributes_rnd() {
    d3.select("#scatter-load").selectAll("svg").remove();
    d3.json(DATA_URL + 'data_rnd', function (error, data) {
        var csv = ConvertToCSV(data);
        matrix(csv);
    });
}

function plot_kmean() {
    d3.select("#scatter-load").selectAll("svg").remove();
    d3.json(DATA_URL + 'kmean', function (error, data) {
        var csv = ConvertToCSV(data);
        line(csv);
    });
}

function plot_scr_ada() {
    d3.select("#scatter-load").selectAll("svg").remove();
    d3.json(DATA_URL + 'scr_ada', function (error, data) {
        var csv = ConvertToCSV(data);
        line2(csv);
    });
}

function plot_rms_ada() {
    d3.select("#scatter-load").selectAll("svg").remove();
    d3.json(DATA_URL + 'rms_ada', function (error, data) {
        var csv = ConvertToCSV(data);
        line1(csv);
    });
}

function plot_rms_rnd() {
    d3.select("#scatter-load").selectAll("svg").remove();
    d3.json(DATA_URL + 'rms_rnd', function (error, data) {
        var csv = ConvertToCSV(data);
        line1(csv);
    });
}

function plot_scr_rnd() {
    d3.select("#scatter-load").selectAll("svg").remove();
    d3.json(DATA_URL + 'scr_rnd', function (error, data) {
        var csv = ConvertToCSV(data);
        line2(csv);
    });
}

function plot(plotdata) {
    var margin = {top: 30, right: 20, bottom: 30, left: 100},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#scatter-load").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data = d3.csv.parse(plotdata, function (d) {
        return d;
    });

    x.domain(d3.extent(data, function (d) {
        return d.a / 4;
    })).nice();
    y.domain(d3.extent(data, function (d) {
        return d.b / 4;
    })).nice();

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 35)
        .style("text-anchor", "end")
        .text("Component A");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -45)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Component B")

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3)
        .attr("cx", function (d) {
            return 325 + x(d.a) / 6;
        })
        .attr("cy", function (d) {
            return 175 + y(d.b) / 6;
        })
        .style("fill", function (d) {
            return color(d.c);
        });

    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) {
            return d;
        });

}

function matrix(plotdata) {
    var margin = {top: 30, right: 20, bottom: 30, left: 100},
		width = 960,
        size = 230,
        padding = 20;

    var x = d3.scale.linear()
        .range([padding / 2, size - padding / 2]);

    var y = d3.scale.linear()
        .range([size - padding / 2, padding / 2]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(6);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(6);

    var color = d3.scale.category10();

    data = d3.csv.parse(plotdata, function (d) {
        return d;
    });

    var domainByTrait = {},
        traits = d3.keys(data[0]),
        n = traits.length;

    traits.forEach(function (trait) {
        domainByTrait[trait] = d3.extent(data, function (d) {
            return d[trait];
        });
    });

    xAxis.tickSize(size * n);
    yAxis.tickSize(-size * n);

    var brush = d3.svg.brush()
        .x(x)
        .y(y)
        .on("brushstart", brushstart)
        .on("brush", brushmove)
        .on("brushend", brushend);

    var svg = d3.select("#scatter-load").append("svg")
        .attr("width", size * n + padding + margin.left)
        .attr("height", size * n + padding + margin.top)
        .append("g")
        .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

    svg.selectAll(".x.axis")
        .data(traits)
        .enter().append("g")
        .attr("class", "x axis")
        .attr("transform", function (d, i) {
            return "translate(" + (n - i - 1) * size + ",0)";
        })
        .each(function (d) {
            x.domain(domainByTrait[d]);
            d3.select(this).call(xAxis);
        });

    svg.selectAll(".y.axis")
        .data(traits)
        .enter().append("g")
        .attr("class", "y axis")
        .attr("transform", function (d, i) {
            return "translate(0," + i * size + ")";
        })
        .each(function (d) {
            y.domain(domainByTrait[d]);
            d3.select(this).call(yAxis);
        });

    var cell = svg.selectAll(".cell")
        .data(cross(traits, traits))
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function (d) {
            return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")";
        })
        .each(plot);

    // Titles for the diagonal.
    cell.filter(function (d) {
        return d.i === d.j;
    }).append("text")
        .attr("x", padding)
        .attr("y", padding)
        .attr("dy", ".71em")
        .text(function (d) {
            return d.x;
        });

    cell.call(brush);

    function plot(p) {
        var cell = d3.select(this);

        x.domain(domainByTrait[p.x]);
        y.domain(domainByTrait[p.y]);

        cell.append("rect")
            .attr("class", "frame")
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("width", size - padding)
            .attr("height", size - padding);

        cell.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", function (d) {
                return 35 + x(d[p.x]) / 4;
            })
            .attr("cy", function (d) {
                return 135 + y(d[p.y]) / 4;
            })
            .attr("r", 3)
            .style("fill", color_decide(p));
    }

    function color_decide(p) {
        if ((p.x == 'a' && p.y == 'b') || (p.x == 'b' && p.y == 'a')) {
            return "red"
        }
        if ((p.x == 'a' && p.y == 'c') || (p.x == 'c' && p.y == 'a')) {
            return "green"
        }
        if ((p.x == 'c' && p.y == 'b') || (p.x == 'b' && p.y == 'c')) {
            return "blue"
        }
        return "black";
    }

    var brushCell;

    // Clear the previously-active brush, if any.
    function brushstart(p) {
        if (brushCell !== this) {
            d3.select(brushCell).call(brush.clear());
            x.domain(domainByTrait[p.x]);
            y.domain(domainByTrait[p.y]);
            brushCell = this;
        }
    }

    // Highlight the selected circles.
    function brushmove(p) {
        var e = brush.extent();
        svg.selectAll("circle").classed("hidden", function (d) {
            return e[0][0] > d[p.x] || d[p.x] > e[1][0]
                || e[0][1] > d[p.y] || d[p.y] > e[1][1];
        });
    }

    // If the brush is empty, select all circles.
    function brushend() {
        if (brush.empty()) svg.selectAll(".hidden").classed("hidden", false);
    }

    function cross(a, b) {
        var c = [], n = a.length, m = b.length, i, j;
        for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
        return c;
    }
}

function line(plotdata) {
    // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 20, bottom: 30, left: 100},
        width = 600,
        height = 300;

    // Parse the date / time

    // Set the ranges
    var x = d3.scale.linear().domain([0, 10]).range([0, width]);
    var y = d3.scale.linear().domain([7.95E-02, 7.17E-01]).range([height, 7.95E-02]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(10);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(10);

    // Define the line
    var valueline = d3.svg.line()
        .x(function (d) {
            return x(d.a);
        })
        .y(function (d) {
            return y(d.b);
        });

    // Adds the svg canvas
    var svg = d3.select("#scatter-load")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    data = d3.csv.parse(plotdata, function (d) {
        return d;
    });

    x.domain([0, 10]);
    y.domain([3.13E-02, 7.17E-01]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
		.append("text")
      //.attr("fill", "#000")
	  .attr("dy", "2.5em")
      .attr("transform", "translate(" + width + ", 0)")
      .attr("text-anchor", "end")
      .text("Number of clusters");
		
	svg.append("g")
      .call(yAxis)
		.append("text")
      //.attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
      .attr("dx", "-1em")
      .attr("text-anchor", "end")
      .text("Average within-cluster sum of squares");

}

function line1(plotdata) {
    // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 20, bottom: 30, left: 100},
        width = 600,
        height = 300;

    // Parse the date / time

    // Set the ranges
    var x = d3.scale.linear().domain([1, 13]).range([0, width]);
    var y = d3.scale.linear().domain([0, 0.9]).range([height, 0]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(10);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(10);

    // Define the line
    var valueline = d3.svg.line()
        .x(function (d) {
            return x(d.a);
        })
        .y(function (d) {
            return y(d.b);
        });

    // Adds the svg canvas
    var svg = d3.select("#scatter-load")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    data = d3.csv.parse(plotdata, function (d) {
        return d;
    });

    x.domain([1, 13]);
    y.domain([0, 0.9]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
		.append("text")
      //.attr("fill", "#000")
	  .attr("dy", "2.5em")
      .attr("transform", "translate(" + width + ", 0)")
      .attr("text-anchor", "end")
      .text("Attributes");
		
	svg.append("g")
      .call(yAxis)
		.append("text")
      //.attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
      .attr("dx", "-1em")
      .attr("text-anchor", "end")
      .text("Root Mean Squared Sum");

}

function line2(plotdata) {
    // Set the dimensions of the canvas / graph
    margin = {top: 30, right: 20, bottom: 30, left: 100},
        width = 600,
        height = 300;

    // Parse the date / time

    // Set the ranges
    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(10);

    // Define the line
    var valueline = d3.svg.line()
        .x(function (d) {
            return x(d.a);
        })
        .y(function (d) {
            return y(d.b);
        });

    // Adds the svg canvas
    var svg = d3.select("#scatter-load")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    data = d3.csv.parse(plotdata, function (d) {
        console.log(d);
        return d;
    });

    x.domain(d3.extent(data, function (d) {
        return d.a;
    }));
    y.domain([1.87E-09, 6.68]);

	svg.append("line")          // attach a line
    .style("stroke", "black")  // colour the line
    .attr("x1", 10)     // x position of the first end of the line
    .attr("y1", 250)      // y position of the first end of the line
    .attr("x2", width)     // x position of the second end of the line
    .attr("y2", 250);
	
    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
		.append("text")
		.attr("dy", "2.5em")
      .attr("fill", "#000")
      .attr("transform", "translate(" + width + ", 0)")
      .attr("text-anchor", "end")
      .text("Components");
		
		
	svg.append("g")
      .call(yAxis)
    .append("text")
      //.attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
	  .attr("dx", "-1em")
      .attr("text-anchor", "end")
      .text("Eigen Value");

}