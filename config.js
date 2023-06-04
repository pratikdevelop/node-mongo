const mysql = require("mysql");
const fs = require("fs");

const conn = () => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port:process.env.DB_LOCAL_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    
  });
  connection.connect((err) => {
    if (err) throw err;

	let createTodos = `create database  if not exists node_app`;

	connection.query(createTodos, function(err, results, fields) {
	if (err) {
	console.log(err.message);
	}
  });
    console.log("Connected!");
  });
  return connection;
};

module.exports = conn;
