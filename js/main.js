document.addEventListener('DOMContentLoaded', function() {

    if (typeof tizen === 'undefined') {
        alert('El objeto tizen no está disponible.');
        return;
    }

    if (typeof tizen.notification === 'undefined') {
        alert('La API de notificaciones de Tizen no está disponible.');
        return;
    }

    const setReminderButton = document.getElementById('setReminderButton');
    setReminderButton.addEventListener('click', setReminder);

    function setReminder() {
        const reminderTitle = document.getElementById('reminderTitle').value;
        const reminderDescription = document.getElementById('reminderDescription').value;
        const reminderDate = document.getElementById('reminderDate').value;
        const reminderTime = document.getElementById('reminderTime').value;

        if (!reminderTitle || !reminderDescription || !reminderDate || !reminderTime) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const [year, month, day] = reminderDate.split('-');
        const [hours, minutes] = reminderTime.split(':');
        const reminderDateTime = new Date(year, month - 1, day, hours, minutes, 0);

        const now = new Date();
        if (reminderDateTime <= now) {
            alert('La fecha y hora del recordatorio deben ser en el futuro.');
            return;
        }

        alert(`Recordatorio configurado para ${reminderDateTime}`);

        // Crear la notificación
        const notificationDict = {
            content: reminderDescription,
            iconPath: '', // Añadir un ícono si lo deseas
            soundPath: '', // Añadir un sonido si lo deseas
            vibration: true
        };

        const notification = new tizen.UserNotification('SIMPLE', reminderTitle, notificationDict);

        // Configurar un temporizador para mostrar la notificación
        const timeToReminder = reminderDateTime - now;
        setTimeout(() => {
            tizen.notification.post(notification);
            alert(`Recordatorio: ${reminderTitle} - ${reminderDescription}`);
        }, timeToReminder);

        if (localStorage.getItem('editIndex') !== null) {
            updateReminder(reminderTitle, reminderDescription, reminderDate, reminderTime);
        } else {
            saveReminder({ title: reminderTitle, description: reminderDescription, date: reminderDate, time: reminderTime });
        }
        
        alert(`Recordatorio guardado: ${reminderTitle} - ${reminderDescription} para ${reminderDate} a las ${reminderTime}`);
    }

    function saveReminder(reminder) {
        let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        reminders.push(reminder);
        localStorage.setItem('reminders', JSON.stringify(reminders));
    }

    function updateReminder(title, description, date, time) {
        let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        const index = localStorage.getItem('editIndex');
        reminders[index] = { title, description, date, time };
        localStorage.setItem('reminders', JSON.stringify(reminders));
        localStorage.removeItem('editIndex');
    }

    // Soporte para edición de recordatorios
    if (localStorage.getItem('editReminder')) {
        const reminder = JSON.parse(localStorage.getItem('editReminder'));
        document.getElementById('reminderTitle').value = reminder.title;
        document.getElementById('reminderDescription').value = reminder.description;
        document.getElementById('reminderDate').value = reminder.date;
        document.getElementById('reminderTime').value = reminder.time;
        localStorage.removeItem('editReminder');
    }
});
