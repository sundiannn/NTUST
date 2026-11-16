# Ch.7 類比通訊系統的雜訊性能

> 依據：老師講義 Chapter 7 Noise Performance of Analog Communication Systems（7.1–7.6）｜更新：2026-11-17

## 重點摘要

- 兩個衡量指標：**載波雜訊比（carrier-to-noise ratio, CNR）**是解調**前**（帶通波形）量測，反映通道或單一裝置的劣化；**訊號雜訊比（signal-to-noise ratio, SNR）**是基頻（解調**後**）量測，反映端到端品質。本章統一用「訊息頻寬 $B$ 內的雜訊」定義 $\text{CNR}_{IN}$ 來比較各調變。
- 同調解調時 **DSB-SC 與 SSB 的輸出 SNR 都等於 $\text{CNR}_{IN}$**（優值＝1）；傳統 AM 只有 $\eta\,\text{CNR}_{IN}$，因為 $\eta < 0.5$，至少差 3 dB。
- 角度調變以**頻寬換 SNR**：PM 優值 $(\Delta\phi_{max})^2\overline{s_n^2}$、FM 優值 $3D^2\overline{s_n^2}$，$D$ 加倍 SNR 提升 6 dB；但 FM 雜訊頻譜呈**拋物線**（$\propto f^2$），用**預強調／解強調（preemphasis/deemphasis）**可再改善。
- 包絡檢波與 FM 鑑頻器在低 CNR 時都有**臨界效應（threshold effect）**：低於臨界值後輸出 SNR 急速惡化；臨界大約發生在檢波器輸入 $\text{CNR}_{PD} \approx 10$ dB。
- 鏈路設計：系統增益 $= P_T - P_R$ 分配給傳輸損耗與鏈路餘裕；串接 $M$ 個類比中繼器，輸出 CNR 會變差 $10\log_{10}M$ dB。

## 公式整理

### 7.1 基頻系統

$$
\text{SNR}_{BB} = \frac{P_R}{P_n} = \frac{\alpha^2\overline{s^2}}{N_0 B} = \frac{P_R}{N_0 B}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\alpha$ | 通道衰減因子 | — |
| $\overline{s^2}$ | 訊息訊號平均功率 $E\{s^2(t)\}$ | W |
| $P_R$ | 接收端訊號功率 | W |
| $N_0/2$ | 加成性白高斯雜訊（AWGN）的雙邊功率頻譜密度 | W/Hz |
| $B$ | 訊息頻寬（也是接收端理想低通濾波器頻寬） | Hz |

### 7.2 CNR 的定義

$$
\text{CNR}_{IN} = \frac{\text{接收端輸入載波功率}}{\text{訊息頻寬內的輸入雜訊功率}} = \frac{P_R}{N_0 B}
$$

> 優值（figure of merit）$= \text{SNR}_{輸出} / \text{CNR}_{IN}$，用來比較不同調變方式。

### 7.2.1 DSB-SC（同調解調）

$$
P_R = \frac{\alpha^2A_c^2\overline{s^2}}{2}, \qquad \text{CNR}_{IN} = \frac{\alpha^2A_c^2\overline{s^2}}{2N_0B}
$$

$$
\text{SNR}_{DSB} = \frac{(\alpha A_c)^2\overline{s^2}}{2N_0B} = \text{CNR}_{IN}, \qquad \frac{\text{SNR}_{DSB}}{\text{CNR}_{IN}} = 1
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $A_c$ | 載波振幅 | V |
| $n_c(t),\ n_s(t)$ | 窄頻雜訊的同相、正交成分，各自變異數 $2N_0B$ | W |

> 預檢波帶通濾波器頻寬 $B_T = 2B$；解調輸出只剩訊號與**同相雜訊** $n_c(t)$，輸出雜訊功率 $2N_0B$。

### 7.2.2 SSB-AM（同調解調）

$$
P_R = \frac{\alpha^2A_c^2\overline{s^2}}{4}, \qquad \text{CNR}_{IN} = \frac{\alpha^2A_c^2\overline{s^2}}{4N_0B}
$$

