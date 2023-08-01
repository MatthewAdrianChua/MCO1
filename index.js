

import 'dotenv/config';
import { connectToMongo, getDb } from './db/conn.js';
import express from 'express';
import exphbs from 'express-handlebars';
import multer from 'multer';
import { GridFSBucket, ObjectId } from 'mongodb';
import session, { Cookie } from 'express-session';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
const MongoDBStore = connectMongoDBSession(session);
import bcrypt from 'bcrypt';
const SALT_WORK_FACTOR = 10;
import {body, validationResult} from 'express-validator';

const app = express();

let db = "";
let currentUser = ""; //since MCO2 does not include session management this is how we keep track of the current user logged in, it stores the user ID as the variable (!WILL BE CHANGED IN MCO3!)

function main(err){
    if(err){
        console.log("Error has occured");
        console.error(err);
        process.exit();
    }

    console.log("Connected to MongoDB server");
    db = getDb();
}

connectToMongo(main);

app.use(express.json()); //It enables your Express server to automatically parse the JSON data sent in the request body and make it available in req.body as a JavaScript object
app.use(express.urlencoded({extended: true})); // automatically parse data sent in the URL-encoded format (such as form data submitted from HTML forms) and make it available in req.body as a JavaScript object.

/*------------------------------------------------------------------------------------------------------------------------------------------*/

const store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/MCO1',
    collection: 'sessions',
});

store.on('error', function(error) {
    console.log(error);
});

app.use(session({ //initially a non persistent session is created for a user when they first visit the website and stores it in db sessions, if a user checks remember me when logging in the session will become a persistent session lasting for 3 weeks
    secret: 'ABCDEFG',
    resave: false,
    saveUninitialized: true,
    store: store,
}));

/*------------------------------------------------------------------------------------------------------------------------------------------*/

app.use("/static", express.static("public"));

const hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: './views/layouts',

    helpers:{
        eq: function(a,b){
            return a==b;
        },
        eq2: function(a, b) {
            return a[b];
        },
        eq3: function(a){
            if(a == true)
                return a;
        }
    }
})

app.engine("handlebars", hbs.engine);

app.set("view engine", "handlebars");
app.set("views", "./views");

/*------------------------------------------------------------------------------------------------------------------------------------------*/

const pageLimit = 20;

app.get("/", async (req,res) => {
    console.log("Index page loaded");

    if(req.session.userID){
        console.log('Session found');
        res.redirect('/loggedIn');
    }

    pageIndex = 0;
    const posts = await db.collection('posts');

    const postsCollection = await posts.find({isDeleted: false}).limit(pageLimit).toArray(function(err, documents) {

        if(err){
            console.error(err);
        }
    });

    const testNext = await posts.find({isDeleted: false}).skip((pageIndex + 1) * pageLimit).limit(pageLimit).toArray(function (err, documents) {
        if (err) {
            console.error(err);
        }
    });

    if(testNext.length == 0)
        nextPage = false;
    else
        nextPage = true;

    if(pageIndex == 0)
        prevPage = false;
    else    
        prevPage = true;

    console.log(nextPage);
    console.log(prevPage);
    
    res.render("index", {
        script: "static/js/script.js",

        posts: postsCollection,
        nextPage: nextPage,
        prevPage: prevPage
    });
    

});

app.get("/loggedIn", async (req, res) => {
    console.log("Logged In Page loaded")

    pageIndex = 0;

    const posts = await db.collection('posts');

    const postsCollection = await posts.find({isDeleted: false}).limit(pageLimit).toArray(function(err, documents) {

        if(err){
            console.error(err);
        }
    });

    const users = await db.collection('users');
    const user = await users.findOne({id: parseInt(req.session.userID)});

    const testNext = await posts.find({isDeleted: false}).skip((pageIndex + 1) * pageLimit).limit(pageLimit).toArray(function (err, documents) {
        if (err) {
            console.error(err);
        }
    });

    if(testNext.length == 0)
        nextPage = false;
    else
        nextPage = true;

    if(pageIndex == 0)
        prevPage = false;
    else    
        prevPage = true;

    console.log(nextPage);
    console.log(prevPage);

    res.render("indexLogin", {
        title: "Login",
        script: "static/js/login.js",
        image: user.image,

        posts: postsCollection,
        nextPage: nextPage,
        prevPage: prevPage
    })
})

