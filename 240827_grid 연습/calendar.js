//달력
//현재 날짜 구하자
//이번 달 구하자

//1일이 무슨 요일인지 구하자
//이번 달 마지막 날짜 구하자

let currentDate = new Date();

//이전, 다음
const prevMonth = document.getElementById("prev-month");
prevMonth.addEventListener("click", () => changeMonth(-1));
const nextMonth = document.querySelector("#next-month");
nextMonth.onclick = () => changeMonth(1);

const changeMonth = (delta) => {
  currentDate.setMonth(currentDate.getMonth() + delta);
  setCalendarHeader(currentDate);
  setCalendar(currentDate);
};
const setCalendarHeader = (currentDate) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  //제목
  const calendarHeaderH1 = document.querySelector("#calendar-header > h1");
  calendarHeaderH1.textContent = `${year}년 ${month + 1}월`;
};
const setCalendar = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDate = new Date(year, month, 1);
  const firstDay = firstDate.getDay();
  const lastDate = new Date(year, month + 1, 0);
  const lastDay = lastDate.getDay();

  //달력 요일 만들자
  const calendarContainerDiv = document.querySelector("#calendar-container");
  const weekNames = "일월화수목금토".split(""); //const weekNames = ["일", "월", "화", "수", "목", "금", "토"];
  let weekNamesString = "";
  weekNames.forEach((weekName) => {
    weekNamesString += `<div class="item week-name">${weekName}</div>`;
  });
  calendarContainerDiv.innerHTML = weekNamesString;

  let currentDate = 1;

  // 이전 달 뒷 날짜 만들자: 이번 달 1일의 요일 전까지 만들자
  const prevMonthLastDate = new Date(year, month, 0).getDate();
  //이전 달 마지막 날짜 - 이번 달 1일 요일 + 1 ~ 이전 달 마지막 날짜
  for (let date = prevMonthLastDate - firstDay + 1; date <= prevMonthLastDate; date++) {
    let prevMonthDateDiv = document.createElement("div");
    prevMonthDateDiv.textContent = date;
    prevMonthDateDiv.className = "item other-month";
    calendarContainerDiv.appendChild(prevMonthDateDiv);
  }

  //이번 달 날짜 만들자
  for (let date = currentDate; date <= lastDate.getDate(); date++) {
    let currentMonthDateDiv = document.createElement("div");
    currentMonthDateDiv.textContent = date;
    currentMonthDateDiv.className = "item";
    // currentMonthDateDiv.onclick = (event) => console.log(year, month, event.target.textContent);
    calendarContainerDiv.appendChild(currentMonthDateDiv);
  }

  //다음 달 앞 날짜 만들자
  //1 ~ 6 - 이번 달의 마지막 날자의 요일
  for (let date = 1; date <= 6 - lastDay; date++) {
    let nextMonthDateDiv = document.createElement("div");
    nextMonthDateDiv.textContent = date;
    nextMonthDateDiv.className = "item other-month";
    calendarContainerDiv.appendChild(nextMonthDateDiv);
  }
}

setCalendarHeader(currentDate);
setCalendar(currentDate);