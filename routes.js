/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {*} next
 * 
 */

function login(req, res, next){
    var message = "";
    if(req.method == "POST")
    {
        var name = req.body.txtUser;
        var pass = req.body.txtPwd;

        var sql = "SELECT login, id, email FROM users WHERE login='" + name +"' and password='" + pass +"'";
        db.query(sql, function(err, results){
            if(results.length)
            {
                req.session.login = results[0].login;
                req.session.admin = results[0].id;
                req.session.email = results[0].email;

                if(req.query.returnUrl)
                    res.redirect(req.query.returnUrl);
                else res.redirect('index');
                
            } else {
                message = "Złe dane";
                res.render('login.ejs', {message: message});
            }
        });   
    } else {
        res.render('login.ejs', {message: message});
    }
};

function register(req, res, next){
    var message = "";
    if(req.method == "POST")
    {
        var login = req.body.txtUser;
        var passwd = req.body.txtPwd;
        var email = req.body.txtemail;
        var sql1 = "SELECT login, id, email FROM users WHERE login='" + login + "'";
        db.query(sql1, function(err, results1){
            if(results1.length == 0){
                var sql2 = "INSERT INTO users (login, password, email) VALUES ('" + login + "', '" + passwd + "', '" + email + "')";
                db.query(sql2, function(err, results2){
                    if(err){
                        message = "Coś poszło nie tak!";
                        res.render('register.ejs', {message: message});
                    } else {
                        message = "Udało się zarejestrować";
                        res.render('register.ejs', {message: message});
                    }
                });   
            }else{
                message = "Istnieje już użytkownik z tym loginem :(";
                res.render('register.ejs', {message: message});
            }
           
        }); 
    } else {
        res.render('register.ejs', {message: message});
    }
};

function index(req, res){
    var sql = "SELECT id, name, jpgname, description, price FROM items";
    if(req.method == "POST") sql = "SELECT id, name, jpgname, description, price FROM items WHERE name='" + req.body.toFind +"'";
    
    db.query(sql, function(err, result){
        if(req.session.login)
        res.render('index.ejs', {login: req.session.login, id: req.session.id, items: result});
        else res.render('index.ejs', {items: result});
    });
};

function orders(req, res){
    if(req.method == "POST"){
        //edit
        if(req.session.admin == 1)//admin
        {   
            var sql = "";
            if(req.body.action == "deleteOrder"){
                sql = "DELETE FROM orders WHERE id='" + req.body.orderId + "'";
                db.query(sql, function(err, result){
                    console.log("Removed Order");
                });   
            }else if (req.body.action == "delete"){
                sql = "DELETE FROM items WHERE id='" + req.body.itemId + "'";
                db.query(sql, function(err, result){
                    console.log("Removed Item");
                }); 
            }else if (req.body.action == "add"){
                sql = "INSERT INTO items (name, jpgname, description, price) VALUES ('" 
                + req.body.name + "', '" 
                + req.body.jpgname + "', '"
                + req.body.description + "', '"
                + req.body.price + "')";
                db.query(sql, function(err, result){
                    console.log("Added Item");
                }); 
            }else if (req.body.action == "modify"){
                sql = "UPDATE items SET name = '"
                + req.body.name + "', jpgname = '"
                + req.body.jpgname + "' , description = '"
                + req.body.description + "' , price = '"
                + req.body.price + "' WHERE id = '" 
                + req.body.id + "'";
                db.query(sql, function(err, result){
                    console.log("Modified Order");
                }); 
            }
            res.redirect('orders');
        } else {
            if (req.body.action == "orderIt"){
                sql = "UPDATE orders SET ordered = '1' WHERE id = '" + req.body.id + "'";
                db.query(sql, function(err, result){
                    console.log("Someone has just ordered something");
                }); 
            }
            res.redirect('orders');
        }
    }else{
        if(req.session.admin == 1)//admin
        {   //show orders
            var sql1 = "SELECT id, name, itemId, userId, email, price FROM orders WHERE ordered='1'";
            db.query(sql1, function(err, result1){
                //than items
                var sql2 = "SELECT id, name, jpgname, description, price FROM items";
                db.query(sql2, function(err, result2){
                    res.render('adminOrders.ejs', {login: req.session.login,  data: result1, items: result2});
                });   
            });   
        } else {
            //show items in cart
            var sql1 = "SELECT id, name, itemId, userId, email, price FROM orders WHERE userId='"+ req.session.login + "' and ordered = '0'";
            console.log(sql1);
            db.query(sql1, function(err, result1){
                console.log(result1);
                var sql2 = "SELECT id, name, itemId, userId, email, price FROM orders WHERE userId='"+ req.session.login + "' and ordered = '1'";
                console.log(sql2);
                db.query(sql2, function(err, result2){
                    console.log(result2);
                    res.render('orders.ejs', {login: req.session.login,  cart: result1, orders: result2});
                });  
            });          
        }
    }
};

function logout(req, res){
    req.session.destroy(function(err){
        res.redirect('index');
    });
};

function addToCart(req, res){
    if(req.method == "POST") {
        var sql1 = "SELECT id, name, jpgname, description, price FROM items WHERE id='" + req.body.itemId + "'";
        db.query(sql1, function(err, result){
            if (result){
                var sql2 = "INSERT INTO orders (name, itemId, userId, email, price, ordered) VALUES ('" 
                + result[0].name + "', '" 
                + result[0].id + "', '" 
                + req.session.login + "', '"
                + req.session.email + "', '"
                + result[0].price + "', '0')";
                db.query(sql2, function(err, result){
                    if(err){
                        console.log("Coś poszło nie tak!");
                        res.redirect('index');
                    }else{
                        console.log("Zobacz swój koszyk!");
                        res.redirect('orders');
                    }
                }); 
            }
        }); 
    }
};

module.exports.login = login;
module.exports.register = register;
module.exports.index = index;
module.exports.orders = orders;
module.exports.logout = logout;
module.exports.addToCart = addToCart;
