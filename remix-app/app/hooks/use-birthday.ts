import { useEffect, useState } from "react";

export function useBirthday(birthday: Date) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [age, setAge] = useState(0);
  const [nextBirthday, setNextBirthday] = useState(new Date(0));

  useEffect(() => {
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
      nextBirthdayTemp.getFullYear() - 1,
      birthday.getMonth(),
      birthday.getDate()
    );

    const totalMS = nextBirthdayTemp.getTime() - previousBirthday.getTime();
    const elapsedMS = today.getTime() - previousBirthday.getTime();

    setProgress((elapsedMS / totalMS) * 100);

    setAge(nextBirthdayTemp.getFullYear() - birthday.getFullYear() - 1);

    setIsLoading(false);
  }, []);

  return { progress, age, nextBirthday, isLoading };
}
