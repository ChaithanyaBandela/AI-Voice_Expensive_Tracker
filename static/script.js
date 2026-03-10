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

        if(!isNaN(word)){
            amount = word;
        }

        if(word.includes("food") || word.includes("lunch")){
            category = "Food";
        }

        if(word.includes("grocery")){
            category = "Groceries";
        }

        if(word.includes("bill")){
            category = "Bills";
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
</tr>
`;

data.forEach(exp => {

table.innerHTML += `
<tr>
<td>${exp.amount}</td>
<td>${exp.category}</td>
<td>${exp.description}</td>
</tr>
`;

});

});

}

loadExpenses();