import express from "express";
import { engine } from "express-handlebars";
import pg from "pg";
const { Pool } = pg;
import cookieParser from "cookie-parser";
import multer from "multer";
const upload = multer({ dest: "public/uploads/" });
import sessions from "express-session";
import bbz307 from "bbz307";

export function createApp(dbconfig) {
  const app = express();
  ///register

  const pool = new Pool(dbconfig);
  const login = new bbz307.Login("users", ["benutzername", "password"], pool);
  //const login = new bbz307.Login('users', ['benutzername', 'passwort', 'profilbild'], pool);
}
app.get("/register", (req, res) => {
  res.render("register");
});

app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: 86400000, secure: false },
    resave: false,
  })
);

app.post("/create_post", upload.single("inhalt"), async function (req, res) {
  const user = await login.loggedInUser(req);
  await app.locals.pool.query(
    "INSERT INTO posts (titel, inhalt) VALUES ($1, $2)",
    [req.body.titel, req.file.filename]
  );
  res.redirect("/account");
});

app.post("/register", upload.none(), async (req, res) => {
  const user = await login.registerUser(req);
  if (user) {
    res.redirect("/start");
    return;
  } else {
    res.redirect("/create");
    return;
  }
});
//login

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", upload.none(), async (req, res) => {
  const user = await login.loginUser(req);
  if (!user) {
    res.redirect("/create");
    return;
  } else {
    res.redirect("/start");
    return;
  }
});

app.get("/intern"),
  async function (req, res) {
    const user = await login.loggedInUser(req);
    if (!user) {
      res.redirect("/login");
      return;
    }
    const posts = await pool.query("SELECT * FROM posts");
    res.render("intern", { user: user, posts: posts });

    app.engine("handlebars", engine());
    app.set("view engine", "handlebars");
    app.set("views", "./views");

    app.use(express.static("public"));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.locals.pool = pool;

    return app;
  };

export { upload };