/*
    function to get the names and pictures of every person to be displayed in comments and places them in an array to be read at the same time as the comments are being read. Returns an array
*/
async function findProfile(comments){

    let userArr = [];
    for(let x = 0; x < comments.length; x++){
        const users = await db.collection('users');
        //console.log("LENGTH", comments.length);
        //console.log("COMMENTS" ,comments[x]);
        const user = await users.findOne({id: comments[x].userID});
        //console.log("USER",user);

        const name = user.name;
        const image = user.image;
        const parentUser = comments[x].parent;
        const id = user.id;

        const arr = [name, image, parentUser, id]

        userArr.push(arr);
    }
    return userArr;
}

async function findPosts(comments){
    let userArr = [];
    for(let x = 0; x < comments.length; x++){
        const posts = await db.collection('posts');
        const post = await posts.findOne({id: parseInt(comments[x].postID)});

        const users = await db.collection('users');
        const user = await users.findOne({id: post.userID});

        const name = user.name;

        userArr.push(name);
    }
    return userArr;
}

/*
    Issue with this get function is that it kinda runs 2 times the issue is that the call for the profilepic is being called using the same url ie localhost:3000/postPage/profilepic.jpg might have to implement the image in css rather
    than straight in the handlebar html
*/
app.get("/postPage/:postID", async (req, res) => {
    console.log("Request received:", req.method, req.url);
    console.log("Post Page loaded");
    const postID = req.params.postID;
    console.log("post id",postID);

    const posts = await db.collection('posts');
    const comments = await db.collection('comments');
    const postComments = await comments.find({postID: postID}).toArray(function(err, documents) {
        if(err){
            console.error(err);
        }
    }); //gets the comments for the current post being loaded

    //console.log("POST COMMENTS",postComments);

    try{
        const post = await posts.findOne({id: parseInt(postID)});
        //console.log(post);

        const userArr = await findProfile(postComments);
        //console.log("USER ARR",userArr);

        const users = await db.collection('users');
        const user = await users.findOne({id: parseInt(req.session.userID)});

        const poster = await users.findOne({id: post.userID});

        let like = false;
        let dislike = false;

        if(await posts.findOne({id: parseInt(postID), likedBy: parseInt(req.session.userID)}) ){
            like = true;
        }else
            like = false;

        console.log(like);

        if(await posts.findOne({id: parseInt(postID), dislikedBy: parseInt(req.session.userID)}) ){
            dislike = true;
        }else
            dislike = false;

        console.log(dislike);

        if(post && req.session.userID){

            res.render("post", {
            title: post.title,
            postBody: post.body,
            likeCount: post.likeCount,
            isEdited: post.isEdited,
            posterName: poster.name,
            posterID: poster.id,
            script: "/static/js/post.js",

            image: user.image, //WILL CHANGE THIS ONCE THE SEPARATE PAGES ISSUE HAS BEEN RESOLVED
            like: like,
            dislike: dislike,

            comments: postComments,
            userArr: userArr
        
            });

        }else if(post){
            res.render("post", {
            title: post.title,
            postBody: post.body,
            likeCount: post.likeCount,
            isEdited: post.isEdited,
            posterName: poster.name,
            posterID: poster.id,

            like: like,
            dislike: dislike,

            script: "/static/js/post.js",
            comments: postComments,
            userArr: userArr    
            });

        }else{
            res.sendStatus(404);
            console.log("Post not found");
        }
    }catch(err){
        console.log("Error retrieving post");
        console.error(err);
        res.sendStatus(500);
    }
})

