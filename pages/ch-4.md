---
layout: center
---

<ChapterTitle number="09">
辨識 Re-render 的第一步
<br/>
console.log 除錯法
</ChapterTitle>

<!--
上個章節，我們談完了 4 種 Re-render 的場景

這個章節開始，我們就要來更進一步，看看平常在實務開發上，要怎麼更好的觀察 Re-render 和除錯！

首先第一種方式，就是 `console.log` 它是最直接也最常用的除錯方式之一，

雖然有點「土法煉鋼」，但實務上，它能夠非常快速幫助我們掌握組件的 e-render 行為。
-->

---

# `console.log` 示範

````md magic-move
```jsx {*|1-4,7|9|11-13|15-18|22}
function initState() {
  console.log('init state');
  return 0;
}

export default function Page() {
  const [state, setState] = useState(initState);

  console.log('re-render');

  useEffect(() => {
    console.log('useEffect');
  }, [state]);

  const memoizedValue = useMemo(() => {
    console.log('useMemo');
    return state;
  }, [state]);

  return (
    <div>
      {console.log('element')}
      <button onClick={() => setState(state + 1)}>+1</button>
    </div>
  );
}
```
````

<!--
這邊簡單舉幾個例子來讓你看看 console.log 的應用：

[click]
像是 state 的初始化

[click]
組件有沒有 re-render

[click]
effect 的執行時機

[click]
useMemo 實際上有沒有生效

[click]
甚至 element 的渲染時機等等

這樣的 log 能讓你快速判斷哪些 state 或 props 改變會觸發 render，對於追蹤效能問題或是理解組件行為是非常有幫助。

我最早也是透過瘋狂 console.log 來理解 React 的機制，如果你對 React 的機制不清楚，可以試試看這個方法。
-->

---
layout: center
---

# 總結

想提醒大家，`console.log` 也是非常好用的

善用好的話，我們也能很快定位出 Bug 或程式問題哦！

<!--
這個章節的內容很單純，只是想提醒大家，`console.log` 也是非常好用的

善用好的話，我們也能很快定位出 Bug 或程式問題哦！

下個章節，我們要來聊聊官方推出的 React DevTools，這是一個很常見，但絕大部分工程師都用不好的一個工具！
-->

---
layout: center
---

<ChapterTitle number="10">
深入官方的 React Dev Tools
<br/>
你一定要知道的用法
</ChapterTitle>

<!--
上個章節，我們介紹使用 console.log 來除錯，並且了解 React 的運行時機。

第二個要推薦的方法是 React 官方推出的 React DevTools，相信大部分的人都知道這個工具，但儘管如此，我發現仍然有非常多的工程師並不了解這個工具強大的地方

所以這個章節會來分享一些進階的應用，深入了解如何善用 React DevTools 來幫助你除錯和進行效能分析。
-->

---

# React Developer Tools 是什麼？

專為 React 應用程式打造的瀏覽器擴充套件：

<v-clicks>

1. 檢查組件的 props、state、context、hooks
2. 追蹤 re-render 的次數、來源和時間
3. 分析效能瓶頸
4. **快速跳轉至原始碼位置**

</v-clicks>

<!--
那如果你不知道他是什麼，這邊快速介紹一下

React DevTools 是一個專為 React 應用程式打造的瀏覽器擴充套件（Chrome/Firefox），它能讓你：

[click]
檢查組件的 props、state、context、hooks。

[click]
追蹤 re-render 的次數、來源和時間。

[click]
分析效能瓶頸。

[click]
快速跳轉至原始碼位置。

……等等

我覺得快速定位原始碼是非常強大的功能，有時候接手某個專案時，如果沒有這個工具，你會花很多時間在找原始碼上。所以等等也會講如何快速定位原始程式碼
-->

---

# 如何安裝 React DevTools

<ZStack>

<div v-click.hide>

<p>Google 搜尋 React Developer Tools</p>

<img src="/ch-4/0.png" class="max-w-[700px]" />

</div>

<div v-click="[1,2]">

<p>安裝完成後，開啟你的 React 專案並打開 DevTools，你就會看到新增的 Components 和 Profiler 分頁</p>

