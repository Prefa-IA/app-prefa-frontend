import React from 'react';

export const useButtonCooldown = (cooldownMs: number = 1500) => {
  const [cooldown, setCooldown] = React.useState(false);
  
  const handleClick = React.useCallback((callback: () => void, isDisabled: boolean = false) => {
    if (cooldown || isDisabled) return;
    setCooldown(true);
    callback();
    setTimeout(() => setCooldown(false), cooldownMs);
  }, [cooldown, cooldownMs]);
  
  return { cooldown, handleClick };
};

