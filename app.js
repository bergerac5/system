const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

//connect express to databases
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'kigali45',
    database:'school_db'
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
}); 

//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Display all students

app.get('/students',(req, res) => {
    
    let sql = "SELECT * FROM students";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('students', {
            title : 'students',
            users : rows
        });
    });
});

// View add_student ejs
app.get('/add_student',(req,res)=>{
    res.render('add_student',{
        title:'registration form'
    });
});

app.post('/add_student', (req,res) => {
    let sql="INSERT INTO students SET ?;"
    let data ={FirstName: req.body.FirstName,LirstName: req.body.LirstName,Email:req.body.Email,Password:req.body.Password,Gender:req.body.Gender,Department_name:req.body.Department_name};
    let query=connection.query(sql,data,(err,result)=>{
        if(err) throw err;
        res.redirect('/students');
    });
   
});

app.get('/edit_student/:ID', (req,res) => {
    const ID = req.params.ID;
    let sql = `Select *from students where id = "$ {ID}"`;
    let query = connection.query(sql,(err,result) => {
        if(err) throw err;
        res.render('edit_student', {
            title:'Modifiy student info',
            action:'edit',
            sampleData:'data[0]'
        });
    });
});

app.post('/update/:ID', (req,res) => {
    let sql="update students set FirstName= '"+req.body.FirstName+"', LirstName= '"+req.body.LirstName+"',Email='"+req.body.Email+"',Password='"+req.body.Password+"',Department_name='"+req.body.Department_name+"' ?;"
    let data ={FirstName: req.body.FirstName,LirstName: req.body.LirstName,Email:req.body.Email,Password:req.body.Password,Department_name:req.body.Department_name};
    let query=connection.query(sql,data,(err,result)=>{
        if(err) throw err;
        res.redirect('/students');
    });
   
});

// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});