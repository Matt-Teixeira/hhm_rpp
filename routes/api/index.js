const router = require("express").Router();
const configRoutes = require("./configs");

router.use("/config", configRoutes);

module.exports = router;