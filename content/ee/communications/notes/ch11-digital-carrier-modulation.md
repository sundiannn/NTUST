# Ch.11 數位載波調變

> 依據：老師講義 Chapter 11 Digital Information Transmission Using Carrier Modulation（11.1–11.11）｜更新：2026-11-15

## 重點摘要

- 數位載波調變分兩步：先由線碼器產生基頻脈波串，再用它去改變載波的**振幅（ASK）**、**相位（PSK）**或**頻率（FSK）**；同調（coherent）解調要求接收端載波和發射端同頻同相，算 BER 時可直接沿用 Ch.10 的星座圖方法。
- 二元方式比較：**BPSK 是反極性**（$Q(\sqrt{2E_b/N_0})$），**BASK、同調 BFSK 分別等同單極性與正交訊號**（$Q(\sqrt{E_b/N_0})$），所以 BPSK 比它們省 3 dB。
- 不需要同調載波的方案：**DBPSK** $\tfrac12e^{-E_b/N_0}$（比 BPSK 差不到 1 dB）、**非同調 ASK／FSK** $\tfrac12e^{-E_b/2N_0}$（比同調約差 1 dB）。
- **QPSK、OQPSK、MSK 的 BER 都和 BPSK 一樣**，但 QPSK／OQPSK 的零點對零點頻寬只有 $R_b$（BPSK 的一半）；OQPSK 把相位跳變限制在 ±90°，MSK 則是相位連續、旁瓣衰減最快。
- $M$ 變大時頻寬除以 $\log_2M$，但 SNR/bit 需求增加；**$M$-QAM 比 $M$-PSK 省功率很多**（16-QAM 比 16-PSK 約好 4 dB，256 時約 15 dB），所以有線、數據機多用 QAM，低 SNR 的衛星與行動通訊多用 OQPSK、MSK。

## 公式整理

### 11.1 帶通訊號的表示法

$$
x(t)=A(t)\cos[2\pi f_ct+\psi(t)]=I(t)\cos(2\pi f_ct)-Q(t)\sin(2\pi f_ct)
$$

$$
I(t)=A(t)\cos\psi(t),\qquad Q(t)=A(t)\sin\psi(t),\qquad \tilde{x}(t)=I(t)+jQ(t),\qquad x(t)=A_c\,\mathrm{Re}\{\tilde{x}(t)e^{j2\pi f_ct}\}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $f_c$ | 載波頻率 | Hz |
| $A(t)$ | 包絡（envelope） | V |
| $\psi(t)$ | 時變相位 | rad |
| $I(t),Q(t)$ | 同相（in-phase）、正交（quadrature）分量 | V |
| $\tilde{x}(t)$ | 複數包絡（complex envelope） | V |

### 11.2 BASK（二元振幅位移鍵送，binary amplitude-shift keying）

$$
s_1(t)=A_c\cos(2\pi f_ct)\ (\text{bit }1),\qquad s_2(t)=0\ (\text{bit }0),\qquad 0\le t\le T_b
$$

$$
E_b=\frac{A_c^2T_b}{4},\qquad \sigma^2=N_0T_b,\qquad V_T=\frac{A_cT_b}{2},\qquad
\text{BER}_{BASK}=Q\!\left(\sqrt{\frac{E_b}{N_0}}\right)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $A_c$ | 載波振幅 | V |
| $T_b$ | 位元時間 | s |
| $E_b$ | 平均每位元能量（bit 0 能量為 0，所以是 $A_c^2T_b/2$ 的一半） | J |
| $\sigma^2$ | 積分後清除濾波器輸出雜訊變異數 | V²·s² |
| $V_T$ | 最佳門檻 | V·s |

> 同調解調：乘上 $2\cos(2\pi f_ct)$，低通濾掉 $2f_c$ 項後就是單極性 NRZ。基底 $\phi_1=\sqrt{2/T_b}\cos(2\pi f_ct)$，星座點 $\sqrt{2E_b}$ 與 0，等同單極性訊號，$d=\sqrt{2E_b}$。

