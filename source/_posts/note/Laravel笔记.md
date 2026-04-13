---
title: Laravel笔记
date: 2025-05-22 11:52:22
updated: 2025-05-26 11:59:41
categories:
  - Wiki
tags:
  - 笔记
wiki: true
top_img: false
permalink: 'wiki/laravel-notes/'
---
## 函数操作

###  `pluck('')`：提取指定字段

- 从 `$rawRescanLogs` 集合中提取所有记录的 **`''` 字段值**，生成一个 **新的集合**（仅包含 `m` 数据）。
- **Eloquent 集合的 `pluck()` 方法**：专门用于提取模型集合中指定字段的值，返回一个值的集合（非关联数组）。

###  `filter()`：过滤空值

- 移除集合中的 **空值**（包括 `null`、空字符串 `""`、`0` 等，但需注意 `0` 是否为有效数据）。
- **Eloquent 集合的 `filter()` 方法**：会自动过滤掉 falsy 值（默认行为），仅保留真值。
	
###  `unique()`：去重

- 移除集合中 **重复的值**，保留唯一值，生成一个新集合。
- **Eloquent 集合的 `unique()` 方法**：默认根据值去重（非键名），相同值仅保留第一个出现的项。

### `values()`：重置数组索引

- 移除集合中的 **原有索引**，并重新生成从 `0` 开始的连续整数索引。
- **场景**：当集合的键名（如原有数据库记录的索引）不需要保留时，重置索引便于后续遍历或操作。

### `all()`：转换为普通数组

- 将 **Eloquent 集合** 转换为 **PHP 原生数组**，方便后续使用 PHP 数组函数（如 `array_filter()`、`in_array()` 等）或与非 Eloquent 代码集成。




##  `request`类函数
###  `get('')`请求
从当前 HTTP 请求中获取名为 `''` 的参数值


## **Eloquent ORM** 
 `ReScanLog::query()->where('mac', $mac);`
### **`ReScanLog::query()`**

- **作用**：创建一个 **Eloquent 查询构建器（Query Builder）**，用于构建数据库查询。
- **等价写法**：`DB::table('re_scan_logs')`，但通过模型调用更符合面向对象设计，且自动关联模型定义的属性。
### **`where('mac', $mac)`**

- **作用**：在查询中添加 `WHERE` 条件，筛选出 `mac` 字段等于 `$mac` 的记录。
- **参数说明**：
    - 第一个参数 `'mac'`：数据库表中的字段名（`re_scan_logs` 表中的 `mac` 字段）。
    - 第二个参数 `$mac`：要匹配的值（从请求中获取的 MAC 地址）。
### **`whereIn`**

用于检查字段值是否在给定的数组中
语法：whereIn(字段名, 数组)

 `$query->orderBy('updated_at', 'asc')->get();`

### **`orderBy('updated_at', 'asc')`**

- **作用**：对查询结果按 `updated_at` 字段排序。
- **参数说明**：
    - 第一个参数 `'updated_at'`：排序的字段名（通常为记录的更新时间）。
    - 第二个参数 `'asc'`：排序方向，`asc` 表示升序（从小到大），`desc` 表示降序。

### **`get()`**

- **作用**：执行查询并获取结果。
- **返回值**：
    - 若查询到记录：返回一个 **Eloquent 集合（Collection）**，包含所有匹配的 `ReScanLog` 模型对象。
    - 若无记录：返回一个空集合 `collect([])`。
- **对比其他方法**：
    - `first()`：获取第一条记录（返回模型对象或 `null`）。
    - `count()`：获取记录总数（返回整数）。

### **`take()`**

- **作用**：用于限制查询返回的记录数量，它等价于 SQL 中的 `LIMIT` 子句。与limit()完全相同

### **`limit()`**

- **作用**：用于限制查询返回的记录数量，它等价于 SQL 中的 `LIMIT` 子句。与take()完全相同

### **`fresh()`**

- **作用**：创建一个新的模型实例，包含数据库最新数据，原模型不受影响。
- **需要对比新旧数据**：保留本地修改的同时获取数据库最新状态。
- **避免污染原模型**：创建副本进行操作，原模型数据不变。
### **`refresh()`**

- **作用**：直接修改当前模型实例的属性，用数据库最新数据覆盖本地数据。
- **强制同步本地数据**：覆盖本地修改，确保使用数据库最新值。
- **处理并发场景**：在长时间操作中确保数据时效性（如队列任务、长事务）。

注意：- 若模型已被软删除（`deleted_at` 存在），`fresh()` 会返回 `null`（因为默认查询不包含软删除记录），而 `refresh()` 会将当前实例标记为已删除（`exists = false`）。

## 一、Eloquent ORM 核心操作

