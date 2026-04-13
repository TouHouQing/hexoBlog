---
title: STL笔记
date: 2025-04-11 16:49:42
updated: 2025-04-17 23:13:20
categories:
  - Wiki
tags:
  - 笔记
wiki: true
top_img: false
permalink: 'wiki/stl-notes/'
---
#                                                                                                                                                                                                            STL笔记2025-4-17-by青浩洋

## 下标访问

vector,deque,map可以用下标访问

vector

```C++
std::vector<int> v = {1, 2, 3, 4, 5};
int element = v[2]; // 访问下标为 2 的元素，这里将得到 3。
```

deque

```C++
std::deque<int> dq = {21, 22, 23, 24, 25};
int item = dq[1]; // 访问下标为 1 的元素，这里将得到 22。
```

map特殊：1：如果下标对应的键已经存在于`map`中，那么可以直接使用下标访问来获取对应的值，并可以修改这个值。

```C++
   std::map<std::string, int> myMap;
   myMap["apple"] = 5;
   int value = myMap["apple"]; // 获取键为"apple"的值，这里 value 为 5。
   myMap["apple"] = 10; // 修改键为"apple"对应的值为 10。
    
```

2：如果下标对应的键不存在于`map`中，那么使用下标访问会自动插入一个新的键值对，其中值会进行默认初始化。

```C++
   std::map<std::string, int> myMap;
   int value = myMap["banana"]; // 由于"banana"键不存在，会自动插入键为"banana"，值为默认初始化的 0 的键值对，此时 value 为 0。
```

需要注意的是，这种方式可能会导致意外的键值对插入，如果只是想安全地查询是否存在某个键并获取对应的值，更好的做法是使用`find`成员函数，这样可以避免不必要的插入操作。例如：

```c++
   std::map<std::string, int> myMap;
   myMap["cherry"] = 8;
   auto it = myMap.find("cherry");
   if (it!= myMap.end()) {
       int value = it->second;
       // 这里可以安全地获取键为"cherry"的值，不会有意外插入的风险。
   }
```



## vector容器  http://t.csdnimg.cn/HB25N

### 一维vector

```c++
vector<typename> name;
```

### 二维vector

```c++
vector<typename> Arrayname[size];
```

### 迭代器遍历vector

```c++
#include<bits/stdc++.h>
using namespace std;
int main(){
	vector<int> v;
	v.push_back(1);	//依次输入1、 2、 3 
	v.push_back(2);
	v.push_back(3);
	for(vector<int>::iterator it = v.begin(); it != v.end(); it++){
		cout << *it << " ";
	}
    return 0;
} 

//输出结果：1 2 3
```

## vector常用函数

### 1、push_back(x)  就是在vector容器v**后面**添加一个元素x，时间复杂度为O(1)。

```C++
#include<bits/stdc++.h>
using namespace std;
int main(){
	vector<int> v;
	for(int i = 1; i <= 3; i++){
		v.push_back(i);
	}
	for(vector<int>::iterator it = v.begin(); it != v.end(); it++){
		cout << *it << " ";
	}
	return 0;
} 

//输出结果 1 2 3
```

### 2、[pop_back](https://so.csdn.net/so/search?q=pop_back&spm=1001.2101.3001.7020)():**)**可以删除vector的**尾**元素，时间复杂度为O(1)

```c++
#include<bits/stdc++.h>
using namespace std;
int main(){
	vector<int> v;
	for(int i = 1; i <= 3; i++){
		v.push_back(i);	//将1、2、3 依次插入v的队尾 
	}
	v.pop_back();	//删除尾元素 
	for(vector<int>::iterator it = v.begin(); it != v.end(); it++){
		cout << *it << " ";
	}
	
    return 0;
} 

//输出结果 1 2
```

### 3、size()：**size()**用来获得vector中元素的**个数**，时间复杂度为O(1)。size()返回的是**unsigned**类型

```c++
#include<bits/stdc++.h>
using namespace std;
int main(){
	vector<int> v;
	for(int i = 1; i <= 3; i++){
		v.push_back(i);	//将1、2、3 依次插入v的队尾 
	}
	v.pop_back();	//删除尾元素 
	//for(vector<int>::iterator it = v.begin(); it != v.end(); it++){
//		cout << *it << " ";
//	}
	cout << v.size();    //获取容器长度
 
    return 0;
} 

//输出结果 2
```

#### 4、clear()：用来清空vector中的所有元素，时间复杂度为O(N)，N为vector中的元素个数

