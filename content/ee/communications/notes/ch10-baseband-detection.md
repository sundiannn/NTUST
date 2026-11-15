# Ch.10 雜訊中的基頻訊號偵測

> 依據：老師講義 Chapter 10 Detection of Baseband Signals in Noise（10.1–10.7）｜更新：2026-11-15

## 重點摘要

- 數位接收機的目標不是重現波形，而是在每個符號區間判斷「送的是 $M$ 個波形中的哪一個」，並讓**錯誤機率最小**；本章假設通道無色散、雜訊為雙邊功率頻譜密度 $N_0/2$ 的**加成性白高斯雜訊（AWGN）**。
- **匹配濾波器（matched filter, MF）** 的脈衝響應是訊號的時間反轉 $h(t)=s(T_b-t)$，可使取樣點的 SNR 最大，且最大 SNR $=2E/N_0$ **只和訊號能量有關、和波形形狀無關**；它也可以用**相關器（correlator）**或「積分後清除（integrate and dump）」實作。
- 用 **Gram-Schmidt 正交化** 找出正交歸一基底後，每個訊號都能寫成 $N$ 維向量（訊號星座圖，constellation），白雜訊在各基底上的分量是獨立、平均 0、變異數 $N_0/2$ 的高斯變數。
- 符號等機率時，**MAP 偵測器 = ML 偵測器 = 選擇與接收向量歐氏距離最近的星座點**；錯誤率主要由**最小距離 $d_{min}$** 決定。
- 二元訊號比較：**反極性（antipodal）最好**，比單極性／正交／雙極（bipolar）訊號少需要 3 dB 的 $E_b/N_0$；$M$-ary PAM 每多一倍位準約要多 4 dB。

## 公式整理

### 10.1 二元訊號偵測與位元錯誤率

接收濾波器輸出在 $t=t_o$ 取樣：$r_o = s_{o1}+n_o$（送 1）或 $s_{o2}+n_o$（送 0），雜訊樣本變異數為

$$
\sigma_o^2 = \frac{N_0}{2}\int_{-\infty}^{\infty}|H(f)|^2\,df
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $N_0/2$ | 白雜訊雙邊功率頻譜密度 | W/Hz |
| $H(f)$ | 接收濾波器頻率響應 | — |
| $s_{o1},s_{o2}$ | 送 1、送 0 時濾波器輸出在取樣點的值 | V |
| $\sigma_o^2$ | 輸出雜訊變異數 | V² |

$$
\text{BER} = p\,P\{\text{error}\,|\,s_1\} + (1-p)\,P\{\text{error}\,|\,s_2\}
$$

$$
V_{opt}=\frac{s_{o1}+s_{o2}}{2}\ (\text{等機率}),\qquad
\text{BER}=Q\!\left(\frac{s_{o1}-s_{o2}}{2\sigma_o}\right)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $p$ | 送 1 的事前機率（a priori probability） | — |
| $V_{opt}$ | 最佳門檻電壓（threshold） | V |
| $Q(\cdot)$ | 標準高斯尾端機率函數 | — |

> BER 是 $Q$ 的引數越大越小，所以設計目標就是讓 $(s_{o1}-s_{o2})/(2\sigma_o)$ 最大。

### 例 10.1 用 RC 低通濾波器當接收濾波器（單極性 NRZ）

$$
\text{BER} = Q\!\left(\sqrt{h(z)\frac{E_b}{N_0}}\right),\qquad
h(z)=\frac{2(1-e^{-z})^2}{z},\qquad z = 2\pi f_{3dB}T_b
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $z$ | 頻寬時間積（BT product） | — |
| $f_{3dB}$ | RC 濾波器 3 dB 截止頻率 | Hz |
| $T_b$ | 位元時間 | s |
| $E_b$ | 平均每位元能量 | J |

> $h(z)$ 最大值 0.8154，發生在 $z=1.256$，即 $f_{3dB}\approx 0.2R_b$。此時 $\text{BER}_{RC}=Q\big(\sqrt{0.8154\,E_b/N_0}\big)$，比匹配濾波器多需要 $10\log_{10}(1/0.8154)\approx 0.89$ dB。

