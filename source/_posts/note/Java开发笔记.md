---
title: Java开发笔记
date: 2025-08-01 18:01:33
updated: 2025-12-05 16:54:20
categories:
  - Wiki
tags:
  - 笔记
wiki: true
top_img: false
permalink: 'wiki/java-dev-notes/'
---
# Java开发笔记

## Mybatis

### useGeneratedKeys

```java
useGeneratedKeys = "true"
```

- **作用**：告诉 MyBatis 使用数据库自动生成的主键
- **场景**：当数据库表的主键设置为**自增**（AUTO_INCREMENT）时
- **效果**：执行插入操作后，数据库会自动生成主键值

### keyProperty

```java
keyProperty = "id"
```

- **作用**：指定将自动生成的主键值赋值给 Java 对象的哪个属性
- **效果**：插入成功后，MyBatis 会自动将生成的主键值回填到参数对象的 `id` 属性中


## Spring Cache

### @EnableCaching  
**用法说明**：Spring Cache的基础注解，用于开启Spring的缓存支持。需标注在配置类（带`@Configuration`的类）上或者启动类，否则所有缓存注解（如`@Cacheable`）都不会生效。其核心作用是触发Spring对缓存注解的解析和AOP代理，从而实现方法结果的缓存管理。  

**示例**：  
```java
@Configuration
@EnableCaching  // 开启缓存支持
public class CacheConfig {
    // 可在此配置缓存管理器（如RedisCacheManager）
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        return RedisCacheManager.builder(factory).build();
    }
}
```

**使用场景**：所有需要使用Spring Cache功能的项目必须添加，是缓存注解生效的前提。无论使用何种缓存介质（如内存、Redis、Caffeine），都需通过此注解开启缓存机制。  


### @Cacheable  
**用法说明**：最常用的缓存注解，用于对方法结果进行缓存。当调用标注了此注解的方法时，Spring会先检查缓存中是否存在对应的数据：  
- 若存在，直接返回缓存中的数据，不执行方法体；  
- 若不存在，执行方法并将结果存入缓存。  

核心属性：  
- `value`/`cacheNames`：缓存名称（必填），用于指定缓存的分组（如`"userCache"`）；  
- `key`：缓存键（可选，默认按方法参数生成），支持SpEL表达式（如`"#id"`表示用参数`id`作为键）；  
- `condition`：缓存触发条件（可选），满足条件才缓存（如`"#id > 0"`）；  
- `unless`：缓存排除条件（可选），满足条件不缓存（如`"#result == null"`表示结果为null时不缓存）。  
- `expire`：限时存储，单位秒

**示例**：查询用户信息并缓存  
```java
@Service
public class UserService {
    // 缓存名称为"userCache"，键为参数id，结果为null时不缓存
    @Cacheable(value = "userCache", key = "#id", unless = "#result == null")
    public User getUserById(Long id) {
        // 模拟数据库查询
        return userMapper.selectById(id); 
    }
}
```


**使用场景**：适用于查询频率高、数据变更少的操作（如用户详情查询、商品信息查询）。通过缓存减少对数据库的重复访问，提升性能。  


### @CacheEvict  
**用法说明**：用于删除缓存中的数据，避免缓存与实际数据不一致（脏数据）。调用方法时会触发缓存删除操作。  

核心属性：  
- `value`/`cacheNames`：缓存名称（必填）；  
- `key`：要删除的缓存键（可选，默认按方法参数生成）；  
- `allEntries`：是否删除缓存中所有数据（可选，默认`false`，设为`true`时忽略`key`）；  
- `beforeInvocation`：是否在方法执行前删除缓存（可选，默认`false`，即方法执行后删除；若方法抛异常，`false`时不删除，`true`时仍删除）。  


**示例**：删除用户并清除对应缓存  
```java
@Service
public class UserService {
    // 删除"userCache"中键为参数id的缓存，方法执行后删除
    @CacheEvict(value = "userCache", key = "#id")
    public void deleteUser(Long id) {
        userMapper.deleteById(id); // 数据库删除
    }
}
```


**使用场景**：适用于数据删除操作（如用户删除、订单取消），或数据更新后需要清除旧缓存的场景（如修改用户信息后，清除旧的用户缓存）。  


