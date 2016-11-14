---
title: "设计模式（5）——原型模式"
date: 2013-08-17 13:03
tags: DesignPatterns
---
原型模式（prototype）意在用原型实例指定创建对象的种类，并通过拷贝这些原型创建新的对象。还是看看那个生产小熊的栗子。我们已经收到了那个工厂里面制作出来的一个teddy bear。最近那个工厂技术突飞猛进，发明了一项新技术。你在你收到的那个小熊肚子上看到一个按钮，上面标着“clone”的字样。于是你按捺不住好奇之心，按下了那个按钮。于是奇迹发生了：在你眼前凭空出现了一个与那个一模一样的teddy bear！更令人惊奇的是：假如你把原先那个小熊的手弄断了，新生产出来的小熊也会有个断的手臂，也就是说：克隆出来的小熊完全基于生产它的那个小熊，而不是一个呆板的模板！<!--more-->

原型模式就是有这个“克隆”的神器功能。我们知道类有拷贝构造函数。在这个基础之上，我们又实现了clone()函数，在clone函数中，我们调用拷贝构造函数，而参数就是本身，这样构造出来的对象就与原对象“一模一样”了。看看下面的类图：

{% img http://asxalex.qiniudn.com/prototype.png %}

再看看下面的实现代码你就会完全明白了：

```c++ prototype.h
#include <iostream>

class proto{
    public:
        proto(int aa = 0, std::string bb = ""):a(aa), b(bb){}
        proto(const proto& pro):a(pro.a), b(pro.b){}
        virtual ~proto(){}
        virtual proto* clone() = 0;
        virtual void show() = 0;
    protected:
        int a;
        std::string b;
};

class protoA : public proto{
    public:
        protoA(int aa = 0, std::string bb = ""): proto(aa,bb){}
        protoA(const protoA &pA):proto(pA.a, pA.b){}
        proto* clone(){
            return new protoA(*this);
        }
        void show(){
            std::cout << "In proto A" << std::endl;
        }
};

class protoB :public proto{
    public:
        protoB(int aa = 0, std::string bb = ""):proto(aa,bb){}
        protoB(const protoB &pB):proto(pB.a, pB.b){}
        proto* clone(){
            return new protoB(*this);
        }
        void show(){
            std::cout << "In proto B" << std::endl;
        }
};
```

使用方法为：

```c++ prototype.cpp
#include "prototype.h"

int main(){
    proto *a = new protoA(12,"string");
    proto *b = new protoB(21,"gnirts");
    proto *c = a -> clone();
    proto *d = b -> clone();
    c -> show();
    d -> show();
    delete a;
    delete b;
    c -> show();
    d -> show();
    delete c;
    delete d;
    return 0;
}
```

我们可以看出：这是一种深拷贝，就算释放原对象，被创建出来的对象也会依旧存在。也就是说你通过clone按钮生成的小熊与原来的小熊已经毫无关系，只不过刚“出生”的时候与它老爸（或叫老妈）长得一模一样而已:-)

当一个类的实例只能有几个不同状态组合中的一种时。建立相应数目的原型并克隆它们可能比每次用合适的状态手工实例化该类更方便一些。

