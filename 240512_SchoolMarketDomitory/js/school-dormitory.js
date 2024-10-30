const washingmachineSelect = document.getElementById("washingmachine");
const timeSelect = document.getElementById("time");
const roomSelect = document.querySelector("#room");
const nameInput = document.querySelector("#name");
const boardContainerDiv = document.querySelector(".board-container");

let allData;  //초기 설정할 데이터: 세탁기 번호, 시간, 호실
let weeklyReservations; //미리 정해진 요일별 예약
let reservations; //사용자가 예약할 정보들
let newReservation; //사용자가 예약할 정보

// 요일 별 세탁기 예약 사항 가져오자
const initData = () => {
  const getAllData = async () => {
    const url = "js/allData.json";
    try {
      const response = await fetch(url);
      const data = await response.json();
      allData = data;
    } catch (error) {
      console.error(error);
    }
  }
  const getWeeklyReservations = async () => {
    const url = "js/weekly-reservation.json";
    try {
      const response = await fetch(url);
      const data = await response.json();
      weeklyReservations = data;
    } catch (error) {
      console.error(error);
    }
    // fetch(url)
    //   .then(response => response.json())
    //   .then(data => weeklyReservations = data)
    //   .catch(error => console.error(error));
  }
  getAllData();
  getWeeklyReservations();
}

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
    currentMonthDate.dataset.date = `${year}-${month + 1}-${date}`;
    currentMonthDate.textContent = date;
    currentMonthDate.onclick = (event) => clickDate(event);
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
  const pages = ["dormitory-select-date", "dormitory-select-washingmachine-time", "dormitory-select-user", "dormitory-board"];
  const menuContainerDiv = document.getElementById("menu-container");

  // 예약들 가져오자
  const getReservations = () => {
    const storedReservations = localStorage.getItem('reservations');
    if (storedReservations) {
      reservations = JSON.parse(storedReservations);
    } else {
      reservations = [];
    }

    // string -> Date()
    reservations.map(reservation => reservation.date = new Date(reservation.date));
  };
  getReservations();

  //메뉴 선택 clear
  for (const menuItemDiv of menuContainerDiv.children) {
    menuItemDiv.classList.remove("select-menu");
  }
  //메뉴 선택 one
  if (menuContainerDiv.children[page - 1] !== undefined) menuContainerDiv.children[page - 1].classList.add("select-menu");

  //display: none;
  //all page none
  pages.forEach((pageString) => {
    let pageDiv = document.getElementById(pageString);
    pageDiv.style.display = "none";
  })
  //page one
  let pageDiv = document.getElementById(pages[page - 1]);
  pageDiv.style.display = "block";

  //예약 초기화
  if (page === 1) {
    newReservation = {
      "date": undefined,
      "washingmachine": undefined,
      "time": undefined,
      "room": undefined,
      "name": undefined,
      "notification": true
    }
  } else if (page === 2) {  //세탁기, 시간 선택
    initWashingmachineTime(newReservation);
  } else if (page === 3) {  //호실, 이름
    newReservation.washingmachine = washingmachineSelect.value;
    newReservation.time = timeSelect.value;

    initRoomName();
  } else if (page === 4) {  //세탁기 예약 현황표
    newReservation.room = roomSelect.value;
    newReservation.name = nameInput.value;
    reservations.push(newReservation);

    initTable();
  }
}

const clickDate = (event) => {
  // console.log(dateDiv.target.dataset.date); //<div data-date=""> -> div.dataset.date
  newReservation.date = new Date(event.target.dataset.date);
  setPage(2);
}

