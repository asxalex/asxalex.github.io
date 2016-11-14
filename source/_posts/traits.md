---
title: "traits"
date: 2013-08-29 22:50
tags: cpp
---
traits是特点的意思。在c++中，traits class用于表现**类型**信息。容器类型利用模板可以包容不同类型的数据，如 std::vector\<int\> 就包含了int类型的数据，而 std::deque\<string\> 则包含了string类型的数据。c++利用traits技术来获得对象的类型信息。在我们获取不同对象的类型信息之后，就可以根据对象类型的不同而采取不同的操作。<!--more-->下面是我们自己模拟的实例（无甚意义）。我们定义了两个类模板：MyType 和 YourType（我承认名字起得太。。了 -_-!）先看如下代码：

```c++ traits.h
#include <iostream>
#include <typeinfo>

struct my_type{};
struct your_type{};

template <typename T>
class MyType{
    public:
        typedef my_type value_type;
        MyType(const T& a):content(a){}
        MyType& operator++(){this -> content ++;return (*this);}
        const T get_content() const {return content;}
    private:
        T content;
};
        
template <typename T>
class YourType {
    public:
        typedef your_type value_type;
        YourType(const T& a): content(a){}
        YourType& operator+=(int a){this -> content+=a; return (*this);}
        const T get_content() const {return content;}
    private:
        T content;
};


template <typename T>
struct traits{
    public:
        typedef typename T::value_type value_type;
};

template <typename T>
void Increase(T& a,int steps){

    std::cout << "derived : " << (typeid(your_type)== typeid(my_type)) << std::endl;

    if(typeid(typename traits<T>::value_type) == typeid(my_type)){
        for(int i = 0; i < steps; ++i){
            ++a;
            std::cout << "added once and now is " << a.get_content() << std::endl;
        }
    }
    else if(typeid(typename traits<T>::value_type) == typeid(your_type)){
        a += steps;
        std::cout << "now is " << a.get_content() << std::endl;
    }
    else{
        std::cout << "error occured!" << std::endl;
    }
}

```

```c++ traits.cpp
#include "trait.h"

int main(){
    YourType<int> you(123);
    Increase(t,12);
    std::cout << you.get_content() << std::endl;
    MyType<int> me(21);
    Increase(me,5);
    std::cout << me.get_content() << std::endl;
    return 0;
}
```

通过traits技术，我们在可以在编译时期得到对象的类型,并在Increase函数中根据类型采取不同的增加content成员的方法：若类型为MyType，我的类型**只**支持前缀++，所以我们用循环来递增；而若类型为YourType时，你的类型**只**支持+=操作符，可以一步到位。一切看上去如此美好！但很遗憾，上面的代码通不过编译：

```c++ error message
In file included from trait.cpp:1:0:
trait.h: In function ‘void Increase(T&, int) [with T = YourType<int>]’:
trait.cpp:5:18:   instantiated from here
trait.h:63:13: error: no match for ‘operator++’ in ‘++a’
trait.h: In function ‘void Increase(T&, int) [with T = MyType<int>]’:
trait.cpp:7:20:   instantiated from here
trait.h:68:9: error: no match for ‘operator+=’ in ‘a += steps’
```

出错的原因就是因为上面的**只**字，这在编译错误信息里写得很明确了：MyType没定义+=操作符，而YourType没定义++操作符。为解决这个问题，我们可以在traits中增加一个隔离层，并在其中定义++与+=两种操作符，利用traits的++或+=调用实际的操作符，或者提示没这个方法的信息。除了这个方法，我们也可以利用模板函数的重载来消除这个操作符未定义的问题：

```c++ traits.h
#include <iostream>
#include <typeinfo>

struct my_type{};
struct your_type{};

template <typename T>
class MyType{
    public:
        typedef my_type value_type;
        MyType(const T& a):content(a){}
        MyType& operator++(){this -> content ++;return (*this);}
        const T get_content() const {return content;}
    private:
        T content;
};
        
template <typename T>
class YourType {
    public:
        typedef your_type value_type;
        YourType(const T& a): content(a){}
        YourType& operator+=(int a){this -> content+=a; return (*this);}
        const T get_content() const {return content;}
    private:
        T content;
};


template <typename T>
struct traits{
    public:
        typedef typename T::value_type value_type;
};

template <typename T>
void doIncrease(T& a,int steps,my_type){
    for(int i = 0; i < steps; ++i){
        ++a;
        std::cout << "added once and now is " << a.get_content() << std::endl;
    }
}

template <typename T>
void doIncrease(T& a, int steps,your_type){
    a += steps;
}

template <typename T>
void Increase(T& a, int steps){
    doIncrease(a, steps, typename traits<T>::value_type());
}

```

在真正调用Increase函数时，Increase函数首先获取对象的类型信息，并通过具体的类型来调用不同版本的doIncrease函数，实际的递增操作是在doIncrease里面完成的。这样就不会存在以上的警告信息了。

```c++ result
135
dded once and now is 22
added once and now is 23
added once and now is 24
added once and now is 25
added once and now is 26
26
```

以上结果说明了该程序根据类型的不同，“选择”了不同的递增路线，达到了我们使用traits的目的。

另外，traits的技术要求之一是，它对内置（built-in）类型和用户自定义类型的表现必须一样好。在实际使用中，我们可以利用traits模板的偏特化来达到这个目的。在此不详细展开了。
