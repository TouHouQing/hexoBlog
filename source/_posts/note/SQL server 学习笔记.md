---
title: SQL server 学习笔记
date: 2025-04-11 16:49:42
updated: 2025-04-11 16:49:42
categories:
  - Wiki
tags:
  - 笔记
wiki: true
top_img: false
permalink: 'wiki/sql-server-study-notes/'
---
# SQL server 学习笔记

## SQL语言基础及数据定义功能

### 基本表的定义与删除

#### 定义基本表

```sql
CREATE TABLE <表名>(
<列名> <数据类型> [列名完整性约束定义]
{,<列名> <数据类型> [列级完整性约束定义]...}
[,表级完整性约束定义]
)

例
CREATE TABLE Student(
	Sno char(7) PRIMARY KEY, //在列级完整性约束处定义主键约束
    Sname nvarchar(10) NOT NULL,
    Ssex nchar(1),
    Sage tinyint,
    Sdept nvarchar(20)
)

/创建三个表
CREATE TABLE Student(
	Sno char(7) PRIMARY KEY,
	Sname nvarchar(10) NOT NULL,
	Ssex nchar(1),
	Sage tinyint,
	Sdept nvarchar(20)
)

CREATE TABLE Course(
	Cno char(6) NOT NULL,
	Cname nvarchar(20) NOT NULL,
	Credit tinyint,
	Semester tinyint,
	PRIMARY KEY(Cno)
)

CREATE TABLE SC(
	Sno char(7) NOT NULL,
	Cno char(6) NOT NULL,
	Grade smallint,
	PRIMARY KEY(Sno,Cno),
	FOREIGN KEY(Sno) REFERENCES Student(Sno),
	FOREIGN KEY(Cno) REFERENCES Course(Cno)
)
```

- NOT NULL:限制列表取值为空
- DEFAULT:指定列的默认值
- UNIQUE:限制列取值不重复
- CHECK:限制列的取值范围
- PRIMARY KEY:定义主键约束
- FOREIGN KEY:定义外键约束

#### 删除表

删除表的SQL语句

```sql
DROP TABLE <表名> {,<表名>...
```

#### 修改表结构

```SQL
ALTER TABLE <表名>
ALTER COLUMN <列名> <数据类型>   ---修改列的定义
ADD <列名> <数据类型> <约束> ---添加新列
DROP COLUMN <列名> ---删除列
ADD [constraint <约束名>]约束定义 ---添加约束
DROP [constraint]<约束名> ---删除约束

例
ALTER TABLE Student
	ADD Spec char(10) NULL //添加专业列，允许为空
ALTER TABLE Student
	ALTER COLUMN Spec char(20)  //修改专业列类型
ALTER TABLE Student
	DROP COLUMN Spec //删除新添加的专业列
```

### 实现数据完整性

#### 主键(PRIMARY KEY)约束

```SQL
ALTER TABLE 表名
	ADD [CONSTRAINT <约束名>]PRIMARY KEY(<列名>[,...n])
	
例
ALTER TABLE 雇员
	ADD CONSTRAINT PK_EMP PRIMARY KEY (雇员编号)
ALTER TABLE 工作
	ADD CONSTRAINT PK_JOB PRIMARY KEY (工作编号)
```

#### 唯一值(UNIQUE)约束

```sql
ALTER TABLE 表名
	ADD[CONSTRAINT <约束名>]UNIQUE (<列名>[,...n])
	
例
ALTER TABLE 雇员
	ADD CONSTRAINT UK_SID UNIQUE(电话号码)
```

#### 外键(FOREIGN KEY)约束

```SQL
ALTER TABLE 表名
	ADD [CONSTRAINT <约束名>]
	FOREIGN KEY (<列名>) REFERENCES 引用表名 (<列名>)

例
ALTER TABLE 雇员
	ADD CONSTRAINT FK_JOB_id
	FOREIGN KEY (工作编号) REFERENCES 工作表 (工作编号)
```

#### 默认值(DEFAULT)约束

```SQL
ALTER TABLE 表名
	ADD [CONSTRAINT <约束名>] DEFAULT 默认值 FOR 列名
例
ALTER TABLE 雇员
	ADD CONSTRAINT DF_SALARY DEFAULT 3600 FOR 工资
```

#### 列取值范围(CHECK)约束

