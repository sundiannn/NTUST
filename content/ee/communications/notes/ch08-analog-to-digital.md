# Ch.8 類比訊號轉換為數位格式

> 依據：老師講義 Chapter 8 Conversion of Analog Signals to Digital Format（8.1–8.9）｜更新：2026-11-15

## 重點摘要

- **取樣定理（Nyquist-Shannon sampling theorem）**：頻寬 $B$ 的訊號只要 $f_s \ge 2B$ 就能用理想低通濾波器完整還原；$f_s < 2B$ 會產生**混疊（aliasing）**，所以取樣前要加**抗混疊濾波器（anti-aliasing filter）**。
- 類比轉數位三步驟：**取樣 → 量化 → 編碼**。均勻量化的雜訊功率 $\Delta^2/12$，得到「**每多 1 bit，SQNR 多 6 dB**」的 6 dB 定律。
- 語音的小振幅比較常見，所以 PCM 電話用**非均勻量化（壓伸，companding）**：北美／日本用 μ-law（$\mu = 255$），歐洲與其他地區用 A-law（$A = 87.6$），SQNR 約 $6m - 10$ dB，且對訊號大小不敏感。
- **DPCM** 量化「預測誤差」來省位元（預測增益 $G_p$）；**DM** 是 1 bit 的 DPCM，要注意**斜率過載（slope overload）**與**顆粒雜訊（granular noise）**；**超取樣**每加倍只多 3 dB，**一階 Σ-Δ 調變**靠雜訊塑形每加倍多 9 dB。
- **帶通取樣**：帶通訊號不必用 $2f_H$ 取樣，只要頻帶落在 $f_s/2$ 的整數倍之間即可，最低可到 $2B_{IF}$。

## 公式整理

### 8.1 低通訊號取樣

$$
x_\delta(t) = x(t)\,\delta_{T_s}(t) = \sum_{n=-\infty}^{\infty}x(nT_s)\,\delta(t-nT_s)
$$

$$
X_\delta(f) = f_s\sum_{n=-\infty}^{\infty}X(f-nf_s), \qquad f_s = \frac{1}{T_s} \ge 2B
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $T_s$ | 取樣週期 | s |
| $f_s$ | 取樣頻率 | Hz（samples/s） |
| $B$ | 訊號最高頻率（頻寬） | Hz |
| $\delta_{T_s}(t)$ | 週期為 $T_s$ 的脈衝串 | — |

> 名詞：$2B$ 叫**奈奎斯特速率（Nyquist rate）**；$f_s/2$ 叫**奈奎斯特頻率／摺疊頻率（folding frequency）**；DC～$f_s/2$ 叫**奈奎斯特頻帶**。$f_s > 2B$ 為超取樣、$f_s < 2B$ 為欠取樣、$f_s = 2B$ 為臨界取樣。

**還原（重建）**

$$
H_r(f) = \begin{cases} T_s, & \lvert f\rvert < W \\ 0, & \text{otherwise} \end{cases}, \quad B \le W \le f_s - B, \qquad h_r(t) = 2WT_s\,\text{sinc}(2Wt)
$$

$$
\hat{x}(t) = \sum_{n=-\infty}^{\infty}x(nT_s)\,\text{sinc}(f_st - n) \quad (W = f_s/2)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $W$ | 重建濾波器截止頻率 | Hz |
| $\hat{x}(t)$ | 重建後的訊號 | V |

> 不論有沒有混疊，重建訊號在取樣點上一定等於原值；只有滿足 $f_s \ge 2B$ 時，在**所有時間**都相等。理想低通濾波器做不出來，實務上需要超取樣留出過渡帶。

常用取樣率（Table 8.1）：電話 3.4 kHz → 8 kHz；CD 20 kHz → 44.1 kHz；視訊 4.2 MHz → 大於 8.4 MHz（常用 $3f_{sc}$ 或 $4f_{sc}$）。

### 8.1.4 實際取樣

$$
\text{自然取樣：}\ X_\delta(f) = \tau f_s\sum_{n}\text{sinc}(nf_s\tau)\,X(f-nf_s)
$$

