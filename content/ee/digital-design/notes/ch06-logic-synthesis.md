# Ch.6 組合與循序邏輯的合成

> 依據：老師講義 Chapter 6 Synthesis of Combinational and Sequential Logic｜更新：2026-11-15

## 重點摘要

- **邏輯合成（logic synthesis）**＝把 Verilog 描述轉成閘級電路，流程是**轉譯（translation）→ 最佳化（optimization）→ 對應（mapping）**，目標是功能、面積、時序、可測性。
- 多階邏輯最佳化有五種轉換：**分解、萃取、因式分解、代換、消去**；因式分解「犧牲速度換面積」，消去（展平）「犧牲面積換速度」。
- 組合邏輯的描述**必須讓輸出在所有輸入組合下都有被指定值**；`if`／`case` 沒寫完整，合成器就會**意外產生閂鎖器（latch）**。
- 在時脈邊緣被指定的變數就是**暫存器化（registered）**的訊號；Mealy 輸出會隨輸入出現**突波（glitch）**，Moore 輸出只跟狀態有關。
- **迴圈能不能合成**看兩件事：迴圈次數是否固定（static）、迴圈內有沒有時序控制 `@(posedge clk)`；次數不固定又沒有時序控制的迴圈**無法合成**。

## 公式整理

### 6.1 合成工具的工作與流程

合成工具要做的事：

- 偵測並刪除多餘邏輯、偵測組合回授迴路（combinational feedback loop）
- 利用 don't care 條件、偵測未使用的狀態、合併**等效狀態（equivalent states）**
- 做狀態指定（state assignment）
- 在面積／速度限制與製程技術下，產生最佳的多階電路

| 引擎 | 輸入 | 輸出 |
|---|---|---|
| 轉譯引擎（translation engine） | Verilog 描述 | 二階邏輯函數 |
| 最佳化引擎（optimization engine） | 二階邏輯函數 | 最佳化的多階邏輯函數 |
| 對應引擎（mapping engine） | 多階邏輯＋製程元件庫（technology library） | 實際製程的電路 |

**Y 圖（Y-chart）**：設計有三種觀點——**結構（structural）**、**行為（behavioral）**、**實體（physical）**。行為觀點由抽象到具體分成演算法（algorithm）、資料流／RTL（dataflow/RTL）、布林代數（Boolean algebra），對應的 Verilog 寫法分別是程序指定（procedural assignment）、非阻隔指定（nonblocking assignment）、連續指定（continuous assignment）。

### 6.2 多階邏輯轉換

| 轉換 | 做法 | 例子 |
|---|---|---|
| **分解（decomposition）** | 把函數拆成新節點，並在扇出路徑重複使用 | $F = XY + X'Y'$，$X = ab$，$Y = c + d$ |
| **萃取（extraction）** | 找出多個函數共用的因子，當成中間節點 | $F=(a+b)cd+e$、$G=(a+b)e'$、$H=cde$ → $X=a+b$、$Y=cd$ |
| **因式分解（factoring）** | 把積項和改寫成因式，關鍵是**讓因式中的字元（literal）數最少** | $F = ac+ad+bc+bd+e = (a+b)(c+d)+e$ |
| **代換（substitution）** | 用已存在的函數取代式子的一部分 | $G=a+b$、$F=a+b+c$ → $F = G + c$ |
| **消去（elimination／flattening）** | 拆掉中間節點，回到二階結構 | 分解的反向操作 |

<!-- TODO: 待確認：講義的分解例題寫成 F = abc + abd + a'b'c' + b'c'd'，但 XY + X'Y'（X = ab、Y = c + d）展開後是 abc + abd + a'c'd' + b'c'd'，第三項與講義不同，請對照原始講義或課本。 -->

| 符號 | 意義 | 單位 |
|---|---|---|
| $a, b, c, d, e$ | 原始輸入 | — |
| $X, Y, G$ | 合成時新增的中間節點 | — |
| $x'$ | $x$ 的補數（NOT） | — |

| 轉換 | 結構變化 | 取捨 |
|---|---|---|
| 因式分解 | 二階 → 多階、共用邏輯 | 犧牲速度換面積 |
| 消去 | 減少階數 | 犧牲面積換速度 |

### 6.3 組合邏輯的合成來源

可以合成成組合邏輯的寫法：基本閘元件（primitive）的接線、使用者自訂元件（UDP）、連續指定 `assign`、**準位觸發的循環行為**（level-sensitive cyclic behavior，`always @(...)` 沒有 edge），以及程序連續指定 `assign … deassign`。

**有優先順序的多工器**：`if … else if …` 會合成成串接的 2 對 1 多工器，越前面的條件優先權越高。

```verilog
always @(*)                     // 或列出全部輸入
  if      (sel_a == 1) y = a;   // 最高優先
  else if (sel_b == 0) y = b;
  else if (sel_c == 1) y = c;
  else                 y = d;   // 每條路徑都有指定 → 純組合邏輯
```

