var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var cors =  require('cors');
var session = require('express-session');
var app = express({mergeParams: true});



// app.get('/:place/:id([0-9]{1,})', function(req, res){
//     if (products[0][req.params.place] === undefined)
//         res.send("place doesnt exist");
//     else {
//         if (products[0][req.params.place][req.params.id - 1] === undefined)
//             res.send ("id doesnt exist");
//         else {
//             console.log(products[0][req.params.place][req.params.id-1]);
//             res.render('small_div.pug', {product_name:products[0][req.params.place][req.params.id-1]});
//         }
//     }
// });

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials?', true);

    // Pass to next layer of middleware
    next();
});


app.use(session({secret: 'ssshhhhh'}));

app.get('/:place', function (req, res) {

    var sid = req.query.sid;
    request('http://api.test.nativebag.in/v1/product/exists?locationA=Tuticorin&locationB='+req.params.place+'&sid='+sid,
        function (error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);

            var cart_ids = [];
            var totalMessages = Object.keys(body.cart).length;
            for ( var i = 0; i < totalMessages; i++)
            {
                console.log("ID: " + body.cart[i].product_id);
                    cart_ids.push(body.cart[i].product_id);
                    console.log(cart_ids);
                    console.log(JSON.stringify(cart_ids));
            }

            console.log(body.cart);
            cart_ids = JSON.stringify(cart_ids);
            res.render('native.pug', {location: req.params.place, product_name: body.products,
                cart_items:cart_ids, cart_products:body.cart, item_count:body.count, amount: body.totalAmount, sid: sid});
        }
    });
});
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.post('/id', function (req, res) {

    console.log(req.body.someInput);

    return res.json({data:"success111"});
    // console.log(req.data());
});

module.exports = app;