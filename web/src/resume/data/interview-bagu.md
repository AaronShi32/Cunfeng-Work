# 八股文高频面试题

> Java / 数据结构 / 并发等经典高频面试题，少而精。

---

## HashMap

### 1. HashMap 的底层数据结构是什么？

<details>
<summary>查看回答</summary>

**JDK 1.8 之后**：数组 + 链表 + 红黑树。

```
HashMap 内部结构：

  table[]（Node 数组，每个槽位叫一个 bucket）
  ┌───┬───┬───┬───┬───┬───┬───┬───┐
  │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │  ← 数组（默认 16）
  └───┴─┬─┴───┴───┴─┬─┴───┴───┴───┘
        │           │
       [A]         [D]
        ↓           ↓
       [B]         [E]         ← 哈希冲突，同一个桶形成链表
        ↓           ↓
       [C]        🌲红黑树     ← 链表长度 ≥8 且数组长度 ≥64 时转红黑树
```

| 结构 | 查找复杂度 | 作用 |
|---|---|---|
| 数组 | O(1) | 通过 hash 直接定位桶 |
| 链表 | O(n) | 处理哈希冲突（拉链法） |
| 红黑树 | O(log n) | 冲突严重时优化查找性能 |

**JDK 1.7 是数组 + 链表**，没有红黑树，极端情况下退化为 O(n)。

**面试建议回答**：HashMap 底层是数组 + 链表 + 红黑树（JDK 1.8+）。数组通过 hash 值定位桶，O(1)；哈希冲突时用链表拉链，O(n)；链表长度 ≥8 且数组长度 ≥64 时转红黑树，O(log n)。JDK 1.7 只有数组 + 链表。

</details>

---

### 2. HashMap 的 put 流程是怎样的？

<details>
<summary>查看回答</summary>

```
put(key, value)
    │
    ├─ 1. 计算 hash：hash = (h = key.hashCode()) ^ (h >>> 16)   ← 高低 16 位异或，减少冲突
    │
    ├─ 2. 定位桶：index = hash & (table.length - 1)             ← 等价于取模，但更快
    │
    ├─ 3. 桶为空？
    │     └─ 是 → 直接新建 Node 放入
    │
    ├─ 4. 桶不为空，key 已存在？
    │     └─ 是 → 覆盖 value，返回旧值
    │
    ├─ 5. 桶是红黑树节点？
    │     └─ 是 → 调用 TreeNode.putTreeVal() 插入
    │
    ├─ 6. 桶是链表？
    │     └─ 尾插法遍历链表
    │        ├─ 找到相同 key → 覆盖
    │        └─ 到链尾 → 插入新节点
    │           └─ 链表长度 ≥8？→ treeifyBin()（数组 ≥64 则转红黑树，否则先扩容）
    │
    └─ 7. ++size > threshold？→ resize() 扩容
```

**关键细节**：
- **hash 扰动**：高 16 位异或低 16 位，让高位也参与桶定位，减少冲突
- **JDK 1.7 用头插法**（并发下可能造成死循环），**JDK 1.8 改为尾插法**
- **树化条件是两个**：链表 ≥8 **且** 数组 ≥64，否则只扩容不转树

**面试建议回答**：先对 key 做 hash 扰动（高低 16 位异或），然后 `hash & (length-1)` 定位桶。桶为空直接放入；不为空则判断 key 是否存在——存在就覆盖，不存在就插入链表尾部或红黑树。插入后检查链表长度是否 ≥8 且数组 ≥64 来决定是否转红黑树，最后判断是否需要扩容。JDK 1.8 用尾插法避免了 1.7 头插法的并发死循环问题。

</details>

---

### 3. HashMap 的扩容机制是怎样的？为什么容量是 2 的幂？

<details>
<summary>查看回答</summary>

**扩容触发条件**：`size > capacity × loadFactor`（默认 16 × 0.75 = 12）

**扩容过程**：
1. 创建一个 **2 倍大小** 的新数组
2. 遍历旧数组每个桶，对每个节点重新计算位置（rehash）
3. 节点在新数组中只有两种位置：**原位置** 或 **原位置 + 旧容量**

