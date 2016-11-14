---
title: "设计模式（11）——外观模式"
date: 2013-08-19 14:47
tags: DesignPatterns
---
外观模式（facade）为子系统的一组接口提供一个一致的界面，它定义了一个高层接口，这个接口使得这个系统更加容易使用。

就拿一个编译器系统来说吧，它可以分成许多步骤————词法分析，语法分析，语义分析，代码生成等。而我们在使用一个编译器的时候并不需要知道这些（比如在用gcc的时候，在最简单的情况下我们甚至只需要gcc filename 就行了，我们只要在这个编译器整体作用下生成我们所需要的目标代码即可）。否则，我们还得自己用gas、ld等工具，一步步生成中间代码。<!--more-->外观模式就是在这些接口的基础上，向我们提供一个统一的界面（即不加参数，直接生成目标代码的gcc命令）。

为了示意，我们先画出类图：

{% img http://asxalex.qiniudn.com/facade.png %}

这里要说明的是：我们并没有真正实现了一个编译器，这里的scanner、parser等类只是用于说明模式的栗子，里面就只有用于验证代码正确性的输出函数。实现代码如下：

```c++ facade.h
#include <iostream>

class scanner{
    public:
        //scanner can do the scan, it can accept istream as arguments, and return results;
        void scan(){
            std::cout << "scan" << std::endl;
        }
};

class parser{
    public:
        //can accept arguments from the scanner;
        void parse(){
            std::cout << "parse" << std::endl;
        }
};

class generate_code{
    public:
        //can use the result from parser;
        void gen_code(){
            std::cout << "generate code" << std::endl;
        }
};


class compiler{
    public:
        void run(){
            scanner scan;
            parser parse;
            generate_code gen;
            scan.scan();
            parse.parse();
            gen.gen_code();
        }
};
```

```c++ facade.cpp
#include "facade.h"

int main(){
    compiler comp;
    comp.run();
    return 0;
}

```

这样，一个编译器就被包装成一个整体，在使用时我们就不必知道里面的细节，这给我们提供了一个好用的界面。
