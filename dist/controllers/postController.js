"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleToggleLike = exports.deletePost = exports.getRawMarkdownContent = exports.getPostContent = exports.getFileContent = exports.updatePost = exports.addPost = exports.getPost = exports.getTopHitsPosts = exports.getPosts = exports.getP = void 0;
const response_1 = __importDefault(require("../response"));
const marked = require("marked");
const errorConsole_1 = __importDefault(require("../logger/errorConsole"));
const database_1 = require("../database");
const dropbox_1 = require("../dropbox");
const slugify_1 = __importDefault(require("slugify"));
const Post_1 = __importDefault(require("../models/Post"));
const mongodb_1 = require("mongodb");
const Hits_1 = __importDefault(require("../models/Hits"));
const shortid = require("shortid");
const getP = (req, res) => {
    try {
        res.send("test");
    }
    catch (ex) {
        res.send("test err");
    }
    finally {
    }
};
exports.getP = getP;
const getPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { author_id } = req.query;
    try {
        let p = yield Post_1.default.aggregate([
            { $match: author_id ? { author_id: new mongodb_1.ObjectId(author_id) } : {} },
            { $lookup: {
                    from: "users",
                    localField: "author_id",
                    foreignField: "_id",
                    as: "author"
                } },
            { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } }
        ]);
        res.send(p);
    }
    catch (ex) {
        console.log(ex);
    }
    // let client;
    // try {
    //
    //   client = await redisConnect()
    //
    //   let posts = []
    //   if (author_id) {
    //     // posts = db.get('posts').filter({author_id: author_id}).value()
    //     let allPosts = await getHashData('posts', client)
    //     if(allPosts) {
    //       posts = allPosts.filter(p => p.author_id === author_id)
    //     }
    //   } else {
    //     posts = await getHashData('posts', client)
    //   }
    //
    //   let users = await getHashData("users", client)
    //
    //   let posts_with_user = []
    //   // usersSync(users, client)
    //
    //
    //   posts && posts.length > 0 && posts.forEach(post => {
    //     let user = users.find(u => u.id === post.author_id)
    //     if (user) {
    //       posts_with_user.push({
    //         ...post,
    //         author: {
    //           username: user.first_name + " " + user.last_name,
    //           avatar: user.avatar
    //         }
    //       })
    //     } else {
    //       posts_with_user.push({
    //         ...post,
    //         author: {}
    //       })
    //     }
    //   })
    //
    //   response(res, 200, {posts: posts_with_user})
    //
    // } catch (ex){
    //   errorConsole(ex)
    //   response(res, 500, "Server Error. Please Try Again")
    // } finally {
    //   client?.quit()
    // }
});
exports.getPosts = getPosts;
const getTopHitsPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let p = yield Post_1.default.aggregate([
            // { $match: { author_id: new ObjectId(author_id)}},
            { $lookup: {
                    from: "users",
                    localField: "author_id",
                    foreignField: "_id",
                    as: "author"
                } },
            { $unwind: { path: "$author" } },
            { $project: {
                    tags: 0,
                    author: {
                        _id: 0,
                        password: 0,
                        created_at: 0,
                        updated_at: 0,
                        description: 0,
                        email: 0
                    }
                } },
            { $lookup: {
                    from: "hits",
                    localField: "_id",
                    foreignField: "post_id",
                    as: "hits"
                } },
            { $unwind: { path: "$hits", preserveNullAndEmptyArrays: true } },
            { $project: {
                    tags: 0,
                    hits: {
                        post_id: 0
                    }
                } },
            { $sort: {
                    'hits.hits': -1
                } },
            { $limit: 10 }
        ]);
        (0, response_1.default)(res, 200, { posts: p });
    }
    catch (ex) {
        (0, errorConsole_1.default)(ex);
        (0, response_1.default)(res, 500, ex.message);
    }
    // let client;
    // try {
    //
    //   client = await redisConnect()
    //
    //   let posts = []
    //   if (author_id) {
    //     // posts = db.get('posts').filter({author_id: author_id}).value()
    //     let allPosts = await getHashData('posts', client)
    //     if(allPosts) {
    //       posts = allPosts.filter(p => p.author_id === author_id)
    //     }
    //   } else {
    //     posts = await getHashData('posts', client)
    //   }
    //
    //   let users = await getHashData("users", client)
    //
    //   let posts_with_user = []
    //   // usersSync(users, client)
    //
    //
    //   posts && posts.length > 0 && posts.forEach(post => {
    //     let user = users.find(u => u.id === post.author_id)
    //     if (user) {
    //       posts_with_user.push({
    //         ...post,
    //         author: {
    //           username: user.first_name + " " + user.last_name,
    //           avatar: user.avatar
    //         }
    //       })
    //     } else {
    //       posts_with_user.push({
    //         ...post,
    //         author: {}
    //       })
    //     }
    //   })
    //
    //   response(res, 200, {posts: posts_with_user})
    //
    // } catch (ex){
    //   errorConsole(ex)
    //   response(res, 500, "Server Error. Please Try Again")
    // } finally {
    //   client?.quit()
    // }
});
exports.getTopHitsPosts = getTopHitsPosts;
const getPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { slug, post_id } = req.params;
    let client;
    try {
        // let { c: PostColl, client: cc } = await mongoConnect("posts")
        // client = cc
        // client = await redisConnect()
        let hits = 0;
        let posts = [];
        if (post_id) {
            posts = yield Post_1.default.aggregate([
                { $match: { _id: new mongodb_1.ObjectId(post_id) } },
                { $lookup: {
                        from: "users",
                        localField: "author_id",
                        foreignField: "_id",
                        as: "author"
                    } },
                { $unwind: { path: "$author" } },
            ]);
        }
        else {
            // fPost = db.get("posts").find({slug: slug}).value()
        }
        if (posts.length > 0) {
            (0, response_1.default)(res, 200, {
                post: Object.assign(Object.assign({}, posts[0]), { hits, comments: [] })
            });
            //   let postHit = await client.HGET("post_hits", fPost.id)
            //
            //   // sync(postHit, "post_hits", "post_id", client)
            //
            //   if(postHit){
            //     hits = postHit
            //   }
            //
            //   let comments = await getHashData("comments", client)
            //   let postComment = comments.filter(c=>c.post_id == fPost.id)
            //
            //   // sync(comments, "comments", "id", client)
            //
            //
            //   // let comments = db.get("comments").filter({post_id: fPost.id}).value()
            //   let users = await getHashData("users", client)
            //   let user = users.find(u=>u.id === fPost.author_id)
            //
            //   let { password, role, ...other } = user
            //
            //     response(res, 200, {
            //       post: {
            //         ...fPost,
            //         hits,
            //         author: other,
            //         comments: postComment
            //       }
            //     })
            //
        }
        else {
            (0, response_1.default)(res, 404, "post not found");
        }
    }
    catch (ex) {
        (0, response_1.default)(res, 500, ex.message);
    }
    finally {
        client === null || client === void 0 ? void 0 : client.close();
    }
});
exports.getPost = getPost;
const addPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user_id = req.user_id;
    let { title, cover = "", author_id, mdContent, tags, summary = "" } = req.body;
    if (!(title && author_id && mdContent)) {
        return (0, response_1.default)(res, 500, "incomplete post data");
    }
    if (user_id !== author_id) {
        return (0, response_1.default)(res, 500, { message: "you are unauthorized" });
    }
    // let id = shortid.generate();
    //
    // let slug = slugify(title, {
    //   replacement: "-",
    //   strict: true,
    //   lower: true,
    //   trim: true
    // })
    //
    // if(!slug){
    //   // slug = make_slug(title)
    //   // return response(res, 400, {message: "post title invalid" })
    //   slug = shortid.generate();
    // }
    //
    // if(mdContent){
    //   try {
    //
    //     let sd = cloudinaryHandler().uploader.upload_stream(
    //       {
    //         folder: "foo"
    //       },
    //       function(error, result) {
    //         console.log(error, result);
    //       })
    //
    //     console.log(sd)
    //
    //     const Readable = require('stream').Readable;
    //     let s = new Readable()
    //     s.push("some string")
    //     s.push(null) // end od pushing chunk
    //     s.on("data", (d)=>{
    //
    //     })
    //
    //     s.on("end", ()=>{
    //       // res.end()
    //     })
    if (mdContent) {
        let client;
        try {
            let slug = (0, slugify_1.default)(title, {
                replacement: "-",
                strict: true,
                lower: true,
                trim: true
            });
            if (!slug) {
                slug = shortid.generate();
            }
            let mdFilePath = `apps/markdown-static/${slug}.md`;
            let isUploaded = yield (0, dropbox_1.updateFile)(mdContent, mdFilePath);
            if (isUploaded) {
                let newPost = {
                    author_id: new mongodb_1.ObjectId(author_id),
                    slug,
                    title,
                    cover,
                    tags: tags,
                    summary,
                    path: mdFilePath,
                    updated_at: new Date(),
                    created_at: new Date()
                };
                let n = new Post_1.default(Object.assign({}, newPost));
                let isError = yield n.validationBeforeSave();
                if (isError) {
                    return (0, response_1.default)(res, 409, { message: "missing data" });
                }
                let r = yield n.save();
                (0, response_1.default)(res, 200, { post: r });
            }
            else {
                (0, response_1.default)(res, 409, "post create fail");
            }
            // let isAdded = await PostCol.insertOne({...newPost})
            // if(isAdded) {
            //   response(res, 200, {post: newPost})
            // } else {
            //   response(res, 409, "post create fail")
            // }
            // //
            // response(res, 409, "post create fail")
        }
        catch (ex) {
            (0, errorConsole_1.default)(ex);
            (0, response_1.default)(res, 409, "post create fail");
        }
        finally {
            client === null || client === void 0 ? void 0 : client.close();
        }
    }
    else {
        (0, response_1.default)(res, 400, { message: "post not create because markdown content are empty" });
    }
    // let { title, cover, author_id, mdContent, tags } = req.body
    // let id = shortid.generate();
    // let slug = slugify(title)
    //
    // if(mdContent){
    //   try {
    //     let r = await writeFile(path.resolve(`markdown/${slug}.md`), mdContent)
    //     console.log("markdown file created...", `markdown/${slug}.md`)
    //   } catch (ex){
    //     console.log("markdown file created fail...")
    //     console.log(ex)
    //   }
    // }
    //
    // let post = db.get("posts").find({slug: slug}).value()
    // if(!post) {
    //   let newPost = db.get('posts')
    //     .push({id, author_id, slug, title, cover, path: `markdown/${slug}.md`, tags, created_at: new Date()})
    //     .write()
    //
    //   response(res, 200, {post: newPost})
    // } else {
    //   response(res, 400, "post already created..")
    // }
});
exports.addPost = addPost;
const updatePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user_id = req.user_id;
    if (!user_id) {
        return (0, response_1.default)(res, 409, "Unauthorized");
    }
    let { _id, title, cover, summary, mdContent, tags } = req.body;
    let client;
    try {
        let post = yield Post_1.default.findOne({ _id: new mongodb_1.ObjectId(_id) }, {});
        if (post) {
            if (title) {
                post.title = title;
            }
            if (summary) {
                post.summary = summary;
            }
            if (tags) {
                post.tags = tags;
            }
            if (cover) {
                post.cover = cover;
            }
            if (!post.created_at) {
                post.created_at = new Date();
            }
            post.updated_at = new Date();
            try {
                if (mdContent) {
                    let isUpdatedMdFile = yield (0, dropbox_1.updateFile)(mdContent, post.path);
                    if (isUpdatedMdFile) {
                        let isUpdated = yield Post_1.default.update({ _id: new mongodb_1.ObjectId(post._id) }, { $set: post });
                        if (isUpdated) {
                            (0, response_1.default)(res, 200, { post: post });
                        }
                        else {
                            (0, response_1.default)(res, 500, "post update fail");
                        }
                    }
                    else {
                        (0, response_1.default)(res, 400, "markdown update fail");
                    }
                }
                else {
                    (0, response_1.default)(res, 400, "markdown content required");
                }
            }
            catch (ex) {
                (0, response_1.default)(res, 500, "post update fail");
            }
        }
        else {
            (0, response_1.default)(res, 404, "post Not found");
        }
    }
    catch (ex) {
        (0, errorConsole_1.default)(ex);
        (0, response_1.default)(res, 500, "Internal Error. Please Try Again");
    }
    finally {
        client === null || client === void 0 ? void 0 : client.close();
    }
});
exports.updatePost = updatePost;
/**...............Implementation.............*/
function increasePostVisitorCount(post_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let hit = yield Hits_1.default.findOne({ post_id: new mongodb_1.ObjectId(post_id) }, {});
        if (hit) {
            yield Hits_1.default.update({ _id: hit._id }, { $push: { hits: Date.now() } });
        }
        else {
            let newHit = new Hits_1.default({
                post_id: new mongodb_1.ObjectId(post_id), hits: [Date.now()]
            });
            const errors = yield newHit.validationBeforeSave();
            if (errors) {
                console.log(errors);
            }
            yield newHit.save();
        }
        // let postHit = await client.HGET("post_hits", post.id)
        // if(postHit){
        //
        //   if(Number(postHit)) {
        //     let increase =  Number(postHit) + 1
        //     let isAdded = await client.HSET("post_hits", post.id, increase.toString())
        //     if(isAdded){
        //       // console.log("increase post visit")
        //     }
        //   } else {
        //     let isAdded = await client.HSET("post_hits", post.id, "1")
        //     if(isAdded){
        //       // console.log("increase post visit")
        //     }
        //   }
        //
        // } else {
        //   // create new one
        //   let isAdded = await client.HSET("post_hits", post.id, "1")
        //   if(isAdded){
        //     // console.log("increase post visit")
        //
        //   }
        // }
        //
        // let postHit = await client.HGET("post_hits", post.id)
        // if(postHit){
        //
        //   if(Number(postHit)) {
        //     let increase =  Number(postHit) + 1
        //     let isAdded = await client.HSET("post_hits", post.id, increase.toString())
        //     if(isAdded){
        //       // console.log("increase post visit")
        //     }
        //   } else {
        //     let isAdded = await client.HSET("post_hits", post.id, "1")
        //     if(isAdded){
        //       // console.log("increase post visit")
        //     }
        //   }
        //
        // } else {
        //   // create new one
        //   let isAdded = await client.HSET("post_hits", post.id, "1")
        //   if(isAdded){
        //     // console.log("increase post visit")
        //   }
        // }
    });
}
const getFileContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let mdContent = yield (0, dropbox_1.downloadFile)(req.body.path);
        res.send(mdContent);
    }
    catch (ex) {
        res.send(ex);
    }
});
exports.getFileContent = getFileContent;
const getPostContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { filePath, post_id } = req.body;
    let client;
    try {
        let mdContent = yield (0, dropbox_1.downloadFile)(filePath);
        if (mdContent) {
            yield increasePostVisitorCount(post_id);
            marked.setOptions({
                highlight: function (code, lang) {
                    const hljs = require('highlight.js');
                    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                    return hljs.highlight(code, { language }).value;
                },
            });
            marked.parse(mdContent.toString(), (err, html) => {
                if (!err) {
                    res.write(html);
                    res.end();
                    // response(res, 200, {mdContent: html, message: "yyyyyyy"})
                }
                else {
                    (0, response_1.default)(res, 500, "markdown file parse fail");
                }
            });
        }
        else {
            (0, response_1.default)(res, 404, { mdContent: "", message: "Markdown content not found" });
        }
    }
    catch (ex) {
        (0, errorConsole_1.default)(ex);
        (0, response_1.default)(res, 500, ex.message);
    }
    finally {
        client === null || client === void 0 ? void 0 : client.quit();
    }
});
exports.getPostContent = getPostContent;
const getRawMarkdownContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let mdContent = yield (0, dropbox_1.downloadFile)(req.body.path);
        if (mdContent) {
            (0, response_1.default)(res, 200, { mdContent: mdContent });
        }
        else {
            (0, response_1.default)(res, 404, { mdContent: "" });
        }
    }
    catch (ex) {
        (0, errorConsole_1.default)(ex);
        (0, response_1.default)(res, 404, { mdContent: "" });
    }
});
exports.getRawMarkdownContent = getRawMarkdownContent;
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { _id, path } = req.body;
    let client;
    try {
        client = yield (0, database_1.redisConnect)();
        let doc = yield Post_1.default.removeOne({ _id: new mongodb_1.ObjectId(_id) });
        if (doc) {
            let mdFilePath = path.resolve("src/" + req.body.path);
            try {
                let file = yield (0, dropbox_1.deleteFile)(mdFilePath);
                if (file) {
                    console.log("markdown file deleted");
                }
                else {
                    console.log("markdown file not found");
                }
            }
            catch (ex) {
                console.log("markdown file not found");
            }
            (0, response_1.default)(res, 201, { id: _id });
        }
    }
    catch (ex) {
        (0, response_1.default)(res, 500, "Post Delete fail");
    }
    finally {
        client === null || client === void 0 ? void 0 : client.quit();
    }
});
exports.deletePost = deletePost;
const handleToggleLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { post_id, user_id } = req.body;
    let client;
    try {
        client = yield (0, database_1.redisConnect)();
        let postStr = yield client.HGET("posts", post_id);
        if (postStr) {
            let post = JSON.parse(postStr);
            if (post.likes) {
                let idx = post.likes && post.likes.indexOf(user_id);
                if (idx === -1) {
                    post.likes && post.likes.push(user_id);
                }
                else {
                    post.likes && post.likes.splice(idx, 1);
                }
            }
            else {
                post.likes = [user_id];
            }
            let doc = yield client.HSET("posts", post_id, JSON.stringify(post));
            if (doc === 0 || doc) {
                (0, response_1.default)(res, 201, { message: "Like Action Success", post: post });
            }
            else {
                (0, response_1.default)(res, 500, "Post Action fail");
            }
        }
    }
    catch (ex) {
        (0, response_1.default)(res, 500, "Post Delete fail");
    }
    finally {
        client === null || client === void 0 ? void 0 : client.quit();
    }
});
exports.handleToggleLike = handleToggleLike;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJjb250cm9sbGVycy9wb3N0Q29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyREFBbUM7QUFDbkMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ2hDLDBFQUFrRDtBQUNsRCwwQ0FBdUQ7QUFFdkQsd0NBQTBGO0FBQzFGLHNEQUE4QjtBQUM5QiwwREFBa0M7QUFDbEMscUNBQWlDO0FBQ2pDLDBEQUFrQztBQUVsQyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFHM0IsTUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLEVBQUU7SUFDOUIsSUFBRztRQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7S0FDakI7SUFBQyxPQUFPLEVBQUUsRUFBQztRQUNWLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7S0FDckI7WUFBUztLQUVUO0FBQ0gsQ0FBQyxDQUFBO0FBUlksUUFBQSxJQUFJLFFBUWhCO0FBR00sTUFBTSxRQUFRLEdBQUcsQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO0lBQy9DLE1BQU8sRUFBRSxTQUFTLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFBO0lBRWhDLElBQUk7UUFDRixJQUFJLENBQUMsR0FBRyxNQUFNLGNBQUksQ0FBQyxTQUFTLENBQUM7WUFDM0IsRUFBRSxNQUFNLEVBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLGtCQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ3BFLEVBQUUsT0FBTyxFQUFFO29CQUNQLElBQUksRUFBRSxPQUFPO29CQUNiLFVBQVUsRUFBRSxXQUFX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