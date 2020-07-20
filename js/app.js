//Book Class: Represents a Book

class book{
    constructor(title, author, isbn){
        this.title=title;
        this.author=author;
        this.isbn=isbn;
    }
}

//UI class: Handle UI Tasks
class UI{
    static displayBooks(){
        /*let storedBooks=[
            {
                title:'Book 1',
                author: 'John Doe',
                isbn: '34521687'
            },
            {
                title:'Book 2',
                author: 'John Doe',
                isbn: '65412578'
            }
        ]
        var books=storedBooks;*/
        var books=Store.getBooks();        
        books.forEach((book)=>{
            UI.addBookToList(book);
        });
    }
    static addBookToList(book){
        const list=document.querySelector('#book-list');
        const row= document.createElement('tr');
        row.innerHTML=`            
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn-sm btn-delete">Delete</a>
            <a href="#" class="btn-sm btn-edit">Edit</a>
            </td>
        `;
        list.appendChild(row);


    }

    static EditBookToList(){
        var books=Store.getBooks();  
        books.forEach((book)=>{
            const list=document.querySelector('#book-list');
            const row= document.createElement('tr');
            row.innerHTML=`            
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td><a href="#" class="btn-sm btn-delete">Delete</a>
                <a href="#" class="btn-sm btn-edit">Edit</a>
                </td>
            `;
            list.appendChild(row);
        });
    }



    static clearFields(){
        document.querySelector('#title').value='';
        document.querySelector('#author').value='';
        document.querySelector('#isbn').value='';
    }
    static showAlert(message, classname){
        const div=document.createElement('div');
        div.className=`alert alert-${classname}`;
        div.appendChild(document.createTextNode(message));
        const container=document.querySelector('.container');
        const form=document.querySelector('#book-form');
        container.insertBefore(div, form);
        if(classname==='edit'){

        }
        else{
            setTimeout(()=>document.querySelector('.alert').remove(),3000);
        }
        
    }
    
    static removeBook(el){
            el.parentElement.parentElement.remove();
    }
    static EditBook(el){
            const title=el.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
            const author=el.parentElement.previousElementSibling.previousElementSibling.textContent;
            const isbn=el.parentElement.previousElementSibling.textContent;
            document.querySelector('#title').value=title;
            document.querySelector('#author').value=author;
            document.querySelector('#isbn').value=isbn;
            document.querySelector('#isbn').disabled=true;
    }

}

//Store class: Handles Storage

class Store{
    static getBooks(){
        //localstorage only saves to string 
        let books;
        if(localStorage.getItem('books')===null){
            books=[];
        }
        else{
            books=JSON.parse(localStorage.getItem('books'));
        }
        console.log(books);
        return books;
    }
    static addBook(book){
        const books=Store.getBooks();        
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static EditBook(book, isbn){
        const books=Store.getBooks();  
        const table= document.querySelector('.table');
        books.forEach((bookitem, index)=>{
            if(bookitem.isbn===isbn){   
                bookitem.title=book.title;
                bookitem.author=book.author;               
                table.rows[index+1].cells[0].innerHTML=book.title;
                table.rows[index+1].cells[1].innerHTML=book.author;
            }            
        });
        localStorage.setItem('books', JSON.stringify(books));

    }
    static removeBook(isbn){
        const books=Store.getBooks();
        books.forEach((book, index)=>{
            if(book.isbn===isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}





//Event: Display Book
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add Book
//On form submit 
document.querySelector('#book-form').addEventListener('submit',(e)=>
    {
        e.preventDefault();       
        const title=document.querySelector('#title').value;
        const author=document.querySelector('#author').value;
        const isbn=document.querySelector('#isbn').value; 
        if(document.querySelector('.alert')===null){}
        else{document.querySelector('.alert').remove();}       
        if(title==='' || author==='' || isbn ===''){
            UI.showAlert("Please Fill all the fields", "error")
        }
        else{
             //Instatiate book             
            if(document.querySelector('#isbn').disabled){                
                const bookinst=new book(title, author, isbn);
                Store.EditBook(bookinst, isbn);
                UI.clearFields();
                document.querySelector('#isbn').disabled=false;
            }
            else{
                
                const bookinst=new book(title, author, isbn);
                //Add Book to UI    
                UI.addBookToList(bookinst);
                //Add Book to Local Store   
                Store.addBook(bookinst);
                //Clear Fields
                UI.clearFields();
                //Alert Message
                UI.showAlert("Book Added To List", "success")
            }
           
        }
    }
)


//Event: Remove Or Edit a Book
document.querySelector('#book-list').addEventListener('click', (e)=>{
    //Remove book from UI   
    const title= e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    const isbn= e.target.parentElement.previousElementSibling.textContent;
    
    if(e.target.classList.contains('btn-delete')){
        UI.removeBook(e.target);
        Store.removeBook(isbn);
        UI.showAlert(`Removed Book:${title} from the list`, 'success')
    }
    if(e.target.classList.contains('btn-edit')){
        UI.EditBook(e.target);
        UI.showAlert(`Edit Mode`, 'edit')
    }
    
    
    //Remove book from Store    
    
    
})


