const router = require("express").Router();
const api_routes = require("./api");

const request = async (req, res) => {
  res.send("Home Page");
};

router.get("/", request);
//router.use("/api", api_routes);

module.exports = router;
