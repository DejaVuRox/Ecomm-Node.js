const express = require("express");

const usersRepo = require("../../repo/users/users");
const { handleErrors } = require("./middleware");

//HTML templates
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");

//VALIDATORS
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser,
} = require("./validators");

//ROUTES
const router = express.Router();

//SIGNUP
router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});

router.post(
  "/signup",
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body;
    // Create a user in our user repo to represent this person
    const user = await usersRepo.create({ email, password });
    // Store the id of that user inside the user cookie
    req.session.userId = user.id;
    //////////////////////////////////
    res.redirect("/admin/products");
  }
);

//SIGN OUT
router.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are logged out");
});

// SIGN IN
router.get("/signin", (req, res) => {
  res.send(signinTemplate({}));
});

router.post(
  "/signin",
  [requireEmailExists, requireValidPasswordForUser],
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;

    res.redirect("/admin/products");
  }
);

module.exports = router;
