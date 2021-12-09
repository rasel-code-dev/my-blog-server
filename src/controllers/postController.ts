import response from "../response";
import {writeFile, readFile, rm } from "fs/promises";
import path from "path";
const marked = require("marked")
import fileUpload from "../utilities/fileUpload";
import { MDDirpath, MDFilepath } from "../utilities/MDPath";
import visitorDB from "../database/visitorDB";
import hljs from 'highlight.js';
import slugify from "../utilities/slugify";
import errorConsole from "../logger/errorConsole";
import db from "../database/db";
import * as fs from "fs";

const shortid = require("shortid")



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
  // setTimeout(()=>{
  
  response(res, 200, {posts: posts_with_user})
  // }, 4000)
  
}

export const getPost = (req, res, next) =>{
  let { slug, post_id } = req.params
  let hits = 0
  let fPost;
  if(post_id) {
    fPost = db.get("posts").find({id: post_id}).value()
  } else {
    fPost = db.get("posts").find({slug: slug}).value()
  }
  
  let postHit = visitorDB.get("postHits").find({post_id: fPost.id}).value()
  if(postHit){
    hits = postHit.hits
  }
  
  let comments = db.get("comments").filter({post_id: fPost.id}).value()
  
  let { password, role, ...other } = db.get("users").find({id: fPost.author_id}).value()
  if (fPost) {
    
      response(res, 200, {
        post: {
          ...fPost,
          hits,
          author: other,
          comments: comments
        }
      })
 
  } else {
    response(res, 404, "post not found")
  }
}



export const addPost = async (req, res, next) =>{
  let user_id = req.user_id

  fileUpload(req, "src/markdown/cover", "upload-cover", async (err, obj)=>{
    if(err){
      console.log(err)
    }
    const { fields, files } = obj
    let { title, cover, author_id, mdContent, tags } = fields

    if(user_id !== author_id){
      return response(res, 500, {message: "you are unauthorized" })
    }
    
    if(files && files['upload-cover'] && files["upload-cover"][0].path){
      cover = files["upload-cover"][0].path
      if(cover.startsWith("src/")){
        cover = cover.replace("src/", "").trim()
      }
    }
  
    let id = shortid.generate();
    
    // let slug = slugify(title, {
    //   replacement: "-",
    //   strict: true,
    //   lower: true,
    //   trim: true
    // })
    
    let slug = slugify(title)
    
    if(!slug){
      // slug = make_slug(title)
      return response(res, 400, {message: "post title invalid" })
    }

    if(mdContent){
      try {
        let r = await writeFile(path.resolve(`src/markdown/${slug}.md`), mdContent)
        console.log("markdown file created...", `markdown/${slug}.md`)
  
        let post = db.get("posts").find({slug: slug}).value()
        if(!post) {
          let newPost = db.get('posts')
            .push({id, author_id, slug, title, cover, path: `markdown/${slug}.md`, tags: JSON.parse(tags), created_at: new Date()})
            .write()
    
          response(res, 200, {post: newPost})
        } else {
          response(res, 400, "post already created..")
        }
        
      } catch (ex){
        console.log("markdown file created fail...")
        errorConsole(ex)
        response(res, 400, {message: "post not create because markdown file creation fail"})
      }
    } else {
      response(res, 400, {message: "post not create because markdown content are empty"})
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
        let r = await writeFile(MDFilepath(fPost.path), mdContent)
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
    if(fPost) {
      
      let p = MDFilepath(fPost.path)
      let content = await readFile(p, "utf-8")
      
      if (content) {
        let post = visitorDB.get("postHits").find({post_id: fPost.id}).value()
        if(post){
          if(post.hits){
            post.hits = Number(post.hits) + 1
          } else {
            post.hits = 1
          }
          let newVi = visitorDB.get("postHits").assign(post).write()
        } else {
          let newVi = visitorDB.get("postHits").push({
            post_id: fPost.id,
            hits: 1
          }).write()
        }
    
        marked.setOptions({
          highlight: function(code, lang) {
            const hljs = require('highlight.js');
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
          },
        })

        marked.parse(content, (err, html) => {
          if(!err) {
            response(res, 200, {mdContent: html})
          } else{
            response(res, 200, {mdContent: ""})
          }
        });

      } else {
        response(res, 200, {mdContent: ""})
      }
      
    }
    
  } catch (ex){
    console.log(ex.message)
    response(res, 200, {mdContent: ""})
  }
}

export const getRawMarkdownContent = async (req, res, next) =>{
  let { post_id } = req.params
 
  let fPost = db.get("posts").find({id: post_id}).value()
  try {

    let content = await readFile(MDFilepath(fPost.path), "utf-8")

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
        let deleted = await rm(MDFilepath(fPost.path), {force: true})
        console.log("markdown file deleted")
      } catch (ex) {
        console.log("markdown file not found")
      }
    }
  }
  response(res, 200, { id: post_id })
}

export const handleToggleLike = async (req, res)=>{
  const {post_id, user_id} = req.body
  
  let post = db.get("posts").find({id: post_id}).value()
  if(post){
    if(post.likes) {
      let idx = post.likes && post.likes.indexOf(user_id)
      if (idx === -1) {
        post.likes && post.likes.push(user_id)
      } else {
        post.likes && post.likes.splice(idx, 1)
      }
    } else {
      post.likes = [user_id]
    }
    let doc = db.get("posts").find({id: post_id}).assign({...post}).write()
    response(res, 201, {message: "Like Action Success", post: doc})
  }
}

export const getMarkDownFileList = async (req, res)=>{
  fs.readdir(MDDirpath(), (err, doc)=>{
    if(err){
      res.send(err)
    } else {
      res.send(doc)
    }
  })
  
}

