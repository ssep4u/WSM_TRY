let currentDate = new Date();

const displayDate = () => {
    let days = "일월화수목금토";
    let month = currentDate.getMonth() + 1;
    let date = currentDate.getDate();
    let day = currentDate.getDay(); //요일
    days = days.split("");  //"일월화수목금토" -> ['일', '월', '화', '수', '목', '금', '토']
    const schoolFoodTitleHeader = document.getElementsByClassName("school-food-title")[0];
    const titleText = `🍚 ${days[currentDate.getDay()]}요일(${month}/${date})의 메뉴 🍚`;
    schoolFoodTitleHeader.innerText = titleText;
};

const changeDate = (diff) => {
    currentDate.setDate(currentDate.getDate() + diff);
    const dateData = currentDate.toISOString().slice(0, 10).replace(/-/g, "");  //2024-05-15 -> 20240515
    getSchoolFoodMenu(dateData);
    displayDate();
};

const setSchoolFoodMenu = (data) => {
    // console.log(data);
    //메뉴 clear
    let breakfastMenuUl = document.getElementsByClassName("breakfast menu")[0];
    let lunchMenuUl = document.getElementsByClassName("lunch menu")[0];
    let dinnerMenuUl = document.getElementsByClassName("menu dinner")[0];
    breakfastMenuUl.innerHTML = "<li>급식메뉴를 불러오지 못했습니다.</li>";
    lunchMenuUl.innerHTML = "<li>급식메뉴를 불러오지 못했습니다.</li>";
    dinnerMenuUl.innerHTML = "<li>급식메뉴를 불러오지 못했습니다.</li>";

    if(data.mealServiceDietInfo) {
        const menuData = data.mealServiceDietInfo[1].row;
        // console.log(menuData);

        menuData.forEach((menuRow) => {
            let cleanedMenu = menuRow.DDISH_NM.replace(/\([^)]*\)/g, "");   //(...) 삭제
            cleanedMenu = cleanedMenu.replace(/\./g, "");       // . 삭제
            // console.log(cleanedMenu)
            let cleanedMenuArray = cleanedMenu.split("<br/>");
            cleanedMenuArray = cleanedMenuArray.map((element) => element.trim());
            // array -> <li class="menu-food">차조밥</li>
            let menuFoodLi = "";
            cleanedMenuArray.forEach((menuFood) => {
                menuFoodLi += `<li class="menu-food">${menuFood}</li>\n`;
            });
            // console.log(menuFoodLi);
            if (menuRow.MMEAL_SC_NM === "조식") {
                breakfastMenuUl.innerHTML = menuFoodLi;
            } else if (menuRow.MMEAL_SC_NM === "중식") {
                lunchMenuUl.innerHTML = menuFoodLi;
            } else if (menuRow.MMEAL_SC_NM === "석식") {
                dinnerMenuUl.innerHTML = menuFoodLi;
            }
        });
    }
};

const getSchoolFoodMenu = (dateData) => {
    const url = `https://open.neis.go.kr/hub/mealServiceDietInfo?Type=json&KEY=5f1eef5fec9e46e098c48b31c3032b58&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=B10&SD_SCHUL_CODE=7011569&MLSV_YMD=${dateData}`;
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            setSchoolFoodMenu(data);
        });
};
displayDate();