var spm = {
    random : true,
    init_zoom : 1,
    init_ctrl : Array.from({length: 16}).fill(1), 
    ctrlScale : [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1,1.2,1.5,2,3,5,10,100],
    preZoomCtrl :{k:1,x:150, y:150}
}
// color
var categorical = [
    { "name": "schemeAccent", "n": 8 },
    { "name": "schemeDark2", "n": 8 },
    { "name": "schemePastel2", "n": 8 },
    { "name": "schemeSet2", "n": 8 },
    { "name": "schemeSet1", "n": 9 },
    { "name": "schemePastel1", "n": 9 },
    { "name": "schemeCategory10", "n": 10 },
    { "name": "schemeSet3", "n": 12 },
    { "name": "schemePaired", "n": 12 },
    { "name": "schemeCategory20", "n": 20 },
    { "name": "schemeCategory20b", "n": 20 },
    { "name": "schemeCategory20c", "n": 20 }
]
var colorScale = d3.scaleOrdinal(d3[categorical[9].name])

const rEach = 15
var idxHover 
function randomState(n=1000,m_=16) {
    if (m_ == 16) {
        var m = 16
        m_ = Array.from({ length: 16}).fill(1)
    } else {
        m = m_.length
    }
    if (spm.random) {
        spm.state = Array.from({ length: n }, () => {
            var [cx, cy] = Array.from({ length: 2},Math.random)
            return {
                cx: Math.sqrt(cx) * Math.cos(cy*2*Math.PI)/2+0.5,
                cy: Math.sqrt(cx) * Math.sin(cy*2*Math.PI)/2+0.5,
                strength: Math.random(),
                features : Array.from({length: m},Math.random).map((v,i) => v*m_[i]),
                status : Array.from({length: m}).fill(1)
            }
        });
    } else {
        spm.state = JSON.parse(JSON.stringify(spm.state0))
        spm.state.forEach((v) => {
            v.features = v.features.map((v1,i) => v1*m_[i])
        })
        spm.state.status = Array.from({length: m}).fill(1)
    }
    spm.state.forEach(s => {
        var vmax = Math.max(...s.features)   
        s.features.forEach((f,i) => {
            if (i < m/2) {
                if (f < s.features[i+m/2]) {
                    s.status[i] = -1
                    s.status[i+m/2] = 1
                } else {
                    s.status[i] = 1
                    s.status[i+m/2] = -1
                }
            }
        })
        s.status[s.features.indexOf(vmax)] = 2
    })
    spm.random = false
}
randomState()
spm.state0 = JSON.parse(JSON.stringify(spm.state))
spm.svg_xy = [$("svg").prop('width').baseVal.value, $("svg").prop('height').baseVal.value]
spm.zoom_xy = [0,0,...spm.svg_xy]
spm.inZoomIdx = Array.from(Array(1000).keys()) // Array(1000).fill(1)
// var spm.svg_xy0 = spm.svg_xy.map(v => v / 2)
var svg = d3.select("svg").attr("class", "full") 
var g0 = svg.append('g')

