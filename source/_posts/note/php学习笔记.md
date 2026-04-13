---
title: php学习笔记
date: 2025-04-29 17:44:20
updated: 2025-04-29 19:38:12
categories:
  - Wiki
tags:
  - 笔记
wiki: true
top_img: false
permalink: 'wiki/php-notes/'
---
以下是专为 PHP 7.4 初学者设计的全面学习文档，涵盖基础语法、细节语法和进阶语法，结合 PHP 7.4 新特性与实战案例，帮助您系统掌握 PHP 开发：

### 一、基础语法：构建 PHP 编程基石

#### 1. 变量与数据类型

- **变量声明**：使用 $ 符号声明，无需提前指定类型。
```php
$name = "John"; // 字符串
$age = 30;      // 整数
$salary = 5000.5; // 浮点数
```
- **数据类型**：标量（int, float, string, bool）、复合（array, object）、特殊（resource, NULL）。

- **类型强制转换**：

```php
$num = (int) "123"; // 转换为整数
$str = (string) 456; // 转换为字符串
```
#### 2. 运算符与表达式

- **算术运算符**：+, -, *, /, %。

- **比较运算符**：==, ===, >, <, <=, >=。

- **逻辑运算符**：&&, ||, !。

- **三元运算符**：

```php
$status = $isActive ? "Active" : "Inactive";
```

#### 3. 流程控制

- **条件语句**：

```php
if ($age >= 18) {
    echo "成年人";
} elseif ($age >= 13) {
    echo "青少年";
} else {
    echo "儿童";
}
```


```php
// for 循环
for ($i = 0; $i < 5; $i++) {
    echo $i;
}

// while 循环
$j = 0;
while ($j < 5) {
    echo $j++;
}
```

#### 4. 函数基础

- **自定义函数**：

```php
function add($a, $b) {
    return $a + $b;
}
echo add(3, 5); // 输出 8
```

```php
$greet = function($name) {
    echo "Hello, $name!";
};
$greet("Alice"); // 输出 Hello, Alice!
```


### 二、细节语法：深入 PHP 7.4 特性

#### 1. 类型声明（PHP 7.4 增强）

- **标量类型声明**：
```php
declare(strict_types=1); // 开启严格模式

function multiply(int $a, int $b): int {
    return $a * $b;
}
echo multiply(3, "4"); // 严格模式下报错
```

- **联合类型**（PHP 7.4 新增）：

```php
function formatValue(int|string $value): string {
    return "Value: " . $value;
}
echo formatValue(123); // 输出 Value: 123
```

#### 2. 箭头函数（PHP 7.4 新增）

- **简洁语法**：

```php
$numbers = [1, 2, 3, 4];
$squared = array_map(fn($n) => $n ** 2, $numbers);
print_r($squared); // 输出 Array([0] => 1, [1] =>4, [2] =>9, [3] =>16)
```

- **自动捕获父作用域变量**：

```php
$factor = 10;
$nums = array_map(fn($n) => $n * $factor, [1, 2, 3]);
print_r($nums); // 输出 Array([0] =>10, [1] =>20, [2] =>30)
```

#### 3. 类型属性（PHP 7.4 新增）

- **类属性类型声明**：

```php
class User {
    public int $id;
    public string $name;
    protected ?string $email = null;
}

$user = new User();
$user->id = 1;       // 合法
$user->name = "Bob"; // 合法
$user->email = "bob@example.com"; // 合法
$user->email = null; // 合法（允许 null）
```

#### 4. 空合并运算符（??）与空合并赋值运算符（??=）

- **空值处理**：

```php
$username = $_GET['user'] ?? "Guest"; // 若 $_GET['user'] 不存在，默认 "Guest"
$this->data['comments'] ??= []; // 若 $this->data['comments'] 为 null，赋值为空数组
```

### 三、进阶语法：提升代码质量与效率

#### 1. 面向对象编程（OOP）

- **类与对象**：

```php
class Car {
    public string $model;
    private int $year;

    public function __construct(string $model, int $year) {
        $this->model = $model;
        $this->year = $year;
    }

    public function getInfo(): string {
        return "{$this->model} ({$this->year})";
    }
}

$car = new Car("Toyota", 2020);
echo $car->getInfo(); // 输出 Toyota (2020)
```

- **继承与多态**：

```php
class ElectricCar extends Car {
    public function charge(): void {
        echo "Charging...";
    }
}
```

#### 2. 命名空间与自动加载

- **命名空间声明**：
```php
namespace App\Controllers;

class HomeController {
    // 控制器逻辑
}
```

- **自动加载（Composer）**：

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    }
}
```

#### 3. 异常处理

- **异常捕获与抛出**：

```php
try {
    if (!file_exists("data.txt")) {
        throw new Exception("文件不存在");
    }
} catch (Exception $e) {
    echo "错误：" . $e->getMessage();
}
```

#### 4. 文件操作与安全性

- **文件读写**：

```php
// 读取文件
$content = file_get_contents("data.txt");

// 写入文件
file_put_contents("log.txt", "日志信息\n", FILE_APPEND);
```

- **安全防护**：

```php
// 输入过滤
$username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);

// 输出转义
echo htmlspecialchars($username);
```

#### 5. 数据库操作（MySQLi 预处理语句）

- **连接数据库**：

```php
$mysqli = new mysqli("localhost", "user", "pass", "db");
if ($mysqli->connect_error) {
    die("连接失败：" . $mysqli->connect_error);
}
```

- **预处理语句**：

```php
$stmt = $mysqli->prepare("INSERT INTO users (name, email) VALUES (?, ?)");
$stmt->bind_param("ss", $name, $email);
$name = "Alice";
$email = "alice@example.com";
$stmt->execute();
```

### 四、PHP 7.4 新特性深度解析

#### 1. 箭头函数的应用场景

- **数组处理**：

```php
$users = [
    ["name" => "John", "age" => 30],
    ["name" => "Jane", "age" => 25]
];

$names = array_map(fn($user) => $user['name'], $users);
print_r($names); // 输出 Array([0] => John, [1] => Jane)
```

#### 2. 类型属性的注意事项

- **默认值设置**：

```php
class Product {
    public float $price = 0.0; // 非空类型需设置默认值
    public ?string $description = null; // 允许 null
}
```

#### 3. 协变返回与逆变参数（PHP 7.4 新增）

- **协变返回**：

```php
interface Animal {
    public function makeSound(): string;
}

class Dog implements Animal {
    public function makeSound(): string {
        return "Woof!";
    }
}

class Cat implements Animal {
    public function makeSound(): string {
        return "Meow!";
    }
}

function getAnimal(): Animal {
    return new Dog(); // 协变返回更具体的类型
}
```

### 五、学习资源推荐

1. **官方文档**：[PHP 官方手册](https://www.php.net/manual/zh/)

2. **在线教程**：[PHP 中文网](https://m.php.cn/)、[W3Schools](https://www.w3schools.com/php/)

3. **书籍**：《PHP 和 MySQL Web 开发》、《PHP: The Right Way》

4. **实战项目**：[GitHub PHP 项目](https://github.com/topics/php)

### 六、学习路线建议

1. **阶段一（基础）**：掌握变量、运算符、流程控制、函数。

2. **阶段二（进阶）**：学习面向对象、命名空间、异常处理。

3. **阶段三（实战）**：结合数据库操作、文件处理、安全性开发完整项目。

4. **阶段四（优化）**：深入 PHP 7.4 新特性，提升代码效率与可维护性。


