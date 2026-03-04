---
layout: center
transition: blur-in
---

<ThemeTitle number="1" >
React 的核心模型
</ThemeTitle>

---
layout: center
---

<ChapterTitle number="1" subtitle="React 核心觀念 - 聲明式">
  <span class="font-mono italic !leading-[0]">UI = f(state)</span>
</ChapterTitle>

<!--
相信你們在學 React 的過程中，
可能會聽過這句話 — **React 是聲明式（declarative）的框架**

那聲明式是什麼意思呢？
-->

---

# UI = f(state) 、聲明式是什麼意思？

只要描述 <span v-mark="{ color: 'var(--secondary)', at: 1 }">「你想要的結果是什麼」，不用去寫「怎麼一步步達成這個結果」</span>

<v-clicks at="2">

<h2>

描述你想要的 UI 是什麼樣子（利用 state、jsx 等）
<br/>
<br/>
React 會在背後處理所有事情

</h2>
</v-clicks>

<!--
[click]
他的意思是我們只要描述「你想要的結果是什麼」，不用去寫「怎麼一步步達成這個結果」。

[click]
而在 React 裡的意思就是
你只需要描述你想要的 UI 是什麼樣子（利用 state、jsx 等）， React 會在背後處理所有事情

什麼意思呢？我們來看個具體的例子
-->

---

# 聲明式的範例

假設我們現在想在點擊按鈕時，顯示/隱藏一段文字。

````md magic-move
```html {*|6-7|9,15|10-14}
// 原生 JavaScript 的寫法 - 命令式
<button id="toggleBtn">切換</button>
<div id="text" style="display: none;">Hello World</div>

<script>
  const btn = document.getElementById('toggleBtn');
  const text = document.getElementById('text');

  btn.addEventListener('click', () => {
    if (text.style.display === 'none') {
      text.style.display = 'block';
    } else {
      text.style.display = 'none';
    }
  });
</script>
```

```js {*|3|8}
// React 的寫法 - 聲明式
function App() {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <button onClick={() => setVisible(!visible)}>切換</button>
      {visible && <div>Hello World</div>}
    </div>
  );
}
```
````

<!--
假設我們現在想在點擊按鈕時，來去顯示/隱藏一段文字

在原生的 JS 中，我們需要一步一步告訴程式該怎麼做：


[click]1. 先抓取 DOM。
[click]2. 然後加監聽器。
[click]3. 控制 display 的邏輯

這就是命令式 —— 我們要把「怎麼做」全寫出來了。如果你有寫過稍微大型的原生 JS 專案，你就可以很清楚感受到這是一件非常麻煩的事情，也不容易去維護，因為我們要寫出所有的邏輯，還要確保之間的邏輯不會互相影響。

[click]
而在 React 你只要描述「根據現在的狀態，UI 要長什麼樣」就好了：

[click]1. 定義狀態 visible。
[click]2. UI 是依據 visible 值來決定要不要顯示 `<div>Hello World</div>`。

3. 我們不用處理 DOM，也不用設定 display，不管元素要不要出現 —— React 會幫你根據 state 來做。
-->

---
layout: center
---

# `UI = f(state)`

<v-clicks>

在 React 裡，UI 是由 state 推導出來的。

UI 就是執行一個 function 後的結果

</v-clicks>

<!--
[click]
從上面的範例，我們可以感受到
在 React 裡，UI 是由 state 推導出來的

[click]
換句話說，UI 就是執行一個 function 後的結果
而結果會因為 state 的改變而有所不同

也就是標題的公式

很多 React 新手，因為沒有理解這個概念，所以會覺得 React 很難。

包括我一開始也是，所以對說 React 來說重要的是資料，以及資料該怎麼顯示

知道這一點後，整個開發後想法就會變得清晰，當我們需要改變畫面時，就要用 state 去控制，反過來說，畫面不需要更新的時候，我們就不需要用 state，這也是一個優化技巧，會在後面提到
-->

---

# State 改變會發生什麼？

