---
title: "设计模式（10）——装饰模式"
date: 2013-08-18 23:51
tags: DesignPatterns
---
装饰模式（Decorator）意在动态地给一个对象添加一些额外的职责。就增加功能来说，Decorator模式比生成子类更加灵活。

这里的栗子是一个窗口。在实际中，窗口种类丰富繁多。我们的栗子中作为示意，定义了从Window基类派生的两个类————分别为NormalWindow与SpecialWindow。而一个窗口要添加的组件也很多，在代码实例中有两种组件————ToolBar与Menu。<!--more-->先看类图：

{% img http://asxalex.qiniudn.com/decorator.png %}

上面提到的四个类均继承自Window类，类定义如下：

```c++ decorator.h
#include <iostream>

class Window{
    public:
        Window(){}
        virtual ~Window(){}
        virtual void showDecorator(){}
};

class NormalWindow : public Window{
    public:
        NormalWindow(std::string name):winname(name){}
        virtual void showDecorator(){
            std::cout << "Normal Window " << winname << "'s decorator" << std::endl;
        }
    private:
        std::string winname;
};

class SpecialWindow : public Window{
    public:
        SpecialWindow(std::string name):winname(name){}
        virtual void showDecorator(){
            std::cout << "Special Window " << winname << "'s decorator" << std::endl;
        }
    private:
        std::string winname;
};

class MenuDecorator : public Window{
    public:
        MenuDecorator(Window *a):win(a){}
        void apply(){
            win -> showDecorator();
            addDecorator();
        }
    private:
        void addDecorator(){
            std::cout << "menu decorated" << std::endl;
        }
        Window *win;
};

class ToolBarDecorator : public Window{
    public:
        ToolBarDecorator(Window *a):win(a){}
        void apply(){
            win -> showDecorator();
            addDecorator();
        }
    private:
        void addDecorator(){
            std::cout << "ToolBar decoratored" << std::endl;
        }
        Window *win;
};
```

而像下面那样使用以上的类定义：

```c++ decorator.cpp
#include "decorator.h"

int main(){
    Window *wina = new NormalWindow("alex");
    MenuDecorator deco1(wina);
    deco1.apply();
    delete wina;
    return 0;
}
```

在代码中，各种Decorator将具体的Window“装饰”起来了，在需要用到**装饰品**的地方，可以调用它的apply方法。apply方法中实现具体的装饰过程————可以像这里一样是个简单的打印，也可以是真正的复杂的**装饰**操作。
