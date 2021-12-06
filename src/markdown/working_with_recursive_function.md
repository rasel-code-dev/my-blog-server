<p>Recursive very important thing. recursive function means call itself.
for rendering nested n of arr of element repeatedly loop.</p>
<p>Recursive very important thing. recursive function means call itself.
for rendering nested n of arr of element repeatedly loop.</p>
<p>Recursive very important thing. recursive function means call itself.
for rendering nested n of arr of element repeatedly loop.</p>
<p>Recursive very important thing. recursive function means call itself.
for rendering nested n of arr of element repeatedly loop.</p>
<pre><code class="language-jsx">

<p>import React from &#39;react&#39;;</p>
<p>const Text = () =&gt; {
  let [comments, setComments] = React.useState([
    {
      text: &quot;1st level comment&quot;,
      id: 1,
      reply: [
        {text: &quot;2st level comment&quot;, id: 2},
        {text: &quot;2st level comment 2&quot;, id: 3,
          reply: [
            {text: &quot;3st level comment&quot;, id: 4},
            {text: &quot;3st level comment 2&quot;, id: 5,
              reply: [
                {text: &quot;4st level comment&quot;, id: 6},
                {text: &quot;4st level comment 2&quot;, id: 7,
                  reply: [
                    {text: &quot;5st level comment&quot;, id: 8},
                    {text: &quot;5st level comment 2&quot;, id: 9,
                      reply: [
                        {text: &quot;6st level comment&quot;, id: 10},
                        {text: &quot;6st level comment 2&quot;, id: 11},
                      ]
                    },
                  ]
                },
              ]
            },
          ]
        },
      ],
    }
  ])</p>
<p>  //? Delete n nested recursive comment
  function handleDelete(id){
    let updatedComments = [...comments]</p>
<pre><code>function recursiveDelete(comments, deletedId, itemOfPatent=null){
  if(Array.isArray(comments)){
    comments.map(c=&amp;gt;{
      if(c.reply &amp;amp;&amp;amp; c.reply.length &amp;gt; 0){
        recursiveDelete(c.reply, deletedId, c)
      }
      
      if(c.id === deletedId ){
        // nested n level
        if(itemOfPatent &amp;amp;&amp;amp; itemOfPatent.reply) {
          let idx = itemOfPatent.reply.findIndex(d =&amp;gt; d.id === c.id)
          itemOfPatent.reply.splice(idx, 1)
        } else {
          // root level
          let idx = comments.findIndex(d =&amp;gt; d.id === c.id)
          comments.splice(idx, 1)
        }
      }
    })
  }
}
recursiveDelete(updatedComments, id, null)
setComments(updatedComments)
</code></pre>
<p>  }</p>
<p>  function handleAddNewComment(){
    let updatedComments = [...comments]</p>
<pre><code>let newComment = {
  text: &amp;quot;New Added Comment&amp;quot;,
  id: 22
}

function recursiveAddNew(comments, parent_id, itemOfPatent=null){
  if(Array.isArray(comments)){
    comments.map(c=&amp;gt;{
      if(c.reply &amp;amp;&amp;amp; c.reply.length &amp;gt; 0){
        recursiveAddNew(c.reply,  parent_id, c)
      }
      
      if(c.id === parent_id ){
        // nested n level
        if(itemOfPatent &amp;amp;&amp;amp; itemOfPatent.reply) {
          if(itemOfPatent.reply) {
            itemOfPatent.reply.push(newComment)
          } else {
            itemOfPatent.reply = [newComment]
          }
        } else {
          let idx = comments.findIndex(pc=&amp;gt;pc.id === c.id)
          if (comments[idx].reply) {
            comments[idx].reply.push(newComment)
          } else {
            comments[idx].reply = [newComment]
          }
        }
      }
    })
  }
}
recursiveAddNew(updatedComments, 1, null)
setComments(updatedComments)
</code></pre>
<p>  }</p>
<p>  return (
    &lt;div className=&quot;render_comments&quot;&gt;
      &lt;h2 className=&quot;text-center  text-xl text-pink-500&quot;&gt;React Recursion Render&lt;/h2&gt;
      &lt;button onClick={()=&gt;handleAddNewComment()}&gt;Add New &lt;/button&gt;
      &lt;ul&gt;
        { comments.map(c=&gt;(
          &lt;Comment key={c.id} onDelete={handleDelete} comment={c} /&gt;
        ))}
      &lt;/ul&gt;</p>
<pre><code>  {/* { comments.map(c=&amp;gt;(
    &amp;lt;li&amp;gt;
      &amp;lt;span onClick={()=&amp;gt;handleDelete(c.id)}&amp;gt;{c.text} id: {c.id}&amp;lt;/span&amp;gt;
      &amp;lt;ul className=&amp;quot;ml-3&amp;quot;&amp;gt;
        { c.reply &amp;amp;&amp;amp; c.reply.map(rc=&amp;gt;(
          &amp;lt;li&amp;gt;
            &amp;lt;span onClick={()=&amp;gt;handleDelete(rc.id)}&amp;gt;{rc.text} id: {rc.id}&amp;lt;/span&amp;gt;
          &amp;lt;/li&amp;gt;
        )) }
      &amp;lt;/ul&amp;gt;
    &amp;lt;/li&amp;gt;
  )) }     */}

&amp;lt;/div&amp;gt;
</code></pre>
<p>  );
};</p>
<p>const Comment = (props)=&gt;{
  let { key, comment, onDelete } = props
  return (
      &lt;li key={key} className=&quot;mb-2&quot;&gt;
        &lt;span&gt;{comment.text}
          &lt;span className=&quot;ml-24&quot;&gt;id: {comment.id}&lt;/span&gt;
          &lt;button className=&quot;btn btn-sm ml-10&quot; onClick={()=&gt;onDelete(comment.id)}&gt;delete&lt;/button&gt;
        &lt;/span&gt;
          &lt;ul&gt;
            { comment.reply &amp;&amp; comment.reply.map(cc=&gt;(
                &lt;Comment key={cc.id} onDelete={onDelete} comment={cc} /&gt; // this is recursion we check if comment.reply exists or not
            )) }
          &lt;/ul&gt;
      &lt;/li&gt;
  )
}</p>
<p>export default Text;
</code></pre></p>
