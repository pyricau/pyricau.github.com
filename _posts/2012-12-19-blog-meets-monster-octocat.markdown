---
layout: post
title: Blog meets Monster Octocat
filename: 2012-12-19-blog-meets-monster-octocat.markdown
more: 121
# TO COMMENT, EDIT THIS FILE AND ADD YOUR COMMENT AT THE BOTTOM

---
I initially created this blog on Wordpress.com, mostly because I didn't want to invest any time in maintaining it.

I've been using GitHub and Markdown on an everyday basis ever since. I got bored of Wordpress, therefore I decided to migrate this blog to [Jekyll](https://github.com/mojombo/jekyll), using the built-in [GitHub support](http://pages.github.com/).

[![](/static/blog_img/murakamicat.png)](http://www.github.com)

This means I can write my articles in Markdown with [Mou](http://mouapp.com/), and just commit and push to publish an article.

Even better, anyone can now [improve this article](https://github.com/pyricau/pyricau.github.com/blob/master/_posts/{{ page.filename }}) with a pull request. I really like this!

Jekyll generates static html pages. What about comments? Most Jekyll hosted blogs use external javascript services to dynamically include comments at the end of their blog posts. This doesn't feel right to me, because I think comments ought to be part of the content they are linked to.

That's why comments are now part of the source of the post. All you need to do is [click here](https://github.com/pyricau/pyricau.github.com/blob/master/_posts/{{ page.filename }}), edit the post on GitHub and add your comments at the end.

{% highlight bash %}
## [Piwaï](http://piwai.info)
Hello!
{% endhighlight %}

Let's see if that's something you are able to do ;-) .

> By the way, I also started writing in English, trying to reach a broader audience and practice my writing. Let me know if you find weird french looking sentences.

{% include comments.html %}

<!--

To comment, copy and paste the following block

## [Nickname](http://website)
Comment

-->

## [gnupat](http://bisouland.piwai.info)

Great idea, I can't wait to see how the PR driven comments are going :D .

By the way, am I doing this right?

## [Aurélien](http://blogpro.toutantic.net)
It's turtles all the way down !
And the comment button is displayed twice at the end of your post.

## [Piwaï](http://piwai.info)
Turns out, all comments pull request are located at the same position so this leads to merge conflicts (easy to fix though). Comments is displayed twice on purpose, as you can see now that there are actual comments. Maybe I should remove the first one.

