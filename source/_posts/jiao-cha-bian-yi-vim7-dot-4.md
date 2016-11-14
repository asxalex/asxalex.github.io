---
title: "交叉编译vim7.4"
date: 2013-09-08 18:09
tags: Fun
---
vim，作为编辑器之神，相信每一个接触过linux的人都很熟悉（至少听说过）。大概一个月前，vim发布了最新版vim7.4。作为vim的忠实用户，当然要下载下来体验一下喽。正好这几天正在玩RPi，所以，趁着这个机会，顺便学习一下交叉编译软件，以下是我在ubuntu12.04下交叉编译vim7.4的过程。

准备工作：安装之前的准备工作没什么好说的，至少要得到源代码吧？在下载完vim7.4之后（随便google一下就能搜到下载源代码的方法），由于vim还依赖libncurses.so这个动态链接库，所以也要下载ncurses-5.9.tar.gz（ftp下载：ftp.keystealth.org , 在pub/gnu/ncurses目录下）。<!--more-->

## 移植ncurses-5.9

```c++ 
$ tar -xzvf ncurses-5.9.tar.gz
$ cd ncurses-5.9
$ ./configure CC=arm-linux-gcc\
                 --host=arm-linux\
                 --target=arm-linux \
                 --build=i686-linux\
                 --with-shared
```

但这样会在编译时提示：

```c++
...
undefined reference to `__gxx_personality_v0'
...
```

解决办法是配置时用arm-linux-g++代替arm-linux-gcc，之后是make HOSTCC=gcc CXX=arm-linux-gcc && sudo make install。之后，在其lib目录下就有libncurses.so等动态链接库了。

## 移植vim7.4
我在刚开始配置vim7.4的时候，运行configure的时候就是有问题。后来，在通过一番google之后，终于找到了这个—— [INSTALLx.txt-cross-compiling Vim on Unix](https://vim.googlecode.com/hg/src/INSTALLx.txt)。里面有vim交叉编译的参数，在经历过一次次Trial and error之后，有了以下的配置参数：

```c++
./configure --host=arm-linux\
                   --target=arm-linux\
                   CC=arm-linux-gcc\
                   --build=i686-linux\
                   --with-tlib=ncurses\
                   vim_cv_toupper_broken=yes\
                   CPPFLAGS=-I/home/alex/Downloads/ncurses-5.9/includencursesw\
                   LDFLAGS=-L/home/alex/Downloads/ncurses-5.9/lib/\
                   --without-x --disable-gui\
                   vim_cv_terminfo=yes\
                   vim_cv_tty_group=world\
                   vim_cv_getcwd_broken=yes\
                   vim_cv_stat_ignores_slash=yes\
                   vim_cv_memmove_handles_overlap=yes\
                   --prefix=/usr/tools
```

因为我在用raspberry pi时一般都是ssh上去的，也不需要GUI，所以使用了参数： --without-x --disable-gui；用--prefix指定生成的库文件的安装目录；另外的vim\*\*都在INSTALLx.txt里有所说明。

在这之后，便是编译了，在这里我也遇到了困难：

```c++
$ make CC=arm-linux-gcc
$ sudo make install
```

在进行make的时候还是挺顺利的，经过一段时间的等候就编译完了。倒是在最后一步理所当然要成功的make install出现了错误：

```c++
Starting make in the src directory.
If there are problems, cd to the src directory and run make there
cd src && make install
make[1]: Entering directory `/home/alex/Downloads/vim74/src'
if test -f /usr/tools/bin/vim; then \
      mv -f /usr/tools/bin/vim /usr/tools/bin/vim.rm; \
      rm -f /usr/tools/bin/vim.rm; \
    fi
cp vim /usr/tools/bin
strip /usr/tools/bin/vim
strip: Unable to recognise the format of the input file `/usr/tools/bin/vim'
make[1]: *** [installvimbin] Error 1
make[1]: Leaving directory `/home/alex/Downloads/vim74/src'
make: *** [install] Error 2
```

这是make install有个参数STRIP，用于指定对文件进行strip操作的工具，由于我们是交叉编译，所以，“正常”的strip理所当然无法识别我们的文件，需要指定

```c++
$ sudo make STRIP=arm-linux-gnueabihf-strip install
```

经过以上几步，在我们的host中的/usr/tools/目录下就有交叉编译的产物了，将它拷贝至raspberry pi中。另外，将libncurses.so.5.8拷贝到RPi的/usr/lib目录下，并作个软链接：

```c++
$ scp -r /usr/tools/ pi@192.168.2.14:/usr/tools
$ scp libncurses.so.5.8 pi@192.168.2.14:/usr/lib
#以上一步用于拷贝，实际操作中由于权限问题无法实现，须先拷贝至/home/pi/下，然后在拷贝到/usr/tools

#ssh pi@192.168.2.14
$ sudo ln -s libncurses.so.5.8 libncurses.so.5
$ sudo ln -s libncurses.so.5 libncurses.so
```

最后，ssh到RPi上，执行以下命令：

```c++
$ sudo rm /usr/bin/vim
$ sudo ln -s /usr/tools/bin/vim /usr/bin/vim
```

这样就完全大功告成啦:-)，执行一下vim --version，结果如下：

{% img http://asxalex.qiniudn.com/crosscompile.png %}

（EOF）
