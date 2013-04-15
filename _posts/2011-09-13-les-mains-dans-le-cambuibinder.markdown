---
date: 2011-09-13 08:13:02
layout: post
title: Les mains dans le cambUiBinder
permalink: /2011/09/13/les-mains-dans-le-cambuibinder/
filename: 2011-09-13-les-mains-dans-le-cambuibinder.markdown
more: 733
# TO COMMENT, EDIT THIS FILE AND ADD YOUR COMMENT AT THE BOTTOM

---
L'article précédent montrait comment faire de la [coloration syntaxique en GWT](http://blog.piwai.info/2011/09/05/coloration-syntaxique-en-gwt/).

Toujours pour [Rockslide](http://pyricau.github.com/rockslide), je souhaitais pouvoir écrire le code à mettre en forme dans des **templates** [UiBinder](http://code.google.com/webtoolkit/doc/latest/DevGuideUiBinder.html), plutôt que dans des Strings statiques portées par des classes Java.

Est-ce possible ? Comment y parvenir ? En creusant ces questions, j'ai réalisé que UiBinder possède de nombreuses facettes **non documentées** et qui méritent que l'on s'y attarde. Tour du propriétaire.


## Widgets customs

Vous le savez probablement, il est possible d'inclure ses propres widgets GWT dans un template UiBinder.

Il suffit pour cela d'étendre la classe **Widget**. Prenons l'exemple d'un bouton ouvrant une fenêtre d'alerte :

{% highlight java %}
public class AlertButton extends Button implements ClickHandler {

	public AlertButton() {
		addClickHandler(this);
	}

	@Override
	public void onClick(ClickEvent event) {
		Window.alert("I like turtles");
	}
}
{% endhighlight %}

Vous pouvez ensuite l'inclure dans vos templates UiBinder, en ajoutant un **namespace** correspondant au **package** de votre widget :

{% highlight xml %}
<ui:UiBinder
    xmlns:ui='urn:ui:com.google.gwt.uibinder'
    xmlns:g='urn:import:com.google.gwt.user.client.ui'
    xmlns:custom='urn:import:info.piwai.blog.ui'
>

	<g:FlowPanel>
		<custom:AlertButton />
	</g:FlowPanel>

</ui:UiBinder>
{% endhighlight %}

Un peu limité quand même...


## Et avec des paramètres ?


Il y a mieux ! Vous pouvez tout à fait passer des paramètres à votre widget. Il suffit d'ajouter des paramètres de **constructeur** (donc obligatoires) ou des **setters** (donc facultatifs) à votre widget :

{% highlight java %}
public class AlertButton extends Button implements ClickHandler {

	private final String msg;

	@UiConstructor
	public AlertButton(String msg) {
		this.msg = msg;
		addClickHandler(this);
	}

	@Override
	public void onClick(ClickEvent event) {
		Window.alert(msg);
	}
}
{% endhighlight %}
_Notez la présence de **@UiConstructor**, nécessaire lorsque le constructeur par défaut n'est pas défini._

Puis d'utiliser les **attributs correspondants** dans vos templates UiBinder :

{% highlight xml %}
<ui:UiBinder
    xmlns:ui='urn:ui:com.google.gwt.uibinder'
    xmlns:g='urn:import:com.google.gwt.user.client.ui'
    xmlns:custom='urn:import:info.piwai.blog.ui'
>

	<g:FlowPanel>
		<custom:AlertButton msg="I like turtles" />
	</g:FlowPanel>

</ui:UiBinder>
{% endhighlight %}


## Les attributs, ça pue ?


Si votre widget implémente [HasText](http://google-web-toolkit.googlecode.com/svn/javadoc/latest/com/google/gwt/user/client/ui/HasText.html), vous pourrez alors définir ce texte directement au **sein de la balise** au lieu d'utiliser des **attributs**. Modifions **AlertButton** :

{% highlight java %}
public class AlertButton extends Button implements ClickHandler, HasText {

	private String msg = "Default Message";

	public AlertButton() {
		addClickHandler(this);
	}

	@Override
	public void setText(String msg) {
		this.msg = msg;
	}

	@Override
	public void onClick(ClickEvent event) {
		Window.alert(msg);
	}

	@Override
	public void getText() {
		throw new UnsupportedOperationException();
	}
}
{% endhighlight %}
_Notez que l'interface **HasText** impose d'implémenter **getText()**, mais cette méthode n'est pas nécessaire pour nos besoins._

C'est déjà plus sympa :
{% highlight xml %}
<ui:UiBinder
    xmlns:ui='urn:ui:com.google.gwt.uibinder'
    xmlns:g='urn:import:com.google.gwt.user.client.ui'
    xmlns:custom='urn:import:info.piwai.blog.ui'
>

	<g:FlowPanel>
		<custom:AlertButton>I like turtles</custom:AlertButton>
	</g:FlowPanel>

</ui:UiBinder>
{% endhighlight %}


## Quid du HTML ?


Vous pouvez aussi inclure, au sein de vos widgets, du HTML défini dans votre template UiBinder, grâce à [HasHTML](http://google-web-toolkit.googlecode.com/svn/javadoc/latest/com/google/gwt/user/client/ui/HasHTML.html).

Par exemple, supposons que je souhaite enrichir mon **AlertButton** pour afficher de belles popups, en utilisant une [DialogBox](http://google-web-toolkit.googlecode.com/svn/javadoc/latest/com/google/gwt/user/client/ui/DialogBox.html) :

{% highlight java %}
public class AlertButton extends Button implements ClickHandler, HasHTML {

	private String html = "";

	private String title = "Default title";

	public AlertButton() {
		addClickHandler(this);
	}

	@Override
	public void setHTML(String html) {
		this.html = html;
	}

	@Override
	public void setTitle(final String title) {
		this.title = title;
	}

	@Override
	public void onClick(ClickEvent event) {
		DialogBox dialogBox = new DialogBox();
		dialogBox.setWidget(new HTML(html));
		dialogBox.setText(title);
		dialogBox.center();
	}

	@Override
	public void getText() {
		throw new UnsupportedOperationException();
	}

	@Override
	public void setText(String text) {
		throw new UnsupportedOperationException();
	}

	@Override
	public String getHTML() {
		throw new UnsupportedOperationException();
	}

}
{% endhighlight %}
_La méthode **setHTML()** est appelée avec en paramètre le HTML sous forme de String._

Je peux désormais spécifier le **contenu HTML** de cette boîte de dialogue dans mon template UiBinder : 

{% highlight xml %}
<ui:UiBinder
    xmlns:ui='urn:ui:com.google.gwt.uibinder'
    xmlns:g='urn:import:com.google.gwt.user.client.ui'
    xmlns:custom='urn:import:info.piwai.blog.ui'
>

	<g:FlowPanel>
		<custom:AlertButton title="I like turtles">
			<p>
				I <strong>really</strong> like turtles!<br />
				What about <em>you</em>?
			</p>
		</custom:AlertButton>
	</g:FlowPanel>

</ui:UiBinder>
{% endhighlight %}


## &amp;nbsp; ?


Comment utiliser des entités HTML dans vos templates UiBinder ? Il suffit d'ajouter [la DTD](http://code.google.com/webtoolkit/doc/latest/DevGuideUiBinder.html#HTML_entities) fournie par Google :

{% highlight xml %}
<!DOCTYPE ui:UiBinder SYSTEM "http://dl.google.com/gwt/DTD/xhtml.ent">
<ui:UiBinder
    xmlns:ui='urn:ui:com.google.gwt.uibinder'
    xmlns:g='urn:import:com.google.gwt.user.client.ui'
    xmlns:custom='urn:import:info.piwai.blog.ui'
>

	<g:FlowPanel>
		<custom:AlertButton title="I like turtles">
			<p>
				Turtles &gt; Dolphins!
			</p>
		</custom:AlertButton>
	</g:FlowPanel>

</ui:UiBinder>
{% endhighlight %}


## Paramètres complexes


**<ui:with />** permet d'injecter un objet (créé via [GWT.create()](http://google-web-toolkit.googlecode.com/svn/javadoc/latest/com/google/gwt/core/client/GWT.html#create%28java.lang.Class%29)) dans votre template UiBinder.

Un exemple d'utilisation serait l'injection d'une **Enum** afin de paramétrer un widget.

Reprenons notre fenêtre d'alerte initiale :

{% highlight java %}
public class AlertButton extends Button implements ClickHandler {

	private final Animal animal;

	@UiConstructor
	public AlertButton(Animal animal) {
		this.animal = animal;
		addClickHandler(this);
	}

	@Override
	public void onClick(ClickEvent event) {
		Window.alert("I like " + animal.toString());
	}
}
{% endhighlight %}

**Animal** est une simple Enum :
{% highlight java %}
public Enum Animal {
  TURTLES, DOLPHINS;
}
{% endhighlight %}

Il ne reste plus qu'à utiliser l'Enum en question dans le template UiBinder :
{% highlight xml %}
<ui:UiBinder
    xmlns:ui='urn:ui:com.google.gwt.uibinder'
    xmlns:g='urn:import:com.google.gwt.user.client.ui'
    xmlns:custom='urn:import:info.piwai.blog.ui'
>
	<ui:with field="animal" type="info.piwai.blog.Animal"/>

	<g:FlowPanel>
		<custom:AlertButton animal="{animal.TURTLES}" />
	</g:FlowPanel>

</ui:UiBinder>
{% endhighlight %}
_Cerise sur le gateau, on bénéficie de l'autocomplétion : en tapant **{animal.}**, l'IDE propose **TURTLES** ou **DOLPHINS** !_


## Bon, et la coloration syntaxique alors ?


En combinant tout ce qui a été dit précédemment, il est possible d'écrire des exemples de code au sein de templates UiBinder, mis en forme par SyntaxHighlighter. On utilisera pour cela un widget implémentant [HasHTML](http://google-web-toolkit.googlecode.com/svn/javadoc/latest/com/google/gwt/user/client/ui/HasHTML.html). 

Avant de passer aux choses sérieuses, un rappel. Dans [l'article précédent](http://blog.piwai.info/2011/09/05/coloration-syntaxique-en-gwt/), nous utilisions le code suivant pour faire de la coloration syntaxique en GWT :

{% highlight java %}
public void bindTextAreaCodeToHtml(TextArea textArea, HTML html) {
    JavaScriptObject brush = BrushFactory.newJavaBrush();
    String code = textArea.getValue();
    String htmlCode = SyntaxHighlighter.highlight(code, brush, false);
    html.setHTML(htmlCode);
}
{% endhighlight %}

Une précision : Le **parseur UiBinder** utilisé pour les widgets implémentant **HasHTML** ne garde pas les retours à la ligne, ce qui se révèle gênant lorsque son contenu est du code mis en forme. Pour contourner cela, on peut utiliser une balise `<pre>` dans le template UiBinder.

Trêve de suspens, voici le résultat :

{% highlight java %}
public class Code extends Composite implements HasHTML {

	private JavaScriptObject brush = null;

	private HTML panel = new HTML();

	@UiConstructor
	public Code() {
		initWidget(panel);
	}

	public void setBrush(JavaScriptObject brush) {
		this.brush = brush;
	}

	@Override
	public void setHTML(String html) {
		// On supprime la balise <pre>
		final String code = html.replaceFirst("<pre>", "").replaceFirst("</pre>", "");
		Scheduler.get().scheduleDeferred(new ScheduledCommand() {
			@Override
			public void execute() {
				if (brush != null) {
					String codeAsHtml = SyntaxHighlighter.highlight(code, brush, false);
					panel.setHTML(codeAsHtml);
				}
			}
		});
	}

	@Override
	public void getText() {
		throw new UnsupportedOperationException();
	}

	@Override
	public void setText(String text) {
		throw new UnsupportedOperationException();
	}

	@Override
	public String getHTML() {
		throw new UnsupportedOperationException();
	}

}
{% endhighlight %}
_Notez l'utilisation du [Scheduler](http://google-web-toolkit.googlecode.com/svn/javadoc/latest/com/google/gwt/core/client/Scheduler.html) pour afficher le code immédiatement **après** la construction du widget. L'ordre de valorisation des attributs n'étant pas garanti, cela permet d'être sûr que la valeur du champ **brush** aura été préalablement injectée au moment de l'appel à **SyntaxHighlighter**._

On peut ensuite utiliser ce widget dans un template UiBinder classique :

{% highlight xml %}
<!DOCTYPE ui:UiBinder SYSTEM "http://dl.google.com/gwt/DTD/xhtml.ent">
<ui:UiBinder
    xmlns:ui='urn:ui:com.google.gwt.uibinder'
    xmlns:g='urn:import:com.google.gwt.user.client.ui'
    xmlns:custom='urn:import:info.piwai.blog.ui'
>

	<ui:with field="brushFactory" type="info.piwai.blog.BrushFactory"/>

	<g:FlowPanel>
		<custom:Code brush="{brushFactory.newJavaBrush}"><pre>
			public class Main {
				public static void main(String[] args) throws Exception {
					List&lt;String&gt; moto = Arrays.asList("I", "Like", "Turtles");
					System.out.println(moto);
				}
			}</pre>		
		</custom:Code>
	</g:FlowPanel>

</ui:UiBinder>
{% endhighlight %}
_Les caractères **<** et **>** doivent être échappés pour éviter qu'ils ne soient interprétés par UiBinder et ne conduisent à des erreurs de validation. Ainsi, au lieu de **List<String>**, on écrit **List&lt;String&gt;**_

**Edit :** Merci [@matboniface](https://twitter.com/#!/matboniface/status/113509239925915648), j'avais au départ parlé d'échapper des entités HTML, ce qui n'a pas beaucoup de sens.


## Conclusion


Cet article s'est révélé **plus long** que ce que j'avais en tête initialement ! J'espère qu'il vous aura fait découvrir des aspects **intéressants** et souvent **méconnus** de **UiBinder**. 

N'hésitez pas à compléter ce billet avec vos **trucs et astuces** UiBinder en **commentaire** !

Vous pouvez aussi vous abonner au <a href="{{ site.rss_feed }}">Flux RSS</a>. Je me suis fixé comme objectif de publier un article par semaine, on verra si je tiens le rythme ;-) .

{% include comments.html %}

## [Nicolas François](http://injectinto.blogspot.fr/)

Article sympa !
Bon allez, j'ai aussi un truc sympa qui n'est pas dans tes astuces.
Admettons que j'utilise une api gwt externe, et que le composant que je souhaite insérer ne possède pas de constructeur par défaut. Je pourrais m'amuser à recompiler le code en ajoutant un @UiConstructeur mais c'est ch**** à faire et coté maintenance un joli bordel.
La solution est très simple :
Je l'utilise l'air de rien dans le xml, mais dans le java, je le déclare de la façon suivante :

{% highlight java %}
@UiField(provided=true)
MegaComponentOfTheDeath mcoth= new MegaComponentOfTheDeath(machin, bidule, truc);
{% endhighlight %}

Le provided indique que l'instanciation est fournie par le java.

Autre cas où c'est utile : Injection de ressources via GIN, le composant utilise un resource bundle qui est injecté dans le code java grace à gin.

{% highlight java %}
@UiField(provided=true)
Resource res;

@Inject
public void setRes(Resource res){
  this.res = res;
}
{% endhighlight %}

## [Eric B. (@vvinnie)](http://twitter.com/vvinnie)
Et pourquoi pas un petit enrobage en CDATA plutôt que de rendre les illisibles. D'ailleurs, question philosophique : et si les generics avaient mauvaise réputation seulement parce que les gens essaient d'en parler en html ? hum ?

## [Piwaï](/contact.html)

"rendre les illisibles" => "rendre les `< >` illisibles" (les signes ont sautés de ton commentaire, vu que le HTML est activé  )

Grumph. Je n'y avais pas pensé... ça a l'air de fonctionner, en tout cas ya aucune erreur de validation. A voir si CDATA préserve bien les retours à la ligne (comme ça plus besoin de `<pre>`), et comment ça se présente ensuite au runtime en terme de manipulation du DOM (=> que contient la string envoyée à setHTML ou setText ..)

Je testerai ça à l'occasion, mais si ça marche c'est plutôt génial, ça permet de simplifier à mort le code. Merci !

## [Piwaï](/contact.html)

Je viens de vérifier : CDATA permet effectivement de ne plus échapper les chevrons. Par contre, avec UiBinder, il ne conserve pas les retours chariot. Il convient donc d'utiliser pre et CDATA en complément.