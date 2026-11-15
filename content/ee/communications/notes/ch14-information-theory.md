# Ch.14 資訊理論與壓縮技術

> 依據：老師講義 Chapter 14 Information Theory and Compression Techniques（14.1–14.7）｜更新：2026-11-15

## 重點摘要

- **熵**（entropy）$H(x)$ 是隨機變數不確定性（平均資訊量）的度量，只由機率分布決定；$K$ 個結果時 $0 \le H(x) \le \log_2 K$，等機率時最大。
- **信源編碼定理**（source coding theorem）：無記憶信源每個符號至少要 $H(x)$ bits 才能無失真表示；Huffman 碼平均長度滿足 $H \le \bar{l} < H + 1$，把多個符號合成區塊編碼可逼近 $H$。
- **通道容量** $C = \max I(x;y)$；**通道編碼定理**：只要碼率 $R_c < C$，就存在錯誤率任意小的碼。雜訊限制的是**速率**，不是準確度。BSC：$C = 1 - \mathcal{H}(p)$；BEC：$C = 1 - \varepsilon$。
- 頻寬受限 AWGN 通道：$C = W\log_2(1 + \text{SNR})$。只加頻寬時容量有上限 $1.44P_s/N_o$；可靠通訊必須 $E_b/N_o > -1.6$ dB（**Shannon 極限**）。
- 無失真壓縮（lossless）：Huffman、連續長度編碼（RLE）、Lempel-Ziv（LZ78／LZW）；有失真壓縮（lossy）：JPEG（DCT → 量化 → zigzag → 變長編碼）、MPEG（再加上移動補償與 I／P／B 畫面）。

## 公式整理

### 14.1 熵、條件熵與互資訊

$$
H(x) = -\sum_{x_i} p_x(x_i)\log_2 p_x(x_i)\ \text{bits}, \qquad 0 \le H(x) \le \log_2 K
$$

$$
\mathcal{H}(p) \triangleq -p\log_2 p - (1-p)\log_2(1-p)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $p_x(x_i)$ | 機率質量函數（PMF） | — |
| $K$ | 可能結果數 | — |
| $\mathcal{H}(p)$ | 二元熵函數（binary entropy function），$p = 1/2$ 時最大為 1 | bit |

> $H(x) = 0$ 若且唯若某個 $p_i = 1$；$H(x) = \log_2 K$ 若且唯若全部 $p_i = 1/K$。

**聯合熵與條件熵**：

$$
H(x,y) = -\sum_{x_i}\sum_{y_j} p_{xy}(x_i,y_j)\log_2 p_{xy}(x_i,y_j)
$$

$$
H(x \mid y) = \sum_{y_j} p_y(y_j)\,H(x \mid y = y_j) = -\sum_{x_i}\sum_{y_j} p_{xy}(x_i,y_j)\log_2 p_x(x_i \mid y = y_j)
$$

$$
H(x,y) = H(x) + H(y \mid x) = H(y) + H(x \mid y), \qquad H(x \mid y) \le H(x)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $H(x,y)$ | 聯合熵（joint entropy） | bits |
| $H(x \mid y)$ | 條件熵，又稱疑義度（equivocation）：觀察 $y$ 後對 $x$ 剩下的不確定性 | bits |

> 獨立時 $H(x,y) = H(x) + H(y)$、$H(x \mid y) = H(x)$。「條件化不會增加不確定性」。

**連鎖律**（chain rule）：

$$
H(x_1, x_2, \ldots, x_n) = H(x_1) + H(x_2 \mid x_1) + \cdots + H(x_n \mid x_1, \ldots, x_{n-1})
$$

**微分熵**（differential entropy，連續隨機變數）：

$$
h(x) = -\int_{-\infty}^{\infty} f_x(x)\log_2 f_x(x)\,dx
$$

