# Ch.13 數位多工與同步

> 依據：老師講義 Chapter 13 Digital Multiplexing and Synchronization（13.1–13.5）｜更新：2026-11-15

## 重點摘要

- 數位接收機的同步分三層：**載波同步**（carrier synchronization，產生同頻同相的本地載波）→ **符號／位元同步**（symbol synchronization，回復時脈決定取樣時刻）→ **訊框同步**（frame synchronization，找出訊框起點以便解多工）。
- 分時多工（time-division multiplexing, TDM）把多路低速支流訊號（tributary）交錯成一路高速訊號。**準同步數位階層**（plesiochronous digital hierarchy, PDH）的支流速率只是「標稱相同」，要靠**位元填充**（bit stuffing）對齊；**SONET/SDH** 則是同步多工、以位元組交錯，並用指標位元組（H1、H2）做頻率調整（justification）。
- 有效率的調變會把載波抑制掉，所以接收端要先用**非線性運算**（平方、四次方）重新產生載波諧波譜線，再用鎖相迴路（PLL）追蹤；**Costas loop** 能同時完成載波回復與解調。迴路相位誤差變異數與 $B_N T/(S_L\rho_L)$ 成正比。
- NRZ 資料在位元率上沒有離散譜線，時脈回復電路（CRC）要先做**邊緣偵測**再接 PLL；為了避免多級中繼器累積抖動（jitter），抖動峰值要小於 0.1 dB，得到阻尼係數 $\zeta > 4.6$。
- 訊框同步靠偵測**訊框對齊字**（frame alignment word, FAW）；FAW 越短越不容易漏抓（$P_D$ 大），越長越不容易被資料誤仿（$P_{FS}$ 小），兩者互相衝突。好的 FAW（如 Barker 序列）自相關旁瓣要小。

## 公式整理

### 13.1 數位多工與 PDH

**T1／DS1 訊框**：24 路語音，每路 8 kHz 取樣、8 bit，加 1 個訊框位元。

$$
\text{DS1 速率} = (24 \times 8 + 1)\ \tfrac{\text{bits}}{\text{frame}} \times 8000\ \tfrac{\text{frames}}{\text{s}} = 193 \times 8000 = 1.544\ \text{Mbps}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| DS0 | 單一路 PCM 語音（8 kHz × 8 bit） | 64 kbps |
| DS1 | T1 多工器輸出，193 bits／訊框，訊框長 125 μs | 1.544 Mbps |

> 訊框位元 F 以 0101… 交替圖樣標出訊框起點。

**PDH 階層**：

| 北美 | 組成 | 速率 | 歐洲（CCITT） | 組成 | 速率 |
|---|---|---|---|---|---|
| DS1 | 24 × DS0 | 1.544 Mbps | CEPT-1（E1） | 32 × 64 kbps（30 路使用者） | 2.048 Mbps |
| DS2 | 4 × DS1 | 6.312 Mbps | CEPT-2 | 4 × CEPT-1 | 8.448 Mbps |
| DS3 | 7 × DS2 | 44.736 Mbps | CEPT-3 | 4 × CEPT-2 | 34.368 Mbps |
| DS4 | 6 × DS3 | 274.176 Mbps | CEPT-4 | 4 × CEPT-3 | 139.264 Mbps |

> E1 的 32 個通道中，1 個給信令（signaling），1 個給訊框對齊與鏈路維護，所以只有 30 路載使用者訊務。

**M12 多工器（DS2 訊框）**：4 個子訊框 × 6 個區塊 × 49 bits，每個區塊第 1 位元是附加位元（overhead, OH）。

$$
\text{DS2 訊框長} = 49 \times 6 \times 4 = 1176\ \text{bits}, \qquad \text{資訊位元} = 48 \times 6 \times 4 = 1152\ \text{bits}, \qquad \text{OH} = 24\ \text{bits}
$$

$$
\text{訊框率} = \frac{6.312\ \text{Mbps}}{1176\ \text{bits/frame}} = 5367.35\ \text{frames/s}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| F 位元 | 訊框位元，每 DS2 訊框 8 個，圖樣 01 | — |
| M 位元 | 多訊框位元，每 DS2 訊框 4 個，圖樣 0111，用來辨識子訊框 | — |
| C 位元 | 填充指示位元，每子訊框 3 個；三個都是 1 表示有填充，都是 0 表示沒填充 | — |

> 3 個 C 位元構成 (3, 1) 單錯更正碼，降低填充位置判斷錯誤的機率。
> 每個 DS2 訊框對每路 DS1 只有一次填充機會，所以**每路 DS1 的最大填充率 = DS2 訊框率 ≈ 5.367 kbps**。

