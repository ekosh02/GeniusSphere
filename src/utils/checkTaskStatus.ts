import { strings } from "../languages/languages"

export const checkTaskStatus = (value: number) => {
    if (value === 0) {
        return strings.Сделать
    }
    else if (value === 1) {
        return  strings.Сделано
    }
    else if (value === 2) {
        return  strings.Готово
    } else {
        return  strings.Сделать
    }
}