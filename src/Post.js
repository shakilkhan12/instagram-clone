import React, { useState, useEffect } from 'react'
import Avatar from "@material-ui/core/Avatar"
import { db } from "./firebase"
import firebase from "firebase"
import "./Post.css"

const Post = ({ postId, user, username, caption, imageUrl }) => {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    const postComment = e => {
        e.preventDefault();
        db.collection("posts").doc(postId).collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }
    useEffect(() => {

        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'desc')
                .onSnapshot(snapshot => {
                    setComments(snapshot.docs.map(doc => doc.data()))
                })
        }

        return () => {
            unsubscribe();
        }

    }, [postId])
    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" alt='sdf' src="/static/images/avatar/1.jpg" />
                <h3>{username}</h3>
            </div>
            <img className="post__image" src={imageUrl} alt="post image" />
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
            <div className="post__comments">
                {comments.map(comment => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>
            <form className="post__commentBox">
                <input type="text" disabled={!user} className="post__input" placeholder="add comment" value={comment} onChange={e => setComment(e.target.value)} />
                <button className="post__button" disabled={!comment || !user} type="submit" onClick={postComment}>Post</button>
            </form>
        </div>
    )
}

export default Post
