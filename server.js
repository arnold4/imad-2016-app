var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var app = express();
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

app.use(morgan('combined'));

var config = {
    user: 'arnold4',
    database: 'arnold4',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

app.use(session({
    secret: 'someRandomSecretValue',
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}
    }));

function createTemplate (data){
            var title=data.title;
            var date=data.date;
            var heading=data.heading;
            var content=data.content;
            var htmlTemplate= `
                       <html>
                <head>
                    <title>
                        ${title}
                        </title>
                    <meta name ="viewport" content="width=device-width, initial scale=1"/>
                    <link href="/ui/style.css" rel="stylesheet" />
                    
                    </head>
                    <body>
                        <div class="container">
                            <div>
                                <a href="/">Home</a>
                                </div>
                                <hr/>
                                <h3>
                                    ${heading}
                                    </h3>
                                    <div>
                                        ${date.toDateString()}
                                    </div>
                                        <div>
                                            ${content}
                                        </div>
                                    </div>
                        </body>
                
            </html>

     `;
return htmlTemplate;
}
app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash (input, salt) {
    //How do we create hash?
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
    
}

app.get('/hash:/input', function(req, res) {
    var hashedString = hash(req.params.input, 'this-is-a-random-string');
    res.send(hashedString);
});

app.post('/create-user', function (req, res) {
    //username, password 
    //{"username": "arnold", "password": "password"}
    //JSON
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString=hash(password, salt);
    pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function (err, result){
         if(err){
           res.status(500).send(err.toString());
       } 
       else{
           res.send('User Successfully Created : ' + username);
       }
    });
});

app.post('/login', function (req, res) {
     var username = req.body.username;
    var password = req.body.password;
    pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result){
         if(err){
           res.status(500).send(err.toString());
       } 
       else{
           if(result.rows.length === 0) {
               res.send(403).send('Username/Passsword is Invalid');
           }
           else{
             //Match the password
             var dbString = result.rows[0].password;
             //var salt = dbString.split($)[2];
             var salt = dbString.split('$')[2];
             var hashedPassword = hash(password, salt);    //Creating a hash based on the password submitted and the original salt
             if(hashedPassword === dbString) {
                 
                 //Set the Session
                 req.session.auth = {userId: result.rows[0].id};  
                 //set a cookie with a sw=ession id
                 // interally on the server side it maps the session id toan object
                 //{auth: {userid }}
                 
                 res.send('Credentials Correct!');
                 }
             else {
                 res.send(403).send('Username/Password is invalid');
             }
       }
       }
    });
});
app.get('/check-login', function(req, res){
   if(req.session && req.session.auth && req.session.userid){
       res.send('You are Logged in : '+ req.session.auth.userid.toString());
   } 
   else {
       res.send('You are not Logged in');
   }
});

app.get('Logout', function (req, res) {
    delete req.session.auth;
    res.send('Logged Out');
});

var pool = new Pool(config);
app.get('/test-db',function(req,res){
    pool.query('SELECT * FROM test', function(err,result) {
       if(err){
           res.status(500).send(err.toString());
       } 
       else{
           res.send(JSON.stringify(result.rows));
       }
    });
});

app.get('/articles/:articleName',function (req,res){
//articleName==article-one
//articles[articleName] == {} content object for article one
//SELECT * FROM article WHERE title = '\'; DELETE WHERE a = \'asdf'

pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName], function(err,result) {
    if(err){
           res.status(500).send(err.toString());
       } 
       else{
           if(result.rows.length === 0) {
               res.status(404).send('Article not Found');
           }
           else {
               var articleData = result.rows[0];
               res.send(createTemplate(articleData));         
           }
       }
});

});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log('IMAD course app listening on port ${port}!');
});