# Ch.2 變壓器

> 依據：老師講義 Chapter 2 Transformers（2.1–2.10）｜更新：2026-11-15
>
> 老師指定習題：2-1、2-2、2-4、2-6、2-7、2-9、2-14、2-17、2-20、2-23
>
> 講義目錄中 2.11–2.14 已被老師劃掉，例 2-5 的 (d) 小題也已劃掉，不在本次範圍。

## 重點摘要

- 變壓器（transformer）靠**共同磁通**把交流功率從一個電壓準位轉到另一個電壓準位，**頻率不變**；理想變壓器只改變電壓、電流的**大小**，不改變**相角**，輸入功率＝輸出功率。
- 阻抗經過變壓器會乘上 $a^2$：$Z_L' = a^2 Z_L$。分析含變壓器的電路時，先把一側「轉換（referring）」到另一側的電壓準位，再用一般電路方法求解。
- 實際變壓器的等效電路＝繞組電阻 $R_P, R_S$＋漏電抗 $X_P, X_S$＋激磁支路（$R_C$ 並聯 $X_M$）；用**開路測試**求激磁支路、**短路測試**求串聯阻抗。
- 標么值（per-unit）系統選 $V_{base}$ 與 $S_{base}$ 兩個基準值，其他基準值由電路定律推出；**經過變壓器時 $V_{base}$ 依匝數比改變，$S_{base}$ 不變**。
- 電壓調整率（VR）：落後負載 VR > 0 最大、單位功因 VR > 0 較小、超前負載可能 VR < 0。

## 公式整理

### 2.3 理想變壓器

$$
\frac{v_P(t)}{v_S(t)} = \frac{N_P}{N_S} = a, \qquad N_P\,i_P(t) = N_S\,i_S(t) \;\Rightarrow\; \frac{i_P(t)}{i_S(t)} = \frac{1}{a}
$$

$$
\frac{\mathbf{V}_P}{\mathbf{V}_S} = a, \qquad \frac{\mathbf{I}_P}{\mathbf{I}_S} = \frac{1}{a}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $N_P, N_S$ | 一次繞組（primary winding）、二次繞組（secondary winding）匝數 | turns |
| $a$ | 匝數比（turns ratio） | — |
| $v_P, v_S$ | 一次側、二次側電壓 | V |
| $i_P, i_S$ | 流入一次側、流出二次側的電流 | A |

> 打點慣例（dot convention）：一次側電壓在打點端為正，二次側電壓也在打點端為正；一次側電流**流入**打點端，二次側電流就從打點端**流出**。

$$
P_{in} = V_P I_P\cos\theta = V_S I_S\cos\theta = P_{out}
$$

$$
Q_{in} = V_P I_P\sin\theta = V_S I_S\sin\theta = Q_{out}, \qquad S_{in} = V_P I_P = V_S I_S = S_{out}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\theta$ | 電壓與電流的夾角（一、二次側相同） | ° |
| $P$ | 實功率 | W |
| $Q$ | 虛功率 | var |
| $S$ | 視在功率 | VA |

$$
Z_L = \frac{\mathbf{V}_S}{\mathbf{I}_S}, \qquad Z_L' = \frac{\mathbf{V}_P}{\mathbf{I}_P} = \frac{a\mathbf{V}_S}{\mathbf{I}_S/a} \;\Rightarrow\; Z_L' = a^2 Z_L
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $Z_L$ | 二次側負載阻抗 | Ω |
| $Z_L'$ | 從一次側看進去的視在阻抗 | Ω |

> 選擇適當的匝數比，就能讓負載阻抗的大小與電源阻抗匹配。

### 2.4 實際單相變壓器

$$
\bar{\phi} = \frac{\lambda}{N}, \qquad e_{ind} = N\frac{d\bar{\phi}}{dt}, \qquad \bar{\phi}_P = \frac{1}{N_P}\int v_P(t)\,dt
$$

$$
\bar{\phi}_P = \phi_M + \phi_{LP}, \qquad \bar{\phi}_S = \phi_M + \phi_{LS}
$$

