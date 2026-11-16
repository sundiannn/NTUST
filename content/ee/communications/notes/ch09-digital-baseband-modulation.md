# Ch.9 數位基頻調變

> 依據：老師講義 Chapter 9 Digital Baseband Modulation（9.1–9.9）｜更新：2026-11-17

## 重點摘要

- 數位基頻調變器（又稱**線路編碼器，line encoder**）把每 $k$ 個位元對應成一個符號，再以基本脈波 $v(t)$ 每 $T$ 秒送出一個：$s(t) = \sum a_nv(t-nT)$；M 階 PAM 的位元率 $R_b = D\log_2M$。
- 選線路碼要考慮：**透明性**、**時脈（timing）成分**、**低頻／直流成分**、頻譜特性、頻寬效率、錯誤偵測能力、功率效率。
- 功率頻譜密度（PSD）由**脈波形狀** $\lvert V(f)\rvert^2$ 與**資料統計**（平均值、相關性）共同決定；平均值不為零時會在 $f = \ell D$ 出現離散譜線。單極性碼有直流成分，雙極性（AMI）與曼徹斯特碼在 $f = 0$ 有頻譜零點。
- 要讓碼具備透明性與直流平衡，可用**區塊線路碼**（4B5B、HDB3、B8ZS、4B3T、2B1Q）或**擾碼（scrambling）**。
- 方波脈波頻寬太寬（NRZ 的 99% 頻寬約 $7R_b$）；改用**升餘弦（raised cosine, RC）脈波**可在零 ISI 下把頻寬限制在 $(1+\alpha)D/2$；頻寬 $W$ 的通道最多傳 $2(\log_2M)W$ bps，最終由雜訊限制 $M$。

## 公式整理

### 9.1 脈波振幅調變（PAM）

$$
s(t) = \sum_{n}a_nv(t-nT), \qquad a_n \in \{a_1, a_2, \ldots, a_M\},\ M = 2^k
$$

$$
D = \frac{1}{T}, \qquad R_b = \frac{1}{T_b} = kD = D\log_2M, \qquad T_b = \frac{T}{\log_2M}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $a_n$ | 第 $n$ 個符號的振幅（離散隨機變數） | V |
| $v(t)$ | 基本脈波形狀 | — |
| $T$ | 符號週期（symbol period） | s |
| $D$ | 符號率／脈波率（symbol rate） | symbols/s（baud） |
| $T_b$ | 位元時間 | s |
| $R_b$ | 位元率 | bps |
| $k$ | 每個符號攜帶的位元數 | bit |

- **極性（polar／antipodal）**：$a_n \in \{1, -1\}$；**單極性（unipolar）**：$a_n \in \{1, 0\}$。
- 四階 PAM（每次 2 bit）：$(0,0) \to -3$、$(0,1) \to -1$、$(1,1) \to 1$、$(1,0) \to 3$。

### 9.2 二元線路碼分類

| 分類方式 | 種類 | 說明 |
|---|---|---|
| 符號對應 | 單極性 | 1 → $+A$、0 → 0 V |
| | 極性 | 1 → $+A$、0 → $-A$ |
| | 雙極性（bipolar／AMI） | 1 交替送 $+A$、$-A$，0 → 0 V；三個電位，又稱假三元（pseudoternary） |
| 脈波形狀 | NRZ | 整個位元時間維持振幅 |
| | RZ | 部分時間（通常一半）回到 0 V |
| | 曼徹斯特（Manchester） | 1：位元中間由正轉負；0：由負轉正 |
| 差分編碼 | NRZ-I、差分曼徹斯特 | 1 → 波形相對前一個符號翻轉；0 → 不翻轉 |

### 9.3 隨機脈波串的 PSD

$$
G_s(f) = \frac{\lvert V(f)\rvert^2}{T}\sum_{\ell=-\infty}^{\infty}R(\ell)\,e^{-j2\pi f\ell T}, \qquad R(\ell) = E\{a_na_{n+\ell}\}
$$

