var w = parseInt(d3.select("#svgCurve").style("width"))
var h = parseInt(d3.select("#svgCurve").style("height"))
const path1 = 'M-6 0 H6 L9 -40 L12 -42 V-75 L0,-78 L-12 -75 V-42 L-9 -40 L-6 0' //'M0 -20 L50 -10  V100 L30 120 L20 250 H-20 L-30 120 L-50 100 v-110'
var each = d3.select("#svgCurve").append('g').attr('fill-opacity', 0.5).attr('stroke', 'black')
each.attr('transform',`translate(${w/2},${h/2})scale(0.4)`)
each.append('circle').attr('cy',-90).attr('r',10).attr("fill",'blue')
each.append('path').attr('d', path1)
.attr('fill','blue')
// each.attr('transform',`scale(1)`)