$$
y_D(t) = \frac{\alpha A_c}{2}s(t) + n_c(t), \qquad \text{SNR}_{SSB} = \frac{\alpha^2A_c^2\overline{s^2}}{4N_0B} = \text{CNR}_{IN}
$$

> 預檢波濾波器最小頻寬為 $B$，輸出雜訊功率 $N_0B$；訊號與其希爾伯特轉換（Hilbert transform）功率相同。結論：**同調解調下 DSB 與 SSB 的 SNR 性能相同**。

### 7.2.3 傳統 AM

$$
P_R = \frac{\alpha^2A_c^2(1+m_a^2\overline{s_n^2})}{2}, \qquad \text{CNR}_{IN} = \frac{\alpha^2A_c^2(1+m_a^2\overline{s_n^2})}{2N_0B}
$$

$$
\text{SNR}_{AM} = \frac{\alpha^2A_c^2m_a^2\overline{s_n^2}}{2N_0B} = \eta\,\text{CNR}_{IN}, \qquad \eta = \frac{m_a^2\overline{s_n^2}}{1+m_a^2\overline{s_n^2}}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $m_a$ | 調變指數（modulation index） | — |
| $s_n(t)$ | 正規化訊息，$\lvert s_n(t)\rvert \le 1$ | — |
| $\eta$ | AM 的功率效率（power efficiency） | — |

> 直流項不含資訊，AC 耦合後被擋掉，所以輸出訊號功率只有 $\alpha^2A_c^2m_a^2\overline{s_n^2}$。$\eta$ 最大 50%（$m_a = 100\%$ 且訊息為 ±1 V 方波），實際上通常遠小於 50%。

**包絡檢波（envelope detection）**

$$
\lvert r_1(t)\rvert = \sqrt{\{\alpha A_c[1+m_as_n(t)] + n_c(t)\}^2 + n_s^2(t)}
$$

- **高 CNR**：$\lvert r_1(t)\rvert \approx \alpha A_c[1+m_as_n(t)] + n_c(t)$，去直流後與同調解調輸出相同 → 性能一樣。
- **低 CNR**：$r_1(t) \approx e_n(t) + \alpha A_c[1+m_as_n(t)]\cos\phi_n(t)$，訊號被隨機的 $\cos\phi_n(t)$ **相乘**，無法還原 → 臨界效應。

| 符號 | 意義 | 單位 |
|---|---|---|
| $e_n(t)$ | 雜訊包絡，$\sqrt{n_c^2+n_s^2}$，瑞雷分布（Rayleigh） | V |
| $\phi_n(t)$ | 雜訊相位，$\tan^{-1}(n_s/n_c)$，均勻分布 | rad |

$$
\text{CNR}_{PD} = \frac{P_R}{2N_0B} = \frac{\text{CNR}_{IN}}{2} \;\Rightarrow\; \text{CNR}_{PD} = \text{CNR}_{IN} - 3\ \text{dB}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\text{CNR}_{PD}$ | 檢波器輸入（預檢波濾波器輸出、頻寬 $2B$）的 CNR | — |

### 7.3 角度調變

$$
x(t) = \alpha A_c\cos[2\pi f_ct + \theta(t)], \qquad \text{PM: } \theta(t) = \Delta\phi_{max}s_n(t), \qquad \text{FM: } \theta(t) = 2\pi\Delta f_{max}\int_{-\infty}^{t}s_n(\lambda)\,d\lambda
$$

$$
B_T \approx 2(D+1)B, \qquad \text{CNR}_{IN} = \frac{P_R}{N_0B} = \frac{\alpha^2A_c^2}{2N_0B}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\Delta\phi_{max}$ | PM 最大相位偏移 | rad |
| $\Delta f_{max}$ | FM 最大頻率偏移 | Hz |
| $D$ | 偏移比（deviation ratio），$\Delta f_{max}/B$ | — |
| $B_T$ | 傳輸（預檢波濾波器）頻寬，卡森法則（Carson's rule） | Hz |