### 10.2 匹配濾波器

$$
H_{opt}(f) = S_1^*(f)\,e^{-j2\pi f t_o},\qquad h_{opt}(t)=s_1(t_o-t)
$$

$$
\left(\frac{s_{o1}^2}{\sigma_o^2}\right)_{max} = \frac{2}{N_0}\int_{-\infty}^{\infty}|s_1(t)|^2dt = \frac{2E_1}{N_0}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $S_1(f)$ | $s_1(t)$ 的傅立葉轉換 | V·s |
| $t_o$ | 取樣時間（之後一律取 $t_o=T_b$，否則濾波器不可實現） | s |
| $E_1$ | 脈波 $s_1(t)$ 的能量 | J |

> 推導用的是 **Cauchy-Schwarz 不等式**，等號成立時 $X(f)=KY^*(f)$；結果和 $N_0$ 無關。
> 例 10.2 的重要性質：MF 輸出在 $t=T_b$ 的峰值**等於脈波能量**，與波形形狀無關。

兩個訊號都不為零時，MF 為 $h_{opt}(t)=s_1(T_b-t)-s_2(T_b-t)$，此時

$$
d^2=\int_{-\infty}^{\infty}|s_1(t)-s_2(t)|^2dt,\qquad
\text{BER}=Q\!\left(\sqrt{\frac{d^2}{2N_0}}\right)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $d$ | 兩訊號之間的距離（$d^2$ 為差訊號的能量） | $\sqrt{\text{J}}$ |

相關器實作（$s(t)$ 只在 $0\le t\le T_b$ 不為零）：

$$
r_o(T_b)=\int_0^{T_b} s(\tau)\,r(\tau)\,d\tau
$$

> 若 $s(t)$ 是矩形脈波，就不必乘 $s(t)$，直接積分再清除即可（integrate-and-dump）。

### 10.2.2 各種二元訊號的 BER（匹配濾波器）

| 訊號方式 | $d^2$ | $E_b$ | BER |
|---|---|---|---|
| 單極性 NRZ（on-off） | $A^2T_b=2E_b$ | $A^2T_b/2$ | $Q\big(\sqrt{E_b/N_0}\big)$ |
| 極性／反極性 NRZ（antipodal） | $4A^2T_b=4E_b$ | $A^2T_b$ | $Q\big(\sqrt{2E_b/N_0}\big)$ |
| 正交（orthogonal） | $A^2T_b=2E_b$ | $A^2T_b/2$ | $Q\big(\sqrt{E_b/N_0}\big)$ |
| 雙極 NRZ（bipolar） | — | $E_1/2$ | $\tfrac{3}{2}Q\big(\sqrt{E_b/N_0}\big)$ |

> 反極性用 RC 低通濾波器時：$\text{BER}_{RC}=Q\big(\sqrt{2\times0.8154\,E_b/N_0}\big)$，同樣比 MF 差 0.89 dB。
> 反極性要達到 BER $=10^{-6}$ 約需 $E_b/N_0\approx 10.5$ dB。
> 雙極訊號：送 1 時交替送 $\pm v(t)$，送 0 時不送；比較器有兩個門檻 $\pm E_1/2$，$E_1$ 為 $v(t)$ 的能量。

### 10.3 向量空間

$$
\langle \mathbf{u},\mathbf{v}\rangle=\int_T u(t)v^*(t)\,dt,\qquad
\|\mathbf{u}\|=\sqrt{\langle \mathbf{u},\mathbf{u}\rangle},\qquad
d(\mathbf{u},\mathbf{v})=\|\mathbf{u}-\mathbf{v}\|
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\langle\cdot,\cdot\rangle$ | 內積（inner product） | J |
| $\Vert\mathbf{u}\Vert$ | 範數（norm），平方即為訊號能量 | $\sqrt{\text{J}}$ |
| $d(\mathbf{u},\mathbf{v})$ | 兩向量距離 | $\sqrt{\text{J}}$ |

