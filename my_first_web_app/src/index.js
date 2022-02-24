const express = require("express");
const app = express();
const sha256 = require('js-sha256');
const bodyParser = require('body-parser')
const logic = require('./logic');
const dataUsers = require("./data");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get("/", (req, res) => {
  res.json("Welcome to our schedule website");
});

app.get("/users", (req, res) => {
  res.json(dataUsers.users);
});

app.get("/schedules", (req, res) => {
  res.json(dataUsers.schedules);
});

app.get('/users/:id',
    (req, res, next) => {
        const idNumber = Number(req.params.id);

        logic.userExist(idNumber, dataUsers.users.length, res);

        res.json(dataUsers.users[idNumber])
    }
)

app.get('/users/:id/schedules',
    (req, res, next) => {
        const idNumber = Number(req.params.id);
        const userSchedule = [];

        logic.userExist(idNumber, dataUsers.users.length, res);

        for (let i=0; i<dataUsers.schedules.length; i++) {
            if (dataUsers.schedules[i].user_id === idNumber) {
                userSchedule.push(dataUsers.schedules[i])
            }
        }
        res.json(userSchedule)
    }
)

app.post('/users', (req, res) => {
    try {
        const newUser = logic.validateInput(req.body, logic.schemaUsers);
        newUser.password = sha256(newUser.password);
        dataUsers.users.push(newUser);
        res.json(newUser);
    } catch(err) {logic.inputErrorMessage(err, res)}
})

app.post('/schedules', (req, res) => {
    try {
        const newSchedule = logic.validateInput(req.body, logic.schemaSchedules);
        newSchedule.user_id = Number(newSchedule.user_id);
        newSchedule.day = Number(newSchedule.day);
        logic.userExist(newSchedule.user_id, dataUsers.users.length, res);       
        dataUsers.schedules.push(newSchedule);
        res.json(newSchedule);
    } catch(err) {logic.inputErrorMessage(err, res)}
})

app.listen(3000, () => {
  console.log(`http://localhost:3000/ is waiting for requests.`);
});