### 11.3 BPSK（二元相位位移鍵送，binary phase-shift keying）

$$
s_{1,2}(t)=\pm A_c\cos(2\pi f_ct),\qquad E_b=\frac{A_c^2T_b}{2},\qquad V_T=0,\qquad
\text{BER}_{BPSK}=Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right)
$$

> 星座 $\pm\sqrt{E_b}$，就是反極性訊號，$d=2\sqrt{E_b}$。同樣 BER 下比 BASK 少 3 dB。

### 11.4 BFSK（二元頻率位移鍵送，binary frequency-shift keying）

$$
s_{1,2}(t)=A_c\cos(2\pi f_ct\pm\pi\Delta f\,t+\phi_{1,2}),\qquad f_{1,2}=f_c\pm\frac{\Delta f}{2}
$$

正交條件（$f_cT_b$ 為整數時）：

$$
\int_0^{T_b}s_1(t)s_2(t)\,dt=\frac{A_c^2T_b}{2}\,\mathrm{sinc}(2\Delta fT_b)
$$

$$
\text{同調（同相位）：}\ \Delta f=\frac{k}{2T_b},\ \Delta f_{min}=\frac{R_b}{2},\ h_{min}=0.5
\qquad
\text{非同調（任意相位）：}\ \Delta f=\frac{k}{T_b},\ \Delta f_{min}=R_b,\ h=1
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\Delta f$ | 兩載波頻率間隔（frequency deviation） | Hz |
| $h=\Delta fT_b$ | 調變指數（modulation index） | — |
| $R_b=1/T_b$ | 位元率 | bit/s |
| $k$ | 正整數 | — |

> **Sunde's FSK**：$\Delta f=R_b$，實務最常用，位元切換時相位連續。
> 兩個獨立振盪器切換的 BFSK 會有相位不連續、頻譜變寬；用單一 VCO 的**連續相位 FSK（CPFSK）**旁瓣能量低很多。

同調 BFSK（看成兩個交錯的 ASK，上下兩支路相減）：

$$
\sigma^2=2N_0T_b,\qquad E_b=\frac{A_c^2T_b}{2},\qquad
\text{BER}_{BFSK}=Q\!\left(\sqrt{\frac{E_b}{N_0}}\right)
$$

> 星座 $(\sqrt{E_b},0)$、$(0,\sqrt{E_b})$，是正交訊號，$d=\sqrt{2E_b}$。

### 11.5 DBPSK（差動 BPSK，differential BPSK）

$$
d_n=d_{n-1}\oplus b_n,\qquad a_n=\pm1,\qquad
\text{BER}_{DBPSK}=\frac{1}{2}e^{-E_b/N_0}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $b_n$ | 資料位元 | — |
| $d_n$ | 差動編碼後位元（$b_n=0$ 不變、$b_n=1$ 反轉；初始位元任意，如 $d_0=1$） | — |
| $a_n$ | 極性傳輸符號 | — |

> 接收端用**前一個位元區間的接收波形當參考載波**，積分輸出為 $E_ba_na_{n-1}$ 加雜訊，門檻 0：$r_o>0\Rightarrow a_n=a_{n-1}\Rightarrow b_n=0$；$r_o<0\Rightarrow b_n=1$。
> 雜訊不是單純高斯，所以 BER 推導很長，講義直接給結果。頻寬 $2R_b$。

### 11.6 非同調解調（包絡偵測）

非同調 ASK：送 0 時包絡為**瑞利分佈（Rayleigh）**，送 1 時為**萊斯分佈（Rician）**；高 SNR 下 $V_{opt}\approx A_c/2$。

$$
\sigma^2=N_0B_N,\qquad \text{BER}_{NC\text{-}ASK}\approx\frac{1}{2}e^{-A_c^2/8\sigma^2}\ \xrightarrow{B_N=R_b}\ \frac{1}{2}e^{-E_b/2N_0},\qquad E_b=\frac{A_c^2T_b}{4}
$$

