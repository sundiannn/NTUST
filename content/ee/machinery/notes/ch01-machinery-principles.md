# Ch.1 電機機械原理導論

> 依據：老師講義 Chapter 1 Introduction to Machinery Principles（1.1–1.8）｜更新：2026-11-15
>
> 老師指定習題：1-5、1-6、1-7、1-8、1-9、1-11、1-13、1-14、1-21、1-22

<!-- TODO: 待確認：講義目錄列有 1.9「單相交流電路的實功、虛功與視在功率」，但提供的講義內容只到 1.8，此節尚未整理。 -->

## 重點摘要

- 磁場是所有電機機械轉換能量的核心，四個基本原理分別對應：**電流產生磁場**、**變動磁通感應電壓（變壓器）**、**載流導線受力（馬達）**、**運動導線感應電壓（發電機）**。
- 磁路可以類比成電路：磁動勢 $\mathcal{F}$ ↔ 電壓、磁通 $\phi$ ↔ 電流、磁阻 $\mathcal{R}$ ↔ 電阻，串並聯算法也相同。
- **氣隙**雖然很短，卻常常貢獻大部分的磁阻；鐵心的導磁係數不是常數，實際機器多半操作在磁化曲線的「膝點」附近。
- 鐵心損失（core loss）＝**磁滯損失**＋**渦流損失**；用**疊片**與**加矽提高電阻率**可以降低渦流損失。
- 線性直流機是馬達與發電機的簡化模型：$e_{ind} < V_B$ 時是**馬達**，$e_{ind} > V_B$ 時是**發電機**。

## 公式整理

### 1.3 旋轉運動與功率

$$
\omega = \frac{d\theta}{dt}, \qquad \alpha = \frac{d\omega}{dt}
$$

$$
n_m = 60 f_m, \qquad f_m = \frac{\omega_m}{2\pi}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\theta$ | 角位置（angular position） | rad |
| $\omega_m$ | 角速度（angular velocity） | rad/s |
| $f_m$ | 轉速（每秒轉數） | r/s |
| $n_m$ | 轉速（每分鐘轉數） | rpm |
| $\alpha$ | 角加速度（angular acceleration） | rad/s² |

> 下標 $m$ 表示「機械量」，用來和電氣量區分。

$$
\tau = rF\sin\theta, \qquad \tau = J\alpha
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\tau$ | 轉矩（torque） | N·m |
| $r$ | 轉軸到施力點的距離 | m |
| $\theta$ | $\mathbf{r}$ 與 $\mathbf{F}$ 的夾角 | — |
| $J$ | 轉動慣量（moment of inertia） | kg·m² |

$$
W = \int \tau \, d\theta \;\xrightarrow{\tau \text{ 固定}}\; W = \tau\theta
$$

$$
P = \frac{dW}{dt} \;\Rightarrow\; P = Fv \;(\text{直線}), \qquad P = \tau\omega \;(\text{旋轉})
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $W$ | 功（work） | J |
| $P$ | 功率（power） | W |

> $P = \tau\omega$ 只有在 $\tau$ 用 N·m、$\omega$ 用 **rad/s** 時才成立，rpm 要先換算。

### 1.4 磁場的產生

$$
\oint \mathbf{H}\cdot d\mathbf{l} = I_{net} \;\Rightarrow\; H l_c = Ni \;\Rightarrow\; H = \frac{Ni}{l_c}
$$

$$
\mathbf{B} = \mu \mathbf{H}, \qquad \mu = \mu_r \mu_0, \qquad \mu_0 = 4\pi \times 10^{-7}\ \text{H/m}
$$

$$
\phi = \int_A \mathbf{B}\cdot d\mathbf{A} \;\xrightarrow{B \text{ 均勻且垂直}}\; \phi = BA = \frac{\mu N i A}{l_c}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $H$ | 磁場強度（magnetic field intensity） | A·turns/m |
| $l_c$ | 鐵心平均路徑長 | m |
| $N$ | 線圈匝數 | turns |
| $B$ | 磁通密度（flux density） | T（= Wb/m²） |
| $\mu$ | 導磁係數（permeability） | H/m |
| $\mu_r$ | 相對導磁係數（relative permeability） | 無單位 |
| $\phi$ | 磁通（flux） | Wb |
| $A$ | 截面積 | m² |