$$
\text{符號互相獨立時：}\ G_s(f) = \lvert V(f)\rvert^2D\sigma_a^2 + (Dm_a)^2\sum_{\ell=-\infty}^{\infty}\lvert V(\ell D)\rvert^2\delta(f-\ell D)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $V(f)$ | $v(t)$ 的傅立葉轉換 | — |
| $R(\ell)$ | 資料的自相關函數 | V² |
| $m_a,\ \sigma_a^2$ | 符號振幅的平均值、變異數 | V、V² |

> 推導時加入均勻分布的隨機延遲讓 $s(t)$ 變成廣義平穩，再用維納－辛欽定理（Wiener-Khinchin theorem）。除非 $m_a = 0$ 或 $V(\ell D) = 0$，否則頻譜在符號率的整數倍有**脈衝（譜線）**。

**M 階單極性 NRZ**（$a_n \in \{0, A, \ldots, (M-1)A\}$，方波 $V(f) = T\,\text{sinc}(fT)$）

$$
m_a = \frac{(M-1)A}{2}, \quad \sigma_a^2 = \frac{(M^2-1)A^2}{12}, \qquad G_s(f) = \frac{(M^2-1)A^2}{12D}\text{sinc}^2\!\left(\frac{f}{D}\right) + \frac{(M-1)^2A^2}{4}\delta(f)
$$

**M 階極性 NRZ**（$a_n \in \{\pm A, \pm3A, \ldots, \pm(M-1)A\}$）

$$
m_a = 0, \quad \sigma_a^2 = \frac{(M^2-1)A^2}{3}, \qquad G_s(f) = \frac{(M^2-1)A^2}{3D}\text{sinc}^2\!\left(\frac{f}{D}\right)
$$

$$
B_{null} = D = \frac{R_b}{\log_2M}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $B_{null}$ | 第一零點頻寬（first null bandwidth） | Hz |

> 同樣位元率下，M 階訊號的第一零點頻寬是二元的 $1/\log_2M$。

### 9.3.2 二元線路碼的 PSD

$$
G_{\text{unipolar NRZ}}(f) = \frac{A^2}{4R_b}\text{sinc}^2\!\left(\frac{f}{R_b}\right) + \frac{A^2}{4}\delta(f)
$$

$$
G_{\text{polar NRZ}}(f) = \frac{A^2}{R_b}\text{sinc}^2\!\left(\frac{f}{R_b}\right)
$$

$$
G_{\text{unipolar RZ}}(f) = \frac{A^2}{16R_b}\text{sinc}^2\!\left(\frac{f}{2R_b}\right) + \frac{A^2}{16}\Big[\delta(f) + \text{sinc}^2(\tfrac12)\big(\delta(f-R_b)+\delta(f+R_b)\big) + \text{sinc}^2(\tfrac32)\big(\delta(f-3R_b)+\delta(f+3R_b)\big) + \cdots\Big]
$$

**雙極性（AMI）**：$P\{a_n = 0\} = 1/2$、$P\{a_n = \pm A\} = 1/4$，相鄰符號相關：

$$
R(\ell) = \begin{cases} A^2/2, & \ell = 0 \\ -A^2/4, & \lvert\ell\rvert = 1 \\ 0, & \lvert\ell\rvert > 1 \end{cases}, \qquad G_{\text{bipolar}}(f) = \frac{\lvert V(f)\rvert^2A^2}{2T_b}\big[1 - \cos(2\pi fT_b)\big]
$$

$$
G_{\text{bipolar RZ}}(f) = \frac{A^2}{4R_b}\text{sinc}^2\!\left(\frac{f}{2R_b}\right)\sin^2\!\left(\frac{\pi f}{R_b}\right)
$$

$$
G_{\text{bipolar NRZ}}(f) = \frac{A^2}{4R_b}\text{sinc}^2\!\left(\frac{f}{R_b}\right)\sin^2\!\left(\frac{\pi f}{R_b}\right) \quad \text{（課本式 9.48 原式）}
$$

> 💡 補充說明（AI）：把 NRZ 方波 $\lvert V(f)\rvert^2 = T_b^2\text{sinc}^2(fT_b)$ 代入上面的雙極性通式，會得到 $\dfrac{A^2}{R_b}\text{sinc}^2(f/R_b)\sin^2(\pi f/R_b)$，係數與課本的 $A^2/4R_b$ 不同。

