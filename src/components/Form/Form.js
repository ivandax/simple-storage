import React from 'react';

import {addItem} from '../../services/database';

import './Form.css'

const Form = () => {

    const newInput = async (name) => {
        await addItem("files", {name: name})
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("trying to submit");
        newInput('yellow');
    }

    return (
        <form className="form" onSubmit={handleSubmit}>
            <label>Name of File</label>
            <input type="text" name="text"/>
            <input type="file"/>
            <button type="submit">Submit</button>
        </form>
    )
}

export default Form;