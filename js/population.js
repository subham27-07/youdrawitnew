var pymChild = null;
var pymChild = new pym.Child();


var data = [
  {'year': 1999, 'deaths': 6.6},
  {'year': 2000, 'deaths': 7.15},
  {'year': 2001, 'deaths': 7.79},
  {'year': 2002, 'deaths': 8.56},
  {'year': 2003, 'deaths': 9.29},
  {'year': 2004, 'deaths': 9.87},
  {'year': 2005, 'deaths': 10.49},
  {'year': 2006, 'deaths': 10.98},
  {'year': 2007, 'deaths': 11.26},
  {'year': 2008, 'deaths': 11.55},
  {'year': 2009, 'deaths': 11.89},
  {'year': 2010, 'deaths': 12.28},
  {'year': 2011, 'deaths': 12.95},
  {'year': 2012, 'deaths': 13.61},
  {'year': 2013, 'deaths': 14.54},
  {'year': 2014, 'deaths': 15.80},
  {'year': 2015, 'deaths': 17.50},
  {'year': 2016, 'deaths': 19.58},
  {'year': 2017, 'deaths': 20.81},
  {'year': 2018, 'deaths': 21.33},
  {'year': 2019, 'deaths': 22.03}

]


var winwidth = parseInt(d3.select('#chart-body-4').style('width'))

var winheight = parseInt(d3.select('#chart-body-4').style('height'))


var ƒ = d3.f

var sel = d3.select('#chart-body-4').html('')
var c = d3.conventions({
  parentSel: sel, 
  totalWidth: winwidth, 
  height:  250, 
  margin: {left: 50, right: 50, top: 5, bottom: 30}
})

pymChild.sendHeight();

c.svg.append('rect').at({width: c.width, height: c.height, opacity: 0})

c.svg.append('circle').attr('cx',c.totalWidth-winwidth).attr('cy',c.height*.755).attr('r', 5).attr('class', 'intro-dot')

c.svg.append('text').attr('x',c.totalWidth-winwidth+5).attr('y',c.height*.73).text('Start dragging here').attr('class','intro-text')

c.x.domain([1999, 2019])
c.y.domain([0, 50])

c.xAxis.ticks(20).tickFormat(ƒ())
c.yAxis.ticks(10).tickFormat(d =>  d3.format(",.3r")(d)+ '%')

var area = d3.area().x(ƒ('year', c.x)).y0(ƒ('deaths', c.y)).y1(c.height)
var line = d3.area().x(ƒ('year', c.x)).y(ƒ('deaths', c.y))







var clipRect = c.svg
  .append('clipPath#clip-5')
  .append('rect')
  .at({width: c.x(2001)-2, height: c.height})

var correctSel = c.svg.append('g').attr('clip-path', 'url(#clip-5)')

correctSel.append('path.area').at({d: area(data.filter(function(d) { return d.year <= 2001; }))})
correctSel.append('path.line').at({d: line(data.filter(function(d) { return d.year <= 2001; }))})


yourDataSel = c.svg.append('path#your-line-5').attr('class', 'your-line')

c.drawAxis()


yourData = data
  .map(function(d){ 
    return {year: d.year, deaths: d.deaths, defined: 0} })
  .filter(function(d){
    if (d.year == 2001) d.defined = true
    return d.year >= 2001
  })


var completed = false

// My addition

var button = d3.select('#chart-body-4').append('button')
                .text('Show Result')
                .style('display', 'block')
                .style('margin', '10px auto')
                .style('padding', '10px 20px')
                .style('background-color', 'lightgray')
                .style('border', 'none')
                .style('cursor', 'pointer')
                .text("Show me the Result")
                
                .on("click", function() {
                  if (!completed) {
                    return
                  }
                    correctSel.append("path.area")
                        .attr("d", area(data))
                        .style("fill", "mediumgray");
                        
                    correctSel.append("path.line")
                        .attr("d", line(data))
                        .style("stroke", "black")
                        .style("stroke-width", "10px");
                  d3.select('#answer-4').style('visibility', 'visible').html("<div>You guessed <p class='your-pink'>"+ d3.format(",.3r")(yourData[yourData.length-1].deaths) + " </p> for 2016.</div><div>The real value was <p class='your-pink'>"+d3.format(",.3r")(data[6].deaths)+"</p>.</div>")
                  d3.select('#explain-4').style('visibility', 'visible').style('opacity', 1)
                  
                
            
                });

// My addition
    
var drag = d3.drag()
  .on('drag', function(){
    d3.selectAll('.intro-text').style('visibility', 'hidden')
    var pos = d3.mouse(this)
    var year = clamp(2001, 2019, c.x.invert(pos[0]))

    var deaths = clamp(0, c.y.domain()[1], c.y.invert(pos[1]))

    yourData.forEach(function(d){
      if (Math.abs(d.year - year) < .5){
        d.deaths = deaths
        d.defined = true
      }
    })

    yourDataSel.at({d: line.defined(ƒ('defined'))(yourData)})
    if (!completed && d3.mean(yourData, ƒ('defined')) == 1){
      completed = true
      clipRect.transition().duration(1000).attr('width', c.x(2019))
      // d3.select('#answer-5').style('visibility', 'visible').html("<div>You guessed <p class='your-pink'>"+ d3.format(",.3r")(yourData[yourData.length-1].deaths) + " </p> for 2016.</div><div>The real value was <p class='your-pink'>"+d3.format(",.3r")(data[6].deaths)+"</p>.</div>")
      // d3.select('#explain-5').style('visibility', 'visible').style('opacity', 1)
      pymChild.sendHeight();

    }
    // saving user drawn data
    var userData = [];
    yourData.forEach(function(d) {
      userData.push({
        year: d.year,
        deaths: d.deaths
      });
    });
    console.log(userData);
  
  });


c.svg.call(drag)

// My addition
c.svg.append("g")
  .attr("class", "grid")
  .call(d3.axisLeft(c.y)
    .tickSize(-c.width)
    .tickFormat("")
  )
  .style("stroke", "lightgrey")
  .style("opacity",0.1)

c.svg.append("g")
  .attr("class", "grid")
  .call(d3.axisBottom(c.x)
  .ticks(20) // Add 10 ticks on the y axis
    .tickSize(+c.height)
    .tickFormat("")
  )
  .style("stroke", "lightgrey")
  .style("opacity",0.1)
  .attr("transform", "translate(0," + c.height/80 + ")");
  
// My addition

function clamp(a, b, c){ return Math.max(a, Math.min(b, c)) }