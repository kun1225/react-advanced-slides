---
layout: center
transition: blur-in
---

<ThemeTitle number="6">
Diffing & Reconciliation
</ThemeTitle>

<!--
終於，來到最後一個章節了，今天的內容真的很多啊，非常扎實

前面花了很多章節在講解 re-render 以及優化方式，相信你對 React 有更深的認識了

不過在 React 中還有一個很重要的元素我們還沒深入介紹，也就是在 React 的比較機制 diffing，以及一開始有稍微提到的 Reconciliation 協調，這個章節就會深入講解這個主題。
-->

---

# 付款功能

網站有兩種付款選項，包括「信用卡」和「銀行轉帳」，信用卡需要使用者填卡號，銀行轉帳就顯示銀行帳號

````md magic-move
```jsx {*|2,7-8|11-17|17-22}
export default function Page() {
  const [paymentMethod, setPaymentMethod] = useState('credit');

  return (
    <div className="checkout-container">
      <div>
        <button onClick={() => setPaymentMethod('credit')}>信用卡</button>
        <button onClick={() => setPaymentMethod('transfer')}>銀行轉帳</button>
      </div>

      {paymentMethod === 'credit' ? (
        <div>
          <input type="text" placeholder="卡號" />
          <input type="text" placeholder="有效期限" />
          <input type="text" placeholder="安全碼" />
        </div>
      ) : (
        <div>
          <p>請轉帳至以下帳戶：</p>
          <b>帳號：123-456-789</b>
        </div>
      )}
    </div>
  );
}
```
````

<!--
讓我們從一個小範例開始：

[click]
假設我們現在在開發一個電商網站的結帳頁面，需要讓使用者選擇不同的付款方式。根據使用者的選擇，你需要顯示對應的付款表單。

那我們的網站有兩種付款選項，包括「信用卡」和「銀行轉帳」，可以透過按鈕切換

[click]
信用卡需要使用者填卡號

[click]
銀行轉帳就顯示銀行帳號

非常單純的需求
-->

---

<Video src="/ch-6/0.mp4" />

<!--
就像影片這樣，沒有太多特別的地方
-->

---

# 推薦人功能

兩種付款方式都需要使用者填寫一些資訊，但有些欄位不同：

````md magic-move
```jsx
paymentMethod === 'credit' ? (
  <div>
    <input type="text" placeholder="卡號" />
    <input type="text" placeholder="有效期限" />
    <input type="text" placeholder="安全碼" />
  </div>
) : (
  <div>
    <p>請轉帳至以下帳戶：</p>
    <b>帳號：123-456-789</b>
  </div>
);
```

```jsx {6,12}
paymentMethod === 'credit' ? (
  <div>
    <input type="text" placeholder="卡號" />
    <input type="text" placeholder="有效期限" />
    <input type="text" placeholder="安全碼" />
    <input type="text" placeholder="推薦人" />
  </div>
) : (
  <div>
    <p>請轉帳至以下帳戶：</p>
    <b>帳號：123-456-789</b>
    <input type="text" placeholder="推薦人" />
  </div>
);
```
````

<!--
現在，讓我們考慮一個更複雜的情境。

公司說新活動只要使用者填推薦人，就可以獲得一些優惠，所以我們需要讓使用者填寫推薦人，於是我們很簡單的添加了推薦人欄位
-->

---

# 使用者開始抱怨欄位亂掉

<Video src="/ch-6/1.mp4" />

<!--
結果上線後，收到使用者說欄位不會自動清空，還會亂填在不對的地方

可以從影片發現，推薦人的欄位會互相影響

信用卡的安全碼會覆蓋銀行轉帳的推薦人

銀行轉帳的推薦人會覆蓋信用卡的安全碼
-->

---

# 為什麼？

從 React 的角度來看，當我們使用**條件渲染**在**同一位置渲染相同類型的組件或元素時**，
<br/>
<span v-mark="{color: 'var(--secondary)'}">React 會認為這是「同一個東西」</span>

<v-clicks>

