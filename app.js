const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

const port = 3000;

const handlebars = require('express-handlebars');

const route = require('./routes');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// HTTP logger.
app.use(morgan('combined'));

// const db = require('./config/db')

// db.connect();

// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.urlencoded({
//   extended: true
// }));
// app.use(express.json());

// HTTP logger.
app.use(morgan('combined'));

// Templete Engine.
app.engine('hbs', handlebars.engine({
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set("views", path.join(__dirname, 'resources', 'views'));


// Database
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "trankhoa2501",
  database: "projectqtcsdl"
})

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!!!")
});

app.post('/create', (req, res) => {
  // console.log(req)
  // const username = req.body.username;
  // const password = req.body.password;
  // const fullname = req.body.fullname;
  // const email = req.body.email;
  // const isAdmin = req.body.isAdmin;

  console.log(req.body)

  const tablename = req.body.tablename;
  const fieldname = req.body.fieldname;
  const keys = Object.keys(fieldname);
  const values = Object.values(fieldname)
  console.log(keys);

  const chamhoi = '?,'
  console.log(chamhoi)
  var test = chamhoi.repeat(keys.length)
  test = test.slice(0, -1)

  let str = `INSERT INTO projectqtcsdl.${tablename} (${keys.join(',')}) VALUES (${test})`
  
  db.query(
    str, values,
    (err, result) => {
      if (err){
        console.log(err);
      } else {
        return res.send("Value Inserted");
      }
    }
  );
  return res.json({});
});

// app.post('/createExam', (req, res) => {
//   console.log(req)
//   const name = req.body.name;
//   const numberquestion = req.body.numberquestion;
//   const time = req.body.time;

//   db.query(
//     "INSERT INTO projectqtcsdl.exam (name, numberquestion, time) VALUES (?,?,?)", 
//     [name, numberquestion, time],
//     (err, result) => {
//       if (err){
//         console.log(err);
//       } else {
//         res.send("Value Inserted");
//       }
//     }
//   );
// });

app.get('/fetch', function (req, res) {
  const tablename = req.query.tablename;

  var sql = `SELECT * FROM projectqtcsdl.${tablename}`;
  db.query(sql, function(err, results) {
    if (err) throw err;
    res.send(results);
  });
  console.log("Successfully")
});

app.post('/delete', function (req, res) {
  const tablename = req.body.tablename;
  const fieldname = req.body.fieldname;
  const keys = Object.keys(fieldname);
  const values = Object.values(fieldname)

  var sql = `DELETE FROM projectqtcsdl.${tablename} WHERE (${keys[0]} = ${values[0]});`;
  db.query(sql, function(err, results) {
    if (err) throw err;
    res.send(results);
  });
  console.log("Successfully")
});

// app.get('/exam', function (req, res) {
//   var sql = "SELECT * FROM projectqtcsdl.exam";
//   db.query(sql, function(err, results) {
//     if (err) throw err;
//     res.send(results);
//   });
//   console.log("Successfully")
// });

// app.get('/question', function (req, res) {
//   var sql = "SELECT * FROM projectqtcsdl.question";
//   db.query(sql, function(err, results) {
//     if (err) throw err;
//     res.send(results);
//   });
//   console.log("Successfully")
// });

// app.get('/createUser', function (req, res) {
//   var sql = "INSERT INTO projectqtcsdl.user (fullname, username, password, email, isadmin) VALUES ('Tran Anh Khoa', 'trankhoa','123456','trankhoa2810@gmail.com', '1');";
//   db.query(sql, function(err, results) {
//     if (err) throw err;
//     res.send("User Created!");
//   });
//   console.log("Add User Successfully!")
// });

// app.get('/createExam', function (req, res) {
//   var sql = "INSERT INTO projectqtcsdl.exam (name, numberquestion, time) VALUES ('Information About Pu', 40, 50);";
//   db.query(sql, function(err, results) {
//     if (err) throw err;
//     res.send("Exam Created!");
//   });
//   console.log("Add Exam Successfully!")
// });

// app.get('/createQuestion', function (req, res) {
//   var sql = "INSERT INTO projectqtcsdl.question (idexam, a, b, c, d, rightanswer, contentquestion) VALUES (1, 'Yes sure, chắc chắn là wibu rồi :)))','Không','Không biết', 'Khác', 'a', 'Phúc có phải là wibu không?');";
//   db.query(sql, function(err, results) {
//     if (err) throw err;
//     res.send("Question Created!");
//   });
//   console.log("Add Question Successfully!")
// });

// Route init.
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})