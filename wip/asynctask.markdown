---
layout: post
title: 
filename: XXX.markdown
more: 0

---

Start with android and threading. Link to doc on threads.

Then quick reminder on usage, links to doc. Parameters, pre / post hooks, cancel.

Then study the source code of most recent version, provided features. Read the source, Luke. As the green vegetable said, " "

Harmful :

Generics : cannot remember. PARAM : useless, we can use the constructor for that. Task can be used only once. What if you wanna use a simple type ? What about multiple params of different types? You need a holder type. Can use Pair, but not meaningful (no name) and less readable.

Param : what's the vararg for? Do people mostly use single params or multiple params of the same type? Means we have to deal with an array, an risk code errors. It will compile with no parameter. Re moving the vararg would have forced a param. Although we probably want to handle that ourselves.

Progress, nice feature, but again, it uses a vararg,which we do not need in most cases.

The last param, result, is ok. Quite nice to let the postExexute param type match doInBackground return type. But there's one thing not handled there : error cases. What happens to an exception thrown from an asynctask? We have to catch it. But then we have to use a specific semantic for the return type, such as null or an option. And then a if switch omPostExecute.

A common pattern for such situations is to implement a onException call back.

Then, on to the semantic. Do you know what "in background" means? Yeah, it's executed in a background Thread. Ok, but what happens if I start two long tasks one immediately  after the other ? Do they get executed in parallel, or serially (one after the other?). Pick an answer.. and you ll be wrong ! In fact, the behavior depends on the android version. Android 1.5 had a serial behavior, unintended. Fixed in 1.6, 5 threads. But changed again in ?, because people used it serially. Main problem : what happens if you save preferences quickly twice with different values? No one can tell, you need a serial behavior. Hence, the asynctask is now declared as "good for small tasks only" . Loaders introduced? Then new version where you can executeOnExecutor.

Whether you want a serial or parallel behavior, if you're supporting multiple añdroid versions then it can't do what you want. The best solution here if you really want asynctask is to copy and paste the version that fits your needs and stick to it. But maybe you don't really need an asynctask..

Then extract what's really important about asynctask. Ui thread vs background thread. Serial vs parallel. Cancellation. Clear semantics.

Then how we can reproduce each of these features, with handlers, executor service, handler threads, depending on the need. How to reproduce "cancel" and "onprogressupdate"

Check how exceptions are handled in Handler and ExecutorService.

new Handler(Looper.getMainLooper())

A few words on activity lifecycle and asynctask vs handlers? Didn't talk about it on purpose. In all cases, carefully about anonymous classes, risks of leaking outer class, bad if activity.

Open on threading in AndroidAnnotations. Doesn't provide all semantics, but good enough for many situations.

Conclusion: threads are too important to blindly rely on helped classes. Know your threads, create the tools that fit your needs.



=> Also : design a new asynctask with behavior within it.

Error handling, 3 ways : no error handling (manual catch and return an Either<Result, Exception>), or signature returns Either, or catch and delegate to success / error


Either<Result, Error> doInBackground()
void onSuccess(Result r)
void onError(Error e)

=> code Either

Result doInBackground()
void onSuccess(Result r)
void onException(Exception e)

We can actually let the second version be a specialized version of the first.

Also the Play! / symfony pattern where you call an "returnError" method that throws an exception for you.