```
旧容量 16，扩容到 32：

  hash = ...1 0101
  旧位置 = hash & (16-1) = hash & 01111 = 00101 = 5
  新位置 = hash & (32-1) = hash & 11111 = 00101 = 5  ← 不变
  
  或者：
  hash = ...1 10101
  旧位置 = hash & 01111 = 00101 = 5
  新位置 = hash & 11111 = 10101 = 21 = 5 + 16        ← 原位置 + 旧容量
```

**只需要看新增的那一位是 0 还是 1**，不需要重新计算整个 hash。

**为什么是 2 的幂？**

| 原因 | 说明 |
|---|---|
| 位运算替代取模 | `hash & (length - 1)` 等价于 `hash % length`，但位运算更快 |
| 扩容时高效 rehash | 只看新增一位，节点要么不动要么移动固定偏移量 |
| 减少冲突 | 2 的幂 - 1 的二进制全是 1（如 15 = 1111），hash 的每一位都能参与定位 |

**面试建议回答**：当元素数量超过 `容量 × 负载因子`（默认 0.75）时触发扩容，新建 2 倍大小数组并 rehash。容量必须是 2 的幂，原因有三：一是 `hash & (length-1)` 可以用位运算替代取模，更快；二是扩容时每个节点只需看新增的一个 bit 就能确定新位置，要么不动要么移动旧容量的偏移量；三是 2 的幂减 1 全是 1，保证 hash 每一位都参与桶定位，分布更均匀。

</details>

---

### 4. 为什么链表长度 ≥8 转红黑树？为什么不是 6 或 10？

<details>
<summary>查看回答</summary>

**源码注释给出了答案**：理想情况下，hash 分布服从 **泊松分布**，链表长度达到 8 的概率已经是 **0.00000006**（千万分之六），几乎不可能出现。

```
泊松分布下各链表长度的概率：
  0:    0.60653066
  1:    0.30326533
  2:    0.07581633
  3:    0.01263606
  4:    0.00157952
  5:    0.00015795
  6:    0.00001316
  7:    0.00000094
  8:    0.00000006    ← 千万分之六
```

**设计考量**：

| 阈值 | 树化阈值 = 8 | 退化阈值 = 6 |
|---|---|---|
| 转树成本 | 红黑树节点占用空间是链表的 2 倍，转换有开销 |
| 退化缓冲 | 树化 8、退化 6，中间差 2 防止频繁转换震荡 |
| 概率保障 | 正常 hash 下几乎不会到 8，到了说明 hash 极差或被攻击 |

**为什么不用更小的值？** 红黑树节点（TreeNode）是链表节点（Node）空间的 2 倍左右，大多数桶的链表长度不超过 2-3，过早转树浪费内存。

**面试建议回答**：选 8 是基于泊松分布——正常 hash 下链表长度达到 8 的概率只有千万分之六，几乎不会发生，到了说明 hash 质量极差或被攻击。而红黑树节点空间是链表的 2 倍，过早转树浪费内存。退化阈值选 6 而不是 8，留了 2 的缓冲防止频繁链表⇄红黑树转换的震荡。

</details>

---

### 5. HashMap 为什么线程不安全？怎么解决？

<details>
<summary>查看回答</summary>

**线程不安全的表现**：

| 版本 | 问题 | 原因 |
|---|---|---|
| **JDK 1.7** | 死循环（CPU 100%） | 扩容时头插法导致链表成环，get 时死循环 |
| **JDK 1.8** | 数据丢失 | 并发 put 时，两个线程同时写同一个桶，后者覆盖前者 |
| **JDK 1.8** | size 不准确 | `++size` 不是原子操作 |

**解决方案对比**：

| 方案 | 原理 | 性能 | 推荐度 |
|---|---|---|---|
| **ConcurrentHashMap** | JDK 1.8：CAS + synchronized 锁单个桶 | ⭐⭐⭐ | ✅ 首选 |
| `Collections.synchronizedMap` | 包装类，所有方法加 synchronized | ⭐ | ❌ 性能差 |
| Hashtable | 所有方法加 synchronized | ⭐ | ❌ 已过时 |

**ConcurrentHashMap 核心设计（JDK 1.8）**：
- 不再用 Segment 分段锁（JDK 1.7 的做法）
- 用 **CAS + synchronized**：put 时如果桶为空用 CAS 无锁写入，桶不为空则 synchronized 锁住这一个桶的头节点
- 锁粒度从"段"细化到"桶"，并发度等于数组长度

