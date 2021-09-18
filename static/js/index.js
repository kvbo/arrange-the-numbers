'use strict'

let board = document.querySelector('.board')
let levelBtn = document.querySelector('#level')
let loaded = "false"
let dragEl
let checkBtn = document.querySelector('#check') 
let newGameBtn = document.querySelector('#new_game')
let text = document.querySelector('.text')

class GameGenerator{
    constructor(){
        this.generate(3)
        this.set()
    }
    generate(grid){
        

        board.innerHTML = ''
        let order = 1 //order of item in grid board
        this.elms = []  //an array of squares on the board
        this.n = [] //an array of numbers storing values to add to sqaures randomly
        this.max = grid * grid // the max value to set the draggable element

        board.style.gridTemplate =`repeat(${grid}, 1fr) / repeat(${grid}, 1fr)`

        //create board
        for(let i = 1; i <= grid; i++){
            for(let j = 1; j <= grid; j++){
                let el = document.createElement('div')        
                el.className = 'square'
                el.id = `${i}${j}`
                el.draggable = false
                el.style.order = order
                el.dataset.value = `${i}${j}`
                board.appendChild(el)

                new Promise((resolve)=>{
                    el.dataset.value = `${i}${j}`
                    board.appendChild(el)
                    if(el.dataset.value != ""){
                        resolve()
                    }
                }).then(
                    ()=> {
                        el.addEventListener('dragover',(event) => {
                            let t = event.target.dataset.value
                            let c = dragEl.dataset.value
                        
                            let distance =  Math.abs(t-c)
                            if(distance==1 || distance == 10){
                                event.preventDefault();
                            }
                        })

                        el.addEventListener('drop', (event) => {
                            //save draggable save element
                            let lastDragEL = dragEl
                            event.preventDefault();
                        
                            let target = event.target
                            
                            //make the target box draggable and set the last one to false
                            target.draggable = true;
                            lastDragEL.draggable = false;
                            lastDragEL.style.cursor = "default"
                            
                            lastDragEL.style.backgroundColor = "rgb(194, 194, 194)"
                            lastDragEL.innerHTML = target.innerHTML
                            
                            //set the target as the draggable element and style the element 
                            target.innerHTML = ""
                            dragEl = target
                            
                            // dragEl.innerHTML = lastDragEL.innerHTML
                            dragEl.style.cursor = "pointer"
                            dragEl.style.backgroundColor = "#a9a9a9"
                                    
                            }
                        )
                    }
                )

                this.n.push(order)
                this.elms.push(el)
                order++
            }   
        }

    }

    set(){
        let numbers = this.n.slice()

        this.elms.forEach((i) => {
            let r = Math.floor(Math.random() * numbers.length)  

            i.innerHTML = numbers[r]
            i.style.backgroundColor = "rgb(194, 194, 194)"
            if(i.innerHTML == this.max){            
                dragEl = i
                dragEl.draggable = true
                dragEl.innerHTML = ""
                dragEl.style.backgroundColor = "#a9a9a9"
                dragEl.style.cursor = "pointer"
            }

            delete numbers[r]
            numbers = numbers.filter((i) => {
                return i !== undefined;
            });
        })

    }

    checkResult(){
        let val = 0
        
        for(let i = 0; i < this.elms.length - 1; i++){
            
            if(val > this.elms[i].innerHTML){
                return false    
            }

            val = this.elms[i].innerHTML
        }

        return true
    }
}

let p = new GameGenerator()

levelBtn.addEventListener('change', () => {
    let  r = levelBtn.options[levelBtn.selectedIndex].value
    console.log(r)
    p.generate(r)
    p.set()
    text.innerHTML = "Arrange the numbers in ascending order"
})

checkBtn.addEventListener('click', () => {
    if(p.checkResult()){
        text.innerHTML = "You win!!"
    }

    else{
        text.innerHTML = "sorry :( keep trying"
    }
})

newGameBtn.addEventListener('click', () => {
    p.set()
    text.innerHTML = "Arrange the numbers in ascending order"
})
