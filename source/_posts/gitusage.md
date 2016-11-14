---
title: "git基础用法"
date: 2013-07-28 15:15
tags: CoolTool
---
大概一年前就接触过git，刚使用那会还没有版本控制经验，不像许多大牛一样以前用过svn等，然后从那些迁徙过来。我是直接在一次我们学校的开源社区集会上第一次听过git这个词，我还清楚地记得当时的题目是：git大杀器。听完这个之后，我才开始使用git。<!--more-->

之后，我只记住了其中最最最常用的命令，而且用法单一，每次碰到有什么不会的时候就google之，长此以往，我就越来越依赖google，现在就对git进行基础用法总结，以作记录。

``` c
git --version
git config --global user.name 查看user.name变量
git config --global user.name asxalex 设置user.name为asxalex
git config --local 
git config --system alias.st status 设置别名
git init demo 当前目录下创建demo文件夹，并初始化
git add welcome.txt 将welcome.txt加入跟踪
git commit -m "some text" 将加入跟踪的文件提交至本地版本库
git grep "text" 搜索版本库中的文件内容
git status 查看当前版本库状态
git config <section>.<key> 读取./.git/config中的值
git config <section>.<key> value 设置test.ini中的变量值为value
git config --unset --global user.name 清除user.name的设置
git commit --ammend --allow-empty --reset-author
    --ammend 对刚刚的提交进行修补，于是，不产生新提交
    --allow-empty 允许空白提交
    --reset-author 将作者ID同步修改
```

对于当前工作区，提交暂存区以及版本库：
{%img http://asxalex.qiniudn.com/Diagram1.png %}

``` c
git checkout -- file.txt 用暂存区中的file.txt覆盖工作区中的文件
git reset HEAD 用HEAD指向的分支覆盖暂存区，对工作区无影响
git checkout HEAD filename 将HEAD指向分支覆盖工作区和暂存区
git reset --hard HEAD^ 用HEAD指针之前一次提交覆盖工作区，暂存区，HEAD也后退一次
git reset --soft HEAD^ 工作区，暂存区不变，HEAD指针回退一次
git reset -- filename 用HEAD指针指向内容覆盖暂存区，工作区不变
git stash 保存当前工作进度（文件必须被git add之后才能被保存）
git stash pop 恢复最新保存的工作进度
git stash drop stash@{1} 删除stash中的第一条
git clone <repository> <directory>
git push/pull [<remote-repos> [<refspec>]] i.e. git push origin master
git push 前先 git pull 一下，一面非快进式推送
git pull = git fetch + git merge
git merge <commit> 将对应commit分支合并至当前分支
git tag <tag-name> [<commit>]
git branch 列出所有分支
git branch <branch-name> 创建分支
git checkout <branch-name> 切换分支
```
这里先将一些常用的列在这里，以后用到其它的再进行添加:-)