const featureArc = (d, i) => d3.arc()({  // arc function in main SVG
    innerRadius: 0,
    outerRadius: d.strength * rEach * d.features[i],
    startAngle: i * 2 * Math.PI / 16,
    endAngle: (i + 1) * 2 * Math.PI / 16
})
function render(selSVG, state) {         // render for main SVG
    var each = selSVG.selectAll("g")     // placehoder group
        .data(state)
        .enter()
        .append("g")
        .attr("class", "each")  // add each class for hover in CSS
        .attr("transform", function (d) { return "translate(" + spm.svg_xy[0]/2 + ',' + spm.svg_xy[1]/2 + ")" })
        // .attr("transform", function (d) { return "translate(" + d.cx * spm.svg_xy[0] + ',' + d.cy * spm.svg_xy[1] + ")" })
        // .attr("transform", function (d) { return "translate(" + (Math.sqrt(d.cx) * Math.cos(d.cy*2*Math.PI)+1) * spm.svg_xy[0]/2 + ',' + (Math.sqrt(d.cx) * Math.sin(d.cy*2*Math.PI)+1) * spm.svg_xy[1]/2 + ")" })
        .on("mouseover", function (d, i) { idxHover = i });  //  , console.log(idxHover)
    // .append("title").text('each');
    each.append("circle")
        .attr("cx", 0).attr("cy", 0)
        .attr("r", function (d) { return d.strength * rEach; });
    for (var i = 0; i < 16; i++) {
        each.append("path")
            .attr("class",function(d) {return ((d.status[i]==2) ? 'f_1st' : ((d.status[i]==1) ? "f_2nd" : "f_3rd")) })
            .attr("d", function (d) { return featureArc(d, i) })
            .style("fill", function () { return colorScale(i); })
            .attr('fill-opacity', 0.75);
    }
    each.transition()
        .delay(function(d) {return d.features[1]*1000+600})
        .duration(function(d) {return d.features[0]*2000})
        .attr("transform", function (d) { return "translate(" + d.cx * spm.svg_xy[0] + ',' + d.cy * spm.svg_xy[1] + ")" });

}
setTimeout(function() {render(g0,spm.state)}, 100)  //delay 50ms
setTimeout(function() {aggState()}, 3000)  //delay 50ms
svg.call(d3.zoom().on('zoom', () =>{     // pan & zoom for main SVG
    if (spm.state[idxHover].strength*rEach*d3.event.transform.k > spm.svg_xy[0]/2) {      // hovered one is occuppied 50% in length
        // d3.event.transform.x = 0
        // d3.event.transform.y = 0
        d3.event.transform.x = spm.state[idxHover].cx*spm.svg_xy[0]*d3.event.transform.k + d3.event.transform.x -spm.svg_xy[0]/2
        d3.event.transform.y = spm.state[idxHover].cy*spm.svg_xy[1]*d3.event.transform.k + d3.event.transform.y -spm.svg_xy[1]/2
        d3.event.transform.k = 1.5
    } else if (d3.event.transform.k < 0.5){
        d3.event.transform.x = -4000
        d3.event.transform.y = -4000
        d3.event.transform.k = 10
    }
    // console.log(d3.event.transform)
    g0.attr("transform", d3.event.transform)
    spm.zoom_xy = [-d3.event.transform.x, -d3.event.transform.y, -d3.event.transform.x+spm.svg_xy[0], -d3.event.transform.y+spm.svg_xy[1]]
    spm.zoom_xy = [spm.zoom_xy[0]/spm.svg_xy[0],spm.zoom_xy[1]/spm.svg_xy[1],spm.zoom_xy[2]/spm.svg_xy[0],spm.zoom_xy[3]/spm.svg_xy[1]]
    spm.zoom_xy = spm.zoom_xy.map(v => v/d3.event.transform.k)
    inZoom()
    aggState()
    
}))
function inZoom() {                      // check in zoomed scope of main SVG
    spm.inZoomIdx = []
    spm.state.forEach((e,i) => {
        if (e.cx >= spm.zoom_xy[0] && e.cx <= spm.zoom_xy[2] && e.cy >= spm.zoom_xy[1] && e.cy <= spm.zoom_xy[3]) {spm.inZoomIdx.push(i)}       
    });
}
var aggArc = function (d, i) {                      // arc function in agg SVG
    return d3.arc()({
        innerRadius: 0,
        outerRadius: rEach * d,
        startAngle: i * 2 * Math.PI / 16,
        endAngle: (i + 1) * 2 * Math.PI / 16
    })
}
function renderAgg(selSVG, [state, maxS, minS]) {   // render for aggregation SVGs
    selSVG.select("g").remove()  // 
    var g0 = selSVG.append('g')
        .attr("transform", function (d) { return "translate(" + 150 + ',' + 150 + ")" });

        var eachMax = g0.selectAll("path .aggMax").data(maxS);   
        eachMax.enter()
            .append("path")
            .attr("class", 'aggMax')
            .merge(eachMax)
            .attr("d", function (d,i) { return aggArc(d, i) })
            .style("fill", 'yellow')
            .attr('fill-opacity', 0.3)
            .style('stroke', 'black')
            .style('stroke-width', 0.1);
        eachMax.exit().remove();        

        var each = g0.selectAll("path .agg")  // placehoder group
            .data(state);
        each.enter()
            .append("path")
            .attr("class", 'agg')
            // .append("title").text('each');
            .merge(each)
            // .append("path")
            .attr("d", function (d,i) { return aggArc(d, i) })
            .style("fill", function (d, i) { return colorScale(i); })
            .attr('fill-opacity', 0.50);
        each.exit().remove();

        var eachMin = g0.selectAll("path .aggMin")  // placehoder group
            .data(minS);
        eachMin.enter()
            .append("path")
            .attr("class", 'aggMin')
            // .append("title").text('eachMin');
            .merge(eachMin)
            // .append("path")
            .attr("d", function (d,i) { return aggArc(d, i) })
            .style("fill", function (d, i) { return colorScale(i); })
            .attr('fill-opacity', 1)
            .style('stroke', 'black')
            .style('stroke-width', 1);        eachMin.exit().remove();        
}
function netState(stateData) {                      // net aggregation calculation
    data =[...stateData]
    data.forEach( (v,i) => {
        if (i < 8) {
            if (v>=data[i+8]) {
                data[i] = (data[i]**2 - data[i+8]**2)**0.5
                data[i+8] = 0
            } else {
                data[i+8] = (data[i+8]**2 - data[i]**2)**0.5
                data[i] = 0
            }
        }
    })
    return data
}
function aggState() {                               // aggregation calculation
    spm.aggState = spm.state.filter((v,i) => spm.inZoomIdx.includes(i))
    spm.aggState1 = Array(16).fill(0)  // all 16
    spm.aggState.forEach (v => {
        spm.aggState1 = spm.aggState1.map((v1,i) => v1 + (v.features[i]*v.strength)**2)
    })
    spm.aggState1 = spm.aggState1.map(v => v**0.5)
    var svg1 = d3.select("#svg1")
    renderAgg(svg1, [spm.aggState1, spm.aggState1, netState(spm.aggState1)])

    spm.aggState2 = Array(16).fill(0)  // big 8
    spm.aggState.forEach (v => {
        var v8 = [ ... v.features]
        v.features.forEach((f,i) => { if (v.status[i] < 0) v8[i] = 0 })
        spm.aggState2 = spm.aggState2.map((v1,i) => v1 + (v8[i]*v.strength)**2  )
    })
    spm.aggState2 = spm.aggState2.map(v => v**0.5)
    var svg1 = d3.select("#svg2")
    renderAgg(svg1, [spm.aggState2, spm.aggState1, netState(spm.aggState2)])

    spm.aggState3 = Array(16).fill(0)  // max 1
    spm.aggState.forEach (v => {
        var vmax_ = Array(16).fill(0)   // var vmax = Math.max(...vmax_)
        vmax_[v.status.indexOf(2)] = v.features[v.status.indexOf(2)]
        spm.aggState3 = spm.aggState3.map((v1,i) => v1 + (vmax_[i]*v.strength)**2  )
    })
    spm.aggState3 = spm.aggState3.map(v => v**0.5)
    var svg1 = d3.select("#svg3")
    renderAgg(svg1, [spm.aggState3, spm.aggState1, netState(spm.aggState3)])
}
d3.selectAll("#smallSVGs .aggState").call(d3.zoom().on('zoom', () =>{       // for pan & zoom of agg states 
    if (spm.init_zoom == 1) {
        d3.event.transform.x = 150
        d3.event.transform.y = 150 
        spm.init_zoom = 0
    } 
    d3.selectAll("#smallSVGs .aggState g").attr("transform", d3.event.transform)    
}))

