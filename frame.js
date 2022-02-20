// var myLayout
// var tree_sub1 = [];

var spa = {
    file_json : "./mat_pitag.json"
};

$(document).ready(function () {
    var myLayout = $('body').layout({ 
        applyDefaultStyles: true, 
        west__size: 250, west__initClosed: true,
        east__size: 200, east__initClosed: true, 
        south__size: 50, 
        spacing_open: 2.0, 
        padding: 0
    });
    // $("body > .ui-layout-center").layout({ applyDefaultStyles: true , north__size:400 });
    // $("body > .ui-layout-west").layout({ applyDefaultStyles: true, west__size: 250, spacing_open: 1.5, padding: 0 });
    $(".ui-layout-center").tabs(); // for tab to work
    var tree_sub = [];
    if (1 == 0) {                  // disabled, replace json input by ajax request      
    d3.json(spa.file_json, function (d) {  // d3.csv(spa.file_csv, function (d) {
        spa.data_tag = d;
        var rgList = [...new Set(d.map(obj => obj.rg2))];
        // d.map(item => item.rg2).filter((value, index, self) => self.indexOf(value) === index)
        rgList.forEach(rg => {
            // console.log(rg);
            tree_sub.push({ 'text': rg, 'type':'region', 'children': [] })
            // var areaList = [...new Set(d.filter((value, index, self) => self[index].rg2 == rg).map(item => item.area))];
            var d1 = d.filter((value, index, self) => self[index].rg2 == rg);
            var areaList = [...new Set(d1.map(item => item.area))];
            areaList.forEach(area => {
                // console.log(area);
                tree_sub[tree_sub.length - 1].children.push({ 'text': area, 'type':'area', 'children': [] })
                // var subList = [...new Set(d1.filter((value, index, self) => self[index].area == area).map(item => item.sub))];
                var d2 = d1.filter((value, index, self) => self[index].area == area);
                var subList = [...new Set(d2.map(item => item.sub))];
                subList.forEach(sub => {
                    // console.log(sub);
                    var last = tree_sub[tree_sub.length - 1].children.length - 1;
                    tree_sub[tree_sub.length - 1].children[last].children.push({ 'text': sub, 'type':'sub', 'children': [] });
                    var d3 = d2.filter((value, index, self) => self[index].sub == sub);
                    // var tagList = [...new Set(d3.map(item => item.tag))];
                    // tagList.forEach(tag => {
                    //     var last1 = tree_sub[tree_sub.length - 1].children[last].children.length - 1;
                    //     tree_sub[tree_sub.length - 1].children[last].children[last1].children.push({ 'text': tag, 'type':'tag' });    
                    var cmpList = [...new Set(d3.map(item => item.cmp))];
                    cmpList.forEach(cmp => {
                        var last1 = tree_sub[tree_sub.length - 1].children[last].children.length - 1;
                        tree_sub[tree_sub.length - 1].children[last].children[last1].children.push({ 'text': cmp, 'type':'cmp' });    
                    // var tagList = [...new Set(d3.map(item => item.tag))];
                    // tagList.forEach(tag => {
                    //     var last1 = tree_sub1[tree_sub1.length - 1].children[last].children.length - 1;
                    //     tree_sub1[tree_sub1.length - 1].children[last].children[last1].children.push({ 'text': tag, 'type':'tag' });    
                    })  // loop tag   
                })      // loop sub  
            })          // loop area 
        })              // loop region
        // var tree_msm = arr2tree(d,['type','mType'])
        var tree_msm = arr2tree(spa.cfg_msm,['component','measure'])

        $('#tree').jstree({
            'core': {
                'data': tree_sub
            },
            "themes" : {
                "theme" : "default",
                "dots" : true,
                "icons" : true
            },
            "types" : {
                "default" : {
                     },
                "region" : {
                       "icon" : "glyphicon glyphicon-globe"
                      },
                 "area": {
                       "icon" : "glyphicon glyphicon-cloud"
                      },
                 "sub": {
                       "icon" : "glyphicon glyphicon-picture"
                      },
                 "cmp": {
                       "icon" : "glyphicon glyphicon-cog"
                      }
           },
            "plugins" : ["search", "state1", "types", "sort", "checkbox" ],
            "search" : {
                       "case_insensitive" : true,
                       "show_only_matches": true         
         }            
        });

        // var tree_msm = arr2tree(spa.cfg_msm,['component','measure'])
        $('#tree_msm').jstree({
            'core': {
                'data': tree_msm
            },
            "themes" : {
                "theme" : "default",
                "dots" : true,
                "icons" : true
            },
            "types" : {
                "default" : {
                     },
                 "component": {
                       "icon" : "glyphicon glyphicon-dashboard"
                      },
                 "measure": {
                       "icon" : "glyphicon glyphicon-scale"
                      },
                 "type": {
                        "icon" : "glyphicon glyphicon-dashboard"
                       },
                 "mType": {
                        "icon" : "glyphicon glyphicon-scale"
                       }
 
           },
            "plugins" : ["search", "state1", "types", "sort", "checkbox" ],
            "search" : {
                       "case_insensitive" : true,
                       "show_only_matches": true         
         }            
        });

        var tree_vltg = arr2tree(spa.cfg_vltg,['level'])
        // $('#tree_vltg').jstree({   // disabled voltage tree
        //     'core': {
        //         'data': tree_vltg
        //     },
        //     "themes" : {
        //         "theme" : "default",
        //         "dots" : true,
        //         "icons" : true
        //     },
        //     "types" : {
        //         "default" : {
        //              },
        //          "level": {
        //                "icon" : "glyphicon glyphicon-flash"
        //               }
        //    },
        //     "plugins" : ["search", "state1", "types", "sort", "checkbox" ],
        //     "search" : {
        //                "case_insensitive" : true,
        //                "show_only_matches": true         
        //  }            
        // });
    })
    }
    
});


 function treeData(d) {                       // set up trees, trigger by ajax success 
    var tree_sub = [];
    spa.data_tag = d;
    var rgList = [...new Set(d.map(obj => obj.rg2))];
    // d.map(item => item.rg2).filter((value, index, self) => self.indexOf(value) === index)
    rgList.forEach(rg => {
        // console.log(rg);
        tree_sub.push({ 'text': rg, 'type':'region', 'children': [] })
        // var areaList = [...new Set(d.filter((value, index, self) => self[index].rg2 == rg).map(item => item.area))];
        var d1 = d.filter((value, index, self) => self[index].rg2 == rg);
        var areaList = [...new Set(d1.map(item => item.area))];
        areaList.forEach(area => {
            // console.log(area);
            tree_sub[tree_sub.length - 1].children.push({ 'text': area, 'type':'area', 'children': [] })
            // var subList = [...new Set(d1.filter((value, index, self) => self[index].area == area).map(item => item.sub))];
            var d2 = d1.filter((value, index, self) => self[index].area == area);
            var subList = [...new Set(d2.map(item => item.sub))];
            subList.forEach(sub => {
                // console.log(sub);
                var last = tree_sub[tree_sub.length - 1].children.length - 1;
                tree_sub[tree_sub.length - 1].children[last].children.push({ 'text': sub, 'type':'sub', 'children': [] });
                var d3 = d2.filter((value, index, self) => self[index].sub == sub);
                // var tagList = [...new Set(d3.map(item => item.tag))];
                // tagList.forEach(tag => {
                //     var last1 = tree_sub[tree_sub.length - 1].children[last].children.length - 1;
                //     tree_sub[tree_sub.length - 1].children[last].children[last1].children.push({ 'text': tag, 'type':'tag' });    
                var cmpList = [...new Set(d3.map(item => item.cmp))];
                cmpList.forEach(cmp => {
                    var last1 = tree_sub[tree_sub.length - 1].children[last].children.length - 1;
                    tree_sub[tree_sub.length - 1].children[last].children[last1].children.push({ 'text': cmp, 'type':'cmp' });    
                // var tagList = [...new Set(d3.map(item => item.tag))];
                // tagList.forEach(tag => {
                //     var last1 = tree_sub1[tree_sub1.length - 1].children[last].children.length - 1;
                //     tree_sub1[tree_sub1.length - 1].children[last].children[last1].children.push({ 'text': tag, 'type':'tag' });    
                })  // loop tag   
            })      // loop sub  
        })          // loop area 
    })              // loop region
    // var tree_msm = arr2tree(d,['type','mType'])
    var tree_msm = arr2tree(spa.cfg_msm,['component','measure'])

    $('#tree').jstree({
        'core': {
            'data': tree_sub
        },
        "themes" : {
            "theme" : "default",
            "dots" : true,
            "icons" : true
        },
        "types" : {
            "default" : {
                 },
            "region" : {
                   "icon" : "glyphicon glyphicon-globe"
                  },
             "area": {
                   "icon" : "glyphicon glyphicon-cloud"
                  },
             "sub": {
                   "icon" : "glyphicon glyphicon-picture"
                  },
             "cmp": {
                   "icon" : "glyphicon glyphicon-cog"
                  }
       },
        "plugins" : ["search", "state1", "types", "sort", "checkbox" ],
        "search" : {
                   "case_insensitive" : true,
                   "show_only_matches": true         
     }            
    });

    // var tree_msm = arr2tree(spa.cfg_msm,['component','measure'])
    $('#tree_msm').jstree({
        'core': {
            'data': tree_msm
        },
        "themes" : {
            "theme" : "default",
            "dots" : true,
            "icons" : true
        },
        "types" : {
            "default" : {
                 },
             "component": {
                   "icon" : "glyphicon glyphicon-dashboard"
                  },
             "measure": {
                   "icon" : "glyphicon glyphicon-scale"
                  },
             "type": {
                    "icon" : "glyphicon glyphicon-dashboard"
                   },
             "mType": {
                    "icon" : "glyphicon glyphicon-scale"
                   }

       },
        "plugins" : ["search", "state1", "types", "sort", "checkbox" ],
        "search" : {
                   "case_insensitive" : true,
                   "show_only_matches": true         
     }            
    });

    var tree_vltg = arr2tree(spa.cfg_vltg,['level'])
    $('#tree_vltg').jstree({
        'core': {
            'data': tree_vltg
        },
        "themes" : {
            "theme" : "default",
            "dots" : true,
            "icons" : true
        },
        "types" : {
            "default" : {
                 },
             "level": {
                   "icon" : "glyphicon glyphicon-flash"
                  }
       },
        "plugins" : ["search", "state1", "types", "sort", "checkbox" ],
        "search" : {
                   "case_insensitive" : true,
                   "show_only_matches": true         
     }            
    });
}

