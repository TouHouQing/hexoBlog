---
title: TypeScript学习笔记（上手vue3版）
date: 2025-04-22 15:22:21
updated: 2025-04-22 15:34:26
categories:
  - Wiki
tags:
  - 笔记
wiki: true
top_img: false
permalink: 'wiki/typescript-vue3-notes/'
---
### **一、TS 基础类型（Vue 3 必备）**

#### 1. 基础类型

TypeScript 提供了丰富的基础类型，用于变量声明，明确变量的类型，提高代码的可读性和可维护性。

1. **基本类型**
    
    - **number（数字）**：用于表示整数和浮点数。
    
    ```typescript
    let num: number = 10;
    let floatNum: number = 3.14;
    ```
    
    - **string（字符串）**：表示文本数据。
    
    ```typescript
    let str: string = "Hello, TypeScript";
    ```
    
    - **boolean（布尔）**：只有两个值 `true` 和 `false`。
    
    ```typescript
    let isDone: boolean = false;
    ```
    
      
2. **特殊类型**
    
    - **any（任意类型）**：当不确定变量的具体类型时使用，它可以是任何类型的值。
    
    ```typescript
    let anyValue: any = "可以是字符串";
    anyValue = 123; // 也可以是数字
    ```
    
    - **void（无类型）**：通常用于函数没有返回值的情况。
    
    ```typescript
    function logMessage(): void {
        console.log("这是一条日志信息");
    }
    ```
    
    - **null 和 undefined**：它们既是类型，也是值。`null` 表示有意的空值，`undefined` 表示变量已声明但未赋值。
    
    ```typescript
    let nullValue: null = null;
    let undefinedValue: undefined = undefined;
    ```
    
#### 2. **函数类型注解**

- **参数与返回值类型**：
    
    ```typescript
    // 加法函数：参数为 number，返回值为 number
    function add(a: number, b: number): number {  
      return a + b;  
    }  
    ```
    
- **可选参数与默认值**：
    
    ```typescript
    function greet(name: string, msg?: string): string {  
      return msg ? `${msg}, ${name}` : `Hello, ${name}`;  
    }  
    greet("Alice", "Hi"); // 输出："Hi, Alice"  
    ```
    
#### 3. **接口（`interface`）与类型别名（`type`）**

- **接口：定义对象结构（常用于 Vue 3 的 `props`、状态等）**
    
    ```typescript
    // 定义用户接口
    interface User {  
      id: number;  
      name: string;  
      age?: number; // 可选属性  
      sayHi(): string; // 方法  
    }  
    ```
    
- **类型别名：复用复杂类型（如联合类型、函数类型）**
    
    ```typescript
    // 联合类型别名
    type StrOrNum = string | number;  
    // 函数类型别名
    type Callback = (data: any) => void;  
    ```
    
#### 4. **联合类型与交叉类型**

- **联合类型（`|`）**：表示取值可以是多种类型之一
    
    ```typescript
    let input: string | number;  
    input = "hello"; // 合法  
    input = 123; // 合法  
    ```
    
- **交叉类型（`&`）**：表示同时具备多种类型的特性
    
    ```typescript
    interface A { name: string; }  
    interface B { age: number; }  
    type AB = A & B; // AB 类型同时拥有 name 和 age 属性  
    const obj: AB = { name: "John", age: 30 };  
    ```
    
#### 4. **泛型（`Generics`）**

- **定义通用函数 / 组件，动态指定类型**
    ```typescript
    // 泛型函数：返回参数本身
    function identity<T>(arg: T): T {  
      return arg;  
    }  
    const str = identity<string>("Vue3"); // 类型推导为 string  
    const num = identity<number>(123); // 类型推导为 number  
    ```
    
- **在 Vue 3 中的应用**：自定义 Hook 或工具函数
    
    ```typescript
    // 通用响应式数据 Hook
    function useState<T>(initialValue: T) {  
      const state = ref(initialValue);  
      return { state, update: (val: T) => (state.value = val) };  
    }  
    const { state, update } = useState<string>("initial");  
    ```
    
### **三、Vue 3 与 TypeScript 集成关键**

#### 1. **组合式 API（Composition API）的类型支持**

- **`ref` 和 `reactive` 的类型推断**
    
    ```typescript
    import { ref, reactive } from "vue";  
    // ref 自动推断类型为 number  
    const count = ref(0);  
    count.value++; // 正确写法  
    // reactive 需手动指定类型或通过接口推断  
    interface State {  
      name: string;  
      age: number;  
    }  
    const state = reactive<State>({ name: "Alice", age: 28 });  
    ```
    
