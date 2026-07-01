const USER="ctpspeedtech";

const REPO="english-test";

// const USER="YOUR_GITHUB_USERNAME";

// const REPO="YOUR_REPO_NAME";


const FOLDER="images";



let exams=[];

let currentExam=null;



async function start(){



const api=

`https://api.github.com/repos/${USER}/${REPO}/contents/${FOLDER}`;



let response=
await fetch(api);



let files=
await response.json();



exams=

files

.filter(
file =>
file.name.match(/\.(jpg|jpeg|png)$/i)
)

.map(
file => ({

name:file.name,

url:file.download_url

})

);



if(exams.length==0){

alert(
"Không tìm thấy ảnh"
);

return;

}



createSelect();


loadExam(0);



}







function createSelect(){



let select =
document.getElementById(
"examSelect"
);



select.innerHTML="";



exams.forEach(
(item,index)=>{


let option =
document.createElement("option");


option.value=index;


option.textContent=item.name;


select.appendChild(option);



});



select.onchange=function(){


loadExam(
Number(this.value)
);


}



}









function parseName(filename){



let name =

filename.replace(
".jpg",
""
);



name =

name.replace(
".png",
""
);



let regex =

/(.+)_test(\d+)_(\d+)-(\d+)_([ABCD]+)/;



let result =
name.match(regex);



if(!result){

return null;

}



return {


book:
result[1],


test:
result[2],


start:
Number(result[3]),


end:
Number(result[4]),


answers:
result[5].split("")


};


}









function loadExam(index){



let file =
exams[index];



currentExam =
parseName(file.name);



if(!currentExam){


alert(
"Sai format file: "
+file.name
);


return;


}




document
.getElementById("title")
.innerHTML=

`

${currentExam.book}

- Test ${currentExam.test}

<br>

Câu ${currentExam.start}
-
${currentExam.end}

`;




document
.getElementById("questionImage")
.src=file.url;



renderQuestions();



updateScore();


}









function renderQuestions(){



let box =
document.getElementById(
"questions"
);



box.innerHTML="";



for(

let i=currentExam.start;

i<=currentExam.end;

i++

){



box.innerHTML +=

`

<div
class="question"
id="question-${i}">


<div class="number">

${i}

</div>



<div class="answers">



<label class="option">

<input

type="radio"

name="q${i}"

onclick="checkAnswer(${i},'A')">

A

</label>



<label class="option">

<input

type="radio"

name="q${i}"

onclick="checkAnswer(${i},'B')">

B

</label>




<label class="option">

<input

type="radio"

name="q${i}"

onclick="checkAnswer(${i},'C')">

C

</label>




<label class="option">

<input

type="radio"

name="q${i}"

onclick="checkAnswer(${i},'D')">

D

</label>



</div>



</div>


`;



}



}









let score=0;

let answered=0;

let history={};







function checkAnswer(question,answer){



if(history[question]){

return;

}



history[question]=true;


answered++;



let index =
question-currentExam.start;



let correct =
currentExam.answers[index];



let box =
document.getElementById(
`question-${question}`
);



let options =
box.querySelectorAll(
".option"
);



options.forEach(
(option)=>{


let input =
option.querySelector("input");



if(
input.nextSibling
){}



if(
input.value==correct
){

option.classList.add(
"correct"
);

}



if(
input.value==answer
&&
answer!=correct
){

option.classList.add(
"wrong"
);


}


});




if(answer==correct){

score++;

}



updateScore();



}









function updateScore(){



document
.getElementById("result")
.innerHTML=

`

Đã làm:
${answered}/${currentExam.answers.length}

<br>

Đúng:
${score}/${currentExam.answers.length}

<br>

${Math.round(
score/currentExam.answers.length*100
)||0}%

`;



}







start();