app.get("/profile/:userID", async (req, res) => {
    console.log("Profile page loaded");
    console.log("Request received:", req.method, req.url);
    const profileID = req.params.userID;
    console.log("Profile ID", profileID);

    if(Number.isInteger(parseInt(profileID))){ //this 'if' statement is to ignore the image request of the url in the request initiator chain
        try{
            const users = await db.collection('users');
            const profileUser = await users.findOne({id: parseInt(profileID)});
            //console.log(profileUser);

            const currentUserDB = await users.findOne({id: parseInt(req.session.userIDr)}); //this is for the currentUser profile to be loaded in the profile page, example viewing johns profile and logged in as matt this is for matts profile on the profile icon

            if(profileUser){

                const posts = await db.collection('posts');
                const postsCollection = await posts.find({userID: profileUser.id}).toArray(function(err, documents) {
                    if(err){
                        console.error(err);
                    }
                });

                const comments = await db.collection('comments');
                const commentsCollection = await comments.find({userID: profileUser.id}).toArray(function(err, documents) {
                    if(err){
                        console.error(err);
                    }
                });

                const previewPosts = [];
                const previewComments = [];

                let x = 0;

                while(postsCollection[postsCollection.length -1 - x] != null && previewPosts.length < 3){
                    if(postsCollection[postsCollection.length-1  -x ].isDeleted == false){
                        previewPosts.push(postsCollection[postsCollection.length-1 - x]);
                        x++;
                    }else{
                        x++;
                    }
                }

                x = 0;

                while(commentsCollection[commentsCollection.length -1 - x] != null && previewComments.length < 3){
                    if(commentsCollection[commentsCollection.length-1  -x ].isDeleted == false){
                        previewComments.push(commentsCollection[commentsCollection.length-1 - x]);
                        x++;
                    }else{
                        x++;
                    }
                }

                const userArr = await findPosts(previewComments);
                console.log(userArr);

                

                if (req.session.userID == profileID) {
                    // Render 'profile' when viewing own profile
                    res.render("profile", {
                        script: "/static/js/profile.js",

                        name: profileUser.name,
                        email: profileUser.email,
                        password: profileUser.password,
                        image: profileUser.image,
                        bio: profileUser.bio,
                        birthday: profileUser.birthday,
                        ID: profileUser.id,

                        posts: previewPosts,
                        comments: previewComments,
                        userArr: userArr
                    })
                }else if(currentUserDB != null){
                    // Render 'profile-other' when viewing another user's profile
                    res.render("profile-other", {
                        script: "/static/js/profile-other.js",

                        name: profileUser.name,
                        image: profileUser.image,
                        bio: profileUser.bio,
                        birthday: profileUser.birthday,
                        ID: profileUser.id,

                        profileImage: currentUserDB.image,

                        posts: previewPosts,
                        comments: previewComments,
                        userArr: userArr

                    })
                }else{ //render this when not logged in and  view other profile
                    res.render("profile-other", {
                        script: "/static/js/profile-other.js",

                        name: profileUser.name,
                        image: profileUser.image,
                        bio: profileUser.bio,
                        birthday: profileUser.birthday,
                        ID: profileUser.id,

                        posts: previewPosts,
                        comments: previewComments,
                        userArr: userArr

                    })
                }

            }else{
                res.sendStatus("Profile not found");
                res.sendStatus(404);
            }
        }catch(err){
            console.log("Error retrieving data");
            console.error(err);
            res.sendStatus(500);
        }
    }
});

app.get("/profilePosts/:userID", async (req, res) => {
    console.log("Profile Posts loaded");
    console.log("Request received:", req.method, req.url);
    const profileID = req.params.userID;
    console.log("Profile ID", profileID);

    if(Number.isInteger(parseInt(profileID))){
        try{
            const users = await db.collection('users');
            const profileUser = await users.findOne({id: parseInt(profileID)});

            const currentUserDB = await users.findOne({id: parseInt(req.session.userID)}); //this is for the currentUser profile to be loaded in the profile page, example viewing johns profile and logged in as matt this is for matts profile on the profile icon

            if(profileUser){

                const posts = await db.collection('posts');
                const postsCollection = await posts.find({userID: profileUser.id}).toArray(function(err, documents) {
                    if(err){
                        console.error(err);
                    }
                });

                if (req.session.userID == profileID) {
                    res.render("allPosts", {
                        script: "/static/js/allPosts.js",

                        name: profileUser.name,
                        profileImage: profileUser.image,
                        posts: postsCollection
                    })
                }else if(currentUserDB != null){
                    res.render("allPosts-other", {
                        script: "/static/js/allPosts-other.js",

                        name: profileUser.name,
                        profileImage: profileUser.image,

                        image: currentUserDB.image,

                        posts: postsCollection

                    })
                }else{
                    res.render("allPosts-other", {
                        script: "/static/js/allPosts-other.js",

                        name: profileUser.name,
                        profileImage: profileUser.image,
                        posts: postsCollection

                    })
                }

            }else{
                res.sendStatus("Profile not found");
                res.sendStatus(404);
            }

        }catch(err){
            console.log("Error retrieving data");
            console.error(err);
            res.sendStatus(500);
        }
    }
})