```SQL
ALTER TABLE 表名
	ADD [CONSTRAINT <约束名>] CHECK (逻辑表达式)

例
ALTER TABLE 雇员
	ADD CONSTRAINT CHK_Salary CHECK (工资>=2000)
ALTER TABLE 工作
	ADD CONSTRAINT CHK_Salary CHECK (最低工资<=最高工资)
	
CREATE TABLE 工作(
	工作编号 char(8) PRIMARY KEY,
    最低工资 int,
    最高工资 int,
    CHECK (最低工资<=最高工资)
    分数 nchar(10) NOT NULL CHECK (分数 in (between '0' and '100')) ---要求分数为0-100且非空
    CHECK (zip LIKE '[0-9][0-9][0-9][0-9][0-9]') ---要求zip列中的输入为五位数字
)



```

删除该表上名为“CK_图书销售_销售数量_16644E42”的约束。

```sql
alter table 图书销售 drop constraint CK_图书销售_销售数量_16644E42
```



## 数据操作语句

### 查询语句和基本结构

```sql
SELECT<目标列名序列>  --需要哪些列
	FROM<数据源>   --来自哪些表
	[WHERE <检索条件表达式>]
	[GROUP BY <分组依据列>]
	[HAVING <组提取条件>]
	[ORDER BY <排序依据列>]
```

### 单表查询

#### 查询指定的列

学号，姓名列均包含在Student表中，因此该查询的数据源是Student表

```SQL
SELECT Sno, Sname FROM Student
```

查询全体学生的姓名，学号，和所在系

```SQL
SELECT Sname, Sno, Sdept FROM Student
```

#### 查询全部列

查询全体学生的详细信息

```SQL
SELECT Sno, Sname, Ssex, Sage, Sdept FROM Student
//等价于
SELECT * FROM Student
```

#### 查询经过计算的列

增加计算列。用当前年减去年龄得出生年份

```SQL
SELECT Sname, 2015 - Sage FROM Student
```

增加常量列。查询全体学生的姓名和出生年份，并在出生年份列前面加一个新列，新列每行数据为出生年份常量值

```SQL
SELECT Sname '出生年份', 2015 - Sage FROM Student
//此语句会显示无列名
//列别名=列名|表达式
SELECT Sname AS 姓名, '出生年份' AS 常量列, 2015 - Sage AS 年份
	FROM Student
```

#### 消除取值相同的行

在选修课表中查询哪些学生选修了课程，列出选课学生的学号。

```SQL
SELECT Sno FROM SC
```

DISTINCT关键之可以去掉查询结果中重复行数据

```SQL
SELECT DISTINCT Sno FROM SC
```

#### 查询满足条件的元组

##### (比较大小)

查询计算机系全体学生的姓名

```SQL
SELECT Sname FROM Student WHERE Sdept = '计算机系'
```

查询所有年龄在20岁以下的学生的姓名和年龄

```sql
SELECT Sname, Sage FROM Student WHERE Sage < 20
```

当一个学生有多门可成不及格时，应该只列出一次该学生的学号，因此该查询应该用DISTINCT 去掉 Sno的重复值

```SQL
SELECT DISTINCT Sno FROM SC WHERE Grade < 60
```

##### (确定范围)

查询年龄在20~23之间的学生的姓名,所在系,年龄

```SQL
SELECT Sname, Sdept, Sage FROM Student
	WHERE Sage BETWEEN 20 AND 23
//此语句等价于
SELECT Sname, Sdept, Sage FROM Student
	WHERE Sage >=20 AND Sage <=23
```

查询年龄不在20~23之间的学生姓名，所在系和年龄

```SQL
SELECT Sname, Sdept, Sage FROM Student
 WHERE Sage NOT BETWEEN 20 AND 23
 //此语句等价于
SELECT Sname, Sdept, Sage FROM Student
 WHERE Sage <20 OR Sage>23
```

##### (确定集合)

查询信息系,数学系和计算机系学生的姓名和性别

```SQL
SELECT Sname, Ssex FROM Student
	WHERE Sdept IN('信息系', '数学系', '计算机系')
//此语句等价于
SELECT Sname, Ssex FROM Student
	WHERE Sdept = '信息系' OR Sdept = '数学系' OR Sdept = '计算机系'
```

查询既不是信息系,数学系,也不是计算机系学生的姓名和性别

```SQL
SELECT Sname, Ssex FROM Student
	WHERE Sdept NOT IN ('信息系', '数学系', '计算机系')
//此语句等价于
SELECT Sname, Ssex FROM Student
	WHERE Sdept != '信息系' AND Sdept != '数学系' AND Sdept !='计算机系'
```

##### (字符串匹配)

_：匹配任意一个字符

%：匹配0个或多个字符

[]：匹配[]中的任意一个字符。对于连续的字母匹配例如[abcd]可写成[a-d]

