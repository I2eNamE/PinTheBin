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
    let id = req.params.id;
    let command = `SELECT * FROM user_info WHERE id=?`;
    conn.query(command, [id], (err, result) => {
        if (err) throw err; else if (result.length === 0) {
            res.status(404).send({ error: true, message: `user id ${req.params.id} not found` });
        } else res.send({ error: false, message: `ok`, response: result });
    })
})

app.post('/user', (req, res) => {
    let { email, name, password, passwordAgain } = req.body;
    if (password !== passwordAgain) {
        return res.status(400).send({ error: true, message: "password mismatch" })
    } else {
        let commandAdd = `INSERT INTO user_info (email,name,password) VALUE(?, ?, ?);` // TODO: Sanitize sql query
        let commandSearch = `SELECT * FROM user_info WHERE email= ?;`
        conn.query(commandSearch, [email], (err, result) => {
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

app.post('/picture', (req, res) => {
    let { id, path } = req.body;
    let command = `UPDATE user_info
    SET picture = ? WHERE id = ?;`;
    conn.query(command, [path, id], (err, result) => {
        if (err) throw err;
        else {
            res.send({
                error: false,
                massage: "update picture complete",
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

app.patch('/changepassword', (req, res) => {
    let { id, oldPassword, newPassword, passwordAgain } = req.body;
    let commandSearch = `SELECT password FROM user_info where id = ?`;
    let commandUpdate = `UPDATE user_info SET password = ? WHERE id = ?`;
    if (newPassword !== passwordAgain) {
        return res.status(400).send({
            error: true,
            massage: "password miss match"
        })
    }
    conn.query(commandSearch, [id], (err, result) => {
        if (err) throw err;
        else if (result.length == 0 || result[0].password != oldPassword) {
            res.send({
                error: true,
                massage: "can not find old password or old password not correct",
            })
        }
        else {
            conn.query(commandUpdate, [newPassword, id], (err, result) => {
                if (err) throw err;
                else {
                    res.send({
                        error: false,
                        massage: "update password",
                        result: result
                    })
                }
            })
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
    let commandSearch = `SELECT * FROM bin_info WHERE lat = ? and lng = ?`;
    let commandAdd = `INSERT INTO bin_info (lat,lng,description,red_bin,green_bin,yellow_bin,blue_bin,picture) VALUE
                    (?,?,?,?,?,?,?,?)`;
    conn.query(commandSearch, [lat, lng], (err, result) => {
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
    conn.query(command, [lat, lng, description, red_bin, green_bin, yellow_bin, blue_bin, picture, id], (err, result) => {
        if (err) throw err; else {
            res.send({ error: false, massage: "update bin complete", result: result })
        }
    })
})


// end bin info and start report tablea
app.get('/report', (req, res) => {
    let command = `SELECT report.id ,report.report_date , user_info.name as user_report, report.header,report.category,report.description, bin_info.lat,bin_info.lng 
                    from (( report inner join bin_info on report.bin = bin_info.id)
                   inner join user_info on report.user_report = user_info.id);`;
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
    let id = req.params.id;
    let command = `SELECT report.id ,report.report_date , user_info.name as user_report, report.header,report.category,report.description, bin_info.lat,bin_info.lng 
    from (( report inner join bin_info on report.bin = bin_info.id)
                   inner join user_info on report.user_report = user_info.id) WHERE report.id= ? ;`; // TODO: Sanitize sql query
    conn.query(command, [id], (err, result) => {
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


// Report bin
app.post('/report', (req, res) => {
    let { user_report, description = null, category, header, bin } = req.body;
    let commandSearch = `Select * from report where  bin = ? and category = ? ;`
    let commandAdd = `INSERT INTO report (user_report, description, category, header, bin) VALUES (?,?,?,?,?);`;
    conn.query(commandSearch, [bin, category], (err, result) => {
        if (err) throw err;
        else if (result.length !== 0) { res.send({ error: true, massage: "this report has in database" }) }
        else {
            conn.query(commandAdd, [user_report,description,category,header,bin], (err, result) => {
                if (err) throw err;
                else {
                    res.send({
                        error: false,
                        massage: "add report success",
                        result: result
                    })
                }
            })
        }
    })
})


// it normal report 
app.get('/appReport', (req, res) => {
    let command = `select * from app_report;`;
    conn.query(command, (err, result) => {
        if (err) throw err; else if (result.length === 0) {
            res.status(404).send({
                error: true, message: "haven't report now"
            })
        } else if (result.length == 0) { res.status(404).send({ error: true, massage: "app report not found " }) }
        else {
            res.send({
                error: false, message: "search report complete", response: result
            })
        }
    })
})

app.get('/appReport/:id', (req, res) => {
    let id = req.params.id;
    let command = `select * from app_report WHERE id = ?;`;
    conn.query(command, [id], (err, result) => {
        if (err) throw err; else if (result.length === 0) {
            res.status(404).send({
                error: true, message: `haven't report id ${id} now`
            })
        } else if (result.length == 0) { res.status(404).send({ error: true, massage: "app report not found " }) }
        else {
            res.send({
                error: false, message: "search report complete", response: result
            })
        }
    })
})

app.post('/appReport', (req, res) => {
    let { header, category, description = null, user } = req.body;
    let commandSearch = `SELECT * FROM app_report WHERE category = ? and user = ? ;`;
    let commandAdd = `INSERT INTO app_report(header,category,description,user) VALUES (?,?,?,?)`;
    conn.query(commandSearch, [category, user], (err, result) => {
        if (err) throw err;
        else if (result.length !== 0) {
            res.status(404).send({
                error: true,
                massage: "this report has been in database"
            })
        }
        else {
            conn.query(commandAdd, [header, category, description, user], (err, result) => {
                if (err) throw err;
                else {
                    res.status(201).send({
                        error: false,
                        massage: "add report complete",
                        result: result
                    })
                }
            })
        }
    })
})


app.listen(port, () => {
    console.log(`server running on port ${port}`)
})



// https
//     .createServer({
//         key: fs.readFileSync("/etc/letsencrypt/live/tapanawat.myftp.org/privkey.pem", 'utf8'),
//         cert: fs.readFileSync("/etc/letsencrypt/live/tapanawat.myftp.org/cert.pem", 'utf8'),
//         ca: fs.readFileSync("/etc/letsencrypt/live/tapanawat.myftp.org/chain.pem", 'utf8')
//     },
//         app)
//     .listen(port, () => {
//         console.log('server is runing at port ', port)
//     });
