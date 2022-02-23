const express = require("express");
const app = express();
const sha256 = require('js-sha256');
const bodyParser = require('body-parser')

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

        if (!(idNumber<dataUsers.users.length)) {
            res.status(404).json({"error": `There is no user with this id number: ${idNumber}.`})
            return;
        }

        res.json(dataUsers.users[idNumber])
    }
)

app.get('/users/:id/schedules',
    (req, res, next) => {
        const idNumber = Number(req.params.id);
        const userSchedule = [];

        if (!(idNumber<dataUsers.users.length)) {
            res.status(404).json({"error": `There is no user with this id number: ${idNumber}.`})
            return;
        }
        for (let i=0; i<dataUsers.schedules.length; i++) {
            if (dataUsers.schedules[i].user_id === idNumber) {
                userSchedule.push(dataUsers.schedules[i])
            }
        }
        res.json(userSchedule)
    }
)

app.post('/users', (req, res) => {
    const newUser = req.body;
    newUser.password = sha256(newUser.password);
    dataUsers.users.push(newUser);
    res.json(newUser);
})

app.post('/schedules', (req, res) => {
    const newSchedule = req.body;
    newSchedule.user_id = Number(newSchedule.user_id);
    newSchedule.day = Number(newSchedule.day);
    if (newSchedule.user_id >= dataUsers.users.length) {
        res.status(404).json({"error": `There is no user with this id number: ${newSchedule.user_id}.`})
        return;
    }
    dataUsers.schedules.push(newSchedule);
    res.json(newSchedule);
})

const dataUsers = require("./data");

app.listen(3000, () => {
  console.log(`http://localhost:3000/ is waiting for requests.`);
});


//curl -d "firstname=Donald&lastname=Duck&email=coincoin@gmail.com&password=daisy" -X POST localhost:3000/users
//curl -d "user_id=1&day=2&start_at=2PM&end_at=3PM" -X POST localhost:3000/schedules
//curl -d "user_id=5&day=2&start_at=2PM&end_at=3PM" -X POST localhost:3000/schedules