// Declarando botões,lista e input
let btnAdd = document.getElementById('enviar');
let btnRemover = document.getElementById('remover');
let btnOrder = document.getElementById('ordenar');
let btnUp = document.getElementById('atualizar');
let lista = document.getElementById('listaTarefa');
let inputValor = document.getElementById('inputTexto');

let btnTodos = document.getElementById('filtroTodos');
let btnPendentes = document.getElementById('filtroPendentes');
let btnFCompleto = document.getElementById('filtroCompleto');
let btnConcluido = document.getElementById('removerConcluidos');

let listaContadores = document.getElementById('contas');

let contadorP;
let contadorC;

// Criando um array para armazenar as Tarefas
let arrayLista = JSON.parse(localStorage.getItem('tarefas')) || [];

arrayLista.forEach((item) => {
  const li = criarTexto(item.nomeTarefa, item.completo);
  lista.appendChild(li);
});
contadores(arrayLista);


let tarefasCompletas = [];
let tarefasNormais = [];

// ------------------ FUNÇÔES ---------------------
// Função para salvar a lista na memória do navegador
function salvarLocalStorage() {
  localStorage.setItem('tarefas', JSON.stringify(arrayLista));
}

// Função para comparar os nomes do arrayLista
function compare(a,b) {
  if (a.nomeTarefa < b.nomeTarefa)
     return -1;
  if (a.nomeTarefa > b.nomeTarefa)
    return 1;
  return 0;
}
// Função para contabilizar quantas tarefas foram concluídas ou estão pendentes
function contadores(listaArray){
  listaContadores.innerHTML = '';
  contadorC = 0;
  contadorP = 0;
  
  let p = document.createElement('p');
  let c = document.createElement('p')
  
  for(item of listaArray){
    (item.completo) ? contadorC++ : contadorP++;
  }
  
  p.textContent = `Pendentes: ${contadorP}`;
  c.textContent = `Concluidos: ${contadorC}`;
  
  listaContadores.appendChild(p);
  listaContadores.appendChild(c);
}

//Criando função para criar tarefa
function criarTexto (tarefa, completo = false){
  // Criando a tarefa e os botões de remover e completar
  let li = document.createElement('li');
  let btnExcluir = document.createElement('button');
  let btnCompletar = document.createElement('button');
  let btnEditar = document.createElement('button');
                
  // Atribuindo valor recebido na variavel li
  li.textContent = tarefa;
  
  // Aribuindo nomes aos botões
  btnCompletar.textContent = 'Completar';
  btnExcluir.textContent = 'Excluir';
  btnEditar.textContent = 'Editar';
  
  // Inserir a tarefa e os botões na lista
  li.appendChild(btnCompletar);
  li.appendChild(btnEditar);
  li.appendChild(btnExcluir);
  
  if(completo){
    li.classList.add('completo');
  }
  // -----------------------------------------------------

  // ---------------------- BOTÕES -----------------------
  // Atribuindo classe para completar tarefa
  btnCompletar.addEventListener('click', () => {
    // Procurar a tarefa correspondente no array
      const tarefaTexto = li.firstChild.textContent; // pega só o texto da tarefa, sem os botões              // Encontrar o objeto correspondente
      const tarefa = arrayLista.find(item => item.nomeTarefa === tarefaTexto);
    
      if (tarefa) {
        tarefa.completo = !tarefa.completo;
        li.classList.toggle('completo');
        salvarLocalStorage();
      }
      contadores(arrayLista);
  });
  
  // Removendo a tarefa da lista
  btnExcluir.addEventListener('click', () => {
    const tarefaTexto = li.firstChild.textContent;
    const index = arrayLista.findIndex(item => item.nomeTarefa === tarefaTexto);
    if (index !== -1) {
      arrayLista.splice(index, 1);
    }
    lista.removeChild(li);
    contadores(arrayLista);
    salvarLocalStorage();
  });
  
  // Editando tarefa
  btnEditar.addEventListener('click', () => {
    const inputEditar = document.createElement('input');
    const btnSalvar = document.createElement('button');
    
    btnSalvar.textContent = 'Salvar';
    const elemento = arrayLista.find((item) => item.nomeTarefa === tarefa);
    
    inputEditar.value = elemento.nomeTarefa;
    
    li.innerHTML = '';
    li.appendChild(inputEditar);
    li.appendChild(btnSalvar);
    
      btnSalvar.addEventListener('click', () => {
        // Pega o valor antigo
        const textoEditado = inputEditar.value.trim();
        
        // Procura no arrayLista onde está o elemento no array
        if(textoEditado && !arrayLista.some((item) => item.nomeTarefa === textoEditado)){
        // Verifica se elemento existe
          elemento.nomeTarefa = textoEditado;
        // Excluí o input e botão salvar
        li.innerHTML = '';
        // Atribui o novo texto em <li>
        li.textContent = textoEditado;
        // Atribui novamente os botões à <li>
          
        const novoLi = criarTexto(elemento.nomeTarefa, elemento.completo);  
        lista.replaceChild(novoLi, li);
        salvarLocalStorage();                  
        } else {
          alert('Valor duplicado');
        }
      });
  });
  
  return li;
} // Fim de criarTexto() 

