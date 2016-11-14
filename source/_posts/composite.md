---
title: "设计模式（9）——组合模式"
date: 2013-08-18 23:39
tags: DesignPatterns
---
组合模式（Composite）用于将对象组合成树形结构以表示“部分——整体”的**层次结构**，它使得用户对单个对象和组合对象的使用具有一致性。

我们组合模式的栗子是一个“Province——Country”的表示结构。在这个结构中，有一个Country，这个Country下允许有多个Province，为了使用户在操作这个组合对象时，能与操作单个对象具有一致性，我们给这个结构定义了一个基类————在栗子中是composite类。在基类中定义好一系列无论是Country，还是Province会用到的操作接口。又定义派生类Country与Province继承composite。<!--more-->这两个类分别挑选自己“感兴趣”的操作进行实现，具体看下面类图及示例代码：

{% img http://asxalex.qiniudn.com/composite.png %}

```c++ composite.h
#include <iostream>
#include <vector>

class composite{
    public:
        composite(std::string str) : name(str){}
        virtual void show(int depth){}
        virtual ~composite(){}
        virtual void add(composite *cry){}
    protected:
        std::string name;
};

class Country : public composite{
    public:
        Country(std::string str): composite(str){}
        virtual void add(composite *);
        virtual void show(int);
    private:
        std::vector<composite*> chain;
};

void Country::show(int depth){
    for(int i = 0; i < depth; ++i)
        std::cout << "-";
    std::cout << name << std::endl;
    std::vector<composite*>::iterator it = chain.begin();
    for(; it != chain.end(); ++it)
        (*it) -> show(depth + 2);
}


void Country::add(composite *coun){
    chain.push_back(coun);
}


class province : public composite{
    public:
        province(std::string str):composite(str){}
        ~province(){}
        virtual void show(int depth){
            for(int i = 0; i < depth; ++i)
                std::cout << "-";
            std::cout << name << std::endl;
        }
};

```

定义好上面类之后，下面为测试代码：

```c++ composite.cpp
#include "composite.h"

int main(){
    Country countries("Countries");
    Country china("China");
    Country american("America");
    province state1("state1");
    province state2("state2");
    province JiangSu("Jiangsu");
    province ShannXi("ShannXi");
    china.add(&JiangSu);
    china.add(&ShannXi);
    american.add(&state1);
    american.add(&state2);
    countries.add(&china);
    countries.add(&american);
    countries.show(0);
    return 0;
}

```

如代码所示，在Country类中有个add操作，来添加在它之下的Province，而Province之下则没有其它部门（假设没有），所以它不需要add操作，只有自己需要完成的show()方法。show()方法只是一个抽象，其实可以在这个方法中完成实际需要完成的事，而非只是显示。实际中除了add操作，我们还可以定义remove等操作，使结构的**安装**和**拆卸**更具灵活性。



