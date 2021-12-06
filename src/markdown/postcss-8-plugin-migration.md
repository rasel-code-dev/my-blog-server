[Home](https://evilmartians.com/)

[Case Studies](https://evilmartians.com/#clients)[Services](https://evilmartians.com/#services)[Open Source](https://evilmartians.com/#oss)[Careers](https://evilmartians.com/jobs)

[Blog](https://evilmartians.com/chronicles)



[Talk to us](https://evilmartians.com/#talk-to-us)

![img](https://cdn.evilmartians.com/front/posts/postcss-8-plugin-migration/cover-cb37303.png)

Frontend

# **PostCSS 8.0:** Plugin migration guide

September 14, 2020

![Andrey Sitnik](https://secure.gravatar.com/avatar/cd32d17c95d3bfb352504c36462b98bd?default=identicon&size=200)

Andrey Sitnik

Author of PostCSS and Autoprefixer, Lead Frontend Developer at Evil Martians

- 

  ​                  

- 

  ​                  

#### Translations

- Chinese:[PostCSS 8 插件迁移的二三事](https://www.w3ctech.com/topic/2226)

If you’re interested in translating or adapting this post, please[email us first](mailto:surrender@evilmartians.com?subject=Translation Request%3A https://evilmartians.com/chronicles/postcss-8-plugin-migration).

PostCSS received a major update with the release of version 8.0  codenamed “President Ose”. Plugin creators can now opt in for a new API  that сan increase build speeds and reduce the size of dependencies for  the end-users of their tools. This guide describes steps you need  to take as a plugin developer to make the most out of the improved  framework.

PostCSS—a framework for processing CSS with JavaScript—is one  of the most popular frontend tools for the modern web with over 25  million downloads [a week](https://www.npmtrends.com/postcss).

> The reason why so much code depends on it is the trust from big projects like [webpack](https://webpack.js.org/) or [Rails](https://rubyonrails.org/), and the universe of [plugins](https://www.postcss.parts/) that improve the way frontend developers write CSS.

Read more about PostCSS in our blog:

[PostCSS 8.0 is coming: Here’s what it brings](https://evilmartians.com/chronicles/postcss-8-is-coming-here-is-what-it-brings)

[Five years of PostCSS: State of the Union](https://evilmartians.com/chronicles/five-years-of-postcss-state-of-the-union)

Simple JavaScript rules can either automate routine tasks like  linting and adding vendor prefixes or enable novel ways of creating  stylesheets that are not directly supported by current web standards.

If you develop or maintain plugins for PostCSS—this post is for you.  It lists the main things you should do to make your code conform  to the latest version of the framework.

Take a look at the full [description](https://github.com/postcss/postcss/releases/tag/8.0.0) of the latest release on GitHub to learn what else is new in PostCSS  8.0, including better source maps support and more resilient CSS  parsing.

## Why do I need to update my plugin?

The previous versions of PostCSS had some limitations with regards to plugins:

- **Speed**. Even if your plugin changes just a few style  properties, it walks through the whole Abstract Syntax Tree of a CSS  bundle. As different plugins are often used together, each of them needs to pass the whole tree on any property update—slowing down CSS builds  for end-users.
- **Size of node_modules**. Plugins can list different versions of PostCSS under their `dependencies`. It can cause the resulting `node_modules` folder to bloat if npm’s deduplication fails to do its job.
- **Compatibility**. Plugins designed for older versions of PostCSS can use deprecated ways to build nodes (e.g., `postcss.decl()`). Mixing AST nodes created by different PostCSS versions can cause painful bugs.

## Step 1: Move `postcss` to `peerDependencies`

The first step is very simple. Just remove PostCSS version 7 from your `dependencies` and add PostCSS version 8 to `devDependencies`.

```
npm uninstall postcss
npm install postcss --save-dev
```

Then move PostCSS 8 to `peerDependencies` by editing your `package.json`:

```
  "dependencies": {
-   "postcss": "^7.0.10"
  },
  "devDependencies": {
+   "postcss": "^8.0.0"
  },
+ "peerDependencies": {
+   "postcss": "^8.0.0"
+ }
}
```

That will keep the size of the end-user’s `node_modules` under control: now, all plugins will use the same version of `postcss` as a dependency.

If your `dependencies` is now empty, feel free to remove it:



```
- "dependencies": {
- }
  "devDependencies": {
```

Don’t forget to change [installation instructions](https://github.com/postcss/postcss-focus#usage) in your plugin’s documentation:

```
- npm install --save-dev postcss-focus
+ npm install --save-dev postcss postcss-focus
```

## Step 2: Use the updated API

1. Replace `module.exports = postcss.plugin(name, creator)` with `module.exports = creator`.
2. Return an object with `postcssPlugin` property containing a plugin name and the `Once` method.
3. Move plugin code to the `Once` method.
4. Add `module.exports.postcss = true` to the end of the file.

Before:

```
- module.exports = postcss.plugin('postcss-dark-theme-class', (opts = {}) => {
-   checkOpts(opts)
-   return (root, result) => {
      root.walkAtRules(atrule => { … })
-   }
- })
```

After:

```
+ module.exports = (opts = {}) => {
+   checkOpts(opts)
+   return {
+     postcssPlugin: 'postcss-dark-theme-class',
+     Once (root, { result }) {
        root.walkAtRules(atrule => { … })
+     }
+   }
+ }
+ module.exports.postcss = true
```

Do not forget about `module.exports.postcss = true`. It allows PostCSS to distinguish between `require('plugin')` and `require('plugin')(opts)` end-user calls.

## Step 3: Take the most out of the new API

PostCSS 8 does a single CSS tree scan. Multiple plugins can leverage the same scan for better performance.

To use the single scan you need to remove `root.walk*` calls and move the code to `Declaration()`, `Rule()`, `AtRule()` or `Comment()` methods in a plugin’s object:

```
  module.exports = {
    postcssPlugin: 'postcss-dark-theme-class',
-   Once (root) {
-     root.walkAtRules(atRule => {
-       // Slow
-     })
-   }
+   AtRule (atRule) {
+     // Faster
+   }
  }
  module.exports.postcss = true
```

The full list of plugin’s events can be find in [API docs](https://postcss.org/api/#plugin).

`AtRule` listener will visit node again if somebody will change at-rule parameters or any children inside at-rule.

It is important to avoid plugin freeze: plugin adds children  to at-rule, PostCSS calls plugin again on this at-rule, plugin add  another childre.

```
module.exports = {
  postcssPlugin: 'postcss-',
  AtRule (atRule) {
    if (atRule.every(child => child.selector !== '.test')) {
      atRule.append({ selector: '.test' })
    }
  }
}
module.exports.postcss = true
```

For declarations and *at-rules* you can make your code even faster by subscribing to a specific declaration property or an *at-rule* name:

```
  module.exports = {
    postcssPlugin: 'postcss-example',
-   AtRule (atRule) {
-     if (atRule.name === 'media') {
-       // Faster
-     }
-   }
+   AtRule: {
+     media: atRule => {
+       // The fastest
+     }
+   }
  }
  module.exports.postcss = true
```

Note that plugins will re-visit all changed or added nodes. You  should check if your transformations were already applied and if that  is the case—ignore those nodes. Only `Once` and `OnceExit` listeners will be called exactly once.

```
const plugin = () => {
  return {
    Declaration(decl) {
      console.log(decl.toString());
      decl.value = "red";
    },
  };
};
plugin.postcss = true;

await postcss([plugin]).process("a { color: black }", { from });
// => color: black
// => color: red
```

If you have a large plugin that is hard to rewrite, it is OK to keep using `walk` method inside your `Root` listener.

There are two types of listeners: for “enter” and for “exit”. `Once`, `Root`, `AtRule`, or `Rule` will be called *before* processing children. `OnceExit`, `RootExit`, `AtRuleExit`, and `RuleExit`—*after* processing all the children of the node.

If you need a way to share data between listeners, you can use `prepare()`:

```
module.exports = (opts = {}) => {
  return {
    postcssPlugin: "PLUGIN NAME",
    prepare(result) {
      const variables = {};
      return {
        Declaration(node) {
          if (node.variable) {
            variables[node.prop] = node.value;
          }
        },
        OnceExit() {
          console.log(variables);
        },
      };
    },
  };
};
```

## Step 4: Remove `postcss` imports

With the new PostCSS plugin API, you do not need to import `postcss`. You will get all classes and methods as a second argument to your `Root` function:

```
- const { list, Declaration } = require('postcss')

  module.exports = {
    postcssPlugin: 'postcss-example',
-   Once (root) {
+   Once (root, { list, Declaration }) {
      …
    }
  }
  module.exports.postcss = true
```

That is also something that you can keep as-is for a while if you don’t feel like doing it immediately.

## Step 5: Reduce the npm package size

That is not a mandatory step, but we want to promote an amazing tool for keeping your `package.json` clean of development configs before publishing your package to npm: [clean-publish](https://github.com/shashkovdanil/clean-publish). If the PostCSS ecosystem starts to use it, we will make `node_modules` even smaller.

Add it to your project:

```
npm install --save-dev clean-publish
```

Now use `npx clean-publish` instead of `npm publish`.

You can use the official [Plugin Boilerplate](https://github.com/postcss/postcss-plugin-boilerplate) and these plugins as an example for the adoption of a new API:

- [`postcss-dark-theme-class`](https://github.com/postcss/postcss-dark-theme-class)
- [`postcss-mixins`](https://github.com/postcss/postcss-mixins)

We also recommend using [Sharec](https://lamartire.github.io/sharec/) to manage your development configuration and share it between projects. [Here](https://github.com/postcss/postcss-sharec-config) you can find the shared config for PostCSS.

We have a [Gitter chat](https://gitter.im/postcss/postcss) open for all your questions! Don’t hesitate to talk to us about  the migration or your plugin’s syntax and architecture. We are happy  to help.

------

If you are looking for a commercial advice on a custom PostCSS  integration, thinking about setting up better development practices for  your technical team or need a revision of your product’s frontend  infrastructure—feel free to [contact](https://evilmartians.com/talk-to-us) Evil Martians.

<iframe id="twitter-widget-0" scrolling="no" allowtransparency="true" allowfullscreen="true" class="twitter-share-button twitter-share-button-rendered twitter-tweet-button" style="position: static; visibility: visible; width: 73px; height: 20px;" title="Twitter Tweet Button" src="https://platform.twitter.com/widgets/tweet_button.a53eecb4584348a2ad32ec2ae21f6eae.en.html#dnt=false&amp;id=twitter-widget-0&amp;lang=en&amp;original_referer=https%3A%2F%2Fevilmartians.com%2Fchronicles%2Fpostcss-8-plugin-migration&amp;size=m&amp;text=PostCSS%208.0%3A%20Plugin%20migration%20guide&amp;time=1636614218568&amp;type=share&amp;url=https%3A%2F%2Fevilmartians.com%2Fchronicles%2Fpostcss-8-plugin-migration&amp;via=evilmartians" frameborder="0"></iframe>



If you’re interested in translating or adapting this post, please[email us first](mailto:surrender@evilmartians.com?subject=Translation Request%3A https://evilmartians.com/chronicles/postcss-8-plugin-migration).













Extraterrestrial product development consultancy

•[Talk to us](https://evilmartians.com/#talk-to-us)

[                                    Twitter link](https://twitter.com/evilmartians)[                                    Facebook link](https://www.facebook.com/evilmartians)[                                    Instagram link](https://www.instagram.com/evil.martians/)[                                    LinkedIn link](https://www.linkedin.com/company/evil-martians)[                                    GitHub link](https://github.com/evilmartians)[Dribbble link](https://dribbble.com/evilmartians)

[Evil Martians](https://evilmartians.com/)