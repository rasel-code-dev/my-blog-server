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
    if (fPost) {
        let postHit = visitorDB_1.default.get("postHits").find({ post_id: fPost.id }).value();
        if (postHit) {
            hits = postHit.hits;
        }
        let comments = db_1.default.get("comments").filter({ post_id: fPost.id }).value();
        let _a = db_1.default.get("users").find({ id: fPost.author_id }).value(), { password, role } = _a, other = __rest(_a, ["password", "role"]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvY29udHJvbGxlcnMvcG9zdENvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyREFBbUM7QUFDbkMsMENBQXFEO0FBQ3JELGdEQUF3QjtBQUN4QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDaEMseUVBQWlEO0FBQ2pELGdEQUE0RDtBQUM1RCxzRUFBOEM7QUFFOUMsbUVBQTJDO0FBQzNDLDBFQUFrRDtBQUNsRCx3REFBZ0M7QUFHaEMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBSTNCLE1BQU0sUUFBUSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUV6QyxNQUFPLEVBQUUsU0FBUyxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQTtJQUVoQyxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUE7SUFDZCxJQUFHLFNBQVMsRUFBQztRQUNYLEtBQUssR0FBSSxZQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBO0tBQ2hFO1NBQU07UUFDTCxLQUFLLEdBQUcsWUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUNoQztJQUVELElBQUksS0FBSyxHQUFHLFlBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDbkMsSUFBSSxlQUFlLEdBQUcsRUFBRSxDQUFBO0lBR3hCLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQSxF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