<img src="/ch-4/1.png" class="max-w-[650px]" />

</div>

<div v-click="2">

<p>如果你是第一次安裝，記得去插件的設定，讓這個插件能夠讀取你的檔案</p>

<img src="/ch-4/2.png" class="max-w-[300px]" />

</div>

</ZStack>

<!--
這邊也快速講一下怎麼安裝

基本上去 Google 搜尋就可以找到

[click]
安裝完後開啟你的 devtools，通常是按 F12，或是點右點，選擇檢查也可以，打開後就可以看到 Components 和 Profiler 分頁

[click]
如果你是第一次安裝，通常要去插件的設定勾選這個選項，讓他能夠讀取你的 React 檔案，這樣他才能正常運作

之前有遇過工程師說有安裝，但是都不能用就沒去了解這個工具了，這樣蠻可惜的哦
-->

---

# Components Tab - 觀察 props、state、Hooks 和 context

<Video controls src="/ch-4/3-component-tab.mp4" class="max-h-[450px]" />

<!--
React DevTools 主要有兩個核心功能（分頁）：Components 和 Profiler，先來介紹 Components 分頁

我們點擊 Components 分頁後，可以看到左上角有個小箭頭，點擊小箭頭後就能選取你想觀察的組件，比如這邊我有一個 Todo List 的小範例，我就可以選取 TodoForm 這個組件來觀察他的內部資料，包括：

傳入的 props

組件內部的 state

使用的 useEffect、useMemo、useCallback 等 Hook 的值等等。

我也能直接在這邊更改 state，他會跟 UI 同步，這樣就可以讓我們很好的 debug

不過使用 webpack 的話，他沒辦法顯示 state 的名稱，這個問題挺久了，到現在都還沒修好，比較可惜
-->

---

# Components Tab - 打印組件資料

<Video controls src="/ch-4/4-console.mp4" class="max-h-[450px]" />

<!--
如果你想看更詳細的組件資料，你也可以點擊右上角的 bug 圖示直接打印他到 console 的 tab，一樣可以看到他的 state、hooks 以及他的子元素
-->

---

# Components Tab - 定位組件位置

<Video controls src="/ch-4/5-url.mp4" class="max-h-[450px]" />

<!--
接下來是我覺得很實用的功能，我可以快速找到組件的專案裡的位置

例如我想要找這個 edit 的按鈕在哪裡，我可以直接選取他，並且點擊 startEditing 找到原始程式碼，在原始程式碼點擊右鍵複製路徑，最後回到 IDE 貼上，就能快速定位檔案位置

在接手大專案的時候特別實用

補充一下，其實 React Dev Tools 也有提供直接打開 IDE 並定位程式碼的功能，但我在使用 Next.js 以及 Remix 的時候都不起作用，上網查也有看到有人反應，但沒有解決方法，所以這邊就沒有介紹了，複製路徑雖然多幾個步驟，但也非常實用了
-->

---

# Components Tab - 強制 Suspense

<Video controls src="/ch-4/6-suspense.mp4" class="max-h-[450px]" />

<!--
還有一個我覺得很讚的功能，就是他可以強制組件 Suspense

有時候組件 loading 速度太快，來不及看到 loading 的狀態，這時候就可以使用這個功能，強制讓組件進入 loading 狀態來 debug
-->

---

# Profiler Tab

<Video controls src="/ch-4/7-profiler.mp4" class="max-h-[450px]" />

<!--
另一個功能是 Profiler Tab，他會顯示應用程式 render 時的資料，在我們發現應用變慢或出現不要的重新渲染時，使用他就可以讓我們快速找到問題來優化。

如何使用？

使用上也很簡單：

先切到 Profiler Tab

點擊中間或是右上角的藍色圓點來開始錄影

接著操作你的應用程式，例如點擊按鈕、輸入資料等

操作完後點擊紅色圓點來停止錄影

此時他就會顯示你的 re-render 資料

可以發現這裡面很多資訊，我第一次接觸的時候覺得東西也太多

就直接放棄理解了，後來發現沒這麼難