### @CachePut  
**用法说明**：用于更新缓存数据，确保缓存与方法结果一致。无论缓存中是否存在数据，都会执行方法，并将结果存入缓存（覆盖旧值）。与`@Cacheable`的区别是：`@CachePut`一定会执行方法，而`@Cacheable`可能跳过方法执行。  

核心属性：与`@Cacheable`一致（`value`、`key`、`condition`等）。  


**示例**：更新用户信息并同步缓存  
```java
@Service
public class UserService {
    // 更新"userCache"中键为用户id的缓存，结果为null时不缓存
    @CachePut(value = "userCache", key = "#user.id", unless = "#result == null")
    public User updateUser(User user) {
        userMapper.updateById(user); // 数据库更新
        return user; // 返回更新后的用户，存入缓存
    }
}
```


**使用场景**：适用于数据更新操作（如用户信息修改、商品价格更新）。通过同步更新缓存，确保下次查询时能获取最新数据，避免缓存过期问题。  


### @Caching  
**用法说明**：用于组合多个缓存注解（如同时使用`@Cacheable`和`@CacheEvict`），解决一个方法需要执行多个缓存操作的场景。  

核心属性：  
- `cacheable`：包含一个或多个`@Cacheable`注解；  
- `put`：包含一个或多个`@CachePut`注解；  
- `evict`：包含一个或多个`@CacheEvict`注解。  


**示例**：修改用户状态，同时清除旧缓存并缓存新结果  
```java
@Service
public class UserService {
    // 组合操作：清除旧缓存 + 缓存新结果
    @Caching(
        evict = @CacheEvict(value = "userCache", key = "#id"), // 清除旧缓存
        put = @CachePut(value = "userCache", key = "#id") // 缓存更新后的结果
    )
    public User updateUserStatus(Long id, Integer status) {
        User user = userMapper.selectById(id);
        user.setStatus(status);
        userMapper.updateById(user);
        return user;
    }
}
```


**使用场景**：适用于复杂的缓存操作，如一个方法既需要清除旧缓存，又需要缓存新结果；或需要操作多个不同缓存（如同时更新用户缓存和订单缓存）。  


### @CacheConfig  
**用法说明**：用于类级别定义缓存的公共配置，减少方法级注解的重复代码。类中所有缓存注解（如`@Cacheable`）会继承此处定义的属性（如缓存名称），若方法注解中显式指定，则覆盖类级别的配置。  

核心属性：  
- `cacheNames`：公共缓存名称（对应方法注解的`value`）；  
- `keyGenerator`：公共键生成器；  
- `cacheManager`：公共缓存管理器。  


**示例**：类级别指定公共缓存名称  
```java
@Service
@CacheConfig(cacheNames = "userCache") // 类中所有方法默认使用"userCache"
public class UserService {
    // 无需再指定value，继承类的"userCache"
    @Cacheable(key = "#id")
    public User getUserById(Long id) {
        return userMapper.selectById(id);
    }

    // 方法可覆盖类的配置（此处使用"userDetailCache"而非"userCache"）
    @Cacheable(value = "userDetailCache", key = "#id")
    public UserDetail getUserDetail(Long id) {
        return userDetailMapper.selectById(id);
    }
}
```


**使用场景**：适用于类中多个方法使用相同缓存配置（如相同缓存名称）的场景，通过抽取公共配置简化代码，提高可维护性。


## Spring Task
任务调度工具，通过注解可以方便地实现定时任务。


### @EnableScheduling
- **用途**：开启Spring的定时任务支持，需标注在配置类上。
- **示例**：
```java
@Configuration
@EnableScheduling
public class TaskConfig {
    // 定时任务方法所在的Bean会被扫描
}
```
- **应用场景**：所有需要使用定时任务的项目都必须添加，用于激活调度功能。


### @Scheduled
- **用途**：标注在方法上，定义具体的定时任务执行规则。
- **常用属性**：
  - `fixedRate`：固定频率执行（单位：毫秒），以上一次任务开始时间为基准。
  - `fixedDelay`：固定延迟执行（单位：毫秒），以上一次任务结束时间为基准。
  - `initialDelay`：首次执行前的延迟时间（单位：毫秒）。
  - `cron`：通过Cron表达式定义复杂的执行规则。