> 高 CNR 時雜訊造成的相位誤差 $\phi_e(t) \approx \dfrac{e_n(t)\sin[\phi_n(t)-\theta(t)]}{\alpha A_c}$，與訊號振幅成**反比**：訊號越強、雜訊越小，這是角度調變特有的「雜訊抑制」。

**PM 輸出 SNR**

$$
G_{n_{PM}}(f) = \left(\frac{K_{PD}}{\alpha A_c}\right)^2N_0,\ \lvert f\rvert \le \frac{B_T}{2}, \qquad P_n = \left(\frac{K_{PD}}{\alpha A_c}\right)^2 2N_0B
$$

$$
\text{SNR}_{PM} = (\Delta\phi_{max})^2\,\overline{s_n^2}\,\text{CNR}_{IN}, \qquad \text{優值} = (\Delta\phi_{max})^2\,\overline{s_n^2}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $K_{PD}$ | 相位檢波器增益 | V/rad |

> PM 輸出雜訊頻譜是**平的**（和 AM 一樣）。

**FM 輸出 SNR**

$$
G_{n_{FM}}(f) = \left(\frac{K_{FD}}{\alpha A_c}\right)^2 f^2N_0,\ \lvert f\rvert \le \frac{B_T}{2}, \qquad P_n = \frac{2}{3}\left(\frac{K_{FD}}{\alpha A_c}\right)^2N_0B^3
$$

$$
\text{SNR}_{FM} = 3D^2\,\overline{s_n^2}\,\text{CNR}_{IN}, \qquad \text{優值} = 3D^2\,\overline{s_n^2}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $K_{FD}$ | 頻率鑑別器（discriminator）增益 | V/Hz |

> 單音調變（$\overline{s_n^2} = 1/2$、$D = \beta$）：$\text{SNR}_{FM} = \tfrac{3}{2}\beta^2\,\text{CNR}_{IN}$（例 7.3）。

$$
\frac{\text{SNR}_{FM}}{\text{SNR}_{DSB}} = 3D^2\overline{s_n^2} \;\Rightarrow\; \text{FM 改善量} = 10\log_{10}(D^2\overline{s_n^2}) + 4.77\ \text{dB}
$$

### 7.3.2 FM 臨界效應

$$
\text{CNR}_{PD} = \frac{P_R}{N_0B_T} = \frac{(\alpha A_c)^2}{2N_0B_T} = \frac{\text{CNR}_{IN}}{2(1+D)}
$$

$$
(\text{CNR}_{IN})_{th} = (\text{CNR}_{PD})_{th}\cdot 2(D+1) \approx 20(D+1)
$$

$$
(\text{SNR}_{FM})_{th} = 30D^2(D+1)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $(\cdot)_{th}$ | 臨界點（threshold）的值 | — |

> 💡 補充說明（AI）：$30D^2(D+1)$ 是把 $\text{CNR}_{IN} = 20(D+1)$ 代入 $3D^2\overline{s_n^2}\,\text{CNR}_{IN}$，並取 $\overline{s_n^2} = 0.5$ 得到的（$3 \times 0.5 \times 20 = 30$）。

- 臨界時鑑頻器輸出開始出現**尖波（spikes）**，聽起來像喀喀聲（click）；相量 $r_1(t)$ 繞原點一圈，相位變 $2\pi$。
- 臨界附近的一般化 SNR 公式（弦波調變，式 7.102）；高於臨界時分母趨近 1，退化回 (7.94)：

$$
\text{SNR}_{FM} = \frac{\tfrac{3}{2}\beta^2\,\text{CNR}_{IN}}{1 + \dfrac{12\beta}{\pi}\,\text{CNR}_{IN}\,e^{-\text{CNR}_{IN}/[2(1+\beta)]}}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\beta$ | FM 調變指數（單音時 $D = \beta$） | — |

### 7.4 預強調與解強調

$$
H_{DE}(f) = \frac{1}{1 + j(f/f_1)}, \qquad f_1 = \frac{1}{2\pi\tau},\ \tau = RC
$$

$$
P_{n_o} = 2\left(\frac{K_{FD}}{A_c}\right)^2N_0f_1^3\left[\frac{B}{f_1} - \tan^{-1}\frac{B}{f_1}\right] \approx 2\left(\frac{K_{FD}}{A_c}\right)^2N_0f_1^2B \quad (B/f_1 \gg 1)
$$

