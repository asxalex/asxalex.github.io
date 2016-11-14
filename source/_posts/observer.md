---
title: "设计模式（18）——观察者模式"
date: 2013-08-20 15:47
tags: DesignPatterns
---
观察者模式（Observer）定义对象的一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并被自动更新。比如有一个监测系统，它可以监测好几个网站。一旦有一个网站挂了，就会触发这个监测系统中的observer，这个observer会对当前发生的问题作出反应。在我们实现的栗子中，一个observer可以监测几个map，而一个map也可以被多个observer监测，是一个一对多的关系。<!--more-->先看一下类图：

{% img http://asxalex.qiniudn.com/observer.png %}

代码如下：

```c++ observer.h
#include <iostream>
#include <vector>

class map;
class observer{
    public:
        observer(){}
        virtual ~observer(){}
        virtual void update(){}
        virtual void add(map*){}
};

class map{
    public:
        map(std::string sname):name(sname){}
        virtual ~map(){}
        void add(observer *ob){mobserver.push_back(ob);}
        void remove(){mobserver.pop_back();}
        std::string getStatus(){return status;}
        void setStatus(std::string s){status = s;}
        void notify(){
            std::vector<observer *>::iterator it = mobserver.begin();
            while(it != mobserver.end()){
                (*it) -> update();
                ++it;
            }
        }
        std::string getName(){return name;}
    protected:
        std::vector<observer*> mobserver;
        std::string status;
        std::string name;
};

class MapObserver : public observer{
    public:
        virtual void update(){
            std::vector<map*>::iterator iter = mMap.begin();
            while(iter != mMap.end()){
                std::string status = (*iter) -> getStatus();
                std::cout << "the status of " <<(*iter) -> getName() << " is " << status << std::endl;
                ++iter;
            }
        }
        void add(map* m){
            mMap.push_back(m);
        }
        void remove(){mMap.pop_back();}
    private:
        std::vector<map*> mMap;
};

class map1 : public map{
    public:
        map1():map("map1"){}
};

class map2 : public map{
    public:
        map2():map("map2"){}
};
```

```c++ observer.cpp
#include "observer.h"

int main(){
    observer *obs = new MapObserver;
    map *mp1 = new map1;
    map *mp2 = new map2;
    mp1 -> add(obs);
    mp2 -> add(obs);
    obs -> add(mp1);
    obs -> add(mp2);
    mp1 -> setStatus("ok");
    mp2 -> setStatus("bad");
    mp1 -> notify();
    std::cout << "=================================================" << std::endl;
    mp2 -> notify();
    return 0;
}
```

在栗子中，每个map都有一个notify()方法，具体是它**通知**observer采取相应措施来应对map的变化。若我们需要在map**一有动静**就让observer采取措施，就可以在map的add()方法中调用notify()，而不是“手动”调用。另外，MapObserver对象的mMap成员使**一对多关系**扩展为**多对多关系**。
