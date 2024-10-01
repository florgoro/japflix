let movies = []

function gettingMovies() {
    fetch(" https://japceibal.github.io/japflix_api/movies-data.json")
    .then (response => {
        if(!response.ok) {
            throw new Error("Error al cargar los datos" + response.statusText)
        }
        return response.json();
    })
    .then(data => {
        movies = data;
    })
    .catch(error => {
        console.error('Error:', error);
    }); 
}

function searchMovies() {
    let search = document.getElementById("inputBuscar").value.toLowerCase();
    let list = document.getElementById("lista");
    list.innerHTML = "";

    if(search){
        let results = movies.filter(movie => {
            return (
                movie.title.toLowerCase().includes(search) ||
                (Array.isArray(movie.genres) && movie.genres.some(genre => typeof genre === 'string' && genre.toLowerCase().includes(search))) ||
                (movie.tagline && movie.tagline.toLowerCase().includes(search)) ||
                (movie.overview && movie.overview.toLowerCase().includes(search))
            );
        });

        if(results.length > 0){
            results.forEach(movie => {
                let star = '★'.repeat(Math.round(movie.vote_average));
                list.innerHTML += `
                <li class="list-group-item" onclick="movieDetails(${movie.id})">
                <h5>${movie.title}</h5>
                <p>${movie.tagline}</p>
                <p class="stars">${star}</p>
                </li>
                `;
            });
        } else {
            list.innerHTML = '<li class="list-group-item">Lo siento, no se encontraron películas.</li>';
        }
    }
}
function movieDetails(movieId) {
    let movie = movies.find(m => m.id === movieId);
    if (movie) {
        document.getElementById("titleDetail").innerText = movie.title;
        document.getElementById("overviewDetail").innerText = movie.overview;

        let genresDetail = document.getElementById("genresDetail");
        genresDetail.innerHTML = ""; 
            movie.genres.forEach(genre => {
                genresDetail.innerHTML += `<li class="list-group-item">${genre.name}</li>`;
            });

            let year = new Date(movie.release_date).getFullYear();
            let runtime = movie.runtime  ? `${movie.runtime} mins`: "Not avalible";
            let budget = movie.budget ? `$${movie.budget.toLocaleString()}`: "Not avalible";
            let revenue = movie.revenue ? `$${movie.revenue.toLocaleString()}`: "Not avalible";

            document.getElementById("yearDtl").innerText = `Year: ${year}`;
            document.getElementById("runtimeDtl").innerText = `Runtime: ${runtime}`;
            document.getElementById("budgetDtl").innerText = `Budget: ${budget}`;
            document.getElementById("revenueDtl").innerText = `Revenue: ${revenue}`;

        let offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasTop'));
        offcanvas.show();
    }
}


document.addEventListener("DOMContentLoaded", gettingMovies);
document.getElementById("btnBuscar").addEventListener("click", searchMovies);
