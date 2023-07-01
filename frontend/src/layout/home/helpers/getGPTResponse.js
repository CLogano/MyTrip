import CONSTANTS from "../../../constants";
import { generateChatPrompt, generateRefinedChatPrompt } from "../../../prompts";

export const getGPTResponse = async (location, setChatList, messages, setMessages, setIsLoading, setDataFetched) => {

    setIsLoading(true);

    //Gather user's current location if selected
    if (location === "Your Location") {
        location = await getCurrentLocation();
    }

    console.log("Location: " + location);
    //console.log("Prompt: " + prompt);





    // const textInput1 = detectPromptIntents(prompt);
    // const textInputJSON1 = {
    //         content: textInput
    // };

    // const promptJSON = {
    //     prompt: prompt
    // };

    // try {

    //     const response = await fetch(CONSTANTS.apiURL + "/googleNL", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(promptJSON),
    //     });

    //     const result = await response.json();
    //     console.log(result);

    // } catch (error) {
    //     console.log("Error occurred while calling API:", error);
    // }

    // try {

    //     const response = await fetch(CONSTANTS.apiURL + "/gpt/process", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(promptJSON),
    //     });

    //     const result = await response.json();
    //     console.log(result);

    // } catch (error) {
    //     console.log("Error occurred while calling API:", error);
    // }


    //Generate prompt for ChatGPT API
    const textInput = generateChatPrompt(location);

    const textInputJSON = {
        content: textInput
    };

    try {

        const response = await fetch(CONSTANTS.apiURL + "/gpt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(textInputJSON),
        });

        const result = await response.json();
        console.log(result.data);

        const updatedMessages = [
            ...messages,
            { role: "user", content: textInput },
            { role: "assistant", content: result.data }
        ];
        setMessages(updatedMessages);

        const resultArray = parsePlaces(result.data, location);
        //console.log(resultArray);

        setChatList(resultArray);
        setDataFetched(false);

    } catch (error) {
        console.log("Error occurred while calling API:", error);
    }
};

export const getRefinedGPTResponse = async (prompt, city, setChatList, setData, messages, setMessages, setIsLoading, setDataFetched) => {

    setIsLoading(true);
    setData(null);

    const textInput = generateRefinedChatPrompt(prompt);
    let updatedMessages = [
        ...messages,
        { role: "user", content: textInput },
    ];

    const messagesJSON = {
        messages: updatedMessages
    };

    try {

        const response = await fetch(CONSTANTS.apiURL + "/gpt/refined", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(messagesJSON),
        });

        const result = await response.json();
        console.log(result.data);

        updatedMessages = [
            ...messages,
            { role: "assistant", content: result.data }
        ];
        setMessages(updatedMessages);

        const resultArray = parsePlaces(result.data, city);

        setChatList(resultArray);
        setDataFetched(false);

    } catch (error) {
        console.log("Error occurred while calling API:", error);
    }
}

const getCurrentLocation = () => {

    return new Promise((resolve, reject) => {

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async position => {

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                try {
                    const response = await fetch(CONSTANTS.apiURL + `/geolocation/location?lat=${latitude}&long=${longitude}`);
                    const data = await response.json();
                    resolve(data.formatted_address);

                } catch (error) {
                    reject(error);
                }
            })
        } else {
            reject("This browser does not support Geolocation.");
        }
    })  
};

const parsePlaces = (str, location) => {

    const places = [];
    const lines = str.split("\n");
    const filteredLines = lines.filter(line => line.includes("Name: ") || line.includes("Description: "));

    for (let i = 0; i < filteredLines.length; i += 2) {
        
        const name = filteredLines[i].split(": ")[1];
        const description = filteredLines[i + 1].split(": ")[1];
        const place = { name: name, description: description, location: location};
        places.push(place);
    }
    return places;
};