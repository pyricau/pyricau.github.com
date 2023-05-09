|:material-calendar-edit:|December 27, 2012|

In Android, the standard way to display a list of items is to use `ListView` together with a `ListAdapter`. The `ListView` draws the currently shown items, and the `ListAdapter` provides the `ListView` with the `View` corresponding to each item.

The aim is to create only the necessary number of views to fill the screen, and reuse these views as soon as they disappear.

This article will explain various `ListAdapter` patterns and good practices.

## ArrayAdapter sucks

Let's say you want to display a list of `BananaPhone` that can be updated. 

Some Android tutorials advise using an `ArrayAdapter`, because it is supposedly easier. **This couldn't be any less true**.

`ArrayAdapter` has many limitations, which limits its use in real world apps.

An `ArrayAdapter`:

* Can only display text.
* Forces you to provide a list of `CharSequence` items or to rely on the `toString()` method of the given items.
* Requires that you provide a layout resource that contains only a `TextView`, or that you provide a `textViewResourceId` that corresponds to the `TextView` id in the layout hierarchy.
* Uses a lock to enable updates from background threads. This lock cannot be acquired to implement external atomic operations.

According to the Javadoc:

<span class="label label-important">Don't do this!</span>
> To use something other than TextViews for the array display, for instance, ImageViews, or to have some of data besides toString() results fill the views, override getView(int,android.view.View,android.view.ViewGroup) to return the type of view you want.

