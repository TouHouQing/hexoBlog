---
title: vue3学习笔记
date: 2025-04-18 18:06:19
updated: 2025-04-18 18:35:36
categories:
  - Wiki
tags:
  - 笔记
wiki: true
top_img: false
permalink: 'wiki/vue3-notes/'
---
## 属性绑定
### 1. 基本语法

在 Vue 3 里，使用 `:` 或者 `v-bind:` 来进行属性绑定。这两种写法是等价的，`:` 是 `v-bind:` 的缩写形式。以下是示例代码：


```vue
<template>
  <!-- 使用缩写形式 -->
  <img :src="imageUrl" alt="An example image">
  <!-- 使用完整形式 -->
  <a v-bind:href="linkUrl">Click me</a>
</template>

<script setup>
import { ref } from 'vue';

// 定义响应式数据
const imageUrl = ref('https://example.com/image.jpg');
const linkUrl = ref('https://example.com');
</script>
```

  

在上述代码中，`imageUrl` 和 `linkUrl` 是响应式数据，当它们的值发生变化时，对应的 `src` 和 `href` 属性也会随之更新。

### 2. 绑定布尔属性

对于布尔属性（如 `disabled`、`checked` 等），属性的存在与否代表 `true` 或 `false`。可以根据表达式的值来动态添加或移除这些属性。示例如下：

```vue
<template>
  <button :disabled="isButtonDisabled">Click me</button>
</template>

<script setup>
import { ref } from 'vue';

// 定义响应式数据
const isButtonDisabled = ref(true);
</script>
```


在这个例子中，当 `isButtonDisabled` 的值为 `true` 时，`disabled` 属性会被添加到 `button` 元素上，按钮变为不可用状态；当 `isButtonDisabled` 的值为 `false` 时，`disabled` 属性会被移除，按钮变为可用状态。

### 3. 绑定动态属性名

在某些情况下，你可能需要动态地绑定属性名。可以使用方括号 `[]` 来实现动态属性名绑定。示例如下：


```vue
<template>
  <div :[dynamicAttribute]="dynamicValue">This is a div</div>
</template>

<script setup>
import { ref } from 'vue';

// 定义响应式数据
const dynamicAttribute = ref('title');
const dynamicValue = ref('This is a dynamic title');
</script>
```

  

在这个例子中，`dynamicAttribute` 的值决定了要绑定的属性名，`dynamicValue` 的值决定了属性的值。这里最终会将 `title` 属性绑定到 `div` 元素上，其值为 `This is a dynamic title`。

### 4. 绑定样式和类

#### 绑定内联样式

可以使用 `:style` 指令来绑定内联样式。可以绑定一个对象，对象的键是 CSS 属性名，值是对应的 CSS 属性值。示例如下：

```vue
<template>
  <div :style="{ color: textColor, fontSize: fontSize + 'px' }">This is a styled div</div>
</template>

<script setup>
import { ref } from 'vue';

// 定义响应式数据
const textColor = ref('red');
const fontSize = ref(16);
</script>
```

  

在这个例子中，`textColor` 和 `fontSize` 是响应式数据，当它们的值发生变化时，`div` 元素的 `color` 和 `font-size` 样式也会随之更新。

#### 绑定类名

可以使用 `:class` 指令来绑定类名。可以绑定一个对象或数组。

- **对象语法**：根据对象的键值对来动态添加或移除类名。键是类名，值是一个布尔值，表示是否添加该类名。示例如下：

```vue
<template>
  <div :class="{ active: isActive, 'text-danger': hasError }">This is a div with dynamic classes</div>
</template>

<script setup>
import { ref } from 'vue';

// 定义响应式数据
const isActive = ref(true);
const hasError = ref(false);
</script>
```


在这个例子中，当 `isActive` 为 `true` 时，`active` 类会被添加到 `div` 元素上；当 `hasError` 为 `true` 时，`text-danger` 类会被添加到 `div` 元素上。

- **数组语法**：根据数组中的元素来添加类名。数组中的元素可以是字符串或对象。示例如下：

