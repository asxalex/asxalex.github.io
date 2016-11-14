---
title: "设计模式（6）——单例模式"
date: 2013-08-17 13:47
tags: DesignPatterns
---
单例模式（singleton）可保证一个类仅有一个实例，并提供一个访问它的全局控制点。还是举那个老生常谈的栗子：现在小熊梦工厂又推出了新服务，它提供VIP定制功能，即你可以特地通知他们生产一个全球唯一的小熊，当然价格不菲。工厂肯定不希望有任何人可以造出这个小熊。单例模式的需求在这里出现了。<!--more-->

在单例模式中，一个类负责创建和保存自己的唯一实例，并提供一个通用的、众所周知的接口来获得这个对象。为此，我们在该类中定义一个静态函数，用以获取这个类自己保存的实例。

我们代码的类图为：

{% img http://asxalex.qiniudn.com/singleton.png %}

代码实现如下：

```c++ singleton.h
#include <iostream>

enum TYPE{TYPEA, TYPEB};
class singleton{
    public:
        static singleton* instance(TYPE) ;
        virtual void show() = 0;
        virtual ~singleton(){
            if(! _singleton)
                delete _singleton;
            _singleton = 0;
        }
    protected:
        singleton(){}
    private:
        static singleton * _singleton;
};
singleton* singleton::_singleton = 0;


class singletonA : public singleton{
    friend class singleton;
    public:
        virtual void show(){
            std::cout << "In singletonA" << std::endl;
        }
    protected:
        singletonA(){}
};

class singletonB : public singleton{
    friend class singleton;
    public:
        virtual void show(){
            std::cout << "In singletonB" << std::endl;
        }
    protected:
        singletonB(){}
};

singleton* singleton::instance(TYPE type){
    if(_singleton == 0){
        if(type == TYPEA)
            _singleton = new singletonA;
        else if (type == TYPEB)
            _singleton = new singletonB;
        else{
            std::cout << "unknown class type" << std::endl;
            _singleton = 0;    
        }
    }
    return _singleton;
}
```

使用方式为：

```c++ singleton.cpp
#include "singleton.h"

int main(){
    singleton *a = singleton::instance(TYPEA);
    a -> show();
    delete a;
    singleton *b = singleton::instance(TYPEB);
    b -> show();
    delete b;
    return 0;
}
```

在这里我们注意一下那个singleton类，在它的析构函数中，它将_singleton释放掉，并且将其重置为0，而在静态函数中我们又可以发现：当_singleton为0时又可以重新分配空间。所以我们可以“重复利用”一个singleton（好像违背了它的本意），在将它delete之后重新生成。另外，为了能在基类singleton中访问它的派生类singletonA与singletonB，我们在将基类声明为派生类的友元（将基类声明为派生类的友元的情况似乎十分少见）。
