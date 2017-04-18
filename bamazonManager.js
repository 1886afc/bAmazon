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
  manager();
});

var manager = function() {
	inquirer.prompt({
		name: "menu",
		type: "list",
		message: "what would you like to do?",
		choices: ["View products for sale", "View low inventory", "Add to Inventory", "Add new Product"]
	}).then(function(answer) {
		switch (answer.menu) {
			case "View products for sale":
			viewProducts();
			break;

			case "View low inventory":
			viewLow();
			break;

			case "Add to Inventory":
			addInv();
			break;

			case "Add new Product":
			addProduct();
			break;
		}
	});
};

var viewProducts = function() {
	connection.query("SELECT * FROM `products`", function(err, results) {
	 if (err) throw err;
		  for (var i = 0; i < results.length; i++) {
			 console.log("id: " + results[i].item_id, "product: " + results[i].product_name, "department: " + results[i].department_name, "$" + results[i].price, "stock: " + results[i].stock_quantity)
		  };
	});
	manager();
};

var addProduct = function() {
	inquirer.prompt([
	{
		name: "newProduct",
		type: "input",
		message: "what is the name of the product you woukd like to add?"
	},
	{
		name: "department",
		type: "input",
		message: "what department",
	},
	{
		name: "price", 
		type: "input",
		message: "what is the price of the product?"
	},
	{
		name: "stock",
		type: "input",
		message: "how many would you like to add?"
	}
	]).then(function(answer) {
		connection.query("INSERT INTO products SET ?", {
      		product_name: answer.newProduct,
     		department_name: answer.department,
      		price: answer.price,
      		stock_quantity: answer.stock
    	}, function(err) {
      		if (err) throw err;
      		console.log("You add an item successfully!");
      		// re-prompt manager menu
      	manager();	
    	});
	})
}