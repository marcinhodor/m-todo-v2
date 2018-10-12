const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const {
  ObjectID
} = require('mongodb')

var {
  mongoose
} = require('./db/mongoose.js')
var {
  Todo
} = require('./db/models/todo.js')
var {
  Category
} = require('./db/models/category.js')

const port = process.env.PORT || 3000
const publicPath = path.join(__dirname, 'public')

var app = express()
app.use(bodyParser.json())
app.use(express.static('public'))

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: publicPath
  })
})

// retrieve all todos
app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({
      todos
    })
  }, (e) => {
    res.status(400).send(e)
  })
})

// retrieve all categories
app.get('/categories', (req, res) => {
  Category.find().then((categories) => {
    res.send({
      categories
    })
  }, (e) => {
    res.status(400).send(e)
  })
})

// save new todo
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    category: req.body.category
  })

  todo.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e)
  })
})

// save new category
app.post('/categories', (req, res) => {
  var category = new Category({
    name: req.body.name
  })

  category.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e)
  })
})

// delete a todo
app.delete('/todos/:id', (req, res) => {
  var id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }

    res.send(todo)
  }).catch((e) => {
    res.status(404).send()
  })
})

// delete a category and related todos
app.delete('/categories/:id', (req, res) => {
  var id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Category.findByIdAndRemove(id).then((category) => {
    if (!category) {
      return res.status(404).send()
    }

    Todo.deleteMany({
      category: category.name
    }).then((todos) => {
      console.log(todos)
    }).catch((e) => {
      console.log(e)
    })

    res.send(category);
  }).catch((e) => {
    console.log(e);
  })
})

// modify a todo
app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var completed = !req.body.isCompleted

  Todo.findOneAndUpdate({
      _id: id
    }, {
      $set: {
        isCompleted: completed
      }
    }, {
      new: true
    })
    .then((todo) => {
      // console.log(todo)
    }).catch((e) => {
      // console.log(e)
    });
});

app.listen(port, () => {
  console.log(`server up on port: ${port}`)
});