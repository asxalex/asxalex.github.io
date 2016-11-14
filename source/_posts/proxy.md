---
title: "设计模式（13）——代理模式"
date: 2013-08-19 20:51
tags: DesignPatterns
---
代理模式（proxy）为其它对象提供一种代理以控制这个对象的访问。在我们要访问一个对象的时候，可能暂且并不需要这个对象的某个功能，这时我们就可以为这个对象创建一个代理，在不需要的时候不去对这个对象做操作，而在需要时，利用这个代理来完成我们想要在原对象身上的操作。我们现在来看一个打开大图片的栗子。<!--more-->

我们有个Image类，BigImage派生自Image。有时候我们打开BigImage的时候打开时间比较长。为了提高加载速度，我们在BigImage类上建了个proxy类，通过proxy类来控制BigImage类的访问：我们打开时不需要显示这个图的内容，通过proxy来打开这个BigImage的“句柄”，当我们真正需要显示的时候再显示。下面为proxy模式栗子的类图：

{% img http://asxalex.qiniudn.com/proxy.png %}

实现代码：

```c++ proxy.h
#include <iostream>

//proxy can be used to postpone an operation, namely "lazy"

class Image{
    public:
        Image(std::string imgname): name(imgname){}
        virtual ~Image(){}
        virtual void show(){}
    protected:
        std::string name;
};

class BigImage : public Image{
    public:
        BigImage(std::string imgname):Image(imgname){}
        virtual void show(){
            std::cout << "showing Very BIG Image " << name << std::endl;
        }
        ~BigImage(){}
};

class proxy :public Image{
    public:
        proxy(std::string name):Image(name),big_img(0){};
        ~proxy(){delete big_img;}
        virtual void show(){
            if(big_img == 0)
                big_img = new BigImage(name);
            big_img -> show();
        }
    private:
        Image *big_img;
};
```

```c++ proxy.cpp
#include "proxy.h"

int main(){
    Image *a = new proxy("big.jpeg");
    a -> show();
    delete a;
    return 0;
}
```

在proxy的“代理”下，当我们调用proxy的show()的时候才真正“显示”这张BigImage。而在初始化时只是“记录”了那张“大图片”的名字，并未做实际的动作。
