export class UtilService {
    public static getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    public static generateUniqueId() {
        return Math.random().toString(36).substring(2);
    }
}