import React, { useState } from 'react'
import Button from "@material-ui/core/Button"
import { LinearProgress, TextField } from "@material-ui/core"
import { storage, db } from "./firebase"
import firebase from "firebase"
import "./ImageUpload.css"

const ImageUpload = ({ username }) => {
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0)
    const handleChange = (e) => {
        console.log(e.target.files[0]);
        setImage(e.target.files[0]);
    }
    const handleUpload = (e) => {
        e.preventDefault();
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on("state_changed", (snapshot) => {
            // progress function
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            setProgress(progress);
        }, error => {
            // Error code
            console.log(error)
            alert(error.message)
        }, () => {
            // Complete function...
            storage
                .ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    // post image inside db 
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    })
                    // setProgress(0)
                    setCaption('');
                    setImage(null)
                })
        })
    }
    return (
        <div className="imageUpload">
            {progress !== 0 ? (<LinearProgress variant="determinate" value={progress} />) : ''}
            {progress !== 0 ? progress : ''} <br />
            <TextField id="standard-basic" label="Standard" placeholder="Enter caption" onChange={e => setCaption(e.target.value)} value={caption} required /> <br />
            <input type="file" onChange={handleChange} required /> <br />
            <Button variant="contained" color="secondary" onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
