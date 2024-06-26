require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, httpOnly: true },
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    token = req.session.authorization["accessToken"];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res
          .sendStatus(403)
          .json({ message: "Invalid token - User is not authenticated." });
      } else {
        req.user = user;
        next();
      }
    });
  }
  return res
    .status(403)
    .json({ message: "Oops. You're not properly logged in." });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running on port " + PORT));
