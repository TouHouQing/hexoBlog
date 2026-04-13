---
title: JAVA学习笔记
date: 2025-04-11 16:49:42
updated: 2025-04-11 16:49:42
categories:
  - Wiki
tags:
  - 笔记
wiki: true
top_img: false
permalink: 'wiki/java-study-notes/'
---
# JAVA学习笔记

## JAVA SE



### 方法

#### 可变参数

一种特殊形参，定义在方法，构造器的形参列表里，格式是：数据类型...参数名称;

特点：可以不传数据，也可以传一个或者多个数据，也可以传一个数组。

可变参数在方法内部就是一个数组，一个形参列表中可变参数只能有一个，可变参数必须放在形参列表最后面



### 抽象类

- 抽象类中不一定要有抽象方法，有抽象方法的类必须是抽象类
- 抽象类不能创建对象，仅作为一种特殊父类被子类继承并实现
- 一个类继承抽象类必须重写完抽象类的全部抽象方法，否则这个类也必须定义为抽象类



### 接口

接口是用来被类实现(implements)的，实现接口的类被称为实现类，一个类可以同时实现多个接口。

```JAVA
修饰符 class 实现类类名 implements 接口1，接口2....{}
```



### lambda

可以用于替代某些匿名内部类对象，从而让程序更简洁，可读性更好

lambda表达式只能替代函数式接口的匿名内部类，有且仅有一个抽象方法的接口

规则：

1. 参数类型全部可以省略不写
2. 如果只有一个参数，参数类型省略的同时"()"也可以省略，但多个参数不能省略“()"
3. 如果lambda表达式中只有一行代码，大括号可以不写，同时要省略分号";"如果这行代码是语句，也必须去掉return

```JAVA
Arrays.sort(stu,new Comparator<stu>(){
    public int compare(stu o1,stu o2){
        return o1.age()-o2.age();
    }
})

Arrays.sort(stu,(o1,o2)->{
    return o1.age()-o2.age();
})
    
Arrays.sort(stu,(o1,o2)->o1.age()-o2.age());
```

#### 静态/实例方法引用

如果某个lambda表达式里只是调用一个静态方法，并且"->"前后参数一直，就可以使用静态方法引用

```java
//Student.java
public static int compareByAge(Student o1,Student o2){
	return o1.age()-o2.age();
}
public int compareByAge(Student o1,Student o2){
	return o1.age()-o2.age();
}
//main.java
Arrays.sort(students,(o1,o2)->Student.compareByAge(o1,o2));
//==
Arrays.sort(students,Student::compareByAge);
```

#### 特定类的方法引用

如果某个lambda表达式里只是调用一个特定类型的实例方法，并且前面参数列表中的第一个参数是作为方法的主调，后面的所有参数都是作为该实例方法的入参的，则此时就可以使用特定类型的方法引用

```java
Arrays.sort(names,(o1,o2)->o1.compareToIgnoreCase(o2));
//==
Arrays.sort(names,String::compareToIgnoreCase);
```

#### 构造器引用

如果某个Lambda表达式里只是在创建对象，并且"->"前后参数一致，就可以使用构造器引用

```JAVA
CarFactary cf = new CarFactary()
{
    public Car gerCar(String name){
        return new Car(name);
    }
};
//==
CarFactary cf = name -> name Car(name);
//==
CarFactary cf = Car::new;
```

### 异常

#### 抛出异常

在方法上使用throws关键字，可以将方法内部出现的异常跑出去给调用者处理

```java
方法 throws 异常1,异常2...{

}
```

#### 捕获异常

```JAVA
try{
//可能出现异常的代码
}catch(异常类型1 变量){
//处理异常
}catch(异常类型2 变量){
//处理异常
}
```

#### 自定义编译/运行时异常

定义一个异常类继承Exception，重写构造器，通过throw new 异常类(xxx)创建异常对象并抛出（编译阶段不报错，运行时才可能出现）

定义一个异常类继承RuntimeException，重写构造器，通过throw new 异常类(xxx)创建异常对象并抛出（编译阶段就报错）

### 泛型

定义类,接口,方法时，同时声明了一个或多个类型变量，统称为泛型

```JAVA
修饰符 class 类名<类型变量>{
}
public class myArrayList<E>{
}
修饰符 interface 接口名<类型变量>{
}
```

泛型不支持基本数据类型，只能支持对象类型(引用数据类型)

#### 泛型方法

```JAVA
修饰符<类型变量>返回值类型 方法名(形参){
}
public static <T> void test(T t){
}
```

#### 通配符

"?"，可以在"使用泛型"的时候代表一切类型,E T K V是在定义泛型的时候使用

##### 泛型上限

```JAVA
? extends Car  //?接收的必须是Car或者其子类
```

##### 泛型下限

```JAVA
? super Car    // ?接收的必须是Car或者其父类
```

### Stream流

