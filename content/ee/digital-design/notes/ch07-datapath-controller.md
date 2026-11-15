# Ch.7 資料路徑控制器的設計與合成

> 依據：老師講義 Chapter 7 Design and Synthesis of Datapath Controllers｜更新：2026-11-15

## 重點摘要

- 數位系統拆成兩塊：**控制單元（control unit）**＝一個有限狀態機（FSM），**資料路徑單元（datapath unit）**＝暫存器＋運算邏輯。控制單元送出**控制訊號（control signals）**，資料路徑回傳**狀態訊號（status signals）**。
- 架構是「由應用驅動」的：先由應用決定**架構（architecture）**與**指令集（instruction set）**，兩者再決定**控制序列（control sequence）**，最後才寫成控制單元的 FSM。
- **RISC 儲存程式機（RISC Stored-Program Machine, RISC_SPM）**：處理器＋控制器＋記憶體，依序執行**擷取（fetch）→ 解碼（decode）→ 執行（execute）**；指令分單位元組（NOP、ADD、SUB、AND、NOT）與雙位元組（RD、WR、BR、BRZ）。
- **UART（Universal Asynchronous Receiver and Transmitter）**：把位元組加上起始位元、同位位元、停止位元後串列傳送；傳送端狀態為 idle → waiting → sending，接收端用**取樣時脈（Sample_clk）**多次取樣來對齊位元。
- 設計流程都是：方塊圖切出 Control_Unit／Datapath_Unit → 定義介面訊號 → 畫 **ASM／ASMD 圖** → 寫 Verilog → 模擬驗證 → 合成。

## 公式整理

### 7.1 控制器＋資料路徑的分工

| 方向 | 訊號種類 | 例子 |
|---|---|---|
| 外部 → 控制單元 | 外部控制輸入 | `enable`、`rst`、`Byte_ready`、`T_byte` |
| 控制單元 → 資料路徑 | 控制訊號 | `Load_R0`、`Inc_PC`、`shift`、`clear` |
| 資料路徑 → 控制單元 | 狀態訊號 | `zero`、`BC_lt_BCmax`、`SC_eq_3`、`BC_eq_8` |

**同步 4 位元二進位計數器**（最簡單的例子）：`Control_Unit` 收 `enable`，送出 `enable_DP`；`Datapath_Unit` 內有加 1 器、`Mux` 與 `Count_Register`。狀態轉移圖是 0000 → 0001 → … → 1111 → 0000 的環，每一步的條件都是 `enable`，`rst` 回到 0000。

### 7.2 RISC_SPM 的指令格式

一個字組（word）為 8 位元：

| 欄位 | 位元數 | 說明 |
|---|---|---|
| opcode | 4 | 指令種類 |
| src | 2 | 來源暫存器（R0～R3） |
| dest | 2 | 目的暫存器（R0～R3） |

- **單位元組指令**：只有上面這一個字組。
- **雙位元組指令**（RD、WR、BR、BRZ）：第二個字組是**記憶體位址**，用不到的 src／dest 欄位是 don't care。

### 7.3 RISC_SPM 指令集

| 指令 | opcode | src | dest | 動作 |
|---|---|---|---|---|
| NOP | 0000 | ?? | ?? | 無動作 |
| ADD | 0001 | src | dest | dest ← src + dest |
| SUB | 0010 | src | dest | dest ← dest − src |
| AND | 0011 | src | dest | dest ← src & dest |
| NOT | 0100 | src | dest | dest ← ~src |
| RD\* | 0101 | ?? | dest | dest ← memory[Add_R] |
| WR\* | 0110 | src | ?? | memory[Add_R] ← src |
| BR\* | 0111 | ?? | ?? | PC ← memory[Add_R] |
| BRZ\* | 1000 | ?? | ?? | zero 旗標成立時 PC ← memory[Add_R] |
| HALT | 1111 | ?? | ?? | 停止，直到 reset |

> \* 需要第二個字組；`?` 表示 don't care。

### 7.4 RISC_SPM 的控制訊號

| 訊號 | 作用 |
|---|---|
| `Load_Add_Reg` | 載入位址暫存器 Add_R |
| `Load_PC` | 把 Bus_2 載入程式計數器（PC） |
| `Load_IR` | 把 Bus_2 載入指令暫存器（IR） |
| `Inc_PC` | PC 加 1 |
| `Sel_Bus_1_Mux` | 從 PC、R0～R3 中選一個驅動 Bus_1 |
| `Sel_Bus_2_Mux` | 從 ALU 輸出、Bus_1、記憶體中選一個驅動 Bus_2 |
| `Load_R0`～`Load_R3` | 載入通用暫存器 |
| `Load_Reg_Y` | 把 Bus_2 載入 Reg_Y |
| `Load_Reg_Z` | 把 ALU 的輸出存入 Reg_Z（Verilog 中 Reg_Z 接的是 `alu_zero_flag`，輸出為 `Zflag`） |
| `write` | 把 Bus_1 寫入 Add_R 指定的 SRAM 位址 |

