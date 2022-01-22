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
exports.handleToggleLike = exports.getDeletePost = exports.getRawMarkdownContent = exports.getPostContent = exports.updatePost = exports.addPost = exports.getPost = exports.getPosts = void 0;
const response_1 = __importDefault(require("../response"));
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const marked = require("marked");
const fileUpload_1 = __importDefault(require("../utilities/fileUpload"));
const MDPath_1 = require("../utilities/MDPath");
const slugify_1 = __importDefault(require("../utilities/slugify"));
const errorConsole_1 = __importDefault(require("../logger/errorConsole"));
const db_1 = __importDefault(require("../database/db"));
const database_1 = require("../database");
const redisUtils_1 = require("../utilities/redisUtils");
const shortid = require("shortid");
const getPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { author_id } = req.query;
    let client;
    try {
        client = yield (0, database_1.redisConnect)();
        let posts = [];
        if (author_id) {
            // posts = db.get('posts').filter({author_id: author_id}).value()
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
        (0, response_1.default)(res, 500, ex.message);
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
                        message: "post not create because slug create fali",
                        slug: slug
                    });
                }
                let r = yield (0, promises_1.writeFile)(path_1.default.resolve(`src/markdown/${slug}.md`), mdContent);
                console.log("markdown file created...", `markdown/${slug}.md`);
                let client;
                try {
                    client = yield (0, database_1.redisConnect)();
                    let post = db_1.default.get("posts").find({ slug: slug }).value();
                    if (!post) {
                        let newPost = db_1.default.get('posts')
                            .push({ id, author_id, slug, title, cover, path: `markdown/${slug}.md`, tags: JSON.parse(tags), created_at: new Date() })
                            .write();
                        (0, response_1.default)(res, 200, { post: newPost });
                    }
                    else {
                        (0, response_1.default)(res, 400, "post already created..");
                    }
                }
                catch (ex) {
                }
                finally {
                    client === null || client === void 0 ? void 0 : client.quit();
                }
            }
            catch (ex) {
                console.log(ex.message);
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
    let fPost = db_1.default.get("posts").find({ id: id }).value();
    if (fPost) {
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
                let r = yield (0, promises_1.writeFile)((0, MDPath_1.MDFilepath)(fPost.path), mdContent);
            }
            catch (ex) {
            }
        }
        let updatedPost = db_1.default.get('posts')
            .find({ id })
            .assign(Object.assign({}, fPost))
            .write();
        (0, response_1.default)(res, 200, { post: updatedPost });
    }
    else {
        (0, response_1.default)(res, 404, "post Not found");
    }
});
exports.updatePost = updatePost;
/** Implement Later... */
function increasePostVisitorCount() {
    // let post = visitorDB.get("postHits").find({post_id: fPost.id}).value()
    // if(post){
    //
    //   // if(post.hits){
    //   //   post.hits = Number(post.hits) + 1
    //   // } else {
    //   //   post.hits = 1
    //   // }
    //   // let newVi = visitorDB.get("postHits").assign(post).write()
    //
    // } else {
    //
    //   // let newVi = visitorDB.get("postHits").push({
    //   //   post_id: fPost.id,
    //   //   hits: 1
    //   // }).write()
    //
    // }
}
const getPostContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { post_id } = req.params;
    let client;
    try {
        client = yield (0, database_1.redisConnect)();
        let fPost = yield client.HGET("posts", post_id);
        if (fPost) {
            let post = JSON.parse(fPost);
            let p = (0, MDPath_1.MDFilepath)(post.path);
            let content = yield (0, promises_1.readFile)(p, "utf-8");
            if (content) {
                increasePostVisitorCount();
                marked.setOptions({
                    highlight: function (code, lang) {
                        const hljs = require('highlight.js');
                        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                        return hljs.highlight(code, { language }).value;
                    },
                });
                marked.parse(content, (err, html) => {
                    if (!err) {
                        (0, response_1.default)(res, 200, { mdContent: html });
                    }
                    else {
                        (0, response_1.default)(res, 200, { mdContent: "" });
                    }
                });
            }
            else {
                (0, response_1.default)(res, 200, { mdContent: "" });
            }
        }
    }
    catch (ex) {
        console.log(ex.message);
        (0, response_1.default)(res, 200, { mdContent: "" });
    }
    finally {
        client === null || client === void 0 ? void 0 : client.quit();
    }
});
exports.getPostContent = getPostContent;
const getRawMarkdownContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { post_id } = req.params;
    let fPost = db_1.default.get("posts").find({ id: post_id }).value();
    try {
        let content = yield (0, promises_1.readFile)((0, MDPath_1.MDFilepath)(fPost.path), "utf-8");
        if (content) {
            (0, response_1.default)(res, 200, { mdContent: content });
        }
        else {
            (0, response_1.default)(res, 200, { mdContent: "" });
        }
    }
    catch (ex) {
        (0, response_1.default)(res, 200, { mdContent: "" });
    }
});
exports.getRawMarkdownContent = getRawMarkdownContent;
const getDeletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { post_id } = req.params;
    let fPost = db_1.default.get("posts").find({ id: post_id }).value();
    let deletedPost = db_1.default.get("posts").remove({ id: post_id }).write();
    if (deletedPost) {
        if (fPost) {
            try {
                let deleted = yield (0, promises_1.rm)((0, MDPath_1.MDFilepath)(fPost.path), { force: true });
                console.log("markdown file deleted");
            }
            catch (ex) {
                console.log("markdown file not found");
            }
        }
    }
    (0, response_1.default)(res, 200, { id: post_id });
});
exports.getDeletePost = getDeletePost;
const handleToggleLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { post_id, user_id } = req.body;
    let post = db_1.default.get("posts").find({ id: post_id }).value();
    if (post) {
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
        let doc = db_1.default.get("posts").find({ id: post_id }).assign(Object.assign({}, post)).write();
        (0, response_1.default)(res, 201, { message: "Like Action Success", post: doc });
    }
});
exports.handleToggleLike = handleToggleLike;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJjb250cm9sbGVycy9wb3N0Q29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJEQUFtQztBQUNuQywwQ0FBcUQ7QUFDckQsZ0RBQXdCO0FBQ3hCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNoQyx5RUFBaUQ7QUFDakQsZ0RBQTREO0FBRzVELG1FQUEyQztBQUMzQywwRUFBa0Q7QUFDbEQsd0RBQWdDO0FBRWhDLDBDQUF5QztBQUN6Qyx3REFBbUU7QUFFbkUsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBSTNCLE1BQU0sUUFBUSxHQUFHLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUUvQyxNQUFPLEVBQUUsU0FBUyxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQTtJQUVoQyxJQUFJLE1BQU0sQ0FBQztJQUNYLElBQUk7UUFFRixNQUFNLEdBQUcsTUFBTSxJQUFBLHVCQUFZLEdBQUUsQ0FBQTtRQUU3QixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUE7UUFDZCxJQUFJLFNBQVMsRUFBRTtZQUNiLGlFQUFpRTtTQUNsRTthQUFNO1lBQ0wsS0FBSyxHQUFHLE1BQU0sSUFBQSx3QkFBVyxFQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQTtTQUMzQztRQUVELElBQUksS0FBSyxHQUFHLE1BQU0sSUFBQSx3QkFBVyxFQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQTtRQUU5QyxJQUFJLGVBQWUsR0FBRyxFQUFFLENBQUE7UUFDeEIsMkJBQTJCO1FBRzNCLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2hELElB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