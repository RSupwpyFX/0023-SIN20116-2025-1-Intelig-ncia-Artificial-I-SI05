// Classe que representa um nó no algoritmo A*
class Node {
    constructor(board, g, h, parent = null) {
        this.board = board;     // O tabuleiro como um array de 9 números
        this.g = g;             // Custo real do caminho até aqui (número de movimentos)
        this.h = h;             // Estimativa (heurística) de distância até o objetivo
        this.f = g + h;         // Custo total (f = g + h)
        this.parent = parent;   // Referência para o nó anterior (para reconstruir o caminho)
    }

    // Método para encontrar a posição da peça vazia (representada por 0)
    findEmptySpace() {
        return this.board.indexOf(0);
    }

    // Método para trocar a peça vazia com outra posição (i, j)
    swap(board, i, j) {
        let newBoard = board.slice(); // Cria uma cópia do array original para não alterar o original
        [newBoard[i], newBoard[j]] = [newBoard[j], newBoard[i]]; // Troca os elementos de posição
        return newBoard;
    }

    // Método para gerar os filhos (novos estados possíveis a partir do estado atual)
    getChildren() {
        const emptyIndex = this.findEmptySpace(); // Encontra a posição do espaço vazio
        const possibleMoves = []; // Lista de movimentos possíveis para a peça vazia
        const row = Math.floor(emptyIndex / 3); // Linha onde está a peça vazia
        const col = emptyIndex % 3;             // Coluna onde está a peça vazia

        // Se for possível mover para cima, adiciona a posição na lista de movimentos
        if (row > 0) possibleMoves.push(emptyIndex - 3); // Mover para cima
        // Se for possível mover para baixo, adiciona a posição na lista de movimentos
        if (row < 2) possibleMoves.push(emptyIndex + 3); // Mover para baixo
        // Se for possível mover para a esquerda, adiciona a posição na lista de movimentos
        if (col > 0) possibleMoves.push(emptyIndex - 1); // Mover para a esquerda
        // Se for possível mover para a direita, adiciona a posição na lista de movimentos
        if (col < 2) possibleMoves.push(emptyIndex + 1); // Mover para a direita

        // Para cada movimento possível, gera um novo nó (estado)
        return possibleMoves.map(move => {
            const newBoard = this.swap(this.board, emptyIndex, move); // Gera um novo estado
            return new Node(newBoard, this.g + 1, 0, this); // Cria um novo nó com o novo estado
        });
    }
}

// Classe para gerenciar a fila de prioridade (usada no A*)
class PriorityQueue {
    constructor() {
        this.elements = []; // Lista de elementos na fila
    }

    // Método para adicionar um nó à fila de prioridade
    enqueue(node) {
        this.elements.push(node); // Adiciona o nó na lista
        // Ordena os nós pela soma do custo total (f = g + h), o menor f vem primeiro
        this.elements.sort((a, b) => (a.g + a.h) - (b.g + b.h));
    }

    // Método para remover o nó com o menor custo total (f)
    dequeue() {
        return this.elements.shift(); // Remove o nó com menor f(n)
    }

    // Método para verificar se a fila está vazia
    isEmpty() {
        return this.elements.length === 0;
    }
}

// Função principal para resolver o problema do 8-Puzzle
function solve(startBoard) {
    const startNode = new Node(startBoard, 0, heuristic(startBoard), null); // Cria o nó inicial
    const openSet = new PriorityQueue(); // Fila de prioridade para armazenar nós a serem processados
    openSet.enqueue(startNode); // Coloca o nó inicial na fila
    
    const visited = new Set(); // Conjunto de estados já visitados para evitar ciclos
    
    while (!openSet.isEmpty()) {
        const current = openSet.dequeue(); // Pega o nó com menor f(n)

        // Se o nó atual é a solução, reconstrua o caminho e retorne
        if (isGoal(current.board)) {
            return reconstructPath(current); // Retorna o caminho da solução
        }

        visited.add(current.board.toString()); // Marca o estado atual como visitado
        
        // Gera os filhos do nó atual e os adiciona à fila de prioridade, se ainda não foram visitados
        current.getChildren().forEach(child => {
            if (!visited.has(child.board.toString())) {
                openSet.enqueue(child); // Enfileira o filho se não foi visitado
            }
        });
    }

    return null; // Se não encontrar solução, retorna null
}

// Função para verificar se o estado atual é o objetivo (tabuleiro ordenado)
function isGoal(board) {
    return board.toString() === "1,2,3,4,5,6,7,8,0"; // Compara com a solução desejada
}

// Função para calcular a heurística de Manhattan (distância total das peças até suas posições finais)
function heuristic(board) {
    const goal = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // Estado final desejado
    let distance = 0; // Distância total

    // Para cada peça no tabuleiro, calcula a distância até a posição correta
    board.forEach((value, index) => {
        if (value !== 0) {
            const goalIndex = goal.indexOf(value); // Posição da peça no objetivo
            const currentRow = Math.floor(index / 3); // Linha atual
            const currentCol = index % 3;             // Coluna atual
            const goalRow = Math.floor(goalIndex / 3); // Linha no objetivo
            const goalCol = goalIndex % 3;             // Coluna no objetivo

            // Soma as distâncias horizontais e verticais
            distance += Math.abs(currentRow - goalRow) + Math.abs(currentCol - goalCol);
        }
    });

    return distance; // Retorna a distância total
}

// Função para reconstruir o caminho da solução a partir do nó final
function reconstructPath(node) {
    const path = [];
    while (node !== null) {
        path.unshift(node.board); // Adiciona o tabuleiro do nó atual ao início do caminho
        node = node.parent; // Vai para o nó anterior
    }
    return path; // Retorna o caminho completo
}

// Tabuleiro inicial
const startBoard = [4, 5, 1, 2, 0, 3, 7, 8, 6];

// Chama a função para resolver o 8-Puzzle
const solution = solve(startBoard);

// Exibe a solução, se encontrada
if (solution) {
    console.log("Solução encontrada em " + (solution.length - 1) + " movimentos:");
    solution.forEach((step, index) => {
        console.log(`Passo ${index}:`);
        console.log(step.slice(0, 3)); // Exibe a primeira linha
        console.log(step.slice(3, 6)); // Exibe a segunda linha
        console.log(step.slice(6, 9)); // Exibe a terceira linha
        console.log();
    });
} else {
    console.log("Nenhuma solução encontrada!"); // Caso não tenha solução
}