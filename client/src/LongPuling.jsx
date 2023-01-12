import React, { useState, useEffect } from 'react'
import classes from './App.module.css'
import axios from 'axios'

const LongPuling = ()=>{
    const [messages, setMessages] = useState([])
    const [value, setValue] = useState('')

    useEffect(()=>{
        subscribe()
    },[])

    async function subscribe(){
        const config = {
            headers : {
                'Cache-Control': 'no-cache, no-transform'
            }
        }
        try{
            const {data} = await axios.get('http://localhost:5000/get-message', config)
            setMessages(prev=>[data, ...prev])
            await subscribe()
        }
        catch(e){
            setTimeout(()=>{
                subscribe()
            },500)
        }
    }

    async function sendMessage(){
        const config = {
            headers : {
                'Cache-Control': 'no-cache, no-transform'
            }
        }    
        await axios.post('http://localhost:5000/new-message', {
            message : value,
            id : Date.now()
        }, config)
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

export default LongPuling