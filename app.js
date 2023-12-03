const logger = require("./middlewares/logger");
const { errorHandler1, errorHandler2 } = require("./middlewares/errorHandler");
const connectToDB = require("./config/db");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

connectToDB();

const app = express();

// MiddleWare
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);

// Static Folder
app.use(express.static(path.join(__dirname, "images")));

// Helmet
app.use(helmet());

// Cors Policy
app.use(cors());

//route
app.use("/api/books", require("./routes/books"));
app.use("/api/authors", require("./routes/authors"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/password", require("./routes/password"));

//Error Handler Middleware
app.use(errorHandler1);
app.use(errorHandler2);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
