import api from './api';

export const AppointmentService = {
    // Fetch all active quests for the user
    getAppointments: async (userId) => {
        try {
            const response = await api.get(`/appointments/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('FAILED TO LOAD QUESTS:', error);
            throw error;
        }
    },

    // Request a new vet visit
    bookAppointment: async (appointmentData) => {
        try {
            console.log('/// TRANSMITTING NEW QUEST DATA ///');
            const response = await api.post('/appointments/book', appointmentData);
            return response.data;
        } catch (error) {
            console.error('QUEST BOOKING FAILED:', error);
            throw error;
        }
    }
};