# `React.memo() vs. useMemo():`  Major differences and use cases

**Problem of React Re-render**

Memoization is one of the ways to optimize performance. In this article, we’ll explore how it works in React.

##What is memoization?
n simple terms, memoization is a process that allows us to cache the values of recursive/expensive function calls so that the next time the function is called with the same argument(s), the cached value is returned rather than having to re-compute the function.
This ensures that our applications run faster because we avoid the time it would usually take to re-execute the function by returning a value that’s already stored in memory.
 id="why-use-memoization-in-react">Why use memoization in React?
In React functional components, when props within a component change, the entire component re-renders by default. In other words, if any value within a component updates, the entire component will re-render, including functions/components that have not had their values/props altered.
Let’s look at a simple example where this happens. We’ll build a basic app that tells users what wine goes best with the cheese they’ve selected.
We’ll start by setting up two components. The first component will allow the user to select a cheese. It’ll then display the name of the wine that goes best with that cheese. The second component will be a child of the first component. In this component, nothing changes. We’ll use this component to keep track of how many times React re-renders.
Let’s start with our parent component

# Problem of React Re-render
![useMemo_before](https://res.cloudinary.com/dbuvg9h1e/image/upload/v1639058478/react_useMemo_before.gif)

** Loop at the picture if we add new or delete one element then re-render entire list..
we can silence do these jobs. without re-rendering long list

#using After React Memo
![using React Memo](https://res.cloudinary.com/dbuvg9h1e/image/upload/v1639058388/react_useMemo_after.gif)


## let's into code
`````jsx
import React from "react";
import uuid from "../../utils/uuid";

const BlogWrapper = ()=>{
  return (
    <div className="App">
      <h1 className="mb-2 text-xl text-purple-700 font-medium  text-center">
        React Prevent Extra Re Render When using Big List
      </h1>
      <Comments />
    </div>
  );
}

`````

comments component
* This is Out Main Component that contain 
* state array of comment,
* add comment Handler.
* delete comment Handler.
```jsx
// Comments.js
const Comments = (props)=>{
  const [comments, setComments]  = React.useState([
    {id: 1, text: "first Comment"},
    {id: 2, text: "Second Comment"},
  ])
  
  const commentText = React.useRef()
  
  function addNewCommentHandler(e){
    e.preventDefault()
    let uid = uuid()
    setComments([
      ...comments,
      { id: uid , text: commentText.current.value }
    ])
  }
  
  function deleteComment(id){
    setComments(comments.filter(c=>c.id !== id))
  }
  
  return (
    <div>
      <form onSubmit={addNewCommentHandler} className="mx-5">
        <div>
          <input ref={commentText} type="text" placeholder="Comment text" className="input-elem"/>
          <button className="btn mt-1">Add</button>
        </div>
      </form>
      <div>
        { comments.map(c=><Comment comment={c} deleteComment={deleteComment} />
        )}
      </div>
    </div>
  )
}

```


```jsx
// make out comment Memoized React Memo...
const MemoizedComment=(props)=>{
  let commentMemoized = React.useMemo(()=>{
    return <Comment {...props} />
  }, [props.comment.id])
  
  return commentMemoized
}

```


Each Comment Render Here...
```jsx
// Comment.js 

const Comment = (props)=> {
  
  let {deleteComment, comment} = props
  
  
  function renderEachComment(comment) {
    let now = Date.now().toString()
    return (
      <div>
        <div className="mx-5 px-3 py-2">
          
          <div className="bg-gray-light-9 my-2 px-3 py-2 flex justify-between">
            <div className="flex-1">
              <h4 className="min-w-100px">{comment.text}</h4><
          /div>
            {/*<div className="flex-1">
            <button className="btn btn-sm" onClick={(e)=>handleChangeCommentName(comment.id)}>change Name</button>
          </div>*/}
            <div className="flex text-sm font-normal">
              <h4>render Comment: </h4>
              <span className="ml-2 font-medium">{now.slice(now.length - 4)} ago</span>
            </div>
          </div>
          <div className="flex">
            <li onClick={() => deleteComment(comment.id)} className="text-xs mx-2"><i className="far fa-trash"/></li>
            <li className="text-xs"><i className="far fa-pen"/></li>
          </div>
        </div>
      </div>
    )
  }
  
  return renderEachComment(comment)
}
```


