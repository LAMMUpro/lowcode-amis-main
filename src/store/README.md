## mobx-state-tree

修改状态需要在actions里面
异步操作需要套一层

```tsx
const updatePageNodes = flow (function *() {
  const res = yield findManyPageNode();
  ...
})
```