app.get("/profileComments/:userID", async (req, res) => {
    console.log("Profile Comments loaded");
    console.log("Request received:", req.method, req.url);
    const profileID = req.params.userID;
    console.log("Profile ID", profileID);

    if(Number.isInteger(parseInt(profileID))){
        try{
            const users = await db.collection('users');
            const profileUser = await users.findOne({id: parseInt(profileID)});

            const currentUserDB = await users.findOne({id: parseInt(req.session.userID)}); //this is for the currentUser profile to be loaded in the profile page, example viewing johns profile and logged in as matt this is for matts profile on the profile icon

            if(profileUser){

                const comments = await db.collection('comments');
                const commentsCollection = await comments.find({userID: profileUser.id}).toArray(function(err, documents) {
                    if(err){
                        console.error(err);
                    }
                });

                const userArr = await findPosts(commentsCollection);

                if (req.session.userID == profileID) {
                    res.render("allComments", {
                        script: "/static/js/allComments.js",

                        name: profileUser.name,
                        profileImage: profileUser.image,
                        comments: commentsCollection,
                        userArr: userArr
                    })
                }else if(currentUserDB != null){
                    res.render("allComments-other", {
                        script: "/static/js/allComments-other.js",

                        name: profileUser.name,
                        profileImage: profileUser.image,

                        image: currentUserDB.image,

                        comments: commentsCollection,
                        userArr: userArr

                    })
                }else{
                    res.render("allComments-other", {
                        script: "/static/js/allComments-other.js",

                        name: profileUser.name,
                        profileImage: profileUser.image,
                        comments: commentsCollection,
                        userArr: userArr

                    })
                }

            }else{
                res.sendStatus("Profile not found");
                res.sendStatus(404);
            }

        }catch(err){
            console.log("Error retrieving data");
            console.error(err);
            res.sendStatus(500);
        }
    }
})


/*------------------------------------------------------------------------------------------------------------------------------------------*/

class userData{
    constructor(){
        this.id = 0;
        this.name = "";
        this.email = "";
        this.password = "";
        this.image = "/static/images/noProfile.jpg";
        this.bio = "";      
        this.birthday = "";
    }
}

app.post("/register", body('name').notEmpty().isAlphanumeric(), body('email').notEmpty().isEmail(), body('password').notEmpty(), body('email').normalizeEmail(), async (req, res) => {

    const errors = validationResult(req);
    console.log(errors)
    if(!errors.isEmpty()){
        return res.sendStatus(400);
    }

    console.log("Register Request received");
    console.log(req.body);
    const {name, email, password} = req.body;

    if(name && email && password){
        const newUser = new userData();
        newUser.name = name;
        newUser.email = email;

        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);

        const hash = await bcrypt.hash(password, salt);

        newUser.password = hash;

        const users = await db.collection("users");

        try{
            const countRetrieve = await users.countDocuments({}); //adds an id number based on the maximum number of users in database + 1
            //console.log(countRetrieve);
            newUser.id = countRetrieve + 1;

            let insertUser = await users.insertOne(newUser);
            //console.log(insertUser);
            res.sendStatus(200); // successful 

        }catch(err){
            console.log("Error has occurred");
            console.error(err);
        }

    }else{
        res.sendStatus(400); //client error
    }
})

/*------------------------------------------------------------------------------------------------------------------------------------------*/

