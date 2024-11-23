window.onload = async function () {
    const counterContainer = document.getElementById("counterContainer");
    const info = document.getElementById("info");
    const canvas = document.getElementById("sobrietyChart");
    const goalText = document.createElement("h2");
    goalText.style.display = "none"; // Ocultar inicialmente

    try {
        // Fazendo uma requisição para obter o JSON
        const response = await fetch('/contadores');
        const data = await response.json();

        // Procurando o objeto do usuário corrente
        const userCounter = data.find(item => item.usuarioId === usuarioCorrente.id);

        if (userCounter) {
            // Se o objeto existir, mostrar os dados
            const startDate = new Date(userCounter.inicio);
            const today = new Date();

            // Calcula a diferença total em milissegundos, incluindo horas, minutos e segundos
            const diffTime = today - startDate;

            // Calcular a diferença em dias e horas
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Dias inteiros
            const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Horas restantes após dias

            console.log("Dias:", diffDays, "Horas:", diffHours);

            // Define a meta baseada nos dias de sobriedade
            let goal;
            if (diffDays < 1) goal = 1; // Menos de 1 dia -> meta: 1 dia
            else if (diffDays < 2) goal = 2; // Menos de 2 dias -> meta: 2 dias
            else if (diffDays < 3) goal = 3; // Menos de 3 dias -> meta: 3 dias
            else if (diffDays < 4) goal = 4; // Menos de 4 dias -> meta: 4 dias
            else if (diffDays < 5) goal = 5; // Menos de 5 dias -> meta: 5 dias
            else if (diffDays < 6) goal = 6; // Menos de 6 dias -> meta: 6 dias
            else if (diffDays < 7) goal = 7; // Menos de 7 dias -> meta: 7 dias
            else if (diffDays < 14) goal = 14; // Após 1 semana -> meta: 14 dias
            else if (diffDays < 30) goal = 30; // Após 14 dias -> meta: 30 dias
            else {
                // Após 30 dias, começamos a duplicar a meta, mas só aumentamos quando o objetivo for alcançado
                let multiplier = Math.floor(Math.log2(diffDays / 30)) + 1; // Aumenta a meta exponencialmente
                goal = Math.pow(2, multiplier) * 30; // Calcula a meta como 30, 60, 120, 240, etc.
            }

            // Configuração do gráfico
            canvas.style.display = "block";

            const ctx = canvas.getContext("2d");

            // Progresso baseado na diferença em dias
            const progress = Math.min((diffTime / (goal * 24 * 60 * 60 * 1000)) * 100, 100); // Convertendo meta de dias para milissegundos

            const sobrietyChart = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: ["Progresso", "Restante"],
                    datasets: [
                        {
                            data: [progress, 100 - progress],
                            backgroundColor: ["#4caf50", "#e0e0e0"],
                            borderWidth: 0,
                        },
                    ],
                },
                options: {
                    cutout: "70%",
                    plugins: {
                        tooltip: { enabled: false },
                        legend: { display: false },
                    },
                },
                plugins: [{
                    beforeDraw: function (chart) {
                        const ctx = chart.ctx;
                        const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
                        const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;
                        const radius = chart.innerRadius + (chart.outerRadius - chart.innerRadius) / 2;

                        // Estilo do texto
                        ctx.save();
                        ctx.font = 'bold 50px Arial';
                        ctx.fillStyle = "#000000"; // Cor do texto
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';

                        // Texto a ser exibido
                        let text;
                        if (diffDays == 1) {
                            text = `${diffDays} dia ${diffHours} h`;
                        }else if (diffDays > 1 && diffDays < 7) {
                            text = `${diffDays} dias ${diffHours} h`;
                        }else if (diffDays < 1){
                            text = `${diffHours} horas`;
                        }else {
                            text = `${diffDays} dias`;
                        }

                        // Desenha o texto no centro
                        ctx.fillText(text, centerX, centerY);
                        ctx.restore();
                    }
                }]
            });

            console.log("Dias sóbrios:", diffDays);
            console.log("Meta de dias:", goal);
            console.log("Progresso (%):", progress);


            // Adiciona botão para resetar contador
            counterContainer.innerHTML = `
                <h1>Dias Sóbrios:</h1>
            `;
            info.innerHTML = `
                <h1>META: ${goal > 1 ? goal + " dias" : "24 horas"}!</h1>
                <br>
                <button class="reset-btn" data-toggle="modal" data-target="#Modal">Reiniciar Contador</button>
            `;
        } else {
            // Caso não exista, exibir botão para iniciar o contador
            counterContainer.innerHTML = `
                <h1>Bem-vindo ao Contador de Dias Sóbrios!</h1>
                <br>
                <h2>O Contador de Dias Sóbrios tem como objetivo principal ajudar as pessoas a monitorarem e celebrarem cada dia de sua jornada rumo à sobriedade. Este contador funciona como uma ferramenta simples, porém poderosa, que permite aos usuários verem o progresso que fizeram ao longo do tempo, destacando a importância de cada dia sem recaídas.</h2>
                <br>
                <h2>A motivação é um dos principais fatores para o sucesso de qualquer processo de mudança de comportamento, especialmente no caso da recuperação de vícios. O contador serve como uma representação visual do esforço diário, oferecendo um lembrete constante de como a pessoa tem avançado em sua jornada. Cada dia contabilizado é um passo em direção a uma vida mais saudável e equilibrada, e ao ver o número de dias crescer, a sensação de conquista e orgulho pessoal pode ser imensurável.</h2>
                <br>
                <h2>Além disso, a visualização do progresso tem um impacto positivo na motivação. Ao alcançar marcos, como uma semana ou um mês de sobriedade, a pessoa sente que está no caminho certo, o que reforça o compromisso com a mudança. O contador também ajuda a manter a pessoa focada, especialmente nos momentos mais desafiadores, quando o desejo de desistir pode ser forte.</h2>
                <br>
                <h2>Ao longo do tempo, o contador se torna não apenas uma ferramenta para medir o progresso, mas também um símbolo de força, resiliência e autocontrole. Ele pode ser o incentivo necessário para continuar em frente, lembrando a pessoa de que cada dia é uma vitória, e que é possível alcançar a liberdade e o bem-estar.</h2>
                <br>
                <button class="btn btn-primary" id="startCounter">Iniciar Contador</button>
            `;

            document.getElementById("startCounter").onclick = async function () {
                const today = new Date().toISOString();

                // Criando um novo objeto para o usuário corrente
                const newCounter = {
                    id: Date.now(),
                    usuarioId: usuarioCorrente.id,
                    inicio: today
                };

                // Salvando o novo objeto (POST)
                const saveResponse = await fetch('/contadores', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newCounter)
                });

                if (saveResponse.ok) {
                    location.reload(); // Recarrega a página para exibir os dados
                } else {
                    alert("Erro ao iniciar o contador. Tente novamente.");
                }
            };
        }
    } catch (error) {
        console.error("Erro ao carregar o contador:", error);
        counterContainer.innerHTML = `<p>Erro ao carregar os dados. Tente novamente mais tarde.</p>`;
    }
};

// Lógica para resetar o contador
async function resetCounter() {
    try {
        const response = await fetch('/contadores');
        const data = await response.json();

        // Procurando o objeto do usuário corrente
        const userCounter = data.find(item => item.usuarioId === usuarioCorrente.id);

        const deleteResponse = await fetch(`/contadores/${userCounter.id}`, {
            method: "DELETE",
        });

        if (!deleteResponse.ok) {
            alert(`Erro ao reiniciar o contador. Código: ${deleteResponse.status}`);
            return;
        }

        const today = new Date().toISOString();

        const newCounter = {
            id: Date.now(),
            usuarioId: usuarioCorrente.id,
            inicio: today
        };

        const saveResponse = await fetch('/contadores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCounter)
        });

        if (saveResponse.ok) {
            location.reload();
        } else {
            alert(`Erro ao iniciar o contador. Código: ${saveResponse.status}`);
        }
    } catch (error) {
        console.error("Erro inesperado:", error);
        alert("Ocorreu um erro inesperado. Tente novamente mais tarde.");
    }
}

