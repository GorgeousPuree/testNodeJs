// Изначально хотелось выполнить задание следуя рекомендации, то есть с помощью генетического алгоритма.
// До этого с ним не встречался. После того как ознакомился, застрял на моменте скрещивания, потому что
// не мог придумать как лучше объединить в ребёнке черты родителей. К примеру есть родитель parent1, и у него
// есть свойства firstThruster = [3, 2, 1, 0] и secondThruster = [4, 8, 3, 2], а также есть второй родитель - parent2
// с такими же свойствами firstThruster = [4, 1, 8, 0] и secondThruster = [3, 3, 2, 2]. Как их слить в ребёнка?
// Видел, как некоторые делают кроссовер отсекая рандомные куски из массива, например в массиве [4, 1, | 8, 0],
// и значения 8, 0 пойдут к ребёнку. Я пробовал написать решение нормальным генетическим алгоритмом,
// где ребёнок наследует черты родителей, но оставил эту идею, когда перестал понимать, что пишу. Мне показалось, что
// задача из-за ограничений по допустимой скорости и невозможности повторно использовать капсулы не очень подходит под генетический алгоритм из-за кучи проверок,
// да и не знаю, даст ли это существенный прирост производительности.
// Хотя, естественно, я могу ошибаться. Я видел решения уравнений и некоторых других задач с помощью генетического алгоритма, там всё было складно и понятно.
// Очень хотелось бы увидеть ваше решение этой задачи генетическим алгоритмом, чтобы разобраться как правильно это делать.
//
//
//
// В конце концнов, решена эта задача в какой-то мере генетическим алгоритмом, если считать что "определенная модификация" это выбрасывание скрещивания между родителями.
// Сначала генерируются 100 объектов класса Gene, двигатели которых забиты нулями. После этого 10 видов отправляются мутировать.
// Суть мутации заключается в перестановке значений двигателей в рамках одного вида. То есть если есть
// let elem = {firstThruster: [3, 3, 0, 1], secondThruster: [4, 5, 0, 0]}, то после мутации элементы могут поменяться местами (если не нарушают ограничений по скорости),
// и elem превратится в {firstThruster: [3, 0, 3, 1], secondThruster: [4, 5, 0, 0]}, либо {firstThruster: [3, 3, 4, 1], secondThruster: [0, 5, 0, 0]} и тд.
// Какие элементы заменить и из каких двигателей решается случайно. Перестановка может произойти как в рамках одного двигателя, так и между ними.
// Ещё есть небольшой шанс, что капсула из двигателя заменится капсулой из стартового набора, массива 'cells'. Но всё происходит в одном виде (элементе популяции)!
// После мутации отбираем 10 лучших видов, берём по 10 их копий и создаём новое поколение.
// И так n раз, либо пока не будет найден идеальный вариант, когда loss === 0.

const Gene = require("./gene");

class Population {
    _maxPop = 100;
    _best = [];
    _coefficient = 10;

    constructor(corrections, cells) {
        this._corrections = corrections;
        this._cells = cells;
        this._population = [];
    }

    Solve() {
        for (let i = 0; i < this._maxPop; i++)
            this._population[i] = new Gene(this._corrections.length, this._cells.slice());

        for (let i = 0; i < this._maxPop * this._coefficient * 3; i++) { // multiplying by 3 to get more accurate answer
            for (let j = 0; j < this._maxPop / this._coefficient; j++) {
                this._Mutate(this._population[j]);
            }
            for (let j = 0; j < this._maxPop; j++) {
                this._FindLoss(this._population[j]);
            }

            this._population.sort((a, b) => a.loss - b.loss);
            if (this._population[0].loss === 0) return this._population[0];

            this._best = [];
            for (let j = 0; j < this._maxPop / this._coefficient; j++) this._best.push(this._population[j]);

            this._population = [];

            for (const one of this._best) {
                let kids = [];
                let deepClone = JSON.parse(JSON.stringify(one));
                for (let j = 0; j < this._coefficient; j++) kids.push(deepClone);
                this._population.push(...kids);
            }
        }
        return {
            main_thruster: this._best[0].firstThruster,
            secondary_thruster: this._best[0].secondThruster.map((a) => a * 2),
            delta_velocity: this._FindDelta(this._best[0])
        }
    }

