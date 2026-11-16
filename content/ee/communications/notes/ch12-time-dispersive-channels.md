# Ch.12 時間色散通道的數位傳輸

> 依據：老師講義 Chapter 12 Digital Signal Transmission Through Time Dispersive Channels（12.1–12.8）｜更新：2026-11-17

## 重點摘要

- 頻寬受限的通道會把脈波拉長、互相重疊，造成**符號間干擾（intersymbol interference, ISI）**；電話雙絞線的原因是振幅與延遲失真，行動通道的原因是多路徑延遲擴散（delay spread）。
- **奈奎斯特零 ISI 準則（Nyquist criterion）**：頻寬 $W$ 的基頻通道最多每秒傳 $2W$ 個符號（奈奎斯特速率），此時只能用 sinc 脈波；實務用**升餘弦（raised cosine, RC）**脈波，代價是多出 $\alpha$ 比例的超額頻寬。
- 理想頻寬受限通道的最佳收發濾波器是**根升餘弦（RRC）**各分一半，可同時滿足零 ISI 與匹配濾波；**雙二元（duobinary）**訊號刻意引入可控 ISI，用可實現的濾波器達到奈奎斯特速率，但逐符號偵測要多付約 2.1 dB。
- **等化器（equalizer）**：迫零（ZF）是通道反濾波器，會放大雜訊；MMSE 在 ISI 與雜訊放大間取平衡；通道未知或時變時用 **LMS 適應性等化**。
- **決策回授等化器（DFE）**用已判定的符號消掉後游（postcursor）ISI，雜訊放大較少，在有頻譜零點的通道遠勝線性等化器，缺點是錯誤傳播（約 2 dB 代價）。

## 公式整理

### 12.1 頻寬受限通道中的 PAM 訊號

$$
x(t)=\sum_n a_nh_T(t-nT),\qquad
P_r(f)=H_T(f)H_c(f)H_R(f),\qquad
y(t)=\sum_n a_np_r(t-nT)+n(t)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $a_n$ | 第 $n$ 個 $M$-ary 振幅，$\{\pm A,\pm3A,\dots,\pm(M-1)A\}$ | V |
| $T$ | 符號時間，符號率 $D=1/T$ | s |
| $H_T,H_c,H_R$ | 發射濾波器、通道、接收濾波器頻率響應 | — |
| $p_r(t)$ | 整體（發射＋通道＋接收）脈衝響應 | — |

取樣後：

$$
y_k=a_kp_r[0]+\underbrace{\sum_{n\ne0}a_{k-n}p_r[n]}_{\text{ISI}}+n_k,\qquad
D_{peak}=(M-1)A\sum_{n\ne0}|p_r[n]|
$$

$$
\text{零 ISI 條件：}\ p_r[k]=\begin{cases}1,&k=0\\0,&k\ne0\end{cases}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $p_r[k]=p_r(kT)$ | $T$ 間隔取樣的整體響應 | — |
| $D_{peak}$ | 峰值失真（peak distortion），最壞情況下的 ISI | V |

**眼圖（eye diagram）判讀**：

| 眼圖特徵 | 代表意義 |
|---|---|
| 眼睛張開高度（取樣點） | 雜訊邊限（noise margin） |
| 眼睛張開寬度 | 對取樣時間偏移的敏感度 |
| 內側斜率 | 對時序抖動（timing jitter）的敏感度，越陡越敏感 |
| 最佳取樣點 | 眼睛張最開的時刻 |

> $M$-PAM 的眼圖是 $M-1$ 個二元眼睛垂直堆疊，$M$ 越大每個眼睛越小；RC 滾降係數 $\alpha$ 越小、雜訊越大，眼睛越閉合。

### 12.2 奈奎斯特零 ISI 準則

$$
P_r^{folded}(f)=\sum_{n=-\infty}^{\infty}P_r\!\left(f+\frac{n}{T}\right)=T,\qquad |f|\le\frac{1}{2T}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $P_r^{folded}(f)$ | 摺疊（混疊）頻譜，週期 $1/T$ | — |

依符號率 $D$ 與通道頻寬 $W$ 分三種情況：

