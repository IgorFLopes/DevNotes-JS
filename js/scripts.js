// Elementos "Selecionar"
const notesContainer = document.querySelector("#notes-container")

const noteInput = document.querySelector("#note-content")

const addNoteBtn = document.querySelector(".add-note")




const searchInput = document.querySelector("#search-input")

const exportBtn = document.querySelector("#export-notes")








// Funções 
function showNotes() {
    cleanNotes()

    getNotes().forEach((note) => {
        const noteElement = createNote(note.id, note.content, note.fixed);

        notesContainer.appendChild(noteElement)
    })
}

// agora vou criar uma função par limpar. essa lista vazia vai fazer com que todas as notas seja excluida da área de exibição. 
function cleanNotes() {
    notesContainer.replaceChildren([])
}


function addNote() {
    // const notes = []
    const notes = getNotes()
    

    // console.log("testeando")
    // vou criar um obejto que exatamente o que eu preciso para minha nota
    const noteObject = {
        // id: 1,
        id: generateId(),
        // content: "",
        content: noteInput.value,
        fixed: false,
    }
    // console.log(noteObject)
    // Vou criar uma nova função para não adicionar a nota na mesma função que cria o elemento.(Separando a responsabilidade)

    const noteElement = createNote(noteObject.id, noteObject.content)

    notesContainer.appendChild(noteElement)

    notes.push(noteObject)

    // Agora vou criar uma nova função "Save Notes"
    saveNotes(notes)

    // agora vou fazer outra função para limpar o campo de input
    noteInput.value = "";

}

// como o Id não pode se repedir, vou criar uma função para ele não se repetir

function generateId() {
    return Math.floor(Math.random() * 5000)
}

// Agora finalizando a função "createNote"

function createNote(id, content, fixed) {
// aqui vamos criar um elemento no DOM
    // criei a div
    const element = document.createElement("div")
    // adicionei a classe
    element.classList.add("note")

    const textarea = document.createElement("textarea")

    textarea.value = content

    textarea.placeholder = "Adicione algum texto..."
    // agora abaixo vou adicionar a minha text área ao meu elemento.

    element.appendChild(textarea)

    const pinIcon = document.createElement("i")

    pinIcon.classList.add(...["bi", "bi-pin"])

    element.appendChild(pinIcon)

    const deleteIcon = document.createElement("i")

    deleteIcon.classList.add(...["bi", "bi-x-lg"])

    element.appendChild(deleteIcon)

    const duplicateIcon = document.createElement("i")

    duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"])

    element.appendChild(duplicateIcon)

    if(fixed) {
        element.classList.add("fixed")
    }

    // Eventos do Elemento
    // Vai ter a função de fixar ou "desafixar" as notas

    // "keyup" o que usuário digitou por ultimo
    element.querySelector("textarea").addEventListener("keyup", (e) => {

        const noteContent = e.target.value

        updateNote(id, noteContent)

    })



    element.querySelector(".bi-pin").addEventListener("click", () => {
        toggleFixNote(id)
    })

    // Função para deletar

    element.querySelector(".bi-x-lg").addEventListener("click", () => {
        deleteNote(id, element)
    })

    // Função para copiar 
    element.querySelector(".bi-file-earmark-plus").addEventListener("click", () => {
        copyNote(id)
    })


    return element;
}

// Criando função de delete note, para deletar as notas. 

function deleteNote(id, element) {

    const notes = getNotes().filter((note) => note.id !== id)

    saveNotes(notes)

    notesContainer.removeChild(element)
}

// função para copiar notes .. 

function copyNote(id) {


    const notes = getNotes()

    const targetNote = notes.filter((note) => note.id === id)[0]

    const noteObject = {
        id: generateId(),
        content: targetNote.content,
        fixed: false,
    }

    const noteElement = createNote(noteObject.id, noteObject.content, noteObject.fixed)

    notesContainer.appendChild(noteElement)
    // adicionando no local storege

    notes.push(noteObject)

    saveNotes(notes)

}


function toggleFixNote(id) {
    const notes = getNotes()

    const targetNote = notes.filter((note) => note.id === id) [0]

    targetNote.fixed = !targetNote.fixed;

    // console.log(notes)
    saveNotes(notes)

    showNotes()


}

function updateNote(id, newContent) {

    const notes = getNotes()

    const targetNote = notes.filter((note) => note.id === id)[0]

    targetNote.content = newContent

    saveNotes(notes)

}

// Agora vou criar uma função que vai salvar notas no local storage
// vou criar uma constante chamada "notes = [] LÁ EM CIMA, ABAIXO DA FUNÇÃO "addNote()"

// Local storage , função para não substituir e acrescentar! 
function getNotes() {
    const notes = JSON.parse(localStorage.getItem("notes") || "[]")

    const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 :1))


    return orderedNotes;
}

function saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes))
}


// Função para filtrar!

function searchNotes(search) {
    const searchResults = getNotes().filter((note) => 
        note.content.includes(search)
    )


    if(search !== "") {
      cleanNotes()

        searchResults.forEach((note) => {
            const noteElement = createNote(note.id, note.content)
            notesContainer.appendChild(noteElement)
        });

        return;
    }

    cleanNotes()
    showNotes()
}

function exportData() {

    const notes = getNotes()

    // separa o dado por "," quebra a linha \n (padrão CSV)  "temos também que declarar o nome das colunas"

    const csvString = [
        ["ID", "Contéudo", "Fixado?"],
        ...notes.map((note) => [note.id, note.content, note.fixed])
    ]
        .map((e) => e.join(","))
        .join("\n")


    // criar um elemento descartavel para adicionar um link
    const element = document.createElement("a")
    element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString)

    element.target = "_blank"

    element.download = "notes.csv"

    element.click()

}



// Eventos
addNoteBtn.addEventListener("click", () => addNote())

// evento para filtrar! 
searchInput.addEventListener("keyup", (e) => {

    const search = e.target.value
    searchNotes(search)

})


// Evento para criar notas quando eu aperto o ENTER do teclado.

noteInput.addEventListener("keydown", (e) => {

    if(e.key === "Enter") {
        addNote()
    }

})

// Evento de exportar o CSV 

exportBtn.addEventListener("click", () => {

    exportData()

})

// Inicialização 
showNotes()

