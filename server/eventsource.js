import express from 'express'
import cors from 'cors'
import events from 'events'

const emitter = new events.EventEmitter()

const PORT = 5000

const app = express()

app.use(cors())
app.use(express.json())

app.get('/connect', (req, res)=>{
    res.writeHead(200, {
        'Connection': 'keep-alive', //Устанавливаем постонное соединение
        'Content-Type': 'text/event-stream', //Тип контента
        'Cache-Control': 'no-cache', //Убираем кэширование
    }) //Добавляем заголовки для ответа
    emitter.on('newMessage', (message)=>{
        res.write(`data: ${JSON.stringify(message)} \n\n`) // Сообщение должно отправляться в именно в таком формате, с лишним пробелом уже не работает
    })// Подписываемся на событие которое может выполняться бесконечно
})

app.post('/new-message', ((req, res)=>{
    const message = req.body
    emitter.emit('newMessage', message) // Вызываем событие и передаем туда наше сообщение
    res.sendStatus(200)
}))

app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`))