If you [read the source](http://grepcode.com/file/repository.grepcode.com/java/ext/com.google.android/android/4.1.1_r1/android/widget/ArrayAdapter.java), you'll realize that `ArrayAdapter` is designed to deal with a lot of use cases which you probably do not care about.

## BaseAdapter rocks

In most apps, it's actually a lot simpler to implement your own `BaseAdapter`:

```java
public class BananaPhoneAdapter extends BaseAdapter {

	private List<BananaPhone> bananaPhones = Collections.emptyList();

	private final Context context;

	// the context is needed to inflate views in getView()
	public BananaPhoneAdapter(Context context) {
		this.context = context;
	}

	public void updateBananas(List<BananaPhone> bananaPhones) {
		this.bananaPhones = bananaPhones;
		notifyDataSetChanged();
	}

	@Override
	public int getCount() {
		return bananaPhones.size();
	}

	// getItem(int) in Adapter returns Object but we can override
	// it to BananaPhone thanks to Java return type covariance
	@Override
	public BananaPhone getItem(int position) {
		return bananaPhones.get(position);
	}

	// getItemId() is often useless, I think this should be the default
	// implementation in BaseAdapter
	@Override
	public long getItemId(int position) {
		return position;
	}

	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
      // Let's look at that later
	}

}
```

## Thread safety

I mentioned that the `ArrayAdapter` uses a lock to ensure thread safety. That's fine, but there is an even better way: **get rid of threading**. Make sure your adapter is used only from one thread, the Main thread.

You can easily enforce that with a fail fast strategy:

```java
public void updateBananas(List<BananaPhone> bananaPhones) {
	ThreadPreconditions.checkOnMainThread();
	this.bananaPhones = bananaPhones;
	notifyDataSetChanged();
}
```

Here is an example implementation:

```java
public class ThreadPreconditions {
	public static void checkOnMainThread() {
		if (BuildConfig.DEBUG) {
			if (Thread.currentThread() != Looper.getMainLooper().getThread()) {
				throw new IllegalStateException("This method should be called from the Main Thread");
			}
		}
	}
}
```

## getView() recycling

A naive implementation of `getView()` could be:

```java
@Override
public View getView(int position, View convertView, ViewGroup parent) {

	View rootView = LayoutInflater.from(context)
	  .inflate(R.layout.banana_phone, parent, false);

	ImageView bananaView = (ImageView) rootView.findViewById(R.id.banana);
	TextView phoneView = (TextView) rootView.findViewById(R.id.phone);

	BananaPhone bananaPhone = getItem(position);
	phoneView.setText(bananaPhone.getPhone());
	bananaView.setImageResource(bananaPhone.getBanana());

	return rootView;
}
```

However, `ListView` recycles the views that are not shown any more, and gives them back through `convertView`. Let's take advantage of this:

```java
@Override
public View getView(int position, View convertView, ViewGroup parent) {

	if (convertView == null) {
		convertView = LayoutInflater.from(context)
		  .inflate(R.layout.banana_phone, parent, false);
	}

	ImageView bananaView = (ImageView) convertView.findViewById(R.id.banana);
	TextView phoneView = (TextView) convertView.findViewById(R.id.phone);

	BananaPhone bananaPhone = getItem(position);
	phoneView.setText(bananaPhone.getPhone());
	bananaView.setImageResource(bananaPhone.getBanana());

	return convertView;
}
```

## findViewById() mi amor

There is still one subtle problem with `getView()`: each time it is called, it retrieves `bananaView` and `phoneView` through `findViewById()`.

How does `findViewById()` work exactly ? Here is a simplified version:

```java
public View findViewById(int id) {
	if (this.id == id) {
		return this;
	}
	for(View child : children) {
		View view = child.findViewById(id);
		if (view != null) {
			return view;
		}
	}
	return null;
}
```

As you can see, `findViewById()` navigates through the whole view hierarchy until it finds the requested view, each time you call it.

Whether or not this is a problem is up to you. If your `ListView` scrolls fine even on crap devices, don't bother optimizing. Otherwise, start [traceview](http://developer.android.com/tools/help/traceview.html) and measure how much time is spent in `findViewById()`.

## ViewHolder Pattern

The **ViewHolder Pattern** is a well known pattern to limit the number of calls to `findViewById()`. The idea is that you call it once, then store the child view references in a `ViewHolder` instance that will be associated with the `convertView` thanks to `View.setTag()`.

```java

private static class ViewHolder {
	public final ImageView bananaView;
	public final TextView phoneView;

	public ViewHolder(ImageView bananaView, TextView phoneView) {
		this.bananaView = bananaView;
		this.phoneView = phoneView;
	}
}

@Override
public View getView(int position, View convertView, ViewGroup parent) {

	ImageView bananaView;
	TextView phoneView;
	if (convertView == null) {
		convertView = LayoutInflater.from(context)
		  .inflate(R.layout.banana_phone, parent, false);
		bananaView = (ImageView) convertView.findViewById(R.id.banana);
		phoneView = (TextView) convertView.findViewById(R.id.phone);
		convertView.setTag(new ViewHolder(bananaView, phoneView));
	} else {
		ViewHolder viewHolder = (ViewHolder) convertView.getTag();
		bananaView = viewHolder.bananaView;
		phoneView = viewHolder.phoneView;
	}

	BananaPhone bananaPhone = getItem(position);
	phoneView.setText(bananaPhone.getPhone());
	bananaView.setImageResource(bananaPhone.getBanana());

	return convertView;
}
```

## Tag with id

Here is an alternative to the **ViewHolder Pattern** that you can start using with Android 4.0 (API level 15). **Do not use it prior to ICS** (more on this below).

Since Android 1.6, there is an overloaded version of `View.setTag(int, Object)` that takes an `int` key. The `key => tag` association is stored in a [SparseArray](http://developer.android.com/reference/android/util/SparseArray.html) that belongs to the view. A key lookup is basically a binary search in an array containing the sorted keys.

> By the way, the `SparseArray` javadoc says that *it is intended to be more efficient than using a HashMap to map Integers to Objects*. The intent is nice, but that is quite a vague assertion. Is it more efficient in terms of space? runtime? Less GC? Under which conditions? Why does it need key ordering? E.g it could have been a hashtable implementation with int keys.

Notice how we reuse the view ids as tag keys:
```java
@Override
public View getView(int position, View convertView, ViewGroup parent) {

	ImageView bananaView;
	TextView phoneView;
	if (convertView == null) {
		convertView = LayoutInflater.from(context)
		  .inflate(R.layout.banana_phone, parent, false);
		bananaView = (ImageView) convertView.findViewById(R.id.banana);
		phoneView = (TextView) convertView.findViewById(R.id.phone);
		convertView.setTag(R.id.banana, bananaView);
		convertView.setTag(R.id.phone, phoneView);
	} else {
		bananaView = (ImageView) convertView.getTag(R.id.banana);
		phoneView = (TextView) convertView.getTag(R.id.phone);
	}

	BananaPhone bananaPhone = getItem(position);
	phoneView.setText(bananaPhone.getPhone());
	bananaView.setImageResource(bananaPhone.getBanana());

	return convertView;
}
```

As mentioned before, although the API is available since Android 1.6, you shouldn't use it prior to Android 4.0, because the implementation wasn't a per-view `SparseArray`.

`View.setTag(int, Object)` clearly wasn't designed with the **ViewHolder Pattern** in mind. The `key => tag` association was stored in a static `WeakHashMap` using the `View` object as the key. A `WeakHashMap` stores weak references to its keys. The idea was that as soon as a view wasn't referenced anywhere else then in the `WeakHashMap`, the entry could be garbage collected. However, if the value of a `WeakHashMap` entry contains a hard reference to its key (the view), it will never be garbage collected, and you'll get a **memory leak**. More on this [here](https://plus.google.com/u/0/104906570725395999813/posts/2cH1tw3bCy9), also see the [issue](http://code.google.com/p/android/issues/detail?id=18273).

## Custom item ViewGroup

There is a third way that provides better decoupling. The idea is to create a custom ViewGroup, e.g. `BananaPhoneView`, for each item. `BananaPhoneView` will keep the references to it child views. `BananaPhoneView` is now responsible for updating `bananaView` and `phoneView`.

```java
@Override
public View getView(int position, View convertView, ViewGroup parent) {
	BananaPhoneView bananaPhoneView;
	if (convertView == null) {
		bananaPhoneView = (BananaPhoneView) LayoutInflater.from(context)
		  .inflate(R.layout.banana_phone, parent, false);
	} else {
		bananaPhoneView = (BananaPhoneView) convertView;
	}

	BananaPhone bananaPhone = getItem(position);

	bananaPhoneView.update(bananaPhone);

	return bananaPhoneView;
}
```

## Custom item view

Your performance measurements may tell you that you spend too much time going through the view hierarchy when measuring and drawing. You can flatten your view hierarchy by combining components, or by creating a custom view that draws the whole item manually. That's how the mail list in Gmail works.

![Gmail Screenshot](images/gmail_screenshot.png)

If you haven't already, take at look at [Android Performance Case Study](http://www.curious-creature.org/2012/12/01/android-performance-case-study/).

## Conclusion

Adapters in Android are frightening at first, but when you get to know them, they are actually quite friendly beasts. The best way to get there is to read the Android source, as well as other apps source, such as [GitHub Android](https://github.com/github/android), [White House for Android](https://github.com/WhiteHouse/wh-app-android), or [ioshed](http://code.google.com/p/iosched/).

> Many thanks to [Frank Harper](http://twitter.com/franklinharper), [Eric Bottard](http://twitter.com/ebottard) and [Joan Zapata](http://twitter.com/JoanZap) for reviewing this article.

## Update

Benoît Lubek suggested another solution on [Google+](http://plus.google.com/107264729678111825621/posts/aykMojDjYxU).

The idea is to reproduce the `View.setTag(int, Object)` ICS+ behavior as an external API, relying on `View.setTag(Object)`:

```java
public class ViewHolder {
    // I added a generic return type to reduce the casting noise in client code
	@SuppressWarnings("unchecked")
	public static <T extends View> T get(View view, int id) {
		SparseArray<View> viewHolder = (SparseArray<View>) view.getTag();
		if (viewHolder == null) {
			viewHolder = new SparseArray<View>();
			view.setTag(viewHolder);
		}
		View childView = viewHolder.get(id);
		if (childView == null) {
			childView = view.findViewById(id);
			viewHolder.put(id, childView);
		}
		return (T) childView;
	}
}
```

This solution is elegant, and the code looks even simpler:

```java
@Override
public View getView(int position, View convertView, ViewGroup parent) {

	if (convertView == null) {
		convertView = LayoutInflater.from(context)
		  .inflate(R.layout.banana_phone, parent, false);
	}

	ImageView bananaView = ViewHolder.get(convertView, R.id.banana);
	TextView phoneView = ViewHolder.get(convertView, R.id.phone);

	BananaPhone bananaPhone = getItem(position);
	phoneView.setText(bananaPhone.getPhone());
	bananaView.setImageResource(bananaPhone.getBanana());

	return convertView;
}
```

I really like this approach!

## Comments


### [hub]()
You explain a difficult thing in a simple way.
Thank you very much.

### [James]()
Clear illustration of the choice of different adapters, very practical and very useful! Thanks!

### [Xiao]()
I was looking for a way to replace the entire list of items inside an ArrayAdapter without calling clear()/addAll() which generates garbage. This looks like a good solution (referring to the updateBananas() function).

### [imherolddev](http://www.imherolddev.com)
I have done a lot of research, written different adapters, duct taped and glued some together, and now that I come back to revisit ListView, I find your post! I hope to see a comparison between RecylerView and the ViewHolders you have described here. However, the BaseAdapter example has me excited to write my next Adapter, which should be far more complex than what I have done to date... Thank you for your write up here! I will be sure to share with my circles.

### [robertoallende](http://robertoallende.com)
Great article, you've saved my day. Thank you very much!

### [Mário Valney](http://mariovalney.com)
I really loved your article. Great explanation!
I confess I started with another approach, but when I read your article I just changed everything because it's much more elegant!
