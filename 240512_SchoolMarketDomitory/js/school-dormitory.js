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
  const calendarHeaderH2 = document.querySelector("#calendar-header > h2");
  calendarHeaderH2.textContent = `${year}년 ${month + 1}월`;
};
const setCalendar = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDate = new Date(year, month, 1);
  const firstDay = firstDate.getDay();
  const lastDate = new Date(year, month + 1, 0);
  const lastDay = lastDate.getDay();
  const prevMonthLastDate = new Date(year, month, 0);

  //달력 요일 만들자
  const calendarContainer = document.querySelector("#calendar-container");
  const weekNames = "일월화수목금토".split(""); //const weekNames = ["일", "월", "화", "수", "목", "금", "토"];
  let weekNamesString = "";
  weekNames.forEach((weekName) => {
    weekNamesString += `<div class="item week-name">${weekName}</div>`;
  });
  calendarContainer.innerHTML = weekNamesString;

  let currentDate = 1;

  // 이전 달 뒷 날짜 만들자: 이번 달 1일의 요일 전까지 만들자
  //?~이전 달 마지막 날짜  ?: 이전 달 마지막 날짜 - 이번 달 첫날의 요일 + 1
  console.log(prevMonthLastDate.getDate());
  for (let date = (prevMonthLastDate.getDate() - firstDay + 1); date <= prevMonthLastDate.getDate(); date++) {
    let prevMonthDate = document.createElement("div");
    prevMonthDate.className = "item other-month";
    prevMonthDate.textContent = date;
    calendarContainer.appendChild(prevMonthDate);
  }

  //이번 달 날짜 만들자
  for (let date = currentDate; date < lastDate.getDate(); date++) {
    let currentMonthDate = document.createElement("div");
    currentMonthDate.className = "item";
    currentMonthDate.dataset.date = `${year}-${month+1}-${date}`;
    currentMonthDate.textContent = date;
    calendarContainer.appendChild(currentMonthDate);
  }

  //다음 달 앞 날짜 만들자
  //1~?  ?: 6-이번 달 마지막 날짜의 요일
  for (let date = 1; date <= (6 - lastDay + 1); date++) {
    let nextMonthDate = document.createElement("div");
    nextMonthDate.className = "item other-month";
    nextMonthDate.textContent = date;
    calendarContainer.appendChild(nextMonthDate);
  }
}
const setPage = (page) => {
  page--;
  const pages = ["dormitory-select-date", "dormitory-select-user", "dormitory-board"];
  const menuContainerDiv = document.getElementById("menu-container");

  //메뉴 선택 clear
  for (const menuItemDiv of menuContainerDiv.children) {
    menuItemDiv.classList.remove("select-menu");
  }
  //메뉴 선택 one
  menuContainerDiv.children[page].classList.add("select-menu");


  //display: none;
  //all page none
  pages.forEach((pageString) => {
    let pageDiv = document.getElementById(pageString);
    pageDiv.style.display = "none";
  })
  //page one
  let pageDiv = document.getElementById(pages[page]);
  pageDiv.style.display = "block";
}

setPage(1);
setCalendarHeader(currentDate);
setCalendar(currentDate);
