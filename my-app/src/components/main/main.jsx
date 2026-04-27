import React from 'react'
import '../../styles/main.css'
import { assets } from "../../assets/assets";

const Main = () => {
  return (
    <div className="main">
        <div className="nav">
            <p>Gemini</p>
            <img src={assets.user_icon} alt=""/>
        </div>
        <div className="main-container">
            <div className="greet">
                <p><span>Hello, Dev.</span></p>
                <p>How can I help you today?</p>
            </div>
            <div className="cards">
                <div className="card">
                    <p>Good morning, Morio cho</p>
                    <img src={assets.compass_icon} alt="" />
                </div>
                <div className="card">
                    <p>Want me to summarize something?</p>
                    <img src={assets.bulb_icon} alt="" />
                </div>
                <div className="card">
                    <p>Need some coding help?</p>
                    <img src={assets.message_icon} alt="" />
                </div>
                <div className="card">
                    <p>$50,000,000 dollor prize for the Steel Ball Run</p>
                    <img src={assets.code_icon} alt="" />
                </div>
            </div>
            <div className="main-bottom">
                <div className="search-box">
                    <input type="text" placeholder='Enter a prompt here'/>
                    <div>
                        <img src={assets.gallery_icon} alt="" />
                        <img src={assets.mic_icon} alt="" />
                        <img src={assets.send_icon} alt="" />
                    </div>
                </div>
                <p className="bottom-info">
                    Be carful, Gemini can be wrong sometimes. Always verify critical information and don't use it for high-risk decisions.
                </p>
            </div>
        </div>
    </div>
  )
}

export default Main