$(document).ready(() => {

  /* *****************************Note Controller (Model)******************************* */
  let noteController = (() => {
    let notes = undefined;
    
    // localStorage.setItem('notes', "");
    let getLocaleNotes = () => {
      if(localStorage.notes){
        notes = JSON.parse(localStorage.notes).filter(el => el.note !== '');
      } else {
        // localStorage.setItem('notes', JSON.stringify([{1: 'a'}]));
        notes = [];
      }

      // update localStorage
      updateLocalStorage()
      return notes;
    }

    let newId = () => {
      // get the last id in the note liste and add 1 to generate the new id
      let lenghtNotes = notes.length;
      let id = 0;
      if(lenghtNotes){
        // generate new id
        id = notes[lenghtNotes - 1]['id'] + 1;
      } 

      // update notes array
      notes.push({id: id, note: ''});

      // update localStorage
      updateLocalStorage()

      return id;
    }

    let updateLocalStorage = () => {
      localStorage.setItem('notes', JSON.stringify(notes));
    }

    let setNotes = (note) => {
      notes = notes.map(el => {
        if(el.id === note.id){
          el.note = note.note;
        }
        return el;
      });

      // update localStorage
      updateLocalStorage();
    }

    let deleteNote = (id) => {
      notes = notes.filter(el => el.id !== id);
      updateLocalStorage();
    }


    return {
      getNotes: () => {
        return getLocaleNotes();
      },

      getNewId: () => {
        return newId();
      },

      updateNote: (note) => {
        setNotes(note);
      },

      deleteNote: (id) => {
        deleteNote(id);
      }

      
    }
  })();
  /* *****************X***********Note Controller (Model)**************X**************** */
  /* *****************************UI Controller (View)******************************* */
  let UIController = (() => {
    let DOMString = {
      globalContainer: '.globaleContainer',
      addNote: '.newNote',
      editBtn: '.edit',
      removBtn: '.remove',
      currentNote: '.note',
      mainNote: '.main',
      textNote: '.text',
      textareaEdit: '.textareaEdit'
    }

    let globaleContainer = $(DOMString.globalContainer);

    let getNoteStr = (id, note) =>{
      return `
      <div class="note" id='${id}'>
            <div class="buttons">
                <button class="edit"><i class="glyphicon glyphicon-pencil"></i></button>
                <button class="remove"><i class="glyphicon glyphicon-trash"></i></button>
            </div>

            <div class="main ">
                <!-- hidden already deffine in bootstrap  -->
                <div class="text"> 
                    ${note}
                </div>
                <textarea class='textareaEdit hidden'>${note}</textarea>
            </div>
        </div>
      </div>
      `;
    }

    let displayNote = (note) => {
      globaleContainer.append(getNoteStr(note.id, note.note));
    }

    let displayAll = (notes) => {
      $.each(notes, (index, val) => {
        displayNote(val)
      });
    }

    let toggleNote = (even) => {
      let target = $(even.currentTarget);
      let closestsNote = target.closest(DOMString.currentNote)[0];

      let textChilde = $(closestsNote).find(DOMString.textNote)[0];
      $(textChilde).toggleClass('hidden');

      let textAreaChilde = $(closestsNote).find(DOMString.textareaEdit)[0];
      $(textAreaChilde).toggleClass('hidden');
    }

    let noteEdit = (even) => {
      let target = $(even.currentTarget);

      let newVal = target.val();

      let closestsNote = target.closest(DOMString.currentNote)[0]; 
      
      let textChilde = $(closestsNote).find(DOMString.textNote)[0];

      $(textChilde).text(newVal);

      return {id: parseInt($(closestsNote).attr('id'), 10), note: newVal};
    }

    let deletNote = (even) => {
      let target = $(even.currentTarget);
      let closestsNote = target.closest(DOMString.currentNote)[0];

      let id = parseInt($(closestsNote).attr('id'), 10);

      $(closestsNote).remove();
      return id;
    }

    return {
      getDOM: () => {
        return DOMString;
      }, 

      displayNotes: (notes) => {
        if(notes.length){
          displayAll(notes);
        }
      },

      addNewNote: (id) => {
        let note = {id: id, note: ""}
        displayNote(note);
      },

      editNote: (even) => {
        toggleNote(even);
      },

      changeContent: (even) => {
        return noteEdit(even);
      },

      removeNote: (even) => {
        return deletNote(even);
      }
    }
  })();
  /* *****************X***********UI Controller (View)**************X**************** */
  /* *****************************Globale app Controller (Controller)******************************* */
  let Controller = ((noteCtrl, UICtrl) => {
    let DOMStr = UICtrl.getDOM();

    let setEventListener = () => {
      // add new note
      $(DOMStr.addNote).click(newNote);

      // edite note (delegation)
      $(DOMStr.globalContainer).on('click', DOMStr.editBtn, UICtrl.editNote);

      // change the content of the note (propertychange jst for IE)
      $(DOMStr.globalContainer).on('input propertychange', DOMStr.textareaEdit, contentEdit);

      // delete a note
      $(DOMStr.globalContainer).on('click', DOMStr.removBtn, removeNote);
      
    }

    let newNote = () => {
      // get a new id (also add new note the notes array in the same time)
      let newId = noteCtrl.getNewId();

      // update the UI
      UICtrl.addNewNote(newId);
    }

    let contentEdit = (even) => {
      // edit the textArea and also the main text note and get the id and new value of the note
      let newContent = UICtrl.changeContent(even);


      // update liste of note and localStorage
      noteCtrl.updateNote(newContent);
    }

    let removeNote = (even) => {
      // remove the note element and its id
      let id = UICtrl.removeNote(even);

      // delete note from the list notes and localStorage to
      noteCtrl.deleteNote(id);
    }

    return{
      init: () => {
        console.log('the app has started');
        //get notes
        let notes = noteCtrl.getNotes();

        // if there are locale notes so display it (test in the ui controller)
        UICtrl.displayNotes(notes);

        // set the event lestainer
        setEventListener();
      }
    }
  })(noteController, UIController);
  /* *****************X***********Globale app Controller (Controller)**************X**************** */
  

  Controller.init();
});