const USER = "ctpspeedtech";

const REPO = "english-test";
// const USER = "YOUR_USERNAME";

// const REPO = "YOUR_REPO";

const FOLDER = "images";


let exams = [];

let currentIndex = 0;

let currentExam = null;


let userAnswers = {};




// Load danh sách ảnh từ Github

async function start() {


    const api =
        `https://api.github.com/repos/${USER}/${REPO}/contents/${FOLDER}`;


    const response = await fetch(api);


    const files = await response.json();



    exams = files

        .filter(
            file =>
                /\.(jpg|jpeg|png)$/i.test(file.name)
        )

        .map(
            file => ({

                name: file.name,

                url: file.download_url

            })
        );



    createSelect();


    loadExam(0);


}






function createSelect() {


    const select =
        document.getElementById("examSelect");



    exams.forEach(
        (exam, index) => {


            const option =
                document.createElement("option");


            option.value = index;


            option.textContent =
                cleanTitle(exam.name);



            select.appendChild(option);


        }
    );



    select.onchange = function () {


        loadExam(
            Number(this.value)
        );


    };


}







function parseName2(filename) {


    filename =
        filename
            .replace(/\.(jpg|jpeg|png)$/i, "");



    const regex =
        /(.+)_test(\d+)_(\d+)-(\d+)_([ABCD]+)/;



    const result =
        filename.match(regex);



    if (!result) {

        return null;

    }



    return {


        book: result[1],


        test: result[2],


        start: Number(result[3]),


        end: Number(result[4]),


        answers:
            result[5].split("")


    };


}


function parseName(filename) {

    filename = filename
        .replace(/\.(jpg|jpeg|png)$/i, "");

    const regex =
        /(.+)_test(\d+)_(\d+)-(\d+)_([A-D]+)/i;

    const result = filename.match(regex);

    if (!result) {
        console.error("Sai format filename:", filename);
        return null;
    }

    return {
        book: result[1],
        test: Number(result[2]),
        start: Number(result[3]),
        end: Number(result[4]),
        answers: result[5].toUpperCase().split("")
    };
}




// Xóa phần đáp án _ACDB

function cleanTitle(filename) {


    return filename

        .replace(
            /_[ABCD]+(?=\.)/,
            ""
        )

        .replace(
            /\.(jpg|jpeg|png)$/i,
            ""
        );


}








function loadExam2(index) {


    currentIndex = index;


    const file =
        exams[index];



    currentExam =
        parseName(file.name);



    userAnswers = {};



    document
        .getElementById("examSelect")
        .value = index;



    document
        .getElementById("title")
        .innerHTML =

        cleanTitle(file.name);



    document
        .getElementById("questionImage")
        .src = file.url;



    renderQuestions();


    updateScore();


}


function loadExam(index) {
    currentIndex = index;

    const file = exams[index];

    if (!file) {
        console.error("No exam file");
        return;
    }

    currentExam = parseName(file.name);

    if (!currentExam) {
        console.error("Sai format filename:", file.name);
        return;
    }

    userAnswers = {};

    document.getElementById("examSelect").value = index;
    document.getElementById("title").innerHTML = cleanTitle(file.name);
    document.getElementById("questionImage").src = file.url;

    renderQuestions();
    updateScore();
}





function renderQuestions() {


    const box =
        document.getElementById("questions");



    box.innerHTML = "";



    for (
        let i = currentExam.start;
        i <= currentExam.end;
        i++
    ) {


        box.innerHTML +=

        `

        <div class="question"
             id="question-${i}">


            <div class="number">

                ${i}

            </div>



            <div class="answers">


                ${createOption(i,"A")}

                ${createOption(i,"B")}

                ${createOption(i,"C")}

                ${createOption(i,"D")}


            </div>


        </div>

        `;


    }


}







function createOption2(question,value) {


    return `

    <label class="option">


        <input

        type="radio"

        name="q${question}"

        onclick="checkAnswer(${question}, '${value}')">


        ${value}


    </label>

    `;


}

function createOption(question, value) {


    return `

    <label class="option">


        <input

        type="radio"

        name="q${question}"

        value="${value}"

        onclick="checkAnswer(${question}, '${value}')">


        ${value}


    </label>

    `;


}








function checkAnswer(question, answer) {


    userAnswers[question] = answer;



    const index =
        question - currentExam.start;



    const correct =
        currentExam.answers[index];



    const box =
        document.getElementById(
            `question-${question}`
        );



    const options =
        box.querySelectorAll(".option");



    options.forEach(
        option => {


            const input =
                option.querySelector("input");



            option.classList.remove(
                "correct",
                "wrong"
            );



            if (
                input.value === correct
            ) {

                option.classList.add(
                    "correct"
                );

            }



            if (
                input.value === answer &&
                answer !== correct
            ) {

                option.classList.add(
                    "wrong"
                );

            }


        }
    );



    updateScore();



    if (finished()) {


        setTimeout(
            nextExam,
            800
        );


    }


}









function updateScore() {


    let total =
        currentExam.answers.length;



    let done =
        Object.keys(userAnswers).length;



    let correct = 0;



    Object.keys(userAnswers)
        .forEach(
            q => {


                let index =
                    Number(q)
                    -
                    currentExam.start;



                if (
                    userAnswers[q]
                    ===
                    currentExam.answers[index]
                ) {

                    correct++;

                }


            }
        );



    document
        .getElementById("result")
        .innerHTML =


        `

        Đã làm:
        ${done}/${total}


        <br>


        ✅ Đúng:
        ${correct}


        &nbsp;


        ❌ Sai:
        ${done - correct}


        `;


}








function finished() {


    let total =
        currentExam.answers.length;



    if (
        Object.keys(userAnswers).length
        !==
        total
    ) {

        return false;

    }



    return Object.keys(userAnswers)
        .every(
            q => {


                let index =
                    Number(q)
                    -
                    currentExam.start;



                return (
                    userAnswers[q]
                    ===
                    currentExam.answers[index]
                );


            }
        );


}








function nextExam() {


    let next =
        currentIndex + 1;



    if (
        next >= exams.length
    ) {


        alert(
            "Đã hết đề"
        );


        return;


    }



    loadExam(next);


}






document
    .getElementById("nextBtn")
    .onclick =
    nextExam;




start();