**所以 React 不會卸載並重新掛載這個組件，而是重用它**
<br/>
代表元素的屬性會被保留，即使我們顯示了不同的付款表單。

</v-clicks>

<!--
為什麼會這樣？

因為從 React 的角度來看，當我們使用條件渲染在同一位置渲染相同類型的組件或元素時，React 會認為這是「同一個東西」，所以 React 不會卸載並重新掛載這個組件，而是重用它並更新其 props。

這意味著元素的屬性會被保留，即使我們顯示了不同的付款表單。這可能會導致使用者的信用卡資訊被意外地填入到銀行轉帳表單的欄位中，反之亦然，轉張表單的資訊也可能被填入到信用卡資訊中。

等一下我會來講如何解決這個問題，在這之前，我們要先深入了解 React 的 Reconciliation 的機制。
-->

---
layout: center
---

<ChapterTitle number="1" subtitle="React 的底層機制">
<span class="text-6xl">
Reconciliation & Diffing
</span>
</ChapterTitle>

<!--
透過前面的例子，我們知道條件渲染有可能讓 React 混淆元素的身份，其實背後牽涉的是一個核心概念：React 的「協調（Reconciliation）」機制。
-->

---

# 什麼是 Reconciliation & Diffing？

<v-clicks>

Reconciliation 的本質是：

React **如何比較上一次和這一次畫面要顯示的東西，並決定要更新哪裡、要保留什麼、要移除誰**

這個**過程**，就是 **Diffing**

</v-clicks>

<v-click>

<h3 class="pt-8">
React 設計哲學: 開發者只需要關心資料邏輯，不需要自己動手操作 DOM
</h3>

</v-click>

<v-clicks>

**Reconciliation 的目的是為了讓 React 可以更有效率地更新 DOM**

</v-clicks>

<!--
什麼是 Reconciliation？

[click]
這個流程的本質簡單說，就是 React 如何比較「上一次」和「這一次」畫面要顯示的東西，並決定要更新哪裡、要保留什麼、要移除誰。

[click]

這個比較過程，我們稱之為「差異比對（Diffing）」。

[click]

那為什麼需要做這件事？因為 React 的設計哲學就是：開發者只需要關心資料邏輯，不需要自己動手操作 DOM。不管是 appendChild、removeChild 還是改屬性，React 都會幫你自動處理。

[click]

所以 reconciliation 的目的是為了讓 React 可以更有效率地更新 DOM，而不是每次都重新渲染整個畫面。
-->

---

# 一個簡單的範例

````md magic-move
```jsx
const CharacterCard = ({ name, power }) => {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>Power: {power}</p>
    </div>
  );
};
```

```jsx {10}
const CharacterCard = ({ name, power }) => {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>Power: {power}</p>
    </div>
  );
};

<CharacterCard name="Mage" power="Fireball" />;
```
````

<div v-click="2">

React 並不會把整個 `<div>` 拆掉再重建，而是會**重用**原本的 DOM 元素，只更新那些有變的文字或屬性來節省效能。

</div>

<div v-click="3">

```jsx
const card = document.querySelector('.card h3');
card.textContent = 'Warrior';
```

</div>

<div v-click="4">

但在 React 裡面，我們只要改變組件的 props 或元素的屬性，剩下的 React 會自動處理。
<br/>
這背後就是靠一個叫做 **虛擬 DOM - Virtual DOM** 的東西。

</div>

<!--
我們來看一個簡單的範例：

現在有一個角色卡，呈現角色的名稱和技能(Mage: 妹舉)

[click]
當我們在其他地方使用它：


React 會在畫面上產生對應的 <div>，並填上角色資訊。如果稍後 name 或 power 改變了，我們會希望畫面立刻更新，對吧？

但這時 React 並不會把整個 <div> 拆掉再重建，而是會「重用」原本的 DOM 元素，然後只更新那些有變的文字或屬性。換句話說，它只改需要改的地方，這樣效能才會好。

[click]
用傳統 JavaScript，我們可能會這樣做：

