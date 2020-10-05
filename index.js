const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.us2jj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()
app.use(cors())
app.use(bodyParser.json())

const port = 5000;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
  const eventsCollection = client.db("volunteerNetwork").collection("events");
  const activitiesCollection = client.db("volunteerNetwork").collection("activities");
  
    
  app.post('/addEvent', (req, res) => {
    const newEvent = req.body;
    console.log(newEvent)
    eventsCollection.insertOne(newEvent)
    .then(result => {
    
       res.send(result.insertedCount)
    })
  })

  app.get('/events', (req, res) => {
    eventsCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })


  app.get('/event/:id', (req, res) => {

    eventsCollection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents) => {
      
        res.send(documents[0]);
    })
})



  app.post('/addActivities', (req, res) => {
    const newActivity = req.body;
    activitiesCollection.insertOne(newActivity)
      .then(result => {
        res.redirect('/activities');
      })

  })

  app.get('/activities', (req, res) => {
    activitiesCollection.find({email: req.query.email})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })
  
  app.get('/admin/activities', (req, res) => {
    activitiesCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })
  app.delete('/delete/:id',(req, res) =>{
    activitiesCollection.deleteOne({_id : ObjectId(req.params.id)})
    .then(result =>{
      
      res.send(result.deletedCount >0);

    })
  })

});

app.get('/', (req, res) => {
    res.send('Hello from volunteer')
  })

  app.listen(process.env.PORT||port)