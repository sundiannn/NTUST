# Ch.15 通道編碼技術

> 依據：老師講義 Chapter 15 Channel Coding Techniques（15.1–15.9）｜更新：2026-11-15

## 重點摘要

- 通道編碼的核心是**加入冗餘位元**，讓接收端能偵測或更正錯誤。$(n,k)$ 區塊碼（block code）把 $k$ 個資料位元對應到 $n$ 位元碼字，碼率 $R_c = k/n$；線性碼的最小距離 $d_{min}$ 等於非零碼字的最小重量。
- 能力判斷：可偵測 $s$ 個錯需 $d_{min} \ge s+1$；可更正 $t$ 個錯需 $d_{min} \ge 2t+1$，即 $t = \lfloor (d_{min}-1)/2 \rfloor$。漢明界（Hamming bound）取等號的是**完美碼**（perfect code），如 (7,4) 漢明碼、(23,12,7) Golay 碼。
- 線性碼用徵狀（syndrome）$\mathbf{s} = \mathbf{y}H^T = \mathbf{e}H^T$ 解碼；循環碼（cyclic code）用生成多項式 $g(D)$ 編碼，除法餘數就是同位位元或徵狀；CRC 專做錯誤偵測。
- 硬決策 ML 解碼 = 最小**漢明距離**；軟決策 ML 解碼 = 最小**歐氏距離**（最大相關）。漸近編碼增益：硬決策 $10\log_{10}(R_c d_{min}/2)$、軟決策 $10\log_{10}(R_c d_{min})$，軟決策多 **3 dB**（摺積碼把 $d_{min}$ 換成 $d_{free}$ 亦同）。
- 摺積碼（convolutional code）有記憶，用 **Viterbi 演算法**做 ML 解碼；**Turbo 碼**以平行串接 + 交錯器 + 迭代 MAP（BCJR）解碼逼近 Shannon 極限；**TCM** 結合編碼與調變，靠集合分割（set partitioning）在**不擴張頻寬**下得到編碼增益。

## 公式整理

### 15.1 線性區塊碼

$$
R_c = \frac{k}{n}, \qquad \text{資訊傳輸率} = R R_c\ \text{bits/s}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $n$ | 碼長（block length） | bits |
| $k$ | 資料位元數；$n-k$ 為同位（parity）位元數 | bits |
| $R$ | 通道傳輸率 | bits/s |

> 單一同位位元碼：$b = \sum_{i=0}^{k-1} m_i$（模 2），可偵測單一錯誤。(3,1) 重複碼把 0→000、1→111。

**漢明重量與距離**：

$$
d_H(\mathbf{x}_1,\mathbf{x}_2) = w_H(\mathbf{x}_1 \oplus \mathbf{x}_2) = w_H(\mathbf{x}_3), \qquad d_{min} = \min\{d_H(\mathbf{x}_1,\mathbf{x}_2) : \mathbf{x}_1 \ne \mathbf{x}_2\}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $w_H(\mathbf{x})$ | 漢明重量（Hamming weight）：1 的個數 | — |
| $d_H$ | 漢明距離（Hamming distance）：不同位置數 | — |
| $d_{min}$ | 最小距離；線性碼中等於非零碼字最小重量 | — |

**生成矩陣與同位檢查矩陣**：

$$
\mathbf{x} = \mathbf{m}G, \qquad G = (I_k \,\vdots\, P), \qquad \mathbf{x} = (\mathbf{m} \,\vdots\, \mathbf{b}),\ \ \mathbf{b} = \mathbf{m}P
$$

$$
H = (P^T \,\vdots\, I_{n-k}), \qquad GH^T = 0, \qquad \mathbf{x} \text{ 是碼字} \iff \mathbf{x}H^T = \mathbf{0}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $G$ | $k \times n$ 生成矩陣（generator matrix），每一列本身是碼字 | — |
| $P$ | $k \times (n-k)$ 同位子矩陣 | — |
| $H$ | $(n-k) \times n$ 同位檢查矩陣（parity-check matrix） | — |

**(7,4) 漢明碼**：

