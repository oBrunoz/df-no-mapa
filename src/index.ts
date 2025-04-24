import express from "express";
import path from "path";
import expressLayouts from "express-ejs-layouts"

const app = express();

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.set("layout", "./layout");

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    res.render("pages/index");
});

app.listen(8000, () => {
    console.log("Server is running on http://localhost:8000");
});

module.exports = app;