state 改變 &rarr; UI 更新：

```js {3}
<div>
  <button onClick={() => setVisible(!visible)}>切換</button>
  {visible && <div>Hello World</div>}
</div>
```

<v-clicks>

<h2 class="pt-8">React 是怎麼讓 UI 更新的？</h2>

1. **Render Phase**：重新執行 component function，產出新的 JSX 結構
2. **Reconciliation Phase**：比對新舊 JSX，找出差異
3. **Commit Phase**：實際更新 DOM，讓畫面反映新的狀態

</v-clicks>

<!--
好，那 state 改變會發生什麼事情呢？

回到剛剛的範例，像這裡的 visible 變 true 時，就要顯示 Hello World

這代表只要 state 改變，UI 就應該跟著改變，

[click]
那問題來了：

React 是怎麼讓 UI 更新的？

其實就是三個階段：

[click]

1. Render Phase：重新執行 component function，產出新的 JSX 結構
2. Reconciliation：比對新舊 JSX，找出差異
3. Commit Phase：實際更新 DOM，讓畫面反映新的狀態

大部分的人會把 Reconciliation 和 render phase 放在一起說，那這邊把它單獨拿開來是為了讓流程看起來更清晰

那我們先從 render phase 開始
-->

---
layout: center
---

<ChapterTitle number="2" subtitle="React Render Phase 的">
本質是什麼？
</ChapterTitle>

<!--
那 render phase 的具體過程是什麼呢？
-->

---

# Render Phase 的具體過程

<v-clicks>

- state 改變時，React 在 Render Phase 會重新執行整個 component function
- 用新的 state & jsx 產出新的 UI 結構
- Render Phase 的過程是可以被中斷的，為了能及時回應使用者操作（如滑鼠移動、點擊）。

</v-clicks>

<v-click>

```jsx
export default function App() {
  console.log('call function');

  const [count, setCount] = useState(0);

  return (
    <div>
      {console.log('return jsx')}
      <h1>現在的數字：{count}</h1>
      <Button onClick={() => setCount(count + 1)}>+1</Button>
    </div>
  );
}
```

</v-click>

<!--
其實前面已經暴雷了，render phase 非常單純，

[click]
他會重新執行整個 component function

[click]
並用新的 state 搭配 jsx 來產出新的畫面結果

[click]
並且 render phase 的過程是可以被中斷的，這是 react 背後的優化機制，背後有很多相關的應用，像是 useTransition 就是其中一個例子，不過這個 hook 用到的場景很少。對使用者來說，最直觀的就是能及時回應使用者操作（如滑鼠移動、點擊），不會為了執行 function 產出新的 jsx 而造成掉幀和卡頓。


[click]
好，那如果 Render phase 只是執行一個 Function，那我們是不是可以透過 console.log() 來實際觀察到 render 時的順序呢？

我們來試試看，這邊我在組件一開始用 `console.log` 以及在 JSX 中也用 `console.log` 來觀察 Re-Render 的順序：
-->

---

<Video>
<source src="/ch-1/1-2/0.mp4" type="video/mp4" />
</Video>

**每次 Re-render，React 都會重新執行這個 Functional Component 並回傳新的 JSX**

<!--
每次當我們按下按鈕、改變 state，就會在 console 中依序看到：

call function
return jsx

所以這樣就真的證明說，render phase 會重新執行整個 component
-->

---
layout: center
---

# Reconciliation Phase

產出新的 jsx 後，React 會進入 Reconciliation 階段，比對新舊 jsx 的差異，並標記出需要更新的部分

<!--
執行完 Component Function 並產出新的 UI JSX 後，我們就會進入 Reconciliation 階段，這邊會比對新舊 JSX 的差異，並標記出需要更新的部分。

這個地方的細節會留到最後一個章節來說，這裡先有個概念即可
-->

---
layout: center
---

<ChapterTitle number="3" subtitle="Render Phase 之後">
Commit Phase (階段)
</ChapterTitle>

