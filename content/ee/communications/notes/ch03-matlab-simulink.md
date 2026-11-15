# Ch.3 MATLAB/Simulink 通訊系統模擬

> 依據：老師講義 Chapter 3 Simulation of Communication Systems Using MATLAB/Simulink（3.1–3.6）｜更新：2026-11-15

## 重點摘要

- Simulink 模擬分兩步：先用模型編輯器把系統畫成**方塊圖（block diagram）**，再指定起訖時間讓軟體用**求解器（solver）**逐時間步解出差分／微分方程式。
- 方塊分**連續**與**離散**兩類；離散方塊只在取樣時間（sample time）的整數倍更新輸出，中間保持不變（零階保持，ZOH）。取樣時間設 −1 表示從前一個方塊**繼承**。
- 隨機訊號都是**偽隨機（pseudo-random）**序列：PRN 產生器＋ZOH；相同 seed 會產生相同序列。二元／四元極性訊號可由均勻亂數經 Sign 或 MATLAB Fcn 映射得到。
- AWGN 通道的雜訊樣本是零平均、變異數 $\sigma^2 = N_o/(2T_s)$ 的獨立高斯變數；數位濾波器輸入的正規化邊緣頻率要**除以 $\pi$**。
- 用 Spectrum Scope 看頻譜（解析度 $f_s/2^N$）；用 Signal to Workspace／Signal from Workspace 與 MATLAB 交換資料，再用 `sim` 指令在迴圈中跑多次模擬畫 BER 曲線。

## 公式整理

### 3.3.2 四元極性訊號的映射

$$
u \;\rightarrow\; 2\cdot\text{fix}(M u) - M_1, \qquad M_1 = M - 1,\ M = 4
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $u$ | Random Source 產生的均勻亂數 | — |
| $M$ | 符號準位數（四元為 4），輸出準位 $\{-3, -1, 1, 3\}$ | — |

<!-- TODO: 待確認：講義說 Random Source 輸出在 [−1, 1] 之間，但 2*fix(4u)−3 要產生 {−3, −1, 1, 3}，u 應落在 [0, 1)；請確認此例 Random Source 的實際振幅範圍設定。 -->

### 3.3.3 AWGN 通道模型

$$
\sigma^2 = \frac{N_o}{2T_s}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\sigma^2$ | 白色高斯雜訊（WGN）樣本的變異數 | W |
| $N_o/2$ | 雜訊的雙邊功率頻譜密度 | W/Hz |
| $T_s$ | 取樣間隔 | s |

$$
t_c \approx \frac{1}{100}\cdot\frac{2\pi}{\omega_{max}}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $t_c$ | 雜訊的相關時間（correlation time），Bandlimited White Noise 方塊的取樣時間就是 $t_c$ | s |
| $\omega_{max}$ | 系統頻寬 | rad/s |

<!-- TODO: 待確認：式 (3.2) 在掃描檔中等號／約等號模糊，此處以「≈」表示，請對照原講義。 -->

> 連續時間 WGN 的自相關是脈衝，相關時間 $t_c = 0$；Simulink 用「相關時間遠小於系統最短時間常數」的隨機序列來近似白雜訊。

### 3.4 通訊子系統模型

$$
x(t) = s(t)\,c(t) = \cos(2\pi f_m t)\cdot A_c\cos(2\pi f_c t)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $s(t)$ | 訊息訊號（message） | V |
| $c(t)$ | 載波（carrier） | V |
| $f_m$ | 訊息頻率 | Hz |
| $f_c$ | 載波頻率 | Hz |
| $A_c$ | 載波振幅 | V |

$$
x_{FM}(t) = A_c\cos\!\left[2\pi f_c t + 2\pi k_f\int_{-\infty}^{t} s(\alpha)\,d\alpha\right]
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $k_f$ | 頻率偏移常數（frequency deviation constant） | Hz/V |

### 3.4.2 數位濾波器的正規化頻率

$$
\hat\omega = 2\pi f T_s = 2\pi\frac{f}{f_s}, \qquad \text{MATLAB 輸入值} = \frac{\hat\omega}{\pi} = \frac{2f}{f_s}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\hat\omega$ | 正規化角頻率 | rad/sample |
| $f_s$ | 取樣頻率 | Hz |

> 例：$f_p = 1000$ Hz、$f_s = 5000$ Hz → $\hat\omega_p = 0.4\pi$ → MATLAB 要輸入 **0.4**。

### 3.5 Spectrum Scope 頻率解析度

$$
\Delta f = \frac{f_s}{2^N}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\Delta f$ | PSD 顯示的頻率解析度 | Hz |
| $2^N$ | 計算週期圖（periodogram）所用的 FFT 樣本數 | — |

## 解題技巧

### 題型一：建立並執行第一個 Simulink 模型（Example_3_1）

