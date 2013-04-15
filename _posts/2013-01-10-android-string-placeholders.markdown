---
layout: post
title: Android String Placeholders
filename: 2013-01-10-android-string-placeholders.markdown
more: 2032
draft: false
# TO COMMENT, EDIT THIS FILE AND ADD YOUR COMMENT AT THE BOTTOM

---

This article reviews different ways to create dynamic translatable strings in Android.

## <a id="Quick-reminder" href="#Quick-reminder">Quick reminder</a>

In Android, message strings are extracted to XML files, and the system loads the resources corresponding to the current configuration.

<span class="label label-info">res/values/strings.xml</span>
{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="sexy_button_title">Click me, I'm famous!</string>
</resources>
{% endhighlight %}

<span class="label label-info">res/values-fr/strings.xml</span>
{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="sexy_button_title">Cliquez-moi, parce que je le vaux bien !</string>
</resources>
{% endhighlight %}

{% highlight java %}
Resources resources = context.getResources();
String sexyButtonTitle = resources.getString(R.string.sexy_button_title);
{% endhighlight %}

## <a id="Formatting-strings" href="#Formatting-strings">Formatting strings</a>

Let's say we want to display a dynamic string, such as *Player **Foo** - Score: **42***.

We may be tempted to implement that quickly with `String.format()`.

<span class="label label-important">Wrong</span>
{% highlight xml %}
<string name="score_format">Player %s - Score: %d</string>
{% endhighlight %}

{% highlight java %}
Resources resources = context.getResources();
String scoreString = String.format(resources.getString(R.string.score_format), player, score);
{% endhighlight %}

You will get a compile time error message on the `<string />` definition.

<div class="alert alert-error">
<h4 class="alert-heading">Error</h4>
<p>Multiple substitutions specified in non-positional format; did you mean to add the formatted="false" attribute?</p>
</div>

This error message is misleading, because one may believe that using `formatted="false"` is the way to go.

<span class="label label-important">Still Wrong</span>
{% highlight xml %}
<string name="score_format" formatted="false">Player %s - Score: %d</string>
{% endhighlight %}

Although the error message now disappears, the real solution is to use a positional format.

<span class="label label-success">Right</span>
{% highlight xml %}
<string name="score_format">Player %1$s - Score: %2$d</string>
{% endhighlight %}

When translating strings, the word order will change.
For instance, *Name: **John Smith*** in English becomes *Nom : **Smith John*** in French.

{% highlight java %}
Resources resources = context.getResources();
String scoreString = String.format(resources.getString(R.string.name), firstname, lastname);
{% endhighlight %}

<span class="label label-info">res/values/strings.xml</span>
{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="name">Name: %1$s %2$s</string>
</resources>
{% endhighlight %}

<span class="label label-info">res/values-fr/strings.xml</span>
{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="name">Nom : %2$s %1$s</string>
</resources>
{% endhighlight %}

Using positional format prevents translation mistakes.

## <a id="getString" href="#getString">getString()</a>

Did you know that instead of `String.format()`, you can use an overloaded version of `getString()` that handles formatting?

{% highlight java %}
Resources resources = context.getResources();
String scoreString = resources.getString(R.string.score_format, player, score);
{% endhighlight %}

Is that stricly equivalent to the previous code? Let's look at the Android source!

{% highlight java %}
public class Resources {

    // …

    public String getString(int id, Object... formatArgs) throws NotFoundException {
        String raw = getString(id);
        return String.format(mConfiguration.locale, raw, formatArgs);
    }
}
{% endhighlight %}

Almost the same, except that we are using the resource configuration locale, whereas we were previously using the default locale.

{% highlight java %}
public final class String implements Serializable, Comparable<String>, CharSequence {

    // …

    public static String format(String format, Object... args) {
        return format(Locale.getDefault(), format, args);
    }
}
{% endhighlight %}

`Locale.getDefault()` is usually equal to `mConfiguration.locale`, so this won't really be a problem until you start messing with the default locale.

By the way, you probably know that `getString()` is also available on `Context`.

{% highlight java %}
String scoreString = context.getString(R.string.score_format, player, score);
{% endhighlight %}

What's the difference? None. It just delegates to `Resources`.

{% highlight java %}
public abstract class Context {

    // …

    public final String getString(int resId, Object... formatArgs) {
        return getResources().getString(resId, formatArgs);
    }
}
{% endhighlight %}

> If someone knows the story behind this weird shortcut method, let me know. For now, I'll just assume this is a consequence of **D**runk **D**riven **D**evelopment.

## <a id="Professional-Translation" href="#Professional-Translation">Professional Translation</a>

Your users deserve better than *Google translate*. XML resource files should be translated by a professional translator.

This translator will know nothing about your app internals. Therefore, it may be really hard to find out what those `%1$s` cryptic signs mean.

{% highlight xml %}
<string name="score_format">Player %1$s - Score: %2$d</string>
{% endhighlight %}

You can use comments to help the translator.

{% highlight xml %}
<!-- %1$s is the player nickname and %2$d is the player score -->
<string name="score_format">Player %1$s - Score: %2$d</string>
{% endhighlight %}

> By the way, if you need excellent quality software translation, I know someone that's been [translating software](http://rtsi.fr/) for more than 25 years. Yes, he is my father :) .

## <a id="Using-placeholders" href="#Using-placeholders">Using placeholders</a>

Another interesting approach is to use named placeholders instead of format specifiers.

I won't discuss which syntax is better for this kind of problem, let's just pick a simple one: `{placeholder}`.

{% highlight xml %}
<string name="score_format">Player {nickname} - Score: {score}</string>
{% endhighlight %}

I find this much more readable! Now, you'll need an API to transform that format to the final string. 

{% highlight java %}
TagFormat scoreFormat = TagFormat.from(getString(R.string.score_format));
scoreFormat.with("nickname", player);
scoreFormat.with("score", score);
String scoreString = scoreFormat.format();
{% endhighlight %}

Implementing this API is fairly straightforward.

{% highlight java %}
public class TagFormat {

	public static TagFormat from(String format) {
		return new TagFormat(format);
	}

	private final String format;
	private final Map<String, Object> tags = new LinkedHashMap<String, Object>();

	private TagFormat(String format) {
		this.format = format;
	}

	public TagFormat with(String key, Object value) {
		tags.put("\\{" + key + "\\}", value);
		return this;
	}

	public String format() {
		String formatted = format;
		for (Entry<String, Object> tag : tags.entrySet()) {
			// bottleneck, creating temporary String objects!
			formatted = formatted.replaceAll(tag.getKey(), tag.getValue().toString());
		}
		return formatted;
	}
}
{% endhighlight %}

This is just an example implementation, I'll leave a better one to you as an exercice. An interesting point here is that `with()` returns `this`, so you can use it as a fluid API.

{% highlight java %}
String scoreString = TagFormat.from(getString(R.string.score_format))
  .with("nickname", player)
  .with("score", score)
  .format();
{% endhighlight %}

## <a id="Conclusion" href="#Conclusion">Conclusion</a>

I shamelessly stole this `{placeholder}` idea from [Eric Burke](https://twitter.com/burke_eric), and thought it was worth sharing. 

Of course, you may already use Java libraries that can do this. If you are aware of a good one that does a decent job, let me know!

{% include comments.html %}

<!--

To comment, copy and paste the following block

## [Nickname](http://website)
Comment

-->
