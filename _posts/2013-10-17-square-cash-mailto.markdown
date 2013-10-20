---
layout: post
title: Square Cash - you owe me money!
filename: 2013-10-17-square-cash-mailto.markdown
more: 607
draft: false
# TO COMMENT, EDIT THIS FILE AND ADD YOUR COMMENT AT THE BOTTOM

---

This week, Square introduced [Square Cash](http://square.com/cash), a new service that lets you send money to your friends through email.

To use it, just send your friend an email with the **amount** in the **subject** and **Cc** **cash@square.com**.

That's it, you don't need to install any new app, go through a painful signup process, or use a specific email provider.

It's **free**, **simple**, [secure](https://squareup.com/help/en-us/article/5144-square-cash-security).

Here is a trick I'd like to share with you: you can make it even simpler for friends who owe you money by sending them a **mailto** link. Then, they just need to click on the link to open their favorite email app and send that worthy email.

{% highlight html %}
<a href="mailto:your@email.com?subject=$1&amp;cc=cash@square.com">Send me money!</a>
{% endhighlight %}


<p><a class="btn" href="mailto:py.ricau+casharticle@gmail.com?subject=$1&amp;cc=cash@square.com"><i class="icon-envelope"></i> Send me money! &raquo;</a></p>

I think that's a pretty cool way to collect money from your friends :) .

Side note: as of now, Square Cash only works in the US.

{% include comments.html %}

<!--

To comment, copy and paste the following block

## [Nickname](http://website)
Comment

-->
