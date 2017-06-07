const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const cors = require('cors');
const session = require('express-session');
const app = express({mergeParams: true});


var cart;
var sid = null;

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials?', true);

    // Pass to next layer of middleware
    next();
});


app.use(session({secret: 'ssshhhhh'}));

app.get('/summary', function (req, res) {
    res.render('summary.pug')
});

app.get('/product_list/:place', function (req, res) {
    sid = req.query.sid;
    var location =  req.params.place;
    var products;
    var cart_items;
    var cart_ids = [];
    request.get('http://api.test.nativebag.in/v1/product/exists?locationA=Tuticorin&locationB='+req.params.place+'&sid='+sid,
        function (error, response, product_list) {
        if (!error && response.statusCode == 200) {
            product_list = JSON.parse(product_list);
            products = product_list.products;
            request.post({
                url: 'http://api.test.nativebag.in/v1/cart/cart-items',
                form: {sid:sid}
                }, function (error, response, body) {
                    body = JSON.parse(body);
                    console.log(body);
                    if(body.CartItems !== null) {
                        const totalMessages = Object.keys(body.CartItems).length;
                        for (var i = 0; i < totalMessages; i++) {
                            cart_ids.push(body.CartItems[i].ProductId);
                        }
                        console.log(cart_ids);
                    }
                    cart_items = body.CartItems;
                    cart_ids = JSON.stringify(cart_ids);
                    res.render('native.pug', {location:location, product_name:products,
                        cart_items:cart_ids, cart_products:cart_items, item_count:body.count, amount: body.totalAmount, sid: sid});

            });

            // cart = body.cart;
        }
    });
});

app.get('/cart',function(req, res) {
    request.post({
        url: 'http://api.test.nativebag.in/v1/cart/cart-items',
        form: {sid:sid}
    }, function (error, response, body) {
        if(!error && response.statusCode === 200) {
            var cart_ids = [];
            if (body.CartItems !== null) {
                console.log(body.CartItems);
                // const totalMessages = Object.keys(body.CartItems).length;
                // for (var i = 0; i < totalMessages; i++) {
                //     cart_ids.push(body.CartItems[i].ProductId);
                // }
            }
            body = JSON.parse(body);
            console.log(body.CartItems);
            res.send(body.CartItems);
        }
    });
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.get('/sid', function (req, res) {
    if(sid !== null)
        return res.json({sid:sid});
    else return res.send('error');
});


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


module.exports = app;