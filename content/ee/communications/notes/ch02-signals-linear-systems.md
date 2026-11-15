# Ch.2 訊號與線性系統複習

> 依據：老師講義 Chapter 2 Review of Signals and Linear Systems（2.1–2.11）｜更新：2026-11-15

## 重點摘要

- LTI 系統（線性非時變系統，linear time-invariant system）完全由**脈衝響應（impulse response）** $h(t)$ 決定：時域輸出 $y = x \otimes h$，頻域輸出 $Y(f) = X(f)H(f)$。
- 週期訊號用**傅立葉級數（Fourier series, FS）**表示成離散的線譜；非週期訊號用**傅立葉轉換（Fourier transform, FT）**得到連續頻譜。對實數訊號，振幅頻譜是偶函數、相位頻譜是奇函數。
- **時間－頻寬乘積（time-bandwidth product）**是常數：時間上越窄，頻寬越寬；訊號不可能同時限時又限頻。
- **無失真傳輸（distortionless transmission）**的條件：通帶內振幅響應為常數、相位響應為頻率的線性函數（群延遲固定），輸出只是輸入的延遲與縮放版 $H_o x(t - t_o)$。
- 有線媒介的插入損耗與長度成**線性**、高頻時與 $\sqrt{f}$ 成正比（集膚效應）；同軸電纜可用到約 1 GHz，雙絞線只有數 MHz。

## 公式整理

### 2.1 基本訊號

$$
x(t) = A\cos(2\pi f_o t + \phi), \qquad x(t) \triangleq A e^{j(2\pi f_o t + \phi)}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $A$ | 振幅（amplitude） | V |
| $f_o$ | 頻率 | Hz |
| $\phi$ | 相位（phase） | rad |
| $Ae^{j\phi}$ | 複數振幅，即**相量（phasor）** | V |

> 弦波是複指數訊號的實部；複指數訊號可以看成每秒轉 $f_o$ 圈的旋轉相量。

$$
\Pi\!\left(\frac{t}{\tau}\right) \triangleq
\begin{cases} 1, & -\tau/2 \le t \le \tau/2 \\ 0, & \text{otherwise} \end{cases}
\qquad
\Lambda\!\left(\frac{t}{\tau}\right) \triangleq
\begin{cases} 1 + \dfrac{2t}{\tau}, & -\tau/2 \le t \le 0 \\[4pt] 1 - \dfrac{2t}{\tau}, & 0 \le t \le \tau/2 \\[4pt] 0, & \text{otherwise} \end{cases}
$$

$$
\operatorname{sinc}(t) \triangleq \frac{\sin(\pi t)}{\pi t}, \qquad
\operatorname{sgn}(t) \triangleq \begin{cases} 1, & t > 0 \\ -1, & t < 0 \\ 0, & \text{otherwise} \end{cases}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\Pi(t/\tau)$ | 矩形脈波（rectangular pulse），寬度 $\tau$、高度 1 | — |
| $\Lambda(t/\tau)$ | 三角脈波（triangular pulse），底寬 $\tau$、高度 1 | — |
| $\tau$ | 脈波寬度 | s |
| $\operatorname{sinc}(t)$ | sinc 訊號，$t=0$ 時為 1，在 $t = \pm1, \pm2, \dots$ 過零 | — |

> 單位步階 $u(t)$：$t \ge 0$ 時為 1，否則為 0。若 $x(t) = 0$ 對所有 $t < 0$ 成立，稱為**因果（causal）訊號**；任何訊號乘上 $u(t)$ 就變成因果訊號。

### 2.1 脈衝訊號 $\delta(t)$ 的性質

$$
\int_{-\infty}^{\infty} \delta(t)\,dt = 1, \qquad \delta(t) = 0,\ t \ne 0
$$

| 編號 | 性質 | 公式 |
|---|---|---|
| 1 | 乘積 | $x(t)\delta(t - t_o) = x(t_o)\delta(t - t_o)$ |
| 2 | 時間縮放 | $\delta(\alpha t) = \dfrac{1}{\lvert\alpha\rvert}\delta(t)$ |
| 3 | 取樣（篩選，sifting） | $\displaystyle\int_{-\infty}^{\infty} x(t)\delta(t - t_o)\,dt = x(t_o)$ |
| 4 | 摺積 | $x(t) \otimes \delta(t) = x(t)$，$x(t) \otimes \delta(t - t_o) = x(t - t_o)$ |

> 離散時間的單位脈衝序列 $\delta[n]$：$n = 0$ 時為 1，其餘為 0。

### 2.1.2 能量與功率

$$
E_x \triangleq \lim_{T\to\infty} \int_{-T/2}^{T/2} |x(t)|^2\,dt = \int_{-\infty}^{\infty} |x(t)|^2\,dt
$$