| 情況 | 結果 |
|---|---|
| $D>2W$ | 不可能零 ISI |
| $D=2W$（奈奎斯特速率） | 唯一解 $P_r(f)=T,\ \lvert f\rvert\le\frac{1}{2T}$，$p_r(t)=\mathrm{sinc}(t/T)$ |
| $D<2W$ | 有很多解，例如 RC 頻譜（對 $1/2T$ 奇對稱，vestigial symmetry） |

> 奈奎斯特頻寬 $B_{Nyquist}=1/(2T)$ 是零 ISI 所需的最小頻寬。sinc 脈波不因果、衰減只有 $1/|t|$、對取樣時間偏移極敏感，實務上不可行。

**RC 脈波**：

$$
B_{abs}=\frac{1+\alpha}{2T},\qquad
\alpha=\frac{B_{abs}-B_{Nyquist}}{B_{Nyquist}}
$$

$$
\text{基頻：}\ D=\frac{2W}{1+\alpha},\qquad \text{帶通（$M$-PSK、$M$-QAM）：}\ D=\frac{W}{1+\alpha}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\alpha$ | 滾降係數（roll-off factor）＝超額頻寬比例 | — |
| $W$ | 通道頻寬 | Hz |
| $D$ | 可達符號率 | symbol/s |

> $\alpha=0.5$ 時 $D=\tfrac43W$（比奈奎斯特速率少 33%）；$\alpha=1$ 時 $D=W$（少 50%）。

### 12.3 頻寬受限 AWGN 通道的收發濾波器

理想通道（$H_c(f)=1,\ |f|\le W$）：

$$
|H_T(f)|=|H_R(f)|=\sqrt{P_{RC}(f)}
$$

> 這就是**根升餘弦（root raised cosine, RRC）**訊號：同時滿足奈奎斯特準則與匹配濾波。注意 RRC 脈波**本身不是奈奎斯特脈波**，兩個 RRC 串接後才是 RC。

非理想但已知的通道（$|f|\le W$）：

$$
\text{做法一：}\ |H_T(f)|=\frac{\sqrt{P_{RC}(f)}}{|H_c(f)|},\ |H_R(f)|=\sqrt{P_{RC}(f)}
\qquad
\text{做法二（平分補償）：}\ |H_T(f)|=|H_R(f)|=\frac{\sqrt{P_{RC}(f)}}{\sqrt{|H_c(f)|}}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $P_{RC}(f)$ | 升餘弦頻譜 | — |
| $H_c(f)$ | 通道頻率響應 | — |

二元反極性的錯誤率（做法二，取樣值 $y_k=a_k+n_k$，$a_k=\pm A$）：

$$
\sigma^2=\frac{N_0}{2}\int_{-W}^{W}\left|\frac{P_{RC}(f)}{H_c(f)}\right|df,\qquad
E_b=A^2\int_{-W}^{W}\left|\frac{P_{RC}(f)}{H_c(f)}\right|df,\qquad
\text{BER}=Q\!\left(\frac{A}{\sigma}\right)
$$

$$
\text{BER}=Q\!\left(\left[\int_{-W}^{W}\left|\frac{P_{RC}(f)}{H_c(f)}\right|df\right]^{-1}\sqrt{\frac{2E_b}{N_0}}\right)
\ \xrightarrow{\text{理想通道}}\ Q\!\left(\sqrt{\frac{2E_b}{N_0}}\right)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\sigma^2$ | 取樣點雜訊變異數 | V² |
| $A$ | 發送振幅 | V |

> 雜訊放大造成的 SNR/bit 損失為 $10\log_{10}\Big[\big(\int_{-W}^{W}\lvert P_{RC}/H_c\rvert\,df\big)^{-2}\Big]$ dB；理想通道時 $\int_{-W}^{W}P_{RC}\,df=1$，結果與無限頻寬的反極性訊號相同。

### 12.4 部分響應（雙二元）訊號

**雙二元（duobinary）**：

