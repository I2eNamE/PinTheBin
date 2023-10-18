import fs from 'fs';
import mysql from 'mysql';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sessions from 'express-session';
import cookieParser from "cookie-parser";
import https from 'https';
import 'dotenv/config'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const app = express();
const port = 8080
// implement jwt
const secretKey = process.env.secretKey;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))



//  wan to check jwt token before use other function except  /login
app.use((req, res, next) => {
    if (!(req.path === "/login" || req.path === "/register" )) {
        const result = verifyToken(req, res, next);
        if (result === true) {
            next();
        }
    } else {
        next();
    }
});



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



const verifyToken = (req, res, next) => {
    let authorized = false;
    console.log('req.headers', req.headers);
    const authHeader = req.headers.authorization;

    console.log('secretKey:', secretKey);
    console.log('authHeader:', authHeader);
    // console.log(!authHeader)
    if (!authHeader) {
        console.log('No token provided');
        res.status(403).json({ error: true, message: 'Unauthorized: No token provided' });
    }

    // Extract the token without the "Bearer" prefix
    const token = authHeader.split(' ')[1];
    // console.log(token)

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.log('Invalid token', err);
            res.status(401).json({ error: true, message: 'Unauthorized: Invalid token' });
        } else {
            console.log('Decoded token:', decoded);
            req.user = decoded;
            authorized = true;
        }
    });
    return authorized;
};

// test rest api
app.get('/test', (req, res) => {
    res.send("Hello world");
})


// app.get('/logout', (req, res) => {
//     req.session.destroy();
// });








// multer
// import multer from 'multer';
// const upload = multer({ dest: 'uploads' })

// sample code
// app.post('/upload', upload.single('photo'), (req, res) => {
//     res.send(req.file)
//   })

// sample res
// {
//     "fieldname": "photo",
//     "originalname": "Screen Shot 2565-07-14 at 22.26.37.png",
//     "encoding": "7bit",
//     "mimetype": "image/png",
//     "destination": "uploads",
//     "filename": "801ea9c5a8ee00fba92f0589fb8230e0",
//     "path": "uploads/801ea9c5a8ee00fba92f0589fb8230e0",
//     "size": 4243
//   }



// app.js

import multer from 'multer';

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../Frontend/public/data/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
})

// Create the multer instance
const upload = multer({ storage });

export default upload;

// handle upload file
app.post('/upload', upload.single('fileInput'), (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).send({ error: true, message: req.fileValidationError });
    } else if (!req.file) {
        return res.status(400).send({ error: true, message: 'No file uploaded' });
    }
    
    // Use the provided file name or generate a new one
    const fileName = req.body.fileName || `bin_${Date.now()}`;

    // Rename the file with the desired name
    fs.rename(req.file.path, path.join(req.file.destination, fileName), (err) => {
        if (err) {
            return res.status(500).send({ error: true, message: 'Error renaming the file' });
        }

        res.send({ error: false, message: 'File uploaded successfully' });
    });
});











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

app.post('/register', async (req, res) => {
    let { email, name, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).send({ error: true, message: "password mismatch" })

    } else {
        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds

            let commandAdd = `INSERT INTO user_info (email, name, password) VALUES (?, ?, ?);`
            let commandSearch = `SELECT * FROM user_info WHERE email= ?;`

            conn.query(commandSearch, [email], async (err, result) => {
                if (err) {
                    res.send(err);
                } else if (result.length !== 0) {
                    res.status(400).send({
                        error: true, message: "this email has been registered"
                    });
                } else {
                    // Store the hashed password in the database
                    conn.query(commandAdd, [email, name, hashedPassword], (err, result) => {
                        if (err) throw err;
                        res.status(201).send({
                            error: false, message: "create new user complete", response: result
                        });
                    });
                }
            });
        } catch (error) {
            console.error('Error hashing password:', error);
            res.status(500).json({ error: true, message: 'Internal Server Error' });
        }
    }
});

app.post('/picture', (req, res) => {
    let { id, path } = req.body;
    let command = `UPDATE user_info
    SET picture = ? WHERE id = ?;`;
    conn.query(command, [path, id], (err, result) => {
        if (err) throw err;
        else {
            res.send({
                error: false,
                message: "update picture complete",
                result: result
            })
        }
    })

})

app.post('/login', (req, res) => {
    let { email, password } = req.body;
    let command = `SELECT * FROM user_info WHERE email = ?`;

    conn.query(command, [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ error: true, message: 'Internal Server Error' });
        }

        if (result.length !== 1) {
            return res.status(404).json({ error: true, message: 'Email or password is incorrect' });
        }

        // console.log('result password:', result[0].password)
        console.log('password:', password)
        const user = result[0];

        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, result[0].password);

        console.log('isPasswordValid', isPasswordValid)
        if (!isPasswordValid) {
            return res.status(401).json({ error: true, message: 'Email or password is incorrect' });
        }


        // Generate JWT
        const token = jwt.sign({ userId: user.id, userEmail: email }, secretKey, { expiresIn: '1h' });

        res.status(200).json({ error: false, message: 'Login successful', token });
    });
});

// Middleware to protect routes with JWT
app.use('/secure', verifyToken);

// Example of a secure route
app.get('/secure/data', (req, res) => {
    res.status(200).json({ error: false, message: 'Secure data' });
});