```c++
#include<bits/stdc++.h>
using namespace std;
int main(){
	vector<int> v;
	for(int i = 1; i <= 3; i++){
		v.push_back(i);	//将1、2、3 依次插入v的队尾 
	}
	v.pop_back();	//删除尾元素 
	v.clear();	
	//for(vector<int>::iterator it = v.begin(); it != v.end(); it++){
//		cout << *it << " ";
//	}
	cout << v.size();
	
    return 0;
} 

//输出结果 0
```

#### 5、insert(it,x):用来向vector的任意迭代器**it**处插入一个元素x，时间复杂度O(N)

```c++
#include<bits/stdc++.h>
using namespace std;
int main(){
	vector<int> v;
	for(int i = 1; i <= 5; i++){
		v.push_back(i);	//将1、2、3、4、5 依次插入v的队尾 
	}
	v.insert(v.begin() + 2, -1);	//将-1插入v[2]的位置 
	for(vector<int>::iterator it = v.begin(); it != v.end(); it++){
		cout << *it << " ";
	}
	
	return 0; 
} 

//输出结果 1 2 -1 3 4 5
```

**insert(pos,first,last)** 在 **pos** 位置之前，插入其他容器（不仅限于vector）中位于 [first,last) 区域的所有元素(简单说就是把两个容器拼接在一起)。

```c++
#include<bits/stdc++.h>
using namespace std;
 
int main(){
	vector<int> v, v1, v2;
    for(int i = 1; i <= 3; i++) v.push_back(i);
	for(int i  = 11; i <= 13; i++) v1.push_back(i);
	for(int i  = 101; i <= 103; i++) v2.push_back(i);
	v.insert(v.end(), v1.begin(), v1.end());  //输出1 2 3 11 12 13
	v.insert(v.end(), v2.begin(), v2.end()); //输出1 2 3 11 12 13 101 102 103
 
    return 0;
}
```

#### 6、erase():有两种用法：删除单个元素、删除一个区间内所有元素。时间复杂度为O(N)。

1:**erase(it)**即删除迭代器为**it**处的元素：

```c++
#include<bits/stdc++.h>
using namespace std;
int main(){
	vector<int> v;
	for(int i = 1; i <= 5; i++){
		v.push_back(i);	//将1、2、3、4、5 依次插入v的队尾 
	}
	v.erase(v.begin() + 2);	//删除3 
	for(vector<int>::iterator it = v.begin(); it != v.end(); it++){
		cout << *it << " ";
	}
	
	return 0; 
} 
//运行结果 1 2 4 5
```

