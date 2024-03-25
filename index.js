const apiUrl = 'https://crudcrud.com/api/37f58675d3744125918e7fce9458b32e/bookings'; 

function fetchBookingsAndUpdateUI() {
    axios.get(apiUrl)
        .then(response => {
            const data = response.data;
            const bookingList = document.getElementById('bookingList');
            bookingList.innerHTML = '';
            data.forEach(booking => {
                const li = document.createElement('li');
                li.textContent = `Seat ${booking.seatNumber}: ${booking.username}`;
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.onclick = () => editBooking(booking._id, booking.username, booking.seatNumber);
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteBooking(booking._id);
                li.appendChild(editButton);
                li.appendChild(deleteButton);
                bookingList.appendChild(li);
            });
            document.getElementById('totalBookings').textContent = data.length;
        })
        .catch(error => console.error('Error fetching bookings:', error));
}

function addBooking(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const seatNumber = parseInt(document.getElementById('seatNumber').value);
    axios.post(apiUrl, { username, seatNumber })
        .then(() => {
            fetchBookingsAndUpdateUI();
            document.getElementById('username').value = '';
            document.getElementById('seatNumber').value = '';
        })
        .catch(error => console.error('Error adding booking:', error));
}

function deleteBooking(id) {
    axios.delete(`${apiUrl}/${id}`)
        .then(() => fetchBookingsAndUpdateUI())
        .catch(error => console.error('Error deleting booking:', error));
}

function editBooking(id, username, seatNumber) {
    const newUsername = prompt('Enter new username:', username);
    if (newUsername === null) return; //user cancels the prompt
    const newSeatNumber = parseInt(prompt('Enter new seat number:', seatNumber));
    if (isNaN(newSeatNumber) || newSeatNumber <= 0) {
        alert('Invalid seat number');
        return;
    }
    axios.put(`${apiUrl}/${id}`, { username: newUsername, seatNumber: newSeatNumber })
        .then(() => fetchBookingsAndUpdateUI())
        .catch(error => console.error('Error editing booking:', error));
}

function searchBooking() {
    const searchSeat = parseInt(document.getElementById('searchSeat').value);
    axios.get(apiUrl)
        .then(response => {
            const booking = response.data.find(booking => booking.seatNumber === searchSeat);
            const searchResult = document.getElementById('searchResult');
            if (booking) {
                searchResult.textContent = `Booking found for Seat ${booking.seatNumber}: ${booking.username}`;
            } else {
                searchResult.textContent = `No booking found for Seat ${searchSeat}`;
            }
        })
        .catch(error => console.error('Error searching booking:', error));
}

document.getElementById('bookingForm').addEventListener('submit', addBooking);

window.onload = fetchBookingsAndUpdateUI;