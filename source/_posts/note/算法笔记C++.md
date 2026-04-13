---
title: 算法笔记C++
date: 2025-04-11 16:49:42
updated: 2026-03-31 10:06:14
categories:
  - Wiki
tags:
  - 笔记
wiki: true
top_img: false
permalink: 'wiki/algorithms-cpp-notes/'
---
# 算法笔记

## 算法基础

### 二分

#### 整数二分

//在一个单调区间里面去找答案

```C++
bool check(int x) {/* ... */} // 检查x是否满足某种性质
// 区间[l, r]被划分成[l, mid]和[mid + 1, r]时使用：
int bsearch_1(int l, int r)//适用于目标值确定在数组中存在，且需要精确找到目标值位置的场景
 {
    while (l < r)
    {
        int mid = l + r >> 1;
        if (check(mid)) r = mid;    // check()判断mid是否满足性质
        else l = mid + 1;//左加右减
    }
    return l;
 }
 // 区间[l, r]被划分成[l, mid - 1]和[mid, r]时使用：
int bsearch_2(int l, int r)//适用于目标值确定在数组中存在，且需要精确找到目标值位置的场景
 {
    while (l < r)
    {
        int mid = l + r + 1 >> 1;//如果下方else后面是l则这里加1
        if (check(mid)) l = mid;
        else r = mid - 1;//左加右减
    }
    return l;
 }
int bsearch_3(int l,int r){//专门用于解决在一个范围内寻找最值（最大值或最小值）的问题
	while (l <= r) {
		int mid = l + r >> 1;
		if (check(mid)) r = mid - 1; // 尝试找更小的值
		else l = mid + 1; // 如果不满足条件，向右移动
	}
return l;
}
//上面是yxc模板，下面是灵神模板
 int lower_bound(vector<int>& nums, int target) {
        int left = -1, right = nums.size(); // 开区间 (left, right)
        while (left + 1 < right) { // 区间不为空
            // 循环不变量：
            // nums[left] < target
            // nums[right] >= target
            int mid = left + (right - left) / 2;
            if (nums[mid] >= target) {//返回目标在数组中的第一个位置，如果目标在数组元素范围内但不存在数组中，则返回第一个比目标元素大的位置，改成>就是返回目标最后一个位置+1
                right = mid; // 范围缩小到 (left, mid)
            } else {
                left = mid; // 范围缩小到 (mid, right)
            }
        }
        // 循环结束后 left+1 = right
        // 此时 nums[left] < target 而 nums[right] >= target
        // 所以 right 就是第一个 >= target 的元素下标
        return right;
    }
 
```

#### 浮点数二分

```c++
bool check(double x) {/* ... */} // 检查x是否满足某种性质
double bsearch_3(double l, double r)
 {
    const double eps = 1e-6;   // eps 表示精度，取决于题目对精度的要求
    while (r - l > eps)
    {
        double mid = l + r >> 2;
        if (check(mid)) r = mid;
        else l = mid;
    }
    return l;
 }
```



### 高精度

#### 高精度比大小

```C++
bool cmp(vector<int> &A, vector<int> &B)
{//A>=B
    if (A.size() != B.size())return A.size() >= B.size();//先比长度
    for (int i = A.size() - 1; i >= 0; i--)
	    {
        if (A[i] != B[i])return A[i] >= B[i];//比数值
    }
    return true;//都满足的话就一样大
}
```



#### 高精度加法

```C++
#include<iostream>
#include<vector>
using namespace std;
vector<int> add(vector<int> &A, vector<int> &B)
{//这里加引用是为了提高效率，不加引用会把整个数组copy一遍，加上引用就不会copy整个数组，就会快很多
    vector<int> C;
    int t=0;
    for (int i = 0; i < A.size() || i < B.size(); i++)
    {
        if (i<A.size())t += A[i]; //不超过a的范围添加a[i]
        if (i<B.size())t += B[i]; //不超过b的范围添加b[i]
        C.push_back(t % 10);//取当前位的答案
        t /= 10;//是否进位
    }
    if (t)C.push_back(1);//如果t!=0的话向后添加1
    return C;
}
```

#### 高精度减法

```C++
bool cmp(vector<int> &A,vector<int> &B)
{//比大小，A>=B
    if(A.size()!=B.size())
        return A.size()>=B.size(); 
    for(int i=A.size()-1;i>=0;i--)
    {
        if(A[i]!=B[i])return A[i]>B[i];
    }
    return true;
}

vector<int> sub(vector<int> &A,vector<int> &B)
{
   vector<int> C;
   int t=0;//进位
   for(int i=0;i<A.size();i++)
   {
        t=A[i]-t;//t=A[i]-B[i]-t
        if(i<B.size())t-=B[i];
        C.push_back((t+10)%10);//t>=0时和t<0时取个位
        if(t<0)t=1;
        else t=0;
   }
    while(C.size()>1&&C.back()==0)C.pop_back();//去除前导0
    return C;
}
```