非同調 FSK（兩個帶通濾波器＋包絡偵測器，比較 $r_1$、$r_2$ 大小）：

$$
\text{BER}_{NC\text{-}FSK}=\frac{1}{2}e^{-A_c^2/4\sigma^2}\ \xrightarrow{B_N=R_b}\ \frac{1}{2}e^{-E_b/2N_0},\qquad E_b=\frac{A_c^2T_b}{2}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $B_N$ | 帶通濾波器雜訊等效頻寬 | Hz |
| $\sigma^2$ | 帶通濾波器輸出雜訊變異數 | V² |

> 兩者需要的 SNR/bit 一樣，但 FSK 只需一半載波功率（少 3 dB 載波位準）就能得到相同 $E_b$；非同調 FSK 在惡劣環境中較穩健，常用於低速數據機。非同調 ASK 是光纖通訊最常用的方式。

### 11.7 正交調變：QPSK、OQPSK、$M$-PSK

$$
x(t)=A_c\big[I(t)\cos(2\pi f_ct)-Q(t)\sin(2\pi f_ct)\big]
$$

> 位元流經串並轉換分成偶數、奇數位元，分別調變 $\cos$ 與 $\sin$ 兩個正交載波；在帶通通道中只要載波正交就互不干擾，等於**符號率加倍**。

**QPSK**（每符號 2 bit，相位 $\pi/4,3\pi/4,5\pi/4,7\pi/4$）：

$$
E_s=\frac{A_c^2T}{2},\qquad E_b=\frac{E_s}{2}
$$

> 基底取 $\phi_1=\sqrt{2/T}\cos(2\pi f_ct)$ 與對應的 $\sin(2\pi f_ct)$ 正交基底 $\phi_2$，星座就是兩個 BPSK 疊在一起。

$$
\mathbf{s}_i=(\pm\sqrt{E_b},\pm\sqrt{E_b}),\qquad d_{min}=2\sqrt{E_b},\qquad
P_s\approx2Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right),\qquad
\text{BER}_{QPSK}=Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $T=2T_b$ | 符號時間 | s |
| $E_s$ | 每符號能量 | J |

> QPSK 的 $I$、$Q$ 可能同時變號，產生 **180° 相位跳變**；濾波後包絡會大幅變動，經過非線性 C 類功率放大器時旁瓣會長回來。
> **OQPSK** 把 $Q(t)$ 延遲 $T_b$，$I$、$Q$ 不會同時切換，相位跳變**最多 ±90°**，BER 與 QPSK 相同。

**$M$-PSK**：

$$
s_i(t)=A_cv(t)\cos\!\left[2\pi f_ct+\frac{2\pi(i-1)}{M}+\theta\right],\qquad E_s=\frac{A_c^2T}{2}
$$

$$
d_{min}=2\sqrt{E_s}\sin\frac{\pi}{M},\qquad
P_s\approx2Q\!\left(\sqrt{\frac{2E_b\log_2M}{N_0}}\sin\frac{\pi}{M}\right),\qquad
\text{BER}_{M\text{-PSK}}\approx\frac{2}{\log_2M}Q\!\left(\sqrt{\frac{2E_b\log_2M}{N_0}}\sin\frac{\pi}{M}\right)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\theta$ | 固定相位偏移（0 或 $\pi/M$） | rad |

> 星座點都在半徑 $\sqrt{E_s}$ 的圓上，$M$ 大時每加倍相位數約多需 6 dB。

### 11.8 MSK（最小位移鍵送，minimum shift keying）

$$
\Delta f=\frac{R_b}{2}=\frac{1}{2T_b}\ (h=0.5),\qquad f_{1,2}=f_c\pm\frac{1}{4T_b}
$$

