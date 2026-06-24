---
title: AI 中转站连续三天故障复盘：不是业务打爆机器，而是 Ubuntu/KVM 生产机 soft lockup
author: TouHouQing
description: 这是一篇 AI 中转站连续三天异常的事故复盘：前两天是 Ubuntu 24.04 KVM 生产机 soft lockup，第三天是服务商官方维护。我们已经做了倍率下调、赠送额度和优惠券补偿，同时完成日志降压、Docker 日志轮转、journald 调整、巡检自愈和 HWE virtual 内核切换准备。
---

![AI 中转站 soft lockup 封面](/Users/touhouqing/Desktop/GIT/hexoBlog/source/img/posts/ubuntu-kvm-soft-lockup-console.jpg)

这几天 AI 中转站连续出问题，先跟受影响的用户说一声抱歉。

前两天是生产服务器每天瘫一次。

第三天是服务商官方维护。

这几天我们做了补偿：

* 部分分组做永久倍率下调。
* 抽20张余额兑换码。
* 发放价值5到20元优惠券。

我最开始也怀疑：是不是业务把机器打爆了？

后来把日志、Docker、journald、内核版本和虚拟化环境串起来看，结论反而不是这样。

**前两天 AI 中转站生产机崩溃，更像是 Ubuntu/KVM 虚拟机里一条系统级链路被压到了极限，而不是 `sub2api` 单纯把 CPU 或内存吃满。**

VNC 上能看到的日志大概是这样：

```text
watchdog: BUG: soft lockup - CPU#6 stuck for 40s! [kworker/u16:8:415303]
watchdog: BUG: soft lockup - CPU#7 stuck for 40s! [kworker/u16:3:391444]
INFO: task systemd-journal:387 blocked for more than 122 seconds.
systemd[1]: Failed to start systemd-journald.service - Journal Service.
```

当时不是“接口慢一点”。

是 SSH 基本连不上，业务不响应，Docker healthcheck 和 `exec` 大量 timeout，VNC 还能显示日志，但机器已经卡得很深。

## 第三天是服务器官方维护

第三天后来从工单确认是官方维护。

![服务商工单里的维护通知](/Users/touhouqing/Desktop/GIT/hexoBlog/source/img/posts/ubuntu-kvm-provider-maintenance.jpg)

工单里说得很明确：维护正在进行，目的是提升服务可靠性和运行性能，预计一小时内完成。

技术上要分开看：

* 前两天：我的生产虚拟机系统级卡死。
* 第三天：服务商官方维护。

所以我这次做了两件事：

* 用户侧，降倍率、补额度、发优惠券。
* 技术侧，把机器从内核到 Docker 日志全部排了一遍。

## 机器其实很简单

这台服务器主要就是跑 AI 中转站：

* Ubuntu 24.04.4 LTS
* KVM/QEMU 虚拟机
* 8 核 CPU
* 约 16GB 内存
* Docker 里跑 `sub2api`
* 配套 Postgres 和 Redis

它不是那种塞了几十个服务的机器。

所以崩的时候，我第一反应就是看最基本的指标：

* 磁盘满没满？
* inode 满没满？
* 内存有没有被吃爆？
* 有没有明显业务进程把 CPU 打满？

结果都不是特别符合。

磁盘空间没耗尽，inode 没耗尽，内存整体也没被打爆。

但有几个信号很不对：

* `kworker` 卡住。
* `systemd-journal` blocked 超过 122 秒。
* 内核报 `soft lockup`。
* Docker `exec` / healthcheck 大面积 timeout。
* 历史调用栈里出现 `ext4_sync_file`、`jbd2_journal_force_commit`、`fdatasync`。

这些东西连在一起，就不像普通应用问题了。

如果只是业务代码有 bug，常见的是业务进程 CPU 高、内存高、连接堆积、数据库慢查询。

但这次更像系统写盘同步链路被拖住，连 journald 和 kworker 都陷进去了。

**所以我现在更倾向于认为：`journald` 启动失败不是根因，它只是底层 I/O 或内核卡住后的受害者。**

## 我最后把问题拆成几层

第一层，是内核。

前两天事故都发生在 `6.8.0-124-generic`。`soft lockup`、`kworker stuck`、`systemd-journald blocked` 一起出现，说明问题已经不只是在容器里。

第二层，是写盘同步链路。

历史日志里出现过：

```text
ext4_sync_file
jbd2_journal_force_commit
fdatasync
```

这几个词基本都在提醒我：系统可能卡在 ext4 文件系统日志提交、磁盘同步这条路径上。

第三层，是 Docker 日志。

`sub2api` 容器的 Docker JSON 日志曾经涨到约 `1.2G`。平时看只是占空间，但系统抖动时，巨型日志文件和持续写入会变成压力。

第四层，是 UFW 日志。

公网机器每天都会被扫。UFW logging 打开后，大量 `[UFW BLOCK]` 会进入 kernel log / journald。

平时只是烦，故障时就是往火上加油。

第五层，是 KVM 虚拟化环境。

这台机器是 KVM/QEMU 虚拟机，历史日志里还出现过 `clocksource skew`。