$$
\text{平頂取樣：}\ X_\delta(f) = \tau f_s\,\text{sinc}(f\tau)\,e^{-j\pi f\tau}\sum_{n}X(f-nf_s)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\tau$ | 取樣脈波寬度（平頂取樣的保持時間，aperture time） | s |
| $\tau/T_s$ | 責任週期（duty cycle） | — |

- **自然取樣（natural sampling）**：每個複本只被常數 $\text{sinc}(nf_s\tau)$ 加權 → 用低通濾波器可**無失真**還原。
- **平頂取樣（flat-top sampling）**：整個頻譜乘上隨頻率變化的 $\text{sinc}(f\tau)$ → **孔徑效應（aperture effect）**造成振幅失真，另有 $\tau/2$ 延遲；責任週期小於 10% 可降低此效應。

### 8.2 混疊

| 輸入頻率 $f$ 所在頻帶 | 重建頻率 | 頻譜反轉 |
|---|---|---|
| $[0,\ f_s/2]$ | $f$ | 無（正常取樣） |
| $(f_s/2,\ f_s)$ | $f_s - f$ | 有 |
| $(f_s,\ 3f_s/2)$ | $f - f_s$ | 無 |
| $(3f_s/2,\ 2f_s)$ | $2f_s - f$ | 有 |
| $(2f_s,\ 5f_s/2)$ | $f - 2f_s$ | 無 |

> 奈奎斯特頻帶以外的成分（雜散訊號或雜訊）都會摺回 $[0, f_s/2]$，所以必須在取樣**前**濾掉。很多應用把取樣率訂在奈奎斯特速率的 1.1 倍左右，留 10% 給抗混疊濾波器的過渡帶。

### 8.3 量化與編碼

$$
\Delta = \frac{2V}{M} = \frac{2V}{2^m}, \qquad y_k = \frac{x_k + x_{k+1}}{2}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\Delta$ | 量化步階（step size），等於 1 LSB | V |
| $2V$ | 量化器全刻度範圍（雙極性輸入） | V |
| $M$ | 量化位準數 | — |
| $m$ | 每個樣本的位元數 | bit |
| $x_k,\ y_k$ | 分界位準（threshold）、量化位準（reconstruction level） | V |

> 均勻量化器分**中升型（midrise）**與**中平型（midtread）**兩種。編碼常用二補數（two's complement）分數：$a_0.a_1a_2\cdots a_{m-1}$ 的值為 $-a_0 + \sum_{i=1}^{m-1}a_i2^{-i}$（例：$1.011 = -1 + 1/4 + 1/8 = -5/8$）。

**量化雜訊**

$$
e[n] = y[n] - x[n] \in \left(-\frac{\Delta}{2},\ \frac{\Delta}{2}\right], \qquad \sigma_e^2 = \frac{\Delta^2}{12} = \frac{V^2}{3\cdot 2^{2m}}
$$

$$
\text{SQNR} = 10\log_{10}\frac{\sigma_x^2}{\sigma_e^2} = 6m + 4.77 - 20\log_{10}\frac{x_{max}}{\sigma_x}\ \text{dB}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\sigma_e^2$ | 量化雜訊功率（四捨五入時 $e$ 在 $[-\Delta/2, \Delta/2]$ 均勻分布） | V² |
| $\sigma_x^2$ | 輸入訊號功率（變異數） | V² |
| $x_{max}$ | 訊號峰值（設定為 $V$，剛好用滿全刻度） | V |
| SQNR | 訊號對量化雜訊比（signal-to-quantization noise ratio） | dB |

$$
\text{一般訊號（}x_{max} = 4\sigma_x\text{）：}\ \text{SQNR} = 6m - 7.25\ \text{dB}, \qquad \text{正弦波：}\ \text{SQNR} = 6m + 1.77\ \text{dB}
$$

$$
\text{ENOB} = \frac{\text{SNR} - 1.77}{6}\ \text{bits}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| ENOB | 有效位元數（effective number of bits），用正弦測試訊號實測 SNR 換算 | bit |

