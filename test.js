const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql2');
const app = express();
const bodyParser = require('body-parser');

const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// HTTP logger.
app.use(morgan('combined'));

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

// HTTP logger.
app.use(morgan('combined'));


// Database
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "trankhoa2501",
  database: "projectqtcsdl"
})

db.connect(function (err) {
  if (err) throw err;
  console.log("Connected!!!")
});

// Requiring module
const bcrypt = require('bcryptjs');
app.post('/create', (req, res) => {
  const tablename = req.body.tablename;
  const fieldname = req.body.fieldname;
  const keys = Object.keys(fieldname);
  const values = Object.values(fieldname);

  // const password = req.body.fieldname.password;

  // var salt = bcrypt.genSaltSync(10)
  // console.log(password)
  // var hashedPassword = bcrypt.hashSync(password, salt)
  // console.log(hashedPassword)
  // var check = bcrypt.compareSync(password, hashedPassword)
  // console.log(check)

  const chamhoi = '?,';
  // console.log(chamhoi)
  var test = chamhoi.repeat(keys.length)
  test = test.slice(0, -1)

  // Create User
  // rollback
  let checkUser = 0;
  if (req.body.tablename == 'user') {
    db.beginTransaction(function(err){
      if (err){
        throw err;
      }
      var sql = `SELECT * FROM projectqtcsdl.${tablename}`;
      db.query(sql, function (err, results) {
        if (err) { 
          db.rollback(function() {
            throw err;
          });
        }
        for (result of results) {
          if (result.username == req.body.fieldname.username) {
            res.send("User already exists!");
            // console.log('User already exists!');
            checkUser = 1;
            break;
          }
        }
        if (!checkUser) {
          let str = `INSERT INTO projectqtcsdl.${tablename} (${keys.join(',')}) VALUES (${test})`
          db.query(
            str, values,
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send("Create Account Successfully!");
                // console.log('Create Account Successfully!')
              }
            }
          );
        }
      });
    })
  }
  else{
    let str = `INSERT INTO projectqtcsdl.${tablename} (${keys.join(',')}) VALUES (${test})`
    db.query(
      str, values,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(`Create ${tablename} Successfully!`);
        }
      }
    );
  }
});

app.post('/updateUser', (req, res) => {
  const fieldname = req.body.fieldname;
  const keys = Object.keys(fieldname);
  const values = Object.values(fieldname);
  var sql = `UPDATE user SET fullname = ${fieldname.fullname}, password = ${fieldname.password}, email = ${fieldname.email} WHERE iduser = 132;
  `;
  
})

app.post('/test', (req, res) => {
  const tablename = req.body.tablename;
  const fieldname = req.body.fieldname;
  const keys = Object.keys(fieldname);
  const values = Object.values(fieldname);

  const chamhoi = '?,';
  // console.log(chamhoi)
  var test = chamhoi.repeat(keys.length)
  test = test.slice(0, -1)

  db.query(`CALL CREATEOBJECT(${test})`, values,(err, results) => {
          if(err) {
              throw err;
          }
      res.send('Insert successfully!')
  });
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
  db.query(sql, function (err, results) {
    if (err) throw err;
    res.send(results);
  });
  console.log("Successfully")
});


// Delete with transaction
app.post('/delete', function (req, res) {
  const tablename = req.body.tablename;
  const fieldname = req.body.fieldname;
  const keys = Object.keys(fieldname);
  const values = Object.values(fieldname)

  if (req.body.fieldname.checkdelete == "True") {
    var sql = `DELETE FROM projectqtcsdl.${tablename} WHERE (${keys[0]} = ${values[0]});`
    db.query(sql, function (err, results) {
      if (err) throw err;
      res.send('Deleted!');
    });
    console.log("Successfully")
  }
  else res.send('Delete Fail!');
});

// Login
app.post('/login', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username, password)

  db.query('SELECT * FROM projectqtcsdl.user', function (err, result) {
    if (err) throw err;
    var checkUSerinvalid = 0;
    var checkUSer = 0;
    for (i = 0; i < result.length; i++) {
      if (result[i].username == username) {
        checkUSerinvalid = 1;
        if (result[i].password == password)
          checkUSer = 1;
        console.log(checkUSer)
        break
      }
    }
    console.log(checkUSer)
    if (checkUSer && checkUSerinvalid) {
      // res.redirect('/fetch?tablename=user');
      res.send('Login Successfully!')
    }
    else if (!checkUSerinvalid) {
      res.send('User does not exist!')
    }
    else {
      return res.send('username or password is wrong!');
    }
  })
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
//   var sql = "INSERT INTO projectqtcsdl.question (idexam, a, b, c, d, rightanswer, contentquestion) VALUES (1, 'Yes sure, ch???c ch???n l?? wibu r???i :)))','Kh??ng','Kh??ng bi???t', 'Kh??c', 'a', 'Ph??c c?? ph???i l?? wibu kh??ng?');";
//   db.query(sql, function(err, results) {
//     if (err) throw err;
//     res.send("Question Created!");
//   });
//   console.log("Add Question Successfully!")
// });

// Route init.
// route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})