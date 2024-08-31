import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";

const app = express();
const port = 3000;

// Setup the MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "admin",
  database: "world",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Successfully connected to the DB with ID:", db.threadId);
});

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static("public"));

// Define the current user ID globally (for simplicity)
let currentUserId = 1;

/**
 * Function to retrieve all users from the database.
 * @returns {Promise} A promise that resolves to the list of users.
 */
function usersData() {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users", (err, result) => {
      if (err) {
        console.log("Failed to execute query");
        return reject(err);
      }

      let users = result.map((user) => user);
      resolve(users);
    });
  });
}

/**
 * Function to retrieve the visited countries of the current user.
 * @returns {Promise} A promise that resolves to an array of country codes.
 */
function visitedCountries() {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM visited_countries WHERE user_id=?",
      [currentUserId],
      (err, rows) => {
        if (err) {
          console.error("Failed to execute query:", err);
          return reject(err); // Reject the promise with the error
        }
        // Extract country codes from the result set
        const countries = rows.map((row) => row.country_code);
        resolve(countries); // Resolve the promise with the countries array
      }
    );
  });
}

/**
 * Function to retrieve the details of the current user.
 * @returns {Promise} A promise that resolves to the current user object.
 */
function getCurrentUser() {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE id=?",
      [currentUserId],
      (err, result) => {
        if (err) {
          console.log("Failed to execute query: ", err);
          return reject(err);
        }

        const currentUser = result[0];
        resolve(currentUser);
      }
    );
  });
}

/**
 * Function to insert a new country into the visited_countries table for the current user.
 * Handles duplicate entries and renders the appropriate response.
 * @param {string} countryCode - The code of the country to insert.
 * @param {object} res - The Express response object.
 */
function insertNewCountry(countryCode, res) {
  db.query(
    "INSERT INTO visited_countries (country_code, user_id) VALUES (?, ?)",
    [countryCode, currentUserId],
    async (err, result) => {
      if (err) {
        console.error("Failed to insert data:", err);

        if (err.code === "ER_DUP_ENTRY") {
          // Handle duplicate entry error
          try {
            const countries = await visitedCountries();
            const users = await usersData();
            const currentUser = await getCurrentUser();

            // Render the index page with an error message
            return res.render("index.ejs", {
              countries: countries,
              total: countries.length,
              users: users,
              color: currentUser.color,
              error: "Country already inserted. Try again.",
            });
          } catch (fetchError) {
            console.error("Error fetching visited countries:", fetchError);
            return res.status(500).send("Server Error");
          }
        } else {
          return res.status(500).send("Server Error");
        }
      } else {
        console.log("Record inserted successfully:", result.insertId);
        // Redirect to the home page after successful insertion
        return res.redirect("/");
      }
    }
  );
}

/**
 * Function to insert a new user into the users table.
 * @param {object} data - An object containing the user's name and color.
 * @returns {Promise} A promise that resolves to the result of the insertion.
 */
function insertNewUser(data, res) {
  const { name, color } = data;
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO users (name, color) VALUES (?, ?)",
      [name, color],
      async (err, result) => {
        if (err) {
          console.log("Failed to execute query: ", err);
          if (err.code === "ER_DUP_ENTRY") {
            // Handle duplicate entry error
            try {
              const countries = await visitedCountries();
              const users = await usersData();
              const currentUser = await getCurrentUser();

              // Render the index page with an error message
              return res.render("index.ejs", {
                countries: countries,
                total: countries.length,
                users: users,
                color: currentUser.color,
                error: "User already exist. Try again.",
              });
            } catch (fetchError) {
              console.error("Error fetching users:", fetchError);
              return res.status(500).send("Server Error");
            }
          } else {
            return res.status(500).send("Server Error");
          }
        } else {
          console.log("Record inserted successfully:", result.insertId);
          // Redirect to the home page after successful insertion
          return res.redirect("/");
        }
      }
    );
  });
}

// Route to render the home page
app.get("/", async (req, res) => {
  const currentUser = await getCurrentUser();
  if (currentUser === undefined) {
    res.render("new.ejs");
  } else {
    try {
      const result = await visitedCountries();
      const users = await usersData();
      // Render the index page with the retrieved data
      res.render("index.ejs", {
        countries: result,
        total: result.length,
        users: users,
        color: currentUser.color,
      });
    } catch (err) {
      console.error("Error fetching visited countries:", err);
      res.status(500).send("Server Error");
    }
  }
});

// Route to add a country
app.post("/add", async (req, res) => {
  try {
    // Fetch the country code based on the provided country name
    var countryCode = await new Promise((resolve, reject) => {
      db.query(
        `SELECT country_code FROM countries WHERE country_name = ?`,
        [req.body.country], // Parameterized query to prevent SQL injection
        (err, result) => {
          if (err) {
            return reject(err); // Reject the promise if there's an error
          }
          // Resolve with the country code if found, or null if not found
          resolve(result.length > 0 ? result[0].country_code : null);
        }
      );
    });
  } catch (err) {
    console.error("Error fetching country code:", err);
    return res.status(500).send("Server Error"); // Send a 500 response if an error occurs
  }

  if (countryCode === null) {
    try {
      const result = await visitedCountries();
      const users = await usersData();
      const currentUser = await getCurrentUser();
      // Render the index page with an error message if the country doesn't exist
      return res.render("index.ejs", {
        countries: result,
        total: result.length,
        users: users,
        color: currentUser.color,
        error:
          "Country doesn't exist. Please enter a valid country name and try again.",
      });
    } catch (err) {
      console.error("Error fetching visited countries:", err);
      return res.status(500).send("Server Error");
    }
  } else {
    insertNewCountry(countryCode, res); // Insert the country if it's valid
  }
});

// Route to change the current user
app.post("/user", async (req, res) => {
  if (req.body.user !== undefined) {
    currentUserId = req.body.user; // Update the current user ID
    res.redirect("/"); // Redirect to the home page
  } else {
    res.render("new.ejs"); // Render the new user form if no user is selected
  }
});

// Route to create a new user
app.post("/new", async (req, res) => {
  await insertNewUser(req.body, res); // Insert the new user and log the result
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