$$
G = \begin{pmatrix} 1&0&0&0&1&0&1 \\ 0&1&0&0&1&1&1 \\ 0&0&1&0&1&1&0 \\ 0&0&0&1&0&1&1 \end{pmatrix}, \qquad
H = \begin{pmatrix} 1&1&1&0&1&0&0 \\ 0&1&1&1&0&1&0 \\ 1&1&0&1&0&0&1 \end{pmatrix}
$$

> 同位位元：$(m_0 + m_1 + m_2,\ m_1 + m_2 + m_3,\ m_0 + m_1 + m_3)$。例：$\mathbf{m} = (1100) \to \mathbf{x} = (1100010)$。

**錯誤向量與徵狀**：

$$
\mathbf{y} = \mathbf{x} + \mathbf{e}, \qquad \mathbf{s} = \mathbf{y}H^T = \mathbf{e}H^T
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\mathbf{e}$ | 錯誤向量（error pattern），錯的位置為 1 | — |
| $\mathbf{s}$ | 徵狀（syndrome），長度 $n-k$ | — |

**(7,4) 漢明碼單一錯誤徵狀表（表 15.2）**：

| 錯誤圖樣 | 徵狀 |
|---|---|
| 0000001 | 001 |
| 0000010 | 010 |
| 0000100 | 100 |
| 0001000 | 011 |
| 0010000 | 110 |
| 0100000 | 111 |
| 1000000 | 101 |

> 同一個徵狀對應 $2^k$ 種錯誤圖樣（錯誤圖樣加上任一碼字），所以要選**重量最小**的那個（ML 原則）。
> 錯誤分**隨機錯誤**與**叢集錯誤**（burst error，長度從第一個錯位元算到最後一個）。

### 15.2 硬決策解碼與偵錯／更正能力

**BSC 上的 ML 解碼**：

$$
\log P(\mathbf{y} \mid \mathbf{x}_m) = d_H\log\left(\frac{p}{1-p}\right) + n\log(1-p)
$$

> $p < 0.5$ 時 $\log[p/(1-p)] < 0$，所以最大化似然 = 最小化漢明距離。

$$
\text{偵測 } s \text{ 個錯：}\ d_{min} \ge s + 1, \qquad \text{更正 } t \text{ 個錯：}\ d_{min} \ge 2t + 1,\ \ t = \left\lfloor\frac{d_{min} - 1}{2}\right\rfloor
$$

**未偵測錯誤機率**：

$$
P_u(e) = \sum_{2^k - 1 \text{ 個非零碼字 } \mathbf{x}} p^{w_H(\mathbf{x})}(1-p)^{n - w_H(\mathbf{x})}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $p$ | BSC 交越機率（= 鏈路 BER） | — |
| $P_u(e)$ | 錯誤圖樣剛好是非零碼字而偵測不到的機率 | — |

> 單一同位位元碼只要錯偶數個就偵測不到，$p$ 很小時由錯 2 個那一項 $\binom{n}{2}p^2(1-p)^{n-2}$ 主導。

<!-- TODO: 待確認：講義式 (15.31) 的第二項寫成 C(n,2) p^4 (1-p)^(n-4)，依「錯偶數個」的意思係數應為 C(n,4)，疑為排版錯誤。 -->

**漢明界**：

$$
2^{n-k} \ge \sum_{i=0}^{t}\binom{n}{i}
$$

> 這是能更正 $t$ 個錯的**必要**條件，不是充分條件；完美碼取等號。

### 15.3 循環碼

$$
D^n + 1 = g(D)h(D), \qquad x(D) = m(D)g(D) \quad (\text{非系統式})
$$

**系統式循環碼編碼**：

$$
D^{n-k}m(D) = q(D)g(D) + b(D), \qquad x(D) = D^{n-k}m(D) + b(D)
$$

**解碼（徵狀多項式）**：

$$
y(D) = x(D) + e(D) = u(D)g(D) + s(D)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $g(D)$ | 生成多項式，次數 $n-k$，必須整除 $D^n + 1$ | — |
| $m(D)$ | 訊息多項式 | — |
| $b(D)$ | 餘式 = 同位位元，次數 $\le n-k-1$ | — |
| $s(D)$ | 徵狀多項式；$s(D) = 0$ 表示無可偵測錯誤 | — |

