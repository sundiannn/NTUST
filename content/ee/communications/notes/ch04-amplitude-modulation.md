# Ch.4 振幅調變

> 依據：老師講義 Chapter 4 Amplitude Modulation（4.1–4.10、附錄 4A）｜更新：2026-11-15

## 重點摘要

- 調變（modulation）的目的：**頻率搬移**、**通道化**（channelization）、**縮小天線尺寸**（天線約 $\lambda/4$）、**以頻寬換取雜訊性能**。
- 四種振幅調變的頻寬：DSB-SC 與傳統 AM 都是 $2B$；SSB 是 $B$；VSB 介於兩者之間（$B + f_v$）。
- **DSB-SC** 功率效率 100%，但必須用**同調解調**（coherent demodulation），本地載波有相位誤差 $\phi$ 時輸出會乘上 $\cos\phi$，$\phi = 90^\circ$ 時訊號完全消失。
- **傳統 AM** 多送一個載波，只要 $m_a \le 1$ 就能用便宜的**包絡檢波器**（envelope detector）解調；代價是功率效率最高只有 50%（方波、$m_a = 1$），單音 $m_a = 1$ 時只有 33.3%。
- 超外差接收機（superheterodyne receiver）把 RF 降頻到固定 IF，要注意與目標頻率相距 $2f_{IF}$ 的**鏡像頻率**（image frequency）。

## 公式整理

### 4.1 帶通訊號

$$
x(t) = A(t)\cos[2\pi f_c t + \psi(t)]
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $A(t)$ | 包絡（envelope），$A(t) \ge 0$ | V |
| $\psi(t)$ | 時變相位 | rad |
| $f_c$ | 載波頻率（carrier frequency） | Hz |
| $B$ | 低通（LP）訊息訊號的頻寬 | Hz |

### 4.2 DSB-SC（雙旁波帶抑制載波）

$$
x_{DSB}(t) = A_c\, s(t)\cos(2\pi f_c t)
\;\Longleftrightarrow\;
X_{DSB}(f) = \frac{A_c}{2}\left[S(f - f_c) + S(f + f_c)\right], \qquad B_T = 2B
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $s(t)$ | 訊息訊號（message signal） | V |
| $A_c$ | 載波振幅 | V |
| $B_T$ | 傳輸頻寬 | Hz |

> $|f| > f_c$ 的部分稱為**上旁波帶**（upper sideband），$|f| < f_c$ 的部分稱為**下旁波帶**（lower sideband）；任一個旁波帶都含有完整的訊息。

$$
P_x = \frac{A_c^2}{2} P_s, \qquad \text{PEP}_{DSB} = \frac{A_c^2\,(\max|s(t)|)^2}{2}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $P_x$ | 調變訊號的正規化平均功率（1 Ω 負載） | W |
| $P_s$ | 訊息訊號的正規化平均功率 | W |
| PEP | 峰值包絡功率（peak envelope power）：在包絡最高點的一個載波週期內送到 1 Ω 負載的平均功率 | W |

> 單音訊息時 $\text{PEP}_{DSB} = 2P_x$；人聲訊號的 PEP 約為平均功率的 3～4 倍。

**同調解調（有頻率誤差 $\Delta f$ 與相位誤差 $\phi$）：**

$$
y_D(t) = s(t)\cos(2\pi\Delta f\, t + \phi) \;\xrightarrow{\Delta f = 0}\; y_D(t) = s(t)\cos\phi
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\Delta f$ | 本地載波的頻率誤差 | Hz |
| $\phi$ | 本地載波的相位誤差 | rad |

> 載波回復方法：(1) 平方律元件取出 $2f_c$ 成分再除頻 2；(2) 加入小振幅的**導頻**（pilot tone）；(3) Costas loop（第 13 章）。

### 4.3 傳統 AM（Conventional AM）

