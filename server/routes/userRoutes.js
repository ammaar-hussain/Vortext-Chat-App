const {register, login, setAvatar, getAllUsers } = require("../controllers/usersController");  //imported just the 'register' function  from userController.js instead of whole module

const router = require("express").Router(); //creates an instance of express router

router.post("/register", register); //sets up a post request to /register endpoint and calls the register function we exported from usersController.js
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/allusers/:id", getAllUsers )

module.exports = router; //exported so that it can be used in other files like app.js/index.js