```vue
<template>
  <div :class="[activeClass, { 'text-danger': hasError }]">This is a div with dynamic classes</div>
</template>

<script setup>
import { ref } from 'vue';

// 定义响应式数据
const activeClass = ref('active');
const hasError = ref(false);
</script>
```

  

在这个例子中，`activeClass` 对应的值会作为类名添加到 `div` 元素上，同时根据 `hasError` 的值决定是否添加 `text-danger` 类名。

### 5. 绑定多个属性

可以使用 `v-bind` 指令绑定一个包含多个属性的对象，一次性绑定多个属性。示例如下：

```vue
<template>
  <img v-bind="imageAttrs" alt="An example image">
</template>

<script setup>
import { ref } from 'vue';

// 定义响应式数据
const imageAttrs = ref({
  src: 'https://example.com/image.jpg',
  width: 200,
  height: 200
});
</script>
```

在这个例子中，`imageAttrs` 对象中的 `src`、`width` 和 `height` 属性会被绑定到 `img` 元素上。


## 条件渲染

### v-if 指令

`v-if` 指令用于根据表达式的真假来决定是否渲染元素或组件。如果表达式的值为 `true`，则元素或组件会被渲染到 DOM 中；如果为 `false`，则元素或组件不会被渲染，甚至不会在 DOM 中存在。
#### 基本用法


```vue
<template>
  <div>
    <h1 v-if="isShow">This is a heading</h1>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isShow = ref(true);
</script>
```


在上述例子中，只有当 `isShow` 的值为 `true` 时，`<h1>` 元素才会被渲染到页面上。

#### 多个元素的条件渲染

你可以使用 `<template>` 标签来包裹多个元素，并在其上使用 `v-if` 指令。这样可以根据条件一次性渲染或不渲染多个元素。


```vue
<template>
  <div>
    <template v-if="isShow">
      <h1>Heading 1</h1>
      <p>Paragraph 1</p>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isShow = ref(true);
</script>
```

#### v-else 和 v-else-if

`v-else` 和 `v-else-if` 指令可以与 `v-if` 一起使用，用于创建多个条件分支。


```vue
<template>
  <div>
    <h1 v-if="condition === 1">Condition 1</h1>
    <h1 v-else-if="condition === 2">Condition 2</h1>
    <h1 v-else>Other Condition</h1>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const condition = ref(2);
</script>
```

### v-show 指令

`v-show` 指令也用于根据条件显示或隐藏元素，但它与 `v-if` 不同的是，无论条件真假，元素始终会被渲染到 DOM 中，只是通过 CSS 的 `display` 属性来控制其显示或隐藏。

#### 基本用法


```vue
<template>
  <div>
    <h1 v-show="isShow">This is a heading</h1>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isShow = ref(true);
</script>
```

在上述例子中，无论 `isShow` 的值是 `true` 还是 `false`，`<h1>` 元素都会存在于 DOM 中，只是当 `isShow` 为 `false` 时，它的 `display` 属性会被设置为 `none`，从而在页面上隐藏。
### v-if 和 v-show 的区别

- **渲染方式**：
    - `v-if` 是根据条件的真假来决定是否渲染元素，条件为 `false` 时，元素不会出现在 DOM 中。
    - `v-show` 则是始终渲染元素，只是通过 CSS 控制其显示或隐藏。
- **性能**：
    - `v-if` 有更高的切换开销，因为它需要在 DOM 中添加或移除元素。
    - `v-show` 有更高的初始渲染开销，因为它不管条件如何都会渲染元素。
- **使用场景**：
    - 当条件在运行时很少改变时，使用 `v-if` 更合适。
    - 当条件频繁切换时，使用 `v-show` 更合适。



## 列表渲染

### 1. 使用 `v-for` 指令渲染数组

`v-for` 指令是 Vue 用于列表渲染的核心指令，可基于数组元素的数量来创建多个元素。其基本语法为 `item in items`，这里的 `items` 是数组，`item` 是数组中的每个元素。


```vue
<template>
  <ul>
    <li v-for="item in items" :key="item.id">{{ item.name }}</li>
  </ul>
</template>

<script setup>
import { ref } from 'vue';

const items = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' }
]);
</script>
```

