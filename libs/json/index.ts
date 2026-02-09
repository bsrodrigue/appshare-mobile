export class JSONService {
    public static stringify(data: any): string {
        return JSON.stringify(data, null, 2);
    }
}