$$
P_x \triangleq \lim_{T\to\infty} \frac{1}{T}\int_{-T/2}^{T/2} |x(t)|^2\,dt
\;\xrightarrow{\text{週期訊號}}\;
P_x = \frac{1}{T_o}\int_{-T_o/2}^{T_o/2} |x_p(t)|^2\,dt
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $E_x$ | 正規化能量（1 Ω 電阻上消耗的能量） | J |
| $P_x$ | 正規化平均功率 | W |
| $T_o$ | 週期訊號的基本週期（fundamental period） | s |

> 能量訊號 $P_x = 0$、功率訊號 $E_x = \infty$，所以一個訊號不可能同時是兩種；也可能兩者都不是。

### 2.1.3 對數功率（dBm）

$$
\text{Power (dBm)} = 10\log_{10}\frac{P}{1\ \text{mW}}, \qquad
\text{Power (mW)} = 10^{(\text{dBm}/10)}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $P$ | 功率 | mW |

> 1 mW = 0 dBm，100 mW = 20 dBm。鏈路上某點的功率 = 輸入 dBm + 沿途增益（dB）的代數和。

### 2.1.4 訊號的基本運算

| 運算 | 公式 | 效果 |
|---|---|---|
| 時間反轉 | $x_1(t) = x(-t)$ | 對縱軸鏡射 |
| 時間平移 | $x_2(t) = x(t - t_o)$ | $t_o > 0$ 右移（延遲），$t_o < 0$ 左移（超前） |
| 時間縮放 | $x_3(t) = x(at)$ | $a > 1$ 壓縮，$a < 1$ 擴張 |
| 振幅縮放 | $x_4(t) = Ax(t) + B$ | $A > 1$ 放大，$B$ 改變直流準位 |

### 2.2 系統分類與 LTI 系統

$$
\text{線性：}\ \alpha x_1(t) + \beta x_2(t) \rightarrow \alpha y_1(t) + \beta y_2(t), \qquad
\text{非時變：}\ x(t - t_o) \rightarrow y(t - t_o)
$$

$$
y(t) = x(t) \otimes h(t) = \int_{-\infty}^{\infty} x(\tau)h(t - \tau)\,d\tau, \qquad
y[n] = \sum_{k=-\infty}^{\infty} x[k]\,h[n - k]
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $h(t)$ | 脈衝響應，即輸入 $\delta(t)$ 時的輸出 | — |
| $\otimes$ | 摺積（convolution） | — |

| 性質 | 定義 | LTI 系統的判斷條件 |
|---|---|---|
| 無記憶（memoryless） | 輸出只取決於當下輸入 | — |
| 因果（causal） | 輸出只取決於現在與過去的輸入 | $h(t) = 0,\ t < 0$（離散：$h[n] = 0,\ n < 0$） |
| BIBO 穩定（stable） | 有界輸入 → 有界輸出 | $\int_{-\infty}^{\infty} \lvert h(t)\rvert\,dt < \infty$（離散：$\sum \lvert h[n]\rvert < \infty$） |

> 有限長度脈衝響應（FIR）系統只要每個 $|h[n]|$ 有限，就一定穩定。

### 2.4 傅立葉級數

$$
x_p(t) = \sum_{n=-\infty}^{\infty} C_n e^{j2\pi n f_o t}, \qquad
C_n = \frac{1}{T_o}\int_{T_o} x_p(t)\,e^{-j2\pi n f_o t}\,dt, \qquad f_o = \frac{1}{T_o}
$$

$$
x_p(t) = C_o + 2\sum_{n=1}^{\infty} |C_n|\cos(2\pi n f_o t + \angle C_n)
= A_o + \sum_{n=1}^{\infty} A_n\cos(2\pi n f_o t) + \sum_{n=1}^{\infty} B_n\sin(2\pi n f_o t)
$$

$$
A_n = \frac{2}{T_o}\int_{T_o} x_p(t)\cos(2\pi n f_o t)\,dt, \qquad
B_n = \frac{2}{T_o}\int_{T_o} x_p(t)\sin(2\pi n f_o t)\,dt, \qquad
C_o = A_o,\ \ 2C_n = A_n - jB_n
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $C_n$ | 指數型 FS 係數（複數），$C_o$ 為直流成分 | 同 $x_p$ |
| $f_o$ | 基頻（fundamental frequency） | Hz |
| $A_n, B_n$ | 三角型 FS 的餘弦、正弦係數 | 同 $x_p$ |

> 實數訊號有 $C_{-n} = C_n^*$。偶函數只有餘弦項（$B_n = 0$），奇函數只有正弦項（$A_n = 0$）。

**巴賽瓦定理（Parseval's theorem，週期訊號）**

$$
P_x = \sum_{n=-\infty}^{\infty} |C_n|^2
$$

> 週期訊號的平均功率 = 各頻率成分平均功率的總和。

**常用結果：矩形脈波串**（寬度 $\tau$、週期 $T_o$、高度 1）

$$
C_n = \frac{\tau}{T_o}\operatorname{sinc}(n f_o \tau)
$$