#### 高精度乘法（高X低)

```C++
vector<int> mul(vector<int>& A, long long b)
{
    //类似于高精度加法
    vector<int> C;
    //t为进位
    long long t = 0;
    for (int i = 0; i < A.size() || t; i++)
    {
        //不超过A的范围t=t+A[i]*b
        if (i < A.size()) t += A[i] * b;
        //取当前位的答案
        C.push_back(t % 10);
        //进位
        t /= 10;
    }
    //去除前导零
    while (C.size() > 1 && C.back() == 0) C.pop_back();
    return C;
}
```

#### 高精度乘法（高X高)

```c++
vector<int> mul(vector<int> &A, vector<int> &B) {
    // 创建结果向量 C，初始大小为 A 的大小加上 B 的大小，用于存储乘法结果
    vector<int> C(A.size() + B.size()); 
    // 模拟两个整数的乘法运算，逐位相乘并累加结果
    for (int i = 0; i < A.size(); i++) {
        for (int j = 0; j < B.size(); j++) {
            C[i + j] += A[i] * B[j];
        }
    }
    // 处理进位，将结果向量 C 中的每一位进行进位调整
    for (int i = 0, t = 0; i < C.size(); i++) {
        t += C[i];
        C[i] = t % 10;
        t /= 10;
    }
    // 去除结果向量 C 中的前导零
    while (C.size() > 1 && C.back() == 0) C.pop_back(); 
    return C; 
}
```

#### 高精度除法（高/低）

```C++
vector<int> div(vector<int> &A, int b, long long &r) {
    // 存储商的结果
    vector<int> C;
    // 将余数初始化为 0
    r = 0;
    // 从 A 的最高位开始遍历
    for (int i = A.size() - 1; i >= 0; i--) {
        // 将当前位的数字和余数结合起来
        r = r * 10 + A[i];
        // 计算当前位的商并添加到结果向量 C 中
        C.push_back(r / b);
        // 更新余数为取模后的结果
        r %= b;
    }
    // 将结果向量 C 反转，使其变为正确的顺序
    reverse(C.begin(), C.end());
    // 如果结果向量 C 长度大于 1 且最后一位为 0，则不断弹出最后一位直到不满足条件
    while (C.size() > 1 && C.back() == 0) C.pop_back();
    // 返回商的结果向量
    return C;
}
```



