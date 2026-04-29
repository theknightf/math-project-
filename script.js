document.addEventListener('DOMContentLoaded', () => {
    // ===== DOM Elements =====
    const sizeInput = document.getElementById('matrixSize');
    const generateBtn = document.getElementById('generateBtn');
    const matrixSection = document.getElementById('matrixSection');
    const matrixGrid = document.getElementById('matrixGrid');
    const solveBtn = document.getElementById('solveBtn');
    const fillExampleBtn = document.getElementById('fillExampleBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultsSection = document.getElementById('resultsSection');
    const resultsContainer = document.getElementById('resultsContainer');
    const stepsContainer = document.getElementById('stepsContainer');
    const toggleStepsBtn = document.getElementById('toggleSteps');
    const sizeBtns = document.querySelectorAll('.size-btn');

    let currentSize = 3;

    // ===== Egyptian Proverbs Pool =====
    const matrixProverbs = [
        "اللي يتلسع من الـ Pivot ينفخ في الـ Diagonal 🥣",
        "الصبر مفتاح الـ Back Substitution 🔑",
        "اللي ما يعرفش الـ Augmented Matrix يقول عدس 🫘",
        "القرد في عين الـ Linear Algebra غزال 🦌",
        "يا بخت من وفّق بين الـ Equations 🤝",
        "العين بصيرة والـ Rank قصير 👁️",
        "اللي على راسه Zero يحسس عليه 🫣",
        "الجواب يبان من الـ Forward Elimination 📬",
        "ابن الـ Matrix عوّام 🦆",
        "اللي يحب الـ Precision يتحمّل رخامة الـ Fractions 🌹",
        "يا مأمنه للـ Manual Calculations يا مأمنه للمَيّه في الغربال 💧",
        "خطوة خطوة بنوصل للـ Upper Triangular 🏔️",
        "اصرف مجهود في الـ Logic يأتيك الـ Debugging في الغيب 💰",
        "إيد لوحدها ما بتعملش Row Operation 👏",
        "اديني Convergence وارميني في البحر 🌊",
        "الـ Code الحلو ما يكملش 🍯",
        "اللي يعيش ياما يشوف Runtime Errors 👀",
        "رأي الـ Documentation لا يضل 🧠",
        "طول ما في ميموري في أمل ✨",
        "الكتاب يبان من الـ Comments بتاعته 📖",
    ];
    function getRandomProverb() {
        return matrixProverbs[Math.floor(Math.random() * matrixProverbs.length)];
    }

    // ===== Particles Background =====
    function createParticles() {
        const container = document.getElementById('particles');
        const colors = ['#818cf8', '#60a5fa', '#34d399', '#a78bfa'];
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 4 + 2;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = Math.random() * 100 + '%';
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            p.style.animationDuration = (Math.random() * 15 + 10) + 's';
            p.style.animationDelay = (Math.random() * 10) + 's';
            container.appendChild(p);
        }
    }
    createParticles();

    // ===== Size Picker Logic =====
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const size = parseInt(btn.dataset.size);
            sizeInput.value = size;
            currentSize = size;
        });
    });

    sizeInput.addEventListener('change', () => {
        sizeBtns.forEach(b => b.classList.remove('active'));
        currentSize = parseInt(sizeInput.value);
    });

    // ===== Generate Matrix =====
    generateBtn.addEventListener('click', () => {
        const size = parseInt(sizeInput.value);
        if (isNaN(size) || size < 2 || size > 10) {
            alert('من فضلك اختار حجم بين 2 و 10');
            return;
        }
        currentSize = size;
        generateMatrixGrid(size);
        matrixSection.classList.remove('hidden');
        resultsSection.classList.add('hidden');
        matrixSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // ===== Solve =====
    solveBtn.addEventListener('click', solveMatrix);

    // ===== Fill Example =====
    fillExampleBtn.addEventListener('click', () => {
        const examples = {
            2: [[3, 2, 16], [1, -1, 1]],
            3: [[2, 1, -1, 8], [-3, -1, 2, -11], [-2, 1, 2, -3]],
            4: [[1, 1, 1, 1, 10], [2, 3, 1, 1, 17], [1, 1, 2, 3, 22], [3, 1, 1, 2, 17]],
            5: [[2, 1, 0, 0, 0, 3], [1, 3, 1, 0, 0, 5], [0, 1, 4, 1, 0, 6], [0, 0, 1, 5, 1, 7], [0, 0, 0, 1, 6, 8]]
        };
        const ex = examples[currentSize];
        if (!ex) {
            alert('مفيش مثال جاهز للحجم ده، دور في حجم 2 أو 3 أو 4 أو 5');
            return;
        }
        for (let i = 0; i < currentSize; i++) {
            for (let j = 0; j <= currentSize; j++) {
                const cell = document.getElementById(`cell-${i}-${j}`);
                if (cell) cell.value = ex[i][j];
            }
        }
    });

    // ===== Clear =====
    clearBtn.addEventListener('click', () => {
        for (let i = 0; i < currentSize; i++) {
            for (let j = 0; j <= currentSize; j++) {
                const cell = document.getElementById(`cell-${i}-${j}`);
                if (cell) cell.value = '';
            }
        }
    });

    // ===== Toggle Steps =====
    toggleStepsBtn.addEventListener('click', () => {
        stepsContainer.style.display = stepsContainer.style.display === 'none' ? 'block' : 'none';
    });

    // ===== Generate Matrix Grid =====
    function generateMatrixGrid(n) {
        matrixGrid.innerHTML = '';
        matrixGrid.style.gridTemplateColumns = '1fr';

        for (let i = 0; i < n; i++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'matrix-row';

            for (let j = 0; j <= n; j++) {
                // Insert separator before the constant column
                if (j === n) {
                    const sep = document.createElement('div');
                    sep.className = 'matrix-separator';
                    rowDiv.appendChild(sep);
                }

                const input = document.createElement('input');
                input.type = 'number';
                input.step = 'any';
                input.className = 'matrix-cell' + (j === n ? ' constant' : '');
                input.id = `cell-${i}-${j}`;
                input.placeholder = j === n ? `b${i + 1}` : `a${i + 1}${j + 1}`;
                rowDiv.appendChild(input);
            }
            matrixGrid.appendChild(rowDiv);
        }

        const firstCell = document.getElementById('cell-0-0');
        if (firstCell) firstCell.focus();
    }

    // ===== Read Matrix from DOM =====
    function getMatrixFromDom(n) {
        let matrix = [];
        for (let i = 0; i < n; i++) {
            let row = [];
            for (let j = 0; j <= n; j++) {
                const cell = document.getElementById(`cell-${i}-${j}`);
                const val = parseFloat(cell.value);
                if (isNaN(val)) {
                    throw new Error(`في مشكلة في الرقم في الصف ${i + 1}، العمود ${j + 1}. لازم تدخّل أرقام صح!`);
                }
                row.push(val);
            }
            matrix.push(row);
        }
        return matrix;
    }

    // ===== Format Matrix for Display =====
    function formatMatrix(matrix) {
        const n = matrix.length;
        let lines = [];
        for (let i = 0; i < n; i++) {
            let parts = [];
            for (let j = 0; j < matrix[i].length; j++) {
                parts.push(matrix[i][j].toFixed(2).padStart(9, ' '));
                if (j === matrix[i].length - 2) parts.push('  |');
            }
            lines.push('│ ' + parts.join(' ') + ' │');
        }
        const w = lines[0].length;
        return '┌' + '─'.repeat(w - 2) + '┐\n' + lines.join('\n') + '\n└' + '─'.repeat(w - 2) + '┘';
    }

    // ===== Deep Clone Matrix =====
    function cloneMatrix(m) {
        return m.map(row => [...row]);
    }

    // ===== Solve Matrix =====
    function solveMatrix() {
        try {
            const matrix = getMatrixFromDom(currentSize);
            const result = gaussianElimination(matrix, currentSize);
            displayResults(result);
        } catch (e) {
            resultsSection.classList.remove('hidden');
            resultsContainer.innerHTML = `<div class="error-message">⚠️ ${e.message}</div>`;
            stepsContainer.innerHTML = '';
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // ===== Gaussian Elimination with Egyptian Steps =====
    function gaussianElimination(matrix, n) {
        let steps = [];
        let stepNum = 0;

        // Step 0: Show initial matrix
        stepNum++;
        steps.push({
            num: stepNum,
            title: 'المصفوفة الأولانية (Augmented Matrix)',
            explanation: `يلا بينا نبدأ! دي المصفوفة الأولانية اللي انت دخّلتها. الأرقام اللي على الشمال دي المعاملات (coefficients) واللي على اليمين بعد الخط دي الثوابت (constants). هدفنا إننا نحوّل الجزء الشمال لمثلث علوي (upper triangular) عشان نقدر نحل بسهولة.`,
            proverb: getRandomProverb(),
            matrix: formatMatrix(matrix)
        });

        // Forward Elimination with Partial Pivoting
        for (let i = 0; i < n; i++) {
            // Partial Pivoting
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(matrix[k][i]) > Math.abs(matrix[maxRow][i])) {
                    maxRow = k;
                }
            }

            // Swap rows
            if (maxRow !== i) {
                let temp = matrix[i];
                matrix[i] = matrix[maxRow];
                matrix[maxRow] = temp;
                stepNum++;
                steps.push({
                    num: stepNum,
                    title: `تبديل الصف ${i + 1} مع الصف ${maxRow + 1} (Row Swap)`,
                    explanation: `هنا بنعمل حاجة اسمها Partial Pivoting. يعني بندوّر على أكبر رقم في العمود ${i + 1} عشان نحطه في مكان ال pivot (الرقم الرئيسي). ده بيخلّي الحسابات أدق وبيمنع مشاكل القسمة على أرقام صغيرة أوي.`,
                    proverb: getRandomProverb(),
                    matrix: formatMatrix(matrix)
                });
            }

            if (Math.abs(matrix[i][i]) < 1e-10) {
                if (Math.abs(matrix[i][n]) > 1e-10) {
                    throw new Error("النظام ده مالوش حل! (Inconsistent system) — يعني المعادلات بتناقض بعض.");
                } else {
                    throw new Error("النظام ده عنده حلول لا نهائية! (Dependent system) — يعني في معادلات زايدة عن اللزوم.");
                }
            }

            // Elimination
            for (let k = i + 1; k < n; k++) {
                let factor = matrix[k][i] / matrix[i][i];
                if (Math.abs(factor) < 1e-10) continue;

                for (let j = i; j <= n; j++) {
                    matrix[k][j] -= factor * matrix[i][j];
                }
                // Clean near-zero values
                for (let j = 0; j <= n; j++) {
                    if (Math.abs(matrix[k][j]) < 1e-10) matrix[k][j] = 0;
                }

                stepNum++;
                const factorStr = factor > 0
                    ? `(${factor.toFixed(3)})`
                    : `(${factor.toFixed(3)})`;

                steps.push({
                    num: stepNum,
                    title: `حذف من الصف ${k + 1} باستخدام الصف ${i + 1}`,
                    explanation: `دلوقتي بنصفّر العنصر اللي في الصف ${k + 1} والعمود ${i + 1}. بنعمل كده إننا بنطرح ${factorStr} مضروبة في الصف ${i + 1} من الصف ${k + 1}.\n\nيعني: R${k + 1} = R${k + 1} - ${factorStr} × R${i + 1}\n\nوكده بقى عندنا صفر في المكان اللي عايزينه! تحت ال pivot خلاص بقى نضيف.`,
                    proverb: getRandomProverb(),
                    matrix: formatMatrix(matrix)
                });
            }
        }

        // Show upper triangular result
        stepNum++;
        steps.push({
            num: stepNum,
            title: '🎯 خلصنا الـ Forward Elimination!',
            explanation: `تمام يا معلّم! كده خلّصنا مرحلة الـ Forward Elimination وبقت المصفوفة على شكل مثلث علوي (Upper Triangular). يعني كل الأرقام تحت القطر الرئيسي بقت أصفار. دلوقتي هنبدأ نحل من تحت لفوق (Back Substitution).`,
            proverb: getRandomProverb(),
            matrix: formatMatrix(matrix)
        });

        // Back Substitution
        let x = new Array(n).fill(0);
        let backSubSteps = [];

        for (let i = n - 1; i >= 0; i--) {
            if (Math.abs(matrix[i][i]) < 1e-10) {
                if (Math.abs(matrix[i][n]) > 1e-10) {
                    throw new Error("النظام ده مالوش حل!");
                } else {
                    throw new Error("النظام ده عنده حلول لا نهائية!");
                }
            }

            x[i] = matrix[i][n];
            let calcParts = [`x${i + 1} = ${matrix[i][n].toFixed(2)}`];
            for (let j = i + 1; j < n; j++) {
                x[i] -= matrix[i][j] * x[j];
                calcParts.push(`- (${matrix[i][j].toFixed(2)} × ${x[j].toFixed(2)})`);
            }
            x[i] = x[i] / matrix[i][i];
            if (Math.abs(x[i]) < 1e-10) x[i] = 0;

            if (matrix[i][i] !== 1) {
                calcParts.push(`وبعدين نقسم على ${matrix[i][i].toFixed(2)}`);
            }

            backSubSteps.push({
                variable: `x${i + 1}`,
                value: x[i],
                calc: calcParts.join(' ')
            });
        }

        // Add back substitution steps
        stepNum++;
        let backSubExplanation = 'دلوقتي بنحل من آخر معادلة ونطلع لفوق:\n\n';
        backSubSteps.forEach(s => {
            backSubExplanation += `• ${s.variable} = ${parseFloat(s.value.toFixed(4))}\n  الحساب: ${s.calc}\n\n`;
        });

        steps.push({
            num: stepNum,
            title: '🔄 التعويض العكسي (Back Substitution)',
            explanation: backSubExplanation,
            proverb: getRandomProverb(),
            matrix: null
        });

        // Final celebration step
        stepNum++;
        steps.push({
            num: stepNum,
            title: '🎉 مبروك! وصلنا للحل!',
            explanation: `كده يا بطل خلّصنا وجبنا الحل! القيم النهائية:\n\n${x.map((v, i) => `✅ x${i + 1} = ${parseFloat(v.toFixed(4))}`).join('\n')}\n\nأحسنت والله! الرياضيات مش صعبة لما واحد يفهمها خطوة خطوة 💪`,
            proverb: "طول ما في عمر في أمل ✨",
            matrix: null
        });

        return { solution: x, steps: steps };
    }

    // ===== Display Results =====
    function displayResults(data) {
        resultsSection.classList.remove('hidden');
        stepsContainer.style.display = 'block';

        // Display solution
        resultsContainer.innerHTML = '';
        data.solution.forEach((val, idx) => {
            const item = document.createElement('div');
            item.className = 'result-item';
            let displayVal = parseFloat(val.toFixed(4));
            item.innerHTML = `<span class="result-var">x<sub>${idx + 1}</sub></span>
                              <span class="result-eq">=</span>
                              <span class="result-val">${displayVal}</span>`;
            resultsContainer.appendChild(item);
        });

        // Display steps as cards
        stepsContainer.innerHTML = '';
        data.steps.forEach(step => {
            const card = document.createElement('div');
            card.className = 'step-card';

            let html = `<div class="step-title">
                            <span class="step-number">${step.num}</span>
                            ${step.title}
                        </div>
                        <div class="step-explanation">${step.explanation.replace(/\n/g, '<br>')}</div>
                        <div class="step-proverb">🇪🇬 مثل مصري: "${step.proverb}"</div>`;

            if (step.matrix) {
                html += `<div class="step-matrix">${step.matrix}</div>`;
            }

            card.innerHTML = html;
            stepsContainer.appendChild(card);
        });

        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
});