const initWashingmachineTime = (newReservation) => {
  // 연월일의 요일 구하자
  const getDayOfWeek = (dateObject) => {
    const dayOfWeek = dateObject.getDay();
    return dayOfWeek;
  }
  let weekday = getDayOfWeek(newReservation.date);

  // 모든 가능한 세탁기 번호: 시간 배열 만들자
  let allWashingmachineTime = {};

  // 초기 세팅하자
  allData["washingmachine"].forEach((washingmachine) => {
    allWashingmachineTime[washingmachine] = Object.keys(allData["time"]).slice(); //allTime 복사해서 대입
  });

  // 미리 예약된 내용(weeklyReservations)을 초기 데이터에서 빼자
  weeklyReservations.forEach((weeklyReservation) => {
    if (weeklyReservation.weekday === weekday) {
      const washingmachine = weeklyReservation.washingmachine;
      const time = weeklyReservation.time;
      const index = allWashingmachineTime[washingmachine].indexOf(String(time));
      if (index > -1) {
        allWashingmachineTime[washingmachine].splice(index, 1);
      }
    }
  });

  // 사용자가 예약한 정보 보고 예약된 세탁기, 시간 없애자
  reservations.forEach((reservation) => {
    if (reservation.date.getDate() === newReservation.date.getDate() && reservation.date.getMonth() === newReservation.date.getMonth() && reservation.date.getFullYear() === newReservation.date.getFullYear()) {
      const washingmachine = reservation.washingmachine;
      const time = reservation.time;
      const index = allWashingmachineTime[washingmachine].indexOf(time);
      if (index > -1) {
        allWashingmachineTime[washingmachine].splice(index, 1);
      }
    }
  });

  // #washingmachine에 옵션 추가하자
  washingmachineSelect.innerHTML = "";
  let washingmachines;
  washingmachines = Object.keys(allWashingmachineTime).filter((washingmachine) => allWashingmachineTime[washingmachine].length > 0);

  // 선택할 세탁기가 없다면, 경고창 띄우고, 다시 날짜 지정으로 가자
  if (washingmachines.length === 0) {
    alert("선택할 세탁기가 없습니다. 다시 날짜 지정으로 돌아갑니다.");
    setPage(1);
    return;
  }

  washingmachines.forEach(washingmachine => {
    const newOption = document.createElement("option");
    newOption.value = washingmachine;
    newOption.text = `${washingmachine}번 세탁기`;
    washingmachineSelect.appendChild(newOption);
  });
  const initTime = () => {
    timeSelect.innerHTML = "";
    const selectedWashingmachine = washingmachineSelect.value;
    allWashingmachineTime[selectedWashingmachine].forEach(time => {
      const newOption = document.createElement("option");
      newOption.value = time;
      newOption.text = `${allData["time"][time]}`;
      timeSelect.appendChild(newOption);
    });

  }
  washingmachineSelect.onchange = initTime;
  initTime();
}
const initRoomName = () => {
  let roomString = "";
  allData.room.forEach(room => {
    roomString += `
      <option value="${room}">${room}호</option>
    `;
  });
  roomSelect.innerHTML = roomString;

  nameInput.value = "";
}
const initTable = () => {
  //기본 표 그리자
  boardItemString = `
    <div class="item board-item header">이름</div>
    <div class="item board-item header">호실</div>
    <div class="item board-item header">날짜</div>
    <div class="item board-item header">시간</div>
    <div class="item board-item header">세탁기</div>
    <div class="item board-item header">알림</div>
  `;

  //reservation에 예약된 현황 가져와서 표에 표시하자
  reservations.forEach(reservation => {
    boardItemString += `
    <div class="item board-item">${reservation.name}</div>
    <div class="item board-item">${reservation.room}호</div>
    <div class="item board-item">${reservation.date.getMonth() + 1}-${reservation.date.getDate()}(${reservation.date.toLocaleString('ko-KR', { weekday: 'short' })})</div>
    <div class="item board-item">${allData.time[reservation.time]}</div>
    <div class="item board-item">${reservation.washingmachine}번</div>
    <div class="item board-item">${reservation.notification ? "🔔" : "🔔🚫"}</div>
    `;
  });
  boardContainerDiv.innerHTML = boardItemString;
}
const completedReservation = () => {
  alert("예약 완료");
  localStorage.setItem('reservations', JSON.stringify(reservations)); //예약들 저장하자
}

initData();
setPage(1);
setCalendarHeader(currentDate);
setCalendar(currentDate);