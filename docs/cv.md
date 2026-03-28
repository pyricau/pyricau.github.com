!!! tip "My Ideal Job"
    * Strong **technical culture**
    * High **impact**
    * **Remote** first

## Experience

### Principal Android Engineer - Block

|:material-calendar-multiple:|2022 - Present|
|:fontawesome-solid-map-location:|San Francisco -> Lyon|

In early 2022 I wrote the story of an investigation into the performance degradation of Square's fork of the Android OS (Squid): "Diary of a Slow Squid" (learn more in [this public talk](https://youtu.be/kOH1Kdj9c1c?si=bykCD_r8Yxzn7u-b&t=1626)). This convinced Square's leadership that we needed to invest in performance at both the app & the OS level, which led to funding and scaling the Mobile Performance & Reliability (MPR) team from 1 to 7 engineers in a matter of months. I became the go-to person for everything performance: I built tooling inside POS, created guides and dashboards now used by teams across all verticals (performance investigation, profiling, Android Vitals, interaction latency, benchmarking), and taught engineers across the organization how to investigate and fix performance issues. I also ran a blog series on Android performance in production that reached 10K+ views and was featured four times in Android Weekly.

After a [multi-hour Square outage in September 2023](https://developer.squareup.com/blog/incident-summary-2023-09-07/), we realized we lacked the metrics to correctly evaluate customer impact. [Ben VandenBos](https://www.linkedin.com/in/bvandenbos) started an initiative to establish success rate metrics for all Critical Jobs across Square, but it initially did not encompass what sellers experienced inside POS. I spotted the potential in a hackweek project on client-side instrumentation, co-opted it, and drove adoption across the codebase to ship User Journeys to production within weeks — filling that gap for POS. The approach was later adopted by the Dashboard web app and by Cash App.

I convinced the Perfetto team at Google to extend their Kotlin tracing API from Android-only to JVM, enabling tools that can automatically analyze traces at scale. I also wrote a guide that led the Jetpack Compose team at Google to turn on LeakCanary in their CI UI tests — they fixed a number of leaks, including one tied to a Kotlin coroutine bug I helped investigate.

In 2024 I led as engineering DRI for a cross-org, cross-platform mobile performance squad that wrapped up in H1 2025 with significant improvements across the board, including a meaningful ANR rate reduction — the culmination of that multi-year effort.

At the end of 2024 I built infrastructure to automatically capture and upload heap dumps on OutOfMemory crashes in production. I also extended [LeakCanary](https://github.com/square/leakcanary) with a heap dump sanitization utility that strips primitive arrays and PII before upload, making safe production heap analysis at scale practical.

Within Block, I initiated a group trip to Droidcon NYC 2025 and led the initial budget push — we sent 55 engineers across Block.

I explored the future of mobile observability at Block and ran a Bitdrift trial. After a successful pilot and an ADR-driven vendor evaluation, I shaped Square's mobile analytics and observability strategy and drove the creation of a dedicated observability squad, which unfortunately did not survive the 2026 RIF apocalypse.

### Staff Android Engineer - Square / Block

|:material-calendar-multiple:|2016 - 2022|
|:fontawesome-solid-map-location:|San Francisco|

In February 2016, I joined the new Developer Platform team as its Android lead. We released [Register API](https://github.com/square/register-android-sdk) 1.0 a few months later.

In March 2016 I started organizing EngTsq, a monthly internal lightning talk series: one hour, 5 lightning talks across all of engineering, consistently drawing 150+ engineers. Over five years, roughly 200 engineers gave their first tech talk in front of a large audience.

In August 2016 my team took ownership of the [Mobile Payments SDK](https://developer.squareup.com/docs/mobile-payments-sdk) (an SDK for connecting to the Square reader) after two previous attempts by other teams had failed — one trying to extract our spaghetti reader code, another trying to rewrite it from scratch. We had just built the [Point of Sale API](https://developer.squareup.com/docs/pos-api/what-it-does), an API that used app links to preload POS with a target amount. I had the idea to sidestep the extraction problem entirely: bundle the entire POS app code inside the SDK and leverage the Point of Sale API from within it. While not the cleanest approach, it let us build a working POC in one day and ship to alpha customers in one quarter, getting real feedback fast. We released in August 2018 after 1.5 years of private betas. I talked about the technical challenges in [AARAWR! Fantastic Bits and Where to Dex Them](https://www.youtube.com/watch?v=semnhz5EYGU).

In September 2018 I ran a hackweek project building on the hooks we had created for the Mobile Payments SDK to prototype a push-based extension. This proved that [Terminal API](https://developer.squareup.com/docs/terminal-api/overview) was within reach, and the Terminal API team was formed a few months later.

In January 2019 we released the [In-App Payments SDK](https://squareup.com/us/en/developers/in-app-payments). Our team built it really fast and really well, as a high functioning team with almost a hive mind, knocking out bugs and features left and right. This isn't just an SDK, it's a delightful experience. We carefully crafted every detail, from the shape of (Kotlin first) APIs, to the SDK UI (only XML vector drawables, advanced canvas drawing, responsive animations with ConstraintLayout), to the code of the sample app (examplary example code!), to the structure of the quick start guide.

In 2018, as several teams were struggling to fill senior Android positions, I partnered with a colleague and worked with recruiters to organize informal Android dinners: a mix of Square engineers and candidates, geek-talking about Android over dinner. The results exceeded expectations — in one case the recruiter told us that closing a single candidate justified the cost of ten more of these events.

In March 2019 I joined the Developer Empowerment organization to take on a new challenge, focusing on the reliability on Square mobile apps and SDKs.

From August 2019 to April 2020, I led the Isolated Development team as TLM, growing it from 3 to 6 Android and iOS engineers. Our goal was to increase developer velocity by decoupling the POS monorepo into smaller, independently iterable pieces. We drove organic adoption of a new module structure with explicit boundaries — by March 2020, 67% of our 1,650 Android modules had adopted it — and grew from 7 to 50+ demo apps on Android and equivalent on iOS. We also rolled out module ownership across both iOS and Android repositories, with every module owned by exactly one team, which became foundational for crash triaging and cross-team collaboration. I also nudged [Ralf Wondratschek](https://ralf-wondratschek.com) to explore and open source [Anvil](https://github.com/square/anvil), a Dagger auto-configuration library that became a game changer for multi-module Android development and was adopted by Dropbox, Slack, Snap, Tonal, and others.

I then moved back to an IC role. I started by migrating the entire POS codebase to AndroidX — 2.8K files and 5K lines of code changed in a single after-hours PR — unblocking POS from updating dozens of Android ecosystem dependencies that had stalled for over a year.

I tackled our UI test flakiness problem by building flake monitoring dashboards and tooling to run tests directly on Firebase, dramatically speeding up iteration. While improving Espresso error messages during this work, I reused view hierarchy printing code I had originally written in 2014 inside POS — code that had since become the basis of my interview question. In 2020, [Zach Klippenstein](https://blog.zachklipp.com) and I open sourced that code as [Radiography](https://github.com/square/radiography). Similarly, [Curtains](https://github.com/square/curtains) grew out of my investigation into window callback hooks while chasing crashes. I also built and evangelized the foundation for network and UI performance monitoring across Square mobile.

I discovered that our analytics event library was silently dropping at least 35% of events from at least 30% of active devices. A simple queue size increase from 256KB to 2MB brought the drop rate down to ~10%. I also found that three Android app targets had never had server-side analytics logging enabled at all.

I invested deeply in understanding the crash triage process by working closely alongside our RelOps team, then redesigned it end to end. The results were dramatic: average resolution time dropped from 60 to 21 days, the resolution rate improved from 68% to 89%, and the crash rate fell from 0.47% to 0.31%.

Starting in 2021 I drove several high-impact performance investigations. I surfaced a major regression on [Square Register](https://squareup.com/hardware/register) and [Square Terminal](https://squareup.com/hardware/terminal) that traced back to configuration bugs in the Linux kernel of Square's Android fork — bugs that had already shipped to customers without anyone at Square noticing, and might otherwise have led to costly hardware spec upgrades. I unblocked the launch of a major POS UI redesign (introducing a nav bar) that teams had worked on for 1.5 years without migrating any UI tests — I figured out a path to migrate 3,000 UI tests to the new UI in just a few days. I extracted our production performance tracking code into [square/papa](https://github.com/square/papa) ([talk](https://www.youtube.com/watch?v=aPCGYNk3Wzw&feature=youtu.be)), which also enabled Cash Android to build its performance dashboard much faster than planned. And I built and open sourced [square/logcat](https://github.com/square/logcat) in September 2021, after production logging mistakes had caused significant performance issues in POS.

### Software Engineer - Square

|:material-calendar-multiple:|March 2013 - 2016|
|:fontawesome-solid-map-location:|San Francisco|

While working for Siine, I had the opportunity to interview at Google in Paris. I barely did any prep and flunked the interview.. the recruiter told me the feedback was "good technical skills but lacking cognitive skills". My pride was hurt, so from then on I started paying more attention to algorithms and data structure implementation details. That helped a ton with my next step!

With [AndroidAnnotations](https://github.com/androidannotations/androidannotations) (a framework that reduced code boilerplate), I had built the first Android annotation processor. I had tried to add dependency injection support but wasn't happy with the result, so when Square released Dagger, I filed a [GitHub issue on dagger/square](https://github.com/square/dagger/issues/40) asking for a plugin architecture. Jesse Wilson responded over email: "are you interested in coming to work for Square?". Square flew me from Paris to SF for the interviews, and I also used that opportunity to interview at Facebook. Both companies had interviews that were a full day of mostly leet code. However, on the Facebook side I met 20-something engineers I'd never heard of, who talked about reimplementing the feed with OpenGL, and we were coding on whiteboards. On the Square side, we were coding on a laptop, and I already knew the names of almost everyone that interviewed me (Jake Wharton, Jesse Wilson, Ray Ryan, and even the CTO Bob Lee). I knew I'd found my people, and I moved to the San Francisco office to work with the best Android engineers.

I have contributed to every release of [Square Point of Sale](https://play.google.com/store/apps/details?id=com.squareup) for Android since March 2013.

In June 2013 I led the Android software side of the [new Square Reader](http://www.wired.com/design/2013/12/the-new-square-reader-a-look-at-how-gadget-guts-are-designed/).

In August 2013 I led a HackWeek project: SQUA(RED), a special red edition of the Square reader to fight AIDS. Our great hardware team made that a [real product](http://techcrunch.com/2014/02/19/square-and-red-fight-aids-with-special-edition-reader-and-donate-links-in-receipts/).

In March 2014, I started leading the engineering effort to bring Square POS to Android Tablets. I made sure to implement new features on mobile as well, as I believe the screen size frontier is much less clear today, and features should be ubiquitous.

In August 2015 I wrapped up my work on the Android Tablets team, which had grown from 1 to 6 engineers. We were done [catching up](https://squareup.com/au/townsquare/new-features-android-devices) with the iPad and started focusing on building new features. Our work was the app foundation for the [Square Register](https://squareup.com/hardware/register).

From September 2015 to January 2016 I worked on a super cool secret project that I cannot mention here. Small team, high throughput, we built a great app really fast.

### Lead Software Developer - Siine

|:material-calendar-multiple:|September 2011 - January 2013|
|:fontawesome-solid-map-location:|Barcelona & Paris|

After two years of contracting work, I decided it was time to have fun and work on more impactful projects. 

At Siine, we created a fun and easy to use Android Keyboard. Our goal was to improve context typing.

I rebuilt the whole app on top of the AOSP keyboard so that we could focus our efforts on building new UX, cleaned up our build process, added feature toggles, CI, and automatic releases.

During my time at Siine, I released the [Siine Keyboard](https://play.google.com/store/apps/details?id=com.siine.ime), [RefereePro](http://thenextweb.com/insider/2012/11/15/football-comes-into-the-digital-age-as-the-first-professional-referee-swaps-penpaper-for-a-smartphone/) to empower soccer referees, and [PhOCD](https://play.google.com/store/apps/details?id=com.siine.phocd), a one day hackaton experiment.

### Software Engineer - bfinance

|:material-calendar-multiple:|November 2010 - September 2011|
|:fontawesome-solid-map-location:|Paris|

After a year at JCDecaux, I wanted to do less driving. Excilys found a nice new contract for me: bfinance, a financial services firm.

It was a challenging time to join the team, after all the software engineers had left. Two weeks in, I was the sole developer of two complex tender managing applications. The first one is used for cash management analysis, and the other for financing and banking relationship analysis.

These applications had been developed with a full team over several years. In order to keep potential regressions under control, I introduced continuous integration, a clean release process, and frequent small releases.

I also created [AndroidAnnotations](https://github.com/androidannotations/androidannotations) as a side project, initially as a toy after seeing a talk on Java 6 annotation processing.

### Software Engineer - JCDecaux

|:material-calendar-multiple:|November 2009 - November 2010|
|:fontawesome-solid-map-location:|Paris|

JCDecaux liked the Android prototype I had done for them and I came in for a 3 months contract to finish the app. The food was great, so I ended up staying a year and contributed to many other projects.

I took over the REST endpoint that talked to the mobile apps, a Tomcat / MySql app that was consuming web services. It was a stepping stone for what later became JCDecaux [Open Data API](https://developer.jcdecaux.com).

I also wrote their first GWT app, a map with a live overview of the state of the Velib stations for supervision and support purposes. You can see it [here](http://blog.velib.paris.fr/blog/2011/11/03/le-comite-des-usagers-a-cachan%C2%A0-special-regulation/).

### Software Engineer - Excilys Group

|:material-calendar-multiple:|August 2009 - September 2011|
|:fontawesome-solid-map-location:|Paris|

After my engineering internship at Excilys, I got a full time offer.

Over a two year period I worked as a contractor for two clients: JCDecaux and bfinance.

I also managed Excilys technical blog, gave Android & GWT trainings, and created a widely used Open Source library for Android: AndroidAnnotations.

### Engineering Internship - Excilys Group

|:material-calendar-multiple:|February 2009 - July 2009|
|:fontawesome-solid-map-location:|Paris|

After writing software for Excilys during college, I decided to get an internship.

I worked with skilled software engineers and learned a lot about Java. 

I discovered Android, had fun with it, and soon enough I was creating a prototype app for JCDecaux Velib maintenance team.

## Side projects


### LeakCanary

|:material-calendar-multiple:|May 2015 - Present|
|:fontawesome-solid-map-location:|San Francisco|

[LeakCanary](https://github.com/square/leakcanary) is an Open Source memory leak detection library for Android. We leveraged it to reduce OutOfMemory crashes in POS by 90% in 2015, then by another 60% since 2019. Adopted by most professional Android teams worldwide — 140K monthly downloads, 7K monthly documentation visitors — it has also found memory leaks in the Android Framework itself, with fixes benefiting millions of apps and billions of devices in newer Android versions.

### Radiography

|:material-calendar-multiple:|2020 - Present|
|:fontawesome-solid-map-location:|San Francisco|

[Radiography](https://github.com/square/radiography) is an Open Source library for pretty-printing Android view hierarchies. It grew out of work improving Espresso error messages while investigating UI test flakiness.

### Curtains

|:material-calendar-multiple:|2021 - Present|
|:fontawesome-solid-map-location:|San Francisco|

[Curtains](https://github.com/square/curtains) is an Open Source library providing a structured API for hooking into Android window callbacks. It grew out of crash investigation work.

### square/logcat

|:material-calendar-multiple:|2021 - Present|
|:fontawesome-solid-map-location:|San Francisco|

[square/logcat](https://github.com/square/logcat) is an Open Source Android logging utility built after production logging mistakes caused significant performance issues in POS.

### square/papa

|:material-calendar-multiple:|2021 - Present|
|:fontawesome-solid-map-location:|San Francisco|

[square/papa](https://github.com/square/papa) is an Open Source library for Android production performance tracking, extracted from POS instrumentation code. It enabled Cash Android to build its performance dashboard much faster than originally planned.

### Call For Paper committee - Devoxx US 2017

|:material-calendar-multiple:|October 2016 - March 2017|
|:fontawesome-solid-map-location:|San Francisco|

### Call For Paper committee - Devoxx France 2013

|:material-calendar-multiple:|October 2012 - April 2013|
|:fontawesome-solid-map-location:|Paris|

The Devoxx team contacted me for my mobile and Android skills, and my interest in the Java community.

I helped organizing Devoxx France 2013 (2000+ attendees) and selecting talks as part of the Call For Paper committee.

### AndroidAnnotations

|:material-calendar-multiple:|December 2010 - December 2012|
|:fontawesome-solid-map-location:|Paris|

AndroidAnnotations is an Open Source framework that enables Android developers to focus on their business problem rather than the plumbing that connects components and systems.

I presented it at FOSDEM 2012, PAUG, Devoxx France 2012, OWF 2012, Devoxx 2012, LyonJUG.

I created and maintained this project on my free time. Excilys contracted with me to maintain it from September 2011 to December 2012.

### VuzZz


|:material-calendar-multiple:|February 2012|
|:fontawesome-solid-map-location:|Paris|

VuzZz was created during the Android DevCamp Paris 2012, a 3 day hackaton with 10 competing teams. After 48 hours of intense non stop hacking, our team finished first. VuzZz downloads geolocated data from several Open Data sources and then gives a note to a given address based on 50 criteria grouped in 6 categories (culture, transport, etc). The perfect tool for finding your next apartment!

### Voxe.org

|:material-calendar-multiple:|September 2011 - September 2012|
|:fontawesome-solid-map-location:|Paris|

Voxe.org is a neutral open platform to compare political programs. I joined this non-profit organization on my free time to create the [Android app](https://github.com/voxe/voxe-android).

### 2H4U

|:material-calendar-multiple:|2006|
|:fontawesome-solid-map-location:|Paris|

* **Too Hard For You** is an Arkanoid and Tetris mix.
* I wrote a [C++/SDL implementation](http://sourceforge.net/projects/toohardforyou) in 2006.
* I rewrote it as an [HTML5 game](http://forplay-2h4u.appspot.com/) in 2011.

![2H4U](/static/img/cv_2H4U.jpg)

### EKC

|:material-calendar-multiple:|January 2003 - December 2004|
|:fontawesome-solid-map-location:|Paris|

With a team of 20 passionate people, we created a 3D RTS game using DarkBASIC on our free time (I was in High school).

![2H4U](/static/img/EKC_1.jpg) ![2H4U](/static/img/EKC_2.jpg) ![2H4U](/static/img/EKC_3.jpg)

## Education

> Education is what remains after one has forgotten everything he learned in school.

### INSA Rouen

|:fontawesome-solid-graduation-cap:|Master's degree, Computer Software Engineering|
|:material-calendar-multiple:|2004 - 2009|
|:fontawesome-solid-map-location:|Rouen, France|

The **INSA** Rouen is a French School of Engineering. I earned a *Diplôme d'Ingénieur en Architecture des Systèmes d'Information*.

ASI : Architecture des Systèmes d'Information

During my last semester I led 9 students for 6 months on a software project for Excilys. We worked 20 hours a week to create a functional testing tool (built on top of FIT) that would enable functional test driven development.

We used agile practices (Scrum / XP) and were certified ISO 9001-2000. That means walls covered with post-its, a lot of paperwork, and a little bit of coding.

### Kungliga Tekniska Högskolan

|:fontawesome-solid-graduation-cap:|Information & Communication Technology|
|:material-calendar-multiple:|2008|
|:fontawesome-solid-map-location:|Stockholm, Sweden|

My last Engineering semester of Engineering School was in Stockholm, Sweden, in the **Royal Institute of Technology**. I studied ICT - Information & Communication Technology.

I took classes on Network Security (amazing class), Software Design (UML mi amor) and Entrepreneurship (it's the team, not the idea).

I also learnt how to make a really good Tortilla de patatas.

### Lycée Albert Schweitzer
|:fontawesome-solid-graduation-cap:|Baccalauréat scientifique mention Bien|
|:material-calendar-multiple:|2001 - 2004|
|:fontawesome-solid-map-location:|Le Raincy, France|

I was in a European class, which meant more English courses.

On my free time, I learnt a lot about coding by contributing to a 3D RTS game. My last year practical work was on generic algorithms, I wrote a somewhat working implementation for the traveling salesman problem, in DarkBasic (a Basic with 2D commands).

## Patents

* REPROGRAMMABLE POINT-OF-SALE TRANSACTION FLOWS
    * US10692055, US10762480, US10496973, US10872320

## Certifications

* Functional Programming Principles in Scala
    * Coursera, November 2012
* Sun Certified Programmer for the Java Platform, SE 6
    * 91%, License CX-310-065, November 2009
* TOEIC
    * 940, 2008
* First Certificate of Cambridge
    * Grade B with distinctions, 2004