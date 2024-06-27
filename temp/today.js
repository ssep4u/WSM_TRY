const titleDiv = document.getElementsByClassName("title")[0];
const prevButton = document.getElementById("prevBtn");
const nextButton = document.getElementById("nextBtn");

const getNow = () => {
    return new Date();
}
const setTitle = (time) => {
    const week_name = "일월화수목금토";
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let date = time.getDate();
    let day = time.getDay();
    let titleString = `${year}년 ${month}월 ${date}일(${week_name[day]})`;
    titleDiv.innerHTML = titleString;
}

let currentDate = getNow();
setTitle(currentDate);

const changeDiffDate = (diff) => {
    currentDate.setMonth(currentDate.getMonth() + diff);
    setTitle(currentDate);
}

prevButton.onclick = () => changeDiffDate(-1);
nextButton.onclick = () => changeDiffDate(1);
// nextButton.addEventListener("click", () => changeDiffDate(1));