$$
\text{均勻 } [a,b]：\ h(x) = \log_2(b-a), \qquad \text{高斯 } \mathcal{N}(0,\sigma_x^2)：\ h(x) = \frac{1}{2}\log_2(2\pi e\sigma_x^2)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $f_x(x)$ | 機率密度函數（PDF） | — |
| $\sigma_x^2$ | 變異數 | — |

> 微分熵可以是負的（例如 $b - a < 1$），不能解讀成不確定性。
> 均方值固定為 $\sigma_x^2$ 時，高斯分布使微分熵最大；振幅限制 $|x| \le a$ 時，均勻分布使微分熵最大。

**互資訊**（mutual information）：

$$
I(x;y) = H(x) - H(x \mid y) = \sum_{x_i}\sum_{y_j} p_{xy}(x_i,y_j)\log_2\frac{p_{xy}(x_i,y_j)}{p_x(x_i)p_y(y_j)}
$$

$$
I(x;y) \ge 0, \qquad I(x;y) = I(y;x), \qquad I(x;y) \le \min\{H(x), H(y)\}
$$

> 連續版：$I(x;y) = h(x) - h(x \mid y) = h(y) - h(y \mid x)$。

### 14.2 信源編碼

$$
H(x) = -\sum_{i=1}^{K} p_i\log_2 p_i\ \text{bits/symbol}, \qquad M \text{ 個等機率符號：}\ H(x) = \log_2 M
$$

**典型序列**（typical sequences，長度 $n$ 很大）：

$$
P\{\text{某一典型序列}\} \approx 2^{-nH(x)}, \qquad \text{典型序列個數} \approx 2^{nH(x)}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $n$ | 序列長度 | symbols |
| $K^n$ | 全部可能序列數 | — |

> 定理 14.1：$n$ 個 i.i.d. 符號可用不少於 $nH(x)$ bits 表示而幾乎不失真；壓到比 $nH(x)$ 更少一定會遺失資訊。
> 有記憶信源改用熵率（entropy rate）$H'(x) = \lim_{n\to\infty} H(x_n \mid x_1, \ldots, x_{n-1})$。

### 14.3 通道編碼

**通道轉移矩陣**：

$$
\mathbf{P} = [p_{ij}],\quad p_{ij} = P\{y = b_j \mid x = a_i\}, \qquad \mathbf{p}_y = \mathbf{p}_x\mathbf{P}
$$

$$
\text{BSC：}\ \mathbf{P} = \begin{pmatrix} 1-p & p \\ p & 1-p \end{pmatrix}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\mathbf{p}_x, \mathbf{p}_y$ | 輸入、輸出 PMF 列向量 | — |
| $p$ | BSC 交越機率（crossover probability） | — |
| $\varepsilon$ | BEC 抹除機率（erasure） | — |

**通道容量**：

$$
C = \max_{p_x} I(x;y)\ \text{bits/channel use}
$$

$$
\text{對稱通道：}\ C = \log_2 N - H(\mathbf{p}), \qquad H(\mathbf{p}) = -\sum_{j=1}^{N} p_{ij}\log_2 p_{ij}
$$

$$
\text{BSC：}\ C = 1 - \mathcal{H}(p), \qquad \text{BEC：}\ I(x;y) = (1-\varepsilon)\mathcal{H}(\alpha),\ C = 1 - \varepsilon
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $N$ | 輸出字母個數 | — |
| $\mathbf{p}$ | 通道矩陣任一列（各列互為排列） | — |
| $\alpha$ | BEC 輸入 $P\{x=0\}$ | — |

> 對稱（或弱對稱）通道在輸入均勻分布時輸出也均勻，達到容量。無雜訊 $q$ 元通道 $C = \log_2 q$。

**碼率與通道編碼定理**：

$$
R_c = \frac{\log_2 M}{n} = \frac{k}{n}, \qquad M = 2^{nR_c}, \qquad R = \frac{R_c}{T}\ \text{bits/s}
$$

