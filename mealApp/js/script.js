//to use
//const proxy = 'https://api.allorigins.win/raw?url='; // cause it works like that proxy+'full api url (with the https protocol also)'

//  $.ajax({url: "https://api.allorigins.win/raw?url=https://recipesapi.herokuapp.com/api/get?rId=41470", async: true, success: function(result){
//   console.log(result.recipe);
// }});

// also you have to remember that you need to work with the globale object to store the the racipe to be shown for all fils (model and view and controller)

// /* *********************************blugin for vanela js********************************* */
// (function() {
//     var cors_api_host = 'api.allorigins.win/raw?url='; //the real url is the same plus 'https://' and u have to add the holl url api after the ...url=  yes with the https
//     var cors_api_url = 'https://' + cors_api_host;
//     var slice = [].slice;
//     var origin = window.location.protocol + '//' + window.location.host;
//     var open = XMLHttpRequest.prototype.open;
//     XMLHttpRequest.prototype.open = function() {
//         var args = slice.call(arguments);
//         var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
//         if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
//             targetOrigin[1] !== cors_api_host) {
//             args[1] = cors_api_url + args[1];
//         }
//         return open.apply(this, args);
//     };
// })();
// /* ******************X**************blugin for vanela js******************X************** */

$(document).ready(() => {

    let meals = new Array();
    let randomMeal = new Array();
    let likedMeals = new Array();

    function localLiked() {
        if(localStorage.likedMeals){
            likedMeals = JSON.parse(localStorage.likedMeals);
        }
    }

    localLiked();

    function displayLikedMeal(el) {
        let element = `<a class="meal" href="#${el.idMeal}" data-toggle="modal" data-target="#myModal">
                <img src="${el.strMealThumb}" alt="Meal">
                <span>${el.strMeal}</span>
                <button class="btn btn-danger-btn-sm">
                    <i class="glyphicon glyphicon-remove-sign"></i>
                </button>
            </a>`;

        let likeMls = $('.likedMeals');

        likeMls.append(element);
    }

    function displayLikedMeals() {
        let likeMls = $('.likedMeals');
        // likeMls.text('');
        likedMeals.forEach(el => {
            // console.log(el);
            displayLikedMeal(el);
        })
    }

    displayLikedMeals();

    // localStorage.likedMeals = JSON.stringify([1, 2, 3]);

    // console.log(localStorage.likedMeals);
    // console.log(JSON.parse(localStorage.likedMeals));

    /* *************************************search recipes************************************* */
    async function getRandomRecipe() {
        let url = 'https://api.allorigins.win/raw?url=https://www.themealdb.com/api/json/v1/1/random.php';
        let prs = new Promise((resolv, reject) => {
            let req = new XMLHttpRequest();
            req.open('GET', url);
            req.onload = () => {
                if(req.status === 200){
                    resolv(req.responseText)
                } else {
                    reject(req.status)
                }
            }
            req.send();
        });
        
        // let res = await prs;
        // return res;
        
        let res1 = await fetch(url).then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Something went wrong');
            }
          }).catch((error) => {
            return 404;
          });
    
        return res1; // error makes a big trouble, you have to handle them your self before sent the results
    }

    async function getRecipeInput(rcp) {
        let url = `https://api.allorigins.win/raw?url=https://www.themealdb.com/api/json/v1/1/search.php?s=${rcp}`;
        let prs = new Promise((resolv, reject) => {
            let req = new XMLHttpRequest();
            req.open('GET', url);
            req.onload = () => {
                if(req.status === 200){
                    resolv(req.responseText)
                } else {
                    reject(req.status)
                }
            }
            req.send();
        });
        
        // let res = await prs;
        // return res;
        
        let res1 = await fetch(url).then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Something went wrong');
            }
          }).catch((error) => {
            return 404;
          });
    
        return res1; // error makes a big trouble, you have to handle them your self before sent the results
    }

    function itIsLiked(id) {
        return JSON.stringify(likedMeals).includes(id + '')? 'like' : undefined;
    }
    
    async function displayRandomRecipe() {
        // get recipe
        let recipe = await getRandomRecipe(); // because the 'getRecipe' return a promise you have to use 'await' to get the result directly or you will handle the promise the classic way
        // check if recipe existe
        if(recipe !== 404){
            let meal = recipe.meals[0];

            let el = `
            <a class="meal" href='#${meal.idMeal}'>
                <img src="${meal.strMealThumb}" alt="randamMeal" data-toggle="modal" data-target="#myModal">
                <div class="details">
                    <h4 data-toggle="modal" data-target="#myModal">${meal.strMeal}</h4>
                    <button class="btn btn-default btn-sm ${itIsLiked(meal.idMeal)}">
                        <i class="glyphicon glyphicon-heart"></i>
                    </button>
                </div>
                <span data-toggle="modal" data-target="#myModal">Random Meal</span>
            </a>`;
            let rdmMeal = $('.srchRandomMeal');
            rdmMeal.empty();
            rdmMeal.append(el);

            randomMeal.push(meal);

        } else {
            //console.log('Error Recipe');
            getRandomRecipe(); //not the best choice really
        }
    }
    
    displayRandomRecipe();
    /* *************************************search recipes************************************* */

    function mouseToggle(even){
        // console.log($(even));
        $(even.currentTarget).children('button.btn').toggle();
    }

    // $('.likedMeals').hover((even) => {
    //     // $(even.currentTarget).children('button.btn').toggle();
    //     console.log($(even.currentTarget));
    //     let target = $(even.currentTarget).children();
    //     console.log(target);
    //     $.each(target, (i, val) => {
    //         $(val).hover(mouseToggle);
    //     })
    // });

    // to toggle the close button when the user hover the liked meals liste "mousehover not suported anymore" that is why mouseenter and mouseleave
    $('.likedMeals').on('mouseenter', 'a.meal', mouseToggle).on('mouseleave', 'a.meal', mouseToggle);


    function getLis(meal, strIng) {
        strIng = '',
        $.each(meal, ( index, value ) =>{
            if(index.includes('strIngredient') && value){
                strIng += `<li>${value}</li>`;
            }
        })
        return strIng;
    }
    function mealDetails(even) {
        let target = $(even.target);
        //console.log($(target[0]).is('button.btn'));
        //console.log($(target[0]).is('button.btn i'));
        if(!$(target[0]).is('button.btn') && !$(target[0]).is('button.btn i')){
            //console.log('we started display');
            let href = $(target.closest('a.meal')[0]).attr('href').replace('#', '');
            //console.log(href);
            let allTab = $.merge(meals, $.merge(randomMeal, likedMeals ))
            let meal = allTab.filter(el => el.idMeal === href);
            let strIng = '';
            if(meal[0]){
                //console.log(meal[0]);
                meal = meal[0];
                let content = `
                <div class="modal-header">
                    <button class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">${meal.strMeal}</h4>
                </div>

                <div class="modal-body">
                    <img src="${meal.strMealThumb}" alt="Meal">
                    <p>${meal.strInstructions}</p>
                    <h4>Ingredients</h4>
                    <ul>
                        ${ getLis(meal, strIng)}
                    </ul>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-default" data-dismiss="modal" style="outline: none;">Close</button>
                </div>
                `;

                $('#myModal .modal-content').text('');
                $('#myModal .modal-content').html(content);
            }
        }
    }

    // to display the details of a liked meal or random or search
    let event = [$('.likedMeals'), $('.srchRandomMeal')]
    event.forEach(el => el.on('click', 'a.meal', mealDetails));

    

    // $('.likedMeals').mouseleave((even) => {
    //     // $(even.currentTarget).children('button.btn').toggle();
    //     let target = $(even.currentTarget).children();
    //     $.each(target, (i, val) => {
    //         $(val).children('button btn').hide();
    //     })
    // });

    function removeMeal(even) {
        let target = $(even.target);
        if(target.is('button.btn') || target.is('button.btn i')){
            target = target.parentsUntil("div.likedMeals");

            let href = $(target[1]).attr('href').replace('#', '');

            //toggle liked meal in UI
            likeColorToggle($(`a.meal[href="#${href}"] button.btn`));

            // remove it from the array of liked meals
            likedMeals = likedMeals.filter(el => el.idMeal !== href);

            //update localStrage
            localStorage.likedMeals = JSON.stringify(likedMeals);
            
            target.remove();
        }
    }

    $('.likedMeals').click(removeMeal);

    function likeColorToggle(el) {
        el.toggleClass('like');
    }

    function likedMealToggle(id) {
        if(itIsLiked(id)){
            //console.log('yes it is liked');
            // remove it from the list of liked el in UI
            
            $(`.likedMeals .meal[href="#${id}"]`).remove();

            // remove it from the array of liked meals
            likedMeals = likedMeals.filter(el => el.idMeal !== id);

            //update localStrage
            localStorage.likedMeals = JSON.stringify(likedMeals);

            //console.log(likedMeals);
        } else {
            let el = meals.filter(el => el.idMeal === id);

            //console.log(el);
            if(el.length > 0){
                //console.log(el[0]);
                likedMeals.push(el[0]);
                displayLikedMeal(el[0]);
            } else {
                displayLikedMeal(randomMeal[0]);
                likedMeals.push(randomMeal[0]);
            }
            
            //update localStrage
            localStorage.likedMeals = JSON.stringify(likedMeals);
        }
    }

    function toggleMeal(even){
        //console.log('hello from toggle meal');
        let target = $(even.target);
        if(target.is('button.btn') || target.is('button.btn i')){
            likeColorToggle(target.parent());
            //console.log(target.closest("a.meal")[0]);
            // let hrefEle = $(target.parentsUntil('.srchRandomMeal')[2]).attr('href').replace('#', ''); //old way it not scalable
            let hrefEle = $(target.closest("a.meal")[0]).attr('href').replace('#', '');
            likedMealToggle(hrefEle);
        }
        
    }

    /* liked meals */
    $('.srchRandomMeal').click(toggleMeal);

    /* search */
    $('#myForm').submit(getInputRecipe);

    async function getInputRecipe(event) { 
        let inpt = $('.form-control').val();
        //console.log(inpt);

        let res = await getRecipeInput(inpt);

        // console.log(res);

        if(res.meals){
            //console.log(res.meals);
            meals = res.meals;
            let target = $('.srchRandomMeal');
            target.empty();
            let elem = undefined;
            $.each(meals, (i, elem) => {
                elem = `
                <a class="meal" href='#${elem.idMeal}'>
                    <img src="${elem.strMealThumb}" alt="randamMeal" data-toggle="modal" data-target="#myModal">
                    <div class="details">
                        <h4 data-toggle="modal" data-target="#myModal">${elem.strMeal}</h4>
                        <button class="btn btn-default btn-sm ${itIsLiked(elem.idMeal)}">
                            <i class="glyphicon glyphicon-heart"></i>
                        </button>
                    </div>
                </a>`;

                target.append(elem);
            })
        } else {
            //console.log('No');
        }
        
        event.preventDefault();
    }

});


