import React from 'react'
import { FaTwitter } from 'react-icons/fa'
import "./footer.css";

export default function Footer() {
  return (
    <div className='footer'>
      <h1> Footer </h1>
      <div className='footer-content'><a href='https://twitter.com/home' target='blank'><h2> <FaTwitter/> </h2></a>
      
      ABC-123 Street, Nepal, 456789 
      </div>
      
    </div>
  )
}
