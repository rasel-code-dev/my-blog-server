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
Let’s start with our parent component: <code>&lt;ParentComponent /&gt;.</code>
<img src="/markdown/images/react useMemo before.gif" alt="FDAF FDSF">
<a href="#">using React Memo</a>
<img src="../images/react" alt="Lghj fgh" title="useMemo after.gif">
<img src="/markdown/images/react-useMemo-after.gif" alt="system schema">


##Why use memoization in React?

```jsx
  import React from "react"

```
comments component

# What is useMemo()?

```jsx
function UseMemoCounts({memoizedValue}) {
  return (
    <div className="mt-3">
      <p className="dark:text-white max-w-md">
        I'll only re-render when you click <span className="font-bold text-indigo-400">Force render.</span> 
        </p>
      <p className="dark:text-white">I've now rendered: <span className="text-green-400">{memoizedValue} time(s)</span> </p>
    </div>
  );
}
export default UseMemoCounts
```