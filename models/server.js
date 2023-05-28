const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      account: "/api/account",
      auth: "/api/auth",
      currency: "/api/currency",
      transaction: "/api/transaction",
      users: "/api/users",
    };

    this.conectarDB();

    this.middlewares();

    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(cors());

    this.app.use(express.json());

    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.paths.account, require("../routes/account"));
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.currency, require("../routes/currency"));
    this.app.use(this.paths.transaction, require("../routes/transaction"));
    this.app.use(this.paths.users, require("../routes/user"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server is running in port", this.port);
    });
  }
}

module.exports = Server;
