const express = require("express");
const mustacheExpress = require('mustache-express');
const sha256 = require('js-sha256');
const bodyParser = require('body-parser')
const logic = require('./logic');
const dataUsers = require("./data");
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "incode",
  // password: "************", PGPASSWORD
  port: 5432,
});

app.set('views', `${__dirname}/../views`);
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/static", express.static("static"));

app.get("/", (req, res) => {
  res.render('index', {})
});

app.get("/users", (req, res) => {
    const usersNumber = [...dataUsers.users];
    for (let i=0; i<usersNumber.length; i++) {
        usersNumber[i].idNumber = i;
    }
  res.render('users-list', {"user": usersNumber});
});

app.get("/schedules", async (req, res) => {
    const schedules = (await pool.query("SELECT * FROM schedules;")).rows;
    for (let i = 0; i < schedules.length; i++) {
        schedules[i].day = logic.displayDay(schedules[i].day);
        schedules[i].start_at = logic.timeFormat(schedules[i].start_at);
        schedules[i].end_at = logic.timeFormat(schedules[i].end_at);
    }
    res.render('schedules-list', {"schedule": schedules});
});

app.get('/users/:id',
    (req, res) => {
        const idNumber = req.params.id;
        if (idNumber === "new-user") {
            res.render("form-user", {});
            return;
        }
        
        const userExist = logic.userExist(parseInt(idNumber), dataUsers.users.length, res);

        if (userExist) {
            res.render('user', {"idNumber": idNumber, 
                        "firstname": dataUsers.users[idNumber].firstname,
                        "lastname": dataUsers.users[idNumber].lastname,
                        "email": dataUsers.users[idNumber].email})
        }      
    }
)

app.get('/users/:id/schedules',
    async (req, res) => {

        const idNumber = req.params.id;

        const schedules = (await pool.query("SELECT * FROM schedules;")).rows;

        const userSchedule = [];

        const userExist = logic.userExist(parseInt(idNumber), dataUsers.users.length, res);

        if (userExist) {
            for (let i=0; i<schedules.length; i++) {
                if (schedules[i].user_id === parseInt(idNumber)) {
                    userSchedule.push(schedules[i])
                }
            }
            for (let i = 0; i < userSchedule.length; i++) {
                userSchedule[i].day = logic.displayDay(userSchedule[i].day);
                userSchedule[i].start_at = logic.timeFormat(userSchedule[i].start_at);
                userSchedule[i].end_at = logic.timeFormat(userSchedule[i].end_at);
            }
            res.render('schedules-for-user', {  "idNumber": idNumber, "schedules": userSchedule})
        } 
    }
)

app.post("/users/new-user", (req, res) => {
  const newUser = req.body;
  newUser.password = sha256(newUser.password);
  dataUsers.users.push(newUser);
  res.redirect("/users");
});

app.route("/schedules/new-schedule")
    .get((req, res) => {
        const userList = [];
        for (let i=0; i < dataUsers.users.length; i++) {
            userList.push({
                'idNumber' :i,
                'firstname' : dataUsers.users[i].firstname,
                'lastname' : dataUsers.users[i].lastname,
            })
        }
        res.render('form-schedule', {"usersList": userList});
    })

    .post( async (req, res) => {
        const {user_id, day, start_at, end_at} = req.body;

        await pool.query(`INSERT INTO
                         schedules (user_id, day, start_at, end_at) VALUES
                        ('${user_id}', '${day}', '${start_at}', '${end_at}');`);

        res.redirect("/schedules");
    });


app.listen(3000, () => {
  console.log(`http://localhost:3000/ is waiting for requests.`);
});
