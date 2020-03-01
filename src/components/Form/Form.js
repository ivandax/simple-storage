import React, {useState} from 'react';

import {addItem,getByName} from '../../services/database';
import {uploadFile}  from '../../services/storage';

import './Form.css'

const Form = () => {

    const [formData,  setFormData] = useState({name: ''})
    const [fileUploadPercent, setFileUploadPercent] = useState(0);
    const [imageLink, setImageLink] = useState('');
    const [error, setError] = useState('');

    const handleNameChange = (event) => {
        const value = event.target.value;
        console.log(value);
        setFormData({...formData, name: value});
    }

    const handleUploadImage = async (event) => {
        setError('');
        if(formData.name){
            const file = event.target.files[0];
            const downloadURL = await uploadFile(file, setFileUploadPercent);

            const exists = await getByName('files',formData.name);
            exists && console.log(exists);
    
            const result = await addItem(
                'files',
                {
                    name: formData.name,
                    pic: downloadURL
                }
            );
            if (result){
                setFileUploadPercent(100);
                setImageLink(downloadURL);
            }            
        } else{
            setError("Name has to be provided")
        }
    };

    return (
        <form className="form">
            <label>Name of File</label>
            <input type="text" value={formData.name} onChange={handleNameChange}/>
            <input type="file" onChange={handleUploadImage}/>
            <a href={imageLink}>{imageLink}</a>
            <span>Progress: {fileUploadPercent}</span>
            <span className="error">{error}</span>
        </form>
    )
}

export default Form;