$$
(\text{SNR}_{FM})_{DE} = \left(\frac{\Delta f_{max}}{f_1}\right)^2\overline{s_n^2}\,\text{CNR}_{IN} = D^2\left(\frac{B}{f_1}\right)^2\overline{s_n^2}\,\text{CNR}_{IN}
$$

$$
\text{SNR 改善} = \frac{(B/f_1)^2}{3} \;\Rightarrow\; 20\log_{10}(B/f_1) - 4.77\ \text{dB}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $H_{DE}(f)$ | 單極點解強調低通濾波器 | — |
| $f_1$ | 解強調濾波器的 3 dB 頻率 | Hz |
| $\tau$ | RC 時間常數 | s |

> 講義在 7.4 節推導時把載波振幅寫成 $A_c$（不帶 $\alpha$），對應 $\text{CNR}_{IN} = A_c^2/(2N_0B)$。

> 預強調（高通）在發射端放大高頻、解強調（低通）在接收端還原，兩者對訊息沒有影響；但解強調會壓低拋物線形雜訊的高頻部分，所以 SNR 提升。

### 7.5 類比調變比較（Table 7.1 重點）

| 調變 | 傳輸頻寬 | SNR 優值 | 設備複雜度 | 備註 |
|---|---|---|---|---|
| 基頻 | $B$ | 1 | 低 | 短距離點對點鏈路 |
| DSB-SC | $2B$ | 1 | 中；需同調解調 | — |
| 傳統 AM | $2B$ | $\eta \le 1$ | 低；用包絡檢波 | 廣播用低成本接收機 |
| SSB | $B$ | 1 | 高；需同調解調 | — |
| VSB | $B + f_v$（$f_v/B \approx 0.2$～$0.3$） | 1 | 高；需同調解調 | VSB 濾波器複雜 |
| VSB+C | $B + f_v$（$f_v/B \approx 0.2$～$0.3$） | $\eta \le 1$ | 中；用包絡檢波 | 廣播用低成本接收機 |
| PM | $2(\Delta\phi_{max}+1)B$ | $(\Delta\phi_{max})^2\overline{s_n^2}$ | 中 | 某些訊號型態需 $\Delta\phi_{max} \le \pi$ |
| FM | $2(D+1)B$ | $3D^2\overline{s_n^2}$ | 中 | $\text{CNR}_{IN}$ 需高於臨界值 |
| FM＋預強調 | $2(D+1)B$ | $D^2(B/f_1)^2\overline{s_n^2}$ | 中；$f_1$ 為解強調濾波器 3 dB 頻率 | $\text{CNR}_{IN}$ 需高於臨界值 |

### 7.6 鏈路設計

$$
\text{System Gain (dB)} = P_T - P_R = \alpha d + \text{link margin}, \qquad d = \frac{P_T - P_R - \text{link margin}}{\alpha}\ \text{km}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $P_T,\ P_R$ | 發射功率、最低接收功率 | dBm 或 dBW |
| $\alpha$（此處） | 線路衰減 | dB/km |
| $d$ | 鏈路長度 | km |

$$
N_{out} = FGN_0B_N \;\Rightarrow\; N_{out} = NF + G + 10\log_{10}(N_0B_N)\ \text{dBW}
$$

$$
(\text{CNR}_{out})_1 = P_R - NF - 10\log_{10}(N_0B_N), \qquad (\text{CNR}_{out})_M = (\text{CNR}_{out})_1 - 10\log_{10}M
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $F,\ NF$ | 放大器雜訊指數（noise figure），$NF = 10\log_{10}F$ | —、dB |
| $G$ | 放大器增益（每段增益＝該段線損 $L$） | dB |
| $B_N$ | 等效雜訊頻寬 | Hz |
| $M$ | 串接的中繼段數 | — |

> 每個中繼器貢獻的雜訊一樣多，$M$ 段總雜訊 $= M\,FGN_0B_N$；中繼器數量加倍，輸出 CNR 降 3 dB。

