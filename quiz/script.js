$(document).ready(() => {

    /* **************************************Quiz Controller (Module)*********************************************** */
    let quizController = (() => {
        /********************************** Private parte vars and functions **********************************/
        let questions_options = [
            {
                key: 'q1',
                question: 'How is the owner of facebook',
                op1: 'Mark Zuckerberg',
                op2: 'Jems Bond',
                op3: 'Weal Smeth',
                op4: 'Bill Gates'
            },
            {
                key: 'q2',
                question: 'How is the owner of Microsoft',
                op1: 'Mark Zuckerberg',
                op2: 'Jems Bond',
                op3: 'Weal Smeth',
                op4: 'Bill Gates'
            },
            {
                key: 'q3',
                question: 'How is the owner of amzon',
                op1: 'Mark Zuckerberg',
                op2: 'Jeff Bezos',
                op3: 'Weal Smeth',
                op4: 'Bill Gates'
            },
            {
                key: 'q4',
                question: 'How is the owner of Tesla',
                op1: 'Mark Zuckerberg',
                op2: 'Jems Bond',
                op3: 'Elon Musk',
                op4: 'Bill Gates'
            },
        ]

        let correct_answers = [
            {
                key: 'q1',
                answer: 'op1'
            },
            {
                key: 'q2',
                answer: 'op4'
            },
            {
                key: 'q3',
                answer: 'op2'
            },
            {
                key: 'q4',
                answer: 'op3'
            },
        ];

        let nextQuestion = 0;
        let answers = []; // tabel of paire key answer

        // the position not the question it self
        let getNextQst = () => {
            return nextQuestion;
        }

        let incNextQst = () => {
            nextQuestion++;
        }

        
        let getLenghtQst = () => {
            return questions_options.length;
        }

        let sumCorrecteInswer = () => {
            let sum = 0;
            answers.forEach((answer) =>{
                correct_answers.forEach((el) => {
                    if(answer.key === el.key && answer.answer === el.answer){
                        sum++;
                    }
                })
            })

            return {sum: sum, totale: getLenghtQst()};
        }

        /***************X************** Private parte vars and functions ***********X********************/


        // Public parte
        return {
            getQuestion: () => {
                if (getNextQst() < getLenghtQst()){
                    let question1 = questions_options[getNextQst()];
                    incNextQst();
                    return question1;
                } else {
                    return undefined;
                }
            },

            saveAnswer: (key, answer) => {
                answers.push({key: key, answer: answer});
                console.log(answers);
            },

            getTotleCorrectAnswer: () => {
                return sumCorrecteInswer();
            }
        }
    })();
    // quizController.testFunction();
/* ***********************X**************Quiz Controller (Module)****************************X****************** */


/* *****************************************UI Controller (View)************************************************* */
    let UIController = (() => {

        let DOMStrings = {
            question_options: '.question_options',
            question: '#question',
            nextQstBtn: '#nextQst',
            reloadBtn: '#reload',
            choices: '[name="optradio"]'
        }

        let setIdQst = (key) => {
            $(DOMStrings.question_options).attr('id', key)
        }

        let getIdQst = () => {
            return $(DOMStrings.question_options).attr('id');
        }

        let setQst = (qst) => {
            $(DOMStrings.question).text(qst);
        }

        let optionString = (opt, optValue) => {
            let str = `<div class="radio"><label><input type="radio" name="optradio" value="${opt}"> ${optValue} </label></div>`;
            return str;
        }

        let setOptions = (options) => {
            for(let option in options){
                if(option.includes('op')){
                    $(DOMStrings.question_options).append(optionString(option, options[option]));
                }
            }
        }

        let removeOptionsAndIDAndQst = () => {
                    $(`${DOMStrings.question_options} > div`).remove();
                    $(DOMStrings.question_options).attr('id', '');
                    $(DOMStrings.question).text('');
        }


        let getUserAnswer = () => {
            let answer = undefined;
            const choices = $(DOMStrings.choices);
            // in jquery forEach is jst each
            choices.each((id, el) => {
                if(el.checked) answer = el.value;
            });
            return answer;
        }

        let updateResulteDisplay = (totale) => {
            let str = `You have answer correctly for ${totale.sum} from ${totale.totale}`;
            $(DOMStrings.question).text(str);
        }

        let changeReloadDisplay = () => {
            $(DOMStrings.reloadBtn).toggle();
        }

        let changeNextBtnDisplay = () => {
            $(DOMStrings.nextQstBtn).toggle();
        }

        return{
            getDOMStrings: () => {
                return DOMStrings;
            },
            // question and options
            updateQstAndOpt: (qst_Opts) => {
                setIdQst(qst_Opts.key);
                setQst(qst_Opts.question);
                setOptions(qst_Opts);
            },

            getAnswer: () => {
                return getUserAnswer();
            },

            getKey: () =>{
                return getIdQst();
            },

            removeQstAndOpt: () => {
                removeOptionsAndIDAndQst();
            },

            showResults: (totale) => {
                updateResulteDisplay(totale);
            },

            toggleReloadBtn: () => {
                changeReloadDisplay();
            },

            toggleNextQstBtn: () =>{
                changeNextBtnDisplay();
            }
        }
    })();

    // UIController.testFunction()
/* ***********************X*****************UI Controller (View)******************************X***************** */


/* **************************************Global App Controller (Controller)************************************** */
    let appController = ((quizCtrl, UICtrl) => {

        let setUpEventListener = () => {
            let DOMStr = UICtrl.getDOMStrings();
            $(DOMStr.nextQstBtn).click(ctrNextStep);
            $(DOMStr.reloadBtn).click(() => {
                location. reload();
            });

            // hide the reload btn
            UICtrl.toggleReloadBtn();
        };

        let ctrNextStep = () => {
            //check if the user make his choise 'required'
            let answer = UICtrl.getAnswer();

            // if the user make his choice or no (nothing happen if not)
            if(answer){
                // save inswer
                quizCtrl.saveAnswer(UICtrl.getKey(), UICtrl.getAnswer());

                // update the UI (remove the content)
                UICtrl.removeQstAndOpt();

                // get the question and its options or undifined
                let question_options = quizCtrl.getQuestion();

                if(question_options){
                    UICtrl.updateQstAndOpt(question_options);
                } else {
                    // prepare the ui
                    UICtrl.removeQstAndOpt();

                    // show result
                    UICtrl.showResults(quizCtrl.getTotleCorrectAnswer());

                    // hide the nextQst btn
                    UICtrl.toggleNextQstBtn();

                    // display the button of reload
                    UICtrl.toggleReloadBtn();
                }
            }
        }

        return{
            init: () => {
                console.log('App has started.');
                // get the question and its options or undifined
                let question_options = quizCtrl.getQuestion();

                if(question_options){
                    //update the UI
                    UICtrl.updateQstAndOpt(question_options);

                    //Add the event listenr
                    setUpEventListener();
                } else {
                    console.log("there is no more question");
                }

            }
        }
    })(quizController, UIController);

    appController.init();

/* **********************X***************Global App Controller (Controller)*********************X**************** */

});
// to use
// document.querySelectorAll('[name="optradio"]').forEach((el) => {if(el.checked) console.log(true);})
// document.querySelectorAll('[name="optradio"]').forEach((el) => {if(el.checked) el.checked=false;})