在上述示例中，`v-for` 指令会遍历 `items` 数组，为每个元素创建一个 `<li>` 元素，并且使用 `:key` 绑定每个元素的 `id` 作为唯一标识，这有助于 Vue 更高效地更新 DOM。

### 2. 获取索引

在 `v-for` 里，还能获取当前元素的索引，语法为 `(item, index) in items`。


```vue
<template>
  <ul>
    <li v-for="(item, index) in items" :key="item.id">
      {{ index }} - {{ item.name }}
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue';

const items = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' }
]);
</script>
```

此例中，`index` 表示当前元素在数组中的索引，从 0 开始。

### 3. 渲染对象

`v-for` 也可用于遍历对象的属性，语法有多种形式。

#### 遍历对象的属性值

```vue
<template>
  <ul>
    <li v-for="value in myObject" :key="value">{{ value }}</li>
  </ul>
</template>

<script setup>
import { ref } from 'vue';

const myObject = ref({
  name: 'John',
  age: 30,
  city: 'New York'
});
</script>
```

这里 `value` 代表对象的每个属性值。
#### 同时获取属性名和属性值

```vue
<template>
  <ul>
    <li v-for="(value, key) in myObject" :key="key">
      {{ key }}: {{ value }}
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue';

const myObject = ref({
  name: 'John',
  age: 30,
  city: 'New York'
});
</script>
```

在这个例子中，`key` 是对象的属性名，`value` 是对应的属性值。

#### 同时获取属性名、属性值和索引


```vue
<template>
  <ul>
    <li v-for="(value, key, index) in myObject" :key="key">
      {{ index }} - {{ key }}: {{ value }}
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue';

const myObject = ref({
  name: 'John',
  age: 30,
  city: 'New York'
});
</script>
```


`index` 表示当前属性在对象中的索引。

### 4. `:key` 的重要性

在使用 `v-for` 时，建议为每个被渲染的元素提供一个唯一的 `:key`。`key` 能帮助 Vue 识别每个元素，从而在数据发生变化时更高效地更新 DOM。通常使用元素的唯一标识（如 `id`）作为 `key`。

### 5. 维护状态

Vue 默认采用 “就地更新” 策略，若数据项的顺序发生改变，Vue 不会移动 DOM 元素来匹配数据项的顺序，而是就地更新每个元素。但当需要维护元素的状态（如输入框的值）时，提供唯一的 `:key` 可确保元素被正确复用和排序。

### 6. 过滤和排序

若要对渲染的列表进行过滤或排序，可使用计算属性。


```vue
<template>
  <ul>
    <li v-for="item in filteredItems" :key="item.id">{{ item.name }}</li>
  </ul>
</template>

<script setup>
import { ref, computed } from 'vue';

const items = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' }
]);

const filteredItems = computed(() => {
  return items.value.filter(item => item.name.includes('a'));
});
</script>
```

在这个示例中，`filteredItems` 是一个计算属性，它过滤出 `name` 中包含字母 `a` 的元素。


## key管理状态

### 1. `key` 的作用原理

Vue 在更新使用 `v-for` 渲染的元素列表时，默认采用 “就地更新” 策略。也就是说，当数据项的顺序发生改变时，Vue 不会移动 DOM 元素来匹配数据项的新顺序，而是简单地复用原有的每个元素，并就地更新它们的内容。这种策略在很多情况下是高效的，但当需要维护元素的状态（如输入框的值、元素的动画状态等）时，就可能会出现问题。

而给每个元素绑定一个唯一的 `key`，Vue 就可以根据 `key` 来跟踪每个元素的身份，从而在数据发生变化时准确地知道哪些元素被添加、移除或移动了，进而正确地复用和重新排序这些元素，保证元素状态的正确维护。
### 2. 示例场景：不使用 `key` 导致的状态问题

以下是一个不使用 `key` 的简单示例：