### 6.4 意外合成出閂鎖器

| 情況 | 結果 |
|---|---|
| 敏感列表不完整（例：只列 `x_in[3:1]`） | 合成後的電路與行為模擬結果不一致 |
| `case` 沒有列出全部情況，又沒有 `default` | 沒列到的情況會保持舊值 → 閂鎖器 |
| `if` 只在部分分支指定暫存器變數 | 閂鎖器 |
| `else data_out = data_out;` | 合成成多工器加回授 |

```verilog
// 不完整的 case：{sel_a, sel_b} = 00 或 11 時 y_out 沒被指定 → 產生 latch
always @(sel_a, sel_b, data_a, data_b)
  case ({sel_a, sel_b})
    2'b10: y_out = data_a;
    2'b01: y_out = data_b;
  endcase

// 不完整的 if：latch_enable = 0 時保持舊值 → 4 個 latch
always @(latch_enable, data_in)
  if (latch_enable) data_out = data_in;
```

**default 值會影響電路大小**：ALU 的 `case` 若 `default: alu_reg = 4'b0`，合成器必須真的產生 0；若寫 `default: alu_reg = 4'bx`，合成器可以把它當 don't care，電路更小。

### 6.5 三態與匯流排介面

```verilog
// 單向：enable 時把內部資料送上匯流排，否則高阻抗
assign data_to_bus = bus_enabled ? ckt_to_bus : 32'bz;

// 雙向：inout 埠，送、收各一個三態緩衝器
assign data_from_bus    = rcv_data  ? data_to_from_bus : 'bz;
assign data_to_from_bus = send_data ? reg_to_bus       : data_to_from_bus;
```

### 6.6 循序邏輯：暫存器化與非阻隔指定

```verilog
// 4 位元並列載入暫存器，非同步 reset（reset 也在敏感列表中）
always @(posedge clock, posedge reset)
  if (reset == 1'b1) Data_out <= 4'b0;
  else               Data_out <= Data_in;

// 用非阻隔指定 <= 交換兩個暫存器，同一個邊緣同時更新
always @(posedge clk)
  if      (set1) begin data_a <= 1; data_b <= 0; end
  else if (set2) begin data_a <= 0; data_b <= 1; end
  else           begin data_b <= data_a; data_a <= data_b; end
```

- **暫存器化**：在時脈訊號同步下被指定的變數，只在作用邊緣更新，其他時間保持穩定。
- 同一個 `always @(posedge clock)` 裡用 `case` 選資料再 `<=` 給 y，會合成成「多工器＋暫存器」。

### 6.7 暫存器化輸出（Mealy／Moore）

| 架構 | 暫存器化輸出代表 |
|---|---|
| Mealy，輸出直接打一級暫存器 | **前一個**狀態與輸入的 Mealy 輸出 |
| Moore，輸出直接打一級暫存器 | **前一個**狀態的 Moore 輸出 |
| Mealy，用**次態函數**產生輸出再打暫存器 | **目前**狀態與輸入的 Mealy 輸出 |
| Moore，用**次態**產生輸出再打暫存器 | **目前**狀態的 Moore 輸出 |

### 6.8 狀態編碼（state encoding）

| # | Binary | One-Hot | Gray | Johnson |
|---|---|---|---|---|
| 0 | 0000 | 0000000000000001 | 0000 | 00000000 |
| 1 | 0001 | 0000000000000010 | 0001 | 00000001 |
| 2 | 0010 | 0000000000000100 | 0011 | 00000011 |
| 3 | 0011 | 0000000000001000 | 0010 | 00000111 |
| 4 | 0100 | 0000000000010000 | 0110 | 00001111 |

（完整 16 狀態表見講義 TABLE 6-1。16 個狀態時：binary 4 位元、one-hot 16 位元、Gray 4 位元、Johnson 8 位元。）

- **Binary／BCD**：正反器最少，但次態與輸出解碼邏輯不一定最佳；超過 16 個狀態時次態邏輯很大，速度也較慢。
- **Gray code**：位元數同 binary，相鄰編碼只差 1 個位元，可降低電路雜訊。
- **Johnson code**：同樣只差 1 位元，但用更多位元。
- 只變 1 位元的編碼能減少相鄰訊號線同時切換，降低**串音（crosstalk）**，也避免經過中間狀態。

### 6.9 運算子分組與資源共用

| 寫法 | 合成結果 |
|---|---|
| `sum1 = a + b + c + d;` | 4 位元加法器 → 5 位元 → 5 位元，三級串接 |
| `sum2 = (a + b) + (c + d);` | 兩個 4 位元加法器並列，再接一個 5 位元，路徑較短 |
| `y_out = sel ? data_a + accum : data_a + data_b;` | 兩個加法器 |
| `y_out = data_a + (sel ? accum : data_b);` | 一個多工器＋一個加法器（**資源共用**） |

> 用括號控制運算子分組，可以減少電路大小或縮短延遲。

