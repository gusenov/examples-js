document.getElementById("app").innerHTML = `
  <div>
    <p>Укажите размер массива:</p>
    <input type='number' id='arraySize' min='0'>
    <p><button id='createArray'>Создать массив</button></p>
  </div>
  <div id='array'></div>
  <hr/>
  <div id='buttonSort'></div>
  <br>
  <div id='result'></div>
`;

class SortArray {

  // Конструктор:
  constructor() {

    // Размер массива:
    this.size = 0;

    // Массив:
    this.array = [];

    this.isArrayCreated = false;

    // Количество рекурсивных вызовов:
    this.recCnt = 0;

    // Количество разбиений:
    this.partitionCnt = 0;

    // Количество итераций во внешнем цикле:
    this.outerLoop = 0;

    // Количество итераций во внутреннем цикле i:
    this.innerLoopLeft = 0;

    // Количество итераций во внутреннем цикле j:
    this.innerLoopRight = 0;

    // Количество обменов:
    this.swapCnt = 0;

    this.handleCreateArray = this.handleCreateArray.bind(this);
    this.createArrayOfInput = this.createArrayOfInput.bind(this);
    this.createInput = this.createInput.bind(this);
    this.handleSortSubmit = this.handleSortSubmit.bind(this);

    this.quickSort = this.quickSort.bind(this);
    this.partition = this.partition.bind(this);
    this.swap = this.swap.bind(this);

    this.showArray = this.showArray.bind(this);

    this.resetCounters = this.resetCounters.bind(this);
  }

  // Связать кнопку "Создать массив" с методом handleCreateArray:
  connect() {
    const createArrayButton = document.getElementById("createArray");
    createArrayButton.addEventListener("click", this.handleCreateArray);
  }

  // Получение данных с полей ввода:
  handleCreateArray(e) {
    if (this.isArrayCreated)
      return;

    const arraySizeValue = document.getElementById("arraySize").value;

    // Превращение полученного аргумента из строки в число:
    let arraySize = parseInt(arraySizeValue, 10);

    if (!arraySize || arraySize < 1)
      return;

    this.size = arraySize;

    const array = document.getElementById("array");
    array.appendChild(this.createArrayOfInput(arraySize));

    const sortSubmit = document.createElement("button");
    sortSubmit.innerText = "Отсортировать";
    sortSubmit.addEventListener("click", this.handleSortSubmit);

    const box = document.getElementById("buttonSort");
    box.appendChild(sortSubmit);

    this.resultElement = document.getElementById("result");

    this.isArrayCreated = true;

    e.target.remove();
  }

  // Создание массива из полученного размера массива:
  createArrayOfInput(sizeArray) {
    const div = document.createElement("div");
    let arr = Array(sizeArray)
      .fill("")
      .map((item, i) => this.createInput(i));
    arr.map(item => div.appendChild(item));
    return div;
  }

  // Вывод на экран полей для ввода данных массива:
  createInput(i) {
    // Поле ввода элемента массива:
    const input = document.createElement("input");

    input.setAttribute("type", "number");
    input.setAttribute("placeholder", "0");

    input.style.width = "50px";
    input.style.height = "50px";

    input.className = "i-" + i;

    return input;
  }

  // Обработчик события нажатия на кнопку "Отсортировать":
  handleSortSubmit() {

    this.array = [];
    this.resultElement.innerText = "";
    this.resetCounters();

    for (let i = 0; i < this.size; ++i) {
      const arrElems = document.querySelectorAll(`.i-${i}`);

      const arr = [...arrElems];

      const arrValue = arr.map(i => isNaN(parseInt(i.value, 10)) ? 0 : parseInt(i.value, 10));

      this.array.push(arrValue[0]);
    }

    this.showArray(-1, -1);

    this.quickSort(0, this.size - 1);

    this.resultElement.innerHTML += "<br>";
    this.resultElement.innerHTML += `Количество рекурсивных вызовов (функция quickSort): ${this.recCnt}<br>`;
    this.resultElement.innerHTML += `Количество разбиений Хоара (функция partition): ${this.partitionCnt}<br>`;
    this.resultElement.innerHTML += `Общее количество итераций во внешнем цикле (функция partition, бесконечный цикл while): ${this.outerLoop}<br>`;
    this.resultElement.innerHTML += `Общее количество итераций во внутреннем цикле движущемся от начала к концу (функция partition, цикл while по i): ${this.innerLoopLeft}<br>`;
    this.resultElement.innerHTML += `Общее количество итераций во внутреннем цикле движущемся от конца к началу (функция partition, цикл while по j): ${this.innerLoopRight}<br>`;
    this.resultElement.innerHTML += `Общее количество обменов (функция swap): ${this.swapCnt}<br>`;
  }

  // Быстрая сортировка:
  quickSort(lo, hi) {
    // lo и hi — соответственно, нижняя и верхняя границы сортируемого участка этого массива.

    ++this.recCnt;

    if (lo < hi) {
        // Опорный элемент:
        const p = this.partition(lo, hi);

        // Рекурсивно применить к двум подмассивам слева и справа от опорного элемента:
        this.quickSort(lo, p);
        this.quickSort(p + 1, hi);
    }
  }

  // Разбиение Хоара:
  partition(lo, hi) {
      ++this.partitionCnt;

      // Выбрать элемент из массива. Назовём его опорным:
      const pivot = this.array[Math.floor((lo + hi) / 2)];

      // Данная схема использует два индекса (один в начале массива, другой в конце),
      // которые приближаются друг к другу, пока не найдётся пара элементов,
      // где один больше опорного и расположен перед ним, а второй меньше и расположен после.
      let i = lo - 1;
      let j = hi + 1;

      // Перераспределение элементов в массиве таким образом,
      // что элементы меньше опорного помещаются перед ним,
      // а больше или равные после:
      while (1) {
          ++this.outerLoop;

          do {
            ++this.innerLoopLeft;

            i = i + 1;
          } while (this.array[i] < pivot);

          do {
            ++this.innerLoopRight;

            j = j - 1
          } while (this.array[j] > pivot);

          // Обмен происходит до тех пор, пока индексы не пересекутся:
          if (i >= j)
            return j;  // функция partition возвращает значение опорного элемента.

          // Элементы меняются местами:
          this.swap(i, j);

          // Показать текущее состояние массива:
          this.showArray(i, j);
      }
  }

  // Обмен местами i-го и j-го элементов массива:
  swap(i, j) {
    ++this.swapCnt;

     const temp = this.array[i];
     this.array[i] = this.array[j];
     this.array[j] = temp;
  }

  // Отобразить текущее состояние массива
  // и выделить жирным i-й и j-й элементы массива:
  showArray(i, j) {
    const output = this.array.map((item, index) => {
      if (index == i || index == j) {
        return ` <strong>${item}</strong>`;
      } else {
        return ` ${item}`;
      }
    });
    this.resultElement.innerHTML += `[ ${output} ]<br>`;
  }

  resetCounters() {
    this.recCnt = 0;
    this.partitionCnt = 0;
    this.outerLoop = 0;
    this.innerLoopLeft = 0;
    this.innerLoopRight = 0;
    this.swapCnt = 0;
  }

}

const newSortArray = new SortArray();
newSortArray.connect();