所以我來帶你們簡單看一下每個資訊的意義
-->

---

# Profiler Tab - Re-render 次數

<img src="/ch-4/8-profiler-bar.png" class="max-h-[440px]" />

<Arrow color="var(--secondary)" width="5" x1="760" y1="20" x2="660" y2="120" v-click="[1,2]" />

<Arrow color="var(--secondary)" width="5" x1="570" y1="20" x2="570" y2="130" v-click="[2,3]" />

<Arrow color="var(--secondary)" width="5" x1="570" y1="540" x2="570" y2="440" v-click="[3,4]" />

<Arrow color="var(--secondary)" width="5" x1="830" y1="10" x2="740" y2="140" v-click="4" />

<!--
[click]
右上角的長條圖數量代表的是 React 總共更新了幾次 DOM 元素(Commit 次數)，每一個直條 就代表一次更新

直條的顏色/長度代表該次更新花費的時間，越黃/長的直條表示該次更新花費的時間越長，越短/藍的則越短。

[click]
而下方多個橫條圖的區塊稱作"火焰圖"，每一個橫條為一個組件，

灰色表示這個元件在該次更新沒有重新渲染，若不是灰色則表示有重新渲染，越接近黃色代表重新渲染所花費的時間越久，越接近藍色則反之。

[click]
橫條由上而下的排序方式是從父元件到子元件一層層排下來。
所以這邊可以看到 ThemeProvider 總共 render 了 4ms，但他自己才 render 了 0.1ms
主要是他的子組件花比較多時間

可以看到黃色的 TodoTags render 了 2.3ms，剩下了 0.2ms 有可能是他的子元素，像是 div、span 等等

[click]
點擊上述的長條都也可以在右側欄看到詳細的資訊。
這裡的意思就是在錄影第幾秒的時候 render 了多久
-->

---

# Profiler Tab - Ranked 簡化火焰圖

<Video controls src="/ch-4/9-ranked.mp4" class="max-h-[450px]" />

<!--
如果覺得火焰圖太複雜，有太多不必要的資訊，也可以點擊火焰旁邊的 Ranked 圖標，他會依照 re-render 的時間來排序，這樣就能快速找到最耗時的組件
-->

---

# Profiler Tab - 視覺化 re-render

<Video controls src="/ch-4/10-highlight.mp4" class="max-h-[450px]" />

<!--
除了我們手動去 record 以外，我們也能點擊右上角的齒輪來設定，勾選這個選項後，之後在 re-render 的時候，畫面就會直接跳出提示，

可以看到我每次點擊都會有框框顯示，

越偏紅黃色代表 re-render 次數越多，我這邊狂打字就可以看到他瘋狂 re-render。
-->

---
layout: center
---

# 總結

<!--
這個章節很詳細了介紹的 React DevTools 的各個功能，包括快速定位組件位置、強制 Suspense、視覺化 Re-render。

不過居然都提到視覺化 re-render 了，那一定要介紹一個我覺得目前最好用的 library — React Scan。

這個我們就留到下個章節說明吧！
-->

---
layout: center
---

<ChapterTitle number="11">
React Scan
<br/>
進階輔助函式庫
</ChapterTitle>

<!--
上個章節，我們介紹使用 console.log 來除錯，並且了解 React 的運行時機。

第二個要推薦的方法是 React 官方推出的 React DevTools，相信大部分的人都知道這個工具，但儘管如此，我發現仍然有非常多的工程師並不了解這個工具強大的地方

所以這個章節會來分享一些進階的應用，深入了解如何善用 React DevTools 來幫助你除錯和進行效能分析。
-->

<!--
上個章節，我們很詳細的介紹了 React 官方推出的 React DevTools，

這個章節我們要來介紹第三方，但是非常好用的 React Scan

他是一個可以視覺化 Re-render 的 library，也是我用過最好用的，
他比 React Developer Tool 好的地方在於：**火焰圖更簡單，Re-render 的提示更清楚。**
-->

---

# react-scan 安裝方式

````md magic-move
```jsx
<script
  crossOrigin="anonymous"
  src="//unpkg.com/react-scan/dist/auto.global.js"
/>
```

