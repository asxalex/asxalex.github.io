---
title: "使用tmux"
date: 2013-08-31 20:12
tags: CoolTool
---
tmux是一个终端复用软件。最早接触这个软件是在大概一年之前吧。那时候用的还是ubuntu 10.04 gnome桌面，用gnome桌面最大的缺点就是：在桌面上开了多个终端之后，终端之间的切换比较麻烦。那时候我通过google结识了终端复用软件——tmux。网络上说tmux是一款比screen还好用的终端复用软件（具体screen怎样，我也没用过，也不好下论断。）对于tmux，它的最大优点之一为：即使不正常断线，它还是可以保证当前任务运行完成。先前我也没有大量要使用ssh、telnet等远程服务，所以也体会不到它这个优点。但是，在我那会使用tmux时感觉确实挺好用——虽然没有进行大量的自己配置，但搭配快捷键后比在gnome下Ctrl-Tab键高效了许多。<!--more-->不久之后，我就找到了i3wm这个平铺式窗口管理器，在这个窗口管理器下的终端切换甚是方便，以至于以后就再没碰过tmux。

这几天把我RPi的无线网卡给驱动上了，于是以后每次玩它都需要通过ssh。于是我马上想到了tmux。起初我还想把tmux的快捷键配置得像我的i3一样——这样可以省去很多学习成本——但似乎不行。tmux需要一个prefix，然后再是组合键，而i3纯粹是通过组合键来操作的。虽然无法将它改到我熟悉的快捷键配置，但我通过网上的配置教程把它配置得更美观、更符合我的使用习惯:-)

先来看一下我的tmux配置后的效果图：

{% img http://asxalex.qiniudn.com/tmux.png %}

tmux是典型的C/S架构。  

* session: 是一个特定的终端组合，输入tmux就打开一个session，另外，可以用tmux attach [-t id]来切换到id的session；

* window: window为一个session中的终端，上图有两个运行bash的终端；

* pane: pane为一个window中的终端，可以像上图一样任意调整大小

以下为我的配置文件，这个配置文件既不是一个配置教程，也不包含所有配置选项，这只是我参照网上的配置文件进行就该的，自给自足:-) 若有需要完整教程的，请移至[这里](http://www.openbsd.org/cgi-bin/man.cgi?query=tmux&sektion=1)

```c++ ~/.tmux.conf
#set the windown name according to the app
setw -g automatic-rename

setw -g mode-keys vi

unbind &
bind q kill-window

unbind *
bind * list-clients

#move focus on adjacent pane
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R

#highlight acitve window
set-window-option -g window-status-current-bg black
set-window-option -g window-status-current-fg red

#specify statusbar
set -g status-justify left
set -g status-left-length 30
set -g status-left '[ #H]'
set -g status-right-length 40
set -g status-right '#[tmux-mem-cpu-load 1] #(date +"%Y-%m-%d %H:%M") Load:#(uptime | cut -d: -f5)'
set -g display-time 5000
set -g status-bg black
set -g status-fg green
set-window-option -g window-status-current-attr bright

#notify if other window has activities
setw -g clock-mode-colour red
setw -g clock-mode-style 24

#resize the pane
bind-key J resize-pane -D 10
bind-key K resize-pane -U 10
bind-key H resize-pane -L 10
bind-key L resize-pane -R 10

```

具体的针对session、window还有pane的操作可以在manual page上找到,也可以在tmux里面用**C-b ?**来查询，这里就不作介绍了。就是这样，喵～
