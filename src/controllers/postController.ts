import response from "../response";
import {writeFile, readFile, rm } from "fs/promises";
import path from "path";
const marked = require("marked")
import slugify from  "slugify"
import fileUpload from "../utilities/fileUpload";
const shortid = require("shortid")
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')


const db = low(new FileSync("./src/database/db.json"))


export const getPosts = (req, res, next) =>{

  const  { author_id } = req.query

  let posts = []
  if(author_id){
    posts =  db.get('posts').filter({author_id: author_id}).value()
  } else {
    posts = db.get('posts').value()
  }

  let users = db.get('users').value()
  let posts_with_user = []


  posts && posts.length > 0 && posts.forEach(post=>{
    let user = users.find(u=>u.id === post.author_id)
    if(user){
      posts_with_user.push({
        ...post,
        author: {
          username: user.first_name + " " + user.last_name,
          avatar: user.avatar
        }
      })
    } else {
      posts_with_user.push({
        ...post,
        author: {}
      })
    }
  })

  response(res, 200, {posts: posts_with_user})
}

export const getPost = (req, res, next) =>{
  let { slug, post_id } = req.params
  let fPost;
  if(post_id) {
    fPost = db.get("posts").find({id: post_id}).value()
  } else {
    fPost = db.get("posts").find({slug: slug}).value()
  }

  let { password, role, ...other } = db.get("users").find({id: fPost.author_id}).value()
  
  if (fPost) {
    response(res, 200, {post: {...fPost, author: other}})
  } else {
    response(res, 404, "post not found")
  }
}


export const addPost = async (req, res, next) =>{
  let user_id = req.user_id
  if(!user_id) return response(res, 409, "Unauthorized")

  fileUpload(req, "markdown/cover", "upload-cover", async (err, obj)=>{
    if(err){}
    const { fields, files } = obj
    let { title, cover, author_id, mdContent, tags } = fields

    if(files && files['upload-cover'] && files["upload-cover"][0].path){
      cover = files["upload-cover"][0].path
    }

    let id = shortid.generate();
    let slug = slugify(title, {
      replacement: "-",
      strict: true,
      lower: true,
      trim: true
    })

    if(mdContent){
      try {
        let r = await writeFile(path.resolve(`markdown/${slug}.md`), mdContent)
        console.log("markdown file created...", `markdown/${slug}.md`)
      } catch (ex){
        console.log("markdown file created fail...")
        console.log(ex)
      }
    }

    let post = db.get("posts").find({slug: slug}).value()
    if(!post) {
      let newPost = db.get('posts')
        .push({id, author_id, slug, title, cover, path: `markdown/${slug}.md`, tags: JSON.parse(tags), created_at: new Date()})
        .write()

      response(res, 200, {post: newPost})
    } else {
      response(res, 400, "post already created..")
    }

  })

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
}

export const updatePost = async (req, res, next) =>{

  let user_id = req.user_id 
  if(!user_id){
    return response(res, 409, "Unauthorized")
  }

  let { id, title, cover, mdContent, tags } = req.body

  let fPost = db.get("posts").find({id: id}).value()
  if(fPost){
    if (title) {
      fPost.title = title
    }
    if(tags){
      fPost.tags = tags
    }
    if(cover){
      fPost.cover = cover
    }
    if(!fPost.created_at){
      fPost.created_at = new Date()
    }
    
    if(mdContent){
      try {
        let r = await writeFile(path.resolve(`${fPost.path}`), mdContent)
      } catch (ex){

      }
    }
    
    let updatedPost = db.get('posts')
      .find({ id })
      .assign({...fPost})
      .write()
    
    response(res, 200, {post: updatedPost})
  } else {
    response(res, 404, "post Not found")
  }
}

export const getPostContent = async (req, res, next) =>{
  let { post_id } = req.params
 
  let fPost = db.get("posts").find({id: post_id}).value()
  try {
    let content = await readFile(path.resolve(fPost.path), "utf-8")

    if (content) {
      let h = marked.parse(content)
      response(res, 200, {mdContent: h})
    } else {
      response(res, 200, {mdContent: ""})
    }
  } catch (ex){
    response(res, 200, {mdContent: ""})
  }
}


export const getRawMarkdownContent = async (req, res, next) =>{
  let { post_id } = req.params
 
  let fPost = db.get("posts").find({id: post_id}).value()
  try {

    let content = await readFile(path.resolve(fPost.path), "utf-8")

    if (content) {
      response(res, 200, {mdContent: content})
    } else {
      response(res, 200, {mdContent: ""})
    }
  } catch (ex){
    response(res, 200, {mdContent: ""})
  }
}


export const getDeletePost = async (req, res, next) =>{
  let { post_id } = req.params
  
  let fPost = db.get("posts").find({id: post_id}).value()
  
  let deletedPost = db.get("posts").remove({id: post_id}).write()
  if(deletedPost){
    if(fPost) {
      try {
        let deleted = await rm(fPost.path, {force: true})
        console.log("markdown file deleted")
      } catch (ex) {
        console.log("markdown file not found")
      }
    }
  }
  response(res, 200, { id: post_id })
}