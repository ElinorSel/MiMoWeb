const GAMEPLAY_PLAYER_ID = 'youtube-gameplay';

let stateHandler = null;

export function subscribeGameplayVideoState(handler) {
  stateHandler = handler;
  return () => {
    if (stateHandler === handler) {
      stateHandler = null;
    }
  };
}

export function reportGameplayVideoState(playerId, state) {
  if (playerId !== GAMEPLAY_PLAYER_ID) return;
  stateHandler?.(state);
}