$$
x_{AM}(t) = A_c[1 + m_a s_n(t)]\cos(2\pi f_c t), \qquad
s_n(t) = \frac{s(t)}{|\min s(t)|}, \qquad
m_a = \frac{|\min s(t)|}{A_c}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $s_n(t)$ | 正規化訊息，最小值為 $-1$ | — |
| $m_a$ | 調變指數（modulation index） | — |

$$
A_{min} = A_c(1 - m_a), \qquad
m_a = \frac{A_{max} - A_{min}}{A_{max} + A_{min}}\ (\text{訊息上下對稱時})
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $A_{max}, A_{min}$ | 包絡的最大值、最小值 | V |

> $m_a \le 1$ 時包絡恆正、保留訊息形狀；$m_a > 1$ 稱為**過調變**（overmodulation），包絡檢波會失真。$m_a = 1$（100% 調變）時包絡在 $0$ 與 $2A_c$ 之間變化。

$$
X_{AM}(f) = \frac{A_c}{2}\left[\delta(f - f_c) + \delta(f + f_c)\right] + \frac{A_c m_a}{2}\left[S_n(f - f_c) + S_n(f + f_c)\right]
$$

**功率與效率（假設 $s_n(t)$ 平均值為 0）：**

$$
P_x = \frac{A_c^2}{2} + \frac{(m_a A_c)^2}{2}P_n, \qquad
\eta = \frac{m_a^2 P_n}{1 + m_a^2 P_n}
$$

$$
\text{PEP}_{AM} = \frac{A_c^2}{2}\left(\max[1 + m_a s_n(t)]\right)^2
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $P_n$ | 正規化訊息 $s_n(t)$ 的功率 | W |
| $\eta$ | 功率（調變）效率 ＝ 旁波帶功率 / 總功率 | — |

> 第一項是載波功率，不帶任何資訊，是「浪費」的功率。方波（$P_n = 1$）且 $m_a = 1$ 時效率最高 50%；單音（$P_n = 0.5$）且 $m_a = 1$ 時 $\eta = 33.3\%$。

**包絡檢波器的時間常數：**

$$
\frac{1}{f_c} \ll R_L C \ll \frac{1}{B}, \qquad (R_f + R_s)C \ll \frac{1}{f_c}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $R_L$ | 負載電阻（放電路徑） | Ω |
| $C$ | 檢波電容 | F |
| $R_f, R_s$ | 二極體順向電阻、訊號源串聯電阻（充電路徑） | Ω |

> 經驗法則：$R_L C$ 取 $1/B$ 的 5～10%。

單音 AM 要讓輸出永遠跟得上包絡（例 4.6）：

$$
R_L C \le \frac{\sqrt{1 - m_a^2}}{2\pi f_m\, m_a}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $f_m$ | 單音訊息頻率 | Hz |

> $m_a$ 越大，$R_L C$ 要越小；$R_L C$ 太大時輸出會「浮」在包絡上方（對角線截波失真）。

### 4.4 帶通訊號的其他表示法

$$
x(t) = I(t)\cos(2\pi f_c t) - Q(t)\sin(2\pi f_c t), \qquad I = A\cos\psi, \quad Q = A\sin\psi
$$

$$
\tilde{x}(t) = I(t) + jQ(t) = A(t)e^{j\psi(t)}, \qquad x(t) = \mathrm{Re}\{\tilde{x}(t)e^{j2\pi f_c t}\}
$$

$$
x^+(t) = \tilde{x}(t)e^{j2\pi f_c t} = x(t) + j\hat{x}(t)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $I(t), Q(t)$ | 同相（in-phase）、正交（quadrature）分量，皆為 LP 訊號 | V |
| $\tilde{x}(t)$ | 複數包絡（complex envelope） | V |
| $x^+(t)$ | 解析訊號（analytic signal） | V |
| $\hat{x}(t)$ | $x(t)$ 的希爾伯特轉換（Hilbert transform） | V |

$$
I(t) = x(t)\cos(2\pi f_c t) + \hat{x}(t)\sin(2\pi f_c t), \qquad
Q(t) = \hat{x}(t)\cos(2\pi f_c t) - x(t)\sin(2\pi f_c t)
$$

