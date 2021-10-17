/* *******************************Todo Controller (Model)******************************* */
let ToDoController = (() => {
  let allToDos = new Array();

  let toDos = () => {
    let localeToDos = getLocaleToDos();

    if(!localeToDos) {
      updateLocalToDos();
    } else {
      allToDos = localeToDos;
    }

    return allToDos;
  }

  let getLocaleToDos = () => {
    return JSON.parse(localStorage.getItem('toDos'));
  }

  let updateLocalToDos = () => {
    localStorage.setItem('toDos', JSON.stringify(allToDos));
  }

  let getNewId = () => {
    let id = 0;

    if(allToDos.length) {
      id = allToDos[allToDos.length - 1].id + 1;
    }

    return id;
  }

  let setToDo = (item) => {
    let obj = undefined;
    if(item) {
      let id = getNewId();
      obj = {id: id, val: item, complete: false};
      allToDos.push(obj);
      updateLocalToDos();
    }
    return obj;
  }

  let updateItem = (id) => {
    allToDos = allToDos.map(el => {
      if(id === el.id) el.complete = !el.complete;
      return el;
    });

    updateLocalToDos();
  }

  let deleteItem = (id) => {
    allToDos = allToDos.filter(el => {
      if(id !== el.id) return el;
    });

    updateLocalToDos();
  }


  return {
    getToDos: () => {
      return toDos();
    },

    addItem: (item) => {
      return setToDo(item);
    },

    updateToDo: (id) => {
      updateItem(id);
    },

    deleteToDo: (id) => {
      deleteItem(id);
    }
  }
})();
/* *****************X*************Todo Controller (Model)***************X*************** */


/* *******************************UI Controller (View)******************************* */
let UIController = (() => {
  let DOMString = {
    form: '.form',
    toDoInput: '#inputlg',
    toDosUL: '.todos',
    toDosLI: '.todo'
  }

  let getStr = (id, val, complete) => {
    return `<li class='todo ${complete ? "complete" : ""}' id='${id}'>${val}</li>`;
  }

  let setUI = (item) => {
    let str = getStr(item.id, item.val, item.complete);
    $(DOMString.toDosUL).append(str);
  }

  let fieldVal = (target) => {
    // get the element object
    let input = $(target.currentTarget).find(DOMString.toDoInput);

    // get the value
    let inputVal = input.val();

    return inputVal;
  }

  let diplayAll = (items) => {
    $.each(items, (index, val) => {
      setUI(val);
    })
  }

  let toggleID = (even) => {
    let target = $(even.currentTarget);
    target.toggleClass('complete');
    return parseInt(target.attr('id'), 10);
  }

  let deleteID = (even) => {
    let target = $(even.currentTarget);
    let id = parseInt(target.attr('id'), 10);
    target.remove();
    return id;
  }

  return {
    getDOM: () => {
      return DOMString;
    },

    addItem: (item) => {
      setUI(item);
    },

    getFieldVal: (target) => {
      return fieldVal(target);
    },

    emptyFiled: (target) => {
      $(target.currentTarget).find(DOMString.toDoInput).val('');
    },

    displayToDos: (itmes) => {
      diplayAll(itmes);
    },

    toggleLI: (even) => {
      // toggle and get id (not the best choice)
      return toggleID(even);
    },

    deleteToDo: (even) => {
      return deleteID(even);
    }
  }
})();

/* *****************X*************UI Controller (View)***************X*************** */

/* *******************************Globale App Controller (Controller)******************************* */
let Controller = ((TDCtrl, UICtrl) => {

  let DOMStr = UICtrl.getDOM();

  let setEventListener = () => {
    $(DOMStr.form).on('submit', submitForm);

    $(DOMStr.toDosUL).on('click', DOMStr.toDosLI, toggleToDo);

    $(DOMStr.toDosUL).on('contextmenu', DOMStr.toDosLI, deleteToDo);

  }

  let submitForm = (even) => {
    // do not refresh the hall page
    even.preventDefault();

    // get the value
    let inputVal = UICtrl.getFieldVal(even);

    // add value to the liste of todos (array) item = {val: xy, complete: true/false}
    // and update the locale storage to
    let item = TDCtrl.addItem(inputVal);

    // if the item not undefined
    if(item) {
      // add it to the UI
      UICtrl.addItem(item);

      // empty the input field
      UICtrl.emptyFiled(even);
    }
  }

  let toggleToDo = (even) => {

    let id = UICtrl.toggleLI(even);


    TDCtrl.updateToDo(id);
  }

  let deleteToDo = (even) => {
    // to not show the pupop menu as always
    even.preventDefault();

    // delete and get the id of the element deleted
    let id = UICtrl.deleteToDo(even);

    // delete the elemete from the globale liste in the modale
    // and update localStorage to
    TDCtrl.deleteToDo(id);
  }

  return {
    init: () => {
      console.log('The app has started');

      // get the todo liste
      let todos = TDCtrl.getToDos();

      // display the liste, without if cause the result is an array anyway
      UICtrl.displayToDos(todos);

      // set the events listeners
      setEventListener();
    }
  }
})(ToDoController, UIController);
/* *****************X*************Globale App Controller (Controller)***************X*************** */

Controller.init();