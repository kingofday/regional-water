import { useEffect, useRef, useState } from 'react';
interface CountDownProps {
    minutes: number;
    seconds: number;
    done: () => void
}
const CountDown = (props: CountDownProps) => {
    const iv = useRef<NodeJS.Timer | null>(null);
    const [state, setState] = useState({
        minutes: props.minutes,
        seconds: props.seconds
    });
    useEffect(() => {
        iv.current = setTimeout(() => {
            setState((s) => {
                if (s.seconds === 0) {
                    if (s.minutes === 0) {
                        props.done();
                        return s;
                    }
                    return {
                        seconds: 59,
                        minutes: s.minutes - 1
                    }
                }
                return {
                    minutes: s.minutes,
                    seconds: s.seconds - 1
                }
            });
        }, 1000);
    }, [state]);
    useEffect(() => {
        return () => {
            if (iv.current) clearTimeout(iv.current);
        }
    }, [])
    return (
        <span className='count-down'>
            {props.minutes === 0 && props.seconds === 0 ? null : <>{state.minutes}:{state.seconds < 10 ? `0${state.seconds}` : state.seconds}</>}
        </span>
    )
}
export default CountDown;