### 1. 查询构建器初始化


```php
$model = ScanLog::query(); // 等价于 DB::table('scan_logs')，基于模型创建查询构建器
$model = ReScanLog::query(); // 直接操作 ReScanLog 模型对应的表
```

  

- **作用**：创建查询实例，用于链式调用后续查询方法。
- **优势**：自动关联模型定义的字段、关联关系和全局作用域。

### 2. 关联预加载（避免 N+1 问题）


```php
$model->with(['device', 'person_mac_info']); // 预加载 device 和 person_mac_info 关联
```

  

- **作用**：在一次查询中同时加载主模型和关联模型，减少数据库查询次数。
- **场景**：需要访问模型关联数据（如 `$log->device->name`）时使用。

### 3. 条件查询

#### （1）单字段模糊查询


```php
$model->where("person_mac", "like", $keyword); // 匹配 MAC 地址包含关键字的记录
```

  

- **参数**：`where(字段名, 操作符, 值)`，`like` 用于模糊匹配。

#### （2）多条件关联查询


```php
// 通过人员表条件筛选，获取对应的 MAC 地址
$person_ids = Person::where($condition, "like", $keyword)->pluck("id")->toArray();
$macs = PersonMac::whereIn('person_id', $person_ids)->pluck("mac")->toArray();
$model->whereIn("person_mac", $macs); // 筛选包含这些 MAC 的记录
```

  

- **流程**：
    1. `pluck("id")` 从人员表提取符合条件的 ID 集合。
    2. `whereIn` 根据 ID 集合查询关联的 MAC 地址。
    3. 最终通过 `whereIn` 筛选扫描日志中的 MAC 地址。

#### （3）时间范围查询


```php
if ($start_at) $model->where('scan_time', '>=', $start_at); // 开始时间 >= 指定时间
if ($end_at) $model->where('scan_time', '<=', $end_at); // 结束时间 <= 指定时间
```

  

- **注意**：时间字符串需符合数据库字段格式（如 `YYYY-MM-DD HH:mm:ss`）。

### 4. 排序与分页


```php
$model->latest(); // 等价于 orderBy('created_at', 'desc')，按创建时间降序
$model->orderBy('scan_time'); // 按扫描时间升序排序（默认升序）
$model->offset($offset)->limit($limit); // 分页：偏移量 + 每页数量
```

  

- **`latest()` 快捷方式**：默认对 `created_at` 字段降序，可指定字段 `latest('scan_time')`。
- **分页替代方案**：生产环境建议使用 `paginate($limit)` 自动生成页码链接。

### 5. 聚合与统计


```php
$total = $model->count(); // 获取查询结果总数（不执行 `select *`，性能更高）
```

  

- **作用**：在不加载具体数据的情况下统计符合条件的记录数。

### 6. 集合分组（内存操作）


```php
$list = $model->get()->groupBy('person_mac'); // 按 MAC 地址分组（内存中处理）
```

  

- **与数据库 `groupBy` 的区别**：
    - 数据库 `groupBy` 用于分组统计（如 `count`、`sum`），会合并记录。
    - 集合 `groupBy` 保留所有记录，按字段值分组为多维集合。
- **性能注意**：数据量较大时建议先分页再分组，避免内存占用过高。

## 二、请求处理与参数解析

### 1. 获取请求参数


```php
$limit = $request->get("limit"); // 获取分页参数：每页数量
$keyword = $request->get("keyword_s"); // 获取搜索关键字
$start_at = $request->get('start_at'); // 获取时间筛选参数
```

  

- **`get()` 方法**：从请求中获取参数，支持默认值 `$request->get('key', 'default')`。

### 2. 多关键字处理


```php
$keywordArr = explode(",", trim($keyword, "%")); // 分割逗号分隔的关键字，去除首尾 %
```

  

- **场景**：处理类似 `mac1,mac2` 的多值搜索，转为数组后用于 `whereIn` 查询。
- **注意**：需结合业务需求判断是否需要保留 `%`（如模糊查询时不删除）。

## 三、集合操作函数

### 1. `pluck('字段')`：提取指定字段值


```php
$person_ids = Person::where(...)->pluck("id"); // 提取人员 ID 集合（返回集合）
$macs = PersonMac::where(...)->pluck("mac")->toArray(); // 转为数组用于 whereIn
```

  

- **作用**：快速获取单列数据，避免加载完整模型对象，提升性能。

### 2. `groupBy('字段')`：按字段分组集合


```php
$groupedList = $model->get()->groupBy('person_mac'); // 按 MAC 地址分组
```

  

- **结果结构**：
    
    
    ```php
    [
      'mac1' => [Model实例1, Model实例2, ...], // 同一 MAC 的所有记录
      'mac2' => [Model实例3, ...]
    ]
    ```
    
    