<!--
Reconciliation Phase 結束後，就會進入到 Commit Phase，

**那這邊有個小觀念，render 完其實並不代表畫面已經更新了**

**Render 完並且比較完 JSX 的差異，進入到 commit phase 後，才會真正更新 DOM，讓畫面反映新的狀態。**
-->

---

# Commit Phase 做了哪些事情？

<HStack class="max-w-2xl mx-auto mt-20">

<v-clicks>

<Card headerNumber="1">
<template #header>
更新 DOM
</template>

1.  加入 / 移除 / 修改 DOM 元素
2.  設定 ref

</Card>

<Card headerNumber="2">
  <template #header>
  執行副作用
  </template>

1. useLayoutEffect（DOM 更新後立即執行，同步）
2. useEffect（瀏覽器繪製完成後執行，非同步）

</Card>

</v-clicks>

</HStack>

<v-click>

<div class="text-center pt-4">

**Commit Phase 不可被中斷**

</div>

</v-click>

<!--
commit phase 的底層實現非常複雜，其實我們也沒必要真的去看懂 React 的原始程式碼，除非你很有興趣

但我們最少要知道在 commit phase 做了這些事情

[click]
1. 更新真實 DOM
  加入 / 移除 / 修改 DOM 元素
  並且 設定 dom ref 


[click]

1. 執行副作用： useLayoutEffect 與 useEffect
   - `useLayoutEffect`：DOM 更新後立即執行，同步，會阻塞繪製，所以 React 說不要大量使用 useLayoutEffect。
- `useEffect`：瀏覽器繪製完成後執行，非同步。

所以我們會用 useLayoutEffect 提前測量 DOM 元素，而 useEffect 用來做 API 呼叫、事件訂閱等和外部系統的連接。


[click]

Commit Phase 和 Render Phase 不同的地方在於，**Commit Phase 是不可被中斷，這是為了確保畫面能夠及時更新**，如果一次只更新一半的 DOM 其實也會影響使用者使用。

所以如果你一次更新大量的 DOM，在 Commit Phase 還是有可能會造成卡頓。
-->

---

# CH 1 總結

<v-click>

<span v-mark="{ color: 'var(--secondary)', at: 1 }">Re-render 就是重新執行 Component Function</span>

</v-click>

<v-click>

- **Trigger**: State 改變
- **Render Phase**: 算出需要更新的 DOM (Reconciliation)
- **Commit Phase**: 真正更新 DOM、執行 Effect

  **Trigger <span font-mono>-></span> Render Phase <span font-mono>-></span> Commit Phase**

</v-click>

<v-click>

## 為什麼要理解 UI = f(state) 和 Re-render？

</v-click>

<v-click>

這是後面所有效能優化的基礎，像是：

</v-click>

<v-clicks>

- 為什麼要記憶化？因為不想讓 UI 不必要地重算。
- 為什麼要觀察 re-render？因為要搞清楚是誰的 state 變了。
- 為什麼有些 useEffect 會跑太多次？因為依賴陣列每次 render 都在變。

</v-clicks>

<!--
最後總結一下第一章節的內容

[click]
Re-render 就是重新執行 component function，並用新的 state 搭配 jsx 來產出新的畫面結果

[click]
整體過程是

- **Trigger**: State 改變
- **Render Phase**: 算出需要更新的 DOM (Reconciliation)
- **Commit Phase**: 真正更新 DOM、執行 Effect

[click]
那為什麼要理解 UI = f(state) 和 Re-render 呢？

[click]
這是後面所有效能優化的基礎，像是：

[click]
為什麼要記憶化？因為不想讓 UI 不必要地重算。

[click]
為什麼要觀察 re-render？因為要搞清楚是誰的 state 變了。

[click]
為什麼有些 useEffect 會跑太多次？因為依賴陣列每次 render 都在變。

這些都跟 state、re-render、commit 有關係。

有了大致的 React 運作流程後，我們就可以更仔細的聊聊 state 和 effect
-->
