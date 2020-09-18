const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

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

exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const queryString = `INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;`
  const values = [user.name, user.email, user.password];
  return pool.query(queryString, values)
    .then(res => res.rows[0])
    .catch(err => { return console.log('query error:', err); })
}

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
  const queryParams = [];
  console.log(options);
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  console.log(queryString);
  //checks for user input of city
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }
  //checks for user input of a specific owner id
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    if (queryParams.length === 1) {
      queryString += `WHERE owner_id = $${queryParams.length} `;
    } else {
      queryString += `AND owner_id = $${queryParams.length} `;
    }
  }
  //filters for a user specified price range
  // console.log('min price: ', minimum_price_per_night);
  // console.log('max price: ', maximum_price_per_night); 

  if (options.minimum_price_per_night) {
    console.log('min price: ', options.minimum_price_per_night);
    queryParams.push((options.minimum_price_per_night) * 100);
    if (queryParams.length === 1) {
      queryString += `WHERE cost_per_night >= $${queryParams.length} `;
    } else {
      queryString += `AND cost_per_night >= $${queryParams.length} `;
    }
  }

  if (options.maximum_price_per_night) {
    console.log('max price: ', options.maximum_price_per_night); 
    queryParams.push((options.maximum_price_per_night) * 100);
    if (queryParams.length === 1) {
      queryString += `WHERE cost_per_night <= $${queryParams.length} `;
    } else {
      queryString += `AND cost_per_night <= $${queryParams.length} `;
    }
  }

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `GROUP BY properties.id
    HAVING avg(property_reviews.rating >= $${queryParams.length}) `
  }
  queryParams.push(limit);
  queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
  
  // console.log(queryString, queryParams);

  return pool.query(queryString, queryParams)
    .then(res => res.rows)
    .catch(err => { return console.log('promise error on getAllProperties:', err); })

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


// ++++++++++TEST CONSOLE LOGS+++++++++++++++++=

// console.log(getUserWithId(1).then(user=> console.log(user)));

// console.log(getUserWithEmail("elizabethyork@ymail.com")
//   .then(user => console.log(user)));

// console.log(getUserWithEmail2("allisonjackson@mail.comq")
// .then(user => console.log(user)));

// console.log(addUser({ name: "GatoDeluxe", email: "gdocircus@hello.com", password: "butts" })
//   .then(user => console.log(user)));

// getAllReservations
// console.log(getAllReservations(1, limit=10) .then(user => console.log(user)));

// console.log(getAllProperties({ city: 'Vancouver', owner_id: 1, minimum_price_per_night: 1, maximum_price_per_night: 48794 }, limit = 10).then(res => console.log(res)));

// console.log(getAllProperties({
//   city: 'Vancouver',
//   owner_id: 222,
//   minimum_price_per_night: 1,
//   maximum_price_per_night: 900000
// }, limit = 10).then(res => console.log(res)))



// SELECT properties.title, properties.owner_id, properties.city, properties.cost_per_night, avg(property_reviews.rating) as average_rating
//   FROM properties
// JOIN property_reviews ON properties.id = property_id
// WHERE city LIKE 'Vancouver'
// GROUP BY properties.id;


//   WHERE city LIKE 'Vancouver' AND owner_id = 1 AND cost_per_night >= 1 AND cost_per_night <= 9000 
//     GROUP BY properties.id
//     ORDER BY cost_per_night
//     LIMIT 10;