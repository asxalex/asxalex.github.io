---
title: "设计模式（2）——工厂方法模式"
date: 2013-08-16 13:04
tags: DesignPatterns
---
根据经典的GoF的《Design Patterns》上的定义，工厂方法模式（Factory Method）的意图为：定义一个用于创建对象的接口，让子类决定实例化哪个类。它使一个类的实例化推迟到其子类。

我们首先用为所生产的产品定义一个抽象的product类，用于提供接口。之后让具体的产品类继承这个product类。然后再定义一个抽象的工厂类。当我们要特别生产某个产品时，就从这个工厂类派生出某个类来生产它。这就相当于在一个有很多车间的工厂中会产生很多产品，而每个车间负责生产一个特定产品。<!--more-->

举个栗子。

{% img http://asxalex.qiniudn.com/lizi.jpeg %}

接着上一次，我们又想要生产小熊了。我们这次生产时不是打电话给那个工厂的负责人，我们手头上只有那个工厂里生产车间的车间主任的电话，并且我们知道每个车间生产的东西。所以当我们要一个teddy bear时，我们就打电话给工厂里的TeddyBear车间主任。让他帮忙生产。

这个栗子的类图如下：

{% img http://asxalex.qiniudn.com/factory_method.png %}

根据类图，有如下代码：

```c++ factory_method.h
#include <iostream>

class Bear{
    public:
        virtual void show() = 0;
};

class TeddyBear: public Bear{
    public:
        virtual void show(){
            std::cout << "I'm a teddy bear." << std::endl;
        }
};

class PolarBear: public Bear{
    public:
        virtual void show(){
            std::cout << "I'm a polar bear." << std::endl;
        }
};

class factory{
    public:
        virtual Bear * create_Bear() = 0;
};

class TeddyFactory : public factory{
    public:
        virtual Bear* create_Bear(){
           return new TeddyBear;
        }
};

class PolarFactory : public factory{
    public:
        virtual Bear* create_Bear(){
            return new PolarBear;
        }
};
```

使用方法为：

```c++ factory_method.cpp
#include "factory_method.h"

int main(){
    factory *teddyfactory = new TeddyFactory();
    teddyfactory -> create_Bear() -> show();
    delete teddyfactory;
    factory *polarfactory = new PolarFactory();
    polarfactory -> create_Bear() -> show();
    delete polarfactory;
    return 0;
}
```

如上，在现在各个车间负责生产各自的产品，用起来比较“清爽”。当然，这样做也有明显的不足：就是当我们产品种类繁多时，就会有许多车间，会产生一种叫类爆炸的效应。