- **示例**：
```java
@Component
public class MyTask {
    // 每5秒执行一次（以上一次开始时间计算）
    @Scheduled(fixedRate = 5000)
    public void task1() {
        System.out.println("固定频率任务执行");
    }

    // 上一次执行结束后，间隔3秒再执行
    @Scheduled(fixedDelay = 3000, initialDelay = 1000)
    public void task2() {
        System.out.println("固定延迟任务执行");
    }

    // 每天凌晨2点执行（Cron表达式）
    @Scheduled(cron = "0 0 2 * * ?")
    public void task3() {
        System.out.println("Cron任务执行");
    }
}
```
- **应用场景**：
  - 定期数据同步（如每小时同步一次订单数据）。
  - 定时清理（如每天凌晨删除临时文件）。
  - 周期性业务检查（如每10分钟检查超时任务）。


### @Schedules
- **用途**：组合多个`@Scheduled`注解，让一个方法按多种规则执行。
- **示例**：
```java
@Scheduled(fixedRate = 10000)
@Schedules({
    @Scheduled(cron = "0 0 12 * * ?"),  // 每天中午12点
    @Scheduled(cron = "0 0 0 * * ?")     // 每天凌晨0点
})
public void multiTask() {
    System.out.println("多规则任务执行");
}
```
- **应用场景**：需要同时满足多个执行条件的任务（如既需要每10秒执行一次，又需要每天特定时间执行）。


### 注意事项
1. 定时任务方法需无返回值（`void`），且参数列表为空。
2. 若任务执行时间可能超过间隔时间，需考虑并发问题（可结合`@Async`实现异步执行）。
3. Cron表达式格式：`秒 分 时 日 月 周 年`（年可选），例如`0/5 * * * * ?`表示每5秒执行一次。



## 场景

### 个人待办提醒系统

#### 一、业务场景

##### 1.1 需求背景
实现一个个人待办提醒系统，支持用户创建待办事项并设置提醒时间，系统在指定时间自动推送提醒通知，并为重复任务生成新的待办。

##### 1.2 核心功能
- **提醒时间计算**：支持提前N分钟提醒（准时、5分钟、30分钟、1小时、1天）
- **重复提醒**：支持不重复、每天、每周、每月、每年等重复模式
- **灵活配置**：每周可选多个星期几、每月可选多个日期、每年可选多个月日
- **重复结束**：支持设置重复结束日期

##### 1.3 技术挑战
- **定时精度**：如何在指定时间精确触发提醒？
- **高性能**：如何避免频繁扫描数据库造成性能瓶颈？
- **可靠性**：如何保证消息不丢失、不重复？
- **一致性**：如何处理用户修改待办后的旧消息？
- **避免死循环**：如何防止消息在Kafka中无限循环？

---

#### 二、技术方案演进

##### 2.1 方案一：纯定时任务轮询（❌ 性能差）

```
┌─────────────────┐
│  定时任务(1分钟) │
└────────┬────────┘
         │ 每分钟扫描
         ▼
┌─────────────────┐
│   数据库查询     │  SELECT * FROM todo WHERE next_remind_time <= NOW()
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   发送提醒通知   │
└─────────────────┘
```

**问题**：
- 频繁查询数据库，QPS高时性能瓶颈
- 1分钟间隔精度不够，最大延迟1分钟
- 数据量大时扫描慢

##### 2.2 方案二：Kafka延迟消息循环（❌ 存在死循环风险）

```
┌──────────────┐    ┌─────────────┐    ┌──────────────────┐
│ 创建/更新待办 │───▶│ topic_delay │◀──▶│ 延迟消息监听器    │
└──────────────┘    └─────────────┘    │ (未到时间重发回   │
                           ▲           │  topic_delay)    │
                           │           └────────┬─────────┘
                           └────────────────────┘ 循环！
```

**致命问题**：
- 消息在 `topic_delay` 中无限循环，直到时间到达
- 大量待办积压时，消息量指数级增长
- **导致Kafka宕机**

##### 2.3 方案三：数据库 + 定时任务 + Kafka一次性分发（✅ 当前方案）

```
┌──────────────┐         ┌─────────────────┐
│ 创建/更新待办 │────────▶│     数据库       │
│ (只存数据库)  │         │ next_remind_time │
└──────────────┘         └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │   定时任务（每分钟扫描）     │
                    │ WHERE next_remind_time    │
                    │       <= NOW()            │
                    └─────────────┬─────────────┘
                                  │ 到时间的待办
                                  ▼
                    ┌─────────────────────────┐
                    │ topic_personal_todo_    │
                    │ reminder (一次性发送)    │
                    └─────────────┬───────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │      提醒消费者          │
                    │ 1. 校验状态              │
                    │ 2. 版本校验              │
                    │ 3. 推送通知              │
                    │ 4. 重复任务→新待办存DB   │
                    └─────────────────────────┘
```