$$
p_r[k]=\begin{cases}1,&k=0,1\\0,&\text{otherwise}\end{cases},\qquad
P_r(f)=2Te^{-j\pi fT}\cos(\pi fT),\ |f|\le\frac{1}{2T},\qquad
p_r(t)=\mathrm{sinc}\!\left(\frac{t}{T}\right)+\mathrm{sinc}\!\left(\frac{t-T}{T}\right)
$$

**修正雙二元（modified duobinary）**：

$$
p_r[-1]=1,\ p_r[1]=-1,\qquad
P_r(f)=j2T\sin(2\pi fT),\ |f|\le\frac{1}{2T},\qquad
p_r(t)=\mathrm{sinc}\!\left(\frac{t+T}{T}\right)-\mathrm{sinc}\!\left(\frac{t-T}{T}\right)
$$

> 兩者都能以 $D=2W$ 傳輸（零超額頻寬），頻譜連續、容易用實際濾波器近似；尾巴以 $1/|t|^2$ 衰減，對取樣抖動較穩健。修正雙二元在 $f=0$ 有零點，適合不通直流的變壓器耦合雙絞線。

**偵測與預編碼（precoding）**：

$$
y_k=a_k+a_{k-1}+n_k\in\{-2A,0,2A\}\ (\text{機率 }1/4,1/2,1/4)
$$

$$
d_k=b_k\oplus d_{k-1},\qquad a_k=A(2d_k-1),\qquad
\hat{b}_k=\begin{cases}1,&|y_k|<A\\0,&|y_k|>A\end{cases}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $b_k$ | 原始資料位元 | — |
| $d_k$ | 預編碼後位元（講義初始 $d_0=0$） | — |
| $a_k$ | 極性發送位準 $\pm A$ | V |

> 不預編碼時要用 $\hat{a}_k=y_k-\hat{a}_{k-1}$，前一個判錯會**錯誤傳播**；預編碼後只看當下的 $|y_k|$，就沒有錯誤傳播。

$$
\sigma_n^2=N_0T\int_{-1/2T}^{1/2T}\lvert\cos(\pi fT)\rvert\,df=\frac{2N_0}{\pi},\qquad
E_b=A^2\,2T\int_{-1/2T}^{1/2T}\lvert\cos(\pi fT)\rvert\,df=\frac{4A^2}{\pi}\ \Rightarrow\ A=\sqrt{\frac{\pi E_b}{4}}
$$

$$
\text{BER}=\frac{3}{2}Q\!\left(\frac{A}{\sigma_n}\right)=\frac{3}{2}Q\!\left(\frac{\pi}{4}\sqrt{\frac{2E_b}{N_0}}\right)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\sigma_n^2$ | 接收濾波器輸出雜訊變異數（講義式 12.77） | V² |
| $E_b$ | 每位元能量（講義式 12.80） | J |

> 和反極性 $Q(\sqrt{2E_b/N_0})$ 比，多需要 $(4/\pi)^2$，約 **2.1 dB**；原因是逐符號偵測沒有利用樣本間的相關性。

### 12.5 線性等化器

橫向濾波器（transversal filter，$2N+1$ 個抽頭）：

$$
z_k=\sum_{i=-N}^{N}c_iy_{k-i},\qquad p_{eq}[k]=\sum_{i=-N}^{N}c_iq[k-i]
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $c_i$ | 等化器抽頭係數（tap coefficient） | — |
| $q[k]$ | 正規化為單位能量的整體取樣響應 | — |
| $p_{eq}[k]$ | 等化後的整體響應 | — |

> 接收端用與 RRC 發射濾波器匹配的濾波器 $h_R(t)=h_T(-t)$，輸出雜訊樣本彼此獨立、變異數 $N_0/2$。

**迫零等化器（zero-forcing equalizer, ZFE）**：

$$
H_{eq}^{ZF}(z)=\frac{1}{Q(z)},\qquad
S_{n}(e^{j2\pi fT})=\frac{N_0/2}{|Q(e^{j2\pi fT})|^2}
$$