> 直流項為 $\tau/T_o$；譜線間距 $f_o = 1/T_o$；包絡過零點在 $1/\tau$ 的整數倍。

**吉布斯現象（Gibbs phenomenon）**：FS 部分和在不連續點收斂到左右極限的平均值，兩側會出現約跳躍量 9% 的過衝，與取的項數 $N$ 無關。

### 2.5 傅立葉轉換

$$
X(f) = \int_{-\infty}^{\infty} x(t)\,e^{-j2\pi f t}\,dt, \qquad
x(t) = \int_{-\infty}^{\infty} X(f)\,e^{j2\pi f t}\,df
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $X(f)$ | 頻譜（frequency spectrum），$\lvert X(f)\rvert$ 為振幅頻譜、$\angle X(f)$ 為相位頻譜 | V/Hz |

> 實數 $x(t)$：$X(-f) = X^*(f)$，所以 $|X(f)|$ 為偶函數、$\angle X(f)$ 為奇函數。

**常用轉換對（Table 2.2）**

| $x(t)$ | $X(f)$ |
|---|---|
| 直流 $A$ | $A\delta(f)$ |
| $\Pi(t/\tau)$ | $\tau\operatorname{sinc}(f\tau)$ |
| $\Lambda(t/\tau)$ | $\dfrac{\tau}{2}\operatorname{sinc}^2\!\left(\dfrac{f\tau}{2}\right)$ |
| $e^{-\alpha t}u(t)$ | $\dfrac{1}{\alpha + j2\pi f}$ |
| $e^{-\alpha\lvert t\rvert}$ | $\dfrac{2\alpha}{\alpha^2 + (2\pi f)^2}$ |
| $\delta(t)$ | $1$ |
| $\delta(t - t_o)$ | $e^{-j2\pi f t_o}$ |
| $\operatorname{sinc}(2Wt)$ | $\dfrac{1}{2W}\Pi\!\left(\dfrac{f}{2W}\right)$ |
| $e^{j2\pi f_c t}$ | $\delta(f - f_c)$ |
| $\sin(2\pi f_c t)$ | $\dfrac{1}{2j}[\delta(f - f_c) - \delta(f + f_c)]$ |
| $\cos(2\pi f_c t)$ | $\dfrac{1}{2}[\delta(f - f_c) + \delta(f + f_c)]$ |
| $e^{-\pi t^2}$ | $e^{-\pi f^2}$ |
| $\operatorname{sgn}(t)$ | $\dfrac{1}{j\pi f}$ |
| $u(t)$ | $\dfrac{1}{2}\delta(f) + \dfrac{1}{j2\pi f}$ |
| $\dfrac{1}{\pi t}$ | $-j\operatorname{sgn}(f)$ |
| $\delta'(t)$ | $j2\pi f$ |

**傅立葉轉換性質（Table 2.3）**

| 性質 | 時域 | 頻域 |
|---|---|---|
| 線性 | $\alpha x(t) + \beta y(t)$ | $\alpha X(f) + \beta Y(f)$ |
| 時間平移 | $x(t - t_o)$ | $X(f)e^{-j2\pi f t_o}$ |
| 頻率平移 | $x(t)e^{j2\pi f_c t}$ | $X(f - f_c)$ |
| 摺積 | $x(t) \otimes y(t)$ | $X(f)Y(f)$ |
| 相乘 | $x(t)y(t)$ | $X(f) \otimes Y(f)$ |
| 時間／頻率縮放 | $x(at)$ | $\dfrac{1}{\lvert a\rvert}X\!\left(\dfrac{f}{a}\right)$ |
| 對偶性（duality） | $X(t)$ | $x(-f)$ |
| 時域微分 | $\dfrac{d}{dt}x(t)$ | $j2\pi f X(f)$ |
| 頻域微分 | $t\,x(t)$ | $\dfrac{j}{2\pi}\dfrac{d}{df}X(f)$ |
| 積分 | $\displaystyle\int_{-\infty}^{t} x(\tau)\,d\tau$ | $\dfrac{X(f)}{j2\pi f} + \dfrac{1}{2}X(0)\delta(f)$ |
| 巴賽瓦關係 | $\displaystyle\int x(t)y^*(t)\,dt$ | $\displaystyle\int X(f)Y^*(f)\,df$ |

**能量（巴賽瓦）**

$$
E_x = \int_{-\infty}^{\infty} |x(t)|^2\,dt = \int_{-\infty}^{\infty} |X(f)|^2\,df
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\lvert X(f)\rvert^2$ | 能量密度頻譜（energy density spectrum） | J/Hz |

### 2.5.3 週期訊號的傅立葉轉換

$$
X_p(f) = \sum_{n=-\infty}^{\infty} C_n\,\delta(f - n f_o)
$$

$$
\delta_{T_o}(t) = \sum_{n=-\infty}^{\infty}\delta(t - nT_o) \;\longleftrightarrow\; f_o\sum_{n=-\infty}^{\infty}\delta(f - n f_o)
$$

