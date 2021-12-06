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
exports.getDeletePost = exports.getRawMarkdownContent = exports.getPostContent = exports.updatePost = exports.addPost = exports.getPost = exports.getPosts = void 0;
const response_1 = __importDefault(require("../response"));
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const marked = require("marked");
const slugify_1 = __importDefault(require("slugify"));
const fileUpload_1 = __importDefault(require("../utilities/fileUpload"));
const MDPath_1 = require("../utilities/MDPath");
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
    setTimeout(() => {
        (0, response_1.default)(res, 200, { posts: posts_with_user });
    }, 1000);
};
exports.getPosts = getPosts;
const getPost = (req, res, next) => {
    let { slug, post_id } = req.params;
    let fPost;
    if (post_id) {
        fPost = db.get("posts").find({ id: post_id }).value();
    }
    else {
        fPost = db.get("posts").find({ slug: slug }).value();
    }
    let _a = db.get("users").find({ id: fPost.author_id }).value(), { password, role } = _a, other = __rest(_a, ["password", "role"]);
    if (fPost) {
        (0, response_1.default)(res, 200, { post: Object.assign(Object.assign({}, fPost), { author: other }) });
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
        let content = yield (0, promises_1.readFile)(p, "utf-8");
        if (content) {
            let h = marked.parse(content);
            (0, response_1.default)(res, 200, { mdContent: h });
        }
        else {
            (0, response_1.default)(res, 200, { mdContent: "" });
        }
    }
    catch (ex) {
        console.log(ex);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvY29udHJvbGxlcnMvcG9zdENvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyREFBbUM7QUFDbkMsMENBQXFEO0FBQ3JELGdEQUF3QjtBQUN4QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDaEMsc0RBQThCO0FBQzlCLHlFQUFpRDtBQUNqRCxnREFBMEQ7QUFDMUQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ2xDLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUM1QixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQTtBQUduRCxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxRQUFRLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFBO0FBRy9DLE1BQU0sUUFBUSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUV6QyxNQUFPLEVBQUUsU0FBUyxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQTtJQUVoQyxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUE7SUFDZCxJQUFHLFNBQVMsRUFBQztRQUNYLEtBQUssR0FBSSxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBO0tBQ2hFO1NBQU07UUFDTCxLQUFLLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUNoQztJQUVELElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMs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