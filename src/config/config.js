const path = require('path');

module.exports = {
    PORT : 8080,
    paths: {
        public: path.join(__dirname, "../../public"),
        views: path.join(__dirname, "../views"),
    },
};