# Ch.4 同步發電機

> 依據：老師講義 Chapter 4 Synchronous Generators（4.1–4.8）｜更新：2026-11-15
>
> 老師指定習題：4-2（不含 g）、4-3、4-4（不含 e）、4-5、4-6、4-7、4-14、4-15
>
> 講義目錄中 4.9–4.12 已被老師劃掉，不在本次範圍。例 4-1、4-2、4-3 講義標示為**考試重點**。

## 重點摘要

- 同步發電機的轉子由原動機（prime mover）帶動，轉子磁場（永久磁鐵或直流場繞組）在定子感應出三相電壓；**場繞組＝轉子繞組**、**電樞繞組＝定子繞組**。
- 「同步」指電頻率鎖定在機械轉速：$n_{sm} = \dfrac{120f_{se}}{P}$；感應電壓 $E_A = K\phi\omega$，頻率固定時只能靠**場電流**調整 $E_A$。
- 每相等效電路：$\mathbf{V}_\phi = \mathbf{E}_A - jX_S\mathbf{I}_A - R_A\mathbf{I}_A$，同步電抗 $X_S$＝電樞反應電抗＋電樞自感電抗。
- 功率由轉矩角 $\delta$ 決定：$P = \dfrac{3V_\phi E_A}{X_S}\sin\delta$，$\delta = 90°$ 為靜態穩定極限；實際滿載 $\delta$ 約 20°–30°。
- 單獨運轉時加負載：**落後負載**端電壓明顯下降、**單位功因**略降、**超前負載**反而上升；用開路、短路、直流測試求 $E_A$–$I_F$ 曲線、$X_S$、$R_A$。

## 公式整理

### 4.2 轉速與頻率

$$
f_{se} = \frac{n_{sm}P}{120} \;\Leftrightarrow\; n_{sm} = \frac{120}{P}f_{se}, \qquad \theta_{se} = \frac{P}{2}\theta_{sm}, \quad f_{se} = \frac{P}{2}f_{sm}, \quad \omega_{se} = \frac{P}{2}\omega_{sm}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $f_{se}$ | 電頻率 | Hz |
| $n_{sm}$ | 磁場機械轉速（同步機中＝轉子轉速） | r/min |
| $P$ | 極數 | — |

### 4.3 內生電壓

$$
E_A = \sqrt{2}\pi N_C\phi f, \qquad E_A = K\phi\omega
$$

$$
K = \frac{N_C}{\sqrt{2}}\ (\omega\ \text{用電機 rad/s}), \qquad K = \frac{N_C\cdot P}{\sqrt{2}\cdot 2}\ (\omega\ \text{用機械 rad/s})
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $E_A$ | 每相內生電壓（internal generated voltage），有效值 | V |
| $N_C$ | 每相線圈匝數 | turns |
| $\phi$ | 每極磁通 | Wb |
| $K$ | 構造常數 | — |
| $\omega$ | 角速度 | rad/s |

> 機械 rad/s 的 $K$ 已依老師在講義上的更正，寫成 $\dfrac{N_C P}{2\sqrt{2}}$（課本原式被老師劃掉）。

- $I_F \to \phi \to E_A$：$E_A$ 正比於磁通與轉速，磁通又取決於場電流 $I_F$。$E_A$ 對 $I_F$ 的曲線稱為**磁化曲線**或**開路特性**（open-circuit characteristic, OCC），會飽和。

### 4.4 等效電路

造成 $E_A$ 與 $V_\phi$ 不同的因素：① 電樞反應（armature reaction，通常最大）② 電樞線圈自感 ③ 電樞電阻 ④ 凸極效應（本章忽略）。

$$
\mathbf{V}_\phi = \mathbf{E}_A + \mathbf{E}_{stat}, \qquad \mathbf{B}_{net} = \mathbf{B}_R + \mathbf{B}_S, \qquad \mathbf{E}_{stat} = -jX\mathbf{I}_A
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\mathbf{V}_\phi$ | 每相端電壓（相電壓） | V |
| $\mathbf{E}_{stat}$ | 電樞反應電壓，**落後 $\mathbf{I}_A$ 90°** | V |
| $\mathbf{B}_R, \mathbf{B}_S$ | 轉子、定子磁場 | T |
| $X$ | 電樞反應的比例常數（電抗） | Ω |
| $\mathbf{I}_A$ | 電樞電流 | A |

> $\mathbf{E}_A$ 與 $\mathbf{B}_R$ 同角度、$\mathbf{E}_{stat}$ 與 $\mathbf{B}_S$ 同角度，所以 $\mathbf{B}_{net}$ 與 $\mathbf{V}_\phi$ 同角度。$\mathbf{B}_R$ 與 $\mathbf{B}_{net}$ 的夾角就是**內角／轉矩角** $\delta$。