`Stream`将要处理的元素集合看作一种流，在流的过程中，借助`Stream API`对流中的元素进行操作，比如：筛选、排序、聚合等。

步骤：数据源->过滤/排序/去重->获取结果

获取stream流->调用流水线的各种方法->获取处理的结果   

#### 获取stream流

```JAVA
default Stream<E> stream()//Collection获取集合的stream流
Collection<String> list new Arraylist<>();
Stream<String> s1=list.stream();//获取集合的stream流

Map<String,Integer>map = new HashMap<>();//获取map的straem流
Stream<String> s2 = map.keySet().stream();
Stream<Integer> s3 = map.values().stream();
Stream<Map.Entry<String,Integer>> s4 = map.entrySet().stream();

public static <T> Stream<T> stream(T[] array)//Arrays获取数组的stream流
String[] names = {};//获取数组的stream流
Stream<String> s5 = Arrays.stream(names);
Strean<String> s6 = Stream.of(names);
public static<T>  Stream<T> of(T... values)//获取当前接收数据的stream流
```

### File

- File 类的对象可以代表文件 / 文件夹，并可以调用其提供的方法对文件进行操作。

#### 创建 File 类的对象

| 构造器                                   | 说明                                           |
| :--------------------------------------- | ---------------------------------------------- |
| public File(String pathname)             | 根据文件路径创建文件对象                       |
| public File(String parent, String child) | 根据父路径和子路径名字创建文件对象             |
| public File(File parent, String child)   | 根据父路径对应文件对象和子路径名字创建文件对象 |

注意

- File 对象既可以代表文件，也可以代表文件夹。
- File 封装的对象仅仅是一个路径名，这个路径可以是存在的，也允许是不存在的。

#### 判断文件类型、获取文件信息方法

| 方法名称                        | 说明                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| public boolean exists()         | 判断当前文件对象，对应的文件路径是否存在，存在返回 true      |
| public boolean isFile()         | 判断当前文件对象指代的是否是文件，是文件返回 true，反之返回 false |
| public boolean isDirectory()    | 判断当前文件对象指代的是否是文件夹，是文件夹返回 true        |
| public String getName()         | 获取文件的名称（包含后缀）                                   |
| public long length()            | 获取文件的大小，返回字节个数                                 |
| public long lastModified()      | 获取文件的最后修改时间。                                     |
| public String getPath()         | 获取创建文件对象时，使用的路径                               |
| public String getAbsolutePath() | 获取绝对路径                                                 |

#### 创建文件

| 方法名称                       | 说明                 |
| ------------------------------ | -------------------- |
| public boolean createNewFile() | 创建一个新的空的文件 |
| public boolean mkdir()         | 只能创建一级文件夹   |
| public boolean mkdirs()        | 可以创建多级文件夹   |

#### 删除文件

| 方法名称                | 说明               |
| ----------------------- | ------------------ |
| public boolean delete() | 删除文件、空文件夹 |

注意：delete 方法默认只能删除文件和空文件夹，删除后的文件不会进入回收站。

#### 遍历文件夹

| 方法名称                  | 说明                                                         |
| ------------------------- | ------------------------------------------------------------ |
| public String[] list()    | 获取当前目录下所有的 “一级文件名称” 到一个字符串数组中返回。 |
| public File[] listFiles() | 获取当前目录下所有的 “一级文件对象” 到一个文件对象数组中去返回（重点）。 |

使用 listFiles 方法时的注意事项：

- 当主调是文件，或者路径不存在时，返回 null
- 当主调是空文件夹时，返回一个长度为 0 的数组
- 当主调是一个有内容的文件夹时，将里面所有一级文件和文件夹的路径放在 File 数组中返回
- 当主调是一个文件夹，且里面有隐藏文件时，将里面所有文件和文件夹的路径放在 File 数组中返回，包含隐藏文件
- 当主调是一个文件夹，但是没有权限访问该文件夹时，返回 null

### IO流

#### 文件字节输入流

以内存为基准，可以把磁盘文件中的数据以字节的形式读入到内存中去。

| 构造器                                  | 说明                           |
| --------------------------------------- | ------------------------------ |
| public FileInputStream(File file)       | 创建字节输入流管道与源文件接通 |
| public FileInputStream(String pathname) | 创建字节输入流管道与源文件接通 |

| 方法名称                       | 说明                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| public int read()              | 每次读取一个字节返回，如果发现没有数据可读会返回 - 1.        |
| public int read(byte[] buffer) | 每次用一个字节数组去读取数据，返回字节数组读取了多少个字节，如果发现没有数据可读会返回 - 1. |



#### 文件字节输出流

以内存为基准，把内存中的数据以字节的形式写出到文件中去。

