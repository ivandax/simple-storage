import React, { useState , useEffect } from 'react';

import {addItem, getByName, updateItemMerge, getAll} from '../../services/database';
import {uploadFile}  from '../../services/storage';

import './Form.css'

const Form = () => {

    const [formData,  setFormData] = useState({name: ''})
    const [fileUploadPercent, setFileUploadPercent] = useState(0);
    const [imageLink, setImageLink] = useState('');
    const [message, setMessage] = useState('');
    const [images, setImages] = useState([]);

    useEffect( () => {
        getAllImages();
    }, [images])

    const handleNameChange = (event) => {
        const value = event.target.value;
        console.log(value);
        setFormData({...formData, name: value});
    }

    const getAllImages = async () => {
        const results = await getAll('files');
        results && setImages(results);
    }

    const handleUploadImage = async (event) => {
        if(formData.name){
            const file = event.target.files[0];
            const downloadURL = await uploadFile(file, setFileUploadPercent);

            const exists = await getByName('files',formData.name);
            if(exists.length){
                const result = await updateItemMerge(
                    'files', 
                    {pic: downloadURL}, 
                    exists[0].id);
                if (result){
                    setFileUploadPercent(100);
                    setImageLink(downloadURL);
                    setMessage(`Image ${formData.name} changed`);
                    setFormData({name: ''});
                }                 
            } else{ //adds a new item if it doensn't exist.
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
                    setMessage(`Image ${formData.name} uploaded`);
                    setFormData({name: ''});
                } 
            }           
        }
    };

    return (
        <form className="form">
            <label>Name of File</label>
            <input type="text" value={formData.name} onChange={handleNameChange}/>
            <input type="file" onChange={handleUploadImage} disabled={formData.name.length ? false : true}/>
            <a href={imageLink}>{message}</a>
            <span>Progress: {fileUploadPercent}</span>
            <h3>Available Images:</h3>
            <ul>
                {images.map( (image) => {
                    return <li key={image.id}><a href={image.pic}>{image.name}</a></li>
                } )}
            </ul>
        </form>
    )
}

export default Form;