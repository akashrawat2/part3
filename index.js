// const http = require('http')

// let notes = [  
//     {    
//         id: 1,    
//         content: "HTML is easy",    
//         important: true  
//     },  
//     {    id: 2,    
//         content: "Browser can execute only JavaScript",    
//         important: false 
//     },  
//     {    
//         id: 3,    
//         content: "GET and POST are the most important methods of HTTP protocol",    
//         important: true  
//     }
// ]
// const app = http.createServer((request, response)=>{
//     response.writeHead(200, {'Content-Type': 'application/json'})
//     response.end(JSON.stringify(notes))
// })

// const PORT = 3001

// app.listen(PORT)
// console.log(`Server running on http port ${PORT}`)

const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)

app.use(express.static('dist'))
let notes = [  
    {    
        id: "1",    
        content: "HTML is easy",    
        important: true  
    },  
    {    id: "2",    
        content: "Browser can execute only JavaScript",    
        important: false 
    },  
    {    
        id: "3",    
        content: "GET and POST are the most important methods of HTTP protocol",    
        important: true  
    }
]

app.get('/', (request,response)=>{
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request,response)=>{
    response.json(notes)
})

app.get('/api/notes/:id', (request,response)=>{
    const id = request.params.id
    // console.log(`${id}`)
    // console.log(typeof(id))
    const note = notes.find(n => n.id === id)
    // notes.forEach(element => {
    //     console.log(`${element.id} ${typeof(element.id)}`)
    // });
    // console.log(`${note}`)
    if (note)
        response.json(note)
    else
        response.status(404).end()
})

app.delete('/api/notes/:id', (request,response)=>{
    console.log('delete')
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return String(maxId+1)
}
app.post('/api/notes/', (request,response)=>{
    const body = request.body
    if(!body.content){
        return response.status(400).json({
            error: "missing content"
        })
    }
    const note = {
        id: generateId(),
        content: body.content,
        important: Boolean(body.important) || false
    }
    console.log(note)
    notes = notes.concat(note)
    response.json(note)
})

// const PORT = 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)