$$
X^+(f) = X(f)[1 + \mathrm{sgn}(f)] = \begin{cases} 2X(f), & f > 0 \\ 0, & f < 0 \end{cases}, \qquad
\tilde{X}(f) = X^+(f + f_c)
$$

$$
X(f) = \frac{1}{2}\left[\tilde{X}(f - f_c) + \tilde{X}^*(-f - f_c)\right]
$$

**帶通系統：** 令 $h(t) = 2\,\mathrm{Re}\{\tilde{h}(t)e^{j2\pi f_c t}\}$（多一個 2 倍），則

$$
\tilde{y}(t) = \tilde{x}(t) * \tilde{h}(t), \qquad y(t) = \mathrm{Re}\{\tilde{y}(t)e^{j2\pi f_c t}\}
$$

> 好處：把帶通問題換成等效的低通問題，計算時不用一直帶著 $\cos(2\pi f_c t)$（例 4.8）。

### 4.5 SSB（單旁波帶）

$$
x_{USB}(t) = \frac{A_c}{2}\left[s(t)\cos(2\pi f_c t) - \hat{s}(t)\sin(2\pi f_c t)\right], \qquad
x_{LSB}(t) = \frac{A_c}{2}\left[s(t)\cos(2\pi f_c t) + \hat{s}(t)\sin(2\pi f_c t)\right]
$$

$$
B_T = B, \qquad P_x = \frac{A_c^2}{8}(P_s + P_{\hat{s}}) = \frac{A_c^2}{4}P_s, \qquad
\text{PEP}_{SSB} = \frac{A_c^2}{8}\max[s^2(t) + \hat{s}^2(t)]
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\hat{s}(t)$ | 訊息的希爾伯特轉換 | V |
| $P_{\hat{s}}$ | $\hat{s}(t)$ 的功率（$= P_s$） | W |

> 產生方法：**濾波法**（DSB-SC 後用帶通濾波器選一個旁波帶，適合訊息在 0 Hz 附近沒有能量的情況）、**相移法**（phasing method，需要希爾伯特轉換器）。

**同調解調（相位誤差 $\phi$）：**

$$
y_D(t) = \frac{A_c}{2}\left[s(t)\cos\phi + \hat{s}(t)\sin\phi\right]
$$

> 和 DSB-SC 不同，相位誤差除了讓 $s(t)$ 衰減 $\cos\phi$，還會混入 $\hat{s}(t)$ 造成失真。

**插入大載波後用包絡檢波（$k \gg A_c s(t),\ k \gg A_c\hat{s}(t)$）：**

$$
e(t) \approx k + \frac{A_c}{2}s(t)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $k$ | 重新插入的載波振幅 | V |

### 4.6 VSB（殘邊帶）

$$
X_{VSB}(f) = \frac{A_c}{2}\left[S(f - f_c) + S(f + f_c)\right]H(f)
$$

$$
Y_D(f) = \frac{A_c}{2}S(f)\left[H(f - f_c) + H(f + f_c)\right]
$$

**無失真條件（殘邊帶對稱條件，vestigial symmetry）：**

$$
H(f - f_c) + H(f + f_c) = C, \qquad |f| \le B
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $H(f)$ | VSB 濾波器頻率響應 | — |
| $C$ | 實數常數（可取 1） | — |
| $f_v$ | 殘留旁波帶寬度 | Hz |

> 濾波器在 $f_c$ 附近 $2f_v$ 的過渡帶呈**奇對稱**。VSB 頻寬 $B + f_v$，$f_v/B \approx 0.2$～$0.3$。加上載波的 VSB + C 可用包絡檢波，用於電視廣播。

### 4.7 正交多工（QAM）

$$
x_{QAM}(t) = s_1(t)\cos(2\pi f_c t) + s_2(t)\sin(2\pi f_c t)
$$

> 兩個頻寬 $B$ 的訊號共用 $2B$ 的頻帶，分別乘 $2\cos$、$2\sin$ 再低通就能取回，頻寬效率等同 SSB。

