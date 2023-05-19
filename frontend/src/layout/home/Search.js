import React, { useEffect, useReducer, useState, useRef, useCallback } from "react";
import SearchInput from "./SearchInput";
import classes from "./Search.module.css";

//placeholder
const locationTerms = [
    {content: "Paris"},
    {content: "London"},
    {content: "Porto"},
    {content: "Atlanta"},
    {content: "Amsterdam"},
    {content: "Metz"},
    {content: "Brussels"},
    {content: "Munich"},
    {content: "Florence"},
    {content: "Rome"},
    {content: "Athens"},
    {content: "New York City"},
];
const topicTerms = [
    {content: "Hiking"},
    {content: "Shopping"},
    {content: "Clubs"},
    {content: "Attractions"},
    {content: "Bars"},
    {content: "Restaurants"},
    {content: "Audio Tours"},
    {content: "Coffee shops"},
    {content: "Ice Cream"},
    {content: "Islands"},
    {content: "Red Light District"},
    
    
];

const locationReducer = (state, action) => {
    if (action.type === "USER_INPUT") {
      return { value: action.val, isValid: locationTerms.find(item => {
            const searchTerm = action.val.toLowerCase();
            const term = item.content.toLowerCase();
            return term === searchTerm;
        }) != null };
    }
    if (action.type === "INPUT_BLUR") {
      return { value: state.value, isValid: locationTerms.find(item => {
            const searchTerm = state.value.toLowerCase();
            const term = item.content.toLowerCase();
            return term === searchTerm;
        }) != null };
    }
    return { value: "", isValid: false };
};
const topicReducer = (state, action) => {
    if (action.type === "USER_INPUT") {
      return { value: action.val, isValid: topicTerms.find(item => {
            const searchTerm = action.val.toLowerCase();
            const term = item.content.toLowerCase();
            return term === searchTerm;
        }) != null };
    }
    if (action.type === "INPUT_BLUR") {
      return { value: state.value, isValid: topicTerms.find(item => {
            const searchTerm = state.value.toLowerCase();
            const term = item.content.toLowerCase();
            return term === searchTerm;
        }) != null };
    }
    return { value: "", isValid: false };
};

const Search = (props) => {

    const [formIsValid, setFormIsValid] = useState(false);

    const [locationState, dispatchLocation] = useReducer(locationReducer, {
        value: "",
        isValid: null,
    });
    const [topicState, dispatchTopic] = useReducer(topicReducer, {
        value: "",
        isValid: null,
    });

    const locationChangeHandler = useCallback((text) => {
        dispatchLocation({ type: "USER_INPUT", val: text });
    }, []);
    
    const validateLocationHandler = useCallback(() => {
        dispatchLocation({ type: "INPUT_BLUR" });
    }, []);
    
    const topicChangeHandler = useCallback((text) => {
        dispatchTopic({ type: "USER_INPUT", val: text });
    }, []);
    
    const validateTopicHandler = useCallback(() => {
        dispatchTopic({ type: "INPUT_BLUR" });
    }, []);

    const locationRef = useRef();
    const topicRef = useRef();

    useEffect(() => {
        return () => {
        };
    }, []);

    const { isValid: locationIsValid } = locationState;
    const { isValid: topicIsValid } = topicState;

    useEffect(() => {
        const identifier = setTimeout(() => {
          setFormIsValid(locationIsValid && topicIsValid);
        }, 500);
    
        return () => {
          clearTimeout(identifier);
        };
    }, [locationIsValid, topicIsValid]);

    const onSubmitHandler = (event) => {
        event.preventDefault();
        if (formIsValid) {
            props.search(locationState.value, topicState.value);
        } else if (!locationIsValid) {
            locationRef.current.focus();
        } else {
            topicRef.current.focus();
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className={classes.container}>
            <SearchInput
                ref={locationRef}
                id="Location"
                type="text"
                placeholder="Location"
                searchTerms={locationTerms} 
                isValid={locationIsValid}
                input={locationChangeHandler}
                onBlur={validateLocationHandler}
            />
            <SearchInput 
                ref={topicRef}
                id="Topic"
                type="text"
                placeholder="Topic" 
                searchTerms={topicTerms} 
                isValid={topicIsValid}
                input={topicChangeHandler}
                onBlur={validateTopicHandler}
            />
            <button className={classes["search-button"]} type="submit">Search</button>
        </form>
    );
};

export default Search;