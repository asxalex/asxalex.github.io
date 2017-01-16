---
title: "算术编码"
date: 2013-07-28 00:26
tags: Problems
---
今天在图书馆看书的时候，同学跟我讲了一个图像压缩算法——算术编码。刚开始也没怎么注意，直到他给我讲了编码原理，我才理会到这个编码算法的思想。

从原理上来说，这个编码算法一点也不复杂<!--more-->，用计算机语言实现也不是很困难，但我刚理解它的时候就惊叹于这个思想。整个思想是总的来说就是通过对0到1区间的不断细分直至结束，然后在所属区间中任意取一个数当作生成的编码。下面我就说说我实现的编码实现原理。

首先，我们从头到尾扫描一遍需要压缩的文件，提取出里面的符号信息，统计出其中每个符号出现的频率等信息，接着通过每个符号所占的比例对每个符号进行编码，为了具体，我们就假设所需要压缩的文件内容为aabbc。在第一遍扫描下来之后，我们可以得到 a 的频率P 为
```c 
P(a) = 2/5;
P(b) = 2/5;
P(c) = 1/5;
```

于是，我们将区间 [0.0 - 1.0] 平均划分成五个区间，其中a 和 b 各占两份，c占一份，并且将其按顺序进行排列。由此，我们可以得到 a、b、c 各自的区间分别为 [0.0 -0.4] 、[0.4 - 0.8] 和 [0.8 - 1.0] 。

之后，我们就可以再次对该所需压缩文件进行扫描。这次扫描的主要目的是产生压缩后的文件——一个介于0到1的小数！具体产生方法如下：还是以上面的文件为例，我们首先设置两个变量——high 和 low，分别用于指示当前区间的上下界，当扫描到 a 时，由于a的区间为 [0.0 - 0.4]，我们将上下界重新赋值：
```c 
//*high与*low分别为上下界，在函数中用指针传递，fr为存放各个符号上下界信息的数组
temp_high = *low + (*high - *low) * fr[i].high;
*low = *low + (*high - *low) * fr[i].low;
*high = temp_high;
```
通过以上公式，当扫描到b时，我们就对区间[0.0 - 0.2]按比例划分，并利用公式重新算出上下界，以此类推，我们就可以通过for循环对文件中的字符进行编码，最终我们会得到一个上下界——high与low，当循环完毕时，我们就可以用high与low的平均值当作编码结果。没错，这个编码结果就是一个小数（当然，还得有一个字符与上下界的对照表）！

而在解码时，我们根据原文件中字符的个数、那个小数的值以及那个生成的字符对照表，就可以利用编码时类似的公式从区间里寻找对应的字符，从而对编码后的文件进行解码。

开头就说过，这个算法原理比较简单，实现也不麻烦，但它的思想值得借鉴。它有一些逐步细分的意味，通过一级一级把区间缩小，有一种递归的美感（可能是函数式编程的尾递归看多了，:-)）。不仅如此，这个算法到后来压缩出来的结果是一个数！而不是通常的字符串。这着实让我感到很意外。甚至有点惊叹。

当然，这个算法也不尽善尽美，由于计算机可表示的浮点数精度有限，当以这个算法进行压缩时，原文件不宜太大。对于这个缺陷，还有一些自适应算术编码等扩展的算法，有兴趣的可以查wiki 百科[Arithmetic Coding](http://en.wikipedia.org/wiki/Arithmetic_coding)