> 量化誤差有兩種：**量化雜訊**（捨入／截斷）與**飽和（peak clipping）**（輸入超出全刻度）。高斯訊號超過 $4\sigma_x$ 的機率很小，所以取 $x_{max} \approx 4\sigma_x$。若用截斷而非捨入，誤差永遠為負，分布在 $[-\Delta, 0]$。

### 8.4 PCM 與非均勻量化

$$
R_b = f_s \cdot m\ \text{bits/s}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $R_b$ | PCM 序列位元率 | bps |

**μ-law（北美、加拿大、日本，$\mu = 255$）**

$$
y = y_{max}\frac{\ln(1+\mu\lvert x\rvert/x_{max})}{\ln(1+\mu)}\,\text{sgn}(x), \qquad x = \frac{x_{max}}{\mu}\left[(1+\mu)^{\lvert y\rvert/y_{max}} - 1\right]\text{sgn}(y)
$$

**A-law（歐洲與其他地區，$A = 87.6$）**

$$
y = \begin{cases} y_{max}\dfrac{A(\lvert x\rvert/x_{max})}{1+\ln A}\,\text{sgn}(x), & 0 \le \dfrac{\lvert x\rvert}{x_{max}} \le \dfrac{1}{A} \\[2ex] y_{max}\dfrac{1+\ln(A\lvert x\rvert/x_{max})}{1+\ln A}\,\text{sgn}(x), & \dfrac{1}{A} \le \dfrac{\lvert x\rvert}{x_{max}} \le 1 \end{cases}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\mu,\ A$ | 壓縮參數；$\mu = 0$、$A = 1$ 都等於均勻量化 | — |
| $x,\ y$ | 壓縮器輸入、輸出 | V |

$$
\text{SQNR}_{\mu} \approx 6m + 4.77 - 20\log_{10}[\ln(1+\mu)] \xrightarrow{\mu = 255} 6m - 10\ \text{dB}
$$

$$
\text{SQNR}_{A} = 6m + 4.77 - 20\log_{10}(1+\ln A) \xrightarrow{A = 87.6} 6m - 10\ \text{dB}
$$

<!-- TODO: 待確認：式 (8.50)（Laplacian 訊號下 μ-law 的完整 SQNR，含 x_max/σ_x 項）文字擷取破損，只整理了 μ ≫ 1 的近似式 (8.51)。 -->

- 壓縮器 → 均勻量化 → （接收端）擴展器，壓縮＋擴展合稱**壓伸器（compander）**。
- 實際 PCM 用**分段線性**近似 μ = 255 曲線：8 段、每段 16 階、相鄰段步階加倍；8 bit 碼字＝1 bit 正負號＋3 bit 段號＋4 bit 段內位準。
- 均勻量化器的 SQNR 會隨輸入功率下降而線性變差；μ-law 在很寬的輸入範圍內都能維持可接受的 SQNR。

### 8.5 差分 PCM（DPCM）

$$
d[n] = x[n] - \hat{x}[n], \qquad y[n] = d[n] + e[n], \qquad x_q[n] = \hat{x}[n] + y[n] = x[n] + e[n]
$$

$$
\hat{x}[n] = h_1x_q[n-1] + h_2x_q[n-2] + \cdots + h_Nx_q[n-N]
$$

$$
\text{SNR}_{DPCM} = \frac{\sigma_x^2}{\sigma_e^2} = \frac{\sigma_x^2}{\sigma_d^2}\cdot\frac{\sigma_d^2}{\sigma_e^2} = G_p\cdot\text{SQNR}_{PCM}, \qquad G_p = \frac{\sigma_x^2}{\sigma_d^2}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $d[n]$ | 預測誤差（prediction error） | V |
| $\hat{x}[n]$ | 預測值（用**重建後**的樣本 $x_q$ 預測） | V |
| $h_i$ | FIR 預測濾波器係數 | — |
| $\sigma_d^2$ | 預測誤差的變異數 | V² |
| $G_p$ | 預測增益（prediction gain） | — |

> 預測用 $x_q$ 而不是 $x$，因為接收端只拿得到 $x_q$；這樣收發兩端的預測值才一致，而且誤差只有當下的 $e[n]$，**不會累積傳播**。語音的 DPCM 比 PCM 好約 4～11 dB，相當於每樣本省 1～4 bit（8 kHz 取樣時省 8～32 kbps）；預測階數做到 4～5 之後就沒什麼增益。量化器與係數都即時調整的叫 **ADPCM**。

