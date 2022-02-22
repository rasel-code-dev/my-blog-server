import response from "../response";
const marked = require("marked")
import errorConsole from "../logger/errorConsole";
import {mongoConnect, redisConnect} from "../database";

import {deleteFile, downloadFile, getFileMeta, updateFile, uploadFile2} from "../dropbox";
import slugify from "slugify";
import Post from "../models/Post";
import {ObjectId} from "mongodb";
import Hits from "../models/Hits";

const shortid = require("shortid")


export const getP = (req, res)=>{
  try{
    res.send("test")
  } catch (ex){
    res.send("test err")
  } finally {
  
  }
}


export const getPosts = async (req, res, next) =>{
  const  { author_id } = req.query
  
  try {
    let p = await Post.aggregate([
      { $match:  author_id ? { author_id: new ObjectId(author_id) } : {} },
      { $lookup: {
          from: "users",
          localField: "author_id",
          foreignField: "_id",
          as: "author"
        }},
      { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } }
    ])
    res.send(p)
    
  } catch (ex){
    console.log(ex)
  }
  
  // let client;
  // try {
  //
  //   client = await redisConnect()
  //
  //   let posts = []
  //   if (author_id) {
  //     // posts = db.get('posts').filter({author_id: author_id}).value()
  //     let allPosts = await getHashData('posts', client)
  //     if(allPosts) {
  //       posts = allPosts.filter(p => p.author_id === author_id)
  //     }
  //   } else {
  //     posts = await getHashData('posts', client)
  //   }
  //
  //   let users = await getHashData("users", client)
  //
  //   let posts_with_user = []
  //   // usersSync(users, client)
  //
  //
  //   posts && posts.length > 0 && posts.forEach(post => {
  //     let user = users.find(u => u.id === post.author_id)
  //     if (user) {
  //       posts_with_user.push({
  //         ...post,
  //         author: {
  //           username: user.first_name + " " + user.last_name,
  //           avatar: user.avatar
  //         }
  //       })
  //     } else {
  //       posts_with_user.push({
  //         ...post,
  //         author: {}
  //       })
  //     }
  //   })
  //
  //   response(res, 200, {posts: posts_with_user})
  //
  // } catch (ex){
  //   errorConsole(ex)
  //   response(res, 500, "Server Error. Please Try Again")
  // } finally {
  //   client?.quit()
  // }
  
}



export const getTopHitsPosts = async (req, res, next) =>{
  
  try {
    let p = await Post.aggregate([
      // { $match: { author_id: new ObjectId(author_id)}},
      { $lookup: {
          from: "users",
          localField: "author_id",
          foreignField: "_id",
          as: "author"
        }},
      { $unwind: { path: "$author" } },
      { $project: {
          tags: 0,
          author: {
            _id: 0,
            password: 0,
            created_at: 0,
            updated_at: 0,
            description: 0,
            email: 0
          }
      } },
      { $lookup: {
          from: "hits",
          localField: "_id",
          foreignField: "post_id",
          as: "hits"
        }},
      { $unwind: { path: "$hits", preserveNullAndEmptyArrays: true } },
      { $project: {
          tags: 0,
          hits: {
            post_id: 0
          }
        } },
      { $sort: {
          'hits.hits': -1
      } },
      { $limit: 10 }
    ])
    response(res, 200, {  posts: p })
    
  } catch (ex){
    errorConsole(ex)
    response(res, 500, ex.message)
  }
  
  // let client;
  // try {
  //
  //   client = await redisConnect()
  //
  //   let posts = []
  //   if (author_id) {
  //     // posts = db.get('posts').filter({author_id: author_id}).value()
  //     let allPosts = await getHashData('posts', client)
  //     if(allPosts) {
  //       posts = allPosts.filter(p => p.author_id === author_id)
  //     }
  //   } else {
  //     posts = await getHashData('posts', client)
  //   }
  //
  //   let users = await getHashData("users", client)
  //
  //   let posts_with_user = []
  //   // usersSync(users, client)
  //
  //
  //   posts && posts.length > 0 && posts.forEach(post => {
  //     let user = users.find(u => u.id === post.author_id)
  //     if (user) {
  //       posts_with_user.push({
  //         ...post,
  //         author: {
  //           username: user.first_name + " " + user.last_name,
  //           avatar: user.avatar
  //         }
  //       })
  //     } else {
  //       posts_with_user.push({
  //         ...post,
  //         author: {}
  //       })
  //     }
  //   })
  //
  //   response(res, 200, {posts: posts_with_user})
  //
  // } catch (ex){
  //   errorConsole(ex)
  //   response(res, 500, "Server Error. Please Try Again")
  // } finally {
  //   client?.quit()
  // }
  
}