- **遍历方式**：
    
    
    ```php
    foreach ($groupedList as $mac => $records) {
        $firstScanTime = $records->first()->scan_time; // 每组第一条记录的时间
    }
    ```

### 3. `orderBy('字段')`：集合排序（内存中）


```php
$sortedList = $model->get()->sortBy('scan_time'); // 按扫描时间升序（集合方法）
$model->orderBy('scan_time')->get(); // 数据库层面排序（推荐大数据量场景）
```

  

- **区别**：
    - `orderBy` 在查询构建器中是数据库操作，性能更高。
    - `sortBy` 是集合方法，在内存中排序，适合小数据量。

## 四、常见业务场景实现

### 1. 多条件搜索流程


```php
// 单关键字搜索（如姓名、手机号）
if (count($keywordArr) == 1) {
    $model->where($condition, "like", $keyword); // 单条件模糊查询
} else {
    $model->whereIn($condition, $keywordArr); // 多值匹配（如多个 MAC 地址）
}
```

  

- **核心逻辑**：根据关键字是否包含逗号，判断是单值模糊查询还是多值精确匹配。

### 2. 设备筛选关联

php

```php
$device_mac = Device::find($device_id)['mac'] ?? ""; // 获取设备 MAC 地址（避免空值）
$model->where('device_mac', $device_mac); // 按设备 MAC 筛选扫描记录
```

  

- **注意**：`find($id)` 可能返回 `null`，需用 `?? ""` 处理空值，避免 `where` 条件失效。

## 五、性能优化建议

1. **避免不必要的 `with()` 预加载**：  
    仅在需要访问关联数据时使用 `with()`，否则会增加查询字段和数据量。
    
2. **优先使用数据库排序（`orderBy`）**：  
    内存排序（`sortBy`）适用于小数据量，大数据量场景需在查询中直接排序。
    
3. **分页替代 `offset+limit`**：  
    使用 `paginate($limit)` 自动生成页码，避免深分页性能问题（`offset` 过大时效率低）。
    
4. **善用 `pluck()` 和 `select()`**：  
    仅提取需要的字段（如 `pluck("id")` 或 `select("person_mac", "scan_time")`），减少数据传输量。


## 一、Swoole 定时任务基础

### 1. 定时任务类结构


```php
use Hhxsv5\LaravelS\Swoole\Timer\CronJob;

class WifiScanLogTransferTask extends CronJob
{
    // 任务配置参数
    protected $batchSize = 5000;
    protected $timeout = 1800;
    protected $lastProcessedId = 0;

    // 定义执行间隔（毫秒）
    public function interval() { return 30 * 60 * 1000; }

    // 是否启动时立即执行
    public function isImmediate() { return true; }

    // 任务核心逻辑
    public function run() { ... }
}
```


- **关键方法**：
    - `interval()`：返回任务执行间隔（毫秒）。
    - `isImmediate()`：控制是否在服务启动时立即执行一次。
    - `run()`：任务执行的具体逻辑。

### 2. 配置参数说明


```php
protected $batchSize = 5000; // 每批次处理的记录数
protected $timeout = 1800; // 任务超时时间（秒）
protected $lastProcessedId = 0; // 记录上次处理到的 ID
```

- **性能优化**：
    - 增大 `batchSize` 可减少数据库查询次数，但需注意内存使用。
    - 设置合理的 `timeout` 防止任务长时间运行导致服务阻塞。

## 二、数据处理核心逻辑

### 1. 数据同步流程

```php
while ($processing && $iterations < $maxIterations) {
    DB::beginTransaction(); // 开启事务
    try {
        $records = $this->getUnprocessedRecordsBatch(...); // 获取未处理数据
        $inserted = $this->batchInsertRecords($records); // 批量插入
        $this->lastProcessedId = end($records)->id; // 更新处理进度
        DB::commit(); // 提交事务
    } catch (\Exception $e) {
        DB::rollBack(); // 回滚事务
        sleep(5); // 出错后暂停重试
    }
}
```


- **事务机制**：确保数据一致性，失败时回滚所有操作。
- **迭代控制**：通过 `$maxIterations` 防止无限循环，保护服务稳定性。

### 2. 分批处理策略


```php
// 分批获取数据（每次 5000 条）
$records = $this->getUnprocessedRecordsBatch($lastId, $this->batchSize);

// 分批插入数据（每批 1000 条）
$batchSize = 1000;
$totalBatches = ceil(count($records) / $batchSize);
for ($i = 0; $i < $totalBatches; $i++) {
    $batch = array_slice($records, $i * $batchSize, $batchSize);
    DB::statement("INSERT ...", $this->flattenValues($batch));
}
```

  

