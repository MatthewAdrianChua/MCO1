import 'dotenv/config';
import { connectToMongo, getDb } from './db/conn.js';
import express from 'express';
import exphbs from 'express-handlebars';
import multer from 'multer';
import { GridFSBucket, ObjectId } from 'mongodb';

let db = "";

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

/*------------------------------------------------------------------------------------------------------------------------------------------*/

const app = express();

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
        }
    }
})

app.engine("handlebars", hbs.engine);

app.set("view engine", "handlebars");
app.set("views", "./views");

app.get("/", async (req,res) => {
    console.log("Index page loaded");

    const posts = await db.collection('posts');
    const postsCollection = await posts.find({}).toArray(function(err, documents) {
        if(err){
            console.error(err);
        }
    });
    
    res.render("index", {
        script: "static/js/script.js",

        posts: postsCollection
    });
    

});

app.get("/loggedIn", async (req, res) => {
    console.log("Logged In Page loaded")

    const posts = await db.collection('posts');
    const postsCollection = await posts.find({}).toArray(function(err, documents) {
        if(err){
            console.error(err);
        }
    });

    const users = await db.collection('users');
    const user = await users.findOne({id: parseInt(currentUser)});

    res.render("indexLogin", {
        title: "Login",
        script: "static/js/login.js",
        image: user.image,

        posts: postsCollection
    })
})