```
ConcurrentHashMap 并发写：

  线程A put(key1) → 定位到桶3 → synchronized(桶3头节点) → 写入
  线程B put(key2) → 定位到桶7 → synchronized(桶7头节点) → 写入
  
  桶3 和桶7 互不干扰，真正并行
```

**面试建议回答**：HashMap 线程不安全——JDK 1.7 扩容头插法会造成链表成环死循环，JDK 1.8 虽改为尾插法解决了死循环，但并发 put 仍会数据丢失、size 不准。解决方案首选 ConcurrentHashMap：JDK 1.8 用 CAS + synchronized 锁单个桶，锁粒度细到桶级别，不同桶完全并行。不推荐 Hashtable 和 synchronizedMap，它们都是全局锁，性能差。

</details>

---

### 6. hashCode()、equals() 和 == 的区别？

<details>
<summary>查看回答</summary>

| 比较方式 | 比较内容 | 适用类型 |
|---|---|---|
| `==` | 基本类型比值，引用类型比**内存地址** | 所有类型 |
| `equals()` | 默认同 `==`，String/Integer 等重写后比**内容** | 对象 |
| `hashCode()` | 返回对象的哈希值（int），用于 HashMap 定位桶 | 对象 |

**HashMap 中的契约**：
- `equals()` 相等 → `hashCode()` **必须相等**（否则同一个 key 落到不同桶，找不到）
- `hashCode()` 相等 → `equals()` **不一定相等**（哈希冲突）
- 重写 `equals()` **必须同时重写** `hashCode()`

**面试建议回答**：`==` 比较引用地址，`equals()` 比较逻辑内容（需重写），`hashCode()` 用于 HashMap 快速定位桶。核心契约是：equals 相等则 hashCode 必须相等，所以重写 equals 必须同时重写 hashCode，否则 HashMap 中会出现"放得进去、取不出来"的问题。

</details>

---

## Java 集合

### 7. LinkedList 和 ArrayList 的底层区别？

<details>
<summary>查看回答</summary>

| 对比项 | ArrayList | LinkedList |
|---|---|---|
| 底层结构 | **动态数组**（Object[]） | **双向链表**（Node 双指针） |
| 随机访问 | O(1)（直接下标） | O(n)（从头/尾遍历） |
| 头部插入/删除 | O(n)（需要移动元素） | O(1)（改指针） |
| 尾部插入 | 均摊 O(1)（扩容时 O(n)） | O(1) |
| 中间插入/删除 | O(n) | O(n)（查找 O(n) + 插入 O(1)） |
| 内存占用 | 紧凑，缓存友好 | 每个节点额外两个指针，内存分散 |
| 扩容 | 1.5 倍扩容，复制数组 | 无扩容概念 |

**面试建议回答**：ArrayList 底层是动态数组，随机访问 O(1)，尾部插入均摊 O(1)，但头部/中间插入需要移动元素；LinkedList 底层是双向链表，头尾插入 O(1)，但随机访问 O(n)。实际开发中 **ArrayList 几乎总是更优**——CPU 缓存对连续内存友好，LinkedList 的指针跳转对缓存不友好，除非有大量头部插入/删除的场景才考虑 LinkedList。

</details>

---

## JVM

### 8. JVM 内存模型和原理？

<details>
<summary>查看回答</summary>

```
JVM 运行时内存：

  ┌─── 线程私有 ──────────────────────┐
  │  程序计数器（PC）：当前执行的字节码行号  │
  │  虚拟机栈：每个方法一个栈帧（局部变量、操作数栈）│
  │  本地方法栈：Native 方法调用           │
  └───────────────────────────────────┘
  ┌─── 线程共享 ──────────────────────┐
  │  堆（Heap）：对象实例，GC 主战场      │
  │    ├─ 新生代（Eden + S0 + S1）      │
  │    └─ 老年代                        │
  │  方法区 / 元空间（Metaspace）：类信息、常量池 │
  └───────────────────────────────────┘
```

**GC 过程**：
- **Minor GC**：清理新生代，Eden → S0/S1 来回复制，存活多次（默认 15）晋升老年代
- **Major/Full GC**：清理老年代 + 新生代，STW 时间长

