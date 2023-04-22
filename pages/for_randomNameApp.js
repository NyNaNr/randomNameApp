const { randomBytes } = require("crypto");

console.log(Math.random())



const names = [
        "Alice",
        "Bob",
        "Charlie",
        "David",
        "Emily",
        "Frank",
        "Grace",
        "Henry",
        "Isabella",
        "Jack",
        "Katherine",
        "Liam",
        "Mia",
        "Nathan",
        "Olivia",
        "Penelope",
        "Quentin",
        "Rose",
        "Sarah",
        "Thomas"
      ];



randomName = names[Math.floor(Math.random() * names.length)];
console.log(Math.floor(Math.random() * names.length))
console.log(randomName)

const nums = [1, 2, 3, 4, 5];
const initialValue = 0;
console.log(nums.reduce(
  (accumulator, currentValue) => accumulator + currentValue,
  initialValue
)); // 55




let lastDisplayedName;
let isDeletingName = false;

function stopNameDisplay() {
  clearInterval(intervalId);
  isNameShowing = false;
  intervalTime = initialIntervalTime;
  const elem = document.querySelector('.name.show');
  if (elem) {
    lastDisplayedName = elem.textContent.trim();
    if (isDeletingName) {
      const index = names.indexOf(lastDisplayedName);
      if (index !== -1) {
        names.splice(index, 1);
      }
    }
  }
}

function toggleDeleteName() {
  isDeletingName = !isDeletingName;
  const deleteNameButton = document.getElementById('delete-name-button');
  deleteNameButton.textContent = isDeletingName ? '削除する' : '削除しない';
}

function showRandomName() {
  const nameDisplay = document.querySelector('.name');
  nameDisplay.classList.remove('show');
  setTimeout(() => {
    const randomName = names[Math.floor(Math.random() * names.length)];
    nameDisplay.textContent = randomName;
    nameDisplay.classList.add('show');
  }, 500);
}

startButton.addEventListener('click', startNameDisplay);
stopButton.addEventListener('click', stopNameDisplay);
deleteNameButton.addEventListener('click', toggleDeleteName);