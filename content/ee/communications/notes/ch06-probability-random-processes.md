# Ch.6 機率與隨機過程

> 依據：老師講義 Chapter 6 Probability and Random Processes（6.1–6.15）｜更新：2026-11-17

## 重點摘要

- 訊息與雜訊都無法事先預測，要用機率與統計平均描述；分析隨機訊號通過線性系統時，只需要**二階統計量**（平均值、自相關函數）或等效的**功率頻譜密度**。
- **獨立 ⇒ 不相關**，反之不一定成立；但**聯合高斯**隨機變數不相關就等於獨立，而且任何線性組合仍是高斯。
- **WSS**（廣義穩態）只要求平均值為常數、自相關只和時間差 $\tau$ 有關；**Wiener-Khinchin 定理**：功率頻譜密度 $G_x(f)$ 是 $R_x(\tau)$ 的傅立葉轉換。
- 隨機訊號通過 LTI 系統：$G_y(f) = |H(f)|^2 G_x(f)$。白雜訊頻譜為 $N_0/2$，過理想低通（頻寬 $W$）後功率為 $N_0W$。
- 系統雜訊用**雜訊指數**（noise figure）或**等效雜訊溫度**描述；串接系統用 **Friis 公式**，整體雜訊主要由**第一級**決定，所以接收機第一級都放高增益、低雜訊的 LNA。

## 公式整理

### 6.1 機率基本觀念

$$
P(A \cup B) = P(A) + P(B) - P(AB), \qquad P(\bar{A}) = 1 - P(A), \qquad P(A_1 \cup A_2 \cup \cdots) \le P(A_1) + P(A_2) + \cdots
$$

$$
P(A|B) = \frac{P(AB)}{P(B)}, \qquad
P(A) = \sum_i P(B_i)P(A|B_i), \qquad
P(B_j|A) = \frac{P(A|B_j)P(B_j)}{\sum_i P(B_i)P(A|B_i)}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $P(A\mid B)$ | 條件機率（conditional probability） | — |
| $B_i$ | 互斥且聯集為整個樣本空間的事件 | — |

> 第三式第二項是**全機率定理**（law of total probability），最後一式是**貝氏定理**（Bayes' rule）；不等式是**聯集上界**（union bound）。

**獨立事件：** $P(AB) = P(A)P(B)$，等價於 $P(A|B) = P(A)$。三個事件獨立要所有兩兩組合**以及** $P(A_1A_2A_3) = P(A_1)P(A_2)P(A_3)$ 都成立，兩兩獨立不代表全體獨立（例 6.5）。

> 互斥（$P(AB) = 0$）和獨立是兩回事，大多數獨立事件並不互斥。

### 6.2 離散隨機變數

$$
\text{二項式：}\ p_x(k) = \binom{n}{k}p^k(1 - p)^{n - k}, \qquad
\text{Poisson：}\ p_x(k) = \frac{(\lambda\tau)^k}{k!}e^{-\lambda\tau}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $p_x(k)$ | 機率質量函數（PMF） | — |
| $n, p$ | 試驗次數、每次成功機率 | — |
| $\lambda$ | 平均到達率 | 次/s |
| $\tau$ | 觀察時間長度 | s |

> 其他：均勻（$1/M$）、Bernoulli（$P\{x = 1\} = p$，用來描述一個位元是否出錯）。

### 6.3 連續隨機變數

$$
F_x(x) = P\{x \le x\}, \qquad f_x(x) = \frac{dF_x(x)}{dx}, \qquad
P\{a < x \le b\} = F_x(b) - F_x(a) = \int_a^b f_x(x)\,dx, \qquad \int_{-\infty}^{\infty}f_x(x)\,dx = 1
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $F_x(x)$ | 累積分布函數（CDF），非遞減，$F(-\infty) = 0$、$F(\infty) = 1$ | — |
| $f_x(x)$ | 機率密度函數（PDF），$f_x \ge 0$ | 1/(x 的單位) |

**高斯（Gaussian）：**

$$
f_x(x) = \frac{1}{\sqrt{2\pi}\sigma_x}e^{-(x - m_x)^2/2\sigma_x^2}, \qquad
Q(x) = \frac{1}{\sqrt{2\pi}}\int_x^{\infty}e^{-y^2/2}\,dy, \qquad Q(-x) = 1 - Q(x)
$$

