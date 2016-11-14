---
title: "设计模式（20）——策略模式"
date: 2013-08-21 13:04
tags: DesignPatterns
---
策略模式（Strategy）定义一系列算法，把他们一个个封装起来，并且使他们可以相互替换。此模式可以使得算法可独立于使用他们的客户的变化而变化。

比如说我们现在要去某个风景名胜旅游。于是你在网上查好了路线。有许多策略：你可以选择A——B——C——D，或者A——E——F——D，或者A——G——D。你可以不关心具体路线，只要到达目的就行。于是这些路线就成了算法，他们应该独立于我们客户——即我们可以随时更换这些策略。<!--more-->为了简化，看下面的类图：

{% img http://asxalex.qiniudn.com/stategy.png %}

这是最简单的类之间的继承关系，实现代码如下：

```c++ strategy.h
#include <iostream>

enum APPROACH{AP1, AP2};
class approach{
    public:
        virtual void means() = 0;
};

class approach1 : public approach{
    public:
        virtual void means(){
            std::cout << "this is approach one" << std::endl;
        }
};

class approach2 : public approach{
    public:
        virtual void means(){
            std::cout << "this is approach two" << std::endl;
        }
};

class select_approach{
    public:
        select_approach(APPROACH);
        ~select_approach(){delete _app;}
        void show_approach() const;
    private:
        approach *_app;
};

select_approach::select_approach(APPROACH app){
    switch(app){
        case AP1:
            _app = new approach1;
            break;
        case AP2:
            _app = new approach2;
            break;
        default:
            _app = NULL;
            break;
    }
}


void select_approach::show_approach() const{
    _app -> means();
}
```

```c++ strategy.cpp
#include "strategy.h"

int main(){
    select_approach sele_app1(AP1);
    sele_app1.show_approach();
    select_approach sele_app2(AP2);
    sele_app2.show_approach();
    return 0;
}
```

在这个栗子中，我们通过向select_approach传递参数来选择具体的策略。