$$
\mathbf{V}_\phi = \mathbf{E}_A - jX\mathbf{I}_A - jX_A\mathbf{I}_A - R_A\mathbf{I}_A, \qquad X_S = X + X_A
$$

$$
\mathbf{V}_\phi = \mathbf{E}_A - jX_S\mathbf{I}_A - R_A\mathbf{I}_A
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $X_A$ | 電樞自感 $L_A$ 對應的電抗 | Ω |
| $R_A$ | 電樞電阻 | Ω |
| $X_S$ | 同步電抗（synchronous reactance） | Ω |

$$
\text{Y 接：}\ V_T = V_L = \sqrt{3}V_\phi, \qquad \Delta\text{ 接：}\ V_T = V_\phi
$$

> 場電路＝直流電源＋$R_F$、$L_F$ 串聯，再串一個可調電阻 $R_{adj}$ 控制場電流。用每相等效電路時要記得：**只有平衡負載**時三相電壓、電流才相同。

### 4.5 相量圖

- 以 $\mathbf{V}_\phi$ 為 0° 參考，$\mathbf{E}_A$ 比 $\mathbf{V}_\phi$ 多了 $R_A\mathbf{I}_A$ 與 $jX_S\mathbf{I}_A$ 兩段壓降。
- 同樣的 $V_\phi$ 與 $I_A$ 下，**落後負載需要的 $E_A$ 比超前負載大**，因此需要較大的場電流（頻率固定，$\omega$ 不能變）。

### 4.6 功率與轉矩

$$
P_{in} = \tau_{app}\,\omega_m, \qquad P_{conv} = \tau_{ind}\,\omega_m = 3E_AI_A\cos\gamma
$$

$$
P_{out} = \sqrt{3}V_LI_L\cos\theta = 3V_\phi I_A\cos\theta, \qquad Q_{out} = \sqrt{3}V_LI_L\sin\theta = 3V_\phi I_A\sin\theta
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\tau_{app}$ | 原動機施加的轉矩 | N·m |
| $\tau_{ind}$ | 感應轉矩（對發電機是反轉矩） | N·m |
| $\gamma$ | $\mathbf{E}_A$ 與 $\mathbf{I}_A$ 的夾角 | ° |
| $\theta$ | $\mathbf{V}_\phi$ 與 $\mathbf{I}_A$ 的夾角（功因角） | ° |
| $V_L, I_L$ | 線電壓、線電流 | V、A |

> $P_{in}$ 與 $P_{conv}$ 的差＝機械損＋鐵損＋雜散損；$P_{conv}$ 與 $P_{out}$ 的差＝銅損 $I^2R$。

忽略 $R_A$ 時（Figure 4-16）：

$$
I_A\cos\theta = \frac{E_A\sin\delta}{X_S}, \qquad P_{conv} = \frac{3V_\phi E_A}{X_S}\sin\delta \;(= P_{out}), \qquad P_{max} = \frac{3V_\phi E_A}{X_S}
$$

$$
\tau_{ind} = \frac{3V_\phi E_A}{\omega_mX_S}\sin\delta, \qquad \tau_{ind} = k\mathbf{B}_R\times\mathbf{B}_S = k\mathbf{B}_R\times\mathbf{B}_{net}, \qquad \tau_{ind} = kB_RB_{net}\sin\delta
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\delta$ | 轉矩角（torque angle）：$\mathbf{V}_\phi$ 與 $\mathbf{E}_A$ 的夾角（＝$\mathbf{B}_{net}$ 與 $\mathbf{B}_R$ 的夾角） | ° |
| $P_{max}$ | 靜態穩定極限（static stability limit），發生在 $\delta = 90°$ | W |

> $V_\phi$ 固定時：實功率正比於 $I_A\cos\theta$ 與 $E_A\sin\delta$，虛功率正比於 $I_A\sin\theta$。$\tau_{ind} = \dfrac{3V_\phi E_A}{\omega_mX_S}\sin\delta$ 是用電氣量表示轉矩，$kB_RB_{net}\sin\delta$ 是用磁場量表示。

### 4.7 量測模型參數

要決定三個量：① $I_F$ 與 $\phi$（即 $E_A$）的關係 ② 同步電抗 $X_S$ ③ 電樞電阻 $R_A$。

- **開路測試**：$I_A = 0$，所以 $V_\phi = E_A$，量出 OCC。一開始近乎直線（未飽和鐵材磁阻遠小於氣隙磁阻，磁動勢幾乎都落在氣隙），這段直線的延伸稱為**氣隙線**（air-gap line）；鐵材飽和後曲線彎下來。
- **短路測試**：場電流歸零後把端子短路，逐步增加 $I_F$ 量 $I_A$（或 $I_L$），得到短路特性（SCC），幾乎是**直線**——因為 $\mathbf{B}_S$ 幾乎抵銷 $\mathbf{B}_R$，$\mathbf{B}_{net}$ 很小、機器不飽和。