$$
\frac{e_P(t)}{e_S(t)} = \frac{N_P}{N_S} = a, \qquad \frac{v_P(t)}{v_S(t)} \approx \frac{N_P}{N_S} = a
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\bar{\phi}$ | 每匝平均磁通 | Wb |
| $\phi_M$ | 互磁通（mutual flux），同時交鏈兩個繞組 | Wb |
| $\phi_{LP}, \phi_{LS}$ | 一次、二次側漏磁通（leakage flux） | Wb |
| $e_P, e_S$ | 由互磁通產生的一次、二次側電壓 | V |

> 只有「互磁通產生的電壓」比值**剛好**等於 $a$；因為設計良好的變壓器 $\phi_M \gg \phi_{LP}, \phi_{LS}$，端電壓比才**近似**等於 $a$。

$$
v_P(t) = V_M\cos\omega t \;\Rightarrow\; \bar{\phi}_P = \frac{V_M}{\omega N_P}\sin\omega t, \qquad i_{ex} = i_m + i_{h+e}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $i_m$ | 磁化電流（magnetization current） | A |
| $i_{h+e}$ | 鐵損電流（core-loss current），補磁滯與渦流損失 | A |
| $i_{ex}$ | 激磁電流（excitation current），即無載電流 | A |

- 磁化電流：**不是正弦波**（飽和造成高頻成分）；基本波**落後電壓 90°**；越飽和諧波越大。
- 鐵損電流：因磁滯而非線性；基本波與電壓**同相**；在磁通過零時最大（渦流正比於 $d\phi/dt$）。

$$
\mathcal{F}_{net} = N_P i_P - N_S i_S = \phi\mathcal{R} \approx 0 \;\Rightarrow\; N_P i_P \approx N_S i_S, \qquad \frac{i_P}{i_S} \approx \frac{N_S}{N_P} = \frac{1}{a}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\mathcal{F}_{net}$ | 鐵心的淨磁動勢 | A·turns |
| $\mathcal{R}$ | 鐵心磁阻（未飽和時接近 0） | A·turns/Wb |

> 電流流入打點端產生正磁動勢、流入未打點端產生負磁動勢；兩個電流都流入打點端時磁動勢相加。

### 2.5 等效電路

$$
\phi_{LP} = (\mathcal{P}N_P)\,i_P, \qquad e_{LP}(t) = L_P\frac{di_P}{dt}, \qquad L_P = N_P^2\mathcal{P}
$$

$$
\phi_{LS} = (\mathcal{P}N_S)\,i_S, \qquad e_{LS}(t) = L_S\frac{di_S}{dt}, \qquad L_S = N_S^2\mathcal{P}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\mathcal{P}$ | 漏磁路徑的磁導（permeance） | Wb/A·turns |
| $L_P, L_S$ | 一次、二次側漏電感 | H |
| $X_P = \omega L_P,\ X_S = \omega L_S$ | 一次、二次側漏電抗 | Ω |
| $R_P, R_S$ | 一次、二次繞組電阻（銅損） | Ω |
| $R_C$ | 鐵損電阻（與電壓同相的 $i_{h+e}$） | Ω |
| $X_M$ | 磁化電抗（落後電壓 90° 的 $i_m$） | Ω |

轉換到一次側：二次側元件乘 $a^2$（$a^2R_S$、$a^2X_S$），電壓變 $a\mathbf{V}_S$、電流變 $\mathbf{I}_S/a$。
轉換到二次側：一次側元件除以 $a^2$（$R_P/a^2$、$X_P/a^2$、$R_C/a^2$、$X_M/a^2$），電壓變 $\mathbf{V}_P/a$、電流變 $a\mathbf{I}_P$。

近似等效電路（激磁支路移到最前端，串聯阻抗合併）：

$$
R_{eqP} = R_P + a^2R_S, \quad X_{eqP} = X_P + a^2X_S, \qquad R_{eqS} = \frac{R_P}{a^2} + R_S, \quad X_{eqS} = \frac{X_P}{a^2} + X_S
$$

> 激磁電流只有滿載電流的約 2–3%，所以可以這樣簡化；有些應用甚至可以直接忽略激磁支路。

### 2.5 開路測試與短路測試

**開路測試**（通常在**低壓側**，加額定電壓）：

$$
G_C = \frac{1}{R_C}, \qquad B_M = \frac{1}{X_M}, \qquad Y_E = G_C - jB_M = \frac{1}{R_C} - j\frac{1}{X_M}
$$