> 正交：$\langle\mathbf{u},\mathbf{v}\rangle=0$；正交歸一（orthonormal）：$\langle\phi_j,\phi_k\rangle=1\,(j=k)$、$0\,(j\ne k)$。

**Gram-Schmidt 正交化（Gram-Schmidt orthonormalization）**

$$
\phi_1(t)=\frac{s_1(t)}{\sqrt{E_1}},\qquad
\theta_k(t)=s_k(t)-\sum_{i=1}^{k-1}c_{ki}\phi_i(t),\qquad
c_{ki}=\langle s_k,\phi_i\rangle,\qquad
\phi_k(t)=\frac{\theta_k(t)}{\sqrt{E_{\theta_k}}}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\phi_k(t)$ | 第 $k$ 個正交歸一基底函數 | $1/\sqrt{\text{s}}$ |
| $c_{ki}$ | $s_k$ 在 $\phi_i$ 上的投影係數 | $\sqrt{\text{J}}$ |
| $E_{\theta_k}$ | $\theta_k(t)$ 的能量 | J |

> 若 $\theta_k(t)=0$，代表 $s_k$ 可由前面的基底組合出來，就不加入基底。最後得到 $N\le M$ 個基底。

### 10.4 訊號與雜訊的向量表示

$$
s_i(t)=\sum_{j=1}^{N}s_{ij}\phi_j(t),\qquad s_{ij}=\langle s_i,\phi_j\rangle,\qquad \mathbf{s}_i=(s_{i1},\dots,s_{iN})
$$

$$
E_s=\sum_{i=1}^{M}\|\mathbf{s}_i\|^2P(\mathbf{s}_i)\ \xrightarrow{\text{等機率}}\ \frac{1}{M}\sum_{i=1}^{M}\|\mathbf{s}_i\|^2,\qquad
E_b=\frac{E_s}{\log_2 M},\qquad P_{av}=\frac{E_s}{T}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\mathbf{s}_i$ | 第 $i$ 個訊號的星座點 | $\sqrt{\text{J}}$ |
| $E_s$ | 平均每符號能量 | J |
| $T$ | 符號區間 | s |
| $P_{av}$ | 平均功率 | W |

常見星座：

| 方式 | 星座點 |
|---|---|
| 二元反極性 | $\pm\sqrt{E_b}$（一維） |
| 二元正交 | $(\sqrt{E_b},0)$、$(0,\sqrt{E_b})$（二維） |
| $M$-ary PAM | $a_m A\sqrt{T}$，$a_m\in\{\pm1,\pm3,\dots,\pm(M-1)\}$（一維） |

白雜訊投影 $n_j=\langle n,\phi_j\rangle$：$E\{n_j\}=0$、$E\{n_jn_k\}=\frac{N_0}{2}\delta_{jk}$，所以各分量**獨立同分佈**、變異數 $N_0/2$；不在訊號空間裡的雜訊分量 $n'(t)$ 對判斷沒有影響。

### 10.5 MAP 與 ML 偵測

$$
\text{MAP：選使 } f_{\mathbf{r}}(\mathbf{r}\,|\,\mathbf{s}_k)P(\mathbf{s}_k) \text{ 最大的 } k
$$

$$
\text{ML（等機率）：選使 } \|\mathbf{r}-\mathbf{s}_k\|^2 \text{ 最小的 } k
\;\Longleftrightarrow\;
\max_i\left\{\langle\mathbf{r},\mathbf{s}_i\rangle-\frac{E_i}{2}\right\}
$$

$$
\text{MAP（歐氏距離形式）：}\ \|\mathbf{r}-\mathbf{s}_k\|^2-N_0\ln P(\mathbf{s}_k)\ \text{最小}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\mathbf{r}=\mathbf{s}_i+\mathbf{n}$ | 接收向量 | $\sqrt{\text{J}}$ |
| $f_{\mathbf{r}}(\mathbf{r}\mid\mathbf{s}_k)$ | 概似函數（likelihood function） | — |
| $P(\mathbf{s}_k)$ | 事前機率 | — |
| $E_i$ | 第 $i$ 個訊號的能量 | J |

