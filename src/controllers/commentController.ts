import response from "../response";
import errorConsole from "../logger/errorConsole";
const shortid = require("shortid")


import db from "../database/db";


export const createComment = async (req, res, next)=>{
	
	if(req.user_id !== req.body.user_id){
		return response(res, 404, {message: "Unauthorized"})
	}
	
	try {

		let { post_id, text, user_id, username, avatar } = req.body
		
		if(post_id && text && user_id && username && avatar) {
			
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
			
			let g = db.get('comments').push(newComment).write()
			if(g){
				response(res, 201, {newComment})
			} else {
				return response(res, 404, {message: "Incomplete Comment Data"})
			}
			
		} else {
			return response(res, 404, {message: "Incomplete Comment Data"})
		}
		
		
	} catch (ex){
		errorConsole(ex)
		res.status(500).json({message: "Internal server error"})
	}
}


export const deleteComment = async (req, res, next)=>{
	
	let { comment_id, post_id, user_id } = req.query
	
	if(req.user_id !== user_id){
		return response(res, 404, {message: "Unauthorized"})
	}
	
	try {
		
		if(comment_id && post_id && user_id) {
			
			let g = db.get('comments').remove({id: comment_id}).write()
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
		res.status(500).json({message: "Internal server error"})
	}
}
