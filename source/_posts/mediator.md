---
title: "设计模式（16）——中介者模式"
date: 2013-08-20 15:05
tags: DesignPatterns
---
中介者模式（mediator）用一个中介来封装一系列的对象交互。它使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变他们之间的交互。这次的栗子是一个“雇佣者与被雇佣者”的模型。我们建立了一个雇佣中介。当一个雇佣者（employer）有雇佣消息时，他就通过“雇佣中介”来通知被雇佣者（employee）来散布消息；同理，当employee有要找工作时，可以通过这个“雇佣中介”来通知employer。<!--more-->类图如下：

{% img http://asxalex.qiniudn.com/mediator.png %}

关于这个类图的实现代码如下：

```c++ mediator.h
#include <iostream>

enum SIDE{sidea,sideb};
class mediator;
class Side{
    public:
        virtual void getMessage(std::string message){}
        virtual void sendMessage(std::string message, SIDE to){}
        virtual void setMediator(mediator *smed){}
    protected:
        mediator *med;
};

class mediator{
    public:
        virtual void setSideA(Side *side){sideA = side;}
        virtual void setSideB(Side *side){sideB = side;}
        virtual void inform(std::string message, SIDE side){(side == sidea? sideA: sideB) -> getMessage(message);}
    protected:
        Side* sideA;
        Side* sideB;
};

class EmployMediator : public mediator{};

class employer : public Side{
    public:
        virtual void getMessage(std::string message){
            std::cout << "get message from employee: " << message << std::endl;
        }
        virtual void sendMessage(std::string message, SIDE to){med -> inform(message, to);}
        virtual void setMediator(mediator *smed){med = smed;}
};

class employee : public Side{
    public:
        virtual void getMessage(std::string message){
            std::cout << "get message from employer: " << message <<std::endl;
        }
        virtual void sendMessage(std::string message, SIDE to){med -> inform(message, to);}
        virtual void setMediator(mediator *smed){med = smed;}
};
```

```c++ mediator.cpp
#include "mediator.h"

int main(){
    //sidea or sideb is used to represent either of side.
    mediator *med = new EmployMediator;
    Side *emper = new employer;
    Side *empee = new employee;
    emper -> setMediator(med);
    empee -> setMediator(med);
    med -> setSideA(emper);
    med -> setSideB(empee);
    emper -> sendMessage("I'd love to employ a person.",sideb);
    empee -> sendMessage("I'd love to be employed by a person.",sidea);
    delete empee;
    delete emper;
    delete med;
    return 0;
}
```

mediator模式对对象如何协作进行了抽象，使控制集中化。
