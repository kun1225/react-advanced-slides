---
layout: center
transition: blur-in
---

<ThemeTitle number="4">
如何觀察 Re-render
</ThemeTitle>

<!--
有句話是：「 你無法管理你無法衡量的事物 (You can't manage what you don't measure)」

所以具體觀察到 Re-render 的行為，我們才能繼續優化。因此我會花一小個章節講解三種觀察 re-render 的方法
-->

---
layout: center
---

<ChapterTitle number="1" subtitle="最簡單也最實用的除錯利器">
<code>console.log</code> 法
</ChapterTitle>

<!--
console.log 是最直接也最常用的除錯方式之一，雖然有點「土法煉鋼」，但實務上，它能夠非常快速幫助我們掌握組件的 re-render 行為
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
hide: true
---

# 實際運用 - 用「二分法」找出錯誤的根源

概念很簡單：把程式邏輯對半拆分，逐步縮小範圍，直到鎖定問題。

<!--
當你遇到一個複雜的 bug，而問題可能藏在成百上千行的程式碼中，逐行查找會非常耗時。這時可以使用「二分法除錯法」（binary search debugging）。

概念很簡單：把程式邏輯對半拆分，逐步縮小範圍，直到鎖定問題。

比如說，現在有一個運算折扣的流程，
-->

---
layout: center
---

<ChapterTitle number="2" subtitle="官方推出的">
 React DevTools
</ChapterTitle>

<!--
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

安裝完後開啟你的 devtools，通常是按 F12，或是點右點，選擇檢查也可以，打開後就可以看到 Components 和 Profiler 分頁

如果你是第一次安裝，通常要去插件的設定勾選這個選項，讓他能夠讀取你的 React 檔案，這樣他才能正常運作

之前有遇過工程師說有安裝，但是都不能用就沒去了解這個工具了，這樣蠻可惜的哦
-->

---

# Components Tab - 觀察 props、state、Hooks 和 context

觀察每個組件的實際狀態，包括 `props`、`state`、使用的 `Hooks`，甚至是 `context`

<Video src="/ch-4/3-component-tab.mp4" class="max-h-[400px]" />

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

<Video src="/ch-4/4-console.mp4" class="max-h-[400px]" />

<!--
如果你想看更詳細的組件資料，你也可以點擊右上角的 bug 圖示直接打印他到 console 的 tab，一樣可以看到他的 state、hooks 以及他的子元素
-->

---

# Components Tab - 定位組件位置

<Video src="/ch-4/5-url.mp4" class="max-h-[400px]" />

<!--
接下來是我覺得很實用的功能，我可以快速找到組件的專案裡的位置

例如我想要找這個 edit 的按鈕在哪裡，我可以直接選取他，並且點擊 startEditing 找到原始程式碼，在原始程式碼點擊右鍵複製路徑，最後回到 IDE 貼上，就能快速定位檔案位置

在接手大專案的時候特別實用

補充一下，其實 React Dev Tools 也有提供直接打開 IDE 並定位程式碼的功能，但我在使用 Next.js 以及 Remix 的時候都不起作用，上網查也有看到有人反應，但沒有解決方法，所以這邊就沒有介紹了，複製路徑雖然多幾個步驟，但也非常實用了
-->

---

# Components Tab - 強制 Suspense

<Video src="/ch-4/6-suspense.mp4" class="max-h-[400px]" />

<!--
還有一個我覺得很讚的功能，就是他可以強制組件 Suspense

有時候組件 loading 速度太快，來不及看到 loading 的狀態，這時候就可以使用這個功能，強制讓組件進入 loading 狀態來 debug
-->

---

# Profiler Tab

<Video src="/ch-4/7-profiler.mp4" class="max-h-[400px]" />

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

<Video src="/ch-4/9-ranked.mp4" class="max-h-[400px]" />

<!--
如果覺得火焰圖太複雜，有太多不必要的資訊，也可以點擊火焰旁邊的 Ranked 圖標，他會依照 re-render 的時間來排序，這樣就能快速找到最耗時的組件
-->

