# Ch.4 Verilog 邏輯設計入門

> 依據：老師講義 Chapter 4 Introduction to Logic Design with Verilog｜更新：2026-11-15

## 重點摘要

- **結構化模型（structural model）**是電路圖在 Verilog 中的對應：把內建的**基本閘元件（primitive）**或其他模組**實例化（instantiate）**，再用 `wire` 接起來。
- 所有設計都**封裝（encapsulate）**在 `module … endmodule` 中，模組可以一層層巢狀使用，形成**設計階層（design hierarchy）**，例如 16 位元加法器 → 4 位元加法器 → 全加器 → 半加器 → 基本閘。
- Verilog 的邏輯值有四種：**0、1、x（未知）、z（高阻抗）**；同一條線有多個驅動時由模擬器依規則決定結果，`wand`／`wor` 則分別解析成線 AND／線 OR。
- 驗證方法：用**測試平台（testbench）**產生激勵、觀察輸出；`initial` 只執行一次（只用在 testbench），`always` 會重複執行。
- Verilog 的閘用**慣性延遲（inertial delay）**、線用**傳輸延遲（transport delay）**；慣性延遲會吃掉寬度小於傳遞延遲的短脈衝。

## 公式整理

### 4.1 Verilog 基本閘元件

Verilog 內建 26 個基本閘元件，其中組合邏輯閘如下：

| n 輸入 | n 輸出、三態 |
|---|---|
| `and`、`nand` | `buf`、`not` |
| `or`、`nor` | `bufif0`、`bufif1` |
| `xor`、`xnor` | `notif0`、`notif1` |

- **輸出埠一定要放在埠列表的第一個**，後面才是輸入。
- 基本閘元件的**實例名稱（instance name）可以省略**。

```verilog
// 半加器：sum = a XOR b，c_out = a AND b
module Add_half (output c_out, sum, input a, b);
  xor (sum, a, b);      // 第一個埠是輸出
  and (c_out, a, b);
endmodule
```

### 4.2 模組的基本架構

```verilog
module 模組名稱 (埠列表);
  // 1. 埠的宣告：output / input
  // 2. 內部連線：wire
  // 3. 結構或功能的描述：實例化閘或模組
endmodule
```

兩種宣告寫法都可以：

```verilog
// Verilog-1995：埠列表只寫名稱，宣告另外寫
module AOI_str_1995 (y_out, x_in1, x_in2, x_in3, x_in4, x_in5);
  output y_out;
  input  x_in1, x_in2, x_in3, x_in4, x_in5;
  wire   y1, y2;
  nor (y_out, y1, y2);
  and (y1, x_in1, x_in2);
  and (y2, x_in3, x_in4, x_in5);
endmodule

// Verilog-2005：在埠列表中直接宣告方向
module AOI_str_2005 (output y_out, input x_in1, x_in2, x_in3, x_in4, x_in5);
  wire y1, y2;
  // 內容同上
endmodule
```

### 4.3 語言規則

| 規則 | 內容 |
|---|---|
| 大小寫 | 區分大小寫（少數例外） |
| 識別字（identifier） | 不含空白；可用大小寫字母、數字、底線 `_`；`$` 只用於系統工作與函式；最長 1024 個字元 |
| 結尾 | 每個敘述以分號 `;` 結束 |
| 單行註解 | `// …` |
| 多行註解 | `/* … */`，**不可巢狀** |

### 4.4 巢狀模組與埠的連接

```verilog
// 全加器 = 兩個半加器 + 一個 OR 閘
module Add_full (output c_out, sum, input a, b, c_in);
  wire w1, w2, w3;
  Add_half M1 (w2, w1, a, b);         // 依位置連接：c_out→w2、sum→w1
  Add_half M2 (w3, sum, c_in, w1);
  or       (c_out, w3, w2);
endmodule
```

- 模組實例化時，**模組的實例名稱（如 M1、M2）必須寫**；基本閘元件則可省略。
- 埠很多時建議**依名稱連接**：`.形式名稱(實際訊號)`，順序可任意。

```verilog
Add_half M1 (.b(b), .c_out(w2), .a(a), .sum(w1));
```

- `wire` 屬於**線網（net）**資料型態，值在模擬時由驅動它的元件動態決定。

全加器各節點的布林式：