> 實作：一排 $N$ 個相關器（乘 $\phi_j(t)$ 再積分）或 $N$ 個匹配濾波器 $h_j(t)=\phi_j(T-t)$，兩者在 $t=T$ 的輸出相同。訊號能量都相同時 $E_i/2$ 項可省略。

**決策區域（decision regions）作圖法**：把相鄰星座點連線，畫各連線的**垂直平分線**，平分線圍出的區域就是各點的 ML 決策區域。

### 10.6 ML 偵測器的錯誤率

兩訊號錯誤機率：

$$
P_2\{\mathbf{s}_k\text{ decided}\,|\,\mathbf{s}_i\text{ sent}\}=Q\!\left(\frac{\|\mathbf{s}_k-\mathbf{s}_i\|}{\sqrt{2N_0}}\right)=Q\!\left(\frac{d}{\sqrt{2N_0}}\right)
$$

聯合界（union bound）與最近鄰近似（nearest neighbor approximation）：

$$
P_s\le\frac{1}{M}\sum_{i=1}^{M}\sum_{k\ne i}Q\!\left(\frac{\|\mathbf{s}_k-\mathbf{s}_i\|}{\sqrt{2N_0}}\right),\qquad
P_s\approx\frac{2K}{M}\,Q\!\left(\frac{d_{min}}{\sqrt{2N_0}}\right)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $P_s$ | 平均符號錯誤率 | — |
| $d_{min}$ | 星座最小距離 | $\sqrt{\text{J}}$ |
| $K$ | 距離為 $d_{min}$ 的**不同**點對數目 | — |

位元與符號錯誤率（Gray 編碼、主要錯誤是跳到相鄰點時）：

$$
\text{BER}\approx\frac{P_s}{\log_2 M}
$$

> **Gray 編碼**：相鄰星座點只差 1 個位元，最常見的符號錯誤只造成 1 個位元錯誤。

### 10.7 $M$-ary PAM 的錯誤率

$$
E_s=\frac{C_s^2E_s(M^2-1)}{3}\Rightarrow C_s=\sqrt{\frac{3}{M^2-1}},\qquad
d_{min}=\sqrt{\frac{12E_s}{M^2-1}}
$$

$$
P_s=\frac{2(M-1)}{M}Q\!\left(\sqrt{\frac{6E_s}{(M^2-1)N_0}}\right),\qquad
\text{BER}_{M\text{-PAM}}\approx\frac{2(M-1)}{M\log_2M}Q\!\left(\sqrt{\frac{6\log_2M}{M^2-1}\frac{E_b}{N_0}}\right)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $C_s$ | 讓平均能量等於 $E_s$ 的正規化常數 | — |

> 端點只有 1 個鄰居、內部 $M-2$ 點有 2 個鄰居，精確計算後發現 $M$-PAM 的**最近鄰近似就是精確值**（$K=M-1$）。
> 相對反極性的 SNR/bit 代價為 $10\log_{10}\dfrac{M^2-1}{3\log_2M}$ dB；$M$ 每加倍約多 4 dB。例如 $M$ 變 4 倍，位元率變 3 倍，但要多約 8 dB（發射功率約 6.3 倍）。

## 解題技巧

### 題型一：給 BER 求訊號振幅或功率（例 10.3）

1. 先寫出該線碼用 MF 時的 BER 公式（雙極 NRZ：$\tfrac32Q(\sqrt{E_b/N_0})$；Manchester 屬反極性：$Q(\sqrt{2E_b/N_0})$）。
2. 有係數時先移項（例：$\tfrac32Q(x)=10^{-6}\Rightarrow Q(x)=\tfrac23\times10^{-6}$），再查表得 $x$。
3. 由 $x^2$ 求 $E_b/N_0$，注意題目給的是 $N_0/2$ 還是 $N_0$。
4. 依線碼寫 $E_b$ 與 $A$、$T_b$ 的關係，代入 $T_b=1/R_b$ 解 $A$。
5. 頻寬（第一零點）：NRZ 為 $R_b$，Manchester 為 $2R_b$。

