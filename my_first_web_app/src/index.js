const express = require("express");
const mustacheExpress = require('mustache-express');
const app = express();
const sha256 = require('js-sha256');
const bodyParser = require('body-parser')
const logic = require('./logic');
const dataUsers = require("./data");

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

app.get("/schedules", (req, res) => {
    const schedules = [...dataUsers.schedules];
    for (let i = 0; i < schedules.length; i++) {
        schedules[i].day = logic.displayDay(schedules[i].day);
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
    (req, res) => {

        const idNumber = req.params.id;

        const userSchedule = [];

        const userExist = logic.userExist(parseInt(idNumber), dataUsers.users.length, res);

        if (userExist) {
            for (let i=0; i<dataUsers.schedules.length; i++) {
                if (dataUsers.schedules[i].user_id === parseInt(idNumber)) {
                    userSchedule.push(dataUsers.schedules[i])
                }
            }
            for (let i = 0; i < userSchedule.length; i++) {
              userSchedule[i].day = logic.displayDay(userSchedule[i].day);
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

    .post((req, res) => {
        const newSchedule = req.body;
        newSchedule.user_id = parseInt(newSchedule.user_id);
        newSchedule.day = parseInt(newSchedule.day);
        newSchedule.start_at = logic.timeFormat(newSchedule.start_at);
        newSchedule.end_at = logic.timeFormat(newSchedule.end_at);
        dataUsers.schedules.push(newSchedule);

        res.redirect("/schedules");
    });


app.listen(3000, () => {
  console.log(`http://localhost:3000/ is waiting for requests.`);
});