function resetState() {
    randomState(1000,spm.init_ctrl) 
    g0.html("")
    render(g0,spm.state)
    inZoom()
    aggState()
}

function renderCtrl() {
    d3.select("#svg4 g").remove()    
    d3.select("#svg4 text").remove()
    var gCtrl = d3.select("#svg4").append('g')
        .attr("transform", function (d) { return "translate(" + 150 + ',' + 150 + ")" })        
        .on("click", function(){
            var [x,y] = d3.mouse(this);
            console.log(x +', ' + y);
            var i = Math.floor((Math.atan2(-x,y) + Math.PI)/(Math.PI/8));
            spm.init_ctrl[i] = Math.round(Math.sqrt(x*x + y*y)/150 * 100) / 100 
            renderCtrl()
            d3.select("#svg4 g").attr("transform", "translate(150,150) scale(" + spm.preZoomCtrl.k +")")
            resetState()
        })
        .on("dblclick", function(){
            spm.init_ctrl = spm.init_ctrl.map(v => spm.rCtrl)
            renderCtrl()
            d3.select("#svg4 g").attr("transform", "translate(150,150) scale(" + spm.preZoomCtrl.k +")")
            resetState()
        })        
        .on("mousemove", function(){
            var [x,y] = d3.mouse(this);
            d3.select("#svg4 text")
            .attr("x", 0).attr("y", 0)
            .text(Math.round(Math.sqrt(x*x + y*y)/150 * 100) / 100)
            spm.rCtrl = Math.round(Math.sqrt(x*x + y*y)/150 * 100) / 100
        }); 
        d3.select("#svg4") 
            .append("text").attr("transform", function (d) { return "translate(" + 150 + ',' + 150 + ")" }) 
            .attr("x", -150).attr("y", -140)
            .text('');  
    var ctrlBk = gCtrl.selectAll(".ctrlBk").data(spm.init_ctrl);
    ctrlBk.enter()
        .append("path")
        .attr("class", 'ctrlBk)')
    .merge(ctrlBk)
        .attr("d", function (d, i) { return aggArc(100 * 10, i) })
        .style("fill", function (d, i) { return colorScale(i); })
        .attr('fill-opacity', 0.1)
        .style('stroke', 'black')
        .style('stroke-width', 0.3);
    ctrlBk.exit().remove();
    var ctrlState = gCtrl.selectAll(".ctrlState").data(spm.init_ctrl);
    ctrlState.enter()
        .append("path")
        .attr("class", 'ctrlState)')
    .merge(ctrlState)
        .attr("d", function (d, i) { return aggArc(d * 10, i) })
        .style("fill", function (d, i) { return colorScale(i); })
        .attr('fill-opacity', 0.9);
    // .style('stroke', 'black')
    // .style('stroke-width', 0.1);
    ctrlState.exit().remove();
    var ctrlScale = gCtrl.selectAll("circle").data(spm.ctrlScale);
    ctrlScale.enter()
        .append("circle")
        .attr("class", 'ctrlScale')
    .merge(ctrlScale)
        .attr("cx", 0).attr("cy", 0).attr("r", function (d) { return d * 150; })
        .style("fill", 'yellow')
        .attr('fill-opacity', 0)
        .style('stroke', 'grey')
        .style('stroke-width', 0.2);
    ctrlScale.exit().remove();
    // if (spm.preZoomCtrl != undefined) {
    //     // spm.preZoomCtrl.x = 150*spm.preZoomCtrl.k
    //     // spm.preZoomCtrl.y = 150*spm.preZoomCtrl.k
    //     d3.selectAll("#svg4 g").attr("transform", spm.preZoomCtrl)
    // }    
}
renderCtrl()
d3.selectAll("#svg4").call(d3.zoom().on('zoom', () =>{       // for pan & zoom of agg states 
        d3.event.transform.x = 150
        d3.event.transform.y = 150 
    d3.selectAll("#svg4 g").attr("transform", d3.event.transform)    
    spm.preZoomCtrl = {...d3.event.transform}
}))    

