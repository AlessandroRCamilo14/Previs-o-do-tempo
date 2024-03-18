let chave = "d14f9a6249f688da6c0be4d796ae815f";

function mostrarPrevisao(dados) {
    document.querySelector(".cidadeNome").innerHTML = "Tempo em " + dados.city.name;

    // Exibir informações do dia atual
    const dataAtual = new Date();
    const diaAtual = dataAtual.getDate(); // Obtém o dia atual

    // Exibir temperatura atual
    document.querySelector(".temp").innerHTML = Math.floor(dados.list[0].main.temp) + "ºC";
    document.querySelector(".umid").innerHTML = "Umidade " + dados.list[0].main.humidity + "%";

   // Encontrar a temperatura mínima e máxima para o dia atual
   let tempMinDiaAtual = Infinity;
   let tempMaxDiaAtual = -Infinity;
   for (let i = 0; i < dados.list.length; i++) {
       const previsao = dados.list[i];
       const dataPrevisao = new Date(previsao.dt * 1000);
       const diaPrevisao = dataPrevisao.getDate();

       if (diaPrevisao === diaAtual) {
           if (previsao.main.temp_min < tempMinDiaAtual) {
               tempMinDiaAtual = previsao.main.temp_min;
           }
           if (previsao.main.temp_max > tempMaxDiaAtual) {
               tempMaxDiaAtual = previsao.main.temp_max;
           }
       }
   }

   document.querySelector(".temp-min").innerHTML = "Temp. Mínima: " + Math.floor(tempMinDiaAtual) + "ºC";
   document.querySelector(".temp-max").innerHTML = "Temp. Máxima: " + Math.floor(tempMaxDiaAtual) + "ºC";

   // Exibir previsão para os próximos 3 dias
   for (let i = 1; i <= 3; i++) {
       const previsaoDia = dados.list[i * 8]; // Avança 8 unidades a cada dia (intervalo de 3 horas * 8 = 24 horas)
       const data = new Date(previsaoDia.dt * 1000); // Converter timestamp para data
       const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'long' });

       // Encontrar a temperatura mínima e máxima para cada dia
       let tempMinDia = Infinity;
       let tempMaxDia = -Infinity;
       for (let j = 0; j < 8; j++) {
           const previsaoHora = dados.list[i * 8 + j];
           if (previsaoHora.main.temp_min < tempMinDia) {
               tempMinDia = previsaoHora.main.temp_min;
           }
           if (previsaoHora.main.temp_max > tempMaxDia) {
               tempMaxDia = previsaoHora.main.temp_max;
           }
       }

       document.querySelector(`.dia${i}`).querySelector(".dia-semana").innerHTML = diaSemana;
       document.querySelector(`.dia${i}`).querySelector(".temp-max").innerHTML = "Máx.: " + Math.floor(tempMaxDia) + "ºC";
       document.querySelector(`.dia${i}`).querySelector(".temp-min").innerHTML = "Mín.: " + Math.floor(tempMinDia) + "ºC";
       document.querySelector(`.dia${i}`).querySelector(".desc").innerHTML = previsaoDia.weather[0].description;
       document.querySelector(`.dia${i}`).querySelector(".icone").src = "https://openweathermap.org/img/wn/" + previsaoDia.weather[0].icon + ".png";
   }
}

async function buscarPrevisao(cidade) {
   let dados = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${chave}&lang=pt_br&units=metric`)
       .then(resposta => resposta.json());

   mostrarPrevisao(dados);
}

function buscarPrevisaoAtual() {
   let cidade = document.querySelector(".input-city").value;
   buscarPrevisao(cidade);
}