$$
A\cos(2\pi f_c t + \phi) \;\longleftrightarrow\; \frac{A}{2}e^{j\phi}\delta(f - f_c) + \frac{A}{2}e^{-j\phi}\delta(f + f_c)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\delta_{T_o}(t)$ | 週期為 $T_o$ 的脈衝串（impulse train） | — |

> 週期訊號的頻譜是位於諧波頻率 $nf_o$ 上的脈衝，脈衝權重就是 FS 係數 $C_n$。週期脈衝串的 FT 仍是脈衝串，週期變成 $f_o = 1/T_o$、權重為 $f_o$。

**卜瓦松求和公式（Poisson sum formula）**

$$
\sum_{n=-\infty}^{\infty} x(t - nT_o) = f_o\sum_{n=-\infty}^{\infty} X(n f_o)\,e^{j2\pi n f_o t}
$$

### 2.6 時間－頻寬乘積

$$
\Delta t = \frac{\int_{-\infty}^{\infty} x(t)\,dt}{x(0)}, \qquad
\Delta f = \frac{\int_{-\infty}^{\infty} X(f)\,df}{X(0)}
\;\Rightarrow\; \Delta f\,\Delta t = 1
$$

$$
\Delta f_{rms}\,\Delta t_{rms} \ge \frac{1}{4\pi}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\Delta t$ | 等面積矩形定義的脈波寬度 | s |
| $\Delta f$ | 同法定義的頻寬 | Hz |
| $\Delta t_{rms}, \Delta f_{rms}$ | 均方根（RMS）定義的時寬與頻寬 | s、Hz |

> 高斯脈波 $e^{-\pi t^2}$ 讓 RMS 不等式取等號；這個關係在量子物理中就是**測不準原理（uncertainty principle）**。

<!-- TODO: 待確認：講義式 (2.112)、(2.113) 的 RMS 時寬／頻寬定義在掃描檔中排版不清（分母缺漏、看不出是否有開根號），暫不列出。 -->

### 2.7 訊號通過 LTI 系統

$$
Y(f) = X(f)H(f), \qquad H(f) = |H(f)|\,e^{j\angle H(f)}
$$

$$
x(t) = \cos(2\pi f_c t) \;\Rightarrow\; y(t) = |H(f_c)|\cos[2\pi f_c t + \angle H(f_c)]
$$

$$
x_p(t) = \sum C_n e^{j2\pi n f_o t} \;\Rightarrow\; y(t) = \sum_{n=-\infty}^{\infty} C_n H(n f_o)\,e^{j2\pi n f_o t}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $H(f)$ | 頻率響應（frequency response），即 $h(t)$ 的 FT | — |
| $\lvert H(f)\rvert$ | 振幅響應 | — |
| $\angle H(f)$ | 相位響應 | rad |

> 輸出振幅 $|Y(f)| = |X(f)||H(f)|$、相位 $\angle Y(f) = \angle X(f) + \angle H(f)$；不想要的振幅、相位改變分別稱為**振幅失真**與**相位失真**。$h(t)$ 為實數時，$|H(f)|$ 為偶函數、$\angle H(f)$ 為奇函數。

**RC 低通濾波器（例 2.33）**

$$
H(f) = \frac{1}{1 + j2\pi f RC} = \frac{1}{1 + j(f/f_{3dB})}, \qquad f_{3dB} = \frac{1}{2\pi RC}
$$

$$
|H(f)| = \frac{1}{\sqrt{1 + (f/f_{3dB})^2}}, \qquad \angle H(f) = -\tan^{-1}(f/f_{3dB}), \qquad
h(t) = \frac{1}{RC}e^{-t/RC}u(t)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $R$ | 電阻 | Ω |
| $C$ | 電容 | F |
| $f_{3dB}$ | 3 dB 截止頻率（功率剩一半） | Hz |

### 2.7.1 無失真傳輸、群延遲與相位延遲

$$
H_{ideal}(f) = \begin{cases} H_o e^{-j2\pi f t_o}, & f_1 \le f \le f_2 \\ 0, & \text{otherwise} \end{cases}
\;\Rightarrow\; y(t) = H_o\,x(t - t_o)
$$

$$
\tau_g(f) \triangleq -\frac{1}{2\pi}\frac{d\angle H(f)}{df}, \qquad
\tau_p(f) \triangleq -\frac{1}{2\pi f}\angle H(f)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $H_o$ | 固定增益 | — |
| $t_o$ | 固定延遲 | s |
| $\tau_g(f)$ | 群延遲（group delay） | s |
| $\tau_p(f)$ | 相位延遲（phase delay） | s |

> 線性相位 $\angle H = -2\pi f t_o$ 時，$\tau_g = \tau_p = t_o$ 為常數，所有頻率成分延遲相同，所以不會失真。

### 2.8 理想濾波器

