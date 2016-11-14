---
title: "设计模式（19）——状态对象模式"
date: 2013-08-21 12:47
tags: DesignPatterns
---
状态对象模式（State）允许一个对象在其内部状态改变时改变它的行为，使对象看起来似乎修改了它的类。

我们来考虑一个**人**。人有许多年龄阶段：童年，少年，青年，中年，老年等。我们这个栗子中定义了一个**Human**类，当我们设置年龄时，这个类就会根据当时的年龄来选择自己相应的阶段。仿佛这个类会随着年龄的增长而自己变化一样。<!--more-->先看下类图：

{% img http://asxalex.qiniudn.com/state.png %}

实现代码为：

```c++ state.h
#include <iostream>

//child(0-7),teenager(8-13),youth(14-25),wrinkly(26-65),elderly(> 65)
#define CHILD 7
#define TEENAGER 9
#define YOUTH 11
#define WRINKLY 13


class Human;
class State{
    public:
        State(){}
        virtual ~State(){}
        virtual void current(Human *human){}
        virtual void child(Human *human){}
        virtual void teenager(Human *human){}
        virtual void youth(Human *human){}
        virtual void wrinkly(Human *human){}
        virtual void elderly(Human *human){}
};

class Human{
    public:
        Human(std::string sname,State *s):name(sname),period(s){}
        ~Human(){}
        int getAge(){return age;}
        void setAge(int i){age = i;}
        void getPeriod(){period -> current(this);}
        void setPeriod(State *s){period = s;}
        std::string getname(){return name;}
    private:
        std::string name;
        int age;
        State *period;
};

class Elderly: public State{
    public:
        virtual void elderly(Human *human){
            std::cout << "Now " << human -> getname() << " is an elderly." << std::endl;
        }
        virtual void current(Human *human){elderly(human);}
};

class Wrinkly: public State{
    public:
        virtual void wrinkly(Human *human){
            int age = human -> getAge();
            if(age <= WRINKLY)
                std::cout << "Now " << human -> getname() << " is a wrinkly." << std::endl;
            else{
                human -> setPeriod(new Elderly);
                human -> getPeriod();
            }
        }
        virtual void current(Human *human){wrinkly(human);}
};

class Youth: public State{
    public:
        virtual void youth(Human *human){
            int age = human -> getAge();
            if(age <= YOUTH)
                std::cout << "Now " << human -> getname() << " is a youth." << std::endl;
            else{
                human -> setPeriod(new Wrinkly);
                human -> getPeriod();
            }
        }
        virtual void current(Human *human){youth(human);}
};

class Teenager : public State{
    public:
        virtual void teenager(Human *human){
            int age = human -> getAge();
            if(age <= TEENAGER)
                std::cout << "Now " << human -> getname() << " is a teenager." << std::endl;
            else{
                human -> setPeriod(new Youth());
                human -> getPeriod();
            }
        }
        virtual void current(Human *human){teenager(human);}
};

class Child : public State{
    public:
        virtual void child(Human *human){
            int age = human -> getAge();
            if(age <= CHILD ){
                std::cout << "Now " << human -> getname() << " is a child." << std::endl;
            }
            else{
                human -> setPeriod(new Teenager());
                human -> getPeriod();
            }
        };
        virtual void current(Human *human){child(human);}
};
```

```c++ state.cpp
#include "state.h"

int main(){
    Human *alex = new Human("alex",new Child);
    for(int i = 0; i < 19; ++i){
        alex -> setAge(i);
        alex -> getPeriod();
    }
    return 0;
}
```

实现代码中，我们为了在终端打印出相对较少的信息而又可以达到测试的目的，所以特地将各年龄段的年龄设置得比较小。另外，我们的Human类随着时间的退役只能**变老**，比如说在青年时，他不能变成少年，即越活越年轻。假如某天科技发达到可以使人类**返老还童**，那我们就需要修改各个年龄阶段中的判断条件。暂不在考虑范围内。
