// Importing the knex instance from the db connection module
const { knex } = require("../db/connection");

// The async function 'migrate' will handle the database migrations
const migrate = async () => {
  // Check if the "users" table already exists

  const rabbitTableExists = await knex.schema.hasTable("rabbit");
  if (!rabbitTableExists) {
    /*
    CREATE TABLE `rabbit` (
      `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      `name` VARCHAR(255) NOT NULL,
      `avatar` VARCHAR(255) NOT NULL,
      `email` VARCHAR(255) NOT NULL UNIQUE,
      `phone` VARCHAR(255) NOT NULL UNIQUE,
      `is_active` TINYINT(1) NOT NULL DEFAULT 0,
      `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    */

    await knex.schema
      .createTable("rabbit", function (table) {
        table.increments("id").primary(); // Auto-incremental primary key
        table.string("name"); // Non-nullable password field
        table.string("avatar"); // Non-nullable password field
        table.string("email").notNullable().unique(); // Non-nullable email field
        table.string("phone").notNullable().unique(); // Non-nullable email field
        table.bool("is_active").defaultTo(false);
        table.timestamp("created_at").defaultTo(knex.fn.now());
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  console.log("process completed");
  return true;
};

migrate();
