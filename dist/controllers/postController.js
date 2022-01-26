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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleToggleLike = exports.getDeletePost = exports.getRawMarkdownContent = exports.getPostContent = exports.updatePost = exports.addPost = exports.getPost = exports.getPosts = exports.getP = void 0;
const response_1 = __importDefault(require("../response"));
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const marked = require("marked");
const fileUpload_1 = __importDefault(require("../utilities/fileUpload"));
const slugify_1 = __importDefault(require("../utilities/slugify"));
const errorConsole_1 = __importDefault(require("../logger/errorConsole"));
const database_1 = require("../database");
const redisUtils_1 = require("../utilities/redisUtils");
const promises_2 = require("fs/promises");
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
    // const  { author_id } = req.query
    // let client;
    // try{
    //   client = await redisConnect()
    //   res.json([{name: "rasel"}])
    // } catch (ex){
    //   res.setHeader("Content-Type", "application/json")
    //   res.json([{name: "rasel err"}])
    // } finally {
    //   await client?.quit()
    // }
    const { author_id } = req.query;
    let client;
    try {
        client = yield (0, database_1.redisConnect)();
        let posts = [];
        if (author_id) {
            // posts = db.get('posts').filter({author_id: author_id}).value()
            let allPosts = yield (0, redisUtils_1.getHashData)('posts', client);
            if (allPosts) {
                posts = allPosts.filter(p => p.author_id === author_id);
            }
        }
        else {
            posts = yield (0, redisUtils_1.getHashData)('posts', client);
        }
        let users = yield (0, redisUtils_1.getHashData)("users", client);
        let posts_with_user = [];
        // usersSync(users, client)
        posts && posts.length > 0 && posts.forEach(post => {
            let user = users.find(u => u.id === post.author_id);
            if (user) {
                posts_with_user.push(Object.assign(Object.assign({}, post), { author: {
                        username: user.first_name + " " + user.last_name,
                        avatar: user.avatar
                    } }));
            }
            else {
                posts_with_user.push(Object.assign(Object.assign({}, post), { author: {} }));
            }
        });
        (0, response_1.default)(res, 200, { posts: posts_with_user });
    }
    catch (ex) {
        (0, errorConsole_1.default)(ex);
        (0, response_1.default)(res, 500, "Server Error. Please Try Again");
    }
    finally {
        client === null || client === void 0 ? void 0 : client.quit();
    }
});
exports.getPosts = getPosts;
const getPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { slug, post_id } = req.params;
    let client;
    try {
        client = yield (0, database_1.redisConnect)();
        let hits = 0;
        let fPost;
        if (post_id) {
            let postStr = yield client.HGET("posts", post_id);
            if (postStr) {
                fPost = JSON.parse(postStr);
            }
        }
        else {
            // fPost = db.get("posts").find({slug: slug}).value()
        }
        if (fPost) {
            let postHit = yield client.HGET("post_hits", fPost.id);
            // sync(postHit, "post_hits", "post_id", client)
            if (postHit) {
                hits = postHit;
            }
            let comments = yield (0, redisUtils_1.getHashData)("comments", client);
            let postComment = comments.filter(c => c.post_id == fPost.id);
            // sync(comments, "comments", "id", client)
            // let comments = db.get("comments").filter({post_id: fPost.id}).value()
            let users = yield (0, redisUtils_1.getHashData)("users", client);
            let user = users.find(u => u.id === fPost.author_id);
            let { password, role } = user, other = __rest(user, ["password", "role"]);
            (0, response_1.default)(res, 200, {
                post: Object.assign(Object.assign({}, fPost), { hits, author: other, comments: postComment })
            });
        }
        else {
            (0, response_1.default)(res, 404, "post not found");
        }
    }
    catch (ex) {
        (0, response_1.default)(res, 500, ex.message);
    }
    finally {
        client === null || client === void 0 ? void 0 : client.quit();
    }
});
exports.getPost = getPost;
const addPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user_id = req.user_id;
    (0, fileUpload_1.default)(req, "src/markdown/cover", "upload-cover", (err, obj) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
        }
        const { fields, files } = obj;
        let { title, cover, author_id, mdContent, tags } = fields;
        if (user_id !== author_id) {
            return (0, response_1.default)(res, 500, { message: "you are unauthorized" });
        }
        if (files && files['upload-cover'] && files["upload-cover"][0].path) {
            cover = files["upload-cover"][0].path;
            if (cover.startsWith("src/")) {
                cover = cover.replace("src/", "").trim();
            }
        }
        let id = shortid.generate();
        // let slug = slugify(title, {
        //   replacement: "-",
        //   strict: true,
        //   lower: true,
        //   trim: true
        // })
        let slug = (0, slugify_1.default)(title);
        if (!slug) {
            // slug = make_slug(title)
            return (0, response_1.default)(res, 400, { message: "post title invalid" });
        }
        if (mdContent) {
            try {
                let result = "";
                function deleteLastIndex(str) {
                    if (str) {
                        let isLastIndex = str[str.length - 1] !== "-";
                        if (isLastIndex) {
                            result = str;
                        }
                        else {
                            let deletedLast = str.slice(0, str.length - 1);
                            deleteLastIndex(deletedLast);
                        }
                    }
                }
                deleteLastIndex(slug);
                slug = result;
                if (!slug) {
                    return (0, response_1.default)(res, 400, {
                        message: "post not create because slug create fail",
                        slug: slug
                    });
                }
                let r = yield (0, promises_1.writeFile)(path_1.default.resolve(`src/markdown/${slug}.md`), mdContent);
                console.log("markdown file created...", `markdown/${slug}.md`);
                let client;
                try {
                    client = yield (0, database_1.redisConnect)();
                    let newPost = {
                        id,
                        author_id,
                        slug,
                        title,
                        cover,
                        path: `markdown/${slug}.md`,
                        tags: JSON.parse(tags),
                        created_at: new Date()
                    };
                    let isAdded = yield client.HSET("posts", newPost.id.toString(), JSON.stringify(newPost));
                    if (isAdded) {
                        (0, response_1.default)(res, 200, { post: newPost });
                    }
                    else {
                        (0, response_1.default)(res, 409, "post create fail");
                    }
                }
                catch (ex) {
                    (0, response_1.default)(res, 409, "post create fail");
                }
                finally {
                    client === null || client === void 0 ? void 0 : client.quit();
                }
            }
            catch (ex) {
                console.log("markdown file created fail...");
                (0, errorConsole_1.default)(ex);
                (0, response_1.default)(res, 400, { message: "post not create because markdown file creation fail" });
            }
        }
        else {
            (0, response_1.default)(res, 400, { message: "post not create because markdown content are empty" });
        }
    }));
    // let { title, cover, author_id, mdContent, tags } = req.body
    // let id = shortid.generate();
    // let slug = slugify(title, {
    //   replacement: "-",
    //   strict: true,
    //   lower: true,
    //   trim: true
    // })
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
    let { id, title, cover, mdContent, tags } = req.body;
    let client;
    try {
        client = yield (0, database_1.redisConnect)();
        let postStr = yield client.HGET("posts", id);
        if (postStr) {
            let fPost = JSON.parse(postStr);
            if (title) {
                fPost.title = title;
            }
            if (tags) {
                fPost.tags = tags;
            }
            if (cover) {
                fPost.cover = cover;
            }
            if (!fPost.created_at) {
                fPost.created_at = new Date();
            }
            if (mdContent) {
                try {
                    let r = yield (0, promises_1.writeFile)(path_1.default.join(__dirname, "..", fPost.path), mdContent);
                    console.log(r);
                }
                catch (ex) {
                    console.log(ex);
                }
            }
            try {
                let isUpdated = yield client.HSET("posts", fPost.id.toString(), JSON.stringify(fPost));
                console.log(isUpdated);
                if ((isUpdated || isUpdated === 0)) {
                    (0, response_1.default)(res, 200, { post: fPost });
                }
                else {
                    (0, response_1.default)(res, 500, "post update fail");
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
        client === null || client === void 0 ? void 0 : client.quit();
    }
});
exports.updatePost = updatePost;
/**...............Implementation.............*/
function increasePostVisitorCount(client, post) {
    return __awaiter(this, void 0, void 0, function* () {
        let postHit = yield client.HGET("post_hits", post.id);
        if (postHit) {
            if (Number(postHit)) {
                let increase = Number(postHit) + 1;
                let isAdded = yield client.HSET("post_hits", post.id, increase.toString());
                if (isAdded) {
                    // console.log("increase post visit")
                }
            }
            else {
                let isAdded = yield client.HSET("post_hits", post.id, "1");
                if (isAdded) {
                    // console.log("increase post visit")
                }
            }
        }
        else {
            // create new one
            let isAdded = yield client.HSET("post_hits", post.id, "1");
            if (isAdded) {
                // console.log("increase post visit")
            }
        }
    });
}
const getPostContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { post_id } = req.params;
    let p = path_1.default.resolve("public");
    // let client;
    //
    //
    try {
        let f = yield (0, promises_2.readdir)(p);
        (0, response_1.default)(res, 500, { mdContent: "", message: "ex.message", f: f });
        //     client = await redisConnect()
        //     let fPost = await client.HGET("posts", post_id)
        //     if(fPost) {
        //       let post = JSON.parse(fPost)
        //
        //
        //       let p = path.resolve("src/" + post.path)
        //       let content = await readFile( p, "utf-8")
        //
        //     if (content) {
        //
        //       await increasePostVisitorCount(client, post)
        //
        //       marked.setOptions({
        //         highlight: function(code, lang) {
        //           const hljs = require('highlight.js');
        //           const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        //           return hljs.highlight(code, { language }).value;
        //         },
        //       })
        //
        //       marked.parse(content, (err, html) => {
        //         if(!err) {
        //           response(res, 200, {mdContent: html, message: "yyyyyyy"})
        //         } else{
        //           response(res, 500, {mdContent: "", message: "markdown file parse fail"})
        //         }
        //       });
        //
        //     } else {
        //       response(res, 404, {mdContent: "", message: "Markdown content not found"})
        //     }
        //
        //   }
    }
    catch (ex) {
        console.log(ex.message);
        let f = yield (0, promises_2.readdir)(p);
        (0, response_1.default)(res, 500, { mdContent: "", message: ex.message, f: f });
    }
    finally {
        // client?.quit()
    }
});
exports.getPostContent = getPostContent;
const getRawMarkdownContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { post_id } = req.params;
    let client;
    try {
        client = yield (0, database_1.redisConnect)();
        let fPostStr = yield client.HGET("posts", post_id);
        if (fPostStr) {
            let fPost = JSON.parse(fPostStr);
            try {
                let content = yield (0, promises_1.readFile)(path_1.default.resolve("src/" + fPost.path), "utf-8");
                if (content) {
                    (0, response_1.default)(res, 200, { mdContent: content });
                }
                else {
                    (0, response_1.default)(res, 404, { mdContent: "" });
                }
            }
            catch (ex) {
                (0, errorConsole_1.default)(ex);
                (0, response_1.default)(res, 404, { mdContent: "" });
            }
        }
        else {
            (0, response_1.default)(res, 404, { mdContent: "" });
        }
    }
    catch (ex) {
        (0, errorConsole_1.default)(ex);
        (0, response_1.default)(res, 404, { mdContent: "" });
    }
    finally {
        client === null || client === void 0 ? void 0 : client.quit();
    }
});
exports.getRawMarkdownContent = getRawMarkdownContent;
const getDeletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { post_id } = req.params;
    let client;
    try {
        client = yield (0, database_1.redisConnect)();
        let postStr = yield client.HGET("posts", post_id);
        if (postStr) {
            let post = JSON.parse(postStr);
            let isDeleted = yield client.HDEL("posts", post_id);
            if (isDeleted) {
                if (post.path) {
                    let mdFilePath = path_1.default.resolve("src/" + post.path);
                    try {
                        yield (0, promises_1.rm)(mdFilePath);
                        console.log("markdown file deleted");
                    }
                    catch (ex) {
                        console.log(mdFilePath);
                        console.log("markdown file not found");
                    }
                }
                (0, response_1.default)(res, 201, { id: post_id });
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
exports.getDeletePost = getDeletePost;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJjb250cm9sbGVycy9wb3N0Q29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJEQUFtQztBQUNuQywwQ0FBcUQ7QUFDckQsZ0RBQXdCO0FBQ3hCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNoQyx5RUFBaUQ7QUFFakQsbUVBQTJDO0FBQzNDLDBFQUFrRDtBQUNsRCwwQ0FBeUM7QUFDekMsd0RBQW1FO0FBQ25FLDBDQUFvQztBQUVwQyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFHM0IsTUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFDLEVBQUU7SUFDOUIsSUFBRztRQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7S0FDakI7SUFBQyxPQUFPLEVBQUUsRUFBQztRQUNWLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7S0FDckI7WUFBUztLQUVUO0FBQ0gsQ0FBQyxDQUFBO0FBUlksUUFBQSxJQUFJLFFBUWhCO0FBR00sTUFBTSxRQUFRLEdBQUcsQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO0lBQy9DLG1DQUFtQztJQUNuQyxjQUFjO0lBQ2QsT0FBTztJQUNQLGtDQUFrQztJQUNsQyxnQ0FBZ0M7SUFDaEMsZ0JBQWdCO0lBQ2hCLHNEQUFzRDtJQUN0RCxvQ0FBb0M7SUFDcEMsY0FBYztJQUNkLHlCQUF5QjtJQUN6QixJQUFJO0lBRUosTUFBTyxFQUFFLFNBQVMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUE7SUFFaEMsSUFBSSxNQUFNLENBQUM7SUFDWCxJQUFJO1FBRUYsTUFBTSxHQUFHLE1BQU0sSUFBQSx1QkFBWSxHQUFFLENBQUE7UUFF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