<!-- TODO: 待確認：課本式 (9.48)（p.502，verify/ch09/p014.png）印 A²/(4R_b)，但用同頁 (9.45) 代入 NRZ 方波 V(f) = T_b sinc(fT_b) 推得 A²/R_b（同法代 RZ 脈波可正確得到 (9.47) 的 A²/4R_b）；Figure 9.9 的 NRZ 峰值也與兩者都不完全吻合。課本本身前後不一致，待老師確認係數。 -->

**曼徹斯特碼**

$$
V(f) = jT_b\,\text{sinc}\!\left(\frac{fT_b}{2}\right)\sin\!\left(\frac{\pi fT_b}{2}\right), \qquad G_{\text{Manchester}}(f) = \frac{A^2}{R_b}\text{sinc}^2\!\left(\frac{f}{2R_b}\right)\sin^2\!\left(\frac{\pi f}{2R_b}\right)
$$

| 線路碼 | 直流 | 第一零點頻寬 | 特性 |
|---|---|---|---|
| 單極性 NRZ | 有（$\delta(f)$） | $R_b$ | AC 耦合時一長串 1 會「下垂（droop）」 |
| 極性 NRZ | 無譜線，但低頻能量大 | $R_b$ | BER 性能最好（見 Ch.10） |
| 單極性 RZ | 有 | $2R_b$ | $f = R_b$ 有譜線，可取時脈；直流浪費功率 |
| 雙極性 RZ／NRZ | $f = 0$ 為零點 | $R_b$ | 能量集中在 $R_b/2$；全波整流可取時脈；可偵測單一錯誤；北美 T1 標準 |
| 曼徹斯特 | 每個位元都直流平衡 | $2R_b$ | 每個位元都有轉態，不怕長串 0/1；IEEE 802.3 乙太網路 |

### 9.4 頻寬定義與頻譜效率

- **半功率頻寬** $B_{3dB}$：PSD 降到峰值一半處。
- **第一零點頻寬** $B_{null}$：PSD 包絡第一個零點，最常用。
- **絕對頻寬** $B_{abs}$：之後 PSD 完全為零；只有 RC 類脈波是有限值。
- **分數功率頻寬**：包含指定比例功率的頻寬，常用 99%。

$$
\eta = \frac{R_b}{B}\ \text{bits/s-Hz}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\eta$ | 頻譜（頻寬）效率 | bits/s/Hz |

| 線路碼（方波） | $B_{null}$ | $\eta_{null}$ |
|---|---|---|
| NRZ 單極性 | $R_b$ | 1 |
| NRZ 極性 | $R_b$ | 1 |
| RZ 單極性 | $2R_b$ | 1/2 |
| 雙極性 RZ（AMI） | $R_b$ | 1 |
| 曼徹斯特 | $2R_b$ | 1/2 |
| M 階 PAM | $R_b/k$ | $k$ |

### 9.5 頻帶外功率（POB）

