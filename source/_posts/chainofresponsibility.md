---
title: "设计模式（14）——职责链模式"
date: 2013-08-19 22:18
tags: DesignPatterns
---
职责链模式（Chain Of Responsibility）是得多个对象有机会处理同一个请求，从而避免请求发送者与接收者之间的耦合关系。它将这些对象串成一条链，并沿着这条链传递该请求，直到有一个对象处理这个请求为止。设想我们学校的一个场景：假设两个同学之间发生了争吵。这时就发生一个请求————处理这两个同学之间的矛盾。起初，这个请求传递到**同学**，若他有能力处理这个请求，就调用**同学**的处理方法，并到此为止；若**同学**处理不了，就将该请求传递至**班长**，以此类推，最后传递到**老师**（假设老师可以处理任何请求）。<!--more-->类图如下：

{% img http://asxalex.qiniudn.com/chain_of_responsibility.png %}

```c++ chain_of_responsibility.h
#include <iostream>

class Person{
    public:
        Person(Person *per, int mmin, int mmax):successor(per), min(mmin), max(mmax){}
        virtual void DealWith(std::string thing, int priority){}
        virtual ~Person(){}
    protected:
        Person *successor;
        int min,max;
};

class classmate : public Person{
    public:
        classmate(Person *per, int min, int max):Person(per,min,max){}
        virtual void DealWith(std::string thing, int priority){
            if(priority >= min && priority <= max){
                std::cout << "classmate can deal with the thing: " << thing << std::endl;
            }
            else{
                std::cout << "classmate can not deal with it." << std::endl;
                successor -> DealWith(thing, priority);
            }
        }
};

class monitor : public Person{
    public:
        monitor(Person *per, int min, int max):Person(per,min,max){}
        virtual void DealWith(std::string thing, int priority){
            if(priority >= min && priority <= max)
                std::cout << "monitor can deal with the thing: " << thing << std::endl;
            else{
                std::cout << "monitor can not deal with it." << std::endl;
                successor -> DealWith(thing,priority);
            }
        }
};

class teacher : public Person{
    public:
        teacher(int min,int max):Person(0,min,max){}
        virtual void DealWith(std::string thing,int priority){
            std::cout << "teacher can deal with it." << std::endl;
        }
};
```

```c++ chain_of_responsibility.cpp
#include "chain_of_responsibility.h"

int main(){
    Person *cteacher = new teacher(0,0);
    Person *cmonitor = new monitor(cteacher,10,20);
    Person *cmate = new classmate(cmonitor,0,10);
    cmate -> DealWith("thing1",5);
    std::cout << "===========================================================" << std::endl;
    cmate -> DealWith("thing2",15);
    std::cout << "===========================================================" << std::endl;
    cmate -> DealWith("thing3",100);
    std::cout << "===========================================================" << std::endl;
    delete cmate;
    delete cmonitor;
    delete cteacher;
    return 0;
}
```

我们在这条链的每个节点都有一个successor成员用于指示若自己不能处理这个请求，该将请求交给谁继续处理。另外，我们在每个节点上都定义了一个自己的处理范围，只有当一个请求的priority处于这个范围里时这个节点才能处理，否则会将请求上交。
