import CustomObject3D from "./CustomObject3D";

export default class Moon extends CustomObject3D {
    public castShadow: boolean = true;

    static async create(): Promise<Moon> {
        return new Moon().create();
    }
}
