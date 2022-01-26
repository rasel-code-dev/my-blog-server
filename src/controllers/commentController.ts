import response from "../response";
import errorConsole from "../logger/errorConsole";
const shortid = require("shortid")


import {redisConnect} from "../database";


export const createComment = async (req, res, next)=>{
	
	if(req.user_id !== req.body.user_id){
		return response(res, 404, {message: "Unauthorized"})
	}
	let client;
	try {
	
		let { post_id, text, user_id, username, avatar } = req.body
		client = await redisConnect()
		
		if(post_id && text && user_id && username) {
			
			// let comment = db.get('comments').find({ post_id: post_id, user_id: req.user_id }).value()
			let newComment = {
				id: shortid.generate(),
				post_id,
				text,
				user_id,
				username,
				avatar,
				created_at: new Date(),
				reply: null
			}
		
			
			let isCommentAdded = await client.HSET('comments', newComment.id, JSON.stringify(newComment))
			if(isCommentAdded){
				response(res, 201, {newComment})
			} else {
				return response(res, 404, {message: "Incomplete Comment Data"})
			}
			
		} else {
			return response(res, 404, {message: "Incomplete Comment Data"})
		}
		
		
	} catch (ex){
		errorConsole(ex)
		response(res, 500, "Internal server error")
	} finally {
		client?.quit()
	}
}


export const deleteComment = async (req, res, next)=>{
	
	let { comment_id, post_id, user_id } = req.query
	
	if(req.user_id !== user_id){
		return response(res, 404, {message: "Unauthorized"})
	}
	
	let client;
	try {
		client = await redisConnect()
		if(comment_id && post_id && user_id) {
			
			let g = client.HDEL("comments", comment_id)
			if(g){
				response(res, 201, {id: comment_id, message: "Comment Deleted"})
			} else {
				return response(res, 404, {message: "Comment Delete fail"})
			}
			
		} else {
			return response(res, 404, {message: "Comment Delete fail"})
		}
		
		
	} catch (ex){
		errorConsole(ex)
		response(res, 500, "Internal server error")
		
	} finally {
		client?.quit()
	}
}