> 例：$D^7 + 1 = (D+1)(D^3+D^2+1)(D^3+D+1)$；$g(D) = D^3 + D + 1$ 產生 (7,4) 碼。

**常見區塊碼家族**：

| 碼 | 參數 |
|---|---|
| 漢明碼 | $n = 2^m - 1$（$m \ge 3$）、$k = 2^m - m - 1$、$n-k = m$、$d_{min} = 3$；$H$ 的行是所有長度 $n-k$ 的非零二元序列 |
| Golay 碼 | (23,12)，$d_{min} = 7$，可更正 3 個錯；延伸 Golay (24,12)，$d_{min} = 8$ |
| BCH 碼 | $m \ge 3$、$t < (2^m-1)/2$：$n = 2^m - 1$、$n-k \le mt$、$d_{min} \ge 2t+1$ |
| Reed-Solomon 碼 | 非二元 BCH，每符號 $m$ bits：$n = 2^m - 1$ 符號、$n - k = 2t$ 符號、$d_{min} = 2t+1$ 符號；可更正 $t$ 個符號（叢集）錯誤 |
| CRC 碼 | 由原始多項式 $p(D)$ 或 $(D+1)p(D)$ 產生，用於錯誤偵測（如 Ethernet 用 CCITT-32） |

### 15.4 硬決策區塊碼的錯誤效能

$$
P_{cw}(e) \le \sum_{j=t+1}^{n}\binom{n}{j}p^j(1-p)^{n-j} \approx \binom{n}{t+1}p^{t+1}(1-p)^{n-t-1}, \qquad p = Q\left(\sqrt{\frac{2R_cE_b}{N_o}}\right)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $P_{cw}(e)$ | 碼字錯誤機率 | — |
| $E_{cb} = R_cE_b$ | 每個編碼位元的能量 | J |
| $N_o/2$ | 雜訊功率頻譜密度 | W/Hz |

> 完美碼時第一式取等號。

**以重量分布表示的上界**：

$$
P_2(d) \le \left(2\sqrt{p(1-p)}\right)^d, \qquad P_{cw}(e) \le \sum_{d=d_{min}}^{n}A_d\left(2\sqrt{p(1-p)}\right)^d \approx A_{d_{min}}\left(2\sqrt{p(1-p)}\right)^{d_{min}}
$$

$$
P_{cw}(e) \le (2^k - 1)\left(2\sqrt{p(1-p)}\right)^{d_{min}} < 2^k\left(2\sqrt{p(1-p)}\right)^{d_{min}}
$$

$$
P_b \approx \frac{d_{min}}{n}P_{cw}(e) \approx \frac{d_{min}}{n}A_{d_{min}}\left(2\sqrt{p(1-p)}\right)^{d_{min}}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $P_2(d)$ | 誤選重量 $d$ 碼字的成對錯誤機率 | — |
| $A_d$ | 重量為 $d$ 的碼字個數 | — |
| $P_b$ | 解碼後位元錯誤機率 | — |

> (7,4) 漢明碼：$A_3 = 7$、$A_4 = 7$、$A_7 = 1$。

### 15.5 軟決策解碼與編碼增益

$$
r_j = \sqrt{E_{cb}}\,s_{mj} + n_j, \quad s_{mj} = 2x_{mj} - 1, \qquad \text{ML：最大化相關 } c(\mathbf{r},\mathbf{s}_m) = \sum_{j=0}^{n-1} r_j s_{mj}
$$

$$
d_E^2(\mathbf{s}_m,\mathbf{s}_0) = 4E_{cb}d, \qquad P_2(d) = Q\left(\sqrt{\frac{2E_{cb}d}{N_o}}\right)
$$

$$
P_{cw}(e) \le \sum_{d=d_{min}}^{n}A_d\,Q\left(\sqrt{\frac{2E_{cb}d}{N_o}}\right), \qquad P_b \approx \frac{d_{min}}{n}A_{d_{min}}Q\left(\sqrt{\frac{2E_{cb}d_{min}}{N_o}}\right)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $r_j$ | 未量化的接收樣本 | V |
| $s_{mj}$ | 極性訊號（$\pm 1$） | — |
| $d_E$ | 歐氏距離（Euclidean distance） | — |

