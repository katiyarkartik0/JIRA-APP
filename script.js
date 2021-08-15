let addBtn = document.querySelector(".add");
let body = document.querySelector("body");
let grid = document.querySelector(".grid");
let colorArray = ["pink", "green", "blue", "black"];

let deleteMode = false;

let deleteBtn = document.querySelector(".delete");

if(localStorage.getItem("AllTickets")==undefined){
    let allTickets = {};
    allTickets = JSON.stringify(allTickets);
    localStorage.setItem("AllTickets", allTickets);
}
deleteBtn.addEventListener("click", function(e){
    if(e.currentTarget.classList.contains("delete-selected")){
        e.currentTarget.classList.remove("delete-selected");
        deleteMode=false;
    }
    else{
        e.currentTarget.classList.add("delete-selected");
        deleteMode = true;
    }
})

let allFiltersChildren = document.querySelectorAll(".filter div");
for(let i =0; i<allFiltersChildren.length; i++){


    allFiltersChildren[i].addEventListener("click", function(e){
      
        let filterColor = e.currentTarget.classList[0];
        loadTask(filterColor);
        if(e.currentTarget.classList.contains("delete-selected")){
            e.currentTarget.classList.remove("delete-selected");
            
        }
        else{
            e.currentTarget.classList.add("delete-selected");
            loadTask();
        }         
    })
   

}


addBtn.addEventListener("click", function () {
    if(deleteMode==true){
        deleteBtn.classList.remove("delete-selected");
        deleteMode=false;
    }

    let div = document.createElement("div");

    div.classList.add("modal");

    div.innerHTML = `<div class ="task-section">
    <div class="task-inner-container" contenteditable="true"></div>
</div>
<div class = "modal-priority-section">
    <div class="priority-inner-container">
     <div class="modal-priority pink"></div>
     <div class="modal-priority green"></div>
     <div class="modal-priority blue"></div>
     <div class="modal-priority black"></div>
    </div>
</div>`;

    let ticketColor = "black";



    let allModalPriority = div.querySelectorAll(".modal-priority");

    let preModal = document.querySelector(".modal");

    if(preModal != null){
        return;
    }

    for (let i = 0; i < allModalPriority.length; i++) {
       
        allModalPriority[i].addEventListener("click", function (e) {

            for (let j = 0; j < allModalPriority.length; j++) {
                allModalPriority[j].classList.remove("selected");
            }

            e.currentTarget.classList.add("selected");

            ticketColor = e.currentTarget.classList[1];
        });
    }


    var uid = new ShortUniqueId();
    

    let taskInnerContainer = div.querySelector(".task-inner-container");
    taskInnerContainer.addEventListener("keydown", function(e){
        if(e.key == "Enter"){
            let id = uid();
            let task = e.currentTarget.innerText;

            // STEP 1- Bring whatever the data present in local storage
            let allTickets = JSON.parse(localStorage.getItem("AllTickets"))
            // STEP 2- Update that
            let ticketObj = {
                color: ticketColor,
                taskValue : task
            }

            allTickets[id] = ticketObj;
            // STEP 3- Save the updated object back to localStorage
            localStorage.setItem("AllTickets", JSON.stringify(allTickets));



            let ticketDiv = document.createElement("div");
            ticketDiv.classList.add("ticket");

            ticketDiv.setAttribute("data-id", id)

            ticketDiv.innerHTML = `
            <div data-id = "${id}" class = "ticket-color ${ticketColor}"></div>
            <div class = "ticket-id">#${id}</div>
            <div data-id = "${id}" class = "actual-task" contenteditable = "true">${task}</div>`;
            
            let actualTaskDiv = ticketDiv.querySelector(".actual-task");
            actualTaskDiv.addEventListener("input", function(e){
                let updatedTask = e.currentTarget.innerText;
                let currTicketId = e.currentTarget.getAttribute("data-id");
                //STEP 1 - Bring whatever the data
                let allTickets = JSON.parse(localStorage.getItem("AllTickets")); 
                //STEP 2 - Update 
                allTickets[currTicketId].taskValue=updatedTask;
                //STEP 3 - Send it back and save
                localStorage.setItem("AllTickets", JSON.stringify(allTickets));

            })





            let ticketColorDiv = ticketDiv.querySelector(".ticket-color");
            ticketDiv.addEventListener("click", function(e){
                if(deleteMode==true){
                    e.currentTarget.remove();
                    let currTicketId = e.currentTarget.getAttribute("data-id");
                    //STEP 1 - Bring whatever the data
                    let allTickets = JSON.parse(localStorage.getItem("AllTickets")); 
                    //STEP 2 - Update 
                    delete allTickets[currTicketId];
                    //STEP 3 - Send it back and save
                    localStorage.setItem("AllTickets", JSON.stringify(allTickets));                
                }
            })

            ticketColorDiv.addEventListener("click", function(e){
                let currTicketId = e.currentTarget.getAttribute("data-id");


                let currColor = e.currentTarget.classList[1];

                let index = -1;
                for(let i = 0; i<colorArray.length; i++){
                    if(colorArray[i] == currColor){
                        index = i;
                    }

                }
                index++;
                index = index%4;

                let newColor = colorArray[index];

                ticketColorDiv.classList.remove(currColor);
                ticketColorDiv.classList.add(newColor);

                //STEP 1 - Bring whatever the data
                let allTickets = JSON.parse(localStorage.getItem("AllTickets")); 
                //STEP 2 - Update 
                allTickets[currTicketId].color=newColor;
                //STEP 3 - Send it back and save
                localStorage.setItem("AllTickets", JSON.stringify(allTickets));
            })
            grid.append(ticketDiv);
            div.remove();

            

 

        }
        else if(e.key =="Escape"){
            div.remove()
        }
    });
    

    body.append(div);
});



