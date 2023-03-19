import { APP_COLORS } from "../constants/colors"

export const checkTaskColor = (value: number) => {
    if (value === 0) {
        return APP_COLORS.GRAY
    }
    else if (value === 1) {
        return APP_COLORS.BLUE
    }
    else if (value === 2) {
        return APP_COLORS.GREEN
    } else {
        return APP_COLORS.GRAY
    }
}