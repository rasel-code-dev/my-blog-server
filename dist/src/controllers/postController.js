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
const visitorDB_1 = __importDefault(require("../database/visitorDB"));
const slugify_1 = __importDefault(require("../utilities/slugify"));
const errorConsole_1 = __importDefault(require("../logger/errorConsole"));
const db_1 = __importDefault(require("../database/db"));
const shortid = require("shortid");
const getPosts = (req, res, next) => {
    const { author_id } = req.query;
    let posts = [];
    if (author_id) {
        posts = db_1.default.get('posts').filter({ author_id: author_id }).value();
    }
    else {
        posts = db_1.default.get('posts').value();
    }
    let users = db_1.default.get('users').value();
    let posts_with_user = [];
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
    // setTimeout(()=>{
    (0, response_1.default)(res, 200, { posts: posts_with_user });
    // }, 4000)
};
exports.getPosts = getPosts;
const getPost = (req, res, next) => {
    let { slug, post_id } = req.params;
    let hits = 0;
    let fPost;
    if (post_id) {
        fPost = db_1.default.get("posts").find({ id: post_id }).value();
    }
    else {
        fPost = db_1.default.get("posts").find({ slug: slug }).value();
    }
    let postHit = visitorDB_1.default.get("postHits").find({ post_id: fPost.id }).value();
    if (postHit) {
        hits = postHit.hits;
    }
    let comments = db_1.default.get("comments").filter({ post_id: fPost.id }).value();
    let _a = db_1.default.get("users").find({ id: fPost.author_id }).value(), { password, role } = _a, other = __rest(_a, ["password", "role"]);
    if (fPost) {
        (0, response_1.default)(res, 200, {
            post: Object.assign(Object.assign({}, fPost), { hits, author: other, comments: comments })
        });
    }
    else {
        (0, response_1.default)(res, 404, "post not found");
    }
};
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
                let r = yield (0, promises_1.writeFile)(path_1.default.resolve(`src/markdown/${slug}.md`), mdContent);
                console.log("markdown file created...", `markdown/${slug}.md`);
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
const getPostContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { post_id } = req.params;
    let fPost = db_1.default.get("posts").find({ id: post_id }).value();
    try {
        if (fPost) {
            let p = (0, MDPath_1.MDFilepath)(fPost.path);
            let content = yield (0, promises_1.readFile)(p, "utf-8");
            if (content) {
                let post = visitorDB_1.default.get("postHits").find({ post_id: fPost.id }).value();
                if (post) {
                    if (post.hits) {
                        post.hits = Number(post.hits) + 1;
                    }
                    else {
                        post.hits = 1;
                    }
                    let newVi = visitorDB_1.default.get("postHits").assign(post).write();
                }
                else {
                    let newVi = visitorDB_1.default.get("postHits").push({
                        post_id: fPost.id,
                        hits: 1
                    }).write();
                }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvY29udHJvbGxlcnMvcG9zdENvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyREFBbUM7QUFDbkMsMENBQXFEO0FBQ3JELGdEQUF3QjtBQUN4QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDaEMseUVBQWlEO0FBQ2pELGdEQUE0RDtBQUM1RCxzRUFBOEM7QUFFOUMsbUVBQTJDO0FBQzNDLDBFQUFrRDtBQUNsRCx3REFBZ0M7QUFFaEMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBSTNCLE1BQU0sUUFBUSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUV6QyxNQUFPLEVBQUUsU0FBUyxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQTtJQUVoQyxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUE7SUFDZCxJQUFHLFNBQVMsRUFBQztRQUNYLEtBQUssR0FBSSxZQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBO0tBQ2hFO1NBQU07UUFDTCxLQUFLLEdBQUcsWUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUNoQztJQUVELElBQUksS0FBSyxHQUFHLFlBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDbkMsSUFBSSxlQUFlLEdBQUcsRUFBRSxDQUFBO0lBR3hCLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQSxF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