> 一般電機用的鋼材 $\mu_r$ 約 2000～6000。

### 1.4 磁路

$$
\mathcal{F} = Ni = \phi\mathcal{R}, \qquad \mathcal{R} = \frac{l}{\mu A}, \qquad \mathcal{P} = \frac{1}{\mathcal{R}}
$$

$$
\text{串聯：}\ \mathcal{R}_{eq} = \mathcal{R}_1 + \mathcal{R}_2 + \cdots \qquad
\text{並聯：}\ \frac{1}{\mathcal{R}_{eq}} = \frac{1}{\mathcal{R}_1} + \frac{1}{\mathcal{R}_2} + \cdots
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\mathcal{F}$ | 磁動勢（magnetomotive force, mmf） | A·turns |
| $\mathcal{R}$ | 磁阻（reluctance） | A·turns/Wb |
| $\mathcal{P}$ | 磁導（permeance） | Wb/A·turns |

> 磁動勢極性用右手定則：四指沿電流方向彎曲，拇指指向正的 mmf 方向。

### 1.5 法拉第定律

$$
e_{ind} = -N\frac{d\phi}{dt}, \qquad e_{ind} = \frac{d\lambda}{dt}, \qquad \lambda = \sum_{i=1}^{N}\phi_i
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $e_{ind}$ | 感應電壓 | V |
| $\lambda$ | 磁交鏈（flux linkage） | Wb·turns |

> 負號代表**冷次定律（Lenz's law）**：感應電壓的極性，會讓產生的電流去「抵抗」原本的磁通變化。

### 1.6 載流導線受力（馬達作用）

$$
\mathbf{F} = i(\mathbf{l}\times\mathbf{B}), \qquad F = ilB\sin\theta
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\mathbf{l}$ | 導線長度向量，方向＝電流方向 | m |
| $\theta$ | 導線與 $\mathbf{B}$ 的夾角 | — |

### 1.7 運動導線感應電壓（發電機作用）

$$
e_{ind} = (\mathbf{v}\times\mathbf{B})\cdot\mathbf{l}
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $\mathbf{v}$ | 導線速度 | m/s |
| $\mathbf{l}$ | 導線長度向量，取與 $\mathbf{v}\times\mathbf{B}$ 夾角最小的方向 | m |

> 正極在 $\mathbf{v}\times\mathbf{B}$ 指向的那一端。

### 1.8 線性直流機

$$
V_B = e_{ind} + iR, \qquad i = \frac{V_B - e_{ind}}{R}, \qquad F_{ind} = ilB, \qquad e_{ind} = vBl
$$

$$
v_{ss} = \frac{V_B}{Bl}\ (\text{無載穩態}), \qquad P_{conv} = e_{ind}\,i = F_{ind}\,v, \qquad P_{conv} = \tau_{ind}\,\omega
$$

| 符號 | 意義 | 單位 |
|---|---|---|
| $V_B$ | 電池電壓 | V |
| $R$ | 電路電阻 | Ω |
| $v_{ss}$ | 穩態速度 | m/s |
| $P_{conv}$ | 電能與機械能之間轉換的功率 | W |

## 解題技巧

### 題型一：磁路求磁通或電流（例 1-1、1-2、1-3）

1. 把鐵心切成「截面積相同、材料相同」的幾段，每段畫成一個磁阻。
2. 每段用 $\mathcal{R} = \dfrac{l}{\mu_r\mu_0 A}$ 計算，**長度換成 m、面積換成 m²**（例：12 cm² = 0.0012 m²）。
3. 氣隙的 $\mu_r = 1$；題目若說邊緣效應讓面積增加 5%，氣隙面積就乘上 1.05。
4. 串聯相加得 $\mathcal{R}_{eq}$，再用 $\phi = \mathcal{F}/\mathcal{R}_{eq}$ 或 $i = \phi\mathcal{R}_{eq}/N$。
5. 題目問**氣隙**的 $B$ 時，要除以**氣隙的有效面積**，不是鐵心面積。

