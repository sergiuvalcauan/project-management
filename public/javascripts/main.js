$(document).ready(function() {

    if (window.location.pathname == "/projects") {
        ProgressBar();
    }
    if (window.location.pathname.includes('/tasks/')){
        dragndrop();
    }
    findMatch();
    deleteProject();

});



function dragndrop(){

    [].forEach.call(document.getElementById('multi').getElementsByClassName('tile__list'), function (el){
        Sortable.create(el, {
            group: 'photo',
            animation: 150,
            onAdd: function(evt){
                console.log(evt);

                var from = evt.from.previousElementSibling.innerHTML.replace(/ /g,'');
                var to = evt.to.previousElementSibling.innerHTML.replace(/ /g,'');
                var taskID = evt.item.firstElementChild.className.replace(/ /g,'');

                // var itemEl = evt.item;  // dragged HTMLElement
                // console.log(itemEl.children[0].setAttribute('class', taskId));

                dataa = {
                    'From': from,
                    'To': to,
                    'TaskID': taskID
                }
                console.log(dataa)



                $.ajax({
                    type: "POST",
                    url: window.location.pathname+'/tes',
                    data: dataa,
                    success: function() {
                        console.log('ok')
                    }
                });
            }
        });
    });

}


function ProgressBar(){

    var x = $("#uid").html();
    var percent = JSON.parse(x)

    var proj = $("#uid1").html();
    var project = JSON.parse(proj);

    for ( var i = 0 ; i< percent.length; i++){

        var pie=d3.layout.pie()
            .value(function(d){return d})
            .sort(null);

        var w=300,h=180;

        var outerRadius=(w/2)-10;
        var innerRadius=85;


        var color = ['#ececec','#f06b3e','#888888'];

        var colorOld='#F00';
        var colorNew='#0F0';

        var arc=d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .startAngle(0)
            .endAngle(Math.PI);


        var arcLine=d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
            .startAngle(0);

        var svg=d3.selectAll(".chart.chart-container."+ project[i].Name)
            .append("svg")
            .attr({
                width:w,
                height:h,
                class:'shadow'
            }).append('g')
            .attr({
                transform:'translate('+w/2+','+h/1.25+')'
            });



        var path=svg.append('path')
            .attr({
                d:arc,
                transform:'rotate(-90)'
            }).attr({
                'stroke-width':"1",
                stroke:"#666666"
            })
            .style({
                fill:color[0]
            });


        var pathForeground=svg.append('path')
            .datum({endAngle:0})
            .attr({
                d:arcLine,
                transform:'rotate(-90)'
            })
            .style({
                fill: function (d,i) {
                    return color[1];
                }
            });

        // .text(function(d){
        // return d;
        // })
        var middleCount=svg.append('text')
            .datum(0)
            .text((Math.round(percent[i]*10) / 10)+'%')
            .attr({
                class:'middleText',
                'text-anchor':'middle',
                dy:0,
                dx:5
            })
            .style({
                fill:d3.rgb('#000000'),
                'font-size':'60px'



            });

        var oldValue=0;
        var arcTween=function(transition, newValue,oldValue) {
            transition.attrTween("d", function (d) {
                var interpolate = d3.interpolate(d.endAngle, ((Math.PI))*(newValue/100));

                var interpolateCount = d3.interpolate(oldValue, newValue);

                return function (t) {
                    d.endAngle = interpolate(t);
                    middleCount.text(Math.floor(interpolateCount(t))+'%');

                    return arcLine(d);
                };
            });
        };


        pathForeground.transition()
            .duration(750)
            .ease('cubic')
            .call(arcTween,percent[i],oldValue);


    }



}


function findMatch() {
    $(".search-query.span2").keyup(function(result) {
        keyPressed = result.key;

        value = $(".search-query.span2").val();
        console.log(value);

            $.ajax({
                method: "get",
                url: "/projects/search",
                data: {
                    search: value
                },
                dataType: "json",
                success: function (responseJson){
                    genHTML = '';
                    $.each(responseJson, function (i, customer) {
                        genHTML += '<li>' + customer.Name + ' ' + customer.Client + '</li><br/>';
                    });
                    $('.dbusers').html(genHTML);

                }
            });

    });
}

// function deleteProject(){
//     $('.delete').on('click', function(){
//         var projectID;
//
//         $.ajax({
//             method: "delete",
//             url: "/projects/rem",
//             data:{
//                 Name : "Wrapsafe"
//             },
//             success: function(response){
//                 console.log("success")
//             }
//         })
//     })
// }


function deleteProject(){
    var del = $('.delete');

    del.on('click', function() {
        // var projectID = $('.projectid').text();


        fetch('projects', {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'Name': 'test1'
                })
            })
            .then(function(res) {
                if (res.ok) return res.json()
            }).
        then(function(data) {
            console.log(data)
            // window.location.reload()
        })
    })
}