$$
\text{有限長度：}\ \mathbf{Q}\,\mathbf{c}=\mathbf{p}_{eq}=(0,\dots,0,1,0,\dots,0)^T\ \Rightarrow\ \mathbf{c}_{opt}=\mathbf{Q}^{-1}\mathbf{p}_{eq}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $Q(z)$ | $q[k]$ 的 z 轉換 | — |
| $\mathbf{Q}$ | 由 $q[k]$ 組成的 $(2N+1)\times(2N+1)$ 矩陣，第 $(i,j)$ 元素為 $q[i-j]$ | — |

> ZFE 就是反濾波器：通道衰減越大的頻率，等化器增益越大，雜訊也被放大越多，通道有零點時特別糟。$2N+1$ 抽頭只能在主峰兩側各迫出 $N$ 個零。眼睛原本張開時，ZF 解使峰值失真最小。

**最小均方誤差等化器（MMSE equalizer）**：

$$
J=E\{(z_k-a_k)^2\},\qquad
\mathbf{R}_{yy}\mathbf{c}_{opt}=\mathbf{r}_{ay}\ \Rightarrow\ \mathbf{c}_{opt}=\mathbf{R}_{yy}^{-1}\mathbf{r}_{ay},\qquad
J_{min}=\sigma_a^2-\mathbf{c}_{opt}^T\mathbf{r}_{ay}
$$

$$
R_{yy}[i,j]=\sigma_a^2\sum_nq_nq_{n+|i-j|}+\frac{N_0}{2}\delta_{ij},\qquad
r_{ay}[i]=\sigma_a^2\,q_{-i}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\mathbf{R}_{yy}$ | 等化器輸入的自相關矩陣 | — |
| $\mathbf{r}_{ay}$ | 發送符號與輸入的互相關向量 | — |
| $\sigma_a^2$ | 符號變異數（二元極性時為 1） | — |

> 推導用**正交原理（orthogonality principle）**：誤差 $e_k$ 與延遲線上的樣本正交。

無限長度 MMSE：

$$
H_{eq}^{MMSE}(e^{j2\pi fT})=\frac{Q^*(e^{j2\pi fT})}{|Q(e^{j2\pi fT})|^2+\dfrac{N_0}{2\sigma_a^2}}
$$

> 高 SNR 時趨近 $1/Q$，與 ZF 相同；低 SNR 時在消除 ISI 與雜訊放大間取最佳折衷。

### 12.6 適應性等化（adaptive equalization）

最陡下降法（steepest descent）：

$$
\mathbf{c}(k+1)=\mathbf{c}(k)-\mu\mathbf{g}_k,\qquad \mathbf{g}_k=\nabla_{\mathbf{c}}J=2(\mathbf{R}_{yy}\mathbf{c}(k)-\mathbf{r}_{ay})
$$

LMS 演算法（least mean square，用瞬時梯度取代期望值）：

$$
\mathbf{c}(k+1)=\mathbf{c}(k)+\mu\,e_k\mathbf{y}_k,\qquad e_k=a_k-z_k
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\mu$ | 步階大小（step size） | — |
| $\mathbf{y}_k$ | 延遲線上的 $2N+1$ 個樣本 | — |
| $e_k$ | 誤差訊號（訓練模式用已知 $a_k$，決策導向模式用判定結果 $\hat{a}_k$） | — |

> MSE 曲面是二次超拋物面，只有一個全域最小值。LMS 的係數會在最佳點附近隨機擺動，擺幅與 $\mu$ 成正比；$\mu$ 大追蹤快但擺動大，要折衷。
> 操作模式：**訓練（data-aided）**、**決策導向（decision-directed，需 SNR 夠好）**、**盲等化（blind）**；實務常先訓練再轉決策導向追蹤。

### 12.7 決策回授等化器（DFE）

$$
y_k=a_kq_0+\underbrace{\sum_{n=1}^{L}a_{k-n}q_n}_{\text{postcursor（過去符號）}}+\underbrace{\sum_{n=-L}^{-1}a_{k-n}q_n}_{\text{precursor（未來符號）}}+n_k
$$