// $('#searchButton').click(function(){
//     var v = $('#searchField').val();
//       $('#tree').jstree(true).search(v);
// });    
$('#searchField').keyup(function(){
    var v = $('#searchField').val();
        if (v.length == 0) {
            $('#tree').jstree(true).show_all()
        } else 
        if (v.length >=2) {                     //disable search form less then 3 char, without enter
            $('#tree').jstree(true).search(v);
        }
});  
$('#searchField').change(function(){
    var v = $('#searchField').val();
        $('#tree').jstree(true).search(v);
});  

$('#tree').on('changed.jstree', function (e, data) {
        var i, j, r;
        spa.list_sub = [], spa.list_elm = [];
        for (i = 0, j = data.selected.length; i < j; i++) {
            if (data.instance.get_node(data.selected[i]).type == 'cmp') {
                r = data.instance.get_node(data.selected[i]);
                spa.list_elm.push(r.text);
                spa.list_sub.push(data.instance.get_node(data.instance.get_node(r.parent)).text);
            }
        }
        // $('#event_result').html('Selected: ' + r.join(', '));
        tagList_update()
    })

$('#tree_msm').on('changed.jstree', function (e, data) {
        var i, j, r;
        spa.list_cmp = [], spa.list_msm = [];
        for (i = 0, j = data.selected.length; i < j; i++) {
            if (data.instance.get_node(data.selected[i]).type == 'measure') {
                r = data.instance.get_node(data.selected[i]);
                spa.list_msm.push(r.text);
                spa.list_cmp.push(data.instance.get_node(data.instance.get_node(r.parent)).text);
            }
        }
        spa.list_msm =  spa.list_cmp.map((v,i) => v+"^"+spa.list_msm[i]);
        // mapping between differnet naming system 
        spa.list_msm = spa.list_msm.map(v => {v2 = spa.cfg_msm.filter(v1 => (v1.component + "^" + v1.measure ) == v); return v2[0]['type']+"^"+v2[0]['mType']  });
        tagList_update()
    })    