$$
\text{BSC：}\ 2^{nR_c}\,2^{n\mathcal{H}(p)} \le 2^n \;\Rightarrow\; R_c \le 1 - \mathcal{H}(p) = C
$$

$$
\text{Gallager：}\ P_{cw}(e) \cong e^{-nE(R_c)}, \quad E(R_c) > 0 \text{ for } R_c < C
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $M$ | 碼字個數 | — |
| $n$ | 碼長 | bits |
| $T$ | 傳送 $R_c$ 資訊位元的時間 | s |
| $E(R_c)$ | 錯誤指數（error exponent） | — |

### 14.4 AWGN 通道容量

$$
y_i = x_i + n_i, \qquad \frac{1}{n}\sum_{i=0}^{n-1}x_i^2 \le P_{av}, \qquad C = \frac{1}{2}\log_2\left(1 + \frac{P_{av}}{N_o/2}\right)\ \text{bits/channel use}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $P_{av}$ | 輸入平均功率限制 | W |
| $N_o/2$ | 雜訊變異數（雙邊功率頻譜密度） | W/Hz |

> 球體填充（sphere packing）：可分辨碼字數 $M \le \left(1 + \dfrac{P_{av}}{N_o/2}\right)^{n/2}$。

**頻寬受限 AWGN 通道**：每秒 $2W$ 個樣本，每樣本功率 $P_s/(2W)$，雜訊變異數 $N_o/2$。

$$
C = W\log_2\left(1 + \frac{P_s}{N_oW}\right) = W\log_2(1 + \text{SNR})\ \text{bits/s}, \qquad \text{SNR} = \frac{P_s}{N_oW}
$$

$$
\lim_{W\to\infty} C = \frac{P_s}{N_o}\log_2 e = 1.44\frac{P_s}{N_o}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $W$ | 通道頻寬 | Hz |
| $P_s$ | 訊號平均功率 | W |
| $N_o$ | 單邊雜訊功率頻譜密度 | W/Hz |

**Shannon 極限與功率－頻寬取捨**：

$$
\frac{C}{W} = \log_2\left(1 + \frac{E_b C}{N_o W}\right), \qquad \frac{E_b}{N_o} = \frac{2^{\eta_{ideal}} - 1}{\eta_{ideal}},\quad \eta_{ideal} = \frac{C}{W}
$$

$$
\lim_{W\to\infty}\frac{E_b}{N_o} = \ln 2 = 0.693 \;\Rightarrow\; \left(\frac{E_b}{N_o}\right)_{\text{Shannon limit}} = 10\log_{10}0.693 = -1.6\ \text{dB}
$$

$$
\text{實際系統（} R < C \text{）：}\ \frac{E_b}{N_o} > \frac{2^{\eta} - 1}{\eta}, \qquad \eta = \frac{R}{W}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $E_b = P_s/C$ | 每位元能量 | J |
| $\eta$ | 頻譜效率（spectral efficiency） | bits/s/Hz |

> 頻寬受限區（$\eta \gg 1$）曲線變平，提高 $\eta$ 要大量增加 $E_b/N_o$；功率受限區（$\eta \ll 1$）曲線很陡，稍降 $E_b/N_o$ 要大量增加頻寬。未編碼的調變都距容量曲線約 10 dB，這就是通道編碼的潛在增益。

### 14.5 無失真壓縮

**Huffman 碼**：

$$
\bar{l} = \sum_{a_i} p_x(a_i)\,l(a_i), \qquad H(x) \le \bar{l} < H(x) + 1, \qquad \text{效率} = \frac{H(x)}{\bar{l}}
$$

$$
\text{以 } n \text{ 個符號為一組：}\ H(x) \le \bar{l} < H(x) + \frac{1}{n}, \qquad \bar{l} = \frac{\bar{l}_n}{n}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\bar{l}$ | 平均碼長 | bits/symbol |
| $l(a_i)$ | 符號 $a_i$ 的碼字長度 | bits |
| $\bar{l}_n$ | 每組 $n$ 個符號的平均碼長 | bits/block |

