let randomize_array = document.getElementById("randomize_array_btn");
let bubblesort_btn = document.getElementById("bubblesort_btn");
let selectionsort_btn = document.getElementById("selectionsort_btn");
let quicksort_btn = document.getElementById("quicksort_btn");
let bars_container = document.getElementById("bars_container");
let stop_btn = document.getElementById("stop_btn");
let lengthslider = document.getElementById("lengthslider");
let speedslider = document.getElementById("speedslider");
let minRange = 1;
let maxRange = lengthslider.value;
let numOfBars = lengthslider.value;
let heightFactor = 6.5;
let speedFactor = 505 - speedslider.value;
let unsortedArray = new Array(numOfBars);
let started = false;
let stop = false;

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createRandomArray() {
    let array = new Array(numOfBars);
    for (let i = 0; i < numOfBars; i++) {
        array[i] = randomNum(minRange, maxRange);
    }
    return array;
}

document.addEventListener("DOMContentLoaded", function () {
    unsortedArray = createRandomArray();
    bars_container.innerHTML = "";
    renderBars(unsortedArray);
});

lengthslider.addEventListener("input", function () {
    numOfBars = lengthslider.value;
    maxRange = lengthslider.value;
    bars_container.innerHTML = "";
    unsortedArray = createRandomArray();
    renderBars(unsortedArray);
});

speedslider.addEventListener("input", function () {
    speedFactor = 505 - speedslider.value;
});


function renderBars(array) {
    for (let i = 0; i < array.length; i++) {
        let bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = array[i] * heightFactor + "px";
        bars_container.appendChild(bar);
    }
}

randomize_array.addEventListener("click", function () {
    if (!started) {
        unsortedArray = createRandomArray();
        bars_container.innerHTML = "";
        renderBars(unsortedArray);
    }
});

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function bubbleSort(array) {
    lengthslider.disabled = true;
    let bars = document.getElementsByClassName("bar");
    for (let i = 0; i < bars.length; i++) {
        bars[i].style.backgroundColor = "aqua";
    }
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (stop) {
                stop = false;
                return;
            }
            if (array[j] > array[j + 1]) {
                for (let k = 0; k < bars.length - i; k++) {
                    if (k !== j && k !== j + 1) {
                        bars[k].style.backgroundColor = "aqua";
                    }
                }
                let temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
                bars[j].style.height = array[j] * heightFactor + "px";
                //bars[j].innerText = array[j];
                bars[j + 1].style.height = array[j + 1] * heightFactor + "px";
                bars[j].style.backgroundColor = "blue";
                bars[j + 1].style.backgroundColor = "blue";
                //bars[j + 1].innerText = array[j + 1];
                await sleep(speedFactor);
            }
            else{
                for (let k = 0; k < bars.length - i; k++) {
                    if (k !== j && k !== j + 1) {
                        bars[k].style.backgroundColor = "aqua";
                    }
                }
                bars[j].style.backgroundColor = "lightgreen";
                bars[j + 1].style.backgroundColor = "lightgreen";
                await sleep(speedFactor);
            }
        }
        bars[array.length - i - 1].style.backgroundColor = "red";
        await sleep(speedFactor);
    }
    started = false;
    lengthslider.disabled = false;
    return array;
}


bubblesort_btn.addEventListener("click", function () {
    if (!started) {
        let sorted_array = bubbleSort(unsortedArray);
        console.log(sorted_array);
        started = true;
    }
});

async function selectionsort(array) {
    lengthslider.disabled = true;
    let bars = document.getElementsByClassName("bar");
    let min = 0;
    for (let i = 0; i < array.length; i++) {
        min = i;
        for (let j = i; j < array.length; j++) {
            if (stop) {
                stop = false;
                return;
            }
            bars[j].style.backgroundColor = "lightgreen";
            if (array[j] < array[min]) {
                min = j;
                bars[min].style.backgroundColor = "blue";
                await sleep(speedFactor);
            }
            for (let k = i; k < bars.length; k++) {
                if (k !== j && k !== min) {
                    bars[k].style.backgroundColor = "aqua";
                }
            }
            await sleep(speedFactor);
        }
        let temp = array[min];
        array[min] = array[i];
        array[i] = temp;
        bars[min].style.height = array[min] * heightFactor + "px";
        bars[i].style.height = array[i] * heightFactor + "px";
        bars[i].style.backgroundColor = "red";
        await sleep(speedFactor);
    }
    started = false;
    lengthslider.disabled = false;
    return array;
}

selectionsort_btn.addEventListener("click", function () {
    if (!started) {
        let sorted_array = selectionsort(unsortedArray);
        console.log(sorted_array);
        started = true;
    }
});

async function swap(items, leftIndex, rightIndex, bars) {
    if (stop) {
        return;
    }
    let tmp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = tmp;
    bars[leftIndex].style.height = items[leftIndex] * heightFactor + "px";
    bars[leftIndex].style.backgroundColor = "orange";
    bars[rightIndex].style.height = items[rightIndex] * heightFactor + "px";
    bars[rightIndex].style.backgroundColor = "lightgreen";
    await sleep(speedFactor);
}

async function partition(items, left, right) {
    let bars = document.getElementsByClassName("bar");
    if (stop) {
        return;
    }
    let pivotIndex = Math.floor((right + left) / 2);
    let pivot = items[pivotIndex];
    bars[pivotIndex].style.backgroundColor = "blue";
    for (let i = 0; i < bars.length; i++) {
        if (i !== pivotIndex) {
            bars[i].style.backgroundColor = "aqua";
        }
    }
    let i = left; //left pointer
    let j = right; //right pointer
    while (i <= j) {
        while (items[i] < pivot) {
            i++;
        }
        while (items[j] > pivot) {
            j--;
        }
        if (i <= j) {
            await swap(items, i, j, bars);
            i++;
            j--;
        }
    }
    return i;
}

async function quicksort(items, left, right) {
    lengthslider.disabled = true;
    if (stop) {
        return;
    }
    let index;
    let bars = document.getElementsByClassName("bar");
    if (items.length > 1) {
        index = await partition(items, left, right); //index returned from partition
        if (left < index - 1) {
            //more elements on the left side of the pivot
            await quicksort(items, left, index - 1);
        }
        if (index < right) {
            //more elements on the right side of the pivot
            await quicksort(items, index, right);
        }
    }
    if(!stop) {
        for (let i = 0; i < bars.length; i++) {
            bars[i].style.backgroundColor = "red";
        }
    }
    started = false;
    stop = false;
    lengthslider.disabled = false;
    return items;
}


quicksort_btn.addEventListener("click", function () {
    if (!started) {
        let sorted_array = quicksort(unsortedArray, 0, numOfBars - 1);
        console.log(sorted_array);
        started = true;
    }
});

stop_btn.addEventListener("click", function () {
    if (started) {
        stop = true;
        numOfBars = lengthslider.value;
        maxRange = lengthslider.value;
        bars_container.innerHTML = "";
        unsortedArray = createRandomArray();
        renderBars(unsortedArray);
        started = false;
        lengthslider.disabled = false;
    }
});