**常用垃圾收集器**：Serial、Parallel、CMS、**G1**（JDK 9+ 默认）、ZGC（超低延迟）

**面试建议回答**：JVM 内存分线程私有（程序计数器、虚拟机栈、本地方法栈）和线程共享（堆、元空间）。堆分新生代和老年代，新生代用复制算法（Eden + S0/S1），老年代用标记-整理。GC 从 Minor GC（新生代）到 Full GC（全堆），主流收集器是 G1，能兼顾吞吐量和延迟。

</details>

---

### 9. JVM OOM 怎么排查？

<details>
<summary>查看回答</summary>

**常见 OOM 类型**：

| 错误信息 | 原因 |
|---|---|
| `Java heap space` | 堆内存不足，对象太多或内存泄漏 |
| `Metaspace` | 类加载过多（动态代理、反射） |
| `GC overhead limit exceeded` | GC 占用 98%+ CPU 但只回收了 2% 内存 |
| `Unable to create new native thread` | 线程数超限 |

**排查步骤**：

```
1. 启动时加 JVM 参数，OOM 时自动 dump
   -XX:+HeapDumpOnOutOfMemoryError
   -XX:HeapDumpPath=/tmp/heap.hprof

2. 已在运行的服务，手动 dump
   jmap -dump:format=b,file=heap.hprof <pid>

3. 分析 dump 文件
   MAT（Memory Analyzer Tool）/ VisualVM / JProfiler
   → 找到占内存最大的对象 → 看 GC Root 引用链 → 定位泄漏代码

4. 辅助命令
   jstat -gcutil <pid> 1000    # 实时看 GC 频率和各区占用
   jmap -histo <pid>           # 对象数量排行
```

**面试建议回答**：先加 `-XX:+HeapDumpOnOutOfMemoryError` 让 JVM 崩溃时自动 dump，然后用 MAT 分析 dump 文件，找到占用最大的对象，沿 GC Root 引用链定位泄漏代码。辅助用 `jstat` 看 GC 频率，`jmap -histo` 看对象排行。常见原因是集合未清理、缓存无上限、大查询结果未分页。

</details>

---

## Java 并发

### 10. volatile 和 synchronized 的区别？

<details>
<summary>查看回答</summary>

| 对比项 | volatile | synchronized |
|---|---|---|
| 作用级别 | 变量 | 代码块 / 方法 |
| 原子性 | ❌ 不保证（i++ 仍不安全） | ✅ 保证 |
| 可见性 | ✅ 保证（写后立即刷新主存） | ✅ 保证 |
| 有序性 | ✅ 禁止指令重排序 | ✅ 保证 |
| 阻塞 | 不阻塞 | 会阻塞（锁竞争） |
| 性能 | 高 | 相对低 |
| 典型场景 | 状态标志位（`volatile boolean running`） | 临界区保护（计数器、共享数据结构） |

**volatile 典型用法**：DCL（双重检查锁）单例中防止指令重排序：

```java
private static volatile Singleton instance; // 必须加 volatile
```

**面试建议回答**：volatile 保证可见性和有序性但不保证原子性，适合状态标志位；synchronized 三者都保证但会阻塞，适合临界区保护。volatile 是轻量级同步，只能修饰变量；synchronized 是重量级，可以修饰方法和代码块。典型结合场景是 DCL 单例中用 volatile 防止指令重排。

</details>

---

### 11. ThreadLocal 原理、内存泄漏及使用场景？

<details>
<summary>查看回答</summary>

**原理**：每个线程持有自己的 `ThreadLocalMap`，ThreadLocal 对象作为 key，存储线程私有数据。

```
Thread 对象
  └─ ThreadLocalMap（每个线程一份）
       ├─ Entry: ThreadLocal@A（弱引用）→ value1
       ├─ Entry: ThreadLocal@B（弱引用）→ value2
       └─ ...
```

**不是 ThreadLocal 存数据，是 Thread 自己的 Map 存数据**，ThreadLocal 只是那把 key。

**内存泄漏问题**：

```
ThreadLocal 引用被置 null
  → Entry 的 key 是弱引用，GC 后 key 变 null
  → 但 value 是强引用，不会被回收
  → 如果线程长期存活（线程池），value 一直泄漏
```

**解决办法**：用完必须调 `remove()`