const card = document.querySelector('.card h3');
card.textContent = 'Warrior';


但在 React 裡面，我們只要改變 props，剩下的就交給它自動處理。這背後就是靠一個叫做「虛擬 DOM（Virtual DOM）」的東西。
-->

---

# 虛擬 DOM - Virtual DOM

虛擬 DOM 是一個概念，**透過 JavaScript 物件來描述畫面上應該出現什麼**。在 React 裡，**這個虛擬 DOM 實際叫做 Fiber**

````md magic-move
```jsx
const CharacterCard = ({ name, power }) => {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>Power: {power}</p>
    </div>
  );
};
```

```jsx
{
  type: "div",
  props: {
    className: "card",
    children: [
      {
        type: "h3",
        props: { children: "Mage" }
      },
      {
        type: "p",
        props: { children: "Fireball" }
      }
    ]
  }
}
```

```jsx {4}
const CharacterCard = ({ name, power, image }) => {
  return (
    <div className="card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>Power: {power}</p>
    </div>
  );
};
```

```jsx {6}
{
  type: "div",
  props: {
    className: "card",
    children: [
      { type: "img", props: { src: "...", alt: "Mage" } },
      { type: "h3", props: { children: "Mage" } },
      { type: "p", props: { children: "Fireball" } }
    ]
  }
}
```
````

<!--
**虛擬 DOM 是一個概念、技巧，透過 JavaScript 物件來描述畫面上應該出現什麼。**

而在 React 裡面，**這個虛擬 DOM 實際叫做 Fiber**

這些 fiber 會組成一棵樹，包含每個元件、它的 props、以及它的子節點。

[click]
像剛剛那個 CharacterCard，React 會這樣表示它：

[click]
如果我們稍微擴充一下這個角色卡，例如加入角色圖片，虛擬 DOM 就變成：

[click]
那麼對 React 來說，這張卡片在虛擬 DOM 中就會變成這樣的一個結構：
-->

---

# 當角色轉職時

````md magic-move
```jsx
function MyCharacter({ level }) {
  return level > 10 ? (
    <CharacterCard name="Big Mage" power="Big Fireball" />
  ) : (
    <CharacterCard name="Mage" power="Fireball" />
  );
}
```

```jsx
{
  type: "div",
  props: {
    className: "card",
    children: [
      {
        type: "h3",
        props: { children: "Mage" }
      },
      {
        type: "p",
        props: { children: "Fireball" }
      }
    ]
  }
}
```

```jsx {2,8,12}
{
  type: "div", // 相同的 type
  props: {
    className: "card",
    children: [
      {
        type: "h3",
        props: { children: "Big Mage" } // 不同的 props
      },
      {
        type: "p",
        props: { children: "Big Fireball" } // 不同的 props
      }
    ]
  }
}
```
````

<!--
那有趣的就來，假設現在我們的腳色升等轉職進化了，就像寶可夢那樣，我們職業從法師，變成大法師好了，我們可能會這樣寫

[click]
那以 virtual dom 來說，就會從原本的這樣

[click]
變成這樣

[click]
這裡有幾個重點

第一個是 type 相同，所以 React 會重用原本的 DOM 元素

第二個是 props 不同，所以 React 會只更新 props，不會重新渲染整個元素

這個場景是不是跟我們前面表單的例子有點類似
-->

---

# 所以為什麼欄位會亂掉

````md magic-move
```jsx
paymentMethod === 'credit' ? (
  <div>
    <input type="text" placeholder="卡號" />
    <input type="text" placeholder="有效期限" />
    <input type="text" placeholder="安全碼" />
    <input type="text" placeholder="推薦人" />
  </div>
) : (
  <div>
    <p>請轉帳至以下帳戶：</p>
    <b>帳號：123-456-789</b>
    <input type="text" placeholder="推薦人" />
  </div>
);
```

