import WebSocket, { WebSocketServer } from 'ws'

const wss = new WebSocketServer({
    port : 5000,
}, ()=>console.log(`Server started on port 5000`))

wss.on('connection', function connection(ws){
    ws.on('message', function(message){
        message = JSON.parse(message)
        switch (message.event){
            case 'message':
                broadcastMessage(message)
                break
            case 'connection':
                broadcastMessage(message)
                break
        }
    })
})

//Функция массовой рассылки
function broadcastMessage(message){
    wss.clients.forEach(client=>{
        client.send(JSON.stringify(message))
    })
}