/*
 SQLite does not support "Drop not null from column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  imageUrl TEXT NOT NULL,
  stripeProductId TEXT,
  stripePriceId TEXT,
  createdAt TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updatedAt INTEGER NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