| 類型 | 頻率響應 | 脈衝響應 |
|---|---|---|
| 低通 LP | $A_o\Pi(f/2W)e^{-j2\pi f t_o}$ | $2WA_o\operatorname{sinc}[2W(t - t_o)]$ |
| 高通 HP | $A_o[1 - \Pi(f/2W)]e^{-j2\pi f t_o}$ | $A_o\{\delta(t - t_o) - 2W\operatorname{sinc}[2W(t - t_o)]\}$ |
| 帶通 BP | $H_l(f - f_c) + H_l(f + f_c)$，$H_l$ 為上列 LP | $4WA_o\operatorname{sinc}[2W(t - t_o)]\cos(2\pi f_c t)$ |
| 帶拒 BS | 通帶 $\lvert f\rvert < f_c - W$ 與 $\lvert f\rvert > f_c + W$ | — |

| 符號 | 意義 | 單位 |
|---|---|---|
| $W$ | 低通頻寬；帶通／帶拒為半頻寬 | Hz |
| $f_c$ | 帶通／帶拒中心頻率 | Hz |
| $A_o$ | 通帶增益 | — |

> 理想（磚牆，brick wall）濾波器的脈衝響應從 $-\infty$ 延伸到 $\infty$，**不是因果的，無法實現**。

### 2.8.2 可實現的濾波器規格

$$
1 - \delta_p \le |H_a(f)| \le 1 + \delta_p\ (0 \le f \le f_p), \qquad |H_a(f)| \le \delta_s\ (f_s \le |f|)
$$

$$
R_p = -20\log(1 - \delta_p), \qquad R_s = -20\log(\delta_s)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $f_p, f_s$ | 通帶邊緣頻率、止帶邊緣頻率 | Hz |
| $\delta_p, \delta_s$ | 通帶、止帶的峰值漣波（peak ripple） | — |
| $R_p$ | 通帶峰值漣波 | dB |
| $R_s$ | 止帶最小衰減 | dB |

**三種近似法**：皆寫成 $|H_a(f)|^2 = \dfrac{1}{1 + \varepsilon^2 C^2(f)}$，$C(f)$ 為特性函數（characteristic function）。

$$
\text{Butterworth：}\ |H_a(f)|^2 = \frac{1}{1 + (f/f_c)^{2N}}, \qquad
\text{Chebyshev：}\ C(f) = T_N(f/f_p), \qquad
\text{Elliptic：}\ |H_a(f)|^2 = \frac{1}{1 + \varepsilon^2 R_N^2(f/f_p)}
$$

$$
T_n(x) = 2xT_{n-1}(x) - T_{n-2}(x),\ n \ge 2; \qquad T_1(x) = x,\ T_0(x) = 0
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $N$ | 濾波器階數 | — |
| $f_c$ | Butterworth 的 3 dB 截止頻率 | Hz |
| $\varepsilon$ | 決定通帶漣波（Butterworth 取 1） | — |
| $T_N(x)$ | N 階 Chebyshev 多項式 | — |
| $R_N(x)$ | N 階橢圓多項式 | — |

<!-- TODO: 待確認：講義式 (2.162) 印為 T0(x) = 0，但一般 Chebyshev 多項式定義為 T0(x) = 1，請對照課本或老師說明。 -->

| 類型 | 通帶 | 止帶 | 同階數的滾降速度 |
|---|---|---|---|
| Butterworth | 最平坦（maximally flat），無漣波 | 單調遞減 | 最慢 |
| Chebyshev | 等漣波（equiripple） | 單調遞減 | 較快 |
| Elliptic（Cauer） | 有漣波 | 有漣波，最後到達止帶底限（stopband floor） | 最快，但相位非線性 |

### 2.9 功率頻譜密度

$$
G_x(f) \triangleq \lim_{T\to\infty}\frac{|X_T(f)|^2}{T}, \qquad P_x = \int_{-\infty}^{\infty} G_x(f)\,df
$$

$$
\text{週期訊號：}\ G_x(f) = \sum_{n=-\infty}^{\infty} |C_n|^2\,\delta(f - n f_o)
$$

$$
\mathcal{R}_x(\tau) = \lim_{T\to\infty}\frac{1}{T}\int_{-T/2}^{T/2} x(t)x(t - \tau)\,dt, \qquad
P_x = \mathcal{R}_x(0), \qquad G_x(f) \longleftrightarrow \mathcal{R}_x(\tau)
$$

$$
G_y(f) = |H(f)|^2\,G_x(f)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $X_T(f)$ | $x(t)$ 截斷在 $\lvert t\rvert \le T/2$ 後的 FT | V/Hz |
| $G_x(f)$ | 功率頻譜密度（power spectral density, PSD） | W/Hz |
| $\mathcal{R}_x(\tau)$ | 時間平均自相關函數（time-average autocorrelation） | W |

> PSD 是自相關函數的傅立葉轉換；LTI 系統輸出的 PSD 只和 $|H(f)|$ 有關，與相位無關。