- Huffman 建樹：機率由大到小排列 → 反覆合併兩個機率最小的節點 → 上分支標 0、下分支標 1 → 由根讀到葉就是碼字。任何碼字都不是另一個碼字的字首（prefix-free）。
- **連續長度編碼**（run-length encoding, RLE）：把連續出現的常見符號長度編碼，適合傳真等長串白點的資料，不適合照片。
- **LZ78**：找出字典中最長的相符字首 prefix，送出碼字 (pointer, 新符號 s)，把 prefix.s 加入字典。
- **LZW**：字典先放入全部單一字元（常見實作 0～255，前 128 個為 ASCII），只送出 prefix 的 pointer；新片語從 256 開始編號。解碼端可自行重建相同字典，不必傳字典。

### 14.6 影像壓縮：JPEG

**2-D DCT 與 IDCT**（$N \times N$ 區塊，JPEG 用 $8 \times 8$）：

$$
F(k,\ell) = \frac{\alpha(k,\ell)}{N}\sum_{i=0}^{N-1}\sum_{j=0}^{N-1} f(i,j)\cos\left(\frac{(2i+1)k\pi}{2N}\right)\cos\left(\frac{(2j+1)\ell\pi}{2N}\right), \quad k,\ell = 0,1,\ldots,N-1
$$

$$
f(i,j) = \alpha(i,j)\sum_{k=0}^{N-1}\sum_{\ell=0}^{N-1} F(k,\ell)\cos\left(\frac{(2i+1)k\pi}{2N}\right)\cos\left(\frac{(2j+1)\ell\pi}{2N}\right)
$$

$$
\alpha(k,\ell) = \begin{cases} 1, & k,\ell = 0 \\ 2, & \text{otherwise} \end{cases}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $f(i,j)$ | 像素值 | — |
| $F(k,\ell)$ | DCT 係數；$F(0,0)$ 為 DC 係數，其餘 63 個為 AC 係數 | — |

> DCT 本身沒有損失，只是把能量集中到左上角的低頻係數（能量集中性 energy compaction）。

**位準移位與量化**：

$$
\text{位準移位：}[0, 2^p - 1] \to [-2^{p-1}, 2^{p-1} - 1], \qquad G(k,\ell) = \text{sgn}[F(k,\ell)]\left\lfloor\frac{|F(k,\ell)|}{Q(k,\ell)} + 0.5\right\rfloor
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $p$ | 每像素輸入位元數（8 bit 時減 128） | bits |
| $Q(k,\ell)$ | 量化表步階（亮度表左上角 16、右下角 99） | — |
| $G(k,\ell)$ | 量化後係數 | — |

- **zigzag 掃描**：把 $8\times8$ 係數排成一維，讓零連成長串；剩下全為零時用 EOB。
- **DC 係數**：與前一區塊做差分，以 (size, amplitude) 表示；size 用 Huffman 碼，正值 amplitude 用二進位、負值用 1 的補數。
- **AC 係數**：以 {Run/Size, Amplitude} 編碼，Run 是前面零的個數。

**色彩空間與色度次取樣**：

$$
Y = 0.3R + 0.59G + 0.11B, \qquad C_b = -0.17R - 0.33G + 0.50B, \qquad C_r = 0.50R - 0.42G + 0.081B
$$

$$
U = -0.147R - 0.289G + 0.436B, \qquad V = 0.615R - 0.515G - 0.1B
$$

| 格式 | 意義 |
|---|---|
| 4:4:4 | 色度不降取樣 |
| 4:2:2 | 水平 2:1、垂直不變（$2\times1$），數位相機常用 |
| 4:2:0 | 水平、垂直都 2:1（$2\times2$），每 4 個 Y 配 1 個 $C_b$、1 個 $C_r$；JPEG、MPEG 使用 |

