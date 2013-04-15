---
date: 2011-09-05 10:59:39
layout: post
title: Coloration Syntaxique en GWT
permalink: /2011/09/05/coloration-syntaxique-en-gwt/
filename: 2011-09-05-coloration-syntaxique-en-gwt.markdown
more: 528
# TO COMMENT, EDIT THIS FILE AND ADD YOUR COMMENT AT THE BOTTOM

---

Vous connaissez peut-être [Rockslide](http://pyricau.github.com/rockslide), qui permet de réaliser une présentation (des slides) en [GWT](http://code.google.com/webtoolkit).

Qui dit **slides techniques** dit exemples de **code**, et donc **coloration syntaxique**.

J'ai creusé un peu le sujet pour finalement retenir **une solution**.

**Comment faire de la coloration syntaxique côté client, en GWT ?**


## Solutions disponibles

A ma connaissance, il n'existe pas de solution de coloration syntaxique spécifique à GWT, ce qui nous laisse trois options :


	
  * Implémenter une solution en GWT (c'est mort, je n'ai pas que ça à faire)

	
  * Trouver une solution en Java et adapter la partie graphique (**fausse bonne idée**)

	
  * Trouver une solution en Javascript et réaliser un binding GWT (ça, c'est dans mes cordes)


Un rapide tour d'horizon fait ressortir deux frameworks Javascript très utilisés pour la coloration syntaxique :

	
  * [highlight.js](http://softwaremaniacs.org/soft/highlight/en/)

	
  * [SyntaxHighlighter](http://alexgorbatchev.com/SyntaxHighlighter/)


Les deux semblent maintenus, des releases récentes sont disponibles. Mon choix se porte sur **SyntaxHighlighter**, qui semble plus beau. C'est purement subjectif, mais je trouve que le code mis en couleur par **highlight.js** a un petit air **vieillot**.


## gwt-syntaxhighlighter


Coup de bol : je tombe sur [gwt-syntaxhighlighter](http://code.google.com/p/gwt-syntaxhighlighter), une intégration assez poussée de **SyntaxHighlighter** dans **GWT**.

Trop poussée, hélas :


	
  * gwt-syntaxhighlighter utilise des [Generators](http://code.google.com/webtoolkit/doc/latest/DevGuideCodingBasicsDeferred.html#generators), ce qui allonge le **temps de compilation**,

	
  * gwt-syntaxhighlighter comporte **quelques bugs** qui ne sont pas corrigés et qui sont difficiles à contourner,

	
  * la version de SyntaxHighlighter utilisée n'est **pas à jour** (les versions récentes apportent pourtant des évolutions intéressantes).


De plus, il s'avère que l'intégration de SyntaxHighlighter est relativement aisée, beaucoup plus simple que ce que tente de faire **gwt-syntaxhighlighter**.

## Intégration GWT de SyntaxHighlighter


### Charger les scripts et les CSS

Tout d'abord, il faut [télécharger](http://alexgorbatchev.com/SyntaxHighlighter/download/) SyntaxHighlighter. Les dossiers **scripts** et **styles** contiennent tout ce dont vous aurez besoin.

Ces fichiers devront être inclus dans l'application GWT. Il existe [différentes méthodes](http://code.google.com/webtoolkit/doc/latest/DevGuideOrganizingProjects.html#DevGuideModules). J'ai choisi de créer un répertoire **public** au même niveau que le répertoire **client**, et d'y placer les répertoires **scripts** et **styles**.

![](/static/blog_img/public.png)

Ensuite, il suffit de les ajouter au module (fichier **.gwt.xml**) :
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<module>

    <!-- La CSS de base pour SyntaxHighlighter -->
    <stylesheet src="styles/shCore.css"/>

    <!-- J'utilise le thème Eclipse (8 thèmes disponibles) -->
    <stylesheet src="styles/shThemeEclipse.css"/>

    <!-- Le javascript de base pour SyntaxHighlighter -->
    <script src="scripts/shCore.js"/>

    <!-- Les extensions pour les différents langages utilisés -->
    <script src="scripts/shBrushJava.js"/>
    <script src="scripts/shBrushXml.js"/>

    <!-- [...] -->
</module>
{% endhighlight %}


### Go, Go, GO!


A l'origine, SyntaxHighlighter fonctionnait en parsant le DOM et en modifiant les nœuds marqués comme conteneurs de code. La dernière release propose une [approche alternative](http://alexgorbatchev.com/SyntaxHighlighter/whatsnew.html#commonjs), qui fonctionne indépendamment du DOM.

Le fonctionnement est simple : une fonction Javascript prend en entrée du code sous forme de String, et renvoie une String contenant le HTML pour afficher le code formaté.

Un _brush_ (pinceau) est nécessaire pour colorer du code. Il existe en fait un brush par langage, et celui-ci définit les mots clés, la syntaxe, etc.

Il nous faut donc une fabrique de pinceaux :

{% highlight java %}
public class BrushFactory {
    public native JavaScriptObject newJavaBrush() /*-{
        return new $wnd.SyntaxHighlighter.brushes.Java();
    }-*/;

    public native JavaScriptObject newXmlBrush() /*-{
        return new $wnd.SyntaxHighlighter.brushes.Xml();
    }-*/;
}
{% endhighlight %}

Voici le code [JSNI](http://code.google.com/webtoolkit/doc/latest/DevGuideCodingBasicsJSNI.html) utilisant SyntaxHighlighter pour transformer du code en html :
{% highlight java %}
public class SyntaxHighlighter {
    public static native String highlight(String code, JavaScriptObject brush, boolean toolbar) /*-{
        var params = {};
        params['toolbar'] = toolbar;
        brush.init(params);
        return brush.getHtml(code);
    }-*/;
}
{% endhighlight %}
_Notez le paramètre toolbar qui permet d'afficher ou non la barre d'outil. De [nombreux paramètres](http://alexgorbatchev.com/SyntaxHighlighter/manual/configuration/) sont disponibles ; à vous de les intégrer._

Ya plus qu'à utiliser tout ça, par exemple en récupérant le code contenu dans une [TextArea](http://google-web-toolkit.googlecode.com/svn/javadoc/latest/com/google/gwt/user/client/ui/TextArea.html) et en l'affichant via un [HTML](http://google-web-toolkit.googlecode.com/svn/javadoc/latest/com/google/gwt/user/client/ui/HTML.html).

{% highlight java %}
public void bindTextAreaCodeToHtml(TextArea textArea, HTML html) {
    JavaScriptObject brush = BrushFactory.newJavaBrush();
    String code = textArea.getValue();
    String htmlCode = SyntaxHighlighter.highlight(code, brush, false);
    html.setHTML(htmlCode);
}
{% endhighlight %}


## Conclusion


Vous avez désormais toutes les clés en main pour faire de la coloration syntaxique côté client en GWT.

Bien entendu, ce code est à adapter suivant vos besoins. Vous n'êtes pas obligés d'utiliser des **static** partout ;-) .

{% include comments.html %}

## [Raphaël Brugier (@rbrugier)](http://twitter.com/rbrugie)

Hello,

Intéressant je n’avais pas suivi le développement de SyntaxHighlighter avec la nouvelle méthode sans le parsing du DOM.

J’avais utilisé GWT + le plugin sur mon projet de stage l’an dernier <a href="http://code.google.com/p/gwt-generator/">presque de la même façon</a>

En tout cas continue les posts sur gwt, il y a du public 

Raphaël.

## [Piwaï](/contact.html)

Cool :) Je vais tâcher de continuer, j’ai quelques idées dans mon sac :)