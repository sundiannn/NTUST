# Ch.5 角度調變

> 依據：老師講義 Chapter 5 Angle Modulation（5.1–5.8）｜更新：2026-11-15

<!-- TODO: 待確認：講義 PDF 為掃描檔，本次只能讀到 OCR 文字；5.5.4 二階 PLL 的雜訊等效頻寬 B_N 閉式解，以及表 5.4（各種迴路濾波器參數總表）在文字擷取中缺漏或無法辨識，尚未整理。 -->

## 重點摘要

- 角度調變把訊息放在載波的**瞬時相位**（PM）或**瞬時頻率**（FM），振幅固定，所以平均功率恆為 $A_c^2/2$，和訊息無關。
- FM 與 PM 本質相同：訊息先**積分**再做 PM 就是 FM；先**微分**再做 FM 就是 PM，單看波形無法分辨。
- 單音 FM 的頻譜是 $f_c \pm nf_m$ 上無限多根譜線，振幅由貝索函數 $J_n(\beta)$ 決定；實用頻寬用 **Carson 法則** $B_T = 2(\Delta f_{max} + B)$。
- 窄頻 FM（$\beta \ll 1$）頻寬 $2f_m$，形式像傳統 AM，差別在**下旁波帶反相**。
- PLL 是負回授系統，鎖定後輸出頻率追上輸入；一階 PLL 對頻率步階有穩態相位誤差 $\Delta\omega/K$，**主動 PI 迴路**的二階 PLL 則可降到 0。

## 公式整理

### 5.1 瞬時相位與瞬時頻率

$$
x(t) = A_c\cos[2\pi f_c t + \theta(t)] = A_c\cos\phi_i(t), \qquad
f_i(t) = \frac{1}{2\pi}\frac{d\phi_i(t)}{dt}, \qquad
\phi_i(t) = 2\pi\int_{-\infty}^{t} f_i(\alpha)\,d\alpha
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\theta(t)$ | 超額相位（excess phase） | rad |
| $\phi_i(t)$ | 瞬時相位（instantaneous phase） | rad |
| $f_i(t)$ | 瞬時頻率（instantaneous frequency） | Hz |

### 5.1 PM 與 FM 對照（表 5.1）

| | PM | FM |
|---|---|---|
| 靈敏度 | $k_p$（rad/V） | $k_f$（Hz/V） |
| 最大偏移 | $\Delta\phi_{max} = k_p\max\lvert s(t)\rvert$（rad） | $\Delta f_{max} = k_f\max\lvert s(t)\rvert$（Hz） |
| 超額相位 $\theta(t)$ | $\Delta\phi_{max}\,s_n(t)$ | $2\pi\Delta f_{max}\displaystyle\int_{-\infty}^{t}s_n(\alpha)\,d\alpha$ |
| 瞬時頻率 $f_i(t)$ | $f_c + \dfrac{\Delta\phi_{max}}{2\pi}\dot{s}_n(t)$ | $f_c + \Delta f_{max}\,s_n(t)$ |

$$
s_n(t) = \frac{s(t)}{\max|s(t)|}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $s_n(t)$ | 正規化訊息（最大絕對值為 1） | — |
| $\Delta\phi_{max}$ | 最大相位偏移（maximum phase deviation） | rad |
| $\Delta f_{max}$ | 最大頻率偏移（maximum frequency deviation） | Hz |

### 5.1.1 單音調變

$s(t) = A_m\cos(2\pi f_m t)$ 時：

$$
\Delta f_{max} = k_f A_m, \qquad \beta = \frac{\Delta f_{max}}{f_m}, \qquad
x_{FM}(t) = A_c\cos[2\pi f_c t + \beta\sin(2\pi f_m t)]
$$

$$
\Delta\phi_{max} = k_p A_m, \qquad x_{PM}(t) = A_c\cos[2\pi f_c t + k_p A_m\cos(2\pi f_m t)]
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $f_m$ | 訊息（調變）頻率 | Hz |
| $\beta$ | FM 調變指數（modulation index），也就是單音 FM 的最大相位偏移 | rad |

> $\Delta f_{max}$ 只和訊息**振幅**成正比，與訊息頻率無關。

### 5.1.2 功率

$$
P = \frac{A_c^2}{2}
$$

