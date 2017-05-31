/**
 * Created by krishna on 19/5/17.
 */

function sendData(sid, id, type){
    var $url;
//get the input value
    const $id = id;
    const $sid = sid;
    console.log("sid ="+$sid+"id = " + $id + "\ntype = " + type);
    if (type === "remove"){
        $url = "http://api.test.nativebag.in/v1/cart/remove-cart-items";
    }else if(type === "add"){
        $url = "http://api.test.nativebag.in/v1/cart/create-new";
    }
    $.ajax({

        //the url to send the data to
        url: $url,

        crossDomain:true,
        //the data to send to
        data: {
            id : $id,
            sid: $sid
        },

        //type. for eg: GET, POST
        type: "POST",

        //datatype expected to get in reply form server
        // dataType: "json",

        //on success
        success: function(response){
            // console.log(response.count);

            if (type === "remove"){
                document.getElementById($id).setAttribute("request-type", "add");
                document.querySelectorAll('[button-id = "'+$id+'"]')[0].innerHTML = "Add to Cart";
            }else if(type === "add"){
                document.getElementById($id).setAttribute("request-type", "remove");
                document.querySelectorAll('[button-id = "'+$id+'"]')[0].innerHTML = "Remove from Cart";
            }

            // console.log("yoyo");
            document.getElementById('cart').innerHTML = response.count+' item(s) - Rs.' + response.totalAmount;
            // $(".summary").load("summary.pug");
            // $(".summary").show(1000);
            //do something after something is received from php
        },
        //on error
        error: function(jqXHR, exception){
            //bad request
            console.log(jqXHR.status);
            console.log(exception);
          }
    });
}

// $(document).ready(function () {
//    $('.summary').hide();
// });