```java
ThreadLocal<User> userContext = new ThreadLocal<>();
try {
    userContext.set(currentUser);
    // 业务逻辑...
} finally {
    userContext.remove();  // 必须清理，防止泄漏 + 线程池复用时数据串线程
}
```

**使用场景**：

| 场景 | 示例 |
|---|---|
| 请求上下文传递 | 用户信息、traceId 在调用链中透传 |
| 线程安全的日期格式化 | 每线程一个 SimpleDateFormat（避免加锁） |
| 数据库连接/事务管理 | Spring 用 ThreadLocal 保证同一线程内同一事务 |

**面试建议回答**：ThreadLocal 本质是每个线程自己持有一个 ThreadLocalMap，ThreadLocal 对象做 key 存取线程私有数据，实现线程隔离无需加锁。核心风险是内存泄漏——key 是弱引用会被 GC 回收但 value 是强引用不会，线程池场景下线程复用导致 value 一直堆积，所以用完必须 `remove()`。典型场景是请求上下文透传（userId / traceId）和 Spring 的事务管理。

</details>

---

### 12. 线程池的 corePoolSize 和 maximumPoolSize 参数？

<details>
<summary>查看回答</summary>

**线程池任务提交流程**：

```
提交任务
  │
  ├─ 当前线程数 < corePoolSize？ → 创建核心线程执行
  │
  ├─ 核心线程满了 → 放入 workQueue 队列
  │
  ├─ 队列也满了 + 线程数 < maximumPoolSize？ → 创建非核心线程执行
  │
  └─ 队列满了 + 线程数已达 maximumPoolSize → 执行拒绝策略
```

**核心参数**：

| 参数 | 含义 |
|---|---|
| `corePoolSize` | 核心线程数，即使空闲也不回收（除非设置 allowCoreThreadTimeOut） |
| `maximumPoolSize` | 最大线程数，包括核心 + 非核心 |
| `keepAliveTime` | 非核心线程空闲存活时间 |
| `workQueue` | 阻塞队列（LinkedBlockingQueue / ArrayBlockingQueue / SynchronousQueue） |
| `handler` | 拒绝策略（AbortPolicy 抛异常 / CallerRunsPolicy 调用者执行 / DiscardPolicy 丢弃） |

**面试建议回答**：任务先交给核心线程，满了放队列，队列满了再创建非核心线程直到 maximumPoolSize，全满了执行拒绝策略。core 是常驻线程数，max 是峰值上限。生产中不要用 Executors 的工厂方法（newFixedThreadPool 队列无界可能 OOM），应该手动 new ThreadPoolExecutor 明确所有参数。

</details>

---

### 13. Java 不可变对象（Immutable Object）？

<details>
<summary>查看回答</summary>

**不可变对象**：创建后状态不能被修改的对象。

**典型代表**：String、Integer、LocalDate

**如何实现不可变**：

```java
public final class Money {                    // 1. 类声明 final，禁止继承
    private final int amount;                  // 2. 字段 private final
    private final String currency;

    public Money(int amount, String currency) { // 3. 构造器中赋值
        this.amount = amount;
        this.currency = currency;
    }

    public int getAmount() { return amount; }  // 4. 只有 getter，没有 setter
    public String getCurrency() { return currency; }
    // 5. 如果字段是可变对象（如 Date），getter 返回防御性拷贝
}
```

**好处**：
- **线程安全**：无需同步，天然可在多线程间共享
- **可做 HashMap 的 key**：hashCode 不变，安全
- **安全性**：传递引用不担心被意外修改

**面试建议回答**：不可变对象创建后不能修改，如 String、Integer。实现要点：类 final 禁继承、字段 private final、只提供 getter 不提供 setter、可变字段返回防御性拷贝。最大好处是天然线程安全，无需同步，也适合做 HashMap 的 key。String 不可变正是因此——作为最常用的 HashMap key 和线程间传递对象，不可变保证了安全。

</details>

---

## Spring

### 14. Spring Bean 的生命周期？

<details>
<summary>查看回答</summary>

