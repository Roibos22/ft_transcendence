# Project

## To-do

1. Implement adding friends
2. Add user active check on login

3. limit CORS origins
4. setup email

## Basic information

Layers:

- Users: Manages user profiles and authentication.
- Games: Manages game data and logic.
- Core: Handles global utilities and settings.
- API: Manages API endpoints (if needed).

## Layers cross-relation

### The cross-relations between your layers in the online minigame app can be summarized as follows

- Users <-> Core: The Core layer provides global utilities and settings that are used for user authentication and profile management. It may also handle settings related to user sessions.

- Games <-> Core: The Games layer relies on the Core layer for utilities and settings needed to manage game data, such as configuration, logging, or common game rules.

- Users <-> Games: The Users layer interacts with the Games layer to associate game data with specific user profiles, such as tracking scores, progress, or game history.

- API <-> Users/Games: The API layer exposes endpoints for external interactions, enabling clients to manage user profiles, authenticate, or interact with game data. It communicates with both the Users and Games layers to fulfill API requests.

- API <-> Core: The API layer may utilize Core utilities and settings for tasks like logging, error handling, or configuring API behavior.

## Notes

- Online status update
