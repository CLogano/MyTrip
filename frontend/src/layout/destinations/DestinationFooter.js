import React from "react";
import classes from "./DestinationFooter.module.css"
import { useNavigate } from "react-router-dom";

const DestinationFooter = () => {

    const navigate = useNavigate();

    const backButtonHandler = () => {
        navigate("/");
    }
    

    return (
        <footer className={classes.footer}>
            <button className={classes["back-button"]} onClick={backButtonHandler}>Back</button>
        </footer>
    )
};

export default DestinationFooter;