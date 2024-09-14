## List of Possible Actions

### Message

Description:

Send a chat message to all players in the game session.

Required Fields:

content: (string) The text content of your message.
Example:

```json
{
"action": "message",
"content": "Hello, everyone!"
}
```

### Get_state

Description:

Request the current state of the game.
Required Fields:

None.
Example:

```json
{
  "action": "get_state"
}
```

### Player_ready

Description:

Indicate that you are ready to start the game.

Required Fields:

None.

Example:
```json
{
  "action": "player_ready"
}
```

### Move_player

Description:

Move your player in a specified direction.

Required Fields: None

direction:

(from -1 to 1)
(integer)

Represents the direction to move. The mapping of integers to directions should align with your game's logic.

Example:

```json
{
  "action": "move_player",
  "direction": 1
}
```
