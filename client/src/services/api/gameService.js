import * as API from './api.js';

export async function createLocalMultiplayerGame() {
    try {
        const data = await API.fetchWithAuth(`${API.API_BASE_URL}/games/create_local/`, {
            method: 'POST'
        });
        return { success: true, data };
    } catch (error) {
        console.error('Error creating local multiplayer game:', error);
        return { success: false, error };
    }
}