$$
F_x(x) = 1 - Q\!\left(\frac{x - m_x}{\sigma_x}\right), \qquad P\{x > x_0\} = Q\!\left(\frac{x_0 - m_x}{\sigma_x}\right)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $m_x$ | 平均值 | 同 $x$ |
| $\sigma_x$ | 標準差 | 同 $x$ |
| $Q(x)$ | 高斯尾端機率（Q 函數），無閉式解，查表 | — |

**指數（exponential）：** $f_x(x) = \lambda e^{-\lambda x}$（$x \ge 0$），$P\{x > x_0\} = e^{-\lambda x_0}$。

### 6.4 隨機變數的函數

$y = g(x)$，$x_1, x_2, \ldots$ 為 $y = g(x)$ 的所有根：

$$
f_y(y) = \sum_i \frac{f_x(x_i)}{|g'(x_i)|}
$$

### 6.5 統計量

$$
m_x = E\{x\} = \int_{-\infty}^{\infty}x f_x(x)\,dx, \qquad E\{g(x)\} = \int_{-\infty}^{\infty}g(x)f_x(x)\,dx
$$

$$
\sigma_x^2 = E\{(x - m_x)^2\} = E\{x^2\} - m_x^2
$$

$$
\Phi_x(j\omega) = E\{e^{j\omega x}\}, \qquad E\{x^n\} = (-j)^n\frac{d^n\Phi_x(j\omega)}{d\omega^n}\bigg|_{\omega = 0}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $E\{\cdot\}$ | 期望值 | — |
| $\sigma_x^2$ | 變異數（variance） | （x 的單位）² |
| $\Phi_x(j\omega)$ | 特徵函數（characteristic function），即 PDF 的傅立葉轉換（符號相反） | — |

> 高斯的特徵函數 $\Phi_x(j\omega) = e^{j\omega m_x - \omega^2\sigma_x^2/2}$，所以高斯的高階動差都由 $m_x$、$\sigma_x^2$ 決定。

### 6.6–6.7 兩個隨機變數

$$
F_x(x) = F_{xy}(x, \infty), \qquad f_x(x) = \int_{-\infty}^{\infty}f_{xy}(x, y)\,dy
$$

$$
\mathrm{Cov}(x, y) = E\{(x - m_x)(y - m_y)\} = E\{xy\} - m_xm_y, \qquad
\rho_{xy} = \frac{\mathrm{Cov}(x, y)}{\sigma_x\sigma_y}
$$

$$
\mathrm{Var}(x + y) = \mathrm{Var}(x) + \mathrm{Var}(y) + 2\,\mathrm{Cov}(x, y)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $f_{xy}(x, y)$ | 聯合 PDF | — |
| $\mathrm{Cov}(x, y)$ | 共變異數（covariance） | — |
| $\rho_{xy}$ | 相關係數（correlation coefficient），$\lvert\rho_{xy}\rvert \le 1$ | — |

- **不相關**（uncorrelated）：$\mathrm{Cov} = 0$；**正交**（orthogonal）：$E\{xy\} = 0$。其中一個平均為 0 時兩者等價。
- **統計獨立**：$f_{xy}(x, y) = f_x(x)f_y(y)$ ⇒ $E\{g(x)h(y)\} = E\{g(x)\}E\{h(y)\}$ ⇒ 不相關。
- 獨立隨機變數相加：$z = x + y$ 的 PDF 為**捲積** $f_z = f_x * f_y$。

### 6.8 聯合高斯、Rayleigh、中央極限定理

$z = ax + by$（$x, y$ 聯合高斯）仍為高斯：

$$
m_z = am_x + bm_y, \qquad \sigma_z^2 = a^2\sigma_x^2 + 2\rho_{xy}ab\,\sigma_x\sigma_y + b^2\sigma_y^2
$$

$x, y$ 為獨立、零平均、變異數 $\sigma^2$ 的高斯，$r = \sqrt{x^2 + y^2}$、$\phi = \tan^{-1}(y/x)$：

$$
f_r(r) = \frac{r}{\sigma^2}e^{-r^2/2\sigma^2}, \quad r \ge 0
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $f_r(r)$ | Rayleigh PDF | — |
| $\phi$ | 相位，均勻分布於 $[-\pi, \pi]$，且與 $r$ 獨立 | rad |

> **中央極限定理**（central limit theorem）：大量獨立隨機變數的和趨近高斯分布，這是熱雜訊、散粒雜訊都用高斯模型的理由。

### 6.9 隨機過程

$$
m_x(t) = E\{x(t)\}, \qquad R_x(t_1, t_2) = E\{x(t_1)x(t_2)\}
$$

**WSS（wide-sense stationary）：**

$$
m_x(t) = \text{常數}, \qquad R_x(t, t + \tau) = R_x(\tau)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $R_x(\tau)$ | 自相關函數（autocorrelation function） | W（正規化） |
| $\tau$ | 時間差 | s |

**WSS 自相關的性質：**

$$
R_x(0) = E\{x^2(t)\} \ge 0\ (\text{總平均功率}), \qquad R_x(-\tau) = R_x(\tau), \qquad \lim_{|\tau|\to\infty}R_x(\tau) = m_x^2\ (\text{DC 功率})
$$

- 嚴格穩態 ⇒ WSS，反之不一定；但**高斯過程** WSS 就是嚴格穩態。
- **遍歷**（ergodic）：時間平均＝系集平均，可用單一樣本函數估計統計量；遍歷 ⇒ 穩態，反之不一定。

### 6.10 功率頻譜與 LTI 系統

$$
G_x(f) = \mathcal{F}\{R_x(\tau)\} = \int_{-\infty}^{\infty}R_x(\tau)e^{-j2\pi f\tau}\,d\tau, \qquad
\overline{x^2(t)} = R_x(0) = \int_{-\infty}^{\infty}G_x(f)\,df
$$

$$
G_y(f) = |H(f)|^2G_x(f), \qquad R_y(\tau) = h(-\tau) * h(\tau) * R_x(\tau), \qquad
G_{xy}(f) = H(f)G_x(f), \qquad m_y = m_xH(0)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $G_x(f)$ | 功率頻譜密度（power spectral density） | W/Hz |
| $H(f)$ | LTI 系統頻率響應 | — |
| $G_{xy}(f)$ | 輸入與輸出的交互頻譜密度 | W/Hz |

> 高斯過程通過 LTI 系統，輸出仍是高斯過程。

### 6.11 白雜訊與雜訊等效頻寬

$$
G_n(f) = \frac{N_0}{2}, \qquad R_n(\tau) = \frac{N_0}{2}\delta(\tau)
$$

$$
\text{理想低通（頻寬 }W\text{）：}\ R_y(\tau) = N_0W\,\mathrm{sinc}(2W\tau), \qquad \overline{y^2} = N_0W
$$

$$
\overline{y^2} = \frac{N_0}{2}\int_{-\infty}^{\infty}|H(f)|^2df = N_0B_N|H(f)|_{max}^2, \qquad
B_N = \frac{\int_0^{\infty}|H(f)|^2df}{|H(f)|_{max}^2}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $N_0/2$ | 白雜訊雙邊功率頻譜密度 | W/Hz |
| $B_N$ | 雜訊等效頻寬（noise-equivalent bandwidth） | Hz |

> 白雜訊任意兩個不同時間的樣本都不相關（WGN 則互相獨立）；理想白雜訊功率無限大，只是模型。一階 RC 低通（例 6.32）：$B_N = \dfrac{\pi}{2}f_{3dB}$。

### 6.12 窄頻雜訊

$$
x(t) = x_c(t)\cos(2\pi f_c t) - x_s(t)\sin(2\pi f_c t) = r(t)\cos[2\pi f_c t + \phi(t)], \qquad r = \sqrt{x_c^2 + x_s^2}
$$

$$
G_{x_c}(f) = G_{x_s}(f) = G_x(f - f_c) + G_x(f + f_c), \quad |f| \le f_c; \qquad \overline{x_c^2} = \overline{x_s^2} = \overline{x^2}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $x_c, x_s$ | 同相、正交雜訊分量（低通） | V |
| $r(t), \phi(t)$ | 雜訊包絡、相位 | V、rad |

> 窄頻白高斯雜訊（雙邊 $N_0/2$、頻寬 $2B$ 置中於 $f_c$）：$G_{n_c} = G_{n_s} = N_0$（$|f| < B$），$\overline{n^2} = \overline{n_c^2} = \overline{n_s^2} = 2N_0B$；包絡為 **Rayleigh**、相位均勻。
> 若 $G_x(f)$ 對 $f_c$ 局部對稱，則 $x_c$、$x_s$ 不相關。$f_c$ 不一定要選在頻譜正中央，選不同的 $f_c$ 會得到不同的正交分解（例 6.33）。
> 例 6.33（$N_0/2$、5～9 Hz）：$f_c = 7$ Hz 時 $G_{n_c} = G_{n_s} = N_0$（$|f| \le 2$），頻譜對 $f_c$ 對稱 → $R_{n_cn_s}(\tau) = 0$；$f_c = 6$ Hz 時 $G_{n_c} = G_{n_s} = N_0$（$|f| \le 1$）、$N_0/2$（$1 < |f| \le 3$），交互頻譜 $\pm jN_0/2$ 不為 0，$R_{n_cn_s}(\tau) = 2N_0\,\mathrm{sinc}(2\tau)\sin(2\pi\tau)$。

**正弦波＋窄頻雜訊的包絡（Ricean）：**

$$
f_r(r) = \frac{r}{\sigma^2}\exp\!\left(-\frac{r^2 + A^2}{2\sigma^2}\right)I_0\!\left(\frac{Ar}{\sigma^2}\right), \quad r \ge 0
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $A$ | 正弦波振幅 | V |
| $I_0(\cdot)$ | 第一類零階修正貝索函數 | — |
| $\sigma^2$ | 雜訊同相／正交分量的變異數（$= 2N_0B$） | W |

$$
K = \frac{A^2}{2\sigma^2}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $K$ | Ricean K 因子（正弦波功率／雜訊功率） | — |

> $K \to 0$（$A \to 0$）時 Ricean PDF 退化成 Rayleigh PDF；$K \to \infty$ 時趨近高斯 $\mathcal{N}(A, \sigma^2)$。

### 6.13 雜訊來源

$$
\overline{v_n^2} = 4kTRB, \qquad \overline{i_n^2} = 4kTGB, \qquad N_{avail} = kTB, \qquad N_0 = kT_0 \approx 4 \times 10^{-21}\ \text{W/Hz}\ (T_0 = 290\text{ K})
$$

$$
\text{散粒雜訊：}\ G_{shot}(f) = 2qI_{DC}\ (\text{單邊}), \qquad \overline{i_{shot}^2} = 2qI_{DC}B_N
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $k$ | 波茲曼常數 $1.38 \times 10^{-23}$ | J/K |
| $T$ | 絕對溫度 | K |
| $R, G$ | 電阻、電導 | Ω、S |
| $B$ | 頻寬 | Hz |
| $N_{avail}$ | 可用雜訊功率（匹配負載時，與 $R$ 無關） | W |
| $q$ | 電子電荷 | C |
| $I_{DC}$ | 平均電流 | A |

> 串聯電阻：$\overline{v^2} = 4kT(R_1 + R_2)B$；並聯電導：$\overline{i^2} = 4kT(G_1 + G_2)B$。熱雜訊與散粒雜訊都是白的、高斯的。

### 6.14 系統雜訊

$$
F = \frac{(SNR)_{in}}{(SNR)_{out}}\Big|_{T_s = T_0}, \qquad N_{out} = F\,\mathcal{G}\,kT_0B_N, \qquad NF = 10\log_{10}F\ \text{dB}
$$

$$
T_e = (F - 1)T_0, \qquad N_{out} = \mathcal{G}k(T_s + T_e)B_N
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $F$ | 雜訊因子（noise factor） | — |
| $NF$ | 雜訊指數（noise figure） | dB |
| $\mathcal{G}$ | 可用功率增益 | — |
| $T_s$ | 訊號源溫度 | K |
| $T_e$ | 等效輸入雜訊溫度（不是實際溫度） | K |

> $NF = 3$ dB（$F = 2$）代表系統自己加的雜訊和輸入源雜訊一樣多，輸出 SNR 掉一半。

**Friis 公式（串接）：**

$$
F = F_1 + \frac{F_2 - 1}{\mathcal{G}_1} + \frac{F_3 - 1}{\mathcal{G}_1\mathcal{G}_2} + \cdots, \qquad
T_e = T_{e1} + \frac{T_{e2}}{\mathcal{G}_1} + \frac{T_{e3}}{\mathcal{G}_1\mathcal{G}_2} + \cdots
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $F_i, \mathcal{G}_i, T_{ei}$ | 第 $i$ 級的雜訊因子、增益、等效雜訊溫度 | —、—、K |

### 6.15 MATLAB 模擬隨機過程

**反 CDF 法**（產生任意 PDF 的隨機變數）：$u \sim \mathcal{U}[0, 1]$，令

$$
x = F_x^{-1}(u)
$$

則 $x$ 的 CDF 就是 $F_x(x)$。例 6.37：$F_x(x) = (1 - e^{-3x})u(x)$ → $x = -\frac{1}{3}\ln(1 - u)$，又 $1 - u$ 也是 $\mathcal{U}[0, 1]$，可寫成 $x = -\frac{1}{3}\ln u$。

> `rand` 產生 $\mathcal{U}[0, 1]$；`a + (b - a).*rand(128,1)` 產生 $\mathcal{U}[a, b]$；`randn` 產生 $\mathcal{N}(0, 1)$，要平均 $m$、變異數 $\sigma^2$ 就用 `sqrt(σ²).*randn(...) + m`。CDF 沒有閉式解（如高斯）時不能用反 CDF 法。

**取樣白高斯雜訊**：先用理想低通（截止 $f_s/2$）防止混疊，取樣後各樣本不相關（高斯 ⇒ 獨立），變異數

$$
R_x[m] = \sigma^2\delta[m] \;\Rightarrow\; G_x(e^{j\hat{\omega}}) = \sigma^2, \qquad
\sigma^2 = \frac{N_0f_s}{2} = \frac{N_0}{2T_s}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $f_s, T_s$ | 取樣頻率、取樣間隔 | Hz、s |
| $\sigma^2$ | 每個雜訊樣本的變異數 | W |

## 解題技巧

### 題型一：全機率與貝氏定理（例 6.3、6.4）

1. 把「發送 1／發送 0」當成互斥事件 $B_1, B_2$，「位元錯誤」當 $e$。
2. $P(e) = P(B_1)P(e|B_1) + P(B_2)P(e|B_2)$。
3. 問「已知出錯，原本是 1 的機率」→ 貝氏定理 $P(B_1|e) = P(e|B_1)P(B_1)/P(e)$。

> 例 6.3、6.4 對答案用：$P(e|1) = 10^{-4}$、$P(e|0) = 2 \times 10^{-4}$、先驗各 0.5 → $P(e) = 1.5 \times 10^{-4}$，$P(B_1|e) = 1/3$，所以出錯的位元比較可能原本是 0。

### 題型二：離散分布計算（例 6.6、6.7、6.8）

1. 先判斷模型：$n$ 次獨立試驗數成功次數 → 二項式；時間區間內事件數 → Poisson（參數 $\lambda\tau$）。
2. 「不超過 $k$ 次」要把 $0 \sim k$ 的機率加起來。

> 例 6.7：公平硬幣 10 次出現 3 次正面 $\approx 0.117$；$p = 0.35$ 時 10 次 5 次正面 $\approx 0.154$。
> 例 6.8：$\lambda = 0.5$ 次/s，0.3 s 內沒有請求 $= e^{-0.15} \approx 0.861$；2 s 內不超過 3 次 $\approx 0.981$。
> 例 6.6：擲兩次骰子取最大值，$p_x(k) = (2k - 1)/36$，$k = 1 \sim 6$。

### 題型三：連續分布與 Q 函數（例 6.9、6.11、6.12）

1. PDF 有未知常數時，用 $\int f_x = 1$ 解出來。
2. 區間機率 $= F(b) - F(a)$。
3. 高斯：先標準化 $(x - m_x)/\sigma_x$，再用 $Q$ 表；負值用 $Q(-x) = 1 - Q(x)$。
4. 指數分布：$P\{x > a\} = e^{-\lambda a}$，$P\{a \le x \le b\} = e^{-\lambda a} - e^{-\lambda b}$。

> 例 6.12（通話時間為指數分布）：超過 5 分鐘 $\approx 0.286$、1～3 分鐘 $\approx 0.306$。

### 題型四：自相關與功率頻譜（例 6.29、6.30、6.31）

1. 隨機相位弦波 $A\cos(\omega_0 t + \theta)$、$\theta$ 均勻於 $[0, 2\pi]$：$R_x(\tau) = \dfrac{A^2}{2}\cos(\omega_0\tau)$，是 WSS。
2. 已知 $G_x(f)$ 圖形：拆成矩形、三角形，查傅立葉對得到 $\mathrm{sinc}$、$\mathrm{sinc}^2$。
3. 總功率 $= R_x(0) =$ $G_x(f)$ 下的面積；DC 功率 $= \lim_{\tau\to\infty}R_x(\tau)$（頻譜在 $f = 0$ 沒有脈衝就是 0）。

> 例 6.30：總功率 $8 + 2.4 = 10.4$ W，DC 功率 0。

### 題型五：雜訊通過濾波器（例 6.31、6.32）

1. $G_y(f) = |H(f)|^2 \cdot N_0/2$。
2. 功率 $= \int G_y\,df$；非理想濾波器改用 $N_0B_N|H|_{max}^2$。
3. RC 低通直接記 $B_N = \frac{\pi}{2}f_{3dB}$。

### 題型六：雜訊指數串接（例 6.35）

1. dB 全部換成線性：$F = 10^{NF/10}$、$\mathcal{G} = 10^{G/10}$。
2. 代 Friis 公式，第 $k$ 級的 $(F_k - 1)$ 要除以**前面所有級**增益的乘積。
3. 答案再換回 dB。

> 例 6.35 對答案用：LNA（20 dB、NF 2 dB）→ 混頻器（10 dB、NF 10 dB）→ VGA（50 dB、NF 15 dB）：$F = 1.585 + \dfrac{10 - 1}{100} + \dfrac{31.6 - 1}{100 \times 10} = 1.585 + 0.09 + 0.0315 = 1.7065$，$NF \approx 2.32$ dB，幾乎全由 LNA 決定。

### 題型七：熱雜訊電壓（例 6.34）

1. 室溫換成絕對溫度（例 6.34：23°C → 296 K）。
2. $\overline{v^2} = 4kTRB$，多個電阻先求戴維寧等效電阻 $R_{eq}$ 再代入。

<!-- TODO: 待確認：例 6.34（verify/ch06/p074.png，課本 p.351）講義自相矛盾：印出 4kTRB = 29.6×10⁻¹² V²、RMS 5.44 μV，但 4×1.38×10⁻²³×296×20×10³×10⁶ 代入後應為約 3.27×10⁻¹⁰ V²（RMS 約 18 μV）；兩個印出值彼此一致但與公式不符，請向老師確認，暫不列出數值。 -->

## 常見陷阱

- **互斥 ≠ 獨立**；**兩兩獨立 ≠ 全體獨立**（例 6.5）。
- **不相關不一定獨立**，只有聯合高斯時兩者等價。
- 變異數公式 $E\{x^2\} - m_x^2$，不要忘了減平均值的平方。
- $\mathrm{Var}(x + y)$ 只有在不相關時才等於 $\mathrm{Var}(x) + \mathrm{Var}(y)$。
- 白雜訊頻譜是**雙邊** $N_0/2$；換成單邊要乘 2，算功率時頻寬要看清楚是單邊還是雙邊。
- 窄頻雜訊的 $n_c$、$n_s$ 頻譜高度是 $N_0$（不是 $N_0/2$），但三者功率都相同。
- 雜訊指數的定義前提是訊號源溫度 $T_0 = 290$ K；源溫度不同時改用等效雜訊溫度 $T_e$ 比較方便。
- Friis 公式中第一級的 $F_1$ 不減 1，而且 dB 值不能直接相加，要先換成線性。
