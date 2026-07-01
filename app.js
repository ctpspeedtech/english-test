const USER="ctpspeedtech";

const REPO="english-test";

const FOLDER="images";



let exams=[];

let currentExam=null;



const api =

`https://api.github.com/repos/${USER}/${REPO}/contents/${FOLDER}`;





async function start(){


let res =
await fetch(api);



let files =
await res.json();



exams = files

.filter(
x=>x.name.match(/\.(jpg|jpeg|png)$/i)
)

.map(
x=>({

name:x.name,

url:x.download_url

})

);



fillSelect();



loadExam(0);



}





function fillSelect(){


let select =
document.getElementById(
"examSelect"
);



exams.forEach(
(item,index)=>{


let option =
document.createElement("option");


option.value=index;


option.textContent=item.name;



select.appendChild(option);



});



select.onchange=function(){


loadExam(this.value);


}



}





function parseName(name){



name =
name.replace(/\.(jpg|jpeg|png)$/i,"");



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
"Sai format tên file"
);

return;

}





document
.getElementById("title")
.innerHTML =

`

${currentExam.book}

-

Test ${currentExam.test}

<br>

Câu ${currentExam.start}
-
${currentExam.end}

`;





document
.getElementById("questionImage")
.src =
file.url;




renderQuestions();




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

<div class="question">


<div class="number">

${i}

</div>


<div class="option">

<input
type="radio"
name="q${i}"
value="A">

A

</div>



<div class="option">

<input
type="radio"
name="q${i}"
value="B">

B

</div>



<div class="option">

<input
type="radio"
name="q${i}"
value="C">

C

</div>



<div class="option">

<input
type="radio"
name="q${i}"
value="D">

D

</div>


</div>


`;



}




}








document
.getElementById("checkBtn")
.onclick=function(){



let score=0;


let total =
currentExam.answers.length;



for(
let i=0;
i<total;
i++
){



let q =
currentExam.start+i;



let answer =

document.querySelector(

`input[name="q${q}"]:checked`

);



if(
answer &&
answer.value==
currentExam.answers[i]

)

{


score++;


}




}




document
.getElementById("result")
.innerHTML =

`

Đúng:
${score}/${total}

<br>

${Math.round(score/total*100)}%

`;



};







start();