## 解題技巧

### 題型一：給 SNR 規格求發射功率與頻寬（例 7.1、7.5）

1. 先寫頻寬：DSB／AM $2B$、SSB $B$、PM $2(\Delta\phi_{max}+1)B$、FM $2(D+1)B$。
2. 由所需 SNR 和該調變的優值求 $\text{CNR}_{IN}$，再用 $P_R = \text{CNR}_{IN}\cdot N_0B$。
3. 換成 dBm，加上通道衰減（dB）得 $P_T$。

> 對答案用：例 7.1（$B = 10$ kHz、SNR 45 dB、衰減 50 dB）DSB/SSB $P_R = -5$ dBm、$P_T = 45$ dBm ≈ 31.62 W；AM（$\eta = 0.265$）$P_T = 50.767$ dBm ≈ 119.3 W。
> 例 7.5（$B = 15$ kHz、SNR 60 dB）：PM $B_T = 105$ kHz、$P_T = 56.81$ dBm ≈ 479.7 W；FM（$D = 5$）$B_T = 180$ kHz、$P_T = 46$ dBm ≈ 39.81 W；AM（$m_a = 0.85$）$B_T = 30$ kHz、$P_T = 67.52$ dBm ≈ 5.65 kW。

### 題型二：AM 包絡檢波臨界值（例 7.2）

1. 定義：臨界發生在 $P\{e_n > A_c\} = 0.01$；雜訊包絡為瑞雷分布，$P\{e_n > A_c\} = e^{-A_c^2/2\sigma^2}$，$\sigma^2 = 2N_0B$。
2. $e^{-A_c^2/4N_0B} = 0.01 \Rightarrow A_c^2/(4N_0B) = 4.605$。
3. 代入 $\text{CNR}_{IN}$ 公式（單音、$m_a = 1$ → $m_a^2\overline{s_n^2} = 0.5$）：$2 \times 4.605 \times 1.5 \approx 13.8$。
4. 換到檢波器輸入：$\text{CNR}_{PD} = \text{CNR}_{IN} - 3$ dB；結論是臨界約在 $\text{CNR}_{PD}$ 10 dB 左右。

<!-- TODO: 待確認：課本式 (7.61)（p.388，verify/ch07/p018.png）印「2 × 4.605 × 1.5 = 13.8 = 12.4 dB」，式 (7.63) 再得 (CNR_PD)th = 12.4 − 3 = 9.4 dB；但 10log10(13.8) ≈ 11.4 dB，照算應為 8.4 dB。課本本身數字不一致（結論「約 10 dB 或以下」不受影響），待老師確認。 -->

### 題型三：FM 系統設計（例 7.6）

1. **頻寬限制**：$B_T = 2(D+1)B$ 求最大 $D$（48 MHz、$B = 4$ MHz → $D = 5$）。
2. **臨界限制**：$(\text{SNR}_{FM})_{th} = 30D^2(D+1)$ 求最大 $D$（$10^5$ → $D \approx 15$）。
3. 取兩者**較小**的 $D$。
4. $\text{CNR}_{IN} = \text{SNR}/(3D^2\overline{s_n^2})$，$\text{CNR}_{PD} = \text{CNR}_{IN}/[2(1+D)]$，$P_R = \text{CNR}_{IN}\cdot N_0B$。

> 對答案用：$\text{CNR}_{IN} = 2.667 \times 10^3$（34.26 dB）、$\text{CNR}_{PD} \approx 222.2$、$P_R \approx 10.67$ mW。

### 題型四：解強調改善量（例 7.7）

1. $f_1 = 1/(2\pi\tau)$。
2. 改善量 $= 20\log_{10}(B/f_1) - 4.77$ dB。

> 對答案用：商用 FM 廣播 $B = 15$ kHz、$\tau = 75\ \mu$s → $f_1 \approx 2.1$ kHz、$B/f_1 = 7.14$、改善約 12.3 dB。

<!-- TODO: 待確認：例 7.7（p.407，verify/ch07/p037.png）算式寫 20log10(7.5) − 4.77 = 12.3 dB，但 20log10(7.5) − 4.77 ≈ 12.7 dB；用 B/f1 = 7.14 才得 12.3 dB，課本的 7.5 疑為筆誤。 -->

