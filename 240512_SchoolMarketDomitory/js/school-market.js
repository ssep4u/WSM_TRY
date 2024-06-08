
const getProductCardArticle = (product) => `
    <article class="product-card">
      <img src="images/${product["image"]}" alt="${product['name']} 사진" class="image">
      <div class="name">${product["name"]}</div>
    </article>
    `;
const showData = ((data) => {
    const productContainerSection = document.getElementsByClassName("product-container")[0];
    let productsString = "";
    data.forEach((product) => {
        productsString += getProductCardArticle(product);
    });
    productContainerSection.innerHTML = productsString;
});


const getData = (() => {
    // data 가져오자
    const url = "js/data.json";
    fetch(url)
        .then((response) => response.json())
        .then((data) => showData(data))
        .catch((error) => console.error(error));
});
getData();