### 13.2 SONET

$$
\text{STS-1 速率} = 8\ \tfrac{\text{bits}}{\text{byte}} \times 9\ \text{列} \times 90\ \text{行} \times 8000\ \tfrac{\text{frames}}{\text{s}} = 51.84\ \text{Mbps}
$$

$$
\text{STS-1 酬載速率} = 8 \times 9 \times 84 \times 8000 = 48.384\ \text{Mbps}, \qquad \text{STS-}N = N \times 51.84\ \text{Mbps}
$$

| 項目 | 說明 |
|---|---|
| STS-1 訊框 | 9 列 × 90 行 = 810 bytes，125 μs，逐列由左到右傳送 |
| 傳輸附加（transport overhead） | 前 3 行，共 27 bytes；A1、A2 = F628 hex 標示訊框起點 |
| 同步酬載封包（synchronous payload envelope, SPE） | 其餘 87 行；第 1 行為路徑附加（path overhead, POH） |
| 固定填充行 | SPE 中第 30、59 行，不載資料 |
| 使用者酬載 | 剩下 84 行，756 bytes |
| STS-N 訊框 | N × 810 bytes：9 列、$3N$ 行附加、$87N$ 行 SPE |

**SONET／SDH 速率表**：

| STS-N | OC-N | 速率（Mbps） | SDH |
|---|---|---|---|
| STS-1 | OC-1 | 51.84 | — |
| STS-3 | OC-3 | 155.52 | STM-1 |
| STS-12 | OC-12 | 622.08 | STM-4 |
| STS-48 | OC-48 | 2488.32 | STM-16 |
| STS-192 | OC-192 | 9953.28 | STM-64 |
| STS-768 | OC-768 | 39813.12 | STM-256 |

**指標位元組 H1、H2（共 16 bits）**：

| 欄位 | 位元數 | 說明 |
|---|---|---|
| 新資料旗標（new data flag, NDF） | 4 | 0110 = 正常；1001 = 新指標值（至少重複 3 個訊框） |
| 備用 | 2 | — |
| 指標值 | 10 | 從 H3 後到 SPE 第一個位元組（J1）的偏移量；0 表示 SPE 從第 4 列第 4 行開始。位元標記為 IDIDIDIDID |

| 情況 | 處理方式 | 指標變化 |
|---|---|---|
| 酬載比本地訊框**慢** → **正填充**（positive justification） | 在 H3 後面塞一個虛位元組，反相 **I 位元**通知接收端 | 下一訊框指標 **+1** |
| 酬載比本地訊框**快** → **負填充**（negative justification） | 多出的位元組寫進 **H3** 位置，反相 **D 位元**通知接收端 | 下一訊框指標 **−1** |

### 13.3 載波同步

**平方迴路**（squaring loop，BPSK）：

$$
x(t) = A_c I(t)\cos(2\pi f_c t + \phi_o), \qquad x^2(t) = \frac{A_c^2}{2}\left[1 + \cos(4\pi f_c t + 2\phi_o)\right] \quad (\because I^2(t) = 1)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $I(t)$ | 基頻資料，取值 $\pm 1$ | — |
| $A_c$ | 載波振幅 | V |
| $\phi_o$ | 緩慢變化的輸入相位偏移 | rad |

> 平方後調變消失，留下 $2f_c$ 的純弦波；PLL 跑在 $2f_c$，最後用 ÷2 預除器（prescaler）得到本地載波。M-PSK 則改用 M 次方裝置與 ÷M 預除器（QPSK 為**四倍迴路** quadrupling loop，PLL 跑在 $4f_c$）。

**Costas 迴路**（BPSK）：

$$
i(t) = A_c I(t)\cos(\phi_o - \hat{\phi}_o), \qquad q(t) = A_c I(t)\sin(\phi_o - \hat{\phi}_o)
$$

$$
e(t) = i(t)\,q(t) = \frac{A_c^2}{2}\sin(2\Delta\phi), \qquad \Delta\phi = \phi_o - \hat{\phi}_o
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\hat{\phi}_o$ | VCO 輸出相位 | rad |
| $e(t)$ | 誤差訊號（作用同 PLL 控制電壓） | V² |

> 鎖定時 $\Delta\phi \approx 0$，上臂 $i(t) \approx A_c I(t)$ 就是解調後的資料，所以 Costas loop 又叫 Costas 解調器。

**PLL 相位抖動（無調變載波 + 窄頻高斯雜訊）**：

