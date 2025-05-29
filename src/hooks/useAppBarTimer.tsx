import { useState, useLayoutEffect } from 'react';
import { parseISO } from 'date-fns';
import { useTypedSelector } from './useStore.Hooks';
import { selectTokenExpirationTime } from '../redux/statesSlices/auth.state.slice';
import { TimerStatesEnum } from '../components/shared/appBar/constants/constants';
import { calculateTimeLeft, getTimerState } from '../components/shared/appBar/utils/Timer.Utils';

export const useAppBarTimer = () => {
  const [timeLeft, setTimeLeft] = useState('60:00');
  const [timerState, setTimerState] = useState<TimerStatesEnum>(TimerStatesEnum.Normal);
  const tokenExpirationTime = useTypedSelector(selectTokenExpirationTime);

  useLayoutEffect(() => {
    if (!tokenExpirationTime) return;

    const expirationDate = parseISO(tokenExpirationTime);
    const updateTimer = () => {
      const { minutes, formattedTime } = calculateTimeLeft(expirationDate);

      setTimeLeft(formattedTime);
      setTimerState(getTimerState(minutes));
    };

    const timerId = setInterval(updateTimer, 1000);

    return () => clearInterval(timerId);
  }, [tokenExpirationTime]);

  return { timeLeft, timerState };
};
