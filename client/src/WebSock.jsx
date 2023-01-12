import React, { useState, useRef } from 'react'
import classes from './App.module.css'
import axios from 'axios'

const WebSock = ()=>{
    const [messages, setMessages] = useState([])
    const [value, setValue] = useState('')
    const socket = useRef()
    const [connected, setConnected] = useState(false)
    const [username, setUserName] = useState('')

    function connect(){
                //Устанавливаем подключение к веб сокету по протоколу ws
                socket.current = new WebSocket('ws://localhost:5000/')
                //Слушатель подключения
                socket.current.onopen = ()=>{
                    setConnected(true)
                    const message = {
                        event : 'connection',
                        username,
                        id : Date.now()
                    }
                    //Не забываем перевети сообщение в строку
                    socket.current.send(JSON.stringify(message))
                }
                //Слушатель получения сообщений
                socket.current.onmessage = (event)=>{
                    // Сообщение из строки переводи в JS объект
                    const message = JSON.parse(event.data)
                    setMessages(prev=>[message, ...prev])
                }
                //Слушатель отключения
                socket.current.onclose = ()=>{
                    console.log('Socket закрыт.')
                }
                //Слушатель ошибок
                socket.current.onerror = ()=>{
                    console.log('Socket произошла ошибка.') 
                }
    }

    async function sendMessage(){
        const message = {
            event : 'message',
            message : value,
            username,
            id : Date.now()
        }

        socket.current.send(JSON.stringify(message))
        setValue('')
    }

    if (!connected){
        return (<div className={classes.center}>
            <div className={classes.form}>
                <input type='text' value={username} onChange={(e)=>setUserName(e.target.value)} placeholder='Введите имя пользователя...'/>
                <button onClick={connect}>Войти</button>
            </div>
        </div>)
    }
    return(
        <div className={classes.center}>
            <div className={classes.form}>
                <input type='text'
                value={value}
                onChange={(e)=>setValue(e.target.value)}/>
                <button onClick={sendMessage}>Отправить</button>
            </div>
            <div className={classes.messages}>
                {
                    messages.map(m=>{
                        return(
                            <div key={m.id}>
                                {m.event === 'connection' 
                                ?
                                <div className={classes.connection_message}>Пользователь {m.username} подключен.</div>
                                : 
                                <div className={classes.message}>{m.username}. {m.message}</div>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default WebSock