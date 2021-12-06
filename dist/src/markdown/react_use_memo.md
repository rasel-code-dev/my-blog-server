<p>﻿﻿﻿# <strong>Problem of React Re-render</strong></p>
<p>Memoization is one of the ways to optimize performance. In this article, we’ll explore how it works in React.</p>
<h2 id="what-is-memoization">What is memoization?</h2>
<p>n simple terms, memoization is a process that allows us to cache the values of recursive/expensive function calls so that the next time the function is called with the same argument(s), the cached value is returned rather than having to re-compute the function.</p>
<p>This ensures that our applications run faster because we avoid the time it would usually take to re-execute the function by returning a value that’s already stored in memory.</p>
<h2 id="why-use-memoization-in-react">Why use memoization in React?</h2>
<p>In React functional components, when props within a component change, the entire component re-renders by default. In other words, if any value within a component updates, the entire component will re-render, including functions/components that have not had their values/props altered.</p>
<p>Let’s look at a simple example where this happens. We’ll build a basic app that tells users what wine goes best with the cheese they’ve selected.</p>
<p>We’ll start by setting up two components. The first component will allow the user to select a cheese. It’ll then display the name of the wine that goes best with that cheese. The second component will be a child of the first component. In this component, nothing changes. We’ll use this component to keep track of how many times React re-renders.</p>
<p>Let’s start with our parent component: <code>&lt;ParentComponent /&gt;.</code></p>
<p><img src="markdown/images/react-useMemo-after.gif" alt="FDAF FDSF"></p>
<p><a href="#">using React Memo</a>
<img src="../images/react" alt="Lghj fgh" title="useMemo after.gif"></p>
<p><img src="http://localhost:3000/markdown/images/react-useMemo-after.gif" alt="system schema"></p>
<h2 id="lets-into-code">let&#39;s into code</h2>
<pre><code class="language-jsx">// Our Root Components.

<p>import React from &quot;react&quot;;<br>import uuid from &quot;./uuid&quot;;</p>
<p>const BlogWrapper = () =&gt; {<br>return (</p>
<pre><code>&amp;lt;div className=&amp;quot;App&amp;quot;&amp;gt;
  &amp;lt;h1 className=&amp;quot;mb-2 text-xl text-purple-700 font-medium  text-center&amp;quot;&amp;gt;
    React Prevent Extra Re Render When using Big List
  &amp;lt;/h1&amp;gt;
  &amp;lt;Comments/&amp;gt;
&amp;lt;/div&amp;gt;
</code></pre>
<p>) 
}
</code></pre></p>
<p>comments component</p>
<ul>
<li>This is Out Main Component that contain</li>
<li>state array of comment,</li>
<li>add comment Handler.</li>
<li>delete comment Handler.</li>
</ul>
<pre><code class="language-jsx">// Comments.js  
const Comments = (props)=&gt;{  
const [comments, setComments]  = React.useState([

<pre><code>{id: 1, text: &amp;quot;first Comment&amp;quot;},
{id: 2, text: &amp;quot;Second Comment&amp;quot;},
</code></pre>
<p>])</p>
<p>const commentText = React.useRef()</p>
<p>function addNewCommentHandler(e){</p>
<pre><code>e.preventDefault()
let uid = uuid()
setComments([
  ...comments,
  { id: uid , text: commentText.current.value }
])
</code></pre>
<p>}</p>
<p>function deleteComment(id){</p>
<pre><code>setComments(comments.filter(c=&amp;gt;c.id !== id))
</code></pre>
<p>}</p>
<p>return (</p>
<pre><code>&amp;lt;div&amp;gt;
  &amp;lt;form onSubmit={addNewCommentHandler} className=&amp;quot;mx-5&amp;quot;&amp;gt;
    &amp;lt;div&amp;gt;
      &amp;lt;input ref={commentText} type=&amp;quot;text&amp;quot; placeholder=&amp;quot;Comment text&amp;quot; className=&amp;quot;input-elem&amp;quot;/&amp;gt;
      &amp;lt;button className=&amp;quot;btn mt-1&amp;quot;&amp;gt;Add&amp;lt;/button&amp;gt;
    &amp;lt;/div&amp;gt;
  &amp;lt;/form&amp;gt;
  &amp;lt;div&amp;gt;
    { comments.map(c=&amp;gt;&amp;lt;Comment comment={c} deleteComment={deleteComment} /&amp;gt;
    )}
  &amp;lt;/div&amp;gt;
&amp;lt;/div&amp;gt;
</code></pre>
<p>)<br>}
</code></pre></p>
<pre><code class="language-jsx">// make out comment Memoized React Memo...  
const MemoizedComment=(props)=&gt;{  
let commentMemoized = React.useMemo(()=&gt;{

    return &lt;Comment {...props} /&gt;

}, [props.comment.id])

return commentMemoized  
}
</code></pre>
<p>Each Comment Render Here...  </p>
<pre><code class="language-jsx">// Comment.js

<p>const Comment = (props)=&gt; {</p>
<p>let {deleteComment, comment} = props</p>
<p>function renderEachComment(comment) {</p>
<pre><code>let now = Date.now().toString()
return (
  &amp;lt;div&amp;gt;
    &amp;lt;div className=&amp;quot;mx-5 px-3 py-2&amp;quot;&amp;gt;

      &amp;lt;div className=&amp;quot;bg-gray-light-9 my-2 px-3 py-2 flex justify-between&amp;quot;&amp;gt;
        &amp;lt;div className=&amp;quot;flex-1&amp;quot;&amp;gt;
          &amp;lt;h4 className=&amp;quot;min-w-100px&amp;quot;&amp;gt;{comment.text}&amp;lt;/h4&amp;gt;&amp;lt;
      /div&amp;gt;
        {/*&amp;lt;div className=&amp;quot;flex-1&amp;quot;&amp;gt;
        &amp;lt;button className=&amp;quot;btn btn-sm&amp;quot; onClick={(e)=&amp;gt;handleChangeCommentName(comment.id)}&amp;gt;change Name&amp;lt;/button&amp;gt;
      &amp;lt;/div&amp;gt;*/}
        &amp;lt;div className=&amp;quot;flex text-sm font-normal&amp;quot;&amp;gt;
          &amp;lt;h4&amp;gt;render Comment: &amp;lt;/h4&amp;gt;
          &amp;lt;span className=&amp;quot;ml-2 font-medium&amp;quot;&amp;gt;{now.slice(now.length - 4)} ago&amp;lt;/span&amp;gt;
        &amp;lt;/div&amp;gt;
      &amp;lt;/div&amp;gt;
      &amp;lt;div className=&amp;quot;flex&amp;quot;&amp;gt;
        &amp;lt;li onClick={() =&amp;gt; deleteComment(comment.id)} className=&amp;quot;text-xs mx-2&amp;quot;&amp;gt;&amp;lt;i className=&amp;quot;far fa-trash&amp;quot;/&amp;gt;&amp;lt;/li&amp;gt;
        &amp;lt;li className=&amp;quot;text-xs&amp;quot;&amp;gt;&amp;lt;i className=&amp;quot;far fa-pen&amp;quot;/&amp;gt;&amp;lt;/li&amp;gt;
      &amp;lt;/div&amp;gt;
    &amp;lt;/div&amp;gt;
  &amp;lt;/div&amp;gt;
)
</code></pre>
<p>}</p>
<p>return renderEachComment(comment)<br>}<br></code></pre></p>
