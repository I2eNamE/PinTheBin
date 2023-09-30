import fs from 'fs';
import mysql from 'mysql';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config'

const app = express();
const port = 8080

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))


// create connection_data to database
const serverCa = [fs.readFileSync("./cert.pem", "utf8")];
const conn = mysql.createConnection({
    host: process.env.host, user: process.env.user, // Do not use username as it will be collided with host username
    password: process.env.password, database: process.env.database, port: 3306, ssl: {
        rejectUnauthorized: true, ca: serverCa
    }
});

// connect to database
conn.connect(function (err) {
    if (err) throw err;
    console.log("sql start");
});


// test rest api
app.get('/test', (req, res) => {
    res.send("Hello world");
})


// start user_info table 

app.get('/user', (req, res) => {
    let command = `SELECT * FROM user_info`;
    conn.query(command, (err, result) => {
        if (err) throw err; else if (result.length === 0) {
            res.status(404).send({ error: true, message: "user not found" });
        } else res.send({ error: false, message: "ok", response: result });
    })
})

app.get('/user/:id', (req, res) => {
    let command = `SELECT * FROM user_info WHERE id=?`;
    conn.query(command, [req.params.id], (err, result) => {
        if (err) throw err; else if (result.length === 0) {
            res.status(404).send({ error: true, message: `user id ${req.params.id} not found` });
        } else res.send({ error: false, message: `ok`, response: result });
    })
})

app.post('/user', (req, res) => {
    let { email, name, password, passwordAgain } = req.body;
    if (password !== passwordAgain) {
        res.status(400).send({ error: true, message: "password mismatch" })
    } else {
        let commandAdd = `INSERT INTO user_info (email,name,password) VALUE(?, ?, ?);` // TODO: Sanitize sql query
        let commanSearch = `SELECT * FROM user_info WHERE email= ?;`
        conn.query(commanSearch, [email], (err, result) => {
            if (err) res.send(err); else if (result.length !== 0) {
                res.status(400).send({
                    error: true, message: "this email has been register"
                })
            } else {
                conn.query(commandAdd, [email, name, password], (err, result) => {
                    if (err) throw err; else {
                        res.status(201).send({
                            error: false, message: "create new user complete", response: result
                        })
                    }
                })
            }
        })

    }

})


app.post('picture', (req, res) => {
    let { id, path } = req.body;
    let command = 'UPDATE bin_infp SET picture = ? WHERE id = ?';
    conn.query(command, [path, id], (err, result) => {
        if (err) throw err;
        else {
            res.send({
                error: false,
                massage: "insert picture complete",
                result: result
            })
        }
    })

})

app.post('/login', (req, res) => {
    let { email, password } = req.body;
    let command = `SELECT * FROM user_info WHERE email = ?`; // TODO: Sanitize sql query
    conn.query(command, [email], (err, result) => {
        if (err) throw err; else if (result.length === 1 && result[0].password === password) {
            res.send({ error: false, message: "password correct welcome!", result: result })
        } else {
            res.status(404).send({ error: true, message: "email or password is incorrect try again!" })
        }
    })
})

// end user_info table and start bin_info table

app.get('/bin', (reg, res) => {
    let command = `SELECT * FROM bin_info`;
    conn.query(command, (err, result) => {
        if (err) throw err; else if (result.length === 0) {
            res.status(404).send({ error: true, message: "user not found" });
        } else res.send({ error: false, message: "get user info complete", response: result });
    })
})

app.get("/bin/:id", (req, res) => {
    let id = req.params.id;
    let command = `SELECT * FROM bin_info WHERE id = ?;`; // TODO: Sanitize sql query
    conn.query(command, [id], (err, result) => {
        if (err) throw err; else if (result.length === 0) {
            res.status(404).send({ error: true, message: `bin id ${id} is not found` })
        } else res.send({ error: false, message: "get bin info complete", response: result })
    })
})