    _Mutate(gene) {
        let firstRandomIndex = Math.floor(Math.random() * gene.firstThruster.length);  // first thruster length equals to second thruster length,
        let secondRandomIndex = Math.floor(Math.random() * gene.firstThruster.length); // so just picking a random thruster index

        let y1 = Math.floor(Math.random() * 101 + 1);                             // choosing in which thruster swap will be done
        let y2 = Math.floor(Math.random() * 101 + 1);

        if (y1 < 50) {                                                               // then swap within different thrusters
            let valueToSecondThruster = gene.firstThruster[firstRandomIndex];
            let valueToFirstThruster = gene.secondThruster[secondRandomIndex];

            if (valueToSecondThruster / 2 + gene.firstThruster[secondRandomIndex] > this._corrections[secondRandomIndex] ||
                valueToFirstThruster * 2 + gene.secondThruster[firstRandomIndex] > this._corrections[firstRandomIndex]) return;

            gene.firstThruster[firstRandomIndex] = valueToFirstThruster * 2;
            gene.secondThruster[secondRandomIndex] = valueToSecondThruster / 2;
        } else if (y1 > 90) {                                                        // then from cells
            let cellIndex = Math.floor(Math.random() * (gene.cells.length));
            let cellValue = gene.cells[cellIndex];
            if (y2 < 50) {                                                           // then to first thruster
                if (cellValue + gene.secondThruster[firstRandomIndex] > this._corrections[firstRandomIndex]) return;
                gene.cells[cellIndex] = gene.firstThruster[firstRandomIndex];        // when we take cell from 'cells'
                gene.firstThruster[firstRandomIndex] = cellValue;                    // we replace current cell in thruster with the cell in 'cells'

            } else {                                                                 // then to second thruster
                if (cellValue / 2 + gene.firstThruster[firstRandomIndex] > this._corrections[firstRandomIndex]) return;
                gene.cells[cellIndex] = gene.secondThruster[firstRandomIndex] * 2;
                gene.secondThruster[firstRandomIndex] = cellValue / 2;
            }
        } else {                                                                     // then swap within same thruster
            if (y2 < 50) {                                                           // swap within first thruster
                let firstElement = gene.firstThruster[firstRandomIndex];
                let secondElement = gene.firstThruster[secondRandomIndex];

                if (firstElement + gene.secondThruster[secondRandomIndex] > this._corrections[secondRandomIndex] ||
                    secondElement + gene.secondThruster[firstRandomIndex] > this._corrections[firstRandomIndex]) return;

                gene.firstThruster[secondRandomIndex] = firstElement;
                gene.firstThruster[firstRandomIndex] = secondElement;
            } else {                                                                 // swap within second thruster
                let firstElement = gene.secondThruster[firstRandomIndex];
                let secondElement = gene.secondThruster[secondRandomIndex];

                if (firstElement + gene.firstThruster[secondRandomIndex] > this._corrections[secondRandomIndex] ||
                    secondElement + gene.firstThruster[firstRandomIndex] > this._corrections[firstRandomIndex]) return;

                gene.secondThruster[secondRandomIndex] = firstElement;
                gene.secondThruster[firstRandomIndex] = secondElement;
            }
        }
    }

    _FindLoss(gene) {
        gene.loss = 0;
        for (let i = 0; i < this._corrections.length; i++) {
            gene.loss += Math.abs(this._corrections[i] - (gene.firstThruster[i] + gene.secondThruster[i]));
        }
    }

    _FindDelta(gene) {
        let deltaVelocity = 0;
        for (let i = 0; i < this._corrections.length; i++) {
            deltaVelocity += gene.firstThruster[i] + gene.secondThruster[i];
        }
        return deltaVelocity;
    }
}

module.exports = Population;