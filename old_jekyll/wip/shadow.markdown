---
layout: post
title: 
filename: XXX.markdown
more: 0

---

Nice feature on TextView that's quite unknown : shadows.

A shadow makes your text look nice, more polished. Here are two examples of drop shadow and inner shadow :

Show image of screen split in two pieces, background color (for containing lay out), text avec inner et text avec drop, et separator. Notice how easy it is to create a separator.

Talk about dig effect with special shadow effect, bevel.

http://wiresareobsolete.com/wordpress/2012/04/textview-inner-shadows/

Now, make that textview a custom button, and have the background color change on touch. What would you do? Use a Button instead of a textview? Why would you do that?? Oh yeah, sure, because its called Button...

Let's look at the Button sources :

+ look for Button style.

So, as you can see, a Button is simply a TextView with a specific style. Would you guess what an image button is then?
Since we want a custom style for our button anyway, we can directly use a TextView and style it. We just need to create