import React from 'react'
import '../../styles/sidebar.css'
import { assets } from '../../assets/assets'

const sidebar = () => {
  return (
    <div className='sidebar'>
        <div className="top">
          <img src={assets.menu_icon} alt="" className='menu'/>
          <div className="new-chat">
            <img src={assets.plus_icon} alt="" className='new-chat'/>
            <p>New Chat</p>
          </div>
          <div className="recent">
            <p className="title">Recent</p>
          </div>
          <div className="recent-entry">
            <img src={assets.message_icon} alt="" className='chat'/>
            <p>What is AI?</p>
          </div>
        </div>

        <div className="bottom">
          <div className="bottom-item recent-entry">
            <img src={assets.question_icon} alt="" className='settings'/>
            <p>Help</p>
          </div>
          <div className="bottom-item recent-entry">
            <img src={assets.history_icon} alt="" className='settings'/>
            <p>History</p>
          </div>
          <div className="bottom-item recent-entry">
            <img src={assets.setting_icon} alt="" className='settings'/>
            <p>Settings</p>
          </div>
        </div>
    </div>
  )
}

export default sidebar