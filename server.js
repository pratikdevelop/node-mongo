const express = require("express");
const app = express();
const path = require("path");
require('dotenv').config(path.join(__dirname,'/.env'))
const port = process.env.LOCAL_PORT || 7800;
const { v4: uuidv4 } = require("uuid");
const bcryptjs = require("bcryptjs");
const conn = require("./config");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ static: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    return res.render('index');
});

app.post("/signup", (req, res) => {
    const v4options = {
        random: [
            0x10, 0x91, 0x56, 0xbe, 0xc4, 0xfb, 0xc1, 0xea, 0x71, 0xb4, 0xef, 0xe1,
            0x67, 0x1c, 0x58, 0x36,
        ],
    };
    const password = req.body.password;
    req.body.user_id = uuidv4(v4options);
    req.body.password= bcryptjs.hashSync(password, 10);
    req.body.confirm_password = bcryptjs.hashSync(password, 10);
    conn.query(
        `INSERT INTO users SET ?`, req.body,
        (err) => {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            res.redirect("/signin");
        }
    );
});

app.post("/signin", (req, res) => {
    const { email, password } = req.body;

    conn.query("SELECT * FROM users WHERE email  = ?", [email], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('row', row[0].password);
        if (row) {
            const passwordVerify = bcryptjs.compareSync(password, row[0].password)
            return res.redirect("/");
        }
        else {
            return res.redirect("/signin");
        }
    });
});

app.get("/signin", (req, res) => {
    res.render("signin");
});

app.get("/signup", (req, res) => {
    return res.render("signup");
});
app.get('/create-invoice',(req,res)=>{
    res.render('createInvoice')
});

app.listen(port, (req, res) => {
    console.log(`port listinning on  http://localhost:${port}`);
});