$$
\mathbf{I}_A = \frac{\mathbf{E}_A}{R_A + jX_S}, \qquad I_A = \frac{E_A}{\sqrt{R_A^2 + X_S^2}}
$$

$$
Z_S = \sqrt{R_A^2 + X_S^2} = \frac{E_A}{I_A}, \qquad X_S \approx \frac{E_A}{I_A} = \frac{V_{\phi,oc}}{I_A}\ (X_S \gg R_A)
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $Z_S$ | 機器內部阻抗 | Ω |
| $V_{\phi,oc}$ | 該場電流下的開路相電壓 | V |
| $I_{A,SC}$ | 該場電流下的短路電樞電流 | A |

> $E_A$ 取自 OCC（大場電流時已部分飽和），$I_A$ 取自 SCC（始終不飽和），所以 $X_S$ 只是**近似值**，會隨場電流增加而變小（Figure 4-19）。在氣隙線（線性區）上算出的是**未飽和同步電抗** $X_{S,u}$；解題時應取接近實際負載狀況的 $X_S$。

- **直流測試**：機器靜止時對繞組加直流電壓、量電流，此時電抗為 0，可求繞組電阻。

**短路比**（short-circuit ratio, SCR）：開路時產生**額定電壓**所需的場電流 ÷ 短路時產生**額定電樞電流**所需的場電流；等於近似（飽和）同步電抗**標么值的倒數**。老師補充的三種說法：

1. 短路電流／額定電流
2. 開路試驗額定電壓需要的場電流／短路試驗額定電流的場電流
3. 阻抗百分比的倒數（pu 的倒數）

### 4.8 單獨運轉

假設：以忽略 $R_A$ 的簡化相量圖說明、轉速固定、除非明確改變場電流否則轉子磁通固定（$E_A$ 大小不變）。

$$
\mathbf{E}_A = \mathbf{V}_\phi + jX_S\mathbf{I}_A
$$

| 加入的負載 | $V_\phi$、$V_T$ 的變化 | VR |
|---|---|---|
| 落後（+Q，電感性） | **明顯下降** | 相當大的正值 |
| 單位功因（無虛功） | 略降 | 小的正值 |
| 超前（−Q，電容性） | **上升** | 常為負值 |

$$
\text{VR} = \frac{V_{nl} - V_{fl}}{V_{fl}}\times 100\%
$$

修正端電壓的方法（頻率不能變，只能改磁通）：

1. 減小場電阻 → 場電流增加
2. 場電流增加 → 磁通增加
3. 磁通增加 → $E_A = K\phi\omega$ 增加
4. $E_A$ 增加 → $V_\phi$ 與端電壓上升

## 解題技巧

### 題型一：由開路、短路、直流測試求 $R_A$、$X_S$（例 4-1，考試重點）

1. **直流測試**：Y 接時直流電流流過**兩個**繞組，$2R_A = V_{DC}/I_{DC}$，所以 $R_A = \dfrac{V_{DC}}{2I_{DC}}$。
2. **開路**：$E_A = V_{\phi,OC}$；Y 接要把線電壓除以 $\sqrt{3}$。
3. **短路**：Y 接時 $I_{A,SC} = I_{L,SC}$（Δ 接要除以 $\sqrt{3}$）。
4. 用 $\sqrt{R_A^2 + X_S^2} = E_A/I_A$ 解 $X_S$，或直接用近似 $X_S \approx E_A/I_A$。

> 對答案用：例 4-1（200 kVA、480 V、50 Hz、Y 接；$V_{T,OC} = 540$ V、$I_{L,SC} = 300$ A、直流 10 V／25 A）$R_A = 0.2$ Ω、$E_A = 311.8$ V、$I_A = 300$ A、$X_S = 1.02$ Ω（含 $R_A$）；用近似式得 1.04 Ω。忽略 $R_A$ 造成的誤差遠小於飽和造成的誤差，所以一般用近似式。

### 題型二：調整場電流維持端電壓、效率（例 4-2，考試重點）

1. 先看接法：**Δ 接** $V_\phi = V_T$、$I_A = I_L/\sqrt{3}$；Y 接 $V_\phi = V_T/\sqrt{3}$、$I_A = I_L$。
2. 轉速 $n_m = 120f_{se}/P$。
3. 無載：$I_A = 0$，$E_A = V_\phi$，查 OCC 得 $I_F$。
4. 有載：$\mathbf{E}_A = \mathbf{V}_\phi + R_A\mathbf{I}_A + jX_S\mathbf{I}_A$，$\mathbf{I}_A$ 的角度：落後 $-\theta$、超前 $+\theta$；求出 $|E_A|$ 後查 OCC 得 $I_F$（OCC 縱軸是端電壓，Δ 接時等於 $E_A$）。
5. 效率：$P_{out} = \sqrt{3}V_LI_L\cos\theta$，$P_{in} = P_{out} + P_{elec\,loss} + P_{core\,loss} + P_{mech\,loss} + P_{stray\,loss}$，其中 $P_{elec\,loss} = 3I_A^2R_A$；沒給的雜散損就忽略。
6. 負載突然移除：$I_A = 0$，場電流沒變所以 $|E_A|$ 不變，端電壓升到 $E_A$。

