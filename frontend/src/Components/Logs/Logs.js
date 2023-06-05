import React from 'react'
import { X } from 'react-feather'
import './Logs.css'

const Logs = ({setVisible,logs}) => {
  return (
    <div className='logs'>
        <div className="header">
            <span>Logs</span>
            <X onClick={()=>setVisible(false)} />
        </div>
        <div className="body custom-scroll">
        {logs?.map((item)=>{
            return (
              <>
                <span>
                  {item.text}<span>{item?.time}</span>
                </span>
              </>
            );
        })}
        </div>
    </div>
  )
}

export default Logs