### 2.10 傳輸媒介的頻率響應

$$
\gamma(f) = \alpha(f) + j\beta(f) = \sqrt{(R + j2\pi fL)(G + j2\pi fC)}, \qquad
Z_o = \sqrt{\frac{R + j2\pi fL}{G + j2\pi fC}}
$$

$$
H_{TWP}(f, \ell) = e^{-\gamma(f)\ell}, \qquad |H_{TWP}(f, \ell)| = e^{-\alpha(f)\ell}
$$

$$
\text{Insertion Loss} = -20\log_{10}|H_{TWP}| = 8.686\,\alpha(f)\,\ell\ \text{dB}, \qquad
\alpha(f) = c_1\sqrt{f} + c_2 f
$$

$$
\text{TWP（}f \ge 300\ \text{kHz）：}\ \text{Insertion Loss} \approx 8.686\,c_1\sqrt{f}\,\ell\ \text{dB}
$$

$$
\text{同軸電纜：}\ \text{Insertion Loss} = (k_1\sqrt{f} + k_2 f)\,\ell\ \text{dB} \;\xrightarrow{f \ge 300\ \text{kHz}}\; k_1\sqrt{f}\,\ell\ \text{dB}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $R, L, C, G$ | 每單位長度的串聯電阻、串聯電感、並聯電容、並聯電導 | Ω/m、H/m、F/m、S/m |
| $\gamma$ | 傳播常數（propagation constant） | 1/m |
| $\alpha$ | 衰減係數（無損線為 0；例 2.38 以 km⁻¹ 表示） | 1/m |
| $\beta$ | 相移係數，$= 2\pi/\lambda$ | rad/m |
| $Z_o$ | 特性阻抗（characteristic impedance） | Ω |
| $\ell$ | 線長（TWP 式 (2.193) 用 mile；同軸式用 kft） | mile／kft |
| $f$ | 頻率（TWP 用 Hz；同軸用 MHz） | Hz／MHz |
| $c_1, c_2$ | TWP 參數（Table 2.4） | — |
| $k_1, k_2$ | 同軸參數，$k_1$ 代表導體損耗、$k_2$ 代表介質損耗（Table 2.5） | — |

| TWP 種類 | $c_1$ | 同軸種類 | $k_1$ | $k_2$ |
|---|---|---|---|---|
| Cat 3 | $4.31\times10^{-3}$ | 500-F | 0.69 | $3.7\times10^{-3}$ |
| Cat 5 | $3.83\times10^{-3}$ | 625-F | 0.6058 | $1.6\times10^{-3}$ |
| AWG 24 | $3.8\times10^{-3}$ | RG-6 | 2.1144 | $2.1\times10^{-3}$ |
| AWG 26 | $4.8\times10^{-3}$ | RG-59 | 2.7155 | $1.5\times10^{-3}$ |

> 無損線條件：$R = G = 0$。高頻時 $R(f) \approx c_o\sqrt{2\pi f}$，這是**集膚效應（skin effect）**：高頻電流集中在導體表面數十微米內。

### 2.11 離散時間訊號的傅立葉轉換

$$
\text{DTFT：}\ X(e^{j\hat\omega}) = \sum_{n=-\infty}^{\infty} x[n]\,e^{-j\hat\omega n}, \qquad \hat\omega = 2\pi f T_s
$$

$$
\text{DFT：}\ X[k] = \sum_{n=0}^{N-1} x[n]\,e^{-j2\pi kn/N}, \qquad
\text{IDFT：}\ x[n] = \frac{1}{N}\sum_{k=0}^{N-1} X[k]\,e^{+j2\pi kn/N}
$$

$$
X[k] = X(e^{j\hat\omega})\big|_{\hat\omega = 2\pi k/N}, \qquad
\Delta f = \frac{f_s}{N} = \frac{1}{NT_s} = \frac{1}{T}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\hat\omega$ | 正規化角頻率 | rad/sample |
| $T_s, f_s$ | 取樣間隔、取樣率（$f_s = 1/T_s$） | s、Hz |
| $N$ | DFT 點數 | — |
| $\Delta f$ | DFT 頻率解析度 | Hz |
| $T$ | 訊號記錄的總長度 | s |

> DTFT 以 $2\pi$ 為週期，$\hat\omega = \pm\pi$ 對應 $f_s/2$；DFT 只適用有限長度序列、以 $N$ 為週期。FFT 要求 $N$ 是 2 的次方，通常靠補零（zero-padding）達成；補零能讓 DFT 更接近 DTFT。

## 解題技巧

### 題型一：脈衝函數運算（例 2.2）

1. 先看 $\delta$ 的引數有沒有係數，有的話用性質 2 提出 $\dfrac{1}{|\alpha|}$：$\delta(4t - 1) = \tfrac{1}{4}\delta(t - \tfrac14)$。
2. 沒有積分 → 用性質 1，把 $t$ 換成脈衝所在位置，結果仍帶 $\delta$。
3. 有積分 → 用性質 3（取樣性質），結果是一個數字。