### 4.9 頻率搬移（混頻器）

$$
f_{IF} = f_c - f_{LO}\ (\text{低側注入}), \qquad f_{LO} = f_c - f_{IF}\ (\text{low-side}), \qquad f_{LO} = f_c + f_{IF}\ (\text{high-side})
$$

$$
f_{image} = f_c - 2f_{IF}\ (\text{low-side}), \qquad f_{image} = f_c + 2f_{IF}\ (\text{high-side})
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $f_{LO}$ | 本地振盪器（local oscillator）頻率 | Hz |
| $f_{IF}$ | 中頻（intermediate frequency） | Hz |
| $f_{image}$ | 鏡像頻率 | Hz |

> 鏡像頻率的訊號也會被搬到同一個 IF，所以降頻前要先用**鏡像抑制濾波器**，或用 Hartley **鏡像抑制混頻器**（image-reject mixer）。Hartley 架構要 >60 dB 的抑制，相位誤差需小於 0.5°。

### 附錄 4A 希爾伯特轉換

$$
H(f) = -j\,\mathrm{sgn}(f), \qquad h(t) = \frac{1}{\pi t}, \qquad \hat{x}(t) = x(t) * \frac{1}{\pi t}
$$

$$
\cos(2\pi f_c t + \theta) \xrightarrow{\mathcal{H}} \sin(2\pi f_c t + \theta), \qquad
\sin(2\pi f_c t + \theta) \xrightarrow{\mathcal{H}} -\cos(2\pi f_c t + \theta)
$$

- 每個頻率成分相位延遲 $90^\circ$，振幅不變。
- 性質：$\hat{\hat{x}}(t) = -x(t)$；$x$ 與 $\hat{x}$ **能量（功率）相同**且**互相正交**。
- 低通 $s(t)$ 與高頻載波頻譜不重疊時：$s(t)\cos(2\pi f_c t + \theta) \xrightarrow{\mathcal{H}} s(t)\sin(2\pi f_c t + \theta)$。

## 解題技巧

### 題型一：DSB-SC／AM 的頻譜與功率（例 4.1、4.3、4.5）

1. 用積化和差把式子展開成一堆 $\cos$／$\sin$，每一項對應頻譜上 $\pm f$ 的一對脈衝，大小為振幅的一半。
2. 傳統 AM：先找 $\min s(t)$，得 $m_a = |\min s(t)|/A_c$，再求 $s_n(t)$ 與 $P_n$。
3. 載波功率 $A_c^2/2$；每個旁波帶弦波的功率是「振幅²/2」，逐項相加。
4. $\eta = $ 旁波帶功率 ÷ 總功率，或直接用 $\eta = m_a^2P_n/(1 + m_a^2P_n)$。

> 例 4.5 對答案用：$x_{AM}(t) = [15 + 2\cos 80\pi t + 5\sin 120\pi t]\cos 4000\pi t$ → 載波功率 112.5 W、旁波帶功率 7.25 W、$m_a \approx 0.408$、$P_n \approx 0.387$、$\eta \approx 6.05\%$。

### 題型二：由波形讀 $m_a$（例 4.2、4.4）

1. 從圖上讀 $A_{max}$、$A_{min}$。
2. $m_a = (A_{max} - A_{min})/(A_{max} + A_{min})$。
3. 若要效率，再由波形判斷 $s_n(t)$ 的形狀求 $P_n$。

> 例 4.2：$A_{min} = 0.293$、$A_{max} = 1.707$ → $m_a = 0.707$。例 4.4：$m_a = 0.5$、$s_n = \sin 2\pi t$（$P_n = 0.5$）→ $\eta = 0.125/1.125 \approx 11.1\%$。

### 題型三：PEP 與平均功率比

1. 傳統 AM 單音：$P_x = \dfrac{A_c^2}{2}(1 + 0.5m_a^2)$、$\text{PEP} = \dfrac{A_c^2}{2}(1 + m_a)^2$。
2. 講義算例：$m_a = 0.875$ 時 $\text{PEP}/P_x \approx 2.54$。
3. DSB-SC 單音：$\text{PEP} = 2P_x$；SSB 單音：$P_x = \text{PEP} = A_c^2/8$。

