---
title: "设计模式（8）——桥接模式"
date: 2013-08-18 15:34
tags: DesignPatterns
---
桥接模式（bridge）将抽象部分与它的实现部分分离，使他们可以独立变化。这里我们用的栗子是我网上看到的：说我们家里有许多开关，又有许多电器。同一个开关可以接在不同的电器上，同一个电器也可以用不同的开关。而连接起他们的是电线。桥接模式就像这根电线一样可以将两边的物品分开：当一个开关坏了，可以拿另外一个换上，而不影响电器的使用；当一个电器需要更换，也没必要去换开关。两边都是独立的。<!--more-->先看一下我们的桥接模式的类图：

{% img http://asxalex.qiniudn.com/bridge.png %}

实现上例类图的代码：

```c++ bridge.h
#include <iostream>

class Electronics{
    public:
        virtual void poweron(){}
        virtual void poweroff(){}
};

class light : public Electronics{
    public:
        virtual void poweron(){
            std::cout << "the light is powered on" << std::endl;
        }
        virtual void poweroff(){
            std::cout << "the light is powered off" << std::endl;
        }
};

class fan : public Electronics{
    public:
        virtual void poweron(){
            std::cout << "the fan is powered on" << std::endl;
        }
        virtual void poweroff(){
            std::cout << "the fan is powered off" << std::endl;
        }
};

class Switcher{
    public:
        virtual void on(){
            elec -> poweron();
        }
        virtual void off(){
            elec -> poweroff();
        }
        virtual void plug(Electronics* eelec){
            elec = eelec;
        }
        virtual void unplug(){
            elec = 0;
        }
        virtual ~Switcher(){}
        virtual void show() = 0;
    private:
        Electronics *elec;
};

class NormalSwitch : public Switcher{
    public:
        virtual void show(){
            std::cout << "this is a Normal Switcher" << std::endl;
        }
};

class FancySwitch : public Switcher{
    public:
        virtual void show(){
            std::cout << "this is a Fancy Switcher" << std::endl;
        }
};
```

相应使用方法：

```c++ bridge.cpp
#include "bridge.h"

int main(){
    Switcher *a = new NormalSwitch;
    Electronics *myfan = new fan;
    Electronics *mylight = new light;
    a -> plug(myfan);
    a -> on();
    a -> off();
    a -> unplug();
    a -> plug(mylight);
    a -> on();
    a -> off();
    a -> unplug();
    delete mylight;
    delete myfan;
    delete a;
    return 0;
}
```

桥接模式分离了接口及其实现部分，提高了可扩充性，我们可以独立地对它两边的对象进行更换、修改，而不影响使用。
