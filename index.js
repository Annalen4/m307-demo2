import { createApp } from "./config.js";

const app = createApp({
  user: "annmar",
  host: "bbz.cloud",
  database: "annmar",
  password: "FL3xt.u]pQ.A9W=f",
  port: 30211,
});

/* Startseite*/
app.get("/", async function (req, res) {
  res.render("start", {});
});

app.get("/newpost", async function (req, res) {
  res.render("newpost", {});
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

app.get("/create", async function (req, res) {
  res.render("create", {});
});

app.get("/account", async function (req, res) {
  res.render("account", {});
});

app.get("/", async function (req, res) {
  const posts = await app.locals.pool.query("select * from posts");
  res.render("start", { posts: posts.rows });
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
