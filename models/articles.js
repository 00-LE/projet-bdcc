const mysql = require("mysql");

let databaseName = "blogdb";
let createQuery = `CREATE DATABASE ${databaseName}`;
  
let db_con  = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ''
});

db_con.connect(function(err) {
    if (err) {console.log("Msg : "+err.sqlMessage);}
    console.log("Connected!");
    db_con.query(createQuery, function (err) {
        if (err) console.log("Msg : "+err.sqlMessage);
        else{console.log(`Database: ${databaseName} Created Successfully !`);}
    });
    let useQuery = `USE ${databaseName}`;
    db_con.query(useQuery, function (err) {
        var sql = "CREATE TABLE articles (id int(11) AUTO_INCREMENT PRIMARY KEY,title varchar(255) NOT NULL,content text NOT NULL ,createAt datetime(3) NOT NULL,updatedAt datetime(3) NOT NULL,published tinyint(1) NOT NULL DEFAULT 0,role ENUM('Admin', 'Author'))";
        db_con.query(sql, function (err) {
            if (err) {
                console.log("Msg : "+err.sqlMessage);
                }
            else { console.log("Table: articles created"); }
        });
    });
    db_con.query(useQuery, function (err) {
        var sql = "CREATE TABLE users (id int(5) NOT NULL AUTO_INCREMENT,first_name varchar(20) NOT NULL,last_name varchar(20) NOT NULL,mob_no int(11) NOT NULL,user_name varchar(20) NOT NULL,email varchar(20) NOT NULL,password varchar(15) NOT NULL,PRIMARY KEY (id) )";
        db_con.query(sql, function (err) {
            if (err) {
                console.log("Msg : "+err.sqlMessage);
                }
            else { console.log("Table: users created"); }
        });
    });
    db_con.query(useQuery, function (err) {
        var sql = "CREATE TABLE Category (id int(5) NOT NULL AUTO_INCREMENT,name text NOT NULL,PRIMARY KEY (id) )";
        db_con.query(sql, function (err) {
            if (err) {
                console.log("Msg : "+err.sqlMessage);
                }
            else { console.log("Table: Categorie created"); }
        });
    });
    db_con.query(useQuery, function (err) {
        var sql = "CREATE TABLE Comments (id int(5) NOT NULL AUTO_INCREMENT,name text NOT NULL,content text NOT NULL,email varchar(20) NOT NULL,PRIMARY KEY (id) )";
        db_con.query(sql, function (err) {
            if (err) {
                console.log("Msg : "+err.sqlMessage);
                }
            else { console.log("Table: Comments created"); }
        });
    });
});

module.exports = db_con;