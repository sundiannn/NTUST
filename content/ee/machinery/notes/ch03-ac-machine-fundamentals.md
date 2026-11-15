# Ch.3 交流電機基礎

> 依據：老師講義 Chapter 3 AC Machine Fundamentals（3.1–3.5、3.7–3.8）｜更新：2026-11-15
>
> 老師指定習題：3-1、3-3、3-4、3-5、3-6
>
> 講義目錄中 3.6 繞組絕緣與 3.9 總結已被老師劃掉，不在本次範圍。

## 重點摘要

- 交流電機分兩大類：**同步電機**（磁場電流由獨立直流電源供應）與**感應電機**（磁場電流靠電磁感應／變壓器作用送進轉子）。
- 任何電機的感應電壓都取決於三件事：**磁通**、**轉速**、**機器構造**；感應轉矩則取決於**轉子磁場強度**、**外部磁場強度**、**兩者夾角的正弦**與**構造常數**。
- 三相電流（大小相等、相差 120°）流入相隔 120° 電機角的三相繞組，會產生**大小固定 $1.5B_M$、以 $\omega$ 旋轉**的旋轉磁場（rotating magnetic field）；**任意對調兩相**就會反轉旋轉方向。
- 電頻率與機械轉速的關係：$f_{se} = \dfrac{n_{sm}P}{120}$（P 為極數）。
- 三相定子每相感應電壓有效值 $E_A = \sqrt{2}\pi N_C\phi f$；轉矩可寫成 $\tau_{ind} = k\mathbf{B}_R\times\mathbf{B}_S = k\mathbf{B}_R\times\mathbf{B}_{net}$。

## 公式整理

### 3.1 均勻磁場中的旋轉線圈

$$
e_{ind} = e_{ba} + e_{cb} + e_{dc} + e_{ad} = vBl\sin\theta_{ab} + vBl\sin\theta_{cd} \;\Rightarrow\; e_{ind} = 2vBl\sin\theta
$$

$$
\theta = \omega t, \qquad v = r\omega \;\Rightarrow\; e_{ind} = 2r\omega Bl\sin\omega t = AB\omega\sin\omega t
$$

$$
\phi_{max} = AB, \qquad e_{ind} = \phi_{max}\,\omega\sin\omega t
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $v$ | 線圈邊的切線速度（tangential velocity） | m/s |
| $B$ | 均勻磁通密度 | T |
| $l$ | 線圈邊長度 | m |
| $r$ | 轉軸到線圈邊的半徑 | m |
| $A$ | 線圈面積，$A = 2rl$ | m² |
| $\omega$ | 角速度 | rad/s |
| $\phi_{max}$ | 線圈平面與磁場垂直時的最大磁通 | Wb |

> 與磁場平行的兩邊（bc、da）因為 $\mathbf{v}\times\mathbf{B}$ 垂直於 $\mathbf{l}$，感應電壓為 0。

$$
\tau = rF\sin\theta, \qquad \tau_{ind} = rilB\sin\theta_{ab} + rilB\sin\theta_{cd} \;\Rightarrow\; \tau_{ind} = 2rilB\sin\theta
$$

$$
B_{loop} = \frac{\mu i}{G}, \qquad \tau_{ind} = \frac{AG}{\mu}B_{loop}B_S\sin\theta = kB_{loop}B_S\sin\theta, \qquad \tau_{ind} = k\mathbf{B}_{loop}\times\mathbf{B}_S
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $i$ | 線圈電流 | A |
| $G$ | 與線圈幾何形狀有關的係數 | — |
| $B_{loop}$ | 線圈電流產生的磁通密度（垂直線圈平面） | T |
| $B_S$ | 定子（外部）磁通密度 | T |
| $k$ | 構造常數，$k = AG/\mu$ | — |

> 線圈平面**平行**磁場時轉矩最大，**垂直**磁場時轉矩為 0。

### 3.2 旋轉磁場

