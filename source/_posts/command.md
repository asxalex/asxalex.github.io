---
title: "设计模式（15）——命令模式"
date: 2013-08-20 13:41
tags: DesignPatterns
---
命令模式（Command）将一个请求封装为一个对象，从而使你可以用不同的请求对客户进行参数化。当我们有个命令要发给一个Receiver时，我们首先可以将具体从command类派生出一个具体命令，并用Invoker类封装，执行时我们只需要执行exec()方法,命令模式就会自动调用被封装的请求对象，并在这个对象中调用具体的execute()方法来“通知”Receiver采取相应的动作。<!--more-->其类图如下：

{% img http://asxalex.qiniudn.com/command.png %}

其实现代码如下：

```c++ command.h
#include <iostream>

class Receiver{
    public:
        void action(std::string command){
            std::cout << command << " Received!" << std::endl;
            std::cout << "take action!" << std::endl;
        }
};

class Command{
    public:
        Command(Receiver * recv):_recv(recv){}
        virtual ~Command(){delete _recv;}
        virtual void execute() = 0;
    protected:
        Receiver *_recv;
};

class ConcreteCommand : public Command{
    public:
        ConcreteCommand(Receiver *rece):Command(rece){}
        virtual void execute(){
            std::cout << "concrete command 1" <<std::endl;
            _recv -> action("command from ConcreteCommand");
        }
};

class Invoker{
    public:
        Invoker(Command *comm):_comm(comm){}
        void exec(){_comm -> execute();}
        ~Invoker(){delete _comm;}
    private:
        Command* _comm;
};
```

```c++ command.cpp
#include "command.h"

int main(){
    Receiver *recv = new Receiver;
    Command *command = new ConcreteCommand(recv);
    Invoker *invoker = new Invoker(command);
    invoker -> exec();
    delete invoker;
    return 0;
}
```

在我们的栗子中Invoker对象没有撤销方法，我们可以在它里面实现一个撤销方法，当我们不需要一个command而要另一个command的时候可以重新设定Invoker里面的_comm变量。以重复利用。
