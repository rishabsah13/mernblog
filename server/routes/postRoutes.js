const express = require("express")
const { requireSingIn } = require("../controllers/userController")
const { createPostController, getAllPostController, getAllPostsController, getUserPostController, deletePostController, updatePostController } = require("../controllers/postController")


const router = express.Router()

//create

router.post("/create-post",requireSingIn,createPostController)
router.get("/get-all-posts",getAllPostsController)
router.get("/get-user-posts",requireSingIn,getUserPostController)
router.delete("/delete-post/:id",requireSingIn,deletePostController)
router.put("/update-post/:id",requireSingIn,updatePostController)
module.exports = router