export const getPost = async (req, res, next) =>{
  let { slug, post_id } = req.params
  
  let client;
  
  try {
    // let { c: PostColl, client: cc } = await mongoConnect("posts")
    // client = cc
    // client = await redisConnect()
    
    let hits = 0
    let posts: any = [];
    if(post_id) {
      posts =  await Post.aggregate([
        { $match: {_id: new ObjectId(post_id)}},
        { $lookup: {
            from: "users",
            localField: "author_id",
            foreignField: "_id",
            as: "author"
        }},
        { $unwind: { path: "$author" } },
        
      ])
    } else {
      // fPost = db.get("posts").find({slug: slug}).value()
    }
    if (posts.length > 0) {
       response(res, 200, {
          post: {
            ...posts[0],
            hits,
            comments: []
          }
        })

    
    //   let postHit = await client.HGET("post_hits", fPost.id)
    //
    //   // sync(postHit, "post_hits", "post_id", client)
    //
    //   if(postHit){
    //     hits = postHit
    //   }
    //
    //   let comments = await getHashData("comments", client)
    //   let postComment = comments.filter(c=>c.post_id == fPost.id)
    //
    //   // sync(comments, "comments", "id", client)
    //
    //
    //   // let comments = db.get("comments").filter({post_id: fPost.id}).value()
    //   let users = await getHashData("users", client)
    //   let user = users.find(u=>u.id === fPost.author_id)
    //
    //   let { password, role, ...other } = user
    //
    //     response(res, 200, {
    //       post: {
    //         ...fPost,
    //         hits,
    //         author: other,
    //         comments: postComment
    //       }
    //     })
    //
    } else {
      response(res, 404, "post not found")
    }
  
  } catch (ex){
    response(res, 500, ex.message)
  } finally {
    client?.close()
  }

}


