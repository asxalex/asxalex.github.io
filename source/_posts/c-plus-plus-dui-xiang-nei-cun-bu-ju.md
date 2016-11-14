---
title: "C++对象在内存中的布局"
date: 2013-09-19 12:44
tags: cpp
---
最近在看c++对象模型，要理解c++对象模型，必须得了解c++对象在计算机内存中的布局情况。虚函数是c++中多态的基础，而多态是通过虚函数表来实现的。在每个拥有虚函数的对象中，都有一个vptr指向这个对象的虚函数表vtable。下面，我们就单继承与多继承两种情况来对c++对象在内存中的布局进行实验，用直观的方式来“打印”类对象在内存中的位置。需要说明的是：类对象在内存中的布局与操作系统以及编译器都有关系，所以在不同编译环境下打印结果可能不同。这个实验旨在让我更清晰地了解类对象在内存中的布局。

<!--more-->
## 单继承
为了分析出单继承下类的布局，我们涉及了三个类：Father、Child以及GrandChild。正如名字一样，他们一代代继承下来。类图如下：

{% img http://asxalex.qiniudn.com/class1.png %}

在Father类中，我们定义了三个虚函数f()、g()和h()。在Child类中，我们覆写了Father类的f(),并添加了Child类自己的虚函数g_child()以及h_child()。在孙子类GrandChild中，父类Child的f()以及g_child()被覆写，另外又添加了自己的虚函数h_grandchild()以及非虚函数x()。

```c++ vtable.h
#include <iostream>

class Father{
    public:
        int ifather;
        Father():ifather(10){}
        virtual void f(){std::cout << "Father::f" << std::endl;}
        virtual void g(){std::cout << "Father::g" << std::endl;}
        virtual void h(){std::cout << "Father::h" << std::endl;}
};

class Child : public Father{
        int iChild;
    public:
        Child():iChild(100){}
        virtual void f(){std::cout << "Child::f" << std::endl;}
        virtual void g_child(){std::cout << "Child::g_child" << std::endl;}
        virtual void h_child(){std::cout << "Child::h_child" << std::endl;}
};

class GrandChild : public Child{
        double iGrandChild;
        static int a;
    public:
        GrandChild():iGrandChild(1000.1){}
        virtual void f(){std::cout << "GrandChild::f" << std::endl;}
        virtual void g_child(){std::cout << "GrandChild::g_child" << std::endl;}
        virtual void h_grandchild(){std::cout << "GrandChild::h_grandchild" << std::endl;}
        void x(){std::cout << "GrandChild::x" << std::endl;}
};

```

以下为打印虚函数表的代码：

```c++ vtable.cpp
#include "vtable.h"

int GrandChild::a = 0;

int main(){
    typedef void (*pFunc)(void);
    GrandChild gc;
    Child child;
    Father father;
    int **pgc = (int **)&gc;
    int **pc = (int **)&child;
    int **pf = (int **)&father;
    pFunc pfunc;

    std::cout << "vtable of Grangchild is: " << std::endl;
    for(int i = 0; (pFunc)pgc[0][i] != NULL; ++i){
        pfunc = (pFunc)pgc[0][i];
        std::cout << " [" << i << "] ";
        pfunc();
    }

    std::cout << std::endl;

    std::cout << "vtable of Child is: " << std::endl;
    for(int i = 0; (pFunc)pc[0][i] != NULL; ++i){
        pfunc = (pFunc)pc[0][i];
        std::cout << " [" << i << "] ";
        pfunc();
    }

    std::cout << std::endl;
    std::cout << "vtable of Father is: "<< std::endl;
    for(int i = 0; i < 3; ++i){
        pfunc = (pFunc)pf[0][i];
        std::cout << " [" << i << "] ";
        pfunc();
    }

    std::cout << "size of GrandChild is " << sizeof(gc) << std::endl;
    std::cout << "iFather:" << (int)pgc[1] << std::endl;
    std::cout << "iChild:" << (int)pgc[2] << std::endl;
    std::cout << "iGrandChild:" << *(double*)(void*)&pgc[3] << std::endl;

    return 0;
}
```

我们知道大概的类布局。Vptr在对象开头，它指向一个Vtable，Vtable里面存着这个类通过继承、覆写、定义而得到的虚函数指针。紧接着Vptr便是我们在该类中定义的数据成员。类中的一般函数、static函数被转化为全局空间中的函数，并不存储在对象中。另外，类中的static数据成员也不存储在对象中。这个结论我们可以在以下的结果中看出来：

```c++
vtable of Grangchild is: 
[0] GrandChild::f
[1] Father::g
[2] Father::h
[3] GrandChild::g_child
[4] Child::h_child
[5] GrandChild::h_grandchild

vtable of Child is: 
[0] Child::f
[1] Father::g
[2] Father::h
[3] Child::g_child
[4] Child::h_child

vtable of Father is: 
[0] Father::f
[1] Father::g
[2] Father::h
father's fourth element is 1917268017
size of GrandChild is 20
iFather:10
iChild:100
iGrandChild:1000.1
```

通过以上结果，我们可以大致得到下面的内存布局图：

{% img http://asxalex.qiniudn.com/class2.png %}

由于GrandChild的大小为20（4（Vptr）+ 4（int）+ 4（int）+ 8（double））。所以静态数据成员以及一般成员函数均没有存储在对象的内存空间中。再次对GrandChild的布局进行探究，可以发现是以下的投影叠加版本：

{% img http://asxalex.qiniudn.com/class3.png %}

另外需要说明的是：Father的虚函数表里面最后一个似乎并不是NULL。打印出来是一个非常大的数（1917268017）。所以，在打印Father的虚函数表的时候用的条件不是判断NULL，而是通过i的计数来实现的。

## 多继承
同样，利用上面的方法，我们来看一下多继承下的内存布局，先看类图：

{% img http://asxalex.qiniudn.com/class4.png %}

代码如下：

```c++ vtable2.cpp
#include <iostream>

#define ONE 0
#define TWO 3
#define THREE 5
#define FOUR 7

class Base1{
    public:
        int base1;
        int base11;
        Base1():base1(10),base11(9){}
        virtual void f(){std::cout << "Base1::f" << std::endl;}
        virtual void g(){std::cout << "Base1::g" << std::endl;}
        virtual void h(){std::cout << "Base1::h" << std::endl;}
};

class Base2{
    public:
        int base2;
        Base2():base2(11){}
        virtual void f(){std::cout << "Base2::f" << std::endl;}
        virtual void g(){std::cout << "Base2::g" << std::endl;}
        virtual void h(){std::cout << "Base2::h" << std::endl;}
};

class Base3{
    public:
        int base3;
        Base3():base3(12){}
        virtual void f(){std::cout << "Base3::f" << std::endl;}
        virtual void g(){std::cout << "Base3::g" << std::endl;}
        virtual void h(){std::cout << "Base3::h" << std::endl;}
};

class Derived : public Base1, public Base2, public Base3{
    public:
        double derived;
        Derived():derived(12.34){};
        virtual void f(){std::cout << "Derived::f" << std::endl;}
        virtual void g1(){std::cout << "Derived::g1" << std::endl;}
};


int main(){
    typedef void (*pFunc)(void);
    pFunc pfunc = NULL;
    Derived derived;
    int **pd = (int **)&derived;

    std::cout << "vtable of derived is :" << std::endl;
    for(int i = 0; i <= 3; ++i){
        std::cout << '\t' << "[" << i << "]";
        pfunc = (pFunc)pd[ONE][i];
        pfunc();
    }

    std::cout << "attention! "<< pd[ONE][4] << std::endl;

    std::cout << "base1: " << (int)pd[ONE + 1] << std::endl;
    std::cout << "base11: " << (int)pd[ONE + 2] <<std::endl;

    
    for(int i = 0; i < 3; ++i){
        std::cout << '\t' << "[" << i << "]";
        pfunc = (pFunc)pd[TWO][i];
        pfunc();
    }
    std::cout << "attention! "<< pd[TWO][3] << std::endl;
    std::cout << "base2: " << (int)pd[TWO + 1] << std::endl;
    
    for(int i = 0; i < 3; ++i){
        std::cout << '\t' << "[" << i << "]";
        pfunc = (pFunc)pd[THREE][i];
        pfunc();
    }
    std::cout << "attention! "<< pd[THREE][3] << std::endl;
    std::cout << "base3: " << (int)pd[THREE + 1] << std::endl;
    
    std::cout << "derived: " << *(double*)(void*)&pd[FOUR] << std::endl;
    
    return 0;
}

```

编译运行后的结果为：

```c++
vtable of derived is :
    [0]Derived::f
    [1]Base1::g
    [2]Base1::h
    [3]Derived::g1
attention! -12
base1: 10
base11: 9
    [0]Derived::f
    [1]Base2::g
    [2]Base2::h
attention! -20
base2: 11
    [0]Derived::f
    [1]Base3::g
    [2]Base3::h
attention! 0
base3: 12
derived: 12.34
```

看一下下面的图就明白整个布局啦:)

{% img http://asxalex.qiniudn.com/class5.png %}

值得先说明的是：我们的代码首先是检查Vtable项是否为NULL来判断是否到Vtable末尾项了，但这样运行后直接core dump了。所以，我们首先分析了某个Vtable有几项，然后通过计数来调用相应方法。在Vtable的最后，我们利用上面打印结果的attention！来打印相应的最后一项的内容。经观察这个数值可能是下一个Vtable距离对象开头的字节数。本来还想通过修改这个数值来验证这个想法，但好像那个空间没有写权限，又直接core dump了-_-!

从图上可以看出：  
> 派生类的所有没有覆写父类的虚函数都“存放”在第一个父类的Vtable中；    
> 派生类覆写的父类的虚函数会被“更新”到每个父类的Vtable中；  
> 派生类中有多个Vtable及数据成员，他们的次序按照继承顺序排列。 

注：以上程序运行环境为ubuntu12.04 3.2.0-53-generic-pae内核 + gcc 4.6.3