$$
P_{OB}(f) = 10\log_{10}\frac{\int_f^{\infty}G(f')\,df'}{\int_0^{\infty}G(f')\,df'}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $P_{OB}(f)$ | 頻率 $f$ 以外所剩的功率比例 | dB |

> $P_{OB} = -20$ dB（1%）對應的頻率就是 99% 頻寬；NRZ 的 99% 頻寬約 $7R_b$，所以不適合頻寬受限的通道。

### 9.6 區塊線路碼

$$
2^k \le M^n, \qquad \text{kBnB 符號率} = \frac{n}{k}\times\text{位元率}\ (n > k), \qquad \text{kBnT 符號率} = \frac{n}{k}\times\text{位元率}\ (n < k)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $k$ | 每區塊的資訊位元數 | bit |
| $n$ | 碼字的符號數 | — |

- **4B5B**：16 種 4 bit 對到 32 種 5 bit 中「至少兩個 1」的碼字，搭配 NRZ-I，保證不會超過三個連續 0；符號率為位元率的 5/4，多出的碼字用作控制。同類還有 8B10B（Gigabit 乙太網路）、64B66B（10G 乙太網路）。
- **HDB3**（ITU G.703，歐洲）：四個 0 換成 $000V$ 或 $B00V$；上次替換後 1 的個數為**偶數**用 $B00V$、**奇數**用 $000V$，讓相鄰 V 極性交替、不產生直流。
- **B8ZS**（北美 T1、T1C）：八個 0 換成 $000VB0VB$：前一個非零脈波為負 → $000-+0+-$；為正 → $000+-0-+$。
- **B6ZS**（T2）：$0VB0VB$；**B3ZS**（T3）：三個 0 換成 $B0V$ 或 $00V$，使相鄰 V 之間 B 的個數為奇數。
- **4B3T**：16 種 4 bit 對到 27 種三元碼，依**累計數位和（running digital sum, RDS）**選正偏或負偏碼字以維持直流平衡；歐洲 ISDN BRI 160 kbps → 120 k symbols/s。
- **2B1Q**：每 2 bit 一個四階脈波（M 階 PAM 的特例）；北美 ISDN（ANSI T1.601）160 kbps → 80 k symbols/s，約 18,000 ft（5.5 km）、衰減 42 dB 以內。

### 9.7 擾碼

$$
g(D) = 1 \oplus g_1D \oplus g_2D^2 \oplus \cdots \oplus g_rD^r, \qquad x_n = \bigoplus_{i=1}^{r}g_ix_{n-i}, \qquad N = 2^r - 1
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $g(D)$ | 生成多項式（generator polynomial），係數為 0 或 1 | — |
| $r$ | 多項式次數＝移位暫存器級數 | — |
| $N$ | 最大長度（ML）PN 序列週期（需原始多項式，primitive） | bit |

**訊框同步擾碼器（frame-synchronous）**

$$
c_n = b_n \oplus x_n, \qquad c_n \oplus x_n = b_n
$$

**自我同步擾碼器（self-synchronous）**

$$
c_n = b_n \oplus \bigoplus_{i=1}^{r}g_ic_{n-i}, \qquad b_n = c_n \oplus \bigoplus_{i=1}^{r}g_ic_{n-i}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $b_n$ | 使用者資料位元 | — |
| $x_n$ | PN 序列 | — |
| $c_n$ | 擾碼後位元 | — |

- 訊框同步：收發兩端 PN 產生器必須同步。**SONET**：$g(D) = 1 \oplus D^6 \oplus D^7$，週期 127，每個 STS-1 訊框（125 μs、810 bytes）重設為 1111111；A1、A2（F628 hex）與 J0 不擾碼。
- 自我同步：擾碼器是回授型、解擾碼器是前饋型；狀態跟著資料一起傳過去，**不需要重設同步**，也較難預測（可用於加密）。**ATM**：$g(D) = 1 \oplus D^{43}$。

### 9.8 脈波整形

**sinc 脈波（$\alpha = 0$）**

$$
v(t) = \text{sinc}(2Bt), \qquad V(f) = \frac{1}{2B}\Pi\!\left(\frac{f}{2B}\right), \qquad D = 2B
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $B$ | 理想低通通道頻寬 | Hz |
| $\Pi(\cdot)$ | 矩形函數 | — |

> 每 $T = 1/2B$ 送一個 sinc 脈波，其他脈波在取樣點剛好為零 → 無符號間干擾（ISI）。$D = 2B$ 是理想低通通道不產生 ISI 的最大符號率，稱為**奈奎斯特信令速率（Nyquist signaling rate）**。

**升餘弦脈波**

$$
V_{RC}(f) = \begin{cases} T, & 0 \le \lvert f\rvert \le \dfrac{1-\alpha}{2T} \\[1.5ex] \dfrac{T}{2}\left\{1 + \cos\!\left[\dfrac{\pi T}{\alpha}\left(\lvert f\rvert - \dfrac{1-\alpha}{2T}\right)\right]\right\}, & \dfrac{1-\alpha}{2T} \le \lvert f\rvert \le \dfrac{1+\alpha}{2T} \\[1.5ex] 0, & \lvert f\rvert > \dfrac{1+\alpha}{2T} \end{cases}
$$

$$
v_{RC}(t) = \text{sinc}\!\left(\frac{t}{T}\right)\frac{\cos(\pi\alpha t/T)}{1 - 4\alpha^2t^2/T^2}, \qquad B_{abs} = \frac{1+\alpha}{2T} = \frac{(1+\alpha)D}{2}
$$

$$
\eta_{RC} = \frac{R_b}{B_{abs}}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\alpha$ | 滾降因子／超額頻寬因子（roll-off／excess bandwidth factor），$0 \le \alpha \le 1$ | — |
| $B_{abs}$ | 絕對頻寬，介於 $D/2$（$\alpha = 0$）與 $D$（$\alpha = 1$） | Hz |

> 零交越點在 $t = \pm T, \pm2T, \ldots$，所以 RC 脈波也是奈奎斯特波形（取樣點零 ISI）。超額頻寬為 $\alpha D/2$；$\alpha$ 越大旁波瓣衰減越快，取樣時脈抖動造成的 ISI 越小，平滑的滾降也比較容易實現。

| 線路碼（RC 脈波） | $B_{abs}$ | $\eta_{RC}$ |
|---|---|---|
| NRZ 單極性 | $R_b(1+\alpha)/2$ | $2/(1+\alpha)$ |
| NRZ 極性 | $R_b(1+\alpha)/2$ | $2/(1+\alpha)$ |
| RZ 單極性 | $R_b(1+\alpha)$ | $1/(1+\alpha)$ |
| 雙極性 RZ（AMI） | $R_b(1+\alpha)/2$ | $2/(1+\alpha)$ |
| 曼徹斯特 | $R_b(1+\alpha)$ | $1/(1+\alpha)$ |
| M 階 PAM | $R_b(1+\alpha)/2k$ | $2k/(1+\alpha)$ |

### 9.9 可容許位元率

$$
\text{方波：}\ R_{max} = \eta_{null}W, \qquad \text{RC 脈波：}\ R_{max} = \eta_{RC}W, \qquad \text{sinc 脈波上限：}\ R_{max} = 2(\log_2M)W
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $W$ | 通道頻寬 | Hz |
| $R_{max}$ | 最大可達位元率（無雜訊） | bps |

> 極性 NRZ、雙極性 RZ、曼徹斯特的第一零點頻寬內約含 90% 功率，所以常取 $W = B_{null}$。增加 $M$ 理論上可無限提升位元率，但在峰值振幅固定下，位準間距變小，雜訊更容易造成判斷錯誤，所以**雜訊才是 $M$ 的最終限制**（Ch.10、11 討論）。

## 解題技巧

### 題型一：符號率與位元率換算（例 9.1）

1. 先確認每個符號幾個位元：$k = \log_2M$。
2. $R_b = kD$。

> 對答案用：每秒 9600 個脈波，二元 → 9600 bps；四元（$k = 2$）→ 19,200 bps。

### 題型二：求線路碼的 PSD

1. 寫出符號的機率與振幅，算 $m_a$、$\sigma_a^2$。
2. 符號獨立 → 用 $\lvert V(f)\rvert^2D\sigma_a^2 + (Dm_a)^2\sum\lvert V(\ell D)\rvert^2\delta(f-\ell D)$。
3. 符號相關（例如 AMI）→ 先算 $R(\ell)$，再代入通式 $\dfrac{\lvert V(f)\rvert^2}{T}\sum R(\ell)e^{-j2\pi f\ell T}$。
4. 代入脈波的 $V(f)$：NRZ 方波 $T_b\text{sinc}(fT_b)$、50% RZ $\tfrac{T_b}{2}\text{sinc}(fT_b/2)$。
5. 找第一個零點得到 $B_{null}$；看 $f = 0$ 與 $f = \ell R_b$ 是否有譜線。

### 題型三：區塊碼／替換碼編碼

1. **4B5B**：查表換碼，再用 NRZ-I（遇 1 翻轉）。
2. **HDB3**：遇到四個 0，數「上次替換後」1 的個數：偶數 → $B00V$，奇數 → $000V$；$B$ 遵守交替規則，$V$ 與前一個脈波同極性（違規）。
3. **B8ZS**：看前一個非零脈波的極性決定 $000-+0+-$ 或 $000+-0-+$。

### 題型四：PN 序列與擾碼（例 9.2、9.3）

1. 由生成多項式寫出遞迴式（例 9.2 三級 LFSR：$x_n = x_{n-2} \oplus x_{n-3}$）。
2. 從初始狀態逐步算出輸出，確認週期 $2^r - 1$。
3. 自我同步擾碼器（例 9.3，$c_n = b_n \oplus c_{n-2} \oplus c_{n-5}$，初值全 0）：逐位元列表計算 $c_n$。

> 對答案用：例 9.2 初始 $x_{n-1} = 0, x_{n-2} = 0, x_{n-3} = 1$，輸出 $1011100$ 重複，週期 7。
> 例 9.3（45 octal → $g(D) = 1 \oplus D^2 \oplus D^5$）輸入 $100000000000$，課本 Table 9.5 得 $c_n = 101011101100$，可看出 11 個連續 0 被打散。

### 題型五：頻寬估算（例 9.4）

1. 方波極性 NRZ：$B_{null} = R_b$；第一、二旁波瓣只比主瓣低 13.5 dB、17.9 dB，包絡以 $1/f^2$（6 dB/octave）衰減。
2. 求 30 dB 頻寬：令包絡 $(1/\pi fT_b)^2 = 10^{-3}$，得 $f \approx 10.1R_b$。
3. RC 脈波：$B_{abs} = 0.5(1+\alpha)R_b$；令 $\lvert V_{RC}(f)/V_{RC}(0)\rvert^2 = 10^{-3}$ 解出 30 dB 頻率。

> 對答案用（RS-232，38.4 kbps）：$B_{null} = 38.4$ kHz；方波 30 dB 頻寬約 386 kHz；RC（$\alpha = 0.5$）$B_{abs} = 28.8$ kHz、30 dB 頻寬約 26.61 kHz，小了約 14.5 倍。

### 題型六：通道頻寬求最大位元率（例 9.5、9.6）

1. 方波：查 $\eta_{null}$，$R_{max} = \eta_{null}W$。
2. RC 脈波：查 $\eta_{RC}$，$R_{max} = \eta_{RC}W$。
3. sinc 脈波（$\alpha = 0$）：$R_{max} = 2kW$。

> 對答案用（$W = 4$ kHz）：方波 極性 NRZ 4 kbps、雙極性 RZ 4 kbps、曼徹斯特 2 kbps、M 階 PAM $4k$ kbps；RC（$\alpha = 0.5$）極性 NRZ 約 5.34 kbps、雙極性 RZ 約 5.34 kbps、曼徹斯特約 2.67 kbps、M 階 PAM 約 $5.34k$ kbps；sinc 脈波 M 階 PAM $8k$ kbps。

## 常見陷阱

- 符號率 $D$（baud）不等於位元率 $R_b$；只有二元時兩者相等。
- 單極性碼的直流譜線是浪費的功率，且 AC 耦合時會造成訊號下垂。
- 極性 NRZ 雖然沒有直流**譜線**，低頻能量仍大，長串 0/1 會讓時脈回復失敗。
- RZ 與曼徹斯特因脈波寬度減半，第一零點頻寬是 NRZ 的**兩倍**。
- 雙極性碼的相鄰符號**相關**，不能直接套「符號獨立」的 PSD 公式，要先算 $R(\ell)$。
- 方波的 $B_{null}$ 會讓人誤以為頻譜很窄，實際上旁波瓣衰減很慢（99% 頻寬約 $7R_b$）。
- 用 RC 脈波時頻譜效率用的是**絕對頻寬** $B_{abs}$，不是第一零點頻寬。
- 訊框同步擾碼器需要收發端 PN 產生器同步；自我同步擾碼器不需要，但兩者解擾碼結構不同（回授 vs 前饋）。
