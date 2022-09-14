exports.up = function (knex) {
  return knex.raw('CREATE EXTENSION pg_trgm;')
    .then(function () {
      return knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
      .then(function () {
        return knex.schema
          .createTable('ebay_sales', function (table) {
            table.uuid('ebay_sales_id').defaultTo(knex.raw('uuid_generate_v4()')).primary()
            table.string('ebay_sales_title', 255).defaultTo(null)
            table.float('ebay_sales_price').notNullable()
            table.string('ebay_sales_condition', 255).notNullable()
            table.string('ebay_sales_cat', 255).notNullable()
            table.string('ebay_sales_itemid').notNullable()
            table.timestamp('ebay_sales_date').notNullable()
            table.smallint('active').notNullable()
          })
      })
    })
  
}

exports.down = function (knex) {
  /* return knex.schema.dropTable('leads')
    .then(function () {
      return knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"')
    }) */
}