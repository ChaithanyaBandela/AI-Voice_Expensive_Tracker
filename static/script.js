const recognition = new webkitSpeechRecognition();

recognition.lang = "en-US";

recognition.onresult = function(event){

    const text = event.results[0][0].transcript;

    document.getElementById("voiceText").innerText = text;

    processExpense(text);
}

function startVoice(){
    recognition.start();
}


function processExpense(text){

    const words = text.split(" ");

    let amount = 0;
    let category = "Other";

    words.forEach(word => {

        word = word.toLowerCase();

if(!isNaN(word)){
amount = word;
}

if(word.includes("food") || word.includes("lunch") || word.includes("dinner") || word.includes("breakfast")){
category = "Food";
}

else if(word.includes("grocery") || word.includes("vegetable") || word.includes("market")){
category = "Groceries";
}

    else if(word.includes("bill") || word.includes("electricity") || word.includes("rent")){
    category = "Bills";
    }

    else if(word.includes("travel") || word.includes("bus") || word.includes("uber")){
    category = "Transport";
    }

    });

    fetch("/add_expense",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({
            amount:amount,
            category:category,
            description:text
        })

    })
    .then(res => res.json())
    .then(data => {

        alert(data.message);

        loadExpenses();

    });

}



function deleteExpense(id){

fetch(`/delete_expense/${id}`,{
method:"DELETE"
})
.then(res => res.json())
.then(data => {

alert(data.message);

loadExpenses();

});

}



function loadExpenses(){

fetch("/get_expenses")

.then(res => res.json())

.then(data => {

const table = document.getElementById("expenseTable");

table.innerHTML = `
<tr>
<th>Amount</th>
<th>Category</th>
<th>Description</th>
<th>Date</th>
<th>Action</th>
</tr>
`;

let categoryTotals = {};

data.forEach(exp => {

table.innerHTML += `
<tr>
<td>${exp.amount}</td>
<td>${exp.category}</td>
<td>${exp.description}</td>
<td>${exp.date}</td>
<td><button onclick="deleteExpense(${exp.id})">Delete</button></td>
</tr>
`;

if(!categoryTotals[exp.category]){
categoryTotals[exp.category] = 0;
}

categoryTotals[exp.category] += parseInt(exp.amount);

});

drawChart(categoryTotals);

});

}



function drawChart(data){

const ctx = document.getElementById("expenseChart");

const labels = Object.keys(data);

const values = Object.values(data);

new Chart(ctx,{
type:'pie',
data:{
labels:labels,
datasets:[{
data:values
}]
}
});

}



loadExpenses();