### 題型四：SSB 時域式（例 4.9）

1. 求 $\hat{s}(t)$：每個 $\cos \to \sin$、$\sin \to -\cos$。
2. 代入 $x_{USB} = \frac{A_c}{2}[s\cos - \hat{s}\sin]$，用 $\cos a\cos b - \sin a\sin b = \cos(a + b)$ 合併。
3. 例 4.9：$s = \cos 2\pi t + 3\cos 6\pi t$、載波 $\cos 20\pi t$ → $x_{USB} = \frac{A_c}{2}[\cos 22\pi t + 3\cos 26\pi t]$，只剩上旁波帶。

### 題型五：VSB 驗證無失真（例 4.10、4.11）

1. 寫出 DSB-SC 每根譜線，乘上 VSB 濾波器在該頻率的增益（例 4.10：$f_c - f_1$、$f_c + f_1$、$f_c + f_2$ 分別為 $\varepsilon$、$1 - \varepsilon$、$1$）。
2. 同調解調後，同一個 $f_1$ 的兩項係數相加，若 $\varepsilon + (1 - \varepsilon) = 1$ 就和原訊號成正比。
3. 例 4.11（電視）：視訊頻寬 4.2 MHz，DSB 要 8.4 MHz，用 VSB 把視訊＋音訊壓在 6 MHz；音訊用 FM，載波在影像載波上方 4.5 MHz；$f_v = 0.75$ MHz。

### 題型六：超外差 LO 範圍與鏡像（例 4.15、4.12～4.14）

1. 決定高側或低側注入，代 $f_{LO} = f_c \pm f_{IF}$。
2. 用頻帶兩端算 LO 調諧範圍，比較最大/最小比值。
3. 例 4.15（AM 廣播 540～1600 kHz、IF 455 kHz）：高側 LO 995～2055 kHz（比值約 2），低側 85～1145 kHz（比值約 14），所以 AM 收音機用**高側注入**。
4. FDM 通道數：$(總頻寬 - 保護帶)/通道間隔$。例 4.14（AMPS）：$(25\text{ MHz} - 2 \times 10\text{ kHz})/30\text{ kHz} = 832$，扣掉 21 個控制通道剩 811 個使用者通道。

> 例 4.12 北美 FDM 階層：group 12 路（60–108 kHz）、supergroup 60 路（312–552 kHz）、mastergroup 600 路（564–3084 kHz）、jumbogroup 3600 路（564–17,548 kHz）；每路語音 3.4 kHz，配置 4 kHz。

## 常見陷阱

- 傳統 AM 的 $m_a$ 是用 $|\min s(t)|$ 定義，不是 $\max$；訊息不對稱時不能直接用 $(A_{max} - A_{min})/(A_{max} + A_{min})$。
- 算效率時要用**正規化**訊息 $s_n(t)$ 的功率 $P_n$，不是 $s(t)$ 的功率。
- 包絡檢波只適用於 $m_a \le 1$ 的傳統 AM（或插入大載波的 SSB / VSB + C）；DSB-SC、SSB 本身要同調解調。
- $R_L C$ 太小 → 輸出漣波大；太大 → 跟不上包絡下降。且 $m_a$ 變大時原本合適的 $R_L C$ 可能變得太大（講義圖 4.18：$m_a = 0.5$ 時 0.2 剛好，$m_a = 0.75$ 時就太大）。
- 鏡像頻率與目標頻率相差 $2f_{IF}$，不是 $f_{IF}$。IF 選太低，鏡像難濾；選太高，IF 濾波器難做得很陡（經驗上 IF 約為 RF 的 10%）。
- 直接轉換（zero-IF）接收機沒有鏡像問題，但有 **LO 洩漏**造成的**自混頻／DC 偏移**；低 IF 接收機沒有 DC 偏移，但又回到鏡像問題，通常用鏡像抑制混頻器解決。