$$
\sigma_{\hat\phi_o}^2 = \frac{N_o}{A_c^2}\int_{-\infty}^{\infty}|H(f)|^2 df = \frac{2N_o B_N}{A_c^2} = \frac{B_N T}{\rho_L}, \qquad \rho_L = \frac{E_s}{N_o} = \frac{A_c^2 T}{2N_o}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $B_N$ | PLL 單邊等效雜訊頻寬 | Hz |
| $T$ | 符號時間 | s |
| $\rho_L$ | 迴路訊雜比（每符號 SNR） | 無單位 |
| $H(f)$ | PLL 相位轉移函數 | — |

**各種載波回復迴路（表 13.4）**：

$$
\sigma_{\hat\phi_o}^2 = \frac{B_N T}{S_L \rho_L}
$$

| 迴路 | 平方損失（squaring loss）$S_L$ | 適用 |
|---|---|---|
| PLL | 不適用（$\sigma^2 = B_N T/\rho_L$） | 未調變載波 |
| 平方迴路、Costas 迴路 | $S_L = \dfrac{1}{1 + 0.5/\rho_L}$ | BPSK |
| 四倍迴路 | $S_L = \dfrac{1}{1 + \left[\dfrac{4.5}{\rho_L} + \dfrac{6}{\rho_L^2} + \dfrac{1.5}{\rho_L^3}\right]}$ | QPSK |

> $S_L < 1$，代表平方過程產生的「訊號×雜訊」與「雜訊×雜訊」項會放大相位誤差。
> 縮小 $B_N$ 可以降低相位誤差，但會犧牲 PLL 追蹤相位變化的能力。

**二階 PLL 頻率步階的穩態誤差（例 13.6 用）**：

$$
\theta_e(\infty) = \frac{\Delta\omega}{K}, \qquad K = \frac{\omega_n}{2\zeta}, \qquad B_N = \frac{\omega_n}{8\zeta} \;\Rightarrow\; \theta_e(\infty) = \frac{\Delta\omega}{4B_N} = \frac{\Delta\omega T}{4 B_N T}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\Delta\omega$ | 頻率步階 | rad/s |
| $K$ | 開迴路增益 | 1/s |
| $\omega_n$ | 自然頻率 | rad/s |
| $\zeta$ | 阻尼係數 | 無單位 |

### 13.4 符號同步（時脈回復）

- 重建數位訊號三步驟：**濾波／等化 → 時脈回復 → 再生**（regeneration：門檻比較器 + 脈波產生器）。
- 最佳取樣時刻（timing phase）在眼圖張開最大處。
- 邊緣偵測器：XOR 閘一端加延遲，或微分器接全波整流。
- XOR 相位偵測器：相位差 $\theta_e$ 在 $0 \sim \pi$ 內可鎖定；$f_{in} = f_o$ 時 $\theta_e = \pi/2$，輸出直流 $K_{PD}\pi/2$。
- 抖動常用**時間區間誤差**（time interval error, TIE）表示。

**主動 lead-lag 迴路濾波器的二階 PLL**：

$$
F(s) = \frac{1 + s\tau_2}{1 + s\tau_1}, \qquad H(s) = \frac{\omega_n^2 + s\left(2\zeta\omega_n - \dfrac{\omega_n^2}{K}\right)}{s^2 + 2s\zeta\omega_n + \omega_n^2}
$$

$$
K = K_{VCO}K_{PD}, \qquad \omega_n = \sqrt{\frac{K}{\tau_1}}, \qquad \zeta = \frac{1}{2}\omega_n\left(\tau_2 + \frac{1}{K}\right)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\tau_1, \tau_2$ | 迴路濾波器時間常數 | s |
| $K_{VCO}$、$K_{PD}$ | VCO 增益、相位偵測器增益 | — |

**抖動轉移函數**（jitter transfer function，低通特性），令 $Z_w \triangleq \zeta\omega_n$：

$$
|H(j\omega)|_{\omega = \omega_n} = \sqrt{1 + \frac{1}{4\zeta^2}}, \qquad 20\log_{10}\sqrt{1 + \frac{1}{4\zeta^2}} < 0.1\ \text{dB} \;\Rightarrow\; \zeta > 4.6
$$

$$
B_N = \frac{\omega_n}{8\zeta}(1 + 4\zeta^2) \approx \frac{\zeta\omega_n}{2} \;\Rightarrow\; Z_w = 2B_N
$$