### 5.2 頻譜：貝索函數展開

$$
x_{FM}(t) = A_c\sum_{n=-\infty}^{\infty} J_n(\beta)\cos[2\pi(f_c + nf_m)t]
$$

$$
J_{-n}(\beta) = J_n(\beta)\ (n\text{ 偶}), \qquad J_{-n}(\beta) = -J_n(\beta)\ (n\text{ 奇}), \qquad \sum_{n=-\infty}^{\infty}J_n^2(\beta) = 1
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $J_n(\beta)$ | 第一類 $n$ 階貝索函數（Bessel function） | — |

> $\beta = 0$ 時只有載波；$\beta$ 變大時能量從載波分到旁波帶（總功率不變），載波振幅 $J_0(\beta)$ 甚至可能變成 0 或負值。

**98% 功率頻寬：**

$$
P_{in}(M) = J_0^2(\beta) + 2\sum_{n=1}^{M}J_n^2(\beta) \ge 0.98, \qquad
B_T = 2Mf_m, \quad M = \beta + 1
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $M$ | 有效旁波帶對數 | — |
| $P_{in}(M)$ | 載波＋$M$ 對旁波帶的功率佔總功率比例 | — |

**角度調變頻寬總整理（Carson 法則）：**

$$
B_T = \begin{cases} 2(\Delta f_{max} + f_m) = 2(\beta + 1)f_m, & \text{FM 單音} \\ 2(\Delta\phi_{max} + 1)f_m, & \text{PM 單音} \end{cases}
\qquad
B_T = \begin{cases} 2(\Delta f_{max} + B) = 2(D + 1)B, & \text{FM 任意訊息} \\ 2(\Delta\phi_{max} + 1)B, & \text{PM 任意訊息} \end{cases}
$$

$$
D = \frac{\Delta f_{max}}{B}, \qquad B_T \approx 2\Delta f_{max}\ (\text{寬頻 FM，}D \gg 1)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $B$ | 訊息頻寬 | Hz |
| $D$ | 偏移比（deviation ratio），對任意訊息扮演 $\beta$ 的角色 | — |
| $B_T$ | 傳輸頻寬 | Hz |

### 5.3 窄頻 FM（NBFM，$\beta \ll 1$）

$$
x_{FM}(t) \approx A_c\cos(2\pi f_c t) + \frac{\beta A_c}{2}\cos[2\pi(f_c + f_m)t] - \frac{\beta A_c}{2}\cos[2\pi(f_c - f_m)t]
$$

> 和單音傳統 AM 相比，只差在**下旁波帶的正負號相反**。相量圖上 NBFM 的旁波帶合成相量與載波**垂直**（主要改變相位），AM 則與載波**平行**（改變振幅）。

### 5.4 解調

**帶通限幅器**（bandpass limiter）：硬限幅後再帶通濾波，輸出振幅固定

$$
x(t) = \frac{4}{\pi}\cos[2\pi f_c t + \theta(t)]
$$

**頻率鑑別器**（frequency discriminator，微分器＋包絡檢波）：

$$
H_{dif}(f) = K_{FD}\,j2\pi f, \qquad y_D(t) = K_{FD}\frac{d\theta(t)}{dt} = K_{FD}\,2\pi\Delta f_{max}\,s_n(t)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $K_{FD}$ | 鑑頻器增益常數 | V/Hz |

> PM 解調＝頻率鑑別器後面再接一個**積分器**，輸出 $y_D(t) = K_{PD}\,\Delta\phi_{max}\,s_n(t)$。
> 實際上用**斜率檢波器**近似微分器；**平衡斜率檢波器**用兩個調諧電路（共振頻率約在 $f_c$ 上下各 $3\Delta f_{max}$），線性範圍較寬且 $f_c$ 處輸出為 0。

**正交檢波器**（quadrature detector）：相移網路在 $f_c$ 處相移 $-90^\circ$，且相移與頻率偏移成正比

$$
\Delta\psi = -\frac{\pi}{2} + K_1(f_i - f_c), \qquad
y(t) \approx \frac{K_m K_0 A_c^2}{2}K_1\,\Delta f_{max}\,s_n(t)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $K_1$ | 相移網路在 $f_c$ 附近的斜率 | rad/Hz |
| $K_0$ | 相移網路常數 | — |
| $K_m$ | 混頻器增益常數 | — |