$$
|Y_E| = \frac{I_{OC}}{V_{OC}}, \qquad \text{PF} = \cos\theta = \frac{P_{OC}}{V_{OC}I_{OC}}, \qquad Y_E = \frac{I_{OC}}{V_{OC}}\angle -\cos^{-1}\text{PF}
$$

講義另附的直接算法：

$$
R_c = \frac{V_{oc}^2}{P_{oc}}, \qquad I_c = \frac{V_{oc}}{R_c}, \qquad I_m = \sqrt{I_{oc}^2 - I_c^2}, \qquad X_m = \frac{V_{oc}}{I_m}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $Y_E$ | 激磁導納（admittance） | S |
| $G_C$ | 電導（conductance） | S |
| $B_M$ | 電納（susceptance） | S |
| $V_{OC}, I_{OC}, P_{OC}$ | 開路測試量到的電壓、電流、功率 | V、A、W |

**短路測試**（通常在**高壓側**，調電壓到額定電流）：

$$
|Z_{SE}| = \frac{V_{SC}}{I_{SC}}, \qquad \text{PF} = \frac{P_{SC}}{V_{SC}I_{SC}}, \qquad Z_{SE} = \frac{V_{SC}}{I_{SC}}\angle\theta = R_{eq} + jX_{eq} = (R_P + a^2R_S) + j(X_P + a^2X_S)
$$

$$
R_{se} = \frac{P_{sc}}{I_{sc}^2}, \qquad X_{se} = \sqrt{Z_{se}^2 - R_{se}^2}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $Z_{SE}$ | 串聯等效阻抗（轉換到測試那一側） | Ω |
| $V_{SC}, I_{SC}, P_{SC}$ | 短路測試量到的電壓、電流、功率 | V、A、W |

> 兩種測試的功因都是**落後**：開路時導納角為負（$-\theta$），短路時阻抗角為正（$+\theta$）。

### 2.6 標么值系統

$$
\text{Quantity per unit} = \frac{\text{Actual value}}{\text{base value of quantity}}
$$

$$
S_{base} = V_{base}I_{base}, \qquad Z_{base} = \frac{V_{base}}{I_{base}}, \qquad Y_{base} = \frac{I_{base}}{V_{base}}, \qquad Z_{base} = \frac{(V_{base})^2}{S_{base}}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $V_{base}, I_{base}$ | 電壓、電流基準值 | V、A |
| $S_{base}$ | 功率基準值（$P, Q, S$ 共用） | VA |
| $Z_{base}$ | 阻抗基準值（$R, X, Z$ 共用） | Ω |
| $Y_{base}$ | 導納基準值 | S |

換基準：

$$
(P,Q,S)_{\text{pu on base 2}} = (P,Q,S)_{\text{pu on base 1}}\frac{S_{base1}}{S_{base2}}, \qquad V_{\text{pu on base 2}} = V_{\text{pu on base 1}}\frac{V_{base1}}{V_{base2}}
$$

$$
(R,X,Z)_{\text{pu on base 2}} = (R,X,Z)_{\text{pu on base 1}}\frac{(V_{base1})^2(S_{base2})}{(V_{base2})^2(S_{base1})}
$$

### 2.7 電壓調整率與效率

$$
\text{VR} = \frac{V_{S,nl} - V_{S,fl}}{V_{S,fl}}\times 100\% = \frac{V_P/a - V_{S,fl}}{V_{S,fl}}\times 100\% = \frac{V_{P,pu} - V_{S,fl,pu}}{V_{S,fl,pu}}\times 100\%
$$

$$
\frac{\mathbf{V}_P}{a} = \mathbf{V}_S + R_{eq}\mathbf{I}_S + jX_{eq}\mathbf{I}_S
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| VR | 電壓調整率（voltage regulation） | % |
| $V_{S,nl}, V_{S,fl}$ | 二次側無載、滿載電壓 | V |
| $R_{eq}, X_{eq}$ | 轉換到二次側的等效電阻、電抗 | Ω |

> 相量圖一律以 $\mathbf{V}_S$ 為 0° 參考。