**編碼增益**（coding gain）：

$$
G = 10\log_{10}\frac{(E_b/N_o)_{uncoded}}{(E_b/N_o)_{coded}}
$$

$$
G_{hd} \approx 10\log_{10}\frac{R_c d_{min}}{2}, \qquad G_{sd} \approx 10\log_{10}R_c d_{min}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $G_{hd}$、$G_{sd}$ | 硬、軟決策的漸近編碼增益（大 SNR 時） | dB |

> 推導用：未編碼 $k$ 位元封包 $P(e) = 1 - (1-p)^k \approx kp$，並用 Chernoff 界 $Q(\sqrt{2x}) \lesssim \tfrac{1}{2}e^{-x}$ 比較指數。
> 3 dB 優勢只在 SNR 很大時成立，中等 SNR 下實際增益小於 3 dB。

### 15.6 摺積碼

| 參數 | 意義 |
|---|---|
| $n$ | 每 $k$ 個輸入位元產生的輸出位元數（不是碼長） |
| $R_c = k/n$ | 碼率 |
| $L$ | 限制長度（constraint length）：一個輸入位元影響的輸出位元數；移位暫存器長 $L-1$ |
| 狀態數 | $2^{L-1}$（由暫存器內容決定） |

$$
x_j(D) = m(D)g_j(D), \quad j = 1, \ldots, n
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $g_j(D)$ | 第 $j$ 個輸出的生成多項式，常寫成八進位（如 $1+D+D^2 \leftrightarrow 111 \leftrightarrow 7$） | — |
| $M$ | 每訊框資訊位元數；輸出長度 $n(M+L-1)$ | bits |

> 範例編碼器（圖 15.12）：$g_1 = 1+D+D^2$（7）、$g_2 = 1+D^2$（5），(2,1,3) 碼。
> 系統式摺積碼必須有一個生成多項式是 0 次（如 $g_1(D) = 1$）。
> 每訊框尾端補 $L-1$ 個 0（tail bits）讓編碼器回到全零狀態，造成少量碼率損失（IS-95 約 5%）。

**路徑度量**：

$$
\text{硬決策：}\ c_{HD}(\mathbf{y},\mathbf{x}^m) = d_H(\mathbf{y},\mathbf{x}^m) \ (\text{取最小}), \qquad
\text{軟決策：}\ c_{SD}(\mathbf{r},\mathbf{s}^m) = \sum_{j=1}^{N}\sum_{i=1}^{n} r_{ji}s_{ji}^m \ (\text{取最大})
$$

**Viterbi 遞迴**：

$$
C_j(i) = \min_{\ell}\{C_{j-1}(\ell) + d_j(\ell, i)\}\ (\text{硬決策}), \qquad C_j(i) = \max_{\ell}\{C_{j-1}(\ell) + d_j(\ell, i)\}\ (\text{軟決策})
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $C_j(i)$ | 深度 $j$、狀態 $S_i$ 的累積路徑度量 | — |
| $d_j(\ell,i)$ | 從 $S_\ell$ 到 $S_i$ 的分支度量 | — |

> 初始化：$C_0(0) = 0$，其他狀態硬決策設 $\infty$、軟決策設 $-\infty$。每個狀態只保留一條**倖存路徑**（survivor），最後回溯（traceback）。運算量隨 $L$ 指數成長，商用多限於 $L < 10$。

### 15.7 摺積碼的錯誤效能

$$
d_{free} > 2t
$$

**轉移函數**（transfer function，(2,1,3) 碼）：

$$
T(D,K,J) = \frac{D^5K^3J}{1 - DJ(K + K^2)} = D^5K^3J + D^6(K^4 + K^5)J^2 + D^7(K^5 + K^6 + K^7)J^3 + \cdots
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $D$ 的指數 | 路徑的漢明重量（距離） | — |
| $K$ 的指數 | 路徑長度（分支數） | — |
| $J$ 的指數 | 該路徑對應的輸入 1 的個數（= 位元錯誤數） | — |

> 由第一項知 $d_{free} = 5$，可更正 2 個錯。

**硬決策 Viterbi**：

