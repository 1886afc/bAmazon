var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
});
//var start = function() {
	connection.query("SELECT * FROM products", function(err, results) {
		if (err) throw err;
			for (var i = 0; i < results.length; i++) {
				console.log(results[i].item_id, results[i].product_name, results[i].price)
			}
			//console.log(results.product_name);
	startFun()
	});
//};

//function that starts the app
var startFun = function() {
	//prompt asking what they would like to buy
	inquirer.prompt([
		{
			name: "id",
			type: "input",
			message: "enter the id of the item you would like to purchase"
		},
		{	name: "total",
			type: "input",
			message: "How many would you like to purchase?"

		}
	]).then(function(answer) {
		connection.query("UPDATE products SET ? WHERE ?",
		[
    		{
        		stock: -parseInt(answer.total)
    		},
    		{
        		item_id: answer.id
    		}
		]

    , function(err, results) {
    	
    	start1()
		});
	})
	//connection.end()
};



var start1 = function() {
	connection.query("SELECT * FROM products", function(err, results) {
		if (err) throw err;
			for (var i = 0; i < results.length; i++) {
				console.log(results[i].item_id, results[i].product_name, results[i].stock)
			}
			//console.log(results.product_name);
	});
	connection.end();
};

//start()