export const addPost = async (req, res, next) =>{
  
  let user_id = req.user_id
  let { title, cover = "", author_id, mdContent, tags, summary="" } = req.body
  
  if(!(title && author_id && mdContent)){
    return response(res, 500, "incomplete post data")
  }
  if(user_id !== author_id){
    return response(res, 500, {message: "you are unauthorized" })
  }
  
    // let id = shortid.generate();
    //
    // let slug = slugify(title, {
    //   replacement: "-",
    //   strict: true,
    //   lower: true,
    //   trim: true
    // })
    //
    // if(!slug){
    //   // slug = make_slug(title)
    //   // return response(res, 400, {message: "post title invalid" })
    //   slug = shortid.generate();
    // }
    //
    // if(mdContent){
    //   try {
    //
    //     let sd = cloudinaryHandler().uploader.upload_stream(
    //       {
    //         folder: "foo"
    //       },
    //       function(error, result) {
    //         console.log(error, result);
    //       })
    //
    //     console.log(sd)
    //
    //     const Readable = require('stream').Readable;
    //     let s = new Readable()
    //     s.push("some string")
    //     s.push(null) // end od pushing chunk
    //     s.on("data", (d)=>{
    //
    //     })
    //
    //     s.on("end", ()=>{
    //       // res.end()
    //     })
  
  if(mdContent){
    let client;
    try {
      let slug = slugify(title, {
          replacement: "-",
          strict: true,
          lower: true,
          trim: true
      })

      if (!slug) {
        slug = shortid.generate()
      }
  
      let mdFilePath = `apps/markdown-static/${slug}.md`
      let isUploaded = await updateFile(mdContent, mdFilePath)
      
      if(isUploaded){
        let newPost: any = {
          author_id: new ObjectId(author_id),
          slug,
          title,
          cover,
          tags: tags,
          summary,
          path: mdFilePath,
          updated_at: new Date(),
          created_at: new Date()
        }
  
        let n = new Post({
          ...newPost,
        })
        
        let isError = await n.validationBeforeSave()
        if(isError){
          return  response(res, 409, { message: "missing data" })
        }
        
        let r = await n.save()
        response(res, 200, {post: r})

      } else {
        response(res, 409, "post create fail")
      }
   
      // let isAdded = await PostCol.insertOne({...newPost})
      // if(isAdded) {
      //   response(res, 200, {post: newPost})
      // } else {
      //   response(res, 409, "post create fail")
      // }
      // //
      // response(res, 409, "post create fail")
      
    } catch (ex){
      errorConsole(ex)
      response(res, 409, "post create fail")

    } finally {
      client?.close()
    }

    } else {
      response(res, 400, {message: "post not create because markdown content are empty"})
    }

  
  // let { title, cover, author_id, mdContent, tags } = req.body
  // let id = shortid.generate();
  // let slug = slugify(title)
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
  
  
  let { _id, title, cover, summary, mdContent, tags } = req.body

  let client;

  try {
    
    let post: any  = await Post.findOne({_id: new ObjectId(_id)}, {})
    if(post) {
      if (title) {
        post.title = title
      }
      if(summary){
        post.summary = summary
      }
      if (tags) {
        post.tags = tags
      }
      if (cover) {
        post.cover = cover
      }
      if (!post.created_at) {
        post.created_at = new Date()
      }
      post.updated_at = new Date()
  
      try {
    
        if (mdContent) {
          let isUpdatedMdFile = await updateFile(mdContent, post.path)
          if(isUpdatedMdFile){
            let isUpdated = await Post.update(
              {_id: new ObjectId(post._id)},
              { $set: post }
            )
        
            if (isUpdated ) {
              response(res, 200, {post: post})
            } else {
              response(res, 500, "post update fail")
            }
          } else {
            response(res, 400, "markdown update fail")
          }
        } else {
          response(res, 400, "markdown content required")
        }
    
      } catch (ex){
        response(res, 500, "post update fail")
      }
      
      
    } else {
      response(res, 404, "post Not found")
    }
    
    
  } catch (ex){
    errorConsole(ex)
    response(res, 500, "Internal Error. Please Try Again")
    
  } finally {
    client?.close()
  }
}



/**...............Implementation.............*/
async function increasePostVisitorCount(post_id){
  
  let hit: any =  await Hits.findOne({post_id: new ObjectId(post_id)}, {})
  if(hit){
    
    await Hits.update({_id: hit._id}, {$push: {hits: Date.now()}})
    
  } else {
    
    let newHit = new Hits({
      post_id: new ObjectId(post_id), hits: [Date.now()]
    })
    const errors = await newHit.validationBeforeSave()
    if(errors){  console.log(errors) }
  
    await newHit.save()
  }
  
  
  // let postHit = await client.HGET("post_hits", post.id)
  // if(postHit){
  //
  //   if(Number(postHit)) {
  //     let increase =  Number(postHit) + 1
  //     let isAdded = await client.HSET("post_hits", post.id, increase.toString())
  //     if(isAdded){
  //       // console.log("increase post visit")
  //     }
  //   } else {
  //     let isAdded = await client.HSET("post_hits", post.id, "1")
  //     if(isAdded){
  //       // console.log("increase post visit")
  //     }
  //   }
  //
  // } else {
  //   // create new one
  //   let isAdded = await client.HSET("post_hits", post.id, "1")
  //   if(isAdded){
  //     // console.log("increase post visit")
  //
  //   }
  // }
  
  
  //
  // let postHit = await client.HGET("post_hits", post.id)
  // if(postHit){
  //
  //   if(Number(postHit)) {
  //     let increase =  Number(postHit) + 1
  //     let isAdded = await client.HSET("post_hits", post.id, increase.toString())
  //     if(isAdded){
  //       // console.log("increase post visit")
  //     }
  //   } else {
  //     let isAdded = await client.HSET("post_hits", post.id, "1")
  //     if(isAdded){
  //       // console.log("increase post visit")
  //     }
  //   }
  //
  // } else {
  //   // create new one
  //   let isAdded = await client.HSET("post_hits", post.id, "1")
  //   if(isAdded){
  //     // console.log("increase post visit")
  //   }
  // }
  
  
  
  
  
}