/*
    function to get the names and pictures of every person to be displayed in comments and places them in an array to be read at the same time as the comments are being read. Returns an array
*/
async function findProfile(comments){

    let userArr = [];
    for(let x = 0; x < comments.length; x++){
        const users = await db.collection('users');
        console.log("LENGTH", comments.length);
        console.log("COMMENTS" ,comments[x]);
        const user = await users.findOne({id: comments[x].userID});
        console.log("USER",user);

        const name = user.name;
        const image = user.image;
        const parentUser = comments[x].parent;
        const id = user.id;

        const arr = [name, image, parentUser, id]

        userArr.push(arr);
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

    console.log("POST COMMENTS",postComments);

    try{
        const post = await posts.findOne({id: parseInt(postID)});
        console.log(post);

        const userArr = await findProfile(postComments);
        console.log("USER ARR",userArr);

        const users = await db.collection('users');
        const user = await users.findOne({id: parseInt(currentUser)});

        if(post){
            res.render("post", {
            title: post.title,
            postBody: post.body,
            image: /*user.image*/ "", //WILL CHANGE THIS ONCE THE SEPARATE PAGES ISSUE HAS BEEN RESOLVED
            likeCount: post.likeCount,
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
    const userID = req.params.userID;
    console.log("user ID", userID);

    if(Number.isInteger(parseInt(userID))){ //this 'if' statement is to ignore the image request of the url in the request initiator chain
        try{
            const users = await db.collection('users');
            const currentUser = await users.findOne({id: parseInt(userID)});
            console.log(currentUser);

            if(currentUser){

                const posts = await db.collection('posts');
                const postsCollection = await posts.find({userID: currentUser.id}).toArray(function(err, documents) {
                    if(err){
                        console.error(err);
                    }
                });

                const comments = await db.collection('comments');
                const commentsCollection = await comments.find({userID: currentUser.id}).toArray(function(err, documents) {
                    if(err){
                        console.error(err);
                    }
                });

                res.render("profile", {
                    script: "/static/js/profile.js",

                    name: currentUser.name,
                    email:currentUser.email,
                    password: currentUser.password,
                    image: currentUser.image,
                    bio: currentUser.bio,
                    birthday: currentUser.birthday,

                    posts: postsCollection,
                    comments: commentsCollection,
                })
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
        this.image = "http://localhost:3000/image/64b4887c56db8478142667c4";
        this.bio = "";      
        this.birthday = "";
    }
}

app.use(express.json()); //It enables your Express server to automatically parse the JSON data sent in the request body and make it available in req.body as a JavaScript object
app.use(express.urlencoded({extended: true})); // automatically parse data sent in the URL-encoded format (such as form data submitted from HTML forms) and make it available in req.body as a JavaScript object.

app.post("/register", async (req, res) => {
    console.log("Register Request received");
    console.log(req.body);
    const {name, email, password} = req.body;

    if(name && email && password){
        const newUser = new userData();
        newUser.name = name;
        newUser.email = email;
        newUser.password = password;

        const users = await db.collection("users");

        try{
            const countRetrieve = await users.countDocuments({}); //adds an id number based on the maximum number of users in database + 1
            console.log(countRetrieve);
            newUser.id = countRetrieve + 1;

            let insertUser = await users.insertOne(newUser);
            console.log(insertUser);
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

let currentUser = ""; //since MCO2 does not include session management this is how we keep track of the current user logged in, it stores the user ID as the variable (!WILL BE CHANGED IN MCO3!)

app.post("/login", async (req, res) => {
    console.log("Login Request received");
    console.log(req.body);
    const {email, password} = req.body;

    const users = await db.collection("users");

    if(email && password){
        let loginResult = await users.findOne({email: email, password: password});
        if(loginResult){
            console.log("Login was successful");
            console.log(loginResult);

            currentUser = loginResult.id;
            console.log("Current User ",currentUser);

            res.sendStatus(200);
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
    }
}


app.post("/post", async (req, res) => {
    console.log("Post Request Received");
    console.log(req.body);
    const{title, body} = req.body;

    if(title && body){
        const post = new post_data();
        post.title = title;
        post.body = body;
        post.userID = currentUser; //THIS WILL NEED TO BE CHANGED IN MCO3 AS IT USES SESSION MANAGEMENT
        const posts = await db.collection("posts");

        try{
            const postCountRetrieve = await posts.countDocuments({}); //adds an id number based on the maximum number of posts in database + 1
            console.log(postCountRetrieve);
            post.id = postCountRetrieve + 1;

            const createPost = await posts.insertOne(post);
            console.log(createPost);
            res.status(200).send(post.id.toString()); //sends the status message 200 and sends the post.id pertaining to the newly created post so that in redirection it can be appended to the url
            
        }catch(err){
            console.log("Error has occurred");
            console.error(err);
        }
    }else{
        res.sendStatus(400); //client error
    }
})

app.post("/like", async (req, res) =>{
    console.log("Like request received");
    console.log(req.body);

    const {value} = req.body;

    const posts = await db.collection('posts');

    try{
        const edit = await posts.updateOne({id: parseInt(value)},
            {$inc: {
                likeCount: 1
                }
            }
        );

        console.log(edit);
        res.sendStatus(200);
    }catch(err){
        console.log("Error liking post");
        console.error(err);
    }

})

app.post("/dislike", async (req, res) =>{
    console.log("Like request received");
    console.log(req.body);

    const {value} = req.body;

    const posts = await db.collection('posts');

    try{
        const edit = await posts.updateOne({id: parseInt(value)},
            {$inc: {
                likeCount: -1
                }
            }
        );

        console.log(edit);
        res.sendStatus(200);
    }catch(err){
        console.log("Error liking post");
        console.error(err);
    }

})

class commentData{
    constructor(){
        this.commentBody = "";
        this.postID = ""; //the post ID that the comment belongs to
        this.userID = ""; //the user ID that made the comment
        this.commentID = ""; //unique comment id per post
        this.parent = ""; //the parent of the comment if the comment is a reply the commentID of the main comment will be placed here
        this.isDeleted = false;
    }
}

app.post("/comment", async (req, res) => {
    console.log("Comment Request Received");
    console.log(req.body);
    const{body, postID, parent} = req.body;

    if(body && postID){
        const comment = new commentData();
        comment.commentBody= body;
        comment.postID = postID; //can be changed to int to keep consistency however comments do not display when converted to int
        comment.parent = parent;
        comment.userID = currentUser; //THIS WILL NEED TO BE CHANGED IN MCO3 AS IT USES SESSION MANAGEMENT

        const comments = await db.collection("comments");
        const posts = await db.collection("posts")

        try{
            const commentCountRetrieve = await comments.countDocuments({postID: comment.postID});
            console.log(commentCountRetrieve + 1);
            comment.commentID = commentCountRetrieve + 1;

            const createComment = await comments.insertOne(comment);
            console.log(createComment);

            const edit = await posts.updateOne({id: parseInt(postID)},
            {$inc: {
                commentCount: 1
                }
            }
        );

        console.log(edit); 

            res.sendStatus(200);
        }catch(err){
            console.log("Error has occurred");
            console.error(err);
        }
    }else{
        res.sendStatus(400);
    }

})

app.post("/editPost", async (req,res) => {
    console.log("Edit post request received");
    console.log(req.body);
    const {title, body, sendPostID} = req.body;

    if(title && body){
        const posts = await db.collection('posts');

        try{
            const edit = await posts.updateOne({id: sendPostID},
                {$set: {
                    title: title,
                    body: body
                    }
                }
            );

            console.log(edit);
            res.status(200).send(sendPostID.toString());
        }catch(err){
            console.log("Error editing post");
            console.error(err);
        }
    }else{
        res.sendStatus(400)
    }
})

app.post("/editComment", async (req,res) => {
    console.log("Edit comment request received");
    console.log(req.body);
    const {postID, commentID, commentBody} = req.body;
    
    if(commentBody){
        const comments = await db.collection('comments');

        try{
            const edit = await comments.updateOne({postID: postID, commentID: parseInt(commentID)},
                {$set: {
                    commentBody: commentBody
                    }                
                }     
            );
            console.log(edit);
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
    if(currentUser){
        console.log(currentUser);
        res.status(200).send(currentUser.toString());
    }else{
        res.sendStatus(400);
        console.log("Failed to get current user");
    }
})

app.post("/editProfile", async (req,res) => {
    console.log("Edit profile request received");
    console.log(req.body);
    const {newUsername, newBio, newBday, currentUser} = req.body;
    
    if(newUsername){
        const users = await db.collection('users');
        console.log(await users.findOne({id: parseInt(currentUser)}));

        try{
            const edit = await users.updateOne({id: parseInt(currentUser)},
                {$set: {
                    name: newUsername,
                    bio: newBio,
                    birthday: newBday
                    }                
                }     
            );
            console.log(edit);
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

app.post("/editPicture",upload.single('image'), async (req, res) =>{

    const users = await db.collection('users');
    const user = await users.findOne({id: parseInt(currentUser)});
    console.log("EDIT PICTURE USER", user);

    try{
        const bucket = new GridFSBucket(db);

        const image = req.file;

        console.log(image);

        const uploadStream = bucket.openUploadStream(image.originalname);
        uploadStream.write(image.buffer);
        uploadStream.end();

        uploadStream.on('finish', async (file) => {  
            console.log("ObjectId:", file._id); 

            const edit = await users.updateOne({id: parseInt(currentUser)},
                {$set: {
                    image: "http://localhost:3000/image/"+file._id
                    }                
                }     
            );
            console.log(edit);
                  
        });

        res.sendStatus(200);
        console.log("Image successfully added to db")
    }catch(err){
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
  
  

app.listen(process.env.SERVER_PORT, () => {
    console.log("Server is now listening...");
})