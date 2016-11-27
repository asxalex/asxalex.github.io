---
title: "c++容器"
date: 2013-08-06 01:52
tags: cpp
---
c++标准库中定义了一些容器，其中包括顺序容器和关联容器。当时学习的时候感觉看得挺明白的，但当真正要写代码的时候，比如在set容器中插入一个元素，只依稀记得有insert方法，但要确切指出各种参数等等细节的时候还是有点迷糊，还得google之。为此，用这篇文章记录一下，以备后用。<!--more-->

## 顺序容器##
标准库中定义了三种顺序容器————vector、list和deque（double end queue，双端队列）。这些容器类型的差别在于它们提供哪些操作。容器类型的操作集合形成了以下层次结构:

* 一些操作适用于所有容器类型。
* 另外一些操作则只适用于顺序或关联容器类型。
* 还有一些操作只适用于顺序或关联容器类型的一个子集。

| 顺序容器 | 特点 |
| ---------|------|
| vector   | 支持随机快速访问 
| list     | 支持快速插入/删除
|deque     | 双端队列 

为了定义一个容器对象，需包含

> \#include \<vector\>  
> \#include \<list\>  
> \#include \<deque\>  

## 容器的初始化##
容器提供了一些构造函数，以指定容器元素初值。以下令C为容器类型，c为容器类型的对象

|元素初始化|说明|
|----------|----|
|C<T> c;|创建名为c的空容器，T为元素类型，如int，double等
|C c(c2);|创建名为c的c2容器的副本，c与c2必须有相同的容器类型
|C c(beg,end);|创建元素为迭代器beg与end范围内元素的副本的容器c
|C c(n,t);|创建元素为n个t的容器c
|C c(n);|创建n个有初值的容器c

## 容器的迭代器
迭代器是由容器提供的用于与容器共同工作的类型。由
> C\<T\>::iterator iter;

声明

而它的常用用法为：
```c++
vector<string> vstr(10,"abc");
vector<string>::iterator viter = vstr.begin();
while(viter != vstr.end()){
    //do the things
    viter++;
}
```
其中，所有迭代器均支持自增（++），自减（--），解引用操作（*iter），以及相等（==）、不等（!=）的比较。而vector与deque容器的迭代器还支持算数运算（iter + n; iter += iter2; iter1 - iter2; 等）和一些比较操作符（<=,<,>=,> 等）。
c++使用了一对迭代器来表示迭代器范围，分别为iter.begin()与iter.end()，这是一个类似与数学上的**左闭右开**区间，即iter.begin()指向了容器的第一个元素，而iter.end()指向了容器最后一个元素后面的那个元素。**[iter.begin(),iter.end())**。这样安排就可以写出上面的代码，用viter != vstr.end()作为**判断条件**来退出循环。

## 顺序容器提供的操作##
<br/>
### 1 容器的begin、end操作

|||
|----|----|
|c.begin()|返回一个迭代器，指向c的第一个元素
|c.end()|返回一个指向c的最后一个元素之后的位置的迭代器
|c.rbegin()|返回一个逆序迭代器，指向c最后一个元素
|c.rend()|指向c第一个元素的前一个位置

<br/>
### 2 顺序容器中添加元素操作

|||
|--|--|
|c.push_back(t)|在c尾部添加值为t的元素，返回void
|c.push_front(t)|在c前端添加值为t的元素，返回void，push* **不支持**vector容器类型
|c.insert(p,t)|在迭代器p所指元素前插入t，返回指向t的迭代器
|c.insert(p,n,t)|同上，返回void，连续插入n个值为t的元素
|c.insert(p,b,e)|在p所指元素前插入迭代器b、e标记范围内的元素，返回void

<br/>
### 3 顺序容器大小操作

|||
|--|--|
|c.size()|返回c容器中元素个数，类型为C::size_type
|c.max_size()|返回c容器最多容纳个数
|c.empty()|返回c容器元素个数是否为0的bool值
|c.resize(n)|将c容量设为n，多了删掉，少了补上并初始化
|c.resize(n,t)|所有补上的元素均初始化为t

<br/>
### 4 删除顺序容器内的元素操作

|||
|--|--|
|c.erase(p)|删除迭代器p所指元素，返回p下个元素的迭代器
|c.erase(b,e)|删除迭代器b、e标记范围内所有元素，指向e后一个迭代器
|c.clear()|删除容器c所有元素，返回void
|c.pop_back()|删除容器c的最后一个元素，返回void
|c.pop_front()|删除容器c的第一个元素，返回void

\*注1 前两个erase()函数中，若p或e指向最后一个元素，则返回后一个元素迭代器，若他们本身是指向超出末端的下一位置的迭代器，则函数未定义  
\*注2 pop\*函数**不适用**于vector容器

<br/>
### 5 顺序容器的赋值操作

|||
|--|--|
|c1 = c2|删除c1所有元素，将c2元素复制给c1，他们类型必须相同
|c1.swap(c2)|c1与c2交换内容
|c.assign(b,e)|用迭代器b、e范围内元素给c赋值，b和e必须**不是**指向c中元素的迭代器
|c.assign(n,t)|用n个值为t的元素给c赋值

<br/>
### 6 访问顺序容器内元素的操作

|||
|---|---|
|c.back()|返回容器最后一个元素的引用
|c.front()|返回容器第一个元素的引用
|c[n]|返回下标为n的元素引用（下标从0开始），只适用于vector与deque
|c.at(idx)|返回下标为n的元素的引用，只适用于vector与deque

<br/>
另外，因为有三种顺序容器类型，所以有以下顺序容器选用规则：
> 如果程序要求随机访问元素，则优先使用vector或deque容器

> 如果程序需要频繁地在中间位置插入元素，则应使用list容器

> 如果程序只在容器首部或尾部频繁插入，则应使用deque容器

那就先总结到这吧。