function featureMode(f = 1) {
    if (f==1) {
        svg.attr('class','full')
        var line1 = "<b>Individual Full Potential</b>: <br> With perfect amount of resources ... such as energy, education, time  ... Individual can achieve full potential at different aspects (represented by different slice of pie in different color), even between two oppsite aspect"
        var line2 = "<br><br><b>Social State with Perfect Social Buffer & Coordination (Outer Pie)</b>: <br> With perfect coordination and sufficient buffer between individues , all Individuals can fullfill his/her full potentials in the society"
        var line3 = "<br><br><b>Social State with No Social Buffer & Coordination (Inner Slices)</b>: <br> Individuals are contridict each other ...  result into significentlly small aggregate social capability"
    } else if (f==2) {
        svg.attr('class','half')
        var line1 = "<b>Individual Miltiple Potential</b>: <br> With sufficient amount of resources ... Individual can achieve better potantial for each pair of oppsite aspapect"
        var line2 = "<br><br><b>Social State with Perfect Social Buffer & Coordination (Outer Pie) </b>: <br> With perfect coordination and sufficient buffer between individues , all Individuals can fullfill his/her full potentials in the society"
        var line3 = "<br><br><b>Social State with No Social Buffer & Coordination (Inner Slices)</b>: <br> Individuals are contridict each other ...  result into significentlly small aggregate social capability"
    } else if (f==3) {
        svg.attr('class','one')
        var line1 = "<b>Individual One Dominant Potential</b>: <br> With limited amount of resources ...  Individual can only achieve one of his/her best potential"
        var line2 = "<br><br><b>Social State with Perfect Social Buffer & Coordination (Outer Pie)</b>: <br> With perfect coordination and sufficient buffer between individues , all Individuals can fullfill his/her full potentials in the society"
        var line3 = "<br><br><b>Social State with No Social Buffer & Coordination (Inner Slices)</b>: <br> Individuals are contridict each other ...  result into significentlly small aggregate social capability"
    } else if (f==4) {
        svg.attr('class','one')
        var line2 = "<b>Social Engineering (Forced Impact)</b>: <br>Potential at different aspects can be enhanced or depressed at different dgrees by social factors such as economic and political situations ... religions ..."
        var line3 = "<br><br>Click on each slice of pie to adjust the enhance / surpress factor of each potential"
        var line1 = "<br><br>"
        d3.select("#svg4 text").html("")
    }
    d3.select("#note").html(line1 + line2 + line3)
}