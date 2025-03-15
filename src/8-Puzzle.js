class Node {
    constructor(board, g, h, parent = null) {
        this.board = board;     // O tabuleiro como um array de 9 números
        this.g = g;             // Custo real do caminho até aqui
        this.h = h;             // Estimativa (heurística)
        this.f = g + h;         // Custo total
        this.parent = parent;   // Referência para o nó anterior
    }

    findEmptySpace() {
        return this.board.indexOf(0);
    }

    // Método para trocar o 0 com outra posição
    swap(board, i, j) {
        let newBoard = board.slice(); // Copia o array original
        [newBoard[i], newBoard[j]] = [newBoard[j], newBoard[i]]; // Troca os elementos
        return newBoard;
    }

    // Método para gerar os filhos (novos estados)
    getChildren() {
        const emptyIndex = this.findEmptySpace();
        const possibleMoves = [];
        const row = Math.floor(emptyIndex / 3); // Linha  do 0
        const col = emptyIndex % 3;             // Coluna do 0

        if (row > 0) possibleMoves.push(emptyIndex - 3); // Mover para cima
        if (row < 2) possibleMoves.push(emptyIndex + 3); // Mover para baixo
        if (col > 0) possibleMoves.push(emptyIndex - 1); // Mover para esquerda
        if (col < 2) possibleMoves.push(emptyIndex + 1); // Mover para direita

        return possibleMoves.map(move => {
            const newBoard = this.swap(this.board, emptyIndex, move);
            return new Node(newBoard, this.g + 1, 0, this); // Criamos o novo nó
        });
    }
}

class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(node) {
        this.elements.push(node);
        this.elements.sort((a, b) => (a.g + a.h) - (b.g + b.h)); // Ordena pelo menor f(n)
    }

    dequeue() {
        return this.elements.shift(); // Remove o nó com menor f(n)
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}

function solve(startBoard) {
    const startNode = new Node(startBoard, 0, heuristic(startBoard), null);
    const openSet = new PriorityQueue();
    openSet.enqueue(startNode);
    
    const visited = new Set(); // Armazena estados já visitados
    
    while (!openSet.isEmpty()) {
        const current = openSet.dequeue(); // Pega o nó com menor f(n)

        if (isGoal(current.board)) {
            return reconstructPath(current); // Se for a solução, retorna o caminho
        }

        visited.add(current.board.toString()); // Marca como visitado
        
        current.getChildren().forEach(child => {
            if (!visited.has(child.board.toString())) {
                openSet.enqueue(child);
            }
        });
    }

    return null; // Sem solução
}

function isGoal(board) {
    return board.toString() === "1,2,3,4,5,6,7,8,0";
}

function heuristic(board) {
    const goal = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    let distance = 0;

    board.forEach((value, index) => {
        if (value !== 0) {
            const goalIndex = goal.indexOf(value);
            const currentRow = Math.floor(index / 3);
            const currentCol = index % 3;
            const goalRow = Math.floor(goalIndex / 3);
            const goalCol = goalIndex % 3;

            distance += Math.abs(currentRow - goalRow) + Math.abs(currentCol - goalCol);
        }
    });

    return distance;
}

function reconstructPath(node) {
    const path = [];
    while (node !== null) {
        path.unshift(node.board); // Adiciona do final para o início
        node = node.parent;
    }
    return path;
}

const startBoard = [4, 5, 1, 2, 0, 3, 7, 8, 6]; // Tabuleiro inicial

const solution = solve(startBoard);

if (solution) {
    console.log("Solução encontrada em " + (solution.length - 1) + " movimentos:");
    solution.forEach((step, index) => {
        console.log(`Passo ${index}:`);
        console.log(step.slice(0, 3));
        console.log(step.slice(3, 6));
        console.log(step.slice(6, 9));
        console.log();
    });
} else {
    console.log("Nenhuma solução encontrada!");
}