> 對答案用：(a) $\sin(3500\pi t)\delta(t) = 0$；(b) $\cos(\pi t)\delta(4t - 1) = \dfrac{1}{4\sqrt2}\delta(t - \tfrac14)$；(c) $\int[t^2 - \cos(\pi t)]\delta(t - 2)dt = 3$；(d) $\int[e^{-t} + \cos(10\pi t)]\delta(2t - 4)dt = \tfrac12(e^{-2} + 1) \approx 0.567$。

### 題型二：能量／功率計算（例 2.3～2.6）

1. 先判斷訊號是有限長度（→ 能量訊號）還是週期／無限長（→ 功率訊號）。
2. 能量：$\int|x|^2dt$；週期訊號功率：一個週期內 $\frac{1}{T_o}\int|x_p|^2dt$。
3. 遇到 $\cos^2$ 用 $2\cos^2\theta = 1 + \cos 2\theta$，二倍頻項在整數週期內積分為 0。

> 對答案用：例 2.3 $A\Pi(t/T_b)$ 的 $E = A^2T_b$；例 2.4 載波脈波 $E = A^2T_b/2$（假設 $f_o \gg 1/T_b$，二倍頻項積分為 0）；例 2.5 弦波能量 → ∞，不是能量訊號；例 2.6 弦波功率 $P = A^2/2$。

### 題型三：dB／dBm 鏈路計算（例 2.7、2.39）

1. 輸入功率換成 dBm：$10\log_{10}(P/1\text{ mW})$。
2. 沿途所有增益（損耗為負）直接相加。
3. 輸出 dBm = 輸入 dBm + 總增益；要換回 mW 用 $10^{\text{dBm}/10}$。

> 例 2.7：5 mW = 7 dBm，總增益 $-11 - 6 - 3 = -20$ dB → $-13$ dBm ≈ 50 μW。
> 例 2.39：Cat 5 在 100 MHz 的損耗 $= 8.686 \times 3.83\times10^{-3} \times \sqrt{10^8} \approx 332.67$ dB/mile，100 ft 約 6.65 dB；250 mW = 24 dBm → 17.35 dBm ≈ 54 mW。

### 題型四：判斷系統性質（例 2.12～2.17、2.21～2.23）

1. **線性**：代入 $\alpha x_1 + \beta x_2$，看輸出是否等於 $\alpha y_1 + \beta y_2$（平方律 $y = x^2$ 不是線性）。
2. **非時變**：輸入改成 $x(t - t_o)$，看輸出是否等於 $y(t - t_o)$（AM 調變器 $y = x(t)\cos(2\pi f_c t)$ 是**時變**）。
3. **因果、穩定**：LTI 系統直接看 $h(t)$。積分器 $h(t) = u(t)$ 是因果，但 $\int|u(t)|dt = \infty$ → **不穩定**。

### 題型五：求傅立葉級數與功率頻寬（例 2.24～2.27）

1. 找出週期 $T_o$ 與 $f_o = 1/T_o$。
2. 判斷奇偶性：偶函數只算 $A_n$，奇函數只算 $B_n$。
3. 積分求係數；矩形脈波串直接套 $C_n = \frac{\tau}{T_o}\operatorname{sinc}(nf_o\tau)$。
4. 求 99% 功率頻寬：用巴賽瓦 $P = C_0^2 + 2\sum|C_n|^2$ 逐項累加，直到達總功率 99%。

> 例 2.25（01111110 重複、8 kbps）：$T_o = 1$ ms、$f_o = 1000$ Hz，$A_0 = 0.5$，$A_n = \dfrac{4}{\pi n}\sin(3\pi n/4)$。
> 例 2.26：矩形脈波串的 sinc 係數永遠不為零 → **絕對頻寬無限大**。
> 例 2.27（$T_o = 1$ μs、$\tau/T_o = 0.5$）：總功率 0.5 W，要累加到 $n = 21$ 才達 99% → 99% 功率頻寬約 21 MHz。

### 題型六：用性質求 FT（例 2.28～2.31）

1. 先把訊號拆成表中已知的基本訊號（矩形、三角、脈衝……）的平移與組合。
2. 平移 → 乘 $e^{-j2\pi f t_o}$；乘 $e^{j2\pi f_c t}$ → 頻譜平移；有斜坡邊緣時可先微分變成矩形與脈衝，再除以 $j2\pi f$。
3. sinc 的 FT 用**對偶性**：$\Pi(t/\tau) \leftrightarrow \tau\operatorname{sinc}(f\tau)$ ⇒ $2W\operatorname{sinc}(2Wt) \leftrightarrow \Pi(f/2W)$（例 2.28）。
4. 週期訊號：先求 $C_n$，再寫成 $\sum C_n\delta(f - nf_o)$（例 2.30、2.31）。

### 題型七：弦波通過 LTI 系統（例 2.32、2.38）

