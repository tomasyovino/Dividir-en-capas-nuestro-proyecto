import { Router } from "express";
import User from "../models/User.js";
import path from "path";
import multer from "multer";
import { createNewUser, newUserAdviceEmail } from "../controllers/script.js";

const registerRouter = Router();

const storage = multer.diskStorage({
  destination: "./src/public/img",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
})

registerRouter.use(multer({
  storage: storage,
  dest: "./src/public/img",
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: El archivo debe ser una imágen soportada");
    }
  }
}).single("image"));

registerRouter.get("/", (req, res) => {
    res.render("register");
});
  
registerRouter.post("/", (req, res) => {
    const { username, password, email, direction, birthDate, phoneNumber } = req.body;
    const { filename } = req.file;

    User.findOne({ username }, async (err, user) => {
      if (err) console.log(err);
      if (user) res.render("register-error");
      if (!user) {
        createNewUser(username, password, email, direction, birthDate, phoneNumber, filename)
        newUserAdviceEmail(username, password, email, direction, birthDate, phoneNumber);

        res.redirect("/api/login");
      }
    });
});

export default registerRouter;