```vue
<template>
  <div>
    <button @click="reverseList">Reverse List</button>
    <ul>
      <li v-for="item in items">
        <input type="text" :value="item">
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const items = ref(['A', 'B', 'C']);

const reverseList = () => {
  items.value = [...items.value].reverse();
};
</script>
```

在这个示例中，点击 “Reverse List” 按钮会反转 `items` 数组的顺序。由于没有给 `<li>` 元素提供 `key`，Vue 会采用就地更新策略，输入框的值不会随着列表项的顺序改变而正确更新，可能会导致输入框的值与列表项不匹配。

### 3. 使用 `key` 解决状态问题

为每个元素添加唯一的 `key` 可以解决上述问题，保证元素状态的正确维护。

```vue
<template>
  <div>
    <button @click="reverseList">Reverse List</button>
    <ul>
      <li v-for="item in items" :key="item">
        <input type="text" :value="item">
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const items = ref(['A', 'B', 'C']);

const reverseList = () => {
  items.value = [...items.value].reverse();
};
</script>
```


在这个示例中，我们为 `<li>` 元素绑定了 `:key="item"`，这里假设 `item` 是唯一的。当点击 “Reverse List” 按钮时，Vue 会根据 `key` 识别每个元素，正确地移动 DOM 元素，从而保证输入框的值与列表项的顺序一致。

### 4. `key` 的选择原则

- **唯一性**：`key` 必须是唯一的，确保每个元素都有一个独一无二的标识。通常可以使用数据项的 ID 作为 `key`，例如从数据库中获取的数据通常都有唯一的 ID。


```vue
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue';

const items = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' }
]);
</script>
```


- **稳定性**：`key` 应该是稳定的，避免使用索引作为 `key`（除非你能保证数据项的顺序不会改变）。因为当数据项的顺序发生改变时，索引也会随之改变，这可能会导致 `key` 不再唯一，从而引发状态管理问题。

### 5. 多节点过渡和动画中的 `key`

在使用过渡和动画时，`key` 同样非常重要。例如，在使用 `<transition-group>` 组件进行列表过渡时，必须为每个子元素提供 `key`，这样 Vue 才能正确地识别和处理元素的进入和离开动画。

```vue
<template>
  <div>
    <button @click="addItem">Add Item</button>
    <transition-group name="fade">
      <span v-for="item in items" :key="item" class="item">{{ item }}</span>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const items = ref(['A', 'B', 'C']);

const addItem = () => {
  items.value.push(String.fromCharCode(items.value.length + 65));
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```


在这个示例中，`<transition-group>` 组件用于实现列表项的淡入淡出动画，每个 `<span>` 元素都绑定了唯一的 `key`，确保动画能够正确执行。


## 事件处理
### 1. 基本事件绑定

使用 `v-on` 指令（缩写为 `@`）来监听 DOM 事件。可以在模板中直接绑定事件监听器到元素上，并指定要执行的方法。


```vue
<template>
  <button @click="handleClick">Click me</button>
</template>

<script setup>
const handleClick = () => {
  console.log('Button clicked!');
};
</script>
```


在上述代码中，`@click` 监听按钮的点击事件，当按钮被点击时，会调用 `handleClick` 方法。

### 2. 传递参数

如果需要在事件处理方法中传递参数，可以在模板中调用方法并传入参数。



```vue
<template>
  <button @click="handleClick('Hello, Vue!')">Click me</button>
</template>

<script setup>
const handleClick = (message) => {
  console.log(message);
};
</script>
```


这里，当按钮被点击时，`handleClick` 方法会接收到传递的 `'Hello, Vue!'` 参数。

### 3. 访问原生事件对象

如果需要访问原生的 DOM 事件对象，可以使用 `$event` 特殊变量。


```vue
<template>
  <button @click="handleClick($event)">Click me</button>
</template>

<script setup>
const handleClick = (event) => {
  console.log('Event target:', event.target);
};
</script>
```


在 `handleClick` 方法中，通过 `event` 参数可以访问到原生的事件对象，进而获取事件的相关信息，如事件目标元素等。

### 4. 事件修饰符

Vue 提供了一些事件修饰符，用于简化事件处理逻辑，它们可以串联使用。

#### `.stop`

