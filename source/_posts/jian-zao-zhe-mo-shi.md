---
title: "设计模式（4）——建造者模式"
date: 2013-08-16 19:39
tags: DesignPatterns
---
建造者模式（builder）用于将复杂对象的构建与它的表示分离，使得同样的构造过程可以创建不同的表示（《Design Patterns》）。我们可以设想这样一个情况：我们还是要造那个小熊。风水轮流转，这次我们成了这个制造工厂中的“工人”，而不再是那个客户了。

在造小熊的时候，我们遵从“工序”————首先造头，之后造手和脚，如果这个小熊可以说个“世界，你好”或者“Hello world”的话，我们还有“教它”语言的工序。<!--more-->

在这个工厂里，又有一道道流水线。而每一条流水线都有自己“个性”的工序，有的造的脚是broken-leg（只是举个栗子，不会有哪个工厂特地制造次品吧:-) ），有的“教的”是英语……

所以，我们在生产过程中，只要到每条流水线的末端去等就行了。我们先看看这个模式的类图：

{% img http://asxalex.qiniudn.com/builder.png %}

这里，在画类图和编码时用的是man，而不是bear，但不影响理解。

首先，HumanBuilder类给我们的制造工序提供了接口，其中有采取的默认动作（默认都是制造normal的部件）。而它的派生类则特化实际生产的部件，图中特化了两条流水线————一条生产普通的但是讲英语的人，另一条生产有个broken-leg的人。当我们需要得到（生产出）一件成品时。我们从GetMan中调用get_a_man()方法。该方法类似于**命令一条流水线开工**。详细看下面的代码：

```c++ human_builder.h
#include <iostream>

class Human{
    public:
        void claim(){
            std::cout << "I have a " << head << ", and " << arms << " and " << legs << std::endl;
            std::cout << "I speak " << language << std::endl;
        }
        void teach_lang(std::string lang){language = lang;}
        void get_legs(std::string leg){legs = leg;}
        void get_arms(std::string arm){arms = arm;}
        void get_head(std::string heade){head = heade;}
    private:
        std::string language;
        std::string head;
        std::string arms;
        std::string legs;
};

//=======================================================================

class HumanBuilder{
    public:
        virtual void build_man(){_human = new Human;}
        virtual void build_head(){ _human -> get_head("normal head");}
        virtual void build_arms(){ _human -> get_arms("normal arms");}
        virtual void build_legs(){ _human -> get_legs("normal legs");}
        virtual void teach_language(){ _human -> teach_lang("international language");}
        virtual Human *get_human(){return _human;}
        virtual ~HumanBuilder(){delete _human;}
    protected:
        HumanBuilder(){}
        Human *_human;
};

class normal_man_speaks_Chinese :public HumanBuilder{
    public:
        virtual void teach_language(){ _human -> teach_lang("Chinese");}
};

class man_with_broken_legs : public HumanBuilder{
    public:
        virtual void build_legs(){ _human -> get_legs("broken legs");}
};
//=========================================================================
//
class GetMan{
    public:
        Human * get_a_man(HumanBuilder &builder);
        void claim_it(Human *man){man -> claim();}
};

Human * GetMan::get_a_man(HumanBuilder &builder){
    builder.build_man();
    builder.build_head();
    builder.build_legs();
    builder.build_arms();
    builder.teach_language();
    return builder.get_human();
}
```

调用方法：

```c++ human_builder.cpp
#include "human_builder.h"

int main(){
    GetMan man;
    normal_man_speaks_Chinese Chinese;
    man_with_broken_legs broken_legs;
    man.claim_it(man.get_a_man(Chinese));
    man.claim_it(man.get_a_man(broken_legs));
    return 0;
}
```

从中我们可以看到，当我们需要一个不同的产品时，我们只需**构造一条不同的流水线**（特化某个构造过程），之后就可以通过GetMan类得到那个刚刚构造好的Human对象。

相较于之前的“电话订购方式”，我们通过建造者模式（builder pattern）可以对产品构造过程有更精细的控制。
