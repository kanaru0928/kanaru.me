import {
  addDays,
  addHours,
  addMinutes,
  addYears,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  differenceInYears,
} from "date-fns";
import { useEffect, useState } from "react";

interface ElapsedTime {
  age: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** その年齢での経過割合（0 以上 1 未満） */
  progress: number;
}

function getAge(birthday: Date, now: Date) {
  return differenceInYears(now, birthday);
}

function getProgress(birthday: Date, now: Date) {
  const age = getAge(birthday, now);
  const lastBirthday = addYears(birthday, age);
  const nextBirthday = addYears(birthday, age + 1);

  return (
    (now.getTime() - lastBirthday.getTime()) /
    (nextBirthday.getTime() - lastBirthday.getTime())
  );
}

/**
 * 誕生日から見た `now` 時点の年齢・経過時間・経過割合を計算する
 */
export function getElapsedTime(birthday: Date, now: Date): ElapsedTime {
  const age = getAge(birthday, now);
  const lastBirthday = addYears(birthday, age);
  const days = differenceInDays(now, lastBirthday);
  const afterDays = addDays(lastBirthday, days);
  const hours = differenceInHours(now, afterDays);
  const afterHours = addHours(afterDays, hours);
  const minutes = differenceInMinutes(now, afterHours);
  const afterMinutes = addMinutes(afterHours, minutes);
  const seconds = differenceInSeconds(now, afterMinutes);
  const progress = getProgress(birthday, now);

  return { age, days, hours, minutes, seconds, progress };
}

/**
 * 誕生日からの年齢と、その年齢になってからの経過時間（日・時・分・秒の内訳）・経過割合を返すカスタムフック
 *
 * - `intervalSeconds` 秒ごとに経過時間を再計算する
 * - SSR とのハイドレーション不一致を避けるため、マウント前の `elapsedTime` は `null` になる
 */
export function useBirthday(birthday: Date, intervalSeconds = 1) {
  const [elapsedTime, setElapsedTime] = useState<ElapsedTime | null>(null);

  // 呼び出し側で毎レンダー new Date() されても effect が再実行されないよう、数値で依存させる
  const birthdayTime = birthday.getTime();

  useEffect(() => {
    const update = () =>
      setElapsedTime(getElapsedTime(new Date(birthdayTime), new Date()));

    update();
    const intervalId = setInterval(update, intervalSeconds * 1000);

    return () => clearInterval(intervalId);
  }, [birthdayTime, intervalSeconds]);

  return { elapsedTime };
}
