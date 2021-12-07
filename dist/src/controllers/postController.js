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
const slugify_1 = __importDefault(require("slugify"));
const fileUpload_1 = __importDefault(require("../utilities/fileUpload"));
const MDPath_1 = require("../utilities/MDPath");
const visitorDB_1 = __importDefault(require("../database/visitorDB"));
const shortid = require("shortid");
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = low(new FileSync("./src/database/db.json"));
const getPosts = (req, res, next) => {
    const { author_id } = req.query;
    let posts = [];
    if (author_id) {
        posts = db.get('posts').filter({ author_id: author_id }).value();
    }
    else {
        posts = db.get('posts').value();
    }
    let users = db.get('users').value();
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
    (0, response_1.default)(res, 200, { posts: posts_with_user });
};
exports.getPosts = getPosts;
const getPost = (req, res, next) => {
    let { slug, post_id } = req.params;
    let hits = 0;
    let fPost;
    if (post_id) {
        fPost = db.get("posts").find({ id: post_id }).value();
    }
    else {
        fPost = db.get("posts").find({ slug: slug }).value();
    }
    let postHit = visitorDB_1.default.get("postHits").find({ post_id: fPost.id }).value();
    if (postHit) {
        hits = postHit.hits;
    }
    let _a = db.get("users").find({ id: fPost.author_id }).value(), { password, role } = _a, other = __rest(_a, ["password", "role"]);
    if (fPost) {
        (0, response_1.default)(res, 200, { post: Object.assign(Object.assign({}, fPost), { hits, author: other }) });
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
        if (files && files['upload-cover'] && files["upload-cover"][0].path) {
            cover = files["upload-cover"][0].path;
            if (cover.startsWith("src/")) {
                cover = cover.replace("src/", "").trim();
            }
        }
        let id = shortid.generate();
        let slug = (0, slugify_1.default)(title, {
            replacement: "-",
            strict: true,
            lower: true,
            trim: true
        });
        if (mdContent) {
            try {
                let r = yield (0, promises_1.writeFile)(path_1.default.resolve(`src/markdown/${slug}.md`), mdContent);
                console.log("markdown file created...", `markdown/${slug}.md`);
            }
            catch (ex) {
                console.log("markdown file created fail...");
                console.log(ex);
            }
        }
        let post = db.get("posts").find({ slug: slug }).value();
        if (!post) {
            let newPost = db.get('posts')
                .push({ id, author_id, slug, title, cover, path: `markdown/${slug}.md`, tags: JSON.parse(tags), created_at: new Date() })
                .write();
            (0, response_1.default)(res, 200, { post: newPost });
        }
        else {
            (0, response_1.default)(res, 400, "post already created..");
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
    let fPost = db.get("posts").find({ id: id }).value();
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
        let updatedPost = db.get('posts')
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
    let fPost = db.get("posts").find({ id: post_id }).value();
    try {
        let p = (0, MDPath_1.MDFilepath)(fPost.path);
        let o = req.host === "localhost" ? 'http://' + req.rawHeaders[1] : "https://" + req.rawHeaders[1];
        let content = yield (0, promises_1.readFile)(p, "utf-8");
        if (content) {
            let g = content.replaceAll(`<img src="`, `<img src="${o}`);
            let post = visitorDB_1.default.get("postHits").find({ post_id: fPost.id }).value();
            if (post) {
                if (post.hits) {
                    post.hits = Number(post.hits) + 1;
                }
                else {
                    post.hits = 1;
                    // post.hits = [Date.now().toString().slice(3)]
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
            marked.parse(g, (err, html) => {
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
    catch (ex) {
        console.log(ex.message);
        (0, response_1.default)(res, 200, { mdContent: "" });
    }
});
exports.getPostContent = getPostContent;
const getRawMarkdownContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { post_id } = req.params;
    let fPost = db.get("posts").find({ id: post_id }).value();
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
    let fPost = db.get("posts").find({ id: post_id }).value();
    let deletedPost = db.get("posts").remove({ id: post_id }).write();
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
    let post = db.get("posts").find({ id: post_id }).value();
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
        let doc = db.get("posts").find({ id: post_id }).assign(Object.assign({}, post)).write();
        (0, response_1.default)(res, 201, { message: "Like Action Success", post: doc });
    }
});
exports.handleToggleLike = handleToggleLike;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvY29udHJvbGxlcnMvcG9zdENvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyREFBbUM7QUFDbkMsMENBQXFEO0FBQ3JELGdEQUF3QjtBQUN4QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDaEMsc0RBQThCO0FBQzlCLHlFQUFpRDtBQUNqRCxnREFBNEQ7QUFDNUQsc0VBQThDO0FBRTlDLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUNsQyxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDNUIsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUE7QUFJbkQsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksUUFBUSxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQTtBQUcvQyxNQUFNLFFBQVEsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFFekMsTUFBTyxFQUFFLFNBQVMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUE7SUFFaEMsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFBO0lBQ2QsSUFBRyxTQUFTLEVBQUM7UUFDWCxLQUFLLEdBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBQyxTQUFTLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUNoRTtTQUFNO1FBQ0wsS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDaEM7SUFFRCxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQ25DLElBQUksZUFBZSxHQUFHLEVBQUUsQ0FBQTtJQUd4QixLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUEsRUFBRTtRQUMvQyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQSxFQUFFLENBQUEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDakQsSUFBRyxJQUFJLEVBQUM7WUFDTixlQUFlLENBQUMsSUFBSSxpQ0FDZixJQUFJLEtBQ1AsTUFBTSxFQUFFO29CQUNOLFFBQVEsRUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUztvQkFDaEQsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO2lCQUNwQixJQUNELENBQUE7U0FDSDthQUFNO1lBQ0wsZUFBZSxDQUFDLElBQUksaUNBQ2YsSUFBSSxLQUNQLE1BQU0sRUFBRSxFQUFFLElBQ1YsQ0FBQTtTQUNIO0lBQ0gsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLGtCQUFRLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxlQUFlLEVBQUMsQ0FBQyxDQUFBO0FBRTlDLENBQUMsQ0FBQTtBQW5DWSxRQUFBLFFBQVEsWUFtQ3BCO0FBRU0sTUFBTSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO0lBQ3hDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQTtJQUNsQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUE7SUFDWixJQUFJLEtBQUssQ0FBQztJQUNWLElBQUcsT0FBTyxFQUFFO1FBQ1YsS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsRUFBRSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDcEQ7U0FBTTtRQUNMLEtBQUssR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBO0tBQ25EO0lBRUQsSUFBSSxPQUFPLEdBQUcsbUJBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQ3pFLElBQUcsT0FBTyxFQUFDO1FBQ1QsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUE7S0FDcEI7SUFFRCxJQUFJLEtBQStCLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFsRixFQUFFLFFBQVEsRUFBRSxJQUFJLE9BQWtFLEVBQTdELEtBQUssY0FBMUIsb0JBQTRCLENBQXNELENBQUE7SUFDdEYsSUFBSSxLQUFLLEVBQUU7UUFDVCxJQUFBLGtCQUFRLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFDLElBQUksa0NBQU0sS0FBSyxLQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxHQUFDLEVBQUMsQ0FBQyxDQUFBO0tBQzVEO1NBQU07UUFDTCxJQUFBLGtCQUFRLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO0tBQ3JDO0FBQ0gsQ0FBQyxDQUFBO0FBckJZLFFBQUEsT0FBTyxXQXFCbkI7QUFHTSxNQUFNLE9BQU8sR0FBRyxDQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFDOUMsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQTtJQUV6QixJQUFBLG9CQUFVLEVBQUMsR0FBRyxFQUFFLG9CQUFvQixFQUFFLGNBQWMsRUFBRSxDQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUMsRUFBRTtRQUN0RSxJQUFHLEdBQUcsRUFBQztZQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7U0FDakI7UUFDRCxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEdBQUcsQ0FBQTtRQUM3QixJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQTtRQUV6RCxJQUFHLEtBQUssSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBQztZQUNqRSxLQUFLLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQTtZQUNyQyxJQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUM7Z0JBQzFCLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTthQUN6QztTQUNGO1FBRUQsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzVCLElBQUksSUFBSSxHQUFHLElBQUEsaUJBQU8sRUFBQyxLQUFLLEVBQUU7WUFDeEIsV0FBVyxFQUFFLEdBQUc7WUFDaEIsTUFBTSxFQUFFLElBQUk7WUFDWixLQUFLLEVBQUUsSUFBSTtZQUNYLElBQUksRUFBRSxJQUFJO1NBQ1gsQ0FBQyxDQUFBO1FBRUYsSUFBRyxTQUFTLEVBQUM7WUFDWCxJQUFJO2dCQUNGLElBQUksQ0FBQyxHQUFHLE1BQU0sSUFBQSxvQkFBUyxFQUFDLGNBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLElBQUksS0FBSyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUE7Z0JBQzNFLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEVBQUUsWUFBWSxJQUFJLEtBQUssQ0FBQyxDQUFBO2FBQy9EO1lBQUMsT0FBTyxFQUFFLEVBQUM7Z0JBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO2dCQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO2FBQ2hCO1NBQ0Y7UUFFRCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBO1FBQ3JELElBQUcsQ0FBQyxJQUFJLEVBQUU7WUFDUixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztpQkFDMUIsSUFBSSxDQUFDLEVBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsWUFBWSxJQUFJLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxJQUFJLEVBQUUsRUFBQyxDQUFDO2lCQUN0SCxLQUFLLEVBQUUsQ0FBQTtZQUVWLElBQUEsa0JBQVEsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUE7U0FDcEM7YUFBTTtZQUNMLElBQUEsa0JBQVEsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLHdCQUF3QixDQUFDLENBQUE7U0FDN0M7SUFFSCxDQUFDLENBQUEsQ0FBQyxDQUFBO0lBRUYsOERBQThEO0lBQzlELCtCQUErQjtJQUMvQiw4QkFBOEI7SUFDOUIsc0JBQXNCO0lBQ3RCLGtCQUFrQjtJQUNsQixpQkFBaUI7SUFDakIsZUFBZTtJQUNmLEtBQUs7SUFDTCxFQUFFO0lBQ0YsaUJBQWlCO0lBQ2pCLFVBQVU7SUFDViw4RUFBOEU7SUFDOUUscUVBQXFFO0lBQ3JFLGtCQUFrQjtJQUNsQixtREFBbUQ7SUFDbkQsc0JBQXNCO0lBQ3RCLE1BQU07SUFDTixJQUFJO0lBQ0osRUFBRTtJQUNGLHdEQUF3RDtJQUN4RCxjQUFjO0lBQ2Qsa0NBQWtDO0lBQ2xDLDRHQUE0RztJQUM1RyxlQUFlO0lBQ2YsRUFBRTtJQUNGLHdDQUF3QztJQUN4QyxXQUFXO0lBQ1gsaURBQWlEO0lBQ2pELElBQUk7QUFDTixDQUFDLENBQUEsQ0FBQTtBQTdFWSxRQUFBLE9BQU8sV0E2RW5CO0FBRU0sTUFBTSxVQUFVLEdBQUcsQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO0lBRWpELElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUE7SUFDekIsSUFBRyxDQUFDLE9BQU8sRUFBQztRQUNWLE9BQU8sSUFBQSxrQkFBUSxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsY0FBYyxDQUFDLENBQUE7S0FDMUM7SUFJRCxJQUFJLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUE7SUFFcEQsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxFQUFFLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtJQUNsRCxJQUFHLEtBQUssRUFBQztRQUNQLElBQUksS0FBSyxFQUFFO1lBQ1QsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7U0FDcEI7UUFDRCxJQUFHLElBQUksRUFBQztZQUNOLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1NBQ2xCO1FBQ0QsSUFBRyxLQUFLLEVBQUM7WUFDUCxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtTQUNwQjtRQUNELElBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFDO1lBQ25CLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQTtTQUM5QjtRQUVELElBQUcsU0FBUyxFQUFDO1lBQ1gsSUFBSTtnQkFDRixJQUFJLENBQUMsR0FBRyxNQUFNLElBQUEsb0JBQVMsRUFBQyxJQUFBLG1CQUFVLEVBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFBO2FBQzNEO1lBQUMsT0FBTyxFQUFFLEVBQUM7YUFFWDtTQUNGO1FBRUQsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7YUFDOUIsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7YUFDWixNQUFNLG1CQUFLLEtBQUssRUFBRTthQUNsQixLQUFLLEVBQUUsQ0FBQTtRQUVWLElBQUEsa0JBQVEsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUE7S0FDeEM7U0FBTTtRQUNMLElBQUEsa0JBQVEsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixDQUFDLENBQUE7S0FDckM7QUFDSCxDQUFDLENBQUEsQ0FBQTtBQTNDWSxRQUFBLFVBQVUsY0EyQ3RCO0FBR00sTUFBTSxjQUFjLEdBQUcsQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO0lBQ3JELElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFBO0lBRTVCLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsRUFBRSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDdkQsSUFBSTtRQUNGLElBQUksQ0FBQyxHQUFHLElBQUEsbUJBQVUsRUFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFOUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUdoRyxJQUFJLE9BQU8sR0FBRyxNQUFNLElBQUEsbUJBQVEsRUFBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFFeEMsSUFBSSxPQUFPLEVBQUU7WUFFWCxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUE7WUFFMUQsSUFBSSxJQUFJLEdBQUcsbUJBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBO1lBRXRFLElBQUcsSUFBSSxFQUFDO2dCQUNOLElBQUcsSUFBSSxDQUFDLElBQUksRUFBQztvQkFDWCxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2lCQUNsQztxQkFBTTtvQkFDTCxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQTtvQkFDYiwrQ0FBK0M7aUJBQ2hEO2dCQUNELElBQUksS0FBSyxHQUFHLG1CQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTthQUUzRDtpQkFBTTtnQkFDTCxJQUFJLEtBQUssR0FBRyxtQkFBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUM7b0JBQ3pDLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBRTtvQkFDakIsSUFBSSxFQUFFLENBQUM7aUJBQ1IsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBO2FBRVg7WUFHRCxNQUFNLENBQUMsVUFBVSxDQUFDO2dCQUNoQixTQUFTLEVBQUUsVUFBUyxJQUFJLEVBQUUsSUFBSTtvQkFDNUIsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUNyQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztvQkFDN0QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUNsRCxDQUFDO2FBQ0YsQ0FBQyxDQUFBO1lBR0YsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0JBRTVCLElBQUcsQ0FBQyxHQUFHLEVBQUU7b0JBQ1AsSUFBQSxrQkFBUSxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtpQkFDdEM7cUJBQUs7b0JBQ0osSUFBQSxrQkFBUSxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBQyxTQUFTLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQTtpQkFDcEM7WUFFSCxDQUFDLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxJQUFBLGtCQUFRLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFBO1NBQ3BDO0tBQ0Y7SUFBQyxPQUFPLEVBQUUsRUFBQztRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3ZCLElBQUEsa0JBQVEsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUMsU0FBUyxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUE7S0FDcEM7QUFDSCxDQUFDLENBQUEsQ0FBQTtBQTdEWSxRQUFBLGNBQWMsa0JBNkQxQjtBQUVNLE1BQU0scUJBQXFCLEdBQUcsQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO0lBQzVELElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFBO0lBRTVCLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsRUFBRSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDdkQsSUFBSTtRQUVGLElBQUksT0FBTyxHQUFHLE1BQU0sSUFBQSxtQkFBUSxFQUFDLElBQUEsbUJBQVUsRUFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFFN0QsSUFBSSxPQUFPLEVBQUU7WUFDWCxJQUFBLGtCQUFRLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFBO1NBQ3pDO2FBQU07WUFDTCxJQUFBLGtCQUFRLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFBO1NBQ3BDO0tBQ0Y7SUFBQyxPQUFPLEVBQUUsRUFBQztRQUNWLElBQUEsa0JBQVEsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUMsU0FBUyxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUE7S0FDcEM7QUFDSCxDQUFDLENBQUEsQ0FBQTtBQWhCWSxRQUFBLHFCQUFxQix5QkFnQmpDO0FBRU0sTUFBTSxhQUFhLEdBQUcsQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO0lBQ3BELElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFBO0lBRTVCLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsRUFBRSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUE7SUFFdkQsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBQyxFQUFFLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtJQUMvRCxJQUFHLFdBQVcsRUFBQztRQUNiLElBQUcsS0FBSyxFQUFFO1lBQ1IsSUFBSTtnQkFDRixJQUFJLE9BQU8sR0FBRyxNQUFNLElBQUEsYUFBRSxFQUFDLElBQUEsbUJBQVUsRUFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtnQkFDN0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO2FBQ3JDO1lBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO2FBQ3ZDO1NBQ0Y7S0FDRjtJQUNELElBQUEsa0JBQVEsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7QUFDckMsQ0FBQyxDQUFBLENBQUE7QUFqQlksUUFBQSxhQUFhLGlCQWlCekI7QUFFTSxNQUFNLGdCQUFnQixHQUFHLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBQyxFQUFFO0lBQ2hELE1BQU0sRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQTtJQUVuQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQ3RELElBQUcsSUFBSSxFQUFDO1FBQ04sSUFBRyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2IsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUNuRCxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDZCxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO2FBQ3ZDO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBO2FBQ3hDO1NBQ0Y7YUFBTTtZQUNMLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtTQUN2QjtRQUNELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsRUFBRSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsTUFBTSxtQkFBSyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUN2RSxJQUFBLGtCQUFRLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQTtLQUNoRTtBQUNILENBQUMsQ0FBQSxDQUFBO0FBbEJZLFFBQUEsZ0JBQWdCLG9CQWtCNUIifQ==