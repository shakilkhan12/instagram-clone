import React, { useState, useEffect } from 'react';
import Post from "./Post"
import ImageUpload from "./ImageUpload"
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from "@material-ui/core/Button"
import Skeleton from '@material-ui/lab/Skeleton';
import Input from "@material-ui/core/Input"
import { db, auth } from "./firebase"
import InstagramEmbed from 'react-instagram-embed';
import './App.css';

function getModalStyle() {

  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const App = () => {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        // User is logged in 
        console.log(authUser)
        setUser(authUser)
      } else {
        // User is logged out
        setUser(null)
      }
    })
    return () => {
      // perform some cleanup operation
      unsubscribe();
    }
  }, [user, username])
  useEffect(() => {
    setLoading(true)
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // every time a new post is added, this code fires
      setLoading(false)
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, post: doc.data() })))
      console.log(loading)
    })
  }, [])
  const signup = (e) => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        return authUser.user.updateProfile({ displayName: username })
      })
      .catch(err => alert(err.message))
    setOpen(false);
  }
  const signin = e => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .catch(err => alert(err.message))
    setOpenSignIn(false);
  }
  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}

      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo" />
          </center>

          <form className="app__signup">
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signup}>Signup</Button>
          </form>
        </div>
      </Modal>


      {/* login model */}
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}

      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo" />
          </center>
          <form className="app__signup">
            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signin}>Login</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo" />
        {user ? (<Button onClick={() => auth.signOut()}>Logout</Button>) : (<div className="app__loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Login</Button>
          <Button onClick={() => setOpen(true)}>Singup</Button>
        </div>)}
      </div>

      <div className="app__posts">
        <div className="app__postLeft">
          {user?.displayName ? (<ImageUpload username={user.displayName} />) : 'Sorry you need to login to add a post'}
          {!loading ? (posts.map(({ id, post }) => (
            <Post key={id} user={user} postId={id} username={post.username} imageUrl={post.imageUrl} caption={post.caption} />
          ))) : (<React.Fragment>
            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
            <Skeleton animation="wave" height={10} width="80%" />
          </React.Fragment>)}
        </div>
        <div className="app__postRight">
          <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>
      </div>


    </div>
  );
}

export default App;
// https://youtu.be/f7T48W0cwXM?t=10751