$$
i_{aa'}(t) = I_M\sin\omega t, \quad i_{bb'}(t) = I_M\sin(\omega t - 120°), \quad i_{cc'}(t) = I_M\sin(\omega t - 240°)
$$

$$
\mathbf{H}_{aa'}(t) = H_M\sin\omega t\angle 0°, \quad \mathbf{H}_{bb'}(t) = H_M\sin(\omega t - 120°)\angle 120°, \quad \mathbf{H}_{cc'}(t) = H_M\sin(\omega t - 240°)\angle 240°
$$

$$
\mathbf{B} = \mu\mathbf{H}, \qquad B_M = \mu H_M
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $I_M$ | 相電流峰值 | A |
| $H_M$ | 磁場強度峰值 | A·turns/m |
| $B_M$ | 單一線圈磁通密度峰值 | T |
| $\angle 0°, 120°, 240°$ | 磁場向量的**空間**角度（固定不動） | ° |

> 每個線圈的磁場「方向固定、大小隨時間正弦變化」；三個加起來才變成大小固定、方向旋轉的磁場。

$$
\mathbf{B}_{net}(t) = (1.5B_M\sin\omega t)\,\hat{\mathbf{x}} - (1.5B_M\cos\omega t)\,\hat{\mathbf{y}} \quad(\text{逆時針})
$$

$$
\text{對調 bb'、cc' 兩相：}\ \mathbf{B}_{net}(t) = (1.5B_M\sin\omega t)\,\hat{\mathbf{x}} + (1.5B_M\cos\omega t)\,\hat{\mathbf{y}} \quad(\text{順時針})
$$

> 檢查點：$\omega t = 0°$ 時 $\mathbf{B}_{net} = 1.5B_M\angle -90°$；$\omega t = 90°$ 時 $\mathbf{B}_{net} = 1.5B_M\angle 0°$。

$$
\theta_{se} = \frac{P}{2}\theta_{sm}, \qquad f_{se} = \frac{P}{2}f_{sm}, \qquad \omega_{se} = \frac{P}{2}\omega_{sm}, \qquad f_{se} = \frac{n_{sm}P}{120}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $P$ | 磁極數 | — |
| $\theta_{se}, \theta_{sm}$ | 電機角、機械角 | ° |
| $f_{se}$ | 定子電流的電頻率 | Hz |
| $f_{sm}$ | 定子磁場的機械轉速 | r/s |
| $\omega_{se}, \omega_{sm}$ | 電角速度、磁場機械角速度 | rad/s |
| $n_{sm}$ | 磁場機械轉速 | r/min |

> 兩極時 $f_{se} = f_{sm}$；四極時 $f_{se} = 2f_{sm}$。P 極定子沿內圓周有 $P/2$ 組 a-c'-b-a'-c-b' 的繞組排列。

### 3.3 磁動勢與磁通分布

- 圓柱形轉子稱為**隱極式**（nonsalient poles，講義也標「圓極式」）；轉子有凸出極面的稱為**凸極式**（salient poles）。
- 要產生正弦電壓，氣隙磁通密度 $B$ 必須沿氣隙表面呈正弦分布，而這要求磁場強度 $H$（磁動勢）也呈正弦分布。

$$
n_C = N_C\cos\alpha
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $n_C$ | 位於角度 $\alpha$ 的槽內導體數 | — |
| $N_C$ | 0° 位置的槽內導體數 | — |
| $\alpha$ | 沿氣隙量的角度 | ° |

> 實際槽數有限、每槽導體數只能是整數，所以磁動勢只能**近似**正弦並含高次諧波；可用**分數節距繞組**（fractional-pitch windings）抑制諧波。

### 3.4 交流電機的感應電壓

$$
B = B_M\cos\alpha \;(\text{在轉子上量}), \qquad B = B_M\cos(\omega_m t - \alpha) \;(\text{在定子上量})
$$

$$
e_{ind} = 2vB_Ml\cos\omega_m t = 2rlB_M\omega_m\cos\omega_m t
$$

$$
\phi = 2rlB_M, \qquad e_{ind} = \phi\omega\cos\omega t, \qquad e_{ind} = N_C\phi\omega\cos\omega t
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $B_M$ | 轉子磁通密度峰值 | T |
| $\omega_m$ | 轉子機械角速度（兩極時 $\omega_m = \omega_e = \omega$） | rad/s |
| $\phi$ | 穿過線圈的磁通 | Wb |
| $N_C$ | 每個線圈的匝數 | turns |

> 計算時「坐在磁場上」看：磁場不動、導線以相對速度 $\mathbf{v}_{rel}$ 經過，就能套用 $e = (\mathbf{v}\times\mathbf{B})\cdot\mathbf{l}$。

$$
e_{aa'}(t) = N_C\phi\omega\sin\omega t, \quad e_{bb'}(t) = N_C\phi\omega\sin(\omega t - 120°), \quad e_{cc'}(t) = N_C\phi\omega\sin(\omega t - 240°)
$$

$$
E_{max} = N_C\phi\omega = 2\pi N_C\phi f, \qquad E_A = \frac{2\pi}{\sqrt{2}}N_C\phi f = \sqrt{2}\pi N_C\phi f
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $E_{max}$ | 每相感應電壓峰值 | V |
| $E_A$ | 每相感應電壓有效值（rms） | V |
| $f$ | 電頻率 | Hz |

> 端電壓：**Y 接** $V_T = \sqrt{3}E_A$；**Δ 接** $V_T = E_A$。

### 3.5 交流電機的感應轉矩

$$
B_S(\alpha) = B_S\sin\alpha, \qquad F = ilB_S\sin\alpha, \qquad \tau_{ind} = 2rilB_S\sin\alpha \;(\text{逆時針})
$$

$$
H_R = Ci, \qquad \gamma = 180° - \alpha, \qquad \sin\gamma = \sin\alpha
$$

$$
\tau_{ind} = KH_RB_S\sin\alpha, \qquad \tau_{ind} = K\mathbf{H}_R\times\mathbf{B}_S
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $B_S$ | 定子磁通密度峰值 | T |
| $H_R$ | 轉子電流產生的磁場強度 | A·turns/m |
| $C$ | 比例常數 | — |
| $\gamma$ | $\mathbf{B}_S$ 峰值與 $\mathbf{H}_R$ 峰值的夾角 | ° |
| $K$ | 構造常數 | — |

$$
\tau_{ind} = k\mathbf{B}_R\times\mathbf{B}_S, \qquad k = \frac{K}{\mu}
$$

$$
\mathbf{B}_{net} = \mathbf{B}_R + \mathbf{B}_S \;\Rightarrow\; \tau_{ind} = k\mathbf{B}_R\times\mathbf{B}_{net}, \qquad \tau_{ind} = kB_RB_{net}\sin\delta
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\mathbf{B}_R$ | 轉子磁場 | T |
| $\mathbf{B}_{net}$ | 淨磁場（未飽和時為兩者向量和） | T |
| $\delta$ | $\mathbf{B}_R$ 與 $\mathbf{B}_{net}$ 的夾角 | ° |

> $k$ 一般不是常數（$\mu$ 隨飽和改變），這組式子主要用來**定性**判斷轉矩方向。用右手定則判斷：若感應轉矩方向與轉子轉向**相反**，這台機器是**發電機**（講義 Figure 3-19）。

### 3.7 功率流與損失

$$
\eta = \frac{P_{out}}{P_{in}}\times 100\% = \frac{P_{in} - P_{loss}}{P_{in}}\times 100\%
$$

$$
P_{SCL} = 3I_A^2R_A, \qquad P_{RCL} = I_F^2R_F, \qquad P_{conv} = \tau_{ind}\,\omega_m
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $P_{SCL}$ | 定子銅損（stator copper loss），三相 | W |
| $I_A, R_A$ | 每相電樞（定子）電流、電阻 | A、Ω |
| $P_{RCL}$ | 同步電機轉子銅損（rotor copper loss） | W |
| $I_F, R_F$ | 轉子場繞組電流、電阻 | A、Ω |
| $P_{conv}$ | 機械能與電能之間轉換的功率 | W |

損失分四類：

| 類別 | 內容 |
|---|---|
| 電氣（銅）損 | 定子、轉子繞組的 $I^2R$；電阻用正常運轉溫度下的值 |
| 鐵損（core losses） | 磁滯損失＋渦流損失 |
| 機械損 | 摩擦（friction）＋風阻（windage） |
| 雜散損（stray losses） | 無法歸入前三類者，慣例取**滿載的 1%** |

> 機械損＋鐵損合稱**無載旋轉損**（no-load rotational loss）。

- **發電機功率流**：$P_{in} = \tau_{app}\omega_m$ → 扣雜散損、機械損、鐵損 → $P_{conv} = \tau_{ind}\omega_m$ → 扣 $I^2R$ → $P_{out} = 3V_\phi I_A\cos\theta = \sqrt{3}V_LI_L\cos\theta$。
- **電動機功率流**：方向相反，$P_{in} = 3V_\phi I_A\cos\theta$ → 扣 $I^2R$ → $P_{conv}$ → 扣鐵損、機械損、雜散損 → $P_{out} = \tau_{load}\omega_m$。

### 3.8 電壓調整率與速度調整率

$$
\text{VR} = \frac{V_{nl} - V_{fl}}{V_{fl}}\times 100\%, \qquad \text{SR} = \frac{n_{nl} - n_{fl}}{n_{fl}}\times 100\% = \frac{\omega_{nl} - \omega_{fl}}{\omega_{fl}}\times 100\%
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| VR | 發電機電壓調整率（voltage regulation） | % |
| $V_{nl}, V_{fl}$ | 無載、滿載端電壓 | V |
| SR | 電動機速度調整率（speed regulation） | % |
| $n_{nl}, n_{fl}$ | 無載、滿載轉速 | r/min |
| $\omega_{nl}, \omega_{fl}$ | 無載、滿載角速度 | rad/s |

- VR 為正：端電壓隨負載下垂；VR 為負：端電壓隨負載上升；VR 越小，端電壓越穩定。
- SR 為正：轉速隨負載下降；SR 為負：轉速隨負載上升；SR 大小大致代表轉矩－轉速曲線有多陡。

## 解題技巧

### 題型一：電頻率、極數與轉速換算

1. 先確認題目給的是 r/min、r/s 還是 rad/s。
2. 用 $f_{se} = \dfrac{n_{sm}P}{120}$ 或 $\omega_{se} = \dfrac{P}{2}\omega_{sm}$ 互換。
3. 要算功率或轉矩時，轉速一律換成 rad/s：$\omega = n\times\dfrac{2\pi}{60}$。

### 題型二：旋轉磁場在某瞬間的方向（講義 $\omega t = 0°, 90°$ 推導）

1. 代入該瞬間的 $\omega t$，算出三相電流（或 $B$）的大小與正負。
2. 把每個磁場寫成「大小 ∠ 空間角度」，負值代表方向反過來。
3. 拆成 $\hat{\mathbf{x}}, \hat{\mathbf{y}}$ 分量相加：$\cos 120°\hat{\mathbf{x}} + \sin 120°\hat{\mathbf{y}} = -\tfrac12\hat{\mathbf{x}} + \tfrac{\sqrt3}{2}\hat{\mathbf{y}}$、$\cos 240°\hat{\mathbf{x}} + \sin 240°\hat{\mathbf{y}} = -\tfrac12\hat{\mathbf{x}} - \tfrac{\sqrt3}{2}\hat{\mathbf{y}}$。
4. 結果大小一定是 $1.5B_M$；比較兩個瞬間的方向即可判斷轉向。

### 題型三：簡單發電機的感應電壓（例 3-2）

1. 磁通 $\phi = 2rlB = dlB$（$d$ 為定子直徑）。
2. 轉速換成 rad/s。
3. $E_{max} = N_C\phi\omega$，三相電壓分別相差 120°。
4. $E_A = E_{max}/\sqrt{2}$，再依 Y／Δ 接法求端電壓。

> 對答案用：例 3-2（$B = 0.2$ T、3600 r/min、$d = 0.5$ m、$l = 0.3$ m、15 匝、Y 接）$\phi = 0.03$ Wb、$\omega = 377$ rad/s、$E_{max} = 169.7$ V（$e_{aa'} = 169.7\sin 377t$ V）、$E_A = 120$ V、$V_T = 208$ V。

### 題型四：判斷電機是發電機還是電動機（Figure 3-19）

1. 找出 $\mathbf{B}_R$ 與 $\mathbf{B}_S$（或 $\mathbf{B}_{net}$）的方向。
2. 用右手定則算 $\mathbf{B}_R\times\mathbf{B}_S$（或 $\mathbf{B}_R\times\mathbf{B}_{net}$）的方向，得到 $\tau_{ind}$ 轉向。
3. $\tau_{ind}$ 與轉子轉向**相同** → 電動機；**相反** → 發電機。

### 題型五：效率與損失

1. 依功率流圖判斷 $P_{in}$、$P_{out}$ 在哪一端（發電機輸入是機械功率、電動機輸入是電功率）。
2. 銅損：定子 $3I_A^2R_A$、轉子 $I_F^2R_F$；題目沒給雜散損時依題意處理。
3. $\eta = P_{out}/P_{in}$。

> 💡 補充說明（AI）：本章講義沒有效率計算的例題，講義說明這類例題會在後面幾章（如 Ch.4 例 4-2、4-3）出現。

## 常見陷阱

- 磁場向量的角度（0°、120°、240°）是**空間**角，$\sin(\omega t - 120°)$ 裡的 120° 是**時間**相位，兩者不要混淆。
- 旋轉磁場大小是 $1.5B_M$，不是 $B_M$ 也不是 $3B_M$。
- 對調**任意兩相**就會反轉旋轉方向，不需要三相都改。
- $f_{se} = n_{sm}P/120$ 中的 $P$ 是**極數**（不是極對數）。
- $E_A = \sqrt{2}\pi N_C\phi f$ 是**每相有效值**；Y 接端電壓要再乘 $\sqrt{3}$。
- $\tau_{ind} = 2rilB_S\sin\alpha$ 的 $\alpha$ 與 $\gamma = 180° - \alpha$ 的正弦值相同，代哪個都可以，但要清楚定義是哪兩個向量的夾角。
- 雜散損慣例取**滿載的 1%**（多數電機的慣例）。