```jsx
// Next App Router

import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="//unpkg.com/react-scan/dist/auto.global.js"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

```bash
npx -y react-scan@latest init
```
````

<!--
先來講安裝方式，有兩種：

1. **第一種是直接引入 CDN**

如果公司的專案不想要額外裝這個 dependency，就可以直接用 CDN 非常方便

[click]
如果使用 Next App Router，範例就會像這樣

[click]
第二個就是用 npm install react-scan 的方式

如果公司想要整合這個工具進開發流程，就能直接用 CLI 安裝。
-->

---

# react-scan 安裝方式

<img src="/ch-4/12-react-scan-extension.png" class="max-h-[300px] mt-4" />

<!--
前陣子去看他也多了 browser 的插件版本，可以去試試看（附圖）
-->

---

# react-scan Demo

<Video controls src="/ch-4/11-react-scan.mp4" class="max-h-[400px]"s />

<!--
使用 React Scan 後螢幕就會出現一個小視窗，打開之後，他就會顯示顯示被 Re-render 的組件：

我平常用的時候發現，**某些時候 React 官方的 Devtools 會漏掉一些 Re-render，但這個 library 都會顯示出來。**

他有幾個特色：

1. 可以選定特定的組件去觀察他 Re-render 的狀況
2. 或是直接看整個頁面的 Render 情況，包含次數、時間
3. 如果覺得開發時一直亮紫色太蠻煩，也可以把它關掉
4. 可以開啟提示音，當組件 Re-render 過慢時會有聲音提醒，非常方便。
    
    我很常透過這個設定來定期檢查自己的程式碼有沒有不正常 Re-render 的問題


我平常用的時候發現，某些時候 react 官方的 devtools 會漏掉一些 re-render，但這個 library 都會顯示出來

不過這邊還是要再提醒一下，**Re-render 是正常的**，他是 React 更新 UI 的機制，不用完全避免 Re-render 這件事，這也不可能。

有問題的是如果某個組件會花很多時間運算，這個時候 Re-render 就會有延遲的感覺，下個章節我們會來講如何優化這個問題。

這裏提早檢查只是先避免未來發生 Re-render 過慢的問題。
-->

---

# 將檢查 Re-render 的流程整合進 CICD 的想法

```jsx
export interface Options {
  onCommitStart?: () => void;
  onRender?: (fiber: Fiber, renders: Array<Render>) => void;
  onCommitFinish?: () => void;

  // 其他選項 ...
}
```

<!--
最後補充一下，我 2025 年去 JSDC 時，有個人問我要怎麼將偵測 Re-render 的流程整合進 CICD 和測試，例如點擊按鈕如果 Re-render 超過 50 次就是測試失敗。

這個需求蠻刁專的，我後來研究之後，**發現 React-scan 可以在 Render 和 Commit 階段去 做一些操作，我想利用這個功能就能達到類似的效果，**

我們可以透過傳入 `options` prop，利用 `onCommitStart`、`onRender`、`onCommitFinish` 去偵測、判斷：
-->

---

# 將檢查 Re-render 的流程整合進 CICD 的想法

<img src="/ch-4/13-profiler.webp" class="max-h-[400px] mt-4" />

<!--
除此之外 React 官方也有提供一個 Profiler 組件，也能做到類似的事情，例如偵測 re-render 的次數，如果你有這樣的需求，可以從這邊下手看看。
-->

---
layout: center
---

<Card class="whitespace-nowrap">

## 課後行動

- 利用 React Scan 找出專案中 Re-render 過多的地方，並找出原因、優化它。

</Card>

<!--
好，那這個章節就差不多到這邊，主要是介紹 React Scan，以及提供將 Re-render 檢查整合進 CICD 的想法。

最後，我們可以嘗試在團隊中應用今天所學的內容，比如：

- 利用 React Scan 找出專案中 Re-render 過多的地方，並找出原因、優化它。

那以上就是這個章節的內容，下個章節，我們要開始進入效能優化的正式章節了，可以期待一下！

我們就下個章節見囉！
-->
