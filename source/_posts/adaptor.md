---
title: "设计模式（7）——适配器模式"
date: 2013-08-18 14:33
tags: DesignPatterns
---
适配器模式（adaptor）用于将一个类的接口转换成客户所希望的另外一个接口。Adaptor模式使得原本由于接口不兼容而不能一起工作的类可以一起工作（《Design Patterns》）

其实，C++标准已经提供了三种容器适配器，分别是stack、queue和priority_queue。在这里我们实现两个适配器————MyQueue和MyStack。Queue是FIFO的数据结构，而stack是FILO类型数据结构。在这两个适配器中，我们利用标准容器中的deque（双端队列）来保存适配器的元素。<!--more-->利用适配器类（adaptor）实现了两种适配器的最基本接口————push和pop。其类图如下：

{% img http://asxalex.qiniudn.com/adaptor.png %}

根据类图，利用C++提供的模板，写出如下代码：

```c++ adaptor.h
#include <iostream>
#include <deque>

template <typename T>
class adaptor{
    public:
        virtual void push(T value) = 0;
        virtual T pop() = 0;
};

template <typename T1>
class MyStack : public adaptor<T1>{
    public:
        virtual void push(T1 value){
            seq.push_front(value);
        }
        virtual T1 pop(){
            T1 val = seq.front();
            seq.pop_front();
            return val;
        }
    protected:
        std::deque<T1> seq;
};

template <typename T2>
class MyQueue : public adaptor<T2>{
    public:
        virtual void push(T2 value){
            seq.push_back(value);
        }
        virtual T2 pop(){
            T2 val = seq.front();
            seq.pop_front();
            return val;
        }
    protected:
        std::deque<T2> seq;
};

```

使用方法为：

```c++ adaptor.cpp
#include "adaptor.h"

int main(){
    MyStack<int> mystack;
    mystack.push(12);
    mystack.push(13);
    mystack.push(14);
    mystack.push(15);
    std::cout << mystack.pop() << std::endl;
    std::cout << mystack.pop() << std::endl;
    std::cout << mystack.pop() << std::endl;
    std::cout << mystack.pop() << std::endl;
    return 0;
}
```

adaptor类还应该再加个empty()函数来判断空，这样就能用循环结构来对我们的适配器进行遍历操作了。
