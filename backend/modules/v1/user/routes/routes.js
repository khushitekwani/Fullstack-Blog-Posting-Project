var user=require("../controllers/user");
// var upload=require("../../../../middleware/multerConfig")
var customRoute=(app)=>{
    app.post("/v1/user/signup",user.signup);
    app.post("/v1/user/login",user.login);

    app.post("/v1/user/all-post",user.allPost);
    app.post("/v1/user/create-post",user.createPost);
    app.post("/v1/user/update-post",user.updatePost);
    app.post("/v1/user/delete-post",user.deletePost);
    app.post("/v1/user/update-post",user.updatePost);
    app.post("/v1/user/post-details",user.postDetails);
}
module.exports=customRoute;