function tagList_update() {
    var data_tagSel, list_tagNameSel
    data_tagSel = spa.data_tag.filter(v => spa.list_sub.includes(v['sub']));
    data_tagSel = data_tagSel.filter(v => spa.list_elm.includes(v['cmp']));
    // data_tagSel = data_tagSel.filter(v => spa.list_cmp.includes(v['type']));
    data_tagSel = data_tagSel.filter(v => spa.list_msm.includes(v['type']+"^"+v['mType']));
    list_tagNameSel = data_tagSel.map(item => item.tag);
    if (spa.tagQuery.length > 0) {
        var pattern = new RegExp(spa.tagQuery, "i")
        list_tagNameSel = list_tagNameSel.filter(function (d) { return pattern.exec(d); });
    }
    spa.tagON = spa.tagON.filter(v => list_tagNameSel.includes(v));
    spa.tagNeg = spa.tagNeg.filter(v => list_tagNameSel.includes(v));

    var row = d3.select("#tagList")
        .html("")
        .selectAll("div")
        .data(list_tagNameSel)
    .enter().append("div") 
        .attr("class", function(d) {
            return (spa.list_tagData.concat(Object.keys(data)).includes(d) ? "tagOk" : "tagGrey");
        });
    row.append("span")                                        // for sign [+] or [-] 
        // .text(function(d) {return spa.tagNeg.includes(d)? "[-]":"[+]"}) 
        // .attr("class",function(d) {return spa.tagNeg.includes(d)? "tagSignN":'tagSignP'})
        .text("[+]") 
        .attr("class",'tagSignP')
        .attr("title",'click to toggle the sign')
        .on("click", function(d) {
            if (this.innerText == '[+]') {
                this.innerText = '[-]';
                this.setAttribute("class", "tagSignN")
                spa.tagNeg.push(d)                            // push in
            } else {
                this.innerText = '[+]';
                this.setAttribute("class", "tagSignP")
                spa.tagNeg = spa.tagNeg.filter(e => e !== d); //in, move out
            }
            reChart0()
        })

    row.append("span")                                        // for each measure toggle 
    .attr("title",'click on tag to toggle between in or out')
    .attr("class", function(d) {
        return spa.tagON.includes(d) ? "tagOn" : "tagOff";
        })
        .on("click", function(d) {
            if (spa.tagON.includes(d)) {
                spa.tagON = spa.tagON.filter(e => e !== d); // in, move out
                this.setAttribute("class", "tagOff")
            } else {
                spa.tagON.push(d)                           // not in, push in
                spa.tagON.sort()                            // re-order to ensure the same order
                this.setAttribute("class", "tagOn")
            }
            reChart0()
        })
        // .on("mouseover", function(d) {updateLabel1(d)}) // itm.setAttribute('onmouseover', "titleDetails(this.__data__)");
        .text(function(d,i) { return d})

    //     d3.select("#tagList")
    //     .html("")
    //     .selectAll("div")
    //     .data(list_tagNameSel)
    // .enter().append("div")
    //     .attr("class", function(d) {
    //     return tagON.includes(d) ? "tagOn" : "tagOff";
    //     })
    //     .on("click", function(d) {
    //     if (tagON.includes(d)) {
    //         tagON = tagON.filter(e => e !== d);
    //         this.setAttribute("class", "tagOff")
    //     } else {
    //         tagON.push(d)
    //         this.setAttribute("class", "tagOn")
    //     }
    //     })
    //     // .on("mouseover", function(d) {updateLabel1(d)}) // itm.setAttribute('onmouseover', "titleDetails(this.__data__)");
    //     .text(function(d,i) { return d})

} 