### 6.10 迴圈的可合成性

| 迴圈種類 | 內部有 `@(posedge clk)`？ | 合成結果 |
|---|---|---|
| Static（次數固定） | 沒有 | 組合邏輯（迴圈被展開） |
| Static | 有 | 循序邏輯 |
| Non-static（次數由資料決定） | 有 | 循序邏輯（多週期） |
| Non-static | 沒有 | **無法合成** |

循序邏輯又分**單週期（single-cycle）**與**多週期（multicycle）**。

```verilog
// static 迴圈、無時序控制 → 展開成 4 個 AND 閘
always @(a, b)
  for (i = 0; i <= 3; i = i + 1)
    out[i] = a[i] & b[i];
```

## 解題技巧

### 題型一：多階邏輯轉換

1. 先數原式的字元數，例：$ac+ad+bc+bd+e$ 共 9 個。
2. 找共同因子：$a, b$ 都乘上 $(c+d)$ → $(a+b)(c+d)+e$，只剩 5 個字元。
3. 多個輸出時，找共用子式當中間節點（萃取），例：$X = a+b$ 同時給 $F$、$G$ 用。
4. 題目要求速度時反過來做消去，把中間節點展開回二階。

### 題型二：判斷 Verilog 會不會合成出 latch

1. 看 `always` 是邊緣觸發還是準位觸發；**只有準位觸發的組合描述**才需要檢查這題。
2. 列出每個輸出變數，檢查 `if` 的每個分支、`case` 的每個情況是否都有指定。
3. 有任何一條路徑沒指定 → latch。修正方法：補 `else`、補 `default`，或在 `always` 開頭先給預設值。
4. 再檢查敏感列表是否列出所有讀到的訊號，否則模擬與合成結果不一致。

### 題型三：序列偵測器（連續三個 1）

1. 定狀態：`S_idle`（未啟用）、`S_0`（尚未收到 1）、`S_1`、`S_2`（已連續 1、2 個 1）；Moore 版多一個 `S_3`。
2. 用兩段式寫法：一個 `always @(negedge clk)` 更新 `state`，一個 `always @(state or D_in)` 用 `case` 算 `next_state`。
3. 輸出：
   - Mealy：`assign D_out = (state == S_2) && (D_in == 1);`
   - Moore：`assign D_out = (state == S_3);`
4. 也可以用移位暫存器實作：Mealy 版存最近 2 位元，`D_out = (Data == 2'b11) && D_in`；Moore 版用 3 個正反器，三個輸出全為 1 時輸出 1。

### 題型四：BCD 轉 Excess-3（串列、Mealy）

1. Excess-3 碼＝BCD＋0011，例：BCD 1000（8）→ 1011。
2. 位元從 **LSB 先進**，每進一位就輸出一位，所以是 Mealy 機。
3. 狀態 S_0～S_6 依講義的次態／輸出表；寫成 Verilog 時 `B_out` 在組合 `always` 開頭先給 0，`default` 指定 don't care 狀態。

### 題型五：判斷迴圈能否合成

1. 迴圈上限是常數嗎？是 → static。
2. 迴圈裡有 `@(posedge clk)` 嗎？
3. 查 6.10 的表。例：`count_ones_a` 用固定次數 `for` 且無內部時序控制 → 單週期組合計算；`count_ones_b0/b1/b2`、`count_ones_d` 迴圈內有 `@(posedge clk)` → 多週期；`count_ones_SD` 再加上 `start`／`done` 交握。

> 💡 補充說明（AI）：`count_ones_c` 的迴圈條件是 `|temp`（依資料而定），迴圈內又沒有時序控制，依 6.10 的分類屬於 non-static 且無時序控制的情況。

## 常見陷阱

- `case` 少了 `default` 或 `if` 少了 `else`，在準位觸發 `always` 中就會多出 latch。
- `default: y = 'bx` 與 `default: y = 0` 合成出的電路大小不同，前者給合成器更多化簡空間。
- 非同步 reset 要把 `posedge reset`（或 `negedge reset_b`）寫進敏感列表；只寫 `posedge clk` 就變成同步 reset。
- 交換兩個暫存器要用非阻隔指定 `<=`，用 `=` 會讓兩者變成同一個值。
- Mealy 輸出直接受輸入影響，輸入在時脈之間變動（例如 RZ 格式輸入）就會出現 glitch；講義模擬中 Moore 輸出沒有這個問題。
- `a + b + c + d` 是串接加法器，延遲最長；加括號 `(a+b)+(c+d)` 才會變成平行結構。
- 漣波計數器（ripple counter）每一級的時脈是前一級輸出的負緣，各位元不是同時改變。
- Accumulator 中 overflow 若在 `always @(posedge clk)` 中指定就是暫存器化輸出（Add_Accum_1）；用 `assign {overflow, sum} = accum + data` 則是組合輸出（Add_Accum_2），兩者在波形上的時間點不同。
