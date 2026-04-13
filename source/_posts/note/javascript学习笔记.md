---
title: javascript学习笔记
date: 2025-04-21 15:55:14
updated: 2025-04-21 15:57:31
categories:
  - Wiki
tags:
  - 笔记
wiki: true
top_img: false
permalink: 'wiki/javascript-notes/'
---
### **一、JavaScript 基础语法**

#### **1. 变量与数据类型**

- **变量声明**
    - `var`（函数作用域，可重复声明）
    - `let`（块作用域，不可重复声明）
    - `const`（块作用域，常量，声明时必须初始化）
    - **案例**：
        ```javascript
        const name = "Alice"; // 常量（不可重新赋值）
        let age = 25; // 变量（可更新）
        ```
        
- **数据类型**
    
    - **原始类型**：`string`、`number`、`boolean`、`null`、`undefined`、`symbol`
    - **对象类型**：`Object`、`Array`、`Function`
    - **类型转换**：
        
        ```javascript
        const num = "123";
        const sum = parseInt(num) + 10; // 转为数字 133
        ```
#### **2. 数组与对象**

- **数组操作**
    
    - 常用方法：`push()`、`pop()`、`shift()`、`unshift()`、`slice()`、`splice()`
    - **案例**：生成金字塔结构（freeCodeCamp 项目）
        
        ```javascript
        function buildPyramid(n) {
          const pyramid = [];
          for (let i = 0; i < n; i++) {
            const row = " ".repeat(n - i - 1) + "#".repeat(2 * i + 1);
            pyramid.push(row);
          }
          return pyramid;
        }
        ```
        
- **对象操作**
    
    - 字面量创建：`const person = { name: "Bob", age: 30 };`
    - 属性访问：`person.name` 或 `person["age"]`
    - **案例**：存储用户信息
        
        ```javascript
        const user = {
          id: 1,
          name: "Charlie",
          hobbies: ["reading", "coding"]
        };
        ```
        
#### **3. 流程控制**

- **条件语句**
    
    - `if/else`、`switch`
    - **案例**：判断成绩等级
        
        ```javascript
        const score = 85;
        let grade;
        if (score >= 90) {
          grade = "A";
        } else if (score >= 80) {
          grade = "B";
        } else {
          grade = "C";
        }
        ```
        
- **循环结构**
    
    - `for`、`while`、`do...while`、`for...of`（遍历数组）、`for...in`（遍历对象）
    - **案例**：计算斐波那契数列（递归与循环对比）
        ```javascript
        // 循环实现
        function fibLoop(n) {
          let a = 0, b = 1;
          for (let i = 0; i < n; i++) {
            [a, b] = [b, a + b];
          }
          return a;
        }
        ```
        
#### **4. 函数**

- **定义方式**
    
    - 函数声明：`function add(a, b) { return a + b; }`
    - 函数表达式：`const subtract = function(a, b) { return a - b; }`
    - 箭头函数：`const multiply = (a, b) => a * b;`（适合简洁逻辑）
- **参数与作用域**
    
    - 默认参数：`function greet(name = "Guest") { ... }`
    - 剩余参数：`function sum(...nums) { return nums.reduce((acc, cur) => acc + cur, 0); }`

### **二、JavaScript 进阶特性**

#### **1. 面向对象编程（OOP）**

- **类与对象**
    
    
    ```javascript
    class Animal {
      constructor(name) {
        this.name = name;
      }
      speak() {
        return `${this.name} makes a sound`;
      }
    }
    
    class Dog extends Animal {
      speak() {
        return `${super.speak()} (Woof!)`; // 继承与方法重写
      }
    }
    ```
    
- **原型链**
    
    - 对象方法存储在原型中，避免重复创建（如 `Array.prototype.push`）。
#### **2. 函数式编程（FP）**

- **纯函数**：相同输入必有相同输出，无副作用
    
    ```javascript
    const double = (num) => num * 2; // 纯函数
    ```
    
- **高阶函数**：接收或返回函数
    
    - `map`、`filter`、`reduce` 案例：
        
        ```javascript
        const numbers = [1, 2, 3, 4];
        const doubled = numbers.map(n => n * 2); // [2, 4, 6, 8]
        const evenSum = numbers.filter(n => n % 2 === 0).reduce((acc, cur) => acc + cur, 0); // 6
        ```
        
#### **3. DOM 操作**

- **获取元素**
    
    ```javascript
    const button = document.getElementById("myBtn");
    const listItems = document.querySelectorAll("li");
    ```
    
- **事件处理**
        
    ```javascript
    button.addEventListener("click", () => {
      document.getElementById("text").textContent = "Button clicked!";
    });
    ```
    
#### **4. 异步编程**

- **Promise 与 fetch**
    
    ```javascript
    fetch("https://api.example.com/data")
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error("Error:", error));
    ```
    
- **async/await**
    
    ```javascript
    async function getData() {
      try {
        const response = await fetch("https://api.example.com/data");
        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error("Failed to fetch data");
      }
    }
    ```
    
### **三、项目实践与认证项目**

#### **1. 基础项目（freeCodeCamp 案例）**

- **金字塔生成器**
    
    - 核心知识点：循环、字符串拼接、数组操作
    - 目标：根据输入层数生成由 `#` 组成的金字塔结构。
- **回文检测**
    
    - 核心逻辑：反转字符串并对比
    
    ```javascript
    function isPalindrome(str) {
      const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
      return cleaned === cleaned.split("").reverse().join("");
    }
    ```
    
### **四、工具与调试**

- **浏览器开发者工具**
    
    - `console.log()` 打印变量，`debugger` 语句设置断点。
    - 使用 **Sources** 面板单步调试代码，**Console** 面板测试表达式。
- **本地存储（localStorage）**
    
    ```javascript
    // 存储数据
    localStorage.setItem("userName", "Alice");
    // 获取数据
    const name = localStorage.getItem("userName");
    // 删除数据
    localStorage.removeItem("userName");
    ```

### **五、学习路径建议**

1. **基础阶段**：掌握变量、流程控制、数组 / 对象、函数，完成 “金字塔生成器” 等基础项目。
2. **进阶阶段**：学习 OOP、FP、DOM、异步编程，完成 “购物车”“音乐播放器” 等中级项目。
3. **实战阶段**：攻克认证项目（如回文检测、罗马数字转换器），结合算法题提升逻辑能力。
4. **拓展阶段**：学习 Node.js、前端框架（如 React），尝试全栈项目。