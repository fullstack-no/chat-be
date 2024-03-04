module.exports = {
  up: "CREATE TABLE users(\
        id int PRIMARY KEY AUTO_INCREMENT,\
        username varchar(255) NOT NULL UNIQUE,\
        password varchar(255) NOT NULL,\
        hash varchar(255) NOT NULL)",
  down: "DROP TABLE users",
};
