---
title: "设计模式（1）——简单工厂模式"
date: 2013-08-16 00:45
tags: DesignPatterns
---
根据这几天对设计模式的学习和理解，总体来说，它主要利用了继承、抽象、封装和多态来实现代码最大程度的复用。

简单工厂模式（Simple Factory）将所要生产的产品类型放在工厂类中进行判断，使其在一定程度上对用户透明。比如说我们想要制造一个teddy bear和polar bear玩具熊，通过对bear这个概念的抽象，并辅以工厂类factory。在实际“生产”的时候，我们通过向工厂传递一个参数来告诉工厂现在应该生产什么产品。这好比在实际生活中，我们想要某样产品，我们只需向生产该产品的工厂打个电话，告诉他们我们的需求，接下来的事就不关我们的事了————生产过程对我们完全透明。<!--more-->

下面是简单工厂模式（Simple factory）的类图：

{% img http://asxalex.qiniudn.com/simple_factory.png %}

根据这个类图，我们可以轻松地写出如下代码：

```c++ simple_factory.h
#include <iostream>

enum BearType{TEDDY, POLAR};

class Bear{
    public:
        virtual void show() = 0;
};

class TeddyBear : public Bear{
    public:
        virtual void show(){
            std::cout << "I'm a teddy bear." << std::endl;
        }
};

class PolarBear : public Bear{
    public:
        virtual void show(){
            std::cout << "I'm a ploar bear." << std::endl;
        }
};

class factory{
    public:
        Bear * create_Bear(BearType set){
            if(set == TEDDY){
                return new TeddyBear();
            }
            else if(set == POLAR){
                return new PolarBear();
            }
            else{
                return NULL;    
            }
        }
};

void call_show(Bear *bear){
    bear -> show();
}
```

之后，我们可以像下面一样使用上面的工厂类：

```c++ simple_factory.cpp
#include "simple_factory.h"

int main(){
    factory fac;
    Bear *bear = fac.create_Bear(TEDDY);
    call_show(bear);
    delete bear;
    bear = fac.create_Bear(POLAR);
    call_show(bear);
    delete bear;
    return 0;
}
```

如上，在生产的时候，我们向工厂提出要求（想要生产什么样的熊），并且，我们只知道工厂送过来的是一只熊————我们甚至不需要知道那个究竟是什么熊————就可以使用它了（多亏了多态性）。