控制單元的工作：決定何時載入暫存器、選擇多工器的資料路徑、決定何時寫記憶體、控制三態匯流排。

### 7.5 RISC_SPM 控制器的狀態（ASM 圖）

| 階段 | 狀態 | 主要動作 |
|---|---|---|
| — | `S_idle`（0） | reset 後的狀態 |
| 擷取 | `S_fet1`（1） | `Sel_PC`、`Sel_Bus_1`、`Load_Add_R`（PC → Add_R） |
| 擷取 | `S_fet2`（2） | `Sel_Mem`、`Load_IR`、`Inc_PC`（記憶體 → IR） |
| 解碼 | `S_dec`（3） | 依 opcode 分支；ADD/SUB/AND 先把 src 送進 Reg_Y |
| 執行 | `S_ex1`（4） | `Sel_ALU`、`Load_Reg_Z`，結果載入 dest |
| 執行 | `S_rd1`（5）、`S_rd2`（6） | 讀取第二字組當位址，再讀記憶體載入 dest |
| 執行 | `S_wr1`（7）、`S_wr2`（8） | 讀取第二字組當位址，再把 src `write` 進記憶體 |
| 執行 | `S_br1`（9）、`S_br2`（10） | 讀取第二字組當位址，再把記憶體內容載入 PC |
| — | `S_halt`（11） | 停止 |

> BRZ 在 `S_dec` 檢查 `zero`：成立時走 `S_br1`、`S_br2`；不成立只做 `Inc_PC` 跳過位址字組。

### 7.6 RISC_SPM 的 Verilog 結構

頂層只負責接線，內部拆成三個模組：

```verilog
// 頂層：處理單元＋控制單元＋記憶體，全部用 wire 相連
module RISC_SPM #(parameter word_size = 8, Sel1_size = 3, Sel2_size = 2)
                 (input clk, rst);
  // 資料線：zero、instruction、address、Bus_1、mem_word
  // 控制線：Load_R0..R3、Load_PC、Inc_PC、Sel_Bus_1_Mux、Load_IR、
  //         Load_Add_R、Load_Reg_Y、Load_Reg_Z、Sel_Bus_2_Mux、write
  Processing_Unit M0_Processor (/* 資料線＋控制線 */);
  Control_Unit    M1_Controller (/* 控制線＋instruction、zero、clk、rst */);
  Memory_Unit     M2_SRAM (.data_out(mem_word), .data_in(Bus_1),
                           .address(address), .clk(clk), .write(write));
endmodule
```

```verilog
// 記憶體：非同步讀、同步寫
module Memory_Unit (data_out, data_in, address, clk, write);
  parameter word_size = 8, memory_size = 256;
  output [word_size-1:0] data_out;
  input  [word_size-1:0] data_in, address;
  input  clk, write;
  reg    [word_size-1:0] memory [memory_size-1:0];   // 記憶體陣列宣告

  assign data_out = memory[address];                  // 讀：組合邏輯
  always @(posedge clk)
    if (write) memory[address] = data_in;             // 寫：時脈正緣
endmodule
```

處理單元內含 R0～R3、Reg_Y、Reg_Z（D_flop）、Add_R、IR、PC、5 選 1 的 Mux_1、3 選 1 的 Mux_2 與 ALU；opcode 取自指令的高 4 位元：`opcode = instruction[word_size-1 : word_size-op_size]`。

### 7.7 UART 資料格式

傳送順序由右到左：**起始位元（start bit）**→ Data bit 0 … Data bit 6 → **同位位元（parity bit）**→ **停止位元（stop bit）**。資料以 ASCII 格式交換。

### 7.8 UART 傳送端（UART_XMTR）

| 訊號 | 種類 | 作用 |
|---|---|---|
| `Load_XMT_datareg` | 外部輸入 | 在 idle 時要求把 Data_Bus 存入 XMT_datareg |
| `Byte_ready` | 外部輸入 | 要求把 XMT_datareg 載入 XMT_shftreg |
| `T_byte` | 外部輸入 | 開始傳送一個位元組（含起始、停止、同位位元） |
| `BC_lt_BCmax` | 狀態 | 位元計數器尚未數完 |
| `Load_XMT_DR` | 控制 | Data_Bus → XMT_datareg |
| `Load_XMT_shftreg` | 控制 | XMT_datareg → XMT_shftreg |
| `start` | 控制 | 把 XMT_shftreg[0] 拉成 0，作為起始位元 |
| `shift` | 控制 | XMT_shftreg 往 LSB 移一位，左邊補 1（停止位元） |
| `clear` | 控制 | 清除 bit_count |

ASMD 圖中的暫存器動作：

```verilog
// idle：初始化
bit_count   <= 0;
XMT_shftreg <= 9'h1ff;                         // 全 1 = 線路閒置
// Load_XMT_datareg 成立
XMT_datareg <= Data_Bus;
// Byte_ready 成立
XMT_shftreg <= {XMT_datareg[7:0], 1'b1};
// waiting → T_byte 成立（start）
XMT_shftreg[0] <= 0;                            // 起始位元
// sending（shift）
XMT_shftreg <= {1'b1, XMT_shftreg[8:1]};        // 右移，補停止位元
```