$$
w_1 = a \oplus b,\qquad sum = (a \oplus b) \oplus c_{in},\qquad c_{out} = (a \oplus b)\,c_{in} + ab
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $a, b$ | 加數位元 | — |
| $c_{in}$ | 進位輸入 | — |
| $c_{out}$ | 進位輸出 | — |
| $\oplus$ | XOR | — |

### 4.5 設計階層：16 位元漣波進位加法器

| 層級 | 模組 | 組成 |
|---|---|---|
| 1 | `Add_rca_16` | 4 個 `Add_rca_4`（M1～M4），進位 c_in4、c_in8、c_in12 串接 |
| 2 | `Add_rca_4` | 4 個 `Add_full`，進位 c_in2、c_in3、c_in4 串接 |
| 3 | `Add_full` | 2 個 `Add_half` ＋ 1 個 OR |
| 4 | `Add_half` | XOR ＋ AND（或用 nand、not 組成） |

```verilog
module Add_rca_4 (output [3:0] sum, output c_out,
                  input  [3:0] a, b, input c_in);
  wire c_in2, c_in3, c_in4;
  Add_full M1 (sum[0], c_in2, a[0], b[0], c_in);
  Add_full M2 (sum[1], c_in3, a[1], b[1], c_in2);
  Add_full M3 (sum[2], c_in4, a[2], b[2], c_in3);
  Add_full M4 (sum[3], c_out, a[3], b[3], c_in4);
endmodule
```

> 16 位元版本同理，把 `a[3:0]`、`a[7:4]`… 四組各接一個 `Add_rca_4`。

### 4.6 比較器

**2 位元比較器**（$A = A_1A_0$、$B = B_1B_0$）：

$$
A\_lt\_B = A_1'B_1 + A_1'A_0'B_0 + A_0'B_1B_0
$$

$$
A\_gt\_B = A_1B_1' + A_0B_1'B_0' + A_1A_0B_0'
$$

$$
A\_eq\_B = A_1'A_0'B_1'B_0' + A_1'A_0B_1'B_0 + A_1A_0B_1B_0 + A_1A_0'B_1B_0'
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $A_1, A_0$ | A 的高、低位元 | — |
| $B_1, B_0$ | B 的高、低位元 | — |
| $x'$ | $x$ 的補數 | — |

講義的閘級實作：`A_eq_B` = 兩個 XNOR（逐位相等）再 AND；`A_lt_B` 用 3 個 AND＋1 個 OR；`A_gt_B` = 既不小於也不等於，用一個 NOR 產生。

**4 位元比較器**：用兩個 2 位元比較器，M1 比高 2 位元、M0 比低 2 位元：

$$
A\_gt\_B = gt_{M1} + eq_{M1}\cdot gt_{M0},\qquad
A\_lt\_B = lt_{M1} + eq_{M1}\cdot lt_{M0},\qquad
A\_eq\_B = eq_{M1}\cdot eq_{M0}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $gt_{M1}, lt_{M1}, eq_{M1}$ | 高 2 位元比較結果 | — |
| $gt_{M0}, lt_{M0}, eq_{M0}$ | 低 2 位元比較結果 | — |

### 4.7 四值邏輯與多重驅動

- 四種值：`0`、`1`、`x`（未知）、`z`（高阻抗）。
- AND 閘：只要有一個輸入是 0，輸出就是 0；否則輸入有 x 或 z 時輸出為 x。
- 同一條線接了多個驅動（例如兩個 `bufif1` 的輸出接在一起）時，模擬器會解析出結果；兩個驅動值衝突時為 x。

| 線網型態 | 作用 |
|---|---|
| `wand` | 多個驅動解析成線 AND |
| `wor` | 多個驅動解析成線 OR |
| `supply0` | 固定為 0，代表接地 |
| `supply1` | 固定為 1，代表電源 |

### 4.8 測試平台（testbench）

```verilog
module t_Add_half ();                 // testbench 沒有埠
  wire sum, c_out;                    // 接 UUT 的輸出
  reg  a, b;                          // 存放激勵波形

  Add_half_0_delay M1 (sum, c_out, a, b);   // 待測單元（UUT）

  initial begin                       // 時間到就結束模擬
    #100 $finish;
  end

  initial begin                       // 激勵：依序執行
    #10 a = 0; b = 0;
    #10 b = 1;
    #10 a = 1;
    #10 b = 0;
  end
endmodule
```

- 測試平台＝**激勵產生器（stimulus generator）**＋**待測單元（unit under test, UUT）**＋**響應監看（response monitor）**。
- 驗證方法有**模擬（simulation）**與**形式驗證（formal verification）**；模擬會做：檢查語法 → 模擬行為 → 監看結果。