> FM 收音機 IF 為 10.7 MHz。

### 5.5 鎖相迴路（PLL）

$$
v_e(t) = K_{PD}\sin\theta_e(t), \qquad K_{PD} = \frac{1}{2}ABK_m, \qquad \theta_e = \theta_{in} - \theta_{out}
$$

$$
\omega_{out}(t) = \omega_0 + K_{VCO}\,v_{cont}(t), \qquad \theta_{out}(t) = K_{VCO}\int_{-\infty}^{t}v_{cont}(\alpha)\,d\alpha
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $K_{PD}$ | 相位檢測器（PD）增益 | V/rad |
| $K_{VCO}$ | VCO 增益 | rad/(s·V) |
| $\omega_0$ | VCO 自由振盪頻率（free-running frequency） | rad/s |
| $\theta_e$ | 相位誤差 | rad |

> 混頻器型 PD 鎖定時輸入與 VCO **相差 90°（正交鎖定）**，此時視為相位誤差 0。

**線性模型**（$\sin\theta_e \approx \theta_e$）：

$$
G(s) = \frac{KF(s)}{s}, \quad K = K_{VCO}K_{PD}, \qquad
H(s) = \frac{\Theta_{out}(s)}{\Theta_{in}(s)} = \frac{KF(s)}{s + KF(s)}, \qquad
H_e(s) = 1 - H(s) = \frac{s}{s + KF(s)}
$$

$$
\theta_e(\infty) = \lim_{s\to 0}\frac{s^2\,\Theta_{in}(s)}{s + KF(s)}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $K$ | 迴路增益（loop gain） | 1/s |
| $F(s)$ | 迴路濾波器 | — |
| $H(s)$ | 閉迴路轉移函數 | — |
| $H_e(s)$ | 相位誤差轉移函數 | — |

> 迴路濾波器有 $m$ 個極點 → $(m + 1)$ 階 PLL。

**一階 PLL（$F(s) = 1$）：**

$$
H(s) = \frac{K}{s + K}, \qquad \text{相位步階：}\theta_e(\infty) = 0, \qquad \text{頻率步階 }\Delta\omega\text{：}\theta_e(\infty) = \frac{\Delta\omega}{K}
$$

> 一階 PLL 的 3-dB 頻寬就是 $K$，只有 $K$ 一個參數可調：要追得好（$K$ 大）頻寬就大、雜訊就多，兩者無法兼顧。

**二階 PLL（主動 PI 濾波器 $F(s) = \dfrac{1 + s\tau_2}{s\tau_1}$）：**

$$
H(s) = \frac{2\zeta\omega_n s + \omega_n^2}{s^2 + 2\zeta\omega_n s + \omega_n^2}, \qquad
\omega_n = \sqrt{\frac{K}{\tau_1}}, \qquad \zeta = \frac{\tau_2}{2}\sqrt{\frac{K}{\tau_1}}
$$

$$
\omega_{3dB} = \omega_n\left[1 + 2\zeta^2 + \sqrt{(1 + 2\zeta^2)^2 + 1}\right]^{1/2}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\omega_n$ | 自然頻率（natural frequency） | rad/s |
| $\zeta$ | 阻尼係數（damping factor） | — |
| $\tau_1, \tau_2$ | PI 濾波器時間常數 | s |

> $\zeta = 0.707$（二階 Butterworth）時 $\omega_{3dB} \approx 2.06\,\omega_n$，是平坦度與安定時間的折衷。$\zeta < 1$ 有振盪、越小過衝越大；相位步階的誤差以時間常數 $1/(\zeta\omega_n)$ 衰減。

**穩態相位誤差（表 5.5）：**

| 迴路 | 相位步階 | 頻率步階 $\Delta\omega$ |
|---|---|---|
| 一階 | 0 | $\Delta\omega/K$ |
| 二階（一般，$F(0)$ 有限） | 0 | $\Delta\omega/[KF(0)]$ |
| 二階主動 PI | 0 | 0 |

**擷取範圍：** 保持範圍（hold-in range）$\ge$ 拉入範圍（pull-in range）$\ge$ 鎖入範圍（lock-in range）。一階 PLL 的保持範圍 $\Delta\omega_H = 2K_{VCO}K_{PD}$。

