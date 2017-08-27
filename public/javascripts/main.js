$(document).ready(function() {
    findMatch();
    deleteProject();
});



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


