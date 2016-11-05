var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var app = express();
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

var articles= {
        'article-one': {
          title: 'Article one Arnold Antoo',
          heading: 'Article One',
          date: 'Sep 5, 2016', 
                    content: <p>This is my first article . mY first article. Myfirst article.
                    </p>
                    <p>This is my first article . mY first article. Myfirst article.
                    </p>
        },
        'article-two': {
             title: 'Article Two Arnold Antoo',
          heading: 'Article Two',
          date: 'Sep 10, 2016', 
                    content: <p>This is my Second article . Second Article.
                    </p>
                     
        },
        'article-three': {
            title: 'Article one Arnold Antoo',
            heading: 'Article Three',
            date: 'Sep 5, 2016', 
                    content:  <p>This is my first article . mY first article. Myfirst article.
                    </p>
                        

        }
    };

function createTemplate (data){
            var title=data.title;
            var date=data.date;
            var heading=data.heading;
            var content=data.content;
            
            var htmlTemplate= 
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
                                        ${date}
                                    </div>
                                        <div>
                                            ${content}
                                        </div>
                                    </div>
                        </body>
                
            </html>

;
return htmlTemplate;
}

res.status(500).send(err.toString()); {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var pool = new Pool(config)
app.get('/test-db',function(req,res){
    pool.query('SELECT * FROM test', function(err,result) {
       if(err){
           res.status(500).send(err.toString());
       } 
       else{
           res.send(JSON.stringify(result));
       }
    });
});

app.get('/articles/:articleName',function (req,res){
//articleName==articleOne

pool.query("SELECT * FROM article WHERE title = " + req.params.articleName, functio(err,result) {
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