$$
\eta = \frac{P_{out}}{P_{in}}\times 100\% = \frac{P_{out}}{P_{out} + P_{loss}}\times 100\%, \qquad \eta = \frac{V_SI_S\cos\theta}{P_{Cu} + P_{core} + V_SI_S\cos\theta}\times 100\%
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\eta$ | 效率（efficiency） | % |
| $P_{Cu}$ | 銅損，$= I_S^2R_{eq}$（二次側） | W |
| $P_{core}$ | 鐵損，$= (V_P/a)^2/R_C$（二次側） | W |

### 2.8 分接頭

- 配電變壓器常見 4 個分接頭（taps），間隔 2.5%，可調整到額定電壓的 ±5%；一般**不能帶電切換**。
- 可帶電切換的稱為有載分接頭切換變壓器（TCUL）；內建電壓感測、自動切換的 TCUL 稱為電壓調整器（voltage regulator）。

### 2.9 自耦變壓器

$$
\frac{\mathbf{V}_C}{\mathbf{V}_{SE}} = \frac{N_C}{N_{SE}}, \qquad N_C\mathbf{I}_C = N_{SE}\mathbf{I}_{SE}
$$

$$
\mathbf{V}_L = \mathbf{V}_C, \quad \mathbf{V}_H = \mathbf{V}_C + \mathbf{V}_{SE}, \qquad \mathbf{I}_L = \mathbf{I}_C + \mathbf{I}_{SE}, \quad \mathbf{I}_H = \mathbf{I}_{SE}
$$

$$
\frac{\mathbf{V}_L}{\mathbf{V}_H} = \frac{N_C}{N_{SE} + N_C}, \qquad \frac{\mathbf{I}_L}{\mathbf{I}_H} = \frac{N_{SE} + N_C}{N_C}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $N_C$ | 共同繞組（common winding）匝數 | turns |
| $N_{SE}$ | 串聯繞組（series winding）匝數 | turns |
| $\mathbf{V}_C, \mathbf{I}_C$ | 共同繞組的電壓、電流 | V、A |
| $\mathbf{V}_{SE}, \mathbf{I}_{SE}$ | 串聯繞組的電壓、電流 | V、A |
| $\mathbf{V}_L, \mathbf{I}_L$ | 低壓側端電壓、電流 | V、A |
| $\mathbf{V}_H, \mathbf{I}_H$ | 高壓側端電壓、電流 | V、A |

$$
S_{in} = V_LI_L = S_{out} = V_HI_H = S_{IO}, \qquad S_W = V_CI_C = V_{SE}I_{SE} = S_{IO}\frac{N_{SE}}{N_{SE} + N_C}
$$

$$
\frac{S_{IO}}{S_W} = \frac{N_{SE} + N_C}{N_{SE}}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $S_{IO}$ | 自耦變壓器的輸入／輸出視在功率 | VA |
| $S_W$ | 實際通過繞組的視在功率 | VA |

> $S_{IO}/S_W$ 就是自耦變壓器的「額定容量優勢」。缺點是一、二次側直接相連，**失去電氣隔離**。

### 2.10 三相變壓器接法

$$
\text{Y-Y：}\ \frac{V_{LP}}{V_{LS}} = \frac{\sqrt{3}V_{\phi P}}{\sqrt{3}V_{\phi S}} = a \qquad
\text{Y-}\Delta\text{：}\ \frac{V_{LP}}{V_{LS}} = \sqrt{3}a
$$

$$
\Delta\text{-Y：}\ \frac{V_{LP}}{V_{LS}} = \frac{a}{\sqrt{3}} \qquad
\Delta\text{-}\Delta\text{：}\ \frac{V_{LP}}{V_{LS}} = \frac{V_{\phi P}}{V_{\phi S}} = a
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $V_{LP}, V_{LS}$ | 一次、二次側線電壓 | V |
| $V_{\phi P}, V_{\phi S}$ | 一次、二次側相電壓 | V |
| $a$ | 每相的匝數比 $V_{\phi P}/V_{\phi S}$ | — |

| 接法 | 優缺點 |
|---|---|
| Y-Y | 負載不平衡時相電壓嚴重不平衡、三次諧波電壓大；解法：中性點直接接地，或加 Δ 接的三次繞組（tertiary winding） |
| Y-Δ | 三次諧波在 Δ 側形成環流被吸收，對不平衡負載較穩定；但二次側電壓相對一次側**移相 30°**（講義圖示：二次側落後 30°） |
| Δ-Y | 優點與 Y-Δ 相同，也有 30° 相移 |
| Δ-Δ | 沒有相移，也沒有不平衡與諧波問題 |