阻止事件冒泡，即防止事件传播到父元素。



```vue
<template>
  <div @click="parentClick">
    <button @click.stop="childClick">Click me</button>
  </div>
</template>

<script setup>
const parentClick = () => {
  console.log('Parent clicked');
};

const childClick = () => {
  console.log('Child clicked');
};
</script>
```

  

在这个例子中，点击按钮时，`childClick` 方法会被调用，但事件不会传播到父元素触发 `parentClick` 方法。

#### `.prevent`

阻止事件的默认行为，例如表单提交时的页面刷新。


```vue
<template>
  <form @submit.prevent="handleSubmit">
    <input type="text" />
    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
const handleSubmit = () => {
  console.log('Form submitted');
};
</script>
```

  

这里，点击提交按钮时，表单不会触发默认的提交行为，而是执行 `handleSubmit` 方法。

#### `.capture`

使用事件捕获模式，即事件会从外层元素开始触发，而不是默认的从内层元素开始。


```vue
<template>
  <div @click.capture="parentClick">
    <button @click="childClick">Click me</button>
  </div>
</template>

<script setup>
const parentClick = () => {
  console.log('Parent clicked in capture mode');
};

const childClick = () => {
  console.log('Child clicked');
};
</script>
```

  

点击按钮时，会先触发父元素的 `parentClick` 方法，再触发按钮的 `childClick` 方法。

#### `.self`

只当事件是从绑定元素本身触发时才会触发事件处理函数，而不是从其子元素触发。


```vue
<template>
  <div @click.self="parentClick">
    <button @click="childClick">Click me</button>
  </div>
</template>

<script setup>
const parentClick = () => {
  console.log('Parent clicked by itself');
};

const childClick = () => {
  console.log('Child clicked');
};
</script>
```

  

点击按钮时，不会触发父元素的 `parentClick` 方法，只有直接点击父元素时才会触发。

#### `.once`

事件只触发一次，之后再触发该事件将不再执行事件处理函数。

 

```vue
<template>
  <button @click.once="handleClick">Click me once</button>
</template>

<script setup>
const handleClick = () => {
  console.log('Button clicked once');
};
</script>
```

  

第一次点击按钮时，`handleClick` 方法会被调用，之后再次点击按钮则不会再执行该方法。

### 5. 按键修饰符

在处理键盘事件时，Vue 提供了一些按键修饰符，方便监听特定的按键。

  

```vue
<template>
  <input @keyup.enter="handleEnterKey" />
</template>

<script setup>
const handleEnterKey = () => {
  console.log('Enter key pressed');
};
</script>
```

  

这里，`@keyup.enter` 监听输入框的按键抬起事件，只有当按下回车键并抬起时，才会调用 `handleEnterKey` 方法。

### 6. 自定义事件

在组件中，除了监听原生 DOM 事件，还可以自定义事件。子组件可以通过 `$emit` 触发自定义事件，父组件可以监听这些事件并执行相应的逻辑。


```vue
<!-- ChildComponent.vue -->
<template>
  <button @click="emitCustomEvent">Emit custom event</button>
</template>

<script setup>
import { defineEmits } from 'vue';

const emits = defineEmits(['custom-event']);

const emitCustomEvent = () => {
  emits('custom-event', 'Custom event data');
};
</script>

<!-- ParentComponent.vue -->
<template>
  <ChildComponent @custom-event="handleCustomEvent" />
</template>

<script setup>
import ChildComponent from './ChildComponent.vue';

const handleCustomEvent = (data) => {
  console.log('Received custom event data:', data);
};
</script>
```

  

在 `ChildComponent` 中，通过 `defineEmits` 定义了一个自定义事件 `custom-event`，并在按钮点击时使用 `emits` 触发该事件并传递数据。在 `ParentComponent` 中，监听 `custom-event` 事件，并在事件触发时执行 `handleCustomEvent` 方法处理接收到的数据。


## 事件传参

### 1. 向原生 DOM 事件处理方法传参

#### 基本传参

在监听原生 DOM 事件时，可直接在模板里调用方法并传入参数。

