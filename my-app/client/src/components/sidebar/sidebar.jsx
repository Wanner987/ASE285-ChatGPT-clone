import React from 'react'
import '../../styles/sidebar.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context';

const Sidebar = () => {

  const [extended, setExtended] = React.useState(false);
  const [history, setHistory] = React.useState([]);
  const { onSent, previousPrompts, setRecentPrompt, newChat, setResultData, setShowResult, setCurrentChatId } = React.useContext(Context);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/history');
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const loadPrompt = async (prompt,chat_id) => {
    setRecentPrompt(prompt);
    setCurrentChatId(chat_id);

    try {
      // 2. Fetch the specific history for this chat_id
      const response = await fetch(`http://localhost:5000/api/history/${chat_id}`);
      const data = await response.json();

      if (data && data.length > 0) {
        // 3. Get the most recent message (the last item in the array)
        const lastMessage = data[data.length - 1];
        
        // 4. Extract the text from the parts array
        const lastMessageText = lastMessage.parts[0]?.text || "";
        
        // 5. Update the context state to display the message
        setResultData(lastMessageText);
        setShowResult(true);
      }
    } catch (error) {
      console.error("Error loading chat details:", error);
      setResultData("Error loading message history.");
    }
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

              {history.map((item, index) => {
                // Access the text from the first element of the parts array
                const chatText = item.parts[0]?.text || "New Chat";

                return (
                  <div 
                    key={item.chat_id} 
                    onClick={() => loadPrompt(chatText, item.chat_id)} // Pass the ID to your load function
                    className="recent-entry"
                    data-chat-id={item.chat_id} // Stores the chat_id in the DOM element
                  >
                    <img src={assets.message_icon} alt="chat-icon" className='chat'/>
                    
                    {/* Displaying the text in a p tag, sliced for length */}
                    <p>{chatText.slice(0, 18)}{chatText.length > 18 ? "..." : ""}</p>
                  </div>
                );
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