$(document).ready(() => {

  /* *****************************Movie Controller (Model)******************************* */
  let movieController = (() => {
    let pathUrl = 'https://api.themoviedb.org/3';
    let posterPath = 'https://image.tmdb.org/t/p/w500';
    let url =  pathUrl + '/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1';
    let queryUrl =pathUrl + "/search/movie?api_key=04c35731a5ee918f014970082a0088b1&query=";

    function partition(list, n) {
      if(Number.isInteger(n) && Array.isArray(list) && list.length > 0){
        let newList = new Array();
        let lengthList = list.length
        let divLenghtList = Math.floor(lengthList / n);
        if(lengthList % n){
          console.log('we have to add a one');
          divLenghtList++;
        }

        for(let i = 0; i < divLenghtList; i++){
          let arr = list.slice(n*i, n*(i+1));
          newList.push(arr);
        }

        return newList;

      } else {
        return list;
      }
    }

    async function randomMovies() {
      let awaitRes = await fetch(url);
      let res = await awaitRes.json();
      return res;
    }

    let getMovie = async (val) => {
      let awaitRes = await fetch(queryUrl + val);
      let res = await awaitRes.json();
      return res;
    }
    
    return {
      getMovies: async () => {
        return await randomMovies();
      },

      // we don't use async await jst because there is enough 'asynchronouse'
      search: (val) => {
        return getMovie(val);
      },

      divideTab: (movies, n) => {
        return partition(movies, n);
      },

      getPosterPath: () => {
        return posterPath;
      }
      
    }
  })();
  /* *****************X***********Movie Controller (Model)**************X**************** */

  /* *****************************UI Controller (View)******************************* */
  let UIController = (() => {
    let DOMString = {
      moviesContainer: '.main-container',
      form: '.form',
      searchInput: '#search',
    }

    let getStr = (movie, path) => {
      let str = `
      <div class="col-md-3 movie-info">
        <img src="${path + movie.poster_path}" alt="movie name">
        <h4 class="list-group-item"><span class="title">${movie.title}</span> <span class="badge">${movie.vote_average}</span></h4>
        <div class="overView">
          ${movie.overview}          
        </div>
      </div>
      `
      return str;
    }

    let displayAll = (movies, path) => {
      // prepear the UI
      $(DOMString.moviesContainer).text('');
      if(movies) {
        $.each(movies, (index, val) => {
          let divEl = $('<div class="row"></div>');
          val.forEach(element => {
            let strEl = getStr(element, path);
            divEl.append(strEl);
          });

          // add divEl to the DOM
          $(DOMString.moviesContainer).append(divEl);
        })
      } else {
        $(DOMString.moviesContainer).text('No Movies found');
      }
    }

    

    return {
      getDOM: () => {
        return DOMString;
      }, 

      displayMovies(res, path) {
        displayAll(res, path);
      }
    }
  })();
  /* *****************X***********UI Controller (View)**************X**************** */
  /* *****************************Globale app Controller (Controller)******************************* */
  let Controller = ((movieCtrl, UICtrl) => {
    let DOMStr = UICtrl.getDOM();

    let setEventListener = () => {
      $(DOMStr.form).on('submit', displayMoviesBySearch)
    }

    let displayMoviesBySearch = async (even) => {
      even.preventDefault();
      let target = $($(even.target).find(DOMStr.searchInput)[0]);
      let val = target.val();
      console.log(target);
      if(val){
        let movies = await movieCtrl.search(val);
        
         // just to get the result and on more auther info about the statue or so
         let randomMoviesRes = movies.results;

         // divide result in a tabel of subtables
         let dividedTab = movieCtrl.divideTab(randomMoviesRes, 4);
 
         // display result 'the path because the resulte has only the image location without path
         UICtrl.displayMovies(dividedTab, movieCtrl.getPosterPath());
      }
    }

    

    return{
      init: async () => {
        console.log('the app has started');

        // get Random Movies
        let randomMovies = await movieCtrl.getMovies(); // we use await (try to remove if and see) to not get a promise but the resulte directe (not the best choise 'if there is no resulte for example)

        // just to get the result and on more auther info about the statue or so
        let randomMoviesRes = randomMovies.results;

        // divide result in a tabel of subtables
        let dividedTab = movieCtrl.divideTab(randomMoviesRes, 4);

        // display result 'the path because the resulte has only the image location without path
        UICtrl.displayMovies(dividedTab, movieCtrl.getPosterPath());


        // set the event lestainer
        setEventListener();
      }
    }
  })(movieController, UIController);
  /* *****************X***********Globale app Controller (Controller)**************X**************** */
  

  Controller.init();
});