app.post("/login", body('email').notEmpty().normalizeEmail(), body('password').notEmpty(), body('email').normalizeEmail(), async (req, res) => {

    const errors = validationResult(req);
    console.log(errors)
    if(!errors.isEmpty()){
        return res.sendStatus(403);
    }

    console.log("Login Request received");
    console.log(req.body);
    const {email, password, rememberStatus} = req.body;

    const users = await db.collection("users");

    if(email && password){
        let loginResult = await users.findOne({email: email});
        if(loginResult && bcrypt.compare(password, loginResult.password)){
            console.log("Login was successful");
            //console.log(loginResult);

            if(rememberStatus == true){ //if the user selects to be remembered extends the age of the session to last x amount of seconds
                req.session.cookie.maxAge = 21 * 24 * 60 * 60 * 1000; //21 days in milliseconds
            }

            req.session.userID = loginResult.id;
            pageIndex = 0;

            res.redirect('/loggedIn');
        }else{
            console.log("Incorrect email or password");
            res.sendStatus(403);
        }
    }else{
        res.sendStatus(400);
    }
})

/*------------------------------------------------------------------------------------------------------------------------------------------*/

class post_data{
    constructor(){
        this.id = 0;
        this.likeCount = 0;
        this.commentCount = 0;
        this.title = "";
        this.body = "";
        this.userID = 0;
        this.isDeleted = false;
        this.isEdited = false;

        this.likedBy = [];
        this.dislikedBy = [];
    }
}


app.post("/post", body('title').notEmpty(), body(body).notEmpty(), async (req, res) => {

    const errors = validationResult(req);
    console.log(errors)
    if(!errors.isEmpty()){
        return res.sendStatus(400);
    }

    console.log("Post Request Received");
    console.log(req.body);
    const{title, body} = req.body;

    if(title && body){
        const post = new post_data();
        post.title = title;
        post.body = body;
        post.userID = req.session.userID; 
        const posts = await db.collection("posts");

        try{
            const postCountRetrieve = await posts.countDocuments({}); //adds an id number based on the maximum number of posts in database + 1
            //console.log(postCountRetrieve);
            post.id = postCountRetrieve + 1;

            const createPost = await posts.insertOne(post);
            //console.log(createPost);
            res.status(200).send(post.id.toString()); //sends the status message 200 and sends the post.id pertaining to the newly created post so that in redirection it can be appended to the url
            
        }catch(err){
            console.log("Error has occurred");
            console.error(err);
        }
    }else{
        res.sendStatus(400); //client error
    }
})

app.post("/like", async (req, res) => {
    console.log("Like request received");
    const {value} = req.body;
    const posts = await db.collection('posts');
    try{
        const post = await posts.findOne({id: parseInt(value)});
        if(post.likedBy.includes(req.session.userID)){
            // User has already liked this post, so we remove their like
            await posts.updateOne({id: parseInt(value)},
                {$inc: {likeCount: -1}, $pull: {likedBy: req.session.userID}});
        } else {
            // User hasn't liked this post yet, so we add their like
            // We also need to check if they've previously disliked this post
            const updateQuery = post.dislikedBy.includes(req.session.userID)
                ? {$inc: {likeCount: 2}, $push: {likedBy: req.session.userID}, $pull: {dislikedBy: req.session.userID}}
                : {$inc: {likeCount: 1}, $push: {likedBy: req.session.userID}};
            await posts.updateOne({id: parseInt(value)}, updateQuery);
        }
        res.sendStatus(200);
    } catch(err){
        console.log("Error liking post");
        console.error(err);
        res.sendStatus(500);
    }
});

app.post("/dislike", async (req, res) => {
    console.log("Dislike request received");
    const {value} = req.body;
    const posts = await db.collection('posts');
    try{
        const post = await posts.findOne({id: parseInt(value)});
        if(post.dislikedBy.includes(req.session.userID)){
            // User has already disliked this post, so we remove their dislike
            await posts.updateOne({id: parseInt(value)},
                {$inc: {likeCount: 1}, $pull: {dislikedBy: req.session.userID}});
        } else {
            // User hasn't disliked this post yet, so we add their dislike
            // We also need to check if they've previously liked this post
            const updateQuery = post.likedBy.includes(req.session.userID)
                ? {$inc: {likeCount: -2}, $push: {dislikedBy: req.session.userID}, $pull: {likedBy: req.session.userID}}
                : {$inc: {likeCount: -1}, $push: {dislikedBy: req.session.userID}};
            await posts.updateOne({id: parseInt(value)}, updateQuery);
        }
        res.sendStatus(200);
    } catch(err){
        console.log("Error disliking post");
        console.error(err);
        res.sendStatus(500);
    }
});