```
实例化（new）
  → 属性注入（DI）
    → Aware 接口回调（BeanNameAware, ApplicationContextAware 等）
      → BeanPostProcessor.postProcessBeforeInitialization
        → @PostConstruct / InitializingBean.afterPropertiesSet / init-method
          → BeanPostProcessor.postProcessAfterInitialization（AOP 代理在这产生）
            → Bean 就绪，可使用
              → @PreDestroy / DisposableBean.destroy / destroy-method
```

**简化记忆**：**实例化 → 注入 → 初始化回调 → 使用 → 销毁回调**

**BeanPostProcessor 的作用**：所有 Bean 都会经过它，AOP、事务代理、@Autowired 注入都在这一步完成。

**面试建议回答**：Bean 生命周期五步——实例化、属性注入、初始化回调（@PostConstruct）、使用、销毁（@PreDestroy）。关键的扩展点是 BeanPostProcessor，它在初始化前后拦截所有 Bean，AOP 代理就是在 postProcessAfterInitialization 中创建的。

</details>

---

### 15. @Autowired 的原理？

<details>
<summary>查看回答</summary>

**本质**：`@Autowired` 由 `AutowiredAnnotationBeanPostProcessor` 处理，在 Bean 属性注入阶段，通过反射将依赖注入。

**注入流程**：

```
1. 扫描 Bean 中标注了 @Autowired 的字段/方法/构造器
2. 根据类型（byType）从 IoC 容器中查找匹配的 Bean
3. 如果找到多个同类型 Bean：
   ├─ 看有没有 @Primary → 优先
   ├─ 看有没有 @Qualifier("name") → 按名称匹配
   └─ 按字段名匹配 Bean 名称（最后兜底）
4. 通过反射 field.set() 注入
```

**注入方式优先级**（Spring 官方推荐）：
1. **构造器注入**（推荐）：依赖在构造时确定，不可变，方便测试
2. Setter 注入：可选依赖
3. 字段注入（@Autowired 直接加字段上）：最方便但不推荐，无法 final，测试需反射

**面试建议回答**：@Autowired 由 AutowiredAnnotationBeanPostProcessor 在 Bean 初始化阶段处理，按类型查找依赖，多个同类型时用 @Primary 或 @Qualifier 区分，最终通过反射注入。Spring 官方推荐构造器注入——依赖不可变、强制必须注入、方便单元测试。

</details>

---

### 16. SpringBoot 的启动流程？

<details>
<summary>查看回答</summary>

```
main() → SpringApplication.run()
  │
  ├─ 1. 创建 SpringApplication 对象
  │     ├─ 推断应用类型（Servlet / Reactive / None）
  │     └─ 加载 spring.factories 中的 Initializers 和 Listeners
  │
  ├─ 2. 运行 run() 方法
  │     ├─ 创建 Environment（读取 application.yml / 环境变量）
  │     ├─ 创建 ApplicationContext（IoC 容器）
  │     ├─ 执行 @ComponentScan 扫描 Bean 定义
  │     ├─ 处理 @Configuration + @Bean + @Import
  │     ├─ 自动装配：读取 META-INF/spring.factories → @EnableAutoConfiguration
  │     │   └─ 根据 @Conditional 条件决定哪些 AutoConfiguration 生效
  │     ├─ 实例化所有单例 Bean
  │     └─ 启动内嵌 Tomcat / Netty
  │
  └─ 3. 发布 ApplicationReadyEvent → 应用就绪
```

**自动装配核心**：`@SpringBootApplication` = `@ComponentScan` + `@EnableAutoConfiguration` + `@Configuration`。自动装配通过 `spring.factories` 中列出的配置类 + `@Conditional` 条件注解实现"按需加载"。

**面试建议回答**：SpringBoot 启动流程——main 方法调用 SpringApplication.run()，依次创建 Environment 加载配置、创建 IoC 容器、组件扫描、自动装配（读 spring.factories + @Conditional 按需加载）、实例化单例 Bean、启动内嵌服务器。核心是自动装配机制，通过 @EnableAutoConfiguration 和条件注解实现约定大于配置。

</details>

---

## Linux

### 17. Linux 怎么查看系统负载？

<details>
<summary>查看回答</summary>

**核心命令**：

```bash
# 最常用：一行看负载 + CPU + 内存
top

# 快速看负载均值
uptime
# 输出：load average: 1.5, 2.0, 1.8  → 1分钟 / 5分钟 / 15分钟

# 等价于 uptime
cat /proc/loadavg

# 看 CPU 详情
vmstat 1 5          # 每秒一次，共 5 次
mpstat -P ALL 1     # 每个 CPU 核心的使用情况

# 看内存
free -h

# 看磁盘 IO
iostat -x 1
```

