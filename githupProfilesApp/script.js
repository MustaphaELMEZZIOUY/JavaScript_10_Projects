$(document).ready(() => {
  /* *******************ProfileController (Modale)************************* */
let ProfileController = (() => {
  let apiUrl = 'https://api.github.com/users/';
  let apiRepos = '/repos';

  let getInfo = async (user) => {
    let res = await fetch(apiUrl + user);
    let info = res.json();
    return info;
  }

  let getRepos = async (user) => {
    let res = await fetch(apiUrl + user + apiRepos);
    let repos = await res.json();
    repos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count); //up to down
    repos = repos.slice(0, 10); // get the first 10 if existe or less if not
    return repos;
  }

  return {
    getUserInfo: (user) => {
      return getInfo(user);
    },

    getUserRepos: (user) => {
      return getRepos(user);
    }

  }
})();
/* **********X********ProfileController (Modale)***********X************* */

/* *******************UIController (View)************************* */
let UIController = (() => {
  let DOMString = {
    form: '.form',
    userNameInput: '#userName',
    main: '.main'
  }

  let userName = () => {
    let val = $(DOMString.userNameInput).val();
    $(DOMString.userNameInput).val('');
    return val;
  }

  let getReposStr = (repos) => {
    let str = '';
    $.each(repos, (index, elem) => {
      str += `<li><a href="${elem.html_url}" target="_blank" rel="noopener noreferrer">${elem.name}</a></li>`
    });
    return str;
  }

  let displayInfoRepos = (userInfo, repos) => {
    let str = `
    <div class="img">
      <img src="${userInfo.avatar_url}">
    </div>
    <div class="githup-info">
      <div class="user">
          <h3>${userInfo.login}</h3>
          <h5>${userInfo.bio}</h5>
          <ul>
              <li>${userInfo.followers} <strong>Folowers</strong></li>
              <li>${userInfo.following} <strong>Folowing</strong></li>
              <li>${userInfo.public_repos} <strong>Repos</strong></li>
          </ul>
      </div>
      <div class="repos">
          <ul>
              ${getReposStr(repos)} 
          </ul>
      </div>
    </div>
    `;

    $(DOMString.main).html(str);
  }

  return {
    getDOMStr: () => {
      return DOMString;
    },

    getFormInput: () => {
      return userName();
    },

    displayUserInfoRepos: (userInfo, repos) => {
      displayInfoRepos(userInfo, repos);
    }

  }
})();
/* **********X********UIController (View)***********X************* */

/* *******************Globale app Controller (Controller)************************* */
let Controller = ((ProfileCtrl, UICtrl) => {

  let DOMStr = UICtrl.getDOMStr();

  let setEventListene = () => {
    $(DOMStr.form).on('submit', formSubmit);
  }

  let formSubmit = async (even) => {
    even.preventDefault();

    // get the input
    let user = UICtrl.getFormInput();
    if(user){
      let userInfo = await ProfileCtrl.getUserInfo(user);
      let userRepos = await ProfileCtrl.getUserRepos(user);

      UICtrl.displayUserInfoRepos(userInfo, userRepos);
    }
  }

  return {
    init: () => {
      console.log('The app had started.');

      // set Event listener to the form 
      setEventListene();
    }
  }
})(ProfileController, UIController);

Controller.init();
/* **********X********Globale app Controller (Controller)***********X************* */
})