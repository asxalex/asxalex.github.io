---
title: "设计模式（21）——模板方法模式"
date: 2013-08-21 13:23
tags: DesignPatterns
---
模板方法模式（Template Method）定义操作中一个算法的架构而将一些步骤延迟到子类中。它使得一个子类可以不改变一个算法的结构即可重定义该算法的某些特定步骤。

考虑一个我们应聘时填写表格的步骤：我们需要填写个人信息、教育背景以及项目经验。每个应聘者都需要填写这些内容。所以我们可以从这些填写步骤中抽象出一些算法的**骨架**。虽然每个人具体要填写的内容不同，但填写的步骤一样。当从定义好骨架的基类派生出子类时，我们可以根据个人情况重定义填写内容，而与算法架构无关。<!--more-->看下面类图：

{% img http://asxalex.qiniudn.com/template_method.png %}

代码如下：

```c++ template_method.h
#include <iostream>

class resume{
    protected:
        virtual void setPersonalInfo(){}
        virtual void setEducation(){}
        virtual void setWorkExp(){}
    public:
        void fillForm(){
            std::cout << "use base class" << std::endl;
            setPersonalInfo();
            setEducation();
            setWorkExp();
        }
};

class resumeA : public resume{
    protected:
        virtual void setPersonalInfo(){
            std::cout << "Set A's Personal Infomation" << std::endl;
        }
        virtual void setEducation(){
            std::cout << "set A's Education infomation" << std::endl;
        }
        virtual void setWorkExp(){
            std::cout << "set A's Work experience infomation" << std::endl;
        }
    public:
        void fillForm(){
            std::cout << "use sub class" << std::endl;
            setPersonalInfo();
            setEducation();
            setWorkExp();
        }
};

class resumeB : public resume{
    protected:
        virtual void setPersonalInfo(){
            std::cout << "set B's Personal Infomation" << std::endl;
        }
        virtual void setEducation(){
            std::cout << "set B's Education Infomation" << std::endl;
        }
        virtual void setWorkExp(){
            std::cout << "set B's Work experience infomation" << std::endl;
        }
    public:
        void fillForm(){
            std::cout << "use sub class" << std::endl;
            setPersonalInfo();
            setEducation();
            setWorkExp();
        }
};
```

```c++ template_method.cpp
#include "template_method.h"

int main(){
    resume *res = new resumeA;
    res -> fillForm();
    resumeB res2;
    res2.fillForm();
    return 0;
}
```
（EOF）