### 5.6 PLL 當 FM 解調器（一階）

$$
V_{cont}(j\omega) = \frac{2\pi k_f}{K_{VCO}}\cdot\frac{K_{VCO}K_{PD}}{j\omega + K_{VCO}K_{PD}}S(j\omega)
\;\xrightarrow{K_{VCO}K_{PD} \gg 2\pi B}\;
v_{cont}(t) \approx \frac{2\pi k_f}{K_{VCO}}s(t)
$$

### 5.7 FM 廣播與立體聲

$$
s(t) = [L(t) + R(t)] + [L(t) - R(t)]\cos(2\pi f_{sc}t) + K_p\cos(2\pi f_p t), \qquad f_p = 19\text{ kHz},\ f_{sc} = 38\text{ kHz}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $L, R$ | 左、右聲道 | V |
| $f_p$ | 導頻（pilot tone）頻率 | Hz |
| $f_{sc}$ | 次載波（$= 2f_p$） | Hz |
| $K_p$ | 導頻位準 | V |

> $L + R$ 在 0～15 kHz（與單聲道相容），$L - R$ 以 DSB-SC 放在 23～53 kHz；接收端把 19 kHz 導頻倍頻成 38 kHz 做同調解調。

### 5.8 類比電視

$$
N_v = 0.7(N - N_{vr}), \qquad N_h = A\,N_v, \qquad f_{max} = \frac{N_h}{2(t_h - t_{hb})}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $N_v$ | 有效垂直解析度（0.7 為 Kell factor） | 線 |
| $N$ | 每框總掃描線數 | 線 |
| $N_{vr}$ | 垂直回掃損失的線數 | 線 |
| $A$ | 長寬比（aspect ratio） | — |
| $t_h$ | 一條水平掃描線總時間 | s |
| $t_{hb}$ | 水平遮沒（blanking）時間 | s |

- NTSC：525 線/框、30 框/秒，交錯掃描（interlacing）成 60 場/秒；PAL、SECAM：625 線、25 框/秒。
- NTSC 代入：$N_v = 0.7(525 - 2 \times 20) \approx 339$，$N_h = 339 \times 4/3 \approx 452$，$t_h = 63.5\ \mu$s、$t_{hb} = 10.9\ \mu$s → $f_{max} \approx 4.29$ MHz。
- 彩色 YIQ：$Y = 0.3R + 0.59G + 0.11B$（亮度，黑白電視只看 $Y$）；$I = 0.6R - 0.28G - 0.32B$；$Q = 0.21R - 0.52G + 0.31B$。色度向量 $I - jQ$ 的**大小代表飽和度**、**相位代表色調**；遮沒脈衝後沿的 8 週期**色同步**（color burst）用來同步接收端的色副載波。

## 解題技巧

### 題型一：由式子讀出 FM／PM 參數（例 5.2、5.3、5.4）

1. 把 $\cos[\ ]$ 括號裡扣掉 $2\pi f_c t$，剩下的就是 $\theta(t)$。
2. $\Delta\phi_{max} = \max|\theta(t)|$；多個弦波時取各項振幅**同相相加**的最大值。
3. $f_i(t) = f_c + \frac{1}{2\pi}\dot{\theta}(t)$，$\Delta f_{max} = \max|f_i - f_c|$。
4. 視為 FM：$s_n(t) \propto \dot{\theta}(t)$；視為 PM：$s_n(t) \propto \theta(t)$。
5. 頻寬：$D = \Delta f_{max}/B$（$B$ 取訊息中**最高**頻率），$B_T = 2(D + 1)B$；功率 $A_c^2/2$。

> 例 5.4 對答案用：$\theta(t) = 5\sin(10^4\pi t) + 3\sin(2 \times 10^4\pi t)$ → $\Delta f_{max} = 2.5 + 3 = 5.5 \times 10^4$ Hz、$\Delta\phi_{max} = 8$ rad、$B = 10$ kHz、$D = 5.5$、$B_T = 130$ kHz、$P = 100^2/2 = 5000$ W。
> 例 5.2：$k_f = 5$ Hz/V、$k_p = 2\pi$ rad/V、$f_c = 10$ Hz、$s = \cos 2\pi t$ → FM 的 $f_i = 10 + 5\cos 2\pi t$（5～15 Hz）；PM 的 $f_i = 10 - 2\pi\sin 2\pi t$。