1. 在 MATLAB 輸入 `simulink` 開啟 Library Browser，File > New > Model 開新模型。
2. 從各函式庫拖曳方塊：Sources → **Sine Wave**、Continuous → **Derivative**、Math Operations → **Sign**、Sinks → **Scope**。
3. 從輸出埠拖線到輸入埠連線；要分支時按住 **Ctrl** 從既有線段拉出。
4. 雙擊方塊設參數（例：Sine Wave 頻率 `10*pi` rad/s、取樣時間 `1/100`）；Scope 的 Number of axes 改成 3 就有三個輸入埠。
5. Simulation > Configuration Parameters 設 Stop time（例：10）與求解器，再按 Start 執行、雙擊 Scope 看波形。

> 求解器選擇：固定步長（fixed-step）步長不變；可變步長（variable-step）依模型動態自動調整，講義建議一般用**可變步長**，課本範例多用**離散型、可變步長**求解器。

### 題型二：子系統與遮罩（Fig. 3.13～3.15）

1. 框選要合併的方塊與連線 → Edit > **Create Subsystem**；Simulink 自動加上 In／Out 埠。
2. 選取子系統 → Edit > **Mask**，開啟 Mask Editor（Icon & Ports、Parameters、Initialization、Documentation 四個頁籤）。
3. Icon 頁可用 `disp('FM\nModulator')` 指定圖示文字。
4. Parameters 頁新增提示字（Prompt）與變數名（Variable），例如 `Ac`、`fc`、`kf`；勾 Evaluate 表示先計算運算式，勾 Tunable 表示模擬中可調整。

### 題型三：產生訊號源（例 3.1、3.2）

1. **時脈**：Pulse Generator，設定 Amplitude、Period、Pulse Width（佔空比，%）、Phase delay；time-based 配可變步長、sample-based 配固定步長。
2. **均勻亂數**：Uniform Random Number（Simulink Sources）或 Random Source（SP blockset，Source type 設 Uniform）。例 3.1 兩者用同一個 seed 仍得到不同序列 → 兩者演算法不同。
3. **二元極性**：Random Source（均勻）→ **Sign**，輸出 ±1 各一半機率；位元寬度＝Random Source 的取樣時間。
4. **四元極性**：Random Source → **MATLAB Fcn**（上面的 fix 映射）→ $\{-3, -1, 1, 3\}$。
5. **餘弦波**：Sine Wave 的相位設 $\pi/2$。Sample time 設 0 為連續模式、> 0 為離散模式。

### 題型四：產生高斯雜訊（例 3.3）

| 方塊 | 所在函式庫 | 參數重點 |
|---|---|---|
| Random Number | Simulink Sources | 平均值、變異數、取樣時間 |
| Bandlimited White Noise | Simulink Sources | 雙邊 PSD $N_o/2$、取樣時間（＝相關時間 $t_c$） |
| Random Source（Gaussian） | SP blockset | Method 選 Ziggurat（與 MATLAB `randn` 相同） |
| AWGN Channel | Communications blockset | 直接把 WGN 加到實數或複數訊號上 |

> 例 3.3 結論（變異數 0.15、取樣時間 1/100、同 seed）：Random Number 與 Bandlimited White Noise 的輸出相同；Random Source（Gaussian）與 AWGN Channel 都用 Ziggurat 法，輸出也相同。

### 題型五：用方塊建調變器（例 3.4、3.5）

1. **DSB-SC**（例 3.4，$f_m = 1$ Hz、$f_c = 10$ Hz、$A_c = 10$）：兩個 Sine Wave 分別產生訊息與載波 → **Product** → **Gain**（$A_c$）。取樣時間 1/100。
2. **FM**（例 3.5，$k_f = 5$ Hz/V、$f_c = 10$ Hz、$s(t) = \cos 2\pi t$）：
   1. 訊息 → **Discrete-Time Integrator** → **Gain**（$k_f$）得 $k_f\int s\,d\alpha$
   2. **Ramp** 方塊產生 $f_c t$
   3. 兩者相加 → **Fcn** 方塊算 $\cos(2\pi u)$ 得 FM 訊號

> Discrete 函式庫的每個方塊都視為輸入端有取樣器、輸出端有 ZOH。

### 題型六：數位濾波器設計（例 3.6）

1. 把 Hz 規格換成正規化頻率：$\hat\omega = 2\pi f/f_s$，**輸入 MATLAB 時除以 $\pi$**。
2. 從 SP blockset 的 Filtering > Filter Designs 拖出 Lowpass Filter，在對話框填規格。
3. 也可用 Simulink Discrete 函式庫：
   - **Discrete Filter**：係數依 $z^{-1}$ **升冪**排列
   - **Discrete Transfer Fcn**：係數依 $z$ **降冪**排列

