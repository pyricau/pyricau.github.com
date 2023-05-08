---
date: 2011-10-01 11:00:41
layout: post
title: Un peu de style dans la TextView
permalink: /2011/10/01/un-peu-de-style-dans-la-textview/
filename: 2011-10-01-un-peu-de-style-dans-la-textview.markdown
more: 601
# TO COMMENT, EDIT THIS FILE AND ADD YOUR COMMENT AT THE BOTTOM

---
Les designers qui définissent les écrans de votre **application Android** se sont fait plaisir, et vous ont demandé une **mise en forme** bien chiadée pour les **textes** de votre application.

Avant de vous jeter sur Photoshop pour créer des images correspondant au pixel près à ce qu'ils attendent, pourquoi ne pas garder votre bonne vieille [TextView](http://developer.android.com/reference/android/widget/TextView.html) ?

Pour changer un peu des récents articles sur GWT, voici quelques petites astuces pour Android.

## Tweak la police


Par défaut, Android ne propose que trois polices de caractères pour les TextView : **monospace**, **sans** et **serif**.

Toutefois, il est tout à fait possible d'utiliser votre police préférée, à condition de l'**embarquer** dans votre application.

Il suffit de copier la police dans le répertoire **assets** de votre projet Android, puis de la charger **au Runtime** :

{% highlight java %}
@Override
protected void onCreate(Bundle savedInstanceState) {.
  super.onCreate(savedInstanceState);

  setContentView(R.layout.main);
  TextView myTextView = (TextView) findViewById(R.id.myTextView);

  Typeface myFont = Typeface.createFromAsset(getAssets(), "MyFont.otf");
  myTextView.setTypeface(myFont);
}
{% endhighlight %}

Il n'est pas possible de le faire directement dans votre fichier de layout, sauf en créant des [composants alternatifs](http://stackoverflow.com/questions/2973270/using-a-custom-typeface-in-android/5185587#5185587).


## Stylé !


Votre texte doit comporter des morceaux en couleur, en italique... ; bref, il doit être **mis en forme**.

Avant d'envisager la création d'une TextView pour chaque morceau de texte différent, jetez un oeil à [Spannable](http://developer.android.com/reference/android/text/Spannable.html), et surtout à son cousin germain [Html](http://developer.android.com/reference/android/text/Html.html).

[Html.fromHtml()](http://developer.android.com/reference/android/text/Html.html#fromHtml%28java.lang.String%29) retourne un [Spanned](http://developer.android.com/reference/android/text/Spanned.html), qui peut être utilisé pour définir le contenu d'une TextView.

Par exemple :
{% highlight java %}
Spanned spanned = Html.fromHtml("Hello <b>World</b>!")
myTextView.setText(spanned);
{% endhighlight %}

Bien entendu, une **String** en dur dans le code, **c'est moche** (pas très [i18n](http://en.wikipedia.org/wiki/Internationalization_and_localization)).

Pour y remédier, il suffit d'encadrer dans un **CDATA** le texte contenant le markup Html, au sein de vos fichiers de ressources.

Exemple de _res/values/strings.xml_ :
{% highlight xml %}
<?xml version="1.0" encoding="utf-8"?>
<resources>
  <string name="styled_content"><![CDATA[I like turtles!<br />Hello <font color="#99cc33"><b>World</b></font>!]]></string>
</resources>
{% endhighlight %}

Malheureusement, vous ne pouvez pas utiliser ces ressources directement dans vos fichiers de **layout** ; il faut en passer par du **code Java** :
{% highlight java %}
@Override
protected void onCreate(Bundle savedInstanceState) {.
  super.onCreate(savedInstanceState);

  setContentView(R.layout.main);
  TextView myTextView = (TextView) findViewById(R.id.myTextView);

  myTextView.setText(Html.fromHtml(getString(R.string.styled_content)));
}
{% endhighlight %}

Notez que le support du HTML reste **limité** (nombre de balises supportées, HTML mal formé, balises les unes dans les autres...)


## Bonus




	
  * **Linkify** permet de créer des TextViews contenant des liens cliquables de toute sorte. A ce sujet, je vous recommande l'[excellent article](http://developer.android.com/resources/articles/wikinotes-linkify.html) disponible sur la doc Android.

	
  * Quels liens entre design Web et design Android ? Un [article tout récent](http://android-developers.blogspot.com/2011/09/thinking-like-web-designer.html) sur le blog Android aborde le sujet.

{% include comments.html %}