> 對答案用：例 4-2（480 V、60 Hz、Δ 接、四極、$X_S = 0.1$ Ω、$R_A = 0.015$ Ω）(a) 1800 r/min；(b) $I_F = 4.5$ A；(c) $I_A = 692.8$ A、$\mathbf{E}_A = 532\angle 5.3°$ V、$I_F = 5.7$ A；(d) $P_{out} = 798$ kW、$P_{elec\,loss} = 21.6$ kW、$P_{in} = 889.6$ kW、$\eta = 89.75\%$；(e) 端電壓升到 532 V；(f) 0.8 超前 $\mathbf{E}_A = 451\angle 7.1°$ V、$I_F = 4.1$ A。

### 題型三：$E_A$ 固定，求不同功因下的端電壓與 VR（例 4-3，考試重點）

1. 無載時 $E_A = V_\phi$，之後場電流不變，$E_A$ 大小固定。
2. 忽略 $R_A$，在相量圖上用直角三角形解 $V_\phi$：
   - 落後：$E_A^2 = (V_\phi + X_SI_A\sin\theta)^2 + (X_SI_A\cos\theta)^2$
   - 單位功因：$E_A^2 = V_\phi^2 + (X_SI_A)^2$
   - 超前：$E_A^2 = (V_\phi - X_SI_A\sin\theta)^2 + (X_SI_A\cos\theta)^2$
3. 依接法換成端電壓，再用 $\text{VR} = (V_{nl} - V_{fl})/V_{fl}$。
4. 效率：沒有銅損時 $P_{conv} = P_{out}$；$\tau_{app} = P_{in}/\omega_m$、$\tau_{ind} = P_{conv}/\omega_m$。

> 對答案用：例 4-3（480 V、Y 接、六極、$X_S = 1.0$ Ω、$I_A = 60$ A、摩擦風損 1.5 kW、鐵損 1.0 kW）$E_A = V_\phi = 277$ V；(b) 0.8 落後 $V_\phi = 236.8$ V、$V_T = 410$ V；1.0 功因 $V_\phi = 270.4$ V、$V_T = 468.4$ V；0.8 超前 $V_\phi = 308.8$ V、$V_T = 535$ V；(c) $P_{out} = 34.1$ kW、$P_{in} = 36.6$ kW、$\eta = 93.2\%$；(d) $\tau_{app} = 291.2$ N·m、$\tau_{ind} = 271.3$ N·m（以 125.7 rad/s 計算）；(e) VR = 17.1%、2.6%、−10.3%。

<!-- TODO: 待確認：例 4-3 老師把題目的 50 Hz 改成 60 Hz，但講義解答 (a) 仍是 50 Hz 的結果（1000 r/min、104.7 rad/s），(d) 卻用 125.7 rad/s（對應 60 Hz、1200 r/min）。題目頻率與 (a) 的答案請以老師版本為準。 -->

## 常見陷阱

- **Y 接、Δ 接一定先確認**：Δ 接 $V_\phi = V_T$、$I_A = I_L/\sqrt{3}$；Y 接 $V_\phi = V_T/\sqrt{3}$、$I_A = I_L$。例 4-1 的直流測試在 Y 接時是**兩個繞組串聯**。
- $\mathbf{I}_A$ 的角度：落後功因用 $-\theta$、超前用 $+\theta$；$jX_S\mathbf{I}_A$ 會再多轉 90°（例 4-3：$j(1.0)(60\angle -36.87°) = 60\angle 53.13°$ V）。
- 算轉矩時 $\omega_m$ 要用 rad/s，不是 r/min。
- $\delta$ 是 $\mathbf{E}_A$ 與 $\mathbf{V}_\phi$ 的夾角；$\theta$ 是 $\mathbf{V}_\phi$ 與 $\mathbf{I}_A$ 的夾角；$\gamma$ 是 $\mathbf{E}_A$ 與 $\mathbf{I}_A$ 的夾角，三者不要混用。
- 開路測試得到的 $E_A$ 已部分飽和，短路測試則不飽和，所以 $X_S \approx E_A/I_A$ 只是近似值，且會隨場電流改變。
- 負載突然移除時端電壓會**升到 $E_A$**，不是回到原本的額定值。
- 超前負載的 VR 可能是負值，代表端電壓隨負載上升。
