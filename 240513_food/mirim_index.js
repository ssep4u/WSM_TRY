let currentDate = new Date();

const displayDate = () => {
	const days = ['일', '월', '화', '수', '목', '금', '토'];
	const dateDiv = document.getElementById("date_div");
	const dateText = `${days[currentDate.getDay()]}요일(${currentDate.getMonth() + 1}/${currentDate.getDate()})의 메뉴`; // 날짜와 요일 텍스트 생성
	dateDiv.innerText = dateText;
};

const getMenu = (dateData) => {
	const url = `https://open.neis.go.kr/hub/mealServiceDietInfo?Type=json&KEY=5f1eef5fec9e46e098c48b31c3032b58&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=B10&SD_SCHUL_CODE=7011569&MLSV_YMD=${dateData}`;
	fetch(url)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			console.log(data);
			const menuDiv = document.getElementById("menu_div");
			if (data.mealServiceDietInfo) {
				const menuData = data.mealServiceDietInfo[1].row;
				console.log("menuData", menuData);

				let breakfastMenu = "";
				let lunchMenu = "";
				let dinnerMenu = "";

				menuData.forEach(function (menuLow) {
					let cleanedMenu = menuLow.DDISH_NM.replace(/\([^)]*\)/g, '');
					if (menuLow.MMEAL_SC_NM === "조식") {
						breakfastMenu += `${cleanedMenu}<br><br>`;
					} else if (menuLow.MMEAL_SC_NM === "중식") {
						lunchMenu += `${cleanedMenu}<br><br>`;
					} else if (menuLow.MMEAL_SC_NM === "석식") {
						dinnerMenu += `${cleanedMenu}<br><br>`;
					}
				});

				menuDiv.innerHTML = `
												<div class="menu-section">
														<h3>조식</h3>
														<p>${breakfastMenu}</p>
												</div>
												<div class="menu-section">
														<h3>중식</h3>
														<p>${lunchMenu}</p>
												</div>
												<div class="menu-section">
														<h3>석식</h3>
														<p>${dinnerMenu}</p>
												</div>
										`;
			} else {
				menuDiv.innerHTML = `
												<div class="menu-section">
														<h3>조식</h3>
														<p>급식메뉴를 불러오지 못했습니다.</p>
												</div>
												<div class="menu-section">
														<h3>중식</h3>
														<p>급식메뉴를 불러오지 못했습니다.</p>
												</div>
												<div class="menu-section">
														<h3>석식</h3>
														<p>급식메뉴를 불러오지 못했습니다.</p>
												</div>
										`;
			}
		});
};

const changeDate = (change) => {
	currentDate.setDate(currentDate.getDate() + change);
	const dateData = currentDate.toISOString().slice(0, 10).replace(/-/g, "");
	getMenu(dateData);
	displayDate();
};

getMenu(currentDate.toISOString().slice(0, 10).replace(/-/g, ""));
displayDate();