- **`setup` 函数的类型声明**
    
    ```typescript
    import { defineComponent } from "vue";  
    export default defineComponent({  
      setup() {  
        // 显式声明返回值类型（可选，但推荐复杂场景使用）  
        return {  
          count: ref(0),  
        } as { count: Ref<number> };  
      },  
    });  
    ```
    
#### 2. **组件 `props` 和 `emits` 的类型安全**

- **使用 `defineProps` 声明 Prop 类型**
    
    ```typescript
    // 方式1：接口 + defineProps  
    interface Props {  
      title: string;  
      isDisabled?: boolean;  
    }  
    export default defineComponent({  
      props: ["title", "isDisabled"], // 需与接口字段一致  
      setup(props) {  
        // props 自动推断为 Props 类型  
        console.log(props.title); // 类型为 string  
        return {};  
      },  
    });  
    // 方式2：类型字面量直接声明（推荐简洁场景）  
    const props = defineProps<{  
      title: string;  
      count: number[];  
    }>();  
    ```
    
- **使用 `defineEmits` 声明自定义事件类型**
    
    ```typescript
    // 方式1：枚举定义事件名  
    enum EventNames {  
      Click = "click",  
      Submit = "submit",  
    }  
    const emits = defineEmits<{  
      [EventNames.Click](id: number): void;  
      [EventNames.Submit](data: object): void;  
    }>();  
    // 触发事件时类型检查  
    emits(EventNames.Click, 123); // 合法  
    emits(EventNames.Submit, "wrong data"); // 报错：参数类型应为 object  
    ```
    
#### 3. **计算属性（`computed`）与监听器（`watch`）**

- **计算属性的类型推断**
        
    ```typescript
    import { ref, computed } from "vue";  
    const count = ref(0);  
    const doubleCount = computed(() => count.value * 2);  
    // doubleCount 的类型为 ComputedRef<number>  
    ```

- **监听器的类型声明**
    
    ```typescript
    import { ref, watch } from "vue";  
    const state = ref({ name: "John", age: 30 });  
    watch(  
      state,  
      (newVal, oldVal) => {  
        // newVal 和 oldVal 类型均为 { name: string; age: number; }  
        console.log(newVal.age);  
      },  
      { deep: true }  
    );  
    ```
    
#### 4. **模板引用（`ref`）的类型标注**

- 在模板中使用 `ref` 绑定 DOM 元素或子组件：
    
    
    ```vue
    <template>  
      <input ref="inputRef" type="text">  
      <ChildComponent ref="childRef" />  
    </template>  
    <script setup lang="ts">  
    import { ref } from "vue";  
    // 标注 input 为 HTMLInputElement 类型  
    const inputRef = ref<HTMLInputElement>(null);  
    // 标注子组件为具体组件类型  
    interface ChildComponent {  
      getValue(): string;  
    }  
    const childRef = ref<ChildComponent>(null);  
    // 使用时自动类型提示  
    inputRef.value?.focus();  
    childRef.value?.getValue();  
    </script>  
    ```
    
      
#### 5. **Provide/Inject 的类型安全**

- 在父组件中提供数据：
    
    
    ```typescript
    // parent.vue  
    import { provide } from "vue";  
    interface Theme {  
      color: string;  
      size: "small" | "large";  
    }  
    const theme = reactive<Theme>({ color: "blue", size: "large" });  
    provide("theme", theme);  
    ```
    
- 在子组件中注入数据：
    
    
    ```typescript
    // child.vue  
    import { inject } from "vue";  
    const theme = inject<Theme>("theme");  
    // theme 类型为 Theme | undefined，需处理非空情况  
    if (theme) {  
      console.log(theme.color);  
    }  
    ```
    
### **四、Vue 3 生态集成（TS 最佳实践）**

#### 1. **Vue Router 的类型支持**

- **路由参数类型推断**
    
    ```typescript
    // router.ts  
    import { createRouter, createWebHistory } from "vue-router";  
    const routes = [  
      { path: "/user/:id", component: UserComponent },  
    ];  
    const router = createRouter({  
      history: createWebHistory(),  
      routes,  
    });  
    // 在组件中获取参数类型  
    const route = useRoute();  
    // route.params.id 自动推断为 string 类型  
    console.log(route.params.id);  
    ```
    
#### 2. **Pinia 状态管理的类型安全**

- **定义 Store 接口**
    
    ```typescript
    // store/userStore.ts  
    import { defineStore } from "pinia";  
    interface UserState {  
      name: string;  
      age: number;  
    }  
    export const useUserStore = defineStore<"user", UserState, {}, {  
      setName(name: string): void;  
    }>("user", {  
      state: () => ({ name: "Guest", age: 0 }),  
      actions: {  
        setName(name: string) {  
          this.name = name;  
        },  
      },  
    });  
    // 使用时自动类型提示  
    const userStore = useUserStore();  
    userStore.setName("Alice");  
    ```
    
      