### 8.6 超取樣

$$
K = \frac{f_s}{2B}, \qquad \text{頻帶內量化雜訊} = \frac{\sigma_e^2}{K}
$$

$$
\text{SQNR} = 6m - 7.25 + 10\log_{10}K\ \text{dB（一般訊號）}, \qquad \text{SQNR} = 6m + 1.77 + 10\log_{10}K\ \text{dB（正弦波）}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $K$ | 超取樣比（oversampling ratio） | — |

> 量化雜訊總功率固定，超取樣把它攤到 $[-f_s/2, f_s/2]$，再用數位低通濾掉頻帶外雜訊並降取樣（合稱**抽取，decimation**）。$K$ 加倍只多 3 dB（＝半個 bit）；要多 $r$ bit 需 $K = 4^r$，不划算。好處是抗混疊濾波器的規格可以放寬。

### 8.7 增量調變（DM）

$$
d[n] = x[n] - x_q[n-1], \qquad y[n] = \text{sgn}(d[n]), \qquad x_q[n] = \Delta y[n] + x_q[n-1] = \Delta\sum_{i=1}^{n}y[i]
$$

**斜率過載條件**

$$
\frac{\Delta}{T_s} < \left\lvert\frac{dx(t)}{dt}\right\rvert_{max}
$$

$$
\text{正弦波 } x(t) = A\cos(2\pi f_mt)\text{：}\ A_{max} = \frac{\Delta}{2\pi f_mT_s} = \frac{\Delta f_s}{2\pi f_m}, \qquad \text{語音（}f_m = 800\text{ Hz）：}\ A_{max} = \frac{\Delta f_s}{1600\pi}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\Delta$ | DM 步階 | V |
| $f_m$ | 調變訊號頻率 | Hz |
| $A_{max}$ | 不發生斜率過載的最大振幅 | V |

**量化雜訊與 SNR（無斜率過載）**

$$
\sigma_e^2 = \frac{\Delta^2}{3}, \qquad N_o = \frac{\Delta^2}{3}\cdot\frac{B}{f_s}
$$

$$
\text{SNR}_{DM}(\text{正弦}) = \frac{3f_s^3}{8\pi^2f_m^2B}, \qquad \text{SNR}_{DM}(\text{語音}) = \frac{3f_s^3}{2(1600\pi)^2B}
$$

> 💡 補充說明（AI）：DM 誤差範圍是 $[-\Delta, \Delta]$，所以雜訊功率是 $\Delta^2/3$（不是 $\Delta^2/12$）；雜訊均勻分布在 $[-f_s, f_s]$，經頻寬 $B$ 的低通後只剩 $B/f_s$ 的比例。SNR 與 $f_s^3$ 成正比，所以 $f_s$ 加倍 SNR 多 9 dB。

- **斜率過載**：$\Delta$ 太小，階梯追不上陡峭段，輸出是一串同號脈波。
- **顆粒雜訊**：$\Delta$ 太大，平緩段來回震盪，輸出正負交替。
- **適應性 DM（ADM）**：平緩段縮小 $\Delta$、陡峭段加大 $\Delta$。
- **CVSD**：看最近 3 個輸出位元，3 個相同（陡峭）時 $\alpha[n] = 1$ 加大步階，否則以 $\beta$（0.9～0.995）衰減，但不低於 $\Delta_{min}$；屬於「加法增加、乘法減少」演算法，用於軍用戰術通訊與藍牙。

<!-- TODO: 待確認：CVSD 步階更新式 (8.84) 中與 α[n] 相乘的常數符號在文字擷取中破損（Δ_max 或 Δ_0），故未列出公式。 -->

### 8.8 Σ-Δ 調變（一階）

$$
y[n] = x[n-1] + e[n] - e[n-1], \qquad H_s(z) = z^{-1}, \qquad H_n(z) = 1 - z^{-1}
$$

$$
\lvert H_n(f)\rvert^2 = 4\sin^2\!\left(\frac{\pi f}{f_s}\right), \qquad G_e(f) = \frac{\Delta^2}{12f_s}
$$

