import express from 'express'
import cors from 'cors'
import events from 'events'

const emitter = new events.EventEmitter()

const PORT = 5000

const app = express()

app.use(cors())
app.use(express.json())

app.get('/get-message', (req, res)=>{
    emitter.once('newMessage', (message)=>{
        res.json(message)
    }) //отправляем сообщение пользователям при вызове события получения нового сообщения
})

app.post('/new-message', ((req, res)=>{
    const message = req.body
    emitter.emit('newMessage', message) // Вызываем событие и передаем туда наше сообщение
    res.sendStatus(200)
}))

app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`))