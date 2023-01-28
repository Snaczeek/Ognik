import React, { Component } from "react";
import { render } from "react-dom";

export default class App extends Component 
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <div>
                <h1>Testin React</h1>
                
                {/*Passing props*/}
                <h2>{this.props.name}</h2>
            </div>
        );
    }
}

const appDiv = document.getElementById("app");
render(<App name="test"/>, appDiv);