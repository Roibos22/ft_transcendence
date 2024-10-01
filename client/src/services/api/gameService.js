import * as API from './api.js';

export async function createSinglePlayerGame() {
    try {
        const data = await API.fetchWithAuth(`${API.API_BASE_URL}/game/singleplayer/create/`, {
            method: 'POST'
        });
        return { success: true, data };
    } catch (error) {
        console.error('Error creating single player game:', error);
        return { success: false, error };
    }
}