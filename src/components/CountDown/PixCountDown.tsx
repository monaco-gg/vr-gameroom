import { Progress } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';

const PixCountdown: React.FC = () => {
    const [time, setTime] = useState(300); // 300 segundos = 5 minutos

    useEffect(() => {
        if (time > 0) {
            const timerId = setInterval(() => {
                setTime(time - 1);
            }, 1000);

            return () => clearInterval(timerId); // Cleanup do intervalo
        }
    }, [time]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className=" items-center justify-center my-4">
            <div className="text-white text-6xl font-bold">
                {formatTime(time)}
            </div>
            <div className='flex my-4'>
                <Progress aria-label="Contagem..." value={time / 3} className="max-w-md" />
            </div>

        </div>
    );
};

export default PixCountdown;