app.post('/bin', (req, res) => {
    let { lat, lng, description = null, red_bin, green_bin, yellow_bin, blue_bin, picture = null } = req.body;
    let commandSearch = `SELECT * FROM bin_info WHERE lat = ? and lng = ?`; // TODO: Sanitize sql query
    let commandAdd = `INSERT INTO bin_info (lat,lng,description,red_bin,green_bin,yellow_bin,blue_bin,picture) VALUE
                    (?,?,?,?,?,?,?,?)`;
    conn.query(commandSenrch, [lat, lng], (err, result) => {
        if (err) throw err; else if (result.length !== 0) {
            res.send({ error: true, message: "bin have been add in database" })
        } else {
            conn.query(commandAdd, [lat, lng, description, red_bin, green_bin, yellow_bin, blue_bin, picture], (err, result) => {
                if (err) throw err; else {
                    res.status(201).send({
                        error: false, message: "add bin success", result: result
                    })
                }
            })
        }
    })

})

app.patch('/bin', (req, res) => {
    let { id, lat, lng, description = null, red_bin, green_bin, yellow_bin, blue_bin, picture = null } = req.body;
    let command = `UPDATE bin_info 
                    SET lat = ?, lng = ?, description = ?,red_bin = ?,
                    green_bin = ?,yellow_bin = ?,blue_bin = ?,picture = ?  WHERE id = ?;`;
    conn.query(command, [lat, lng, description, red_bin, green_bin, yellow_bin, blue_bin, picture


        , id], (err, result) => {
            if (err) throw err; else {
                res.send(result)
            }
        })
})

app.delete('/bin', (req, res) => {
    let { user_report, lat, lng, description = null } = req.body;
    let command = `INSERT INTO report (user_report,lat,lng,report_detail_id,description) 
                    VALUE(?,?,?,?,?) `; // TODO: Sanitize sql query
    conn.query(command, [user_report, lat, lng, 6, description], (err, result) => {
        if (err) throw err; else {
            res.send({
                error: false, message: "report to delete bin complete", result: result
            })
        }
    })
})


// end bin info and start report tablea
app.get('/report', (req, res) => {
    let command = `SELECT * FROM report;`;
    conn.query(command, (err, result) => {
        if (err) throw err; else if (result.length === 0) {
            res.status(404).send({
                error: true, message: "haven't report now"
            })
        } else {
            res.send({
                error: false, message: "search report complete", response: result
            })
        }
    })
})

app.get('/report/:id', (req, res) => {
    let command = `SELECT * FROM report WHERE id= ?;`; // TODO: Sanitize sql query
    conn.query(command, [req.params.id], (err, result) => {
        if (err) throw err; else if (result.length === 0) {
            res.status(404).send({
                error: true, message: "haven't report now"
            })
        } else {
            res.send({
                error: false, message: "search report complete", response: result
            })
        }
    })
})

app.get('/reportbydetail', (req, res) => {
    let { name } = req.body;
    let command = `SELECT * FROM report
                        INNER JOIN report_detail ON report.report_detail_id = report_detail.id
                        WHERE report_detail.report_name = ?;`;
    conn.query(command, [name], (err, result) => {
        if (err) throw err;
        else if (result.length == 0) res.status(404).send({ erroe: true, massage: "repot not found" })
        else { res.send({ error: true, massage: "serach complete", result: result }) }
    })
})

// Report bin
app.post('/report', (req, res) => {
    let { user_report, lat, lng, reportid, description = null } = req.body;
    let command = `INSERT INTO report (user_report,lat,lng,report_detail_id,description) VALUE(?,?,?,?,?);`;
    conn.query(command, [user_report, lat, lng, reportid, description], (err, result) => {
        if (err) throw err; else {
            res.send({
                error: false, message: "insert complete", response: result
            })
        }
    })
})




// report detail table
app.get("/reportdetail", (req, res) => {
    let command = "SELECT * FROM report_detail;"
    conn.query(command, (err, result) => {
        if (err) throw err;
        else {
            res.status(200).send({ error: false, massage: "search report detail complete", result: result })
        }
    })
})


https
    .createServer({
        key: fs.readFileSync("/etc/letsencrypt/live/tapanawat.myftp.org/privkey.pem", 'utf8'),
        cert: fs.readFileSync("/etc/letsencrypt/live/tapanawat.myftp.org/cert.pem", 'utf8'),
        ca: fs.readFileSync("/etc/letsencrypt/live/tapanawat.myftp.org/chain.pem", 'utf8')
    },
        app)
    .listen(port, () => {
        console.log('server is runing at port ', port)
    });