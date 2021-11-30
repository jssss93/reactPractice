const express = require('express');
const app = express();
// const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');
const PORT = process.env.port || 8000;

// const db = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: "123",
//     database: "simpleboard"
// });

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/get", (req, res)=>{
    // const sqlQuery = "SELECT * FROM simpleboard;";
    // db.query(sqlQuery, (err, result)=>{
        res.send([{"title":"title","content":"content"}]);
    // })
})

app.get("/users", (req, res)=>{
    // const sqlQuery = "SELECT * FROM simpleboard;";
    // db.query(sqlQuery, (err, result)=>{
        res.send(
            [
                {
                  "id": 1,
                  "name": "Leanne Graham",
                  "username": "Bret",
                  "email": "Sincere@april.biz",
                  "address": {
                    "street": "Kulas Light",
                    "suite": "Apt. 556",
                    "city": "Gwenborough",
                    "zipcode": "92998-3874",
                    "geo": {
                      "lat": "-37.3159",
                      "lng": "81.1496"
                    }
                  },
                  "phone": "1-770-736-8031 x56442",
                  "website": "hildegard.org",
                  "company": {
                    "name": "Romaguera-Crona",
                    "catchPhrase": "Multi-layered client-server neural-net",
                    "bs": "harness real-time e-markets"
                  }
                },
                {
                  "id": 2,
                  "name": "Ervin Howell",
                  "username": "Antonette",
                  "email": "Shanna@melissa.tv",
                  "address": {
                    "street": "Victor Plains",
                    "suite": "Suite 879",
                    "city": "Wisokyburgh",
                    "zipcode": "90566-7771",
                    "geo": {
                      "lat": "-43.9509",
                      "lng": "-34.4618"
                    }
                  },
                  "phone": "010-692-6593 x09125",
                  "website": "anastasia.net",
                  "company": {
                    "name": "Deckow-Crist",
                    "catchPhrase": "Proactive didactic contingency",
                    "bs": "synergize scalable supply-chains"
                  }
                },
                {
                    "id": 3,
                    "name": "Ervin Howell",
                    "username": "Antonette",
                    "email": "Shanna@melissa.tv",
                    "address": {
                      "street": "Victor Plains",
                      "suite": "Suite 879",
                      "city": "Wisokyburgh",
                      "zipcode": "90566-7771",
                      "geo": {
                        "lat": "-43.9509",
                        "lng": "-34.4618"
                      }
                    },
                    "phone": "010-692-6593 x09125",
                    "website": "anastasia.net",
                    "company": {
                      "name": "Deckow-Crist",
                      "catchPhrase": "Proactive didactic contingency",
                      "bs": "synergize scalable supply-chains"
                    }
                  }
              ]
        );
    // })
})


// app.post("/api/insert", (req, res) => {
//     const title = req.body.title;
//     const content = req.body.content;
//     const sqlQuery = "INSERT INTO simpleboard (title, content) VALUES (?,?)";
//     db.query(sqlQuery, [title, content], (err, result) => {
//         res.send('success!');
//     });
// });

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});