---

# Profiler Tab - 視覺化 re-render

<Video src="/ch-4/10-highlight.mp4" class="max-h-[400px]" />

<!--
除了我們手動去 record 以外，我們也能點擊右上角的齒輪來設定，勾選這個選項後，之後在 re-render 的時候，畫面就會直接跳出提示，

可以看到我每次點擊都會有框框顯示，

越偏紅黃色代表 re-render 次數越多，我這邊狂打字就可以看到他瘋狂 re-render。

居然都提到視覺化 re-render 了，那一定要介紹一個我覺得目前最好用的 library
-->

---
layout: center
---

<ChapterTitle number="3" subtitle="超好用的函式庫">
react-scan
</ChapterTitle>

<!--
就是 React scan，他是一個可以視覺化 re-render 的 library，也是我用過最好用的，他不像 React Developer Tool 的火焰圖那麼複雜，re-render 的提示又不夠詳細。
-->

---

# react-scan Demo

<Video src="/ch-4/11-react-scan.mp4" class="max-h-[400px]"s />

<!--
使用後螢幕就會出現一個小視窗，可能有人在前面就已經看到了，打開之後，他就會顯示顯示被 re-render 的組件，我平常用的時候發現，某些時候 react 官方的 devtools 會漏掉一些 re-render，但這個 library 都會顯示出來

也可以選定特定的組件去觀察他 re-render 的狀況

或是直接看整個頁面的 render 情況，包含次數、時間

如果覺得開發時一直亮紫色太蠻煩，也可以把它關掉並開啟提示音，當組件 re-render 過慢時會有聲音提醒，非常方便

我很常透過這個設定來定期檢查自己的程式碼有沒有不正常 re-render 的問題

不過這邊要提醒一下，re-render 是正常的，他是 react 更新 UI 的機制，不用完全避免 re-render 這件事，這也不可能

有問題的是如果某個組件會花很多時間運算，這個時候 re-render 就會有延遲的感覺，下個章節我們會來講如何優化這個問題

不過提早檢查也可以避免未來發生 re-render 過慢的問題
-->

---

# react-scan 安裝方式

```jsx
<script
  crossOrigin="anonymous"
  src="//unpkg.com/react-scan/dist/auto.global.js"
/>
```

<img src="/ch-4/12-react-scan-extension.png" class="max-h-[300px] mt-4" />

<!--
而且 react scan 安裝非常簡單

有兩種安裝的方式：

第一種是直接引入 CDN，如果公司的專案不想要額外裝這個 dependency，就可以直接用 CDN 非常方便

第二個就是用 npm install react-scan 的方式

前陣子去看他也多了 browser 的插件版本，可以去試試看（附圖）

最後補充一下，我上個禮拜去 JSDC 時，有一個人問我要怎麼將偵測 re-render 的流程整合進 CICD 和測試，例如點擊按鈕如果 re-render 超過 50 次就是測試失敗，這個需求蠻刁專的，我沒有這方面的經驗，當下沒有回答得很好，後來回家研究之後，發現 react-scan 可以在 render 和 commit 階段去 做一些操作，我想利用這個功能就能達到類似的效果，

不過前天我在測試時發現，他提供的函數沒有效果，也有看到有人提了相關的 issue，但作者貌似還沒修，所以如果想要使用這個功能，可能要再研究

然後我又想到，React 官方也有提供一個 `<Profiler />` 組件，也能做到類似的事情，偵測 re-render 的次數，如果你有這樣的需求，可以從這邊下手看看。
-->

---
layout: center
---

# 小總結

<!--
最後小總結一下這個章節

一開始介紹了 console.log 以及 二分除錯法

中間很詳細的介紹了 react devtools 的兩個分頁，Components 和 Profiler，他們的使用方式以及好用的技巧

最後推薦了 react scan 這個 library，他可以視覺化 re-render 的狀況，非常方便

那我們知道要怎麼觀察和 debug 後，下一步就是來優化了，也是這次工作坊的一大重點

那我們就進入下個單元囉
-->