```jsx
{
  type: "div",
  props: {
    children: [
      {
        type: "input",
        props: {
          type: "text",
          placeholder: "卡號"
        }
      },
      {
        type: "input",
        props: {
          type: "text",
          placeholder: "有效期限"
        }
      },
      {
        type: "input",
        props: {
          type: "text",
          placeholder: "安全碼"
        }
      },
      {
        type: "input",
        props: {
          type: "text",
          placeholder: "推薦人"
        }
      }
    ]
  }
}
```

```jsx {6-12}
{
  type: "div",
  props: {
    children: [
      // ...
      {
        type: "input",
        props: {
          type: "text",
          placeholder: "安全碼"
        }
      },
      // ...
    ]
  }
}
```

```jsx
{
  type: "div",
  props: {
    children: [
      {
        type: "p",
        props: {
          children: "請轉帳至以下帳戶："
        }
      },
      {
        type: "b",
        props: {
          children: "帳號：123-456-789"
        }
      },
      {
        type: "input",
        props: {
          type: "text",
          placeholder: "推薦人"
        }
      }
    ]
  }
}
```

```jsx {6-12}
{
  type: "div",
  props: {
    children: [
      // ...
      {
        type: "input",
        props: {
          type: "text",
          placeholder: "推薦人"
        }
      },
      // ...
    ]
  }
}
```

```jsx {10}
{
  type: "div",
  props: {
    children: [
      // ...
      {
        type: "input",
        props: {
          type: "text",
          placeholder: "推薦人" // 只有 placeholder 不同
        }
      },
      // ...
    ]
  }
}
```
````

<!--
我們回過頭來看剛剛那個表單的例子

誒這個是不是跟我們剛剛轉職的例子有點類似，一樣是條件渲染，裡面的東西稍微改變

[click]
當我們選擇信用卡時，會有四個 input 欄位

[click]
我們特別注意第三個安全馬

[click]
接著當我們選擇銀行轉帳時，會變成 p b input 的組合

[click]
一樣注意第三個欄位

[click]
你發現當付款方式為轉帳時和信用卡時，第三個欄位的差別只有 placeholder 不同，信用卡是安全碼，轉帳是推薦人


代表什麼？我們前面說 react 只會更新不同的地方對吧，代表說他只會改變 placeholder，並不會改變其中的 value，這就導致前面說的欄位共用的問題了
-->

---

<Video src="ch-6/1.mp4" />

<!--
我們再看一次影片就可以更清楚知道問題了

那為什麼其他欄位不會受影響呢？因為他們的 type 完全不同了，從 input 變成 p 了，所以 react 就會重新渲染整個元素
-->

---
layout: center
---

<ChapterTitle number="2" subtitle="解決方式">
Key 值的真正意義
</ChapterTitle>

<!--
那我們要怎麼解決這個問題呢？其實很簡單，我們往下看
-->

---

# Key 值的真正意義

````md magic-move
```jsx
paymentMethod === 'credit' ? (
  <div className="flex flex-col gap-2 items-start">
    <input placeholder="卡號" />
    <input placeholder="有效期限" />
    <input placeholder="安全碼" />
    <input placeholder="姓名" />
  </div>
) : (
  <div>
    <p>請轉帳至以下帳戶：</p>
    <p>帳號：123-456-789</p>
    <input placeholder="姓名" />
  </div>
);
```

```jsx {2,9}
paymentMethod === 'credit' ? (
  <div key="credit" className="flex flex-col gap-2 items-start">
    <input placeholder="卡號" />
    <input placeholder="有效期限" />
    <input placeholder="安全碼" />
    <input placeholder="推薦人" />
  </div>
) : (
  <div key="transfer">
    <p>請轉帳至以下帳戶：</p>
    <b>帳號：123-456-789</b>
    <input placeholder="推薦人" />
  </div>
);
```
````

<!--
除了讓 react 自動去識別元素的差異，還有一個方法可以讓我們主動告訴 react 哪些元素是相同的，哪些是不同的

[click]
這個方法就是增加 key 值，非常簡單

加了之後，儘管 type 都還是 'div'，但因為 key 值不同，所以 react 會重新渲染整個元素