$$
\text{SNR} = \frac{9K^3}{2\pi^2} \;\Rightarrow\; \text{SNR} = -3.41 + 30\log_{10}K\ \text{dB}, \qquad K = 2^r \Rightarrow -3.41 + 9r\ \text{dB}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $H_s,\ H_n$ | 訊號、雜訊轉移函數 | — |
| $G_e(f)$ | 量化雜訊功率頻譜密度 | V²/Hz |

> 積分器從 DM 的回授路徑移到前向路徑；雜訊被一階差分器**塑形（noise shaping）**推到高頻，再由數位低通濾掉。$K$ 每加倍多 9 dB（1.5 bit）；二階 Σ-Δ 每倍頻多 15 dB（2.5 bit）。訊號功率以峰值 $\Delta/2$ 的正弦波計算。

### 8.9 帶通取樣

$$
\text{整數定位（}f_L/B_{IF}\text{ 或 }f_H/B_{IF}\text{ 為整數）：}\ f_s = 2B_{IF}
$$

$$
\frac{2f_H}{n} \le f_s \le \frac{2f_L}{n-1}, \qquad n_{max} = \left\lfloor\frac{f_H}{B_{IF}}\right\rfloor, \qquad f_{s,min} = \frac{2f_H}{n_{max}}
$$

$$
\text{SQNR} = 6m + 1.77 - 10\log_{10}\frac{2f_H}{f_s}, \qquad \text{最大劣化} = 10\log_{10}n_{max}\ \text{dB}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $f_L,\ f_H$ | 帶通訊號的下、上邊緣頻率 | Hz |
| $B_{IF}$ | 帶通訊號頻寬 $f_H - f_L$ | Hz |
| $n$ | 整數 | — |

> 整數比為偶數時，取樣後頻譜會**反轉**（頻譜對稱時沒影響，不對稱可用 DSP 修正）。欠取樣會讓 SQNR 變差，$f_s$ 每減半劣化 3 dB，所以實務上常選 $n < n_{max}$ 換取較小劣化。應用：數位接收機直接對 IF 取樣，一次完成數位化與降頻。

## 解題技巧

### 題型一：取樣後重建輸出（例 8.1～8.3）

1. 算 $f_s/2$，判斷訊號頻率落在哪一個頻帶（查 8.2 的表）。
2. 落在奈奎斯特頻帶內 → 輸出不變；否則找出摺回的頻率，並判斷是否頻譜反轉。
3. 也可直接在時域驗證：$\cos(2\pi f nT_s)$ 把 $fT_s$ 減去整數倍 $2\pi$。

> 對答案用：$f_s = 10$ kHz，3 kHz → 3 kHz；7 kHz → 3 kHz（有反轉）；13 kHz → 3 kHz（無反轉）。

### 題型二：均勻量化（例 8.4、8.5）

1. $\Delta = 2V/M$，列出分界位準（$-V, -V+\Delta, \ldots$）與量化位準（各區間中點）。
2. 每個樣本找所在區間，輸出中點。
3. 最大量化誤差 $= \Delta/2$（約半個 LSB）。

> 對答案用：例 8.4（±1.5 V、8 階）$\Delta = 0.375$，$\{1.2, -0.2, -0.5, 0.4, 0.89, 1.3\} \to \{1.3125, -0.1875, -0.5625, 0.5625, 0.9375, 1.3125\}$；例 8.5（12 bit、±10 V）$\Delta \approx 4.9$ mV、最大誤差 2.45 mV。

### 題型三：由 SQNR 規格求位元數與位元率（例 8.6、8.8）

1. 選對公式：一般訊號 $6m - 7.25$、正弦 $6m + 1.77$、μ-law／A-law $6m - 10$。
2. 解出 $m$，取整數。
3. 位元率 $= f_s \times m$。

> 對答案用：例 8.6 音樂 96 dB → $m = 17$（一般用 16 bit），單聲道約 700 kbps、立體聲 1.4 Mbps；例 8.8 電話 40 dB → $m = 8$、64 kbps。

### 題型四：μ-law 非均勻量化器（例 8.7）