**核心原则**：
- ✅ **Kafka仅做一次性事件分发**，消息只发一次、消费一次
- ✅ **延迟由数据库+定时任务保障**，不在Kafka中循环
- ✅ **重复待办存数据库**，等待下次定时任务扫描

---

#### 三、核心流程详解

##### 3.1 创建待办流程

```java
@Transactional
public void addPersonalTodo(PersonalTodoDTO dto) {
    PersonalTodo todo = new PersonalTodo();
    BeanUtils.copyProperties(dto, todo);
    
    // 1. 计算下次提醒时间（存入数据库，由定时任务扫描触发）
    if (todo.getStartDate() != null && todo.getRemindAdvance() != null) {
        LocalDateTime nextRemindTime = reminderService.calculateNextRemindTimeOnly(todo);
        todo.setNextRemindTime(nextRemindTime);
    }
    
    // 2. 保存到数据库
    personalTodoMapper.insert(todo);
    // 不发送Kafka消息，待办留在数据库，由定时任务在到时间时扫描触发
}
```

**设计要点**：
- 待办创建后**只存数据库**，不发Kafka
- `nextRemindTime` 字段是定时任务扫描的依据
- 简化流程，避免分布式事务问题

##### 3.2 定时任务扫描流程

```java
@Scheduled(cron = "0 * * * * ?")  // 每分钟执行
public void scanAndTriggerReminder() {
    LocalDateTime now = LocalDateTime.now();
    int pageSize = 100;
    
    while (true) {
        // 分页查询到时间的待办
        LambdaQueryWrapper<PersonalTodo> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.le(PersonalTodo::getNextRemindTime, now)
                .eq(PersonalTodo::getCompleted, 0)
                .eq(PersonalTodo::getIsDeleted, false)
                .isNotNull(PersonalTodo::getNextRemindTime)
                .isNull(PersonalTodo::getOriginTodoId)  // 只处理规则待办
                .orderByAsc(PersonalTodo::getNextRemindTime)
                .last("LIMIT " + pageSize);
        
        List<PersonalTodo> todoList = personalTodoMapper.selectList(queryWrapper);
        if (todoList.isEmpty()) break;
        
        // 发送提醒消息到Kafka
        for (PersonalTodo todo : todoList) {
            delayMessageService.sendReminderMessage(todo);
        }
        
        if (todoList.size() < pageSize) break;
    }
}
```

**设计要点**：
- **分页查询**：避免一次加载过多数据
- **只扫描到时间的待办**：`next_remind_time <= NOW()`
- **排除历史待办**：`origin_todo_id IS NULL`

##### 3.3 消息消费流程

```java
@KafkaListener(topics = "topic_personal_todo_reminder")
public void onReminderMessage(String message) {
    PersonalTodoReminderMessage reminderMessage = objectMapper.readValue(message, type);
    Long todoId = reminderMessage.getTodoId();
    
    // 1. 校验待办状态
    PersonalTodo dbTodo = mapper.selectById(todoId);
    if (dbTodo == null || dbTodo.getIsDeleted() || dbTodo.getCompleted() == 1) {
        return; // 忽略无效消息
    }
    
    // 2. 版本校验（防止重复消费或过期消息）
    if (dbTodo.getNextRemindTime() == null) {
        return;
    }
    if (!reminderMessage.getNextRemindTime().equals(dbTodo.getNextRemindTime())) {
        return; // 用户已修改，忽略过期消息
    }
    
    // 3. 推送提醒通知
    pushNotification(dbTodo);
    
    // 4. 处理提醒触发（生成新待办存数据库，不发Kafka）
    reminderService.processReminderTrigger(dbTodo);
}
```

**关键点**：消费后**不再发送任何Kafka消息**，新待办存数据库等待下次扫描。

##### 3.4 重复待办处理

