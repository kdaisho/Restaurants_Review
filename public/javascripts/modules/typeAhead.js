import axios from 'axios';
import dompurify from 'dompurify';

function searchResultsHTML(stores) {
    return stores.map(store => {
        return `
            <a href="/store/${store.slug}" class="search__result">
                <strong>${store.name}</strong>
            </a>
        `;
    }).join('');
}

function typeAhead(search) {
    if (!search) return;

    const searchInput = search.querySelector('input[name="search"]');
    const searchResults = search.querySelector('.search__results');

    // *on is from the module called bling
    searchInput.on('input', function() {
        // If there is no value, quit it!
        if (!this.value) {
            searchResults.style.display = 'none';
            return; // Stop!
        }
        // Show the search results!
        searchResults.style.display = 'block';

        axios
            .get(`/api/search?q=${this.value}`)
            .then(res => {
                if (res.data.length) {
                    searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data));
                    return;
                }
                // Tell them nothing came back
                searchResults.innerHTML = dompurify.sanitize(`<div class="search__result">No results for ${this.value} found!</div>`);
            })
            .catch(error => {
                console.error(error);
            });
    });

    // Handle keyboard inputs
    searchInput.on('keyup', (event) => {
        // If they aren't pressing up, down or enter, who cares!
        if (![38, 40, 13].includes(event.keyCode)) {
            return;
        }
        const activeClass = 'search__result--active';
        const current = search.querySelector(`.${activeClass}`);
        const items = search.querySelectorAll('.search__result');
        let next;
        if (event.keyCode === 40 && current) {
            next = current.nextElementSibling || items[0];
        }
        else if (event.keyCode === 40) {
            next = items[0];
        }
        else if (event.keyCode === 38 && current) {
            next = current.previousElementSibling || items[items.length - 1];
        }
        else if (event.keyCode === 38) {
            next = items[items.length - 1];
        }
        else if (event.keyCode === 13 && current.href) {
            window.location = current.href;
            return;
        }

        if (current) {
            current.classList.remove(activeClass);
        }
        console.log(next);
        next.classList.add(activeClass);
    });
}



export default typeAhead;