class commentData{
    constructor(){
        this.commentBody = "";
        this.postID = ""; //the post ID that the comment belongs to
        this.userID = ""; //the user ID that made the comment
        this.commentID = ""; //unique comment id per post
        this.parent = ""; //the parent of the comment if the comment is a reply the commentID of the main comment will be placed here
        this.isDeleted = false;
        this.isEdited = false;

        this.likedBy = [];
        this.dislikedBy = [];
    }
}

app.post("/comment", body('body').notEmpty(), body('postID').notEmpty, async (req, res) => {

    const errors = validationResult(req);
    console.log(errors)
    if(!errors.isEmpty()){
        return res.sendStatus(400);
    }

    console.log("Comment Request Received");
    console.log(req.body);
    const{body, postID, parent} = req.body;

    if(body && postID){
        const comment = new commentData();
        comment.commentBody= body;
        comment.postID = postID; //can be changed to int to keep consistency however comments do not display when converted to int
        comment.parent = parent;
        comment.userID = req.session.userID; //THIS WILL NEED TO BE CHANGED IN MCO3 AS IT USES SESSION MANAGEMENT

        const comments = await db.collection("comments");
        const posts = await db.collection("posts")

        try{
            const commentCountRetrieve = await comments.countDocuments({postID: comment.postID});
            //console.log(commentCountRetrieve + 1);
            comment.commentID = commentCountRetrieve + 1;

            const createComment = await comments.insertOne(comment);
            //console.log(createComment);

            const edit = await posts.updateOne({id: parseInt(postID)},
            {$inc: {
                commentCount: 1
                }
            }
        );

        //console.log(edit); 

            res.sendStatus(200);
        }catch(err){
            console.log("Error has occurred");
            console.error(err);
        }
    }else{
        res.sendStatus(400);
    }

})

app.post("/editPost", body('title').notEmpty(), body('body').notEmpty(), body('sendPostID').notEmpty(), async (req,res) => {

    const errors = validationResult(req);
    console.log(errors)
    if(!errors.isEmpty()){
        return res.sendStatus(400);
    }

    console.log("Edit post request received");
    console.log(req.body);
    const {title, body, sendPostID} = req.body;

    if(title && body){
        const posts = await db.collection('posts');

        try{
            const edit = await posts.updateOne({id: sendPostID},
                {$set: {
                    title: title,
                    body: body,
                    isEdited: true
                    }
                }
            );

            //console.log(edit);
            res.status(200).send(sendPostID.toString());
        }catch(err){
            console.log("Error editing post");
            console.error(err);
        }
    }else{
        res.sendStatus(400)
    }
})

app.post("/editComment", body('postID').notEmpty(), body('commentID').notEmpty(), body('commentBody').notEmpty(), async (req,res) => {

    const errors = validationResult(req);
    console.log(errors)
    if(!errors.isEmpty()){
        return res.sendStatus(400);
    }

    console.log("Edit comment request received");
    console.log(req.body);
    const {postID, commentID, commentBody} = req.body;
    
    if(commentBody){
        const comments = await db.collection('comments');

        try{
            const edit = await comments.updateOne({postID: postID, commentID: parseInt(commentID)},
                {$set: {
                    commentBody: commentBody,
                    isEdited: true
                    }                
                }     
            );
            //console.log(edit);
            res.status(200).send(postID.toString());
        }catch(err){
            console.log("Error editing comment");
            console.error(err);
        }
    }else{
        res.sendStatus(400);
    }
})

app.get('/getCurrentUser', (req,res) =>{
    if(req.session.userID){
        console.log(req.session.userID);
        res.status(200).send(req.session.userID.toString());
    }else{
        res.sendStatus(400);
        console.log("Failed to get current user");
    }
})

app.post("/editProfile", body('newUsername').notEmpty(), body('newBio').notEmpty(), body('newBday').notEmpty(), body('currentUser').notEmpty(), async (req,res) => {

    const errors = validationResult(req);
    console.log(errors)
    if(!errors.isEmpty()){
        return res.sendStatus(400);
    }

    console.log("Edit profile request received");
    console.log(req.body);
    const {newUsername, newBio, newBday, currentUser} = req.body;
    
    if(newUsername){
        const users = await db.collection('users');
        //console.log(await users.findOne({id: parseInt(currentUser)}));

        try{
            const edit = await users.updateOne({id: parseInt(currentUser)},
                {$set: {
                    name: newUsername,
                    bio: newBio,
                    birthday: newBday
                    }                
                }     
            );
            //console.log(edit);
            res.sendStatus(200)
        }catch(err){
            console.log("Error editing profile");
            console.error(err);
        }
    }else{
        res.sendStatus(400);
    }
})

