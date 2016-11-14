---
title: "linux下vim三件套"
date: 2013-08-05 14:50
tags: CoolTool
---
linux的用户都会知道世界上的两大编辑器————编辑器之神vim 和 神之编辑器emacs。他们之所以“神”，全在于他们可以大大提高用户的效率。全键盘的操作可以让用户在键盘上舞动全部的十个手指而不需在键盘和鼠标之间来回不停地切换。今天要向大家推荐三个linux下类vim的工具，在这三个工具的帮助下，我们几乎可以在不用鼠标的情况下完成一天的工作及娱乐。<!--more-->

## i3##
诶，i3不是处理器的i3、i5、i7吗？它也变成一个工具了？还类vim？我要说此i3非彼i3，这是一个平铺式窗口管理器，简称[WM](http://zh.wikipedia.org/wiki/%E7%AA%97%E5%8F%A3%E7%AE%A1%E7%90%86%E5%99%A8)（window manager）。这个i3窗口管理器提供了一系列工具，包括i3-msg，i3-bar等，它的默认配置已经十分符合我的口味了，具体配置可参见他们的[i3用户指南](http://i3wm.org/docs/userguide.html)。我在用的时候只将它默认的上下左右方向键改成了Alt+h、j、k、l。后来又用feh将设置了一下桌面背景，这样几乎就可以应付日常应用了，还有其它需求的用户还可以按照用户手册自定义。为了实现无鼠标式操作，我在它的配置文件里添加了两个命令，分别用于启动gnome-terminal和firefox。这两个窗口几乎就可以满足我日常应用了。

## vimperator##
话说[vimperator](http://zh.wikipedia.org/wiki/Vimperator)是一个firefox下的一个插件。它的标语是：Make Firefox look and behave like Vim！这个插件的好处是它将firefox浏览器下的许多操作绑定到vim的快捷键上，这让vim用户倍感亲切。常用的h、j、k、l，用于模拟超链接点击的f，用于选定输入框的gi，用于下一页的Ctrl-f，下半页的Ctrl-d，gg，G等等，用了这个插件，浏览网页就像用vim编辑文档一样舒服。

## ranger##
ranger是一个基于文本的文件管理器。相较于其它文件管理器，ranger最大的优点是小巧和可定制性。默认绑定vim移动快捷键自不必说。ranger是用python编写的，我们可以在它原来基础上自己定义命令，绑定自己喜欢的快捷键，可定制性非常高。虽然我用ranger已经好长一段时间了，但还没真正自定义快捷键，平时用的最多的还是h、j、k、l和它的open_with。有定制需求的可以查看[ranger的archwiki](https://wiki.archlinux.org/index.php/Ranger)

虽然vim有着较陡的学习曲线，但这绝对是一个一劳永逸的“买卖”。有了以上三个“神器”，我们就可以在linux下高效简单地用全键盘完成自己一天的工作，帮助我们尽量缩短坐在电脑前的时间。在享受coding乐趣的同时，还能让我们将多出的时间花在运动上，再也不用抱着一本《颈椎病康复指南》了。特此推荐！
