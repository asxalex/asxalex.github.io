---
title: "RAII与资源管理"
date: 2013-09-11 20:50
tags: cpp
---
RAII（Resource Acquirsition Is Initialization），资源获得即初始化，是一种管理资源的极好的方法。这个术语的意思：在对象的初始化中包含它所要管理的资源的获取操作，而在该对象被析构时，被管理资源的释放动作会被执行（RRID，Resource Release Is Destruction）。

这里的资源是一个广义的概念：它可以是动态分配的堆空间，或是一个文件的句柄，抑或是一个经过抽象的打印机……这些资源的一个共同点是：当我们不再需要这个资源时，得对它进行释放操作。一旦客户忘记释放操作（我们可能会在不知不觉中忘记这个操作，比如说，在if语句中，我们调用了delete将动态分配的空间进行了释放，但在else中忘了释放……）将会导致资源泄漏，这对于一个运行几百毫秒的程序可能没什么大的影响，但对于一个要常年运行的服务器来说却是不可忍受的，一个小小的有资源泄漏的代码块执行成千上万次，所泄漏的资源就不能忽略不计了。<!--more-->

RAII这个术语不管是概念还是实现都是比较简单的，先看一个简单的栗子：

```c++ raii.h
#include <iostream>

template <typename T>
class RAII{
    public:
        RAII(T* a):pointee(a){}
        ~RAII(){
            delete pointee;
            std::cout << "deleted!" << std::endl; 
        }
        T* operator->(){
            return pointee;
        }
        T& operator*(){
            return *pointee;
        }
    private:
        T* pointee;
};

class mytype{
    public:
        void show(){
            std::cout << "in mytype" << std::endl;
        }
};
```

```c++ raii.cpp
#include "raii.h"

int main(){
    {
    RAII<mytype> a(new mytype()); 
    a->show();
    }
    std::cout << "end" << std::endl;
    return 0;
}
```

当我们需要一个mytype资源时，我们初始化了一个对象a，在a的成员初值列中获取资源，由于a是一个栈变量，一旦超出作用域它就会被析构。于是我们在它的析构函数中进行资源的释放操作，这样，我们就不用再手动去释放资源了。

再看看下面的更实际一点的栗子（这个栗子是根据《Imperfect C++》中的栗子而”捏造“的）：

```c++ check.h
#include <iostream>

template <typename T>
class Check{
    public:
        static void In(T& t){
            Checkin(t);
        }
        static void Out(T& t){
            Checkout(t);
        }
};

template <typename T, typename C = Check<T> >
class RAII{
    public:
        RAII(T* pass):ref(pass){
            C::In(*ref);
        }
        ~RAII(){
            C::Out(*ref);
            delete ref;
        }
    private:
        T* ref;
};

class Person{
    public:
        Person(const std::string& str):name(str){}
        std::string getName(){return name;}
    private:
        std::string name;
};

void Checkin(Person&);
void Checkout(Person&);
```

```c++ check.cpp
#include "check.h"

void Checkin(Person& per){
    std::cout << per.getName() << " just checked in." << std::endl;
}

void Checkout(Person& per){
    std::cout << per.getName() << " just checked out." << std::endl;
}

int main(){
    {
        RAII<Person> a(new std::string("asxalex"));
        /*
            do the things
        */

    }
    std::cout << "end." << std::endl;
}

```

我的栗子模拟一个同学们到机房的上机时的刷卡过程：当同学们进去时要In，出去时要Out（我恨透了这个系统，想起以前大一到大三上机时一旦忘了带卡，那个看门的大爷就会叫我回去拿，唉……）。这里，我们定义了一个外覆类Check，它调用被管理的资源类的相关函数，这样可以降低资源管理类与资源类之间的耦合，为了如此，我们为Person资源类定义了Checkin()和Checkout()两个函数，当管理不同资源时可以堆这两个函数进行重载。外覆类被当作资源管理模板类的第二个默认模板参数传入，在资源管理类中调用它里面的静态方法。当RAII对象的生存期结束时，它会调用外覆类中用于清理资源的另一个静态方法。

当我们在机房里开心地上机时，可能接到一个电话，我们就要出去接电话。这时候，我们就得先Checkout，之后，再Checkin。当然，代码可以像下面那样写：

```c++ check.cpp
...
int main(){
    {
        RAII<Person> a(new std::string("asxalex"));
    }//这里，我出去接个电话
    
    //开心地打电话中。。。
    //。。。
    //打完了电话

    {//我又回来啦
        RAII<Person> a(new std::string("asxalex"));
    }

    std::cout << "end." << std::endl;
}
```

这里，当我们进出一次，我们就得构造一个Person（资源），析构这个资源。这样显然比较浪费。为此，我们写了以下代码：

```c++ check.h
#include <iostream>

template <typename T>
class Check{
    public:
        static void In(T& t){
            Checkin(t);
        }
        static void Out(T& t){
            Checkout(t);
        }
};

template <typename T>
class Uncheck{
    public:
        static void In(T& t){
            Checkout(t);
        }
        static void Out(T& t){
            Checkin(t);
        }
};

template <typename T, typename C = Check<T> >
class RAII{
    public:
        RAII(T* pass):ref(pass){
            C::In(*ref);
        }
        ~RAII(){
            C::Out(*ref);
            delete ref;
        }
    private:
        T* ref;
};

template <typename T>
class RAII<T,Uncheck<T> >{
    public:
        RAII(T* pass):ref(pass){
            std::cout << "again :";
            Uncheck<T>::In(*ref);
        }
        ~RAII(){
            std::cout << "again :";
            Uncheck<T>::Out(*ref);
        }
    private:
        T* ref;
};

class Person{
    public:
        Person(const std::string& str):name(str){}
        std::string getName(){return name;}
    private:
        std::string name;
};

void Checkin(Person&);
void Checkout(Person&);
```

```c++ check.cpp
#include "check.h"

void Checkin(Person& per){
    std::cout << per.getName() << " just checked in." << std::endl;
}

void Checkout(Person& per){
    std::cout << per.getName() << " just checked out." << std::endl;
}

int main(){
    {
        Person* alex = new Person("asxalex"); 
        RAII<Person> a(alex);
        
        {//同样，出去接电话
            RAII<Person,Uncheck<Person> > b(alex);
         //。。。
        }//电话打完，继续进来上机

    }//几天上机结束，同学们各回各家~
    std::cout << "end." << std::endl;
}

```

这段代码相较于第一版的模型来说更加”环保“：当我们需要出去接电话的时候，不需要销毁以前构造的Person资源，无论你出去多少次，都只需要一个构造/析构开销。为了达到这个目标，我们又写了一个Uncheck类，这个类只是Check的”取反“：当我们出去时作为In，进来时作为Out！同时，为了可以”共享“那个Person资源，我们对RAII模板类进行了特化:当用Uncheck作为第二个模板参数时无需delete掉那个Person资源。

顺便说一句，严格来说，上面的check.cpp并不算是RAII，而是RRID，在alex这个对象被构造出来时并没有Is Initialization ~

（EOF）