const storage = multer.memoryStorage();
const upload = multer({ storage });

import mime from 'mime-types';

// Function to check if a file is an image
const isImage = (file) => {
    const mimeType = mime.lookup(file);
    return mimeType && mimeType.startsWith('image/');
  };
  
  app.post("/editPicture", upload.single('image'), async (req, res) => {
    const users = await db.collection('users');
    const user = await users.findOne({ id: parseInt(req.session.userID) });
  
    try {
      if (req.file && isImage(req.file.originalname)) { // Check if the file exists and is an image
        const bucket = new GridFSBucket(db);
        const image = req.file;
  
        console.log(image);
  
        const uploadStream = bucket.openUploadStream(image.originalname);
        uploadStream.write(image.buffer);
        uploadStream.end();
  
        uploadStream.on('finish', async (file) => {
          console.log("ObjectId:", file._id);
  
          const edit = await users.updateOne({ id: parseInt(req.session.userID) },
            {
              $set: {
                image: "http://localhost:3000/image/" + file._id
              }
            }
          );
          //console.log(edit);
  
        });
  
        res.sendStatus(200);
        console.log("Image successfully added to db");
      } else {
        res.status(400).json({ error: 'Please upload a valid image file.' });
      }
    } catch (err) {
      console.log("Error uploading image");
      console.error(err);
      res.sendStatus(500);
    }
  });


app.get('/image/:id', async (req, res) => {
    console.log("Image request received");
    try {
      const bucket = new GridFSBucket(db);
  
      const fileId = new ObjectId(req.params.id);
  
      const downloadStream = bucket.openDownloadStream(fileId);
  
      downloadStream.on('data', (chunk) => {
        res.write(chunk); // Stream the image data directly to the response
      });
  
      downloadStream.on('end', () => {
        res.end(); // Complete the response
      });
  
      downloadStream.on('error', (err) => {
        console.error('Error retrieving image:', err);
        res.sendStatus(500);
      });
  
      // Set the Content-Type header to specify the image format
      res.set('Content-Type', 'image/jpeg');
    } catch (err) {
      console.error('Error retrieving image:', err);
      res.sendStatus(500);
    }
  });

app.post('/deletePost', body('index').notEmpty(), async(req, res) => {

    const errors = validationResult(req);
    console.log(errors)
    if(!errors.isEmpty()){
        return res.sendStatus(400);
    }

    console.log("Delete post request received");

    const {index} = req.body;

    console.log(index);

    const posts = await db.collection('posts');
    try{
        const post = await posts.updateOne({id: parseInt(index)},
        {$set: {
            body: "--Deleted by User--",
            isDeleted: true
            }                
        });
        //console.log(post);
        res.sendStatus(200);
        console.log("Post Deleted");
    }catch(err){
        res.sendStatus(400);
        console.log("Post not deleted");
    }
})

app.post('/deleteComment', body('commentID').notEmpty(), body('postID').notEmpty(), async(req, res) => {

    const errors = validationResult(req);
    console.log(errors)
    if(!errors.isEmpty()){
        return res.sendStatus(400);
    }

    console.log("Delete post request received");

    const {commentID, postID} = req.body;

    const comments = await db.collection('comments');
    try{
        const comment = await comments.updateOne({postID: postID, commentID: parseInt(commentID)},
        {$set: {
            commentBody: "--Deleted by User--",
            isDeleted: true
            }                
        });
        //console.log(comment);
        res.sendStatus(200);
        console.log("Comment Deleted");
    }catch(err){
        res.sendStatus(400);
        console.log("Comment not deleted");
    }
})

app.get("/logout", (req, res) => {
    console.log("logout request received");
    req.session.destroy((err) => {
        if(err){
            console.error(err);
        }else{
            console.log("session destroyed successfully");
        }
    })
    pageIndex = 0;

    res.sendStatus(200);
})

