---
title: "设计模式（12）——享元模式"
date: 2013-08-19 15:05
tags: DesignPatterns
---
享元模式（Flyweight）可以有效运用共享技术支持大量细粒度的对象。这里我们考察一个document。在一个document中可以有许多许多的字。在表示的时候，我们可以将每个字表示为一个对象——当一个文本中被插入一个字，我们就新建一个对象，将这个对象插入到文本中。<!--more-->这种实现方法如下：

{% img http://asxalex.qiniudn.com/flyweight1.png %}

代码如下：

```c++ flyweight1.h
#include <iostream>
#include <vector>

enum FONT{FontA, FontB, FontC};
enum COLOR{Green, Red, Blue};
enum CHARS{A1,A2};

class Characters{
    public:
        Characters(char a,FONT b,COLOR c):ch(a), font(b), color(c){}
        virtual void show(){}
    protected:
        char ch;
        FONT font;
        COLOR color;
};
 
class char_A1 : public Characters{
    public:
        char_A1():Characters('a',FontA,Red){}
        virtual void show(){
            std::cout << "Red char a with FontA" << std::endl;
        }
};

class char_A2 : public Characters{
    public:
        char_A2():Characters('a',FontA,Green){}
        virtual void show(){
            std::cout << "Green char a with FontA" << std::endl;
        }
};

class document{
    public:
        document(){}
        ~document(){clear();}
        void print(){
            std::vector<Characters*>::iterator chit = content.begin();
            while(chit != content.end()){
                (*chit) -> show();
                ++chit;
            }
        }
        void add(CHARS ch){
            Characters *temp;
            switch(ch){
                case A1:
                    temp = new char_A1;
                    break;
                case A2:
                    temp = new char_A2;
                    break;
                default:
                    std::cout << "error!!!" << std::endl;
                    break;
                    //error!!
            }
            content.push_back(temp);
        }
    private:
        void clear(){
            std::vector<Characters*>::iterator it = content.begin();
            while(it != content.end()){
                delete *it;
                it++;
            }
        }
        std::vector<Characters*> content;
};
```

```c++ flyweight1.cpp
#include "flyweight1.h"

int main(){
    document doc(new char_A1, new char_A2);
    doc.add(A1);
    doc.add(A2);
    doc.add(A1);
    doc.print();
    return 0;
}
```

这种方法实现的瓶颈在于：如果一个文本文件包含文字过多，这个应用就会创建过多的实例对象。空间消耗过大。如果我们注意到在一个文本对象中，每个字都有它内部属性，就可以在它的内部属性上作文章————我们可以让一个文本中的所有相同的文字共享一份内部属性。

比如说，有个字符A，它的颜色为蓝色，大小为5pt，我们就可以在所有用到这个特定字符（the very character）的时候共用它的颜色、字号等内部属性，他们的不同仅仅在于他们出现的位置这个外部属性上。看下面的类图与代码：

{% img http://asxalex.qiniudn.com/flyweight2.png %}

```c++ flyweight2.h
#include <iostream>
#include <vector>

enum FONT{FontA, FontB, FontC};
enum COLOR{Green, Red, Blue};
enum CHARS{A1,A2};

class Characters{
    public:
        Characters(char a,FONT b,COLOR c):ch(a), font(b), color(c){}
        virtual void show(){}
    protected:
        char ch;
        FONT font;
        COLOR color;
};
 
class char_A1 : public Characters{
    public:
        char_A1():Characters('a',FontA,Red){}
        virtual void show(){
            std::cout << "Red char a with FontA" << std::endl;
        }
};

class char_A2 : public Characters{
    public:
        char_A2():Characters('a',FontA,Green){}
        virtual void show(){
            std::cout << "Green char a with FontA" << std::endl;
        }
};

class document{
    public:
        document(Characters *ka1, Characters *ka2):a1(ka1),a2(ka2){}
        ~document(){}//clear();}
        void print(){
            std::vector<int>::iterator chit = content.begin();
            while(chit != content.end()){
                switch(*chit){
                    case 1:
                        a1 -> show();
                        break;
                    case 2:
                        a2 -> show();
                        break;
                    default:
                        std::cout << "error" << std::endl;
                        break;
                }
                ++chit;
            }
        }
        void add(CHARS ch){
            int i;
            switch(ch){
                case A1:
                    temp = 1;
                    break;
                case A2:
                    temp = 2;
                    break;
                default:
                    std::cout << "error!!!" << std::endl;
                    break;
                    //error!!
            }
            content.push_back(temp);
        }
    private:
        void clear(){
            std::vector<Characters*>::iterator it = content.begin();
            while(it != content.end()){
                delete *it;
                it++;
            }
        }
        std::vector<int> content;
        Characters *a1;
        Characters *a2;
};
```

```c++ flyweight2.cpp
#include "flyweight1.h"

int main(){
    document doc;
    doc.add(A1);
    doc.add(A2);
    doc.add(A1);
    doc.print();
    return 0;
}
```

在这里，我们示意性地只用了两种不同的字符，所有同样的字符均共用内部属性，而外部属性就在vector中的插入位置来确定，在插入时，我们将不同字符排在不同的位置上，在插入到document中时，我们只要插入一个整数值————指定那个字符————就可以了。这样在有成千上万字符而字体种类不多的情况下可以节省可观的资源。