```java
@Transactional
public PersonalTodo processReminderTrigger(PersonalTodo currentTodo) {
    Integer repeatMode = currentTodo.getRepeatMode();
    
    // 非重复任务：清空nextRemindTime
    if (repeatMode == null || RepeatModeEnum.NONE.equals(repeatMode)) {
        clearNextRemindTime(currentTodo.getId());
        return null;
    }
    
    // 重复任务：计算下次提醒时间
    LocalDateTime nextRemindTime = calculateNextCycleRemindTime(currentTodo);
    if (nextRemindTime == null) {
        clearNextRemindTime(currentTodo.getId());
        return null;
    }
    
    // 1. 当前待办变为历史待办
    convertToHistoryTodo(currentTodo.getId());
    
    // 2. 生成新的规则待办（存入数据库，等待下次定时任务扫描）
    PersonalTodo newRuleTodo = createNewRuleTodo(currentTodo, nextRemindTime);
    personalTodoMapper.insert(newRuleTodo);
    
    return newRuleTodo;
    // 不发送Kafka消息！新待办会在下次定时任务扫描时被发现
}
```

---

#### 四、关键问题与解决方案

##### 4.1 如何避免Kafka消息死循环？

**问题**：早期方案中，未到时间的消息会被重新发送回 `topic_delay`，导致消息无限循环。

**解决方案**：架构重构
```
旧方案（死循环）：
待办 → topic_delay → 未到时间 → topic_delay → ... → 到时间 → reminder_topic

新方案（无循环）：
待办 → 数据库 → 定时任务扫描 → reminder_topic → 消费完成
                    ↑                              ↓
                    └────── 新待办存数据库 ◀────────┘
```

**核心原则**：
- Kafka仅做**一次性事件分发**
- 延迟由**数据库+定时任务**保障
- 消息**只发一次、消费一次**

##### 4.2 如何保证消息不丢失？

**问题**：定时任务可能因服务重启、异常等原因遗漏待办。

**解决方案**：启动时补扫 + 每分钟定时扫描

```java
// 启动后30秒执行一次，处理服务重启期间遗漏的提醒
@Scheduled(initialDelay = 30000, fixedDelay = Long.MAX_VALUE)
public void startupScan() {
    doScan("启动扫描");
}

// 每分钟执行，确保到时间的待办被及时处理
@Scheduled(cron = "0 * * * * ?")
public void scanAndTriggerReminder() {
    doScan("定时扫描");
}
```

##### 4.3 如何处理用户修改待办后的旧消息？

**问题**：用户修改提醒时间后，旧的消息仍可能被消费。

**解决方案**：版本校验机制

```java
// 消息中携带 nextRemindTime 作为版本号
PersonalTodoReminderMessage message = PersonalTodoReminderMessage.builder()
    .todoId(todo.getId())
    .nextRemindTime(todo.getNextRemindTime())  // 版本号
    .build();

// 消费时校验版本
long msgSeconds = message.getNextRemindTime().toEpochSecond(ZoneOffset.ofHours(8));
long dbSeconds = dbTodo.getNextRemindTime().toEpochSecond(ZoneOffset.ofHours(8));
if (msgSeconds != dbSeconds) {
    log.debug("提醒时间已变更，忽略过期消息");
    return;
}
```

##### 4.4 如何避免重复消费？

**问题**：Kafka消息可能被重复消费。

**解决方案**：幂等性设计

```java
// 1. 状态校验
if (dbTodo.getCompleted() == 1 || dbTodo.getIsDeleted()) {
    return;
}

// 2. 版本校验
if (dbTodo.getNextRemindTime() == null) {
    return; // 已处理过
}
if (!message.getNextRemindTime().equals(dbTodo.getNextRemindTime())) {
    return; // 版本不一致
}

// 3. 处理后更新状态
// processReminderTrigger 会清空或更新 nextRemindTime
// 下次消费同一消息时，版本校验会失败
```

##### 4.5 如何保证事务一致性？

**问题**：数据库操作和Kafka消息发送如何保证一致？

**解决方案**：简化架构，避免分布式事务

```java
// 创建/更新待办：只操作数据库，不发Kafka
@Transactional
public void addPersonalTodo(PersonalTodoDTO dto) {
    personalTodoMapper.insert(todo);
    // 不发送Kafka消息
}

// 定时任务：扫描数据库，发送Kafka
// 即使消息发送失败，下次扫描会重新发送
```

**为什么不用分布式事务？**
- 引入复杂度高（如Seata）
- 性能损耗大
- 当前架构天然保证最终一致性

---

#### 五、性能优化

##### 5.1 数据库优化

**索引设计**：
```sql
-- 定时任务扫描优化
CREATE INDEX idx_next_remind_time ON personal_todo(
    next_remind_time, completed, is_deleted, origin_todo_id
);
```

