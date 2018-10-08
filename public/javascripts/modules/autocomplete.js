function autocomplete(input, latInput, lngInput) {
    if (!input) reutrn; // Skip this fn from running if there is not input on the page
    const dropdown = new google.maps.places.Autocomplete(input);

    dropdown.addListener('place_changed', () => {
        const place = dropdown.getPlace();
        latInput.value = place.geometry.location.lat();
        lngInput.value = place.geometry.location.lng();
    });

    // If someone hits enter on the address field, don't submit the form
    input.on('keydown', (event) => {
        if (event.keyCode === 13) event.preventDefault();
    });

}

export default autocomplete;