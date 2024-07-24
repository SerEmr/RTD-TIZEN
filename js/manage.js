document.addEventListener('DOMContentLoaded', function() {
    const reminderList = document.getElementById('reminderList');
    displayReminders();

    function displayReminders() {
        let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        reminderList.innerHTML = '';
        reminders.forEach((reminder, index) => {
            const li = document.createElement('li');
            li.textContent = `${reminder.title} - ${reminder.description} - ${reminder.date} ${reminder.time}`;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', () => {
                deleteReminder(index);
                alert(`Recordatorio eliminado: ${reminder.title} - ${reminder.description}`);
            });
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.addEventListener('click', () => {
                editReminder(index, reminder);
                alert(`Editando recordatorio: ${reminder.title} - ${reminder.description}`);
            });
            li.appendChild(editButton);
            li.appendChild(deleteButton);
            reminderList.appendChild(li);
            scheduleReminder(reminder);
        });
    }

    function deleteReminder(index) {
        let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        reminders.splice(index, 1);
        localStorage.setItem('reminders', JSON.stringify(reminders));
        displayReminders();
    }

    function editReminder(index, reminder) {
        localStorage.setItem('editIndex', index);
        localStorage.setItem('editReminder', JSON.stringify(reminder));
        window.location.href = 'index.html';
    }

    function scheduleReminder(reminder) {
        const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
        const now = new Date();
        if (reminderDateTime <= now) {
            return;
        }

        const notificationDict = {
            content: reminder.description,
            iconPath: '', // Añadir un ícono si lo deseas
            soundPath: '', // Añadir un sonido si lo deseas
            vibration: true
        };

        const notification = new tizen.UserNotification('SIMPLE', reminder.title, notificationDict);

        const timeToReminder = reminderDateTime - now;
        setTimeout(() => {
            tizen.notification.post(notification);
            alert(`Recordatorio: ${reminder.title} - ${reminder.description}`);
        }, timeToReminder);
    }
});
