---
layout: post
title: Renaming the Android Manifest package
filename: 2012-12-20-renaming-android-manifest-package.markdown
more: 292
# TO COMMENT, EDIT THIS FILE AND ADD YOUR COMMENT AT THE BOTTOM

---

I recently needed to be able to change the package name of an app at build time. This is a common need when you have a paid and a free version of an app. It's also useful if you want to be able to install multiple versions of an app on your phone, such as a "dev" and a "stable" build.

One way to do it is to transform the whole project as a library project, and then create one final project for each version, that depends on the library project.

## Aapt magic

There is another way: **aapt** has a `--rename-manifest-package` parameter that rewrites the package name of the binary `AndroidManifest.xml` file in the final APK.

Here is what **aapt** help says:

{% highlight bash %}
   --rename-manifest-package
       Rewrite the manifest so that its package name is the package name
       given here.  Relative class names (for example .Foo) will be
       changed to absolute names with the old package so that the code
       does not need to change.
{% endhighlight %}

The great advantage is that your code won't change, the R class stays identical.

## Ant

Since [r17](http://code.google.com/p/android/issues/detail?id=21336), this option is available in the **aapt** Ant task, through the `manifestpackage` attribute. You'll need to override the `-package-resources` target, copied from the SDK `build.xml`:

{% highlight xml %}
<target name="-package-resources" depends="-crunch">
  <do-only-if-not-library elseText="Library project: do not package resources..." >
    <aapt executable="${aapt}"
     manifestpackage="com.my.package"
    >
...
    </aapt>
  </do-only-if-not-library>
</target>
{% endhighlight %}

## Maven

The `android:apk` goal of the **android-maven-plugin** has a [renameManifestPackage](http://maven-android-plugin-m2site.googlecode.com/svn/apk-mojo.html#renameManifestPackage) parameter.

## One last thing

If you load some resource ids at runtime, you may need to update your code.

I used to do this:

{% highlight java %}
String packageName = context.getPackageName();
Resources res = context.getResources();
int id = res.getIdentifier("my_drawable", "drawable", packageName);
{% endhighlight %}

This usually works great, especially in library projects where you do not know the package name.

However, the problem here is that the resources were processed before the package name was finally updated. So `packageName` is wrong.

It's easy to fix though, by retrieving the package name of another resource with `Resources.getResourcePackageName()`.

Let's create a resource id dedicated to that purpose, for example in `res/values/ids.xml`:

{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:android="http://schemas.android.com/apk/res/android">
    <item name="used_for_package_name_retrieval" type="id"/>
</resources>
{% endhighlight %}

And now we get the right package:

{% highlight java %}
Resources res = context.getResources();
String packageName = res.getResourcePackageName(R.id.used_for_package_name_retrieval);
int id = res.getIdentifier("some_drawable", "drawable", packageName);
{% endhighlight %}

## Conclusion

This tip helps creating different versions of the same app. 

![](/static/blog_img/manifest_package.png)

As you can see on this screenshot, the package name can then be set as a build parameter, to create parameterized builds in Jenkins.

{% include comments.html %}

<!--

To comment, copy and paste the following block

## [Nickname](http://website)
Comment

-->
