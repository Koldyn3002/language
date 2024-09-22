const body = document.querySelector('body');
const container = document.querySelector('.container');
const test_1 = document.getElementById('language');

const questionnaires = [
	{
		"Ты тупой?": {
			"Да": {
				"Есть друзья?": {
					"Да": {
						"Тоже тупые?": {
							"Да": {
								answer: "JavaScript"
							},
							"Нет": {
								answer: "а тогда что ты тут забыл??? ну так и так js =)"
							}
						}
					},
					"Нет": {
						answer: "JavaScript"
					}
				}
			},
			"Нет": {
				"Смотришь Хауди Хо?": {
					"Да": {
						answer: "АХАХАХАХ а говрил что не тупой, JavaScript"
					},
					"Нет": {
						answer: "Ну начни с JavaScript :)"
					}
				}
			}
		}
	},
]

let questionnaireClone = structuredClone(questionnaires);

// Event Listeners
body.addEventListener('click', (el) => {
	// Close Modal Window
	if (el.target.classList[0] == 'modal__window-close') {
		closeModalWindow()
	}

	// Submit Answer
	if (el.target.classList[0] == 'submitBtn') {
		el.preventDefault();
		const question = document.getElementById('question').textContent
		const reply = document.getElementsByName('choice')


		let currObj = questionnaireClone.find(i => Object.keys(i)[0] == question)
		console.log(currObj);
		console.log(question);

		let selected;
		for (let i = 0; i < reply.length; i++){
			if (reply[i].checked) {
				selected = reply[i]
			}
		}

		if(selected.value === 'yes'){
			closeModalWindow();
			let newQuestion = currObj[question]["Да"]
			if ('answer' in newQuestion) questionnaireClone = structuredClone(questionnaires);
			let arrIndex = questionnaireClone.indexOf(currObj)
			questionnaireClone[arrIndex] = newQuestion
			startQuestionnaire(newQuestion)
		} else {
			closeModalWindow();
			let newQuestion = currObj[question]["Нет"]
			if ('answer' in newQuestion) questionnaireClone = structuredClone(questionnaires);
			let arrIndex = questionnaireClone.indexOf(currObj)
			questionnaireClone[arrIndex] = newQuestion
			startQuestionnaire(newQuestion)
		}
	}
})

test_1.addEventListener('click', (el) => {
	startQuestionnaire(questionnaires[0])
})

function startQuestionnaire(questionnaire) {
	const question = Object.keys(questionnaire)[0]
	const answers = []

	if ('answer' in questionnaire) {
		openModalWindow(questionnaire.answer);
	} else {
		for (key in questionnaire[question]) {
			answers.push(questionnaire[question])
		}
	}

	openModalWindow(question, answers);
}

async function showResult(question) {
	const result = document.createElement('h1');
	result.innerText = question;
	result.style.fontFamily = 'Montserrat'
	result.style.textAlign = 'center'
	result.style.margin = '150px auto'
	return result
}

async function openModalWindow(question, answers = null) {
	lockBg();
	const window = document.createElement('div');
	window.classList.add('modal__window');
	const crossBtn = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16"><path class="modal__window-close" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m11.25 4.75l-6.5 6.5m0-6.5l6.5 6.5"/></svg>'
	window.innerHTML = crossBtn;

	if (answers) {
		const form = createForm(question, answers);
		window.appendChild(form)	
	} else {
		const answer = await showResult(question);
		window.appendChild(answer);
		closeModalWindow()
	}

	body.appendChild(window);
}

function closeModalWindow() {
	const window = document.querySelector('.modal__window')
	body.removeChild(window)
	unlockBg();
}

function createForm(question, answers) {
	const form = document.createElement('form');
	// Question title
	const questionTitle = document.createElement('h3');
	questionTitle.classList.add('question')
	questionTitle.setAttribute('id', 'question')
	questionTitle.innerText = question

	// Answer Options
	const answerGroup = document.createElement('div');
	answerGroup.classList.add('form__list');

	for (let i = 0; i < answers.length; i++){
		const answerItem = document.createElement('div');
		answerItem.classList.add('form__list-item');

		const itemInput = document.createElement('input');
		itemInput.setAttribute('type', 'radio');

		const itemLabel = document.createElement('label');

		if (i === 0) {
			itemInput.setAttribute('value', 'yes')
			itemInput.setAttribute('id', 'yes')

			itemLabel.setAttribute('for', 'yes')
			itemLabel.innerText = 'Да'
		} else {
			itemInput.setAttribute('value', 'no')
			itemInput.setAttribute('id', 'no')

			itemLabel.setAttribute('for', 'no')
			itemLabel.innerText = 'Нет'
		}

		itemInput.setAttribute('name', 'choice')

		answerItem.appendChild(itemInput);
		answerItem.appendChild(itemLabel);
		answerGroup.appendChild(answerItem);
	}

	// Submit Button
	const btn = document.createElement('button')
	btn.classList.add('submitBtn');
	btn.setAttribute('type', 'submit');
	btn.setAttribute('id', 'submit_btn');
	btn.innerText = "Отправить"

	form.appendChild(questionTitle)
	form.appendChild(answerGroup);
	form.appendChild(btn);

	return form;
}

function lockBg() {
	const shadow = document.createElement('div')
	shadow.classList.add('shadow')

	container.appendChild(shadow);
}

function unlockBg() {
	const shadow = document.querySelector('.shadow');
	container.removeChild(shadow)
}