- **分批原因**：
    - 避免一次性处理大量数据导致内存溢出。
    - 减少单条 SQL 语句长度，提高数据库执行效率。

## 三、关键技术实现

### 1. 查询未处理数据


```php
// SQL 查询未同步的记录（通过 LEFT JOIN + IS NULL 判断）
$query = "
    SELECT s.id, s.device_mac, ...
    FROM scan_log s
    LEFT JOIN re_scan_log r ON ...
    WHERE s.id > ? AND r.id IS NULL
    ORDER BY s.updated_at ASC
    LIMIT ?
";
```

  

- **关联逻辑**：  
    通过多表关联（`scan_log`、`re_scan_log`、`device`、`person` 等）获取完整数据。
- **性能优化**：  
    使用 `id > ?` 条件结合索引快速定位未处理数据，避免全表扫描。

### 2. 批量插入优化

```php
// 使用 INSERT IGNORE 忽略重复记录
DB::statement("
    INSERT IGNORE INTO re_scan_log (...)
    VALUES " . implode(',', array_fill(0, count($insertData), "(?, ?, ...)"))
    , $this->flattenValues($insertData));
```

  

- **核心技巧**：
    - `INSERT IGNORE`：遇到重复记录自动跳过，不中断批量插入。
    - 动态生成占位符 `(?, ?, ...)`：通过 `array_fill` 和 `implode` 构建批量插入语句。
    - 二维数组扁平化：通过 `flattenValues()` 将数据转换为一维数组，适配参数绑定。

### 3. 进度记录与内存管理


```php
// 记录处理进度
if (!empty($records)) {
    $this->lastProcessedId = end($records)->id;
}

// 定期清理内存
if ($iterations % 5 == 0) {
    $memoryUsage = round(memory_get_usage() / 1024 / 1024, 2);
    gc_collect_cycles(); // 强制垃圾回收
}
```

  

- **断点续传**：  
    通过 `lastProcessedId` 记录进度，确保任务中断后可从上次位置继续处理。
- **内存监控**：  
    定期记录内存使用情况并触发垃圾回收，防止内存泄漏。

## 四、异常处理与日志记录

### 1. 异常捕获与事务回滚


```php
try {
    DB::beginTransaction();
    // 业务逻辑
    DB::commit();
} catch (\Exception $e) {
    DB::rollBack(); // 回滚事务
    Log::error('批处理失败: ' . $e->getMessage(), [
        'iteration' => $iterations,
        'trace' => $e->getTraceAsString()
    ]);
    sleep(5); // 暂停后重试
}
```

  

- **错误恢复**：  
    事务回滚确保数据一致性，通过 `sleep(5)` 避免立即重试导致连续失败。

### 2. 详细日志记录


```php
Log::info("已处理 {$totalProcessed} 条记录，内存: {$memoryUsage}MB，耗时: {$elapsedTime}秒");
Log::error('获取记录失败', ['trace' => $e->getTraceAsString()]);
```

  

- **监控指标**：  
    记录处理数量、内存使用、耗时等关键指标，便于排查性能问题。
- **错误上下文**：  
    异常日志中包含迭代次数、最后处理 ID 等信息，快速定位问题点。

## 五、性能优化要点

1. **分批处理**：  
    数据库查询和插入均采用分批策略，平衡处理效率与内存占用。
    
2. **SQL 优化**：
    
    - 使用 `LEFT JOIN + IS NULL` 高效判断未处理记录。
    - 通过 `INSERT IGNORE` 避免重复数据冲突，减少事务回滚。
3. **内存管理**：
    
    - 定期调用 `gc_collect_cycles()` 清理无用对象。
    - 避免一次性加载过多数据，控制 `batchSize` 参数。
4. **事务控制**：  
    将批量操作纳入事务，确保数据一致性，同时避免长时间锁表。
    

## 六、常见问题与解决方案

### 1. 重复数据问题

- **现象**：插入时出现主键冲突或唯一索引冲突。
- **解决方案**：  
    使用 `INSERT IGNORE` 或 `ON DUPLICATE KEY UPDATE` 语法处理重复数据。

### 2. 内存溢出问题

- **现象**：任务运行时内存持续增长，最终导致服务崩溃。
- **解决方案**：
    - 减小 `batchSize`，降低单次处理数据量。
    - 定期调用垃圾回收函数 `gc_collect_cycles()`。

### 3. 长时间运行导致超时

- **现象**：任务处理时间过长，被 Swoole 或 PHP 超时机制中断。
- **解决方案**：
    - 增加 `timeout` 参数设置。
    - 优化 SQL 查询，添加必要索引。