<!-- TODO: 待確認：Δ-Y 的相移方向。講義文字寫「Figure 2-37c 的接法使二次側電壓落後一次側 30°」，但同頁圖上老師的標註寫「Secondary voltage leads primary voltage by 30°」，兩者矛盾，請以老師上課說明為準。 -->

## 解題技巧

### 題型一：含理想變壓器的電路（例 2-1）

1. 從負載端開始，把負載轉換到前一級：$Z' = a^2Z$，注意 $a$ 要用「從要轉過去的那側看」的匝數比。
2. 一路轉到電源側，得到沒有變壓器的單一迴路，算出 $\mathbf{I}_G$。
3. 用 $\mathbf{I}_P/\mathbf{I}_S = 1/a$ 逐級往回推出線路電流、負載電流，再算負載電壓與線損 $P_{loss} = I_{line}^2R_{line}$。

> 對答案用：例 2-1 (a) 無變壓器 $\mathbf{I}_{line} = 90.8\angle -37.8°$ A、$\mathbf{V}_{load} = 454\angle -0.9°$ V、$P_{loss} = 1484$ W；(b) 加變壓器 $\mathbf{I}_G = 95.94\angle -36.88°$ A、$\mathbf{I}_{line} = 9.594\angle -36.88°$ A、$\mathbf{V}_{load} = 479.7\angle -0.01°$ V、$P_{loss} = 16.7$ W（線損降低近 90%）。

### 題型二：由開路／短路測試求等效電路（例 2-2、2-5）

1. 先算 $a$，並分清楚**開路測試在哪一側**（通常低壓側）、**短路測試在哪一側**（通常高壓側）。
2. 開路：$\text{PF} = P_{OC}/(V_{OC}I_{OC})$ → $Y_E = \dfrac{I_{OC}}{V_{OC}}\angle -\cos^{-1}\text{PF}$ → 拆成實部、虛部 → $R_C = 1/G_C$、$X_M = 1/B_M$（此值屬於**開路測試那一側**）。
3. 短路：$\text{PF} = P_{SC}/(V_{SC}I_{SC})$ → $Z_{SE} = \dfrac{V_{SC}}{I_{SC}}\angle +\cos^{-1}\text{PF}$ → $R_{eq} + jX_{eq}$（屬於**短路測試那一側**）。
4. 要畫某一側的等效電路時，把另一側求得的元件乘或除 $a^2$ 轉過來。

> 對答案用：例 2-2（$a = 33.33$）開路 PF = 0.234、$Y_E = 0.0297\angle -76.5°$ S、低壓側 $R_C = 144$ Ω、$X_M = 34.63$ Ω；短路 PF = 0.196、$Z_{SE} = 195.6\angle 78.7° = 38.4 + j192$ Ω；轉到高壓側 $R_C = 159$ kΩ、$X_M = 38.4$ kΩ。
> 例 2-5（$a = 10$）$\theta_{OC} = 84°$、低壓側 $R_C = 1050$ Ω、$X_M = 110$ Ω；$\theta_{SC} = 55.4°$、高壓側 $Z_{SE} = 4.45 + j6.45$ Ω；高壓側 $R_C = 105$ kΩ、$X_M = 11$ kΩ；低壓側 $R_{eq} = 0.0445$ Ω、$X_{eq} = 0.0645$ Ω。

### 題型三：標么值計算（例 2-3）

1. 在發電機區給定 $V_{base}$、$S_{base}$，算 $I_{base} = S_{base}/V_{base}$、$Z_{base} = V_{base}/I_{base}$。
2. 每經過一個變壓器，$V_{base}$ 依匝數比換算（$V_{base2} = V_{base1}/a$），$S_{base}$ 全系統相同，再重算 $I_{base}$、$Z_{base}$。
3. 每個元件用**所在區域**的基準值換成 pu，畫出沒有變壓器的 pu 等效電路。
4. 解出 $I_{pu}$，$P_{pu} = I_{pu}^2R_{pu}$，實際功率 $= P_{pu}\times S_{base}$。