$$
\psi(T_b)-\psi(0)=\pm\frac{\pi}{2}\quad(\text{bit }1\text{ 為 }+,\ \text{bit }0\text{ 為 }-)
$$

$$
\text{BER}_{MSK}=Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right)
$$

> MSK 是頻率間隔為「同調正交最小值」的 CPFSK，所以叫「最小」位移。相位在每個位元內線性變化，相位格狀圖（phase trellis）在位元切換點連續。
> MSK 也可看成**半弦波加權的 OQPSK**（MSK type I）：$I$ 支路乘 $\cos(\pi t/2T_b)$、$Q$ 支路乘 $\sin(\pi t/2T_b)$，因此 BER 與 QPSK 相同。

### 11.9 $M$-QAM（正交振幅調變，quadrature amplitude modulation）

$I$、$Q$ 各是一個 $\sqrt{M}$-ary PAM，$a\in\{\pm1,\pm3,\dots,\pm(\sqrt{M}-1)\}$：

$$
C_s=\sqrt{\frac{3}{2(M-1)}},\qquad \mathbf{s}_{mn}=(a_m^1C_s\sqrt{E_s},\ a_n^2C_s\sqrt{E_s}),\qquad d_{min}=2C_s\sqrt{E_s}
$$

$$
P_s\approx\frac{4(\sqrt{M}-1)}{\sqrt{M}}Q\!\left(\sqrt{\frac{3E_s}{(M-1)N_0}}\right),\qquad
\text{BER}_{M\text{-QAM}}\approx\frac{4(\sqrt{M}-1)}{\sqrt{M}\log_2M}Q\!\left(\sqrt{\frac{3\log_2M}{M-1}\frac{E_b}{N_0}}\right)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $C_s$ | 正規化常數（16-QAM 時 $=1/\sqrt{10}$，星座點在 $\pm\sqrt{E_s/10}$、$\pm3\sqrt{E_s/10}$） | — |
| $M$ | 星座點數（方形星座 $M=4^n$） | — |

> 推導：$P_c=(1-P_{\sqrt M})^2\Rightarrow P_s\approx2P_{\sqrt M}$，$P_{\sqrt M}$ 是 $\sqrt M$-PAM 的符號錯誤率。
> 特例：$M=4$ 時 $\text{BER}=Q(\sqrt{2E_b/N_0})$，和 QPSK 相同；$M=16$ 時 $\text{BER}=\tfrac34Q(\sqrt{0.8E_b/N_0})$；$M=64$ 時 $\text{BER}=\tfrac{7}{12}Q(\sqrt{0.2857E_b/N_0})$。

### 11.10 頻譜與頻寬

$$
G_x(f)=\frac{A_c^2}{4}\big[G_I(f-f_c)+G_Q(f-f_c)+G_I(f+f_c)+G_Q(f+f_c)\big]
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $G_I,G_Q$ | $I(t)$、$Q(t)$ 的功率頻譜密度 | W/Hz |

> 帶通訊號頻譜＝基頻 $I$、$Q$ 頻譜往 $\pm f_c$ 平移後相加（假設 $I$、$Q$ 獨立且至少一個平均為 0）。

零點對零點頻寬（矩形脈波，位元率 $R_b$）：

| 方式 | $B_{null\text{-}null}$ | 用 RC 脈波（滾降 $\alpha$）的 $B_{abs}$ | 備註 |
|---|---|---|---|
| BASK | $2R_b$ | $(1+\alpha)R_b$ | 頻譜有載波脈衝 |
| BPSK | $2R_b$ | $(1+\alpha)R_b$ | 無載波分量，較省功率 |
| QPSK／OQPSK | $R_b$ | $(1+\alpha)R_b/2$ | 兩者頻譜相同 |
| MSK | $1.5R_b$ | $3(1+\alpha)R_b/4$ | 主瓣較寬但旁瓣衰減快 |
| $M$-PSK、$M$-QAM | $2R_b/\log_2M$ | — | |
| Sunde's FSK | $3R_b$（也有人用 $R_b$） | — | 有 $f_c\pm R_b/2$ 的頻譜脈衝，四次方滾降 |

