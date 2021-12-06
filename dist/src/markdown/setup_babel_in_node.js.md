



# How to Setup Babel in Node.js

![Alvin Okoro](https://www.freecodecamp.org/news/content/images/size/w100/2021/08/23F62105-5D26-4A02-8005-41CCF6873E8E.jpeg)

![How to Setup Babel in Node.js](https://www.freecodecamp.org/news/content/images/size/w2000/2021/08/CREATE.png)                            

Node.js is one of the most popular back-end  technologies out there right now. It is friendly, robust, and  well-maintained and it's not going anywhere anytime soon. 

To help you learn how to use it effectively, in this article we will create a  simple server using Node with Babel configured in our code. 

But before we take a deep dive into building out our server, let's learn more about what Babel is.

## What is Babel? 

Babel is a JavaScript compiler. It's a popular tool that helps you use the  newest features of the JavaScript programming language.

## Why use Babel in Node.js?

Have you ever opened a back end repo built with Node.js/Express – and the  very first thing you saw was the ES6 import and export statements along  with some other cool ES6 syntax features? 

Well, Babel made all  that possible. Remember that Babel is a popular tool that lets you use  the newest features of JavaScript. And many frameworks today use Babel  under the hood to compile their code.

For example, Node can't use  ES6 import and export statements and some other cool features of ES6  syntax without the help of a compiler like Babel. 

So in this tutorial, I'll show you how to quickly setup your Node app to be compatible with most ES6 syntax. 

Awesome right? Let's dive in.

## Prerequisites

This tutorial assumes that that you have the following:

- Basic knowledge of Node.js
- Node installed on your machine
- Any code or text editor of your choice

## Getting Started

Let's setup a basic Node app which we will use for this tutorial.

Create a new folder. For this tutorial, I'll call mine node-babel. Now add the folder to the workspace, and open your terminal. 

Let's initialize and create a package.json file for our app:

```js
npm init
```

This command will show some setup steps which we want to leave as it is. So  hitting the enter or return key throughout the setup will work fine. 

Now once you're done, create a new file called "index.js" which will serve as our entry point.

### How to Set Up And Install Babel

Now, we will install three packages from the Babel family which are: 

```js
@babel/cli, @babel/core and @babel/preset-env
```

To install, we use the command below to install the package:

```js
npm install --save-dev @babel/cli @babel/core @babel/preset-env
```

We want to use the **--save-dev** to install them as dependencies for the development of your module.

So once you're done with the installation, create a new file called **.babelrc** for configuring babel. 

```js
touch .babelrc
```

This file will host all of the options we want to add to Babel. So for now,  let's use the setup which I normally use for development in my app. You  can copy it and add to yours:

```js
{
  "presets": [
    ["@babel/env", {
      "targets": {
        "node": "current"
      }
    }]
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread"
  ]
}
```

The  configuration above is what I use to tell Babel that yes, I want to use  not only my import and export statements but also the class feature as  well as the rest and spread operators from ES6.

Awesome yeah? Let's move on.

### How to Set Up A Simple Server

Now open up the "index.js" file we created earlier, and add this code to generate a simple server:

```js
import http from 'http';

const server = http.createServer((req, res) => {
  res.end('Hello from the server');
}).listen(4001);

console.log('Server is up and running');

export default server;
```

With the sample code above our server will listen on port 4001 and then send a "Hello from the server" response to us whenever we visit the port.

### Package.json Script Configurations.

We now have a simple server. To run this, we have to transpile our code before running with Node. To do this, open the **"package.json"** file and add this build and start script:

```js
  "scripts": {
+   "build": "babel index.js -d dist",
    "start": "npm run build && node dist/index.js"
  }
```

Nice – so let's start our server with this command:

```js
npm start
```

You should get this response once you visit localhost:4001

![img](https://www.freecodecamp.org/news/content/images/2021/08/Screenshot_16.png)

## How to Use Nodemon to Watch and Restart Your Server

To prevent restarting the server yourself whenever you make changes to  your app, we need to install nodemon. You can install nodemon to your  application using this command to install it as a dev dependency:

```js
npm install --save-dev nodemon
```

And then we  reconfigure our package.json scripts:

```js
  "scripts": {
    "build": "babel index.js -d dist",
    "start": "npm run build && nodemon dist/index.js"
  }
```

Awesome, now this is the final code of our Node app and what you should get when you run "npm start" to start up your server.

![img](https://www.freecodecamp.org/news/content/images/2021/08/Screenshot_13.png)

As you can see from the image above, our server is up and running. You can now make use of the import and export statement from the es6 syntax and other awesome features es6 provides like the rest and spread operators  in your Node application.

## Conclusion

In this tutorial, we've learned how to use the awesome ES6 syntax in our Node app using Babel. 

Note that you can add more configurations in your .babelrc file. It is not  limited to what we have in this tutorial – so feel free to tweak or  change it.

You can find the sample code here: https://github.com/Veri5ied/node-babel

Happy Hacking!

------

![Alvin Okoro](https://www.freecodecamp.org/news/content/images/size/w100/2021/08/23F62105-5D26-4A02-8005-41CCF6873E8E.jpeg)

[Alvin Okoro](https://www.freecodecamp.org/news/author/alvin/)

Hi😁! I am Alvin, a software engineer. I love building  awesome stuffs, exploring new technologies as well as providing support  through mentorship and tutorials  to developers 

------

​    If you read this far, tweet to the author to show them you care. Tweet a thanks

​        Learn to code for free. freeCodeCamp's open source curriculum  has helped more than 40,000 people get jobs as developers. [Get started](https://www.freecodecamp.org/learn/)    

​                    freeCodeCamp is a donor-supported tax-exempt  501(c)(3) nonprofit organization (United States Federal Tax  Identification Number: 82-0779546)                

​                    Our mission: to help people learn to code for free.  We accomplish this by creating thousands of videos, articles, and  interactive coding lessons - all freely available to the public. We also have thousands of freeCodeCamp study groups around the world.                

​                    Donations to freeCodeCamp go toward our education initiatives and help pay for servers, services, and staff.                

​                    You can [make a tax-deductible donation here](https://www.freecodecamp.org/donate/).                

Trending Guides

​                        [Big O Notation](https://www.freecodecamp.org/news/big-o-notation-examples-time-complexity-explained/)                        [SQL Outer Join](https://www.freecodecamp.org/news/sql-outer-join-tutorial-with-example-syntax/)                        [Python For Loop](https://www.freecodecamp.org/news/python-for-loop-for-i-in-range-example/)                        [What is JavaScript?](https://www.freecodecamp.org/news/what-is-javascript-definition-of-js/)                        [Learn How To Code](https://www.freecodecamp.org/news/how-to/)                        [Chrome Bookmarks](https://www.freecodecamp.org/news/chrome-bookmarks-location-guide-how-to-delete-or-recover-a-bookmark/)                        [Concatenate Excel](https://www.freecodecamp.org/news/concatenate-in-excel-how-to-combine-text-and-concat-strings/)                        [C# String to Int](https://www.freecodecamp.org/news/how-to-convert-a-string-to-an-int-in-c-tutorial-with-example-code/)                        [Git Switch Branch](https://www.freecodecamp.org/news/git-switch-branch/)                        [JavaScript Splice](https://www.freecodecamp.org/news/javascript-splice-how-to-use-the-splice-js-array-method/)                    

​                        [HTML Link](https://www.freecodecamp.org/news/html-button-link-code-examples-how-to-make-html-hyperlinks-using-the-href-attribute-on-tags/)                        [Bayes Rule](https://www.freecodecamp.org/news/bayes-rule-explained/)                        [Python Map](https://www.freecodecamp.org/news/python-map-function-how-to-map-a-list-in-python-3-0-with-example-code/)                        [HTML Italics](https://www.freecodecamp.org/news/html-italics-tutorial-how-to-make-text-italic-with-the-i-tag/)                        [Python SQL](https://www.freecodecamp.org/news/python-sql-how-to-use-sql-databases-with-python/)                        [HTML Bold](https://www.freecodecamp.org/news/html-bold-text-tutorial-how-to-use-the-b-tag/)                        [GraphQL VS Rest](https://www.freecodecamp.org/news/graphql-vs-rest-benefits-and-code-example-comparisons/)                        [If Function Excel](https://www.freecodecamp.org/news/if-function-excel-tutorial-and-how-to-do-multiple-if-statements-in-excel/)                        [HTML List](https://www.freecodecamp.org/news/html-list-how-to-use-bullet-points-ordered-and-unordered-lists/)                        [Wav File](https://www.freecodecamp.org/news/wav-file-format-how-to-open-a-wav-and-convert-wavs-to-mp3/)                    

​                            [Model View Controller ](https://www.freecodecamp.org/news/the-model-view-controller-pattern-mvc-architecture-and-frameworks-explained/)                            [Git Checkout Remote Branch](https://www.freecodecamp.org/news/git-checkout-remote-branch-tutorial/)                            [Insert Checkbox in Word](https://www.freecodecamp.org/news/how-to-insert-a-checkbox-in-word/)                            [Find and Replace in Word](https://www.freecodecamp.org/news/find-and-replace-in-word-a-microsoft-office-tutorial/)                            [C Programming Language](https://www.freecodecamp.org/news/what-is-the-c-programming-language-beginner-tutorial/)                        

​                            [Subnet Cheat Sheet](https://www.freecodecamp.org/news/subnet-cheat-sheet-24-subnet-mask-30-26-27-29-and-other-ip-address-cidr-network-references/)                            [String to Char Array Java](https://www.freecodecamp.org/news/string-to-char-array-java-tutorial/)                            [JavaScript Append to Array](https://www.freecodecamp.org/news/javascript-append-to-array-a-js-guide-to-the-push-method-2/)                            [Add Page Numbers in Word](https://www.freecodecamp.org/news/page-numbers-in-word-tutorial-how-to-insert-a-page-number-in-microsoft-word/)                            [JavaScript Projects](https://www.freecodecamp.org/news/javascript-projects-for-beginners/)                        

Our Nonprofit

​                [About](https://www.freecodecamp.org/news/about/)                [Alumni Network](https://www.linkedin.com/school/free-code-camp/people/)                [Open Source](https://github.com/freeCodeCamp/)                [Shop](https://www.freecodecamp.org/shop/)                [Support](https://www.freecodecamp.org/news/support/)                [Sponsors](https://www.freecodecamp.org/news/sponsors/)                [Academic Honesty](https://www.freecodecamp.org/news/academic-honesty-policy/)                [Code of Conduct](https://www.freecodecamp.org/news/code-of-conduct/)                [Privacy Policy](https://www.freecodecamp.org/news/privacy-policy/)                [Terms of Service](https://www.freecodecamp.org/news/terms-of-service/)                [Copyright Policy](https://www.freecodecamp.org/news/copyright-policy/)            