function arr2tree(arr,keyList) {
    var tree = [];
    var key = keyList[0]; //keys(arr[0]);
    var vList 
    var k = keyList[0];
    vList = [...new Set(arr.map(obj => obj[k]))];
    vList.forEach((v,i) => { 
        if (keyList.length > 1) {
            tree.push({ 'text': v, 'type':k, 'children': [] });
            // var arr1 = arr.filter((value, index, self) => self[index][k] == v);
            var arr1 = arr.filter((value) => value[k] == v);  // self[index][k] is same as value[k]
            tree[i].children = arr2tree(arr1,keyList.slice(1,));
        } else {
            tree.push({ 'text': v, 'type':k});
        } 
    })
    return tree; 
} 

// function arr2tree_(arr,keyList,keyList_) {
//     var tree = [];
//     var key = keyList[0]; //keys(arr[0]);
//     var k = keyList[0];
//     var vList = [...new Set(arr.map(obj => obj[k]))];
//     if (keyList_ == undefined) {
//         keyList_ = keyList;
//     }
//     var k_ = keyList_[0] 
//     ... to be ....
//     vList.forEach((v,i) => { 
//         if (keyList.length > 1) {
//             tree.push({ 'text': v, 'type':k, 'children': [] });
//             // var arr1 = arr.filter((value, index, self) => self[index][k] == v);
//             var arr1 = arr.filter((value) => value[k] == v);  // self[index][k] is same as value[k]
//             tree[i].children = arr2tree(arr1,keyList.slice(1,));
//         } else {
//             tree.push({ 'text': v, 'type':k});
//         } 
//     })
//     return tree; 
// } 

