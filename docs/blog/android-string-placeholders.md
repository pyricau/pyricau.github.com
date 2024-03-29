|:material-calendar-edit:|January 10, 2013|

This article reviews different ways to create dynamic translatable strings in Android.

## Quick reminder

In Android, message strings are extracted to XML files, and the system loads the resources corresponding to the current configuration.

<span class="label label-info">res/values/strings.xml</span>
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="sexy_button_title">Click me, I'm famous!</string>
</resources>
```

<span class="label label-info">res/values-fr/strings.xml</span>
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="sexy_button_title">Cliquez-moi, parce que je le vaux bien !</string>
</resources>
```

```java
Resources resources = context.getResources();
String sexyButtonTitle = resources.getString(R.string.sexy_button_title);
```

## Formatting strings

Let's say we want to display a dynamic string, such as *Player* **Foo** *- Score:* **42**.

We may be tempted to implement that quickly with `String.format()`.

<span class="label label-important">Wrong</span>
```xml
<string name="score_format">Player %s - Score: %d</string>
```

```java
Resources resources = context.getResources();
String scoreString = String.format(resources.getString(R.string.score_format), player, score);
```

You will get a compile time error message on the `<string />` definition.

!!! failure "Error"
    Multiple substitutions specified in non-positional format; did you mean to add the formatted="false" attribute?

This error message is misleading, because one may believe that using `formatted="false"` is the way to go.

<span class="label label-important">Still Wrong</span>
```xml
<string name="score_format" formatted="false">Player %s - Score: %d</string>
```

Although the error message now disappears, the real solution is to use a positional format.

<span class="label label-success">Right</span>
```xml
<string name="score_format">Player %1$s - Score: %2$d</string>
```

When translating strings, the word order will change.
For instance, *Name:* **John Smith** in English becomes *Nom :* **Smith John** in French.

```java
Resources resources = context.getResources();
String scoreString = String.format(resources.getString(R.string.name), firstname, lastname);
```

<span class="label label-info">res/values/strings.xml</span>
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="name">Name: %1$s %2$s</string>
</resources>
```

<span class="label label-info">res/values-fr/strings.xml</span>
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="name">Nom : %2$s %1$s</string>
</resources>
```

Using positional format prevents translation mistakes.

## getString()

Did you know that instead of `String.format()`, you can use an overloaded version of `getString()` that handles formatting?

```java
Resources resources = context.getResources();
String scoreString = resources.getString(R.string.score_format, player, score);
```

Is that stricly equivalent to the previous code? Let's look at the Android source!

```java
public class Resources {

    // …

    public String getString(int id, Object... formatArgs) throws NotFoundException {
        String raw = getString(id);
        return String.format(mConfiguration.locale, raw, formatArgs);
    }
}
```

Almost the same, except that we are using the resource configuration locale, whereas we were previously using the default locale.

```java
public final class String implements Serializable, Comparable<String>, CharSequence {

    // …

    public static String format(String format, Object... args) {
        return format(Locale.getDefault(), format, args);
    }
}
```

`Locale.getDefault()` is usually equal to `mConfiguration.locale`, so this won't really be a problem until you start messing with the default locale.

By the way, you probably know that `getString()` is also available on `Context`.

```java
String scoreString = context.getString(R.string.score_format, player, score);
```

What's the difference? None. It just delegates to `Resources`.

```java
public abstract class Context {

    // …

    public final String getString(int resId, Object... formatArgs) {
        return getResources().getString(resId, formatArgs);
    }
}
```

> If someone knows the story behind this weird shortcut method, let me know. For now, I'll just assume this is a consequence of Drunk Driven Development.

## Professional Translation

Your users deserve better than *Google translate*. XML resource files should be translated by a professional translator.

This translator will know nothing about your app internals. Therefore, it may be really hard to find out what those `%1$s` cryptic signs mean.

```xml
<string name="score_format">Player %1$s - Score: %2$d</string>
```

You can use comments to help the translator.

```xml
<!-- %1$s is the player nickname and %2$d is the player score -->
<string name="score_format">Player %1$s - Score: %2$d</string>
```

> By the way, if you need excellent quality software translation, I know someone that's been [translating software](http://rtsi.fr/) for more than 25 years. Yes, he is my father :) .

## Using placeholders

Another interesting approach is to use named placeholders instead of format specifiers.

I won't discuss which syntax is better for this kind of problem, let's just pick a simple one: `{placeholder}`.

```xml
<string name="score_format">Player {nickname} - Score: {score}</string>
```

I find this much more readable! Now, you'll need an API to transform that format to the final string. 

```java
TagFormat scoreFormat = TagFormat.from(getString(R.string.score_format));
scoreFormat.with("nickname", player);
scoreFormat.with("score", score);
String scoreString = scoreFormat.format();
```

Implementing this API is fairly straightforward.

```java
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
```

This is just an example implementation, I'll leave a better one to you as an exercice. An interesting point here is that `with()` returns `this`, so you can use it as a fluid API.

```java
String scoreString = TagFormat.from(getString(R.string.score_format))
  .with("nickname", player)
  .with("score", score)
  .format();
```

## Conclusion

I shamelessly stole this `{placeholder}` idea from [Eric Burke](https://twitter.com/burke_eric), and thought it was worth sharing. 

Of course, you may already use Java libraries that can do this. If you are aware of a good one that does a decent job, let me know!

## Comments