```vue
<template>
  <button @click="handleClick('Hello, Vue!')">点击我</button>
</template>

<script setup>
const handleClick = (message) => {
  console.log(message);
};
</script>
```

  

在此示例中，点击按钮会触发 `handleClick` 方法，同时将 `'Hello, Vue!'` 作为参数传递给该方法。

#### 同时传递事件对象和自定义参数

若既要传递自定义参数，又要访问原生事件对象，可使用 `$event` 变量。


```vue
<template>
  <button @click="handleClick('Hello, Vue!', $event)">点击我</button>
</template>

<script setup>
const handleClick = (message, event) => {
  console.log(message);
  console.log('事件目标:', event.target);
};
</script>
```


这里，点击按钮时，`handleClick` 方法会接收到自定义参数 `'Hello, Vue!'` 和原生事件对象 `event`，借助 `event` 能获取事件的相关信息。

### 2. 组件间自定义事件传参

#### 子组件向父组件传参

在组件通信时，子组件可通过 `$emit` 触发自定义事件并传递参数，父组件监听该事件并接收参数。


```vue
<!-- 子组件 ChildComponent.vue -->
<template>
  <button @click="sendData">发送数据</button>
</template>

<script setup>
import { defineEmits } from 'vue';

const emits = defineEmits(['customEvent']);

const sendData = () => {
  const data = { name: 'John', age: 30 };
  emits('customEvent', data);
};
</script>

<!-- 父组件 ParentComponent.vue -->
<template>
  <ChildComponent @customEvent="handleCustomEvent" />
</template>

<script setup>
import ChildComponent from './ChildComponent.vue';

const handleCustomEvent = (data) => {
  console.log('接收到子组件的数据:', data);
};
</script>
```


在这个例子中，子组件的按钮被点击时，会触发 `customEvent` 自定义事件，并将包含 `name` 和 `age` 的对象作为参数传递。父组件监听该事件，当事件触发时，`handleCustomEvent` 方法会接收到子组件传递的数据。
#### 动态参数传递

有时，参数可能需要根据组件的状态动态生成。


```vue
<!-- 子组件 ChildComponent.vue -->
<template>
  <button @click="sendData">发送数据</button>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const emits = defineEmits(['customEvent']);
const count = ref(0);

const sendData = () => {
  count.value++;
  emits('customEvent', count.value);
};
</script>

<!-- 父组件 ParentComponent.vue -->
<template>
  <ChildComponent @customEvent="handleCustomEvent" />
</template>

<script setup>
import ChildComponent from './ChildComponent.vue';

const handleCustomEvent = (data) => {
  console.log('接收到子组件的计数:', data);
};
</script>
```


这里，子组件每次点击按钮时，`count` 的值会增加，然后将更新后的 `count` 值作为参数通过 `customEvent` 事件传递给父组件。

### 3. 多个参数传递

无论是原生 DOM 事件还是自定义事件，都能传递多个参数。


```vue
<template>
  <button @click="handleClick('参数1', '参数2', $event)">点击我</button>
</template>

<script setup>
const handleClick = (param1, param2, event) => {
  console.log('参数1:', param1);
  console.log('参数2:', param2);
  console.log('事件目标:', event.target);
};
</script>
```

此例中，点击按钮时，`handleClick` 方法会接收到三个参数：两个自定义参数和一个原生事件对象。
### 4. 注意事项

- **参数顺序**：在传递多个参数时，要注意参数的顺序，确保事件处理方法能正确接收和处理这些参数。
- **事件触发频率**：若频繁触发带参数的事件，要考虑性能问题，避免不必要的参数传递和事件触发。

## 数组变化侦测
### 1. 变异方法（Mutable Methods）

变异方法会直接修改原始数组，Vue 3 能够检测到这些方法调用并更新 DOM。

#### `push()`

在数组末尾添加一个或多个元素，然后返回新的长度。

```javascript
import { ref } from 'vue';

const arr = ref([1, 2, 3]);
arr.value.push(4); 
// arr 的值变为 [1, 2, 3, 4]，Vue 会检测到变化并更新 DOM
```

