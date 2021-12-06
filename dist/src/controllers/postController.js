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
    if (!user_id)
        return (0, response_1.default)(res, 409, "Unauthorized");
    (0, fileUpload_1.default)(req, "markdown/cover", "upload-cover", (err, obj) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) { }
        const { fields, files } = obj;
        let { title, cover, author_id, mdContent, tags } = fields;
        if (files && files['upload-cover'] && files["upload-cover"][0].path) {
            cover = files["upload-cover"][0].path;
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
                let r = yield (0, promises_1.writeFile)(path_1.default.resolve(`markdown/${slug}.md`), mdContent);
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
                let r = yield (0, promises_1.writeFile)(path_1.default.resolve(`${fPost.path}`), mdContent);
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
        let content = yield (0, promises_1.readFile)(path_1.default.resolve(fPost.path), "utf-8");
        if (content) {
            let h = marked.parse(content);
            (0, response_1.default)(res, 200, { mdContent: h });
        }
        else {
            (0, response_1.default)(res, 200, { mdContent: "" });
        }
    }
    catch (ex) {
        (0, response_1.default)(res, 200, { mdContent: "" });
    }
});
exports.getPostContent = getPostContent;
const getRawMarkdownContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { post_id } = req.params;
    let fPost = db.get("posts").find({ id: post_id }).value();
    try {
        let content = yield (0, promises_1.readFile)(path_1.default.resolve(fPost.path), "utf-8");
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
                let deleted = yield (0, promises_1.rm)(fPost.path, { force: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvY29udHJvbGxlcnMvcG9zdENvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyREFBbUM7QUFDbkMsMENBQXFEO0FBQ3JELGdEQUF3QjtBQUN4QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDaEMsc0RBQThCO0FBQzlCLHlFQUFpRDtBQUNqRCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDbEMsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzVCLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO0FBR25ELE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUE7QUFHL0MsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO0lBRXpDLE1BQU8sRUFBRSxTQUFTLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFBO0lBRWhDLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQTtJQUNkLElBQUcsU0FBUyxFQUFDO1FBQ1gsS0FBSyxHQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUMsU0FBUyxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDaEU7U0FBTTtRQUNMLEtBQUssR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBO0tBQ2hDO0lBRUQsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FB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