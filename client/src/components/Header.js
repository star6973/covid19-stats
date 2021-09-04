import { useState, useEffect } from "react";
import axios from "axios";

const Header = () => {
    useEffect(() => {
        const fetchURL = async () => {
            let response = await axios.get("/covid19/news-info");
            response = response.data.items.item;
            console.log(response);
        };

        fetchURL();
    })
    return (
        <header className="App-header">
            <h1>COVID-19</h1>
        </header>
    )
}

export default Header;