**Load Average 怎么解读**：
- Load = 正在运行 + 等待运行的进程/线程数
- **单核**：load 1.0 = 满载，> 1.0 = 排队
- **N 核**：load ≤ N 正常，> N 说明 CPU 不够用
- 看趋势：1min > 15min = 负载在上升，反之在下降

**面试建议回答**：用 `uptime` 或 `top` 看 load average，三个值分别是 1/5/15 分钟平均负载。Load 等于正在运行和等待 CPU 的进程数——N 核机器 load ≤ N 正常，大于 N 说明 CPU 不够用。配合 `vmstat` 看 CPU 等待、`iostat` 看磁盘 IO、`free` 看内存来定位瓶颈。

</details>

---

### 18. SSH 原理？公钥和私钥分别存在哪？

<details>
<summary>查看回答</summary>

**SSH 连接流程**：

```
客户端                                 服务端
  │                                      │
  │─── 1. TCP 连接 ────────────────→     │
  │←── 2. 服务端发公钥 ───────────────    │  (首次连接时 known_hosts 确认)
  │─── 3. 协商对称加密密钥（DH 交换）──→  │
  │                                      │
  │═══════ 加密通道建立 ═══════════════   │
  │                                      │
  │─── 4. 身份认证 ──────────────────→    │
  │   ├─ 密码认证：加密传输密码            │
  │   └─ 密钥认证：                       │
  │      客户端用私钥签名 ──────────→     │
  │      服务端用 authorized_keys        │
  │      中的公钥验签                     │
  └──────────────────────────────────────┘
```

**密钥存放位置**：

| 文件 | 位置 | 作用 |
|---|---|---|
| 私钥 | 客户端 `~/.ssh/id_rsa` | 身份证明，**绝不能泄露** |
| 公钥 | 客户端 `~/.ssh/id_rsa.pub` | 可以分发给任何人 |
| 授权公钥 | 服务端 `~/.ssh/authorized_keys` | 存放允许登录的公钥列表 |
| 已知主机 | 客户端 `~/.ssh/known_hosts` | 记录连过的服务端指纹，防中间人攻击 |

**面试建议回答**：SSH 先通过 DH 密钥交换建立加密通道，再做身份认证。密钥认证时，客户端用私钥签名，服务端用 authorized_keys 中的公钥验签。私钥存在客户端 `~/.ssh/id_rsa`，公钥放到服务端的 `~/.ssh/authorized_keys`。首次连接时 known_hosts 记录服务端指纹，防止中间人攻击。

</details>

---

### 19. history 命令的原理？

<details>
<summary>查看回答</summary>

**原理**：Shell（bash/zsh）在内存中维护一个命令历史列表，退出时写入磁盘文件。

```
当前会话输入命令 → 存入内存中的 history list
  │
  └─ Shell 退出时 → 追加写入 ~/.bash_history（bash）或 ~/.zsh_history（zsh）
     │
     └─ 下次启动 Shell → 从文件读入内存
```

**关键配置**：

| 变量 | 作用 |
|---|---|
| `HISTFILE` | 历史文件路径（默认 `~/.bash_history`） |
| `HISTSIZE` | 内存中保留条数 |
| `HISTFILESIZE` | 文件中保留条数 |
| `HISTCONTROL` | `ignoredups`（去重）/ `ignorespace`（空格开头不记录） |

```bash
history          # 查看历史
!100             # 执行第 100 条命令
!!               # 执行上一条
history -c       # 清空内存中的历史
```

**面试建议回答**：history 原理很简单——Shell 运行时把每条命令存在内存列表中，退出时追加写入 `~/.bash_history` 文件，下次启动再读入。通过 HISTSIZE 控制条数，HISTCONTROL 控制去重策略。

</details>

---

### 20. kill 命令的原理？

<details>
<summary>查看回答</summary>

**本质**：kill 不是"杀死"，而是 **向进程发送信号（Signal）**。

**常用信号**：