$$
K = 2Z_w\frac{\tau_1}{\tau_2}, \qquad \zeta = \sqrt{\frac{Z_w \tau_2}{2}}, \qquad \Delta\omega_P = K\sqrt{2F(0)F(\infty)} = 2\sqrt{2}\,Z_w\sqrt{\frac{\tau_1}{\tau_2}}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $Z_w$ | $\zeta\omega_n$，等於 PLL 雜訊頻寬的 2 倍 | 1/s |
| $\Delta\omega_P$ | 捕獲（pull-in）範圍 | rad/s |
| $F(0)=1,\ F(\infty)=\tau_2/\tau_1$ | lead-lag 濾波器的低頻、高頻增益 | — |

> 實務上 $\zeta$ 取 4～10。抖動規格給了 $\zeta$ 的下限與 $Z_w$ 的上限；要加大捕獲範圍就加大 $\tau_1/\tau_2$，但受限於可實現的 $K$。

### 13.5 訊框同步

**正確偵測 FAW 的機率**（位元錯誤獨立）：

$$
P_D = (1-p)^N \quad (\text{要求完全吻合}), \qquad P_D = \sum_{i=0}^{\varepsilon}\binom{N}{i}p^i(1-p)^{N-i} \quad (\text{容許} \le \varepsilon \text{ 個錯})
$$

**FAW 被隨機資料誤仿的機率**（與 BER 無關）：

$$
P_{FS} = \frac{1}{2^N}\sum_{i=0}^{\varepsilon}\binom{N}{i}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $N$ | FAW 長度 | bits |
| $p$ | 鏈路 BER | — |
| $\varepsilon$ | 容許的漢明距離（錯誤位元數） | — |
| $P_D$ | 正確偵測機率（漏抓機率為 $1-P_D$） | — |
| $P_{FS}$ | 誤仿（false simulation）機率 | — |

**數位相關器與 FAW 自相關**：

$$
v_k = \sum_{i=0}^{N-1} a_{k-i}c_i, \qquad v_k\big|_{\max} = \sum_{i=0}^{N-1}c_i c_i = N, \qquad R_c(k) = \sum_{i=0}^{N-1}c_i c_{(i+k)\bmod N}
$$

$$
\text{Barker 序列：}\ R(k) = \begin{cases} N, & k = 0 \\ 0, & k \ne 0,\ \text{奇數} \\ -1, & k \ne 0,\ \text{偶數} \end{cases}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $c_i$ | FAW（相關器抽頭權重），取值 $\{1,-1\}$ | — |
| $a_i$ | 移位暫存器中的輸入位元，取值 $\{1,-1\}$ | — |
| $v_k$ | 相關器輸出 | — |

> 錯 1 個位元時 $v_k = N-2$，所以門檻設在略低於 $N-2$，可接受 0 或 1 個錯誤的 FAW。
> Barker 序列旁瓣大小最多 1，長度有 1、2、3、4、5、7、11、13；需要更長的序列時可用 Neuman-Hofman 序列。

**訊框對齊狀態機**：

| 模式 | 狀態 | 行為 |
|---|---|---|
| 同框（in-frame） | SYNC | 只在預定位置檢查 FAW；偶爾錯一次 → PREALARM |
| 同框 | PREALARM | 下一訊框找到 FAW → 回 SYNC；連續 $\alpha$ 次失敗 → SEARCH |
| 失框（out-of-frame） | SEARCH | 逐位元移動尋找吻合位置 → PRESYNC |
| 失框 | PRESYNC | 連續 $\beta$ 個訊框都吻合 → SYNC；否則從下一位元重新搜尋 |

> 平均保持時間（holding time）與 $P_D$ 成正比；最大平均重新框定時間（reframe time）包含搜尋時間（與 $P_{FS}$ 有關）和確認時間（與 $P_D$ 有關）。

## 解題技巧

### 題型一：TDM／PDH 速率與填充率（例 13.1、13.2、13.3）

1. 先算訊框位元數與訊框率：速率 = 每訊框位元數 × 訊框率。
2. DS2 的附加位元速率 = 訊框率 × 每訊框 OH 位元數。
3. 每路 DS1 **最大**允許速率 = (DS2 速率 − OH 速率) ÷ 4。
4. 每路 DS1 **最小**允許速率 = 最大速率 − 最大填充率（= DS2 訊框率）。
5. 實際填充率 = 最大允許速率 − 該支流實際速率。

> 對答案用：例 13.1 DS1 = 1.544 Mbps；例 13.2 OH = 128.816 kbps、最大 1.545796 Mbps、最小 1.540429 Mbps；例 13.3 四路填充率 0、1.196、1.346、5.367 kbps。

### 題型二：SONET 傳播延遲變化（例 13.4）

