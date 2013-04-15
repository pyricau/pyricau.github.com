---
date: 2011-10-30 23:30:34
layout: post
title: 'Coup de balai : déblayer les branches d''un repo Git'
permalink: /2011/10/30/coup-de-balai-deblayer-les-branches-dun-repo-git/
filename: 2011-10-30-coup-de-balai-deblayer-les-branches-dun-repo-git.markdown
more: 1117
# TO COMMENT, EDIT THIS FILE AND ADD YOUR COMMENT AT THE BOTTOM

---

Comme je vous l'indiquais dans un [précédent article](http://blog.piwai.info/2011/10/14/tas-mis-a-jour-les-specs/), chez [Siine](http://www.siine.com/), nous hébergeons nos projets sur [GitHub](http://github.com/), et chaque User Story fait l’objet d’une [branche dédiée](http://blog.piwai.info/2011/10/09/roooh-jai-encore-oublie-ma-branche-git/).



Lorsqu'une **branche** qui a fait l'objet d'une **pull request** est validée, elle est **mergée** sur la branche d'intégration. Nous n'avons cependant pas pris l'habitude de **supprimer** ces branches une fois mergées. Je pense que nous aurions probablement du les supprimer au fur et à mesure, car nous nous retrouvons aujourd'hui avec de **nombreuses branches mergées**, qui ne servent à rien et qui **polluent** nos repository.


[![](/static/blog_img/Branches_konary.jpeg)](http://commons.wikimedia.org/wiki/File:Branches_konary.jpg)

_Branches konary by Krzysztof_

Notez que GitHub conserve **l'historique** des pull request même quand les branches sont supprimées. Je ne vois vraiment aucune raison de conserver des branches mergées. Et vous ?



Quoi qu'il en soit, il est tout à fait possible de corriger cela, en quelques **commandes** **Git** bien senties. 



On récupère toutes les données du **repository remote**

{% highlight bash %}
git fetch --all
{% endhighlight %}



On supprime de notre **repository local** toutes les branches remote qui n'existent plus

{% highlight bash %}
git remote prune origin
{% endhighlight %}



[![](/static/blog_img/Valor_prune.jpeg)](http://commons.wikimedia.org/wiki/File:Valor_prune.jpg)

_Valor prune by Glysiak_

On compte toutes les **branches remote mergées **:

{% highlight bash %}
git branch -r --merged origin/integration | wc -l
{% endhighlight %}

Le paramètre `-r` signifie **remote**, et `--merged origin/integration` permet de lister les branches mergées dans **origin/integration**.



Vous l'aurez noté, `wc -l` est une commande Unix permettant de compter le **nombre de lignes** du flux d'entrée. Ainsi, on pourrait l'utiliser pour compter le **nombre de branches** du repository remote :

{% highlight bash %}
git branch -r | wc -l
{% endhighlight %}


Il n'y a plus qu'à **supprimer les branches mergées** :



{% highlight bash %}
# Supprimer la branche sur le remote
git push origin :my_branch
# Et supprimer la branche qui la track en local
git branch -d my_branch
{% endhighlight %}



Notez aussi que GitHub met à disposition ce listing sans avoir à entrer une seule ligne de commande, en cliquant sur [Branches](https://github.com/pyricau/FunkyJFunctional/branches).



![](/static/blog_img/capture-d_c3a9cran-2011-10-30-c3a0-23-16-37.png)



Pour finir : si lister les branches mergées permet de faire le ménage, à l'inverse il peut être intéressant de prendre connaissance des **branches non mergées**, car il se peut que certaines d'entre elles aient été oubliées et soient à **l'abandon**. Pour cela, rien de plus simple :

{% highlight bash %}
git branch -r --no-merged origin/integration
{% endhighlight %}

{% include comments.html %}

## [Dvins](http://gravatar.com/dvins)

Salut Piwai !
Cet historique des branches supprimées est-il propre à Github ou est-ce inclus de base dans Git ?
J’utilise Git depuis peu (ASI = SVN comme tu le sais) et je commence en effet à me retrouver avec un tas de branches mergées qui polluent le dépôt !
Merci d’avance !

## [Piwaï](/contact.html)
Salut Dvins!

Github conserve l’historique des “pull request”, pas des “branches supprimées”. Il n’y a pas de notion “d’historique des branches supprimées” dans git. Les branches, tout comme les tags, sont de simples marqueurs sur un graphe, qui identifient des commits particuliers.

Supprimer une branche, c’est supprimer un marqueur, ni plus ni moins  .

Par ailleurs, effectivement, les commandes que je donne ici sont des commandes Git, et donc fonctionnent sur n’importe quel repo git.