const router = require("express").Router();
let User = require("../models/users.model");
const generateToken = require("../../validations/generateToken");

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/addUser").post((req, res) => {
  console.log(req.body.values);
  const firstName = req.body.values.firstName;
  console.log(firstName);
  const lastName = req.body.values.lastName;
  console.log(lastName);
  const role = req.body.values.role;
  console.log(role);
  const userName = req.body.values.username;
  console.log(userName);
  const email = req.body.values.email;
  console.log(email);
  const phone = req.body.values.phone;
  console.log(phone);
  const department = req.body.values.department;
  console.log(department);
  const location = req.body.values.location || "Aus";
  //   console.log(location);
  const manager = req.body.values.manager;
  //   console.log(manager);
  const password = req.body.values.password;
  console.log(password);
  //   TODO
  const cPassword = req.body.values.cPassword || password;
  //   console.log(cPassword);
  const loginEnabled = req.body.values.loginEnabled || false;
  //   console.log(loginEnabled);
  const notes = req.body.values.notes || "";
  //   console.log(notes);

  const newUser = new User({
    firstName,
    lastName,
    role,
    userName,
    email,
    phone,
    department,
    location,
    manager,
    password,
    cPassword,
    loginEnabled,
    notes,
  });

  newUser
    .save()
    .then(() => res.json("User added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/authenticate").post((req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  const success = false;
  console.log("1");
  console.log(userName, password);

  User.findOne({ email: userName }, (err, obj) => {
    console.log("found it");
    if (obj === null) {
      res.json("Invalid credentials");
    } else {
      if (obj.password === password) {
        console.log("2");
        console.log(obj.role);
        const token = generateToken(userName, obj.role);
        console.log(token);
        res
          .header("auth-token", token)
          .json({ val: "SUCCESSLOGIN", token: token });
        // res.header("auth-token", token).json("User logged in successfully");
      } else {
        res.json("Invalid credentials");
      }
    }
  });
});

router.route("/count").get((req, res) => {
  User.estimatedDocumentCount()
    .then((count) => res.json(count.toString()))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/findUserById").get((req, res) => {
  User.findById(req.body.id)
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/deleteUserById").delete((req, res) => {
  User.findByIdAndDelete(req.body.id)
    .then(() => res.json("User with id " + req.body.id + " has been deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/updateUserById").post((req, res) => {
  User.findById(req.body.id)
    .then((users) => {
      if (req.body.firstName) {
        users.firstName = req.body.firstName;
      }
      if (req.body.lastName) {
        users.lastName = req.body.lastName;
      }
      if (req.body.role) {
        users.role = req.body.role;
      }
      if (req.body.userName) {
        users.userName = req.body.userName;
      }
      if (req.body.email) {
        users.email = req.body.email;
      }
      if (req.body.phone) {
        users.phone = req.body.phone;
      }
      if (req.body.department) {
        users.department = req.body.department;
      }
      if (req.body.location) {
        users.location = req.body.location;
      }
      if (req.body.manager) {
        users.manager = req.body.manager;
      }
      if (req.body.password) {
        users.password = req.body.password;
      }
      if (req.body.cPassword) {
        users.cPassword = req.body.cPassword;
      }
      if (req.body.loginEnabled) {
        users.loginEnabled = req.body.loginEnabled;
      }
      if (req.body.notes) {
        users.notes = req.body.notes;
      }

      users
        .save()
        .then(() =>
          res.json("User with id " + req.body.id + " has been updated")
        )
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