### 前缀和    

 [【算法笔记】前缀和与差分_前缀和差分-CSDN博客](https://blog.csdn.net/qq_39757593/article/details/129219491)

#### 一维前缀和

```C++
   	//预处理:s[i]=a[i]+a[i-1]
	//求区间[l,r]:sum=s[r]-s[l-1]
 	//"前缀和数组"和"原数组"可以合二为一
#include <iostream>
using namespace std;
const int N=100010;
 int a[N];
 int main(){
    int n,m;
    cin>>n>>m;
    for(int i=1;i<=n;i++)
    {
        cin>>a[i];
        a[i]=a[i-1]+a[i];
    }
    while(m--){
        int l,r;
        cin>>l>>r;
        cout<<a[r]-a[l-1]<<'\n';
    }
    return 0;
 }
```

#### 二维前缀和
```c++
//计算矩阵的前缀和：s[x][y] = s[x - 1][y] + s[x][y -1] - s[x-1][y-1] + a[x][y]
```

![[Pasted image 20250320190157.png]]

```C++
//计算子矩阵的和：s = s[x2][y2] - s[x1 - 1][y2] - s[x2][y1 - 1] + s[x1 - 1][y1 -1]
```

![[Pasted image 20250320190150.png]]

```C++
//计算矩阵的前缀和：s[x][y] = s[x - 1][y] + s[x][y -1] - s[x-1][y-1] + a[x][y]
//以(x1, y1)为左上角，(x2, y2)为右下角的子矩阵的和为：
//计算子矩阵的和：s = s[x2][y2] - s[x1 - 1][y2] - s[x2][y1 - 1] + s[x1 - 1][y1 -1]
int s[1010][1010];
int n,m,q;
int main(){
    scanf("%d%d%d",&n,&m,&q);
    for(int i=1;i<=n;i++)
        for(int j=1;j<=m;j++)
            scanf("%d",&s[i][j]);
    for(int i=1;i<=n;i++)
        for(int j=1;j<=m;j++)
            s[i][j]+=s[i-1][j]+s[i][j-1]-s[i-1][j-1];
    while(q--){
        int x1,y1,x2,y2;
        scanf("%d%d%d%d",&x1,&y1,&x2,&y2);
        printf("%d\n",s[x2][y2]-s[x2][y1-1]-s[x1-1][y2]+s[x1-1][y1-1]);
    }
    return 0;
 }
```

### 差分

#### 一维差分

```C++
//给区间[l, r]中的每个数加上c：B[l] += c, B[r + 1] -= c
int a[100010],s[100010];
 int main(){
    int n,m;
    cin>>n>>m;
    for(int i=1;i<=n;i++)
    {
        cin>>a[i];   // 读入并计算差分数组
        s[i]=a[i]-a[i-1]; 
    }
    while(m--){
        int l,r,c;
        cin>>l>>r>>c;
        s[l]+=c;
        s[r+1]-=c;// 在原数组中将区间[l, r]加上c
    }
    for(int i=1;i<=n;i++){
        s[i]+=s[i-1];
        cout<<s[i]<<' ';
    }// 给差分数组计算前缀和，就求出了原数组
    return 0;
 }
```

#### 二维差分

二维差分用于在一个矩阵里，快速里把矩阵的一个子矩阵加上一个固定的数。也是直接来修改差分矩阵。试想只要在差分矩阵的( x 1 , y 1 ) 位置加上c，那么以它为左上角，所有后面的元素就都加上了c。要让( x 2 , y 2 ) 的右边和下边的元素不受影响，由容斥原理可以知道，只要在( x 2 + 1 , y 1 ) 和( x 1 , y 2 + 1 ) 位置减去c，再从( x 2 + 1 , y 2 + 1 ) 位置加回c就可以了。

![[Pasted image 20250320190138.png]]

```c++
//给以(x1, y1)为左上角，(x2, y2)为右下角的子矩阵中的所有元素加上c：
//S[x1, y1] += c, S[x2 + 1, y1] -= c, S[x1, y2 + 1] -= c, S[x2 + 1, y2 + 1] += c
const int N = 1e3 + 10;
 int a[N][N], b[N][N];
 void insert(int x1, int y1, int x2, int y2, int c)
 {
    b[x1][y1] += c;
    b[x2 + 1][y1] -= c;
    b[x1][y2 + 1] -= c;
    b[x2 + 1][y2 + 1] += c;
 }
 int main()
 {
    int n, m, q;
    cin >> n >> m >> q;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            cin >> a[i][j];
    for (int i = 1; i <= n; i++)
    {
        for (int j = 1; j <= m; j++)
        {
            insert(i, j, i, j, a[i][j]);      //构建差分数组
        }
    }
    while (q--)
    {
        int x1, y1, x2, y2, c;
        cin >> x1 >> y1 >> x2 >> y2 >> c;
        insert(x1, y1, x2, y2, c);//加c
    }
    for (int i = 1; i <= n; i++)
    {
        for (int j = 1; j <= m; j++)
        {
            b[i][j] += b[i - 1][j] + b[i][j - 1] - b[i - 1][j - 1];  //二维前缀和
        }
    }
    for (int i = 1; i <= n; i++)
    {
        for (int j = 1; j <= m; j++)
        {
            printf("%d ", b[i][j]);
        }
        printf("\n");
    }
    return 0;
 }
```

### 动态规划DP

#### LIS最长上升子序列

https://www.lanqiao.cn/problems/2049/learning/


##### 朴素LIS   O(n^2)

```C++
    for(int i=1;i<=n;i++)//O(n^2)
    {
        dp[i]=1;
        for(int j=1;j<i;j++)
        {
            if(a[i]>a[j])dp[i]=max(dp[j]+1,dp[i]);
        }
        ans=max(dp[i],ans);
    }
```

##### 二分优化LIS   O(nlogn)

```C++

```





#### LCS最长公共子序列

![[Pasted image 20250320185940.png]]

```C++
    for(int i=1;i<=n;i++)
    {
        for(int j=1;j<=m;j++)
        {
            if(a[i]==b[j])dp[i][j]=dp[i-1][j-1]+1;
            else
            {
                dp[i][j]=max(dp[i-1][j],dp[i][j-1]);
            }
        }
    }
```



### DFS

深搜就是从一个点一直搜到底再往上搜

例题：https://www.luogu.com.cn/problem/P1036

```c++
#include <iostream>
using namespace std;
int n, k, ans = 0, a[30];
bool sushu(int x)
{
    if (x == 1 || x == 0)return false;
    else if (x == 2)return true;
    else
    {
        for (int i = 2; i * i <= x; i++)
            if (x % i == 0)return false;
        return true;
    }
}

void dfs(int cnt, int sum, int t)
{
    if (cnt == k)
    {
        if (sushu(sum))ans++;
        return;
    }
    else
    {
        for (int i = t; i < n; i++)
            dfs(cnt + 1, sum + a[i], i + 1);
        return;
    }
}

int main()
{
    cin >> n >> k;
    for (int i = 0; i < n; i++)
        cin >> a[i];
    dfs(0, 0, 0);
    cout << ans;
    return 0;
}
```



### BFS

广搜就是一层到一层往下搜

例题：https://www.luogu.com.cn/problem/P1451

```c++
#include<iostream>
#include<queue>
using namespace std;
int n,m,mv[4][2]={0,1,0,-1,1,0,-1,0},ans;
string mp[120];

void bfs(int x,int y){
    queue<pair<int,int> > q;
    q.push(make_pair(x,y));
    while(!q.empty()){
        int x1=q.front().first;
        int y1=q.front().second;
        mp[x1][y1]='0';
        q.pop();
        for(int i=0;i<4;i++){
            int xi=mv[i][0]+x1,yi=y1+mv[i][1];
            if(xi<0||yi<0||xi>=n||yi>=m)continue;
            if(mp[xi][yi]!='0'){
                q.push(make_pair(xi,yi));
            }
        }
    }
}

int main()
{
    cin>>n>>m;
    for(int i=0;i<n;i++)cin>>mp[i];
    for(int i=0;i<n;i++){
        for(int j=0;j<m;j++){
            if(mp[i][j]!='0'){
                bfs(i,j);
                ans++;
            }
        }
    }
    cout<<ans;
    return 0;
}
```



### 数据结构

#### ST表

核心代码

```c++
int n,q;
int a[N];
int mx[N][21],mi[N][21];//mx求最大值，mi求最小值 
void ST(int n)
{
	int i,j;
	for(i=1;i<=n;i++)
	{
		mx[i][0]=a[i];
		mi[i][0]=a[i];
	}
	//j  2^j<=n 
	//i  i+2^j-1<=n
	for(j=1;j<=21;j++)
	{
		for(i=1;(i+(1<<j)-1)<=n;i++)
		{
			mx[i][j]=max(mx[i][j-1],mx[i+(1<<(j-1))][j-1]);
			mi[i][j]=min(mi[i][j-1],mi[i+(1<<(j-1))][j-1]);
		}
	}
}
```

求区间最大值

```c++
int maxquery(int l,int r)
{
	int k=log2(r-l+1);
	//max(f[l][k],f[r-2^k+1][k]) 
	return max(mx[l][k],mx[r-(1<<k)+1][k]);
}
```

求区间最小值

```c++
int minquery(int l,int r)
{
	int k=log2(r-l+1);
	return min(mi[l][k],mi[r-(1<<k)+1][k]);
}
```



#### 并查集

找根，判断连通

```c++
int root(int x)
{
    return pre[x] = (pre[x]==x?x:root(pre[x]));
}
//合并pre[root(x)]=root(y);最坏情况下每次查找O(n)
```

#### 启发式合并

平均查找O(1)，避免树高度过高

```c++
void init(){
  for(int i=1;i<=n;++i)pre[i]=i,siz[i]=1;
}

int root(int x){
  return pre[x]==x?x:pre[x]=root(pre[x]);
}

void merge(int x, int y)
{
    int rx = root(x), ry = root(y);
    if(rx == ry)return;//已经连通，无需处理
    //如果rx更大，则交换，可以保证siz[rx] <= siz[ry]
    if(siz[rx] > siz[ry])swap(rx, ry);
    
    //此时有siz[rx] <= siz[ry]，所以一定是rx -> ry
    pre[rx] = ry;
    siz[ry] += siz[rx];

    //操作完成后rx将不再作为根，于是它的siz也没有意义了，也不会再变化了
}
```



#### 单调栈

```c++
// 此函数用于找出数组中每个元素右侧第一个比它大的元素
// 参数 n 为数组的长度，参数 a 是一个常量引用，代表输入的数组
vector<int> next_greater(int n, const vector<int>& a) {
    // 初始化结果数组 r，长度为 n，所有元素初始化为 0
    vector<int> r(n, 0);
    // 定义一个栈 st，用于存储数组元素的索引
    stack<int> st;
    // 遍历数组 a
    for (int i = 0; i < n; ++i) {
        // 当栈不为空，并且当前元素 a[i] 大于栈顶元素对应的数组元素 a[st.top()] 时
        while (st.size() && a[i] > a[st.top()]) {
            // 将当前元素 a[i] 作为栈顶元素对应的结果，存储到结果数组 r 中
            r[st.top()] = a[i]; 
            // 弹出栈顶元素
            st.pop();
        }
        // 将当前元素的索引 i 压入栈中
        st.push(i);
    }
    // 返回结果数组 r
    return r;
}

// 此函数用于找出数组中每个元素左侧第一个比它小的元素
// 参数 n 为数组的长度，参数 a 是一个常量引用，代表输入的数组
vector<int> left_smaller(int n, const vector<int>& a) {
    // 初始化结果数组 r，长度为 n，所有元素初始化为 0
    vector<int> r(n, 0); 
    // 定义一个栈 st，用于存储数组元素的索引
    stack<int> st; 
    // 遍历数组 a
    for (int i = 0; i < n; ++i) {
        // 当栈不为空，并且当前元素 a[i] 小于等于栈顶元素对应的数组元素 a[st.top()] 时
        while (st.size() && a[i] <= a[st.top()] ) { 
            // 弹出栈顶元素
            st.pop(); 
        }
        // 如果栈不为空
        if (!st.empty()) { 
            // 将栈顶元素对应的数组元素 a[st.top()] 作为当前元素的结果，存储到结果数组 r 中
            r[i] = a[st.top()]; 
        }
        // 将当前元素的索引 i 压入栈中
        st.push(i);  
    }
    // 返回结果数组 r
    return r;
}
```


### 字符串
#### kmp
```c++
#include <iostream>
#include <cstdio>
#include <cstring>
using namespace std;

// 定义数组的最大长度，用于存储模式串和主串
const int N = 1e6 + 10;

// n 为主串长度，m 为模式串长度
// ne 数组用于存储模式串的最长公共前后缀长度
int n, m, ne[N];
// s 为主串，p 为模式串
char s[N],p[N];

int main() {
    // 输入模式串，从下标 1 开始存储模式串，因为 p + 1 指向数组的第二个元素
    cin >> (p + 1);
    // 计算模式串的长度，注意这里从下标 1 开始计算
    m = strlen(p + 1);
    // 输入主串，同样从下标 1 开始存储主串
    cin >> (s + 1);
    // 计算主串的长度，从下标 1 开始计算
    n = strlen(s + 1);

    // 预处理模式串的 ne 数组，用于记录模式串每个位置的最长公共前后缀长度
    for (int i = 2, j = 0; i <= m; ++i) {
        // 当 j 不为 0 且当前字符不匹配时，回溯 j 到之前匹配的位置
        while (j && p[i] != p[j + 1]) j = ne[j];
        // 如果当前字符匹配，j 指针后移一位
        if (p[i] == p[j + 1]) j++;
        // 更新 ne 数组，记录当前位置的最长公共前后缀长度
        ne[i] = j;
    }

    // 用于记录主串中模式串出现的次数
    int ans = 0;

    // 在主串中匹配模式串
    for (int i = 1, j = 0; i <= n; ++i) {
        // 当 j 不为 0 且当前字符不匹配时，回溯 j 到之前匹配的位置
        while (j && s[i] != p[j + 1]) j = ne[j];
        // 如果当前字符匹配，j 指针后移一位
        if (s[i] == p[j + 1]) j++;
        // 如果 j 等于模式串的长度，说明找到了一个完整的模式串匹配
        if (j == m) {
            // 匹配次数加 1
            ans++;
            // 继续匹配下一个可能的位置，回溯 j 到之前匹配的位置
            j = ne[j];
        }
    }

    // 输出模式串在主串中出现的次数
    cout << ans;
    return 0;
}    
```


### Kruskal

```java
struct Edge {
    int x, y, c;
    bool operator < (const Edge& u)const {
        return c < u.c;
    }
};

int pre[10000];
int root(int x) { return pre[x] == x ? x : root(pre[x]); }

void solve() {
    int n, m;
    cin >> n >> m;
    vector<Edge> es;
    for (int i = 1; i <= m; ++i) {
        int x, y, c;
        cin >> x >> y >> c;
        es.push_back({ x, y, c });
    }

    sort(es.begin(), es.end());

    for (int i = 1; i <= n; ++i) pre[i] = i;
    int ans = 0;
    for (const Edge& e : es) {
        auto x = e.x;
        auto y = e.y;
        auto c = e.c;
        if (root(x) == root(y)) continue;
        ans = max(ans, c);
        pre[root(x)] = root(y);
    }
    cout << ans << '\n';
}

int main() {
    solve();
    return 0;
}
```



### Prim

```C++
struct Edge
{
    long long x, c;
    bool operator < (const Edge& u)const
    {
        return c == u.c ? x > u.x : c > u.c;
    }
};
vector<Edge> g[1000];
long long d[1000];
int n, m;
int prim()
{
    priority_queue<Edge> pq;
    bool vis[10000];
    d[1] = 0;
    pq.push({ 1, d[1] });
    long long res = 0;
    while (pq.size())
    {
        int x = pq.top().x; pq.pop();
        if (vis[x]) continue;
        vis[x] = true;
        res = max(res, d[x]);
        for (const auto& elem : g[x]) {
            auto& y = elem.x;
            auto& w = elem.c;
            if (vis[y]) continue;
            d[y] = min(d[y], w);
            pq.push({ y, d[y] });
        }
    }
    return res;
}

int main() {
    prim();
    return 0;
}
```



### 拓扑排序

有向无环图一定是拓扑序列
- **判断有无环的方法**：在进行拓扑排序时，使用入度数组记录每个顶点的入度（即指向该顶点的边的数量）。一开始，将所有入度为 0 的顶点入队列。然后从队列中取出顶点，减少其邻接顶点的入度，如果某个邻接顶点的入度变为 0，则将其入队列。重复这个过程，直到队列为空。如果拓扑排序结束后，图中还有顶点的入度不为 0，说明存在一些顶点无法被纳入拓扑排序中，这就意味着图中存在环；反之，如果所有顶点都被成功加入到拓扑排序中，那么图就是一个有向无环图。
例如，对于一个有向图，经过上述拓扑排序操作后，若存在未处理的顶点（入度不为 0），则可判定该图有环。

```C++
	queue<int> q;
	vector<int> g[N]; 
    for(int i=0;i<m;i++)
    {
        int u,v;
        cin>>u>>v;
        ind[v]++;
        g[u].push_back(v);
    }
	for(int i=1;i<=n;i++){
        if(!ind[i]) q.push(i);//将所有入度为0的点加入队列
    }
    while(!q.empty()){
        int x=q.front();//取出队头的点x，此时它的入度一定为0
        q.pop();
        for(auto y:g[x])//处理x->y
        {
            ind[y]--;
        	if(!ind[y])q.push(y);//如果y入度为0，说明y的所有入点已经处理完成了，直接入队
        }
    }
```

#### 拓扑序列判断无环
```cpp
const int N = 100010;
vector<int> g[N];
int ind[N];

bool topologicalSort(int n) {
    queue<int> q;
    // 将所有入度为 0 的顶点加入队列
    for (int i = 1; i <= n; i++) {
        if (!ind[i]) q.push(i);
    }

    int count = 0; // 记录加入拓扑排序序列的顶点数量
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        count++; // 每处理一个顶点，计数器加 1

        // 遍历该顶点的所有邻接顶点
        for (auto y : g[x]) {
            ind[y]--;
            if (!ind[y]) q.push(y);
        }
    }

    // 如果加入拓扑排序序列的顶点数量等于图中顶点的总数，则图中无环
    return count == n;
}

int main() {
    int n, m;
    cin >> n >> m;

    // 读取边的信息，更新入度和邻接表
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        ind[v]++;
        g[u].push_back(v);
    }

    if (topologicalSort(n)) {
        cout << "图中没有环" << endl;
    } else {
        cout << "图中存在环" << endl;
    }

    return 0;
}
```



### Floyd

多源最短路，求出每个点与点之间的最短路径

```c++
#include <iostream>
// 定义ll为long long的别名，方便后续使用
typedef long long ll;
// 定义图的最大顶点数，可根据实际情况调整，这里设为210
const int N = 210;  
// 定义一个很大的数表示无穷大，用于初始化距离为不可达的情况
const ll INF = 1e18;  
// 定义二维数组d，用于存储任意两点之间的最短距离
ll d[N][N];  
// 引入标准命名空间，这样就可以直接使用标准库中的函数和对象，无需std::前缀
using namespace std;
int main() {
    // 禁用C++输入输出流与C标准输入输出流的同步，解除cin与cout的绑定，加快输入输出速度
    ios::sync_with_stdio(0), cin.tie(0), cout.tie(0);
    // 用于存储图的顶点数、边数和查询次数
    int n, m, q;
    // 读入图的顶点数n、边数m和查询次数q
    cin >> n >> m >> q;

    // 初始化d数组，将每个点到自身的距离设为0，其余设为无穷大
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            if (i == j) 
                // 自身到自身的距离为0
                d[i][j] = 0; 
            else 
                // 初始时其他点之间距离设为无穷大，表示不可达
                d[i][j] = INF; 
        }
    }
    // 读入边的信息并初始化邻接矩阵，根据边的数量m进行循环
    while (m--) {
        // 用于存储边的起点u、终点v和边的权重w
        ll u, v, w;
        // 读入边的起点、终点和权重
        cin >> u >> v >> w;
        // 更新u到v的距离为较小值（初始或新读入的权重），这里假设图是无向图
        d[u][v] = min(d[u][v], w);
        // 因为是无向图，所以v到u的距离也要更新
        d[v][u] = min(d[v][u], w); 
    }

    // Floyd-Warshall算法核心部分，通过中间节点k更新任意两点间的最短距离
    // 最外层循环，枚举中间节点k
    for (int k = 1; k <= n; k++) {
        // 第二层循环，枚举起点i
        for (int i = 1; i <= n; i++) {
            // 第三层循环，枚举终点j
            for (int j = 1; j <= n; j++) {
                // 通过中间节点k，更新i到j的最短距离
                d[i][j] = min(d[i][j], d[i][k] + d[k][j]);
            }
        }
    }
    // 处理q次查询
    while (q--) {
        // 用于存储查询的起点st和终点ed
        int st, ed;
        // 读入查询的起点和终点
        cin >> st >> ed;
        // 如果最短距离仍然是无穷大，说明两点不连通
        if (d[st][ed] > INF / 2) 
            // 输出impossible表示两点不可达
            cout << "impossible" << endl; 
        else 
            // 输出两点之间的最短距离
            cout << d[st][ed] << endl; 
    }

    return 0;
}
```

### Dijkstra

求单源最短路，求出所有点距离源点的最短距离

```c++
#include <bits/stdc++.h>
using namespace std;

// 定义长整型别名，方便后续使用
typedef long long ll;

// 定义最大节点数，可根据实际情况调整
const int MAXN = 3e5 + 10;
// 定义一个极大值，表示无穷远的距离
constexpr ll INF = 1E18;

// 节点数量
int n;
// 边的数量
int m;

// 存储每个节点到源节点的最短距离
ll dist[MAXN];
// 优先队列，用于Dijkstra算法，存储距离和节点编号，按照距离从小到大排序
priority_queue<pair<ll, int>, vector<pair<ll, int>>, greater<>> pq;
// 邻接表，存储图的结构，每个节点对应一个向量，向量中存储与该节点相连的节点和边的权重
vector<pair<int, ll>> graph[MAXN];

// Dijkstra算法实现，start为源节点
void dijkstra(int start) {
    // 将源节点的距离设为0，并加入优先队列
    pq.emplace(0LL, start);

    // 当优先队列不为空时，继续处理
    while (!pq.empty()) {
        // 从优先队列中取出当前距离最小的节点及其距离
        auto [d, u] = pq.top();
        pq.pop();

        // 如果该节点已经有了最短距离，跳过
        if (dist[u] != INF) continue;

        // 更新该节点的最短距离
        dist[u] = d;

        // 遍历当前节点的所有邻接节点
        for (auto [v, w] : graph[u]) {
            // 将邻接节点及其距离加入优先队列
            pq.emplace(d + w, v);
        }
    }
}

int main() {
    // 禁用同步流，提高输入输出效率
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    // 读取节点数量和边的数量
    cin >> n >> m;

    // 初始化所有节点的最短距离为无穷大
    for (int i = 1; i <= n; i++) {
        dist[i] = INF;
    }

    // 读取每条边的信息，构建图的邻接表
    for (int i = 1; i <= m; i++) {
        int u, v;
        ll w;
        cin >> u >> v >> w;
        // 将边的信息加入邻接表
        graph[u].push_back({v, w});
    }

    // 从节点1开始执行Dijkstra算法
    dijkstra(1);

    // 输出每个节点到源节点的最短距离，如果无法到达则输出 -1
    for (int i = 1; i <= n; i++) {
        if (dist[i] == INF) {
            cout << -1 << ' ';
        } else {
            cout << dist[i] << ' ';
        }
    }

    return 0;
}
```



### 数论

#### gcd

最大公因数，或称最大公约数

```c++
__gcd(int a,int b);//官方库
int gcd(int a,int b){
  return b == 0 ? a : gcd(b,a%b);//辗转相除法
}
```

#### lcm

最大公倍数

```c++
__lcm(int a,int b);//官方库
int lcm(int a,int b){
	return a/gcd(a,b)*b;//先除后乘避免溢出
}
```



#### 素数

##### 朴素素数

```c++
bool isprime(int n){
  if(n<2)return false;//2不是质数
  for(int i=2;i<=n/i;i++)if(n%i==0)return false;//防止溢出
  return true;
}
```

##### 埃氏筛法

比朴素快很多倍

```c++
bool vis[N];//假设true不是素数，被筛掉了
vis[0]=vis[1]=true;
for(int i=2;i<=n/i;i++){
  if(!vis[i])for(int j=i*i;j<=n;j+=i)vis[j]=true;
}
```

##### 欧拉筛

o(n)最快，可以在1s内筛出约1e7以内的所有质数，埃氏筛法能做的欧拉筛都能做。

```c++
void euler(int n)
{
    vector<int> primes;
    vis[0] = vis[1] = true;
    for(int i = 2;i <= n; ++i)
    {
        //如果i没有被筛除，说明i是质数，存入vector中
        if(!vis[i])primes.push_back(i);
        //注意枚举条件 i * primes[j]表示要被筛除的数字（一定不是质数）
        for(int j = 0;j < primes.size() && i * primes[j] <= n; ++j)
        {
            vis[i * primes[j]] = true;
            if(i % primes[j] == 0)
            {
                //说明此时primes[j] 已经不是i * primes[j] 的最小质因子了
                break;
            }
        }
    }
}
```

#### 唯一分解定理

唯一分解定理指的是：任何一个大于1的自然数都可以唯一地分解为有限个质数的乘积。 
$$
 \(x = p_1^{k_1}×p_2^{k_2}×...×p_m^{k_m}\)
$$
这个式子中的p1,p2是类似2, 3, 5, 7这样的质数。 将单个数字进行质因数方法是，从小到大枚举x的所有可能的质因子，最大枚举到sqrt(x)，每遇到一个可以整除的数字i，就不断进行除法直到除尽。最后如果还有x>1，说明还有一个较大的质因子。 

```c++
#include <bits/stdc++.h>
using namespace std;
const int N = 2e5 + 9;
vector<pair<int, int>> v;
int main()
{
    int x;cin >> x;
    //枚举所有可能的质因子
    for(int i = 2;i <= x / i; ++ i)
    {
        //如果不能整除直接跳过
        if(x % i)continue;
        //如果可以整除，那么必然是一个质因子（从小到大枚举的特性决定）
        //cnt表示当前这个质因子i的指数
        int cnt = 0;
        //一直除，直到除干净
        while(x % i == 0)cnt ++, x /= i;
        v.push_back({i, cnt});
    }
    if(x > 1)v.push_back({x, 1});
    for(const auto i : v)cout << i.first << ' ' << i.second << '\n';

    return 0;
}
```

#### 约数个数定理

通过某个数字的唯一分解： 
$$
x = p_1^{k_1}×p_2^{k_2}×...×p_m^{k_m}
$$
 我们可以求出x的约数（因数）个数，如果学过线性代数或者有向量相关的知识的话，可以理解为将不同的质因子看作是不同的向量空间或基底，不同质因子之间互不干扰。 也就是说p1的指数的取值是[0, k1]共(k1 + 1)个，p2,p3…亦然，所以x的约数的个数就是
$$
(k1 + 1)*(k2 + 1)*…*(km + 1)
$$
，即：
$$
d(x)=\prod_{i = 1}^{m}(k_i + 1)
$$
例题：定义阶乘 n!=1×2×3×⋅⋅⋅×n*n*!=1×2×3×⋅⋅⋅×*n*。

请问 100!（100 的阶乘）有多少个正约数。

```c++
#include <iostream>
using namespace std;
#define int long long
int num[105];

void init(int n){
    for(int i=2;i<=n/i;i++){
        if(n%i)continue;
        while(n%i==0)num[i]++,n/=i;
    }
    if(n>1)num[n]++;
}

signed main()
{
    for(int i=1;i<=100;i++){
        init(i);
    }
    int ans=1;
    for(int i=1;i<=100;i++){
        ans*=(num[i]+1);
    }
    cout<<ans;
  return 0;
}
```

#### 约数和定理

通过某个数字的唯一分解：
$$
x = p_{1}^{k_{1}}\times p_{2}^{k_{2}}\times... \times p_{m}^{k_{m}}
$$
 我们可以求出x的约数（因数）之和，与约数个数定理类似。p1对于约数和的贡献为1或p1或p1^2或...或p1^k1，于是x的约数之和可以表达为： 
$$
sum(x) =\prod_{i = 1}^{m}\sum_{j = 0}^{k_{i}}p_{i}^{j}
$$
约数和计算公式：    f[i] = (p1^0 + p1^1 + p1^2 + p1^3... + p1^c1) * (p2^0 + p2^1 + p2^2 + p2^3...p2^c2) * ......

例题：给定你一个正整数 n*n*，你需要求出 n!*n*! 的约数之和，结果对 998244353998244353 取模。

n!：n的阶乘，含义为 1×2×3×...×n1×2×3×...×*n*。

输入包含一个正整数 n*n*。

输出 n! 的约数之和，对 998244353998244353 取模。

```c++
#include <iostream>
using namespace std;
#define MOD 998244353;
#define int long long
int n;
int num[200005];

void init(int m){
    for(int i=2;i<=m/i;++i){
        if(m%i)continue;
        while(m%i==0)m/=i,num[i]++;
    }
    if(m>1)num[m]++;
}

signed main(){
    cin>>n;
    for(int i=2;i<=n;i++){
        init(i);
    }
    int ans=1;
    for(int i=2;i<=n;i++){
        int sum=0,tmp=1;
        if(num[i]==0)continue;
        for(int j=0;j<=num[i];j++){
            sum=(sum+tmp)%MOD;
            tmp=(tmp*i)%MOD;
        }
        ans=(ans*sum)%MOD;
    }
    cout<<ans;

  return 0;
}
```

#### 快速幂

朴素的计算a的b次方的方法，所需的时间复杂度为O(b)，即用一个循环，每次乘一个a，乘b次。 利用倍增的思想，可以将求幂运算的时间复杂度降低为O(logb)。 当b为偶数：
$$
a^b=a^(b/2)*a^(b/2)=(a^2)^(b/2)
$$
当b为奇数：
$$
a^b=a*a^(b/2)*a^(b/2)=a*(a^2)^(b/2)
$$
，注意这里b/2向下取整。 于是迭代求解，直到b为0即可。 

```c++
int qmi(int a, int b, int p)//对p取模
{
    int res = 1;
    while(b)
    {
        if(b&1)res = res * a % p;//b为奇数，乘一个a到答案里
        a = a * a % p;
      	b >>= 1;//底数平方，指数除以2
    }
    return res%p;
}
```