> 例 10.3 對答案用：雙極 NRZ 在 10 kbps／100 kbps／1.55 Mbps 需要 $A=$ 9.67／30.58／120.38 mV；Manchester 需要 4.75／15／59.14 mV，但頻寬是 20／200／3100 kHz（雙極 NRZ 為 10／100／1550 kHz）。

### 題型二：設計匹配濾波器並畫輸出（例 10.2、10.9）

1. $h(t)=s(T_b-t)$：把波形左右翻轉再右移 $T_b$。
2. 輸出 $s_o(t)=s(t)*h(t)$，峰值在 $t=T_b$，**峰值等於脈波能量**。
3. 二元反極性：基底 $\phi_1=s_1/\sqrt{E_b}$，星座 $\pm\sqrt{E_b}$，$d_{min}=2\sqrt{E_b}$，$\text{BER}=Q(d_{min}/\sqrt{2N_0})$。

> 例 10.9：$d_{min}=2A\sqrt{2T_b/3}$，所以 $\text{BER}=Q\big(\sqrt{4A^2T_b/(3N_0)}\big)$。

### 題型三：Gram-Schmidt 求基底與星座（例 10.4、10.5、10.6）

1. 先求 $E_1$，$\phi_1=s_1/\sqrt{E_1}$。
2. 對下一個訊號算投影 $c_{k i}=\int s_k\phi_i\,dt$，扣掉後得 $\theta_k$；$\theta_k=0$ 就跳過。
3. $\theta_k$ 除以自己的 $\sqrt{\text{能量}}$ 得到新基底。
4. 每個訊號的座標就是 $s_{ij}=\int s_i\phi_j\,dt$。
5. 反過來「由星座畫波形」（例 10.6）：$s_i(t)=\sum_j s_{ij}\phi_j(t)$ 直接相加。

> 例 10.4：四個訊號只需要 $N=3$ 個基底。

### 題型四：用星座求符號錯誤率（例 10.7、10.8）

1. 畫出星座點，求 $d_{min}$ 與最近鄰點對數 $K$。
2. 代 $P_s\approx\frac{2K}{M}Q(d_{min}/\sqrt{2N_0})$。
3. 能精確算時（例 10.8 QPSK）：決策區是象限，$P\{\text{correct}\}=[1-Q(\cdot)]^2$，得 $P_s=2Q(\cdot)-Q^2(\cdot)\approx2Q(\cdot)$，和最近鄰近似（$K=4$、$M=4$）一致。
4. 要 BER 時再除以 $\log_2M$（Gray 編碼）。

> 例 10.7：反極性 $d=2\sqrt{E_b}$、正交 $d=\sqrt{2E_b}$，分別得到 $Q(\sqrt{2E_b/N_0})$ 與 $Q(\sqrt{E_b/N_0})$，與 MF 結果相同，所以 MF 也是 ML 意義下的最佳。

## 常見陷阱

- $N_0/2$ 是**雙邊**頻譜密度，代入公式前要確認題目給的是 $N_0$ 還是 $N_0/2$。
- 單極性訊號的 $E_b$ 是**平均**能量（一半時間送 0），所以 $E_b=A^2T_b/2$，不是 $A^2T_b$。
- 最近鄰近似中的 $K$ 是「不同點對」的數目，雙重求和時每對會被算兩次，所以公式前面是 $2K/M$。
- 星座平移不改變 $d_{min}$ 但會增加平均能量（講義的平移方形星座 $E_s=4E_b$，是置中時的兩倍），所以**省能量的星座要以原點為中心**。
- RC 低通濾波器不是最佳接收濾波器，固定代價 0.89 dB；BT 積太大或太小都會變差。
- MF 在 $t_o<T_b$ 取樣會變成非因果、不可實現，所以一律在 $t=T_b$ 取樣。
- $Q(x)$ 查表時注意 BER 前面若有係數（如 $\tfrac32$、$\tfrac{2(M-1)}{M}$），要先除掉再查。