### 題型二：Carson 法則與 FM 廣播（例 5.5）

1. $D = \Delta f_{max}/B = 75/15 = 5$。
2. $B_T = 2(D + 1)B = 180$ kHz，所以電台間隔 200 kHz；88～108 MHz 最多 100 台。
3. 電視伴音：$\Delta f = 25$ kHz、$B = 10$ kHz → $B_T = 70$ kHz。

### 題型三：查貝索函數表求有效頻寬

1. 由 $\beta$ 查表 5.2，從 $n = 0$ 開始累加 $J_0^2 + 2\sum J_n^2$，直到 ≥ 0.98。
2. 例：$\beta = 2$ 取 $M = 3$，$P_{in}(3) = 0.2239^2 + 2(0.5767^2 + 0.3528^2 + 0.1289^2) \approx 0.99$。
3. $B_T = 2Mf_m$，結果和 $2(\beta + 1)f_m$ 一致。

### 題型四：PLL 暫態與穩態（例 5.6、5.7）

1. 寫出 $\Theta_{in}(s)$：相位步階 $\Delta\phi/s$；頻率步階（相位斜坡）$\Delta\omega/s^2$。
2. $\Theta_e(s) = \Theta_{in}(s)H_e(s)$，穩態用終值定理。
3. 要控制電壓時：$V_e(s) = K_{PD}\Theta_e(s)$，再做反拉氏轉換。
4. 例 5.6（一階）：$K_{VCO} = 2\pi \times 10^8$、$K_{PD} = 0.8$、輸入由 500 跳到 550 MHz → $K = 1.6\pi \times 10^8$ s⁻¹，$v_e(t) = \dfrac{K_{PD}\Delta\omega}{K}(1 - e^{-Kt}) = 0.5(1 - e^{-Kt})$ V（AI 計算，未經核對）。
5. 例 5.7（GSM 換頻 200 kHz、要穩定到 100 Hz 內、3-dB 頻寬 20 kHz、$\zeta = 0.707$）：安定時間約 0.171 ms。

### 題型五：PLL 解調 FM（例 5.8）

1. 由 $\beta$、$f_m$ 求 $k_f = \Delta f = \beta f_m$（假設訊息峰值為 1）。
2. 代入 5.6 節的 $V_{cont}(j\omega)$，在 $\omega = 2\pi f_m$ 求增益與相位。
3. 例 5.8：$\beta = 50$、$f_m = 10$ Hz、$K_{PD} = 0.5$、$K_{VCO} = 1000\pi$ → $v_{cont}(t) \approx \cos(20\pi t - 2.3^\circ)$（AI 計算，未經核對）。

### 題型六：電視解析度與頻寬

1. $N_v = 0.7(N - N_{vr})$，注意每**場**損失的線數要乘 2 才是每框。
2. $N_h = A N_v$。
3. $f_{max} = N_h / [2(t_h - t_{hb})]$（一個正弦週期顯示一黑一白兩個像素，所以除以 2）。

## 常見陷阱

- $\beta = \Delta f_{max}/f_m$ 只定義於**單音**；任意訊息用偏移比 $D = \Delta f_{max}/B$。
- FM 的 $\Delta f_{max}$ 與訊息頻率無關；PM 的 $\Delta\phi_{max}$ 也與頻率無關，但 PM 的**頻率偏移**會隨訊息頻率變大。
- PM 遇到方波訊息會有相位不連續（例 5.1 相位跳 $\pi$），FM 則是瞬時頻率在兩值間切換（例 5.1：15 Hz 與 5 Hz）。
- 角度調變的總功率固定為 $A_c^2/2$，加大 $\beta$ 只是把功率從載波搬到旁波帶。
- 所有鑑頻器前面都要有**帶通限幅器**，否則雜訊造成的振幅變化會被當成訊息。
- 一階 PLL 無法同時做到窄頻寬（抗雜訊）與小追蹤誤差；要對頻率步階零誤差必須用**主動 PI** 迴路濾波器。
- PLL 的 $\omega_n$ 大 → 安定快，但迴路頻寬大、雜訊多。