#### 3. **自定义 Hook 的类型声明**

- **创建带类型的 Hook**
    
    ```typescript
    // hooks/useMousePosition.ts  
    import { ref, Ref } from "vue";  
    type MousePosition = { x: number; y: number };  
    function useMousePosition(): Ref<MousePosition> {  
      const position = ref<MousePosition>({ x: 0, y: 0 });  
      onMounted(() => {  
        window.addEventListener("mousemove", (e) => {  
          position.value = { x: e.clientX, y: e.clientY };  
        });  
      });  
      return position;  
    }  
    // 在组件中使用  
    const mousePos = useMousePosition();  
    // mousePos.value 类型为 MousePosition  
    console.log(mousePos.value.x);  
    ```
    
    
### **五、关键工具与配置**

#### 1. **Vue 3 + TS 项目初始化**

- 使用 `vite` 创建 TS 项目：
    
    ```bash
    npm create vite@latest my-vue3-ts-app -- --template vue-ts  
    cd my-vue3-ts-app  
    npm install  
    npm run dev  
    ```
    
#### 2. **TS 配置文件（`tsconfig.json`）**

- 关键配置（Vue 3 推荐）：

    ```json
    {  
      "compilerOptions": {  
        "target": "ESNext",  
        "module": "ESNext",  
        "moduleResolution": "Node",  
        "jsx": "VueJSX", // 支持 JSX 语法（如 Vue 3 模板中的表达式）  
        "strict": true, // 开启严格类型检查  
        "esModuleInterop": true,  
        "skipLibCheck": true,  
        "forceConsistentCasingInFileNames": true  
      },  
      "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],  
      "references": [{ "path": "./tsconfig.node.json" }]  
    }  
    ```
    
#### 3. **类型声明文件（`.d.ts`）**

- 为 Vue 3 插件或全局变量添加类型声明（如 `src/shims-vue.d.ts`）：
    
    ```typescript
    declare module "vue" {  
      interface ComponentCustomProperties {  
        $http: (url: string) => Promise<any>; // 全局属性类型声明  
      }  
    }  
    // 声明 .vue 文件的类型  
    declare module "*.vue" {  
      import type { DefineComponent } from "vue";  
      const component: DefineComponent<{}, {}, any>;  
      export default component;  
    }  
    ```
    
### **六、常见错误与解决方案**

1. **`ref` 值未初始化**
    
    - 错误：`Cannot read property 'value' of null`
    - 解决：声明时指定初始值或添加非空断言（`!`）
        
        ```typescript
        const inputRef = ref<HTMLInputElement>(null);  
        // 非空断言（确保在使用时已挂载）  
        inputRef.value!.focus();  
        ```
        
2. **Prop 类型不匹配**
    
    - 错误：`Type 'string' is not assignable to type 'number'`
    - 解决：检查 `defineProps` 声明与父组件传递的类型是否一致
3. **泛型参数缺失**
    
    - 错误：`Type 'unknown' is not assignable to type 'string'`
    - 解决：显式指定泛型参数
        
        ```typescript
        const list = ref([] as string[]); // 显式声明数组元素类型为 string  
        ```
        
### **七、学习资源推荐**

1. **官方文档**
    - [TypeScript 官方文档](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)
    - [Vue 3 + TypeScript 官方指南](https://vuejs.org/guide/typescript/overview.html)
2. **实战项目**
    - [Vue 3 + TS 官方示例](https://github.com/vuejs/vue-next/tree/master/examples/typescript)
    - [Pinia + TS 最佳实践](https://pinia.vuejs.org/guide/typescript.html)
3. **工具链**
    - [TypeScript Playground](https://www.typescriptlang.org/play)：在线调试 TS 代码
    - [Vue Language Server](https://marketplace.visualstudio.com/items?itemName=Vue.volar)：VSCode 中 Vue + TS 的最佳插件

### **总结：快速上手路径**

1. **2 小时掌握核心**：通读本笔记，理解基础类型、接口、泛型、Vue 3 组件的 `props`/`emits` 类型声明。
2. **1 天实战开发**：用 `vite` 创建 Vue 3 + TS 项目，实现一个带表单验证的组件（结合 `ref`、`computed`、类型断言）。
3. **3 天深入生态**：学习 Vue Router、Pinia 的 TS 用法，完成一个简单的单页应用（如博客列表 + 用户状态管理）。