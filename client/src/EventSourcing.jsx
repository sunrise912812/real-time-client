import React, { useState, useEffect } from 'react'
import classes from './App.module.css'
import axios from 'axios'

const EventSourcing = ()=>{
    const [messages, setMessages] = useState([])
    const [value, setValue] = useState('')

    useEffect(()=>{
        subscribe()
    },[])

    async function subscribe(){
        const eventSource = new EventSource(`http://localhost:5000/connect`)
        eventSource.onmessage = function (event){
            const message = JSON.parse(event.data)
            setMessages(prev=>[message, ...prev])
        } //Добавляем слушателя получения сообщений
    }

    async function sendMessage(){
        await axios.post('http://localhost:5000/new-message', {
            message : value,
            id : Date.now()
        })
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
                            <div key={m.id} className={classes.message}>
                                {m.message}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default EventSourcing