#### `pop()`

移除数组的最后一个元素并返回该元素。


```javascript
import { ref } from 'vue';

const arr = ref([1, 2, 3]);
const lastElement = arr.value.pop(); 
// arr 的值变为 [1, 2]，lastElement 的值为 3，Vue 会更新 DOM
```

#### `shift()`

移除数组的第一个元素并返回该元素。


```javascript
import { ref } from 'vue';

const arr = ref([1, 2, 3]);
const firstElement = arr.value.shift(); 
// arr 的值变为 [2, 3]，firstElement 的值为 1，Vue 会更新 DOM
```

#### `unshift()`

在数组的开头添加一个或多个元素，然后返回新的长度。

```javascript
import { ref } from 'vue';

const arr = ref([1, 2, 3]);
arr.value.unshift(0); 
// arr 的值变为 [0, 1, 2, 3]，Vue 会更新 DOM
```

#### `splice()`

向 / 从数组中添加 / 删除项目，然后返回被删除的项目。

```javascript
import { ref } from 'vue';

const arr = ref([1, 2, 3]);
arr.value.splice(1, 1, 4); 
// arr 的值变为 [1, 4, 3]，Vue 会更新 DOM
```

#### `sort()`

对数组的元素进行排序。


```javascript
import { ref } from 'vue';

const arr = ref([3, 1, 2]);
arr.value.sort(); 
// arr 的值变为 [1, 2, 3]，Vue 会更新 DOM
```

#### `reverse()`

颠倒数组中元素的顺序。

```javascript
import { ref } from 'vue';

const arr = ref([1, 2, 3]);
arr.value.reverse(); 
// arr 的值变为 [3, 2, 1]，Vue 会更新 DOM
```

### 2. 非变异方法（Non - Mutable Methods）

非变异方法不会改变原始数组，而是返回一个新数组。若要让 Vue 检测到变化，需要用新数组替换旧数组。

#### `filter()`

创建一个新数组，其包含通过所提供函数实现的测试的所有元素。


```javascript
import { ref } from 'vue';

const arr = ref([1, 2, 3]);
const newArr = arr.value.filter(item => item > 1); 
arr.value = newArr; 
// arr 的值变为 [2, 3]，Vue 会更新 DOM
```

#### `concat()`

用于合并两个或多个数组，此方法不会更改现有数组，而是返回一个新数组。

```javascript
import { ref } from 'vue';

const arr1 = ref([1, 2]);
const arr2 = [3, 4];
arr1.value = arr1.value.concat(arr2); 
// arr1 的值变为 [1, 2, 3, 4]，Vue 会更新 DOM
```

#### `slice()`

返回一个新的数组对象，这一对象是一个由 `begin` 和 `end` 决定的原数组的浅拷贝（包括 `begin`，不包括 `end`）。原始数组不会被改变。


```javascript
import { ref } from 'vue';

const arr = ref([1, 2, 3, 4]);
const newArr = arr.value.slice(1, 3); 
arr.value = newArr; 
// arr 的值变为 [2, 3]，Vue 会更新 DOM
```

### 3. 注意事项

- **直接修改数组索引**：直接通过索引修改数组元素（如 `arr.value[0] = 10`），Vue 3 无法检测到这种变化。若要更新数组元素，可使用 `splice()` 方法。


```javascript
import { ref } from 'vue';

const arr = ref([1, 2, 3]);
// 错误方式，Vue 无法检测
// arr.value[0] = 10; 

// 正确方式
arr.value.splice(0, 1, 10); 
```

- **修改数组长度**：直接修改数组的 `length` 属性（如 `arr.value.length = 2`），Vue 3 无法检测到这种变化。若要修改数组长度，可使用 `splice()` 方法。

```javascript
import { ref } from 'vue';

const arr = ref([1, 2, 3]);
// 错误方式，Vue 无法检测
// arr.value.length = 2; 

// 正确方式
arr.value.splice(2); 
```


## 计算属性
### 一、核心特性：响应式缓存

计算属性的最大特点是**缓存机制**：

