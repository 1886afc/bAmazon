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
connection.query("SELECT * FROM `products`", function(err, results) {
	if (err) throw err;
		for (var i = 0; i < results.length; i++) {
			console.log("id: " + results[i].item_id, results[i].product_name, "$" + results[i].price)
		};
	buying();
});

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
          console.log(chosenItem.stock)
          console.log(chosenItem.stock - answer.total)
          console.log(chosenItem.item_id)
        }
      }

      // determine if there is enough supply
      if (chosenItem.stock > parseInt(answer.total)) {
        // enough supply high enough, so update db, let the user know, and start over
        connection.query("UPDATE products SET ? WHERE ?", [{

          stock: chosenItem.stock - answer.total
        }, {
          item_id: chosenItem.item_id
        }], function(err, res) {
          
          console.log("thank you for your purchase!");
          
        });
      }
      else {
        // not enough supply
        console.log("Not enough inventory. Try again...");
        
      }
    });
  });
connection.end();   
};



















// var buying = function() {
// 	connection.query("SELECT * FROM products", function(err, results) {
//     	if (err) throw err;
// 		inquirer.prompt([
// 		{
// 			name: "product_id",
// 			type: "input",
// 			message: " enter the id of the item you would like to purchase."	
// 		},
// 		{
// 			name: "total",
// 			type: "input",
// 			message: "How many would you like to purchase?"
// 		}
// 		]).then(function(answer) {
// 			console.log(answer.product_id, answer.total);
// 			var chosenId;
// 			for (var i = 0; i < results.length; i++) {
// 				if(results[i].item_id === answer.product_id) {
// 					 chosenId = results[i];
// 					 console.log(chosenId);
// 				}
// 			}
// 			//check if there's enough supply
// 			if (chosenId.stock > parseInt(answer.total)) {
// 				// there is enough supply now we update the database
// 				connection.query("UPDATE products SET ? WHERE ?", [{
// 					stock: chosenId.stock - answer.total
// 				},
// 				{
// 					item_id: answer.product_id

// 				}], function(err) {
// 					if (err) throw err;
// 					console.log("you bought an item!")
// 				})
// 			}
// 			else {
// 				//not enough quantities
// 				console.log("Not enough in stock to fill order. Try again...")
// 			}
// 		});
// 	});
// 	connection.end()
// };

// connection.query("UPDATE products SET ? WHERE ?", [{
//   			stock: -answer.total
// 		}, 
// 		{
//   			item_id: "Rocky Road"
		 
// 		}], function(err, res) {});