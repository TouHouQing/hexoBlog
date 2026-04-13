---
title: 算法笔记java
date: 2025-09-04 10:56:56
updated: 2025-09-04 10:58:46
categories:
  - Wiki
tags:
  - 笔记
wiki: true
top_img: false
permalink: 'wiki/algorithms-java-notes/'
---
### 拓扑排序

``` java
class Solution {
    // 返回有向无环图（DAG）的其中一个拓扑序
    // 如果图中有环，返回空列表
    // 节点编号从 0 到 n-1
    public List<Integer> topologicalSort(int n, int[][] edges) {
        List<Integer>[] g = new ArrayList[n];
        Arrays.setAll(g, _ -> new ArrayList<>());
        int[] inDeg = new int[n];
        for (int[] e : edges) {
            int x = e[0];
            int y = e[1];
            g[x].add(y);
            inDeg[y]++; // 统计 y 的先修课数量
        }

        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            if (inDeg[i] == 0) { // 没有先修课，可以直接上
                q.offer(i); // 加入学习队列
            }
        }

        List<Integer> topoOrder = new ArrayList<>();
        while (!q.isEmpty()) {
            int x = q.poll();
            topoOrder.add(x);
            for (int y : g[x]) {
                inDeg[y]--; // 修完 x 后，y 的先修课数量减一
                if (inDeg[y] == 0) { // y 的先修课全部上完
                    q.offer(y); // 加入学习队列
                }
            }
        }

        if (topoOrder.size() < n) { // 图中有环
            return List.of();
        }
        return topoOrder;
    }
}
```