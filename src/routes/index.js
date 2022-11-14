import { Router } from "express";
import loginRouter from "./login.js";
import registerRouter from "./register.js";
import logoutRouter from "./logout.js";
import mainRouter from "./main.js";
import profileRouter from "./profile.js";
import productsRouter from "./products.js";
import cartRouter from "./cart.js";
import log4js  from "log4js";

const router = Router();
const logger = log4js.getLogger();
const warnLogger = log4js.getLogger("warn");

router.use("/login", loginRouter);
router.use("/register", registerRouter);
router.use("/logout", logoutRouter);
router.use("/main", mainRouter);
router.use("/profile", profileRouter);
router.use("/products", productsRouter);
router.use("/cart", cartRouter);

log4js.configure({
  appenders: {
    miLoggerConsole: { type: "console" },
    miLoggerConsoleWarn: { type: "console", filename: "warn.log" },
    miLoggerFile: { type: "file", filename: "error.log" },
  },
  categories: {
    default: { appenders: ["miLoggerConsole"], level: "info" },
    warn: { appenders: ["miLoggerConsoleWarn"], level: "warn" },
    error: { appenders: ["miLoggerFile"], level: "error" },
  },
});


const invalidRoute = (req) => {
  const url = req.originalUrl;
  const method = req.method;
  return { error: -2, description: `Ruta ${url} inexistente. Método ${method} no implementado.` };
};

// SESSION
router.get("/", (req, res) => {
  const url = req.originalUrl;
  const method = req.method;
  
  if (req.session.nombre) {
    logger.info(`Petición en la ruta ${url}. Método ${method}.`);
    res.redirect("/api/index");
  } else {
    logger.info(`Petición en la ruta ${url}. Método ${method}.`);
    res.redirect("/api/login");
  }
});
  
router.get("/login-error", (req, res) => {
    res.render("login-error");
});

router.get("*", (req, res) => {
  const url = req.originalUrl;
  const method = req.method;

  logger.warn(`Ruta ${url} inexistente. Método ${method} no implementado.`);
  warnLogger.warn(`Ruta ${url} inexistente. Método ${method} no implementado.`);
  res.send(invalidRoute(req));
});

export default router;