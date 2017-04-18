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
// query for geting all the relevent information from database to display in command line
var start = function() {
  connection.query("SELECT * FROM `products`", function(err, results) {
	 if (err) throw err;
		  for (var i = 0; i < results.length; i++) {
			 console.log("id: " + results[i].item_id, results[i].product_name, "$" + results[i].price)
		  };
	 buying();

  });
};

//function that will use inquire and ask the user to purchase an item and hom many
var buying = function() {
  // query the database for all items being sold
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to buy
    inquirer.prompt([
      {
        name: "item_id",
        type: "input",  
        message: "enter item id of item you would like to purchase"
      },
      {
        name: "total",
        type: "input",
        message: "How many would you like to buy?"
      }
    ]).then(function(answer) {
      // get the information of the chosen item
      var chosenItem;
      for (var i = 0; i < results.length; i++) {
        if (results[i].item_id.toString() === answer.item_id) {
          chosenItem = results[i];
          console.log(chosenItem.stock_quantity)
          console.log(chosenItem.stock_quantity - answer.total)
          console.log(chosenItem.item_id)
        }
      }

      // determine if there is enough supply
      if (chosenItem.stock_quantity > parseInt(answer.total)) {
        // enough supply high enough, so update db, let the user know, and start over
        connection.query("UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: chosenItem.stock_quantity - answer.total
          },
          {
            item_id: chosenItem.item_id
          }
        ]
      , function(err, res) {
        if (err) throw err;
        console.log("Thank you for your purchase :)");
        console.log("------------------------------------");
        start();
        });
      }
      else {
        // not enough supply
        console.log("Not enough inventory. Try again...");
        console.log("------------------------------------")
      start();
      }
    });
  });
   
};

start()