$$
P_2(d) < [4p(1-p)]^{d/2}, \qquad P_{se}(e) < \sum_{d=d_{free}}^{\infty}a_d[4p(1-p)]^{d/2}, \qquad P_b < \sum_{d=d_{free}}^{\infty}c_d[4p(1-p)]^{d/2}
$$

$$
P_{se}(e) < T(D,1,1)\Big|_{D=\sqrt{4p(1-p)}}, \qquad P_b < \frac{dT(D,1,J)}{dJ}\Big|_{J=1,\ D=\sqrt{4p(1-p)}}
$$

**軟決策 Viterbi**：

$$
P_{se}(e) < \sum_{d=d_{free}}^{\infty}a_dQ\left(\sqrt{\frac{2dR_cE_b}{N_o}}\right) < \sum a_d e^{-dR_cE_b/N_o}, \qquad P_b < \sum_{d=d_{free}}^{\infty}c_d e^{-dR_cE_b/N_o}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $a_d$ | 距離為 $d$ 的錯誤路徑數 | — |
| $c_d$ | 距離為 $d$ 的錯誤路徑所造成的位元錯誤總數 | — |
| $P_{se}(e)$ | 選錯路徑（序列）的機率 | — |

**漸近編碼增益**：

$$
G_{hd} \approx 10\log_{10}\frac{R_c d_{free}}{2}, \qquad G_{sd} \approx 10\log_{10}R_c d_{free}
$$

**常用摺積碼（表 15.7 節錄）**：

| 碼率 | $L$ | 生成多項式 | $d_{free}$ |
|---|---|---|---|
| 1/2 | 3 | (7, 5) | 5 |
| 1/2 | 5 | (35, 23) | 7 |
| 1/2 | 7 | (171, 133) | 10 |
| 1/2 | 9 | (753, 561) | 12 |
| 1/3 | 3 | (7, 7, 5) | 8 |
| 1/3 | 5 | (37, 33, 25) | 12 |
| 1/3 | 7 | (171, 145, 133) | 14 |

### 15.8 Turbo 碼

- 編碼器：兩個摺積編碼器**平行串接**，第二個前面加偽隨機**交錯器**（interleaver, $\pi$）；輸出 = 系統位元 + 兩組同位位元 → 碼率 1/3；交替刪除（puncturing）同位位元可得 1/2。
- 解碼器：兩個軟入軟出（SISO）解碼器互相交換**外部資訊**（extrinsic information），迭代數次後做硬決策。BCJR 又稱 MAP 或 APP 演算法；另一種是 SOVA。

$$
L(m_i) = \log_e\frac{P(m_i = 1 \mid \text{inputs})}{P(m_i = 0 \mid \text{inputs})}, \qquad L(m_i) = L_{ch}(m_i) + L_{ex}(m_i) + L_{ap}(m_i)
$$

$$
L_{ch}(m_i) = \gamma_c r_i, \qquad \gamma_c = \frac{4E_{cb}}{N_o}, \qquad L_{ap}^2(m_i) = \pi\{L_{ex}^1(m_i)\}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $L(m_i)$ | 對數似然比（LLR）：正負號決定 1 或 0，大小代表信心 | — |
| $L_{ch}$ | 通道資訊 | — |
| $L_{ap}$ | 事前資訊（a priori），第一次迭代設 0 | — |
| $L_{ex}$ | 外部資訊：由其他位元的相關性得到的新資訊 | — |
| $\gamma_c$ | 通道可靠度參數 | — |

> 解碼器 1 的外部資訊 = $L(m_i) - \gamma_c r_i - L_{ap}^1(m_i)$，交錯後成為解碼器 2 的事前資訊。
> 交錯器越大，錯誤平台（error floor）越低，但編解碼延遲越大。

### 15.9 格狀編碼調變（TCM）

$$
d_{min}^2 = \begin{cases} 2E_s, & \text{QPSK} \\ 0.586E_s, & \text{8-PSK} \end{cases}, \qquad P_e \approx 2Q\left(\sqrt{\frac{d_{min}^2}{2N_o}}\right)
$$

