import {Router} from 'express';
import controller from '../controllers/controller.js';
import {body, validationResult} from 'express-validator';
import multer from 'multer';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/getCurrentUser', controller.getCurrentUser);
router.get('/image/:id', controller.image);
router.get('/', controller.loadIndex);
router.get('/loggedIn', controller.loggedIn);
/*
    Issue with this get function is that it kinda runs 2 times the issue is that the call for the profilepic is being called using the same url ie localhost:3000/postPage/profilepic.jpg might have to implement the image in css rather
    than straight in the handlebar html
*/
router.get('/postPage/:postID', controller.postPage);
router.get("/profile/:userID", controller.profile);
router.get("/profilePosts/:userID", controller.profilePosts);
router.get("/profileComments/:userID", controller.profileComments);
router.get("/search", controller.search);
router.get("/searchl", controller.search1);
router.get("/page", controller.page);
router.get("/pagel", controller.page1);
router.get("/logout", controller.logout);
router.get("/about", controller.about);


router.post("/register", body('name').notEmpty().isAlphanumeric(), body('email').notEmpty().isEmail(), body('password').notEmpty(), body('email').normalizeEmail(), controller.register)
router.post('/login', body('email').notEmpty().normalizeEmail(), body('password').notEmpty(), body('email').normalizeEmail(), controller.login);
router.post("/post", body('title').notEmpty(), body('body').notEmpty(), controller.post);
router.post("/like", controller.like);
router.post("/dislike", controller.dislike);
router.post("/comment", body('body').notEmpty(), body('postID').notEmpty(), controller.comment);
router.post("/editPost", body('title').notEmpty(), body('body').notEmpty(), body('sendPostID').notEmpty(), controller.editPost);
router.post("/editComment", body('postID').notEmpty(), body('commentID').notEmpty(), body('commentBody').notEmpty(), controller.editComment);
router.post("/editProfile", body('newUsername').notEmpty(), body('currentUser').notEmpty(), controller.editProfile);
router.post("/editPicture", upload.single('image'), controller.editPicture);
router.post('/deletePost', body('index').notEmpty(), controller.deletePost);
router.post('/deleteComment', body('commentID').notEmpty(), body('postID').notEmpty(), controller.deleteComment);
router.post("/searchquery", controller.searchQuery);
router.post("/changePage", controller.changePage);

export default router;