// free text search for PI tag
$('#searchTag').keyup(function(){
    spa.tagQuery = $('#searchTag').val();
    if (spa.tagQuery.length >=3) {                     //disable search form less then 3 char, without enter
        tagList_update();
    } else if (spa.siteTxt == undefined) {
        tagList_update();
    }
});  
$('#searchTag').change(function(){
    spa.tagQuery = $('#searchTag').val();
    tagList_update();
});  

function sldAction() {
    var lv = $('#sldAction')[0].selectedIndex
    if (lv == 0 ) {
        document.getElementById("pdf").setAttribute("src","../tpp/xls/SLDs-AESO-2020-Long-termTransmissionPlan-Final.pdf")
    } else if (lv == 1) {
        document.getElementById("pdf").setAttribute("src","../tpp/xls/SLDs-AESO-2020-Long-termTransmissionPlan-Final_NW.pdf")
    } else if (lv == 2) {
        document.getElementById("pdf").setAttribute("src","../tpp/xls/SLDs-AESO-2020-Long-termTransmissionPlan-Final_NE.pdf")
    } else if (lv == 3) {
        document.getElementById("pdf").setAttribute("src","../tpp/xls/SLDs-AESO-2020-Long-termTransmissionPlan-Final_Central.pdf")
    } else if (lv == 4) {
        document.getElementById("pdf").setAttribute("src","../tpp/xls/SLDs-AESO-2020-Long-termTransmissionPlan-Final_Edmonton.pdf")
    } else if (lv == 5) {
        document.getElementById("pdf").setAttribute("src","../tpp/xls/SLDs-AESO-2020-Long-termTransmissionPlan-Final_South.pdf")
    } else if (lv == 6) {
        document.getElementById("pdf").setAttribute("src","../tpp/xls/SLDs-AESO-2020-Long-termTransmissionPlan-Final_Calgary.pdf")
    } else if (lv == 7) {
        document.getElementById("pdf").setAttribute("src","./doc/PI Tag Naming Conventions.pdf")
    }
} 

// function search(selection, str) {
//     pattern = new RegExp(str, "i")
//     return _(selection).filter(function (d) { return pattern.exec(d.name); });
// }

// $('#tree').jstree({
//     "plugins": ["checkbox"]
// })
// // jstree event
// $("#tree").on("changed.jstree", function (e, data) {
//     if (data.selected.length) {
//         $(data.selected).each(function (idx) {
//             var node = data.instance.get_node(data.selected[idx]);
//             console.log('........... :' + node.text);
//         });
//     }
// })

// data = [
//         { "text" : "AIESren", "children" : [
//                 { "text" : "NW", "children" : [
//                     {"text" : "NW1", "children" : [
//                         {"text":"subnw11"},
//                         {"text":"subnw11"}
//                         ]},
//                     {"text" : "NW2", "children" : [
//                         {"text":"subnw11"},
//                         {"text":"subnw11"}
//                         ]
//                     }
//                 ]},
//                 { "text" : "NE" }
//             ]}
//         ]

// data = [
//         { "text" : "NW", "children" : [
//             {"text" : "NW1", "children" : [
//                 {"text":"subnw11"},
//                 {"text":"subnw11"}
//                 ]},
//             {"text" : "NW2", "children" : [
//                 {"text":"subnw11"},
//                 {"text":"subnw11"}
//                 ]
//             }
//         ]},
//         { "text" : "NE" }
// ]


// $('#tree1').jstree({
//     'core': {
// 		'data' : tree_sub
//     },
//     "plugins": ["checkbox"]
// });
