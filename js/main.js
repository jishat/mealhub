"use strict"
// default Function
const myScroll =  (id, duration) => {
    setTimeout(() => {
        document.getElementById(id).scrollIntoView();
    }, duration);
}
const loader = '<span>Search</span> <span id="loader"><span class="spinner-border spinner-border-sm text-light"></span></span>'

// get item details
const itemDetails = data => {
    const fullDetails = data['meals'];
    fullDetails.map(eachItemDetails => {
        const instruction   = eachItemDetails.strInstructions;
        const itemNameMain  = eachItemDetails.strMeal;
        const itemPreview   = eachItemDetails.strMealThumb;

        let li = '';
        for (let i = 1; i <= 20; i++) {
            const itemMeasure       = 'strMeasure'+i;
            const itemIngredient    = 'strIngredient'+i;
            if(eachItemDetails[itemMeasure] == " "){
                break;
            }else{
                li += `<li><i class="fas fa-chevron-circle-right"></i> ${eachItemDetails[itemMeasure]} ${eachItemDetails[itemIngredient]} </li>`;
            }
            
        }
        const instructionHtml   =   `<div class="col-md-6">
                                        <img src="${itemPreview}" alt="${itemNameMain}">
                                    </div>
                                    <div class="col-md-6">
                                        <h2>Ingredients</h2>
                                        <hr/>
                                        <ul class="listItem">
                                            ${li}
                                        </ul>
                                    </div>`;
        const getInstrElement = document.getElementById('recipeDetails');
        getInstrElement.innerHTML = instructionHtml;
        document.getElementById('all-item').innerHTML = "";
        myScroll('recipeDetails', 100);
    })
    
}

//start: Search by user input
document.getElementById("search").addEventListener("click", ()=>{
    const mealName = document.getElementById('mealName').value;

    document.getElementById('search').innerHTML=loader;

    if(mealName == ''){ //if
        alert('Write something before search');
    }else{ //else
        const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`;
        fetch(url)
        .then(response => response.json())
        .then(json => getItemInfo(json))

        const getItemInfo = data => {
            document.getElementById('recipeDetails').innerHTML = "";
            const result = data['meals'];
            if(result == null){
                document.getElementById('notfound').style.display='block';
                document.getElementById('all-item').innerHTML="";
            }else{   
                document.getElementById('notfound').style.display='none';
                let itemHtmlList = '';
                result.map(eachItem => {
                    const itemName = eachItem.strMeal;
                    const itemId = eachItem.idMeal;
                    const itemThumb = eachItem.strMealThumb;

                    itemHtmlList += `<div class="col-md-3 mb-4">
                                            <a href="#" class="eachCard" data-name="${itemId}">
                                                <div class="card">
                                                    <img src="${itemThumb}/preview" class="card-img-top" alt="">
                                                    <div class="card-body ">
                                                    <h5 class="card-title text-center">${itemName}</h5>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>`;
                    
                });
                document.getElementById('all-item').innerHTML=itemHtmlList;
                const eachCard = document.getElementsByClassName("eachCard");
                myScroll('all-item', 100);

                for (let index = 0; index < eachCard.length; index++) {
                    const element = eachCard[index];
                    element.addEventListener('click', (e)=>{
                        e.preventDefault();
                        const getMealId = element.getAttribute('data-name');

                        const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${getMealId}`;
                        fetch(url)
                        .then(response => response.json())
                        .then(json => itemDetails(json));
                    })
                }
            }
        }
        
    } //end if
    setTimeout(() => {
        document.getElementById('search').innerHTML='search';
    }, 500);
});
//End: Search by user input