$$
w_k=\sum_{i=-N_1}^{0}c_iy_{k-i}-\sum_{n=1}^{N_2}b_n\hat{a}_{k-n},\qquad
b_n=\frac{p_{eq}[n]}{p_{eq}[0]}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $c_i$ | 前饋等化器（FFE）係數，消除 precursor ISI | — |
| $b_n$ | 回授等化器（FBE）係數，消除 postcursor ISI | — |
| $\hat{a}_{k-n}$ | 已判定的過去符號 | — |
| $N_2$ | FBE 抽頭數，需 $\ge$ postcursor 樣本數 $M$ | — |

> DFE 是**非線性**的（回授路徑經過判決器）。回授部分是無雜訊的過去決策加權和，所以**不增加輸出雜訊**。適應性實作：$b_m(k+1)=b_m(k)+\mu e_k\hat{a}_{k-m}$。
> 通道估計：送 $N_{train}$ 個已知訓練符號，$\hat{\mathbf{q}}=(\mathbf{A}^T\mathbf{A})^{-1}\mathbf{A}^T\mathbf{y}$。

### 12.8 等化器效能

$$
\sigma_{eq}^2=\frac{N_0}{2}\sum_{i=-N}^{N}c_i^2=\frac{N_0}{2}\eta_{NE},\qquad
\xi_{ISI}=p_{eq}[0]-\sum_{n\ne0}|p_{eq}[n]|
$$

$$
\text{BER}\le Q\!\left(\sqrt{\frac{2E_b\,\xi_{ISI}^2}{N_0\,\eta_{NE}}}\right)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\eta_{NE}$ | 雜訊放大因子（noise enhancement factor） | — |
| $\xi_{ISI}$ | 等化後最壞情況的眼睛張開度 | — |

> 這是一個寬鬆上界（把殘餘 ISI 用峰值失真代入）；較精確的 BER 要對所有符號序列平均（Monte Carlo 模擬）。最壞情況的 SNR/bit 代價由 $\xi_{ISI}$ 與 $\eta_{NE}$ 決定。

## 解題技巧

### 題型一：判斷奈奎斯特脈波與滾降係數（例 12.1）

1. 畫出摺疊頻譜，找出讓 $\sum P_r(f+n/T)$ 為常數的 $1/2T$（通常是頻譜過渡帶的中點）。
2. 符號率 $D=1/T$。
3. 超額頻寬 $=B_{abs}-1/(2T)$，$\alpha=$ 超額頻寬$/(1/2T)$。

> 例 12.1：梯形頻譜在 2500～3750 Hz 過渡，取 $1/2T=3125$ Hz → $D=6250$ symbol/s，超額頻寬 625 Hz，$\alpha=0.2$。

### 題型二：給頻寬與位元率設計 $M$-PAM（例 12.2）

1. 用 $D=2W/(1+\alpha)$ 求可達符號率。
2. $k=R_b/D$，**往上取整數**，$M=2^k$。

> 例 12.2：$W=2400$ Hz、$\alpha=0.5$ → $D=3200$；$12000/3200=3.75\to k=4$，$M=16$。

### 題型三：設計最佳收發濾波器（例 12.3）

1. 由 $1/T$ 與 $\alpha$ 寫出 $P_{RC}(f)$ 的三段式（平坦段、餘弦過渡段、0）。
2. 平分補償：$|H_T|=|H_R|=\sqrt{P_{RC}/|H_c|}$，在每一段分別代入通道 $|H_c(f)|$。

> 例 12.3：4.8 kbps、$\alpha=0.5$ → 平坦段 $|f|<1200$ Hz、過渡段 1200～3600 Hz；通道 $H_c=0.5+0.5\cos(\pi f/3600)$。

### 題型四：雙二元訊號（表 12.1、例 12.4）

1. 預編碼：$d_k=b_k\oplus d_{k-1}$（$d_0=0$），$a_k=\pm A$。
2. 接收：$y_k=a_k+a_{k-1}$，得 $0$ 或 $\pm2A$。
3. 解碼：$|y_k|<A\to1$，$|y_k|>A\to0$。
4. 速率 $D=2W$；BER 用 $\tfrac32Q\big(\tfrac{\pi}{4}\sqrt{2E_b/N_0}\big)$，係數先移項再查表。