1. 先寫出 3 bit 均勻量化器的分界位準 $\{0, \pm0.25, \pm0.5, \pm0.75, \pm1\}$ 與量化位準 $\{\pm0.125, \pm0.375, \pm0.625, \pm0.875\}$。
2. 用反 μ-law 把分界位準映射回輸入軸，得到非均勻分界。
3. 輸入落在哪個非均勻區間，就輸出對應的量化位準。

> 對答案用：$\mu = 40$ 時非均勻分界為 $\{0, \pm0.0383, \pm0.1351, \pm0.3801, \pm1\}$，$\{0.8, -0.135, -0.35, 0.25, 0.45, 0.9\} \to \{0.875, -0.375, -0.625, 0.625, 0.875, 0.875\}$。

### 題型五：超取樣與 Σ-Δ 的取樣率（例 8.9、8.12）

1. 算出目標 SQNR（如 16 bit：$6 \times 16 - 7.25 = 88.75$ dB）。
2. 超取樣 PCM：$\text{目標} = 6m - 7.25 + 10\log_{10}K$；一階 Σ-Δ：$\text{目標} = -3.41 + 30\log_{10}K$。
3. $f_s = K \cdot 2B$。

> 對答案用（$B = 20$ kHz）：8 bit 超取樣 → $K = 65{,}536$、$f_s \approx 2.62$ GHz；12 bit → $K = 256$、10.24 MHz；一階 Σ-Δ → $K \approx 1180$、$f_s \approx 47.21$ MHz。

### 題型六：DM 的取樣率與 SNR（例 8.10、8.11）

1. 語音用 $\text{SNR} = \dfrac{3f_s^3}{2(1600\pi)^2B}$，解出 $f_s$（DM 位元率＝取樣率）。
2. dB 形式（$B = 4$ kHz、$f_s$ 以 kHz 計）：$\text{SNR} = 30\log_{10}f_s - 18.285$ dB。
3. 與同位元率 PCM（$m = R_b/8$ kHz）的 $6m - 7.25$ 比較。

> 對答案用：40 dB → $f_s \approx 87.67$ kHz（PCM 只要 64 kbps）；32 kbps：DM 26.9 dB vs PCM 16.75 dB；64 kbps：DM 35.93 dB vs PCM 40.75 dB → **低位元率 DM 較好，高位元率 PCM 較好**。

### 題型七：帶通取樣最小取樣率（例 8.13、8.14）

1. $B_{IF} = f_H - f_L$，$n_{max} = \lfloor f_H/B_{IF}\rfloor$。
2. $f_{s,min} = 2f_H/n_{max}$，SQNR 劣化 $10\log_{10}n_{max}$ dB。
3. 有劣化上限時，用 $10\log_{10}n \le$ 上限求 $n$，再算 $f_s = 2f_H/n$。

> 對答案用：例 8.13（7.5～8.5 MHz）$n_{max} = 8$、$f_s = 2.125$ MHz；例 8.14（869～894 MHz）$n_{max} = 35$、$f_s \approx 51.09$ MHz、劣化 15.44 dB；限制 8 dB → $n = 6$、$f_s = 298$ MHz。

## 常見陷阱

- 混疊題要分清楚輸出頻率**是否頻譜反轉**；只看取樣點相等不代表重建正確。
- 平頂取樣即使滿足奈奎斯特條件，仍有孔徑效應造成的振幅失真；自然取樣則沒有。
- SQNR 公式要看訊號種類：正弦 $+1.77$、一般訊號（$4\sigma$ 負載）$-7.25$、μ-law／A-law 約 $-10$；別混用。
- DPCM 的預測要用**重建值** $x_q$，不是原始輸入 $x$。
- DM 的 $\Delta$ 取捨：太小 → 斜率過載；太大 → 顆粒雜訊。
- 超取樣（3 dB／倍）、一階 Σ-Δ（9 dB／倍）、DM（9 dB／倍）的改善速度不同。
- 帶通取樣不是「越低越好」：$f_s$ 越接近 $2B_{IF}$，SQNR 劣化越大，而且頻帶不能跨過 $f_s/2$ 的整數倍。
