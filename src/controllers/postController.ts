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
import {redisConnect} from "../database";
import {getHashData, redisHasToArr} from "../utilities/redisUtils";

const shortid = require("shortid")



export const getPosts = async (req, res, next) =>{

  const  { author_id } = req.query

  let client;
  try {
  
    client = await redisConnect()
  
    let posts = []
    if (author_id) {
      // posts = db.get('posts').filter({author_id: author_id}).value()
    } else {
      posts = await getHashData('posts', client)
    }
    
    let users = await getHashData("users", client)
    
    let posts_with_user = []
    // usersSync(users, client)
    
  
    posts && posts.length > 0 && posts.forEach(post => {
      let user = users.find(u => u.id === post.author_id)
      if (user) {
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
    
  } catch (ex){
    response(res, 500, ex.message)
  } finally {
    client?.quit()
  }
  
}

export const getPost = async (req, res, next) =>{
  let { slug, post_id } = req.params
  
  let client;
  
  try {
    
    client = await redisConnect()
    
    let hits = 0
    let fPost;
    if(post_id) {
      let postStr =  await client.HGET("posts", post_id)
      if(postStr){
        fPost = JSON.parse(postStr)
      }
    } else {
      // fPost = db.get("posts").find({slug: slug}).value()
    }
    
    if (fPost) {
    
      let postHit = await client.HGET("post_hits", fPost.id)
      
      // sync(postHit, "post_hits", "post_id", client)
      
      if(postHit){
        hits = postHit
      }
    
      let comments = await getHashData("comments", client)
      let postComment = comments.filter(c=>c.post_id == fPost.id)
      
      // sync(comments, "comments", "id", client)
      
      
      // let comments = db.get("comments").filter({post_id: fPost.id}).value()
      let users = await getHashData("users", client)
      let user = users.find(u=>u.id === fPost.author_id)
      
      let { password, role, ...other } = user
      
        response(res, 200, {
          post: {
            ...fPost,
            hits,
            author: other,
            comments: postComment
          }
        })
   
    } else {
      response(res, 404, "post not found")
    }
  
  } catch (ex){
    response(res, 500, ex.message)
  } finally {
    client?.quit()
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
     
        let result = ""
        function deleteLastIndex(str) {
          if(str) {
            let isLastIndex = str[str.length - 1] !== "-"
            if(isLastIndex){
              result = str
            } else {
              let deletedLast = str.slice(0, str.length - 1)
              deleteLastIndex(deletedLast)
            }
          }
        }
        deleteLastIndex(slug)
        slug = result
        if(!slug){
          return response(res, 400, {
            message: "post not create because slug create fali",
            slug: slug
          })
        }
        
        let r = await writeFile(path.resolve(`src/markdown/${slug}.md`), mdContent)
        console.log("markdown file created...", `markdown/${slug}.md`)
        
        let client;
        
        try{
          
          client = await redisConnect()
          let post = db.get("posts").find({slug: slug}).value()
          if(!post) {
            let newPost = db.get('posts')
              .push({id, author_id, slug, title, cover, path: `markdown/${slug}.md`, tags: JSON.parse(tags), created_at: new Date()})
              .write()
    
            response(res, 200, {post: newPost})
          } else {
            response(res, 400, "post already created..")
          }
        } catch (ex) {
        
        } finally {
          client?.quit()
        }
        
      } catch (ex){
        console.log(ex.message)
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



/** Implement Later... */
function increasePostVisitorCount(){
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

export const getPostContent = async (req, res, next) =>{
  let { post_id } = req.params
 
  let client;

  
  try {
      client = await redisConnect()
      let fPost = await client.HGET("posts", post_id)
      if(fPost) {
        let post = JSON.parse(fPost)
       
        
        let p = MDFilepath(post.path)
        let content = await readFile(p, "utf-8")
      
      if (content) {
        
        increasePostVisitorCount()
    
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
  finally {
    client?.quit()
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