// Adicionando tarefa na página e em arrayLista
btnAdd.addEventListener('click', () => {
  let valor = inputValor.value;
  
  // Conferir se o texto do input não está vazio
  if(!valor.trim()) { 
    alert('Campo esta vazio!');
    return;
  }
  
  // Atribuindo a tarefa no array
  //Verifica se o elemento já existe no array
  if(!arrayLista.some(item => item.nomeTarefa === valor)) {
  const novaTarefa = {
    nomeTarefa: valor,
    completo: false,
  };
  arrayLista.push(novaTarefa);
  // Senão existir adiciona no array e cria o elemento
  let elemento = criarTexto(valor);
  
  lista.appendChild(elemento);
  salvarLocalStorage();
  }
  
  inputValor.value = '';
  contadores(arrayLista);
});

// Remover todos as tarefas
btnRemover.addEventListener('click', () => {
  arrayLista = [];
  lista.innerHTML = '';
  contadores(arrayLista);
  salvarLocalStorage();
});

// Ordenar tarefas
btnOrder.addEventListener('click', () => {
  arrayLista.sort(compare);
  salvarLocalStorage();
});

// Atualizar tarefas na pagina e em arrayLista
btnUp.addEventListener('click', () => {

tarefasCompletas = [];
tarefasNormais = [];        

// Remove os elementos da pagina
  lista.innerHTML = '';
  
  arrayLista.forEach((item) => {
    const li = criarTexto(item.nomeTarefa, item.completo);
      if(li.classList.contains('completo')){
        tarefasCompletas.push(li);
      } else {
        tarefasNormais.push(li);
      }
  });
  
  // Ordena os <li> nas tarefas pendentes ou completas
  tarefasNormais.sort((a, b) =>
      a.firstChild.textContent.localeCompare(b.firstChild.textContent)
  );
  tarefasCompletas.sort((a, b) =>
      a.firstChild.textContent.localeCompare(b.firstChild.textContent)
  );
  
  // Atribuindo valor recebido na variavel li
  for(item of tarefasNormais){
    lista.appendChild(item);
  }
  
  for(item of tarefasCompletas){
    lista.appendChild(item);
  }
  salvarLocalStorage();
});
  
btnConcluido.addEventListener('click', () => {
    arrayLista = arrayLista.filter(item => !item.completo);
    lista.innerHTML = '';
    arrayLista.forEach(item => {
        lista.appendChild(criarTexto(item.nomeTarefa, item.completo));
    });
    contadores(arrayLista);
    salvarLocalStorage();
});


// Filtros
btnFCompleto.addEventListener('click', () => {
  lista.innerHTML = '';
  arrayLista.forEach(item =>{
    if(item.completo){
      const liCompleto = criarTexto(item.nomeTarefa, item.completo);
      lista.appendChild(liCompleto);
    }
  });
});

btnTodos.addEventListener('click', () => {
  lista.innerHTML = '';
  arrayLista.forEach(item => {
    const liTodos = criarTexto(item.nomeTarefa, item.completo);
    lista.appendChild(liTodos);
  });
});

btnPendentes.addEventListener('click', () => {
  lista.innerHTML = '';
  arrayLista.forEach(item =>{
    if(!item.completo){
      const liCompleto = criarTexto(item.nomeTarefa, item.completo);
      lista.appendChild(liCompleto);
    }
  });
});
// -----------------------------------------------------------