- 它会追踪自身依赖的响应式数据（如 `data` 中的属性、其他计算属性等）。
- 只有当依赖的数据发生变化时，计算属性才会重新计算；若依赖未变，直接返回缓存的结果，避免重复计算。
- 对比普通方法：方法调用每次触发都会执行，而计算属性仅在必要时更新，性能更优。

### 二、基本用法

#### 1. 在 `computed` 选项中定义


```vue
<template>
  <div>
    <p>姓名：{{ fullName }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const firstName = ref('张三');
const lastName = ref('李四');

// 计算属性：通过 computed 函数定义（组合式 API）
const fullName = computed(() => {
  return firstName.value + ' ' + lastName.value;
});
</script>
```

#### 2. 模板中直接使用

计算属性在模板中的使用方式与普通属性一致（无需加括号调用），会自动根据依赖更新视图。

### 三、计算属性的 `getter` 和 `setter`

计算属性本质上是一个**带有缓存的 getter 函数**，但也可以通过定义 `setter` 实现双向逻辑（较少使用）。

#### 完整语法（对象形式）：

javascript

```javascript
// 选项式 API 中的 computed 选项
computed: {
  fullName: {
    // getter：获取计算属性的值（必填）
    get() {
      return this.firstName + ' ' + this.lastName;
    },
    // setter：设置计算属性的值（可选）
    set(newValue) {
      const names = newValue.split(' ');
      this.firstName = names[0];
      this.lastName = names[1];
    }
  }
}
```

#### 示例：可设置的计算属性


```vue
<template>
  <div>
    <input v-model="fullName" /> <!-- 双向绑定到计算属性 -->
  </div>
</template>
```


当通过 `v-model` 绑定计算属性时，`setter` 会在用户输入时触发，实现自定义逻辑。

### 四、适用场景

1. **复杂逻辑计算**：  
    当模板中需要对多个响应式数据进行组合、过滤、格式化等操作时，避免在模板中编写冗长的表达式。
    
    
    ```vue
    <!-- 模板中简洁调用 -->
    {{ filteredList }}
    
    <!-- 计算属性处理复杂逻辑 -->
    const filteredList = computed(() => {
      return list.value.filter(item => item.isActive).sort((a, b) => b.count - a.count);
    });
    ```
    
      
    
2. **依赖多个响应式数据**：  
    计算属性会自动追踪所有依赖（如 `firstName` 和 `lastName`），任何一个变化都会触发重新计算。
    
3. **性能优化**：  
    避免重复执行高开销的计算（如大量数组遍历），仅在依赖变化时更新。
    

### 五、与方法、侦听器的对比

|**特性**|**计算属性**|**方法调用**|**侦听器（Watch）**|
|---|---|---|---|
|**缓存**|有（依赖不变时不重新计算）|无（每次调用都执行）|无（需手动控制）|
|**使用场景**|复杂逻辑取值（推荐）|简单逻辑或无缓存需求|数据变化时执行异步 / 副作用|
|**语法**|`computed` 选项或 `computed` 函数|模板中直接调用（加括号）|`watch` 选项或 `watch` 函数|

#### 对比示例：

```vue
<!-- 计算属性（缓存，仅依赖变化时更新） -->
{{ fullName }} 

<!-- 方法调用（每次渲染都执行） -->
{{ getFullName() }} 
```
### 六、注意事项

1. **依赖必须是响应式的**：  
    计算属性仅对 Vue 管理的响应式数据（如 `ref`/`reactive` 创建的变量、组件的 `props` 等）敏感。若依赖普通变量（如原生 JavaScript 对象 / 数组），需转为响应式（如 `reactive(obj)`）。
    
2. **避免副作用**：  
    计算属性的职责是返回一个值，应避免在其中执行异步操作、修改 DOM 等副作用逻辑（副作用应放在 `watch` 或生命周期钩子中）。
    
3. **组合式 API 中的 `computed` 函数**：  
    在 Vue 3 的组合式 API 中，需通过 `import { computed } from 'vue'` 引入 `computed` 函数来创建计算属性，返回一个只读的响应式对象（可通过 `.value` 访问值）。