| 信号 | 编号 | 行为 | 可捕获 |
|---|---|---|---|
| `SIGTERM` | 15 | 优雅终止（默认信号） | ✅ 可捕获 |
| `SIGKILL` | 9 | 强制终止 | ❌ 不可捕获 |
| `SIGHUP` | 1 | 终端挂断 / 重新加载配置 | ✅ |
| `SIGINT` | 2 | 中断（Ctrl+C） | ✅ |
| `SIGSTOP` | 19 | 暂停进程 | ❌ |

```bash
kill <pid>        # 默认发 SIGTERM（15），允许进程清理后退出
kill -9 <pid>     # 发 SIGKILL，内核直接杀，进程没机会清理
kill -HUP <pid>   # 通常用于让守护进程重新加载配置（如 Nginx）
```

**为什么不要直接 kill -9**：
- 进程无法执行清理（关闭连接、刷写缓冲、释放锁、删除临时文件）
- 正确做法：先 `kill`（SIGTERM），等几秒，不退出再 `kill -9`
- K8s 的 Pod 终止也是这个流程：先 SIGTERM，等 `terminationGracePeriodSeconds`（默认 30s），再 SIGKILL

**面试建议回答**：kill 本质是发信号，默认发 SIGTERM（15）允许进程优雅退出，kill -9 发 SIGKILL 由内核强制终止，进程无法捕获和清理。生产中应先 SIGTERM 等待清理，超时再 SIGKILL。K8s 删 Pod 也遵循这个流程。

</details>

---

## 测试

### 21. Service to Service 的测试方案？

<details>
<summary>查看回答</summary>

| 测试层级 | 方式 | 工具 | 场景 |
|---|---|---|---|
| **单元测试** | Mock 外部依赖 | Mockito / WireMock | 隔离测试单个服务逻辑 |
| **契约测试** | 定义接口契约，双方各自验证 | Pact / Spring Cloud Contract | 确保接口变更不破坏消费方 |
| **集成测试** | 真实调用下游服务 | Testcontainers / docker-compose | 验证服务间真实通信 |
| **E2E 测试** | 全链路模拟真实请求 | Postman / Newman / K6 | 验证完整业务流程 |

**契约测试是 S2S 测试的核心**：
- **Consumer（消费方）** 定义"我期望你返回什么格式"
- **Provider（提供方）** 验证"我确实能返回这种格式"
- 双方独立运行，不需要同时启动
- 解决了"你改了接口我不知道"的问题

**面试建议回答**：Service to Service 测试分四层——单元测试用 Mock 隔离依赖、契约测试用 Pact 确保接口兼容、集成测试用 Testcontainers 验证真实通信、E2E 验证全链路。核心是契约测试，消费方定义期望、提供方验证承诺，双方独立运行，解决接口变更的兼容性问题。

</details>

---

## 服务稳定性

### 22. 服务的 Reliability（可靠性）治理包括哪些？

<details>
<summary>查看回答</summary>

| 维度 | 内容 |
|---|---|
| **SLA/SLO/SLI 体系** | 定义可用性目标（如 99.95%），明确关键指标（延迟、错误率、吞吐量） |
| **可观测性** | 日志（ELK / Loki）、指标（Prometheus）、链路追踪（Jaeger / OpenTelemetry）三支柱 |
| **容错设计** | 超时、重试（指数退避）、熔断（Circuit Breaker）、限流、降级、隔离舱 |
| **冗余与高可用** | 多副本、跨 AZ 部署、负载均衡、主备切换 |
| **变更管理** | 灰度发布、金丝雀发布、Feature Flag、发布回滚机制 |
| **混沌工程** | 主动注入故障（Chaos Monkey / Litmus），验证系统容错能力 |
| **On-call 体系** | 告警分级、值班轮转、TSG 诊断手册、事后 RCA 复盘 |
| **容量规划** | 压测（QPS 上限）、弹性伸缩（HPA/KEDA）、资源水位监控 |

**面试建议回答**：Reliability 治理我总结为八个维度——SLO 体系定目标、可观测性三支柱做感知、容错设计（超时/重试/熔断/限流）保韧性、多副本跨 AZ 保高可用、灰度发布控变更风险、混沌工程主动验证、On-call + RCA 闭环做运营、容量规划防过载。核心思路是"定义好、看得到、扛得住、改得稳、查得快"。

</details>
