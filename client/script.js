document.getElementById("book-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const theme = document.getElementById("theme").value;

    try {
        // Envoie de la requête POST pour ajouter un livre
        const response = await fetch("/add-book", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, author, theme }),
        });

        if (response.ok) {
            // Réinitialiser le formulaire après succès
            document.getElementById("book-form").reset();
            alert("Book added successfully!");
            loadBooks(); // Recharge la liste des livres
        } else {
            const errorData = await response.json();
            console.error("Error adding book:", errorData.error);
            alert("Failed to add book: " + errorData.error);
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Network error: Unable to add book");
    }
});

async function loadBooks() {
    try {
        // Récupération de la liste des livres
        const res = await fetch("/data");
        const books = await res.json();

        // Vérification de la réponse
        console.log("Books data:", books);  // Ajout de cette ligne pour voir la réponse

        const booksList = document.getElementById("books-list");
        
        // Assurez-vous que books est bien un tableau avant d'utiliser .map()
        if (Array.isArray(books)) {
            booksList.innerHTML = books
                .map(
                    (book) => `<div class="book-item">
                                <strong>${book.title}</strong><br>
                                Author: ${book.author}<br>
                                Theme: ${book.theme}
                            </div>`
                )
                .join("");
        } else {
            booksList.innerHTML = "No books available.";
            console.error("Error: Expected an array but got:", books);
        }
    } catch (error) {
        console.error("Error loading books:", error);
        alert("Error loading books");
    }
}

// Charger la liste des livres au démarrage
loadBooks();
