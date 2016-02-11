---
layout: post
title: String Truncation of HTML
tags:
- C#
---

I've recently come across a little website formatting problem which was fun to solve. We've got a bunch of news stories to present on an index page, but content has never been created for summaries for each of them.

If we have a 4000 character news story containing HTML formatting, how to make a 300 character summary?

There are a few options:

1. Use CSS and `text-overflow` to show a limited amount of text. This would be nice if the output was going to be in a fixed size container and was a single line of text. In this instance it's neither, so the CSS doesn't really solve the problem.
2. Use CSS `-webkit-line-clamp` and cross browser hacks to simulate it. Once again, we need to know the height of the container, variable sized content causes problems.
3. `value.Substring(0, 400)` - chop that string wherever! Breaks very quickly as the string contains HTML - we could be breaking in the middle of a tag, or the break could caused unbalanced tags. This obvious solution also chops words in half which looks horrible.
4. Write some funky code. Let's do this!

Additional requirements are to put an ellipsis (`&hellip;`) and "read more" type link after the summary.

Biggest difficulty is dealing with HTML of an unknown format. Could have malformed & self closing tags. For parsing HTML I have always turned to the excellent [HtmlAgilityPack](http://nuget.org/packages/HtmlAgilityPack).

``` c#
var doc = new HtmlDocument();
doc.LoadHtml(html);
```

HtmlAgilityPack turns arbitrary HTML into a well formed XML DOM.

The next issue is working out how where to truncate. The approach I took is to traverse the DOM tree getting all the text nodes. LINQ and a couple of extension methods make this easy.

``` c#
public static IEnumerable<HtmlNode> Descendants(this HtmlNode root)
{
    return new[] { root }.Concat(root.ChildNodes.SelectMany(child => child.Descendants()));
}

public static IEnumerable<HtmlNode> TextDescendants(this HtmlNode root)
{
    return root.Descendants().Where(n => n.NodeType == HtmlNodeType.Text && !String.IsNullOrWhiteSpace(n.InnerText));
}
```

Now count text characters in those nodes until I find the element where the truncation should occur. 

Then truncate the text then delete all the remaining nodes with a recursive function that goes back up the DOM tree:

``` c#
private static void RemoveFollowingNodes(HtmlNode lastNode)
{
    while (lastNode.NextSibling != null) lastNode.NextSibling.Remove();
    if (lastNode.ParentNode != null) RemoveFollowingNodes(lastNode.ParentNode);
}
```
There are a few more tricks like moving the ellipsis back to a preceeding node if the truncation resulted in an empty node. This would prevent situations like an empty `<li>` for instance. I also move the truncation point back to the previous word break if it is in the middle of a word.

{% gist 145371c5b61cc05d0dd3 %}