1. 總長度 ÷ 光纖傳播速度 = 傳播延遲（1000 km ÷ $2 \times 10^8$ m/s = 5 ms）。
2. 延遲變化 = 延遲 × 速度變化比例（0.0008% → 40 ns）。
3. 多出／少掉的脈波數 = 位元率 × 延遲變化（約 100 個），這就是 SONET 要用指標調整的原因。

### 題型三：載波回復迴路的相位誤差（例 13.5、13.6）

1. 迴路 SNR $\rho_L$ 若以 dB 給，**先換成倍數**（10 dB → 10）。
2. 依調變選 $S_L$：BPSK 用 $1/(1+0.5/\rho_L)$，QPSK 用四倍迴路公式。
3. $T = 1/\text{符號率}$，代入 $\sigma^2 = B_N T/(S_L\rho_L)$。
4. 有頻率步階時：總相位誤差 ≈ RMS 雜訊誤差 + 穩態誤差 $\Delta\omega T/(4B_N T)$。
5. **平方迴路內**的相位是原本的 2 倍：頻率步階要乘 2；而 ÷2 預除器後容許 0.5 rad，代表迴路內可容許 1 rad。

> 例 13.5：$S_L = 1/1.05 = 0.952$。
> 例 13.6：$\sigma = 0.324\sqrt{B_N T}$，$\Delta\omega T = \pm\pi/3$（平方後 $\pm 2\pi/3$），穩態誤差 $\pi/(6B_N T)$；解 $0.324\sqrt{B_N T} + \pi/(6B_N T) \le 1$ 得 $B_N T \ge 0.72$。取 $\zeta = 1$：$\omega_n = 8\zeta B_N = 6.912 \times 10^3$ rad/s、$K = 4B_N = 3.456 \times 10^3$、$\tau_1 = 72\ \mu$s。

<!-- TODO: 待確認：例 13.5 題目給 B_N = 50 kHz、位元率 1 Mbps，則 B_N T = 0.05，算得相位誤差變異數約 5.25×10^-3 rad²；但講義計算式寫成 5×10^3×1×10^-6，答案為 5.25×10^-4 rad²，兩者差 10 倍，需確認題目數據或答案。 -->

### 題型四：時脈回復 PLL 設計（SONET OC-48 範例）

1. 由抖動峰值 < 0.1 dB 得 $\zeta > 4.6$。
2. 由抖動轉移樣板決定 $Z_w$ 上限（OC-48：$Z_w \le 6$ MHz）。
3. $\tau_2 = 2\zeta^2/Z_w$（$\ge 7.05\ \mu$s）。
4. 給定 $K$，用 $\tau_1/\tau_2 = K/(2Z_w)$ 求 $\tau_1$（$K = 2 \times 10^8$ → 16.67；取 $\tau_2 = 8\ \mu$s 得 $\tau_1 \approx 135\ \mu$s）。

### 題型五：訊框同步搜尋時間（例 13.7）

1. 交替圖樣 0101…：某位置被判定「不是訊框位元」平均需要 $E\{x\} = 3$ 次測試（$P\{x=n\} = (1/2)^{n-1}$, $n \ge 2$）。
2. 每次測試間隔一個訊框（193 bits），所以每排除一個錯誤位置花 $(2 \times 193) + 1$ 個位元時間。
3. 隨機起點平均要排除 $193/2 = 96.5$ 個位置 → 平均 $96.5 \times 387 = 37{,}345$ 個位元後鎖定，再進入 PRESYNC 確認 $\beta$ 個訊框。

## 常見陷阱

- PDH 是**位元**交錯、SONET 是**位元組**交錯，不要混淆。
- DS2 速率 6.312 Mbps 大於 4 × 1.544 = 6.176 Mbps，多出來的容量是給填充位元與附加位元用的。
- STS-1 酬載只算 84 行（扣掉 3 行傳輸附加、1 行 POH、2 行固定填充），不是 87 行。
- 正填充是「反相 I 位元、指標 +1、虛位元組放在 H3 **之後**」；負填充是「反相 D 位元、指標 −1、資料寫在 H3 **裡面**」，方向不要記反。
- 平方／四倍迴路的 PLL 跑在 $2f_c$／$4f_c$，要經預除器才是本地載波；計算相位誤差時要注意是在迴路內還是預除器後。
- 降低 $B_N$ 可減少雜訊造成的相位誤差，但會降低追蹤能力，題目常要求在兩者間取捨。
- $P_{FS}$ 與鏈路 BER 無關；$P_D$ 才與 BER 有關。