2：**erase(first, last)**即删除**[first, last）**内的所有元素：

```c++
#include<bits/stdc++.h>
using namespace std;
int main(){
	vector<int> v;
	for(int i = 1; i <= 5; i++){
		v.push_back(i);	//将1、2、3、4、5 依次插入v的队尾 
	}
	v.erase(v.begin() + 1, v.begin() + 3);	//删除2和3 
	for(vector<int>::iterator it = v.begin(); it != v.end(); it++){
		cout << *it << " ";
	}
	
	return 0; 
} 

//输出结果 1 4 5
```







## unique 去重   [http://t.csdnimg.cn/rEFrD](http://t.csdnimg.cn/rEFrD)

### 作用：

1. 函数作用：“去除”容器或数组中**相邻元素**之间重复出现的元素（所以一般使用前需要排序）。
2. 函数参数：第一个参数是集合的起始地址，第二个参数是集合的最后一个元素的下一个元素的地址（其实还有第三个参数，比较函数，但是几乎不用，就不说了，其实和sort函数很像）。

```c++
#include <iostream>
#include <algorithm>
int main(void){
    int a[8] = {2, 2, 2, 4, 4, 6, 7, 8};
    int c;
    std::sort(a, a + 8);  //对于无序的数组需要先排序
    c = (std::unique(a, a + 8) - a );
    std::cout<< "c = " << c << std::endl;//去重函数返回地址为：去重后最后一个不重复元素地址
    //打印去重后的数组成员
    for (int i = 0; i < c; i++)
        std::cout<< "a = [" << i << "] = " << a[i] << std::endl;
    return 0;
}
//运行结果：c=5
//a数组前五项：2 4 6 7 8
```

vector容器去重

```c++
std::vector<int> ModuleArr;
//排序
std::sort(ModuleArr.begin(), ModuleArr.end());
//去重
ModuleArr.erase(unique(ModuleArr.begin(), ModuleArr.end()), ModuleArr.end());

```







## stack  栈 [http://t.csdnimg.cn/6tBNd](http://t.csdnimg.cn/6tBNd)

stack的中文译为堆栈，堆栈一种数据结构。C语言中堆栈的定义及初始化以及一些相关操作实现起来较为繁琐，而C++的stack让这些都变得简便易实现。因为C++中有许多关于stack的方法函数。
堆栈（stack）最大的特点就是先进后出（后进先出）。就是说先放入stack容器的元素一定要先等比它后进入的元素出去后它才能出去。

### stack  初始化

```c++
//stack的定义 
stack<int>s1; //定义一个储存数据类型为int的stack容器s1 
stack<double>s2; //定义一个储存数据类型为double的stack容器s2
stack<string>s3; //定义一个储存数据类型为string的stack容器s3
stack<结构体类型>s4; //定义一个储存数据类型为结构体类型的stack容器s4
stack<int> s5[N]; //定义一个储存数据类型为int的stack容器数组,N为大小 
stack<int> s6[N]; //定义一个储存数据类型为int的stack容器数组,N为大小 
```

### stack 常用函数

```c++
empty() //判断堆栈是否为空
pop() //弹出堆栈顶部的元素
push() //向堆栈顶部添加元素
size() //返回堆栈中元素的个数
top() //返回堆栈顶部的元素 
```

```c++
#include<iostream>
#include<stack>
using namespace std;
int main()
{
	stack<int> s; //定义一个数据类型为int的stack 
	s.push(1); //向堆栈中压入元素1 
	s.push(2); //向堆栈中压入元素2
	s.push(3); //向堆栈中压入元素3
	s.push(4); //向堆栈中压入元素4
	cout<<"将元素1、2、3、4一一压入堆栈中后，堆栈中现在的元素为：1、2、3、4"<<endl;
	cout<<"堆栈中的元素个数为："<<s.size()<<endl;
	//判断堆栈是否为空 
	if(s.empty())
	{
		cout<<"堆栈为空"<<endl;
	}
	else
	{
		cout<<"堆栈不为空"<<endl;
	}
	cout<<"堆栈的最顶部元素为："<<s.top()<<endl;
	//弹出堆栈最顶部的那个元素 
	s.pop();
	cout<<"将堆栈最顶部元素弹出后，现在堆栈中的元素为1、2、3"<<endl;
		
}
/*
将元素1、2、3、4一一压入堆栈中后，堆栈中现在的元素为：1、2、3、4
堆栈中的元素个数为：4
堆栈不为空
堆栈的最顶部元素为：4
将堆栈最顶部元素弹出后，现在堆栈中的元素为1、2、3
*/
```

### stack 遍历方法

**堆栈中的数据是不允许随机访问的，也就是说不能通过下标访问，且堆栈内的元素是无法遍历的。**

我们可以通过while循环的方法将stack中的元素读取一遍，但是这种方法非常局限，因为我们每读取一个元素就需要弹出这个元素，因此该方法只能读取一遍stack中的元素

```c++
#include<iostream>
#include<stack>
using namespace std;
int main()
{
	stack<int> s; //定义一个数据类型为int的stack 
	s.push(1); //向堆栈中压入元素1 
	s.push(2); //向堆栈中压入元素2
	s.push(3); //向堆栈中压入元素3
	s.push(4); //向堆栈中压入元素4
	while(!s.empty())
	{
		cout<<s.top()<<" ";
		s.pop();
	}	
}

```

## queue 队列  [http://t.csdnimg.cn/4bHQ2](http://t.csdnimg.cn/4bHQ2)

queue是一种容器转换器模板，调用#include< queue>即可使用队列类。

### queue初始化

queue<Type, [Container](https://so.csdn.net/so/search?q=Container&spm=1001.2101.3001.7020)> (<数据类型，容器类型>）

```c++
queue<int>q1;
queue<double>q2;  
queue<char>q3；
//默认为用deque容器实现的queue；
```

### queue 常用函数

```C++
push() //在队尾插入一个元素
pop() //删除队列第一个元素
size() //返回队列中元素个数
empty() //如果队列空则返回true
front() //返回队列中的第一个元素
back() //返回队列中最后一个元素
```







## priority_queue 优先队列  [http://t.csdnimg.cn/DbCMy](http://t.csdnimg.cn/DbCMy)

**优先队列是一种特殊的队列，其中的元素按照一定的优先级进行排序，每次取出的元素都是优先级最高的**。它的底层实现通常使用堆（heap）数据结构。

### priority_queue初始化

```c++
priority_queue<int, std::vector<int>, std::less<int>> pq;
```



### priority_queue常用函数

```c++
push(x); //将函数x插入到优先队列当中
pop(); //弹出优先队列中顶部的元素
top();//返回优先队列中的顶部元素
empty();//检查优先队列是否为空
size();//返回优先队列中元素的个数
```

### priority_queue 修改比较函数

```c++
struct compare{
    bool operator()(int a,int b){//自定义比较
        return a>b;
    }
}

int main()
{
    priority_queue<int, vector<int>,compare> pq;
}
```

```c++
auto compare=[](int a,int b){//自定义比较函数
    return a>b;
    
};

priority_queue<int,vector<int>,decltype(compare)> pq(compare);
```

```c++
priority_queue<int vector<int>,greater<T>> pq;//默认是less<T>
```







## deque双端队列  [http://t.csdnimg.cn/fOBRY](http://t.csdnimg.cn/fOBRY)

双端队列，是一种在两端均可以扩展或者收缩的序列化容器。
deque可以在头部和尾部进行插入和删除操作。

### deque迭代器

deque.begin()：指向deque首元素的迭代器
deque.end()：指向deque尾元素下一个位置的迭代器
deque.rbegin()：指向deque尾元素的反向迭代器，即rbegin()指向尾元素，rbegin-1指向倒数第二个元素
deque.rend()：指向deque头元素前一个位置的反向迭代器，即rend()指向头元素前一个位置元素，rbegin-1指向第一个元素
deque.cbegin()：指向deque首元素的迭代器，与begin()相同，只不过增加了const属性，不能用于修改元素。
deque.cend()：指向deque尾元素下一个位置的迭代器，与end()相同，只不过增加了const属性，不能用于修改元素。
deque.crbegin()：指向deque尾元素的反向迭代器，与rbegin()相同，只不过增加了const属性，不能用于修改元素。
deque.crend()：指向deque头元素前一个位置的反向迭代器，与rend()相同，只不过增加了const属性，不能用于修改元素。

```c++
#include <deque>
#include <iostream>

using std::cout;
using std::deque;
using std::endl;

int main() {
    deque<int> test = {1, 2, 3, 4};
    cout << "初始化后deque为： ";
    for (auto num : test) {
        cout << num << " ";
    }
    cout << endl;

    // deque.begin()为指向deque头元素的迭代器
    deque<int>::iterator begin_iterator = test.begin();
    cout << "begin() 指向的元素：" << *begin_iterator << endl;

    // deque.end()为指向deque尾元素后一个位置的迭代器，则test.end()-1指向尾元素
    auto end_iterator = test.end();
    cout << "end()-1 指向的元素：" << *(end_iterator - 1) << endl;

    // deque.rbegin()为指向尾元素的迭代器，即反向(r)的头(begin)迭代器
    auto rbegin_iterator = test.rbegin();
    cout << "rbegin() 指向的元素：" << *rbegin_iterator << endl;

    // deque.rend()为指向头元素的前一个位置的迭代器，即反向(r)尾(end)迭代器，则test.rend()-1指向头元素
    auto rend_iterator = test.rend();
    cout << "rend()-1 指向的元素：" << *(rend_iterator - 1) << endl;

    // deque.cbegin()为指向deque头元素的const迭代器
    // 与begin()不同的是返回迭代器类型为deque<int>::const_iterator，不可修改元素
    deque<int>::const_iterator cbegin_iterator = test.cbegin();
    cout << "cbegin() 指向的元素：" << *cbegin_iterator << endl;

    // deque.cend()为指向deque尾元素下一个位置的const迭代器
    // 与end()不同的是返回迭代器类型为deque<int>::const_iterator，不可修改元素
    deque<int>::const_iterator cend_iterator = test.cend();
    cout << "cend()-1 指向的元素：" << *(cend_iterator - 1) << endl;

    // deque.crbegin()为指向尾元素的const迭代器，即反向(r)的const(c)头(begin)迭代器
    auto crbegin_iterator = test.crbegin();
    cout << "crbegin() 指向的元素： " << *crbegin_iterator << endl;

    // deque.crend()为指向头元素下一个位置的const迭代器，即反向(r)的const(c)尾(end)迭代器
    auto crend_iterator = test.crend();
    cout << "crend()-1 指向的元素： " << *(crend_iterator - 1) << endl;

    return 0;
}
/*输出
初始化后deque为： 1 2 3 4
begin() 指向的元素：1
end()-1 指向的元素：4
rbegin() 指向的元素：4
rend()-1 指向的元素：1
cbegin() 指向的元素：1
cend()-1 指向的元素：4
crbegin() 指向的元素： 4
crend()-1 指向的元素： 1
*/
```

### deque 成员函数

```C++
push_back(x);//在尾部插入元素x
push_front(x);//在头部插入元素x
pop_back();//弹出尾部元素
pop_front();//弹出头部元素
front();//返回头部元素
back();//返回尾部元素
empty();//检查deque 是否为空
size();//返回deque中元素的个数
clear();//清空deque中的所有元素
insert(pos,x);//在指定位置pos插入元素x
erase(pos);//移除指定位置pos处的元素
erase(first,last);//移除[first,last)范围内的元素
```







## set 容器    [http://t.csdnimg.cn/baAnd](http://t.csdnimg.cn/baAnd)

`set` 是一个有序容器，它会根据元素的键值对元素进行排序（默认按升序），并且不允许有重复的元素。其内部基于红黑树这种自平衡二叉搜索树实现。
- **场景**：
    - **需要有序数据**：当你需要对数据进行排序，并且在插入和删除操作后依然保持有序状态时，`set` 是一个不错的选择。例如，你要对一系列整数进行排序，并且保证每个整数只出现一次。
    - **元素查找**：由于 `set` 是有序的，查找操作的时间复杂度为 \(O(log n)\)。在需要频繁查找元素是否存在的场景下，`set` 很合适。
    - **去重**：如果你有一组数据，需要去除其中的重复元素，同时保持元素的有序性，`set` 可以自动完成去重工作。

```c++
//常用函数（必学）
insert()//插入元素
count()//判断容器中是否存在某个元素
size()//返回容器的尺寸，也可以元素的个数
erase()//删除集合中某个元素
clear()//清空集合
empty()//判断是否为空
begin()//返回第一个节点的迭代器
end()//返回最后一个节点加1的迭代器
rbegin()//反向迭代器
rend()//反向迭代器

//功能函数（进阶）
find()//查找某个指定元素的迭代器
lower_bound()//二分查找第一个不小于某个值的元素的迭代器
get_allocator()//返回集合的分配器
swap()//交换两个集合的变量
max_size()//返回集合能容纳元素的最大限值

```

### set迭代器遍历

```c++
#include<iostream>
#include<set>
using namespace std;
int main(){
	set<int> s;//定义 
	s.insert(1);//插入元素1 
	s.insert(3);//插入元素3
	s.insert(2);//插入元素2
	set<int>::iterator it;//使用迭代器
	for(it=s.begin();it!=s.end();it++){
		cout<<*it<<' ';
	} 
} 
//运行结果 1 2 3
```

```c++
#include<iostream>
#include<set>
using namespace std;
int main(){
	set<int> s;//定义 
	s.insert(1);//插入元素1 
	s.insert(3);//插入元素3
	s.insert(2);//插入元素2
	set<int>::reverse_iterator it;//使用反向迭代器
	for(it=s.rbegin();it!=s.rend();it++){
		cout<<*it<<' ';
	} 
} 
//运行结果 3 2 1
```

### foreach遍历

```c++
#include<iostream>
#include<set>
using namespace std;
int main(){
	set<int> s;//定义 
	s.insert(1);//插入元素1 
	s.insert(3);//插入元素3
	s.insert(2);//插入元素2
	for(auto it:s){
		cout<<it<<' ';
	} 
} 
//运行结果 1 2 3
```

### set自定义去重规则

```C++
struct cmp {
    bool operator()(const int& a, const int& b) const {
        if (abs(a - b) <= k)
            return false;
        return a < b;
    }
};

set<int, cmp> st;
```





## multiset   [http://t.csdnimg.cn/L9ahQ](http://t.csdnimg.cn/L9ahQ)

`multiset` 同样是有序容器，基于红黑树实现，不过它允许存储重复的元素。

- **场景**：
    - **允许重复元素的排序集合**：当你需要对数据进行排序，同时又允许元素重复时，`multiset` 就派上用场了。例如，统计某个班级学生的考试成绩，可能会有多个学生取得相同的分数。
    - **计数和统计**：由于 `multiset` 可以存储重复元素，你可以方便地统计某个元素出现的次数。

### multiset成员函数

```c++
s.begin()	//返回set容器的第一个元素的地址（迭代器）
s.end()	//返回set容器的最后一个元素的地址（迭代器）
s.rbegin()	//返回逆序迭代器，指向容器元素最后一个位置
s.rend()	//返回逆序迭代器，指向容器第一个元素前面的位置
s.clear()	//删除set容器中的所有的元素,返回unsigned int类型O ( N ) O(N)O(N)
s.empty()	//判断set容器是否为空
s.insert()	//插入一个元素 O ( N l o g N ) O(NlogN)O(NlogN)
s.size()	//返回当前set容器中的元素个数O ( 1 ) O(1)O(1)
erase(iterator)	//删除定位器iterator指向的值
erase(first,second）	//删除定位器first和second之间的值
erase(key_value)	//删除键值key_value的值O ( N l o g N ) O(NlogN)O(NlogN)
查找	
s.find(元素)	//查找set中的某一元素，有则返回该元素对应的迭代器，无则返回结束迭代器
s.lower_bound(k)	//返回大于等于k的第一个元素的迭代器
s.upper_bound(k)	//返回大于k的第一个元素的迭代器
```

### multiset遍历

```c++
for(multiset<int>::iterator it = s.begin(); it != s.end(); it++)
	cout << *it << " ";
```

```c++
for(auto i : s)
	cout << i << endl;
```

### multiset自定义排序

```c++
//重载 < 运算符
struct cmp {
    bool operator () (const int& u, const int& v) const {
       // return 返回条件
        return u > v;//按降序排列
    }
};
multiset<int, cmp> se;
```







## unordered_set 无序集合 [http://t.csdnimg.cn/fjbpf](http://t.csdnimg.cn/fjbpf)

`unordered_set` 是一个无序容器，它基于哈希表实现，元素的存储是无序的，但不允许重复元素。

- **场景**：
    - **快速查找**：`unordered_set` 的查找操作平均时间复杂度为 \(O(1)\)，因此在需要快速判断某个元素是否存在的场景下，`unordered_set` 比 `set` 更高效。例如，在一个大规模的数据集中查找某个特定元素。
    - **无需排序**：当你只关心元素的存在性，而不关心元素的顺序时，`unordered_set` 是更好的选择。比如，判断一个单词是否在一个词典中。


### 初始化

```C++
unordered_set<int> set1;
```

### unordered_set 常用成员函数
#### 1. 迭代器相关函数

- **`begin()`**：返回指向容器起始位置的迭代器。
- **`end()`**：返回指向容器末尾位置的迭代器。
- **`cbegin()`**：返回指向容器起始位置的常量迭代器。
- **`cend()`**：返回指向容器末尾位置的常量迭代器。

#### 2. 容量相关函数

- **`empty()`**：检查容器是否为空，若为空则返回 `true`，否则返回 `false`。
- **`size()`**：返回容器中元素的数量。
- **`max_size()`**：返回容器可容纳的最大元素数量。

#### 3. 元素访问和修改函数

- **`insert()`**：向容器中插入元素。如果元素已经存在，则不插入。
- **`erase()`**：从容器中移除指定元素。
- **`clear()`**：清空容器中的所有元素。
- **`swap()`**：交换两个 `unordered_set` 容器的内容。

#### 4. 查找相关函数

- **`find()`**：查找指定元素，若找到则返回指向该元素的迭代器，若未找到则返回 `end()` 迭代器。
- **`count()`**：返回容器中指定元素的数量，由于 `unordered_set` 中元素唯一，因此返回值只能是 0 或 1。

#### 5. 哈希策略相关函数

- **`bucket_count()`**：返回容器中桶的数量。
- **`load_factor()`**：返回容器的负载因子，即元素数量与桶数量的比值。
- **`rehash()`**：设置桶的数量，并重新哈希容器中的所有元素。




## map     [http://t.csdnimg.cn/EWmt5](http://t.csdnimg.cn/EWmt5)

`map` 是有序关联容器，它基于红黑树（一种自平衡二叉搜索树）实现。在 `map` 中，键是唯一的，并且元素会按照键的大小进行排序（默认是升序）。

- **场景**：
    - **需要有序键值对**：当你需要根据键的顺序来访问元素，或者需要在插入、删除元素后保持键值对的有序性时，`map` 是很好的选择。例如，实现一个字典，按照字母顺序存储单词及其释义。
    - **频繁查找与范围查找**：由于 `map` 是有序的，查找操作的时间复杂度为 \(O(log n)\)，同时也支持范围查找。比如，你要查找字典中以某个字母开头的所有单词。
    - **键的唯一性**：如果需要确保每个键只出现一次，`map` 会自动处理重复键的情况，新插入的键值对会覆盖已存在的相同键的键值对。

- 第一个可以称为关键字(key)，每个关键字只能在map中出现一次；键值对中每个键是唯一的
- 第二个可称为该关键字的值(value)；
- 默认按照key升序排序


### map初始化

```C++
map<int, string> mapStudent;
```

### map常用成员函数

```C++
	 begin()         //返回指向map头部的迭代器
     clear(）        //删除所有元素
     count()         //返回指定元素出现的次数, (帮助评论区理解： 因为key值不会重复，所以只能是1 or 0)
     empty()         //如果map为空则返回true
     end()           //返回指向map末尾的迭代器
     equal_range()   //返回特殊条目的迭代器对
     erase()         //删除一个元素
     find()         //查找一个元素
     get_allocator() //返回map的配置器
     insert()       // 插入元素
     key_comp()      //返回比较元素key的函数
     lower_bound()   //返回键值>=给定元素的第一个位置
     max_size()      //返回可以容纳的最大元素个数
     rbegin()        //返回一个指向map尾部的逆向迭代器
     rend()         // 返回一个指向map头部的逆向迭代器
     size()          //返回map中元素的个数
     swap()         // 交换两个map
     upper_bound()    //返回键值>给定元素的第一个位置
     value_comp()     //返回比较元素value的函数
```

### map结合vector使用   习题：[https://www.lanqiao.cn/problems/1531/learning/](https://www.lanqiao.cn/problems/1531/learning/)



```C++
#include<iostream>
#include<map>
#include<vector>
using namespace std;
int main()
{
    int n;
    cin >> n;
    map<string, vector<string>> mp;
    vector<string> city;
    for (int i = 0;i < n;i++)
    {
        string s1, s2;
        cin >> s1 >> s2;
        if (!mp.count(s2))city.push_back(s2);
        mp[s2].push_back(s1);
    }
    int len = mp.size();
    for (int i = 0;i < len;i++)
    {
        cout << city[i]<<" "<<mp[city[i]].size()<<endl;
        for (string i : mp[city[i]])
        {
            cout << i << endl;
        }
    }
    return 0;
}
```





## multimap   [http://t.csdnimg.cn/7SG4i](http://t.csdnimg.cn/7SG4i)

`multimap` 同样是有序关联容器，基于红黑树实现，但它允许键重复。也就是说，一个键可以对应多个值。

- **场景**：
    - **允许重复键的有序映射**：当你需要存储多个值与同一个键关联，并且希望这些键值对按照键的顺序排列时，`multimap` 就派上用场了。例如，统计学生的成绩，一个学生可能有多门课程的成绩。
    - **分组与排序**：可以根据键对元素进行分组，并且每个组内的元素会按照键的顺序排列。比如，将员工按照部门进行分组，每个部门下有多个员工。
multimap允许储存具有相同键的键值对（一个key能有多个value）

默认按键的升序进行排列

### multimap初始化

```C++
std::multimap <std::K, std::T> multimapname;
```

### multimap常用成员函数

```C++
empty()		若容器为空，则返回true，否则返回false。
size()		返回当前multimap容器中键值对的个数。
max_size()	返回multimap容器所能容纳的键值对的最大个数，不同的操作系统，其返回值亦不同。
count(key)	在当前multimap容器中，查找键为key的键值对的个数并返回。
begin()	返回指向容器中第一个（已排好序的第一个）键值对的双向迭代器。
end()	返回指向容器中最后一个元素（已排好序的最后一个）所在位置的后一个位置的双向迭代器。
rbegin()	返回指向容器中最后一个（已排好序的最后一个）元素的反向双向迭代器。
rend()	返回指向容器中第一个（已排好序的第一个）元素所在位置的前一个位置的反向双向迭代器。
cbegin()	和begin()功能相同，只不过在其基础上，增加了const属性，不能用于修改容器内储存的键值对。
cend()	和end()功能相同，只不过在其基础上，增加了const属性，不能用于修改容器内储存的键值对。
crbegin()	和rbegin()功能相同，只不过在其基础上，增加了const属性，不能用于修改容器内储存的键值对。
crend()	和rend()功能相同，只不过在其基础上，增加了const属性，不能用于修改容器内储存的键值对。
find(key)	在map容器中查找键为key的键值对，若成功找到，则返回指向该键值对的双向迭代器；若未找到，则返回和end()方法一样的迭代器。
lower_bound(key)	返回一个指向当前map容器中第一个大于或等于key的键值对的双向迭代器。
upper_bound(key)	返回一个指向当前map容器中第一个大于key的键值对的双向迭代器。
equal_range(key)	返回一个pair对象（包含2个双向迭代器），其中pair.first和lower_bound()方法的返回值等价，pair.second和upper_bound()方法的返回值等价。也就是说，该方法将返回一个范围，该范围中包含的键为key的键值对（map容器键值对唯一，因此该返回最多包含一个键值对）。
insert()	向multimap容器中插入键值对。
emplace()	在当前multimap容器中的指定位置处构造新键值对。其效果和插入键值对一样，但效率更高。
emplace_hint()	在本质上和emplace()在multimap容器中构造新键值对的方式是一样的，不同之处在于，必须为该方法提供一个指示键值对
erase()	删除multimap容器指定位置、指定键（key)值或者指定区域内的键值对。
clear()	清空multimap容器中的所有键值对。
swap()	交换2个multimap容器中存储的键值对，操作的2个键值对的类型必须相同。
```

### 自定义排序

```C++
struct cmp{
    bool operator()(const string& a,const string& b)const{
        return stoi(a)<stoi(b);
    }
};
multimap<string,int,cmp> mp;
mp={{"100",1},{"99",2}};
//set,map同理
```





## unordered_map
`unordered_map` 是无序关联容器，它基于哈希表实现。键是唯一的，但元素的存储是无序的。
- **场景**：
    - **快速查找**：`unordered_map` 的查找操作平均时间复杂度为 \(O(1)\)，因此在需要快速根据键查找对应值的场景下，`unordered_map` 比 `map` 更高效。例如，在一个大规模的数据集中查找某个特定键对应的值。
    - **无需排序**：当你只关心键值对的存在性和快速访问，而不关心元素的顺序时，`unordered_map` 是更好的选择。比如，实现一个缓存系统，快速根据键获取缓存的值。

unordered_map则适合用于需要快速查找元素的情况下，例如查找是否存在某个[键值对](https://so.csdn.net/so/search?q=键值对&spm=1001.2101.3001.7020)、统计某个值出现的次数

不保证元素的顺序

一对一
#### 迭代器相关函数

- **`begin()`**：返回指向容器中第一个元素的迭代器。
- **`end()`**：返回指向容器末尾（即最后一个元素之后的位置）的迭代器。
- **`cbegin()`**：返回指向容器中第一个元素的常量迭代器，不能用于修改元素。
- **`cend()`**：返回指向容器末尾的常量迭代器。

#### 容量相关函数

- **`empty()`**：检查容器是否为空，若为空返回 `true`，否则返回 `false`。
- **`size()`**：返回容器中元素的数量。
- **`max_size()`**：返回容器可容纳的最大元素数量。

#### 元素访问和修改函数

- **`operator[]`**：通过键访问或插入元素。如果键不存在，则会插入一个默认构造的值。
- **`at()`**：通过键访问元素，如果键不存在，会抛出 `std::out_of_range` 异常。
- **`insert()`**：插入键 - 值对。可以插入单个元素、多个元素或通过迭代器范围插入。
- **`emplace()`**：原位构造并插入元素，避免不必要的拷贝或移动操作。
- **`erase()`**：移除指定位置的元素、指定键的元素或指定迭代器范围的元素。
- **`clear()`**：清空容器中的所有元素。
- **`swap()`**：交换两个 `unordered_map` 容器的内容。

#### 查找相关函数

- **`find()`**：查找具有指定键的元素，如果找到则返回指向该元素的迭代器，否则返回 `end()` 迭代器。
- **`count()`**：返回具有指定键的元素数量，由于 `unordered_map` 中键是唯一的，所以返回值只能是 0 或 1。

#### 哈希策略相关函数

- **`bucket_count()`**：返回容器中桶的数量。
- **`load_factor()`**：返回容器的负载因子，即元素数量与桶数量的比值。
- **`rehash()`**：设置桶的数量，并重新哈希容器中的所有元素。



## stringstream

https://xas-sunny.blog.csdn.net/article/details/136921743?fromshare=blogdetail&sharetype=blogdetail&sharerId=136921743&sharerefer=PC&sharesource=2301_80155689&sharefrom=from_link

```C++
    // 创建一个 string类  对象 s
	string s("hello stringstream");
	// 创建一个 stringstraeam类 对象 ss
	stringstream ss;
 
	// 向对象输入字符串 : "<<" 表示向一个对象中输入
	ss << s;
	cout << ss.str() << endl;

    // 创建一个 stringstraeam类 对象 ss
	stringstream ss("hello stringstream");
 
	cout << ss.str() << endl;
```

```c++
#include <iostream>
#include <sstream>
using namespace std;
 
int main()
{
    stringstream ss1;
    ss1 << "fre";
    ss1 << "gre";
    cout << ss1.str() << endl;
    
    return 0;
}
 
/*
输出：
fregre
*/
```

```C++
#include <sstream>
#include <iostream>
#include <string>
 
int main() {
    int num = 123;
    std::stringstream ss;
    ss << num; // 将整数放入流中
    std::string str = ss.str(); // 使用str()函数 从流中提取字符串
    std::cout << str << std::endl; // 输出：123
}
```

