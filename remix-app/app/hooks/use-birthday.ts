import { useEffect, useState } from "react";

export function useBirthday(birthday: Date) {
  const [progress, setProgress] = useState(0);
  const [age, setAge] = useState(0);
  const [nextBirthday, setNextBirthday] = useState(new Date(0));

  useEffect(() => {
    const updateBirthdayInfo = () => {
      const today = new Date();

      const nextBirthdayTemp = new Date(
        today.getFullYear(),
        birthday.getMonth(),
        birthday.getDate()
      );

      if (nextBirthdayTemp < today) {
        nextBirthdayTemp.setFullYear(today.getFullYear() + 1);
      }

      setNextBirthday(nextBirthdayTemp);

      const previousBirthday = new Date(
        nextBirthday.getFullYear() - 1,
        birthday.getMonth(),
        birthday.getDate()
      );

      const totalMS = nextBirthday.getTime() - previousBirthday.getTime();
      const elapsedMS = today.getTime() - previousBirthday.getTime();

      setProgress((elapsedMS / totalMS) * 100);

      setAge(nextBirthday.getFullYear() - birthday.getFullYear() - 1);
    };

    const id = setInterval(updateBirthdayInfo, 100);
    updateBirthdayInfo();
    return () => clearInterval(id);
  }, [birthday]);

  return { progress, age, nextBirthday };
}