這樣就可以解決前面說的欄位共用的問題了

所以 key 值的真正意義是很單純，就是讓 react 在 diffing 的時候，可以更準確的識別出哪些元素是相同的，哪些是不同的
-->

---

<Video src="ch-6/2.mp4" />

<!--
從影片上就可以看出，當我們按下按鈕時，表單會被重置了，這就是我們要的效果
-->

---
layout: center
---

<ChapterTitle number="3" subtitle="Reconciliation 的延伸問題">
別在組件內定義其他組件
</ChapterTitle>

<!--
現在，我們已經了解 react 的 reconciliation 和 diffing 機制了

這邊我們先來講一個非常重要的概念：

就是為什麼不能在組件內定義其他組件

這是蠻多工程師都沒注意到的細節
-->

---

# 從 Reconciliation 的角度來看

<v-clicks>

```jsx
const Component = () => {
  const Input = () => <input />;
  return <Input />;
};
```

```jsx
{
  type: Input,
}
```

```jsx
const InputA = () => {};
const InputB = () => {};
InputA === InputB; // 永遠為 false
```

</v-clicks>

<!--
我們來看個簡單的例子

這個程式碼如果從 Reconciliation 的角度來看，會是這個樣子

[click]
前面示範的程式碼的 type 都是 string，但這個程式碼的 type 是 Input 組件，非常合理，因為他是我們自己定義的組件

那這樣有什麼問題呢？

[click]
我們知道，如果兩個參考值去比較，永遠是 false，就算內容一樣對吧

所以對 React 來說，每次 re-render 時，這個 Input 組件都會被重新宣告，等於前後比對時就會不相同

沒錯就是參考值的問題啊！
-->

---

# 引發的問題 - 延遲

```jsx
export default function Page() {
  const [value, setValue] = useState('');

  const CompA = () => {
    return Array.from({ length: 10000 }).map((_, index) => (
      <div key={index}>{index}</div>
    ));
  };

  return (
    <div>
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <CompA />
    </div>
  );
}
```

<!--
如果這個組件包含大量內容，我們甚至感受到延遲

舉個例子，這個 CompA 會 render 10000 個 div

如果我們把它放在組件裡宣告，就會導致他每次都要重新掛載 + 重新渲染
-->

---

<Video src="ch-6/3.mp4" />

<!--
可以很明顯感受到延遲，接下來我們把它移到外面試試看
-->

---

```jsx
export default function Page() {
  const [value, setValue] = useState('');

  return (
    <div>
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <CompA />
    </div>
  );
}

const CompA = () => {
  return Array.from({ length: 10000 }).map((_, index) => (
    <div key={index}>{index}</div>
  ));
};
```

<!--
現在這樣，雖然這樣仍然會被 re-render，但因為沒有在組件內宣告，所以節省了重新掛載的時間
-->

---

<Video src="ch-6/4.mp4" />

<!--
可以發現光是把組件移到外面，輸入就順暢很多了

非常神奇啊
-->

---

# 引發的問題 - unFocus

```jsx
export default function Page() {
  const [value, setValue] = useState('');

  const MyInput = () => {
    return <input value={value} onChange={(e) => setValue(e.target.value)} />;
  };

  return (
    <div>
      <MyInput />
    </div>
  );
}
```

<!--
此外，由於組件及其相關的所有內容都被銷毀，這會導致一些非常奇怪且難以追蹤的錯誤。

例如，如果這個組件需要保持狀態或焦點，而他又被我們在組件內宣告，就會發現在每次重新渲染時，焦點會消失。

現這種寫法，我們來看一下結果
-->

---

<Video src="ch-6/5.mp4" />

<!--
當我們輸入時，焦點會消失

這就是因為組件被銷毀，所以狀態也會消失，可以看到我光是打 ThisWeb 就非常艱辛了

所以下次你看到有人把子組件宣告在組件內，記得檢查有沒有這些問題，如果這個組件很簡單，也沒有 focus 的問題，那倒也還好

就怕發生 bug 找不到原因
-->