**查询优化**：
```java
// 分页查询，避免一次加载过多
queryWrapper.last("LIMIT 100");

// 只查询必要字段
queryWrapper.select(PersonalTodo::getId, PersonalTodo::getUserId, 
    PersonalTodo::getName, PersonalTodo::getNextRemindTime);
```

##### 5.2 定时任务优化

```java
// 分批处理，避免长时间占用资源
while (true) {
    List<PersonalTodo> batch = queryBatch(100);
    if (batch.isEmpty()) break;
    
    for (PersonalTodo todo : batch) {
        sendReminderMessage(todo);
    }
    
    if (batch.size() < 100) break;
}
```

##### 5.3 内存优化

```java
// ❌ 错误：更新整个实体
personalTodoMapper.updateById(dbTodo);

// ✅ 正确：只更新需要的字段
PersonalTodo updateEntity = new PersonalTodo();
updateEntity.setId(todo.getId());
updateEntity.setNextRemindTime(null);
personalTodoMapper.updateById(updateEntity);
```

##### 5.4 性能对比

| 指标      | 纯轮询方案           | Kafka循环方案      | 当前方案             |
| --------- | -------------------- | ------------------ | -------------------- |
| 数据库QPS | 高（每分钟全表扫描） | 低                 | 低（每分钟增量扫描） |
| 提醒延迟  | 最大1分钟            | 秒级               | 最大1分钟            |
| Kafka压力 | 无                   | **极高（死循环）** | 低（一次性分发）     |
| 可靠性    | 一般                 | **差（可能宕机）** | 高                   |
| 扩展性    | 差                   | 差                 | 好                   |

---

#### 六、扩展问题

##### 6.1 如果要支持秒级精度怎么办？

当前方案精度为1分钟（定时任务间隔）。如需更高精度：

- **时间轮算法**：如Netty的HashedWheelTimer
- **Redis ZSet**：score存时间戳，定时取出
- **RocketMQ延迟消息**：原生支持延迟级别
- **缩短扫描间隔**：改为每10秒扫描（需评估数据库压力）

##### 6.2 如果待办量达到千万级怎么办？

- **分库分表**：按用户ID分片
- **冷热分离**：历史待办归档
- **读写分离**：定时扫描走从库
- **消息分区**：按用户ID分区，保证同一用户消息顺序
- **分布式定时任务**：使用XXL-Job分片广播

##### 6.3 多实例部署如何避免重复扫描？

```java
// 方案1：分布式锁
@Scheduled(cron = "0 * * * * ?")
public void scanAndTriggerReminder() {
    if (!redisLock.tryLock("reminder_scan", 50, TimeUnit.SECONDS)) {
        return;
    }
    try {
        doScan();
    } finally {
        redisLock.unlock("reminder_scan");
    }
}

// 方案2：XXL-Job分片
// 不同实例处理不同用户ID范围
```

##### 6.4 如何监控系统健康？

```java
// 关键指标埋点
log.info("[定时扫描] 完成，成功: {}, 失败: {}", successCount, failCount);

// 告警规则
// - 扫描发现大量待办 → 可能有积压
// - 消息消费失败率高 → 检查消费者逻辑
// - 数据库慢查询 → 检查索引
```

---

#### 七、总结亮点

| 维度           | 设计要点                                            |
| -------------- | --------------------------------------------------- |
| **架构设计**   | 数据库+定时任务+Kafka一次性分发，彻底避免消息死循环 |
| **幂等性**     | 版本校验机制，天然防重复消费                        |
| **最终一致性** | 不依赖分布式事务，通过定时扫描保证                  |
| **可扩展**     | 支持多种重复模式，算法可复用                        |
| **容错性**     | 启动补扫+定时扫描，单条失败不影响整体               |
| **性能**       | 分页查询、索引优化、增量扫描                        |

---

#### 八、架构对比总结

```
❌ 旧方案（Kafka死循环）：
   消息在topic_delay中反复循环 → Kafka压力大 → 宕机风险

✅ 新方案（数据库+定时任务）：
   待办存数据库 → 定时任务扫描到时间的 → Kafka一次性分发 → 消费完成
   
   核心原则：
   1. Kafka仅做一次性事件分发，不循环
   2. 延迟由数据库+定时任务保障
   3. 重复待办存数据库，不发Kafka
```