1. 把每個弦波成分的頻率 $f$ 代入 $H(f)$，算出 $|H|$ 與 $\angle H$。
2. 輸出 = 原振幅 × $|H|$，原相位 + $\angle H$；多個成分各自處理後相加（重疊原理）。

> 例 2.32：$H(f) = \dfrac{2}{1 + j0.0025\pi f}$，$x = \sin(800\pi t) + 2\sin(2000\pi t + \pi/4)$ →
> $y = 0.6066\sin(800\pi t - 72.34^\circ) + 0.5052\sin(2000\pi t - 82.75^\circ + \pi/4)$。
> 例 2.38（24-AWG、6 km、3.4 kHz）：$\gamma = 0.2979 + j0.3227$ km⁻¹，衰減約 2.6 dB/km，$H = 0.1674\angle{-110.9^\circ}$，$y = 0.837\cos(6800\pi t - 110.9^\circ)$。

### 題型八：PSD 計算（例 2.36、2.37）

1. 先求時間平均自相關 $\mathcal{R}_x(\tau)$，再做 FT 得 $G_x(f)$；或週期訊號直接用 $\sum|C_n|^2\delta(f - nf_o)$。
2. 通過濾波器：$G_y = |H|^2G_x$。

> 例 2.36：$A\cos(2\pi f_o t + \phi)$ 的 $\mathcal{R}_x(\tau) = \frac{A^2}{2}\cos(2\pi f_o\tau)$，$G_x(f) = \frac{A^2}{4}[\delta(f - f_o) + \delta(f + f_o)]$，$P_x = A^2/2$（與相位 $\phi$ 無關）。
> 例 2.37：$\tau/T_o = 0.25$ 的脈波串經 4 階 Butterworth（$f_c = 4$ MHz）後，$G_y(f) = \frac{1}{16}\sum|H(nf_o)|^2|\operatorname{sinc}(n/4)|^2\delta(f - nf_o)$。

### 題型九：用 MATLAB 設計類比濾波器（例 2.34、2.35）

1. 邊緣頻率換成 rad/s：$W_p = 2\pi f_p$、$W_s = 2\pi f_s$。
2. 先估階數，再設計係數，最後用 `freqs` 畫頻率響應。
3. 高通加 `'high'`、帶拒加 `'stop'`；帶通／帶拒的 `Wp`、`Ws` 是兩元素向量，設計出來的階數是 $2N$。

```matlab
% 例 2.34：橢圓低通，fp = 800 Hz, fs = 1000 Hz, Rp = 1 dB, Rs = 40 dB
Wp = 2*pi*800;  Ws = 2*pi*1000;
[N, Wn]    = ellipord(Wp, Ws, 1, 40, 's');   % 得 N = 5
[num, den] = ellip(N, 1, 40, Wn, 's');
w = 0:20:6*800*pi;
h = freqs(num, den, w);
plot(w/(2*pi), 20*log10(abs(h)));
```

> 對應函式：`buttord`／`butter`、`cheb1ord`／`cheby1`、`ellipord`／`ellip`。例 2.35 橢圓帶通（通帶 4000–7000 Hz、止帶 3000/8000 Hz）設計結果為 10 階。

### 題型十：DFT／FFT 頻率解析度（例 2.40）

1. 解析度 $\Delta f = f_s/N = 1/T$，由**資料總長度**決定。
2. FFT 點數不是 2 的次方時，在兩側補零。
3. 用 `fftshift` 把零頻移到中間再畫圖。

## 常見陷阱

- $\operatorname{sinc}(t)$ 在本課本定義為 $\sin(\pi t)/(\pi t)$（含 $\pi$），過零點在整數 $t$，不是 $\sin t / t$。
- $\delta(at)$ 要乘 $\dfrac{1}{|a|}$，忘記會讓積分結果差一個倍數（例 2.2 (d) 的 $\tfrac12$）。
- 時間縮放：$a > 1$ 是**壓縮**、頻譜反而**展寬**；時間平移只改相位不改振幅頻譜，頻率越高相移越大。
- dB 與 dBm 不同：dBm 是絕對功率（相對 1 mW），dB 是增益／損耗的比值；鏈路計算是「輸入 dBm + 各元件 dB 增益」。
- 例 2.39 把 100 ft 換成 mile 時，講義用的是 $100/5000$。
- 對實數訊號，單邊三角 FS 的係數是 $2|C_n|$，雙邊指數 FS 才是 $|C_n|$；用巴賽瓦算功率時，記得 $n \ne 0$ 的項要乘 2。
- 理想濾波器不因果、不可實現；橢圓濾波器滾降最快，但代價是兩邊都有漣波且相位非線性。
- 雙絞線公式 (2.193) 的 $f$ 用 **Hz**、$\ell$ 用 **mile**；同軸公式 (2.195) 的 $f$ 用 **MHz**、$\ell$ 用 **kft**，單位不能混用。