> 講義註記：`BC_lt_BCmax` 在 bit_count < word_size + 1 時成立；ASMD 圖只標出決策菱形的「真」分支，沒寫出的訊號視為未觸發。

### 7.9 UART 接收端（UART_receiver）

| 訊號 | 意義 |
|---|---|
| `Ser_in_0` | Serial_in 為 0 |
| `SC_eq_3` | Sample_counter = 3 |
| `SC_lt_7` | Sample_counter < 7 |
| `BC_eq_8` | Bit_counter = 8 |
| `clr_/inc_Sample_counter` | 清除／遞增取樣計數器 |
| `clr_/inc_Bit_counter` | 清除／遞增位元計數器 |
| `shift` | `RCV_shftreg <= {Serial_in, RCV_shftreg[word_size-1:1]}` |
| `load` | `RCV_datareg <= RCV_shftreg` |
| `read_not_ready_in/out`、`Error1`、`Error2` | 與主機的交握及錯誤旗標 |

狀態：`idle`（0）→ `starting`（1）→ `receiving`（2）。

## 解題技巧

### 題型一：從架構圖切出控制單元與資料路徑

1. 先找出**所有暫存器與運算單元**，歸到資料路徑。
2. 每個暫存器的「載入／遞增／清除」、每個多工器的「選擇線」都是一條**控制訊號**。
3. 資料路徑中控制單元需要知道的條件（是否為零、計數是否到頂）是**狀態訊號**。
4. 畫出 Control_Unit ↔ Datapath_Unit 的介面方塊圖，再開始畫 ASM／ASMD 圖。

### 題型二：追蹤 RISC_SPM 指令執行

1. 每條指令都先經過 `S_fet1`（PC → Add_R）、`S_fet2`（記憶體 → IR、PC+1）、`S_dec`。
2. 查指令表拆出 opcode、src、dest。
3. 依指令類型走執行狀態：
   - ADD/SUB/AND：`S_dec` 把 src 放進 Reg_Y → `S_ex1` 由 ALU 算出結果寫回 dest、更新 Reg_Z。
   - NOT：`S_dec` 直接選 ALU 並載入 dest。
   - RD/WR/BR：多兩個狀態，先抓第二個字組當位址（Add_R），再讀／寫記憶體或改 PC。
   - BRZ：看 zero 旗標，不跳時只要 PC+1 跳過位址字組。
4. 執行完回到 `S_fet1` 抓下一條指令。

> 例：`0010 01 10` → SUB，src = R1、dest = R2，動作 R2 ← R2 − R1。

### 題型三：UART 傳送端時序

1. idle：bit_count = 0，XMT_shftreg = 1_1111_1111。
2. `Load_XMT_datareg` → 存 Data_Bus；`Byte_ready` → 載入 `{datareg, 1}` 並進 waiting。
3. `T_byte` → `start` 把最低位設 0（送出起始位元），進 sending。
4. sending 中每個時脈 `shift` 一次、bit_count 加 1，直到 `BC_lt_BCmax` 不成立 → `clear` 後回 idle。

### 題型四：UART 接收端取樣

1. idle 偵測到 `Ser_in_0` → starting。
2. starting 中持續取樣：若在數到 3 之前 Serial_in 又回到 1，視為雜訊、回 idle；連續 4 個取樣（`SC_eq_3`）都是 0 才確認是起始位元，清除 Sample_counter 進 receiving。
3. receiving 中 Sample_counter 從 0 數到 7，數滿時 `shift` 取一個位元、`inc_Bit_counter`，所以每個資料位元都是在**位元中間**取樣。
4. `BC_eq_8` 後檢查：主機還沒讀走上一筆 → `Error1`；停止位元為 0 → `Error2`；都正常 → `load` 把 RCV_shftreg 存入 RCV_datareg。

> 💡 補充說明（AI）：起始位元先數 4 個取樣再清零，之後每 8 個取樣讀一次，等於把取樣點從位元邊緣移到位元中央，避開訊號轉態附近最不穩定的地方。

## 常見陷阱

- SUB 是 **dest − src**，不是 src − dest；NOT 只用 src。
- 雙位元組指令要多抓一次記憶體，PC 也要多加一次；BRZ 不跳時別忘了跳過位址字組。
- 運算結果是經 Bus_2 寫回 dest 暫存器；Reg_Z 在 Processing_Unit 中存的是 `alu_zero_flag`，供 BRZ 判斷用。
- Memory_Unit 是**組合讀、時脈寫**：位址一變 data_out 立刻改變，寫入則要等時脈正緣且 `write` = 1。
- 傳送端的 XMT_shftreg 是 9 位元：8 位元資料加上最低位的起始位元位置；閒置時全為 1。
- ASMD 圖只標出被觸發的訊號，沒寫到的就是 0，不要自行補上。
- 接收端 `Error1`（主機還沒讀）與 `Error2`（停止位元錯）意義不同，不要混用。
