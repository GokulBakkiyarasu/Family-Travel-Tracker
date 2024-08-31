# Country Explorer 🌍

Country Explorer is a web application that allows users to explore and manage a list of countries they have visited. The platform provides a simple interface to view, add, and manage visited countries, as well as to handle user accounts.

![Screenshot 2024-08-31 132357](https://github.com/user-attachments/assets/1f375e50-2d4b-48b8-80a2-8c097f4ada6b)


## Overview

Country Explorer provides users with an interface to manage their travel experiences by listing countries they have visited and allowing them to add new entries. The project uses Express for the backend, with EJS templates for rendering views, and MySQL for database operations.

## File Structure

    CountryExplorer/
    │
    ├── public/              
    │   └── views/          
    │       ├── index.ejs   # Main page view
    │       └── new.ejs     # New user form view
    │
    ├── index.js            # Main server file
    ├── package-lock.json   # Lock file for npm dependencies
    ├── package.json        # Project metadata and dependencies
    └── queries.sql         # SQL queries for the database

## Getting Started

To run Country Explorer locally, follow these steps:

### Prerequisites

- Node.js and npm installed on your system
- MySQL database setup with the required schema

### Installation

1. **Set Up the MySQL Database:**

   - Open your MySQL client and execute the SQL commands in `queries.sql` to set up the necessary database schema and tables.

2. **Clone the Repository:**

    ```bash
    git clone https://github.com/GokulBakkiyarasu/CountryExplorer.git
    ```

3. **Navigate to the Project Directory:**

    ```bash
    cd CountryExplorer
    ```

4. **Install Dependencies:**

    ```bash
    npm install
    ```

5. **Run the Express Server:**

    ```bash
    npm start
    ```

6. **Open Your Preferred Web Browser:**

    Go to [http://localhost:3000](http://localhost:3000).

## Usage

- Visit the webpage hosted on your local server or the live version.
- View the list of countries you have visited and add new countries.
- Manage user accounts and change the current user.

## Contributing

Contributions to Country Explorer are welcome! If you'd like to contribute, please follow these guidelines:

1. Fork the repository on GitHub.
2. Create a new branch.
3. Make your changes.
4. Test your changes thoroughly.
5. Submit a pull request with a clear description of your changes.

## Find Me On

[![LinkedIn Badge](https://img.shields.io/badge/LinkedIn-Profile-informational?style=flat&logo=linkedin&logoColor=white&color=0D76A8)](https://www.linkedin.com/in/gokul-bakkiyarasu-531535251)

## Acknowledgments

- Express for providing a robust framework for building the server-side logic.
- EJS for enabling easy templating.
- MySQL for handling the database operations.
- The community for their contributions and support!

---
