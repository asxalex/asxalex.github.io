---
title: "Raspberry pi配置使用无线网卡"
date: 2013-08-26 23:44
tags: Fun
---
前天刚到校，翻出了闲置很久的Rpi。那时候在买之前，我就下决心要好好利用它，但要将它连上校园网却不是很简单。没有网络的系统就像一潭死水一样毫无生机。就算你事先将许多软件安装好，在你开发时也常常会遇到某些工具软件没安装的情况，这会让人十分苦恼。而且手工安装缺失的软件实在不是一种明智的选择————linux下的包依赖关系几乎是无法手工管理的。

为了连上网络，我以前也尝试过使用linux客户端进行少量的修改来认证，但毕竟架构不同，尝试了许多最终还是以失败告终。遂将其闲置了几个月。<!--more-->

后来，同学有个闲置的路由器，我也闲着没事，就将它的路由器刷了个openwrt系统。后来抱着试试看的态度，将我电脑里的认证的bin文件拷贝进路由器试着进行认证。让我吃惊的是那个竟然能认证成功！于是，只要在路由器里进行认证，而连接到这个局域网的电脑、手机什么的都不需要认证了。由于Rpi上只有一个ethernet接口，我又买了根网线链接到路由器的Lan口，在一阵鼓捣之后终于ping通了8.8.8.8，一阵兴奋之后，我就将一些常用的软件（vim、ipython等）安装上去了。但后来发现这个方法不是很稳定（或者说很是不稳定）：路由器要连续认证好多次才能真正上网、一旦用了Lan口，其他设备连上wifi就无法上网……这一系列问题又让Rpi在黑暗的角落待了好几个月。

这次在网上看到了可以用usb无线网卡来让Rpi连接进网络。在论坛里逛了好久，看到许多人说NW336 150M无线网卡免驱就能被raspbian识别。我今天上午9点多下的单，到下午3点货就到了（这速度，太给力了）。拿到之后我一阵欣喜地试了下，但没有出现像网上所说的一样，免驱就能使用。ifconfig -a始终没有出现期待的wlan0   :(

经google良久才发现端倪：他们的lsusb出现的是

```c++
pi@raspberrypi:/$ lsusb
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 001 Device 002: ID 0424:9512 Standard Microsystems Corp.
Bus 001 Device 003: ID 0424:ec00 Standard Microsystems Corp.
Bus 001 Device 004: ID 0bda:8176 Realtek Semiconductor Corp. RTL8188CUS 802.11n WLAN Adapter
```

而我的是：

```c++
pi@raspberrypi:/$ sudo lsusb
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 001 Device 002: ID 0424:9512 Standard Microsystems Corp.
Bus 001 Device 003: ID 0424:ec00 Standard Microsystems Corp.
Bus 001 Device 004: ID 0bda:8179 Realtek Semiconductor Corp.
```

这个命令显示的usb id不一样，我这个网卡的芯片是8188eu，而论坛里大家的网卡芯片是8192cu，顺着这个继续google，历经千辛万苦，终于让我找到了解决方案：在github上有基于8192cu基础上修改的8188eu的[驱动代码](https://github.com/Red54/linux-shumeipai2/tree/sunxi-3.0/drivers/net/wireless/rtl8188eu)

下载源码之后，正式编译之前，我们首先需要修改makefile里的编译选项，其默认配置是i386平台：

```c++
...
CONFIG_PLATFORM_I386_PC = y
CONFIG_PLATFORM_ANDROID_X86 = n
CONFIG_PLATFORM_ARM_S3C2K4 = n
CONFIG_PLATFORM_ARM_PXA2XX = n
...
```

由于Rpi是BCM2708平台，所以修改如下：

```c++
...
CONFIG_PLATFORM_I386_PC = n
CONFIG_PLATFORM_BCM2708 = y
CONFIG_PLATFORM_ANDROID_X86 = n
CONFIG_PLATFORM_ARM_S3C2K4 = n
CONFIG_PLATFORM_ARM_PXA2XX = n
...
```

之后需要创建新增的目标平台的配置选项，在Makefile里有如下几行：

```c++
...
ifeq ($(CONFIG_PLATFORM_I386_PC), y)
EXTRA_CFLAGS += -DCONFIG_LITTLE_ENDIAN
SUBARCH := $(shell uname -m | sed -e s/i.86/i386/)
ARCH ?= $(SUBARCH)
CROSS_COMPILE ?=
KVER := $(shell uname -r)
KSRC := /lib/modules/$(KVER)/build
MODDESTDIR := /lib/modules/$(KVER)/kernel/drivers/net/wireless/
INSTALL_PREFIX :=
endif
 
ifeq ($(CONFIG_PLATFORM_TI_AM3517), y)
EXTRA_CFLAGS += -DCONFIG_LITTLE_ENDIAN -DCONFIG_PLATFORM_ANDROID -DCONFIG_PLATFORM_SHUTTLE
CROSS_COMPILE := arm-eabi-
KSRC := $(shell pwd)/../../../Android/kernel
ARCH := arm
endif
...
```

在之间添加配置选项，结果如下：

```c++
...
ifeq ($(CONFIG_PLATFORM_I386_PC), y)
EXTRA_CFLAGS += -DCONFIG_LITTLE_ENDIAN
SUBARCH := $(shell uname -m | sed -e s/i.86/i386/)
ARCH ?= $(SUBARCH)
CROSS_COMPILE ?=
KVER := $(shell uname -r)
KSRC := /lib/modules/$(KVER)/build
MODDESTDIR := /lib/modules/$(KVER)/kernel/drivers/net/wireless/
INSTALL_PREFIX :=
endif
 
ifeq ($(CONFIG_PLATFORM_BCM2708), y)
EXTRA_CFLAGS += -DCONFIG_LITTLE_ENDIAN
ARCH := arm
CROSS_COMPILE :=
KVER := $(shell uname -r)
KSRC := /lib/modules/$(KVER)/build
MODDESTDIR := /lib/modules/$(KVER)/kernel/drivers/net/wireless
INSTALL_PREFIX :=
MODULE_NAME := 8188eu
endif

ifeq ($(CONFIG_PLATFORM_TI_AM3517), y)
EXTRA_CFLAGS += -DCONFIG_LITTLE_ENDIAN -DCONFIG_PLATFORM_ANDROID -DCONFIG_PLATFORM_SHUTTLE
CROSS_COMPILE := arm-eabi-
KSRC := $(shell pwd)/../../../Android/kernel
ARCH := arm
endif
...
```

之后make之，得到8188eu.ko,将其install至对应地点：
> sudo install 8188eu.ko /lib/modules/3.6.11+/kernel/drivers/net/wireless/8188eu.ko  

> sudo depmod -a  

> sudo modprobe 8188eu  

经过以上几步，当我们再次ifconfig -a时，就能看到wlan0了。之后，就是可以通过wlan0连接到无线网络啦:) 当看到用我的Rpi可以ping通这个blog时真的好兴奋！