$$
\eta=\frac{R_b}{B_T}\quad\text{bit/s/Hz}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\eta$ | 頻譜效率（spectral efficiency） | bit/s/Hz |
| $B_T$ | 所需傳輸頻寬（零點對零點、絕對或 99% 功率頻寬） | Hz |

> 載波調變的頻寬都是其基頻訊號的**兩倍**。FCC 採用 99% 功率頻寬（上下各排除 0.5% 功率）。

### 11.11 SNR/bit 代價（相對 BPSK）

| 方式 | 相對頻寬 | $E_b/N_0$ 代價公式 |
|---|---|---|
| $M$-PSK | $1/\log_2M$ | $-10\log_{10}\!\left[\log_2M\sin^2(\pi/M)\right]$ |
| $M$-DPSK | $1/\log_2M$ | $-10\log_{10}\!\left[2\log_2M\sin^2(\pi/2M)\right]$ |
| $M$-QAM | $1/\log_2M$ | $10\log_{10}\!\left[\dfrac{2(M-1)}{3\log_2M}\right]$ |

> 代價數值：8-PSK 3.57 dB、16-PSK 8.17 dB；DQPSK 2.32 dB、8-DPSK 6.41 dB、16-DPSK 11.14 dB；8-QAM 1.92 dB、16-QAM 3.98 dB、64-QAM 8.45 dB。講義表中 BPSK 的基準 $E_b/N_0$ 為 8.4 dB。
<!-- TODO: 待確認：Table 11.5 掃描檔中基準 BER 的指數看不清（推測為 10^-4），256-QAM 那一列數值也模糊，未列出。Table 11.4（各方式頻寬與 BER 總表）整頁旋轉、無法辨識，以上表格改由 11.10 節內文與例 11.5 整理。 -->

## 解題技巧

### 題型一：給 BER 求所需振幅或平均功率（例 11.1、11.2、11.3）

1. 寫出該方式的 BER 公式，查表或取對數求出 $E_b/N_0$：
   - $Q$ 形式：$Q(x)=10^{-6}\Rightarrow x\approx4.75$；$Q(x)=10^{-5}\Rightarrow x\approx4.27$。
   - 指數形式：取自然對數，例 DBPSK $\tfrac12e^{-E_b/N_0}=10^{-6}\Rightarrow E_b/N_0=13.122$。
2. $E_b=(E_b/N_0)\times N_0$（注意題目給的是 $N_0$ 還是 $N_0/2$）。
3. 平均功率 $P_{av}=E_b/T_b=E_bR_b$；振幅由 $E_b$ 與 $A_c$ 的關係反求（BASK：$A_c=2\sqrt{E_bR_b}$）。
4. 換成 dBm：$10\log_{10}(P/1\,\text{mW})$。

> 例 11.1（BASK、BER $=10^{-5}$）：300 bps／3 kbps／9.6 kbps 需 $A_c\approx$ 466.7／1479／2646 μV。
> 例 11.2（4800 bps、BER $=10^{-6}$）：BASK 10.83 μW（−19.65 dBm），BPSK 5.415 μW（−22.66 dBm），剛好差 3 dB。
> 例 11.3（56 kbps、BER $=10^{-6}$）：SNR/bit 為 BPSK 10.53 dB、DBPSK 11.18 dB、同調 BFSK 13.53 dB、非同調 BFSK 14.19 dB；功率約 63.17、73.48、126.34、148.06 μW。

### 題型二：比較 $M$-ary 方式所需 SNR/bit（例 11.4）