`TASK - We would like to get our data loaded back where we left it i.e.,
after we refresh or reload`
//for that we have loadTask

function loadTask(color){



    //1- fetch allTickets data
    let allTickets = JSON.parse(localStorage.getItem("AllTickets"))
    //2- create ticket UI for each ticket obj
    for(x in allTickets){
        let currTicketId = x;
        let singleTicketObj = allTickets[x];

        if(color != singleTicketObj.color){
            continue;
        }    

        let ticketDiv = document.createElement("div");
        ticketDiv.classList.add("ticket");
    
        ticketDiv.setAttribute("data-id", currTicketId);
    
        ticketDiv.innerHTML = `
        <div data-id = "${currTicketId}" class = "ticket-color ${singleTicketObj.color}"></div>
        <div class = "ticket-id">#${currTicketId}</div>
        <div data-id = "${currTicketId}" class = "actual-task" contenteditable = "true">${singleTicketObj.taskValue}</div>`;    
        //3- attach required listeners
        let ticketColorDiv = ticketDiv.querySelector(".ticket-color");
        let actualTaskDiv = ticketDiv.querySelector(".actual-task");
        actualTaskDiv.addEventListener("input", function(e){
            let updatedTask = e.currentTarget.innerText;
            let currTicketId = e.currentTarget.getAttribute("data-id");
            //STEP 1 - Bring whatever the data
            let allTickets = JSON.parse(localStorage.getItem("AllTickets")); 
            //STEP 2 - Update 
            allTickets[currTicketId].taskValue=updatedTask;
            //STEP 3 - Send it back and save
            localStorage.setItem("AllTickets", JSON.stringify(allTickets));
    
        })    
        ticketColorDiv.addEventListener("click", function(e){
            let currTicketId = e.currentTarget.getAttribute("data-id");
    
    
            let currColor = e.currentTarget.classList[1];
    
            let index = -1;
            for(let i = 0; i<colorArray.length; i++){
                if(colorArray[i] == currColor){
                    index = i;
                }
    
            }
            index++;
            index = index%4;
    
            let newColor = colorArray[index];
    
            ticketColorDiv.classList.remove(currColor);
            ticketColorDiv.classList.add(newColor);
    
            //STEP 1 - Bring whatever the data
            let allTickets = JSON.parse(localStorage.getItem("AllTickets")); 
            //STEP 2 - Update 
            allTickets[currTicketId].color=newColor;
            //STEP 3 - Send it back and save
            localStorage.setItem("AllTickets", JSON.stringify(allTickets));
        })    
        ticketDiv.addEventListener("click", function(e){
            if(deleteMode==true){
                e.currentTarget.remove();
                let currTicketId = e.currentTarget.getAttribute("data-id");
                //STEP 1 - Bring whatever the data
                let allTickets = JSON.parse(localStorage.getItem("AllTickets")); 
                //STEP 2 - Update 
                delete allTickets[currTicketId];
                //STEP 3 - Send it back and save
                localStorage.setItem("AllTickets", JSON.stringify(allTickets));                
            }
        })    
        
        
        //4- add tickets in the grid section of ui
        grid.append(ticketDiv);
    }

}