app.patch('/changepassword', (req, res) => {
    let { id, oldPassword, newPassword, confirmPassword } = req.body;
    let commandSearch = `SELECT password FROM user_info where id = ?`;
    let commandUpdate = `UPDATE user_info SET password = ? WHERE id = ?`;
    if (newPassword !== confirmPassword) {
        return res.status(400).send({
            error: true,
            message: "password miss match"
        })
    }
    conn.query(commandSearch, [id], (err, result) => {
        if (err) throw err;
        else if (result.length == 0 || result[0].password != oldPassword) {
            res.send({
                error: true,
                message: "can not find old password or old password not correct",
            })
        }
        else {
            conn.query(commandUpdate, [newPassword, id], (err, result) => {
                if (err) throw err;
                else {
                    res.send({
                        error: false,
                        message: "update password",
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

// Search bin by location or description
app.post('/bin/search', (req, res) => {
    let { location, description } = req.body;
    let command = `SELECT * FROM bin_info WHERE location LIKE ? OR description LIKE ?;`; // TODO: Sanitize sql query
    conn.query(command, [`%${location}%`, `%${description}%`], (err, result) => {
        if (err) throw err; else if (result.length === 0) {
            res.status(404).send({ error: true, message: "Bin not found" });
        } else {
            res.send({ error: false, message: "Search bin complete", response: result });
        }
    });
});

app.post('/bin', (req, res) => {
    let { location, lat, lng, description = null, picture = null, binType } = req.body;
    let commandSearch = `SELECT * FROM bin_info WHERE lat = ? and lng = ?`;
    let commandAdd = `INSERT INTO bin_info (location, lat, lng, description, picture, red_bin, green_bin, yellow_bin, blue_bin) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    conn.query(commandSearch, [lat, lng], (err, result) => {
        if (err) {
            throw err;
        } else if (result.length !== 0) {
            const binId = result.insertId; // Get the ID of the inserted bin
            res.status(201).send({ error: false, message: "Bin added successfully.", result: result, id: binId });
        } else {
            // Initialize bin types
            const binTypes = {
                red_bin: false,
                green_bin: false,
                yellow_bin: false,
                blue_bin: false,
            };

            // Set bin types based on the received array
            binType.forEach((type) => {
                binTypes[type.toLowerCase()] = true;
            });

            const values = [location, lat, lng, description, picture, binTypes.red_bin, binTypes.green_bin, binTypes.yellow_bin, binTypes.blue_bin];

            conn.query(commandAdd, values, (err, result) => {
                if (err) {
                    throw err;
                } else {
                    res.status(201).send({ error: false, message: "Bin added successfully.", result: result });
                }
            });
        }
    });
});

app.patch('/bin', (req, res) => {
    let { location, lat, lng, description = null, picture = null, binType } = req.body;
    // Initialize bin types
    const binTypes = {
        red_bin: false,
        green_bin: false,
        yellow_bin: false,
        blue_bin: false,
    };
    // Set bin types based on the received array
    binType.forEach((type) => {
        binTypes[`${type.toLowerCase()}`] = true;
    });
    let command = `UPDATE bin_info 
                  SET date = CURRENT_TIMESTAMP,location = ?, description = ?, red_bin = ?,
                  green_bin = ?, yellow_bin = ?, blue_bin = ?, picture = ?
                  WHERE lat = ? AND lng = ?;`;
    const values = [
        location,
        description,
        binTypes.red_bin,
        binTypes.green_bin,
        binTypes.yellow_bin,
        binTypes.blue_bin,
        picture,
        lat,
        lng,
    ];
    conn.query(command, values, (err, result) => {
        if (err) {
            throw err;
        } else {
            res.send({ error: false, message: "Update bin complete", result: result });
        }
    });
});

app.delete("/bin/:id", (req, res) => {
    let binId = req.params.id;
    let commanddelete = `DELETE FROM bin_info WHERE id = ?`;

    conn.query(commanddelete, [binId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send({
                error: true,
                message: "Error deleting bin",
            });
        } else {
            res.send({
                error: false,
                result: result,
            });
        }
    });
});




// end bin info and start report tablea
app.get('/report', (req, res) => {
    let command = `SELECT report.id ,report.report_date , user_info.name as user_report, report.header,report.category,
                    report.description, bin_info.lat,bin_info.lng 
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


// what is id report id , user id  ??
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
        else if (result.length !== 0) {
            res.send({
                error: true,
                message: "this report has been in database"
            })
        }
        else {
            conn.query(commandAdd, [user_report, description, category, header, bin], (err, result) => {
                if (err) throw err;
                else {
                    res.status(201).send({
                        error: false,
                        message: "add report success",
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
        } else if (result.length == 0) { res.status(404).send({ error: true, message: "app report not found " }) }
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
        } else if (result.length == 0) { res.status(404).send({ error: true, message: "app report not found " }) }
        else {
            res.send({
                error: false, message: "search report complete", response: result
            })
        }
    })
})

app.post('/appReport', (req, res) => {
    let { header, category, description = null, user } = req.body;
    let commandSearch = `SELECT * FROM app_report WHERE header = ? and user = ? ;`;
    let commandAdd = `INSERT INTO app_report(header,category,description,user) VALUES (?,?,?,?)`;
    conn.query(commandSearch, [header, user], (err, result) => {
        if (err) throw err;
        else if (result.length !== 0) {
            res.send({
                error: true,
                message: "this report has been in database"
            })
        }
        else {
            conn.query(commandAdd, [header, category, description, user], (err, result) => {
                if (err) throw err;
                else {
                    res.status(201).send({
                        error: false,
                        message: "add report complete",
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