1. BER 公式前的係數先移到右邊：8-PSK 為 $\tfrac23Q(\cdot)$ → $Q(x)=1.5\times10^{-6}$；16-PSK 為 $\tfrac12Q(\cdot)$ → $Q(x)=2\times10^{-6}$；16-QAM 為 $\tfrac34Q(\cdot)$；64-QAM 為 $\tfrac{7}{12}Q(\cdot)$ → $Q(x)=1.714\times10^{-6}$。
2. 查表得 $x$，再由 $x^2=(\text{係數})\times E_b/N_0$ 解出 $E_b/N_0$。

> 對答案用：BPSK／QPSK／OQPSK／MSK 10.53 dB、8-PSK 13.94 dB、16-PSK 18.44 dB。
<!-- TODO: 待確認：例 11.4 中 16-QAM 與 64-QAM 的最終 dB 值在掃描檔中看不清，未列出。 -->

### 題型三：給頻寬求最大位元率（例 11.5、11.6）

1. 依方式選頻寬公式（見 11.10 表），矩形脈波用零點對零點，RC 脈波用絕對頻寬。
2. $R_b=B/(\text{係數})$。
3. 若反過來給 $R_b$ 與頻寬求 $M$：$B=2R_b/k\Rightarrow k$，再取符合限制的整數（PSK 要 $M=2^n$、方形 QAM 要 $M=4^n$），**$k$ 要往上取**才放得進頻寬。

> 例 11.5（100 kHz）：BPSK 50 kbps（RC $\alpha=0.5$：66.7 kbps）、QPSK 100 kbps（133.4 kbps）、MSK 66.7 kbps（88.9 kbps）、Sunde's FSK 33.4 kbps（若用 $B=R_b$ 定義則為 100 kbps）。
> 例 11.6（150 kHz、500 kbps）：$k=6.67$ → 128-PSK／128-DPSK（$k=7$）、256-QAM（$k=8$），BER $=10^{-6}$ 時分別約需 33.8、37、23.5 dB，QAM 明顯最省。

### 題型四：DBPSK 編碼與解碼（表 11.1、11.2）

1. 設初始 $d_0$（講義取 1），依 $d_n=d_{n-1}\oplus b_n$ 逐一算出 $d_n$。
2. $d_n=1\to a_n=+1$（相位 0），$d_n=0\to a_n=-1$（相位 $\pi$）。
3. 解碼：比較相鄰兩個符號，同號 → $b_n=0$，異號 → $b_n=1$。

### 題型五：MSK 相位格狀圖（圖 11.43）

1. 從 $\psi(0)=0$ 開始，每個 bit 1 加 $\pi/2$、bit 0 減 $\pi/2$，中間線性連接。
2. 在偶數倍 $T_b$ 時相位（mod $2\pi$）只會是 0 或 $\pi$，奇數倍時是 $\pm\pi/2$。

## 常見陷阱

- BASK 的 $E_b=A_c^2T_b/4$（有一半時間不送），BPSK 與 BFSK 的 $E_b=A_c^2T_b/2$，代錯會差 3 dB。
- 同調 BFSK 的最小間隔是 $R_b/2$（$h=0.5$），非同調是 $R_b$（$h=1$）；MSK 用的是**同調**最小值 $R_b/2$，Sunde's FSK 用的是 $R_b$。
- QPSK 和 BPSK 的 **BER** 一樣，但 QPSK 的**符號**錯誤率約是 $2Q(\cdot)$，不要混用；比較方案時要用 BER 對 $E_b/N_0$。
- QPSK 與 OQPSK 的 BER、頻譜都相同，差別在相位跳變（180° vs. 90°）與經過非線性放大後的頻譜再生。
- 非同調 ASK 與 FSK 的 BER 公式一樣，但載波位準需求不同；非同調方式約比同調差 1 dB，DBPSK 約比非同調好 2 dB。
- DBPSK 的接收雜訊不是高斯，不能用 $Q$ 函數推，直接記 $\tfrac12e^{-E_b/N_0}$。
- $M$-PSK 只能沿圓周擴充，$d_{min}$ 隨 $M$ 快速變小；QAM 用平面空間，所以大 $M$ 時比 PSK 省很多 dB。
