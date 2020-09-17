const properties = require('./json/properties.json');
const users = require('./json/users.json');
// const db = require('./db');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool.query(
    `SELECT *
    FROM users 
    WHERE email = $1`, [email])
    .then(res => {
      if (res.rows.length === 0) {
        return null
      } else {
        return res.rows[0]
      }
    })
}
//test code
// console.log(getUserWithEmail("allisonjackson@mail.comq")
// .then(user => console.log(user)));
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {

  return pool.query(`SELECT *
    FROM users
    WHERE id = $1;`, [id])
    .then(res => res.rows[0])
}
//test code console.log(getUserWithId(8).then(user=> console.log(user)));
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
  const queryString = `INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;`
  const values = [user.name, user.email, user.password];
  return pool.query(queryString, values)
    .then(res => res.rows[0])
    .catch(err => { return console.log('query error:', err); })
}
//testcode
// console.log(addUser({ name: "GatoDeluxe", email: "gdocircus@hello.com", password: "butts" })
//   .then(user => console.log(user)));

exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const queryString = `SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`; 
  const values = [guest_id, limit];
  return pool.query(queryString, values)
  .then(res => res.rows)
  .catch(err => { return console.log('query error:', err); })
}

exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = function (options, limit = 10) {
  return pool.query(`
  SELECT * FROM properties
  LIMIT $1
  `, [limit])
    .then(res => res.rows);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;


console.log(getUserWithId(1).then(user=> console.log(user)));

// console.log(getUserWithEmail("elizabethyork@ymail.com")
//   .then(user => console.log(user)));

// console.log(getUserWithEmail2("allisonjackson@mail.comq")
// .then(user => console.log(user)));

// console.log(addUser({ name: "GatoDeluxe", email: "gdocircus@hello.com", password: "butts" })
//   .then(user => console.log(user)));

// getAllReservations
// console.log(getAllReservations(1, limit=10) .then(user => console.log(user)));