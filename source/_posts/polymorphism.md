---
title: "继承与多态浅析"
date: 2013-08-27 19:27
tags: cpp
---
面向对象程序设计中两个重要的概念是继承性与多态性。通俗地讲，继承性是指派生类从基类中获得基类的成员变量及成员函数；而多态性是指在运行时根据对象实际类型确定实际调用的操作，实现“一个接口，多种实现”。在c++中，多态性是通过virtual函数实现的。在子类中通过重写父类中的virtual函数完成，而c++亦允许在子类中对父类的非virtual函数进行重写，一下就来剖析一下这两者的不同。<!--more-->

我们首先看一个例子，该例子的类图如下：

{% img http://asxalex.qiniudn.com/compare.png %}

代码如下：

```c++ compare.h
#include <iostream>

class Base{
    public:
        virtual void func1(){
            std::cout << "func1 in Base, virtual." << std::endl;
        }
        void func2(){
            std::cout << "func2 in Base, non-virtual." << std::endl;
        }
        void func2(int a){
            std::cout << "func2 in Base with arg " << a << std::endl;
        }
};

class Derived : public Base{
    public:
        virtual void func1(){
            std::cout << "func1 in Derived, virtual." << std::endl;
        }
        void func2(){
            std::cout << "func2 in Derived, non-virtual." << std::endl;
        }
};
```

```c++ compare.cpp
#include "compare.h"

int main(){
    Base *base1 = new Derived();
    base1 -> func1();
    base1 -> func2();
    base1 -> func2(12);
    Derived *derived1 = new Derived();
    derived1 -> func1();
    derived1 -> func2();
    
    //derived1 -> func2(12);
    Derived derived2;
    Base base2 = derived2;
    base2.func1();
    base2.func2();
    base2.func2(123);
}
```

运行结果为：

```c++ 
func1 in Derived, virtual
func2 in Base, non-virtual
func2 in Base with arg 12
func1 in Derived, virtual
func2 in Derived, non-virtual
func1 in Base, virtual
func2 in Base, non-virtual
func2 in Base with arg 123
```

从结果可以看出：对基类中的virtual函数进行重写之后，可以用基类的指针（或引用）在运行时动态绑定其子类中的相应实现（多态性）；对基类中的非virtual函数进行重写之后，用基类的指针（或引用）只能访问基类中的函数实现；当用派生类的指针来调用函数时，访问方法遵循作用域规则，作用域如下：

{% img http://asxalex.qiniudn.com/field.png %}

以上通过derived1调用func2()时，在derived作用域中找到了func2()的定义，而当调用derived1 -> func2(12)时，在Derived类的作用域中找到了func2函数，但调用方式不对，于是编译出错；当用一个Derived对象初始化一个Base对象时，Derived对象中的Base部分被复制给Base对象，以后，通过Base对象访问的函数均在Base中，而不管是否是virtual。
