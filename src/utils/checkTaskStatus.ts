export const checkTaskStatus = (value: number) => {
    if (value === 0) {
        return 'Сделать'
    }
    else if (value === 1) {
        return 'Сделано'
    }
    else if (value === 2) {
        return 'Готово'
    } else {
        return 'Сделать'
    }
}