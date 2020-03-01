import firebase from 'firebase/app';
import "firebase/storage";

const uploadFile = (file, setFileUploadPercent) => {
    return new Promise((resolve,reject)=>{
        const storageRef = firebase.storage().ref().child(`pics/${file.name}`);

        const uploadTask = storageRef.put(file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFileUploadPercent(`${progress.toFixed(2)}%`);
            },
            (error) => {
                reject("error uploading")
            },
            async()=>{
                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                resolve(downloadURL);
            }
        );
    });
}

const getDefaultPic = async (fileName='github.png') => {
    const storageRef = firebase.storage().ref().child(`pics/${fileName}`);
    const pic = await storageRef.getDownloadURL()
    return pic;
}

export {
    uploadFile, 
    getDefaultPic
};