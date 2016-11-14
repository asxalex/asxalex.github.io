---
title: "设计模式（17）——备忘录模式"
date: 2013-08-20 15:28
tags: DesignPatterns
---
备忘录模式（momento）意欲在不破坏封装性的情况下，捕获一个对象的内部状态，并在该对象在外保存这个状态。并可以在随后利用这里保存的状态恢复这个对象以前的状态。备忘录模式使用最典型的是在游戏存档和读取存档。以前我和我的小伙伴在玩游戏玩累了以后，在游戏中就可以去某个特定的存档地点进行存档。而在下一次玩游戏开局时可以读取存档来恢复游戏进度。<!--more-->看下面的类图：

{% img http://asxalex.qiniudn.com/momento.png %}

在我们的栗子里，为了简化，我们只用momento来保存一个用户的个人信息————姓名，年龄，性别。当我们要保存一个人的个人信息时，可以调用他的save()方法。这个方法返回一个momento对象，而一个library对象则可以接受这个对象为参数并保存。类似的可以进行从library对象到PersonInfo对象的加载。实现代码如下：

```c++ momento.h
#include <iostream>
#include <vector>

class momento{
    friend class PersonInfo;
    public:
        momento(std::string sname, int sage, int sgenda):name(sname), age(sage), genda(sgenda){}
        momento& operator=(const momento & momen){
            name = momen.name;
            age = momen.age;
            genda = momen.genda;
            return *this;
        }
    private:
        std::string name;
        int age;
        int genda;
};

class PersonInfo{
    public:
        PersonInfo(std::string sname, int sage, int sgenda):name(sname),age(sage),genda(sgenda){}
        void grow(){
            age += 1;
        }
        momento save(){
            momento temp = momento(name,age,genda);
            return temp;
        }
        void load(const momento &mo){
            name = mo.name;
            age = mo.age;
            genda = mo.genda;
        }
        void show(){
            std::cout << "name: " << name << std::endl;
            std::cout << "age: " << age << std::endl;
            std::cout << "genda: " << ((genda == 1)? "male":"female") << std::endl;
        }
    private:
        std::string name;
        int age;
        int genda;
};

class library{
    public:
        library(){}
        void save(momento mo){
            lib.push_back(mo);
        }
        momento load(int n){
            return lib[n];
        }
    private:
        std::vector<momento> lib;
};
```

```c++ momento.cpp
#include "momento.h"

int main(){
    PersonInfo me("asxalex",21,1);
    library lib;
    me.show();
    me.grow();
    lib.save(me.save());
    me.grow();
    me.show();
    me.load(lib.load(0));
    me.show();
    return 0;
}
```