> 人眼對亮度細節比色彩敏感，所以只降色度解析度。1.5～2 bits/pixel 時 JPEG 影像在感知上幾乎無失真。

### 14.7 視訊壓縮：MPEG

$$
\text{未壓縮位元率} = \left(8N_Y + 8N_{C_b} + 8N_{C_r}\right) \times \text{訊框率}
$$

| 情況 | 計算 | 結果 |
|---|---|---|
| SDTV 720×480、25 frames/s，4:4:4（24 bits/pixel） | $24 \times 720 \times 480 \times 25$ | 207.36 Mbps |
| 同上，4:2:0 | $(8\cdot720\cdot480 + 2\cdot8\cdot360\cdot240)\times25$ | 103.68 Mbps |
| HDTV 1920×1080、30 frames/s，4:4:4 | $24 \times 1920 \times 1080 \times 30$ | 1.5 Gbps |
| 同上，4:2:0 | $(8\cdot1920\cdot1080 + 2\cdot8\cdot960\cdot540)\times30$ | 746 Mbps |

| 畫面類型 | 編碼方式 | 壓縮率 |
|---|---|---|
| I-frame | 畫面內編碼（像 JPEG），可隨機存取、快轉 | 最低 |
| P-frame | 參考最近的 I 或 P 畫面做移動補償預測 | 中 |
| B-frame | 同時參考前後的 I／P 畫面 | 最高，但編碼最慢、延遲最大 |

- 移動補償：以 $16\times16$ 亮度巨區塊（macroblock）在前一畫面找最佳匹配，傳送**移動向量**（motion vector, MV）與 DCT 編碼後的預測誤差。
- MPEG-1：VCR 品質，約 1.5 Mbps；MPEG-2：SDTV 4～6 Mbps，HDTV 20～40 Mbps。

## 解題技巧

### 題型一：計算熵、條件熵、互資訊（例 14.1、14.3、14.6）

1. 由聯合 PMF 表，**列加總**得 $p_x$、**行加總**得 $p_y$。
2. $H(x,y)$ 直接對全部格子套公式。
3. 用 $H(x \mid y) = H(x,y) - H(y)$ 求條件熵，比逐一算條件 PMF 快。
4. $I(x;y) = H(x) - H(x \mid y)$。

> 對答案用：例 14.1 $H = 1.923$ bits；例 14.3 $H(x,y) = 3.75$、$H(x) = H(y) = 2$、$H(x \mid y) = H(y \mid x) = 1.75$ bits；例 14.6 $H(x \mid y) = 1.625$、$I(x;y) = 0.375$ bit。

### 題型二：典型序列個數（例 14.8、14.9）

1. 先算 $H(x)$。
2. 全部序列 $K^n$，典型序列 $2^{nH(x)}$，非典型 = 兩者相減。

> 例 14.9：$H = 2.75$ bits/symbol，$n = 16$：全部 $8^{16} = 2^{48}$，典型 $2^{44}$，非典型 $15 \times 2^{44}$。

### 題型三：通道容量（例 14.11～14.16）

1. 判斷通道是否對稱（各列互為排列、各行也互為排列）。
2. 對稱：$C = \log_2 N - H(\text{任一列})$。
3. BEC 或容易算 $H(x \mid y)$ 時：用 $C = \max[H(x) - H(x \mid y)]$。
4. 求輸出機率：$\mathbf{p}_y = \mathbf{p}_x\mathbf{P}$。

> 例 14.14：$\mathbf{p}_y = (9/24,\ 8/24,\ 7/24)$，$C = \log_2 3 - H(1/2, 1/3, 1/6) = 1.5849 - 1.4591 = 0.1258$。例 14.12 四符號通道只用兩個輸入即可無誤傳送，$C = 1$。例 14.16 雜訊打字機 $C = \log_2 9$。

### 題型四：AWGN 容量（例 14.17）

1. SNR 由 dB 換成倍數。
2. $C = W\log_2(1 + \text{SNR})$；反求 SNR：$\text{SNR} = 2^{C/W} - 1$，再換回 dB。

