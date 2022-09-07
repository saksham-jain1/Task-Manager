import React from 'react'
import { X } from 'react-feather'
import './Chip.css'

const Chip = ({text , close , color, onClose}) => {
  return (
    <div className='chip' style={{backgroundColor: color}}>
    {text}
    {close && <X onClick={()=> onClose ? onClose() : ""} /> }
    </div>
  )
}

export default Chip