$$
P_{se}(e) \approx a_{d_{free}}e^{-d_{free}R_cE_b/N_o}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $E_s$ | 每符號能量 | J |
| $d_{min}$ | 星座最小歐氏距離 | — |
| $a_{d_{free}}$ | 距離 $d_{free}$ 的最近鄰序列平均數 | — |

**8-PSK 集合分割**（$E_s = 1$）：

$$
\Delta_0 = 2\sin(\pi/8) = 0.765, \qquad \Delta_1 = \sqrt{2}, \qquad \Delta_2 = 2
$$

**Ungerboeck 規則**：

1. 平行轉移（由未編碼位元區分）放在距離最大的子集合（如 $C_0 \sim C_3$，$\Delta_2 = 2$）。
2. 從同一狀態出發或進入同一狀態的轉移，放在次大距離的子集合（如 $B_0$、$B_1$，$\Delta_1 = \sqrt{2}$）。
3. 所有訊號點在格狀圖中出現頻率相同。

**4 狀態 8-PSK TCM 的自由距離與增益**：

$$
d^2 > \Delta_1^2 + \Delta_0^2 + \Delta_1^2 = 2 + 0.586 + 2 = 4.586, \qquad d_{free}^2 = \Delta_2^2 = 4
$$

$$
G = 10\log_{10}\frac{d_{free}^2\,(E_s)_{uncoded}}{d_{min}^2\,(E_s)_{coded}} = 10\log_{10}\frac{4}{2} = 3\ \text{dB}\ (\text{vs. 未編碼 QPSK})
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\Delta_i$ | 第 $i$ 層分割後子集合內的最小歐氏距離 | — |
| $d_{free}^2$ | 最小平方自由距離，此例由平行轉移決定 | — |

> 增加狀態數可以消除平行轉移、提高增益（4 狀態 3 dB；16-QAM TCM 對 8-PSK 為 4.36 dB）。實測：4 狀態 8-PSK TCM 在 $10^{-5}$ 約 2.4 dB，4 狀態 16-QAM 約 3.8 dB。
> 解碼：每個分支對應一個子集合，先在子集合中找最接近接收點的訊號點，再用其歐氏距離當分支度量跑 Viterbi。

## 解題技巧

### 題型一：徵狀解碼（例 15.5、15.6、15.8）

1. 計算 $\mathbf{s} = \mathbf{y}H^T$：把 $\mathbf{y}$ 中為 1 的位置所對應的 $H$ 行向量相加（模 2）。
2. $\mathbf{s} = \mathbf{0}$ → 視為無錯；否則查徵狀表找重量最小的錯誤圖樣 $\mathbf{e}$。
3. $\hat{\mathbf{x}} = \mathbf{y} + \mathbf{e}$。

> 例 15.5：$\mathbf{y} = (1001010) \to \mathbf{s} = (100)$。例 15.8：$\mathbf{y} = (0100010)$，$\mathbf{s} = (101) \to \mathbf{e} = (1000000)$，解得 $(1100010)$。例 15.7（直接比距離）：$\mathbf{y} = (1101000)$ 解為 $(1101001)$。

### 題型二：漢明界與能力判斷（例 15.10）

1. $t = \lfloor (d_{min}-1)/2 \rfloor$。
2. 檢查 $2^{n-k} \ge \sum_{i=0}^{t}\binom{n}{i}$；等號成立即為完美碼。

> 例 15.10：(23,12,7)，$t = 3$，$2^{11} = 2048 = 1 + 23 + 253 + 1771$，是完美碼（Golay 碼）。

### 題型三：系統式循環碼編碼與解碼（例 15.12～15.14）

1. 寫出 $m(D)$（向量最左邊是最高次）。
2. 乘上 $D^{n-k}$，用模 2 長除法除以 $g(D)$，取餘式 $b(D)$。
3. 碼字 = 訊息位元接上餘式位元。
4. 解碼：$y(D)$ 除以 $g(D)$ 取餘式 $s(D)$，查表得錯誤圖樣。

> 例 15.13：$g = D^3+D+1$、$\mathbf{m} = (1100)$ → 餘式 $D$ → $\mathbf{b} = (010)$，$\mathbf{x} = (1100010)$。例 15.14：$\mathbf{y} = (1100000)$ → $s(D) = D$ → $\mathbf{e} = (0000010)$ → $(1100010)$。例 15.12 直接相乘得 $(1111111)$，不是系統式。

