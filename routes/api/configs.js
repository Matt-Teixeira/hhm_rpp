const router = require("express").Router();
const { get_all_configs } = require("../../controllers/config_controllers");

router.get("/all", get_all_configs);

module.exports = router;