/*------------------------------------------------------------------------------------------------------------------------------------------*/


app.get("/search", async (req, res) => {
    console.log("Search page loaded");
    console.log("help", searchText);
    const regex = new RegExp(searchText, 'i');
    const posts = await db.collection('posts');
    const searchCollection = await posts.find({title: { $regex: regex }}).toArray(function(err, documents){
        if(err){
            console.error(err);
        }
    });
    res.render("index", {
        script: "static/js/script.js",

        posts: searchCollection
    });

})

app.get("/searchl", async (req, res) => {
    console.log("Search page loaded");
    console.log("help", searchText);
    const regex = new RegExp(searchText, 'i');
    const posts = await db.collection('posts');
    const searchCollection = await posts.find({title: { $regex: regex }}).toArray(function(err, documents){
        if(err){
            console.error(err);
        }
    });
    const users = await db.collection('users');
    const user = await users.findOne({id: parseInt(req.session.userID)});

    res.render("indexLogin", {
        title: "Login",
        script: "static/js/login.js",
        image: user.image,

        posts: searchCollection
    })
})

let searchText = "";

app.post("/searchquery", async (req, res) => {
    console.log("Search Request Recieved");
    console.log("help", req.body.searchText);
    try{
        searchText = req.body.searchText;
    }
    catch(err){
        console.log("err")
        console.error(err);
    }
    res.sendStatus(200);
})
  

/*------------------------------------------------------------------------------------------------------------------------------------------*/

let nextPage = true;
let prevPage = true;

app.get("/page", async (req, res) => {
    console.log("Pages Loaded");
    const posts = await db.collection('posts');
    const pageCollection = await posts.find({isDeleted: false}).skip(pageIndex * pageLimit).limit(pageLimit).toArray(function (err, documents) {
        if (err) {
            console.error(err);
        }
    });

    const testNext = await posts.find({isDeleted: false}).skip((pageIndex + 1) * pageLimit).limit(pageLimit).toArray(function (err, documents) {
        if (err) {
            console.error(err);
        }
    });

    if(testNext.length == 0)
        nextPage = false;
    else
        nextPage = true;

    if(pageIndex == 0)
        prevPage = false;
    else    
        prevPage = true;

    console.log(nextPage);
    console.log(prevPage);
    
    res.render("index", {
        script: "static/js/script.js",
        posts: pageCollection,
        nextPage: nextPage,
        prevPage: prevPage
    });
})

app.get("/pagel", async (req, res) => {
    console.log("Pages Loaded");
    const posts = await db.collection('posts');
    const pageCollection = await posts.find({isDeleted: false}).skip(pageIndex * pageLimit).limit(pageLimit).toArray(function (err, documents) {
        if (err) {
            console.error(err);
        }
    });
    
    const users = await db.collection('users');
    const user = await users.findOne({id: parseInt(req.session.userID)});

    const testNext = await posts.find({isDeleted: false}).skip((pageIndex + 1) * pageLimit).limit(pageLimit).toArray(function (err, documents) {
        if (err) {
            console.error(err);
        }
    });

    if(testNext.length == 0)
        nextPage = false;
    else
        nextPage = true;

    if(pageIndex == 0)
        prevPage = false;
    else    
        prevPage = true;

    console.log(nextPage);
    console.log(prevPage);

    res.render("indexLogin", {
        title: "Login",
        script: "static/js/login.js",
        image: user.image,

        posts: pageCollection,
        nextPage: nextPage,
        prevPage: prevPage
    })
})

let pageIndex = 0;

app.post("/changePage", async (req, res) => {
    console.log("Page Request Recieved");
    console.log(req.body.nextPage);
    const posts = await db.collection('posts');
    const postCount = await posts.count(function (err, documents) {
        if(err){
            console.error(err);
        }
    });
    console.log(postCount);
    pageIndex = pageIndex + req.body.nextPage;
    if(pageIndex < 0){
        pageIndex = 0;
    }
    if(pageIndex > Math.round(postCount / pageLimit)){
        pageIndex = pageIndex - 1;
    }
    res.sendStatus(200);
})

app.listen(process.env.SERVER_PORT, () => {
    console.log("Server is now listening...");
})