### 4.9 三種行為描述

| 行為 | 關鍵字 | 說明 |
|---|---|---|
| 連續指定 | `assign` | 之後章節介紹 |
| 單次行為（single pass） | `initial` | 執行完最後一句就結束；**只用在 testbench** |
| 循環行為（cyclic） | `always` | 執行完最後一句又從頭開始 |

`initial` 與 `always` 內的**程序敘述（procedural statements）**像程式語言一樣**依序執行**。

### 4.10 傳遞延遲

- **閘傳遞延遲**：輸入改變到輸出改變的時間。
- **傳輸延遲**：訊號轉態在線上傳播的時間。
- Verilog：**閘用慣性延遲、線網用傳輸延遲**。
- 慣性延遲會**抑制寬度小於傳遞延遲的短脈衝**。

### 4.11 使用者自訂元件（UDP）

```verilog
// 2 對 1 多工器：select = 0 選 a，select = 1 選 b
primitive mux_prim (output mux_out, input select, a, b);
  table
  // select a b : mux_out
     0      0 ? : 0;     // 講義逐列列出 b = 0、1、x
     0      1 ? : 1;
     1      ? 0 : 0;
     1      ? 1 : 1;
     x      0 0 : 0;     // 兩輸入相同時，select 未知也能確定輸出
     x      1 1 : 1;
  endtable
endprimitive
```

> 上面用 `?` 合併了講義中 a 或 b 為 0／1／x 的多列，意思相同。

- 表格欄位順序＝輸入埠的順序，最後一欄是輸出。
- 只能有**一個輸出**、多個輸入，不能有 inout。
- 只能用 0、1、x；模擬時輸入 z 會被當成 x。
- **表中沒列出的組合，模擬時輸出 x**。

## 解題技巧

### 題型一：看電路圖寫結構化 Verilog

1. 標出主要輸入、主要輸出，寫成 `module` 的埠列表。
2. 每條內部連線取名，宣告成 `wire`。
3. 每個閘寫一行實例化，**輸出放第一個**。
4. 用到子模組時，給每個實例一個名稱（M1、M2…），埠多時用 `.名稱(訊號)` 依名稱連接。

### 題型二：多位元加法器的階層設計

1. 由下而上：半加器 → 全加器 → 4 位元 → 16 位元。
2. 每一級的進位輸出接到下一級的進位輸入，中間進位都要宣告成 `wire`。
3. 位元切片：第 k 個 4 位元加法器接 `a[4k+3:4k]`、`b[4k+3:4k]`、`sum[4k+3:4k]`。

### 題型三：用小比較器組大比較器

1. 高位元先比：高位已經大於（或小於）就決定結果。
2. 高位相等時才看低位：$gt = gt_H + eq_H\,gt_L$。
3. 相等必須每一段都相等：$eq = eq_H\,eq_L$。

### 題型四：慣性延遲判斷輸出波形

以講義的反相器為例，tpd = 2：

1. 輸入脈衝寬度 Δ 與 tpd 比較。
2. Δ = 1 < 2（t = 3 出現的短脈衝）→ 輸出轉態被取消，**輸出沒有脈衝**。
3. Δ = 6 > 2（t = 3～9）→ 輸出脈衝延後 2 出現在 t = 5～11，寬度不變。

### 題型五：寫 UDP 真值表

1. 第一行 `primitive 名稱 (output 輸出, input 輸入…);`。
2. 每列按「輸入埠順序 : 輸出;」填寫。
3. 補上輸入含 x 但輸出仍可確定的列（例如兩個資料輸入相同時），減少模擬中的 x。

## 常見陷阱

- 基本閘元件的**輸出一定在第一個位置**，寫反會接錯線。
- 依位置連接時，順序要對照子模組宣告的埠順序（例如 `Add_half` 是 `c_out, sum, a, b`），否則 sum 和進位會對調。
- 多行註解 `/* */` 不能巢狀。
- `$` 不能拿來當一般識別字，只能用在系統工作（如 `$finish`）。
- testbench 中 UUT 的輸入要宣告成 `reg`（在 `initial` 中被指定），輸出接 `wire`。
- `initial` 只用在 testbench，不要拿來描述硬體。
- 模擬初期輸入還沒給值時，輸出顯示為 x（波形中的斜線區），不是電路錯誤。
- UDP 表中沒寫到的輸入組合會輸出 x。