> 例 3.6：$f_p = 2$ Hz、$f_s = 5$ Hz、取樣 100 Hz → $\hat\omega_p = 0.04\pi$、$\hat\omega_s = 0.1\pi$（MATLAB 填 0.04、0.1），$R_p = 1$ dB、$R_s = 60$ dB；濾波後雜訊大幅降低，波形略有失真。

### 題型七：頻譜顯示（例 3.7）

1. 訊號 → Zero-Order Hold → **Spectrum Scope**（SP blockset 的 Signal Processing Sinks）。
2. Scope properties：單位 dBW/Hertz、單邊頻譜 $[0, f_s/2]$、勾 Buffer input、Buffer size 與 FFT length 設 $2^N$、選 Hanning 窗降低頻譜擴散（spectral spreading）。
3. Axis properties：勾 Inherit sample time，自訂頻率顯示範圍。
4. 用 $\Delta f = f_s/2^N$ 檢查解析度夠不夠。

> 例 3.7（FM，$f_m = 1$ Hz、$f_c = 25$ Hz）：取 $f_s = 800$ Hz（25 Hz 載波一週期 32 點）、$2^N = 4096$ → $\Delta f \approx 0.2$ Hz。

### 題型八：與 MATLAB 交換資料、跑多次模擬（Fig. 3.32～3.35）

1. **匯出**：模型中接 **Signal to Workspace**，Variable name 填 `error_rate`，Limit data points to last 填 1（只留最後一個時間步的值）。
2. **單次執行**：`sim('模型名稱')` 在背景跑模型，不必開模型視窗。
3. **多次執行**：在 m-file 迴圈中改變 $E_b/N_o$、算出對應雜訊變異數，每次呼叫 `sim`，收集結果後用 `semilogy` 畫 BER 曲線。
4. **匯入**：用 **Signal from Workspace** 取代 Polar Bernoulli Source，Signal 參數填工作區變數名稱。

```matlab
% 依 Fig. 3.33 改寫：掃描 Eb/No 並畫 BER 曲線
BER_Vec  = [];
Bit_rate = 1;            % 位元率
T    = 1/Bit_rate;       % 位元時間
Tsim = 10000;            % 模擬位元數
Ts   = T/32;             % 取樣間隔
Fs   = 1/Ts;             % 取樣率
EbNovec = [3 5 7 9 11 13 15];          % Eb/No (dB)
for n = 1:length(EbNovec)
    zz     = 10^(0.1*EbNovec(n));      % dB 換成倍數
    sigma2 = Fs/(2*zz);                % 模型中 WGN 方塊的變異數
    sim('Experiment_3_12');            % 執行模型
    BER_Vec(n) = error_rate;           % 由 Signal to Workspace 傳回
end
semilogy(EbNovec, BER_Vec, '--*');
xlabel('Eb/No (dB)'); ylabel('BER');

% 匯入用的資料：長度 Tsim 的隨機極性位元
bn = rand(1, Tsim);
polar_bits = sign(bn - 0.5);
```

> 💡 補充說明（AI）：`sigma2 = Fs/(2*zz)` 可以對照式 (3.1) $\sigma^2 = N_o/(2T_s) = F_s N_o/2$：當 $E_b = 1$（振幅 1、位元時間 $T = 1$）時 $N_o = 1/(E_b/N_o)$，代入即得。此推導為 AI 自行對照，講義只寫出程式。

> 結果：`BER_Vec = 0.0294 0.0094 0.0020 0.0002 0 0 0`；單次執行範例的 `error_rate = 2.0002e-004`。

## 常見陷阱

- MATLAB／Simulink 的數位濾波器頻率是以 $\pi$ 正規化：$\hat\omega = 0.22\pi$ 要輸入 **0.22**，不是 0.22π 或 0.69。
- Sine Wave 方塊的 Frequency 單位是 **rad/s**（5 Hz 要填 `10*pi`），不是 Hz；但 SP blockset 的 Sine Wave 用 Hz。
- 離散方塊需要指定 Sample time，連續方塊（如 Continuous 函式庫）與 Sources 方塊不能用 −1 繼承。
- 有狀態（記憶）的方塊：Integrator、Memory；無狀態：Gain、Sum、Product。
- 模擬位元數決定能測到的最低 BER：10,000 位元只能可靠模擬到約 $10^{-3}$；要看到 $10^{-5}$ 的錯誤至少需要 500,000 位元，否則高 SNR 時 `BER_Vec` 會顯示 0。
- 講義中匯入範例的變數名稱同時出現 `polar_Bits` 與 `polar_bits`；MATLAB 區分大小寫，方塊參數與工作區變數名稱必須完全一致。
- 學生版 MATLAB／Simulink **不含** Communications blockset，較複雜的通道模型（如 AWGN Channel 方塊）需另外取得。