> 對答案用：例 1-1 $\phi \approx 0.0048$ Wb；例 1-2 $\mathcal{R}_{eq} \approx 382{,}300$ A·turns/Wb、$i \approx 0.602$ A；例 1-3 $B \approx 0.19$ T。

### 題型二：查磁化曲線（例 1-4、1-5）

1. 由 $\phi$ 求 $B = \phi/A$，再從曲線讀出對應的 $H$。
2. $\mathcal{F} = Hl_c$，$i = \mathcal{F}/N$。
3. $\mu = B/H$，$\mu_r = \mu/\mu_0$，$\mathcal{R} = \mathcal{F}/\phi$。
4. 曲線上不同的 $H$ 會算出不同的 $\mu_r$：先升後降，飽和後會變很小。

### 題型三：判斷感應電壓與受力方向（例 1-6～1-9）

- **線圈感應電壓**：$e = N\,d\phi/dt$ 求大小，極性用冷次定律判斷（感應電流產生的磁通要反抗原本的變化）。
  例 1-6：$\phi = 0.05\sin 377t$、$N = 100$ → $e = 1885\cos 377t$ V。
- **導線受力**：算 $\mathbf{l}\times\mathbf{B}$ 的方向（佛萊明左手定則），大小 $F = ilB\sin\theta$。
- **運動導線電壓**：先算 $\mathbf{v}\times\mathbf{B}$ 的方向決定正極，再和 $\mathbf{l}$ 做內積。導線斜放時要乘上 $\cos$（例 1-9：夾角 30°，$e = 10 \times 0.5 \times 1 \times \cos 30° \approx 4.33$ V）。

### 題型四：線性直流機（例 1-10）

1. **啟動**：$v = 0 \Rightarrow e_{ind} = 0 \Rightarrow i_{start} = V_B/R$（通常非常大）。
2. **無載穩態**：$F_{ind} = 0 \Rightarrow i = 0 \Rightarrow v_{ss} = V_B/(Bl)$。
3. **加外力後的穩態**：$F_{ind} = F_{app}$ → $i = F/(lB)$。
   - 外力**與運動同向** → 發電機：$e_{ind} = V_B + iR$。
   - 外力**與運動反向** → 馬達：$e_{ind} = V_B - iR$。
   - 再用 $v = e_{ind}/(Bl)$ 求速度。
4. **功率**：導體 $P = e_{ind}\,i$，電池 $P = V_B\,i$，兩者相差的就是電阻損耗 $i^2R$。
5. **磁場變弱**：無載時 $e_{ind}$ 仍等於 $V_B$，所以 $B$ 變小，$v$ 反而變大。

> 例 1-10 對答案用：$i_{start} = 400$ A、$v_{ss} = 120$ m/s；30 N 向右 → 129 m/s（發電機）；30 N 向左 → 111 m/s（馬達）；$B = 0.08$ T → 150 m/s。

## 常見陷阱

- 單位沒換：cm → m、cm² → m²、rpm → rad/s。
- 忘了氣隙的 $\mu_r = 1$，或是氣隙面積忘了加上邊緣效應。
- 磁路計算本來就是近似值，講義說誤差大約在 5% 以內，原因有漏磁、平均路徑長估計不準、$\mu$ 隨飽和改變、邊緣效應。
- 磁滯迴線的面積和每個週期的磁滯損失成正比，所以 mmf 的擺幅越小，損失越小。
- 剩磁（residual flux）要靠反向的**強制磁動勢**（coercive mmf）$\mathcal{F}_c$ 才能消除。
- 線性直流機啟動電流可能超過額定電流 10 倍以上，實務上會在啟動時**串聯啟動電阻**來限流。