### 題型五：鏈路長度與中繼器串接（例 7.8、7.9）

1. 由 SNR 規格求 $\text{CNR}_{IN}$（FM 用 dB 式：$\text{SNR} = \text{CNR}_{IN} + 10\log_{10}(D^2\overline{s_n^2}) + 4.77$）。
2. $P_R = \text{CNR}_{IN} + 10\log_{10}(N_0B)$。
3. 系統增益 $= P_T - P_R$，除以每公里（或每 100 ft）衰減得跨距。
4. 有 $M$ 段中繼：每段要設計成 $\text{CNR}_{sys} + 10\log_{10}M$（例：4 段、系統 50 dB → 每段 56 dB）。

> 例 7.8（$\Delta f_{max} = 4$ MHz、$B = 4.2$ MHz → $D \approx 1$、$\overline{s_n^2} = 0.5$、SNR 50 dB、$P_T = 1$ W、2 dB/km）課本答案：$\text{SNR}_{FM} = \text{CNR}_{IN} + 1.77$ dB → $\text{CNR}_{IN} = 48.23$ dB，系統增益 54.46 dB、跨距約 27 km（數字疑點見下方 TODO）。
> 例 7.9（CATV，$NF = 9.5$ dB、$G = 30$ dB、$B_N = 4$ MHz、$P_T = -6.75$ dBm、SNR 48 dB、VSB+C $m_a = 0.85$、$\eta = 0.265$、電纜 1.33 dB/100 ft）對答案用：課本 $\text{CNR}_{IN} = 50.78$ dB；單段 $(\text{CNR}_{out})_1 = P_R + 128.46$，$P_R = -47.68$ dBm、系統增益 40.93 dB、跨距約 3077 ft；20 段串接 $P_R = -34.68$ dBm、每段約 2100 ft、總長約 8.4 英里。

<!-- TODO: 待確認：例 7.8（p.410，verify/ch07/p040.png）課本寫 P_R = 48.23 − 53.767 = −5.54 dBW = −24.46 dBm，再以系統增益 = 30 + 24.46 = 54.46 dB、跨距 54.46/2 ≈ 27 km；但 −5.54 dBW 應換算為 +24.46 dBm，照此系統增益只剩 5.54 dB（約 2.8 km）。課本本身前後不一致，待老師確認。 -->
<!-- TODO: 待確認：例 7.9（p.414，verify/ch07/p044.png）式 (7.131) 寫 CNR_IN = 48 − 10log10(η) = 48 + 2.78 = 50.78 dB，但 η = 0.265 時 −10log10(η) ≈ 5.77 dB（應約 53.77 dB）；後續 P_R、跨距 3077 ft／2100 ft 皆沿用 50.78 dB。課本本身數字不一致，待老師確認。 -->

## 常見陷阱

- $\text{CNR}_{IN}$ 用的是**訊息頻寬 $B$** 內的雜訊 $N_0B$；$\text{CNR}_{PD}$ 用的是**預檢波濾波器頻寬**（AM 為 $2B$、FM 為 $B_T$）內的雜訊，兩者差一個倍數，不要混用。
- 題目給的是雙邊 $N_0/2$ 還是單邊 $N_0$，要先看清楚。
- 傳統 AM 的優值是 $\eta$ 不是 1；同樣接收功率下，SNR 至少比 DSB/SSB 差 3 dB。
- 包絡檢波只有在高 CNR 時才等同同調解調；低 CNR 時出現臨界效應，同調解調則**沒有**臨界效應。
- FM 增大 $D$ 可提升 SNR，但頻寬變大、臨界 $\text{CNR}_{IN} \approx 20(D+1)$ 也跟著升高；若發射功率不跟著加，$D$ 越大反而會掉進臨界。
- PM 的 $\Delta\phi_{max}$ 受限（訊息有跳躍不連續時要 $\le \pi$），所以 PM 的 SNR 改善有限。
- dBW 與 dBm 相差 30 dB，代入系統增益前要統一單位。