它不能证明宿主机一定有问题，但至少提醒我，虚拟化时钟、宿主机调度、虚拟磁盘后端不能当成完全透明。

当你同时看到：

* `clocksource skew`
* `kworker soft lockup`
* `ext4/jbd2/fdatasync`
* journald blocked
* Docker healthcheck timeout

就不能只盯着业务代码看了。

## 我的判断

我现在的判断是：

**前两天 AI 中转站生产机崩溃，不像是业务单纯把 CPU 或内存打满；更像是 KVM 虚拟机环境下，内核 `6.8.0-124-generic`、虚拟磁盘 I/O、ext4 journal commit、Docker 日志写入、journald 写盘、UFW 日志刷屏共同叠加后触发的系统级 `soft lockup`。**

真正根因可能在几处之间：

* 虚拟化层
* 宿主机调度
* 存储后端
* 内核 bug
* 日志写入链路放大

## 我做了哪些修复

第一，日志降压。

我关了 UFW logging，限制 journald 体积，把 journald 改成 `Storage=volatile`，主要写 `/run` 内存日志，同时关闭转发到 syslog。

这会牺牲一部分重启后的历史日志，但这次我更在意机器别再卡死。

第二，Docker 日志治理。

Docker daemon 加了日志轮转：

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "3"
  }
}
```

同时给已经运行中的容器加 `logrotate` 兜底，把那份约 `1.2G` 的 `sub2api` JSON 日志截断到 KB/MB 级别。

第三，打开系统自动恢复。

```text
kernel.softlockup_panic=1
kernel.hung_task_panic=1
kernel.panic=30
kernel.nmi_watchdog=1
vm.panic_on_oom=1
```

意思很简单：真的 soft lockup 了，就不要半死不活挂着，panic 后 30 秒自动重启。

第四，重新划容器资源边界。

| 服务         |  内存 | CPU | PIDs |
| ---------- | --: | --: | ---: |
| `sub2api`  | 10G |   7 | 8192 |
| `postgres` |  4G |   3 | 2048 |
| `redis`    |  1G |   1 | 1024 |

目标不是压业务，而是防止异常状态下某个容器把整台机器一起拖下水。

第五，降低 healthcheck 压力。

Postgres / Redis healthcheck 从 10 秒一次降到 60 秒一次。

正常时 10 秒没问题，但系统抖动时，Docker 不断创建 `exec` healthcheck，可能会继续给 `dockerd` / `containerd` 加压。

第六，加巡检和自愈。

我新增了一个 systemd timer，每 5 分钟检查一次：

* `systemd-journald` 是否 active。
* Docker JSON 日志是否超过阈值。
* UFW logging 是否被重新打开。
* 磁盘和 inode 使用率。
* 最近 10 分钟有没有 `soft lockup`、`hung task`、I/O error。
* `sub2api /health` 是否正常，连续失败 3 次就拉起 compose stack。

第七，准备切内核。

当前故障发生在：

```text
6.8.0-124-generic
```

我最后安装了 Ubuntu 24.04 的 HWE virtual 内核：

```text
linux-virtual-hwe-24.04
6.17.0-35.35~24.04.1
```

并设置下次启动进入：

```text
6.17.0-35-generic
```

目前还没在高峰期主动重启，等业务低峰再切。

## 现在的状态

目前服务器状态是：

* `systemctl --failed`: 0 failed units
* `systemd-journald`: active
* `sub2api` / `postgres` / `redis`: 全部 healthy
* `sub2api /health`: 返回 `{"status":"ok"}`
* Docker 日志：已控制在 MB 级别
* 根分区和 `/boot` 空间：正常
* 下次重启：进入 `6.17.0-35-generic` HWE 内核

用户侧也在处理：

* 受影响期间降低倍率。
* 给受影响用户补发额度。
* 发放优惠券，抵消这几天不稳定带来的体验损失。

这些补偿解决不了技术问题，但这是服务出问题后该有的态度。

## 最后说几句

这次最大的提醒是：AI 中转站这种服务，用户体感比后台原因重要。

你后台可以解释内核、虚拟化、journald、Docker 日志、服务商维护，但用户感受到的就是不能用。

所以复盘不能只写技术，也要承认影响和补偿。

技术上，服务器“卡死”也不一定是应用 CPU / 内存打满。

如果 VNC 里已经看到 `watchdog: BUG: soft lockup`，排查层级就要下沉到内核态。

`journald` 启动失败也不一定是 journald 本身坏了。

它可能只是底层 I/O 或内核卡住后，第一个被你看到的受害者。

Docker JSON 日志和 UFW 日志刷屏，也真的会放大故障。

这次真正有价值的修复，不是“重启一下”，而是：

* 日志降压
* Docker 日志轮转
* journald volatile
* watchdog 自动恢复
* 容器资源规划
* healthcheck 降频
* 定时巡检自愈
* 切换更合适的 virtual / HWE 内核

最后总结一句：

**这次 AI 中转站连续故障，不是一个组件单独坏了，更像是一条系统链路被压到极限后的连锁反应。**

后面我会继续观察新内核生效后的稳定性，也会继续把日志、监控和补偿机制补齐。
