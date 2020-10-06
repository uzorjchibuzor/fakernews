import React from 'react'

const Button = ({onClick, className='', children}) => {
  return (
    <button 
      onClick = {onClick}
      >
      {children}
    </button>
  )
}

export default Button