> 例 12.4：$W=1.5$ MHz → 3 Mb/s；BER $=10^{-6}$ 時 $Q$ 的引數 $=4.835$，得 $E_b/N_0\approx19.06$（約 12.8 dB）。

### 題型五：ZF 等化器（例 12.5、12.6）

1. 寫出 $q[k]$，峰值失真 $=\sum_{k\ne0}|q[k]|$，最壞眼睛張開度 $=q[0]-$ 峰值失真。
2. **無限長**：$H_{eq}(z)=1/Q(z)$，用 z 轉換反求抽頭。
3. **有限長 $2N+1$ 抽頭**：用 $q[-2N]\sim q[2N]$ 建 $\mathbf{Q}$ 矩陣，解 $\mathbf{c}=\mathbf{Q}^{-1}\mathbf{p}_{eq}$（等於 $\mathbf{Q}^{-1}$ 的中間那一行）。
4. 卷積 $q*c$ 檢查：主峰兩側各有 $N$ 個零，更遠處仍有殘餘 ISI。

> 例 12.5：$q[k]=e^{-k}$（$k\ge0$），峰值失真 0.582，眼睛張開 41.8%；$Q(z)=1/(1-e^{-1}z^{-1})$，所以 ZFE 只要 2 個抽頭 $\{1,-e^{-1}\}$。
> 例 12.6：5 抽頭 ZFE 係數約 $(0.4615,0.2351,0.9692,-0.4443,0.0726)$；31 抽頭時才能有效等化高頻衰減。

### 題型六：MMSE 等化器（例 12.7）

1. 由 SNR/bit 求 $N_0$（$E_b=1$、SNR 10 dB → $N_0=0.1$），$\sigma_a^2=1$。
2. 用自相關公式建 $\mathbf{R}_{yy}$（對角線要加 $N_0/2$），$\mathbf{r}_{ay}$ 由 $q_{-i}$ 排出。
3. $\mathbf{c}=\mathbf{R}_{yy}^{-1}\mathbf{r}_{ay}$。

> 例 12.7：5 抽頭 MMSE 係數約 $(0.2478,0.2289,0.7780,-0.3856,-0.0754)$，等化後主峰只有 0.8571（不是 1），5 抽頭效果不佳；31 抽頭可把通道等化到奈奎斯特要求約 3 dB 以內。

### 題型七：DFE（例 12.8）

1. 判斷 ISI 是 precursor 還是 postcursor；只有 postcursor 時不需要 FFE。
2. $b_n=q_n/q_0$，畫出回授路徑。
3. 判決正確時 $w_k=a_k+n_k$，無雜訊放大，$\text{BER}\approx Q(\sqrt{2E_b/N_0})$；低 SNR 時要考慮錯誤傳播。

> 例 12.8：$q=\{1,0,0.5\}$ → $b_2=0.5$，$w_k=y_k-0.5\hat{a}_{k-2}$。

## 常見陷阱

- 奈奎斯特速率 $2W$ 是**基頻**的上限；帶通線性調變（PSK、QAM）是 $W$ symbol/s，用 RC 時再除以 $1+\alpha$。
- RRC 脈波本身**不是**零 ISI 脈波，要收發兩個串起來變 RC 才是。
- 由位元率算 $k$ 時要無條件進位，捨去會超過頻寬。
- 迫零等化器把 ISI 完全消掉不代表 BER 好，通道有深衰減或零點時雜訊放大會讓 BER 出現**錯誤地板（error floor）**。
- 有限長 ZFE 只控制 $2N+1$ 個輸出點，其外仍有殘餘 ISI；抽頭數要足夠。
- 雙二元不預編碼會錯誤傳播；預編碼的初始位元要和解碼端一致。
- DFE 的錯誤傳播通常不是災難性的，錯誤成短串出現，講義給的代價約 2 dB SNR/bit。
- LMS 的步階 $\mu$ 太大會發散或擺動大，太小收斂慢、跟不上通道變化。
- 講義用 Proakis 的三種通道做比較：一般通道線性等化器約差 2.5 dB；高頻有零點的通道線性等化器出現錯誤地板、DFE 代價不到 6 dB；奈奎斯特頻帶內有深零點時 DFE 約差 10 dB。
