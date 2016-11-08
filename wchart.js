<!doctype html>

<html>
  <head>
    <meta charset="utf-8">
    <title>Waterfall Bar Chart</title>
    <style>
      .chart {
        font: 10px sans-serif;
      }
      .chart rect {
        stroke: white;
        fill: steelblue;
      }
      .chart text.bar {
        fill: white;
      }
      .gAxisLabel {
        font-size: 16px;
      }
      .gAxis {
        font-size: 120%;
      }
      .dp-line {
        stroke-dasharray: 3, 3;
        stroke-opacity: 0.9;
        stroke: #700;
      }
      .key-metrics {
        font-size: 110%;
        font-weight: bold;
        fill: #700;
      }
    </style>
  </head>
  <body>
    <!--d3.js v4 does not work-->
    <script src="https://cdn.bootcss.com/d3/3.5.17/d3.min.js"></script>
    <script>
      var data = [{ name: "HTML-Document", count: 25, end: 25, measure: "nav_responseEnd"},
                  { name: "Static-Resources", count: 125, end: 150, measure: "mark_static"},
                  { name: "Dynamic-Resources", count: 100, end: 250, measure: "mark_user_time"},
                  { name: "Common-Delays", count: 250, end: 500, measure: "mark_fully_loaded"}];

      function HorizontalWaterfallChart(attachTo,data,maxData){

          maxData += 10;

      var svgHeight = 500,
          svgWidth = 960,
          numTicks =  5,
          recWidth = 25, // Minimum width of the rect 50px;
          xoffset = 80,
          leftMargin = 60,
          lineHeight = 11 * recWidth;

      // Append the chart and pad it a bit
      var chart = d3.select(attachTo)
                    .append("svg")
                    .attr("class", "chart")
                    .attr("width", svgWidth)
                    .attr("height", svgHeight);

      var colorScale = d3.scale.category10();

      // Set the x-axis scale
      var x = d3.scale.linear()
          .domain([0, maxData])
          .range(["0px", "800px"]);

      // X-axis Label
      chart.append("g")
           .attr("transform", "translate(" + svgWidth * 0.5 + ",15)")
           .attr("class", "gAxisLabel")
           .append("text")
           .text("Duration");

      // The main waterfall chart area
      chart.append("g")
           .attr("transform", "translate(" + leftMargin + ",30)")
           .attr("class", "gMainGraphArea");

      // Set the y-axis scale
      chart.append("g")
           .attr("transform", "translate(" + (leftMargin + 80) + ",30)")
           .selectAll("rect")
           .data(data)
           .enter()
           .append("rect")
           .attr("class","rectWF")
           .attr("x",function(d,i) { return x(d.end - d.count); })
           .attr("y", function(d,i) { return i * recWidth; })
           .style("fill", function(d,i) { return colorScale(i); })
           .attr("height", recWidth)
           .attr("width",0)
           .on("mouseover",function(){
             d3.selectAll(".rectWF").style("opacity", 0.2);
             d3.select(this).style("opacity",1);
           })
           .on("mouseout",function(){
             d3.selectAll(".rectWF").style("opacity", 1);
           })
           .transition()
           .duration(1000)
           .attr("width", function(d, i) { return x(d.count); })
           .attr("height", function(d, i) { return (i + 1) * recWidth; })
           .attr("x", function(d,i) { return x((d.end - d.count)); })
           .attr("y", function(d,i) { return i*(i+1)/2 * recWidth; });


      // Set the values on the bars
      chart.append("g")
           .attr("transform", "translate(" + (leftMargin + xoffset) + ",30)")
           .selectAll("text")
           .data(data)
           .enter()
           .append("text")
           .attr("class","bar")
           .attr("x", function(d, i) { return x(d.end - (d.count/2) + recWidth * 0.5) ; })
           .attr("y", function(d, i) { return i*(i+1)/2  * recWidth + recWidth * 0.6; })
           .attr("dx", -5) // padding-right
           .attr("dy", "0") // vertical-align: middle
           .attr("text-anchor", "end") // text-align: right
           .text(function(d, i) { return (d.count * 10); });

      // Set the vertical lines for axis
      chart.append("g")
           .attr("transform", "translate(" + (leftMargin + xoffset) + ",30)")
           .selectAll("line")
           .data(x.ticks(numTicks))
           .enter()
           .append("line")
           .attr("x1", x)
           .attr("x2", x)
           .attr("y1", 0)
           .attr("y2",0)
           .transition()
           .duration(1500)
           .attr("y2", lineHeight)
           .style("stroke", "#ccc");

      // Set the numbering on the lines for axis
      chart.append("g")
           .attr("transform", "translate(" + (leftMargin + xoffset) + ",30)")
           .selectAll(".rule")
           .data(x.ticks(numTicks))
           .enter()
           .append("text")
           .attr("class", "rule")
           .attr("x", x)
           .attr("y", 0)
           .attr("dy", -3)
           .attr("text-anchor", "middle")
           .text(function(d, i) { return i * 1000 + 'ms'; });

      // Set the base line at the left-most corner
      var ll = chart.append("g")
                    .attr("class","gAxis")
                    .attr("transform", "translate(" + xoffset + ",45)");

      ll.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", leftMargin - 10)
        .attr("y", function(d, i) { return i*(i+1)/2 * recWidth; })
        .attr("dx", -5) // padding-right
        .attr("dy", "0") // vertical-align: middle
        .attr("text-anchor", "end") // text-align: right
        .text(function(d, i) { return (d.name); })
        .style("fill", function(d,i) { return colorScale(i); })
        .style("font-weight","bold");

      var kk = chart.append("g");
      // draw the 'responseEnd' metrics dotted line and label
      kk.append("svg:line")
        .attr("class", 'dp-line')
        .attr("x1", 176)
        .attr("x2", 176)
        .attr("y1", 30)
        .attr("y2", 305);

      kk.append("text")
        .attr("class", "key-metrics")
        .attr("x", 177)
        .attr("y", 315)
        .attr("text-anchor", "left")
        .text("nav_responseEnd");

      // draw the 'mark_static' metrics dotted line and label
      kk.append("svg:line")
        .attr("class", 'dp-line')
        .attr("x1", 354)
        .attr("x2", 354)
        .attr("y1", 30)
        .attr("y2", 305);

      kk.append("text")
        .attr("class", "key-metrics")
        .attr("x", 355)
        .attr("y", 315)
        .attr("text-anchor", "left")
        .text("mark_static");

      // draw the 'mark_user_time' metrics dotted line and label
      kk.append("svg:line")
        .attr("class", 'dp-line')
        .attr("x1", 497)
        .attr("x2", 497)
        .attr("y1", 30)
        .attr("y2", 305);

      kk.append("text")
        .attr("class", "key-metrics")
        .attr("x", 498)
        .attr("y", 315)
        .attr("text-anchor", "left")
        .text("mark_user_time");

      // draw the 'mark_fully_loaded' metrics dotted line and label
      kk.append("svg:line")
        .attr("class", 'dp-line')
        .attr("x1", 855)
        .attr("x2", 855)
        .attr("y1", 30)
        .attr("y2", 305);

      kk.append("text")
        .attr("class", "key-metrics")
        .attr("x", 856)
        .attr("y", 315)
        .attr("text-anchor", "left")
        .text("mark_fully_loaded");
      }

      HorizontalWaterfallChart("body", data, 550);
    </script>
  </body>
</html>