export const getFileContent = async (req, res, next)=>{
  try{
    let mdContent = await downloadFile(req.body.path)
    res.send(mdContent)
  } catch (ex){
    res.send(ex)
  }
}

export const getPostContent = async (req, res, next) =>{
  let { filePath, post_id } = req.body

  let client;
 
  try {
    let mdContent = await downloadFile(filePath)
  
    if (mdContent) {
      await increasePostVisitorCount(post_id)
      marked.setOptions({
        highlight: function(code, lang) {
          const hljs = require('highlight.js');
          const language = hljs.getLanguage(lang) ? lang : 'plaintext';
          return hljs.highlight(code, { language }).value;
        },
      })
    
      marked.parse(mdContent.toString(), (err, html) => {
        if(!err) {
          res.write(html)
          res.end()
          // response(res, 200, {mdContent: html, message: "yyyyyyy"})
        } else{
          response(res, 500,  "markdown file parse fail")
        }
      });
      
    } else {
      response(res, 404, {mdContent: "", message: "Markdown content not found"})
    }

    
  } catch (ex){
   errorConsole(ex)
    response(res, 500, ex.message)
  }
  finally {
    client?.quit()
  }
}

export const getRawMarkdownContent = async (req, res, next) =>{
  
  try {
    
    let mdContent = await downloadFile(req.body.path)
  
    if (mdContent) {
      response(res, 200, {mdContent: mdContent})
    } else {
      response(res, 404, {mdContent: ""})
    }
    
  } catch (ex){
    errorConsole(ex)
    response(res, 404, {mdContent: ""})
  }
  
}

export const deletePost = async (req, res, next) =>{
  let { _id, path } = req.body
  
  let client;
  try{
    client = await redisConnect()
    let doc = await Post.removeOne({_id: new ObjectId(_id)})
    if(doc) {
  
      let mdFilePath = path.resolve("src/" + req.body.path)
      try {
        let file = await deleteFile(mdFilePath)
        if (file) {
          console.log("markdown file deleted")
        } else {
          console.log("markdown file not found")
        }
      } catch (ex) {
        console.log("markdown file not found")
      }
  
      response(res, 201, {id: _id})
    }
    
  } catch (ex){
    response(res, 500, "Post Delete fail")
  } finally {
    client?.quit()
  }
  
}

export const handleToggleLike = async (req, res)=>{
  const {post_id, user_id} = req.body
  
  let client;
  try{
    client = await redisConnect()
    let postStr = await client.HGET("posts", post_id)
    if(postStr){
      let post = JSON.parse(postStr)
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
      
      let doc = await client.HSET("posts", post_id, JSON.stringify(post))
      if(doc === 0 || doc) {
        response(res, 201, {message: "Like Action Success", post: post})
      } else {
        response(res, 500, "Post Action fail")
      }
    }
 
    } catch (ex){
      response(res, 500, "Post Delete fail")

    } finally {
      client?.quit()
    }
}