### 題型四：區塊碼錯誤效能（例 15.9、15.15、15.16）

1. 編碼後的位元能量縮小：$p = Q(\sqrt{2R_cE_b/N_o})$，別直接用 $E_b$。
2. 完美碼的精確值：$P_b = \dfrac{d_{min}}{n}\sum_{j=t+1}^{n}\binom{n}{j}p^j(1-p)^{n-j}$（(7,4)：$\tfrac{3}{7}\sum_{j=2}^{7}$）。
3. 軟決策：$P_b \approx \dfrac{d_{min}}{n}\sum_d A_dQ\left(\sqrt{2R_cE_bd/N_o}\right)$。

> (7,4) 軟決策：$P_b \approx 3Q\left(\sqrt{\tfrac{6\times4E_b}{7N_o}}\right) + 3Q\left(\sqrt{\tfrac{8\times4E_b}{7N_o}}\right) + \tfrac{3}{7}Q\left(\sqrt{\tfrac{14\times4E_b}{7N_o}}\right)$。
> 結果：(7,4) 硬決策在 $P_b = 10^{-8}$ 只比未編碼少約 0.5 dB；軟決策再多約 1.75 dB。

### 題型五：摺積碼編碼（例 15.17）

1. 輸入序列寫成 $m(D)$（第一個位元為 $D^0$）。
2. 分別乘上 $g_1(D)$、$g_2(D)$（模 2）。
3. 兩個輸出逐位交錯成 $x^1_1x^2_1\,x^1_2x^2_2\cdots$。

> 例 15.17：輸入 01101 → $x_1 = 0100011$、$x_2 = 0111001$ → 輸出 00 11 01 01 00 10 11，長度 $n(M+L-1) = 14$。

### 題型六：Viterbi 硬決策解碼（例 15.18）

1. 畫出格狀圖，每個分支標上編碼輸出。
2. 每一深度：分支度量 = 接收碼段與分支輸出的漢明距離；累加後每個狀態只留最小的倖存路徑。
3. 走到最後回到 $S_0$（尾位元），回溯得到碼序列與資訊序列。

> 例 15.18：接收 01 11 00 00 11 01 11 10 → 解出碼序列 00 11 10 00 01 01 11 00，資訊序列 0 1 0 1 1 0 0 0。

<!-- TODO: 待確認：例 15.18 講義寫解碼序列與接收序列的漢明距離為 3，但逐段比對（00/01、11/11、10/00、00/00、01/11、01/01、11/11、00/10）得到 1+0+1+0+1+0+0+1 = 4，需確認。 -->

### 題型七：編碼增益計算

1. 區塊碼：$G_{hd} = 10\log(R_cd_{min}/2)$、$G_{sd} = 10\log(R_cd_{min})$。
2. 摺積碼：把 $d_{min}$ 換成 $d_{free}$。
3. TCM：$G = 10\log\left(d_{free}^2/d_{min,uncoded}^2\right)$（等功率時）。

## 常見陷阱

- 線性碼的 $d_{min}$ 是**非零**碼字的最小重量，別把全零碼字算進去。
- 偵錯是 $d_{min} \ge s+1$，更正是 $d_{min} \ge 2t+1$，兩個式子不要混用。
- 漢明界只是必要條件：滿足了不代表一定存在這樣的碼。
- 編碼後每個傳送位元的能量是 $E_{cb} = R_cE_b$，計算 $p$ 時要乘上 $R_c$。
- 循環碼長除法用**模 2**（相減就是相加，不會借位）。
- 摺積碼的 $n$ 不是碼長；狀態數是 $2^{L-1}$，不是 $2^L$。
- 軟決策「多 3 dB」是**漸近值**，中等 SNR 下達不到。
- Turbo 碼在中高 $E_b/N_o$ 會出現**錯誤平台**；要壓低平台就加大交錯器，代價是延遲。
- TCM 的頻寬沒有增加，因為符號率不變（8-PSK 每符號 3 bits 中 2 bits 是資訊）；增益來自序列間的歐氏距離，不是單一星座點的距離。