> 對答案用：例 2-3 區域 1：$I_{base} = 20.83$ A、$Z_{base} = 23.04$ Ω；區域 2：$V_{base} = 4800$ V、$I_{base} = 2.083$ A、$Z_{base} = 2304$ Ω；區域 3：$V_{base} = 240$ V、$I_{base} = 41.67$ A、$Z_{base} = 5.76$ Ω；$Z_{line,pu} = 0.0087 + j0.0260$、$Z_{load,pu} = 1.736\angle 30°$；$I_{pu} = 0.569\angle -30.6°$；$P_{load} = 0.487$ pu $= 4870$ W；$P_{line} = 0.00282$ pu $= 28.2$ W。

### 題型四：電壓調整率與效率（例 2-5 (c)(e)）

1. 滿載電流 $I_{S,rated} = S_{rated}/V_{S,rated}$，依功因定角度：落後 $-\theta$、超前 $+\theta$、單位功因 0°。
2. 以 $\mathbf{V}_S = V_{S,rated}\angle 0°$，代入 $\mathbf{V}_P/a = \mathbf{V}_S + R_{eq}\mathbf{I}_S + jX_{eq}\mathbf{I}_S$。
3. $\text{VR} = \dfrac{|\mathbf{V}_P/a| - V_{S,fl}}{V_{S,fl}}\times 100\%$。
4. 效率：$P_{Cu} = I_S^2R_{eq}$、$P_{core} = (V_P/a)^2/R_C$、$P_{out} = V_SI_S\cos\theta$，代入 $\eta$。

> 對答案用：例 2-5 $I_S = 65.2$ A；0.8 落後 $\mathbf{V}_P/a = 234.85\angle 0.40°$ V、VR = 2.1%；1.0 功因 $232.94\angle 1.04°$ V、VR = 1.28%；0.8 超前 $229.85\angle 1.27°$ V、VR = −0.062%；效率 $P_{Cu} = 189$ W、$P_{core} = 52.5$ W、$P_{out} = 12{,}000$ W、$\eta = 98.03\%$。

### 題型五：分接頭（例 2-6）

- 每個分接頭改變一次側額定電壓 2.5%，二次側不變。
- 例 2-6（13,200/480 V）：+5% → 13,860/480 V、+2.5% → 13,530/480 V、額定 13,200/480 V、−2.5% → 12,870/480 V、−5% → 12,540/480 V。

### 題型六：自耦變壓器（例 2-7）

1. 判斷哪個繞組是共同繞組 $N_C$、哪個是串聯繞組 $N_{SE}$（升壓時，接在輸入電壓上的是共同繞組）。
2. $V_H = \dfrac{N_{SE} + N_C}{N_C}V_L$。
3. 最大容量由**串聯繞組電流上限**決定：$I_{SE,max} = S_{rated}/V_{SE}$，$S_{IO} = V_H I_{SE,max}$。
4. 容量優勢 $S_{IO}/S_W = (N_{SE} + N_C)/N_{SE}$。

> 對答案用：例 2-7（100 VA、120/12 V 接成升壓）$V_H = 132$ V、$I_{SE,max} = 8.33$ A、$S_{IO} = 1100$ VA、容量增加 11 倍。

## 常見陷阱

- $a = N_P/N_S$ 的方向：例 2-3 中升壓變壓器 $T_1$ 的 $a = 1/10 = 0.1$，降壓變壓器 $T_2$ 的 $a = 20$；方向弄反，阻抗會差 $a^4$ 倍。
- 開路測試求出的 $R_C, X_M$ 屬於低壓側、短路測試求出的 $R_{eq}, X_{eq}$ 屬於高壓側；畫同一張等效電路前一定要先統一到同一側。
- 開路時取 $Y_E\angle -\theta$（導納），短路時取 $Z_{SE}\angle +\theta$（阻抗），符號別搞反。
- 標么值換算時 $S_{base}$ 在整個系統都一樣，只有 $V_{base}$ 會因變壓器改變。
- 算 VR 時要用**大小**相減：$|\mathbf{V}_P/a| - |\mathbf{V}_S|$，不是相量相減。
- 超前功因的 VR 可能是**負值**，不是算錯。
- 理想變壓器關係 $N_Pi_P = N_Si_S$ 只在鐵心**未飽和**（磁阻趨近 0）時近似成立。
- 自耦變壓器容量是 $V_H \times I_{SE,max}$，不是原來繞組的額定 VA。
