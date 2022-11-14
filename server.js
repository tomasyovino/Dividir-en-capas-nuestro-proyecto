import express from "express";
import cluster  from "cluster";
import http from "http";
import os from "os";
import cookieParser from "cookie-parser";
import session from "express-session";
import exphbs from "express-handlebars";
import path from "path";
import {fileURLToPath} from 'url';
import User from "./src/models/User.js";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
const LocalStrategy = Strategy;
import "./src/db/config.js";
import router from "./src/routes/index.js";
import dotenv from "dotenv";
import compression from "compression";
import log4js  from "log4js";
dotenv.config();

log4js.configure({
    appenders: {
      miLoggerConsole: { type: "console" },
      miLoggerFile: { type: "file", filename: "error.log" },
    },
    categories: {
      default: { appenders: ["miLoggerConsole"], level: "info" },
      error: { appenders: ["miLoggerFile"], level: "error" },
    },
});

const app = express();
const numCPUs = os.cpus().length;

const logger = log4js.getLogger();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || "1234567890!@#$%^&*()"

/*============================[Middlewares]============================*/

/*----------- Session -----------*/
app.use(cookieParser());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 20000, //20 seg
    },
  })
);
app.use(compression());

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy((email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) console.log(err);
      if (!user) return done(null, false);
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) console.log(err);
        if (isMatch) return done(null, user);
        return done(null, false);
      });
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  return done(null, user);
});

/*----------- Motor de plantillas -----------*/
app.set("views", path.join(path.dirname(""), "./src/views"));
app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "index",
    layoutsDir: path.join(app.get("views"), "layouts"),
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src/public')));

app.use("/api", router);

/*============================[Servidor]============================*/
app.get("/", (req, res) => {
    res.redirect("/api");
});

// if (cluster.isPrimary) {
//   logger.info(`Num CPUs: ${numCPUs}`);
//   logger.info(`I am the primary: ${process.pid}`);
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   };
//   cluster.on("exit", (worker) => {
//     logger.info(`${worker.process.pid} is finished`);
//   });
// } else {
//   http
//     .createServer((req, res) => {
//       res.writeHead(200);
//       res.end(
//         `Server on ${PORT} - PID ${
//           process.pid
//         } - ${new Date().toLocaleString()}`
//       );
//     })
//     .listen(PORT);
//     logger.info(`Worker ${process.pid} started`)
// }

const server = app.listen(PORT, () => {
  logger.info(`Servidor escuchando en puerto ${PORT}`);
});
server.on("error", (error) => {
  errorLogger.error(`Error en el servidor ${error}`);
});