> 例 14.17：3.3 kHz、30 dB → $C \approx 32.9$ kb/s；要 53.3 kbps 需 SNR ≈ 48 dB。

### 題型五：Huffman 編碼（例 14.18、14.19）

1. 機率排序，每次合併最小的兩個，畫出樹。
2. 由根往下讀碼字，算 $\bar{l} = \sum p_i l_i$。
3. 與 $H(x)$ 比較（$H \le \bar{l} < H + 1$），求效率。
4. 兩兩成組編碼時，平均長度要**除以 2** 才是每符號長度。

> 例 14.18：機率 {0.3, 0.25, 0.2, 0.15, 0.1}，碼長 2、2、2、3、3，$\bar{l} = 2.25$、$H = 2.23$；64,000 個符號用固定 3 bits 需 192 kbits，Huffman 平均 144 kbits。
> 例 14.19：單符號 $\bar{l} = 1.4$、$H = 1.295$；成對編碼 2.67 bits/pair → 1.335 bits/symbol，更接近熵。

<!-- TODO: 待確認：圖 14.22 右側碼字表列 a=0、b=10、c=11、d=110、e=111，但 c=11 是 d、e 的字首，不是合法前綴碼，且與例 14.18 計算用的碼長（2,2,2,3,3）不符；依樹狀圖讀出應為 a=00、b=01、c=10、d=110、e=111，需確認講義圖表。 -->

### 題型六：RLE 與 LZ 編碼（例 14.20～14.23）

1. RLE：數每個 1 之前有幾個 0，查表換成 4-bit 碼字（例 14.20 長度 12、11、3、9、6 → 共 20 bits，原本 41 bits）。
2. LZ78：逐步找最長已知字首，輸出 (pointer, 新符號)，字典編號從 1 開始（例 14.21 分段為 0、01、2、1、21、03、10、13、3、210、33、331）。
3. LZW：輸出的是 prefix 的 pointer，新片語從 256 起編號；解碼時若收到的 pointer 還不在字典裡，就用「prefix + prefix 第一個字元」。

<!-- TODO: 待確認：例 14.20 最後一段長度 6 的碼字，講義寫 1010，但表 14.2 中長度 6 對應 0110，需確認何者正確。 -->

### 題型七：JPEG 係數編碼（例 14.25、14.26）

1. 每個係數除以量化表步階並四捨五入。
2. zigzag 掃描得一維序列，尾端全零用 EOB。
3. AC 係數寫成 (Run/Size, Amplitude)：Run = 前面零的個數，Size = 幅度所需位元數（例：$-4$ 前有 1 個 0 → (1/3, −4)）。
4. DC 係數取與前一區塊的差值再編碼。

<!-- TODO: 待確認：講義 DC 編碼例子寫「14 以 (4, 01110) 表示、編成 10101110；−14 編成 10110001」，但依表 14.7 size=4 的幅度只有 4 bits（14 → 1110），位元數兜不起來，需確認原文。 -->

## 常見陷阱

- 熵的對數要用**以 2 為底**，單位才是 bits；計算機用 ln 時記得除以 ln 2。
- $H(x \mid y = y_j)$ 是對「事件」的條件熵；$H(x \mid y)$ 是對隨機變數的平均，兩者不同。
- 微分熵可以是負值，不能和離散熵直接比較。
- BSC 在 $p = 1$ 時容量也是 1（每次都錯，反過來判斷即可）；$p = 1/2$ 時容量才是 0。
- SNR、$E_b/N_o$ 用在公式裡一律是**倍數**，不是 dB。
- 只增加頻寬不能讓容量無限增加，上限是 $1.44P_s/N_o$。
- 成對 Huffman 編碼的平均長度是「每對」，要除以 2 才能和單符號熵比較。
- JPEG 的有損步驟是**量化**，DCT 與變長編碼本身都是無失真的。