| 构造器                                                   | 说明                                           |
| -------------------------------------------------------- | ---------------------------------------------- |
| public FileOutputStream(File file)                       | 创建字节输出流管道与源文件对象接通             |
| public FileOutputStream(String filepath)                 | 创建字节输出流管道与源文件路径接通             |
| public FileOutputStream(File file, boolean append)       | 创建字节输出流管道与源文件对象接通，可追加数据 |
| public FileOutputStream(String filepath, boolean append) | 创建字节输出流管道与源文件路径接通，可追加数据 |

| 方法名称                                           | 说明                         |
| -------------------------------------------------- | ---------------------------- |
| public void write(int a)                           | 写一个字节出去               |
| public void write(byte[] buffer)                   | 写一个字节数组出去           |
| public void write(byte[] buffer, int pos, int len) | 写一个字节数组的一部分出去。 |
| public void close() throws IOException             | 关闭流。                     |



#### 资源释放的方案

##### try - catch - finally

```plaintext
try {
   ...
} catch (IOException e) {
    e.printStackTrace();
} finally{
}
```

- **finally 代码区的特点**：无论 try 中的程序是正常执行了，还是出现了异常，最后都一定会执行 finally 区，除非 JVM 终止。
- **作用**：一般用于在程序执行完成后进行资源的释放操作（专业级做法）。

##### try - with - resource

JDK 7 开始提供了更简单的资源释放方案：try - with - resource

```JAVA
try(定义资源1;定义资源2;...) {
    // 可能出现异常的代码;
} catch(异常类名 变量名) {
    // 异常的处理代码;
}
```

该资源使用完毕后，会自动调用其`close()`方法，完成对资源的释放！

- `()`中只能放置资源，否则报错
- 什么是资源呢？
  - 资源一般指的是最终实现了`AutoCloseable`接口。

```java
public abstract class InputStream implements Closeable {}
public abstract class OutputStream implements Closeable, Flushable {}
public interface Closeable extends AutoCloseable {}
```



#### 文件字符输入流

以内存为基准，可以把文件中的数据以字符的形式读入到内存中去。

| 构造器                             | 说明                           |
| ---------------------------------- | ------------------------------ |
| public FileReader(File file)       | 创建字符输入流管道与源文件接通 |
| public FileReader(String pathname) | 创建字符输入流管道与源文件接通 |

| 方法名称                       | 说明                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| public int read()              | 每次读取一个字符返回，如果发现没有数据可读会返回 - 1.        |
| public int read(char[] buffer) | 每次用一个字符数组去读取数据，返回字符数组读取了多少个字符，如果发现没有数据可读会返回 - 1. |



#### 文件字符输出流

**作用**：以内存为基准，把内存中的数据以字符的形式写出到文件中去。

| 构造器                                             | 说明                                           |
| -------------------------------------------------- | ---------------------------------------------- |
| public FileWriter(File file)                       | 创建字节输出流管道与源文件对象接通             |
| public FileWriter(String filepath)                 | 创建字节输出流管道与源文件路径接通             |
| public FileWriter(File file, boolean append)       | 创建字节输出流管道与源文件对象接通，可追加数据 |
| public FileWriter(String filepath, boolean append) | 创建字节输出流管道与源文件路径接通，可追加数据 |

| 方法名称                                  | 说明                 |
| ----------------------------------------- | -------------------- |
| void write(int c)                         | 写一个字符           |
| void write(String str)                    | 写一个字符串         |
| void write(String str, int off, int len)  | 写一个字符串的一部分 |
| void write(char[] cbuf)                   | 写入一个字符数组     |
| void write(char[] cbuf, int off, int len) | 写入字符数组的一部分 |



#### 字符输出流的注意实现

**字符输出流写出数据后，必须刷新流，或者关闭流，写出去的数据才能生效**

| 方法名称                               | 说明                                                 |
| -------------------------------------- | ---------------------------------------------------- |
| public void flush() throws IOException | 刷新流，就是将内存中缓存的数据立即写到文件中去生效！ |
| public void close() throws IOException | 关闭流的操作，包含了刷新！                           |



#### 缓冲字节输入流

**作用**：可以提高字节输入流读取数据的性能。

**原理**：缓冲字节输入流自带了 8KB 缓冲池；缓冲字节输出流也自带了 8KB 缓冲池。

| 构造器                                       | 说明                                                         |
| -------------------------------------------- | ------------------------------------------------------------ |
| public BufferedInputStream(InputStream is)   | 把低级的字节输入流包装成一个高级的缓冲字节输入流，从而提高读数据的性能 |
| public BufferedOutputStream(OutputStream os) | 把低级的字节输出流包装成一个高级的缓冲字节输出流，从而提高写数据的性能 |





## JAVA Web

### HTML

```html
<html>
<head>
  <title>HTML快速入门</title>
</head>
<body>
  <h1>Hello HTML</h1>
  <img src="1.jpg" />
</body>
</html>
```

效果

![image-20241215184635442](/Users/touhouqing/Desktop/git/data/note/javaimg/image-20241215184635442.png)

### CSS



### JS



### Vue

