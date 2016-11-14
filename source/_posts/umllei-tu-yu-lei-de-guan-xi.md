---
title: "UML类图与类的关系"
date: 2013-08-14 20:47
tags: UML
---
这几天在学习设计模式《Design patterns》，发现在设计类的时候，类图是一个很好的工具。在画类图的时候，理清类与类之间的关系是重点。类的关系有泛化（Generalization）、依赖（Dependency）和关联（Association）。其中关联又分为一般关联关系，聚合关系（Aggregation）和合成关系（Composition）。下面我们结合实例理解这些关系。<!--more-->

## 类图（Class Diagram）
类图（Class Diagram）是面向对象系统建模中最常用和最重要的图，是定义其它图的基础。类图主要是用来显示系统中的类、接口以及它们之间的静态结构和关系的一种静态模型。 

类的三个基本组件：类名、属性和方法。

{% img http://asxalex.qiniudn.com/class.png %}

其中，若类名为正体字，则表明类是**可被实例化**的，若为斜体字，则表明为**抽象类**。方法及属性前的减号（-）代表private，加号（+）代表public，#（sharp）代表protected。如果属性或方法下面有下划线，则表明为静态的。

## 泛化（generalization）
泛化(generalization)表示is-a的关系，是对象之间耦合度最大的一种关系，子类继承父类的所有细节。直接使用语言中的继承表达。在类图中使用带三角箭头的实线表示，箭头从子类指向父类。

{% img http://asxalex.qiniudn.com/generalization.png %}

## 依赖（Dependency）
依赖(Dependency)是对象之间最弱的一种关联方式，表示use-a的关系，是临时性的关联。代码中一般指由局部变量、函数参数、返回值建立的对于其他对象的调用关系。一个类调用被依赖类中的某些方法而得以完成这个类的一些职责。在类图使用带箭头的虚线表示，箭头从使用类指向被依赖的类。若类A依赖于类B，则类B体现为局部变量、方法的参数、返回值或静态方法的调用

{% img http://asxalex.qiniudn.com/dependency.png %}

## 关联（Association）
关联(Association)是对象之间一种引用关系，比如客户类与订单类之间的关系。这种关系通常使用类的属性表达。关联又分为一般关联、聚合关联与组合关联。后两种在后面分析。在类图使用带箭头的实线表示，箭头从使用类指向被关联的类。可以是单向和双向。若类A关联于类B，则类B体现为类A的全局变量。

{% img http://asxalex.qiniudn.com/association.png %}

## 聚合（Aggregation）
聚合(Aggregation)表示has-a的关系，是一种不稳定的包含关系。较强于一般关联,有整体与局部的关系,并且没有了整体,局部也可单独存在。如公司和员工的关系，公司包含员工，但如果公司倒闭，员工依然可以换公司。在类图使用空心的菱形表示，菱形从局部指向整体。若类A由类B聚合而成，则表现为类A包含类B的全局对象，而类B对象可以不在类A创建时刻创建。

{% img http://asxalex.qiniudn.com/aggregation.png %}

## 组合（Composition）
组合(Composition)表示contains-a的关系，是一种强烈的包含关系。组合类负责被组合类的生命周期。是一种更强的聚合关系。部分不能脱离整体存在。体现为严格的**整体——部分**关系，生命周期一致。若类A由类B组成，则类A包含类B的全局对象，并且B在A创建时刻创建。如公司和部门的关系，没有了公司，部门也不能存在了；调查问卷中问题和选项的关系；订单和订单选项的关系。在类图使用实心的菱形表示，菱形从局部指向整体。

{%img http://asxalex.qiniudn.com/composition.png %}

在掌握这些uml类图的基本知识之后，我们就可以在以后的面向对象设计中有章可循，在画出类图之后，就可以十分顺手地编码了。