[^] ：不匹配[]中的任意一个字符，对于连续字符[^ abcd    可写成[^a-d

查询姓张的同学的详细信息

```sql
SELECT * FROM Student WHERE Sname LIKE '张%'
```

查询学生表中姓张，李，刘的学生的详细信息

```SQL
SELECT * FROM Student WHERE Sname LIKE '[张李刘]%'
//或者
SELECT * FROM Student
	WHERE Sname LIKE '张%' OR Sname LIKE '李%' OR Sname LIKE '刘%'
```

查询名字中第2个字是小或大的学生的姓名和学号

```SQL
SELECT Sname, Sno FROM Student WHERE Sname LIKE '_[小大]%'
```

查询所有不姓 “王” 也不姓张” 的学生姓名。

```SQL
SELECT Sname FROM Student WHERE Sname NOT LIKE '(王|张)';
//或者
SELECT Sname FROM Student WHERE Sname LIKE '[^王张]%';
//或者
SELECT Sname FROM Student
	WHERE Sname NOT LIKE '王' AND Sname NOT LIKE '张%';
```

查询姓 “王” 且名字是 2 个字的学生姓名

```SQL
SELECT Sname FROM Student WHERE Sname LIKE '王_'
```

查询姓 “王” 且名字是 3 个字以内的学生姓名

```SQL
SELECT Sname FROM Student WHERE Sname LIKE '王___'
```

查询姓 “王” 且名字是 3 个字的学生姓名

```sql
SELECT Sname FROM Student WHERE RTRIM(Sname) LIKE '王___'
```

##### (涉空值的查询)

查询没有考试成绩的学生的学号和相应的课程号

```SQL
SELECT Sno, Cno FROM SC WHERE Grade IS NULL
```

查询所有有考试成绩的学生的学号和课程号

```sql
SELECT Sno, Cno FROM SC WHERE Grade IS NOT NULL
```

##### (**多重条件查询**)

查询计算机系年龄在 20 岁以下的学生姓名和年龄

```SQL
SELECT Sname, Sage FROM Student WHERE Sdept='计算机系' AND Sage<20
```

查询计算机系和信息系年龄大于等于 20 岁的学生姓名、所在系和年龄

```SQL
SELECT Sname, Sdept, Sage FROM Student WHERE (Sdept='计算机系' OR Sdept='信息系') AND Sage>=20
//也可以写成
SELECT Sname, Sdept, Sage FROM Student WHERE Sdept IN ('计算机系','信息系') AND Sage>=20
```

#### 对查询结果进行排序

​	将学生按年龄升序排序

```SQL
SELECT * FROM Student ORDER BY Sage ASC//不写ASC默认升序
```

查询选修了 “c002” 课程的学生的学号及成绩，查询结果按成绩降序排列

```sql
SELECT Sno, Grade FROM SC WHERE Cno='c002' ORDER BY Grade DESC
```

查询全体学生的信息，查询结果按所在系的系名升序排列，同一系的学生按年龄降序排列

```SQL
SELECT * FROM Student ORDER BY Sdept, Sage DESC
```

#### 使用聚合函数汇总数据

```SQL
COUNT(*): 统计表中元组的个数
COUNT([DISTINCT]<列名>)：统计本列非空列值个数,DISTINCT表示不包括列的重复值
SUM(<列名>)：计算列值的和值
AVG(<列名>)：计算列值平均值
MAX(<列名>)：求列值最大值
MIN(<列名>)：求列值最小值
```

统计学生总人数。

```SQL
SELECT COUNT(*) AS 学生人数 FROM Student
```

统计选修了课程的学生人数

```SQL
SELECT COUNT(DISTINCT Sno) AS 选课人数 FROM SC
```

计算 “1512101” 学生的选课门数和考试总成绩

```SQL
SELECT COUNT(*) AS 选课门数, SUM(Grade) AS 总成绩 FROM SC WHERE Sno ='1512101'
```

计算 “c001” 课程的考试平均成绩

```sql
SELECT AVG(Grade) AS 平均成绩 FROM SC WHERE Cno ='c001'
```

查询 “c001” 课程的考试最高分和最低分

```SQL
SELECT MAX(Grade) AS 最高分, MIN(Grade) AS 最低分 FROM SC WHERE Cno='c001'
```

查询 “1512101” 学生的选课门数、已考试课程门数以及考试最高分、最低分和平均分

```sql
SELECT COUNT(*) AS 选课门数, COUNT(Grade) AS 考试门数, AVG(Grade) AS 平均分, MAX(Grade) AS 最高分, MIN(Grade) AS 最低分 FROM SC WHERE Sno='1512101'
```

#### **对查询结果进行分组统计**

##### 使用GROUP BY 子句

统计每门课程的选课人数，列出课程号和选课人数。

```sql
SELECT Cno as 课程号, COUNT(Sno) as 选课人数 FROM SC GROUP BY Cno
```

统计每个学生的选课门数，AVG(Grade) 平均成绩

```SQL
SELECT Sno 学号, COUNT(*) 选课门数, AVG(Grade) 平均成绩 FROM SC GROUP BY Sno
```

统计每个系的学生人数和平均年龄。

```sql
SELECT Sdept, COUNT(*) AS 学生人数, AVG(Sage) AS 平均年龄 FROM Student GROUP BY Sdept
```

带 WHERE 子句的分组。统计每个系的女生人数

```SQL
SELECT Sdept, Count(*) AS 女生人数 FROM Student WHERE Ssex='女' GROUP BY Sdept
```

统计每个系的男生人数和女生人数，以及男生的最大年龄。结果按系名的升序排序

```SQL
SELECT Sdept, Ssex, Count(*) 人数, Max(Sage) 最大年龄 FROM Student GROUP BY Sdept, Ssex ORDER BY Sdept
```

##### 使用HAVING 子句

查询选修了 3 门以上课程的学生的学号和选课门数

```sql
SELECT Sno, Count(*) 选课门数 FROM SC GROUP BY Sno HAVING COUNT(*)>3
//处理过程为：先按学号对 SC 表数据分组，再用 //COUNT 函数对每一组统计，最后选出统计结果满足大于 3 的组
```

查询考试平均成绩超过 80 的学生的学号、选课门数和平均成绩

```sql
SELECT Sno, COUNT(*)选课门数, AVG(Grade) 平均成绩 FROM SC GROUP BY Sno HAVING AVG(Grade)>=80
```

统计每个系的男生人数，只列出男生人数大于等于 2 人的系

```SQL
SELECT Sdept, COUNT(*) 人数 FROM Student WHERE Ssex='男' GROUP BY Sdept HAVING COUNT(*)>=2
```

WHERE、GROUP BY、HAVING 子句的作用及执行顺序

- WHERE 子句用来筛选 FROM 子句中指定的数据源所产生的行数据。
- GROUP BY 子句用来对经 WHERE 子句筛选后的结果数据进行分组。
- HAVING 子句用来对分组后的结果数据再进行筛选。

查询计算机系和信息管理系的学生人数，可以使用如下两种方法

```SQL
SELECT Sdept, COUNT(*) FROM Student
	GROUP BY Sdept
	HAVING Sdept IN('计算机系', '信息管理系')
//方法二比第一种效率高，因为WHERE子句在GROUP BY 子句之前执行, 因此参与分组的数据会减少
SELECT Sdept, COUNT(*) FROM Student
	WHERE Sdept IN ('计算机系', '信息管理系')
	GROUP BY Sdept
```



### **多表连接查询**

#### 内连接

```SQL
FROM 表 1 [INNER] JOIN 表 2 ON <连接条件>
```

查询每个学生及其选课的详细信息

```SQL
SELECT * FROM Student INNER JOIN SC ON Student.Sno = SC.Sno   ---将Student 与SC连接起来
```

去掉重复列

```SQL
SELECT Student.Sno, Sname, Ssex, Sage, Sdept, Cno, Grade FROM Student JOIN SC ON Student.Sno = SC.Sno
```

查询计算机系学生修课情况

```SQL
SELECT Student.Sno, Sname, Cno, Grade FROM Student JOIN SC ON Student.Sno = SC.Sno WHERE Sdept='计算机系'
//也可使用别名写为SELECT Sname, Cno, Grade FROM Student S JOIN SC ON S.Sno = SC.Sno WHERE Sdept='计算机系'
```

查询 “信息系” 选修 “计算机文化学” 课程的学生成绩

```SQL
SELECT Sname, Cname, Grade FROM Student s JOIN SC ON S.Sno = SC.Sno JOIN Course c ON c.Cno = SC.Cno WHERE Sdept='信息系' AND Cname='计算机文化学'
```

查询所有选修了 “Java” 课程的学生情况

```sql
SELECT Sname, Sdept FROM Student S JOIN SC ON S.Sno = SC.Sno JOIN Course C ON C.Cno = SC.Cno WHERE Cname='Java'
```

有分组的多表连接查询，统计每个系的学生考试平均成绩

```SQL
SELECT Sdept, AVG(grade) as AverageGrade FROM Student S JOIN SC ON S.Sno = SC.Sno GROUP BY Sdept
```

有分组和行选择条件的多表连接查询，统计计算机系每门课程的选课人数、平均成绩、最高成绩和最低成绩

```sqL
SELECT Cno, COUNT(*) AS Total, AVG(Grade) as AvgGrade, MAX(Grade) as MaxGrade, MIN(Grade) as MinGrade FROM Student S JOIN SC ON S.Sno = SC.Sno WHERE Sdept='计算机系' GROUP BY Cno
```

#### 自连接

```sql
FROM 表 1 T1 JOIN 表 1 T2
```

查询与刘晨在同一个系学习的学生的姓名和所在系

```sql
SELECT S2.Sname, S2.Sdept FROM Student S1 JOIN Student S2 ON S1.Sdept = S2.Sdept WHERE S1.Sname='刘晨' AND S2.Sname!='刘晨'
```

查询与 “数据结构” 学分相同的课程的课程名和学分

```SQL
SELECT C1.Cname, C1.Credit FROM Course C1 JOIN Course C2 ON C1.Credit = C2.Credit WHERE C2.Cname='数据结构'
```

#### 外连接

```SQL
FROM 表 1 LEFT|RIGHT [OUTER] JOIN 表 2 ON <连接条件>
```

theta 方式语法格式为左外连接

```sql
FROM 表 1, 表 2 WHERE [表 1.]列名 (+)=[表 2.]列名
```

右连接

```SQL
FROM 表1, 表2 WHERE [表1.] 列名 = [表2.] 列名(+)
```

1. 使用 LEFT JOIN 和 WHERE 子句进行查询，例如查询没有选课的课程、计算机系没有选课的学生、特定学期的课程选课人数。
2. 使用 TOP 谓词限制结果集，可指定取前 n 行数据或前 n% 行数据，还可以使用 WITH TIES 包括并列结果，TOP 谓词写在 SELECT 单词后边（如果有 DISTINCT，则在 DISTINCT 之后），查询列表的前边。
3. 在 TOP 子句中使用 WITH TIES 谓词时，要求必须使用 ORDER BY 子句对查询结果进行排序，否则会出现语法错误。最好同时使用 TOP 谓词与 ORDER BY 子句。

```sql
-- 查询没有选课的课程名称
SELECT Cname FROM Course C LEFT JOIN SC ON C.Cno = SC.Cno WHERE SC.Cno IS NULL;

-- 查询计算机系没有选课的学生姓名和性别
SELECT Sname, Ssex
FROM Student LEFT OUTER JOIN SC ON Student.Sno = SC.Sno WHERE SC.Sno IS NULL AND Sdept='计算机系';

-- 统计第 2~4 学期开设的课程中每门课程的选课人数，包括没有人选的课程
SELECT C.Cno 课程号, COUNT(SC.Cno) 选课人数 FROM Course C LEFT OUTER JOIN SC ON C.Cno = SC.Cno WHERE Semester IN(2,3,4)
GROUP BY C.Cno;

-- 查询年龄最大的三名学生的姓名、年龄及所在系
SELECT TOP 3 Sname, Sage, Sdept FROM Student ORDER BY Sage DESC;

-- 查询年龄最大的三名学生的姓名、年龄及所在系，包括并列情况
SELECT TOP 3 WITH TIES Sname, Sage, Sdept FROM Student ORDER BY Sage DESC;

-- 查询 Java 课程考试成绩前三名的学生的姓名、所在系和成绩，包括并列情况
SELECT TOP 3 WITH TIES Sname, Sdept, Grade FROM Student S JOIN SC on S.Sno = SC.Sno JOIN Course C ON C.Cno = SC.Cno WHERE Cname = 'Java' ORDER BY Grade DESC;

-- 查询选课人数最多的前两门课程（包括并列情况），列出课程号和选课人数
SELECT TOP 2 WITH TIES C.Cno 课程号, COUNT(*) 选课人数 FROM Course C JOIN SC ON C.Cno = SC.Cno GROUP BY C.Cno ORDER BY COUNT(*) DESC;
```

####   子查询

1. 子查询概念：一个 SELECT 语句嵌套在另一个 SELECT、INSERT、UPDATE 或 DELETE 语句中称为子查询，子查询通常写在圆括号中，可出现在任何能使用表达式的地方，一般用于外层查询的 WHERE 子句或 HAVING 子句中构成查询条件。
2. 使用子查询进行基于集合的测试：通过运算符 IN 或 NOT IN 将一个表达式的值与子查询返回的结果集进行比较，形式为 WHERE 表达式 [NOT] IN (子查询)，先执行子查询，再基于子查询结果执行外层查询，子查询返回的结果是一个集合，外层查询在这个集合上使用 IN 运算符进行比较，且子查询返回结果集中的列的个数、数据类型以及语义必须与表达式中的相同。

```SQL
-- 查询与“刘晨”在同一个系学习的学生
SELECT Sno, Sname, Sdept FROM Student WHERE Sdept IN (SELECT Sdept FROM Student WHERE Sname ='刘晨');

-- 查询与“刘晨”在同一个系学习的学生且不包含“刘晨”
SELECT Sno, Sname, Sdept FROM Student WHERE Sdept IN (SELECT Sdept FROM Student WHERE Sname ='刘晨') AND Sname!='刘晨';
```

1. 很多子查询语句可以用多表连接的形式实现，但有的查询只能用子查询来实现，如先找出选了特定课程的学生，再计算这些学生的选课门数和平均成绩这种分步骤实现的查询。
2. 使用子查询进行比较测试，语法格式为 WHERE 表达式比较运算符 (子查询)，要求子查询语句必须是返回单值的查询语句，对于要与聚合函数进行比较的查询应使用这种子查询实现，同样是先执行子查询，再根据子查询返回的结果执行外层查询。

```sql
-- 查询考试成绩大于 90 分的学生的学号和姓名
SELECT Sno, Sname FROM Student WHERE Sno IN (SELECT Sno FROM SC WHERE Grade>90);

-- 查询选修了 Java 课程的学生的学号和姓名
SELECT Sno, Sname FROM Student WHERE Sno IN (SELECT Sno FROM SC WHERE Cno IN (SELECT Cno FROM Course WHERE Cname='Java'));

-- 统计选修了 Java 课程的这些学生的选课门数和平均成绩
SELECT Sno 学号, COUNT(*) 选课门数, AVG(Grade) 平均成绩 FROM SC WHERE Sno IN (SELECT Sno FROM SC JOIN Course C ON C.Cno = SC.Cno WHERE Cname='Java') GROUP BY Sno;

-- 查询选了“c005”课程且考试成绩高于此课程的平均成绩的学生的学号和成绩
SELECT Sno, Grade FROM SC WHERE Cno='c005' AND Grade>(SELECT AVG(Grade) FROM SC WHERE Cno ='c005');
```

1. 使用子查询进行存在性测试通常使用 EXISTS 谓词。
2. 当查询需要列出来自多张表的属性时，必须用多表连接实现。
3. 用子查询进行基于集合测试和比较测试时，先执行子查询，再在子查询结果基础上执行外层查询，这种子查询称为不相关子查询。

```Sql
-- 查询计算机系年龄最大的学生的姓名和年龄（使用 TOP 子句实现）
SELECT TOP 1 WITH TIES Sname, Sage FROM Student WHERE Sdept='计算机系' ORDER BY Sage DESC;

-- 查询 Java 考试成绩高于 Java 平均成绩的学生的姓名、所在系和 Java 成绩（多表连接和子查询混合）
SELECT Sname, Sdept, Grade FROM Student S JOIN SC ON S.Sno = SC.Sno JOIN Course C ON C.Cno = SC.Cno WHERE Cname ='Java' AND Grade > (SELECT AVG(Grade) FROM SC JOIN Course CON C.Cno = SC.Cno WHERE Cname ='Java');
```

1. 同一个查询可以用不同方式实现，多表连接查询效率通常比子查询效率高。
2. 带 EXISTS 谓词的子查询先执行外层查询，由外层查询的值决定内层查询结果，内层查询执行次数由外层查询结果决定。
3. EXISTS 的子查询只能返回真值或假值，在子查询中指定列名通常没有意义，目标列名序列通常用 “*”。当子查询中有满足条件的数据时，EXISTS 返回真值，当子查询中不存在满足条件的数据时，NOT EXISTS 返回真值。

```sql
-- 查询选了“c001”课程的学生姓名（多表连接方式）
SELECT Sname FROM Student JOIN SC ON SC.Sno = Student.Sno WHERE Cno='c001';
-- 查询选了“c001”课程的学生姓名（子查询方式）
SELECT Sname FROM Student WHERE Sno IN (SELECT Sno FROM SC WHERE Cno='c001');
-- 查询选了“c001”课程的学生姓名（带 EXISTS 谓词方式）
SELECT Sname FROM Student WHERE EXISTS (SELECT * FROM SC WHERE Sno = Student.Sno AND Cno='c001');
```

1. 查询没选 “c001” 课程的学生姓名和所在系可以用多种方式实现，包括多表连接、嵌套子查询和相关子查询等。
2. 当子查询中不存在满足条件的记录时，NOT EXISTS 返回真值。

```SQL
-- 用多表连接实现查询没选“c001”课程的学生姓名和所在系
SELECT DISTINCT Sname, Sdept FROM Student S JOIN SC ON S.Sno = SC.Sno WHERE Cno!= 'c001';

-- 用嵌套子查询实现查询没选“c001”课程的学生姓名和所在系
SELECT Sname, Sdept FROM Student WHERE Sno NOT IN (SELECT Sno FROM SC WHERE Cno='c001');

-- 用相关子查询实现查询没选“c001”课程的学生姓名和所在系
SELECT Sname, Sdept FROM Student WHERE NOT EXISTS (SELECT * FROM SC WHERE Sno = Student.Sno AND Cno='c001');
```

1. 通常情况下，对于否定条件的查询应使用子查询实现，且否定应放在外层。
2. 对于多表连接查询，所有条件在连接后的结果表上逐行进行。若否定放在子查询中，结果可能不准确；否定放在外层查询中，结果更符合预期

```sql
-- 查询计算机系没选 Java 课程的学生姓名和性别
SELECT Sname, Ssex FROM Student WHERE Sdept='计算机系' AND Sno NOT IN (SELECT Sno FROM SC JOIN Course ON SC.Cno = Course.Cno WHERE Cname ='Java');
```

### 数据更改

#### 插入数据

1. `INSERT INTO`语句用于向表中插入新记录，可以指定列名后插入对应值，也可以不指定列名按表中列定义顺序插入值。插入的值列表中的值可以是常量也可以是`NULL`值，各值之间用逗号分隔，且值的类型要与对应列的数据类型一致。
2. `UPDATE`语句用于更新表中已有的数据，语法格式为`UPDATE <表名> SET <列名>=表达式[,...n] [WHERE 更新条件]`。`<表名>`给出需要更新数据的表的名称，`SET`子句指定要更新的列和更新后的新值，`WHERE`子句用于指定更改条件，省略`WHERE`子句则无条件更新表中的全部记录。

```SQL
-- 向 Student 表中插入新生记录
INSERT INTO Student VALUES ('1521104', '陈冬', '男', 18, '信息系');

-- 在 SC 表中插入一条新记录，学号为 1521104，课程号为 c001，成绩为 NULL
INSERT INTO SC(Sno, Cno) VALUES('1521104','c001', NULL);
```

#### 更新数据

无条件更新

1. `UPDATE`语句用于更新表中已有的数据，语法格式为`UPDATE <表名> SET <列名>=表达式[,...n] [WHERE 更新条件]`。`<表名>`给出需要更新数据的表的名称，`SET`子句指定要更新的列和更新后的新值，`WHERE`子句用于指定更改条件，省略`WHERE`子句则无条件更新表中的全部记录。

```SQL
-- 将所有学生的年龄加 1
UPDATE Student SET Sage = Sage + 1;
```

有条件更新

```SQL
-- 将计算机系全体学生的成绩加 5 分（用子查询实现）
UPDATE SC SET Grade = Grade + 5 WHERE Sno IN (SELECT Sno FROM Student WHERE Sdept ='计算机系');
-- 将计算机系全体学生的成绩加 5 分（用多表连接实现）
UPDATE SC SET Grade = Grade + 5 FROM SC JOIN Student ON SC.Sno = Student.Sno WHERE Sdept ='计算机系';

-- 将"1512101"学生的年龄改为 21 岁
UPDATE Student SET Sage = 21 WHERE Sno = '1512101';

```

#### 删除数据

无条件删除

```SQL
DELETE FROM SC; -- SC成空表
```

有条件删除

1. `DELETE`语句用于删除数据，语法格式为`DELETE [FROM ]<表名>[WHERE 删除条件]`。`<表名>`说明要删除哪个表中的数据，`WHERE`子句说明要删除表中的哪些记录，省略`WHERE`子句则无条件删除表中的全部记录。
2. 删除数据分为无条件删除和有条件删除，有条件删除同`UPDATE`语句一样，分为基于本表条件的删除和基于其他表条件的删除。

```sql
-- 删除所有不及格学生的选课记录（基于本表）
DELETE FROM SC WHERE Grade < 60;
-- 删除所有不及格学生的选课记录（用多表连接实现）
DELETE FROM SC FROM SC JOIN Student ON SC.Sno = Student.Sno WHERE Sdept='计算机系' AND Grade < 60
-- 删除所有不及格学生的选课记录（用子查询实现）
DELETE FROM SC WHERE Grade < 60 AND Sno IN (SELECT Sno FROM Student WHERE Sdept = '计算机系')
```

### 数据查询

#### 将查询结果保存到新表中

```SQL
SELECT 查询列表序列 INTO <新表名> FROM 数据源
-- 其他行选择、分组等语句

-- 查询计算机系学生的姓名、选的课程名和成绩，并将查询结果保存到永久表S_C_G中。
SELECT Sname, Cname, Grade INTO S_C_G
FROM Students JOIN SC ON s.Sno = SC.Sno
JOIN Course c ON c.Cno = SC.Cno
WHERE Sdept = '计算机系';

-- 统计每个系的学生人数，并将结果保存到永久表dept_cnt中。
SELECT Sdept, COUNT(*) AS 人数 INTO dept_cnt
FROM Student
GROUP BY Sdept;
```

####  CASE 表达式

```sql
-- 查询选修 Java 课程的学生的学号、姓名、所在系和成绩，并对所在系进行如下处理：当所在系为 “计算机系” 时，在查询结果中显示 “CS”；当所在系为 “信息系” 时，在查询结果中显示 “IS”；当所在系为 “数学系” 时，在查询结果中显示 “MA”
SELECT s.Sno学号,Sname姓名,
CASE
  WHEN Sdept = '计算机系' THEN 'CS'
  WHEN Sdept = '信息系' THEN 'IS'
  WHEN Sdept = '数学系' THEN 'MA'
END AS所在系,Grade成绩
FROM Students s JOIN SC ON s.Sno = SC.Sno
JOIN Course c ON c.Cno = SC.Cno
WHERE Cname = 'Java'

-- 查询 “c001” 课程的考试情况，列出学号、成绩以及成绩等级，对成绩等级的处理如下：如果成绩大于等于 90，则等级为 “优”；如果成绩在 80 到 89 之间，则等级为 “良”；如果成绩在 70 到 79 之间，则等级为 “中”；如果成绩在 60 到 69 之间，则等级为 “及格”；如果成绩小于 60，则等级为 “不及格”。
SELECT Sno学号,AVG(Grade)平均成绩,
CASE
  WHEN AVG(Grade) >= 90 THEN '优'
  WHEN AVG(Grade) BETWEEN 80 AND 89 THEN '良'
  WHEN AVG(Grade) BETWEEN 70 AND 79 THEN '中'
  WHEN AVG(Grade) BETWEEN 60 AND 69 THEN '及格'
  WHEN AVG(Grade) < 60 THEN '不及格'
END AS考试情况
FROM SC
WHERE Cno = 'c001'
GROUP BY Sno
```

#### 数据查询的并、交、差操作

- 并运算（`UNION`）可将两个或多个查询语句的结果集合并为一个结果集，这个运算可以使用`UNION`关键字。
- 交运算（`INTERSECT`）可返回两个结果集的交集，这个运算可以使用`INTERSECT`关键字。
- 差运算（`EXCEPT`）可返回在第一个结果集中但不在第二个结果集中的行，这个运算可以使用`EXCEPT`关键字。

```sql
-- 并运算（UNION）示例--查询李勇和刘晨所选的全部课程，列出课程名、学期和开课学期。
SELECT Cname, Semester, SemesterFrom
FROM Course C JOIN SC ON C.Cno = SC.Cno
JOIN Student S ON S.Sno = SC.Sno
WHERE Sname = '李勇'
UNION
SELECT Cname, Semester, SemesterFrom
FROM Course C JOIN SC ON C.Cno = SC.Cno
JOIN Student S ON S.Sno = SC.Sno
WHERE Sname = '刘晨'
-- （交运算）：查询李勇和刘晨所选的相同的课程（即同时被李勇和刘晨选中的课程），列出课程名和学分。
SELECT Cname, Credit
FROM Student JOIN SC ON S.Sno = SC.Sno
JOIN Course C ON C.Cno = SC.Cno
WHERE Sname = '李勇'
INTERSECT
SELECT Cname, Credit
FROM Student JOIN SC ON S.Sno = SC.Sno
JOIN Course C ON C.Cno = SC.Cno
WHERE Sname = '刘晨'
-- （差运算）：题目：查询李勇选了但刘晨没有选的课程的课程名和开课学期。
SELECT C.Cno, Cname, SemesterFrom
FROM Course C JOIN SC ON C.Cno = SC.Cno
JOIN Student S ON S.Sno = SC.Sno
WHERE Sname = '李勇'
EXCEPT
SELECT C.Cno, Cname, SemesterFrom
FROM Course C JOIN SC ON C.Cno = SC.Cno
JOIN Student S ON S.Sno = SC.Sno
WHERE Sname = '刘晨'
```

