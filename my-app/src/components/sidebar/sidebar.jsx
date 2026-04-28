import React from 'react'
import '../../styles/sidebar.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context';

const Sidebar = () => {

  const [extended, setExtended] = React.useState(false)
  const { onSent, previousPrompts, setRecentPrompt, newChat } = React.useContext(Context);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  }

  return (
    <div className='sidebar'>
        <div className="top">
          <img onClick={()=>setExtended(prev=>!prev)} src={assets.menu_icon} alt="" className='menu'/>
          <div onClick={()=>newChat()} className="new-chat">
            <img src={assets.plus_icon} alt=""/>
            {extended?<p>New Chat</p>:null}
          </div>
          {extended?
          <div className="recent">
            <p className="recent-title">Recent</p>
            
            {previousPrompts.map((item, index)=>{
              return (<div onClick={()=>loadPrompt(item)} className="recent-entry">
              <img src={assets.message_icon} alt="" className='chat'/>
              <p>{item.slice(0,18)}...</p>
              </div>)
            })}

          </div>
          :null}
        </div>

        <div className="bottom">
          <div className="bottom-item recent-entry">
            <img src={assets.question_icon} alt="" className='settings'/>
            {extended?<p>Help</p>:null}
          </div>
          <div className="bottom-item recent-entry">
            <img src={assets.history_icon} alt="" className='settings'/>
            {extended?<p>History</p>:null}
          </div>
          <div className="bottom-item recent-entry">
            <img src={assets.setting_icon} alt="" className='settings'/>
            {extended?<p>Settings</p>:null}
          </div>
        </div>
    </div>
  )
}

export default Sidebar