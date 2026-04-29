import { createContext, useState } from "react";
import runChat from '../config/gemini';

export const Context = createContext();

const ContextProvider = (props) => {
    
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [previousPrompts, setPreviousPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [currentChatId, setCurrentChatId] = useState(undefined);

    const delayPara = (index, nextWord) => {
        setTimeout(function() {
            setResultData(prev => prev + nextWord);
        }, 75 * index);
    }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setCurrentChatId(undefined);
    }

    const onSent = async (prompt) => {
        
        setResultData("");
        setLoading(true);
        setShowResult(true);

        let actualPrompt = prompt ?? input;

        setRecentPrompt(actualPrompt);
        if (prompt === undefined) { // the prompt comes from main component, all first messages in chats
            setPreviousPrompts(prev => [...prev, actualPrompt]);
        }

        let response = await runChat(actualPrompt, currentChatId);
        let modelResponse = response[0];
        setCurrentChatId(response[1]);
        console.log("chat id in context: ", response[1])

        // text formatting logic
        let responceArray = modelResponse.split("**");
        let newResponce="";
        for (let i = 0; i < responceArray.length; i++) {
            if (i % 2 === 0 || i === 0) {
                newResponce += responceArray[i];
            }
            else {
                newResponce += `<b>${responceArray[i]}</b>`;
            }
        }
        newResponce = newResponce.split("*").join("</br>");

        // delayed printing logic
        let newResponceArray = newResponce.split(" ");
        for (let i = 0; i < newResponceArray.length; i++) {
            const nextWord = newResponceArray[i];
            delayPara(i, nextWord + " ");
        }

        setLoading(false);
        setInput("");
    }
    
    
    const contextValue = {
        previousPrompts,
        setPreviousPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;