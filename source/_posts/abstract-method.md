---
title: "设计模式（3）——抽象工厂模式"
date: 2013-08-16 14:23
tags: DesignPatterns
---
抽象工厂模式（abstract factory）也是一种创建型模式。《Design Patterns》上说：抽象工厂模式的意图为提供一个创建**一系列**相关或相互依赖对象的接口，而无需指定他们具体的类。

上面那个“一系列”比较重要：还记得工厂方法模式的意图吗，工厂方法模式是创建一个对象的接口。所以这是那个**一系列**是区分他们两个的关键。在简单工厂模式中，我们利用参数来实现一个工厂生产“一系列”产品。在我看来，简单工厂模式与工厂方法模式的结合就**类似于**抽象工厂模式。<!--more-->

下面是一个生产熊的类图，在这个时候，我们的需求又扩充了：我们不仅要制造两个种类的熊，我们还要制造不同尺寸的熊————当然，这里只有大号和小号。

{% img http://asxalex.qiniudn.com/abstract_factory.png %}

从类图中看出，里面还是只有两个具体的工厂————与工厂方法模式一样多。但是，与工厂方法模式不同的是：抽象工厂模式中的工厂比较先进，它一个工厂可以生产不同种类的产品————在这里是生产不同尺寸的产品，这估计就是它的**抽象**所在吧:-)

我们写出如下代码：

```c++ abstract_factory.h
#include <iostream>

class SmallSize{
    public:
        virtual void show() = 0;
};

class SmallTeddy : public SmallSize{
    public:
        virtual void show(){
            std::cout << "I'm a small sized teddy bear." << std::endl;
        }
};

class SmallPolar : public SmallSize{
    public:
        virtual void show(){
            std::cout << "I'm a small sized polar bear." << std::endl;
        }
};

class LargeSize{
    public:
        virtual void show() = 0;
};

class LargeTeddy: public LargeSize{
    public:
        virtual void show(){
            std::cout << "I'm a large sized teddy bear." << std::endl;
        }
};

class LargePolar: public LargeSize{
    public:
        virtual void show(){
            std::cout << "I'm a large sized polar bear." << std::endl;
        }
};

class factory{
    public:
        virtual SmallSize* createsmallsize() = 0;
        virtual LargeSize* createlargesize() = 0;
};

class TeddyFactory : public factory{
    public:
        virtual SmallSize* createsmallsize(){
            return new SmallTeddy();
        }
        virtual LargeSize* createlargesize(){
            return new LargeTeddy();
        }
};

class PolarFactory : public factory{
    public:
        virtual SmallSize* createsmallsize(){
            return new SmallPolar();
        }
        virtual LargeSize* createlargesize(){
            return new LargePolar();
        }
};
```

使用方法为：

```c++ abstract_factory.cpp
#include "abstract_factory.h"

void show_small(SmallSize *small){
    small -> show();
}
void show_large(LargeSize *large){
    large -> show();
}

int main(){
    factory *faca = new TeddyFactory();
    factory *facb = new PolarFactory();
    show_small(faca -> createsmallsize());
    show_large(faca -> createlargesize());
    show_small(facb -> createsmallsize());
    show_large(facb -> createlargesize());
    return 0;
}
```

在这里，为了更清除地看出**工厂方法模式和简单工厂模式的结合**与**抽象工厂模式**有什么不同，下面对前者也进行了实现。

```c++ together.h
#include <iostream>

enum SIZE{LARGE,SMALL};

class Size{
    public:
        virtual void show() = 0;
};

class SmallSize : public Size{
    public:
        virtual void show(){};
};

class SmallTeddy : public SmallSize{
    public:
        virtual void show(){
            std::cout << "I'm a small sized teddy bear." << std::endl;
        }
};

class SmallPolar : public SmallSize{
    public:
        virtual void show(){
            std::cout << "I'm a small sized polar bear." << std::endl;
        }
};

class LargeSize : public Size{
    public:
        virtual void show(){};
};

class LargeTeddy: public LargeSize{
    public:
        virtual void show(){
            std::cout << "I'm a large sized teddy bear." << std::endl;
        }
};

class LargePolar: public LargeSize{
    public:
        virtual void show(){
            std::cout << "I'm a large sized polar bear." << std::endl;
        }
};

class factory{
    public:
        virtual Size* create(SIZE a){
            if(a == SMALL)
                return createsmallsize();
            else
                return createlargesize();
        }
    protected:
        virtual Size* createsmallsize(){return 0;}
        virtual Size* createlargesize(){return 0;}
};

class TeddyFactory : public factory{
    protected:
        virtual Size* createsmallsize(){
            return new SmallTeddy();
        }
        virtual Size* createlargesize(){
            return new LargeTeddy();
        }
};

class PolarFactory : public factory{
    protected:
        virtual Size* createsmallsize(){
            return new SmallPolar();
        }
        virtual Size* createlargesize(){
            return new LargePolar();
        }
};
```

在这里，为了在两个工厂里面返回类型的统一，我们使SmallSize类与LargeSize类均继承自类Size，在要生产不同尺寸的熊时，通过向工厂传递特定参数来完成。使用方法如下：

```c++ together.cpp
#include "together.h"

void show(Size *si){
    si -> show();
}

int main(){
    factory *faca = new TeddyFactory();
    factory *facb = new PolarFactory();
    show(faca -> create(SMALL));
    show(faca -> create(LARGE));
    show(facb -> create(SMALL));
    show(facb -> create(LARGE));
    return 0;
}
```

上下运行结果相同。
